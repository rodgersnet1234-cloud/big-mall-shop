<template>
  <div class="component-take-stock-search-form search-bar">
    <el-form
      ref="searchFormRef"
      :inline="true"
      class="search-form"
      :model="searchFormProps"
      label-width="auto"
      @submit.prevent
    >
      <!-- 表单项 -->
      <div class="input-row">
        <el-form-item label="商品筛选:">
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
            v-model="searchForm.prodKey"
            style="width:200px"
            type="text"
            :placeholder="searchForm.prodKeyType === 1 ? '输入名称' : '输入编码'"
          />
        </el-form-item>
        <el-form-item label="盘点单号:">
          <el-input
            v-model="searchForm.takeStockNo"
            type="text"
            placeholder="盘点单号"
          />
        </el-form-item>
        <el-form-item label="盘点状态:">
          <el-select v-model="searchForm.billStatus">
            <el-option
              label="已作废"
              value="0"
            />
            <el-option
              label="盘点中"
              value="1"
            />
            <el-option
              label="已完成"
              value="2"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="制单人:">
          <el-select v-model="searchForm.maker">
            <el-option
              v-for="node in employeeList"
              :key="node.shopUserId"
              :label="node.nickName"
              :value="node.shopUserId"
            />
          </el-select>
        </el-form-item>
      </div>
      <div class="input-row">
        <el-form-item label="盘点时间:">
          <el-date-picker
            v-model="createDateRange"
            type="datetimerange"
            range-separator="至"
            value-format="YYYY-MM-DD HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="defaultTime"
            @change="createTimeChange"
          />&nbsp;
          <div
            class="select-time-btn"
            :class="{ 'is-active': createTimeActive === 1 }"
            @click="setDateRange(1)"
          >
            今日
          </div>
          <div
            class="select-time-btn"
            :class="{ 'is-active': createTimeActive === 2 }"
            @click="setDateRange(2)"
          >
            昨日
          </div>
          <div
            class="select-time-btn"
            :class="{ 'is-active': createTimeActive === 3 }"
            @click="setDateRange(3)"
          >
            近7天
          </div>
          <div
            class="select-time-btn"
            :class="{ 'is-active': createTimeActive === 4 }"
            @click="setDateRange(4)"
          >
            近30天
          </div>
        </el-form-item>
        <el-form-item>
          <div class="text-btn-con">
            <el-button
              type="primary"
              @click="onSearch"
            >
              搜索
            </el-button>
            <el-button
              type="primary"
              @click="confirmExport"
            >
              导出
            </el-button>
            <el-button @click="resetForm()">
              重置
            </el-button>
          </div>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import moment from 'moment'
import * as api from '@/api/multishop/shop-user'

const props = defineProps({
  searchFormProps: {
    type: Object,
    default: () => ({
      takeStockNo: '', // 盘点单号
      billStatus: '', // 盘点状态 0已作废 1盘点中 2已完成
      maker: '', // 制单人id
      prodKeyType: 1, // 1：商品名称 2：商品编码
      prodKey: '', // 搜索商品关键词(0:商品名称 1：商品编码)
      startTime: '', // 制单起始时间
      endTime: '', // 制单结束时间
      spuName: '',
      partyCode: ''
    })
  }
})
const emit = defineEmits(['onSearch', 'confirmExport', 'searchChange'])
const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59)
]
const createTimeActive = ref(0)
const searchForm = ref({})
const employeeList = ref([]) // 员工列表
const prodKeyArr = ref([
  { key: 1, label: '商品名称', inputTips: '输入名称' },
  { key: 2, label: '商品编码', inputTips: '输入编码' }
]) // 商品筛选类型
const createDateRange = ref([]) // 制单时间范围

onMounted(() => {
  init()
})

const init = () => {
  searchForm.value = props.searchFormProps
  searchForm.value.type = props.type
  searchForm.value.prodKeyType = props.searchFormProps.prodKeyType
  // 获取员工列表
  getEmployeeList()
}
const getEmployeeList = () => {
  api.page({ pageSize: 10000, pageNum: 1 }).then((data) => {
    employeeList.value = data.list
  })
}
const onSearch = () => {
  // 发送搜索事件
  emit('searchChange')
}
const confirmExport = () => {
  // 发送导出事件
  emit('confirmExport')
}
const resetForm = () => {
  searchForm.value.takeStockNo = '' // 盘点单号
  searchForm.value.billStatus = '' // 盘点状态 0已作废 1盘点中 2已完成
  searchForm.value.maker = '' // 制单人ID
  searchForm.value.prodKeyType = 1 // 1：商品名称 2：商品编码
  searchForm.value.prodKey = '' // 搜索商品关键词(0:商品名称 1：商品编码)
  searchForm.value.createStartTime = '' // 盘点起始时间
  searchForm.value.createEndTime = '' // 盘点结束时间
  createDateRange.value = [] // 盘点时间
}
const prodKeyTypeChange = () => {
  searchForm.value.prodKey = ''
}
const createTimeChange = () => {
  searchForm.value.createStartTime = createDateRange.value[0]
  searchForm.value.createEndTime = createDateRange.value[1]
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
  searchForm.value.createStartTime = startTime
  searchForm.value.createEndTime = endTime
  createTimeActive.value = val
}

</script>
<style lang="scss" scoped>
.component-take-stock-search-form {
  .select-time-btn {
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

  :deep(.el-form-item__content .screen) {
    width: 110px;
  }

  .select-time-btn:hover {
    background: #FFFFFF;
    border-color: #155BD4;
    color: #155BD4;
  }
}
</style>
