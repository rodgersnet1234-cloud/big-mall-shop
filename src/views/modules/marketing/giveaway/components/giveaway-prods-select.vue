<template>
  <el-dialog
    v-model="visible"
    title="选择商品"
    top="100px"
    :close-on-click-modal="false"
    :before-close="closeBefore"
    :append-to-body="true"
    width="960px"
    class="prods-select-dialog"
  >
    <el-form
      ref="searchFormRef"
      :inline="true"
      :model="searchForm"
      class="demo-form-inline"
      @submit.prevent
    >
      <el-form-item
        label="商品名称:"
        prop="name"
      >
        <el-input
          v-model.trim="searchForm.name"
          style="width: 200px"
          placeholder="商品名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="上级分类:">
        <el-cascader
          v-model="selectedCategory"
          expand-trigger="hover"
          :options="categoryList"
          :props="categoryTreeProps"
          :clearable="true"
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
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <div class="prods-select-body">
      <el-table
        ref="prodTableRef"
        v-loading="pageLoading"
        :data="pageData.dataList"
        :header-cell-style="{height: '42px', background: '#F6F7FA', color:'#666666','font-weight': '500'}"
        :cell-style="{height: '64px', padding: '8px 0', color:'#000'}"
        :row-key="getRowKeys"
        style="width: 100%"
        height="420"
        @selection-change="selectChangeHandle"
      >
        <el-table-column
          v-if="isSingle"
          width="50"
          header-align="center"
          align="center"
        >
          <template #default="scope">
            <div class="prods-select-radio">
              <el-radio
                v-model="singleSelectProdId"
                :label="scope.row.spuId"
                @change="getSelectProdRow(scope.row)"
              >
&nbsp;
              </el-radio>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="!isSingle"
          type="selection"
          :reserve-selection="true"
          header-align="center"
          align="center"
          width="50"
        />
        <el-table-column
          align="left"
          width="550"
          label="商品信息"
        >
          <template #default="scope">
            <div class="prod-info">
              <ImgShow
                :src="scope.row.mainImgUrl"
                :img-style="{width:'48px',height:'48px'}"
              />
              <span class="prod-name">{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <!-- 销售价(元) -->
        <el-table-column
          prop="priceFee"
          label="销售价(元)"
        >
          <template #default="scope">
            <span class="prod-name">{{ formatPrice(scope.row.priceFee,1).toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="totalStock"
          label="商品库存"
        />
      </el-table>
    </div>
    <pagination
      v-show="pageData.total > 0"
      v-model:page="searchForm.pageNum"
      v-model:limit="searchForm.pageSize"
      style="text-align:right"
      :total="pageData.total"
      @pagination="getPageData()"
    />
    <template #footer>
      <span>
        <el-button
          @click="cancelFn"
        >取消</el-button>
        <el-button
          type="primary"
          @click="submitProds()"
        >确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { treeDataTranslate, idList, formatPrice } from '@/utils'
import { enableCategories } from '@/api/product/category'
import { mainSpuPage } from '@/api/giveaway/giveaway'
import { onBeforeUnmount } from 'vue'

const emit = defineEmits(['refreshSelectProds'])
let tempSearchForm = null // 保存上次点击查询的请求条件
const props = defineProps({
  isSingle: {
    default: false,
    type: Boolean
  }
})
const searchFormRef = ref(null)
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  name: ''
})

// 返回参数
const pageData = ref({
  dataList: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})

const visible = ref(false)
const dataListSelections = ref([])
const categoryList = ref([])
const selectedCategory = ref([])
const shopSecondaryCategoryId = ref(null)
const singleSelectProdId = ref(0)
const selectProds = ref([])
const categoryTreeProps = ref({
  value: 'categoryId',
  label: 'name'
})

onMounted(() => {
  getPageData()
})

// 获取数据列表
const init = (initSelectProds) => {
  singleSelectProdId.value = 0
  selectProds.value = initSelectProds || []
  visible.value = true
  if (initSelectProds instanceof Array) {
    selectProds.value.forEach(row => {
      dataListSelections.value.push(row)
    })
  } else {
    dataListSelections.value = initSelectProds
  }
  getPageData()
  getCategoryList()
}

const getCategoryList = () => {
  enableCategories().then(data => {
    categoryList.value = treeDataTranslate(data, 'categoryId', 'parentId')
  })
}

const prodTableRef = ref(null)
const cancelFn = () => {
  dataListSelections.value = []

  onResetSearch()
  visible.value = false
  prodTableRef.value?.clearSelection()
}

const pageLoading = ref(true)
const getPageData = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...searchForm, shopCategoryId: shopSecondaryCategoryId.value }
  } else {
    tempSearchForm.pageNum = searchForm.pageNum
    tempSearchForm.pageSize = searchForm.pageSize
    tempSearchForm.name = searchForm.name
    tempSearchForm.shopCategoryId = shopSecondaryCategoryId.value
  }
  pageLoading.value = true
  mainSpuPage(tempSearchForm).then(data => {
    pageData.value.dataList = data.list
    pageData.value.pages = data.pages
    pageData.value.total = data.total
    pageLoading.value = false
    if (selectProds.value.length) {
      nextTick(() => {
        selectProds.value.forEach(row => {
          const index = pageData.value.dataList.findIndex((prodItem) => prodItem.spuId === row.spuId)
          if (index >= 0) {
            prodTableRef.value?.toggleRowSelection(pageData.value.dataList[index], true)
          }
        })
      })
    }
  })
}

const getRowKeys = (row) => {
  return row.spuId
}

// 获取分类id
const handleChange = (val) => {
  shopSecondaryCategoryId.value = val && val[val.length - 1]
}

// 根据条件搜索商品
const onSearchProd = () => {
  searchForm.pageNum = 1
  getPageData()
}

// 清空搜索条件
const onResetSearch = () => {
  searchForm.name = ''
  shopSecondaryCategoryId.value = null
  selectedCategory.value = idList(categoryList.value, shopSecondaryCategoryId.value, 'categoryId', 'children').reverse()
}

// 多选点击事件
const selectChangeHandle = (selection) => {
  dataListSelections.value = selection
}

const getSelectProdRow = (row) => {
  dataListSelections.value = [row]
}

// 确定事件
const submitProds = () => {
  // 商品单选情况
  if (props.isSingle) {
    dataListSelections.value.length && emit('refreshSelectProds', dataListSelections.value[0])
    dataListSelections.value = []
    visible.value = false
    // 商品多选情况
  } else {
    const prods = []
    dataListSelections.value.forEach(item => {
      const prodIndex = prods.findIndex((prod) => prod.spuId === item.spuId)
      if (prodIndex === -1) {
        prods.push(
          {
            spuId: item.spuId,
            name: item.name,
            mainImgUrl: checkFileUrl(item.mainImgUrl),
            activityId: item.activityId,
            prodType: item.prodType,
            oriPrice: item.oriPrice,
            priceFee: item.priceFee,
            brief: item.brief,
            activityPrice: item.activityPrice
          }
        )
      }
    })
    emit('refreshSelectProds', prods)
    dataListSelections.value = []
    visible.value = false
  }
}

const closeBefore = (done) => {
  dataListSelections.value = []
  prodTableRef.value?.clearSelection()
  onResetSearch()
  visible.value = false
  done()
}

onBeforeUnmount(() => {
  prodTableRef.value?.clearSelection()
})
defineExpose({ init })
</script>
<style lang="scss" scoped>
.prods-select-dialog {
  .prods-select-body {
    height: 420px;
  }
  .prod-info {
    display: flex;
    align-items: center;
    .prod-name {
      flex: 1;
      margin-left: auto;
      padding: 0 30px 0 10px;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      word-break: break-word;
      display: -webkit-box;
      -webkit-line-clamp: 2;
     /* autoprefixer: ignore next */
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 20px;
    }
  }
  :deep(.el-table__body-wrapper::-webkit-scrollbar) {
    width: 6px;
    height: 439px;
    background: #F7F8FA;
    opacity: 1;
    border-radius: 4px;
  }
  // 滚动条的滑块
  :deep(.el-table__body-wrapper::-webkit-scrollbar-thumb) {
    width: 6px;
    height: 150px;
    background: #E9ECF3;
    opacity: 1;
    border-radius: 4px;
  }
}

:deep(.el-table__body-wrapper) {
  height: calc(100% - 44px) !important;
}
</style>
