<template>
  <div class="mod-header component-path-analysis-header">
    <div class="base-section">
      <!-- native modifier has been removed, please confirm whether the function has been affected  -->
      <el-form
        :inline="true"
        :model="dataForm"
        class="form-inline"
        @submit.prevent
      >
        <!-- 头部统计时间栏start -->
        <!-- 已修改 -->
        <el-form-item>
          <div class="header-title">
            统计时间：
          </div>
          <div class="title-right">
            <el-select
              v-model="timeTypePar"
              style="width:100px;height: 15px;"
              @change="setDateRange()"
            >
              <el-option
                v-for="item in dateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="title-picker">
            <el-date-picker
              v-if="timeTypePar === 1 "
              v-model="preDay"
              style="width: 150px;"
              type="date"
              placeholder="选择日期"
              value-format="timestamp"
              :picker-options="PickerOptions"
              @change="changeDay"
            />
          </div>
          <div class="title-picker">
            <el-date-picker
              v-if="timeTypePar === 2 "
              v-model="preWeek"
              style="width: 150px;"
              type="week"
              :picker-options="weekPickerOptions"
              :format="`yyyy 第 WW 周`"
              placeholder="选择周"
              @change="changeWeek"
            />
          </div>
          <div class="title-picker">
            <el-date-picker
              v-if="timeTypePar === 3 "
              v-model="preMonth"
              style="width: 150px;"
              type="month"
              :picker-options="monthPickerOptions"
              placeholder="选择月"
              value-format="timestamp"
              @change="changeMonth"
            />
          </div>
          <span
            v-if="(timeTypePar === 5 || timeTypePar === 6 || timeTypePar === 2) && startTime && endTime"
            class="title-time"
          >{{ startTime }} 至 {{ endTime }}</span>
        </el-form-item>
      </el-form>
      <!-- 头部统计时间栏end -->
    </div>
  </div>
</template>

<script setup>
import moment from 'moment'

const dataForm = reactive({
  group: 0,
  status: 0
})
// 对可选日进行判断
const PickerOptions = reactive({
  disabledDate (time) {
    const date = moment().add(-1, 'days')
    return (
      time.getTime() > date.valueOf() //  之后不可选
    )
  }
})
const weekPickerOptions = reactive({
  disabledDate (time) {
    return (
      time > moment().add(-1, 'week').endOf('week')
    )
  }
})
// 对可选月数进行判断
const monthPickerOptions = reactive({
  disabledDate (time) {
    const month1 = moment().startOf('month').valueOf()
    return (
      time.getTime() > month1 //  time.getTime返回无法选中的区间，但大于当前时间时month1
    )
  }
})
const dateOptions = [
  {
    label: '自然日',
    value: 1
  },
  {
    label: '自然周',
    value: 2
  },
  {
    label: '自然月',
    value: 3
  },
  {
    label: '近 7 天',
    value: 5
  },
  {
    label: '近 30 天',
    value: 6
  }
]

defineProps({
  timeType: {
    type: Number,
    default: 5
  },
  start: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['update:timeType', 'update:start'])

const timeTypePar = ref(1) // 时间下拉选择框的几种范围
const startTime = ref('')
const endTime = ref('')
onMounted(() => {
  timeTypePar.value = 5
  startTime.value = moment().add(-7, 'days').startOf('day').format('L')
  endTime.value = moment().add(-1, 'days').endOf('day').format('L')

  emit('update:timeType', timeTypePar.value)
  emit('update:start', 5)
})

const preDay = ref('')
const preWeek = ref('')
const preMonth = ref('') // 前一个月
/**
 * 1:自然日  2:自然周 3:自然月 4:今日实时 5:近七天 6:近30天
 */
const setDateRange = () => {
  let start = 0
  const date = new Date()
  if (timeTypePar.value === 1) {
    start = moment(date).add(-1, 'days').startOf('days').valueOf()
    preDay.value = start
  } else if (timeTypePar.value === 2) {
    start = moment(date).add(-1, 'week').startOf('week').valueOf()
    preWeek.value = start
    startTime.value = moment(start).startOf('week').format('L')
    endTime.value = moment(start).endOf('week').format('L')
  } else if (timeTypePar.value === 3) {
    start = moment(date).add(-1, 'month').startOf('month').valueOf()
    preMonth.value = start
  } else if (timeTypePar.value === 5) {
    start = timeTypePar.value
    startTime.value = moment().add(-7, 'days').startOf('day').format('L')
    endTime.value = moment().add(-1, 'days').endOf('day').format('L')
  } else if (timeTypePar.value === 6) {
    start = timeTypePar.value
    startTime.value = moment().add(-30, 'days').startOf('day').format('L')
    endTime.value = moment().add(-1, 'days').endOf('day').format('L')
  }

  emit('update:timeType', timeTypePar.value)
  emit('update:start', start)
}
const changeDay = () => {
  emit('update:timeType', timeTypePar.value)
  emit('update:start', preDay.value)
}
const changeWeek = () => {
  emit('update:timeType', timeTypePar.value)
  emit('update:start', preWeek.value ? preWeek.value.getTime() : null)

  startTime.value = preWeek.value ? moment(preWeek.value).startOf('week').format('L') : null
  endTime.value = preWeek.value ? moment(preWeek.value).endOf('week').format('L') : null
}

const changeMonth = () => {
  emit('update:timeType', timeTypePar.value)
  emit('update:start', preMonth.value)
}

</script>

<style lang="scss" scoped>
.component-path-analysis-header {
  .base-section {
    padding: 10px;
    background-color: #f7f8fa;
    margin-bottom: 16px;
  }
  // 栏目标题行
  .header-title {
    display: inline-block;
  }
  .form-inline {
    margin-left: 0;
    margin-bottom: 0;
  }
  .title-right {
    text-align: right;
    display: inline;
    width: 20%;
    margin-right: 5px;
  }
  .title-picker {
    display: inline;
  }
  .title-time {
    color: #999999;
    vertical-align: middle;
    margin-left: 5px;
    font-size: 12px;
  }
}
</style>
