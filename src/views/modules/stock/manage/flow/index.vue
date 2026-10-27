<template>
  <div class="page-stock-manage-flow">
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        class="search-form"
        :model="searchForm"
        label-width="auto"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item :label="$t('stock.productFilter') + ':'">
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
              type="text"
              :placeholder="prodKeyArr[searchForm.prodKeyType - 1].inputTips"
            />
          </el-form-item>
          <el-form-item
            prop="businessDetailTypeId"
            :label="$t('stock.stockBillType') + ':'"
          >
            <el-select
              v-model="searchForm.stockBillType"
              clearable
              :placeholder="$t('tip.select')"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            prop="stockPointName"
            :label="'库存点:'"
          >
            <el-input
              v-model="searchForm.stockPointName"
              type="text"
              clearable
              :placeholder="'请输入库存点'"
            />
          </el-form-item>
          <el-form-item
            prop="stockBillNo"
            :label="$t('stock.stockBillNo') + ':'"
          >
            <el-input
              v-model="searchForm.stockBillNo"
              type="text"
              clearable
              :placeholder="$t('stock.pleaseStockBillNo')"
            />
          </el-form-item>
          <el-form-item
            prop="sourceOrderNo"
            :label="$t('stock.sourceOrderNo') + ':'"
          >
            <el-input
              v-model="searchForm.sourceOrderNo"
              type="text"
              clearable
              :placeholder="$t('stock.pleaseSourceOrderNo')"
            />
          </el-form-item>
          <el-form-item :label="$t('stock.maker') + ':'">
            <el-select
              v-model="searchForm.makerMobile"
              clearable
            >
              <el-option
                v-for="node in employeeList"
                :key="node.shopUserId"
                :label="node.nickName"
                :value="node.phoneNum"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('stock.createOrderTime') + ':'"
          >
            <el-date-picker
              v-model="createDateRange"
              class="date-picker"
              type="datetimerange"
              :range-separator="$t('date.tip')"
              value-format="YYYY-MM-DD HH:mm:ss"
              :start-placeholder="$t('date.start')"
              :end-placeholder="$t('date.end')"
              :default-time="defaultTime"
              @change="createTimeChange"
            />
            <div
              class="select-time-btn"
              :class="{ 'is-active': createTimeActive === 1 }"
              @click="setDateRange(1)"
            >
              {{ $t("date.t") }}
            </div>
            <div
              class="select-time-btn"
              :class="{ 'is-active': createTimeActive === 2 }"
              @click="setDateRange(2)"
            >
              {{ $t("date.y") }}
            </div>
            <div
              class="select-time-btn"
              :class="{ 'is-active': createTimeActive === 3 }"
              @click="setDateRange(3)"
            >
              {{ $t("date.n") }}
            </div>
            <div
              class="select-time-btn"
              :class="{ 'is-active': createTimeActive === 4 }"
              @click="setDateRange(4)"
            >
              {{ $t("date.m") }}
            </div>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              @click="onSearch(true)"
            >
              {{ $t('table.search') }}
            </el-button>
            <el-button @click="onResetSearch('searchForm')">
              {{ $t('shop.resetMap') }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="container">
      <div class="operation-bar">
        <el-button
          v-permission="['multishop:stockFlow:export']"
          @click="getExportExcel()"
        >
          导出
        </el-button>
      </div>
      <div class="table-con">
        <el-table
          ref="dataListRef"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
          @selection-change="onSelectSome"
        >
          <el-table-column
            type="selection"
            align="center"
            fixed="left"
            width="55"
          />
          <el-table-column
            :label="$t('stock.stockBillNo')"
            prop="stockBillLogId"
            align="left"
            width="190"
          >
            <template #default="scope">
              <span class="table-cell-text line-clamp-one">{{ scope.row.stockBillNo }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('stock.sourceOrderNo')"
            prop="sourceOrderNo"
            align="left"
            width="180"
          >
            <template #default="scope">
              <span class="table-cell-text line-clamp-one">{{ scope.row.sourceOrderNo || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('stock.createOrderTime')"
            prop="createTime"
            align="left"
            width="160"
          >
            <template #default="scope">
              <span class="table-cell-text line-clamp-one">{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('stock.stockBillType')"
            prop="stockBillType"
            align="left"
            width="120"
          >
            <template #default="scope">
              <span class="table-cell-text line-clamp-one">{{ [
                $t('stock.all'),
                $t('stock.purchaseInStock'),
                $t('stock.returnToStorage'),
                $t('stock.otherEntries'),
                $t('stock.sellOut'),
                $t('stock.editOutBound'),
                $t('stock.otherOutbound'),
                $t('stock.inventoryInitialization'),
                $t('stock.orderCancelled'),
                $t('stock.editStorage'),
                $t('stock.profitStorage'),
                $t('stock.lossOutBound'),
                '调拨入库',
                '调拨出库',
                '库存模式切换出库',
                '库存模式切换入库',
                '秒杀补充库存',
                '卡券过期'
              ][scope.row.stockBillType]
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="商品名称"
            prop="spuName"
            align="left"
            width="300"
          >
            <template #default="scope">
              <el-tooltip
                class="table-cell-text"
                placement="top"
                effect="light"
              >
                <template #content>
                  <div>{{ scope.row.spuName }}<br>{{ scope.row.skuName }}</div>
                </template>
                <span>
                  {{ scope.row.spuName }}
                  <span v-if="scope.row.skuName">{{ scope.row.skuName }}</span>
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('product.commodityCode')"
            prop="partyCode"
            width="200"
          >
            <template #default="scope">
              <div class="table-cell-text">
                {{ scope.row.partyCode }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('stock.outInStock')"
            prop="totalCount"
            align="left"
          >
            <template #default="scope">
              <span class="table-cell-text line-clamp-one">{{ scope.row.type === 1 ? '-' : '+' }}{{
                scope.row.stockCount }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="库存点名称"
            prop="stockPointName"
            width="200"
          >
            <template #default="scope">
              {{ scope.row.stockPointName || '-' }}
            </template>
          </el-table-column>
          <el-table-column
            label="库存点类型"
            width="100"
          >
            <template #default="scope">
              {{ ['', '仓库', '门店'][scope.row.stockPointType] || '-' }}
            </template>
          </el-table-column>
          <el-table-column
            width="120"
            label="制单人"
            prop="makerName"
            align="left"
          >
            <template #default="scope">
              <span class="table-cell-text line-clamp-one">{{ scope.row.makerName || '-' }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        :current-page="page.currentPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="page.pageSize"
        :total="page.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
      />
    </div>
    <!-- 导出 -->
    <el-dialog
      v-model="exportStockFlowVisible"
      title="导出"
    >
      <el-radio
        v-model="exportRadio"
        :label="1"
      >
        {{ $t('stock.exportOfSearchFlow') }}
      </el-radio>
      <el-radio
        v-model="exportRadio"
        :label="2"
      >
        {{ $t('stock.exportOfSelectFlow') }}
      </el-radio>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            @click="exportStockFlowVisible = false"
          >{{ $t('table.cancel') }}</el-button>
          <el-button
            type="primary"
            @click="confirmExport"
          >{{ $t('table.confirm') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import moment from 'moment'
import http from '@/utils/request.js'
import httpExcel from '@/utils/excel-request.js'
import qs from 'qs'
import { ElMessage } from 'element-plus'
const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59)
]
let tempSearchForm = null // 保存上次点击查询的请求条件

const createTimeActive = ref(0)
const dataList = ref([])
const employeeList = ref([]) // 员工列表
const exportStockFlowVisible = ref(false) // 导出弹窗是否可见
const exportRadio = ref(1) //  1 按搜索条件导出 2 按选择项导出
const dataListSelections = ref([]) // 已选择的数据项
const prodKeyArr = [
  { key: 1, label: $t('product.prodName'), inputTips: $t('stock.inputName') },
  { key: 2, label: $t('product.commodityCode'), inputTips: $t('stock.inputPartyCode') }
] // 商品筛选类型
const options = [
  { value: 0, label: $t('stock.all') },
  { value: 1, label: $t('stock.purchaseInStock') },
  { value: 2, label: $t('stock.returnToStorage') },
  { value: 3, label: $t('stock.otherEntries') },
  { value: 4, label: $t('stock.sellOut') },
  { value: 5, label: $t('stock.editOutBound') },
  { value: 6, label: $t('stock.otherOutbound') },
  { value: 7, label: $t('stock.inventoryInitialization') },
  { value: 8, label: $t('stock.orderCancelled') },
  { value: 9, label: $t('stock.editStorage') },
  { value: 10, label: $t('stock.profitStorage') },
  { value: 11, label: $t('stock.lossOutBound') },
  { value: 12, label: '调拨入库' },
  { value: 13, label: '调拨出库' },
  { value: 14, label: '库存模式切换出库' },
  { value: 15, label: '库存模式切换入库' },
  { value: 16, label: '秒杀补充库存' },
  { value: 17, label: '卡券过期' }
] // 单据类型
const createDateRange = ref([]) // 制单时间范围
const page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
})
const searchForm = reactive({
  prodKeyType: 1, // 1：商品名称 2：商品编码
  sourceOrderNo: '', // 关联单号
  prodKey: '', // 搜索商品关键词
  stockBillNo: '', // 单据编号
  stockBillType: 0, // 单据类型
  employeeId: '', // 制单员工id
  createStartTime: '', // 制单起始时间
  createEndTime: '', // 制单结束时间
  stockBillItemType: 1,
  makerMobile: '', //  制单人手机号
  stockPointName: '' // 库存点
}) // 搜索
const dataListLoading = ref(false)
const isSubmit = ref(false)

onMounted(() => {
  getDataList(page)
  // 获取员工手机号列表
  getEmployeeList()
})

const dataListRef = ref(null)
const onSearch = (newData = false) => {
  page.currentPage = 1 // 当前页数
  dataListRef.value.clearSelection()
  getDataList(page, newData)
}
const onPageSizeChange = (val) => {
  page.pageSize = val
  getDataList(page)
}
const onPageChange = (val) => {
  page.currentPage = val
  getDataList(page)
}
const onResetSearch = () => {
  // $refs[formName].resetFields()
  searchForm.employeeId = ''
  searchForm.prodKeyType = 1
  searchForm.prodKey = ''
  searchForm.createStartTime = ''
  searchForm.createEndTime = ''
  searchForm.sourceOrderNo = null
  searchForm.stockBillType = 0
  searchForm.stockBillNo = null
  searchForm.stockPointName = ''
  searchForm.makerMobile = ''
  createDateRange.value = []
  createTimeActive.value = 0
}
const prodKeyTypeChange = () => {
  searchForm.prodKey = ''
}
const createTimeChange = () => {
  if (!createDateRange.value || createDateRange.value.length === 0) {
    searchForm.createStartTime = null
    searchForm.createEndTime = null
  } else {
    searchForm.createStartTime = createDateRange.value[0]
    searchForm.createEndTime = createDateRange.value[1]
  }
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
    params.stockBillLogItemIds = null
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
    params.stockBillLogItemIds = dataListSelections.value.map(item => {
      return item.stockBillLogItemId
    })
  }
  httpExcel({
    url: '/mall4cloud_product/m/stock_bill_log_item/export_flow?' + qs.stringify(params, { arrayFormat: 'repeat' }),
    method: 'get'
  }).then((data) => {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
    const fileName = $t('stock.stockFlowXls')
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
        exportStockFlowVisible.value = false
      }
    })
  }).catch(() => {
    isSubmit.value = false
  })
}
// 多选变化
const onSelectSome = (val) => {
  dataListSelections.value = val
}
/**
 * 根据选项设置时间
 * 1:今天 2:昨天 3: 近七天 4:近30天 5:近60天
 */
const setDateRange = (val) => {
  let startDay = null
  let endDay = null
  if (val === 1) {
    startDay = 0
    endDay = 0
  } else if (val === 2) {
    startDay = -1
    endDay = -1
  } else if (val === 3) {
    startDay = -7
    endDay = -1
  } else if (val === 4) {
    startDay = -30
    endDay = -1
  } else {
    return
  }
  // 开始时间
  const startTime = moment()
    .add(startDay, 'days')
    .startOf('days')
    .format('LL')
  // 结束时间
  const endTime = moment().add(endDay, 'days').endOf('days').format('LL')
  createDateRange.value = [startTime, endTime]
  searchForm.createStartTime = startTime
  searchForm.createEndTime = endTime
  createTimeActive.value = val
}
const getDataList = (pageParam, newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = JSON.parse(JSON.stringify(searchForm))
  }
  dataListLoading.value = true
  http({
    url: '/mall4cloud_product/m/stock_bill_log_item/page',
    method: 'get',
    params: Object.assign(
      {
        pageNum: pageParam == null ? page.currentPage : pageParam.currentPage,
        pageSize: pageParam == null ? page.pageSize : pageParam.pageSize
      },
      tempSearchForm
    )

  }).then((data) => {
    dataList.value = data.list
    page.total = data.total
    dataListLoading.value = false
  }).catch(() => {
    dataListLoading.value = false
  })
}

const getEmployeeList = () => {
  http({
    url: '/mall4cloud_admin/m/apply_shop/shop_user/list',
    method: 'get'
  }).then((data) => {
    employeeList.value = data
  })
}

const getExportExcel = () => {
  exportStockFlowVisible.value = true
}

</script>

<style lang="scss" scoped>
.page-stock-manage-flow {
  padding: 20px;
  div :deep(.el-tabs__item.is-active) {
    color: #000;
    font-weight: 800;
  }

  div :deep(.el-col-md-6) {
    width: 30%
  }

  .operation-bar{
    margin-bottom: 20px;
  }

  :deep(.select-time-btn) {
    display: inline-block;
    color: #606266;
    cursor: pointer;
    margin-left: 10px;
    padding: 8px 15px;
    font-size: 12px;
    border: 1px solid #DCDFE6;
    background: #FFFFFF;
    line-height: 14px;
    border-radius: 2px;
  }

  :deep(.select-time-btn:last-child) {
    margin-right: 0;
  }

  :deep(.select-time-btn.is-active) {
    color: #155BD4;
  }

  :deep(.select-time-btn:hover) {
    background: #FFFFFF;
    border-color: #155BD4;
    color: #155BD4;
  }

  :deep(.search-bar) {
    padding: 25px 20px 0;
    margin-bottom: 20px;
    background-color: #F7F8FA;

    .input-row {
      align-items: center;

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

    .el-form--inline .el-form-item {
      margin-right: 20px !important;
      margin-bottom: 25px;

      .el-form-item__label-wrap {
        margin-left: unset !important;
      }
    }
  }

  .search-bar {
    :deep(.el-form-item__label-wrap) {
      display: inline-block;
    }
  }
}
</style>
