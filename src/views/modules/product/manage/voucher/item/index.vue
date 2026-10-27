<template>
  <div class="page-voucher-item app-container">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        inline
        :model="searchForm"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item
            prop="orderId"
            :label="$t('order.order.number')"
            class="search-form-item"
          >
            <el-input
              v-model="searchForm.orderId"
              type="text"
              clearable
              :placeholder="$t('order.order.number')"
            />
          </el-form-item>
          <el-form-item
            prop="dateRange"
            :label="$t('voucher.exportDate') + ':' "
          >
            <el-date-picker
              v-model="dateRange"
              type="datetimerange"
              clearable
              range-separator="至"
              value-format="YYYY-MM-DD HH:mm:ss"
              :default-time="[new Date(2000, 1, 1, 0, 0, 0),
                              new Date(2000, 2, 1, 23, 59, 59)]"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
            <div
              class="default-btn"
              style="margin-left: 20px;"
              :class="{ 'is-active': timeActive === 1 }"
              @click="setDateRange(1)"
            >
              今天
            </div>
            <div
              class="default-btn"
              :class="{ 'is-active': timeActive === 2 }"
              @click="setDateRange(2)"
            >
              昨天
            </div>
            <div
              class="default-btn"
              :class="{ 'is-active': timeActive === 3 }"
              @click="setDateRange(3)"
            >
              近7天
            </div>
            <div
              class="default-btn"
              :class="{ 'is-active': timeActive === 4 }"
              @click="setDateRange(4)"
            >
              近30天
            </div>
          </el-form-item>
          <el-form-item>
            <div
              class="default-btn primary-btn"
              @click="onSearch"
            >
              {{ $t('table.search') }}
            </div>
            <div
              class="default-btn"
              @click="onResetSearch(searchFormRef)"
            >
              {{ $t('shop.resetMap') }}
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 列表相关区域 -->
    <div class="main-content">
      <div class="operation-bar">
        <el-checkbox
          v-model="selectAll"
          :disabled="pageData.dataList.length===0"
          class="all-check-btn"
          @change="onSelectAll"
        >
          全选
        </el-checkbox>
        <div style="margin-left: 10px">
          <el-dropdown
            class="batch-setting-dropdown"
            :hide-on-click="true"
            trigger="click"
            @command="handleBatchSetting"
            @visible-change="handleVisibleChange"
          >
            <div
              :class="[showBatchSetting? 'active' : '','default-btn batch-setting-btn']"
            >
              批量设置
              <i class="arrow" />
            </div>
            <!-- 批量设置功能列表 -->
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-permission="['product:voucherItem:import']"
                  command="1"
                >
                  {{ $t('stock.batchImport') }}
                </el-dropdown-item>
                <el-dropdown-item
                  command="0"
                >
                  批量导出
                </el-dropdown-item>
                <el-dropdown-item
                  v-permission="['product:voucherItem:batchDel']"
                  command="-1"
                >
                  批量删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="table-con voucher-item-table">
        <!-- 导航 -->
        <div class="status-nav clearfix">
          <ul class="nav-list clearfix">
            <li
              :class="['nav-item', activeName === 99 ? 'selected' : '']"
              data-sts="99"
              @click="selectNav($event)"
            >
              {{ $t('stock.all') }}
            </li>
            <li
              :class="['nav-item', activeName === 1 ? 'selected' : '']"
              data-sts="1"
              @click="selectNav($event)"
            >
              {{ $t('voucher.startUsing') }}
            </li>
            <li
              :class="['nav-item', activeName === 2 ? 'selected' : '']"
              data-sts="2"
              @click="selectNav($event)"
            >
              {{ $t('voucher.notEnabled') }}
            </li>
            <li
              :class="['nav-item', activeName === 0 ? 'selected' : '']"
              data-sts="0"
              @click="selectNav($event)"
            >
              {{ $t("voucher.expired") }}
            </li>
          </ul>
        </div>
        <el-table
          ref="multipTableRef"
          v-loading="pageLoading"
          :data="pageData.dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
          @selection-change="onSelectSome"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <!-- 卡券id -->
          <el-table-column
            prop="cardNumber"
            :label="$t('voucher.cardNum')"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="cardPwd"
            :label="$t('voucher.cardPWD')"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="couponCode"
            :label="$t('voucher.cardCode')"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="status"
            :label="$t('product.status')"
            align="center"
            show-overflow-tooltip
          >
            <!-- 0：已失效 1已发送 2未发送 -->
            <template #default="scope">
              <span
                v-if="scope.row.status === 0"
              >
                {{ $t('voucher.expired') }}
              </span>
              <span
                v-else
              >
                {{ scope.row.status === 1 ? $t('voucher.startUsing') : $t('voucher.notEnabled') }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="importTime"
            :label="$t('voucher.exportDate')"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="expirationTime"
            :label="$t('voucher.item.expirationTime')"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="orderId"
            :label="$t('chat.orderNumber')"
            align="center"
            show-overflow-tooltip
          >
            <template #default="scope">
              {{ scope.row.orderId || '-' }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            fixed="right"
            :label="$t('table.actions')"
            width="auto"
          >
            <template #default="scope">
              <div class="text-btn-con">
                <el-button
                  v-permission="['product:voucherItem:delete']"
                  type="primary"
                  link
                  @click="onDelete(scope.row.voucherItemId)"
                >
                  {{ $t('table.delete') }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        v-show="pageData.total>0"
        v-model:page="searchForm.pageNum"
        v-model:limit="searchForm.pageSize"
        :total="pageData.total"
        @pagination="getPageData()"
      />
    </div>

    <!-- 导出入库明细 -->
    <el-dialog
      v-model="exportVisible"
      :title="$t('voucher.item.exportVoucherDetails')"
      width="600px"
    >
      <el-radio
        v-model="exportRadio"
        :label="1"
      >
        {{ $t('voucher.item.exportVoucherOfSearch') }}
      </el-radio>
      <el-radio
        v-model="exportRadio"
        :label="2"
      >
        {{ $t('voucher.item.exportVoucherOfSelect') }}
      </el-radio>
      <template #footer>
        <div
          class="default-btn"
          @click="exportVisible = false"
        >
          {{ $t('pcdecorate.commonModal.cancel') }}
        </div>
        <div
          class="default-btn primary-btn"
          @click="confirmExport"
        >
          {{ $t('pcdecorate.commonModal.sure') }}
        </div>
      </template>
    </el-dialog>

    <voucher-item-import
      v-if="uploadVisible"
      ref="voucherUploadRef"
      :voucher-id="searchForm.voucherId"
      @refresh-data-list="refreshChange"
    />
  </div>
</template>

<script setup>
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import * as api from '@/api/product/voucher-item'
import moment from 'moment'
import VoucherItemImport from '../components/voucher-item-import.vue'

let tempSearchForm = null // 保存上次点击查询的请求条件

// 返回参数
const pageData = ref({
  dataList: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})

// 头部搜索表单
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  orderId: null
})
const pageLoading = ref(true)

const route = useRoute()
onMounted(() => {
  searchForm.voucherId = route.query.voucherId
  getPageData()
})

const getPageData = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = JSON.parse(JSON.stringify(searchForm))
  } else {
    tempSearchForm.pageNum = searchForm.pageNum
    tempSearchForm.pageSize = searchForm.pageSize
  }
  pageLoading.value = true
  api.page({
    voucherId: searchForm.voucherId,
    orderId: searchForm.orderId || undefined,
    pageNum: tempSearchForm.pageNum,
    pageSize: tempSearchForm.pageSize,
    status: status.value,
    startTime: dateRange.value === null ? null : dateRange.value[0], // 开始时间
    endTime: dateRange.value === null ? null : dateRange.value[1] // 结束时间
  }).then(data => {
    pageData.value.dataList = data.list
    pageData.value.pages = data.pages
    pageData.value.total = data.total
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

const dateRange = ref([])
const timeActive = ref(null)
/**
 * 根据选项设置时间
 * 1:今天 2:昨天 3: 近七天 4:近30天 5:近60天
 */
const setDateRange = (val) => {
  timeActive.value = val
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
  const startTime = moment().add(startDay, 'days').startOf('days').format('LL')
  // 结束时间
  const endTime = moment().add(endDay, 'days').endOf('days').format('LL')
  dateRange.value = [startTime, endTime]
}

const activeName = ref(99)
const status = ref(null)
/**
 * 导航选择状态
 * 状态 99：全部 0：正常 1：已发放 2：已失效
 */
const selectNav = (e) => {
  const sts = e.currentTarget.dataset.sts
  activeName.value = Number(sts)
  status.value = activeName.value === 99 ? null : parseInt(sts)
  pageData.value.page = 1
  getPageData(pageData)
}

// 打开导入弹窗
const voucherUploadRef = ref(null)
const uploadVisible = ref(false)
const getUpload = () => {
  uploadVisible.value = true
  nextTick(() => {
    voucherUploadRef.value?.init()
  })
}

// 删除
const onDelete = (voucherItemId) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => deleteById(voucherItemId))
}

const deleteById = (voucherItemId) => {
  api.batchDel([voucherItemId]).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => refreshChange()
    })
  })
}
// 条件查询
const onSearch = (newData = false) => {
  searchForm.pageNum = 1
  getPageData(newData)
}

// 刷新回调
const refreshChange = () => {
  searchForm.pageNum = 1
  getPageData()
}

// 重置表单
const searchFormRef = ref(null)
const onResetSearch = (formEl) => {
  dateRange.value = null
  formEl.resetFields()
}

const selectAll = ref(false) // 是否全选
const onSelectSome = (val) => {
  dataListSelections.value = val
  selectAll.value = val.length === pageData.value.dataList.length
  if (pageData.value.dataList.length === 0) {
    selectAll.value = false
  }
}

// 全选按钮
const multipTableRef = ref(null)
const onSelectAll = () => {
  multipTableRef.value?.toggleAllSelection()
}

const showBatchSetting = ref(false)
/**
 * 批量设置菜单显隐
 */
const handleVisibleChange = (val) => {
  showBatchSetting.value = val
}

const dataListSelections = ref([])
/**
 * 批量设置
 */
const handleBatchSetting = (command) => {
  const commands = Number(command)
  if (commands === 1) {
    getUpload()
  } else if (commands === 0) {
    exportVoucherItem()
  } else {
    if (!dataListSelections.value.length) {
      ElMessage.warning('请先选择卡券')
      return
    }
    batchDeleteHandle()
  }
}

const exportVoucherItem = () => {
  exportVisible.value = true
}

/**
 * 根据当前搜索条件批量导出
 */
const getExportExcel = (params) => {
  const loading = ElLoading.service({
    lock: true,
    target: '.mod-supplier-supplier',
    customClass: 'export-load',
    background: 'transparent',
    text: '正在导出'
  })
  exportVisible.value = false
  api.exportExcel(params).then((data) => {
    loading.close()
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
    const fileName = '卡券明细.xlsx'
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
  }).catch((e) => {
    loading.close()
  })
}

const exportVisible = ref(false)
const exportRadio = ref(1) //  1 按搜索条件导出 2 按选择项导出
/**
 * 确定导出
 */
const confirmExport = Debounce(() => {
  if (exportRadio.value !== 1 && exportRadio.value !== 2) {
    ElMessage({
      message: $t('stock.exportRadioEmptyTips'),
      type: 'error',
      duration: 1500
    })
    return
  }
  // 准备参数
  const params = {
    voucherId: searchForm.voucherId,
    status: status.value,
    startTime: null, // 开始时间
    endTime: null, // 结束时间
    voucherItemIds: null,
    orderId: null
  }
  if (exportRadio.value === 1) {
    // 导出模式为按搜索条件导出
    if (pageData.value.total === 0) {
      ElMessage({
        message: $t('stock.exportStockLogSearchEmptyTips'),
        type: 'error',
        duration: 1500
      })
      return
    }
    params.startTime = dateRange.value === null ? null : dateRange.value[0]
    params.endTime = dateRange.value === null ? null : dateRange.value[1]
    params.orderId = searchForm.orderId
  } else {
    if (dataListSelections.value.length === 0) {
      ElMessage({
        message: $t('stock.exportStockLogSelectEmptyTips'),
        type: 'error',
        duration: 1500
      })
      return
    }
    params.voucherItemIds = dataListSelections.value.map(item => {
      return item.voucherItemId
    })
  }
  getExportExcel(params)
}, 1500)

// 批量删除
const batchDeleteHandle = () => {
  const ids = dataListSelections.value.map(item => {
    return item.voucherItemId
  })
  ElMessageBox.confirm('确定进行【批量删除】操作?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    api.batchDel(ids).then(() => {
      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 1500,
        onClose: () => {
          refreshChange()
        }
      })
    })
  }).catch(() => { })
}

</script>

<style lang="scss" scoped>
@use "index";
</style>
