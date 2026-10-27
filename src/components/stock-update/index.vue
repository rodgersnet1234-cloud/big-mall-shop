<template>
  <div class="component-stock-upload">
    <el-dialog
      v-model="visible"
      :show-close="false"
      width="650"
      @closed="onCloseDialog"
    >
      <div class="title">
        <el-tabs
          v-model="activeName"
          class="tabs"
          @tab-change="onActiveChange"
        >
          <el-tab-pane
            label="仓库库存"
            name="warehouse"
          />
          <el-tab-pane
            v-if="!isSpuMold && (!isNeedVerifyDelivery || deliveryMode.hasUserPickUp||deliveryMode.hasCityDelivery) && !isHideStation"
            label="门店库存"
            name="station"
          />
        </el-tabs>
        <div
          class="close-btn"
          @click="visible = false"
        >
          <el-icon><Close /></el-icon>
        </div>
      </div>
      <div
        v-if="showTips"
        class="tips-box"
      >
        <el-icon :size="14">
          <WarningFilled />
        </el-icon>
        <span>若某个仓库或门店无法支持该商品的配送，则对应设置的库存数量将不计入销售库存总数。</span>
      </div>
      <div class="content">
        <el-table
          :key="activeName"
          v-loading="pageLoading"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
        >
          <el-table-column
            :prop="activeName==='warehouse'?'warehouseName':'stationName'"
            :label="activeName==='warehouse'?'仓库名称':'门店名称'"
          />
          <el-table-column
            v-if="activeName==='station'"
            prop="status"
            :label="$t('table.status')"
          >
            <template #default="scope">
              <div v-show="!pageLoading">
                <div v-if="scope.row.status === 4">
                  {{ $t("delivery.station.auditFailure") }}
                </div>
                <div v-else-if="scope.row.status === 3">
                  {{ $t("delivery.station.underReview") }}
                </div>
                <div v-else-if="scope.row.status === 2">
                  {{ $t("delivery.station.platformOffline") }}
                </div>
                <div v-else-if="scope.row.status === 1">
                  {{ $t("delivery.station.business") }}
                </div>
                <div v-else>
                  {{ $t("delivery.station.close") }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="activeName==='station'"
            label="门店用途"
          >
            <template #default="scope">
              <span v-if="scope.row.sameCityDelivery">同城配送</span>
              <span v-if="scope.row.selfPickup && scope.row.sameCityDelivery">、</span>
              <span v-if="scope.row.selfPickup">到店自提</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="stock"
            label="商品库存"
          >
            <template #default="scope">
              <el-input
                v-model.number="scope.row.stock"
                :min="0"
                maxlength="7"
                class="stock-number"
                :disabled="isView || (isSeckill && activeName==='station' && scope.row.status !== 1)"
                @input="onStockInput(scope.row)"
                @change="onPushStockPointList(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <pagination
        v-show="pageData.total > 0"
        v-model:page="searchForm.pageNum"
        v-model:limit="searchForm.pageSize"
        style="text-align: right"
        :total="pageData.total"
        @pagination="onChangePage"
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button
            @click="visible = false"
          >
            {{ $t('table.cancel') }}
          </el-button>
          <el-button
            type="primary"
            @click="onSubmit()"
          >
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import * as api from '@/api/stock/warehouse-station.js'
import { pageStation, getStationDelivery } from '@/api/delivery/station'

const props = defineProps({
  isView: {
    default: false,
    type: Boolean
  },
  // 是否需要校验配送方式（未选择自提的商品不显示门店列表）
  isNeedVerifyDelivery: {
    default: false,
    type: Boolean
  },
  // 配送方式
  deliveryMode: {
    type: Object,
    default: () => {
      return {}
    }
  },
  isHideStation: {
    default: false,
    type: Boolean
  },
  // 是否为秒杀设置库存
  isSeckill: {
    default: false,
    type: Boolean
  },
  // 秒杀独立库存门店id数组 - 秒杀sku查询门店列表时的传参
  seckillStationIds: {
    type: Object,
    default: () => {
      return []
    }
  }
})

const emit = defineEmits(['setStockCallback', 'close'])

const showTips = computed(() => {
  const { hasShopDelivery, hasCityDelivery, hasUserPickUp } = props.deliveryMode
  for (const item of dataList.value) {
    // 门店：非营业状态或者没有相同配送方式
    if (item.stockMode === 2 && (item.status !== 1 || !((hasCityDelivery && item.sameCityDelivery) || (hasUserPickUp && item.selfPickup)))) {
      return true
    }
    /* 仓库
      区域仓库：商品不支持快递配送
      默认仓库：商品不支持快递配送且不存在门店是共享总部库存+门店状态为营业+门店和商品有共同的物流类型
     */
    if (!item.stockMode && !hasShopDelivery) {
      if (item.type === 1) {
        return true
      }
      if (item.type === 0 && !((hasCityDelivery && stationDelivery?.sameCityDelivery) || (hasUserPickUp && stationDelivery?.selfPickup))) {
        return true
      }
    }
  }
  return false
})

let stockPointList = [] // 库存点及库存信息列表（提交时使用）
let index = null // 修改的索引
const visible = ref(false)
const activeName = ref('warehouse')
const isSpuMold = ref(false)
/**
 * 初始化
 * @param {object} sku sku信息
 * @param {number} indexValue 索引值（回调中返回给父组件修改数据用,-1则表示无）
 * @param {boolean} mold 1虚拟商品 0实物商品
 */
const init = (sku, indexValue = -1, mold = 0) => {
  activeName.value = 'warehouse'
  searchForm.pageNum = 1
  searchForm.pageSize = 10
  visible.value = true
  index = indexValue
  isSpuMold.value = mold
  stockPointList = sku.stockPointList ? JSON.parse(JSON.stringify(sku.stockPointList)) : []
  onGetPageData(true)
  onGetStationDelivery()
}

// 是否存在的符合配送方式的共享总部门店
const stationDelivery = reactive({})
const onGetStationDelivery = () => {
  getStationDelivery().then((res) => {
    Object.assign(stationDelivery, res)
  })
}

let tempSearchForm = null // 保存上次点击查询的请求条件
// 头部搜索表单
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  stockMode: 2
})
const pageData = ref({
  total: 0,
  pages: 0
})
const dataList = ref([])
const pageLoading = ref(true)
let typeIdStr = '' // 当前请求的字段键名
// 获取数据列表
const onGetPageData = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = JSON.parse(JSON.stringify(searchForm))
  } else {
    tempSearchForm.pageNum = searchForm.pageNum
    tempSearchForm.pageSize = searchForm.pageSize
  }
  let request
  if (activeName.value === 'warehouse') {
    request = api.getPageList
    typeIdStr = 'warehouseId'
  } else {
    typeIdStr = 'stationId'
    request = pageStation
    if (props.seckillStationIds) {
      tempSearchForm.seckillStationIds = props.seckillStationIds
    }
    tempSearchForm.stockMode = 2
  }
  request(tempSearchForm).then(res => {
    pageData.value.pages = res.pages
    pageData.value.total = res.total
    dataList.value = cidyArray(res.list, stockPointList)
    if (pageLoading.value) {
      pageLoading.value = false
    }
  }).catch(() => {
    pageLoading.value = false
  })
}

/**
 * 整理回显库存数量
 * @param {Array} pointList 请求来的仓库/门店列表（id为[typeIdStr]字段）
 * @param {Array} stockList 存储点库存数列表（id为'stockPointType'字段）
 */
const cidyArray = (pointList, stockList) => {
  // 如果未有存储点设置库存，则直接返回整理的数据
  const nowStockPointType = activeName.value === 'warehouse' ? 1 : 2
  if (!(stockList && stockList.length)) {
    return pointList.map((item) => {
      return {
        ...item,
        stock: 0, // 库存
        stockPointId: item[typeIdStr], // 存储点ID
        stockPointType: nowStockPointType, // 存储点类型（当前请求的列表为仓库则类型为1，请求的列表为门店则类型为2）
        type: activeName.value === 'warehouse' ? item.type : 1, // 仓库需要返回仓库类型（0 默认仓库 1 非默认仓库）
        stockMode: activeName.value === 'station' ? item.stockMode : undefined
      }
    })
  }
  const list = []
  for (let i = 0; i < pointList.length; i++) {
    let flag = false
    for (let j = 0; j < stockList.length; j++) {
      if (pointList[i][typeIdStr] === stockList[j].stockPointId && stockList[j].stockPointType === nowStockPointType) {
        list.push({
          ...pointList[i],
          stock: stockList[j].stock, // 库存
          stockPointId: pointList[i][typeIdStr], // 存储点ID
          stockPointType: nowStockPointType, // 存储点类型（当前请求的列表为仓库则类型为1，请求的列表为门店则类型为2）
          type: activeName.value === 'warehouse' ? pointList[i].type : 1, // 仓库需要返回仓库类型（0 默认仓库 1 非默认仓库）
          stockMode: activeName.value === 'station' ? pointList[i].stockMode : undefined,
          skuId: stockList[j].skuId
        })
        flag = true
        break
      }
    }
    // 当前循环的仓库/门店未设置库存
    if (!flag) {
      list.push({
        ...pointList[i],
        stock: 0, // 库存
        stockPointId: pointList[i][typeIdStr], // 存储点ID
        stockPointType: nowStockPointType, // 存储点类型（当前请求的列表为仓库则类型为1，请求的列表为门店则类型为2）
        type: activeName.value === 'warehouse' ? pointList[i].type : 1, // 仓库需要返回仓库类型（0 默认仓库 1 非默认仓库）
        stockMode: activeName.value === 'station' ? pointList[i].stockMode : undefined
      })
    }
  }
  return list
}
// 将设置的库存数存储起来
const onPushStockPointList = (row) => {
  const nowStockPointType = activeName.value === 'warehouse' ? 1 : 2
  // if (!row.stock && row.type === 1) {
  //   // 设置库存为0则将记录剔除
  //   row.stock = 0
  //   if (stockPointList && stockPointList.length) {
  //     for (let i = 0; i < stockPointList.length; i++) {
  //       // 判断当前修改的库存是否存在原库存
  //       if (stockPointList[i].stockPointId === row[typeIdStr] && stockPointList[i].stockPointType === nowStockPointType) {
  //         stockPointList.splice(i, 1)
  //         return
  //       }
  //     }
  //   }
  //   return
  // }
  if (!(stockPointList && stockPointList.length)) {
    stockPointList.push({
      stock: row.stock, // 库存
      stockPointId: row.stockPointId, // 存储点ID
      stockPointType: row.stockPointType, // 存储点类型（当前请求的列表为仓库则类型为1，请求的列表为门店则类型为2）
      type: activeName.value === 'warehouse' ? row.type : 1, // 仓库需要返回仓库类型（0 默认仓库 1 非默认仓库）
      stockMode: activeName.value === 'station' ? row.stockMode : undefined,
      status: activeName.value === 'station' ? row.status : undefined,
      sameCityDelivery: activeName.value === 'station' ? row.sameCityDelivery : undefined,
      selfPickup: activeName.value === 'station' ? row.selfPickup : undefined
    })
    return
  }
  let flag = false
  for (let i = 0; i < stockPointList.length; i++) {
    if (stockPointList[i].stockPointId === row[typeIdStr] && stockPointList[i].stockPointType === nowStockPointType) {
      // 当前修改的库存存在原库存，则直接修改
      if (row.skuId) {
        // 记录库存的改变
        if (stockPointList[i].changeStock) {
          // 如果存在库存改变（非首次修改），则计算 原库存（stockPointList[i].stock） 与 修改库存（row.stock） 的差值再与记录的changeStock相加
          const diff = row.stock - (stockPointList[i].stock || 0)
          stockPointList[i].changeStock += diff
        } else {
          // 如果不存在库存改变（首次修改）且oldStock不为空，则修改的库存为 原库存（stockPointList[i].stock） 与 修改库存（row.stock） 的差值
          stockPointList[i].changeStock = row.stock - (stockPointList[i].stock || 0)
        }
      } else if (!row.stock) {
        // 不存在库存的新增库存点则移除
        stockPointList.splice(i, 1)
        break
      }
      stockPointList[i].stock = row.stock || 0
      flag = true
      break
    }
  }
  if (!flag && row.stock > 0) {
    // 当前修改的库存未有记录，则新建一条
    stockPointList.push({
      stock: row.stock,
      stockPointId: row.stockPointId,
      stockPointType: row.stockPointType,
      type: activeName.value === 'warehouse' ? row.type : 1, // 仓库需要返回仓库类型（0 默认仓库 1 非默认仓库）
      stockMode: activeName.value === 'station' ? row.stockMode : undefined,
      status: activeName.value === 'station' ? row.status : undefined,
      sameCityDelivery: activeName.value === 'station' ? row.sameCityDelivery : undefined,
      selfPickup: activeName.value === 'station' ? row.selfPickup : undefined
    })
  }
}

const onStockInput = (row) => {
  if (row.stock) {
    row.stock = row.stock.toString().replace(/[^\d]/g, '')
    row.stock = row.stock > 9999999 ? 9999999 : Number(row.stock)
  }
}

const onChangePage = () => {
  onGetPageData()
}

const onActiveChange = () => {
  searchForm.pageNum = 1
  pageLoading.value = true
  onGetPageData(true)
}

const onSubmit = () => {
  if (props.isView) {
    // 查看时点击确认直接关闭页面
    visible.value = false
    emit('close')
  }
  const sum = calcStock(stockPointList)
  visible.value = false
  emit('setStockCallback', stockPointList, sum, index)
}

const calcStock = (stockPointList) => {
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

const onCloseDialog = () => {
  emit('close')
}

defineExpose({
  init,
  visible
})
</script>

<style lang="scss" scoped>
.component-stock-upload {
  :deep(.el-dialog__header){
    display: none;
  }
  :deep(.el-dialog__body) {
    padding: 0;
  }
  .title {
    position: relative;
    :deep(.el-tabs__nav-scroll) {
      padding: 10px 0 0 20px;
    }
    .close-btn {
      font-size: 18px;
      color: #909399;
      position: absolute;
      top: 10px;
      right: 10px;
      &:hover {
        color: #155bd4;
        cursor: pointer;
      }
    }
  }
  .tips-box {
    font-size: 14px;
    color: #e6a23c;
    display: flex;
    align-items: center;
    background-color: #FDF6EC;
    padding: 8px;
    margin: 0 20px;
    &:deep(.el-icon) {
      font-size: 14px;
      margin-right: 2px;
    }
  }
  .content {
    padding: 20px;
    .stock-number {
      width: 100px;
    }
  }
  .dialog-footer {
    text-align: right;
  }
}
</style>
