<template>
  <el-dialog
    v-model="visible"
    title="选择商品"
    :modal="true"
    top="100px"
    width="70%"
    class="component-transfer-prod-select"
    :close-on-click-modal="false"
  >
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        :model="searchForm"
        @submit.prevent
        @keyup.enter="onGetPageData(true)"
      >
        <div class="search">
          <el-form-item
            label="商品名称"
            prop="spuName"
          >
            <el-input
              v-model="searchForm.spuName"
              placeholder="商品名称"
              clearable
              style="width: 180px"
            />
          </el-form-item>
          <el-form-item
            label="编码"
            prop="partyCode"
          >
            <el-input
              v-model="searchForm.partyCode"
              placeholder="编码"
              clearable
              style="width: 180px"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSearch()"
            >
              查询
            </el-button>
            <el-button
              @click="onResetSearch(searchFormRef)"
            >
              {{ $t("shop.resetMap") }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main">
      <el-table
        v-loading="pageLoading"
        :data="dataList"
        row-class-name="table-row"
        header-cell-class-name="table-header"
      >
        <el-table-column
          label="商品名称"
          fixed="left"
          align="center"
          width="380"
        >
          <template #default="scope">
            <div class="prod-item">
              <div class="select-dor to-radio">
                <el-checkbox
                  v-model="scope.row.check"
                  :indeterminate="scope.row.indeterminate"
                  @change="checkProd(scope.$index)"
                />
              </div>
              <div class="prod-info">
                <div class="prod-image">
                  <ImgShow
                    :src="scope.row.mainImgUrl"
                    :img-style="{width: '100%',height: '100%'}"
                  />
                </div>
                <div class="prod-name">
                  {{ scope.row.name }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="商品规格"
          align="center"
          width="160"
        >
          <template #default="scope">
            <div
              v-for="(sku, skuIndex) in scope.row.skus"
              :key="sku.skuId"
              class="items name"
            >
              <div class="sku-container">
                <div class="select-dor">
                  <el-checkbox
                    v-if="scope.row.skus.length > 1"
                    v-model="sku.check"
                    class="select-dor-check"
                    @change="checkSku(scope.$index, skuIndex)"
                  />
                </div>
                <div class="name">
                  {{ sku.skuLangList[0]?.skuName || '-' }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="编码"
          align="center"
          width="160"
        >
          <template #default="scope">
            <div
              v-for="(sku) in scope.row.skus"
              :key="sku.skuId"
              class="price-container"
            >
              {{ sku.partyCode }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="商品价格"
          align="center"
          width="120"
          class="prodPrice"
        >
          <template #default="scope">
            <div
              v-for="(sku) in scope.row.skus"
              :key="sku.skuId"
              class="price-container"
            >
              {{ formatPrice(sku.priceFee, 1).toFixed(2) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="调出仓库存"
          align="center"
        >
          <template #default="scope">
            <div
              v-for="(sku) in scope.row.skus"
              :key="sku.skuId"
              class="stocks-container"
            >
              {{ sku.stock }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="调入仓库存"
          align="center"
        >
          <template #default="scope">
            <div
              v-for="(sku) in scope.row.skus"
              :key="sku.skuId"
              class="stocks-container"
            >
              {{ sku.inStockPointStock }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <pagination
      v-show="page.total > 0"
      v-model:page="searchForm.pageNum"
      v-model:limit="searchForm.pageSize"
      style="text-align: right"
      :total="page.total"
      @pagination="()=>onGetPageData()"
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
</template>

<script setup>
import { getPageStockPointHasStockSku } from '@/api/stock/warehouse-station.js'
import { formatPrice } from '@/utils/index.js'

const emit = defineEmits('refreshSelectProds')

const props = defineProps({
  chosenCheckItems: {
    default: () => [],
    type: Array // 已选择的数据项
  }
})

const pageLoading = ref(true)
const page = ref({
  total: 0
})

let tempSearchForm = null // 保存上次点击查询的请求条件
const visible = ref(false)
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  queryHasStock: 1,
  spuName: '',
  stockPointId: null
})
const init = (data) => {
  page.value.total = 0
  visible.value = true
  pageLoading.value = false
  chosenProdMap.value = {}
  currentCheckProdMap.value = {}
  searchForm.spuName = ''
  searchForm.partyCode = ''
  searchForm.stockPointId = data.outWarehouseId
  searchForm.inStockPointId = data.inWarehouseId
  searchForm.stockPointType = data.nowOutPoint.stockPointType
  searchForm.stockMode = data.nowOutPoint.stockMode
  searchForm.type = data.nowOutPoint.type
  onGetPageData(true)
  initDefaultCheckedKeys()
}
const dataList = ref([])
// 获取数据列表
const onGetPageData = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = JSON.parse(JSON.stringify(searchForm))
  } else {
    tempSearchForm.pageNum = searchForm.pageNum
    tempSearchForm.pageSize = searchForm.pageSize
  }
  getPageStockPointHasStockSku({
    ...tempSearchForm
  }).then(res => {
    setProdCheckStatus(res?.list || [])
    dataList.value = res?.list || []
    page.value.total = res.total
  })
}

// 根据已选择的商品项设置商品选择状态
const setProdCheckStatus = (prodList) => {
  prodList.forEach(prod => {
    const skuList = prod.skus
    if (!currentCheckProdMap.value[prod.spuId]) {
      skuList.forEach(sku => {
        sku.check = false
        sku.allotCount = 0
      })
      prod.check = false
      prod.indeterminate = false
    } else {
      // 当前商品已选择的sku数量
      let selectCount = 0
      const checkSkuMap = currentCheckProdMap.value[prod.spuId].currentCheckSkuMap || {}
      skuList.forEach(sku => {
        sku.allotCount = 0
        if (checkSkuMap[sku.skuId]) {
          ++selectCount
          sku.check = true
        } else {
          sku.check = false
        }
      })
      prod.check = selectCount > 0
      prod.indeterminate = selectCount > 0 && selectCount < skuList.length
    }
  })
}

const onSearch = () => {
  searchForm.pageNum = 1
  onGetPageData(true)
}

// 搜索表单重置
const searchFormRef = ref(null)
const onResetSearch = (formEl) => {
  formEl.resetFields()
}

const chosenProdMap = ref({}) // 已选择的商品结点对象map
const currentCheckProdMap = ref({}) // 当前选择的结点对象map
// 初始化默认选择的商品项记录
const initDefaultCheckedKeys = () => {
  if (props.chosenCheckItems && props.chosenCheckItems.length > 0) {
    props.chosenCheckItems.forEach(sku => {
      sku = sku || {}
      if (currentCheckProdMap.value[sku.spuId]) {
        currentCheckProdMap.value[sku.spuId].currentCheckSkuMap[sku.skuId] = sku
      } else {
        const prodObj = {}
        prodObj.spuId = sku.spuId
        prodObj.spuName = sku.spuName
        prodObj.mainImgUrl = sku.mainImgUrl
        prodObj.currentCheckSkuMap = {}
        prodObj.currentCheckSkuMap[sku.skuId] = sku
        currentCheckProdMap.value[sku.spuId] = prodObj
      }
    })
  }
}

// 选择或取消选择商品
const checkProd = (index) => {
  const prod = dataList.value[index]
  if (prod.check) {
    // 把该商品的可选择的sku置为选择状态并保存选择的商品信息
    if (!currentCheckProdMap.value[prod.spuId]) {
      currentCheckProdMap.value[prod.spuId] = prod
    }
    const skus = prod.skus
    const currentCheckSkuMap = {}
    if (props.limit !== -1 && props.limitType === 2) {
      for (let i = 0; i < skus.length; i++) {
        if (!skus[i].check) {
          skus[i].check = true
        }
        currentCheckSkuMap[skus[i].skuId] = skus[i]
      }
    } else {
      skus.forEach(sku => {
        if (!sku.check) {
          sku.check = true
        }
        currentCheckSkuMap[sku.skuId] = sku
      })
    }
    prod.currentCheckSkuMap = currentCheckSkuMap
    prod.indeterminate = false
  } else {
    // 商品取消选择事件，删除对应的商品结点
    delete currentCheckProdMap.value[prod.spuId]
    prod.skus.forEach(sku => {
      if (sku.check) {
        sku.check = false
      }
    })
    prod.check = false
    prod.indeterminate = false
  }
}

// 选择或取消选择sku
const checkSku = (prodIndex, skuIndex) => {
  const prod = dataList.value[prodIndex]
  const sku = prod.skus[skuIndex]
  if (sku.check) {
    if (currentCheckProdMap.value[prod.spuId]) {
      // 该商品存在已选择的sku
      currentCheckProdMap.value[prod.spuId].currentCheckSkuMap[sku.skuId] = sku
    } else {
      // 该商品没有已选择的sku
      currentCheckProdMap.value[prod.spuId] = prod
      const currentCheckSkuMap = {}
      currentCheckSkuMap[sku.skuId] = sku
      currentCheckProdMap.value[prod.spuId].currentCheckSkuMap = currentCheckSkuMap
    }
    const choseCount = Object.keys(currentCheckProdMap.value[prod.spuId].currentCheckSkuMap).length
    prod.check = true
    prod.indeterminate = !(choseCount === prod.skus.length)
  } else {
    // sku取消选择
    sku.check = false
    const choseCount = Object.keys(currentCheckProdMap.value[prod.spuId].currentCheckSkuMap).length
    if (choseCount === 1) {
      prod.check = false
      prod.indeterminate = false
      delete currentCheckProdMap.value[prod.spuId]
    } else {
      prod.indeterminate = true
      delete currentCheckProdMap.value[prod.spuId].currentCheckSkuMap[sku.skuId]
    }
  }
}

// 确定事件
const onSubmit = () => {
  const selectList = []
  for (const spuId in currentCheckProdMap.value) {
    const prodObj = currentCheckProdMap.value[spuId]
    const choseProdMap = chosenProdMap.value[spuId] || {}
    for (const skuId in prodObj.currentCheckSkuMap) {
      const skuObj = (choseProdMap.chosenSkuMap !== undefined && choseProdMap.chosenSkuMap[skuId]) ? choseProdMap.chosenSkuMap[skuId] : prodObj.currentCheckSkuMap[skuId]
      skuObj.spuId = prodObj.spuId
      skuObj.spuName = prodObj.spuName || prodObj.spuLangList[0]?.spuName
      skuObj.mainImgUrl = prodObj.mainImgUrl
      selectList.push(skuObj)
    }
  }
  emit('refreshSelectProds', selectList)
  visible.value = false
}

defineExpose({
  init
})
</script>

<style lang="scss" scoped>
.component-transfer-prod-select {
  .main {
    .prod-item {
      display: flex;
      align-items: center;
      align-content: center;
      flex-direction: row;

      .select-dor {
        width: 10px;
        padding: 2px;
      }

      .prod-info {
        display: flex;
        align-items: center;
      }

      .prod-image {
        width: 100px;
        height: 100px;
        padding: 10px;
      }

      .prod-name {
        // width: 240px;
        flex: 1;
        font-size: 14px;
        color: #333333;
        word-break: break-all;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
    }

    .sku-container {
      width: 120px;
      display: flex;
      flex-direction: row;
      min-height: 30px;
      align-items: center;

      .select-dor {
        width: 10px;
        padding: 2px;
        margin-right: 10px;
        display: flex;
        align-items: center;

        .select-dor-check {
          height: 100%;
        }
      }

      .name {
        width: 100px;
        font-size: 14px;
        color: #333333;
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .price-container {
      min-height: 30px;
      align-content: center;
    }

    .stocks-container {
      min-height: 30px;
      align-content: center;
    }
  }
}
</style>
