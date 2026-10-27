<template>
  <!-- 商品信息 -->
  <div class="components-giveaway-prod-table prodItem-container">
    <el-button
      :disabled="productItems.length === limit || pageType === 2"
      @click="onSelectProd()"
    >
      添加实物商品
    </el-button>
    <div class="count-desc-text">
      赠送商品最多设置15个sku
    </div>
    <div
      v-if="!verifyFlag"
      class="error-tips"
    >
      赠送商品不能为空
    </div>
    <div
      v-if="productItems && productItems.length > 0"
      class="prodItem-table"
    >
      <el-table
        :data="productItems"
        header-cell-class-name="table-header"
        :span-method="tableSpanMethod"
        row-class-name="table-row"
        :style="tableWidth"
      >
        <el-table-column
          label="商品信息"
          prop="reason"
          fixed="left"
          align="center"
          class-name="prod-info-container-cell"
          width="320px"
        >
          <template #default="scope">
            <div class="prod-info-container">
              <div class="prod-image">
                <prod-pic
                  :height="'80'"
                  :width="'80'"
                  :pic="scope.row.mainImgUrl"
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
                  提示：该商品与主商品没有相同的配送方式，将不会在活动页显示
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="参与规格"
          align="center"
          prop="skuName"
          width="200px"
        >
          <template #default="scope">
            {{ scope.row.skuName ? scope.row.skuName : scope.row.skuLangList && scope.row.skuLangList.length > 0 ? scope.row.skuLangList[0].skuName || '-' : '-' }}
          </template>
        </el-table-column>
        <el-table-column
          label="商品现价"
          align="center"
          prop="priceFee"
          width="200px"
        >
          <template #default="scope">
            <span>{{ formatPrice(scope.row.priceFee,1).toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="refundPrice"
          label="售后价"
          align="center"
          width="160px"
        >
          <template #header>
            售后价
            <el-tooltip
              class="item"
              effect="dark"
              content="当赠品订单发生退货时，“售后价”将作为赠品的退款金额从用户退款金额中扣除。"
              placement="top"
            >
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>
          <template #default="scope">
            <div class="custom-rate">
              <input
                v-model.number="scope.row.refundPrice2"
                :disabled="pageType === 2"
                type="number"
                :precision="2"
                :max="formatPrice(scope.row.priceFee,1).toFixed(2)"
                :min="0"
                :step="0.01"
                class="tag-input-width"
                @keyup="
                  scope.row.refundPrice2 = String(scope.row.refundPrice2).match(/\d+(\.\d{0,2})?/) ?
                    Number.parseFloat(String(scope.row.refundPrice2).match(/\d+(\.\d{0,2})?/)[0]) :
                    ''
                "
                @blur="inputValue(scope.$index, scope.row.refundPrice2, 'refundPrice2', 0,formatPrice(scope.row.priceFee,1).toFixed(2))"
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="giveawayNum"
          label="赠送数量"
          align="center"
          width="160px"
        >
          <template #default="scope">
            <div class="custom-rate">
              <input
                v-model="scope.row.giveawayNum"
                :disabled="pageType === 2"
                type="number"
                :precision="0"
                :min="1"
                :max="99999999"
                :step="1"
                style="width: 80%;"
                class="tag-input-width"
                @keyup="
                  scope.row.giveawayNum = String(scope.row.giveawayNum).match(/[^0-9]/) ? 1 : scope.row.giveawayNum
                "
                @blur="inputValue(scope.$index, scope.row.giveawayNum, 'giveawayNum', 1, 99999999)"
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="pageType === 1"
          align="center"
          label="操作"
          fixed="right"
          width="140px"
        >
          <template #default="scope">
            <div class="text-btn-con">
              <el-button
                type="primary"
                link
                @click="onDelete(scope.$index)"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <skuSelect
      v-if="addProdVisible"
      ref="skuSelectRef"
      :chosen-check-items="productItems"
      :limit="15"
      :limit-type="2"
      :item-data-type="2"
      :status="1"
      :is-active="1"
      :spu-status="1"
      :mold="1"
      :not-spu-molds="[3]"
      :can-deposit="0"
      :is-giveaway="1"
      @refresh-select-prods="selectProdItem"
    />
  </div>
</template>

<script setup>
import skuSelect from '@/components/sku-select/index.vue'
import ProdPic from '@/components/prod-pic/index.vue'
import { formatPrice } from '@/utils'

const props = defineProps({
  type: {
    default: 1,
    type: Number // 1 主商品 2 搭配商品
  },
  mainProdDeliveryMode: {
    default: () => { },
    type: Object // 主商品配送方式
  },
  limit: {
    default: -1,
    type: Number // 限制数量 -1代表没有限制
  },
  pageType: {
    default: 1,
    type: Number // 1：新增/编辑 2：查看
  }
})
const emit = defineEmits(['refreshSelectProds'])

const tableWidth = reactive({
  width: '1180px'
})
const productItems = ref([]) // 已选择的商品项
const addProdVisible = ref(false) // 添加商品弹窗是否可见
const verifyFlag = ref(true) // 数据校验标记，true：正确，false：错误
const rowspan = ref({}) // 表格合并数据

const init = (initProductItems) => {
  tableWidth.width = props.pageType === 1 ? '1180px' : '1040px'
  if (initProductItems) {
    computeRowspan(initProductItems)
    initProductItems.forEach(item => {
      item.refundPrice2 = formatPrice(item.refundPrice, 1).toFixed(2)
    })
    productItems.value = initProductItems
  } else {
    productItems.value = []
  }
}

const skuSelectRef = ref(null)
const onSelectProd = () => {
  if (productItems.value.length >= props.limit || props.pageType === 2) {
    return
  }
  addProdVisible.value = true
  nextTick(() => {
    skuSelectRef.value?.init()
  })
}

// 判断显示配送信息提示
const showDistributionTips = (prod) => {
  if (Object.keys(props.mainProdDeliveryMode).length === 0) {
    return false
  }

  for (const key in props.mainProdDeliveryMode) {
    if (props.mainProdDeliveryMode[key] && prod.deliveryMode[key]) {
      return false
    }
  }

  return true
}

// 选择商品项回调
const selectProdItem = (prodItems) => {
  productItems.value = []
  let requiredCount = 0
  prodItems.forEach(item => {
    item.refundPrice = item.refundPrice ? item.refundPrice : 0
    item.refundPrice2 = item.refundPrice ? formatPrice(item.refundPrice, 1) : 0
    item.required = item.required === 0 ? 0 : 1
    requiredCount += item.required ? 1 : 0
    item.giveawayNum = item.giveawayNum ? item.giveawayNum : 1
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

const computeRowspan = (prodItems) => {
  rowspan.value = {}
  let spuId = -1
  let firstIndex = -1
  for (let i = 0; i < prodItems.length; i++) {
    if (prodItems[i].spuId === spuId) {
      if (rowspan.value[firstIndex]) {
        rowspan.value[firstIndex] += 1
      } else {
        rowspan.value[firstIndex] = 2
      }
    } else {
      firstIndex = i
      spuId = prodItems[i].spuId
      rowspan.value[firstIndex] = 1
    }
  }
}

// eslint-disable-next-line no-unused-vars
const tableSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  if (columnIndex === 0) {
    if (rowspan.value[rowIndex]) {
      return {
        rowspan: rowspan.value[rowIndex],
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

// 校验数据，校验成功返回数据项，不成功返回null
const verifyDataForm = () => {
  if (productItems.value.length > 0 && productItems.value.length <= 15) {
    productItems.value.forEach(item => {
      if (item.refundPrice != null) {
        item.refundPrice = formatPrice(item.refundPrice2)
      }
    })
    return productItems.value
  } else {
    verifyFlag.value = false
    return null
  }
}

// 输入值校验
const inputValue = (index, val, dataFields, min, max) => {
  const info = productItems.value[index]
  if (index !== undefined && index !== null) {
    if (val > max) {
      info[dataFields] = max
      productItems.value[index] = { ...info }
    }
    if (val < min || !val) {
      info[dataFields] = min
      productItems.value[index] = { ...info }
    }
  }

  if (info[dataFields] === '' && dataFields === 'refundPrice') {
    info[dataFields] = 0
    productItems.value[index] = { ...info }
  }
}

// 删除已选择的商品项
const onDelete = (index) => {
  productItems.value.splice(index, 1)
  computeRowspan(productItems.value)
}

defineExpose({ init, verifyDataForm })
</script>
<style lang="scss" scoped>
.prodItem-container {
  .count-desc-text {
    margin-bottom: 4px;
    color: #888888;
    font-size: 14px;
  }
  .error-tips {
    color: #f56c6c;
    font-size: 12px;
    padding-bottom: 4px;
  }
  .prodItem-table {
    :deep(.prod-info-container-cell){
      .cell{
        overflow:visible;
      }
    }
    .prod-info-container {
      height: 100%;
      display: flex;
      justify-content: space-between;
      .prod-image {
        margin-right: 20px;
        width: 80px;
        height: 80px;
      }
      .prod-name {
        position: relative;
        flex: 1;
        height: 80px;
        display: flex;
        flex-direction: column;
        text-align: start;
        justify-content: center;
        .prod-name-txt {
          font-size: 14px;
          color: #333333;
          word-break: break-all;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }

        .distribution-tips{
          position: absolute;
          white-space: nowrap;
          bottom: -12px;
          color:#ec1c24;
        }
      }
    }
    // 表格输入框
    .tag-input-width {
      width: 100%;
      padding-left: 5px;
      padding-right: 0;
      border: 1px solid #DCDCDC;
      border-radius: 2px;
      height: 32px;
      line-height: 32px;
      box-sizing: border-box;
      &:focus {
        outline: 0;
      }
    }
  }
}
</style>
