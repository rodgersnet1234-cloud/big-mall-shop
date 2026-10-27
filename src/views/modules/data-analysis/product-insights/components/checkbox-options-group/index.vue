<template>
  <!-- 复选框选项组 -->
  <div class="component-checkbox-options-group">
    <!-- 选项 -->
    <div class="data-radio">
      <!-- 分组 -->
      <div class="select-box">
        <div class="select-item">
          <span>时间：</span>
          <el-select
            v-model="value2"
            placeholder="请选择"
            @change="setDateRange(value2)"
          >
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-date-picker
            v-if="value2 === 1"
            v-model="natureDay"
            type="date"
            placeholder="选择日期"
            :disabled-date="PickerOptions.disabledDate"
            :clearable="false"
            @change="getNatureDay(natureDay)"
          />
          <el-date-picker
            v-if="value2 === 3"
            v-model="naturalMonth"
            type="month"
            placeholder="选择日期"
            :disabled-date="monthPickerOptions.disabledDate"
            :clearable="false"
            @change="getnaturalMonth(naturalMonth)"
          />
          <div v-if="value2 === 4">
            <span class="real-time">{{ endTime }}</span>
            <el-button
              type="primary"
              link
              @click="setDateRange(value2)"
            >
              刷新
            </el-button>
          </div>
          <div v-if="value2 === 5 || value2 === 6">
            <span class="real-time">{{ startTime }} 至 {{ endTime }}</span>
          </div>
        </div>
      </div>

      <el-checkbox-group v-model="checkList">
        <!-- 浏览访问 -->
        <div class="item browse-visits">
          <span class="tit">销售指标：</span>
          <div class="radio-group">
            <!-- native modifier has been removed, please confirm whether the function has been affected  -->
            <el-checkbox
              v-for="(item,index) in salesTargets"
              :key="index"
              :label="index"
              :disabled="list.length>=8 && showTableList(index)"
              @change="addColumn(index)"
            >
              {{ item }}
            </el-checkbox>
          </div>
        </div>

        <!-- 引导转化 -->
        <div class="item conversions">
          <span class="tit">服务指标：</span>
          <div class="radio-group">
            <!-- native modifier has been removed, please confirm whether the function has been affected  -->
            <el-checkbox
              v-for="(item,index) in serviceIndicators"
              :key="'serviceIndicators'+index"
              :label="10+index"
              :disabled="list.length>=8 && showTableList(10+index)"
              @change="addColumn(10+index)"
            >
              {{ item }}
            </el-checkbox>
          </div>
        </div>
      </el-checkbox-group>
      <div class="check-list">
        <span class="red">最多选择8项</span>&nbsp;已选择<span class="mark">&nbsp;{{ checkList.length }}&nbsp;</span>/8&nbsp;个指标
      </div>
    </div>
  </div>
</template>

<script setup>
import moment from 'moment'

const emit = defineEmits([
  'handleTable',
  'getTimeList',
  'getGroupList',
  'getStatusList'
])

const checkList = ref([0, 1, 9, 10, 12])
const options2 = [
  {
    value: 4,
    label: '今日实时'
  },
  {
    value: 5,
    label: '近7天'
  },
  {
    value: 6,
    label: '近30天'
  },
  {
    value: 1,
    label: '自然日'
  },
  {
    value: 3,
    label: '自然月'
  }
]
const value2 = ref(5)
const salesTargets = reactive(['曝光次数', '曝光人数', '加购人数', '加购件数', '下单人数', '支付人数', '下单件数', '支付件数', '下单金额', '支付金额'])
const serviceIndicators = reactive(['申请退款订单数', '申请退款人数', '成功退款订单数', '成功退款人数', '成功退款金额', '退款率'])
const PickerOptions = reactive({
  disabledDate (time) {
    const date = moment().add(-1, 'days').startOf('day')
    return (
      time.getTime() > date.valueOf()
    )
  }
})
const monthPickerOptions = {
  disabledDate (time) {
    const month1 = moment().startOf('month')
    return (
      time.getTime() > month1.valueOf()
    )
  }
}

const list = reactive([0, 1, 9, 10, 12])
const showTableList = (index) => {
  return list.indexOf(index) === -1
}

onMounted(() => {
  emit('handleTable', list)
})

const startTime = ref(moment().add(-7, 'd').format('YYYY-MM-DD HH:mm:ss'))
const endTime = ref(moment().format('YYYY-MM-DD HH:mm:ss'))
// 获取某一天的时间
const getNatureDay = (natureDayPar) => {
  startTime.value = moment(natureDayPar).startOf('day').format('YYYY-MM-DD HH:mm:ss')
  endTime.value = moment(natureDayPar).endOf('day').format('YYYY-MM-DD HH:mm:ss')
  const param = {
    startTime: startTime.value,
    endTime: endTime.value,
    value: value2
  }
  emit('getTimeList', param)
}

// 获取月份
const getnaturalMonth = (naturalMonthPar) => {
  startTime.value = moment(naturalMonthPar).startOf('month').format('YYYY-MM-DD HH:mm:ss')
  endTime.value = moment(naturalMonthPar).endOf('month').format('YYYY-MM-DD HH:mm:ss')
  const param = {
    startTime: startTime.value,
    endTime: endTime.value,
    value: value2
  }
  emit('getTimeList', param)
}

const naturalMonth = ref('')
const natureDay = ref('')
/**
 * 获取时间 4:实时 5: 近七天 6:近30天 1:自然日 3:自然月
 */
const getTime = (startDay, endDay, value) => {
  if (value === 4) {
    startTime.value = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
    endTime.value = moment().format('YYYY-MM-DD HH:mm:ss')
  } else if (value === 3) { // 默认选择前一月
    startTime.value = moment(new Date()).subtract(1, 'months').startOf('month').format('YYYY-MM-DD HH:mm:ss') // 每月的第一天的0点开始
    endTime.value = moment(new Date()).subtract(1, 'months').endOf('month').format('YYYY-MM-DD HH:mm:ss')
    naturalMonth.value = startTime.value
  } else {
    endTime.value = moment().add(startDay, 'd').format('YYYY-MM-DD HH:mm:ss')
    endTime.value = moment(endTime.value).endOf('day').format('YYYY-MM-DD HH:mm:ss') // 获取 23:59:59 点的时间
    startTime.value = moment().add(endDay, 'd').format('YYYY-MM-DD HH:mm:ss')
    startTime.value = moment(startTime.value).startOf('day').format('YYYY-MM-DD HH:mm:ss') // 获取 0 点的时间
    natureDay.value = startTime.value
  }
  const param = {
    startTime: startTime.value,
    endTime: endTime.value,
    value
  }
  emit('getTimeList', param)
}

/** 选择时间段
 * 4:实时 5: 近七天 6:近30天 1:自然日 3:自然月
 */
const setDateRange = (value) => {
  let startDay = 0
  let endDay = 0
  if (value === 4) {
    startDay = 0
    endDay = 0
  } else if (value === 6) {
    startDay = -1
    endDay = -30
  } else if (value === 5) {
    startDay = -1
    endDay = -7
  } else if (value === 1) {
    startDay = -1
    endDay = -1
  }
  getTime(startDay, endDay, value)
}

const addColumn = (index) => {
  if (list.indexOf(index) === -1) {
    if (list.length < 8) {
      list.push(index)
      emit('handleTable', list)
    }
  } else if (list.indexOf(index) !== -1) {
    list.splice(list.indexOf(index), 1)
    emit('handleTable', list)
  }
}

</script>

<style lang="scss" scoped>
.component-checkbox-options-group {
  // 选项
  .data-radio {
    display: block;
    padding: 30px 25px;
    font-size: 14px;
    background: #f7f8fa;

    .item {
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .tit {
        display: block;
        font-size: 14px;
        min-width: 70px;
      }
    }
    .item:first-child {
      margin-bottom: 30px;
    }
    .check-list {
      display: block;
      margin-top: 30px;
      margin-left: 70px;
      font-size: 12px;
      color: #999;

      .mark {
        color: #155bd4;
        font-weight: bold;
      }

      .red {
        color: #FF4141;
      }
    }
  }

  // 下拉框
  .data-radio {
    .select-box {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      margin-bottom: 30px;

      .select-item {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-right: 20px;

        .real-time {
          padding: 0 10px;
          color: #666;
        }
      }
    }
  }
}
</style>
