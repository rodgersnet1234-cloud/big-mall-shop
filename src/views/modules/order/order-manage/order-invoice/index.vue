<template>
  <div class="page-order-invoice app-container">
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
            prop="title"
            :label="'订单编号' + '：'"
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
          <el-form-item
            prop="status"
            :label="'发票状态' + '：'"
          >
            <el-select
              v-model="searchForm.invoiceState"
              clearable
              :placeholder="'发票状态'"
            >
              <el-option
                v-for="item in invoiceStates"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              v-permission="['order:orderInvoice:page']"
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
      <!-- 抬头类型 1.单位 2.个人-->
      <el-table-column
        :label="$t('order.orderInvoice.headerType')"
        prop="headerType"
        align="center"
      >
        <template #default="{row}">
          <span>{{ ['','单位','个人'][row.headerType] }}</span>
        </template>
      </el-table-column>
      <!-- 发票状态 1.申请中 2.已开票 -->
      <el-table-column
        :label="$t('order.orderInvoice.invoiceState')"
        prop="invoiceState"
        align="center"
      >
        <template #default="{row}">
          <span>{{ ['','申请中','已开票'][row.invoiceState] }}</span>
        </template>
      </el-table-column>
      <!-- 订单状态 -->
      <el-table-column
        :label="$t('group.orderStatus')"
        prop="orderStatus"
        align="center"
      >
        <template #default="scope">
          <span v-if="scope.row.orderStatus === 1">{{ '待付款' }}</span>
          <span v-if="scope.row.orderStatus === 2">{{ '待发货' }}</span>
          <span v-if="scope.row.orderStatus === 3">{{ '待收货' }}</span>
          <span v-if="scope.row.orderStatus === 5">{{ '已完成' }}</span>
          <span v-if="scope.row.orderStatus === 6">{{ '交易失败' }}</span>
          <span v-if="scope.row.orderStatus === 7">{{ '待成团' }}</span>
          <span v-if="scope.row.orderStatus === 8">{{ '待采购' }}</span>
          <span v-if="scope.row.orderStatus === 9">{{ '待付尾款' }}</span>
        </template>
      </el-table-column>
      <!-- 申请时间 -->
      <el-table-column
        :label="$t('order.orderInvoice.applicationTime')"
        width="160"
        prop="applicationTime"
        align="center"
      >
        <template #default="{row}">
          <span>{{ row.applicationTime || '-' }}</span>
        </template>
      </el-table-column>
      <!-- 上传时间 -->
      <el-table-column
        :label="$t('order.orderInvoice.uploadTime')"
        width="160"
        prop="uploadTime"
        align="center"
      >
        <template #default="{row}">
          <span>{{ row.uploadTime || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        fixed="right"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template #default="{row}">
          <el-button
            v-permission="['order:orderInvoice:info']"
            type="primary"
            link
            @click="toOrderDetail(row.orderId)"
          >
            查看订单
          </el-button>
          <el-button
            v-permission="['order:orderInvoice:update']"
            type="primary"
            link
            @click="onAddOrUpdate(row.orderInvoiceId)"
          >
            {{ $t('table.edit') }}
          </el-button>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getPage()"
    />
    <order-info
      v-if="orderInfoVisible"
      ref="orderInfoRef"
    />
  </div>
</template>

<script setup>
import AddOrUpdate from './add-or-update.vue'
import orderInfo from '../order/components/order-info.vue'
import * as api from '@/api/order/order-invoice'

const page = reactive({
  pageSize: 10,
  pageNum: 1,
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
const dataList = reactive([])

const searchForm = reactive({
  orderId: null,
  invoiceState: null
})
const invoiceStates = [
  {
    label: '申请中',
    value: 1
  },
  {
    label: '已开票',
    value: 2
  }
]

onMounted(() => {
  getPage()
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
  api.page(
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

const addOrUpdateRef = ref()
const addOrUpdateVisible = ref(false)
const onAddOrUpdate = (orderInvoiceId) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(orderInvoiceId)
  })
}

const orderInfoRef = ref()
const orderInfoVisible = ref(false)
const toOrderDetail = (orderId) => {
  orderInfoVisible.value = true
  nextTick(() => {
    orderInfoRef.value?.init(orderId)
  })
}

const searchFormRef = ref()
const resetForm = () => {
  searchFormRef.value?.resetFields()
  searchForm.orderId = null
  searchForm.invoiceState = null
  page.pageNum = 1
  page.pageSize = 10
}

// 数组赋值
const onHandleArr = (arr, data) => {
  arr.length = 0
  arr.push(...data)
}
</script>

<style lang="scss" scoped>
.page-order-invoice {
  .search-bar {
    margin-bottom: 20px;
    background-color: #F7F8FA;
    .input-row {
      display: block;
    }
  }
}
</style>
