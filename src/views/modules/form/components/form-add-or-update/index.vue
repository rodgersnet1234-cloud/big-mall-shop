<template>
  <el-dialog
    v-model="visible"
    :title="dataForm.formId ? $t('table.edit'): $t('table.create')"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-position="right"
      label-width="110px"
      @submit.prevent
    >
      <el-form-item
        label="报表名称"
        prop="formName"
      >
        <el-input
          v-model="dataForm.formName"
          placeholder="请输入报表名称"
          maxlength="50"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item
        label="时间周期"
        prop="timeType"
      >
        <el-radio-group v-model="dataForm.timeType">
          <el-radio :label="1">
            自然日
          </el-radio>
          <el-radio :label="2">
            自然周
          </el-radio>
          <el-radio :label="3">
            自然月
          </el-radio>
        </el-radio-group>
        <el-tooltip
          effect="light"
          content="根据选择的类型，生成对应时间周期的报表"
          placement="top"
        >
          <el-icon><QuestionFilled /></el-icon>
        </el-tooltip>
      </el-form-item>
      <el-form-item
        label="时间格式"
        prop="timeFormat"
      >
        <el-radio-group v-model="dataForm.timeFormat">
          <el-radio :label="1">
            自定义时间
          </el-radio>
          <el-radio :label="2">
            指定时间范围
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="dataForm.timeFormat === 1"
        label="自定义时间"
        style="width:500px;"
        prop="time"
      >
        <el-date-picker
          v-if="dataForm.timeType === 1"
          v-model="dataForm.time"
          type="daterange"
          unlink-panels
          range-separator="-"
          :start-placeholder="$t('date.start')"
          :end-placeholder="$t('date.end')"
          :shortcuts="pickerOptions.shortcuts"
          :clearable="false"
          @input="dateRangeChange"
        />
        <el-date-picker
          v-else-if="dataForm.timeType === 3"
          v-model="dataForm.time"
          type="monthrange"
          unlink-panels
          range-separator="-"
          :start-placeholder="$t('date.start')"
          :end-placeholder="$t('date.end')"
          :shortcuts="pickerOptions.calendarMonth"
          :clearable="false"
          @input="dateRangeChange"
        />
        <el-date-picker
          v-else-if="dataForm.timeType === 2"
          v-model="dateWeek"
          type="week"
          :format="weekRangeFormat"
          :clearable="false"
          placeholder="选择周"
          @change="Week"
        />
      </el-form-item>
      <el-form-item
        v-if="dataForm.timeFormat === 2"
        label="时间范围"
        prop="timeRange"
        style="width:500px;"
      >
        <el-input
          v-model="dataForm.timeRange"
          placeholder="时间不能为空"
          @change="setTimeRange"
        >
          <template #prepend>
            近
          </template>
          <template #append>
            {{ dataForm.timeType === 1? '天' : dataForm.timeType === 2? '周' : '月' }}
            <el-tooltip
              class="item"
              effect="light"
              :content="timeRangeTips"
              placement="top"
            >
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="序号"
        prop="seq"
      >
        <el-input-number
          v-model="dataForm.seq"
          controls-position="right"
          :min="1"
          :max="100000000"
          step-strictly
          @blur="seqChange"
        />
      </el-form-item>
      <el-form-item
        label="选择指标"
        prop="formItem"
        label-width="110px"
      >
        <el-card
          class="box-card"
          body-style="padding: 18px;"
        >
          <div
            v-for="item in formItemList"
            :key="item.id"
            class="label-box"
          >
            <el-link
              v-if="!item.select"
              :underline="false"
              class="buttonClick"
              @click="selectItem(item.id,true)"
            >
              {{ item.value }}
            </el-link>
            <el-link
              v-else
              :underline="false"
              type="success"
              class="buttonClick"
              @click="selectItem(item.id,false)"
            >
              {{ item.value }}
            </el-link>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item>
        <el-tag
          v-for="item in formItemListSelect"
          :key="item.id"
          closable
          class="tag"
          type="info"
          @close="selectItem(item.id,false)"
        >
          {{ item.value }}
        </el-tag>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          @click="visible = false"
        >
          {{ $t('table.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="onSubmit()"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/form/form.js'
import moment from 'moment'
import { Debounce } from '@/utils/debounce.js'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

const dataForm = reactive({
  formId: 0,
  formName: '',
  timeType: 1,
  timeFormat: 1,
  formItemIds: '',
  startTime: '',
  endTime: '',
  timeRange: 1,
  time: '',
  seq: 1
})
const setDataForm = (val) => {
  dataForm.formId = val.formId
  dataForm.formName = val.formName
  dataForm.timeType = val.timeType
  dataForm.timeFormat = val.timeFormat
  dataForm.formItemIds = val.formItemIds
  dataForm.startTime = val.startTime
  dataForm.endTime = val.endTime
  dataForm.timeRange = val.timeRange
  dataForm.time = val.time
  dataForm.seq = val.seq
}

const timeRangeTips = computed(() => {
  if (dataForm.timeType === 1) {
    return '如选择近1天，则该报表会自动更新为当前天的数据，近2天，则该报表会自动更新为当前天 + 昨天的数据'
  } else if (dataForm.timeType === 2) {
    return '如选择近1周，则该报表会自动更新为当前周的数据，近2周，则该报表会自动更新为当前周 + 上周的数据'
  } else {
    return '如选择近1月，则该报表会自动更新为当前月的数据，近2月，则该报表会自动更新为当前月 + 上月的数据'
  }
})

const dateWeek = ref('')
// 自然周默认格式
const weekRangeFormat = ref('')
watch(() => dateWeek.value, (newVal) => {
  const startD = moment(newVal).format('YYYY-MM-DD')
  const endD = moment(startD).add(6, 'days').endOf('day').format('YYYY-MM-DD')
  weekRangeFormat.value = startD + ' - ' + endD
})

const pickerOptions = reactive({
  shortcuts: [{
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  }, {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  }, {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  }],
  calendarMonth: [{
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  }, {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  }]
})

const validateFormName = (rule, value, callback) => {
  if (!value.trim()) {
    callback(new Error('报表名称不能为空'))
  } else {
    callback()
  }
}
const validateNumber = (rule, value, callback) => {
  const reg = /\D/
  if (reg.test(value)) {
    callback(new Error('请输入大于0的数字'))
  } else {
    callback()
  }
}
const dataRule = reactive({
  formName: [
    { required: true, message: '报表名称不能为空', trigger: 'blur' },
    { validator: validateFormName, trigger: 'blur' }
  ],
  startTime: [
    { required: true, message: '开始时间不能为空', trigger: 'blur' }
  ],
  endTime: [
    { required: true, message: '结束时间不能为空', trigger: 'blur' }
  ],
  timeRange: [
    { required: true, message: '结束时间不能为空', trigger: 'blur' },
    { validator: validateNumber, trigger: 'blur' }
  ]
})

const visible = ref(false)
const formItemListSelect = ref([])
const dataFormRef = ref(null)
// 获取分类数据 formType true:推荐报表
const init = (id, fromType) => {
  visible.value = true
  dataForm.formId = id || 0
  nextTick(() => {
    dataForm.formName = ''
    dataForm.content = ''
    dataForm.fromType = 1
    dataForm.timeType = 1
    dataForm.timeFormat = 1
    dataForm.formItemIds = ''
    dataForm.timeRange = 1
    dataForm.seq = 1
    dataForm.time = ''
    dataForm.startTime = ''
    dataForm.endTime = ''
    formItemListSelect.value = []
    dataFormRef.value?.resetFields()
  })
  if (dataForm.formId) {
    // 获取产品数据
    api.get(dataForm.formId).then(data => {
      setDataForm(data)
      if (fromType) {
        dataForm.recommendForm = fromType
        dataForm.formId = 0
      }
      if (dataForm.timeType === 2) {
        dateWeek.value = dataForm.startTime
      } else {
        dataForm.time = dataForm.startTime && dataForm.endTime ? [moment(dataForm.startTime, 'YYYY-MM-DD'), moment(dataForm.endTime, 'YYYY-MM-DD')] : []
      }
      getFormItem()
    })
  } else {
    nextTick(() => {
      dataFormRef.value?.resetFields()
      dataForm.recommendForm = fromType
      dataForm.imgUrl = ''
    })
    getFormItem()
  }
}

const Week = () => {
  const date = new Date(dateWeek.value)
  dataForm.startTime = moment(date).format('YYYY-MM-DD hh:mm:ss')
  dataForm.endTime = moment(date).add(6, 'd').format('YYYY-MM-DD hh:mm:ss')
}

const seqChange = () => {
  if (!dataForm.seq) {
    dataForm.seq = 1
  }
}

const formItemList = ref([])
/**
 * 获取报表项数据
 */
const getFormItem = () => {
  api.getFormItem(1).then(data => {
    formItemList.value = data
    if (dataForm.formItemIds) {
      const ids = dataForm.formItemIds.split(',')
      formItemList.value.forEach(element => {
        if (ids.indexOf(element.id.toString()) > -1) {
          element.select = true
          formItemListSelect.value.push(element)
        }
      })
    }
  })
}

/**
 * 指定时间范围输入框验证
 */
const setTimeRange = () => {
  const num = Math.round(dataForm.timeRange)
  dataForm.timeRange = num < 1 ? 1 : num
  if (num >= 100000000) {
    dataForm.timeRange = 100000000
  }
}

/**
 * 选择开始时间/结束时间触发事件
 */
const dateRangeChange = (e) => {
  if (e) {
    dataForm.time = [e[0], e[1]]
  } else {
    dataForm.time = []
  }
}

/**
 * 选择报表项
 */
const selectItem = (id) => {
  formItemListSelect.value = []
  formItemList.value.forEach(element => {
    if (element.id === id) {
      element.select = !element.select
    }
    if (element.select) {
      formItemListSelect.value.push(element)
    }
  })
}

let isSubmit = true
// 表单提交
const onSubmit = Debounce(() => {
  dataForm.recommendForm = false
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      if (formItemListSelect.value.length < 1) {
        ElMessage.error('请选择指标')
        return
      }
      if (dataForm.timeFormat === 1) {
        if ((dataForm.timeType === 1 || dataForm.timeType === 3) && !dataForm.time) {
          ElMessage.error('请选择时间')
          return
        }
        if (dataForm.timeType === 2 && (!dataForm.startTime || !dataForm.endTime)) {
          ElMessage.error('请选择时间')
          return
        }
      }
      if (!isSubmit) {
        return true
      }
      if (dataForm.timeFormat === 1) {
        if (dataForm.timeType === 1 || dataForm.timeType === 3) {
          dataForm.startTime = moment(dataForm.time[0]).format('YYYY-MM-DD hh:mm:ss')
          dataForm.endTime = moment(dataForm.time[1]).format('YYYY-MM-DD hh:mm:ss')
        }
      }
      isSubmit = false
      dataForm.formItemIds = getFormItemIds()
      const param = dataForm
      const request = param.formId ? api.update(param) : api.save(param)
      request.then(() => {
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            isSubmit = true
            visible.value = false
            emit('refreshDataList')
            dataFormRef.value?.resetFields()
          }
        })
      }).catch(() => {
        isSubmit = true
      })
    }
  })
})

/**
 * 获取已选择的报表项id
 */
const getFormItemIds = () => {
  let ids = ''
  formItemListSelect.value.forEach(item => {
    ids = ids + item.id + ','
  })
  ids = ids.substring(0, ids.length - 1)
  return ids
}

defineExpose({
  init
})

</script>
<style lang="scss" scoped>
.label-box {
  display: inline-flex;
  min-width: 105px;
  margin: 0 18px;
}
.tag {
  margin: 0 10px 5px;
}
.box-card {
  display: flex;
  flex-wrap: wrap;
  .card-item {
    min-width: 120px;
  }
}
</style>
