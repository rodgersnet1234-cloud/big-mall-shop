<template>
  <el-dialog
    v-model="visible"
    class="sku-select-components"
    :title="$t('product.select')"
    :modal="true"
    top="100px"
    :close-on-click-modal="false"
  >
    <el-form
      :inline="true"
      :model="dataForm"
      class="demo-form-inline"
      @submit.prevent
    >
      <el-form-item :label="$t('product.prodName')">
        <el-input
          v-model.trim="spuName"
          style="width: 200px"
          :placeholder="$t('product.prodName')"
          clearable
        />
      </el-form-item>
      <el-form-item label="店铺分类">
        <el-cascader
          v-model="selectedCategory"
          expand-trigger="hover"
          :options="categoryList"
          :props="categoryTreeProps"
          :clearable="true"
          style="width: 180px"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="searchProd"
        >
          查询
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="clean">
          {{
            $t("shop.resetMap")
          }}
        </el-button>
      </el-form-item>
    </el-form>
    <div>已选择商品:{{ selectProds.length || 0 }}</div>
    <div class="prods-select-body">
      <div class="content">
        <!-- 列标题 -->
        <div :class="['tit']">
          <el-row style="width: 100%">
            <el-col :span="1">
              <span class="item">
                <el-checkbox
                  v-model="checkAll"
                  :indeterminate="indeterminate"
                  :disabled="disable"
                  @change="checkAllProd()"
                />
              </span>
            </el-col>
            <el-col
              :span="10"
              class="column-title"
            >
              <span class="item">{{ $t("product.prodInfo") }}</span>
            </el-col>
            <el-col
              :span="6"
              class="column-title"
            >
              <span class="item">{{ $t("product.productSpecifi") }}</span>
            </el-col>
            <el-col
              :span="3"
              class="column-title"
            >
              <span class="item">编码</span>
            </el-col>
            <el-col
              :offset="1"
              :span="2"
              class="column-title"
            >
              <span class="item">库存</span>
            </el-col>
          </el-row>
        </div>

        <div
          v-for="(prod, index) in dataList"
          :key="prod.prodId"
          class="prod"
          style="margin-bottom: 10px"
        >
          <div class="prod-cont">
            <el-row style="width: 100%">
              <el-col
                :span="1"
                style="height: 100%"
              >
                <div class="item">
                  <el-checkbox
                    v-model="prod.check"
                    :disabled="prod.disable"
                    @change="checkProd(index)"
                  />
                </div>
              </el-col>
              <el-col
                :span="10"
                class="public-height"
                style="height: 100%"
              >
                <div class="prod-item">
                  <div
                    class="item"
                    style="margin-left:15%;width:80%"
                  >
                    <div
                      class="prod-image"
                      style="margin-right:4px;"
                    >
                      <ImgShow
                        :src="prod.mainImgUrl"
                        :img-style="{width: '100%',height: '100%'}"
                      />
                    </div>
                    <div class="prod-name">
                      {{ prod.name }}
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col
                :span="13"
                style="height: 100%"
              >
                <div
                  v-for="(sku, skuIndex) in prod[skuKey]"
                  :key="sku.skuId"
                  class="items name"
                  :class="{ 'public-height': prod[skuKey]?.length === 1 }"
                >
                  <el-row
                    style="width: 100%"
                    class="public-height"
                  >
                    <el-col
                      :span="1"
                      style="height: 100%"
                    >
                      <div class="item">
                        <el-checkbox
                          v-if="prod[skuKey]?.length > 1"
                          v-model="sku.check"
                          :disabled="sku.disable"
                          @change="checkSku(index, skuIndex)"
                        />
                        <span />
                      </div>
                    </el-col>
                    <el-col
                      :span="9"
                      style="height: 100%"
                    >
                      <div class="item">
                        {{ (sku.skuLangList?.length ? sku.skuLangList[0].skuName : '') || '-' }}
                      </div>
                    </el-col>
                    <el-col
                      :span="8"
                      style="height: 100%"
                    >
                      <div class="item">
                        {{ sku.partyCode }}
                      </div>
                    </el-col>
                    <el-col
                      :span="6"
                      style="height: 100%"
                    >
                      <div class="item">
                        {{ type === 1 ? sku.stock : sku.inStockPointStock }}
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <!-- 无数据提示 -->
        <div
          v-if="dataList.length === 0 && !dataListLoading"
          class="prod notDataTip"
        >
          暂无数据
        </div>
      </div>

      <el-pagination
        class="pagination"
        style="overflow:auto;margin:15px 5px"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
      />
    </div>
    <template #footer>
      <span>
        <el-button @click="visible = false">取消</el-button>
        <el-button
          type="primary"
          @click="submitProds()"
        >确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { treeDataTranslate, idList } from '@/utils'
import http from '@/utils/request'

import { getCategories } from '@/api/stock/components/sku-select-components'

const props = defineProps({
  prodType: {
    default: null,
    type: Number // 商品类型
  },
  dataUrl: {
    default: '/page_sku',
    type: String // 商品请求url
  },
  chosenCheckItems: {
    default: function () {
      return []
    },
    type: Array // 已选择的数据项
  },
  isMemoryOldData: {
    default: false,
    type: Boolean // 是否记忆已选择的数据项中的数据
  },
  isCompose: {
    default: null,
    type: Number
  },
  type: {
    default: 0,
    type: Number
  },
  httpParams: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
const emit = defineEmits(['refreshSelectProds'])
const visible = ref(false)
const dataForm = reactive({
  product: ''
})
const checkAll = ref(false) // 全选状态
// 不确定状态
const indeterminate = computed(() => {
  return dataList.value.length > 0 && dataList.value.filter((e) => e.check).length > 0 && dataList.value.filter((e) => e.check).length < dataList.value.length
})
const currentPageCheckCount = ref(0) // 当前页选中的结点数量
const dataList = ref([])
const spuName = ref('')
const shopCategoryId = ref(null)
const pageIndex = ref(1)
const pageSize = ref(10)
const totalPage = ref(0)
const dataListLoading = ref(false)
const totalSelectCount = ref(0) // 当前选择的商品总数量
const chosenNodesMap = ref({}) // 已选择的结点对象map
const currentCheckNodesMap = ref({}) // 当前选择的结点对象map
const categoryList = ref([])
const selectedCategory = ref([])
const categoryTreeProps = reactive({
  value: 'categoryId',
  label: 'name'
})
const selectSkuIds = ref([])
const disable = ref(false)
const disableSkuIds = ref([])
const selectProds = ref([])
const skuKey = ref('')

onActivated(() => {
  init()
})

// 获取数据列表
const init = () => {
  dataListLoading.value = true
  spuName.value = ''
  selectedCategory.value = []
  shopCategoryId.value = null
  totalSelectCount.value = 0
  chosenNodesMap.value = {}
  currentCheckNodesMap.value = {}
  selectSkuIds.value = []
  disableSkuIds.value = []
  selectProds.value = []
  setDefaultCheckedKeys()
  getDataList()
  getCategoryList()
  skuKey.value = 'skus'
  visible.value = true
}
const setDefaultCheckedKeys = () => {
  if (props.chosenCheckItems && props.chosenCheckItems.length > 0) {
    props.chosenCheckItems.forEach(node => {
      node = node || {}
      chosenNodesMap.value[node.skuId] = node
      currentCheckNodesMap.value[node.skuId] = node
      ++totalSelectCount.value
      selectSkuIds.value.push(node.skuId)
      selectProds.value.push(node)
    })
  }
}
const getCategoryList = () => {
  getCategories().then((data) => {
    categoryList.value = treeDataTranslate(data, 'categoryId', 'parentId')
    categoryList.value = categoryList.value.filter(el => el.children)
  })
}

/**
 * 获取商品数据
 */
const getDataList = () => {
  dataListLoading.value = true
  currentPageCheckCount.value = 0
  const search = {
    spuName: spuName.value,
    categoryId: shopCategoryId.value,
    ...props.httpParams
  }
  http({
    url: props.dataUrl,
    method: 'get',
    params:
      Object.assign(
        {
          pageNum: pageIndex.value,
          pageSize: pageSize.value,
          prodType: props.prodType,
          isCompose: props.isCompose,
          supplierSpuType: 0
        },
        search
      )

  }).then((data) => {
    totalPage.value = data.total
    if (props.chosenCheckItems) {
      data.list.forEach(item => {
        const skuId = item.skuId
        if (currentCheckNodesMap.value[skuId]) {
          ++currentPageCheckCount.value
          item.check = true
        } else {
          item.check = false
        }
      })
    }
    loadCheck(data)
    dataList.value = data.list
    dataListLoading.value = false
  }).catch(() => {
    dataListLoading.value = false
  })
}
const loadCheck = (data) => {
  let checkAllStatus = true
  data.list.forEach(prod => {
    let check = true
    prod.disable = false
    prod[skuKey.value]?.forEach(sku => {
      // 禁用已选择的sku及商品
      if (containsId(sku.skuId)) {
        sku.check = true
        sku.disable = true
      } else {
        prod.disable = false
        sku.disable = false
        sku.check = containsId(sku.skuId)
      }
      if (!sku.check) {
        // 普通商品
        sku.check = selectSkuIds.value.indexOf(sku.skuId) !== -1
      }
      if (check && !sku.check) {
        check = false
      }
    })
    prod.check = check
    if (checkAllStatus && !prod.check) {
      checkAllStatus = false
    }
  })
  checkAll.value = checkAllStatus
}
const containsId = (skuId) => {
  return disableSkuIds.value.indexOf(skuId) !== -1
}
// 每页数
const sizeChangeHandle = (val) => {
  pageSize.value = val
  pageIndex.value = 1
  getDataList()
}
// 当前页
const currentChangeHandle = (val) => {
  pageIndex.value = val
  getDataList()
}
/**
 * 获取分类id
 */
const handleChange = (val) => {
  shopCategoryId.value = val[val.length - 1]
}
/**
 * 根据条件搜索商品
 */
const searchProd = () => {
  pageIndex.value = 1
  getDataList(true)
}
/**
 * 清空搜索条件
 */
const clean = () => {
  spuName.value = ''
  shopCategoryId.value = null
  selectedCategory.value = idList(categoryList.value, shopCategoryId.value, 'categoryId', 'children').reverse()
}
// 确定事件
const submitProds = () => {
  emit('refreshSelectProds', selectProds.value)
  visible.value = false
}
const selectProduct = (prod, sku) => {
  // 勾选
  if (sku.check) {
    const pic = sku.mainImgUrl || sku.imgUrl || prod.mainImgUrl || ''
    // 普通商品
    if (selectSkuIds.value.indexOf(sku.skuId) !== -1) {
      return
    }
    selectProds.value.push({
      prodId: prod.prodId,
      prodName: prod.prodName,
      pic,
      skuId: sku.skuId,
      spuId: sku.spuId,
      spuName: prod.name,
      skuName: sku.skuName || sku.skuLangList?.[0]?.skuName,
      stock: sku.stock,
      partyCode: sku.partyCode,
      minOrderQuantity: sku.minOrderQuantity,
      purchasePrice: sku.priceFee,
      supplierProdId: sku.supplierProdId,
      type: prod.type
    })
    selectSkuIds.value.push(sku.skuId)
  } else {
    if (selectSkuIds.value.indexOf(sku.skuId) === -1) {
      return
    }
    // 取消勾选
    for (let i = 0; i < selectProds.value.length; i++) {
      if (selectProds.value[i].skuId === sku.skuId) {
        selectProds.value.splice(i, 1)
      }
    }

    selectSkuIds.value.splice(selectSkuIds.value.indexOf(sku.skuId), 1)
  }
}
const checkAllProd = () => {
  dataList.value.forEach(prod => {
    prod.check = checkAll.value
    prod[skuKey.value]?.forEach(sku => {
      // 勾选或取消勾选没有被禁用的sku
      if (!sku.disable) {
        sku.check = checkAll.value
        selectProduct(prod, sku)
      }
    })
  })
}
const checkProd = (index) => {
  const prod = dataList.value[index]
  prod[skuKey.value]?.forEach(sku => {
    // 勾选或取消勾选没有被禁用的sku
    if (!sku.disable) {
      sku.check = prod.check
      selectProduct(prod, sku)
    }
  })
  dataList.value[index] = prod
  checkStatus()
}
const checkSku = (index, skuIndex) => {
  const prod = dataList.value[index]
  let check = true
  for (let i = 0; i < prod[skuKey.value].length; i++) {
    const sku = prod[skuKey.value][i]
    if (check && !sku.check) {
      check = false
    }
    if (skuIndex === i) {
      selectProduct(prod, sku)
    }
  }
  prod.check = check
  dataList.value[index] = prod
  checkStatus()
}
const checkStatus = () => {
  let checkAllStatus = true
  for (let i = 0; i < dataList.value.length; i++) {
    if (!dataList.value[i].check) {
      checkAllStatus = false
      break
    }
  }
  checkAll.value = checkAllStatus
}
defineExpose({ init })

</script>
<style lang="scss" scoped>
.sku-select-components {
  .prods-select-body {
    margin-top: 10px;
  }

  .pagination {
    text-align: right;
  }

  .prod-tit span {
    margin-right: 15px;
  }

  .prod-cont {
    display: flex;
    border: 1px solid #EBEDF0;
    color: #495060;
  }

  .prod-cont .item {
    display: flex;
    display: -webkit-flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    text-align: center;
    height: 100%;
  }

  .prod-cont .prod-item {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .prod-item .prod-name {
    width: 55%;
    text-align: left;
    // 超过2行溢出隐藏
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .prod-price span {
    display: block;
  }

  .prod-price span:first-child {
    margin-bottom: 10px;
  }
  .prod-cont .items.name {
    display: flex;
    align-items: center;
    position: relative;
    padding: 10px;
    border-bottom: 1px solid #EBEDF0;
  }

  .prod-cont .items.name:last-child {
    border-bottom: none;
  }

  .prod-image {
    margin-right: 5px;
    width: 80px;
    height: 80px;
  }

  .content .tit {
    margin-bottom: 15px;
    background: #F7F8FA;
    z-index: 11;
    height: 57px;
    font-weight: bold;
    display: flex;
    align-items: center;
  }

  .content .column-title {
    text-align: center;
  }

  .content .tit .item {
    padding: 0 10px;
    width: 10%;
    text-align: center;
  }

  .content .notDataTip {
    text-align: center;
  }

  .prods-select-body .content .prod .items.name.public-height {
    height: 100%;
  }
}
</style>
