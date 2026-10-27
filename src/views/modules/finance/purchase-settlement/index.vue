<template>
  <div class="page-purchase-settlement app-container">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        :inline="true"
        :model="searchForm"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item
            label="供应商名称："
          >
            <el-select
              v-model="searchForm.supplierId"
              clearable
              filterable
              remote
              remote-show-suffix
              placeholder="请选择"
              :remote-method="remoteMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in supplierList"
                :key="item.supplierId"
                :label="item.supplierName"
                :value="item.supplierId"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="采购编号:"
          >
            <el-input
              v-model="searchForm.purchaseOrderId"
              oninput="value=value.replace(/[^0-9]/g,'')"
              placeholder="采购编号"
              clearable
              :maxlength="50"
              @change="changeNumber(searchForm)"
            />
          </el-form-item>
          <el-form-item
            label="时间范围："
            class="date-range-param"
          >
            <el-select
              v-model="datePickerType"
              class="date-picker-type"
              style="width: 120px"
              @change="setdatePickerType(datePickerType)"
            >
              <el-option
                v-for="item in datePickerTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-date-picker
              v-model="dateRangeParam"
              :type="datePickerType"
              :format="datePickerType === 'daterange' ? 'YYYY-MM-DD' : 'YYYY-MM'"
              value-format="YYYY-MM-DD HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="defaultTime"
              @change="handleMonthRangeChange"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSearch(true)"
            >
              {{ $t("table.search") }}
            </el-button>
            <el-button
              @click="onResetSearch()"
            >
              {{ $t("table.reset") }}
            </el-button>
            <el-button
              v-permission="['shop:purchaseAmountLog:export']"
              type="primary"
              @click="exportExcel()"
            >
              导出
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <!-- 金额相关 -->
    <div class="head">
      <div class="head-item">
        <div class="text">
          <span>采购支出金额(元)</span>
          <el-tooltip
            class="item"
            effect="dark"
            content="商家线下采购供应商商品所支付的金额"
            placement="right"
          >
            <span>
              <el-icon><QuestionFilled /></el-icon>
            </span>
          </el-tooltip>
        </div>
        <div class="balance">
          <span style="margin-right:30px">{{ price(totalPurchaseAmount) }}</span>
        </div>
      </div>
      <div class="head-item">
        <div class="text">
          <span>采购作废金额(元)</span>
          <el-tooltip
            class="item"
            effect="dark"
            content="商家作废采购订单及商品时所对应的商品金额"
            placement="right"
          >
            <span>
              <el-icon><QuestionFilled /></el-icon>
            </span>
          </el-tooltip>
        </div>
        <div class="balance">
          <span style="margin-right:30px">{{ price(totalCancelAmount) }}</span>
        </div>
      </div>
    </div>

    <!-- 列表相关区域 -->
    <div class="main-content">
      <div class="table-con">
        <el-table
          v-loading="pageLoading"
          :data="pageVO.list"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="80"
          />
          <!--(-1:采购作废金额, 0:采购收入|支出金额)-->
          <el-table-column
            label="金额类型"
            prop="purchaseAmountType"
            align="center"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{
                row.purchaseAmountType === -1 ? '采购作废金额'
                :
                row.purchaseAmountType === 0 ? '采购支出金额' : '采购收入金额'
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="供应商名称"
            prop="supplierName"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.supplierName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="改变金额"
            prop="changeAmount"
            align="center"
          >
            <template #default="{row}">
              <span>{{ '￥' + price(row.changeAmount) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="采购编号"
            prop="purchaseOrderId"
            align="center"
          />
          <el-table-column
            label="采购金额"
            prop="purchaseTotalAmount"
            align="center"
          >
            <template #default="{row}">
              <span>{{ '￥' + price(row.purchaseTotalAmount) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="商品数量"
            prop="prodCount"
            align="center"
          />
          <el-table-column
            label="创建时间"
            prop="createTime"
            align="center"
          />

          <el-table-column
            label="操作"
            align="center"
            width="230"
            class-name="small-padding fixed-width"
          >
            <template #default="{row}">
              <div class="table-btn-con">
                <el-button
                  v-permission="['inventory:purchaseOrder:detail']"
                  type="primary"
                  link
                  @click="toNoticeDetail(row.purchaseOrderId)"
                >
                  详情
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页条 -->
    <el-pagination
      :current-page="pageQuery.pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageQuery.pageSize"
      :total="pageQuery.total"
      layout="total, sizes, prev, pager, next, jumper"
      style="justify-content: flex-end;"
      @update:page-size="onPageSizeChange"
      @update:current-page="onPageChange"
    />
  </div>
</template>

<script setup>
import moment from 'moment'
import { ElMessageBox } from 'element-plus'
import * as api from '@/api/finance/purchase-settlement'
import Big from 'big.js'
import { checkPermission } from '@/directive/permission/index.js'
import { useIncludeRouterName } from '@/stores/modules/include-router-name.js'
import { getParseTime } from '@/utils/datetime.js'
const vPermission = checkPermission
const router = useRouter()
const price = (value) => {
  if (value) {
    return new Big(value).div(100).toFixed(2)
  }
  return 0
}

const datePickerType = ref('daterange') // 日期筛选类型
const dateRangeParam = ref([])
const defaultTime = ref([
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59)
])
const datePickerTypeOptions = ref([
  {
    label: '日期范围',
    value: 'daterange'
  },
  {
    label: '月份范围',
    value: 'monthrange'
  }
])
const setdatePickerType = (val) => {
  datePickerType.value = val
  dateRangeParam.value = []
}

onMounted(() => {
  setDateRange()
  getSupplierList()
})

/**
 * 根据选项设置时间 近30天
 */
const setDateRange = () => {
  // 开始时间
  const startTime = moment().add(-30, 'days').startOf('days').format('LL')
  // 结束时间
  const endTime = moment().add(0, 'days').endOf('days').format('LL')
  dateRangeParam.value = [startTime, endTime]
  searchForm.startTime = startTime
  searchForm.endTime = endTime
  getTotalAmount()
  getPage()
}

const tempSearchForm = ref(null)
const pageLoading = ref(true)
// 查询的参数
const pageQuery = reactive({
  total: 0,
  pageSize: 10,
  pageNum: 1,
  startTime: '',
  endTime: ''
})
// 返回参数
const pageVO = ref({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
// 查询参数
const searchForm = reactive({
  supplierId: null,
  startTime: '',
  endTime: '',
  purchaseOrderId: ''
})
/**
 * 采购编号输入限制 number
 * @param data
 */
const changeNumber = (data) => {
  const numReg = /^([0-9]|[1-9]\d+)(\.\d*)?$/
  if (numReg.test(data.purchaseOrderId)) {
    searchForm.purchaseOrderId = data.purchaseOrderId
  } else {
    searchForm.purchaseOrderId = null
  }
}
/**
 * 获取表单
 */
const getPage = (newData = false) => {
  if (newData || !tempSearchForm.value) {
    tempSearchForm.value = { ...pageQuery, ...searchForm }
  } else {
    tempSearchForm.value.pageNum = pageQuery.pageNum
    tempSearchForm.value.pageSize = pageQuery.pageSize
  }
  pageLoading.value = true
  api.page(tempSearchForm.value)
    .then(pageVOs => {
      pageQuery.total = pageVOs.total
      pageVO.value = pageVOs
      pageLoading.value = false
    })
    .catch(() => {
      pageLoading.value = false
    })
}

const totalPurchaseAmount = ref(0) // 总采购收入/支出金额
const totalCancelAmount = ref(0) // 总采购作废金额
/**
 * 获取采购总金额数据
 */
const getTotalAmount = () => {
  api.getTotalAmount(searchForm).then((data) => {
    totalPurchaseAmount.value = data.totalPurchaseAmount
    totalCancelAmount.value = data.totalCancelAmount
  })
}
/**
 * 每页数
 */
const onPageSizeChange = (val) => {
  pageQuery.pageSize = val
  pageQuery.pageNum = 1
  getPage()
}
/**
 * 当前页
 */
const onPageChange = (val) => {
  pageQuery.pageNum = val
  getPage()
}
/**
 * 清空搜索
 */
const onResetSearch = () => {
  pageQuery.pageNum = 1
  searchForm.supplierId = null
  searchForm.startTime = ''
  searchForm.endTime = ''
  searchForm.purchaseOrderId = ''
  dateRangeParam.value = []
}

/**
 * 检索
 */
const onSearch = (newData = false) => {
  searchForm.startTime = dateRangeParam.value ? dateRangeParam.value[0] : ''
  searchForm.endTime = dateRangeParam.value ? dateRangeParam.value[1] : ''
  pageQuery.pageNum = 1
  getPage(newData)
  getTotalAmount()
}

/**
 * 详情
 */
const toNoticeDetail = (id, view = true) => {
  router.push({
    path: '/purchase-manage/purchase-order-create',
    query: {
      purchaseOrderId: id,
      view
    }
  })
}

const loading = ref(false)
const supplierList = ref(null)
let supplierListDefaul = null
/**
 * 选择筛选
 */
const remoteMethod = (val) => {
  loading.value = true
  if (val) {
    supplierList.value = supplierListDefaul.filter((item) => {
      return item.supplierName.includes(val)
    })
    loading.value = false
    return
  }
  supplierList.value = supplierListDefaul
  loading.value = false
}
/**
 * 获取供应商列表
 */
const getSupplierList = () => {
  api.getSupplierList().then((data) => {
    supplierListDefaul = data
    supplierList.value = data
  })
}

const exportExcel = () => {
  ElMessageBox.confirm('是否导出采购结算信息？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    api.exportExcel(searchForm).then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
      const fileName = '采购结算信息.xlsx'
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
    })
  })
}

/**
 * 处理结束月份，获取月份最后一天
 * @param value
 */
const handleMonthRangeChange = (value) => {
  if (datePickerType.value !== 'monthrange') return
  if (value && value.length === 2) {
    const endDate = new Date(value[1])
    // 设置结束月份的最后一天
    endDate.setMonth(endDate.getMonth() + 1, 0)
    // 更新结束月份的最后一天
    dateRangeParam.value[1] = getParseTime(endDate.getTime())
  }
}

const includeRouterName = useIncludeRouterName()
// 列表页跳往详情页，页面会缓存
onBeforeRouteLeave((to, from, next) => {
  if (to.path === '/purchase-manage/purchase-order-create') {
    includeRouterName.addData(['PurchaseSettlement'])
  } else {
    includeRouterName.addData([])
  }
  next()
})
</script>

<script>
export default {
  name: 'PurchaseSettlement'
}
</script>

<style lang="scss" scoped>
.app-container {
  :deep(.main-content.top-distance) {
    padding-top: 0;
  }
  .search-bar {
    margin-bottom: 20px;
    :deep(.date-picker-type .el-input--suffix) {
      width: 120px !important;
    }
  }
  .head {
    background: #F5F5F5;
    height: 130px;
    padding: 20px;
    display: flex;
    justify-content: space-around;
    .head-item {
      text-align: center;
      height: 100%;
      width: 230px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .balance {
        font-size: 22px;
        font-weight: bold;
      }
    }
  }
}
</style>
