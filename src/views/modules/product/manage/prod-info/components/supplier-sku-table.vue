<template>
  <div class="supplier-sku-table-component">
    <!-- 表格 -->
    <el-table
      ref="elTableRef"
      border
      size="small"
      :data="lists"
      :span-method="handleSpanMethod"
      :row-class-name="rowClassName"
      class="tab-con"
      header-cell-class-name="table-header"
    >
      <template v-for="(label, index) in columns">
        <el-table-column
          v-if="label"
          :key="index"
          :label="label"
          :min-width="index===0?'160':'120'"
        >
          <template #default="scope">
            <div
              :key="scope.row.imgUrl"
              :class="index===0?'first':''"
            >
              <div class="text">
                {{ scope.row.spuSkuAttrValues[index] && scope.row.spuSkuAttrValues[index].attrValueName }}
              </div>
              <div
                v-if="index===0"
                class="spec-imgbox"
              >
                <img-upload
                  v-model="scope.row.imgUrl"
                  :disabled="isViewOnly"
                  class="spec-img"
                />
                <div
                  v-if="scope.row.imgUrl && !isViewOnly"
                  class="preview-btn"
                  @click="scope.row.imgUrl=''"
                >
                  x
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
      </template>

      <el-table-column
        key="supplierSkuCode"
        :prop="isViewOnly ? 'partyCode' : 'supplierSkuCode'"
        label="供应商SKU编码"
        class="tab-int-box"
        min-width="120"
      />
      <el-table-column
        v-if="!isViewOnly"
        key="partyCode"
        prop="partyCode"
        label="商品编码"
        class="tab-int-box"
        min-width="120"
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.partyCode"
            :disabled="(scope.row.status===0&&isTheirDelivery===2)"
            :min="0"
            maxlength="20"
            class="tab-int"
            @blur="validatePartyCode(scope)"
          />
        </template>
      </el-table-column>
      <el-table-column
        key="stock"
        prop="stock"
        label="库存"
        class="tab-int-box"
        min-width="120"
      >
        <template #default="scope">
          <div
            v-if="isTheirDelivery===1 || isTheirDelivery===2"
            class="stock-number"
          >
            <el-input
              v-if="isTheirDelivery===1"
              v-model="scope.row.supplierStock"
              :disabled="true"
              type="number"
              :min="0"
              :max="9999999"
              :step="1"
              :precision="2"
              controls-position="right"
              class="tab-int"
              @change="handleInputValue(scope.row.supplierStock, scope.$index, 'supplierStock', 0, 9999999)"
            />
            <el-input
              v-if="isTheirDelivery===2"
              v-model="scope.row.myStock"
              :disabled="(scope.row.status===0&&isHaveStockPoint)"
              type="number"
              :min="0"
              :max="9999999"
              :step="1"
              :precision="2"
              controls-position="right"
              class="tab-int"
              @change="handleInputValue(scope.row.myStock, scope.$index, 'myStock', 0, 9999999)"
            />
            <div
              v-if="isTheirDelivery===2 && scope.row.status!==0 && isHaveStockPoint"
              class="shade"
              @click="onSetStock(scope)"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        key="isSell"
        prop="isSell"
        label="是否可售"
        class="tab-int-box"
        class-name="isSell"
        min-width="120"
      >
        <template #default="scope">
          <span v-if="!isViewOnly">
            {{ scope.row.isSell===1||isTheirDelivery===2?'可售':'不可售' }}
          </span>
          <span v-else>
            {{ scope.row.status ? '可售':'不可售' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        key="supplyPriceFee"
        :prop="isViewOnly ? 'priceFee' : 'supplyPriceFee'"
        label="供货价"
        class="tab-int-box"
        min-width="120"
      />
      <el-table-column
        key="marketPriceFee"
        prop="marketPriceFee"
        label="市场价(元)"
        class="tab-int-box"
        min-width="120"
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.marketPriceFee"
            :disabled="(setPrice&&isTheirDelivery!==2)||(scope.row.status===0&&isTheirDelivery===2)"
            type="number"
            :min="0"
            :max="9999999.99"
            :step="0.1"
            :precision="2"
            controls-position="right"
            class="tab-int"
            @change="handleInputValue(scope.row.marketPriceFee, scope.$index, 'marketPriceFee', 0, 9999999.99)"
          />
        </template>
      </el-table-column>
      <el-table-column
        v-if="!isViewOnly"
        key="priceFee"
        prop="priceFee"
        label="销售价(元)"
        class="tab-int-box"
        min-width="120"
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.priceFee"
            :disabled="(setPrice&&isTheirDelivery!==2)||(scope.row.status===0&&isTheirDelivery===2)||isComboSpu"
            type="number"
            :min="0.01"
            :max="9999999.99"
            :step="0.1"
            :precision="2"
            controls-position="right"
            class="tab-int"
            @change="handleInputValue(scope.row.priceFee, scope.$index, 'priceFee', 0.01, 9999999.99)"
          />
        </template>
      </el-table-column>
      <el-table-column
        key="volume"
        prop="volume"
        label="商品体积(m³)"
        class="tab-int-box"
        min-width="120"
      />
      <el-table-column
        key="weight"
        prop="weight"
        label="商品重量(kg)"
        class="tab-int-box"
        min-width="120"
      />
      <el-table-column
        key="barCode"
        prop="barCode"
        label="库存预警"
        class="tab-int-box"
        min-width="120"
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.stockWarning"
            type="number"
            :min="0"
            :disabled="scope.row.status===0&&isTheirDelivery===2"
            onkeyup="value=value.replace(/[^0-9A-Za-z]/g,'')"
            maxlength="20"
            class="tab-int"
          />
        </template>
      </el-table-column>

      <el-table-column
        v-if="spuId && !isNoSkuValue&&isTheirDelivery===2"
        key="status"
        prop="status"
        label="sku状态"
        class="tab-int-box"
        min-width="120"
      >
        <template #default="scope">
          <el-button
            type="primary"
            link
            @click="skuStatusOperation(scope)"
          >
            {{ scope.row.status === 1 ? '禁用' : '启用' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 库存设置 -->
    <stock-update
      v-if="stockUpdateVisible"
      ref="stockUpdateRef"
      :is-need-verify-delivery="true"
      :delivery-mode="deliveryMode"
      :is-hide-station="stockPointInfo.stationSize === 0"
      @set-stock-callback="onSetStockCallback"
    />
  </div>
</template>

<script setup>
import { flatten as genFlatten } from '@/utils'
import Big from 'big.js'

const props = defineProps({
  setPrice: { // true为智能设价
    type: Boolean,
    default: false
  },
  salesPriceType: { // 默认加价比例 0.按比例加价 1.按固定数值加价
    type: Number,
    default: null
  },
  salesPrice: { // 默认加价比例为0时，代表百分比*100，为1时代表实际奖励金额*100
    type: Number,
    default: null
  },
  isTheirDelivery: {
    type: Number,
    default: null
  },
  data: {
    type: Array,
    default () {
      return []
    }
  },
  isComboSpu: {
    type: Boolean,
    default: false
  },
  flatten: {
    type: Array,
    default () {
      return []
    }
  },
  // 自定义sku的id key
  optionValue: {
    type: String,
    default: 'id'
  },
  // 自定义sku的text key
  optionText: {
    type: String,
    default: 'text'
  },
  spuId: {
    type: Number,
    default: null
  },
  isNoSkuValue: {
    type: Boolean,
    default: false
  },
  isViewOnly: {
    default: false,
    required: true,
    type: Boolean
  },
  // 配送方式
  deliveryMode: {
    type: Object,
    default: () => {
      return {}
    }
  },
  stockPointInfo: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const emit = defineEmits(['on-change-data'])

const Data = reactive({
  originList: [],
  rowspan: [],
  lists: [],
  firstSkuVal: -1,
  secondSkuVal: -1,
  stockIntVal: '', // 库存
  markedPriceIntVal: '',
  priceIntVal: '',
  volumeIntVal: '', // 体积
  weightIntVal: '', // 重量
  barCodeIntVal: '', // 条形码
  skuCodeIntVal: '',
  inputWidth: '100px',
  selectWidth: '100px',
  isLessStock: false, // 是否已确定输入库存小于原库存
  tableInputWidth: 0, // 表格内输入框的大小
  timer: null
})

watch([() => props.deliveryMode.hasUserPickUp, () => props.deliveryMode.hasCityDelivery], ([hasUserPickUp, hasCityDelivery]) => {
  Data.lists?.forEach((skuItem) => {
    // 监听配送方式中的用户自提
    // 如果取消，则将设置的门店相关库存移除并存储；在重新勾选时，将存储起来的门店相关设置重新添加
    if (!(hasUserPickUp || hasCityDelivery)) {
      skuItem.filterList = []
      skuItem.filterStock = 0 // 过滤出来的库存数量
      skuItem.stockPointList = skuItem.stockPointList?.filter(stockItem => {
        if (stockItem.stockPointType === 2) {
          // 存储门店相关库存
          skuItem.filterList.push(stockItem)
          skuItem.filterStock += Number(stockItem.stock)
        }
        return stockItem.stockPointType === 1
      })
      // skuItem.myStock -= skuItem.filterStock
    } else {
      if (skuItem.filterList && skuItem.stockPointList.length) {
        skuItem.stockPointList = skuItem.stockPointList.concat(skuItem.filterList)
        skuItem.filterList = []
      }
      if (skuItem.filterStock) {
        // skuItem.myStock += skuItem.filterStock
        skuItem.filterStock = 0
      }
    }
    skuItem.myStock = calcStock(skuItem.stockPointList)
  })
})

watch(() => props.deliveryMode.hasShopDelivery, () => {
  handleStock()
})

const handleStock = () => {
  Data.lists?.forEach((skuItem) => {
    skuItem.myStock = calcStock(skuItem.stockPointList)
  })
}

const stationDelivery = inject('stationDeliveryInfo')
const calcStock = (stockPointList = []) => {
  const { hasShopDelivery, hasCityDelivery, hasUserPickUp } = props.deliveryMode
  return stockPointList.reduce((total, item) => {
    let stock = 0
    if (item.stockMode === 2 && item.status === 1 && ((hasCityDelivery && item.sameCityDelivery) || (hasUserPickUp && item.selfPickup))) {
      stock = Number(item.stock)
    }
    // 区域仓库:商品支持快递配送
    // 默认仓库:商品支持快递或商品不支持快递，但门店是共享总部库存+门店状态为营业+门店和商品有共同的物流类型
    if (!item.stockMode && (hasShopDelivery || (item.type === 0 && ((hasCityDelivery && stationDelivery?.sameCityDelivery) || (hasUserPickUp && stationDelivery?.selfPickup))))) {
      stock = Number(item.stock)
    }
    return total + stock
  }, 0)
}

/**
 * 是否存在库存点，存在多余库存点时，修改库存才进行弹窗
 * @type {ComputedRef<unknown>}
 */
const isHaveStockPoint = computed(() => {
  if (props.stockPointInfo.warehouseSize > 1) {
    // 仓库数量大于1（除默认仓库外还存在仓库），则直接返回true
    return true
  } else if (props.deliveryMode.hasUserPickUp && props.stockPointInfo.stationSize > 0) {
    // 开启了自提，且门店数量大于0返回true
    return true
  }
  return false
})

const { lists } = toRefs(Data)

const filter = computed(() => {
  return props.data.filter(item => item.text && item.leaf.length)
})

const columns = computed(() => {
  return filter.value.map(item => item[props.optionText])
})

const setLeafList = computed(() => {
  // 立即设置-规格下拉框列表
  const leaf = []
  props.data.forEach((item) => {
    if (item.leaf.length) {
      leaf.unshift([{ id: -1, is_show: false, text: '全部' }, ...item.leaf])
    }
  })
  leaf.forEach((item) => {
    item.value = -1
  })
  return leaf.reverse()
})

watch(() => Data.lists, (data) => {
  emit('on-change-data', data)
  // listeningInputBox()
}, {
  deep: true
})

watch(() => props.setLeafList, () => {
  if (setLeafList.value.length > 1) {
    Data.inputWidth = '80px'
    Data.selectWidth = '80px'
  } else if (setLeafList.value.length > 2) {
    Data.selectWidth = '60px'
  } else {
    Data.inputWidth = '100px'
  }
})

onBeforeUnmount(() => {
  clearInterval(Data.timer)
})

// 商品发货方式改变
const supplierDeliveryTypeChange = () => {
  // 重新计算库存
  Data.lists?.forEach((skuItem) => {
    skuItem.myStock = calcStock(skuItem.stockPointList)
  })
  // 切换为供应商发货时销售价按智能设价计算
  if (!props.setPrice) {
    return
  }
  Data.lists.forEach(item => {
    if (props.salesPriceType === 0) {
      item.priceFee = new Big(+item.supplyPriceFee).plus(new Big(+item.supplyPriceFee).times(+props.salesPrice).div(10000)).valueOf()
      item.priceFee = formatPrice(formatPrice(item.priceFee), 1).toFixed(2)
    }
    if (props.salesPriceType === 1) {
      item.priceFee = new Big(+item.supplyPriceFee).plus(formatPrice(+props.salesPrice, 1)).valueOf()
      item.priceFee = formatPrice(formatPrice(+item.priceFee), 1).toFixed(2)
    }
  })
}

const rowClassName = ({ row }) => {
  if (props.isTheirDelivery === 2) {
    return
  }
  if (row.supplierSkuStatus === -1) {
    return 'showRow'
  }
}

const genLists = (filter, flatten) => {
  const baseData = {
    supplierStock: 0, // 库存
    myStock: 0, // 库存
    marketPriceFee: '', // 市场价
    priceFee: 0.01, // 销售价
    volume: '', // 体积
    weight: '', // 重量
    partyCode: '', // 商品编码
    modelId: '', // 条形码
    status: 1 // 状态
  }
  if (filter.length) {
    return genFlatten(filter, flatten, { extraData: baseData })
  } else if (!Data.lists.length) {
    return [baseData]
  } else {
    return Data.lists
  }
}

const computeRowspan = () => {
  Data.rowspan = []
  const rowspan = (index) => {
    const span = []
    let dot = 0
    Data.lists.forEach((item, idx) => {
      if (idx === 0) {
        span.push(1)
      } else {
        if (item.spuSkuAttrValues?.[index].attrValueName === Data.lists[idx - 1].spuSkuAttrValues?.[index].attrValueName) {
          span[dot] += 1
          span.push(0)
        } else {
          dot = idx
          span.push(1)
        }
      }
    })

    Data.rowspan.push(span)
  }

  filter.value.forEach((item, index) => {
    rowspan(index)
  })
}

const handleSpanMethod = ({ rowIndex, columnIndex }) => {
  for (let i = 0; i < filter.value.length; i++) {
    if (columnIndex === i) {
      if (Data.rowspan[i] && Data.rowspan[i][rowIndex]) {
        return {
          rowspan: Data.rowspan[i][rowIndex],
          colspan: 1
        }
      } else {
        return {
          rowspan: 0,
          colspan: 0
        }
      }
    }
  }
}

/**
 * sku状态
 */
const skuStatusOperation = (scope) => {
  const { $index } = scope
  const currentStatus = Data.lists?.[$index]?.status
  Data.lists[$index].status = currentStatus === 0 ? 1 : 0
}

/**
 * 处理输入框数据
 * @param data
 * @param dataFields
 * @param index 索引
 * @param min 最小值
 * @param max 最大值
 */
const handleInputValue = (data, index, dataFields, min, max) => {
  if (dataFields === 'myStock' && !isHaveStockPoint.value) {
    if (data > max) {
      data = max
    } else if (data < min) {
      data = min
    }
    // 仅有一个仓库（默认仓库）时，直接修改库存时同步修改库存点列表
    const stockPointInfo = JSON.parse(JSON.stringify(Data.lists[index].stockPointList[0]))
    const changeStock = stockPointInfo.skuId ? Number(data || 0) - stockPointInfo.stock + (stockPointInfo.changeStock || 0) : null
    Data.lists[index].stockPointList = [{
      ...stockPointInfo,
      changeStock: stockPointInfo.skuId ? changeStock : undefined,
      stock: Number(data || 0),
      stockPointId: props.stockPointInfo.defaultWarehouseId,
      stockPointType: 1,
      type: 0
    }]
  }
  // 表格
  if (+data > max) {
    Data.lists[index][dataFields] = max
    return
  }
  if (+data <= min || !data) {
    Data.lists[index][dataFields] = min
    return
  }
  if (dataFields === 'marketPriceFee' ||
          dataFields === 'priceFee') {
    Data.lists[index][dataFields] = checkInput(data)
  }
  if (dataFields === 'stockWarning' || dataFields === 'supplierStock' || dataFields === 'myStock') {
    Data.lists[index][dataFields] = Math.trunc(data)
  }
}

/**
 * 只允许输入正数和小数(保留小数点后两位)
 */
const checkInput = (num) => {
  if (num) {
    let tmpVal = String(num).replace(/[^\d^\\.]/g, '')
    const reg = /^(0|([1-9]\d*))(\.\d{1,2})?$/ // 最多允许后输入两位小数
    if (!reg.test(tmpVal)) {
      tmpVal = tmpVal + ''
      tmpVal = tmpVal.substring(0, tmpVal.indexOf('.') + 3)
      const n = (tmpVal.split('.')).length - 1
      if (n > 1) {
        tmpVal = tmpVal.substring(0, tmpVal.indexOf('.'))
      }
    }
    return tmpVal
  } else {
    return ''
  }
}

watch(() => filter.value, () => {
  Data.lists = genLists(filter.value, props.flatten)

  computeRowspan()
}, {
  immediate: true,
  deep: true
})

watch(() => props.flatten, () => {
  if (props.spuId && props.isNoSkuValue) { // 有skuId，未选择属性
    Data.originList = JSON.parse(JSON.stringify(props.flatten))
  } else {
    Data.originList = JSON.parse(JSON.stringify(Data.lists))
  }
  if (Data.lists.length === 1 && !Data.lists[0].spuSkuAttrValues) {
    props.flatten.forEach(el => {
      const baseData = {
        ...el,
        stock: el.stock, // 库存
        marketPriceFee: el.marketPriceFee, // 市场价
        priceFee: el.priceFee, // 销售价
        volume: el.volume, // 体积
        weight: el.weight, // 重量
        partyCode: el.partyCode, // 商品编码
        modelId: el.modelId, // 条形码
        supplierSkuCode: el.supplierSkuCode, // 条形码
        supplyPriceFee: el.supplyPriceFee, // 条形码
        status: el.status || null // 状态
      }
      Data.lists = [baseData]
    })
  }
  if (props.isTheirDelivery === 1) {
    supplierDeliveryTypeChange()
  }
}, {
  deep: true
})

const stockUpdateVisible = ref(false)
const stockUpdateRef = ref(null)
const onSetStock = (scope) => {
  if (props.spuMold === 1) {
    // 虚拟商品库存为默认仓库
    return
  }
  const { $index, row } = scope
  stockUpdateVisible.value = true
  nextTick(() => {
    stockUpdateRef.value.init(row, $index)
  })
}

// 修改库存弹窗回调
const onSetStockCallback = (res, sum, index) => {
  Data.lists[index].stockPointList = res
  Data.lists[index].myStock = sum
}

// 编码输入框校验
const validatePartyCode = (scope) => {
  const { row, $index } = scope
  // 纯空格校验
  if (validNoEmptySpace(row.partyCode)) {
    Data.lists[$index].partyCode = ''
  }
}

defineExpose({
  supplierDeliveryTypeChange,
  handleStock
})
</script>

<style lang="scss" scoped>
.supplier-sku-table-component {

  .first{
    display: flex;
    align-items: center;
    justify-content: space-between;
    .text{
      // height: 60px;
      // line-height: 60px;
      // word-break:break-all;
      min-height: 23px;
      width: calc(100% - 70px);
      // overflow: hidden;
      word-wrap: break-word;
      word-break: break-all;
      white-space: pre-wrap;
    }
    .spec-imgbox {
      margin-left: 10px;
      display: block;
      width: 60px;
      height: 60px;
      position: relative;
      align-items: center;

      :deep(.plugin-images) {
        width: 60px;
        height: 60px;

        .el-upload{
          width: 60px;
          height: 60px;
        }

        .pic-uploader-icon{
          width: 60px;
          height: 60px;
        }
      }

      .preview-btn {
        width: 12px;
        position: absolute;
        top: 0;
        right: 1px;
        font-size: 12px;
        height: 12px;
        line-height: 12px;
        color: #fff;
        text-align: center;
        border-radius: 0 0 0 6px;
        background: rgba(0, 0, 0, 0.3);
        cursor: pointer;
        z-index: 9;
      }
    }
  }

  .stock-number {
    position: relative;
    .shade {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      cursor: pointer;
    }
  }

  :deep(.el-input-number){
    width: auto;
  }
}

</style>
