<template>
  <div class="prod-supplier-compenont">
    <div class="search-bar">
      <el-form
        :inline="true"
        @submit.prevent
      >
        <div class="input-row">
          <!-- 商品名称 -->
          <el-form-item
            label="商品名称:"
            class="item"
          >
            <el-input
              v-model="content.keyword"
              class="input"
              placeholder="请输入商品名称"
              maxlength="80"
              clearable
            />
          </el-form-item>
          <!-- 商品名称 -->
          <el-form-item
            label="供应商名称:"
            class="item"
          >
            <el-input
              v-model="content.supplierName"
              class="input"
              placeholder="请输入供应商名称"
              maxlength="80"
              clearable
            />
          </el-form-item>
          <el-form-item
            label="SaaS分类:"
            class="item"
          >
            <el-cascader
              v-model="selectedPlatformCategories"
              class="input"
              clearable
              expand-trigger="hover"
              :options="platformCategories"
              :props="platformCategoriesTreeProps"
              change-on-select
              @change="handlePlatformCategoryChange"
            />
          </el-form-item>
          <el-form-item
            label="是否导入:"
            class="item"
          >
            <el-select
              v-model="content.isCommission"
              placeholder="请选择"
              class="input"
              clearable
              expand-trigger="hover"
              change-on-select
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

          <!-- 查询按钮 -->
          <div class="btn-row">
            <el-button
              type="primary"
              @click="conditionSearch(true)"
            >
              搜索
            </el-button>
            <el-button
              @click="reset"
            >
              重置
            </el-button>
          </div>
        </div>
      </el-form>
    </div>
    <!-- 全选 -->
    <div class="all">
      <el-checkbox
        v-model="isSelectedAll"
        :indeterminate="isIndeterminate"
        class="all-check-btn"
        @change="handleSelectAll"
      >
        当页全选
      </el-checkbox>
      <span>已选商品 {{ checkedCount }}</span>
      <el-button
        @click="changeProdStatus('import')"
      >
        批量导入
      </el-button>
      <el-button
        @click="changeProdStatus('prodSale')"
      >
        批量上架
      </el-button>
    </div>
    <!-- 商品展示表格 -->
    <div class="table-con">
      <el-table
        ref="prodListTableRef"
        header-cell-class-name="table-header"
        :data="pageVO.list"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          align="center"
          width="45"
        />
        <el-table-column
          label="商品信息"
          prop="spuName"
          width="360"
        >
          <template #default="{ row }">
            <div class="table-cell-con">
              <div class="table-cell-image">
                <ImgShow
                  :src="row.mainImgUrl"
                  :img-style="{width:'60px',height:'60px'}"
                />
              </div>
              <div class="text">
                {{ row.spuName }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          min-width="150"
          align="left"
          prop="categoryNames"
          label="SaaS分类"
        />
        <el-table-column
          align="left"
          prop="supplierName"
          label="所属供应商"
          min-width="100"
        />
        <el-table-column
          align="left"
          prop="priceFee"
          label="供货价"
        >
          <template #default="{row}">
            {{ zeroize(row.priceFee) }}
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="spuStatus"
          label="供应商品状态"
          min-width="120"
        >
          <template #default="{row}">
            <div v-if="row.spuStatus===-1">
              删除
            </div>
            <div v-if="row.spuStatus===0">
              下架
            </div>
            <div v-if="row.spuStatus===1">
              上架
            </div>
            <div v-if="row.spuStatus===2">
              平台下架
            </div>
            <div v-if="row.spuStatus===3">
              等待审核
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          label="操作"
        >
          <template #default="{row}">
            <el-button
              v-if="row.isCommission==1"
              type="primary"
              link
              @click="next(row.commissionSpuId)"
            >
              编辑
            </el-button>
            <el-button
              v-if="row.isCommission==1&&row.isPut===0"
              type="primary"
              link
              @click="prodSale(row)"
            >
              上架
            </el-button>
            <el-button
              v-if="row.isCommission==1&&row.isPut===1"
              type="primary"
              link
              @click="prodSale(row,0)"
            >
              下架
            </el-button>
            <el-button
              v-if="row.isCommission==0"
              type="primary"
              link
              @click="onViewSupplierSpuInfo(row.spuId)"
            >
              查看
            </el-button>
            <el-button
              v-if="row.isCommission==0"
              type="primary"
              link
              @click="importSupplierSpu(row.spuId)"
            >
              导入
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-show="pageVO.total>0"
        class="pagination"
        :page-sizes="[10, 20, 30, 50]"
        :current-page="page.pageNum"
        :page-size="page.pageSize"
        :total="pageVO.total"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
      />
    </div>
  </div>
</template>

<script setup>
import * as api from '@/api/product/list'
import * as categoryApi from '@/api/product/category'
import { postImportSupplierSpu } from '@/api/product/prod-info'
import { treeDataTranslate } from '@/utils'
import { updateProdStatus } from '@/api/product/list'
import { Debounce } from '@/utils/debounce'
import { ElMessage } from 'element-plus'

const { postingStepsChange } = inject('prodData')

const Data = reactive({
  theData: null,
  page: {
    pageNum: 1, // 当前页
    pageSize: 10 // 每页大小
  },
  content: {
    isCommission: '', // 是否导入
    keyword: '', // 商品名
    supplierName: '', // 供应商名称
    primaryCategoryId: '', // 一级分类id
    brandIds: '', // 品牌id
    spuStatus: null // 商品状态 -1:删除, 0:下架, 1:上架, 2:平台下架, 3: 等待审核
  },

  selectedPlatformCategories: [],
  platformCategories: [], // SaaS分类
  platformCategoriesTreeProps: {
    value: 'categoryId',
    label: 'name'
  },

  pageLoading: true,

  pageVO: {
    list: [], // 返回的列表
    total: 0, // 一共多少条数据
    pages: 0 // 一共多少页
  },
  isIndeterminate: false,
  checkedCount: 0, // 选中的数量
  selectedProdList: [], // 被选中的商品列表
  isSelectedAll: false, // 是否全选
  submit: false
})

const { page, content, pageVO, selectedPlatformCategories, platformCategories, platformCategoriesTreeProps, isIndeterminate, checkedCount, isSelectedAll } = toRefs(Data)

onMounted(() => {
  getDataList()
  getPlatformCategories()
})

const zeroize = (value) => {
  return value ? value.toFixed(2) : '0.00'
}

// 获取商品列表
const getDataList = (newData = false) => {
  if (newData || !Data.theData) {
    Data.theData = { ...Data.page, ...Data.content }
  } else {
    Data.theData.pageNum = Data.page.pageNum
    Data.theData.pageSize = Data.page.pageSize
  }
  if (Data.theData.brandIds) Data.theData.brandIds = Data.theData.brandIds.join()
  api.pageSupplySpu(Data.theData).then(data => {
    data.list = data.list || []
    Data.pageVO.list = data.list
    Data.pageVO.list.forEach(item => {
      item.supplyPriceFee = formatPrice(item.supplyPriceFee, 1)
      item.priceFee = formatPrice(item.priceFee, 1)
    })
    Data.pageVO.total = data.total
  })
}

/**
 * 获取SaaS分类
 */
const getPlatformCategories = () => {
  Data.pageLoading = true
  categoryApi.getMySigningCategoryList().then(pageVO => {
    // categoryApi.enableCategories({ shopId: 0 }).then(pageVO => {
    Data.platformCategories = treeDataTranslate(pageVO, 'categoryId', 'parentId')
    Data.platformCategories = removeNotThirdCategoryItem(Data.platformCategories)
    Data.pageLoading = false
  }).catch(() => {
    Data.pageLoading = false
  })
}

/**
 * 去除没有三级分类的类目
 */
const removeNotThirdCategoryItem = (treeData) => {
  const firstCategory = treeData
  const length = firstCategory.length
  for (let i = 0, index = 0; i < length; i++) {
    if (firstCategory[index].level !== 2) {
      if (firstCategory[index].children && firstCategory[index].children.length > 0 && (firstCategory[index].children.some(item => item.children) || firstCategory[index].level !== 0)) {
        const secondCategory = firstCategory[index].children
        firstCategory[index].children = removeNotThirdCategoryItem(secondCategory)
      } else {
        firstCategory.splice(index, 1)
        // 当前位置的元素已经被删除，当前位置索引不用++
        continue
      }
    }
    index++
  }
  return firstCategory
}
/**
 * 监听SaaS分类选择变化
 */
const handlePlatformCategoryChange = (val) => {
  Data.content.primaryCategoryId = undefined
  Data.content.secondaryCategoryId = undefined
  Data.content.categoryId = undefined
  if (val.length === 1) { // 长度为1，表明当前选择的是一级分类（点击了一级分类）
    Data.content.primaryCategoryId = val[0] // 平台一级分类id
  } else if (val.length === 2) { // 长度为2，表明当前选择的是二级分类（点击了二级分类）
    Data.content.secondaryCategoryId = val[1] // 平台二级分类id
  } else if (val.length === 3) { // 长度为3，表明当前选择的是三级分类（点击了三级分类）
    Data.content.categoryId = val[2] // 平台三级分类id
  }
}

// 条件搜索
const conditionSearch = (newData = false) => {
  Data.page.pageNum = 1

  getDataList(newData)
}

// 每页数
const sizeChangeHandle = (val) => {
  Data.page.pageSize = val
  Data.page.pageNum = 1
  getDataList()
}

// 当前页
const currentChangeHandle = (val) => {
  Data.page.pageNum = val
  getDataList()
}

const reset = () => {
  Data.content = {
    isCommission: null, // 是否导入 0:否, 1:是
    keyword: '', // 商品名
    supplierName: '', // 供应商名称
    primaryCategoryId: '', // 一级分类id
    brandIds: '', // 品牌id
    spuStatus: null // 商品状态 -1:删除, 0:下架, 1:上架, 2:平台下架, 3: 等待审核
  }
  Data.selectedPlatformCategories = []
}

const prodListTableRef = ref(null)
/**
 * 全选按钮
 */
const handleSelectAll = () => {
  Data.isSelectedAll = Data.selectedProdList.length < Data.pageVO.list.length
  prodListTableRef.value.toggleAllSelection()
}

/**
 * 监听表格选中
 */
const handleSelectionChange = (val) => {
  Data.selectedProdList = val
  Data.checkedCount = val.length
  Data.isSelectedAll = val.length === Data.pageVO.list.length
}

// 编辑
const next = (spuId) => {
  postingStepsChange(2, spuId)
}

// 导入
const importSupplierSpu = Debounce((ids) => {
  if (Data.submit) {
    return
  }
  Data.submit = true
  const param = []
  if (typeof (ids) === 'number') {
    param.push(ids)
  } else {
    const arr = ids.filter(item => item.isCommission === 0)

    arr.forEach((item) => {
      param.push(item.spuId)
    })
  }
  if (param.length === 0) {
    return
  }

  postImportSupplierSpu(param).then(() => {
    ElMessage({
      message: '请完善已导入的商品信息',
      type: 'success',
      duration: 1500,
      onClose: () => getDataList()
    })
  }).finally(() => {
    Data.submit = false
  })
}, 1000)

// 改变商品状态
// onTheShelf:上架
// offTheShelf:下架
const changeProdStatus = (status) => {
  // 如果没选商品，提示选择商品
  if (Data.selectedProdList.length <= 0) {
    ElMessage({
      message: '请选择商品',
      type: 'warning'
    })
    return
  }

  if (status === 'import') {
    importSupplierSpu(Data.selectedProdList)
  } else if (status === 'prodSale') {
    prodSale(Data.selectedProdList)
  }
}

// 商品上架
const prodSale = (spuIdOrSpuIds, status = 1) => {
  // 是否操作单个商品
  const isSingle = !spuIdOrSpuIds.length
  // 过滤未导入商品
  if (!isSingle) {
    let arr = []
    arr = spuIdOrSpuIds.filter(item => !(item.isCommission === 1 && item.isSynUpdate !== -1))
    if (arr.length > 0) {
      ElMessage({
        message: '商品' + arr[0].spuName + '不能进行上架操作',
        type: 'warning'
      })
      return
    }
    if (spuIdOrSpuIds.length === 0) {
      ElMessage({
        message: '请选择已导入的商品',
        type: 'warning'
      })
      return
    }
  } else {
    if ((spuIdOrSpuIds.isSynUpdate === -1 || spuIdOrSpuIds.isSynUpdate === 0) && status === 1) {
      ElMessage({
        message: '请完善该商品信息',
        type: 'warning'
      })
      return
    }
  }

  const param = {
    isCommission: 1,
    status,
    spuId: isSingle ? spuIdOrSpuIds.commissionSpuId : undefined,
    spuIds: isSingle ? undefined : spuIdOrSpuIds.map(item => { return item.commissionSpuId })
  }

  updateProdStatus(param).then(() => {
    ElMessage({
      message: status === 1 ? '商品上架成功' : '商品下架成功',
      type: 'success',
      duration: 1500,
      onClose: () => getDataList()
    })
  })
}

/**
 * 查看供应商商品详情
 */
const onViewSupplierSpuInfo = (spuId) => {
  postingStepsChange(2, spuId, true)
}

defineExpose({
  next
})
</script>

<style scoped lang="scss">

.prod-supplier-compenont{
  margin-top: 20px;

  .input-row{
    padding-bottom: 20px;

  }
  .all{
    margin-top: 32px;
    margin-left: 20px;
    width: 388px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .table-con{
    margin-top: 20px;

    .table-cell-con{
      display: flex;
      align-items: center;
      .table-cell-image{
        flex-shrink: 0;
      }
      .text{
        margin-left: 12px;
        margin-right: 80px;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        word-break: break-all;
        line-break: anywhere;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }

  .btn-row{
    :deep(.el-button){
      margin-right: 15px;
    }
  }

  .all-check-btn {
    margin-left: -3px;
  }

  :deep(.input){
    width: 200px;
  }
  :deep(.item){
    margin-right: 24px;
  }
  :deep(.el-button){
    margin-left:0 ;
  }
  :deep(.el-button + .el-button) {
    margin-right: 0;
  }
  :deep(.pagination){
    margin-top:25px ;
  }
}

</style>
