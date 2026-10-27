<template>
  <div class="page-category">
    <!-- 搜索相关区域 -->
    <div class="operation-bar">
      <el-button
        v-permission="['product:category:save']"
        type="primary"
        class="filter-item"
        @click="onAddOrUpdate()"
      >
        {{ $t('table.create') }}
      </el-button>
      <el-button
        v-permission="['shop:category:export']"
        type="primary"
        class="filter-item"
        @click="exportFrom()"
      >
        导出
      </el-button>
    </div>

    <div class="tips">
      店铺最多可创建2级分类
    </div>

    <!-- 分类列表 -->
    <div :class="['category-list', threeList.length ? 'box-border' : '']">
      <div
        v-for="(renderList, level) in renderListData"
        :key="level"
        :class="['addr-list-box', renderList.length ? 'active' : '']"
      >
        <div class="addr-list">
          <div
            v-for="(item, index) in renderList"
            :key="index"
            :class="['addr-item', currentSelectId === item.categoryId ? 'active' : '']"
          >
            <div
              class="dot"
              @click="handleAddrListSelect(item, level)"
            >
              {{ item.name }}
            </div>
            <div class="btn">
              <div class="tag">
                <el-tag
                  v-if="item.status === 0"
                  type="danger"
                >
                  下架
                </el-tag>
                <el-tag v-else>
                  正常
                </el-tag>
              </div>
              <el-button
                v-permission="['product:category:update']"
                type="primary"
                link
                @click="onAddOrUpdate(item.categoryId, item.level)"
              >
                编辑
              </el-button>
              <!-- 上架 -->
              <el-button
                v-if="item.status === 0"
                v-permission="['product:category:putOnShelf']"
                type="primary"
                link
                @click="enableOrDisable(item.categoryId, item.status, index)"
              >
                {{ $t('action.putOnShelf') }}
              </el-button>
              <!-- 下架 -->
              <el-button
                v-if="item.status === 1"
                v-permission="['product:category:offShelf']"
                type="primary"
                link
                @click="enableOrDisable(item.categoryId, item.status, index)"
              >
                {{ $t('action.offShelf') }}
              </el-button>
              <el-button
                v-permission="['product:category:delete']"
                type="primary"
                link
                @click="onDelete(item, level)"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="!renderListData.length"
        class="nodata"
      >
        暂无数据
      </div>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @show="addShow()"
      @refresh-data-list="getPage()"
    />
  </div>
</template>

<script setup>
import * as api from '@/api/product/category'
import { treeDataTranslate } from '@/utils'
import AddOrUpdate from './components/add-or-update.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const selectedsData = ref([]) // 记录选中值
const renderListData = ref([]) // 地址列表
// 查询的参数
const pageQuery = reactive({
  pageSize: 10,
  pageNum: 1
})
// 返回参数
const pageVO = reactive({
  list: [] // 返回的列表
})

// 已选择的categoryId，用于重新请求数据回显二级分类
let categoryId = null
const secondList = ref([])
const threeList = ref([])
const pageLoading = ref(true)
const isSubmit = ref(false)
// 查询参数
const searchParam = {
}
const addOrUpdateVisible = ref(false)
const currentSelectId = ref('') // 当前点击的分类id
onMounted(() => {
  getPage()
})

const addShow = (flg) => {
  addOrUpdateVisible.value = flg
}

const getPage = () => {
  pageLoading.value = true
  api.shopCategoryPage({ ...pageQuery, ...searchParam }).then(data => {
    secondList.value = threeList.value = []
    pageVO.list = treeDataTranslate(data, 'categoryId', 'parentId')
    pageLoading.value = false
    // 分类数据为空时清除展示列表数据
    renderListData.value = pageVO.list.length === 0 ? [] : renderListData.value
    setInitRenderListData(pageVO.list)
    // debugger
    // 回显上次展示的二级分类
    if (categoryId) {
      const changeList = renderListData.value && renderListData.value.length && renderListData.value[0].filter(el => el.categoryId === categoryId)
      if (changeList && changeList.length > 0) {
        const changeValue = getRenderListData(changeList[0])
        changeRenderListData({
          startLevel: 1,
          changeLength: renderListData.value.length,
          changeValue: [changeValue]
        })
      }
    }
  }).catch(() => {
    pageLoading.value = false
  })
}

// 导出
const exportFrom = () => {
  ElMessageBox.confirm($t('table.sureToExport'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    if (isSubmit.value) {
      return
    }
    isSubmit.value = true
    api.soldExcel({ ...pageQuery, ...searchParam }).then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
      // var blob = data
      const fileName = '店铺分类.xlsx'
      const elink = document.createElement('a')
      if ('download' in elink) { // 非IE下载
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName)
      }
      isSubmit.value = false
    }).catch((e) => {
      ElMessage.error(e)
      isSubmit.value = false
    })
  })
}

// 设置初始数据
const setInitRenderListData = (treeData) => {
  selectedsData.value.splice(0, selectedsData.value.length) // 1. 删除旧已选中数据
  // 删除旧的渲染列表并添加新的第一级渲染列表
  if (treeData.length > 0) {
    changeRenderListData({
      startLevel: 0,
      changeLength: renderListData.value.length, // 删除的长度
      changeValue: [treeData] // 添加新值
    })
  }
}
// 获取渲染列表
const getRenderListData = (data) => {
  return (data && data.children) || []
}
/**
 * 监听列表项选择
 */
const handleAddrListSelect = (selectData, level) => {
  selectedsData.value.splice(level, 1, selectData) // 记录选中值
  // 当前点击的分类id
  currentSelectId.value = selectData.categoryId

  // 生成下一级的列表渲染数据
  const childRenderData = getRenderListData(selectData)

  // 最高2级分类
  if (level === 1) {
    return
  }

  // 保存已选中的categoryId
  categoryId = selectData.categoryId

  // 删除所有子孙级渲染数据, 并添加下级渲染数据
  changeRenderListData({
    startLevel: level + 1,
    changeLength: renderListData.value.length,
    changeValue: [childRenderData]
  })
}

// 更改渲染列表数据
const changeRenderListData = ({ startLevel, changeLength, changeValue }) => {
  if (!changeValue) {
    renderListData.value.splice(startLevel, changeLength)
  } else {
    renderListData.value.splice(startLevel, changeLength, ...changeValue)
  }
}

const addOrUpdateRef = ref(null)
/**
 * 更新
 */
const onAddOrUpdate = (categoryId, level) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(categoryId, level)
  })
}
/**
 * 删除
 */
const onDelete = (item, level) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    deleteById(item.categoryId)
  })
}
const deleteById = (categoryId) => {
  api.deleteById(categoryId).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => getPage()
    })
  }).catch(() => {
    getPage()
  })
}

/**
 * 上架/下架分类
 */
const enableOrDisable = (categoryId, sts) => {
  const categoryDTO = {}
  categoryDTO.categoryId = categoryId
  categoryDTO.status = sts === 0 ? 1 : 0
  ElMessageBox.confirm(sts === 1 ? '下架当前分类后，当前分类下的所有商品也将被下架，是否确认下架当前分类?' : '是否确认上架当前分类?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    api.enableOrDisable(categoryDTO).then(() => {
      ElMessage({
        message: '操作成功',
        type: 'success',
        duration: 1500,
        onClose: () => getPage()
      })
    })
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
@use "index";
</style>
