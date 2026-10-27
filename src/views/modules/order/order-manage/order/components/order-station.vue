<template>
  <el-dialog
    v-model="visible"
    :title="dataForm.orderMold === 1 ? '订单核销' : $t('order.order.orderPickupS')"
    :close-on-click-modal="false"
    width="50%"
    class="component-order-station"
  >
    <div class="mod-order-orderInfo">
      <el-table
        ref="multipleTableRef"
        :data="dataList"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column
          prop="changeNum"
          :label="$t('product.pic')"
          fit
          width="100"
        >
          <template #default="scope">
            <img-show
              :src="scope.row.pic"
              :img-style="{width: '50px'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="商品名称"
          fit
        >
          <template #default="scope">
            {{ scope.row.spuName }}
            <div
              v-if="
                scope.row.returnMoneySts !== null &&
                  scope.row.returnMoneySts > 0 &&
                  scope.row.returnMoneySts < 6
              "
              class="order-status"
            >
              {{ $t("order.order.reimburse") }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="count"
          :label="$t('order.order.amountOfGoods')"
          width="100"
        />
        <el-table-column
          prop="status"
          :label="$t('product.status')"
          width="120"
        >
          <template #default="scope">
            <div v-if="dataForm.orderMold!==1">
              <el-tag
                v-if="
                  scope.row.returnMoneySts !== null &&
                    scope.row.returnMoneySts < 6 &&
                    scope.row.returnMoneySts > 0
                "
                size="default"
                type="danger"
              >
                {{
                  [
                    "",
                    $t("order.order.buyerApplication"),
                    $t("order.order.sellerAccepts"),
                    $t("order.order.buyShipment"),
                    $t("order.order.selReceiving"),
                    $t("order.order.refundsuccessfully"),
                  ][scope.row.returnMoneySts]
                }}
              </el-tag>
              <el-tag
                v-else
                size="default"
                type="danger"
              >
                <span v-if="dataForm.orderStatus === 1">{{ '待付款' }}</span>
                <span v-else-if="dataForm.orderStatus === 2">{{ '待发货' }}</span>
                <span v-else-if="dataForm.orderStatus === 3">{{ '待收货' }}</span>
                <span v-else-if="dataForm.orderStatus === 5">{{ '已收货' }}</span>
                <span v-else-if="dataForm.orderStatus === 6">{{ '交易失败' }}</span>
                <span v-else-if="dataForm.orderStatus === 7">{{ '待成团' }}</span>
              </el-tag>
            </div>
            <div v-else>
              <el-tag
                size="default"
                type="danger"
              >
                {{ dataForm.status === 3 ? '待核销' : '商品交易成功' }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-form
      v-if="dataForm.orderMold!==1"
      ref="dataFormRef"
      :model="dataForm"
      label-width="100px"
      @submit.prevent
      @keyup.enter="onSubmit()"
    >
      <div class="detail-cont">
        <div class="detail01">
          <div class="text-width">
            <el-form-item
              :label="$t('order.order.shippingInformation') + ':'"
            >
              <span>{{ $t("order.order.delType") }}：自提</span>
            </el-form-item>
            <el-form-item>
              <span>{{ $t("constant.consignee") }}：{{
                dataForm.stationUserName
              }}</span>
            </el-form-item>
            <el-form-item>
              <span>{{ $t("constant.mobilePhone") }}：{{
                dataForm.stationUserMobile
              }}</span>
            </el-form-item>
            <el-form-item>
              <span>门店地址：{{
                dataForm.stationAddress
              }}</span>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
    <el-form
      ref="dataFormRef"
      class="code-input-box"
      :model="dataForm"
      label-width="100px"
      @submit.prevent
      @keyup.enter="onSubmit()"
    >
      <div class="detail-cont">
        <el-form-item
          :label="dataForm.orderMold === 1 ? '核销码：' : $t('order.order.selfMentionCode') + '：'"
          prop="code"
        >
          <el-input
            v-model="code"
            :placeholder="dataForm.orderMold === 1 ? '请输入核销码' : $t('order.order.pleEntPickupCode')"
            style="width: 60%"
            @change="onCheckStationCode"
          />
          <el-alert
            :title="dataForm.orderMold === 1 ? '不输入核销码，默认为无需校验，当前订单全部核销' : $t('order.order.doNotEntPickupCode')"
            type="warning"
            class="code-int-tips"
            :closable="false"
          />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <span>
        <el-button
          type="primary"
          plain
          @click="visible = false"
        >{{
          $t("table.cancel")
        }}</el-button>
        <el-button
          type="primary"
          @click="onSubmit()"
        >{{
          dataForm.orderMold===1?'核销':$t("order.order.pickUp")
        }}</el-button>

        <el-button
          v-if="isShowOverWriteOff"
          type="primary"
          @click="onOverWriteOff"
        >结束核销</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/order/order'
import { ElMessage } from 'element-plus'

const emit = defineEmits([
  'refreshOrderStationDataList'
])

const visible = ref(false)
const dataForm = ref({})
const code = ref('')
const isStationCode = ref(0)
const dataList = reactive([])

// 获取数据列表
const init = (order) => {
  visible.value = true
  code.value = ''
  isStationCode.value = 0
  onClear()
  if (order.orderMold !== 1) {
    api.getStationOrderInfo({ orderId: order.orderId }).then((data) => {
      data.orderItems = data.orderItems.filter(i => i.spuMold !== 2)
      dataForm.value = data
      handleArr(dataList, data.orderItems)
    })
  } else {
    api.getVirtualOrderInfo(order.orderId).then((data) => {
      data.orderItems = data.orderItems.filter(i => i.spuMold !== 2)
      dataForm.value = data
      handleArr(dataList, data.orderItems)
    })
  }
}

const onClear = () => {
  dataForm.value.deliveryNo = 0
  dataForm.value.deliveryCompanyId = ''
}

// 校验自提码
const onCheckStationCode = () => {
  if (dataForm.value.orderMold !== 1) {
    if (code.value === dataForm.value.stationCode || !code.value) {
      isStationCode.value = 1
    } else {
      isStationCode.value = 2
    }
  }
}

// 提货事件
const onSubmit = () => {
  if (isStationCode.value === 2) {
    onShowErrorMsg($t('order.order.pickupCodeError'))
    return
  }
  if (dataForm.value.orderMold === 1) {
    api.putVirtualOrder({
      orderId: dataForm.value.orderId,
      writeOffCode: code.value
    }).then(() => {
      ElMessage({
        message: '核销成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          visible.value = false
          emit('refreshOrderStationDataList')
        }
      })
    })
  } else {
    api.putStationOrder({
      orderId: dataForm.value.orderId,
      stationId: dataForm.value.stationId
    }).then(() => {
      ElMessage({
        message: '提货成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          visible.value = false
          emit('refreshOrderStationDataList')
        }
      })
    })
  }
}

const onShowErrorMsg = (message) => {
  ElMessage({
    message,
    type: 'error',
    duration: 1500
  })
}

const isShowOverWriteOff = computed(() => {
  let bol = false
  const newTime = new Date()
  const endTime = new Date(dataForm.value.writeOffEnd)

  // 已结算并未到期的订单
  if (dataForm.value.isSettled === 1 && (newTime < endTime || !dataForm.value.writeOffEnd)) {
    bol = true
  }
  return bol
})

/**
 * 结束核销
 */
const onOverWriteOff = () => {
  api.putVirtualOrder({
    orderId: dataForm.value.orderId,
    writeOffCode: '',
    writeOffType: 1
  }).then(() => {
    ElMessage({
      message: '已结束核销',
      type: 'success',
      duration: 1500,
      onClose: () => {
        visible.value = false
        emit('refreshOrderStationDataList')
      }
    })
  })
}

defineExpose({
  init
})
</script>

<style lang="scss" scoped>
.component-order-station {
  .mod-order-orderInfo {
    height: 100%;
    width: 100%;
    font: 14px Arial, "PingFang SC", "Hiragino Sans GB", STHeiti,
    "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
    color: #495060;
  }
  .order-status {
    display: inline-block;
    margin-top: 15px;
    padding: 2px 4px;
    border: 1px solid #e43130;
    border-radius: 2px;
    color: #e43130;
    font-size: 12px;
  }
  .code-input-box {
    margin-top: 20px;
  }
  .code-input-box .code-int-tips {
    max-width: 60%;
    line-height: 1em;
    margin-top: 5px;
  }
  .code-input-box .code-int-tips :deep(.el-alert__content) {
    padding: 0;
  }
}
</style>
