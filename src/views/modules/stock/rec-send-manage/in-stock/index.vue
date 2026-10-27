<template>
  <div class="mod-stock-receive-list">
    <!-- 顶部按钮 -->
    <el-button
      v-permission="['recSendManage:receiveList:add']"
      type="primary"
      @click="onAddOrUpdate(null, null)"
    >
      {{ $t('stock.newlyBuildOtherStorage') }}
    </el-button>

    <div style="height: 10px" />
    <!-- 搜索栏组件 -->
    <stockBillSearchFrom
      :type="2"
      :search-form-props="searchForm"
      @search-change="onSearch(true)"
      @export-stock-log="exportStockLog"
    />
    <div style="height: 10px" />
    <!-- 状态导航选择组件 -->
    <statusSelectTabs
      :type="1"
      :status-arr="statusArr"
      :default-key="statusArr[0].key"
      @status-change="statusChange"
    />
    <!-- 表格组件 -->
    <stockBillTable
      ref="stockBillTableRef"
      :type="2"
      :data-list="dataList"
      @refresh-list="getDataList"
    />
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
      :title="$t('stock.exportStorageDetails')"
    >
      <el-radio
        v-model="exportRadio"
        :label="1"
      >
        {{ $t('stock.exportOfSearchStorage') }}
      </el-radio>
      <el-radio
        v-model="exportRadio"
        :label="2"
      >
        {{ $t('stock.exportOfSelectStorage') }}
      </el-radio>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            class="default-btn"
            @click="exportStockBillLogVisible = false"
          >取消</el-button>
          <el-button
            class="default-btn primary-btn"
            type="primary"
            @click="confirmExport"
          >确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import * as http from '@/api/stock/receive-list'
import { ElMessage } from 'element-plus'
import statusSelectTabs from '../../components/status-select-tabs.vue'
import stockBillSearchFrom from '../../components/stock-bill-search-from.vue'
import stockBillTable from '../../components/stock-bill-table.vue'

const tempSearchForm = ref({}) // 保存上次点击查询的请求条件
const isSubmit = ref(false)
const dataListLoading = ref(false)
const dataList = ref([]) // 表格数据
const exportStockBillLogVisible = ref(false) // 导出弹窗是否可见
const exportRadio = ref(1) //  1 按搜索条件导出 2 按选择项导出
const dataListSelections = ref([]) // 已选择的数据项
const page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
})
const statusArr = [
  { id: 0, key: null, label: $t('stock.all') },
  { id: 1, key: 2, label: $t('stock.waitSubmit') },
  { id: 2, key: 1, label: $t('stock.inStorage') },
  { id: 3, key: 0, label: $t('stock.voided') }
]// 状态导航组件参数
const searchForm = reactive({
  prodKeyType: 1, // 1：商品名称 2：商品编码
  prodKey: '', // 搜索商品关键词
  bizBillNo: '', // 单据编号
  bizOrderType: '', // 出入库原因
  businessDetailTypeId: '', // 单据类型id
  sourceOrderNo: '', // 关联单号
  employeeId: '', // 员工id
  status: null, // 状态
  makerMobile: '', //  制单人手机号
  stockBillNo: null, // 关联单号
  stockBillType: '' // 单据类型
})
onMounted(() => {
  init()
})

const init = () => {
  searchForm.type = 2
  getDataList()
}
const getDataList = (pageParam, newData = false) => {
  dataListLoading.value = true
  if (newData || !tempSearchForm.value) {
    tempSearchForm.value = JSON.parse(JSON.stringify(searchForm))
  }
  http.getPage(Object.assign(
    {
      type: 2,
      pageNum: pageParam ? pageParam.currentPage : page.currentPage,
      pageSize: pageParam ? pageParam.pageSize : page.pageSize
    },
    tempSearchForm.value
  )).then((data) => {
    dataList.value = data.list
    page.total = data.total
    dataListLoading.value = false
  }).catch(() => {
    dataListLoading.value = false
  })
}
const stockBillTableRef = ref(null)
/**
 * 导航选择状态
 */
const statusChange = (item) => {
  searchForm.status = item.key
  page.currentPage = 1
  tempSearchForm.value = JSON.parse(JSON.stringify(searchForm))
  stockBillTableRef.value.clearSelection()
  getDataList()
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
    params.stockBillLogIds = null
  } else {
    // 导出模式为按选中的数据导出
    getSelectList()
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
    params.stockBillLogIds = dataListSelections.value.map(item => {
      return item.stockBillLogId
    })
    params.type = 2
  }
  http.exportStockBillLog(params).then((data) => {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
    const fileName = $t('stock.stockBillLogXls')
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
const exportStockLog = () => {
  exportStockBillLogVisible.value = true
}
const router = useRouter()
/**
 * 跳转到新建库存明细页
 */
const onAddOrUpdate = (type, stockBillLogId) => {
  router.push({
    path: '/rec-send-manage/stock-receive-add-or-update',
    query: {
      type,
      stockBillLogId
    }
  })
}
const getSelectList = () => {
  dataListSelections.value = stockBillTableRef.value?.getSelectList()
}
const onSearch = (searchForm) => {
  page.currentPage = 1
  stockBillTableRef.value?.clearSelection()
  getDataList(null, searchForm)
}
const onPageSizeChange = (val) => {
  page.pageSize = val
  getDataList(page)
}
const onPageChange = (val) => {
  page.currentPage = val
  getDataList(page)
}

</script>

<style lang="scss" scoped>
.mod-stock-receive-list {
  padding:20px;
}
</style>
