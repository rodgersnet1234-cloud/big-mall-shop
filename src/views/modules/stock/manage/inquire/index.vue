<template>
  <div class="mod-stock stock-list-mod">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        class="search-form"
        :model="searchForm"
        label-width="auto"
        @submit.prevent
      >
        <!-- 表单项 -->
        <div class="input-row">
          <el-form-item
            :label="$t('stock.productFilter') + ':'"
          >
            <el-select
              v-model="searchForm.prodKeyType"
              class="screen"
              @change="prodKeyTypeChange"
            >
              <el-option
                v-for="node in prodKeyArr"
                :key="node.key"
                :label="node.label"
                :value="node.key"
              />
            </el-select>
            <el-input
              v-model.trim="searchForm.prodKey"
              :placeholder="prodKeyArr[searchForm.prodKeyType - 1].inputTips"
            />
          </el-form-item>
          <el-form-item :label="$t('stock.productBrands') + ':'">
            <el-select
              v-model="searchForm.brandId"
              clearable
              filterable
            >
              <el-option
                v-for="node in brandList"
                :key="node.brandId"
                :label="node.name"
                :value="node.brandId"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('stock.shopCategories') + ':'">
            <el-cascader
              v-model="selectedCategory"
              expand-trigger="hover"
              :options="categoryList"
              :props="categoryTreeProps"
              :clearable="true"
              @change="handleChange"
            />
          </el-form-item>
          <el-form-item label="预警库存:">
            <el-select
              v-model="searchForm.stockWarning"
              clearable
              placeholder="请选择"
            >
              <el-option
                label="是"
                :value="1"
              />
              <el-option
                label="否"
                :value="0"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSearch(true)"
            >
              {{ $t('table.search') }}
            </el-button>
            <el-button @click="onResetSearch()">
              {{ $t('shop.resetMap') }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-content">
      <div class="operation-bar">
        <el-button
          v-permission="['multishop:inquireStock:export']"
          class="default-btn"
          @click="exportSkuInfo"
        >
          {{ $t('stock.export') }}
        </el-button>
      </div>
      <!-- 表格 -->
      <div class="table-con">
        <el-table
          ref="dataListRef"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%;"
          :row-key="row => { return row.partyCode }"
          @selection-change="onSelectSome"
        >
          <el-table-column
            type="selection"
            align="center"
            fixed="left"
            width="55"
            :reserve-selection="true"
          />
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
                <div class="table-cell-text">
                  {{ scope.row.spuName }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('product.commodityCode')"
            width="240"
          >
            <template #default="scope">
              <span class="table-cell-text">{{ scope.row.partyCode || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="skuName"
            label="商品规格"
          >
            <template #default="scope">
              <div class="sku-name-txt">
                {{ scope.row.skuName || '-' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="可售库存"
            prop="stock"
          >
            <template #default="scope">
              <span class="table-cell-text line-clamp-one">{{ scope.row.stock || '0' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="总库存"
            prop="stock"
          >
            <template #default="scope">
              <span class="table-cell-text line-clamp-one">{{ scope.row.totalStock }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('stock.price')"
            prop="priceFee"
            min-width="120"
          >
            <template #default="scope">
              <span class="table-cell-text line-clamp-one">{{ scope.row.priceFee }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('table.actions')"
            fixed="right"
            width="200"
          >
            <template #default="scope">
              <div class="text-btn-con">
                <el-button
                  type="primary"
                  link
                  @click="onViewStockInfo(scope.row)"
                >
                  查看库存
                </el-button>

                <el-button
                  type="primary"
                  link
                  @click="queryConditionHandle(scope.row)"
                >
                  {{ $t('stock.queryCondition') }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页 -->
    <pagination
      :current-page="page.currentPage"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="page.pageSize"
      :total="page.total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="onPageSizeChange"
      @current-change="onPageChange"
    />
    <!-- 导出入库明细 -->
    <el-dialog
      v-model="exportStockBillLogVisible"
      :title="$t('table.export')"
      top="25vh"
      width="500px"
    >
      <el-radio
        v-model="exportRadio"
        :label="1"
      >
        {{ $t('stock.exportOfSearchInquire') }}
      </el-radio>
      <el-radio
        v-model="exportRadio"
        :label="2"
      >
        {{ $t('stock.exportOfSelectInquire') }}
      </el-radio>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            @click="exportStockBillLogVisible = false"
          >{{ $t('table.cancel') }}</el-button>
          <el-button
            type="primary"
            @click="confirmExport"
          >{{ $t('table.submit') }}</el-button>
        </span>
      </template>
    </el-dialog>
    <stock-inquire-dialog
      v-if="inquireDialogVisible"
      ref="inquireDialogRef"
    />
    <stock-info
      v-if="stockInfoVisible"
      ref="stockInfoRef"
      :is-view="true"
    />
  </div>
</template>

<script setup>
import { getPageSku, getCategories, getSigningList, getExportExce } from '@/api/stock/components/retail-stock-inquire'
import { treeDataTranslate } from '@/utils'
import { ElMessage } from 'element-plus'
import stockInquireDialog from './components/stock-inquire-dialog.vue'
import stockInfo from './components/stock-info/index.vue'

let tempSearchForm = null // 保存上次点击查询的请求条件

const isSubmit = ref(false)
const dataListLoading = ref(false)
const dataList = ref([]) // 表格数据
const inquireDialogVisible = ref(false) // 查看同款信息弹窗
const exportStockBillLogVisible = ref(false) // 导出弹窗是否可见
const exportRadio = ref(1) //  1 按搜索条件导出 2 按选择项导出
const dataListSelections = ref([]) // 已选择的数据项
const page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
})
const prodKeyArr = [
  { key: 1, label: $t('product.prodName'), inputTips: $t('stock.inputName') },
  { key: 2, label: $t('product.commodityCode'), inputTips: $t('stock.inputPartyCode') }
]
const brandList = ref([])
const categoryList = ref([])
const selectedCategory = ref([])
const searchForm = reactive({
  prodKeyType: 1, // 1：商品名称 2：商品编码
  // isCompose: 0, // 是否组合商品
  prodKey: '', // 搜索商品关键词
  brandId: null, // 品牌id
  // shopCategoryId: null // 店铺分类id
  shopSecondaryCategoryId: null,
  spuName: null,
  partyCode: null,
  stockWarning: null
})
const categoryTreeProps = reactive({
  value: 'categoryId',
  label: 'name'
})
onMounted(() => {
  init()
})

const init = () => {
  selectedCategory.value = []

  // 获取库存列表
  const stockWarning = useRoute().query.stockWarning
  if (stockWarning) { //
    searchForm.stockWarning = stockWarning / 1
    getDataList(null, true)
  } else {
    getDataList()
  }

  // 获取品牌列表
  getBrandList()
  // 获取分类列表
  getCategoryList()
}
const getDataList = (pageParam, newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = JSON.parse(JSON.stringify(searchForm))
    delete tempSearchForm.prodKeyType
    delete tempSearchForm.prodKey
    delete tempSearchForm.brandId
    tempSearchForm.brandIds = searchForm.brandId
    if (searchForm.prodKeyType === 1) {
      tempSearchForm.spuName = searchForm.prodKey
    } else if (searchForm.prodKeyType === 2) {
      tempSearchForm.skuCode = searchForm.prodKey
    }
  }
  getPageSku(
    Object.assign(
      {
        pageNum: pageParam == null ? page.currentPage : pageParam.currentPage,
        pageSize: pageParam == null ? page.pageSize : pageParam.pageSize
      },
      tempSearchForm
    )
  ).then((data) => {
    dataList.value = data.list
    dataList.value.forEach(item => {
      item.priceFee = formatPrice(item.priceFee, 1).toFixed(2)
    })
    page.total = data.total
    dataListLoading.value = false
  }).catch(() => {
    dataListLoading.value = false
  })
}
const prodKeyTypeChange = () => {
  searchForm.prodKey = ''
}
const getBrandList = () => {
  getSigningList().then((data) => {
    data.platformBrandList = data.platformBrandList.filter(el => {
      return el.brandStatus === 1
    })
    brandList.value = data.platformBrandList
  })
}
const getCategoryList = () => {
  getCategories().then((data) => {
    categoryList.value = treeDataTranslate(data, 'categoryId', 'parentId')
  })
}

/**
 * 获取分类id
 */
const handleChange = (val) => {
  searchForm.shopSecondaryCategoryId = val[val.length - 1]
}
const dataListRef = ref(null)
// 条件查找
const onSearch = (newData = false) => {
  page.currentPage = 1
  // 清空商品选择
  dataListRef.value.clearSelection()
  getDataList(null, newData)
}
const exportSkuInfo = () => {
  exportStockBillLogVisible.value = true
}
const onResetSearch = () => {
  searchForm.prodKeyType = 1 // 1：商品名称 2：商品编码
  searchForm.prodKey = '' // 搜索商品关键词
  searchForm.supplierId = null // 供应商id
  searchForm.brandId = null // 品牌id
  searchForm.shopSecondaryCategoryId = null // 店铺分类id
  searchForm.spuName = null
  searchForm.partyCode = null
  searchForm.stockWarning = null
  selectedCategory.value = []
}

const inquireDialogRef = ref(null)
const queryConditionHandle = (row) => {
  inquireDialogVisible.value = true
  nextTick(() => {
    inquireDialogRef.value.init(row.spuId)
  })
}
const onPageSizeChange = (val) => {
  page.pageSize = val
  getDataList(page)
}
const onPageChange = (val) => {
  page.currentPage = val
  getDataList(page)
}
// 多选变化
const onSelectSome = (val) => {
  dataListSelections.value = val
}
/**
 * 确定导出
 */
const confirmExport = () => {
  if (exportRadio.value !== 1 && exportRadio.value !== 2) {
    ElMessage({
      message: $t('stock.exportRadioEmptyTips'),
      type: 'error',
      duration: 1500,
      onClose: () => {
        isSubmit.value = false
      }
    })
    return
  }
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  // 准备参数
  let params = {}
  if (exportRadio.value === 1) {
    // 导出模式为按搜索条件导出
    if (page.total === 0) {
      ElMessage({
        message: $t('stock.exportStockLogSearchEmptyTips'),
        type: 'error',
        duration: 1500,
        onClose: () => {
          isSubmit.value = false
        }
      })
      return
    }
    params = searchForm
    params.skuIds = null

    params = JSON.parse(JSON.stringify(searchForm))
    delete params.prodKeyType
    delete params.prodKey
    delete params.brandId
    params.brandIds = searchForm.brandId
    // 库存记录不导出组合商品信息
    params.notSpuMold = 2
    if (searchForm.prodKeyType === 1) {
      params.spuName = searchForm.prodKey
    } else if (searchForm.prodKeyType === 2) {
      params.partyCode = searchForm.prodKey
    }
  } else {
    // 导出模式为按选中的数据导出
    if (dataListSelections.value.length === 0) {
      ElMessage({
        message: $t('stock.exportStockLogSelectEmptyTips'),
        type: 'error',
        duration: 1500,
        onClose: () => {
          isSubmit.value = false
        }
      })
      return
    }
    params.skuIds = dataListSelections.value.map(item => {
      return item.skuId
    })
  }
  getExportExce(params).then((data) => {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
    const fileName = $t('stock.skuStockXls')
    const elink = document.createElement('a')
    if ('download' in elink) {
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    } else {
      navigator.msSaveBlob(blob, fileName)
    }
    ElMessage({
      message: $t('stock.exportSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => {
        isSubmit.value = false
        exportStockBillLogVisible.value = false
      }
    })
  }).catch(() => {
    isSubmit.value = false
  })
}
const stockInfoVisible = ref(false)
const stockInfoRef = ref(null)
const onViewStockInfo = (row) => {
  stockInfoVisible.value = true
  nextTick(() => {
    stockInfoRef.value?.init(row.skuId, row.spuMold)
  })
}

</script>

<style lang="scss" scoped>
.mod-stock {
  padding:20px;

  :deep(.el-pagination) {
    text-align: right;
  }

  .operation-bar{
    margin-bottom: 20px;
  }

}

.search-bar {
  padding: 25px 20px 0;
  background-color: #F7F8FA;

  :deep(.input-row) {

    // display: block;
    // 选择器(下拉框)  &  输入框 宽度
    .el-form-item__content .el-select,
    .el-form-item__content .el-input {
      width: 200px;
    }

    // 日期选择器(范围)中间提示
    .el-range-separator {
      line-height: 32px;
    }

    .el-form-item__content .screen{
      width: 110px;

      .el-input{
        width: 110px;
      }
    }
  }

  :deep(.el-form--inline .el-form-item) {
    margin-right: 20px !important;
    margin-bottom: 25px;

    .el-form-item__label-wrap {
      margin-left: unset !important;
    }
  }

}
</style>
