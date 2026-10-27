<template>
  <div
    v-if="paySettlementType===1"
    class="component-alert-tips"
  >
    <el-alert
      v-if="(companyInfoProcessStatus === 3 && auditStatus===-1) || companyInfoProcessStatus === 0"
      :title="companyInfoProcessStatus === 0?`平台开启通联支付，请重新提交工商信息与财务信息`:`您的开店申请未通过！原因是：${statusRemark}`"
      type="error"
      show-icon
      style="margin-bottom: 20px;"
    />
    <el-alert
      v-else-if="companyInfoProcessStatus === 3 && auditStatus===0"
      :title="`已保存工商信息，请确认并提交财务信息`"
      type="error"
      show-icon
      style="margin-bottom: 20px;"
    />
    <el-alert
      v-else-if="idCardCollectProcessStatus !== 4 && (shopStatus===3 || shopStatus===5)"
      :title="`当前影印件状态异常，可在工商信息中刷新影印件状态`"
      type="error"
      show-icon
      style="margin-bottom: 20px;"
    />
  </div>
</template>

<script setup>
defineProps({
  companyInfoProcessStatus: {
    type: Number,
    default: 0
  },
  auditStatus: {
    type: Number,
    default: 0
  },
  statusRemark: {
    type: String,
    default: ''
  },
  shopStatus: {
    type: Number,
    default: 0
  },
  idCardCollectProcessStatus: {
    type: Number,
    default: 0
  }
})

const userStore = useUserStore()
const paySettlementType = userStore.paySettlementType // 1：通联支付

</script>
