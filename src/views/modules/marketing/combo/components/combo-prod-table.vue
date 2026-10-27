<template>
  <!-- 商品信息 -->
  <div class="components-combo-prod-table prodItem-container">
    <el-button
      :disabled="productItems.length === limit || pageType === 2"
      @click="selectProdHandle()"
    >
      添加商品
    </el-button>
    <div class="count-desc-text">
      {{ type === 1 ? '主商品为必买商品，此商品详情页展示搭配套餐' : '搭配商品用户可选择购买，最多设置4件' }}
    </div>
    <div
      v-if="!verifyFlag"
      class="error-tips"
    >
      {{ type === 1 ? '主商品不能为空' : '搭配商品数量最多4件' }}
    </div>
    <div
      v-if="productItems && productItems.length > 0"
      class="prodItem-table"
    >
      <el-table
        :data="productItems"
        header-cell-class-name="table-header"
        row-class-name="table-row"
        :style="tableWidth"
      >
        <el-table-column
          :label="'商品信息'"
          prop="reason"
          fixed="left"
          align="center"
          class-name="prod-info-container-cell"
          width="320px"
        >
          <template #default="scope">
            <div class="prod-info-container">
              <div class="prod-image">
                <ImgShow
                  :src="scope.row.pic || scope.row.mainImgUrl"
                  @img-error="scope.row.pic = ''"
                />
              </div>
              <div class="prod-name">
                <div class="prod-name-txt">
                  {{ scope.row.spuName }}
                </div>
                <div
                  v-if="showDistributionTips(scope.row)"
                  class="distribution-tips"
                >
                  提示：该商品与主商品或必选商品没有相同的配送方式，不可购买
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="'参与规格'"
          align="center"
          prop="skuName"
          width="200px"
        >
          <template #default="scope">
            <div
              v-for="(sku, skuIndex) in scope.row.skuList"
              :key="skuIndex"
              class="items name"
            >
              <span class="sku-name">
                {{ sku.skuName || '-' }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="'商品现价'"
          align="center"
          prop="skuName"
          width="200px"
        >
          <template #default="scope">
            <div
              v-for="(sku, skuIndex) in scope.row.skuList"
              :key="skuIndex"
              class="matching-name"
            >
              <span class="sku-name">
                {{ formatPrice(sku.priceFee, 1).toFixed(2) }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="matchingPrice"
          :label="'搭配单价'"
          align="center"
          width="160px"
        >
          <template #default="scope">
            <div
              v-for="(sku, skuIndex) in scope.row.skuList"
              :key="sku.skuId"
              class="items name"
            >
              <div class="matching-price">
                <el-input-number
                  v-model="sku.matchingPrice"
                  :disabled="pageType === 2"
                  :precision="2"
                  controls-position="right"
                  :max="formatPrice(sku.priceFee, 1)"
                  :step="0.01"
                  style="width: 100%;"
                  class="tag-input-width"
                  @blur="inputMatchingPrice(sku, formatPrice(sku.priceFee, 1), scope.$index, skuIndex)"
                />
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="matchingPrice"
          :label="'起搭数量'"
          align="center"
          width="160px"
        >
          <template #default="scope">
            <div class="custom-rate">
              <input
                v-model="scope.row.leastNum"
                :disabled="pageType === 2"
                type="number"
                :precision="0"
                :max="99999999"
                :step="1"
                style="width: 80%;"
                class="tag-input-width"
                @blur="inputValue(scope.row, scope.row.leastNum, 'leastNum', 1, 99999999)"
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="type === 2"
          prop="required"
          :label="'是否必选'"
          align="center"
          width="140px"
        >
          <template #default="scope">
            <el-checkbox
              v-model="scope.row.required"
              :disabled="pageType === 2 || showDistributionTips(scope.row)"
              :true-label="1"
              :false-label="0"
              @change="checkRequired(scope.row, scope.$index)"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-if="pageType === 1"
          align="center"
          :label="'操作'"
          fixed="right"
          width="140px"
        >
          <template #default="scope">
            <div class="text-btn-con">
              <el-button
                type="primary"
                link
                @click="editSpecHandle(scope.$index, scope.row)"
              >
                选择规格
              </el-button>
              <el-button
                type="primary"
                link
                @click="onDelete(scope.$index, scope.row.spuId)"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <sku-select
      v-if="addProdVisible"
      ref="skuSelectRef"
      :chosen-check-items="productItems"
      :limit="limit"
      :spu-status="1"
      :status="1"
      :is-active="type === 2 ? 1 : null"
      :sku-status="1"
      :is-virtual="isVirtual"
      :mold="mold"
      :not-spu-molds="notSpuMolds"
      :pre-sale-type="preSaleType"
      :type="1"
      :can-deposit="0"
      :main-prod-id="mainProdId"
      @refresh-select-prods="selectProdItem"
    />
    <prod-sku-select
      v-if="prodSkuSelectDialogVisible"
      ref="prodSkuSelectRef"
      @refresh-select-skus="selectSkuItem"
    />
  </div>
</template>

<script setup>
import { formatPrice } from '@/utils'
import skuSelect from '@/components/sku-select/index.vue'
import prodSkuSelect from './prod-sku-select.vue'

const props = defineProps({
  type: {
    default: 1,
    type: Number // 1 主商品 2 搭配商品
  },
  isVirtual: {
    default: 1,
    type: Number // 商品类型
  },
  mainProdId: {
    default: () => { },
    type: Array // 主商品Id
  },
  mainProdDeliveryMode: {
    default: () => { },
    type: Object // 主商品配送方式
  },
  comboId: {
    default: 0,
    type: Number // 套餐id
  },
  limit: {
    default: -1,
    type: Number // 限制数量 -1代表没有限制
  },
  pageType: {
    default: 1,
    type: Number // 1：新增/编辑 2：查看
  },
  mold: {
    default: null,
    type: Number // 商品类别 1.实物商品 2. 虚拟商品
  },
  notSpuMolds: {
    default: () => [],
    type: Array // 0.实物商品 1. 虚拟商品 2.组合商品 2.组合商品
  },
  preSaleType: {
    default: -1,
    type: Number // 预售类型 -1：未开启 0.全款预售 1.定金预售 预售商品不能参与套餐，所以值固定为-1
  },
  isActive: {
    default: null,
    type: Number // null: 普通商品 1：普通商品 + 活动商品
  }
})

const emit = defineEmits(['refreshSelectProds', 'refreshDeleteHandle'])

const tableWidth = reactive({
  width: '1180px'
})
const productItems = ref([]) // 已选择的商品项
const init = (initProductItems) => {
  if (props.type === 1) {
    tableWidth.width = props.pageType === 1 ? '1180px' : '1040px'
  } else {
    tableWidth.width = props.pageType === 1 ? '1320px' : '1180px'
  }
  if (initProductItems) {
    computeRowspan(initProductItems)
    productItems.value = initProductItems
  } else {
    productItems.value = []
  }
}

const addProdVisible = ref(false) // 添加商品弹窗是否可见
const skuSelectRef = ref(null)
const selectProdHandle = () => {
  if (productItems.value.length >= props.limit || props.pageType === 2) {
    return
  }
  addProdVisible.value = true
  nextTick(() => {
    skuSelectRef.value?.init()
  })
}

const verifyFlag = ref(true) // 数据校验标记，true：正确，false：错误
// 选择商品项回调
const selectProdItem = (prodItems) => {
  if (props.type === 1) {
    tableWidth.width = props.pageType === 1 ? '1180px' : '1040px'
  } else {
    tableWidth.width = props.pageType === 1 ? '1320px' : '1180px'
  }
  let requiredCount = 0
  prodItems.forEach(prod => {
    prod.skuList.forEach(sku => {
      sku.matchingPrice = sku.matchingPrice ? sku.matchingPrice : formatPrice(sku.priceFee, 1)
    })
    prod.required = prod.required === 1 ? 1 : 0
    const item = productItems.value.find(item => prod.spuId === item.spuId)
    if (item) {
      prod.required = item.required
    }
    requiredCount += prod.required ? 1 : 0
    prod.leastNum = prod.leastNum ? prod.leastNum : 1
  })
  computeRowspan(prodItems)
  emit('refreshSelectProds', prodItems)
  // 重置verifyFlag
  if (props.type === 1) {
    if (prodItems.length === 1) {
      verifyFlag.value = true
    }
  } else {
    if (prodItems.length > 0 && prodItems.length < 5 && requiredCount > 0) {
      verifyFlag.value = true
    }
  }
  productItems.value = prodItems
}

// 目前支持的配送方式
const supportDeliveryMode = computed(() => {
  const tempDeliveryMode = JSON.parse(JSON.stringify(props.mainProdDeliveryMode))
  productItems.value.forEach(matchingProd => {
    if (matchingProd.required) {
      for (const key in matchingProd.deliveryMode) {
        if (!matchingProd.deliveryMode[key]) {
          tempDeliveryMode[key] = false
        }
      }
    }
  })
  return tempDeliveryMode
})

// 判断显示配送信息提示
const showDistributionTips = (prod) => {
  if (props.type === 1 || Object.keys(props.mainProdDeliveryMode).length === 0) {
    return false
  }

  for (const key in supportDeliveryMode.value) {
    if (supportDeliveryMode.value[key] && prod.deliveryMode[key]) {
      return false
    }
  }

  return true
}

// 选择sku项回调
const selectSkuProdIndex = ref(null)
const selectSkuItem = (skuList) => {
  if (!skuList || skuList.length === 0) {
    const spuId = productItems.value[selectSkuProdIndex.value].spuId
    productItems.value.splice(selectSkuProdIndex.value, 1)
    emit('refreshDeleteHandle', spuId)
  } else {
    skuList.forEach(sku => {
      sku.matchingPrice = sku.matchingPrice ? sku.matchingPrice : formatPrice(sku.priceFee, 1)
    })
    productItems.value[selectSkuProdIndex.value].skuList = skuList
  }
  computeRowspan(productItems.value)
}

let rowspan = {}// 表格合并数据
const computeRowspan = (prodItems) => {
  rowspan = {}
  let spuId = -1
  let firstIndex = -1
  for (let i = 0; i < prodItems.length; i++) {
    if (prodItems[i].spuId === spuId) {
      if (rowspan[firstIndex]) {
        rowspan[firstIndex] += 1
      } else {
        rowspan[firstIndex] = 2
      }
    } else {
      firstIndex = i
      spuId = prodItems[i].spuId
      rowspan[firstIndex] = 1
    }
  }
}

// 校验数据，校验成功返回数据项，不成功返回null
const verifyDataForm = () => {
  if (props.type === 1) {
    if (productItems.value.length === 1) {
      verifyFlag.value = true
      return productItems.value
    } else {
      verifyFlag.value = false
      return null
    }
  }
  if (props.type === 2) {
    if (productItems.value.length <= 4) {
      verifyFlag.value = true
      return productItems.value
    } else {
      verifyFlag.value = false
      return null
    }
  }
}

// 输入值校验
const inputMatchingPrice = (row, max, scopeIndex, skuIndex) => {
  const con = JSON.parse(JSON.stringify(productItems.value[scopeIndex]))
  const matchingPrice = String(row.matchingPrice).match(/\d+(\.\d{0,2})?/) ? Number.parseFloat(String(row.matchingPrice).match(/\d+(\.\d{0,2})?/)[0]) : null
  if (matchingPrice > max) {
    row.matchingPrice = max
    con.skuList[skuIndex].matchingPrice = max
  }
  if (matchingPrice < 0.01 || !matchingPrice) {
    row.matchingPrice = 0.01
    con.skuList[skuIndex].matchingPrice = 0.01
  }
  productItems.value[scopeIndex] = con
}

// 输入值校验
const inputValue = (row, val, dataFields, min, max) => {
  if (row !== undefined && row !== null) {
    if (val > max) {
      row[dataFields] = max
    }
    if (val < min || !val) {
      row[dataFields] = min
    }
  } else {
    row[dataFields] = min
  }
}

// 编辑商品规格
const prodSkuSelectDialogVisible = ref(false) // 商品规格选择弹窗是否可见
const prodSkuSelectRef = ref(null)
const editSpecHandle = (index, row) => {
  selectSkuProdIndex.value = index
  prodSkuSelectDialogVisible.value = true
  nextTick(() => {
    prodSkuSelectRef.value.init(row.spuId, row.skuList)
  })
}

const checkRequired = (row, index) => {
  productItems.value[index] = row
}

// 删除已选择的商品项
const onDelete = (index, id) => {
  productItems.value.splice(index, 1)
  emit('refreshDeleteHandle', id)
  computeRowspan(productItems.value)
}
const onReset = () => {
  productItems.value = []
}

defineExpose({ init, verifyDataForm, onReset })
</script>

<style lang="scss" scoped>
@use './combo-prod-table.scss';
</style>
