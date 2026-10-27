<template>
  <!-- 商品信息 -->
  <div class="component-stock-bill-sku-info">
    <span class="title">{{ $t('group.prodInfo') }}</span>
    <el-divider />
    <el-button
      type="primary"
      @click="selectProdHandle()"
    >
      {{ $t('stock.addProd') }}
    </el-button>
    <el-tooltip
      class="item"
      :disabled="stockBillLogItems.length === 0"
      effect="dark"
      :content="$t('stock.uploadNotEmptyTips')"
      placement="top"
    >
      <el-button
        :class="{'disabled-btn': stockBillLogItems.length > 0}"
        @click="uploadSku"
      >
        {{ $t('stock.batchImport') }}
      </el-button>
    </el-tooltip>
    <el-button
      v-if="failureCount > 0"
      class="default-btn"
      @click="deleteFailureProd"
    >
      {{ $t('stock.deleteFailureProd') }}
    </el-button>
    <div class="count-desc-text">
      {{ $t('order.order.total') }}{{ stockBillLogItems.length }}{{ type === 1 ? $t('stock.prodCountOutTips') : $t('stock.prodCountTips') }}:{{ totalCount }}
    </div>
    <div
      v-if="failureCount > 0"
      class="count-desc-text"
    >
      {{ $t('stock.include') }}{{ failureCount }}{{ $t('stock.failureCountTips') }}
    </div>
    <div
      v-if="!verifyFlag"
      class="error-tips"
    >
      {{ $t('stock.prodNotEmpty') }}
    </div>
    <div class="prodItem-table">
      <el-table
        :data="stockBillLogItems.slice((page.currentPage - 1) * page.pageSize, page.currentPage * page.pageSize)"
        header-cell-class-name="table-header"
        row-class-name="table-row"
      >
        <el-table-column
          :label="$t('group.prodInfo')"
          prop="reason"
          fixed="left"
          align="center"
          width="320px"
        >
          <template #default="scope">
            <div class="prod-info-container">
              <div class="prod-image">
                <ImgShow
                  v-if="scope.row.imgUrl"
                  :src="scope.row.imgUrl"
                  :img-style="{width: '100%',height: '100%'}"
                />
                <ImgShow
                  v-else-if="scope.row.mainImgUrl"
                  :src="scope.row.mainImgUrl"
                  :img-style="{width: '100%',height: '100%'}"
                />
                <ImgShow
                  v-else
                  :src="scope.row.pic"
                  :img-style="{width: '100%',height: '100%'}"
                />
              </div>
              <div class="prod-name">
                <el-tooltip
                  :content="scope.row.spuName"
                  placement="top"
                  effect="light"
                >
                  <div class="prod-name-txt">
                    {{ scope.row.spuName }}
                  </div>
                </el-tooltip>
                <el-tooltip
                  :content="scope.row.skuName"
                  placement="top"
                  effect="light"
                >
                  <div class="spec">
                    {{ scope.row.skuName }}
                  </div>
                </el-tooltip>
                <div class="prod-no">
                  {{ scope.row.partyCode }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('stock.unit')"
          prop="type"
          align="center"
        >
          <template #default="scope">
            <span class="table-cell-text line-clamp-one">{{ scope.row.unit || $t('stock.pieces') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="type === 1"
          :prop="stockBillLogId?'afterStock':'stock'"
          :label="$t('stock.availableStock')"
          align="center"
        />
        <el-table-column
          prop="stock_count"
          :label="type === 1 ? $t('stock.deliveryCount') : $t('stock.warehousingCount')"
          align="center"
        >
          <template #default="scope">
            <el-tooltip
              :disabled="scope.row.status !== -1"
              content="当前商品已失效"
              placement="top"
              effect="light"
            >
              <div class="custom-rate">
                <el-input
                  v-model="scope.row.stockCount"
                  :disabled="scope.row.status === -1"
                  onkeyup="value=value.replace(/[^\d]/g,'')"
                  oninput="if(value<0 || value >9999999)value=0"
                  type="number"
                  :min="0"
                  :max="9999999"
                  :precision="0"
                  style="width: 80%;"
                  @change="inputStockCount(scope.$index, scope.row.stockCount)"
                  @blur="inputStockCount(scope.$index, scope.row.stockCount)"
                />
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('table.actions')"
          fixed="right"
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
      <el-pagination
        class="pagination"
        :current-page="page.currentPage"
        :page-size="page.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="stockBillLogItems.length"
        @current-change="onPageChange"
      />
    </div>
    <skuSelect
      v-if="addProdVisible"
      ref="ProdsSelectRef"
      :chosen-check-items="productItems"
      :is-memory-old-data="true"
      :is-compose="0"
      :type="type===1 ? 1 : 0"
      data-url="/mall4cloud_product/m/stock_point_sku/page"
      :http-params="httpParams"
      @refresh-select-prods="selectProdItem"
    />
    <stockSkuUpload
      v-if="batchImportVisible"
      ref="skuUploadRef"
      :stock-point-id="stockPointInfo.stockPointId"
      :type="type"
      @refresh-data-list="refreshDataList"
    />
  </div>
</template>

<script setup>
import skuSelect from './sku-select-components.vue'
import stockSkuUpload from './stock-sku-upload.vue'
import { ElMessage } from 'element-plus'
import { getStockPointInfo } from '@/api/stock/warehouse-station.js'

const props = defineProps({
  type: {
    default: 0,
    type: Number // 1 出库 2 入库
  },
  stockBillLogId: {
    default: 0,
    type: Number
  },
  stockBillLogInfo: {
    default: () => {},
    type: Object
  }
})

const stockBillLogItems = ref([]) // 合并商品与单品结果列表
const productItems = ref([]) // 已选择的商品项
const addProdVisible = ref(false) // 添加商品弹窗是否可见
const batchImportVisible = ref(false) // 批量导入商品弹窗是否可见
const verifyFlag = ref(true) // 数据校验标记，true：正确，false：错误
const totalCount = ref(0) // 总出入库量
const failureCount = ref(0) // 失效的商品数量
const page = reactive({
  currentPage: 1, // 初始页
  pageSize: 10 // 每页数据大小
})

watch(
  () => props.stockBillLogInfo,
  (val) => {
    const info = JSON.parse(JSON.stringify(val))
    stockBillLogItems.value = info.stockBillItemLogs || []
    stockBillLogItems.value.forEach(item => {
      totalCount.value += parseInt(item.stockCount)
    })
    productItems.value = info.stockBillItemLogs ? [...info.stockBillItemLogs] : []
  },
  { immediate: true },
  { deep: true }
)

onMounted(() => {
  onGetStockPointInfo()
})

let defaultWarehouseId = null
// 获取默认仓库id
const onGetStockPointInfo = () => {
  getStockPointInfo().then((res) => {
    defaultWarehouseId = res.defaultWarehouseId
  })
}

const ProdsSelectRef = ref(null)
const httpParams = ref({})
const selectProdHandle = () => {
  if (!stockPointInfo.value.stockPointId) {
    ElMessage({
      message: '请先选择库存点',
      type: 'error',
      duration: 1500
    })
    return
  }
  addProdVisible.value = true
  if (props.type === 1) {
    httpParams.value = {
      stockPointId: stockPointInfo.value.stockPointId,
      stockPointType: stockPointInfo.value.stockPointType, // 库存点类型 1仓库 2门店
      type: stockPointInfo.value.warehouseType, // 仓库类型(0默认仓库，1区域仓库)
      stockMode: stockPointInfo.value.stockMode // 库存模式
    }
  } else {
    httpParams.value = {
      type: stockPointInfo.value.warehouseType, // 仓库类型(0默认仓库，1区域仓库)
      stockMode: stockPointInfo.value.stockMode, // 库存模式
      stockPointType: stockPointInfo.value.stockPointType, // 库存点类型 1仓库 2门店
      stockPointId: defaultWarehouseId,
      inStockPointId: stockPointInfo.value.stockPointId
    }
  }
  nextTick(() => {
    ProdsSelectRef.value.init(httpParams.value)
  })
}
const deleteFailureProd = () => {
  const stockBillLogArr = []
  const prodArr = []
  productItems.value.forEach(item => {
    if (item.status !== -1) {
      prodArr.push(item)
      stockBillLogArr.push(item)
    } else {
      totalCount.value -= parseInt(item.stockCount)
    }
  })
  productItems.value = prodArr
  stockBillLogItems.value = stockBillLogArr
  page.currentPage = 1
  failureCount.value = 0
}
const selectProdItem = (prodItem) => {
  productItems.value = prodItem
  mergeProdAndRetail()
}
const mergeProdAndRetail = () => {
  const res = []
  totalCount.value = 0
  productItems.value.forEach(item => {
    res.push({ ...item, ...stockPointInfo.value, type: 1 })
    totalCount.value += (parseInt(item.stockCount) || 0)
  })
  verifyFlag.value = res.length !== 0
  stockBillLogItems.value = res
}
const skuUploadRef = ref(null)
const uploadSku = () => {
  if (stockBillLogItems.value && stockBillLogItems.value.length > 0) {
    return
  }
  if (!stockPointInfo.value.stockPointId) {
    ElMessage({
      message: '请先选择库存点',
      type: 'error',
      duration: 1500
    })
    return
  }
  batchImportVisible.value = true
  nextTick(() => {
    skuUploadRef.value.init()
  })
}
const refreshDataList = (e) => {
  page.currentPage = 1
  stockBillLogItems.value = e.stockBillLogItemList
  productItems.value = []
  stockBillLogItems.value.forEach(item => {
    if (props.type === 1 && item.stockPointSkuList?.length) {
      const pointListIndex = item.stockPointSkuList.findIndex((pointItem) => {
        return pointItem.stockPointId === stockPointInfo.value.stockPointId
      })
      item.stock = item.stockPointSkuList[pointListIndex].stock
    }
    productItems.value.push(item)
  })
}

const inputStockCount = (index, val) => {
  let stockCount = parseInt(val)
  stockCount = isNaN(stockCount) ? 0 : stockCount
  if (stockCount > 9999999) {
    stockCount = 9999999
  }
  // 当前位置在商品数组
  if (props.type === 1) {
    if (stockCount > productItems.value[((page.currentPage - 1) * page.pageSize) + index].stocks) {
      stockCount = productItems.value[((page.currentPage - 1) * page.pageSize) + index].stocks
    }
  }
  totalCount.value -= parseInt(productItems.value[((page.currentPage - 1) * page.pageSize) + index].stockCount) || 0
  productItems.value[((page.currentPage - 1) * page.pageSize) + index].stockCount = stockCount
  totalCount.value += stockCount
  stockBillLogItems.value[((page.currentPage - 1) * page.pageSize) + index].stockCount = stockCount
}
/**
 * 删除已选择的商品项
 * @param index 当前商品项在当前页的位置
 */
const onDelete = (index) => {
  // 页码-1 * 页面大小 + index = 当前删除项在合并数组中的位置
  stockBillLogItems.value.splice(((page.currentPage - 1) * page.pageSize) + index, 1)
  // 在商品数组中删除对应的数据
  totalCount.value -= (parseInt(productItems.value[((page.currentPage - 1) * page.pageSize) + index].stockCount) || 0)
  productItems.value.splice(((page.currentPage - 1) * page.pageSize) + index, 1)
  // 判断当前页码是否超过删除后的页码大小
  if (page.currentPage > ((stockBillLogItems.value.length - 1) / page.pageSize + 1)) {
    page.currentPage = --page.currentPage || 1
  }
}
const onPageChange = (val) => {
  page.currentPage = val
}
/**
 * 校验数据，校验成功返回数据项，不成功返回null
 */
const verifyDataForm = () => {
  if (stockBillLogItems.value.length === 0) {
    verifyFlag.value = false
    return null
  } else {
    for (let i = 0; i < stockBillLogItems.value.length; i++) {
      if (!stockBillLogItems.value[i].stockCount || stockBillLogItems.value[i].stockCount === '') {
        ElMessage({
          message: $t('stock.countNotEmptyOr0'),
          type: 'error',
          duration: 1500,
          onClose: () => {
          }
        })
        return null
      }
    }
    verifyFlag.value = true
    return stockBillLogItems.value
  }
}

const stockPointInfo = ref({})
// retainProductItem true：保留商品信息 false：清空商品信息
const onResetData = (data, retainProductItem = false) => {
  if (retainProductItem === false) {
    productItems.value = []
    stockBillLogItems.value = []
    totalCount.value = 0
  }
  stockPointInfo.value = data
}

defineExpose({ verifyDataForm, onResetData })
</script>

<style lang="scss" scoped>

.component-stock-bill-sku-info {
  .title {
    color: #333333;
    font-size: 16px;
    font-weight: bold;
  }
  .count-desc-text {
    margin-top: 8px;
    margin-bottom: 8px;
    color: #333333;
    font-size: 14px;
  }
  .error-tips {
    color: #e43130;
    font-size: 14px;
    padding-bottom: 6px;
  }
  .disabled-btn {
    color: #C0C4CC;
    &:hover {
      cursor: not-allowed;
      color: #C0C4CC;
    }
  }
  .prodItem-table {
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
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        .prod-name-txt {
          font-size: 14px;
          color: #333333;
          word-break: break-all;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
        }
        .spec {
          font-size: 14px;
          color: #333333;
          word-break: break-all;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
        }
        .prod-no {
          font-size: 14px;
          color: #333333;
        }
      }
    }
  }
}
@media (max-width: 1440px) {
  div :deep(.el-card__body) {
    padding-bottom: 40px;
  }
}
.pagination{
  text-align: right;
}
</style>
