<template>
  <div class="page-virtual-info-log app-container">
    <!-- 搜索相关区域 -->
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        class="search-form"
        :model="searchForm"
        label-width="auto"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item
            label="订单编号："
          >
            <el-input
              v-model="searchForm.orderId"
              type="text"
              oninput="value=value.replace(/[^0-9]/g,'')"
              clearable
              maxlength="19"
              :placeholder="'订单编号'"
            />
          </el-form-item>
          <el-form-item label="门店名称：">
            <el-select v-model="searchForm.stationId">
              <el-option
                v-for="node in stationList"
                :key="node.stationId"
                :label="node.stationName"
                :value="node.stationId"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="核销券码："
          >
            <el-input
              v-model="searchForm.writeOffCode"
              type="text"
              oninput="value=value.replace(/[^0-9]/g,'')"
              clearable
              maxlength="10"
              placeholder="核销券码"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              v-permission="['multishop:virtualLogInfo:page']"
              type="primary"
              class="filter-item"
              @click="getPage(true)"
            >
              {{ $t('table.search') }}
            </el-button>
            <el-button
              @click="resetForm()"
            >
              重置
            </el-button>
            <el-button
              v-permission="['multishop:virtualLogInfo:export']"
              @click="onExportOrder()"
            >
              导出
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 列表相关区域 -->
    <el-table
      v-loading="pageLoading"
      :data="dataList"
      header-cell-class-name="table-header"
      row-class-name="table-row-low"
      style="width: 100%;"
    >
      <!-- 订单id -->
      <el-table-column
        :label="$t('order.orderInvoice.orderId')"
        width="160"
        prop="orderId"
        align="center"
      >
        <template #default="{row}">
          <span>{{ row.orderId || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="商品名称"
        prop="spuName"
        align="center"
      >
        <template #default="{row}">
          <span>{{ row.spuName || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="核销门店"
        prop="stationName"
        align="center"
      >
        <template #default="{row}">
          <span>{{ row.stationName || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="核销券码"
        prop="writeOffCode"
        align="center"
      />
      <el-table-column
        label="核销时间"
        width="160"
        prop="createTime"
        align="center"
      >
        <template #default="{row}">
          <span>{{ row.createTime || '-' }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页条 -->
    <pagination
      v-show="page.total>0"
      v-model:page="page.pageNum"
      v-model:limit="page.pageSize"
      :total="page.total"
      @pagination="getPage()"
    />
  </div>
</template>

<script setup>
import * as api from '@/api/order/order'
import { getListAllStation } from '@/api/stock/warehouse-station'
import { ElMessage, ElMessageBox } from 'element-plus'

const page = reactive({
  pageSize: 10,
  pageNum: 1,
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
const dataList = reactive([])

const searchForm = reactive({
  orderId: null,
  stationId: null,
  writeOffCode: null
})

onMounted(() => {
  getPage()
  onGetStationList()
})

let tempSearchForm = null
const pageLoading = ref(true)
const getPage = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = {
      pageNum: page.pageNum,
      pageSize: page.pageSize,
      ...searchForm
    }
  } else {
    tempSearchForm.pageNum = page.pageNum
    tempSearchForm.pageSize = page.pageSize
  }
  pageLoading.value = true
  api.pageVirtualInfoLog(
    tempSearchForm
  ).then(data => {
    onHandleArr(dataList, data.list)
    page.pages = data.pages
    page.total = data.total
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

const searchFormRef = ref()
const resetForm = () => {
  searchFormRef.value?.resetFields()
  searchForm.orderId = null
  searchForm.stationId = null
  searchForm.writeOffCode = null
  page.pageNum = 1
  page.pageSize = 10
}

// 数组赋值
const onHandleArr = (arr, data) => {
  arr.length = 0
  arr.push(...data)
}
const stationList = ref([])
const onGetStationList = () => {
  getListAllStation().then((res) => {
    stationList.value = res
  })
}

const isExportOrderBtn = ref(false)
const onExportOrder = () => {
  ElMessageBox.confirm($t('table.sureToExport'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  })
    .then(() => {
      isExportOrderBtn.value = true
      api.soldVirtualInfoLogExcel(searchForm).then((data) => {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        const fileName = '核销记录.xlsx'
        const elink = document.createElement('a')
        if ('download' in elink) { // 非IE下载
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
          isExportOrderBtn.value = false
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName)
          isExportOrderBtn.value = false
        }
      }).catch((e) => {
        isExportOrderBtn.value = false
        ElMessage.error(e)
      })
    })
    .catch(() => {})
}
</script>

<style lang="scss" scoped>
.page-virtual-info-log {
  .search-bar {
    margin-bottom: 20px;
    background-color: #F7F8FA;
    .input-row {
      display: block;
    }
  }
}
</style>
