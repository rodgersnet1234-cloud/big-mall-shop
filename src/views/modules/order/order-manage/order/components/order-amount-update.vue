<template>
  <el-dialog
    v-model="visible"
    :title="$t('order.order.modifyOrderAmount')"
    :close-on-click-modal="false"
    width="80%"
    class="component-order-amount-update"
  >
    <div class="mod-order-orderInfo">
      <el-alert
        :title="$t('order.order.modificatioAmount')"
        type="warning"
        show-icon
      />
      <div class="main">
        <div class="content">
          <div class="prod-tit">
            <el-row style="width:100%">
              <el-col :span="21">
                <el-row>
                  <el-col
                    :span="preSaleType === 1 ? 3 : 5"
                    header-align="center"
                    align="center"
                  >
                    <span class="item">{{ $t("order.order.product") }}</span>
                  </el-col>
                  <el-col
                    :span="2"
                    header-align="center"
                    align="center"
                  >
                    <span class="item">{{ $t("order.order.unitPrice") }}</span>
                  </el-col>
                  <el-col
                    :span="2"
                    header-align="center"
                    align="center"
                  >
                    <span class="item">{{ $t("order.order.quantity") }}</span>
                  </el-col>
                  <el-col
                    :span="2"
                    header-align="center"
                    align="center"
                  >
                    <span class="item">{{ $t("order.order.totalPrice") }}</span>
                  </el-col>
                  <el-col
                    :span="2"
                    header-align="center"
                    align="center"
                  >
                    <span class="item">{{ $t("order.order.totalDiscount") }}</span>
                  </el-col>
                  <el-col
                    :span="3"
                    header-align="center"
                    align="center"
                  >
                    <span class="item">{{ $t("order.order.userPayunt") }}</span>
                  </el-col>
                  <el-col
                    :span="2"
                    header-align="center"
                    align="center"
                  >
                    <span class="item">{{ $t("order.order.platforlowance") }}</span>
                  </el-col>
                  <el-col
                    :span="2"
                    header-align="center"
                    align="center"
                  >
                    <span class="item">{{ $t("order.order.estimancome") }}</span>
                  </el-col>
                  <el-col
                    v-if="preSaleType === 1"
                    :span="2"
                    header-align="center"
                    align="center"
                  >
                    <span class="item">定金</span>
                  </el-col>
                  <el-col
                    :span="4"
                    header-align="center"
                    align="center"
                  >
                    <span class="item">{{ preSaleType === 1? '尾款' : $t("order.order.userPayunt") }}</span>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="3">
                <el-col
                  header-align="center"
                  align="center"
                >
                  <span class="item product">{{ $t("order.order.shippingAmunt") }}</span>
                </el-col>
              </el-col>
            </el-row>
          </div>
          <div class="prod">
            <div class="prod-cont prod-bottom">
              <el-row style="width:100%">
                <el-col :span="21">
                  <el-col
                    v-for="(orderItem,index) in dataList"
                    :key="index"
                    :class="index !== dataList.length - 1 ? 'bor-b' : ''"
                    class="prod-item"
                  >
                    <el-col class="prod-cont">
                      <el-row style="width:100%">
                        <el-col
                          :span="preSaleType === 1 ? 3 : 5"
                          style="height: 100%;"
                        >
                          <div class="item">
                            <span>{{ orderItem.spuName }}</span>
                            <span v-if="orderItem.skuName"> {{ orderItem.skuName }}</span>
                          </div>
                        </el-col>
                        <el-col
                          :span="2"
                          style="height: 100%;"
                        >
                          <div class="item">
                            <span>{{ formatPrice(orderItem.price, 1).toFixed(2) }}</span>
                          </div>
                        </el-col>
                        <el-col
                          :span="2"
                          style="height: 100%;"
                        >
                          <div class="item">
                            <span>{{ orderItem.count }}</span>
                          </div>
                        </el-col>
                        <el-col
                          :span="2"
                          style="height: 100%;"
                        >
                          <div class="item">
                            <span>{{ formatPrice(orderItem.spuTotalAmount, 1).toFixed(2) }}</span>
                          </div>
                        </el-col>
                        <el-col
                          :span="2"
                          style="height: 100%;"
                        >
                          <div class="item">
                            <span>{{ formatPrice(orderItem.shareReduceAmount, 1).toFixed(2) }}</span>
                          </div>
                        </el-col>
                        <el-col
                          :span="3"
                          style="height: 100%;"
                        >
                          <div class="item">
                            <span>{{ formatPrice(orderItem.actualTotalAmount, 1).toFixed(2) }}</span>
                          </div>
                        </el-col>
                        <el-col
                          :span="2"
                          style="height: 100%;"
                        >
                          <div class="item">
                            <span>{{ formatPrice(orderItem.platformShareReduceAmount, 1).toFixed(2) }}</span>
                          </div>
                        </el-col>
                        <el-col
                          :span="2"
                          style="height: 100%;"
                        >
                          <div class="item">
                            <span>{{ formatPrice(orderItem.amount, 1).toFixed(2) }}</span>
                          </div>
                        </el-col>
                        <el-col
                          v-if="preSaleType === 1"
                          :span="2"
                          style="height: 100%;"
                        >
                          <div class="item">
                            <span>{{ orderItem.depositAmount.toFixed(2) }}</span>
                          </div>
                        </el-col>
                        <el-col
                          :span="4"
                          style="height: 100%;"
                        >
                          <div class="item">
                            <el-input-number
                              v-model="orderItem.userPayAmount"
                              :precision="2"
                              :min="(orderItem.useScore && !orderItem.copyActualTotalAmount) || preSaleType === 1 ? 0 : 0.01"
                              :max="99999999"
                              :disabled="parseInt(orderItem.shopChangeFreeAmount) !== 0 || judgeAllScore(orderItem)"
                              @change="onSetUserPayAmount(index)"
                            />
                          </div>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-col>
                </el-col>
                <el-col
                  :span="3"
                  style="height:100%;"
                >
                  <div class="item">
                    <el-input-number
                      v-model="freightAmount"
                      :disabled="supplierDeliveryType === 1 || orderMold === 1 || platformFreeFreightAmount > 0 || deliveryType === 2"
                      :precision="2"
                      :min="0"
                      :max="99999999"
                    />
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span v-if="lossAmount !== 0">{{ $t("order.order.decreaslowance") }} :{{ formatPrice(lossAmount,1) }}{{ $t("constant.dollar") }}</span>
    <template #footer>
      <span>
        <el-button
          type="primary"
          @click="visible = false"
        >{{ $t("table.cancel") }}</el-button>
        <el-button
          type="primary"
          @click="onSubmit()"
        >{{ $t("table.confirm") }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import Big from 'big.js'
import * as api from '@/api/order/order'
import { formatPrice } from '@/utils/index.js'
import { ElLoading as Loading, ElMessage } from 'element-plus'

const emit = defineEmits([
  'refreshOrderAmountUpdate'
])

const freightAmount = ref(0)
const lossAmount = ref(0)
const orderId = ref(0)
const preSaleType = ref(null)
const submit = ref(false)
const visible = ref(false)
const dataList = reactive([])

// 获取数据列表
const dataListLoading = ref(false)
const deliveryType = ref(0)
const orderMold = ref(0)
const platformFreeFreightAmount = ref(0)
const supplierDeliveryType = ref(0)
const init = (orderVal) => {
  orderId.value = orderVal.orderId
  submit.value = false
  dataListLoading.value = true
  api.orderInfo(orderId.value).then((data) => {
    supplierDeliveryType.value = data.supplierDeliveryType
    orderMold.value = data.orderMold
    deliveryType.value = data.deliveryType
    platformFreeFreightAmount.value = data.platformFreeFreightAmount
    freightAmount.value = new Big(data.freightAmount - data.platformFreeFreightAmount).div(100)
    lossAmount.value = 0
    // 订单项
    handleArr(dataList, data.orderItems)
    dataList.forEach(orderItem => {
      orderItem.userPayAmount = new Big(orderItem.actualTotal).div(100)
      orderItem.lossAmount = 0.00
      const shareReduceAmount = orderItem.shareReduce || 0
      const actualTotalAmount = orderItem.actualTotal || 0
      const platformShareReduceAmount = orderItem.platformShareReduce || 0
      orderItem.shareReduceAmount = shareReduceAmount || 0
      orderItem.actualTotalAmount = actualTotalAmount || 0
      orderItem.copyActualTotalAmount = actualTotalAmount || 0
      orderItem.platformShareReduceAmount = platformShareReduceAmount || 0
      const actual = new Big(orderItem.actualTotalAmount)
      orderItem.amount = actual.plus(orderItem.platformShareReduce).round(2)

      // 定金预售
      orderItem.preSaleType = data.preSaleType
      if (data && data.preSaleType === 1) {
        orderItem.depositAmount = new Big(data.orderPreSaleInfoVO.depositAmount).div(100)
        orderItem.userPayAmount = new Big(data.orderPreSaleInfoVO.balanceAmount).div(100)
      }
    })
    preSaleType.value = data.preSaleType
    visible.value = true
    dataListLoading.value = false
  })
}

/**
 * 判断是否为纯积分订单，是则不允许修改支付金额
 * @param item
 */
const judgeAllScore = (item) => {
  return item.actualTotal === 0 && item.useScore > 0
}

// 订单金额变化时，计算优惠金额
const onSetUserPayAmount = (index) => {
  const item = dataList[index]
  if (!item.userPayAmount) {
    item.userPayAmount = 0
    dataList[index] = item
  }
  const userPayAmount = new Big(item.userPayAmount).times(100)
  if (userPayAmount >= item.actualTotal) {
    item.lossAmount = 0
    item.shareReduceAmount = item.shareReduce || 0
    item.actualTotalAmount = userPayAmount
    item.platformShareReduceAmount = item.platformShareReduce || 0
    item.amount = new Big(item.actualTotalAmount).plus(item.platformShareReduce).round(2)
  } else {
    const changeAmount = new Big(item.actualTotal).minus(userPayAmount)
    const actualTotal = new Big(item.actualTotal)
    const platformShareReduceAmount = new Big(item.platformShareReduce)
    // 金额减少比例 = 减少金额 % 总金额
    const proportion = changeAmount.div(item.spuTotalAmount).round(6)
    // 平台优惠金额减少金额 = 减少比例 * 原平台优惠金额
    const platformAmount = proportion.times(platformShareReduceAmount).round(0)
    // 平台优惠金额 = 原平台优惠金额 - 平台优惠金额减少金额
    item.platformShareReduceAmount = platformShareReduceAmount.minus(platformAmount)
    // 总优惠金额 = 变化金额 + 原总优惠金额
    item.shareReduceAmount = changeAmount.plus(item.shareReduce)
    // 实际金额 = 原实际金额 - 变化金额
    item.actualTotalAmount = actualTotal.minus(changeAmount)
    // 店铺预计收入金额 = 实际金额 + 平台优惠金额
    item.amount = item.actualTotalAmount.plus(item.platformShareReduceAmount).round(2)
    // 店铺损失金额 = 平台优惠金额减少金额
    item.lossAmount = platformAmount
  }
  // 计算店铺亏损总金额
  let tempLossAmount = new Big(0)
  dataList.forEach(item => {
    tempLossAmount = tempLossAmount.plus(item.lossAmount)
  })
  lossAmount.value = tempLossAmount
  dataList[index] = item
}

// 校验金额
const onCheck = () => {
  const checkActualTotal = dataList.forEach(orderItem => {
    if ((orderItem.useScore && !orderItem.newactualTotalAmount) ? (orderItem.actualTotal < 0) : (orderItem.actualTotal <= 0)) {
      return true
    }
  })
  if (checkActualTotal) {
    onShowErrorMsg($t('order.order.theOraterThan0'))
    return true
  }
  if (!freightAmount.value && freightAmount.value !== 0) {
    onShowErrorMsg('运费金额不能为空')
    return true
  }
  return false
}

// 确定事件
const onSubmit = () => {
  if (onCheck()) {
    return
  }
  const tempDataList = JSON.parse(JSON.stringify(dataList))
  tempDataList.forEach(item => {
    if (!item.userPayAmount) {
      item.userPayAmount = 0
    }
    delete item.copyActualTotalAmount
    item.changeAmount = new Big(item.userPayAmount).times(100)
  })
  if (submit.value) {
    return
  }
  submit.value = true
  api.changeAmount({
    orderId: orderId.value,
    orderItems: tempDataList,
    freightAmount: new Big(freightAmount.value).times(100)
  }).then(() => {
    const loadingInstance = Loading.service({
      target: document.getElementsByClassName('mod-order-orderInfo')[0]
    })
    setTimeout(() => {
      emit('refreshOrderAmountUpdate')
      visible.value = false
      loadingInstance.close()
    }, 1200)
    ElMessage({
      message: '修改金额成功',
      type: 'success',
      duration: 1500
    })
  }).catch(() => {
    submit.value = false
  })
}

const onShowErrorMsg = (message) => {
  ElMessage({
    message,
    type: 'error',
    duration: 1500
  })
}

defineExpose({
  init
})
</script>

<style lang="scss" scoped>
.component-order-amount-update {
  .mod-order-orderInfo {
    height: 100%;
    width: 100%;
    font: 14px Arial, "PingFang SC", "Hiragino Sans GB", STHeiti,
    "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
    color: #495060;
  }
  .prod-tit {
    padding: 10px;
    background: #f7f8fa;
    height: 49px;
    display: flex;
    align-items: center;
    border: 1px solid #eeeeee;
  }
  .item {
    text-align: center;
    padding: 10px;
    line-height: 22px;
  }
  .prod {
    border-left: 1px solid #eeeeee;
    border-right: 1px solid #eeeeee;
    border-bottom: 1px solid #eeeeee;
    .prod-item {
      border-bottom: 1px solid #eeeeee;
      border-right: 1px solid #eeeeee;

      :deep(.el-row) {
        .el-col {
          &:nth-last-child(1) {
            min-width: 150px;
          }
          &:last-child {
            min-width: 150px;
          }
        }
      }
    }
  }
  /* 运费输入框 居中 */
  .prod-cont :deep(.el-row) {
    display: flex;
    align-items: center;
  }

  .item :deep(.el-input-number) {
    margin: 5px 0;
  }

  .item :deep(.el-input-number--medium) {
    width: 100%
  }
}
.item {
  display: flex;
  width: 100%;
}
</style>
