<template>
  <!-- 财务对账 -->
  <div class="component-withdrawal">
    <div
      v-if="paySettlementType!==1"
      class="search-bar"
    >
      <!-- native modifier has been removed, please confirm whether the function has been affected  -->
      <el-form
        :inline="true"
        :model="params"
        @submit.prevent
      >
        <el-form-item label="提现状态：">
          <el-select
            v-model="params.status"
            clearable
            placeholder="提现状态"
          >
            <el-option
              v-for="item in status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit(true)"
          >
            查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="list">
      <el-table
        :data="tableData"
        header-cell-class-name="table-header"
        row-class-name="table-row"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="80"
        />
        <el-table-column
          prop="createTime"
          label="提现时间"
          align="center"
        />
        <el-table-column
          prop="amount"
          label="提现金额"
          align="center"
        >
          <template #default="scope">
            <span>{{ centToYuan(scope.row.amount) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="paySettlementType!==1"
          prop="shopRemarks"
          label="提现状态"
          align="center"
        >
          <template #default="scope">
            <span>{{ [ '未通过','未审核','已通过'][scope.row.status+1] }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="paySettlementType===1"
          prop="amount"
          label="提现金额"
          align="center"
        />
        <el-table-column
          prop="operation"
          label="操作"
          align="center"
        >
          <template #default="scope">
            <!-- native modifier has been removed, please confirm whether the function has been affected  -->
            <el-button
              v-permission="['shop:shopCash:cashInfo']"
              type="primary"
              link
              @click.prevent="clickDetail(scope.row)"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <withdrawal-detail
      v-if="isShowDetail"
      ref="detailRef"
    />
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
import withdrawalDetail from '../withdrawal-detail/index.vue'
import { withdrawCashList, withdrawCashBankInfo } from '@/api/multishop/shop_wallet_log.js'
import Big from 'big.js'
const params = reactive({
  pageNum: 1,
  pageSize: 10,
  status: ''
})
const allinPayStore = useAllinpayStore()
const paySettlementType = allinPayStore.paySettlementType // 是否开启通联支付 1：开启 0：关闭

const status = computed(() => {
  return [
    {
      value: -1,
      label: '未通过'
    }, {
      value: 0,
      label: '未审核'
    }, {
      value: 1,
      label: '已通过'
    }
  ]
})
const tableData = ref([])

const centToYuan = (value) => {
  if (value) {
    return new Big(value).div(100).toFixed(2)
  }
  return 0
}

onMounted(() => {
  getData()
})

const onPagination = (page) => {
  params.pageNum = page.pageNum
  params.pageSize = page.pageSize
  getData()
}
const onSubmit = (newData = false) => {
  getData(newData)
}
let tempSearchForm = ''
const dataFrom = ref('')
const total = ref(0)
const getData = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...dataFrom.value, ...params }
  } else {
    tempSearchForm.pageNum = params.pageNum
    tempSearchForm.pageSize = params.pageSize
  }
  withdrawCashList(tempSearchForm).then(data => {
    tableData.value = data.list
    total.value = data.total
  })
}
const detailRef = ref('')
const isShowDetail = ref(false)
const clickDetail = (data) => {
  nextTick(() => {
  // 使用cashId获取退款详情
    withdrawCashBankInfo(data.cashId).then(res => {
      detailRef.value?.init(res)
    })
  })
  isShowDetail.value = true
}

defineExpose({ getData })
</script>

<style lang="scss" scoped>
.component-withdrawal {
  .list{
    padding: 20px 0;
  }
}
</style>
