/*
* Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.
*
* https://www.mall4j.com/
*
* 未经允许，不可做商业用途！
*
* 版权所有，侵权必究！
*/

import { defineStore } from 'pinia'
import { constantRoutes } from '@/router/index.js'
import { menuList } from '@/api/rbac/menu.js'
import { useUserStore } from '@/stores/modules/user.js'

const modules = import.meta.glob('../../views/modules/**/**.vue')
const Layout = () => import('@/layout/index.vue')

/**
 * 递归过滤有权限的异步(动态)路由
 *
 * @param routes 所有的菜单（路由）
 * @param menuIds 用户拥有的菜单id
 * @returns 返回用户有权限的异步(动态)路由
 */
const filterAsyncRoutes = (routes, menuIds) => {
  const res = []
  routes.forEach(route => {
    if (menuIds.indexOf(route.id) > -1) {
      res.push(route)
    }
  })
  return res
}
const loadView = (view) => {
  return modules[`../../views/modules/${view}/index.vue`] || modules[`../../views/modules/${view}.vue`]
}

export const usePermissionStore = defineStore('permissionStore', {
  state: () => {
    return {
      routes: [],
      addRoutes: [],
      dashboard: '',
      menuIds: [],
      secondaryMenuList: []
    }
  },
  actions: {
    setRoutes (routes) {
      this.addRoutes = routes
      this.routes = constantRoutes.concat(routes)
      this.routes.forEach(item => {
        if (item.path === '/') {
          this.dashboard = item.children[0].meta.icon
        }
        if (item.children) {
          item.children.forEach(res => {
            if (res.children) {
              this.menuIds.push(res.id + '')
            }
            if (res.children && res.children.length > 0) {
              this.secondaryMenuList.push(res)
            }
          })
        }
      })
    },
    /**
     * 生成动态路由
     *
     * @param menuIds
     * @returns
     */
    generateRoutes (menuIds) {
      return new Promise((resolve, reject) => {
        menuList().then(menuList => {
          const isAdmin = useUserStore().isAdmin
          if (!isAdmin) {
            menuList = filterAsyncRoutes(menuList, menuIds)
          }
          // 防止路由名称重复
          this.renameRoute(menuList)
          for (const menu of menuList) {
            // menu.path = menu.path[0] === '/' ? menu.path[0] : '/' + menu.path
            if (menu.component === 'Layout') {
              menu.component = Layout
            } else {
              menu.component = loadView(menu.component)
            }
          }
          const accessedRoutes = treeDataTranslate(menuList)
          this.setRoutes(accessedRoutes)
          useCommonStore().updateRouteList(accessedRoutes)
          resolve(accessedRoutes)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 所有路由的命名都必须是唯一的
     * 由于旧数据存在一些重复的路由名称，在此进行重命名处理
     * 将重名的 路由名称 重命名为 组件路径 拼接所得的字符串
     * 例：组件路径：a/b/c/d，返回a-b-c-d
     */
    renameRoute (menuList) {
      for (let idx = menuList.length - 1; idx >= 0; idx--) {
        // 组件路径拼接
        const component = menuList[idx].component.indexOf('/') !== -1 ? menuList[idx].component.split('/').join('-') : menuList[idx].component
        // 非菜单跳过
        if (!component || component === '-' || component === 'Layout') {
          continue
        }
        // 判断是否重名，重名则赋值为组件路径
        const reListByName = menuList.filter(i => i.name === menuList[idx].name)
        if (reListByName.length > 1) {
          menuList[idx].name = component
        }
      }
    }
  }
})
