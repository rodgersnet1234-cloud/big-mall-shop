import { defineStore } from 'pinia'
import { checkFileUrl } from '@/utils/index.js'
import * as api from '@/api/rbac/web-config'

// 网站配置默认信息
const configDefInfo = {
  // 登录logo
  loginBgImg: new URL('@/assets/website-config/login-bg.jpg', import.meta.url).href,
  // 版权声明-中文
  copyrightCn: 'Copyright © 2018-2022 广州市蓝海创新科技有限公司 版权所有 | 粤ICP备18115813号-1',
  // 版权声明-英文
  copyrightEn: 'Copyright © 2018-2022 广州市蓝海创新科技有限公司 版权所有 | 粤ICP备18115813号-1',
  // 标题文本-中文
  titleContentCn: 'Mall4j 多元版-商家端',
  // 标题文本-英文
  titleContentEn: 'Mall4j 多元版-商家端',
  // 网站标题图标
  titleImg: new URL('@/assets/website-config/title-icon.png', import.meta.url).href,
  // 菜单栏顶部图标
  bsTopBarIcon: new URL('@/assets/website-config/menu-top-icon.png', import.meta.url).href,
  // 菜单展开文本-中文
  bsMenuTitleOpenCn: '多元版-商家端',
  // 菜单展开文本-英文
  bsMenuTitleOpenEn: '多元版-商家端',
  // 菜单收缩文本-中文
  bsMenuTitleCloseCn: '商家端',
  // 菜单收缩文本-英文
  bsMenuTitleCloseEn: '商家端'
}

export const useWebConfigStore = defineStore('webConfigStore', {
  state: () => {
    return {
      webConfig: {
        loginLogoImg: null,
        loginBgImg: null,
        copyrightCn: null,
        copyrightEn: null,
        titleContentCn: null,
        titleContentEn: null,
        titleImg: null,
        bsMenuTitleOpenCn: null,
        bsMenuTitleOpenEn: null,
        bsMenuTitleCloseCn: null,
        bsMenuTitleCloseEn: null
      }
    }
  },
  actions: {
    getWebConfig () {
      // 获取网站配置
      api.getActivity('MULTISHOP_WEBSITE_CONFIG').then(data => {
        this.addData(this.formatConfigInfo(data))
      })
    },
    addData (webConfigDataForm) {
      localStorage.setItem('cloudShopWebConfigData', JSON.stringify(webConfigDataForm || '{}'))
      this.webConfig = webConfigDataForm
      const lang = localStorage.getItem('cloudLang')
      if (lang !== 'en') {
        document.title = webConfigDataForm.titleContentCn || 'Mall4j多元版-商家端'
      } else {
        document.title = webConfigDataForm.titleContentEn || 'Mall4j White hole version Shop side'
      }

      let facicon = document.querySelector('link[rel="icon"]')
      if (facicon !== null) {
        facicon.href = checkFileUrl(webConfigDataForm.titleImg)
      } else {
        facicon = document.createElement('link')
        facicon.rel = 'icon'
        facicon.href = checkFileUrl(webConfigDataForm.titleImg)
        document.head.appendChild(facicon)
      }
    },
    // 格式化配置信息
    formatConfigInfo (config) {
      const data = {}
      config = JSON.parse(JSON.stringify(config))

      // 为空使用默认配置
      data.loginBgImg = config.loginBgImg || configDefInfo.loginBgImg
      data.copyrightCn = config.copyrightCn || configDefInfo.copyrightCn
      data.copyrightEn = config.copyrightEn || configDefInfo.copyrightEn
      data.titleContentCn = config.titleContentCn || configDefInfo.titleContentCn
      data.titleContentEn = config.titleContentEn || configDefInfo.titleContentEn
      data.titleImg = config.titleImg || configDefInfo.titleImg
      data.bsTopBarIcon = config.bsTopBarIcon || configDefInfo.bsTopBarIcon
      data.bsMenuTitleOpenCn = config.bsMenuTitleOpenCn || configDefInfo.bsMenuTitleOpenCn
      data.bsMenuTitleOpenEn = config.bsMenuTitleOpenEn || configDefInfo.bsMenuTitleOpenEn
      data.bsMenuTitleCloseCn = config.bsMenuTitleCloseCn || configDefInfo.bsMenuTitleCloseCn
      data.bsMenuTitleCloseEn = config.bsMenuTitleCloseEn || configDefInfo.bsMenuTitleCloseEn
      return Object.assign(config, data)
    }
  }
})
