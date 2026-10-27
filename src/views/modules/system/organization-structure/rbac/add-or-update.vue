<!--
 Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

 https://www.mall4j.com/

 未经允许，不可做商业用途！

 版权所有，侵权必究！
-->
<template>
  <el-dialog
    v-model="visible"
    class="page-rbac-role-add-or-update"
    :title="dataForm.roleId? $t('table.edit'): $t('table.create')"
  >
    <el-form
      ref="dataFormRef"
      :rules="dataRule"
      :model="dataForm"
      label-position="right"
      label-width="80px"
      @submit.prevent
    >
      <!-- 角色名称 -->
      <el-form-item
        :label="$t('rbac.role.roleName')"
        prop="roleName"
      >
        <el-col :span="12">
          <el-input
            v-model="dataForm.roleName"
            maxlength="30"
            show-word-limit
          />
        </el-col>
      </el-form-item>
      <!-- 备注 -->
      <el-form-item
        :label="$t('rbac.role.remark')"
        prop="remark"
      >
        <el-col :span="12">
          <el-input
            v-model="dataForm.remark"
            maxlength="50"
            show-word-limit
          />
        </el-col>
      </el-form-item>
      <!-- 权限 -->
      <el-form-item label="授权">
        <el-tree
          ref="menuListTreeRef"
          style="flex: 1;"
          :data="menuWithPermissions"
          :props="menuListTreeProps"
          node-key="menuId"
          show-checkbox
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          plain
          @click="visible = false"
        >
          {{ $t('table.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="onSubmit()"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/rbac/role'
import * as menuApi from '@/api/rbac/menu'
import { treeDataTranslate } from '@/utils'
import { validNoEmptySpace } from '@/utils/validate'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])
const dataFormRef = ref(null)
const menuListTreeRef = ref(null)
const visible = ref(false)
const isSubmit = ref(false)
const dataForm = reactive({
  roleId: 0,
  roleName: null,
  remark: null,
  createUserId: null,
  bizType: null,
  tenantId: null,
  menuIds: [],
  menuPermissionIds: []
})
const vaildRemark = (rule, value, callback) => {
  if (value === null || value === '') {
    dataFormRef.value.clearValidate('remarks')
    callback()
  } else if (validNoEmptySpace(value)) {
    callback(new Error($t('rbac.role.reamrkNoEmpty')))
  } else {
    callback()
  }
}
const dataRule = reactive({
  roleName: [
    { required: true, message: '角色名称不能为空', trigger: 'blur' }
  ],
  remark: [{ validator: vaildRemark, trigger: 'blur' }]
})

const iniMenuWithPermissions = ref([])
const menuWithPermissions = ref([])
const menuListTreeProps = reactive({
  value: 'menuId',
  label: 'title'
})
// 用于临时将权限转化为"菜单"的key
const tempPermissionToMenuKey = ref(5498415864)

const init = (roleId) => {
  dataForm.roleId = roleId || 0
  visible.value = true
  isSubmit.value = false
  nextTick(() => {
    dataFormRef.value.resetFields()
    menuListTreeRef.value?.setCheckedKeys([])
    menuApi.listWithPermissions().then(menuWithPermissions => {
      iniMenuWithPermissions.value = menuWithPermissions
      // 生成树状结构数据
      menuWithPermissionToTree(menuWithPermissions)
      if (dataForm.roleId) {
        api.get(roleId).then(data => {
          dataForm.roleId = data.roleId
          dataForm.roleName = data.roleName
          dataForm.remark = data.remark
          dataForm.createUserId = data.createUserId
          dataForm.bizType = data.bizType
          dataForm.menuIds = data.menuIds
          dataForm.menuPermissionIds = data.menuPermissionIds
          // menuWithPermissions.value =

          // 回显选中的选项
          const menuPermissionIdList = []
          let lastMenuIdList = []
          const tempMenuIdList = []
          const tempHaveSubMenuIdList = []
          if (dataForm.menuPermissionIds.length) {
            dataForm.menuPermissionIds.forEach(menuPermissionId => {
              if (menuPermissionId !== tempPermissionToMenuKey.value) {
                menuPermissionIdList.push(menuPermissionId + tempPermissionToMenuKey.value)
              }
            })
          }
          // 获取最后一级的菜单（没有子菜单也没有资源）
          if (dataForm.menuIds.length) {
            dataForm.menuIds.forEach(menuId => {
              // const iniMenuWithPermissions = iniMenuWithPermissions
              for (const item of iniMenuWithPermissions.value) {
                if ((item.menuId === menuId && item.menuPermissions.length > 0) || item.parentId === menuId) {
                  tempHaveSubMenuIdList.push(menuId)
                  break
                }
              }
              tempMenuIdList.push(menuId)
            })
            lastMenuIdList = arrContrDiff(tempHaveSubMenuIdList, tempMenuIdList)
          }
          // 回显，只选最后一级的菜单及资源
          menuListTreeRef?.value.setCheckedKeys([].concat(menuPermissionIdList, lastMenuIdList))
        })
      }
    })
  })
}
// 把菜单和菜单资源数据生成树状结构（参数为数据menuWithPermissions）
const menuWithPermissionToTree = (data) => {
  const tempMenus = []
  const permissionMenuIds = []
  for (const item of data) {
    const menuWithPermission = item
    tempMenus.push({
      menuId: menuWithPermission.menuId,
      parentId: menuWithPermission.parentId,
      title: menuWithPermission.title,
      type: 0 // 0 菜单 1按钮
    })
    // 获取最后一级的菜单（没有子菜单也没有资源）
    if (menuWithPermission.menuPermissions.length) {
      const permissions = menuWithPermission.menuPermissions
      for (const p of permissions) {
        const permission = p
        tempMenus.push({
          menuId: permission.menuPermissionId + tempPermissionToMenuKey.value,
          menuPermissionId: permission.menuPermissionId,
          parentId: permission.menuId,
          title: permission.name,
          type: 1 // 0 菜单 1按钮
        })
        permissionMenuIds.push(permission.menuId)
      }
    }
  }
  menuWithPermissions.value = treeDataTranslate(tempMenus, 'menuId')
}
// 切割最后一级的菜单
// spliceLastMenu(menus) {
//   for (const key in menus) {
//     const menu = menus[key]
//     if (menu.children && menu.children.length) {
//       spliceLastMenu(menu.children)
//       continue
//     }
//     if (menu.type === 0) {
//       menus.splice(menus.indexOf(menus), 1)
//     }
//   }
// },
// 数组对比，选出两数组不同的元素
const arrContrDiff = (arr1, arr2) => {
  return arr1.concat(arr2).filter(function (v, i, arr) {
    return arr.indexOf(v) === arr.lastIndexOf(v)
  })
}
// 表单提交
const onSubmit = () => {
  dataFormRef.value?.validate(valid => {
    if (valid) {
      const menuCheckedKeys = [].concat(menuListTreeRef.value.getCheckedKeys(), menuListTreeRef.value?.getHalfCheckedKeys())
      const menuIds = []
      const menuPermissionIds = []
      if (menuCheckedKeys.length) {
        menuCheckedKeys.forEach(menuId => {
          if (menuId < tempPermissionToMenuKey.value) {
            menuIds.push(menuId)
          } else {
            menuPermissionIds.push(menuId - tempPermissionToMenuKey.value)
          }
        })
      } else {
        ElMessage({
          message: '请选择授权项',
          type: 'warning',
          duration: 1500
        })
        return
      }

      dataForm.menuIds = menuIds
      dataForm.menuPermissionIds = menuPermissionIds
      if (isSubmit.value) {
        return
      }
      isSubmit.value = true
      const request = dataForm.roleId ? api.update(dataForm) : api.save(dataForm)
      request.then(() => {
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            visible.value = false
            emit('refreshDataList')
            dataFormRef.value.resetFields()
            isSubmit.value = false
          }
        })
      }).catch((e) => {
        isSubmit.value = false
      })
    }
  })
}
defineExpose({ init })
</script>
