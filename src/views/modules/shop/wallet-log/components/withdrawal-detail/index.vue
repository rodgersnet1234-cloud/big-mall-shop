<template>
  <el-dialog
    v-model="visible"
    :close-on-click-modal="false"
    title="提现信息"
  >
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
    <el-form
      :model="dataForm"
      label-width="140px"
      @submit.prevent
    >
      <el-form-item label="提现金额：">
        <span>{{ amount(dataForm.amount) }}</span> 元
      </el-form-item>
      <el-form-item label="到账银行：">
        <span>{{ dataForm.shopBankCard.bankName }}</span>
      </el-form-item>
      <el-form-item label="账户名：">
        <span>{{ dataForm.shopBankCard.recipientName }}</span>
      </el-form-item>
      <el-form-item label="账号：">
        <span>{{ dataForm.shopBankCard.cardNo }}</span>
      </el-form-item>
      <el-form-item label="支行名称：">
        <span>{{ dataForm.shopBankCard.bankName }}</span>
      </el-form-item>
      <el-form-item label="商家备注：">
        <span style="word-break: break-word;">{{ dataForm.shopRemarks }}</span>
      </el-form-item>
      <el-form-item
        v-if="paySettlementType !== 1"
        label="审核状态："
      >
        <el-tag
          v-if="dataForm.status === -1"
          type="danger"
        >
          未通过
        </el-tag>
        <el-tag
          v-if="dataForm.status === 1"
          type="success"
        >
          已通过
        </el-tag>
        <el-tag
          v-else-if="dataForm.status === 0"
        >
          未审核
        </el-tag>
        <el-tag
          v-else-if="dataForm.status === 2"
          type="success"
        >
          发放成功
        </el-tag>
        <el-tag
          v-else-if="dataForm.status === 3"
          type="error"
        >
          发放失败
        </el-tag>
      </el-form-item>
      <el-form-item
        v-if="dataForm.status !== 0 && dataForm.payingAccount!==null && paySettlementType !== 1"
        :label="'付款户名：'"
      >
        <span>{{ dataForm.payingAccount }}</span>
      </el-form-item>
      <el-form-item
        v-if="dataForm.status !== 0 && dataForm.payingCardNo!==null && paySettlementType !== 1"
        label="付款账号："
      >
        <span>{{ dataForm.payingCardNo }}</span>
      </el-form-item>
      <el-form-item
        v-if="dataForm.status !== 0 && dataForm.payingTime!==null && paySettlementType !== 1"
        :label="'付款日期：'"
      >
        <span>{{ dataForm.payingTime }}</span>
      </el-form-item>
      <el-form-item
        v-if="dataForm.status !== 0 && paySettlementType !== 1"
        :label="'平台备注：'"
      >
        <span style="word-break: break-word;">{{ dataForm.remarks }}</span>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import Big from 'big.js'

const amount = (value) => {
  if (!value) {
    return ''
  }
  return new Big(value).div(100).toFixed(2)
}

const allinPayStore = useAllinpayStore()
const paySettlementType = ref(allinPayStore.paySettlementType) // 是否开启通联支付 1：开启 0：关闭
const visible = ref(false)
const dataForm = ref({
  status: 0,
  payingAccount: '', // 付款户名
  payingCardNo: '', // 付款账号
  payingTime: '', // 付款日期
  shopBankCard: {} // 银行的信息
})

const init = (rowData) => {
  dataForm.value = Object.assign({}, rowData)
  dataForm.value.shopBankCard = Object.assign({}, rowData.shopBankCardVO)
  if (dataForm.value.payingTime) {
    dataForm.value.payingTime = dataForm.value.payingTime.substr(0, 10)
  }
  visible.value = true
}
defineExpose({
  init
})

</script>
