<template>
  <div
    class="sku-table-component"
    @click="log"
  >
    <!-- 批量设置 -->
    <div
      v-if="lists[0] && lists[0].spuSkuAttrValues&&lists.length>1"
      class="batch-settings"
    >
      <div class="batch">
        <div>
          <span class="bat-tit">批量设置</span>
          <span class="set-tips">在下方栏中选择内容进行批量填充</span>
        </div>
      </div>
      <div
        ref="settingBar"
        class="bat-set-sel"
      >
        <span
          v-for="(skuItem, index) in setLeafList"
          :key="index"
          class="select-part"
        >
          <el-select
            v-model="skuItem.value"
            class="bat-set-item"
            placeholder="请选择"
            @change="changeValue"
          >
            <el-option
              v-for="item in skuItem"
              :key="item.id"
              :label="item.text"
              :value="item.id"
            />
          </el-select>
        </span>
        <div class="select-part">
          <!-- 库存 -->
          <div class="stock-number">
            <el-input
              v-model.number="stockIntVal"
              class="bat-set-item"
              :mini="0 "
              onkeyup="value=value.replace(/\D/g,'')"
              maxlength="7"
              placeholder="库存"
              :disabled="spuMold === 2 || (spuMold === 3 && isBindVoucher === 1)"
            />
          </div>
        </div>
        <!-- 市场价 -->
        <el-input-number
          v-model.number="markedPriceIntVal"
          class="bat-set-item"
          type="number"
          controls-position="right"
          :min="0.01"
          :max="9999999.99"
          :step="0.01"
          :precision="2"
          placeholder="市场价(元)"
          :style="{'width': tableInputWidth + 'px'}"
        />
        <!-- 销售价 -->
        <el-input-number
          v-model.number="priceIntVal"
          class="bat-set-item"
          type="number"
          controls-position="right"
          :min="0.01"
          :max="9999999.99"
          :step="0.01"
          :precision="2"
          placeholder="销售价(元)"
          :style="{'width': tableInputWidth + 'px'}"
        />
        <!-- 体积 -->
        <el-input-number
          v-if="spuMold!==1 && spuMold!==3"
          v-model.number="volumeIntVal"
          class="bat-set-item"
          type="number"
          controls-position="right"
          :min="0"
          :max="999.99"
          :step="0.01"
          :precision="2"
          placeholder="体积(m³)"
          :style="{'width': tableInputWidth + 'px'}"
        />
        <!-- 重量 -->
        <el-input-number
          v-if="spuMold!==1 && spuMold!==3"
          v-model.number="weightIntVal"
          class="bat-set-item"
          type="number"
          controls-position="right"
          :min="0"
          :max="9999.99"
          :step="0.01"
          :precision="2"
          placeholder="重量(kg)"
          :style="{'width': tableInputWidth}"
        />
        <span
          v-if="spuMold!==2"
          class="select-part"
        >
          <!-- 库存预警 -->
          <el-input-number
            v-model.number="stockWarningIntVal"
            class="bat-set-item"
            placeholder="库存预警"
            :min="0"
            :max="9999999"
            maxlength="7"
            :step="1"
            :precision="0"
          />
        </span>

        <div class="bat-set-item batch">
          <el-button
            v-if="(isNoSkuValue && lists[0] && lists[0].spuSkuAttrValues) || (!spuId && lists[0] && lists[0].spuSkuAttrValues)||(spuId && !isNoSkuValue)"
            type="primary"
            plain
            class="set"
            @click="setNow"
          >
            保存批量设置
          </el-button>
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <el-table
      ref="elTableRef"
      border
      :data="lists"
      :span-method="handleSpanMethod"
      class="tab-con"
    >
      <template v-for="(label, index) in columns">
        <el-table-column
          v-if="label"
          :key="index"
          :label="label"
          column-key="tableName"
        >
          <template #default="scope">
            <div class="tableName">
              {{ scope.row.spuSkuAttrValues[index] && scope.row.spuSkuAttrValues[index].attrValueName }}
            </div>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        prop="stock"
        class="tab-int-box"
      >
        <template #header>
          <span>
            库存
            <el-tooltip
              v-if="spuMold === 2"
              class="box-item"
              effect="dark"
              content="组合商品库存是由所关联商品的库存及搭配数共同决定，不能单独编辑"
              placement="top"
            >
              <el-icon style="top: 2px"><QuestionFilled /></el-icon>
            </el-tooltip>
          </span>
        </template>
        <template #default="scope">
          <div class="stock-number">
            <el-input
              id="tableInput"
              ref="tableInput"
              v-model.number="scope.row.stock"
              oninput="value=value.replace(/[^\d]/g,'');value = value > 9999999 ? 9999999 : value"
              :disabled="scope.row.status===0 || spuMold === 2 || (spuMold === 0 && isHaveStockPoint) || (spuMold === 3 && isBindVoucher === 1)"
              controls-position="right"
              :class="['tab-int', spuMold===0 && scope.row.status!==0?'shade-input':null]"
              @blur="stockValidAndChange(scope, 'stock')"
            />
            <div
              v-if="spuMold === 0 && scope.row.status!==0 && isHaveStockPoint"
              class="shade"
              @click="onSetStock(scope)"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="marketPriceFee"
        label="市场价(元)"
        class="tab-int-box"
        column-key="marketPriceFeeKey"
      >
        <template #default="scope">
          <el-input-number
            v-model="scope.row.marketPriceFee"
            :min="0"
            :max="9999999.99"
            :step="0.01"
            :precision="2"
            :disabled="scope.row.status===0"
            controls-position="right"
            class="tab-int"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="priceFee"
        class="tab-int-box"
      >
        <template #header>
          <span>
            销售价(元)
          </span>
        </template>
        <template #default="scope">
          <el-input-number
            v-model="scope.row.priceFee"
            :min="0.01"
            :max="9999999.99"
            :step="0.01"
            :precision="2"
            :disabled="scope.row.status===0"
            controls-position="right"
            class="tab-int"
          />
        </template>
      </el-table-column>
      <el-table-column
        v-if="spuMold!==1 && spuMold!==3"
        key="volume"
        prop="volume"
        label="体积(m³)"
        class="tab-int-box"
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.volume"
            oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '').replace(/^0+(?!\.|$)/g, ''),value = Number(value) >= 999.99 ? 999.99 : value"
            :disabled="scope.row.status===0"
            controls-position="right"
            class="tab-int"
          />
        </template>
      </el-table-column>
      <el-table-column
        v-if="spuMold!==1 && spuMold!==3"
        key="weight"
        prop="weight"
        label="重量(kg)"
        class="tab-int-box"
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.weight"
            oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '').replace(/^0+(?!\.|$)/g, ''),value = Number(value) >= 9999.99 ? 9999.99 : value"
            :disabled="scope.row.status===0"
            controls-position="right"
            class="tab-int"
          />
        </template>
      </el-table-column>
      <el-table-column
        v-if="spuMold!==2"
        prop="stockWarning"
        label="库存预警"
        class="tab-int-box"
      >
        <template #default="scope">
          <el-input
            id="tableInput"
            ref="tableInput"
            v-model.number="scope.row.stockWarning"
            oninput="value=value.replace(/[^\d]/g,'');value = value > 9999999 ? 9999999 : value"
            :disabled="scope.row.status===0"
            controls-position="right"
            class="tab-int"
            @blur="stockValidAndChange(scope)"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="skuCode"
        label="商品编码"
        class="tab-int-box"
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.partyCode"
            :min="0"
            :disabled="scope.row.status===0"
            maxlength="36"
            class="tab-int"
            @blur="validatePartyCode(scope)"
          />
        </template>
      </el-table-column>
      <el-table-column
        v-if="!isNoSkuValue || spuMold===2 || (spuMold === 3 && isBindVoucher === 1)"
        fixed="right"
        prop="skuCode"
        label="操作"
        class="tab-int-box"
      >
        <template #default="scope">
          <el-button
            v-if="!isNoSkuValue"
            type="primary"
            link
            @click="skuStatusOperation(scope)"
          >
            {{ scope.row.status === 1 ? '禁用' : '启用' }}
          </el-button>
          <el-button
            v-if="spuMold===2"
            type="primary"
            link
            @click="onAssociationGoods(scope)"
          >
            商品({{ scope.row.skuComboList?.length || 0 }})
          </el-button>
          <el-button
            v-if="spuMold === 3 && isBindVoucher === 1"
            type="primary"
            link
            @click="onBindCard(scope)"
          >
            <div class="over-ellipsis">
              {{ scope.row.voucherName || '关联卡券' }}
            </div>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <association-goods
      v-if="associationGoodsVisible"
      ref="associationGoodsRef"
      :spu-id="spuId"
      :delivery-mode="deliveryMode"
      @on-select-success="onSelectSuccess"
    />
    <binding-voucher
      v-if="bindingCardVisible"
      ref="bindingCardRef"
      :not-in-voucher-ids="voucherIds"
      :pre-bind-voucher-list="preBindVoucherList"
      @on-select-success="onBindingCardSuccess"
    />
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
import AssociationGoods from '../association-goods/index.vue'
import BindingVoucher from '../binding-voucher/index.vue'

const props = defineProps({
  data: {
    type: Array,
    default () {
      return []
    }
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
  isComboSpu: {
    type: Boolean,
    default: false
  },
  // 0-普通商品;1-虚拟商品;2-组合商品
  spuMold: {
    type: Number,
    default: 0
  },
  // 是否要关联卡券
  isBindVoucher: {
    type: Number,
    default: 1
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
  },
  // 需要查询保留的卡券，优先级低于notInVoucherIds
  preBindVoucherList: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['on-change-data'])

watch(() => [props.deliveryMode.hasUserPickUp, props.deliveryMode.hasCityDelivery], (val) => {
  Data.lists?.forEach((skuItem) => {
    // 监听配送方式中的用户自提
    // 如果取消，则将设置的门店相关库存移除并存储；在重新勾选时，将存储起来的门店相关设置重新添加
    if (!val[0] && !val[1]) {
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
      // skuItem.stock -= skuItem.filterStock
    } else {
      if (skuItem.filterList && skuItem.stockPointList.length) {
        skuItem.stockPointList = skuItem.stockPointList.concat(skuItem.filterList)
        skuItem.filterList = []
      }
      if (skuItem.filterStock) {
        // skuItem.stock += skuItem.filterStock
        skuItem.filterStock = 0
      }
    }
  })
  emit('on-change-data', Data.lists)
}, {
  deep: true
})

watch(() => props.deliveryMode, () => {
  Data.lists?.forEach((skuItem) => {
    skuItem.stock = calcStock(skuItem.stockPointList)
  })
}, {
  deep: true
})

// 电子卡券切换是否关联卡券时，初始化规格
watch(() => props.isBindVoucher, () => {
  Data.stockIntVal = 0
  lists.value = lists.value.map((sku) => {
    return {
      stock: 0, // 库存
      marketPriceFee: '', // 市场价
      priceFee: 0.01, // 销售价
      volume: 0, // 体积
      weight: 0, // 重量
      stockWarning: 0, // 库存预警
      partyCode: '', // 商品编码
      modelId: '', // 条形码
      status: 1, // 状态
      skuComboList: [],
      skuId: '',
      voucherId: null,
      spuSkuAttrValues: sku.spuSkuAttrValues,
      stockPointList: [],
      voucherName: ''
    }
  })
})

const voucherIds = computed(() => {
  const ids = lists.value.map(i => i.voucherId)
  return ids.filter(i => i && i !== 'undefined' && i !== undefined)
})

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
  } else if ((props.deliveryMode.hasUserPickUp || props.deliveryMode.hasCityDelivery) && props.stockPointInfo.stationSize > 0) {
    // 开启了自提，且门店数量大于0返回true
    return true
  }
  return false
})

const Data = reactive({
  originList: [],
  rowspan: [],
  lists: [],
  firstSkuVal: -1,
  secondSkuVal: -1,
  stockIntVal: null, // 库存
  markedPriceIntVal: null,
  priceIntVal: null,
  volumeIntVal: null, // 体积
  weightIntVal: null, // 重量
  stockWarningIntVal: null,
  barCodeIntVal: null, // 条形码
  skuCodeIntVal: null,
  inputWidth: '100px',
  selectWidth: '100px',
  isLessStock: false, // 是否已确定输入库存小于原库存
  tableInputWidth: '100%', // 表格内输入框的大小
  timer: null
})

const { lists, stockIntVal, markedPriceIntVal, priceIntVal, volumeIntVal, weightIntVal, stockWarningIntVal, tableInputWidth } = toRefs(Data)

const filterData = computed(() => {
  return props.data.filter(item => item.text && item.leaf.length)
})

const columns = computed(() => {
  return filterData.value.map(item => item[props.optionText])
})

const setLeafList = computed(() => {
  // 立即设置-规格下拉框列表
  const leaf = []
  props.data.forEach((item) => {
    if (item.leaf?.length) {
      leaf.unshift([{ id: -1, is_show: false, text: '全部' }, ...item.leaf])
    }
  })
  leaf.forEach((item) => {
    item.value = -1
  })
  return leaf.reverse()
})

let isEditInit = false
watch(() => props.flatten, () => {
  if (!(props.flatten && props.flatten.length > 0)) return
  if (props.flatten.length === 1 && !props.flatten[0].spuSkuAttrValues?.length) {
    isEditInit = true
  }
  if (props.spuId && props.isNoSkuValue) { // 有skuId，未选择属性
    Data.originList = JSON.parse(JSON.stringify(props.flatten))
  } else {
    Data.originList = JSON.parse(JSON.stringify(Data.lists))
  }
  if ((Data.lists.length === 1 && !Data.lists[0].spuSkuAttrValues) || Data.lists.length === 0) {
    Data.lists = props.flatten.map(el => {
      return {
        stock: el.stock || 0, // 总库存
        marketPriceFee: el.marketPriceFee, // 市场价
        priceFee: el.priceFee, // 销售价
        volume: el.volume, // 体积
        weight: el.weight, // 重量
        stockWarning: el.stockWarning, // 库存预警
        partyCode: el.partyCode, // 商品编码
        modelId: el.modelId, // 条形码
        status: el.status, // 状态
        stockPointList: el.stockPointList || [], // 库存点库存
        filterList: el.filterList || [], // 过滤的门店列表
        filterStock: el.filterStock || 0, // 过滤的门店库存
        skuComboList: el.skuComboList || [], // 组合单品列表
        skuId: el.skuId || '',
        voucherId: el.voucherId,
        voucherName: el.voucherName
      }
    })
  }
}, { deep: true, immediate: true })

watch(() => Data.lists, async (data) => {
  emit('on-change-data', data)
}, {
  deep: true,
  immediate: true
})

watch(() => setLeafList.value, () => {
  if (setLeafList.value.length > 1) {
    Data.inputWidth = '80px'
    Data.selectWidth = '80px'
  } else if (setLeafList.value.length > 2) {
    Data.selectWidth = '60px'
  } else {
    Data.inputWidth = '100px'
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
  Data.lists[index].stock = sum || 0
  stockValidAndChange({ $index: index, row: Data.lists[index] })
}

const genLists = (filter, flatten) => {
  const baseData = {
    stock: 0, // 库存
    marketPriceFee: '', // 市场价
    priceFee: 0.01, // 销售价
    volume: 0, // 体积
    weight: 0, // 重量
    stockWarning: 0, // 库存预警
    partyCode: '', // 商品编码
    modelId: '', // 条形码
    status: 1, // 状态
    skuComboList: [],
    skuId: '',
    voucherId: null,
    voucherName: ''
  }
  if (filter.length) {
    return genFlatten(filter, flatten, { extraData: baseData })
  } else {
    return [baseData]
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
  // eslint-disable-next-line no-unused-vars
  filterData.value.forEach((item, index) => {
    rowspan(index)
  })
}

const handleSpanMethod = ({ rowIndex, columnIndex }) => {
  for (let i = 0; i < filterData.value.length; i++) {
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
 * 库存修改与验证
 * @param {Object} scope 表格当前行
 * @param {String} type
 */
const stockValidAndChange = (scope, type) => {
  const { $index, row } = scope
  if (type === 'stock' && (props.spuMold === 1 || (props.spuMold === 3 && !props.isBindVoucher) || !isHaveStockPoint.value)) {
    // 虚拟商品修改时或不存在出默认仓库id的库存点时更新库存信息（库存点ID为默认仓库id）
    const stockPointInfo = JSON.parse(JSON.stringify(Data.lists[$index].stockPointList[0]))
    const changeStock = stockPointInfo.skuId ? row.stock - stockPointInfo.stock + (stockPointInfo.changeStock || 0) : null
    Data.lists[$index].stockPointList = [{
      ...stockPointInfo,
      changeStock: stockPointInfo.skuId ? changeStock : undefined,
      stock: row.stock || 0,
      stockPointId: props.stockPointInfo.defaultWarehouseId,
      stockPointType: 1,
      type: 0
    }]
    Data.lists[$index].stock = calcStock(Data.lists[$index].stockPointList)
  }
  /** 无属性 */
  if (Data.originList?.length === 1 && !Data.originList?.[0].spuSkuAttrValues && !row.spuSkuAttrValues) {
    Data.lists[$index].changeStock = parseInt(row.stock) - parseInt(Data.originList[0].stock)
    return
  }

  /** 有属性 */
  const spuSkuAttrValues = row.spuSkuAttrValues || []
  const currentAttrValIds = (spuSkuAttrValues?.map(item => item.attrValueId))?.filter(id => id)
  // 当前无输入，赋值0（默认值）
  if (!Data.lists[$index].stock) {
    Data.lists[$index].stock = 0
  }
  const originSku = Data.originList?.find(item => {
    const orginSpuSkuAttrValues = item?.spuSkuAttrValues
    const originAttrValIds = (orginSpuSkuAttrValues?.map(val => val.attrValueId))?.filter(id => id)
    return isEqualArrays(currentAttrValIds, originAttrValIds)
  })
  // 匹配失败, 无相同sku
  if (!originSku) {
    return
  }
  // 当前sku与原sku匹配成功（存在originSku）,判断库存
  const originStock = originSku.stock
  if (originStock !== undefined) { // 存在原库存
    if (props.spuMold === 1) {
      Data.lists[$index].stockPointList[0].changeStock = parseInt(row.stock) - parseInt(originStock)
    }
    Data.lists[$index].changeStock = parseInt(row.stock) - parseInt(originStock)
  }
}

// 两个数组是否相等
const isEqualArrays = (arr1, arr2) => {
  return arr1.length === arr2.length && arr1.every(val1 => !!arr2?.find(val2 => String(val1) === String(val2)))
}

const { proxy } = getCurrentInstance()

const changeValue = () => {
  proxy.$forceUpdate() // 刷新
}

// 立即设置
const setNow = () => {
  const vaildSkuValArr = []
  setLeafList.value.forEach((item) => {
    vaildSkuValArr.push(item.value)
  })
  Data.lists.forEach((item, index) => {
    const { spuSkuAttrValues } = item
    // -1为全部项
    if (spuSkuAttrValues.every((attr, idx) => {
      return vaildSkuValArr[idx] === -1 || attr.attrValueId === vaildSkuValArr[idx]
    })) {
      // setItem(item, index)
      item.marketPriceFee = Data.markedPriceIntVal !== null ? Data.markedPriceIntVal : item.marketPriceFee || 0
      item.priceFee = Data.priceIntVal !== null ? Data.priceIntVal : item.priceFee || 0.01 // 销售价
      item.volume = Data.volumeIntVal !== null ? Data.volumeIntVal : item.volume // 体积
      item.weight = Data.weightIntVal !== null ? Data.weightIntVal : item.weight // 重量
      item.stockWarning = Data.stockWarningIntVal !== null ? Data.stockWarningIntVal : item.stockWarning
      item.partyCode = Data.skuCodeIntVal || item.partyCode // 商品编码
      item.modelId = Data.barCodeIntVal || item.modelId // 商品条形码
      let isHaveDefaultWarehouse = false // 库存中是否存在默认仓库
      if (Data.stockIntVal || Data.stockIntVal === 0) {
        for (let i = 0; i < item.stockPointList.length; i++) {
          if (item.stockPointList[i].skuId) {
            // 存在skuId，则计算changeStock，并将默认仓库库存设置为Data.stockIntVal
            if (item.stockPointList[i].type !== 0) {
              // 非默认仓库，库存改为0
              /* item.stockPointList[i].changeStock = -(item.stockPointList[i].stock - (item.stockPointList[i].changeStock || 0))
            item.stockPointList[i].stock = 0 */
              item.stockPointList.splice(i, 1)
              i--
            } else {
              item.stockPointList[i].changeStock = Data.stockIntVal - item.stockPointList[i].stock + (item.stockPointList[i].changeStock || 0)
              item.stockPointList[i].stock = Data.stockIntVal
              isHaveDefaultWarehouse = true
            }
          } else {
            if (item.stockPointList[i].type === 0) {
              isHaveDefaultWarehouse = true
              item.stockPointList[i].stock = Data.stockIntVal // 无skuId的默认仓库（此次修改新增的仓库库存，无需传changeStock）
              continue
            }
            item.stockPointList.splice(i, 1) // 不存在skuId，则删除当前项
            i--
          }
        }
        if (!isHaveDefaultWarehouse) {
        // 不存在默认仓库，则存储一条默认仓库信息
          item.stockPointList.push({
            stock: Data.stockIntVal,
            stockPointId: props.stockPointInfo.defaultWarehouseId,
            stockPointType: 1,
            type: 0
          })
        }
      }
      item.stock = ((Data.stockIntVal || Data.stockIntVal === 0) && Data.stockIntVal >= 0) ? Data.stockIntVal : item.stock
      // 如果存在原库存
      if (props.spuId && item.stock >= 0 && (Data.stockIntVal && Data.stockIntVal >= 0) && parseInt(Data.originList[index]?.stock) >= 0) {
        // 改变的库存数量(新增-原有，changeStock允许负数)
        item.changeStock = Data.stockIntVal - parseInt(Data.originList[index].stock)
      }
    }
  })
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
 * 重置
 */
const resetSkuTable = () => {
  const baseData = {
    marketPriceFee: 0,
    modelId: '',
    partyCode: '',
    priceFee: 0,
    status: 1,
    stock: 0,
    volume: '',
    weight: '',
    stockWarning: 0,
    skuComboList: [],
    voucherId: null,
    voucherName: ''
  }
  Data.lists = [baseData]
}
watch(() => filterData.value, () => {
  if (!isEditInit) {
    const list = props.flatten?.map((item, index) => {
      const obj = Data.lists[index] ? Data.lists[index] : {}
      return {
        ...item,
        ...obj
      }
    })
    Data.lists = genLists(filterData.value, list)
    if (!(props.spuId && props.isNoSkuValue)) {
      Data.originList = JSON.parse(JSON.stringify(Data.lists))
    }
  } else {
    isEditInit = false
  }
  computeRowspan()
}, { immediate: true })

/** start 关联商品相关 */

// 当前选中的列表序号
const newListIndex = ref(null)
const associationGoodsRef = ref(null)
const associationGoodsVisible = ref(false)
/**
 * 打开商品列表弹窗,选择需要关联的商品
 */
const onAssociationGoods = (scope) => {
  newListIndex.value = Number(scope.$index)
  associationGoodsVisible.value = true
  nextTick(() => {
    associationGoodsRef.value.openDialog(Data.lists[newListIndex.value]?.skuComboList || [])
  })
}
/**
 * 选择商品完成后回调
 */
const onSelectSuccess = (data) => {
  Data.lists[newListIndex.value].skuComboList = data.list
  Data.lists[newListIndex.value].priceFee = 0.01
  Data.lists[newListIndex.value].stock = data.totalStock
}

/** end 关联商品相关 */

/** start 关联电子卡券相关 */

// 当前选中的列表序号
const bindingCardRef = ref(null)
const bindingCardVisible = ref(false)
/**
 * 打开电子卡券列表弹窗,选择需要关联的卡券
 */
const onBindCard = (scope) => {
  newListIndex.value = Number(scope.$index)
  bindingCardVisible.value = true
  nextTick(() => {
    bindingCardRef.value.init(scope.row)
  })
}

/**
 * 选择卡券后回调
 */
const onBindingCardSuccess = (data) => {
  lists.value[newListIndex.value].voucherId = data.voucherId
  lists.value[newListIndex.value].stock = data.notEnabledNum || 0
  lists.value[newListIndex.value].voucherName = data.name

  // 获取库存变更
  const stockPointInfo = JSON.parse(JSON.stringify(Data.lists[newListIndex.value].stockPointList[0]))
  const sku = lists.value[newListIndex.value].stockPointList[0]
  const stock = data.notEnabledNum || 0
  const changeStock = stockPointInfo.skuId ? (stock - (stockPointInfo.stock || sku.oriStock || 0) + (stockPointInfo.changeStock || 0)) : undefined
  // 仅有一个仓库（默认仓库）时，直接修改库存时同步修改库存点列表
  Data.lists[newListIndex.value].stockPointList = [{
    ...stockPointInfo,
    changeStock,
    stock
  }]
}

/** end 关联电子卡券相关 */

// 编码输入框校验
const validatePartyCode = (scope) => {
  const { row, $index } = scope
  // 纯空格校验
  if (validNoEmptySpace(row.partyCode)) {
    Data.lists[$index].partyCode = ''
  }
}

const log = () => {}

onBeforeUnmount(() => {
  clearInterval(Data.timer)
})

defineExpose({
  resetSkuTable
})
</script>

<style lang="scss" scoped>

.sku-table-component {

  // 批量设置
  .batch-settings {
    margin-bottom: 15px;

    :deep(.el-input-number__decrease){
      display: none;
    }
    :deep(.el-input-number__increase){
      display: none;
    }
    :deep(.el-input__wrapper){
      padding-left: 10px !important;
      padding-right: 10px !important;
    }
    .batch {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 15px;

      .set-tips {
        font-size: 13px;
        color: #999;
        margin-left: 15px;
      }
    }
    .bat-set-sel {
      min-width: 720px;
      max-height: 55px;
      white-space: nowrap;/*内容横向排列不换行*/
      overflow-x: auto;
      overflow-y: hidden;/*隐藏溢出部分。横向滚动条自动出现，纵向滚动条隐藏*/
      -ms-overflow-style: none; /* IE 10+ */
      display: flex;
      scrollbar-width: none; /* Firefox */
      .bat-set-item {
        text-align: right;
        flex:1;
        display: inline-block;
        margin-right: 4px;
      }

      .batch{
        flex: 2;
      }

      .select-part {
        flex:1;
        display: inline-block;
        margin-right: 4px;

        .bat-set-item{
          width: 100%;

        }
      }

    }
    .bat-set-sel::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }

    .el-input-number.is-controls-right[class*=mini] [class*=increase],
    .el-input-number.is-controls-right[class*=mini] [class*=decrease] {
      display: none;
    }
  }

  .tableName{
    padding: 0 10px !important;
  }

  :deep(.el-input-number){
    width: 100%;

    .el-input__wrapper{
      padding-left: 10px !important;

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
    :deep(.shade-input.is-disabled) {
      .el-input__wrapper {
        background-color: #ffffff;

        .el-input__inner {
          color: var(--el-input-text-color);
          -webkit-text-fill-color: var(--el-input-text-color);
        }
      }
    }
  }

  :deep(.el-input-number .el-input__inner){
    text-align: left;
  }

  .over-ellipsis {
    line-height: 20px;
    height: auto;
    max-width: 100px;
    white-space: normal;
  }
}
// 新增

</style>
