<template>
  <el-dialog
    v-model="visible"
    :title="$t('product.chooseSupplier')"
    top="100px"
    :close-on-click-modal="false"
    width="914px"
    class="component-supplier-select"
  >
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
    <el-form
      :inline="true"
      :model="dataForm"
      class="demo-form-inline"
      size="small"
      @submit.prevent
    >
      <el-form-item :label="$t('shop.supplierName')">
        <el-input
          v-model="supplierName"
          :placeholder="$t('shop.supplierName')"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="searchProd"
        >
          搜索
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="clean">
          {{ $t("shop.resetMap") }}
        </el-button>
      </el-form-item>
    </el-form>

    <div class="table-con supplier-list-con">
      <el-table
        ref="prodTableRef"
        v-loading="dataListLoading"
        :data="dataList"
        header-cell-class-name="table-header"
        row-class-name="supplier-table-row"
        style="width: 100%;"
        max-height="366"
      >
        <el-table-column
          v-if="isSingle"
          width="50"
          align="left"
        >
          <template #default="scope">
            <div>
              <!-- native modifier has been removed, please confirm whether the function has been affected  -->
              <el-radio
                v-model="singleSelectSupplierId"
                :label="scope.row.supplierId"
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
          align="left"
          width="50"
        />
        <el-table-column
          prop="supplierName"
          align="left"
          :label="$t('shop.supplierName')"
          width="230"
        />
        <!-- <el-table-column prop="tel" align="left" :label="$t('shop.tel')" width="180"></el-table-column> -->
        <el-table-column
          prop="contactName"
          align="left"
          :label="$t('shop.contactName')"
          width="160"
        />
        <el-table-column
          prop="contactPhone"
          align="left"
          :label="$t('shop.contactTel')"
          width="160"
        />
        <!-- <el-table-column align="left" label="$t('product.status')">
          <template slot-scope="scope">
            <span v-if="scope.row.supplierStatus === -1" class="tag-text">已删除</span>
            <span v-if="scope.row.supplierStatus === 0" class="tag-text">停业中</span>
            <span v-if="scope.row.supplierStatus === 1" class="tag-text">营业中</span>
            <span v-if="scope.row.supplierStatus === 2" class="tag-text">平台下线</span>
            <span v-if="scope.row.supplierStatus === 3" class="tag-text">开店待审核</span>
            <span v-if="scope.row.supplierStatus === 4" class="tag-text">开店申请中</span>
            <span v-if="scope.row.supplierStatus === 5" class="tag-text">上线待审核</span>
          </template>
        </el-table-column> -->
        <el-table-column
          align="left"
          prop="email"
          label="联系邮箱"
        />
      </el-table>
    </div>
    <el-pagination
      class="pagination"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
    />
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
import http from '@/utils/request'

const emit = defineEmits(['refreshSelectSupplier'])
const visible = ref(false)
const dataForm = reactive({
  supplier: ''
})
const singleSelectSupplierId = ref(0)
const selectProds = ref([])
const dataList = ref([])
const supplierName = ref('')
const shopCategoryId = ref(null)
const pageIndex = ref(1)
const pageSize = ref(10)
const totalPage = ref(0)
const dataListLoading = ref(false)
const dataListSelections = ref([])
defineProps({
  isSingle: {
    default: false,
    type: Boolean
  },
  dataUrl: {
    default: '/supplier/supplier/page',
    type: String
  }
})

onActivated(() => {
  getDataList()
})

// 获取数据列表
const init = (prods) => {
  singleSelectSupplierId.value = 0
  selectProds.value = prods
  visible.value = true
  dataListLoading.value = true
  if (selectProds.value) {
    selectProds.value.forEach(row => {
      dataListSelections.value.push(row)
    })
  }
  getDataList()
}
const prodTableRef = ref(null)
const getDataList = (newData = false) => {
  let search = {}
  if (newData) {
    search = {
      supplierName
    }
  }
  http({
    url: 'mall4cloud_admin/m/supplier_detail/page_supplier',
    method: 'get',
    params: {
      pageSize,
      pageNum: pageIndex,
      ...search
    }
  }).then(data => {
    dataList.value = data.list
    totalPage.value = data.total
    testSuppliers()
    dataListLoading.value = false
    if (selectProds.value) {
      nextTick(() => {
        selectProds.value.forEach(row => {
          const index = dataList.value.findIndex((prodItem) => prodItem.supplierId === row.supplierId)
          prodTableRef.value.toggleRowSelection(dataList.value[index])
        })
      })
    }
  })
}
// 去除处于禁用状态的的供应商
const testSuppliers = () => {
  const suppliersTest = dataList
  const supplierNum = totalPage
  for (let i = 0; i < suppliersTest.value.length; i++) {
    if (suppliersTest[i].status === 0) {
      suppliersTest.value.splice(i, 1)
      supplierNum.value = supplierNum.value - 1
    }
  }
  totalPage.value = supplierNum
  dataList.value = suppliersTest
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
// 单选商品事件
const getSelectProdRow = (row) => {
  dataListSelections.value = [row]
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
  supplierName.value = ''
  shopCategoryId.value = null
}
// 确定事件
const submitProds = () => {
  const suppliers = []
  dataListSelections.value.forEach(item => {
    const supplierIndex = suppliers.findIndex((supplier) => supplier.supplierId === item.supplierId)
    if (supplierIndex === -1) {
      suppliers.push(
        {
          supplierId: item.supplierId,
          supplierName: item.supplierName,
          isDefault: item.isDefault
        }
      )
    }
  })
  emit('refreshSelectSupplier', suppliers)
  dataListSelections.value = []
  selectProds.value = []
  visible.value = false
}
defineExpose({ init })
</script>
<style lang="scss" scoped>
.component-supplier-select {
  .supplier-list-con {
    margin-bottom: 20px;
  }
}
.pagination{
  text-align: right;
}
</style>
