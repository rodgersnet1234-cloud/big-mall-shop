<template>
  <div>
    <div class="component-stock-bill-search-from search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        class="search-form"
        :model="searchForm"
        label-width="auto"
        @submit.prevent
      >
        <!-- 表单项 -->
        <div class="input-row">
          <el-form-item :label="$t('stock.productFilter')+'：'">
            <el-select
              v-model="searchForm.prodKeyType"
              class="prod-key-type-select"
              style="width:110px"
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
              v-model="searchForm.prodKey"
              type="text"
              :placeholder="prodKeyArr[searchForm.prodKeyType - 1].inputTips"
            />
          </el-form-item>
          <el-form-item :label="type === 1 ? $t('stock.outStockOrderNo')+'：' : $t('stock.inStockOrderNo')+'：'">
            <el-input
              v-model="searchForm.stockBillNo"
              type="text"
              :placeholder="type === 1 ? $t('stock.outStockOrderNo') : $t('stock.inStockOrderNo')"
            />
          </el-form-item>
          <el-form-item :label="$t('stock.sourceOrderNo')+'：'">
            <el-input
              v-model="searchForm.sourceOrderNo"
              type="text"
              :placeholder="$t('stock.sourceOrderNo')"
              @change="changeNumber(searchForm)"
            />
          </el-form-item>
          <el-form-item :label="$t('stock.stockBillType')+'：'">
            <el-select
              v-model="searchForm.stockBillType"
              filterable
            >
              <el-option
                v-for="node in businessDetailType"
                :key="node.stockBillType"
                :label="node.label"
                :value="node.stockBillType"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('stock.maker')+'：'">
            <el-select
              v-model="searchForm.makerMobile"
              filterable
            >
              <el-option
                v-for="node in employeeList"
                :key="node.shopUserId"
                :label="node.nickName"
                :value="node.phoneNum"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="input-row">
          <el-form-item :label="$t('stock.createOrderTime')+'：'">
            <el-date-picker
              v-model="createDateRange"
              type="datetimerange"
              :range-separator="$t('date.tip')"
              value-format="YYYY-MM-DD HH:mm:ss"
              :start-placeholder="$t('date.start')"
              :end-placeholder="$t('date.end')"
              :default-time="defaultTime"
              @change="createTimeChange"
            />&nbsp;
            <div
              class="select-time-btn"
              :class="{ 'is-active': createTimeActive === 1 }"
              @click="setDateRange(1, 'createTime')"
            >
              {{
                $t("date.t")
              }}
            </div>
            <div
              class="select-time-btn"
              :class="{ 'is-active': createTimeActive === 2 }"
              @click="setDateRange(2, 'createTime')"
            >
              {{
                $t("date.y")
              }}
            </div>
            <div
              class="select-time-btn"
              :class="{ 'is-active': createTimeActive === 3 }"
              @click="setDateRange(3, 'createTime')"
            >
              {{
                $t("date.n")
              }}
            </div>
            <div
              class="select-time-btn"
              :class="{ 'is-active': createTimeActive === 4 }"
              @click="setDateRange(4, 'createTime')"
            >
              {{
                $t("date.m")
              }}
            </div>
          </el-form-item>
        </div>
        <div class="input-row">
          <el-form-item :label="type === 1 ? $t('stock.outStockTime')+'：' : $t('stock.inStockTime')+'：'">
            <el-date-picker
              v-model="businessDateRange"
              type="datetimerange"
              :range-separator="$t('date.tip')"
              value-format="YYYY-MM-DD HH:mm:ss"
              :start-placeholder="$t('date.start')"
              :end-placeholder="$t('date.end')"
              :default-time="defaultTime"
              @change="businessTimeChange"
            />&nbsp;
            <div
              class="select-time-btn"
              :class="{ 'is-active': businessTimeActive === 1 }"
              @click="setDateRange(1, 'businessTime')"
            >
              {{
                $t("date.t")
              }}
            </div>
            <div
              class="select-time-btn"
              :class="{ 'is-active': businessTimeActive === 2 }"
              @click="setDateRange(2, 'businessTime')"
            >
              {{
                $t("date.y")
              }}
            </div>
            <div
              class="select-time-btn"
              :class="{ 'is-active': businessTimeActive === 3 }"
              @click="setDateRange(3, 'businessTime')"
            >
              {{
                $t("date.n")
              }}
            </div>
            <div
              class="select-time-btn"
              :class="{ 'is-active': businessTimeActive === 4 }"
              @click="setDateRange(4, 'businessTime')"
            >
              {{
                $t("date.m")
              }}
            </div>
          </el-form-item>
        </div>
        <div class="input-row">
          <el-form-item>
            <div class="text-btn-con">
              <el-button
                type="primary"
                @click="onSearch"
              >
                {{ $t('table.search') }}
              </el-button>
              <el-button
                v-permission="[type === 1 ? 'recSendManage:receiveList:export' : 'recSendManage:sendList:export']"
                type="primary"
                @click="exportStockLog()"
              >
                导出
              </el-button>
              <el-button @click="onResetSearch()">
                {{ $t('shop.resetMap') }}
              </el-button>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import moment from 'moment'
import http from '@/utils/request'

const props = defineProps({
  searchFormProps: {
    type: Object,
    default: () => ({
      prodKeyType: 1, // 1：商品名称 2：商品编码
      prodKey: '', // 搜索商品关键词
      stockBillNo: '', // 单据编号
      sourceOrderNo: '', // 关联单号
      stockBillType: '', // 单据类型
      employeeId: '', // 制单员工id
      createStartTime: '', // 制单起始时间
      createEndTime: '', // 制单结束时间
      businessStartTime: '', // 出入库起始时间
      businessEndTime: '', // 出入库结束时间
      type: 0, // 1 出库 2 入库
      makerMobile: ''//  制单人手机号
    })
  },
  type: {
    default: 0,
    type: Number
  }
})
const emit = defineEmits(['searchChange', 'exportStockLog'])

const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59)
]
const createTimeActive = ref(0)
const businessTimeActive = ref(0)
const searchForm = ref({
  prodKeyType: 1, // 1：商品名称 2：商品编码
  prodKey: '', // 搜索商品关键词
  stockBillNo: '', // 单据编号
  sourceOrderNo: '', // 关联单号
  stockBillType: '', // 单据类型
  employeeId: '', // 制单员工id
  createStartTime: '', // 制单起始时间
  createEndTime: '', // 制单结束时间
  businessStartTime: '', // 出入库起始时间
  businessEndTime: '', // 出入库结束时间
  type: 0, // 1 出库 2 入库
  makerMobile: ''//  制单人手机号
})
const stockBillTypeInStrArr = [
  {
    stockBillType: 1, label: $t('stock.purchaseInStock')
  },
  {
    stockBillType: 2, label: $t('stock.returnToStorage')
  },
  {
    stockBillType: 3, label: $t('stock.otherEntries')
  },
  {
    stockBillType: 7, label: $t('stock.inventoryInitialization')
  },
  {
    stockBillType: 8, label: $t('stock.orderCancelled')
  },
  {
    stockBillType: 9, label: $t('stock.editStorage')
  },
  {
    stockBillType: 10, label: $t('stock.profitStorage')
  },
  {
    stockBillType: 12, label: '调拨入库'
  },
  {
    stockBillType: 15, label: '库存模式切换入库'
  },
  {
    stockBillType: 16, label: '秒杀补充库存'
  }
]
const stockBillTypeOutStrArr = [
  {
    stockBillType: 4, label: $t('stock.sellOut')
  },
  {
    stockBillType: 5, label: $t('stock.editOutBound')
  },
  {
    stockBillType: 6, label: $t('stock.otherOutbound')
  },
  {
    stockBillType: 11, label: $t('stock.lossOutBound')
  },
  {
    stockBillType: 13, label: '调拨出库'
  },
  {
    stockBillType: 14, label: '库存模式切换出库'
  },
  {
    stockBillType: 17, label: '卡券过期'
  }
]
const employeeList = ref([]) // 员工列表
const prodKeyArr = [
  { key: 1, label: $t('product.prodName'), inputTips: $t('stock.inputName') },
  { key: 2, label: $t('product.commodityCode'), inputTips: $t('stock.inputPartyCode') }
] // 商品筛选类型
const businessDetailType = ref([]) // 单据类型
const createDateRange = ref([]) // 制单时间范围
const businessDateRange = ref([]) // 入库时间范围

onMounted(() => {
  init()
})

const init = () => {
  searchForm.value = props.searchFormProps
  searchForm.value.type = props.type
  businessDetailType.value = props.type === 1 ? stockBillTypeOutStrArr : stockBillTypeInStrArr
  // 获取员工手机号列表
  getEmployeeList()
}
const getEmployeeList = () => {
  http({
    url: '/mall4cloud_admin/m/apply_shop/shop_user/list',
    method: 'get'
  }).then((data) => {
    employeeList.value = data
  })
}

const onSearch = () => {
  // 发送搜索事件
  emit('searchChange', searchForm.value)
}
const exportStockLog = () => {
  // 发送导出事件
  emit('exportStockLog')
}
const onResetSearch = () => {
  searchForm.value.prodKeyType = 1
  searchForm.value.prodKey = ''
  searchForm.value.stockBillNo = null
  searchForm.value.sourceOrderNo = ''
  searchForm.value.stockBillType = ''
  searchForm.value.employeeId = ''
  searchForm.value.createStartTime = ''
  searchForm.value.createEndTime = ''
  searchForm.value.businessStartTime = ''
  searchForm.value.businessEndTime = ''
  searchForm.value.makerMobile = ''
  createTimeActive.value = 0
  businessTimeActive.value = 0

  createDateRange.value = []
  businessDateRange.value = []
}
const prodKeyTypeChange = () => {
  searchForm.value.prodKey = ''
}
const createTimeChange = () => {
  if (!createDateRange.value || createDateRange.value.length === 0) {
    searchForm.value.createStartTime = null
    searchForm.value.createEndTime = null
  } else {
    searchForm.value.createStartTime = createDateRange.value[0]
    searchForm.value.createEndTime = createDateRange.value[1]
  }
}
const businessTimeChange = () => {
  if (!businessDateRange.value || businessDateRange.value.length === 0) {
    searchForm.value.businessStartTime = null
    searchForm.value.businessEndTime = null
  } else {
    searchForm.value.businessStartTime = businessDateRange.value[0]
    searchForm.value.businessEndTime = businessDateRange.value[1]
  }
}
/**
 * 根据选项设置时间
 * 1:今天 2:昨天 3: 近七天 4:近30天 5:近60天
 */
const setDateRange = (val, type) => {
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
  if (type === 'createTime') {
    createDateRange.value = [startTime, endTime]
    searchForm.value.createStartTime = startTime
    searchForm.value.createEndTime = endTime
    createTimeActive.value = val
  } else if (type === 'businessTime') {
    businessDateRange.value = [startTime, endTime]
    searchForm.value.businessStartTime = startTime
    searchForm.value.businessEndTime = endTime
    businessTimeActive.value = val
  }
}
// 只允许数字输入
const changeNumber = (searchFormData) => {
  const numReg = /^([0-9]|[1-9]\d+)(\.\d*)?$/
  if (numReg.test(searchFormData.sourceOrderNo)) {
    searchForm.value.sourceOrderNo = searchFormData.sourceOrderNo
  } else {
    searchForm.value.sourceOrderNo = null
  }
}
</script>

<style lang="scss" scoped>
.component-stock-bill-search-from {

  :deep(.el-form-item__content){
    flex-wrap: nowrap;
  }
  .select-time-btn {
    margin-left: 10px;
    display: inline-block;
    color: #606266;
    cursor: pointer;
    padding: 8px 15px;
    font-size: 12px;
    border: 1px solid #DCDFE6;
    background: #FFFFFF;
    line-height: 14px;
    border-radius: 2px;
  }

  .select-time-btn:hover {
    background: #FFFFFF;
    border-color: #155BD4;
    color: #155BD4;
  }

  :deep(.prod-key-type-select){
    width: 110px !important;

    .el-input{
      width: 110px !important;
    }

  }

}
</style>
