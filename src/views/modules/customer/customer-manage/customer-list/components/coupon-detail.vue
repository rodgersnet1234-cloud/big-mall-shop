<template>
  <div class="component-coupon-detail">
    <div>
      <el-select
        v-model="status"
        clearable
        style="margin-bottom:20px"
        @change="onChangeStatus()"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <el-table
      v-loading="pageLoading"
      :data="dataList"
      header-cell-class-name="table-header"
      row-class-name="table-row-low"
      style="width: 100%;"
    >
      <el-table-column
        prop="receiveTime"
        :label="$t('customer.customerManager.getCouponTime')"
        align="center"
      />
      <el-table-column
        :label="$t('coupon.coupon.couponName')"
        align="center"
      >
        <template #default="{row}">
          <div>
            <span>{{ row.couponVO.couponName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('coupon.coupon.couponType')"
        align="center"
      >
        <template #default="{row}">
          <span>{{
            [
              $t("coupon.coupon.cashCoupon"),
              $t("coupon.coupon.discountVoucher"),
              $t("coupon.coupon.coinCertificate"),
            ][row.couponVO.couponType - 1]
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="score"
        :label="$t('customer.customerManager.effectiveTime')"
        width="350"
        align="center"
      >
        <template #default="{row}">
          <div>
            <span>{{ row.userStartTime }} {{ $t("date.tip") }} {{ row.userEndTime }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        :label="$t('coupon.coupon.couponStatus')"
        align="center"
      >
        <template #default="{row}">
          <span>{{
            [$t("customer.customerManager.invalid"),
             $t("customer.customerManager.notUsed"),
             $t("customer.customerManager.used")][ row.status ]
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('customer.customerManager.userRules')"
        align="center"
      >
        <template #default="{row}">
          <div v-if="row.couponVO.couponType === 1">
            <span>{{ $t("coupon.coupon.full") }}{{ conversionActual(row.couponVO.cashCondition) }}{{ $t("coupon.coupon.reduce") }}{{ conversionActual(row.couponVO.reduceAmount) }}</span>
          </div>
          <div v-if="row.couponVO.couponType === 2">
            <span>{{
              $t("customer.customerManager.discountMsg")
                .replace("PRICE", conversionPrice(row.couponVO.cashCondition))
                .replace("FOLD", row.couponVO.couponDiscount)
            }}</span>
          </div>
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
import * as api from '@/api/coupon/coupon'
import Pagination from '@/components/Pagination/index.vue'

let userId = null
const options = [{
  value: 0,
  label: $t('customer.customerManager.invalid')
}, {
  value: 1,
  label: $t('customer.customerManager.notUsed')
}, {
  value: 2,
  label: $t('customer.customerManager.used')
}]

const status = ref(null)
const dataList = reactive([])
const page = reactive({
  pageSize: 10,
  pageNum: 1,
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})

const conversionActual = (val) => {
  // 精度运算-除法
  if (val == null) {
    return ''
  }
  return new Big(val).div(100).toFixed(2).valueOf() + '元'
}

const init = (id) => {
  userId = id
  status.value = null
  onGetData()
}

// 获取数据
const pageLoading = ref(true)
const onGetData = () => {
  if (!userId) {
    return
  }
  pageLoading.value = true
  api.pageCustomerCoupon({
    pageNum: page.pageNum,
    pageSize: page.pageSize,
    userId,
    status: status.value
  }).then(data => {
    handleArr(dataList, data.list)
    page.total = data.total
    page.pages = data.pages
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

const onChangeStatus = () => {
  page.pageNum = 1
  onGetData()
}

const conversionPrice = (val) => {
  // 精度运算-除法
  if (val == null) {
    return ''
  }
  return new Big(val).div(100).toFixed(2).valueOf()
}

defineExpose({
  init
})
</script>
