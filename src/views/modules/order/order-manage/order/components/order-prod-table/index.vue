<template>
  <div class="component-order-prod-table">
    <table>
      <thead>
        <tr>
          <th style="width: 500px;">
            商品
          </th>
          <th>单价</th>
          <th>数量</th>

          <!-- 预售 -->
          <template v-if="orderInfo.preSaleType===1">
            <th>定金</th>
            <th>定金膨胀</th>
            <th>尾款</th>
          </template>

          <th>优惠金额</th>
          <th>平台优惠金额</th>
          <th>总价</th>
        </tr>
      </thead>
      <tbody
        class="body-list"
      >
        <tr
          v-for="(item, index) in orderInfo.orderItems"
          :key="index"
        >
          <td>
            <div class="df">
              <div style="min-width: 60px">
                <img-show
                  :src="item.pic"
                  :img-style="{width:'60px',height:'60px'}"
                />
              </div>
              <div class="name-box">
                <span class="name">
                  <span
                    v-if="item.activityType === 5"
                    class="gift-icon"
                  >赠品</span>
                  {{ item.spuName + ' ' + (item.skuName === null?' ':item.skuName) }}
                </span>
                <!-- 处理退款状态:(1.买家申请 2.卖家接受 3.买家发货 4.卖家收货 5.退款成功  -1.退款关闭) -->
                <div
                  v-if="
                    item.returnMoneySts &&
                      item.returnMoneySts < 5 &&
                      item.returnMoneySts > 0
                  "
                  class="order-status"
                >
                  {{
                    $t("order.order.refunding")
                  }}
                </div>
                <div
                  v-if="
                    item.returnMoneySts &&
                      item.returnMoneySts === 5
                  "
                  class="order-status"
                >
                  {{
                    $t("order.order.refundsuccessfully")
                  }}
                </div>
              </div>
            </div>

            <!-- 组合 -->
            <div
              v-if="item.comboItemList"
              class="order-prod-item-give-con"
            >
              <combo-list
                :combo-list="item.comboItemList"
                tag-name="【组合】"
              />
            </div>

            <!-- 赠品 -->
            <div
              v-if="item.giveawayList"
              class="order-prod-item-give-con"
            >
              <combo-list
                :combo-list="item.giveawayList"
                tag-name="【赠品】"
              />
            </div>
          </td>
          <td>
            <span>{{ item.activityType === 5 ? '-' : formatUnitPrice(item.spuTotalAmount,item.count) }}</span>
          </td>
          <td>
            <span>{{ item.count }}</span>
          </td>

          <!-- 预售 -->
          <template v-if="orderInfo.preSaleType===1">
            <td>
              <span>{{ orderInfo.orderPreSaleInfoVO && item.activityType !== 5 ? formatPrice(orderInfo.orderPreSaleInfoVO.depositAmount, 1).toFixed(2):'-' }}</span>
            </td>

            <td>
              <span>{{ orderInfo.orderPreSaleInfoVO && item.activityType !== 5 ? formatPrice(orderInfo.orderPreSaleInfoVO.depositExpansionAmount, 1).toFixed(2) :'-' }}</span>
            </td>

            <td>
              <span>{{ orderInfo.orderPreSaleInfoVO && item.activityType !== 5 ? formatPrice(orderInfo.orderPreSaleInfoVO.balanceAmount, 1).toFixed(2) :'-' }}</span>
            </td>
          </template>

          <td>
            <span>{{ item.activityType === 5 ? '-' : formatPrice(item.shareReduce, 1).toFixed(2) }}</span>
          </td>
          <td>
            <span>{{ item.activityType === 5 ? '-' : formatPrice(item.platformShareReduce, 1).toFixed(2) }}</span>
          </td>
          <td>
            <span>{{ item.activityType === 5 ? '-' : formatPrice(item.spuTotalAmount, 1).toFixed(2) }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { formatPrice } from '@/utils/index.js'

const props = defineProps({
  dataForm: {
    type: Object,
    default: () => {
      return {}
    }
  },
  formatUnitPrice: {
    type: Function,
    default: () => {}
  },
  prodLength: {
    type: Boolean,
    default: () => {
      return false
    }
  }
})

const orderInfo = computed(() => {
  const { dataForm } = props
  return dataForm
})

</script>

<style scoped lang="scss">
@use "../order-info";
.component-order-prod-table {
  table {
    border-collapse: collapse;
    letter-spacing: 1px;
    width: 100%;
    border-spacing: inherit;
    border: 1px solid #eaecef;

    th {
      border: 1px solid #eaecef;
      padding: 8px 12px;
      color: rgb(144, 147, 153);
      font-size: 14px;
      user-select: none;
    }

    .body-list {
      tr {
        td {
          text-align: center;
          border: 1px solid #eaecef;
          padding: 8px 12px;
        }

        &:hover {
          background-color: rgb(245, 247, 250);
        }
      }
    }
  }

  // 赠品盒子
  .order-prod-item-give-con {
    width: 100%;
    padding: 10px 50px 0 63px;
  }

  .name-box {
    text-align: left;
  }
}
</style>
