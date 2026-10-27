<template>
  <!-- 充值记录 -->
  <div class="component-recharge">
    <!-- 充值金额记录table -->
    <el-table
      :data="tableData"
      header-cell-class-name="table-header"
      row-class-name="table-row"
    >
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="250"
      />
      <el-table-column
        prop="createTime"
        label="充值日期"
        align="center"
      />
      <el-table-column
        prop="shopChangeAmount"
        label="充值金额"
        align="center"
      >
        <template #default="{row}">
          <span v-text="bigActualTotal(row.shopChangeAmount,100)" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页条 -->
    <pagination
      v-model:current-page="params.pageNum"
      v-model:page-size="params.pageSize"
      style="text-align: right"
      :total="total"
      @pagination="onPagination"
    />
  </div>
</template>

<script setup>
import { rechargeList } from '@/api/multishop/shop_wallet_log.js'
import Pagination from '@/components/Pagination/index.vue'
import Big from 'big.js'

const tableData = ref([])
const total = ref(0)
const params = {
  pageNum: 1,
  pageSize: 10
}

onMounted(() => {
  getData()
})

const getData = () => {
  rechargeList(params).then(res => {
    tableData.value = res.list
    total.value = res.total
  })
}
// 点击分页
const onPagination = (page) => {
  params.pageNum = page.pageNum
  params.pageSize = page.pageSize
  getData()
}
// 精度运算-除法
const bigActualTotal = (a, b) => {
  if (a == null) {
    return ''
  }
  return new Big(a).div(b).valueOf()
}

</script>
