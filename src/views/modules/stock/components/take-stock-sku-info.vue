<template>
  <!-- 商品信息 -->
  <div class="component-take-stock-sku-info">
    <span class="title">商品信息</span>
    <el-divider />
    <el-button
      type="primary"
      @click="selectSupplierProd()"
    >
      添加商品
    </el-button>
    <el-tooltip
      class="item"
      :disabled="takeStockProdItems.length === 0"
      effect="dark"
      content="已添加商品，不支持批量导入"
      placement="top"
    >
      <span style="margin:0 10px">
        <el-button
          :disabled="takeStockProdItems.length > 0"
          @click="uploadSku"
        >批量导入</el-button>
      </span>
    </el-tooltip>
    <div class="count-desc-text">
      盘点商品{{ takeStockProdItems.length }}种，实盘库存{{ totalStock }}件，盘盈{{ profitCount }}件，盘亏{{ lossCount }}件
    </div>
    <div class="prodItem-table">
      <!-- 状态导航选择组件 -->
      <statusSelectTabs
        :status-arr="statusArr"
        :default-key="statusArr[0].key"
        @status-change="statusChange"
      />
      <el-table
        :data="totalList.slice((page.pageNum - 1) * page.pageSize, page.pageNum * page.pageSize)"
        header-cell-class-name="table-header"
        row-class-name="table-row"
      >
        <el-table-column
          label="商品信息"
          fixed="left"
          align="center"
          width="320px"
        >
          <template #default="scope">
            <div class="prod-info">
              <ImgShow
                :src="scope.row.pic"
                :img-style="{width:'60px',height:'60px'}"
              />
              <div class="text">
                <span class="name">{{ scope.row.spuName }}</span>
                <span class="name">{{ scope.row.skuName }}</span>
                <span class="name">{{ scope.row.partyCode }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="bookStock"
          label="账面库存"
          align="center"
        >
          <template #default="scope">
            <span class="table-cell-text line-clamp-one">{{ scope.row.stocks }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="stock_count"
          align="center"
        >
          <template #header>
            盈亏数量
            <el-tooltip
              class="item"
              effect="dark"
              content="此处的盈亏差异值仅做参考，请以最后“完成盘点”时盈亏计算的结果为准。"
              placement="top"
            >
              <el-icon><InfoFilled /></el-icon>
            </el-tooltip>
          </template>
          <template #default="scope">
            <span class="table-cell-text line-clamp-one">{{ scope.row.changeStock > 0 ? '+'+scope.row.changeStock : scope.row.changeStock }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="实盘库存"
          prop="totalStock"
          align="left"
        >
          <template #default="scope">
            <el-input
              v-model.number="scope.row.totalStock"
              type="number"
              oninput="if(value<0 || value >1000000000)value=0"
              onkeyup="value=value.replace(/[^\d]/g,'')"
              @keydown="channelInputLimit"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="备注"
          prop="remark"
          align="left"
        >
          <template #default="scope">
            <el-input
              v-model="scope.row.remark"
              show-word-limit
              maxlength="20"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          fixed="right"
        >
          <template #default="scope">
            <div class="text-btn-con">
              <el-button
                type="primary"
                link
                @click="onDelete(scope.row.skuId,totalList.slice((page.pageNum - 1) * page.pageSize, page.pageNum * page.pageSize))"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="page.pageNum"
        :page-size="page.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="totalList.length"
        style="text-align: right"
        @current-change="onPageChange"
      />
    </div>
    <!-- 供应商商品选择弹窗-->
    <select-prod-sku
      v-if="supplierProdSelectVisible"
      ref="selectProdSkuRef"
      :stock-point-id="props.stockPointId"
      :stock-point-type="props.stockPointType"
      :is-take-stock="true"
      @refresh-select-supplier="supplierProdSelectHandle"
    />
    <takeStockProdUpload
      v-if="batchImportVisible"
      ref="takeStockProdUploadRef"
      @refresh-data-list="refreshDataList"
    />
  </div>
</template>

<script setup>
import SelectProdSku from './select-prod-sku/index.vue'
import statusSelectTabs from './status-select-tabs.vue'
import takeStockProdUpload from './take-stock-prod-upload.vue'
import * as api from '@/api/stock/takeStock'

const { proxy } = getCurrentInstance()
const props = defineProps({
  takeStockId: {
    type: [Number, String],
    default: 0
  },
  stockPointId: {
    type: [Number, String],
    default: 0
  },
  stockPointType: {
    type: [Number, String],
    default: 0
  }
})

const takeStockProdItems = ref([]) // 已选择的商品项
const supplierProdSelectVisible = ref(false)
const batchImportVisible = ref(false) // 批量导入商品弹窗是否可见
const verifyFlag = ref(true) // 数据校验标记，true：正确，false：错误
const totalStock = ref(0) // 实盘库存
const profitCount = ref(0) // 盘盈
const lossCount = ref(0) // 盘亏
const profitProdList = ref([]) // 盘盈列表
const lossProdList = ref([]) // 盘亏列表
const equalProdList = ref([]) // 盘平列表
const totalList = ref([])
const statusArr = [
  { id: 0, key: null, label: '全部' },
  { id: 1, key: 1, label: '盘盈' },
  { id: 2, key: 2, label: '盘亏' },
  { id: 3, key: 0, label: '盘平' }
] // 状态导航组件参数
const page = reactive({
  pageNum: 1, // 初始页
  pageSize: 10 // 每页数据大小
})
const tab = {
  key: ''
}
watch(takeStockProdItems, newValue => {
  countChange(newValue)
}, { deep: true })

onMounted(() => {
  init()
})

const init = () => {
  const id = Number(props.takeStockId)
  if (id) {
    getSkuList()
  }
}
const getSkuList = () => {
  api.takeStockSpuById({ takeStockId: props.takeStockId }).then((data) => {
    takeStockProdItems.value = data
    statusChange(statusArr[0])
    countChange(takeStockProdItems.value)
  })
}
/**
 * 导航选择状态
 */
const statusChange = (item) => {
  totalList.value = []
  switch (item.key) {
    case 1: totalList.value = profitProdList.value
      break
    case 2: totalList.value = lossProdList.value
      break
    case 0: totalList.value = equalProdList.value
      break
    default: totalList.value = takeStockProdItems.value
      break
  }
  page.pageNum = 1
  tab.key = item.key
}
const countChange = (newValue) => {
  profitProdList.value = []
  lossProdList.value = []
  equalProdList.value = []
  let totalStockLet = 0
  let profitCountLet = 0
  let lossCountLet = 0
  newValue.forEach(item => {
    if (!item.totalStock && item.totalStock !== 0) {
      item.totalStock = null
    }
    item.takeStockId = props.takeStockId
    item.changeStock = item.totalStock - item.stocks
    totalStockLet += item.totalStock
    if (item.stocks > item.totalStock) {
      lossCountLet += item.stocks - item.totalStock
      lossProdList.value.push(item)
    } else if (item.stocks < item.totalStock) {
      profitCountLet += item.totalStock - item.stocks
      profitProdList.value.push(item)
    } else if (item.stocks === parseInt(item.totalStock) || (item.stocks === 0 && !item.totalStock)) {
      equalProdList.value.push(item)
    }
  })
  proxy.$forceUpdate()
  totalStock.value = Number(totalStockLet)
  profitCount.value = Number(profitCountLet)
  lossCount.value = Number(lossCountLet)
}

const selectProdSkuRef = ref(null)
// 选择商品
const selectSupplierProd = () => {
  const ids = []
  takeStockProdItems.value.forEach(item => {
    ids.push(item.skuId)
  })
  const data = {
    skuIds: ids
  }
  supplierProdSelectVisible.value = true
  nextTick(() => {
    selectProdSkuRef.value.init(data)
  })
}

// 商品选择回调
const supplierProdSelectHandle = (prodItem) => {
  prodItem.forEach(prod => {
    if (!takeStockProdItems.value.find(el => el.skuId === prod.skuId)) {
      takeStockProdItems.value.push(prod)
    }
  })
  totalList.value = takeStockProdItems.value
  verifyFlag.value = totalList.value.length !== 0
}
const takeStockProdUploadRef = ref(null)
const uploadSku = () => {
  if (takeStockProdItems.value.length > 0) {
    return
  }
  batchImportVisible.value = true
  nextTick(() => {
    takeStockProdUploadRef.value.init(props.takeStockId)
  })
}
const refreshDataList = () => {
  getSkuList()
}

/**
 * 删除已选择的商品项
 * @param skuId 当前商品项在当前页的位置
 * @param list 当前列表
 */
const onDelete = (skuId, list) => {
  let index = 0
  for (let i = 0; i < takeStockProdItems.value.length; i++) {
    if (takeStockProdItems.value[i].skuId === skuId) {
      index = i
      break
    }
  }
  takeStockProdItems.value.splice(index, 1)
  // 判断当前页码是否超过删除后的页码大小
  if (page.pageNum > ((takeStockProdItems.value.length - 1) / page.pageSize + 1)) {
    page.pageNum = --page.pageNum || 1
  }
  countChange(takeStockProdItems.value)
  statusChange(tab)
}
const onPageChange = (val) => {
  page.pageNum = val
}

/**
 * 校验数据，校验成功返回数据项，不成功返回null
 */
const verifyDataForm = () => {
  if (takeStockProdItems.value.length === 0) {
    verifyFlag.value = false
    return null
  } else {
    verifyFlag.value = true
    takeStockProdItems.value.forEach(item => {
      item.takeStockId = props.takeStockId
    })
    return takeStockProdItems.value
  }
}

const channelInputLimit = (e) => {
  const key = e.key
  if (key === '.') {
    e.returnValue = false
    return false
  }
  return true
}
defineExpose({ verifyDataForm, getSkuList })
</script>

<style lang="scss" scoped>

.component-take-stock-sku-info {
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

  .prodItem-table {
    .prod-info {
      display: flex;
      align-items: center;
    }

    .prod-info .text {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      margin-left: 10px;
      width: 170px;
    }

    .prod-info .text .name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;

    }
  }

  :deep(.el-pagination) {
    display: flex;
    justify-content: end;
  }
}
</style>
