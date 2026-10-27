<template>
  <div class="component-stock-upload">
    <el-dialog
      v-model="visible"
      :show-close="false"
      width="650"
    >
      <div class="title">
        <el-tabs
          v-if="spuMold===0"
          v-model="activeName"
          class="tabs"
          @tab-change="onTabChange"
        >
          <el-tab-pane
            label="仓库库存"
            name="warehouse"
          />
          <el-tab-pane
            label="门店库存"
            name="station"
          />
        </el-tabs>
        <div
          v-else
          class="title-txt"
        >
          仓库库存
        </div>
        <div
          class="close-btn"
          @click="visible = false"
        >
          <el-icon><Close /></el-icon>
        </div>
      </div>
      <!-- 搜索栏 -->
      <div
        v-if="spuMold!==1"
        class="search-bar"
      >
        <el-form
          ref="searchFormRef"
          :inline="true"
          :model="searchForm"
          label-width="auto"
          @submit.prevent
        >
          <div class="input-row">
            <el-form-item
              :label="activeName === 'warehouse'?'仓库名称：':'门店名称：'"
              prop="name"
            >
              <el-input
                v-model="searchForm.name"
                clearable
                :placeholder="activeName === 'warehouse'?'仓库名称':'门店名称'"
                @change="onChangePointName"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="onSearch(true)"
              >
                搜索
              </el-button>
              <el-button
                @click="onResetSearch(searchFormRef)"
              >
                重置
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <!-- 搜索栏end -->
      <div class="content">
        <el-table
          v-loading="pageLoading"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
        >
          <el-table-column
            :prop="activeName === 'warehouse' ? 'warehouseName' : 'stationName'"
            :label="activeName === 'warehouse'?'仓库名称':'门店名称'"
            align="center"
          />
          <el-table-column
            v-if="activeName === 'warehouse'"
            label="仓库类型"
            align="center"
          >
            <template #default="scope">
              {{ scope.row.type === 1 ? '区域仓库' : '默认仓库' }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="activeName === 'station'"
            label="状态"
            prop="status"
          >
            <template #default="scope">
              {{ ['关闭', '营业', '平台下线', '审核中', '审核失败'][scope.row.status] }}
            </template>
          </el-table-column>
          <el-table-column
            prop="stock"
            label="库存"
            align="center"
          />
        </el-table>
        <!-- 分页 -->
        <pagination
          v-show="pageData.total > 0"
          v-model:page="searchForm.pageNum"
          v-model:limit="searchForm.pageSize"
          style="text-align: right"
          :total="pageData.total"
          @pagination="()=>onGetPageData()"
        />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            @click="visible = false;"
          >
            {{ $t('table.cancel') }}
          </el-button>
          <el-button
            type="primary"
            @click="visible = false;"
          >
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import * as api from '@/api/stock/warehouse-station.js'
import { pageStation } from '@/api/delivery/station.js'
const visible = ref(false)
const activeName = ref('warehouse')
const init = (skuIdVal, spuMoldVal) => {
  pointName.value = ''
  searchForm.name = ''
  activeName.value = 'warehouse'
  visible.value = true
  searchForm.skuId = skuIdVal
  spuMold.value = spuMoldVal
  if (spuMold.value === 1 || spuMold.value === 3) {
    // 虚拟商品/电子卡券只获取默认仓库
    searchForm.type = 0
  } else {
    searchForm.type = undefined
  }
  onGetPageData(true)
}

const spuMold = ref(0)

let tempSearchForm = null // 保存上次点击查询的请求条件
// 头部搜索表单
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  name: '',
  skuId: ''
})
const pageData = ref({
  total: 0,
  pages: 0
})
const dataList = ref([])
const pageLoading = ref(true)
// 获取数据列表
const onGetPageData = (newData = false) => {
  if (newData || !tempSearchForm) {
    if (activeName.value === 'warehouse') {
      searchForm.warehouseName = pointName.value
    } else {
      searchForm.stationName = pointName.value
      searchForm.stockMode = 2
    }
    tempSearchForm = JSON.parse(JSON.stringify(searchForm))
  } else {
    tempSearchForm.pageNum = searchForm.pageNum
    tempSearchForm.pageSize = searchForm.pageSize
  }
  const request = activeName.value === 'warehouse' ? api.getPageList : pageStation
  if (activeName.value === 'station') {
    tempSearchForm.stockMode = 2
  }
  request(tempSearchForm).then(res => {
    pageData.value.pages = res.pages
    pageData.value.total = res.total
    dataList.value = res.list
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

const pointName = ref('')
const onChangePointName = (val) => {
  pointName.value = val
}

const onTabChange = () => {
  pointName.value = ''
  searchForm.name = ''
  searchForm.pageNum = 1
  onGetPageData(true)
}

// 条件查询
const onSearch = (newData = false) => {
  searchForm.pageNum = 1
  onGetPageData(newData)
}

const searchFormRef = ref(null)
const onResetSearch = (formEl) => {
  pointName.value = ''
  formEl.resetFields()
}

defineExpose({
  init
})
</script>

<style lang="scss" scoped>
.component-stock-upload {
  :deep(.el-dialog__header){
    display: none;
  }
  :deep(.el-dialog__body) {
    padding: 0;
  }
  .title {
    position: relative;
    :deep(.el-tabs__nav-scroll) {
      padding: 10px 0 0 20px;
    }
    .close-btn {
      font-size: 18px;
      color: #909399;
      position: absolute;
      top: 10px;
      right: 10px;
      &:hover {
        color: #155bd4;
        cursor: pointer;
      }
    }
    .title-txt {
      font-size: 18px;
      color: #000;
      font-weight: bold;
      padding: 20px;
      border-bottom: #ebeef5 1px solid;
    }
  }
  .search-bar {
    margin: 0 20px;
  }
  .content {
    padding: 20px 20px 0;
  }
  :deep(.el-dialog__footer){
    border-top: #ebeef5 1px solid;
  }
}
</style>
