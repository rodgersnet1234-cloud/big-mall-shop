<template>
  <div class="page-physical">
    <!-- 顶部按钮 -->
    <el-button
      type="primary"
      @click="onAddOrUpdate()"
    >
      新建盘点
    </el-button>
    <div style="height: 10px" />
    <!-- 搜索栏组件 -->
    <stockTakeSearchFrom
      :search-form-props="searchForm"
      @search-change="onSearch(true)"
      @confirm-export="confirmExport"
    />
    <!-- 表格组件 -->
    <stockTakeTable
      ref="stockTakeTableRef"
      :data-list="dataList"
      @refresh-list="getDataList"
      @refresh-change="refreshChange()"
    />
    <!-- 分页 -->
    <el-pagination
      v-show="page.total>0"
      :current-page="page.pageNum"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="page.pageSize"
      :total="page.total"
      layout="->, total, sizes, prev, pager, next, jumper"
      style="text-align: right"
      @size-change="onPageSizeChange"
      @current-change="onPageChange"
    />
  </div>
</template>

<script setup>
import stockTakeSearchFrom from '../../components/take-stock-search-form.vue'
import stockTakeTable from '../../components/take-stock-table.vue'
import * as api from '@/api/stock/takeStock.js'
import { ElMessageBox } from 'element-plus'

let tempSearchForm = null // 保存上次点击查询的请求条件

const dataListLoading = ref(false)
const dataList = ref([]) // 表格数据
const page = reactive({
  total: 0, // 总页数
  pageNum: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
})
const searchForm = reactive({
  takeStockNo: '', // 盘点单号
  billStatus: '', // 盘点状态 0已作废 1盘点中 2已完成
  maker: '', // 制单人id
  prodKeyType: 1, // 1：商品名称 2：商品编码
  prodKey: '', // 搜索商品关键词(0:商品名称 1：商品编码)
  createStartTime: '', // 盘点起始时间
  createEndTime: '', // 盘点结束时间
  spuName: '',
  partyCode: ''
})

onMounted(() => {
  init()
})

const init = () => {
  getDataList(page)
}
const getDataList = (pageParam, newData = false) => {
  dataListLoading.value = true
  if (searchForm.prodKeyType === 1) {
    searchForm.spuName = searchForm.prodKey
    searchForm.partyCode = null
  } else if (searchForm.prodKeyType === 2) {
    searchForm.partyCode = searchForm.prodKey
    searchForm.spuName = null
  }
  if (newData || !tempSearchForm) {
    tempSearchForm = JSON.parse(JSON.stringify(searchForm))
  }
  api.takePage(Object.assign(
    {
      pageNum: page == null ? pageParam.pageNum : page.pageNum,
      pageSize: page == null ? pageParam.pageSize : page.pageSize
    },
    tempSearchForm
  )).then((data) => {
    dataList.value = data.list
    page.total = data.total
    dataListLoading.value = false
  }).catch(() => {
    dataListLoading.value = false
  })
}
/**
 * 导出
 */
const confirmExport = () => {
  if (searchForm.prodKeyType === 1) {
    searchForm.spuName = searchForm.prodKey
    searchForm.partyCode = null
  } else if (searchForm.prodKeyType === 2) {
    searchForm.partyCode = searchForm.prodKey
    searchForm.spuName = null
  }
  ElMessageBox.confirm('导出的商品信息根据已保存的内容导出，是否导出实物盘点信息？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    api.exportTakeStock(searchForm).then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
      const fileName = '盘点列表信息.xlsx'
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
const route = useRouter()
const onAddOrUpdate = () => {
  route.push({
    path: '/stock/new-take-stock',
    query: {
    }
  })
}
const onSearch = (newData = false) => {
  page.pageNum = 1
  getDataList(page, newData)
}
const onPageSizeChange = (val) => {
  page.pageSize = val
  getDataList(page)
}
const onPageChange = (val) => {
  page.pageNum = val
  getDataList(page)
}
const refreshChange = () => {
  getDataList(page)
}

</script>

<style lang="scss" scoped>
.page-physical {
  padding:20px;
}
</style>
