<template>
  <div class="page-take-stock-detail">
    <div class="container">
      <div class="new-page-title">
        <div class="line" />
        <div class="text">
          盘点单详情
        </div>
      </div>
      <div class="info-title">
        基本信息
      </div>
      <el-divider />
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        class="form-box"
        label-width="auto"
        @submit.prevent
      >
        <el-form-item
          label="盘点单号"
          prop="takeStockNo"
        >
          <span class="table-cell-text line-clamp-one">{{ dataForm.takeStockNo }}</span>
        </el-form-item>
        <el-form-item
          label="盘点状态"
          prop="billStatus"
        >
          <span
            v-if="dataForm.billStatus === 0"
            class="table-cell-text line-clamp-one"
          >已作废</span>
          <span
            v-if="dataForm.billStatus === 1"
            class="table-cell-text line-clamp-one"
          >盘点中</span>
          <span
            v-if="dataForm.billStatus === 2"
            class="table-cell-text line-clamp-one"
          >已完成</span>
        </el-form-item>
        <el-form-item
          label="盘点时间"
          prop="createTime"
        >
          <span class="table-cell-text line-clamp-one">{{ dataForm.createTime }}</span>
        </el-form-item>
        <el-form-item
          label="库存点类型"
          prop="stockPointType"
        >
          <span class="table-cell-text line-clamp-one">{{ dataForm.stockPointType === 1 ? '仓库' : '门店' }}</span>
        </el-form-item>
        <el-form-item
          label="库存点名称"
          prop="warehouseName"
        >
          <span class="table-cell-text line-clamp-one">{{ dataForm.warehouseName }}</span>
        </el-form-item>
        <el-form-item
          label="盘点区域名称"
          prop="stockRegionName"
        >
          <span class="table-cell-text line-clamp-one">{{ dataForm.stockRegionName }}</span>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remark"
        >
          <span
            v-if="dataForm.remark"
            class="table-cell-text line-clamp-one"
          >{{ dataForm.remark }}</span>
          <span
            v-else
            class="table-cell-text"
          >-</span>
        </el-form-item>
      </el-form>
      <span class="info-title">商品信息</span>
      <el-divider />
      <!--sku列表-->
      <div class="prod-container">
        <div class="sub-tit">
          盘点商品{{ takeStockProdItems.length }}种，实盘库存{{ totalStock }}件，盘盈{{ profitNum }}件，盘亏{{ lossNum }}件
        </div>
        <div class="prodItem-table">
          <!-- 状态导航选择组件 -->
          <statusSelectTabs
            :status-arr="statusArr"
            :default-key="statusArr[0].key"
            @status-change="statusChange"
          >
            <template #export>
              <el-button
                type="primary"
                link
                @click="getExportExcel"
              >
                导出商品详情
              </el-button>
            </template>
          </statusSelectTabs>
          <el-table
            :data="totalList.slice((page.pageNum - 1) * page.pageSize, page.pageNum * page.pageSize)"
            header-cell-class-name="table-header"
            row-class-name="table-row"
          >
            <el-table-column
              label="商品详情"
              prop="reason"
              fixed="left"
              align="center"
              width="320px"
            >
              <template #default="scope">
                <div class="prod-info">
                  <ImgShow
                    :src="scope.row.pic"
                    :img-style="{width:'60px',height:'60px'}"
                  />
                  <div class="text">
                    <span class="name">{{ scope.row.spuName }}</span>
                    <span class="name">{{ scope.row.skuName }}</span>
                    <span class="name">{{ scope.row.partyCode }}</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="bookStock"
              label="账面库存"
              align="center"
            >
              <template #default="scope">
                <span class="table-cell-text line-clamp-one">{{ scope.row.stocks }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="stock_count"
              align="center"
            >
              <template #header>
                盈亏数量
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="此处的盈亏差异值仅做参考，请以最后“完成盘点”时盈亏计算的结果为准。"
                  placement="top"
                >
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
              </template>
              <template #default="scope">
                <span class="table-cell-text line-clamp-one">{{ scope.row.changeStock > 0 ? '+'+scope.row.changeStock : scope.row.changeStock }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="实盘库存"
              prop="totalStock"
              align="left"
            >
              <template #default="scope">
                <span class="table-cell-text line-clamp-one">{{ scope.row.totalStock }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="备注"
              prop="remark"
              align="left"
            >
              <template #default="scope">
                <span
                  v-if="scope.row.remark"
                  class="table-cell-text line-clamp-one"
                >{{ scope.row.remark }}</span>
                <span
                  v-else
                  class="table-cell-text"
                >-</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :current-page="page.pageNum"
            :page-size="page.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="totalList.length"
            style="text-align: right"
            @current-change="onPageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import statusSelectTabs from '../../../components/status-select-tabs.vue'
import * as api from '@/api/stock/takeStock'
import { ElMessageBox } from 'element-plus'

const { proxy } = getCurrentInstance()
const page = reactive({
  pageNum: 1, // 初始页
  pageSize: 10 // 每页数据大小
})

const dataForm = reactive({
  takeStockId: null,
  takeStockNo: null,
  billStatus: null,
  createTime: null,
  stockRegionName: null,
  remark: null,
  shopId: null,
  takeStockProdItems: [],
  warehouseName: null,
  stockPointType: null
})
const takeStockProdItems = ref([])
const totalStock = ref(0) // 实盘库存
const profitCount = ref(0) // 盘盈
const profitNum = ref(0) // 盘盈件数
const lossCount = ref(0) // 盘亏
const lossNum = ref(0) // 盘亏件数
const equalCount = ref(0) // 盘平
const exceptionCount = ref(0) // 异常
const profitProdList = ref([]) // 盘盈列表
const lossProdList = ref([]) // 盘亏列表
const equalProdList = ref([]) // 盘平列表
const exceptionProdList = ref([]) // 异常列表
const totalList = ref([])
const statusArr = ref([
  { id: 0, key: 3, label: '全部' },
  { id: 1, key: 1, label: '' },
  { id: 2, key: 2, label: '' },
  { id: 3, key: 0, label: '' }
]) // 状态导航组件参数

onMounted(() => {
  if (useRoute().query.takeStockId) {
    dataForm.takeStockId = useRoute().query.takeStockId
  }
  if (useRoute().query.billStatus) {
    dataForm.billStatus = useRoute().query.billStatus
  }
  getDataList()
  getSkuList()
})

const getDataList = () => {
  api.takeInfo(dataForm.takeStockId).then((data) => {
    dataForm.takeStockId = data.takeStockId
    dataForm.takeStockNo = data.takeStockNo
    dataForm.billStatus = data.billStatus
    dataForm.createTime = data.createTime
    dataForm.stockRegionName = data.stockRegionName
    dataForm.remark = data.remark
    dataForm.shopId = data.shopId
    dataForm.takeStockProdItems = data.takeStockProdItems
    dataForm.warehouseName = data.warehouseName
    dataForm.stockPointType = data.stockPointType
  })
}
const getSkuList = () => {
  api.takeStockSpuById({ takeStockId: dataForm.takeStockId }).then((data) => {
    takeStockProdItems.value = data
    statusChange(statusArr.value[0])
    countChange(takeStockProdItems.value)
  })
}
/**
 * 导航选择状态
 */
const statusChange = (item) => {
  totalList.value = []
  switch (item.key) {
    case 1: totalList.value = profitProdList.value
      break
    case 2: totalList.value = lossProdList.value
      break
    case 0: totalList.value = equalProdList.value
      break
    case -1: totalList.value = exceptionProdList.value
      break
    default: totalList.value = takeStockProdItems.value
      break
  }
  page.pageNum = 1
}
const countChange = (newValue) => {
  profitProdList.value = []
  lossProdList.value = []
  equalProdList.value = []
  exceptionProdList.value = []
  let totalStockLet = 0
  let profitCountLet = 0
  let profitNumLet = 0
  let lossCountLet = 0
  let lossNumLet = 0
  let equalCountLet = 0
  let exceptionCountLet = 0
  newValue.forEach(item => {
    if (!item.totalStock && item.totalStock !== 0) {
      item.totalStock = null
    }
    item.takeStockId = dataForm.takeStockId
    item.changeStock = item.totalStock - item.stocks
    totalStockLet += item.totalStock
    // ioType 0盘平 1盘盈 2盘亏 -1异常
    switch (item.ioType) {
      case 2 : lossNumLet += item.stocks - item.totalStock
        lossCountLet++
        lossProdList.value.push(item)
        break
      case 1 : profitNumLet += item.totalStock - item.stocks
        profitCountLet++
        profitProdList.value.push(item)
        break
      case 0 : equalCountLet++
        equalProdList.value.push(item)
        break
      case -1 : exceptionCountLet++
        exceptionProdList.value.push(item)
        break
    }
  })
  totalStock.value = totalStockLet
  profitCount.value = profitCountLet
  profitNum.value = profitNumLet
  lossCount.value = lossCountLet
  lossNum.value = lossNumLet
  equalCount.value = equalCountLet
  exceptionCount.value = exceptionCountLet
  statusArr.value.forEach(el => {
    if (el.key === 1) {
      el.label = `盘盈(${profitCount.value})`
    }
    if (el.key === 2) {
      el.label = `盘亏(${lossCount.value})`
    }
    if (el.key === 0) {
      el.label = `盘平(${equalCount.value})`
    }
    if (el.key === -1) {
      el.label = `异常(${exceptionCount.value})`
    }
  })
  proxy.$forceUpdate()
}

const getExportExcel = () => {
  ElMessageBox.confirm('导出的商品信息根据已保存的内容导出，是否导出盘点商品信息？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    api.exportTakeStockSpu({ takeStockId: dataForm.takeStockId }).then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
      const fileName = '盘点商品信息.xlsx'
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
const onPageChange = (val) => {
  page.pageNum = val
}

</script>

<style lang="scss" scoped>
.page-take-stock-detail {
  padding: 20px;
  // 标题栏目
  .new-page-title {
    width: 100%;
    height: 62px;
    background: #F7F8FA;
    box-sizing: border-box;
    padding: 19px 20px;
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .line {
      width: 4px;
      height: 19px;
      background: #155BD4;
      opacity: 1;
      border-radius: 2px;
      margin-right: 10px;
    }

    .text {
      font-size: 18px;
      font-weight: bold;
      color: #333333;
      opacity: 1;
    }
  }

  div :deep(.is-success .el-input-number__decrease),
  div :deep(.is-success .el-input-number__increase),
  div :deep(.is-error .el-input-number__decrease),
  div :deep(.is-error .el-input-number__increase) {
    right: 1px !important;
  }

  div :deep(.el-date-editor .el-range-separator) {
    width: 8%;
  }

  .form-box {
    margin-left: 10px;
  }

  .info-title {
    color: #333333;
    font-size: 16px;
    font-weight: bold;
  }

  .prod-info {
    display: flex;
    align-items: center;
  }

  .prod-info .text {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-left: 10px;
    width: 170px;
  }

  .prod-info .text .name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }

  .prod-container .sub-tit {
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 14px;
    color: #323233;
  }

  :deep(.el-pagination) {
    display: flex;
    justify-content: end;
  }
}

</style>
