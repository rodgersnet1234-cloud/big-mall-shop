<!--
 Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

 https://www.mall4j.com/

 未经允许，不可做商业用途！

 版权所有，侵权必究！
-->
<template>
  <el-dialog
    v-model="visible"
    :show-close="false"
    :close-on-click-modal="false"
    class="component-category-add-or-update header-no-padding"
    width="80%"
    top="8vh"
    @close="onClosePopup"
  >
    <div>
      <div class="popup">
        <div class="title">
          <div class="text">
            <span class="stress">*</span>新增签约类目
          </div>
          <div class="tips">
            请选择末级类目签约，已签约
            <span class="bold">{{ signedCategoryCount }}</span>
            个类目，已选择
            <span class="bold">{{ signCategories.length }}</span>
            ，最多可签约<span class="bold">200</span>个类目
          </div>
          <div
            class="close-btn"
            @click="onClosePopup"
          >
            <el-icon><Close /></el-icon>
          </div>
        </div>
        <div class="content">
          <div
            v-loading="loading"
            class="left-box"
            element-loading-text="数据处理中..."
          >
            <div class="tree-box">
              <el-tree-v2
                ref="categoryTreeRef"
                :data="categoryTreeData"
                :props="categoryListTreeProps"
                class="filter-tree"
                show-checkbox
                highlight-current
                icon-class="el-icon-arrow-right"
                :default-checked-keys="signCategories.map(el=> el.categoryId)"
                :height="574"
                @check="onCheckChange"
                @node-click="onNodeClick"
              >
                <template #default="{ data }">
                  <el-tooltip
                    :content="data.level === 2 ? data.name + ' ' + data.deductionRate + '%' : data.name"
                    placement="right"
                    effect="light"
                    :open-delay="500"
                    class="custom-tree-node"
                  >
                    <span>{{ data.level === 2 ? data.name + ' ' + data.deductionRate + '%' : data.name }}</span>
                  </el-tooltip>
                </template>
              </el-tree-v2>
            </div>
          </div>
          <div
            ref="tableBoxRef"
            class="right-box table-box"
          >
            <el-table
              :data="signCategories"
              height="596"
              :header-cell-style="{height:'50px',background:'#F5F5F5',color:'#000','font-weight': '400'}"
            >
              <el-table-column
                prop="name"
                label="类目"
              />
              <el-table-column
                prop="parentName"
                label="上级类目"
              />
              <el-table-column
                prop="platformRate"
                label="类目扣率"
              >
                <template #default="{ row }">
                  <span>{{ row.platformRate }} %</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="qualifications"
                label="经营资质"
                width="230px"
              >
                <template #default="scope">
                  <div
                    :key="scope.row.qualifications"
                    class="business-qual"
                  >
                    <imgs-upload
                      v-model="scope.row.qualifications"
                      :limit="2"
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="categoryStatus"
                label="状态"
                width="80"
              >
                <template #default="scope">
                  <div
                    v-if="scope.row.categoryStatus === 1"
                    class="tag-txt"
                  >
                    正常
                  </div>
                  <div
                    v-if="scope.row.categoryStatus === 0"
                    class="tag-txt red-tag-txt"
                  >
                    下架
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="address"
                :label="$t('table.actions')"
                width="80px"
              >
                <template #default="scope">
                  <el-button
                    type="primary"
                    link
                    @click="onDeleteSelectedCategory(scope)"
                  >
                    {{ $t('table.delete') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="btn-box">
          <div
            class="cancel-btn"
            @click="onClosePopup"
          >
            {{ $t('table.cancel') }}
          </div>
          <div
            class="confirm-btn"
            @click="onConfirmSubmit"
          >
            {{ $t('table.confirm') }}
          </div>
        </div>
      </div>
      <div class="shelter-layer" />
    </div>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/multishop/shop-process.js'
import { enableCategories, listApplySigningCategory } from '@/api/product/category.js'
import { treeDataTranslate } from '@/utils/index.js'
import { ElMessage } from 'element-plus'
import { Debounce } from '@/utils/debounce'

const props = defineProps({
  // 签约分类列表
  signCategoryList: {
    type: Array,
    default () {
      return []
    }
  },
  /**
   * 是否从店铺信息申请签约
   * applyForSign=true时，请求可以签约的平台分类列表（已经签约的平台分类不会返回）
   */
  applyForSign: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['closePopup'])
// 已签约分类数量
const signedCategoryCount = ref(props.signCategoryList.length)

const categoryTreeData = ref([])
const categoryListTreeProps = reactive({
  value: 'categoryId',
  label: 'name'
})
const visible = ref(false)
const signCategories = ref([]) // table渲染列表
const loading = ref(false)
const tableBoxRef = ref('')
let MAXLength = 200 // 目前最多剩余能签约数(200-已经签约)
const init = () => {
  MAXLength = 200 - props.signCategoryList.length
  getPlatformCategory()
  visible.value = true
  if (!props.applyForSign) {
    getSignCategoryList()
  }
}
defineExpose({
  init
})

let allCategories = []
/**
 * 获取SaaS分类列表，并转换成树形结构
 */
const getPlatformCategory = () => {
  loading.value = true
  if (props.applyForSign) {
    listApplySigningCategory().then(data => {
      loading.value = false
      data = data.filter(item => item.status === 1)
      categoryTreeData.value = treeDataTranslate(data, 'categoryId', 'parentId')
      categoryTreeData.value = removeNotThirdCategoryItem(categoryTreeData.value)
    })
  } else {
    // 包含三级分类的分类列表
    enableCategories({ shopId: 0 }).then(data => {
      allCategories = data
      loading.value = false
      data = data.filter(item => item.status === 1)
      categoryTreeData.value = treeDataTranslate(data, 'categoryId', 'parentId')
      categoryTreeData.value = removeNotThirdCategoryItem(categoryTreeData.value)

      // 已选的二级分类父级id
      const secCategoryParentId = [...new Set(props.signCategoryList.map((item) => item.parentId))]
      // 所有一级、二级分类的父级id
      const expandCategoryIds = secCategoryParentId.concat(secCategoryParentId.map((item) => allCategories.find((el) => el.categoryId === item).parentId))
      nextTick(() => {
        // 设置已选的类目为展开状态
        categoryTreeRef.value?.setExpandedKeys(expandCategoryIds)
      })
    })
  }
}
/**
 * 去除没有三级分类的类目
 */
const removeNotThirdCategoryItem = (treeData) => {
  const firstCategory = treeData
  const length = firstCategory.length
  for (let i = 0, index = 0; i < length; i++) {
    if (firstCategory[index].level !== 2) {
      if (firstCategory[index].children && firstCategory[index].children.length > 0 && (firstCategory[index].children.some(item => item.children) || firstCategory[index].level !== 0)) {
        const secondCategory = firstCategory[index].children
        firstCategory[index].children = removeNotThirdCategoryItem(secondCategory)
      } else {
        firstCategory.splice(index, 1)
        // 当前位置的元素已经被删除，当前位置索引不用++
        continue
      }
    }
    index++
  }
  return firstCategory
}

/**
 * 签约类目列表
 */
const getSignCategoryList = () => {
  for (const el of props.signCategoryList) {
    signCategories.value.push({
      categoryId: el.categoryId,
      name: el.name,
      parentId: el.parentId,
      parentName: el.parentName,
      platformRate: el.platformRate,
      customizeRate: el.customizeRate,
      qualifications: el.qualifications,
      categoryStatus: el.categoryStatus,
      categoryShopId: el.categoryShopId
    })
  }
}

const categoryTreeRef = ref('')
/**
 * 复选框勾选事件
 * @param {Object} nodeObj 当前勾选的节点数据
 * @param {Object} treeNodeInfo 整棵树的节点数据信息
 */
const onCheckChange = async (nodeObj, treeNodeInfo) => {
  loading.value = true
  let tempList = treeNodeInfo.checkedNodes.filter(el => el.level === 2) // 勾选的对象数组
  const tempIdList = tempList.map(el => el.categoryId) // 勾选的id数组
  const isCheck = treeNodeInfo.checkedKeys.includes(nodeObj.categoryId)
  if (isCheck) {
    // 选择的类目 超过200限制时,弹出警告
    if (tempIdList.length > MAXLength) {
      ElMessage({
        message: '最多可选择200个类目',
        type: 'error',
        duration: 1000
      })
      const delTempIdList = tempList.slice(MAXLength) // 超出200限制的选择数组
      tempList = tempList.splice(0, MAXLength) // 最终勾选数组
      for (const i in delTempIdList) {
        setTimeout(() => {
          // 超出部分,选择状态清空
          categoryTreeRef.value.setChecked(delTempIdList[i].categoryId, false)
        })
      }
    }
    // 新增选择类目(右侧显示处理)
    for (let i = tempList.length - 1; i >= 0; i--) {
      const el = tempList[i]
      if (!signCategories.value.map(item => item.categoryId).includes(el.categoryId)) {
        signCategories.value.push({
          categoryId: el.categoryId,
          name: el.name,
          parentName: el.parentName || allCategories.find(item => item.categoryId === el.parentId).name,
          platformRate: el.deductionRate,
          categoryStatus: el.status,
          qualifications: ''
        })
      }
    }
    loading.value = false
  } else {
    // 删除选择类目(右侧显示处理)
    for (let i = signCategories.value.length - 1; i >= 0; i--) {
      if (!tempIdList.includes(signCategories.value[i].categoryId)) {
        signCategories.value.splice(i, 1)
      }
    }
    loading.value = false
  }
}

/**
 * 点击节点时触发
 * @param nodeObj 对应于节点点击的节点对象
 * @returns {Promise<void>}
 */
const onNodeClick = (nodeObj) => {
  if (nodeObj.level !== 2) return
  const isChecked = categoryTreeRef.value.getCheckedKeys().includes(nodeObj.categoryId)
  if (isChecked) {
    signCategories.value = signCategories.value.filter(item => item.categoryId !== nodeObj.categoryId)
  } else {
    if (!MAXLength || signCategories.value.length === MAXLength) {
      return ElMessage({
        message: '最多可选择200个类目',
        type: 'error',
        duration: 1000
      })
    }
    signCategories.value.push({
      categoryId: nodeObj.categoryId,
      name: nodeObj.name,
      parentName: nodeObj.parentName || allCategories.find(item => item.categoryId === nodeObj.parentId).name,
      platformRate: nodeObj.deductionRate,
      categoryStatus: nodeObj.status,
      qualifications: ''
    })
  }
  // 修改选择栏的状态
  categoryTreeRef.value.setChecked(nodeObj.categoryId, !isChecked)
}

/**
 * 签约分类
 */
const signCategory = Debounce(() => {
  const params = []
  signCategories.value.forEach(item => {
    const param = {
      categoryId: item.categoryId,
      rate: item.platformRate,
      qualifications: item.qualifications ? item.qualifications : null
    }
    params.push(param)
  })
  api[props.applyForSign ? 'addSigningCategory' : 'signCategory'](params).then(() => {
    ElMessage({
      message: '类目保存成功！',
      type: 'success',
      duration: 1000
    })
    onClosePopup()
  })
}, 1500)

/**
 * 确认提交
 */
const onConfirmSubmit = () => {
  if (signedCategoryCount.value + signCategories.value.length > 200) {
    ElMessage({
      message: '最多可选择200个类目',
      type: 'error',
      duration: 1000
    })
    return
  }
  if (signCategories.value.length > 0) {
    signCategory()
  } else {
    ElMessage({
      message: '请选择至少一种分类',
      type: 'error',
      duration: 1000
    })
  }
}

/**
 * 删除已选分类
 */
const onDeleteSelectedCategory = (scope) => {
  categoryTreeRef.value.setChecked(scope.row.categoryId, false)
  signCategories.value.splice(scope.$index, 1)
}

/**
 * 关闭弹窗
 */
const onClosePopup = () => {
  visible.value = false
  emit('closePopup', 'category')
}

</script>

<style lang="scss" scoped>
@use "index";
</style>
