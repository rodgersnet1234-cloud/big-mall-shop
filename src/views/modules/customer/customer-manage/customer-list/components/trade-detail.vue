<template>
  <div class="component-trade-detail">
    <el-table
      v-loading="pageLoading"
      :data="dataList"
      header-cell-class-name="table-header"
      row-class-name="table-row-low"
      style="width: 100%"
    >
      <!-- 支付时间 -->
      <el-table-column
        prop="payTime"
        :label="$t('customer.customerManager.payTime')"
        width="160"
      >
        <template #default="scope">
          <span>{{ scope.row.payTime ? scope.row.payTime : '-' }}</span>
        </template>
      </el-table-column>
      <!-- 订单id -->
      <el-table-column
        prop="orderId"
        :label="$t('order.order.orderId')"
        width="180"
      />
      <!-- 商品总额 -->
      <el-table-column
        prop="total"
        :label="$t('customer.customerManager.prodTotalPrice')"
      />
      <!-- 订单运费 -->
      <el-table-column
        prop="freightAmount"
        :label="$t('customer.customerManager.orderFreight')"
      />
      <!-- 实付金额 -->
      <el-table-column
        prop="actualTotal"
        :label="$t('order.order.actualAmount')"
      />
      <!-- 优惠金额 -->
      <el-table-column
        prop="reduceAmount"
        :label="$t('order.order.preferentialAmount')"
      />
      <!-- 支付积分 -->
      <el-table-column
        prop="orderScore"
        :label="$t('customer.customerManager.payScore')"
      >
        <template #default="scope">
          <span
            v-if="scope.row.orderScore"
            class="table-cell-text"
          >
            {{ scope.row.orderScore }}
          </span>
          <span
            v-else
            class="table-cell-text"
          >0</span>
        </template>
      </el-table-column>
      <!-- 订单类型 -->
      <el-table-column
        prop="orderType"
        :label="$t('order.order.orderType')"
      >
        <template #default="{row}">
          <span>{{
            ['普通订单','团购订单','秒杀订单','积分订单'][row.orderType]
          }}</span>
        </template>
      </el-table-column>
      <!-- 支付方式 -->
      <el-table-column
        prop="payType"
        :label="$t('order.order.paymentMethod')"
        align="center"
      >
        <template #default="scope">
          <span v-if="scope.row.payType || scope.row.payType === 0">{{
            [
              $t("order.order.pointsPayment"),
              $t("order.order.wecProPay"),
              $t("order.order.alipayPCPayment"),
              $t("order.order.wechatScanCodePayment"),
              $t("order.order.wechatH5Payment"),
              $t("order.order.weclAccountPay"),
              $t("order.order.alipayH5Payment"),
              $t("order.order.alipayAPPPayment"),
              $t("order.order.wechatAPPPayment"),
              $t("order.order.balancePayment"),
            ][scope.row.payType]
          }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页条 -->
    <pagination
      v-show="page.total>0"
      v-model:page="page.pageNum"
      v-model:limit="page.pageSize"
      :total="page.total"
      @pagination="onGetData()"
    />
  </div>
</template>

<script setup>
import Big from 'big.js'
import * as api from '@/api/customer/customer-manager'
import Pagination from '@/components/Pagination/index.vue'

let userId = null
const divTimes = 100 // 缩小倍数

// 返回参数
const dataList = reactive([])
const page = reactive({
  pageSize: 10,
  pageNum: 1,
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})

const init = (id) => {
  userId = id
  onGetData()
}

// 获取数据
const pageLoading = ref(true)
const onGetData = () => {
  if (!userId) {
    return
  }
  pageLoading.value = true
  api.tradeDetail({
    pageNum: page.pageNum,
    pageSize: page.pageSize,
    userId
  }).then(data => {
    data.list.forEach(item => {
      item.total = bigDivide(item.total, divTimes)
      item.freightAmount = bigDivide(item.freightAmount, divTimes)
      item.actualTotal = bigDivide(item.actualTotal, divTimes)
      item.reduceAmount = bigDivide(item.reduceAmount, divTimes)
    })
    handleArr(dataList, data.list)
    page.total = data.total
    page.pages = data.pages
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

// 精度运算-除法
const bigDivide = (a, b) => {
  if (a == null) {
    return ''
  }
  const y = new Big(b)
  return new Big(a).div(y).valueOf()
}

defineExpose({
  init
})
</script>

<style lang="scss" scoped>
</style>
