<template>
  <div class="prod-item component-order-prod-card">
    <div
      v-for="orderItem in orderInfo.orderItems"
      :key="orderItem.orderItemId"
      class="items name"
    >
      <div
        :class="['info']"
      >
        <div class="prod-image">
          <img-show
            :src="orderItem.pic"
            :img-style="{width:'80px',height:'80px'}"
          />
        </div>
        <div class="prod-name">
          <div class="prod-con">
            <div class="prod-name-txt">
              {{ orderItem.spuName + ' ' + (orderItem.skuName ? orderItem.skuName : '') }}
            </div>
            <div
              v-if="orderInfo.orderType === 1 || orderInfo.orderType === 2"
              class="order-status"
            >
              {{
                orderInfo.orderType === 1
                  ? $t("order.order.groupPurchaseOrder")
                  : orderInfo.orderType === 2
                    ? $t("order.order.spikeOrder")
                    : ""
              }}
            </div>
            <!-- 预售订单 -->
            <div
              v-if="orderInfo.preSaleType===0||orderInfo.preSaleType===1"
              class="order-status"
            >
              预售订单
            </div>
            <div
              v-if="!orderItem.refundStatus || (orderItem.refundStatus !== 2 && orderItem.refundStatus !== 3)"
              class="order-status"
            >
              {{
                orderItem.status === 0 && orderInfo.status === 2
                  ? $t("order.order.pendingReceipt")
                  : [
                    "",
                    $t("pay.obligation"),
                    orderInfo.waitPurchase === 1 ? $t("order.order.toBePurchased") : orderItem.beDeliveredNum === 0 ? $t("order.order.shipmentCompleted"):$t("order.order.toBeShipped"),
                    $t("order.order.pendingReceipt"),
                    "",
                    $t("order.order.successfulTransaction"),
                    $t("order.order.transactionFailed"),
                    $t("group.waitGroup"),
                    '',
                    '待付尾款'
                  ][orderInfo.status]
              }}
            </div>
            <div
              v-else
              class="order-status"
            >
              {{ $t("order.order.transactionFailed") }}
            </div>

            <div
              v-if="orderInfo.supplierId"
              class="order-status color-primary"
            >
              {{ $t("order.order.supplierGoods") }}
            </div>
            <div
              v-if="orderInfo.deliveryType === 2 || orderInfo.deliveryType === 4"
              class="order-status"
            >
              {{
                orderInfo.deliveryType === 2
                  ? $t("order.order.selfMention")
                  : orderInfo.deliveryType === 4
                    ? $t("order.order.sameCityDelivery")
                    : ""
              }}
            </div>
            <div
              v-if="orderInfo.preSaleTime"
              class="order-status"
            >
              {{ $t("order.order.estimatedShippingTime") }}：{{
                orderInfo.preSaleTime
              }}
            </div>
            <!-- 是否为虚拟商品订单 -->
            <div
              v-if="orderInfo.orderMold===1"
              class="order-status"
            >
              虚拟商品订单
            </div>
            <div
              v-if="orderInfo.orderMold===3"
              class="order-status"
            >
              电子卡券订单
            </div>
          </div>
        </div>
        <div class="prod-price">
          <span>{{ formatPrice(orderItem.price, 1).toFixed(2) }}</span>
          <span>{{ orderItem.count }}{{ $t("constant.piece") }}</span>
        </div>
      </div>

      <!-- 组合信息 -->
      <div
        v-if="orderItem.comboList"
        class="order-prod-item-give-con"
      >
        <combo-list
          :combo-list="orderItem.comboList"
          tag-name="【组合】"
        />
      </div>

      <!-- 赠品信息 -->
      <div
        v-if="orderItem.giveawayList"
        class="order-prod-item-give-con"
      >
        <combo-list
          :combo-list="orderItem.giveawayList"
          tag-name="【赠品】"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatPrice } from '@/utils/index.js'

const props = defineProps({
  order: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const orderInfo = computed(() => {
  const { order } = props
  return order
})

</script>

<style scoped lang="scss">
.prod-tit span {
  margin-right: 15px;
}

.prod-item {
  display: flex;
  flex-direction: column;
  border-right: 1px solid #ebedf0;
  height: 100%;
}

.prod-name {
  width: 55%;
  text-align: left;
}

.prod-con {
  display: block;
  padding: 0 !important;
}

.prod-con .prod-name-txt {
  display: -webkit-box;
  max-width: 100%;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  word-break: break-word;
  word-wrap: break-word;
}

.prod-price {
  position: absolute;
  right: 10px;
  text-align: center;
}

.prod-price span {
  display: block;
}

.prod-price span:first-child {
  margin-bottom: 10px;
}

.order-status {
  display: inline-block;
  margin-top: 15px;
  margin-right: 4px;
  padding: 2px 4px;
  border: 1px solid #e43130;
  border-radius: 2px;
  color: #e43130;
  font-size: 12px;
}

.color-primary {
  color: #155bd4;
  border-color: #155bd4;
}

.prod-cont .items.name {
  display: flex;
  align-items: center;
  position: relative;
  height: 100%;
  width: 100%;
  border-bottom: 1px solid #ebedf0;
  flex-direction: column;
}

.prod-cont .items.name:last-child {
  border-bottom: none;
}

.info {
  display: flex;
  align-items: center;
  padding: 10px;
  width: 100%;
}

.prod-image {
  margin-right: 20px;
  width: 80px;
  height: 80px;
}

// 赠品盒子
.order-prod-item-give-con {
  width: 100%;
  padding: 0 50px 10px 103px;
}

.component-order-prod-card {
  .info {
    &:last-child {
      border-bottom: none;
    }
  }
}

</style>
