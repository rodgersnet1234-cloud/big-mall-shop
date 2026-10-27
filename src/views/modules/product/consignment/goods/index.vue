<template>
  <div class="goods">
    <!-- 筛选表单 -->
    <div class="form">
      <el-form
        ref="searchFromRef"
        :inline="true"
        :model="searchForm"
        class="demo-form-inline"
        @submit.prevent
      >
        <el-form-item
          label="商品名称："
          prop="spuName"
        >
          <el-input
            v-model.trim="searchForm.spuName"
            placeholder="请输入商品名称"
          />
        </el-form-item>
        <el-form-item
          label="供应商名称："
          prop="supplierName"
        >
          <el-input
            v-model.trim="searchForm.supplierName"
            placeholder="请输入供应商名称"
          />
        </el-form-item>
        <el-form-item
          label="SaaS分类："
          prop="categoryId"
        >
          <el-cascader
            v-model="selectedMenu"
            clearable
            :options="platformCategories"
            :props="platformCategoriesTreeProps"
            @change="handleSelectCategoryChange"
          />
        </el-form-item>
        <el-form-item
          label="品牌："
          prop="brandIds"
        >
          <el-select
            v-model="searchForm.brandIds"
            clearable
            placeholder="请选择品牌"
          >
            <el-option
              v-for="val in brandList"
              :key="val.brandId"
              :label="val.name"
              :value="val.brandId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="状态："
          prop="spuStatus"
        >
          <el-select
            v-model="searchForm.spuStatus"
            placeholder="请选择状态"
          >
            <el-option
              label="全部"
              :value="null"
            />
            <el-option
              label="下架"
              :value="0"
            />
            <el-option
              label="上架"
              :value="1"
            />
            <el-option
              label="平台下架"
              :value="2"
            />
            <el-option
              label="违规下架待审核"
              :value="3"
            />
            <el-option
              label="待审核"
              :value="4"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        @click="onSubmit"
      >
        {{ $t("table.search") }}
      </el-button>
      <el-button
        @click="onResetSearch"
      >
        {{ $t("table.reset") }}
      </el-button>
    </div>

    <!-- 批量操作 -->
    <div class="batchOperation">
      <el-checkbox
        v-model="selectAll"
        :disabled="dataList.length === 0"
        @change="selectAllChange"
      >
        当页全选
      </el-checkbox>
      <span>已选商品 {{ handleSelection.length }}</span>
      <el-button
        :disabled="dataList.length === 0"
        @click="batchExportClick"
      >
        批量导出
      </el-button>
      <el-button
        :disabled="handleSelection.length === 0"
        @click="batchLaunchClick"
      >
        批量上架
      </el-button>
    </div>

    <!--商品表格  -->
    <el-table
      ref="multipleTableRef"
      v-loading="loadingTableData"
      class="table"
      :data="dataList"
      tooltip-effect="dark"
      header-cell-class-name="table-header"
      :empty-text="emptyText"
      @selection-change="onSelectSome"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        label="商品信息"
        width="200"
      >
        <template #default="{row}">
          <div class="prod-info">
            <img-show
              :src="row.mainImgUrl"
              width="60"
              height="60"
            />
            <span style="padding-left: 5px;">
              {{ row.spuName }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="categoryNames"
        label="SaaS分类"
      />
      <el-table-column
        prop="brandName"
        label="品牌"
      >
        <template #default="{row}">
          <span>{{ row.brandName || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="supplierName"
        label="所属供应商"
      >
        <template #default="{row}">
          <span>{{ row.supplierName || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="supplyPriceFee"
        label="供货价"
      >
        <template #default="{row}">
          {{ formatPrice(row.supplyPriceFee, 1) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="spuStatus"
        label="状态"
      >
        <template #default="scope">
          <div v-if="scope.row.spuStatus===-1">
            删除
          </div>
          <div v-if="scope.row.spuStatus===0">
            下架
          </div>
          <div v-if="scope.row.spuStatus===1">
            上架
          </div>
          <div v-if="scope.row.spuStatus===2">
            平台下架
          </div>
          <div v-if="scope.row.spuStatus===3">
            违规下架待审核
          </div>
          <div v-if="scope.row.spuStatus===4">
            待审核
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="200"
      >
        <template
          #default="scope"
        >
          <el-button
            type="primary"
            link
            @click="exidClick(scope.row.spuId)"
          >
            编辑
          </el-button>
          <el-button
            v-if="scope.row.spuStatus===0"
            v-permission="['prod:saleProxyProd:putaway']"
            type="primary"
            link
            @click="putSpuStatus(scope.row,1)"
          >
            上架
          </el-button>
          <el-button
            v-if="scope.row.spuStatus===1"
            v-permission="['prod:saleProxyProd:soldOut']"
            type="primary"
            link
            @click="putSpuStatus(scope.row,0)"
          >
            下架
          </el-button>
          <el-button
            v-permission="['prod:saleProxyProd:delete']"
            type="primary"
            link
            @click="delSpuClick(scope.row.spuId)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-if="pageQuery.total"
      class="pagination"
      :current-page="pageQuery.pageNum"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pageQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageQuery.total"
      @size-change="onPageSizeChange"
      @current-change="onPageChange"
    />
  </div>
</template>

<script setup>
import { formatPrice } from '@/utils'
import * as http from '@/api/consignment/goods'
import { ElMessage, ElMessageBox } from 'element-plus'

// 筛选表单信息
const searchForm = reactive({
  spuName: null,
  supplierName: null,
  categoryId: null,
  brandIds: null,
  spuStatus: null
})
const selectAll = ref(false)
// 表格数据
const dataList = ref([])

// 分页
const pageQuery = reactive({
  pageSize: 10,
  pageNum: 1,
  total: 0
})
// SaaS分类
const platformCategories = ref([])
const platformCategoriesTreeProps = reactive({
  value: 'categoryId',
  label: 'name'
})
const selectedMenu = ref(null)
// 品牌列表
const brandList = ref([])
const handleSelection = ref([])
const loadingTableData = ref(false)
const isSubmit = ref(false)
const emptyText = ref('抱歉，没有搜索到您想要的结果。')

onMounted(() => {
  getTableData()
  getPlatformCategories()
  getBrandList()
})

// 获取SaaS分类
const getPlatformCategories = () => {
  http.getMySigningCategoryList().then((data) => {
    platformCategories.value = treeDataTranslate(data, 'categoryId', 'parentId')
  })
}

// 获取品牌列表
const getBrandList = () => {
  http.getListSigning().then((data) => {
    brandList.value = [...data.customizeBrandList, ...data.platformBrandList]
  })
}

// 获取商品列表
const getTableData = (newData = false) => {
  loadingTableData.value = true
  let tempSearchForm = {}
  emptyText.value = ''
  if (newData) {
    tempSearchForm = { ...searchForm }
    tempSearchForm.keyword = tempSearchForm.spuName
    // 条件搜索 无数据是 更改emptyTyoe 内容
    for (const key in tempSearchForm) {
      if (tempSearchForm[key]) {
        emptyText.value = '暂无数据'
        break
      }
    }
  }
  http.getConsignmentSpu({
    pageSize: pageQuery.pageSize,
    pageNum: pageQuery.pageNum,
    ...tempSearchForm
  }).then(data => {
    dataList.value = data.list
    pageQuery.total = data.total
  }).finally(() => {
    loadingTableData.value = false
  })
  selectAll.value = false
}

// 选择SaaS分类
const handleSelectCategoryChange = (val) => {
  searchForm.categoryId = val[val.length - 1]
}
// 条件查找
const onSubmit = () => {
  pageQuery.pageNum = 1
  getTableData(true)
}
const searchFromRef = ref(null)
// 重置条件查找
const onResetSearch = () => {
  searchFromRef.value.resetFields()
  searchForm.brandIds = null
  selectedMenu.value = null
}

// table 多选商品
const onSelectSome = (e) => {
  handleSelection.value = e
  selectAll.value = dataList.value.length === e.length
}

// table 每页查询数据条数
const onPageSizeChange = (val) => {
  pageQuery.pageSize = val
  pageQuery.pageNum = 1
  getTableData(true)
}

// table 查询第几页
const onPageChange = (val) => {
  pageQuery.pageNum = val
  getTableData(true)
}

const commonStore = useCommonStore()
const router = useRouter()
// 跳转编辑页面
const exidClick = (spuId = null) => {
  /* 判断是否拥有权限 */
  const routeList = commonStore.routeList
  let flag = 0
  routeList.forEach(item => {
    if (item.children) {
      item.children.forEach(el => {
        if (el.path === '/product/manage' && el.children) {
          el.children.forEach(element => {
            if (element.path === 'prod-info') {
              flag = 1
            }
          })
        }
      })
    }
  })
  if (!flag) {
    ElMessage.error('您暂时没有权限访问')
    return
  }
  router.push({
    path: '/product/manage/prod-info',
    query: {
      spuId,
      postingSteps: 2,
      consignment: true
    }
  })
}
// 修改状态
const putSpuStatus = (val, status) => {
  const statusArr = ['下架', '上架']
  ElMessageBox.confirm('确定进行【' + statusArr[status] + '】操作?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (val.isSynUpdate === -1) {
      ElMessage({
        message: '请完善该商品信息',
        type: 'warning'
      })
      return
    }
    http.putSpuStatus({
      spuId: val.spuId,
      status,
      supplierSpuType: 2
    }).then(() => {
      setTimeout(() => {
        getTableData()
        ElMessage.success(statusArr[status] + '成功')
      }, 1000)
    })
  })
}

// 导出数据
const batchExportClick = () => {
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  const spuIds = handleSelection.value.map(e => {
    return e.spuId
  })
  http.getSupplierExcel({ spuIds }).then(data => {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
    const fileName = '代销商品信息.xlsx'
    const elink = document.createElement('a')
    if ('download' in elink) { // 非IE下载
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    } else { // IE10+下载
      navigator.msSaveBlob(blob, fileName)
    }
    ElMessage({
      message: '导出成功',
      type: 'success',
      duration: 1500
    })
  }).finally(() => {
    isSubmit.value = false
  })
}

// 批量上架
const batchLaunchClick = () => {
  const data = {
    status: 1
  }
  const list = handleSelection.value.filter(item => item.isSynUpdate !== -1)
  if (list.length === 0 && handleSelection.value.length) {
    ElMessage({
      message: '请完善该商品信息',
      type: 'warning'
    })
    return
  }
  data.spuIds = list.map(e => {
    return e.spuId
  })
  http.putProdStatus(data).then(() => {
    getTableData()
    ElMessage({
      message: '商品上架成功',
      type: 'success',
      duration: 1500
    })
  })
}

const multipleTableRef = ref(null)
// 全选
const selectAllChange = (e) => {
  if (e) {
    multipleTableRef.value.clearSelection()
    multipleTableRef.value.toggleAllSelection()
  } else {
    multipleTableRef.value.clearSelection()
  }
}

// 删除商品
const delSpuClick = (spuId) => {
  ElMessageBox.confirm('确定要删除商品吗？该商品参与的活动也会因此失效！', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    http.delSpu(spuId).then(() => {
      setTimeout(() => {
        ElMessage.success('删除成功')
        getTableData()
      }, 1000)
    })
  })
}

</script>

<style lang="scss" scoped>
.goods {
  margin: 20px;
  .form {
    background: #F7F8FA;
    padding: 24px;
    border-radius: 3px;
    margin-bottom: 32px;
    margin-left: 0;
  }
  .table {
    margin: 20px 0;
    overflow-x: auto;
    // min-width: 1100px;
    .prod-info {
      display: flex;
      flex-flow: nowrap;
      align-items: center;
      & > span {
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
    }
  }

  .pagination {
    text-align: right;
  }

  .batchOperation {
    font-size: 14px;
    & > span {
      margin: 0 16px;
      color: #666666;
    }
  }
}
</style>
