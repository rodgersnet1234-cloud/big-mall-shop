<template>
  <div class="components-refund-record">
    <div
      v-if="closingSts"
      class="item"
    >
      <div class="title">
        <span>交易结束</span>
        <span>{{ closingSts }}</span>
      </div>
      <div
        v-if="refundDetail.platformMessage"
        class="form-box"
      >
        <div class="form-item">
          <span class="label">
            平台留言：
          </span>
          <span class="content">{{ refundDetail.platformMessage }}</span>
        </div>
      </div>
      <div class="time">
        {{ refundDetail.interventionFinishTime }}
      </div>
    </div>
    <div
      v-if="refundDetail.applyInterventionTime&&refundDetail.platformInterventionStatus===-1"
      class="item"
    >
      <div class="title">
        <span>买家</span>
        <span>撤销平台介入申请</span>
      </div>
      <div class="time">
        {{ refundDetail.interventionFinishTime }}
      </div>
    </div>
    <!-- 平台介入中 -->
    <div
      v-for="(intervenItem,intervenInx) in refundInterList"
      :key="intervenInx"
      class="item"
    >
      <div class="title">
        <span> {{ ['买家','商家','平台','供应商'][intervenItem.sysType] }}</span>
        <span>添加凭证</span>
      </div>
      <div class="form-box">
        <div class="form-item">
          <span class="label">
            凭证说明：
          </span>
          <span class="content">
            {{ intervenItem.voucherDesc }}
          </span>
        </div>
        <div class="mar-top form-item">
          <span class="label">
            上传凭证：
          </span>
          <div class="content">
            <imgGeneral :img-list="intervenItem.imgList" />
          </div>
        </div>
      </div>
      <div class="time">
        {{ intervenItem.createTime }}
      </div>
    </div>
    <!-- 买家申请平台介入 -->
    <div
      v-if="refundDetail.applyInterventionTime"
      class="item"
    >
      <div class="title">
        <span>买家</span>
        <span>申请平台介入</span>
      </div>
      <div class="form-box">
        <div class="form-item">
          <span class="label">
            申请理由：
          </span>
          <span class="content">
            {{ refundDetail.applyInterventionReason }}
          </span>
        </div>
        <div class="mar-top form-item">
          <span class="label">
            上传凭证：
          </span>
          <div class="content">
            <imgGeneral :img-list="applyInterventionImgs" />
          </div>
        </div>
      </div>
      <div class="time">
        {{ refundDetail.applyInterventionTime }}
      </div>
    </div>
    <!-- 拒绝 -->
    <div
      v-if="refundDetail.handelTime && refundDetail.returnMoneySts === -1"
      class="item"
    >
      <div class="title">
        <span>{{ refundDetail.closeType === 2 ?shopOrSupplierName:'买家' }}</span>
        <span>
          {{ refundDetail.closeType === 1 ? '已撤销退款':
            refundDetail.closeType === 2 ? '已拒绝退款' : '退款申请超时'
          }}{{ '，'+ $t("order.order.refundClosed") }}
        </span>
      </div>
      <div class="form-box">
        <div class="form-item">
          <span class="label">
            拒绝原因：
          </span>
          <span class="content">{{ refundDetail.rejectMessage || '-' }}</span>
        </div>
        <div class="mar-top form-item">
          <span class="label">
            {{ shopOrSupplierName }}备注：
          </span>
          <span class="content">{{ refundDetail.sellerMsg || '无' }}</span>
        </div>
        <div class="mar-top form-item">
          <span class="label">
            凭证说明：
          </span>
          <div class="content">
            <imgGeneral :img-list="rejectImgs" />
          </div>
        </div>
      </div>
      <div class="time">
        {{ refundDetail.updateTime }}
      </div>
    </div>
    <!-- 买家已撤销退款 -->
    <div
      v-if="refundDetail.returnMoneySts === -1 && refundDetail.closeType === 1"
      class="item"
    >
      <div class="title">
        <span>买家</span>
        <span>{{ $t("order.order.refundClosed") }}{{ $t("order.order.buyerHasWithdrawn") }}</span>
      </div>
      <div class="time">
        {{ refundDetail.closeTime }}
      </div>
    </div>
    <!-- 退款成功 -->
    <div
      v-if="refundDetail.returnMoneySts !== -1 && refundDetail.refundTime"
      class="item"
    >
      <div class="title">
        <span>{{ shopOrSupplierName }}</span>
        <span>{{ $t("order.order.refundsuccessfully") }}</span>
      </div>
      <div class="time">
        {{ refundDetail.refundTime }}
      </div>
    </div>
    <!-- 同意退款,等待发放退款 -->
    <div
      v-if="refundDetail.returnMoneySts !== -1 && refundDetail.decisionTime"
      class="item"
    >
      <div class="title">
        <span>{{ shopOrSupplierName }}</span>
        <span>{{ $t("order.order.agreeToRefund") }}</span>
      </div>
      <div class="time">
        {{ refundDetail.decisionTime }}
      </div>
    </div>
    <!-- 商家已处理, 等待商家退款 -->
    <div
      v-if="refundDetail.applyType === 2 && !refundDetail.receiveTime && refundDetail.isReceived === 0"
      class="item"
    >
      <div class="title">
        <span>{{ shopOrSupplierName }}</span>
        <span>已处理, 等待{{ shopOrSupplierName }}退款</span>
      </div>
      <div class="time">
        {{ refundDetail.updateTime }}
      </div>
    </div>
    <!-- 商家已收货,等待商家同意退款 -->
    <div
      v-if="refundDetail.receiveTime"
      class="item"
    >
      <div class="title">
        <span>{{ shopOrSupplierName }}</span>
        <span>已收货,等待{{ shopOrSupplierName }}同意退款</span>
      </div>
      <div class="time">
        {{ refundDetail.receiveTime }}
      </div>
    </div>
    <!-- 买家发货, 等待商家|供应商收货 -->
    <div
      v-if="refundDetail.deliveryTime"
      class="item"
    >
      <div class="title">
        <span>买家</span>
        <span>已发货,等待{{ shopOrSupplierName }}收货</span>
      </div>
      <div class="time">
        {{ refundDetail.deliveryTime }}
      </div>
    </div>
    <!-- 商家|供应商已处理, 等待商家退款 -->
    <div
      v-if="refundDetail.applyType === 1 && refundDetail.handelTime && !refundDetail.closeType && refundDetail.buyerReason !== 7"
      class="item"
    >
      <div class="title">
        <span>{{ shopOrSupplierName }}</span>
        <span>已处理, 等待{{ shopOrSupplierName }}退款</span>
      </div>
      <div class="form-box">
        <div class="form-item">
          <span class="label">
            {{ shopOrSupplierName }}备注：
          </span>
          <span class="content">{{ refundDetail.sellerMsg || '无' }}</span>
        </div>
      </div>
      <div class="time">
        {{ refundDetail.handelTime }}
      </div>
    </div>
    <!-- 商家|供应商已处理, 等待买家发货 -->
    <div
      v-if="refundDetail.applyType === 2 && refundDetail.handelTime && !refundDetail.closeType"
      class="item"
    >
      <div class="title">
        <span>{{ shopOrSupplierName }}</span>
        <span>已处理, 等待买家发货</span>
      </div>
      <div class="form-box">
        <div class="form-item">
          <span class="label">
            {{ shopOrSupplierName }}备注：
          </span>
          <span class="content">{{ refundDetail.sellerMsg || '无' }}</span>
        </div>
      </div>
      <div class="time">
        {{ refundDetail.handelTime }}
      </div>
    </div>
    <!-- 移交供应商处理 -->
    <div
      v-if="refundDetail.supplierTime"
      class="item"
    >
      <div class="title">
        <span>商家</span>
        <span>移交供应商处理</span>
      </div>
      <div class="form-box">
        <div class="form-item">
          <span class="label">
            商家备注：
          </span>
          <span class="content">{{ refundDetail.shopSellerMsg || '无' }}</span>
        </div>
      </div>
      <div class="time">
        {{ refundDetail.supplierTime }}
      </div>
    </div>
    <!-- 买家提交退款申请 -->
    <div class="item">
      <div class="title">
        <span>买家</span>
        <span>提交退款申请, 等待商家处理</span>
      </div>
      <div class="time">
        {{ refundDetail.createTime }}
      </div>
    </div>
  </div>
</template>

<script setup>
import imgGeneral from '../img-general/index.vue'

const props = defineProps({
  refundDetail: {
    type: Object,
    default: () => ({})
  }
})

// 平台介入状态 -1.没有介入 1.用户申请介入 2.平台同意介入 3.平台拒绝介入 5.平台同意退款成功
// 交易结束状态
const closingSts = computed(() => {
  switch (props.refundDetail.platformInterventionStatus) {
    case 3:
      return '平台拒绝退款'
    case 5:
      return '平台同意退款成功'
    default:
      return ''
  }
})

// 平台介入中补充凭证列表
const refundInterList = computed(() => {
  return props.refundDetail.orderRefundInterventionList?.map(item => {
    item.imgList = onHandleImgs(item.imgUrls)
    return item
  })
})

// 申请平台介入凭证
const applyInterventionImgs = computed(() => {
  return onHandleImgs(props.refundDetail.applyInterventionImgUrls)
})

// 拒绝凭证
const rejectImgs = computed(() => {
  return props.refundDetail.shopImgUrls?.split(',').map(item => {
    return import.meta.env.VITE_APP_RESOURCES_URL + item
  })
})

const shopOrSupplierName = computed(() => {
  return props.refundDetail.supplierTime ? '供应商' : '商家'
})

// 图片处理
const onHandleImgs = (imgStr) => {
  if (imgStr) {
    return imgStr.split(',').map(url => {
      return import.meta.env.VITE_APP_RESOURCES_URL + url
    })
  }
  return []
}

</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
