<template>
  <el-dialog
    v-model="visible"
    :title="$t('order.order.orderShipping')"
    :close-on-click-modal="false"
    width="50%"
    class="component-order-delivery-update"
  >
    <div class="order-shipping-con">
      <div class="mod-order-orderInfo">
        <el-table
          ref="multipleTableRef"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          tooltip-effect="dark"
          style="width: 100%;min-width:700px"
          @selection-change="onSelectSome"
        >
          <el-table-column
            type="selection"
            width="55"
            :selectable="onCheckSelectable"
          />
          <el-table-column
            :label="$t('constant.product')"
            fit
          >
            <template #default="{row}">
              <span
                v-if="row.activityType === 5 && row.activityId !== 0"
                class="gift-icon"
              >赠品</span>
              {{ row.spuName + ' ' + (row.skuName === null?' ':row.skuName) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="beDeliveredNum"
            align="center"
            :label="$t('order.order.beDeliveredNum')"
            width="150"
          />
          <el-table-column
            prop="status"
            :label="$t('product.status')"
            show-overflow-tooltip
            align="center"
            width="150"
          >
            <template #default="scope">
              <span
                v-if="
                  scope.row.refundStatus && scope.row.refundStatus !== 4
                "
              >{{
                [
                  "",
                  $t("order.order.requestARefund"),
                  $t("order.order.refundsuccessfully"),
                  $t("order.order.partialRefundSucc"),
                  $t("order.order.refundFailed")
                ][scope.row.refundStatus]
              }}</span>
              <span
                v-else-if="scope.row.beDeliveredNum !== 0 && scope.row.beDeliveredNum !== scope.row.count"
              >{{ $t("order.order.partialDelivery") }}</span>
              <span v-else-if="scope.row.beDeliveredNum === 0">{{
                $t("order.order.shipmentCompleted")
              }}</span>
              <span
                v-else-if="scope.row.beDeliveredNum !== 0"
              >{{ $t("order.order.toBeShipped") }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="changeNum"
            :label="$t('order.order.numberOfShipments')"
            fit
            align="center"
            class="numberOfShipments"
          >
            <template #default="scope">
              <el-input-number
                v-model="scope.row.changeNum"
                :disabled="scope.row.beDeliveredNum <= 0"
                :precision="0"
                :min="0"
                :max="scope.row.beDeliveredNum > 0 ? scope.row.beDeliveredNum : 0"
                style="width:50%; min-width:150px"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        label-width="100px"
        @submit.prevent
        @keyup.enter="onSubmit()"
      >
        <div class="detail-cont">
          <div class="detail01">
            <div class="text-width">
              <el-form-item :label="$t('order.order.waitForDelivery')">
                <span>{{ $t("order.order.delType") }}：{{
                  dataForm.deliveryType === 4 ? $t('order.order.sameCityDelivery') : $t("order.order.ordinaryExpress")
                }}</span>
              </el-form-item>
              <el-form-item>
                <span>{{ $t("constant.consignee") }}：{{
                  dataForm.orderAddr.consignee
                }}</span>
              </el-form-item>
              <el-form-item>
                <span>{{ $t("constant.mobilePhone") }}：{{
                  dataForm.orderAddr.mobile
                }}</span>
              </el-form-item>
              <el-form-item>
                <span style="word-break:break-word;">{{ $t("constant.deliveryAddr") }}：{{
                  dataForm.orderAddr.province
                }}{{ dataForm.orderAddr.city
                }}{{ dataForm.orderAddr.area
                }}{{ dataForm.orderAddr.addr }}</span>
              </el-form-item>
            </div>
          </div>
        </div>
        <el-form-item :label="$t('order.order.deliveryMethod') + '：'">
          <el-radio-group
            v-model="dataForm.tempDeliveryType"
            @change="onClear()"
          >
            <el-radio
              :label="1"
              :disabled="dataForm.deliveryType === 4"
            >
              {{
                $t("order.order.ordinaryExpress")
              }}
            </el-radio>
            <el-radio
              :label="3"
              :disabled="dataForm.deliveryType === 4 || isDisableNoCourier"
            >
              {{
                $t("order.order.noNeedRequired")
              }}
            </el-radio>
            <el-radio
              :label="4"
              :disabled="dataForm.deliveryType !== 4"
            >
              {{
                $t("order.order.sameCityDelivery")
              }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <!--配送方式 线上 线下-->
        <el-form-item
          v-if="dataForm.tempDeliveryType === 1"
          :label="$t('order.order.delType') + '：'"
          style="text-align: left;"
        >
          <el-radio-group v-model="dataForm.deliveryType">
            <el-radio
              :label="0"
              :disabled="isPrint === 0"
            >
              {{
                $t("order.order.onlineDelivery")
              }}
            </el-radio>
            <el-radio
              :label="1"
            >
              {{
                $t("order.order.selfDelivery")
              }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <!--自行联系快递-->
        <div v-if="dataForm.deliveryType === 1">
          <el-form-item :label="$t('order.order.courierCompany') + '：'">
            <select-lazy
              v-model="dataForm.deliveryCompanyId"
              :placeholder="$t('tip.select')"
            />
          </el-form-item>
          <el-form-item
            :label="$t('order.order.trackingNumber') + '：'"
            prop="deliveryNo"
          >
            <el-input
              v-model="dataForm.deliveryNo"
              placeholder="快递单号"
              width="80"
              maxlength="20"
              show-word-limit
              label="$t('order.order.trackingNumber')"
            />
          </el-form-item>
        </div>
        <!--线上发货-->
        <div v-if="dataForm.deliveryType === 0">
          <el-form-item
            :label="$t('order.order.courierCompany') + '：'"
            prop="deliveryCompanyType"
          >
            <div class="part-form-delivery">
              <el-select
                v-model="dataForm.deliveryCompanyType"
                :placeholder="$t('tip.select')"
                @change="onDeliveryCompanyTypeChange"
              >
                <el-option
                  v-for="item in outletConfigList"
                  :key="item.deliveryCompanyType"
                  :label="item.deliveryCompanyName"
                  :value="item.deliveryCompanyType"
                />
              </el-select>
              <div
                v-if="deliveryCompanyType.isConfig === 0"
                class="lb"
              >
                <el-button
                  type="primary"
                  link
                  @click="onToConfigOutlet"
                >
                  {{ '去开通' }}
                </el-button>
                <span
                  class="vertical"
                />
                <el-button
                  type="primary"
                  link
                  @click="onGetOutletConfigList"
                >
                  {{ '刷新' }}
                </el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item
            v-if="deliveryCompanyType.isConfig === 1"
            :label="$t('order.order.deliveryAddress') + '：'"
            prop="outletConfigId"
          >
            <el-select
              v-model="dataForm.outletConfigId"
              :placeholder="$t('tip.select')"
              style="width: 330px"
            >
              <el-option
                v-for="item in deliveryCompanyType.shopAddrList"
                :key="item.outletConfigId"
                :label="item.printAddr"
                :value="item.outletConfigId"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="deliveryCompanyType.isConfig === 1"
            :label="$t('order.order.deliveryPrintType') + '：'"
          >
            <el-radio-group v-model="isPrint">
              <el-radio
                :label="1"
              >
                {{
                  $t("order.order.printInfo")
                }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="deliveryCompanyType.isConfig === 1"
            :label="$t('order.order.printer') + '：'"
            prop="printerId"
          >
            <div class="part-form-delivery">
              <el-select
                v-model="dataForm.printerId"
                :placeholder="$t('tip.select')"
              >
                <el-option
                  v-for="item in printerList"
                  :key="item.printerId"
                  :label="item.printerName"
                  :value="item.printerId"
                />
              </el-select>
              <div
                class="lb"
              >
                <el-button
                  type="primary"
                  link
                  @click="onToConfigPrinter"
                >
                  {{ '新建' }}
                </el-button>
                <span
                  class="vertical"
                />
                <el-button
                  type="primary"
                  link
                  @click="onGetPrinterList"
                >
                  {{ '刷新' }}
                </el-button>
              </div>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <template #footer>
      <span>
        <el-button
          @click="visible = false"
        >{{
          $t("table.cancel")
        }}</el-button>
        <el-button
          type="primary"
          @click="onSubmit()"
        >{{
          $t("table.confirm")
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import * as orderApi from '@/api/order/order'
import * as outletConfigApi from '@/api/outlet-config/outlet-config'
import { ElMessage } from 'element-plus'
import SelectLazy from '@/components/select-lazy/index.vue'
import { getQuick100Config } from '@/api/rbac/web-config'
import * as printerApi from '@/api/printer/printer'
import Cookies from 'vue-cookies'
import { getDomain } from '@/utils/index.js'
const emit = defineEmits([
  'refreshOrderDeliveryUpdate'
])

const errorInfo = ref('')
const isSubmit = ref(false)
const isTrue = ref(false)
const orderId = ref(0)
const visible = ref(false)
const dataForm = reactive({
  deliveryCompanyId: '',
  orderAddr: {},
  deliveryNo: '',
  names: [],
  orderId: 0,
  deliveryType: 1,
  tempDeliveryType: 1,
  outletConfigId: null,
  printerId: null,
  deliveryCompanyType: null
})
const deliveryCompanyType = ref({
  deliveryCompanyType: null,
  deliveryCompanyName: null,
  isConfig: null,
  isDefault: null,
  shopAddrList: []
})
const dataList = reactive([])
const selectOrderItems = reactive([])
const dataFormRef = ref(null)

// 获取数据列表
const init = (order) => {
  dataForm.deliveryCompanyType = null
  deliveryCompanyType.value.deliveryCompanyType = null
  deliveryCompanyType.value.deliveryCompanyName = null
  deliveryCompanyType.value.isConfig = null
  deliveryCompanyType.value.isDefault = null
  deliveryCompanyType.value.shopAddrList = []
  isSubmit.value = false
  dataForm.orderAddr = {}
  visible.value = true
  orderId.value = order.orderId
  dataForm.orderAddrId = order.orderAddrId
  onClear()
  onGetQuick100()
  onGetOutletConfigList()
  onGetPrinterList()
  // 修改
  orderApi.getOrderItemAndAddress(order.orderId).then(data => {
    dataForm.orderAddr = data.orderAddr
    // 过滤掉组合商品的主商品
    data.orderItems = data.orderItems.filter(i => i.spuMold !== 2)
    handleArr(dataList, data.orderItems)
    if (data.deliveryType === 2 || data.deliveryType === 4) {
      dataForm.deliveryType = parseInt(data.deliveryType)
    } else {
      dataForm.deliveryType = isPrint.value === 1 ? 0 : parseInt(data.deliveryType)
    }
    dataForm.tempDeliveryType = dataForm.deliveryType === 0 || dataForm.deliveryType === 1 ? 1 : dataForm.deliveryType
    dataList.forEach(element => {
      element.changeNum = element.count
    })
  })
}
const onDeliveryCompanyTypeChange = (val) => {
  outletConfigList.forEach(el => {
    if (el.deliveryCompanyType === val) {
      deliveryCompanyType.value = el
    }
  })
  dataForm.outletConfigId = null
}
// 是否禁用"无需快递"选项
const isDisableNoCourier = ref(false)

// 修改状态
const onSelectSome = (val) => {
  handleArr(selectOrderItems, val)
  getNoDeliverySts()
}

watch(() => dataList, () => {
  getNoDeliverySts()
}, { deep: true })

/**
 * 设置无需快递按钮状态
 */
const getNoDeliverySts = () => {
  let flag = false
  const tempList = dataList.filter(el => (el.refundStatus && el.refundStatus != 2) || !el.refundStatus)
  if (tempList.length !== selectOrderItems.length) {
    flag = true
  }
  for (let i = 0; i < tempList.length; i++) {
    const item = tempList[i]
    if ((item.beDeliveredNum !== 0 && item.beDeliveredNum !== item.count) || item.count !== item.changeNum) {
      flag = true
      break
    }
  }
  if (flag && dataForm.deliveryType === 3) {
    dataForm.deliveryType = isPrint.value === 1 ? 0 : parseInt(dataForm.deliveryType)
    dataForm.tempDeliveryType = dataForm.deliveryType === 0 || dataForm.deliveryType === 1 ? 1 : dataForm.deliveryType
  }
  isDisableNoCourier.value = flag
}

// 禁用多选按钮
const onCheckSelectable = (row) => {
  return row.beDeliveredNum !== 0 && !(row.refundStatus && row.refundStatus !== 4)
}

const onClear = () => {
  if (dataForm.tempDeliveryType === 3) {
    dataForm.deliveryType = 3
  } else if (dataForm.tempDeliveryType === 4) {
    dataForm.deliveryType = 4
  } else {
    if (isPrint.value === 1) {
      dataForm.deliveryType = 0
    } else {
      dataForm.deliveryType = 1
    }
  }
  dataForm.deliveryNo = ''
  dataForm.deliveryCompanyId = ''
}

// 校验数量
const onCheck = () => {
  isTrue.value = false
  if (selectOrderItems.length <= 0) {
    isTrue.value = true
    errorInfo.value = $t('order.order.seleOrd')
    return true
  }
  if (dataForm.deliveryType === 0) {
    if (dataForm.deliveryCompanyType && deliveryCompanyType.value.isConfig === 0) {
      isTrue.value = true
      errorInfo.value = '未开通相关物流配置'
      return true
    }
    if (!dataForm.deliveryCompanyType) {
      isTrue.value = true
      errorInfo.value = $t('order.order.seleCouCom')
      return true
    }
    if (!dataForm.outletConfigId) {
      isTrue.value = true
      errorInfo.value = '请选择发货地址'
      return true
    }
    if (!dataForm.printerId) {
      isTrue.value = true
      errorInfo.value = '请选择打印机'
      return true
    }
  }
  selectOrderItems.forEach(element => {
    if (element.count <= 0 || element.count < element.changeNum || element.changeNum <= 0) {
      isTrue.value = true
      errorInfo.value = element.spuName + $t('order.order.numNotZero') + '！'
      return true
    }
    if (element.changeNum <= 0) {
      isTrue.value = true
      errorInfo.value = element.spuName + $t('order.order.numNotZero') + '！'
      return true
    }
    if (element.changeNum == null) {
      isTrue.value = true
      errorInfo.value = element.spuName + $t('order.order.fhNumNotZero') + '！'
      return true
    }
  })
  if (dataForm.deliveryCompanyId === '' && dataForm.deliveryType === 1) {
    isTrue.value = true
    errorInfo.value = $t('order.order.seleCouCom')
    return true
  }
  if ((dataForm.deliveryNo === 0 || !dataForm.deliveryNo) && dataForm.deliveryType === 1) {
    isTrue.value = true
    errorInfo.value = $t('order.order.entCouNum')
    return true
  }
  const reg = /^[a-zA-Z0-9]{4,30}$/
  if (!reg.test(dataForm.deliveryNo) && dataForm.deliveryType === 1) {
    isTrue.value = true
    errorInfo.value = $t('order.order.checkDeliveryNo')
    return true
  }
}

// 确定事件
const freightAmount = ref(0)
const onSubmit = () => {
  if (dataForm.deliveryType === null) {
    ElMessage.error($t('order.order.pledSeleMet'))
    return
  }
  onCheck()
  if (isTrue.value) {
    onShowErrorMsg(errorInfo.value)
    return
  }
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  orderApi.delivery({
    orderId: orderId.value,
    deliveryCompanyId: dataForm.deliveryCompanyId,
    deliveryNo: dataForm.deliveryNo,
    freightAmount: freightAmount.value,
    selectOrderItems,
    deliveryType: dataForm.tempDeliveryType !== 1 ? dataForm.tempDeliveryType : dataForm.deliveryType,
    orderAddrId: dataForm.orderAddrId,
    outletConfigId: dataForm.outletConfigId,
    printerId: dataForm.printerId,
    deliveryCompanyType: dataForm.deliveryCompanyType
  }).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => {
        visible.value = false
        emit('refreshOrderDeliveryUpdate')
      }
    })
  }).catch(() => {
    isSubmit.value = false
  })
}

const onShowErrorMsg = (message) => {
  ElMessage({
    message,
    type: 'error',
    duration: 1500
  })
}
// 获取网点列表
const outletConfigList = reactive([])
const onGetOutletConfigList = () => {
  outletConfigApi.listOutletConfig().then((data) => {
    handleArr(outletConfigList, data)
    if (deliveryCompanyType.value.deliveryCompanyType !== null) {
      data.forEach(el => {
        if (el.deliveryCompanyType === deliveryCompanyType.value.deliveryCompanyType) {
          deliveryCompanyType.value = el
          dataForm.deliveryCompanyType = el.deliveryCompanyType
          el.shopAddrList.forEach(val => {
            if (val.isDefault === 1) {
              dataForm.outletConfigId = val.outletConfigId
            }
          })
        }
      })
      return
    }
    data.forEach(el => {
      if (el.isDefault === 1) {
        // 设置选中默认配置
        deliveryCompanyType.value = el
        dataForm.deliveryCompanyType = el.deliveryCompanyType
        el.shopAddrList.forEach(val => {
          if (val.isDefault === 1) {
            dataForm.outletConfigId = val.outletConfigId
          }
        })
      }
    })
  })
}

const printerList = reactive([])
// 获取打印机列表
const onGetPrinterList = () => {
  printerApi.list().then((data) => {
    handleArr(printerList, data)
    data.forEach(el => {
      if (el.isDefault === 1) {
        // 设置选中默认配置
        dataForm.printerId = el.printerId
      }
    })
  })
}

// 获取快递100配置
const isPrint = ref(0)
const onGetQuick100 = () => {
  getQuick100Config().then((res) => {
    isPrint.value = res ? 1 : 0
  })
}

// 去开通网点
const domain = getDomain()
const tid = Cookies.get('cloudTid')

const onToConfigOutlet = () => {
  window.open('/system/delivery-manager/outlet-config/index' + (Cookies.get(domain) ? '' : '?tid=' + tid), '_blank', 'noopener,noreferrer')
}

// 去配置打印机
const onToConfigPrinter = () => {
  window.open('/system/delivery-manager/printer/index' + (Cookies.get(domain) ? '' : '?tid=' + tid), '_blank', 'noopener,noreferrer')
}

defineExpose({
  init
})
</script>

<style lang="scss" scoped>
.component-order-delivery-update {
  .mod-order-orderInfo {
    height: 100%;
    width: 100%;
    font: 14px Arial, "PingFang SC", "Hiragino Sans GB", STHeiti,
    "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
    color: #495060;
    overflow-x:auto
  }
  div :deep(.el-table .cell) {
    min-width:150px;
    width: 100% ;
  }
  .numberOfShipments :deep(.el-input-number--medium) {
    width: 100% !important
  }
  /* 赠品标签 */
  .gift-icon {
    display: inline-block;
    font-size: 12px;
    line-height: 1em;
    color: #fff;
    background: #e43130;
    padding: 3px;
    border-radius: 3px;
    box-sizing: border-box;
    margin-right: 5px;
  }
  .part-form-delivery {
    display:flex;
    .lb {
      display: flex;
      align-items: center;

      margin-left: 20px;

      .vertical {
        display: inline-block;
        width: 1px;
        height: 10px;
        background: #000;
        margin: 0 6px;
      }
    }
  }
}
</style>
