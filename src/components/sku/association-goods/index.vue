<template>
  <el-dialog
    v-model="dialogTableVisible"
    title="关联商品"
    width="65%"
    class="component-association-goods"
    :close-on-click-modal="false"
  >
    <el-button
      type="primary"
      class="filter-item"
      @click="onSelectGoods"
    >
      选择商品
    </el-button>
    <div
      v-if="!comData.isCommonWarehouse"
      class="warning-tip"
    >
      <el-icon><WarningFilled /></el-icon> 提示：当前关联商品无共同供货仓库
    </div>
    <el-table
      :data="comData.list"
      header-row-class-name="header-row"
      style="margin-top: 10px"
    >
      <el-table-column
        property="spuName"
        label="商品名称"
        align="center"
      >
        <template #default="scope">
          <div class="prod-name">
            {{ scope.row.spuName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        property="skuName"
        label="商品规格"
        align="center"
      >
        <template #default="scope">
          {{ scope.row.skuName || '-' }}
        </template>
      </el-table-column>
      <el-table-column
        property="comboCount"
        label="组合内数量"
        align="center"
      >
        <template #default="scope">
          <el-input-number
            v-model="scope.row.comboCount"
            :min="1"
            :max="999999"
            controls-position="right"
            :step="1"
            step-strictly
            :value-on-clear="1"
            @change="getTotalStock"
          />
        </template>
      </el-table-column>
      <el-table-column
        property="priceFee"
        label="原销售价"
        align="center"
      >
        <template #default="scope">
          {{ formatPrice(scope.row.priceFee, 1).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column
        property="stock"
        label="商品库存"
        align="center"
      />
      <el-table-column
        label="操作"
      >
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click="onDelete(scope)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="total-price">
      合计库存: <span class="price">{{ totalStock }}</span>
    </div>

    <!--搭配商品表格-->
    <select-goods
      v-if="addProdVisible"
      ref="skuSelectRef"
      :chosen-check-items="comData.list"
      :limit="10"
      :spu-status="1"
      :status="1"
      :sku-status="1"
      :can-deposit="0"
      :is-active="1"
      @refresh-select-prods="selectProdItem"
    />

    <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="dialogTableVisible = false"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="onSubmit"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import SelectGoods from './components/select-goods/index.vue'
import { formatPrice } from '@/utils/index.js'
import http from '@/utils/request.js'

const emit = defineEmits(['onSelectSuccess'])
const props = defineProps({
  spuId: {
    type: Number,
    default: null
  },
  // 配送方式
  deliveryMode: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const dialogTableVisible = ref(false)
const isEdit = ref(false)

/**
 * 打开关联商品弹窗
 * @param data 已经关联的商品数据
 * @param isUpdate 是否为修改
 */
const openDialog = (data = [], isUpdate = false) => {
  isEdit.value = isUpdate
  resetData()
  comData.list = JSON.parse(JSON.stringify(data))
  getTotalStock()
  dialogTableVisible.value = true
}

const comData = reactive({
  list: [],
  totalStock: 0,
  isCommonWarehouse: true
})

const totalStock = ref(0)

const getTotalStock = () => {
  const skuComboList = comData.list.map(item => {
    return {
      skuId: item.skuId,
      comboSkuId: item.comboSkuId,
      comboCount: item.comboCount || 1,
      comboSpuId: item.comboSpuId
    }
  })
  const deliveryMode = JSON.stringify(props.deliveryMode)
  const paramData = {
    spuId: props.spuId,
    deliveryMode,
    skuList: [{
      skuComboList
    }]
  }
  if (skuComboList.length > 0) {
    http({
      url: '/mall4cloud_product/mp/sku/calculate_stock_by_sku_ids',
      method: 'post',
      data: paramData
    }).then((res) => {
      const skuInfo = res.skus[0] || {}
      totalStock.value = skuInfo.stock || 0
      comData.isCommonWarehouse = skuInfo.hasCommonStock
      comData.list.forEach((item, index) => {
        item.stock = skuInfo.skuComboList[index].stock
      })
    })
  } else {
    totalStock.value = 0
    comData.isCommonWarehouse = true
  }
}

const skuSelectRef = ref(null)
const addProdVisible = ref(false)
/**
 * 选择需要关联的商品
 */
const onSelectGoods = () => {
  addProdVisible.value = true
  nextTick(() => {
    skuSelectRef.value?.init()
  })
}

/**
 * 选择完成回调
 */
const selectProdItem = (list) => {
  const arr = []
  // 获取回调数据，展开sku
  if (list.length > 0) {
    for (const item of list) {
      const obj = {
        spuName: item.spuName,
        comboCount: 1,
        comboSkuId: item.comboSkuId ? item.comboSkuId : item.skuId,
        comboSpuId: item.comboSpuId ? item.comboSpuId : item.spuId,
        skuName: item.skuName || '-',
        priceFee: item.priceFee,
        stock: item.stock,
        skuId: null,
        spuId: null
      }
      arr.push(obj)
    }
  }
  comData.list = arr
  getTotalStock()
}

const onDelete = (scope) => {
  const { $index } = scope
  comData.list.splice($index, 1)
  getTotalStock()
}

const onSubmit = () => {
  dialogTableVisible.value = false
  comData.list.forEach((item) => {
    if (!item.comboCount || item.comboCount < 1) item.comboCount = 1
  })
  comData.totalStock = totalStock.value
  const data = JSON.parse(JSON.stringify(comData))
  emit('onSelectSuccess', data)
}

// 初始化数据
const resetData = () => {
  comData.list = []
  comData.totalStock = 0
}

defineExpose({
  openDialog
})

</script>

<style scoped lang="scss">
// 定义表头样式
:deep(.header-row) {
  .el-table__cell {
    background-color: #F7F8FA;
    height: 57px;
    font-weight: bold;
  }
}

.total-price {
  margin: 20px 0 0 20px;

  &:deep(.price) {
    text-decoration: underline;
    margin-right: 30px;
  }
}

.warning-tip {
  width: 100%;
  height: 30px;
  line-height: 30px;
  background-color: #fdf6ec;
  border-radius: 3px;
  padding-left: 10px;
  margin: 5px 0;
  color: #e6a23c;
  display: flex;
  align-items: center;
}

.prod-name {
  flex: 1;
  font-size: 14px;
  color: #333333;
  word-break: break-all;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

</style>
