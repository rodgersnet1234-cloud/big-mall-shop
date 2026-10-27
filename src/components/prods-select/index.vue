<template>
  <el-dialog
    v-model="visible"
    title="商品选择"
    :modal-append-to-body="false"
    :append-to-body="true"
    top="4vh"
    :close-on-click-modal="false"
    width="800px"
    class="component-prod-select-box"
    @close="closeModule"
  >
    <el-form
      :inline="true"
      :model="searchForm"
      class="demo-form-inline"
      @submit.prevent
    >
      <el-form-item label="商品名称">
        <el-input
          v-model.trim="searchForm.spuName"
          placeholder="商品名称"
          clearable
          style="width: 180px"
        />
      </el-form-item>
      <el-form-item label="上级分类">
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
          @click="onSearchProd"
        >
          查询
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="onResetSearch">
          {{ $t("shop.resetMap") }}
        </el-button>
      </el-form-item>
    </el-form>
    <div class="main-content prods-select-body">
      <div class="table-con">
        <el-table
          ref="prodTableRef"
          v-loading="dataListLoading"
          :data="pageData.dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          :row-key="getRowKeys"
          style="width: 100%"
          @selection-change="selectChangeHandle"
        >
          <el-table-column
            v-if="isSingle"
            width="50"
            header-align="center"
            align="center"
          >
            <template #default="{row}">
              <el-radio
                :key="'radio' + row.spuId"
                v-model="singleSelectspuId"
                :label="row.spuId"
                class="radio-box"
                @change="getSelectProdRow(row)"
              >
                {{ '' }}
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column
            v-if="!isSingle"
            type="selection"
            header-align="center"
            align="center"
            width="50"
          />
          <el-table-column
            prop="spuName"
            align="left"
            label="商品名称"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.spuName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="140"
            label="商品图片"
          >
            <template #default="{row}">
              <div class="table-cell-image">
                <ImgShow :src="row.mainImgUrl" />
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="priceFee"
            header-align="center"
            align="center"
            label="商品价格"
            width="200px"
          />
        </el-table>
      </div>
    </div>
    <!-- 分页 -->
    <pagination
      v-model:page="searchForm.pageNum"
      v-model:limit="searchForm.pageSize"
      style="text-align: right"
      :total="pageData.total"
      @pagination="getPageData"
    />
    <template #footer>
      <span>
        <el-button
          @click="visible = false"
        >取消</el-button>
        <el-button
          type="primary"
          @click="onSubmitProds()"
        >确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { treeDataTranslate, idList, formatPrice } from '@/utils'
import { page } from '@/api/product/list'
import { shopCategoryPage } from '@/api/product/category'
import { discountPage } from '@/api/distributionProd/distributionProd'

const emit = defineEmits(['refreshSelectProds'])
const props = defineProps({
  isSingle: {
    default: false,
    type: Boolean
  },
  distributionJudgment: {
    default: false,
    type: Boolean
  },
  spuType: {
    default: 0,
    type: Number
  },
  activityType: {
    default: 0,
    type: Number
  },
  dataUrl: {
    default: '/prod/prod/page',
    type: String
  },
  isNotCompose: {
    default: false,
    type: Boolean
  },
  isSupplierDelivery: {
    default: false,
    type: Boolean
  },
  notSpuMolds: {
    default: () => [],
    type: Array // 0.实物商品 1. 虚拟商品 2.组合商品 2.组合商品
  }
})

const visible = ref(false)

const searchForm = ref({
  pageSize: 10,
  pageNum: 1,
  spuType: null,
  spuStatus: 0,
  distributionSpu: null,
  keyword: '',
  shopSecondaryCategoryId: null,
  spuName: '',
  product: '',
  isSupplierDelivery: ''
})
const pageData = ref({
  dataList: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
const singleSelectspuId = ref(0)
const selectProds = ref([])
const dataListSelections = ref([])
const categoryList = ref([])
const selectedCategory = ref([])
const shopCategoryId = ref(null)
const dataListLoading = ref(false)
const categoryTreeProps = ref({
  value: 'categoryId',
  label: 'name'
})
const type = ref(0)
// 是否展示定金预售商品 1.是 0.否
const canDeposit = ref({})

const init = (initSelectProds, initType, initCanDeposit) => {
  singleSelectspuId.value = 0
  selectProds.value = initSelectProds || []
  visible.value = true
  dataListLoading.value = true
  onResetSearch()
  if (selectProds.value) {
    selectProds.value.forEach(row => {
      dataListSelections.value.push(row)
    })
  }
  if (initCanDeposit === 0 || initCanDeposit === 1) {
    canDeposit.value = { canDeposit: initCanDeposit }
  }
  type.value = initType
  // 获取未成为分销商品的商品
  // initType 存在即获取分销商品
  if (initType) {
    getDiscountList()
    getCategoryList()
    return
  }
  // 如果是秒杀进来选择的话，获取可以秒杀的商品列表
  getPageData()
  getCategoryList()
}

const getCategoryList = () => {
  shopCategoryPage().then((data) => {
    categoryList.value = treeDataTranslate(data, 'categoryId', 'parentId')
  })
}

const prodTableRef = ref(null)
const getDiscountList = () => {
  if (!props.distributionJudgment) {
    searchForm.value.spuType = props.spuType
  }
  searchForm.value.spuStatus = 1
  if (type.value) {
    searchForm.value.distributionSpu = false
  }
  discountPage({ ...searchForm.value, mustNotProdTypes: 5 }).then(res => {
    pageData.value.total = res.total
    pageData.value.dataList = res.list || []
    pageData.value.dataList.forEach(prod => {
      prod.priceFee = formatPrice(prod.priceFee, 1).toFixed(2)
    })
    dataListLoading.value = false
    if (selectProds.value?.length > 0) {
      nextTick(() => {
        selectProds.value.forEach(row => {
          const index = pageData.value.dataList.findIndex((prodItem) => prodItem.spuId === row.spuId)
          prodTableRef.value?.toggleRowSelection(pageData.value.dataList[index])
        })
      })
    }
  })
}

const getPageData = () => {
  if (!props.distributionJudgment) {
    searchForm.value.spuType = props.spuType
  }
  if (type.value) {
    searchForm.value.distributionSpu = false
  }
  searchForm.value.spuStatus = 1

  const paramsData = {
    ...searchForm.value,
    ...canDeposit.value,
    mustNotProdTypes: 5,
    notSpuMolds: props.notSpuMolds,
    isSupplierDelivery: props.isSupplierDelivery ? 1 : undefined
  }
  page(paramsData).then(data => {
    pageData.value.total = data.total
    pageData.value.dataList = data.list || []
    if (pageData.value.dataList.length) {
      pageData.value.dataList.forEach(prod => {
        prod.priceFee = formatPrice(prod.priceFee, 1).toFixed(2)
      })
    }
    dataListLoading.value = false

    if (selectProds.value.length) {
      nextTick(() => {
        selectProds.value.forEach(row => {
          const index = pageData.value.dataList.findIndex((prodItem) => prodItem.spuId === row.spuId)
          if (index !== -1) {
            prodTableRef.value?.toggleRowSelection(pageData.value.dataList[index], true)
          }
        })
      })
    } else if (dataListSelections.value.length) {
      nextTick(() => {
        dataListSelections.value.forEach(row => {
          const index = pageData.value.dataList.findIndex((prodItem) => prodItem.spuId === row.spuId)
          if (index !== -1) {
            prodTableRef.value?.toggleRowSelection(pageData.value.dataList[index], true)
          }
        })
      })
    }
  })
}

// 单选商品事件
const getSelectProdRow = (row) => {
  dataListSelections.value = [row]
}

// 多选点击事件
const selectChangeHandle = (selection) => {
  dataListSelections.value = selection
}

// 获取分类id
const handleChange = (val) => {
  shopCategoryId.value = val && val[val.length - 1]
}

// 根据条件搜索商品
const onSearchProd = () => {
  searchForm.value.pageNum = 1
  searchForm.value.keyword = searchForm.value.spuName
  searchForm.value.shopSecondaryCategoryId = shopCategoryId.value
  getPageData()
}

// 清空搜索条件
const onResetSearch = () => {
  searchForm.value.spuName = ''
  searchForm.value.keyword = ''
  searchForm.value.shopSecondaryCategoryId = null
  shopCategoryId.value = null
  selectedCategory.value = idList(categoryList.value, shopCategoryId.value, 'categoryId', 'children').reverse()
}

const closeModule = () => {
  searchForm.value.spuName = ''
  shopCategoryId.value = null
  dataListSelections.value = []
  prodTableRef.value?.clearSelection()
  searchForm.value.pageSize = 10
  searchForm.value.pageNum = 1
}

// 确定事件
const onSubmitProds = () => {
  if (props.isSingle) {
    // 单选返回
    dataListSelections.value.length && emit('refreshSelectProds', dataListSelections.value[0])
    dataListSelections.value = []
    visible.value = false
  } else {
    const prods = []
    dataListSelections.value.forEach(item => {
      const prodIndex = prods.findIndex((prod) => prod.spuId === item.spuId)
      if (prodIndex === -1) {
        prods.push(
          {
            spuId: item.spuId,
            spuName: item.spuName,
            name: item.spuName,
            mainImgUrl: item.mainImgUrl,
            activityId: item.activityId,
            spuType: item.spuType,
            skuList: item.skus,
            priceFee: item.priceFee
          }
        )
      }
    })
    if (dataListSelections.value.length > 0) {
      emit('refreshSelectProds', prods)
    }
    dataListSelections.value = []
    visible.value = false
  }
}

const getRowKeys = (row) => {
  return row.prodId
}

defineExpose({ init })
</script>
<style lang="scss" scoped>

.component-prod-select-box{
  .main-content.prods-select-body{
    padding: 0;
    max-height: 480px;
    overflow: auto;
    .table-con {
      padding-bottom: 20px;
    }
  }
}

</style>
