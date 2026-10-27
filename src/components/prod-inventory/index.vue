<template>
  <div class="component-prod-inventory">
    <el-dialog
      v-model="visible"
      title="商品库存"
      :close-on-click-modal="false"
      width="1000px"
    >
      <div class="search-bar">
        <el-form
          ref="searchFormRef"
          :inline="true"
          :model="searchForm"
          label-width="auto"
          @submit.prevent
        >
          <div class="input-row">
            <el-form-item
              :label="'商品名称' + ':'"
              prop="spuName"
            >
              <el-input
                v-model="searchForm.spuName"
                :placeholder="'商品名称'"
              />
            </el-form-item>
            <el-form-item
              label-width="100"
              :label="'店铺分类' + ':'"
              prop="categoryId"
            >
              <el-cascader
                v-model="selectedCategory"
                expand-trigger="hover"
                :options="categoryList"
                :props="categoryTreeProps"
                :clearable="true"
                @change="onChangeSelectCategory"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="onSearch(true)"
              >
                搜索
              </el-button>
              <el-button
                @click="onResetSearch(searchFormRef)"
              >
                重置
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="main-content">
        <!-- 表格 -->
        <div class="table-con">
          <el-table
            ref="dataListRef"
            :data="dataList"
            header-cell-class-name="table-header"
            row-class-name="table-row"
            style="width: 100%;"
            :row-key="row => { return row.partyCode }"
          >
            <el-table-column
              width="380"
              label="商品名称"
            >
              <template #default="scope">
                <div class="table-cell-con">
                  <div class="table-cell-image">
                    <ImgShow
                      :src="scope.row.imgUrl || scope.row.mainImgUrl"
                      :img-style="{ width: '60px', height: '60px' }"
                      @img-error="scope.row.imgUrl = ''"
                    />
                  </div>
                  <span class="table-cell-text">
                    {{ scope.row.name }}
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="skuName"
              label="商品规格"
            >
              <template #default="scope">
                <div
                  v-for="item in scope.row.skus"
                  :key="item.skuId"
                  class="name"
                >
                  <template v-if="item.skuLangList && item.skuLangList.length">
                    {{ item.skuLangList[0].skuName || '-' }}
                  </template>
                  <template v-else>
                    -
                  </template>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="price"
              label="商品价格"
            >
              <template #default="scope">
                <div
                  v-for="sku in scope.row.skus"
                  :key="sku.skuId"
                  class="name"
                >
                  {{ formatPrice(sku.priceFee, 1).toFixed(2) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('stock.stock')"
              prop="stock"
            >
              <template #default="scope">
                <div
                  v-for="sku in scope.row.skus"
                  :key="sku.skuId"
                  class="name"
                >
                  {{ sku.stock }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 分页 -->
      <pagination
        v-show="page.total>0"
        v-model:page="searchForm.pageNum"
        v-model:limit="searchForm.pageSize"
        :total="page.total"
        @pagination="()=>onGetPageData()"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { formatPrice } from '@/utils'
import * as api from '@/api/stock/warehouse-station.js'
import { enableCategories } from '@/api/product/category'

// 1：查询仓库，2：查询门店
const props = defineProps({
  stockPointType: {
    default: 1,
    type: Number
  }
})

onMounted(() => {
  // 获取分类列表
  onGetCategoryList()
})

const stockPointId = ref(null)
const visible = ref(false)
// type:仓库类型(0默认仓库，1区域仓库)(门店查询需要传1) stockMode:门店库存类型 （1共享总部库存 2独立销售库存）
const init = (id, type, stockMode) => {
  onReset()
  stockPointId.value = id
  searchForm.type = type
  visible.value = true
  searchForm.stockMode = stockMode || null
  onGetPageData(true)
}

let tempSearchForm = null // 保存上次点击查询的请求条件
// 头部搜索表单
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  spuName: '',
  stockPointType: props.stockPointType,
  categoryId: '',
  type: null,
  stockMode: null
})
const page = reactive({
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
const dataList = ref([])
// 获取数据列表
const onGetPageData = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = JSON.parse(JSON.stringify(searchForm))
  } else {
    tempSearchForm.pageNum = searchForm.pageNum
    tempSearchForm.pageSize = searchForm.pageSize
  }
  api.getPageStockPointSku({
    ...tempSearchForm,
    stockPointId: stockPointId.value
  }).then(res => {
    dataList.value = res?.list || []
    page.total = res.total
  })
}

// 条件查询
const onSearch = (newData = false) => {
  searchForm.pageNum = 1
  searchForm.pageSize = 10
  onGetPageData(newData)
}
// 搜索表单重置
const searchFormRef = ref(null)
const onResetSearch = (formEl) => {
  selectedCategory.value = []
  formEl.resetFields()
}

/* 获取店铺分类列表 */
const onGetCategoryList = () => {
  enableCategories().then((data) => {
    categoryList.value = treeDataTranslate(data, 'categoryId', 'parentId')
  })
}

const categoryList = ref([])
const selectedCategory = ref([])
const categoryTreeProps = reactive({
  value: 'categoryId',
  label: 'name'
})
const onChangeSelectCategory = () => {
  searchForm.categoryId = (selectedCategory.value && selectedCategory.value[1]) || ''
}

const onReset = () => {
  selectedCategory.value = []
  searchForm.pageSize = 10
  searchForm.pageNum = 1
  searchForm.spuName = ''
  searchForm.categoryId = ''
}
defineExpose({
  init
})
</script>

<style lang="scss" scoped>
.component-prod-inventory {
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
</style>
