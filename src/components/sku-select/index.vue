<template>
  <el-dialog
    v-model="visible"
    title="选择商品"
    :modal="true"
    top="100px"
    class="component-sku-select"
    :close-on-click-modal="false"
  >
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        :model="searchForm"
        class="demo-form-inline"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item
            label="商品名称"
            prop="spuName"
          >
            <el-input
              v-model.trim="searchForm.spuName"
              placeholder="商品名称"
              clearable
            />
          </el-form-item>
          <el-form-item
            label="店铺分类"
            prop="selectedCategory"
          >
            <el-cascader
              v-model="searchForm.selectedCategory"
              expand-trigger="hover"
              :options="categoryList"
              :props="categoryTreeProps"
              :clearable="true"
              style="width: 180px"
              @change="onChange"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSearchProd"
            >
              查询
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="onResetSearch(searchFormRef)">
              重置
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="chosenCountTip">
      <span>已选择{{ limitType === 1 ? chosenProdCount : chosenSkuCount }}{{ limitType === 1 ? '件商品' : '件sku' }},</span>
      <span v-if="limit !== -1">最多可以选择{{ limit }}{{ limitType === 1 ? '件商品' : '件sku' }}</span>
    </div>
    <div class="main">
      <el-table
        v-loading="pageLoading"
        :data="pageData.dataList"
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
              <div :class="['select-dor', {'to-radio': limit===1}]">
                <el-checkbox
                  v-model="scope.row.check"
                  :indeterminate="scope.row.indeterminate"
                  :disabled="checkProdIsLimit(scope.row.spuId) || checkMainProdIds(scope.row.spuId)"
                  @change="checkProd(scope.$index)"
                />
              </div>
              <div class="prod-info">
                <div class="prod-image">
                  <ImgShow :src="scope.row.mainImgUrl" />
                </div>
                <div class="prod-name">
                  {{ scope.row.spuName }}
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
              v-for="(sku, skuIndex) in scope.row.skuList"
              :key="sku.skuId"
              class="items name"
            >
              <span class="sku-container">
                <div class="select-dor">
                  <el-checkbox
                    v-if="scope.row.skuList.length > 1"
                    v-model="sku.check"
                    class="select-dor-check"
                    :disabled="checkSkuIsLimit(scope.row.spuId, sku.skuId) || checkMainProdIds(scope.row.spuId)"
                    @change="checkSku(scope.$index, skuIndex)"
                  />
                </div>
                <div class="name">
                  {{ sku.skuName || '-' }}
                </div>
              </span>
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
              v-for="(sku) in scope.row.skuList"
              :key="sku.skuId"
              class="price-container"
            >
              {{ formatPrice(sku.priceFee, 1).toFixed(2) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="库存"
          align="center"
        >
          <template #default="scope">
            <div
              v-for="(sku) in scope.row.skuList"
              :key="sku.skuId"
              class="stocks-container"
            >
              {{ sku.stock }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination
        v-show="pageData.total > 0"
        v-model:page="searchForm.pageNum"
        v-model:limit="searchForm.pageSize"
        style="text-align: right"
        :total="pageData.total"
        @pagination="getPageData"
      />
    </div>
    <template #footer>
      <span>
        <el-button @click="visible = false">取消</el-button>
        <el-button
          type="primary"
          @click="onSubmitProds()"
        >确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { treeDataTranslate, idList, formatPrice } from '@/utils'
import { enableCategories } from '@/api/product/category'
import { comboPage } from '@/api/giveaway/giveaway'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshSelectProds'])

const visible = ref(false)
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  spuName: '',
  selectedCategory: null
})

const pageLoading = ref(true)
const pageData = ref({
  dataList: [],
  total: 0,
  pages: 0
})

const props = defineProps({
  type: {
    default: null,
    type: Number // 类型：1.套餐
  },
  spuType: {
    default: null,
    type: Number // 商品类型
  },
  isVirtual: {
    default: 1,
    type: Number // 商品类型
  },
  mainProdId: {
    default: () => [],
    type: Array // 主商品id
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
    default: null,
    type: Number // 预售类型 -1：未开启 0.全款预售 1.定金预售
  },
  chosenCheckItems: {
    default: () => [],
    type: Array // 已选择的数据项
  },
  limit: {
    default: -1,
    type: Number // 可选择的spu数量限制, -1代表没有限制
  },
  limitType: {
    default: 1,
    type: Number // 限制数量类型 1：按商品 2：按sku
  },
  itemDataType: {
    default: 1,
    type: Number // 初始化数据与返回的商品数据结构 1：以商品分组 2：以sku分组
  },
  status: {
    default: null,
    type: Number // 商品状态
  },
  spuStatus: {
    default: null,
    type: Number // sku状态
  },
  isActive: {
    default: null,
    type: Number // null: 普通商品 1：普通商品 + 活动商品
  },
  canDeposit: {
    default: null,
    type: Number // 是否展示定金预售商品 1.是 0.否
  },
  isGiveaway: {
    default: null,
    type: Number // 赠品活动的赠品  1
  }
})

const chosenProdCount = ref(0) // 已选择的商品数量，用于限制数量
const chosenSkuCount = ref(0) // 已选择的sku数量，用于限制数量
const chosenProdMap = ref({}) // 已选择的商品结点对象map
const currentCheckProdMap = ref({}) // 当前选择的结点对象map
const categoryList = ref([])
const shopSecondaryCategoryId = ref(null)
const categoryTreeProps = ref({
  value: 'categoryId',
  label: 'name'
})

// 获取数据列表
const init = () => {
  searchForm.spuName = ''
  searchForm.selectedCategory = []
  chosenProdCount.value = 0
  chosenSkuCount.value = 0
  shopSecondaryCategoryId.value = null
  chosenProdMap.value = {}
  currentCheckProdMap.value = {}
  initDefaultCheckedKeys()
  getPageData()
  getCategoryList()
  visible.value = true
}

// 判断是否选为主商品
const checkMainProdIds = (id) => {
  return props.mainProdId.some(item => {
    return item === id
  })
}

// 初始化默认选择的商品项记录
const initDefaultCheckedKeys = () => {
  if (props.chosenCheckItems && props.chosenCheckItems.length > 0) {
    if (props.itemDataType === 1) {
      props.chosenCheckItems.forEach(prod => {
        prod = prod || {}
        chosenProdMap.value[prod.spuId] = prod
        currentCheckProdMap.value[prod.spuId] = prod
        ++chosenProdCount.value
        const choseSkuMap = {}
        prod.skuList.forEach(sku => {
          ++chosenSkuCount.value
          choseSkuMap[sku.skuId] = sku
        })
        chosenProdMap.value[prod.spuId].chosenSkuMap = choseSkuMap
        currentCheckProdMap.value[prod.spuId].currentCheckSkuMap = choseSkuMap
      })
    } else {
      props.chosenCheckItems.forEach(sku => {
        sku = sku || {}
        ++chosenSkuCount.value
        if (currentCheckProdMap.value[sku.spuId]) {
          currentCheckProdMap.value[sku.spuId].currentCheckSkuMap[sku.skuId] = sku
        } else {
          ++chosenProdCount.value
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
}

// 选择或取消选择商品
const checkProd = (index) => {
  const prod = pageData.value.dataList[index]
  if (prod.check) {
    // 商品选择事件
    if (props.limit !== -1 && chosenProdCount.value >= props.limit) {
      // 数量超过限制
      prod.check = false
      ElMessage({
        message: '最多只能选择' + props.limit + '件商品',
        type: 'error',
        duration: 1500,
        onClose: () => {
        }
      })
      return
    }
    // 把该商品的可选择的sku置为选择状态并保存选择的商品信息
    if (!currentCheckProdMap.value[prod.spuId]) {
      ++chosenProdCount.value
      currentCheckProdMap.value[prod.spuId] = prod
    }
    const skuList = prod.skuList
    const currentCheckSkuMap = {}
    if (props.limit !== -1 && props.limitType === 2) {
      for (let i = 0; i < skuList.length && chosenSkuCount.value < props.limit; i++) {
        if (!skuList[i].check) {
          ++chosenSkuCount.value
          skuList[i].check = true
        }
        currentCheckSkuMap[skuList[i].skuId] = skuList[i]
      }
    } else {
      skuList.forEach(sku => {
        if (!sku.check) {
          ++chosenSkuCount.value
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
    --chosenProdCount.value
    prod.skuList.forEach(sku => {
      if (sku.check) {
        --chosenSkuCount.value
        sku.check = false
      }
    })
    prod.check = false
    prod.indeterminate = false
  }
}

// 检查商品是否已达到限制
const checkProdIsLimit = (spuId) => {
  if (props.limit === -1) {
    return false
  }
  const checkCount = props.limitType === 1 ? chosenProdCount.value : chosenSkuCount.value
  return checkCount >= props.limit && !currentCheckProdMap.value[spuId]
}

// 检查sku是否已达到限制
const checkSkuIsLimit = (spuId, skuId) => {
  if (props.limit === -1) {
    return false
  }
  const checkCount = props.limitType === 1 ? chosenProdCount.value : chosenSkuCount.value
  if (checkCount >= props.limit) {
    if (props.limitType === 1) {
      return currentCheckProdMap.value[spuId] === undefined || currentCheckProdMap.value[spuId] === null
    }
    if (props.limitType === 2) {
      if (currentCheckProdMap.value[spuId] === undefined || currentCheckProdMap.value[spuId] === null) {
        return true
      }
      return currentCheckProdMap.value[spuId].currentCheckSkuMap[skuId] === undefined || currentCheckProdMap.value[spuId].currentCheckSkuMap[skuId] === null
    }
  }
  return false
}

// 选择或取消选择sku
const checkSku = (prodIndex, skuIndex) => {
  const prod = pageData.value.dataList[prodIndex]
  const sku = prod.skuList[skuIndex]
  if (sku.check) {
    // sku选择事件
    if (checkSkuIsLimit(prod.spuId, sku.skuId)) {
      // 数量超过限制
      sku.check = false
      ElMessage({
        message: '最多只能选择' + props.limit + '件商品',
        type: 'error',
        duration: 1500,
        onClose: () => {
        }
      })
      return
    }
    if (currentCheckProdMap.value[prod.spuId]) {
      // 该商品存在已选择的sku
      currentCheckProdMap.value[prod.spuId].currentCheckSkuMap[sku.skuId] = sku
    } else {
      // 该商品没有已选择的sku
      currentCheckProdMap.value[prod.spuId] = prod
      ++chosenProdCount.value
      const currentCheckSkuMap = {}
      currentCheckSkuMap[sku.skuId] = sku
      currentCheckProdMap.value[prod.spuId].currentCheckSkuMap = currentCheckSkuMap
    }
    ++chosenSkuCount.value
    const choseCount = Object.keys(currentCheckProdMap.value[prod.spuId].currentCheckSkuMap).length
    prod.check = true
    prod.indeterminate = !(choseCount === prod.skuList.length)
  } else {
    // sku取消选择
    --chosenSkuCount.value
    sku.check = false
    const choseCount = Object.keys(currentCheckProdMap.value[prod.spuId].currentCheckSkuMap).length
    if (choseCount === 1) {
      --chosenProdCount.value
      prod.check = false
      prod.indeterminate = false
      delete currentCheckProdMap.value[prod.spuId]
    } else {
      prod.indeterminate = true
      delete currentCheckProdMap.value[prod.spuId].currentCheckSkuMap[sku.skuId]
    }
  }
}

// 获取店铺分类列表
const getCategoryList = () => {
  enableCategories().then(data => {
    categoryList.value = treeDataTranslate(data, 'categoryId', 'parentId')
  })
}

// 分页获取商品数据
const getPageData = () => {
  const obj = {
    pageNum: searchForm.pageNum,
    pageSize: searchForm.pageSize,
    spuName: searchForm.spuName || null,
    spuType: props.spuType,
    shopSecondaryCategoryId: shopSecondaryCategoryId.value,
    mold: props.mold ? props.mold - 1 : null,
    notSpuMolds: props.notSpuMolds,
    preSaleType: props.preSaleType,
    status: props.status,
    spuStatus: props.spuStatus,
    // 选择主商品时需要过滤掉活动商品
    isActive: props.isActive === 1 ? null : 1,
    isVirtual: props.isVirtual || undefined,
    // 过滤定金预售商品
    canDeposit: props.canDeposit,
    isGiveaway: props.isGiveaway,
    isSupplierDelivery: props.type === 1 ? undefined : 1
  }

  comboPage(obj).then(data => {
    pageData.value.total = data.total
    setProdCheckStatus(data.list || [])
    data.list?.forEach(el => {
      if (el.skuList?.length > 1) {
        el.skuList = el.skuList?.filter(item => item.spuSkuAttrValues?.length > 0)
      }
    })
    pageData.value.dataList = data.list || []
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

// 根据已选择的商品项设置商品选择状态
const setProdCheckStatus = (prodList) => {
  prodList.forEach(prod => {
    const skuList = prod.skuList
    if (!currentCheckProdMap.value[prod.spuId]) {
      skuList.forEach(sku => {
        sku.check = false
      })
      prod.check = false
      prod.indeterminate = false
    } else {
      // 当前商品已选择的sku数量
      let selectCount = 0
      const checkSkuMap = currentCheckProdMap.value[prod.spuId].currentCheckSkuMap || {}
      skuList.forEach(sku => {
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

// 获取分类id
const onChange = (val) => {
  if (val && val.length > 0) {
    shopSecondaryCategoryId.value = val[val.length - 1]
  } else {
    shopSecondaryCategoryId.value = undefined
  }
}

// 根据条件搜索商品
const onSearchProd = () => {
  searchForm.pageNum = 1
  getPageData()
}

// 清空搜索条件
const searchFormRef = ref(null)
const onResetSearch = (formEl) => {
  formEl.resetFields()
  searchForm.selectedCategory = idList(categoryList.value, shopSecondaryCategoryId.value, 'categoryId', 'children').reverse()
  shopSecondaryCategoryId.value = undefined
}

// 确定事件
const onSubmitProds = () => {
  const selectList = []
  if (props.itemDataType === 1) {
    for (const spuId in currentCheckProdMap.value) {
      const prodObj = currentCheckProdMap.value[spuId]
      const choseProdMap = chosenProdMap.value[spuId] || {}
      const skuList = []
      for (const skuId in prodObj.currentCheckSkuMap) {
        const skuObj = (choseProdMap.chosenSkuMap !== undefined && choseProdMap.chosenSkuMap[skuId]) ? choseProdMap.chosenSkuMap[skuId] : prodObj.currentCheckSkuMap[skuId]
        skuObj.spuId = prodObj.spuId
        skuObj.spuName = prodObj.spuName
        skuObj.mainImgUrl = prodObj.mainImgUrl
        skuList.push(skuObj)
      }
      const prod = chosenProdMap.value[spuId] ? chosenProdMap.value[spuId] : currentCheckProdMap.value[spuId]
      prod.skuList = skuList
      selectList.push(prod)
    }
  } else {
    for (const spuId in currentCheckProdMap.value) {
      const prodObj = currentCheckProdMap.value[spuId]
      const choseProdMap = chosenProdMap.value[spuId] || {}
      for (const skuId in prodObj.currentCheckSkuMap) {
        const skuObj = (choseProdMap.chosenSkuMap !== undefined && choseProdMap.chosenSkuMap[skuId]) ? choseProdMap.chosenSkuMap[skuId] : prodObj.currentCheckSkuMap[skuId]
        skuObj.spuId = prodObj.spuId
        skuObj.spuName = prodObj.spuName
        skuObj.mainImgUrl = prodObj.mainImgUrl
        if (!skuObj.deliveryMode) {
          skuObj.deliveryMode = prodObj.deliveryMode
        }
        selectList.push(skuObj)
      }
    }
  }
  emit('refreshSelectProds', selectList)
  visible.value = false
}

defineExpose({ init })
</script>
<style lang="scss" scoped>
.component-sku-select {
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
      .to-radio {
        &:deep(.el-checkbox__inner) {
          border-radius: 50%;
        }
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
        .select-dor-check{
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
