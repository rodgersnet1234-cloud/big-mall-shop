<template>
  <!-- 仅退款 -->
  <div
    v-if="refundDetail.applyType === 1 && platInterveneSts ===-1"
    class="steps-box"
  >
    <el-steps
      :active="onlyRefundStepsStatus"
      align-center
      :process-status="onlyRefundProcessStatus"
    >
      <el-step
        :title="
          $t('order.order.buyer') +
            $t('order.order.requestARefund')
        "
      />
      <el-step
        :title=" $t('order.order.merchant') +
          $t('order.order.confirmTreatmented')"
      />
      <el-step :title="$t('order.order.refundsuccessfully')" />
    </el-steps>
  </div>
  <div
    v-if="refundDetail.applyType === 2 && platInterveneSts ===-1"
    class="steps-box"
  >
    <el-steps
      :active="stepsStatus"
      align-center
      :process-status="refundDetail.returnMoneySts === -1 ? 'error' : 'wait'"
    >
      <el-step
        :title="
          $t('order.order.buyer') +
            $t('order.order.requestARefundT')
        "
      />
      <el-step
        :title="
          $t('order.order.merchant') +
            $t('order.order.confirmTreatmented')
        "
      />

      <el-step :title="$t('order.order.shipped')" />
      <el-step
        :title="
          $t('order.order.merchant') +
            $t('order.order.confirmSuccess')
        "
      />
      <el-step :title="$t('order.order.refundsuccessfully')" />
    </el-steps>
  </div>
  <!-- 平台介入 -->
  <div
    v-if="platInterveneSts !==-1"
    class="steps-box"
  >
    <el-steps
      :active="platInterStepsActive"
      align-center
    >
      <el-step
        :title="
          $t('order.order.buyer') +
            $t('order.order.requestARefund')
        "
      />
      <el-step
        :title=" $t('order.order.merchant') +
          $t('order.order.confirmTreatmented')"
      />
      <el-step
        title="平台介入中"
        :status="platInterveneStepStatus"
      />
      <el-step
        :title="$t('order.order.refundsuccessfully')"
        :status="platInterveneSts===5?'':'wait'"
      />
    </el-steps>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  refundDetail: {
    type: Object,
    default: () => ({})
  }
})

const onlyRefundStepsStatus = computed(() => {
  let index = 0
  if (props.refundDetail.handelTime) {
    index++
  }
  if (props.refundDetail.cancelTime || props.refundDetail.refundTime || props.refundDetail.rejectTime) {
    index += 2
  }
  return index
})

const onlyRefundProcessStatus = computed(() => {
  switch (props.refundDetail.returnMoneySts) {
    case 1:
    case 2:
      return 'finish'
    case 5:
      return 'success'
    default:
      return 'error'
  }
})

const stepsStatus = computed(() => {
  let index = 1
  if (props.refundDetail.handelTime) {
    index++
  }
  if (props.refundDetail.deliveryTime) {
    index++
  }
  if ((props.refundDetail.deliveryTime && props.refundDetail.closeTime && props.refundDetail.closeType === 2) || props.refundDetail.receiveTime || props.refundDetail.returnMoneySts === 5) {
    index++
  }
  // 退款成功的情况下进度条也要加2
  if (props.refundDetail.returnMoneySts === 5) {
    index += 2
  }
  return index
})

const platInterveneSts = computed(() => props.refundDetail.platformInterventionStatus || -1) // 平台介入状态
const platInterStepsActive = computed(() => {
  let index = 0
  if (props.refundDetail.handelTime) {
    index++
  }
  if (platInterveneSts.value !== -1) {
    index++
  }
  if (platInterveneSts.value === 3) {
    index++
  }
  if (platInterveneSts.value === 5) {
    index += 2
  }
  return index
})

// 进度条平台介入 平台介入状态 -1.没有介入 1.用户申请介入 2.平台同意介入 3.平台拒绝介入 5.平台同意退款成功
const platInterveneStepStatus = computed(() => {
  switch (platInterveneSts.value) {
    case 1:
      return 'wait'
    case 3:
      return 'error'
    default:
      return 'finish'
  }
})
</script>

<style scoped>
.steps-box{
  width: 100%;
}
</style>
