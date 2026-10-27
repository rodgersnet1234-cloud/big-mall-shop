<template>
  <!-- 财务对账 -->
  <div class="component-trading">
    <div class="search-bar">
      <el-form
        clearable
        :inline="true"
        :model="dataFrom"
        class="demo-form-inline"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item label="订单编号：">
            <el-input
              v-model="dataFrom.orderId"
              maxlength="19"
              onkeyup="value=value.replace(/[^\d]/g,'')"
              clearable
              placeholder="请输入订单编号"
            />
          </el-form-item>
          <el-form-item label="退款单号：">
            <el-input
              v-model="dataFrom.refundId"
              class="returnInput"
              onkeyup="value=value.replace(/[^\d]/g,'')"
              maxlength="19"
              placeholder="退款单号"
            />
          </el-form-item>
          <el-form-item label="收支类型：">
            <el-select
              v-model="dataFrom.shopIoType"
              clearable
              placeholder="收支类型"
            >
              <el-option
                v-for="item in ioType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="金额类型：">
            <el-select
              v-model="dataFrom.amountType"
              clearable
              placeholder="金额类型"
            >
              <el-option
                v-for="item in amountType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="原因：">
            <el-select
              v-model="dataFrom.reason"
              width="200"
              clearable
              placeholder="原因"
            >
              <el-option
                v-for="item in reason"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
          <el-form-item label="门店名称：">
            <el-select v-model="dataFrom.stationId">
              <el-option
                v-for="node in stationList"
                :key="node.stationId"
                :label="node.stationName"
                :value="node.stationId"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSubmit(true)"
            >
              搜索
            </el-button>
            <el-button
              @click="clear"
            >
              {{ $t("shop.resetMap") }}
            </el-button>
            <el-button
              @click="getExportExcel()"
            >
              导出
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="list">
      <el-table
        :data="tableData"
        header-cell-class-name="table-header"
        row-class-name="table-row"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="90"
        />
        <el-table-column
          prop="operation"
          label="金额类型"
          align="center"
          width="120"
        >
          <template #default="scope">
            <span>{{ ['待结算金额','店铺余额','冻结金额'][scope.row.amountType] }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="stationName"
          label="门店名称"
          align="center"
          style="width:500px;"
        >
          <template #default="scope">
            <span>{{ scope.row.stationName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="shopChangeAmount"
          label="改变金额"
          align="center"
          width="150"
        >
          <template #default="scope">
            <span><span>￥ {{ (scope.row.shopChangeAmount | price ) > 0 ? ['-','+'][scope.row.shopIoType] : "" }}</span>{{ price(scope.row.shopChangeAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderId"
          label="关联订单号"
          align="center"
          width="160"
        >
          <template #default="scope">
            <span>{{ scope.row.orderId || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="refundId"
          label="退款单号"
          align="center"
          width="160"
        >
          <template #default="scope">
            <span>{{ scope.row.refundId || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="userAmount"
          label="操作金额"
          align="center"
          width="120"
        >
          <template #default="scope">
            <span><span>{{ ['-','+'][scope.row.shopIoType] }}</span>{{ price((scope.row.userAmount ? scope.row.userAmount : scope.row.shopChangeAmount) ) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="platformAmount"
          label="平台优惠金额"
          align="center"
          width="120"
        >
          <template #default="scope">
            <span><span v-if="scope.row.platformAmount">{{ ['-','+'][scope.row.shopIoType] }}</span>{{ price(scope.row.platformAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="shopReduceAmount"
          label="商家优惠金额"
          align="center"
          width="120"
        >
          <template #default="scope">
            <span>{{ price(scope.row.shopReduceAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="distributionAmount"
          label="分销占用金额"
          align="center"
          width="120"
        >
          <template #default="scope">
            <span>{{ price(scope.row.distributionAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="shopPlatformCommission"
          label="平台佣金"
          align="center"
          width="120"
        >
          <template #default="scope">
            <span v-if="scope.row.reason === 2"><span v-if="scope.row.shopPlatformCommission > 0">+</span>{{ price(scope.row.shopPlatformCommission) }}</span>
            <span v-else-if="scope.row.shopPlatformCommission > 0">-{{ price(scope.row.shopPlatformCommission) }}</span>
            <span v-else>{{ price(scope.row.shopPlatformCommission) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="reason"
          label="资金变化原因"
          align="center"
          width="180"
        >
          <template #default="scope">
            <span>{{ ['用户支付','订单结算','用户申请退款成功','','提现申请','提现申请被拒绝','提现申请通过','系统发放成功','系统发放失败','扣除订单分销金额','','充值成功', '扣除订单采购价差', '商家自行处理采购价差','超时未支付尾款'][scope.row.reason] }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          width="160"
        >
          <template #default="scope">
            <span>{{ scope.row.createTime ||'-' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <el-button
              v-if="scope.row.reason !== 4 && scope.row.reason !== 6 && scope.row.reason !== 5 && scope.row.reason !== 11"
              v-permission="['shop:shopWallet:detail']"
              type="primary"
              link
              @click="handleDetail(scope.row.orderId, scope.row.refundId)"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页条 -->
    <pagination
      v-model:current-page="params.pageNum"
      v-model:page-size="params.pageSize"
      style="text-align: right"
      :total="total"
      @pagination="onPagination"
    />
  </div>
</template>

<script setup>
import Big from 'big.js'
import { page, exportExcel } from '@/api/multishop/shop_wallet_log.js'
import { ElLoading, ElMessageBox } from 'element-plus'
import { getListAllStation } from '@/api/stock/warehouse-station.js'
import { getParseTime } from '@/utils/datetime.js'

const price = (value) => {
  if (value) {
    return new Big(value).div(100).toFixed(2)
  }
  return 0
}

let tempSearchForm = null
const total = ref(0)
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
const params = reactive({
  pageNum: 1,
  pageSize: 10
})
const ioType = ref([{
  value: 0,
  label: '支出'
}, {
  value: 1,
  label: '收入'
}])
const amountType = ref([{
  value: 0,
  label: '待结算金额'
}, {
  value: 1,
  label: '店铺余额'
}, {
  value: 2,
  label: '冻结金额'
}]) // '未结算金额', '店铺金额', '冻结金额'
const reason = ref([
  {
    value: 0,
    label: '用户支付'
  },
  {
    value: 1,
    label: '订单结算'
  },
  {
    value: 2,
    label: '用户申请退款成功'
  },
  {
    value: 4,
    label: '提现申请'
  },
  {
    value: 5,
    label: '提现申请被拒绝'
  },
  {
    value: 6,
    label: '提现申请通过'
  },
  {
    value: 9,
    label: '扣除订单分销金额'
  },
  {
    value: 11,
    label: '充值成功'
  },
  {
    value: 12,
    label: '扣除订单采购价差'
  },
  {
    value: 13,
    label: '商家自行处理采购价差'
  },
  {
    value: 14,
    label: '超时未支付尾款'
  }
])
const dataFrom = reactive({
  shopIoType: '',
  stationName: '',
  amountType: '',
  orderId: '',
  refundId: '',
  reason: '',
  startTime: '',
  endTime: '',
  stationId: ''
})
const tableData = ref([{
  balance: 111
}])

onMounted(() => {
  getData()
  onGetStationList()
})

// 获取数据
const getData = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...dataFrom, ...params }
  } else {
    tempSearchForm.pageNum = params.pageNum
    tempSearchForm.pageSize = params.pageSize
  }
  page(tempSearchForm).then(res => {
    tableData.value = res.list
    total.value = res.total
  })
}
const setdatePickerType = (val) => {
  datePickerType.value = val
}

// 点击分页
const onPagination = (page) => {
  params.pageNum = page.pageNum
  params.pageSize = page.pageSize
  getData()
}
// 搜索
const onSubmit = (newData = false) => {
  dataFrom.startTime = dateRangeParam.value ? dateRangeParam.value[0] : ''
  dataFrom.endTime = dateRangeParam.value ? dateRangeParam.value[1] : ''
  dataFrom.orderId = dataFrom.orderId.replace(/[^\d]/g, '')
  dataFrom.orderId = dataFrom.orderId.trim()
  dataFrom.refundId = dataFrom.refundId.replace(/[^\d]/g, '')
  dataFrom.refundId = dataFrom.refundId.trim()
  params.pageNum = 1
  getData(newData)
}

const router = useRouter()
// 查看详情
const handleDetail = (orderId, refundId) => {
  router.push({
    path: '/finance/billing-details',
    query: {
      orderId,
      refundId
    }
  })
}
// 清空
const clear = () => {
  dataFrom.shopIoType = ''
  dataFrom.amountType = ''
  dataFrom.orderId = ''
  dataFrom.refundId = ''
  dataFrom.reason = ''
  dataFrom.startTime = ''
  dataFrom.endTime = ''
  dataFrom.stationId = ''
  dateRangeParam.value = []
}
// excel导出
const getExportExcel = () => {
  ElMessageBox.confirm('导出筛选出的交易记录', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const loading = ElLoading.service({
      lock: true,
      target: '.prod-list-mod',
      customClass: 'export-load',
      background: 'transparent',
      text: '导出中'
    })
    exportExcel(
      dataFrom
    ).then((data) => {
      loading.close()
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
      const fileName = '店铺结算表.xlsx'
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
    }).catch(() => {
      loading.close()
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

const stationList = ref([])
const onGetStationList = () => {
  getListAllStation().then((res) => {
    stationList.value = res
  })
}

defineExpose({ getData })
</script>

<style lang="scss" scoped>
.component-trading {
  .list{
    padding: 20px 0;
  }

  :deep(.date-picker-type .el-input--suffix) {
    width: 120px !important;
  }

  :deep(.el-form-item) {
    margin-right: 20px;
  }
  :deep(.el-form-item__label) {
    min-width: 90px;
    width: 75px;
    box-sizing: border-box;
  }
  :deep(.returnInput .el-input__inner){
    padding-right: 30px;
  }
}
</style>
