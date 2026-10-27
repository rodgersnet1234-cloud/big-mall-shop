<template>
  <div class="page-popup-ad-add-or-update">
    <div class="new-page-title">
      <div class="line" />
      <div class="text">
        {{ title }}
      </div>
    </div>

    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      class="form-box"
      label-width="auto"
      @submit.prevent
    >
      <!--套餐名称-->
      <el-form-item
        label="弹窗名称"
        prop="popupName"
        required
      >
        <el-input
          v-model="dataForm.popupName"
          :disabled="readonly"
          show-word-limit
          maxlength="20"
          style="width: 355px"
          :placeholder="'弹窗名称'"
          @blur="dataForm.popupName=dataForm.popupName.trim()"
        />
      </el-form-item>
      <el-form-item
        label="触发页面"
        prop="pageType"
        required
      >
        <!-- 1.平台首页 2.会员中心 3.支付成功 4.店铺首页 5.商品详情" -->
        <el-radio-group
          v-model="dataForm.pageType"
          :disabled="readonly"
        >
          <el-radio :label="4">
            店铺首页
          </el-radio>
          <el-radio :label="5">
            商品详情
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="jumpUrl"
        required
      >
        <template #label>
          <div class="custom-label">
            <span class="label">跳转页面</span>
            <el-tooltip placement="top">
              <template #content>
                跳转路径为优惠券时，将显示系统配置的优惠券领取页面
              </template>
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <div
          :class="['jumpurl-box',{disabled:readonly}]"
          @click="onHaneleJumpurl"
        >
          <template v-if="dataForm.jumpUrl">
            <span class="select-type"> {{ jumpUrlType[dataForm.jumpUrl.type] }}</span>
            <span class="select">{{ dataForm.jumpUrl.name }}</span>
          </template>
          <span
            v-else
            class="no-select"
          >请选择跳转路径</span>
        </div>
      </el-form-item>
      <el-form-item
        v-if="dataForm.jumpUrl?.type!=='7'"
        label="弹窗图片"
        prop="popupPic"
        required
      >
        <img-upload
          v-model="dataForm.popupPic"
          class="upload-box"
          :disabled="readonly"
          @update:model-value="onValidateField('popupPic')"
        />
      </el-form-item>
      <el-form-item
        label="推送用户"
        prop="userType"
        required
      >
        <!-- 推送用户类型 0.所有用户 1.免费会员 2.付费会员 3.店铺客户 -->
        <el-radio-group
          v-model="dataForm.userType"
          :disabled="readonly"
        >
          <el-radio :label="0">
            所有用户
          </el-radio>
          <el-radio :label="3">
            店铺客户
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!--推送时间-->
      <el-form-item
        label="推送时间"
        :required="true"
      >
        <div class="date-picker">
          <!--开始时间-->
          <el-form-item prop="startTime">
            <el-date-picker
              v-model="dataForm.startTime"
              :disabled="curPageType===2 || popupStatus !==1"
              type="date"
              style="width:140px"
              :placeholder="'选择开始日期'"
              value-format="YYYY-MM-DD"
              @change="onChangeDatePicker"
            />
            <el-time-select
              v-model="startTimeValue"
              :class="[startTimeValue ? 'select-time': '']"
              start="00:00"
              step="00:30"
              end="23:30"
              style="width:114px"
              :disabled="curPageType===2 || popupStatus !==1"
              placeholder="开始时间"
              @change="onChangeTime"
            />
          </el-form-item>
          <span style="margin: 0 10px">-</span>
          <!--结束时间-->
          <el-form-item prop="endTime">
            <el-date-picker
              v-model="dataForm.endTime"
              :disabled="readonly"
              type="date"
              style="width:140px"
              :placeholder="'选择结束日期'"
              value-format="YYYY-MM-DD"
              @change="onChangeDatePicker"
            />
            <el-time-select
              v-model="endTimeValue"
              :class="[endTimeValue ? 'select-time': '']"
              start="00:00"
              step="00:30"
              end="23:30"
              style="width:114px"
              :disabled="readonly"
              placeholder="结束时间"
              @change="onChangeTime"
            />
          </el-form-item>
        </div>
      </el-form-item>
      <!-- 推送频次 -->
      <el-form-item
        prop="pushFrequency"
        :required="true"
      >
        <template #label>
          <div class="custom-label">
            <span class="label">推送频次</span>
            <el-tooltip placement="top">
              <template #content>
                跳转路径为优惠券时，如用户已领取过该优惠券则不再推送，如用户未领取，则按照设定的推送频次进行推送
              </template>
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
        </template>
        <!-- 推送频次 0.永久一次 1.每次进入 2.自定义频次 -->
        <el-radio-group
          v-model="dataForm.pushFrequency"
          :disabled="readonly"
        >
          <el-radio :label="0">
            永久一次
          </el-radio>
          <el-radio :label="1">
            每次进入
          </el-radio>
          <el-radio :label="2">
            自定义频次
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 自定义频次 -->
      <el-form-item
        v-if="dataForm.pushFrequency===2"
        label="自定义频次"
        :required="true"
      >
        <div class="custom-frequency-box">
          <el-radio-group
            v-model="frequencyType"
            :disabled="readonly"
          >
            <el-radio :label="1">
              天
            </el-radio>
            <el-radio :label="2">
              周
            </el-radio>
          </el-radio-group>
          <div
            v-if="frequencyType===1"
            class="day-push frequency"
          >
            <span>每</span>
            <el-input
              v-model="dataForm.dayFrequency"
              maxlength="3"
              style="width: 44px;margin: 0 8px;"
              placeholder=""
              :disabled="readonly"
              @blur="onBlurDayFrequency"
              @input="dataForm.dayFrequency = dataForm.dayFrequency.replace(/[^\d]/g,'')"
            />
            <span>天推送一次</span>
          </div>
          <div
            v-if="frequencyType===2"
            class="week-push frequency"
          >
            <span>每</span>
            <el-checkbox-group
              v-model="dataForm.weekFrequency"
              class="checkbox-group-box"
              :disabled="readonly"
            >
              <el-checkbox
                v-for="week in weekList"
                :key="week.value"
                :label="week.value"
                :disabled="week.disabled"
              >
                {{ week.label }}
              </el-checkbox>
            </el-checkbox-group>
            <span>推送一次</span>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          @click="onBack"
        >
          返回
        </el-button>
        <el-button
          v-if="curPageType !== 2 && popupStatus !==3"
          type="primary"
          @click="onSubmit"
        >
          确定
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 选择跳转路径 -->
    <decorate-dialog-select
      :dialog-visible="jumpUrlDialogVisible"
      :device-type="'mobile'"
      :current-select-type="[1, 2, 4, 5, 6, 7]"
      :custom-link-arr="dataForm.jumpUrl"
      @handle-close="jumpUrlDialogVisible=false"
      @handle-dialog-submit="handleDialogSubmit"
    />
  </div>
</template>

<script setup>
import * as api from '@/api/popup-ad/index.js'
import moment from 'moment'
import { ElMessage } from 'element-plus'
import decorateDialogSelect from '@/components/decorate-dialog-select/index.vue' // 选择商品

const startTimeValue = ref('')
const endTimeValue = ref('')

const dataForm = reactive({
  userType: 0, // 推送用户类型 0.所有用户 1.免费会员 2.付费会员 3.店铺客户
  pageType: 4, // 触发页面类型 1.平台首页 2.会员中心 3.支付成功 4.店铺首页 5.商品详情"
  pushFrequency: 0, // 推送频次 0.永久一次 1.每次进入 2.自定义频次
  weekFrequency: []
})

const readonly = computed(() => curPageType.value === 2 || popupStatus.value === 3)

const route = useRoute()
const curPageType = ref(0) // 0新增 1编辑 2查看
const title = ref('')
let popupId = 0
onMounted(() => {
  popupId = route.query.popupId || 0
  curPageType.value = Number(route.query.pageType) || 0
  title.value = ['新增弹窗广告', '编辑弹窗广告', '查看弹窗广告'][curPageType.value]
  useCommonStore().replaceSelectMenu(title.value)
  if (popupId) {
    getDataInfo()
  } else {
    const datetimeRange = getDateTimeRange()
    dataForm.startTime = datetimeRange.startTime
    dataForm.endTime = datetimeRange.endTime
    startTimeValue.value = datetimeRange.currentTime
    endTimeValue.value = datetimeRange.currentTime
    onHandleWeekFrequency()
  }
})

// 获取弹窗信息
const popupStatus = ref(1) // 弹窗状态 1.未开始 2.投放中 3.已结束
const getDataInfo = () => {
  api.get(popupId).then(data => {
    data.jumpUrl = JSON.parse(data.jumpUrl)
    startTimeValue.value = data.startTime ? data.startTime.substring(11, data.startTime.length - 3) : ''
    endTimeValue.value = data.endTime ? data.endTime.substring(11, data.endTime.length - 3) : ''
    data.startTime = data.startTime?.substring(0, 10) || ''
    data.endTime = data.endTime?.substring(0, 10) || ''
    popupStatus.value = data.status
    if (data.weekFrequency) {
      frequencyType.value = 2
      data.weekFrequency = data.weekFrequency.split(',').map(Number)
    } else {
      frequencyType.value = 1
      data.weekFrequency = []
    }
    Object.assign(dataForm, data)
    // 处理商品名称回显
    if (dataForm.jumpUrl.type == '1') {
      dataForm.jumpUrl.name = data.spuName
    }
    onHandleWeekFrequency()
  })
}

// 自定义频率类型
const frequencyType = ref(1) // 1.天 2.周
const weekList = reactive([
  {
    label: '周一',
    value: 2,
    disabled: false
  },
  {
    label: '周二',
    value: 3,
    disabled: false
  },
  {
    label: '周三',
    value: 4,
    disabled: false
  },
  {
    label: '周四',
    value: 5,
    disabled: false
  },
  {
    label: '周五',
    value: 6,
    disabled: false
  },
  {
    label: '周六',
    value: 7,
    disabled: false
  },
  {
    label: '周日',
    value: 1,
    disabled: false
  }
])

// 天频次处理
const onBlurDayFrequency = () => {
  if (dataForm.dayFrequency < 1) {
    dataForm.dayFrequency = 1
  } else if (dataForm.dayFrequency > 31) {
    dataForm.dayFrequency = 31
  }
}

const onChangeDatePicker = () => {
  onChangeTime()
  onHandleWeekFrequency()
}
// 周频次处理
const onHandleWeekFrequency = () => {
  if (!dataForm.startTime || !dataForm.endTime) {
    onHandleWeekList()
    return
  }
  const diffDays = Number(moment(dataForm.endTime).diff(moment(dataForm.startTime), 'days')) + 1
  if (diffDays >= 7) {
    onHandleWeekList()
    return
  }
  const weeks = []
  for (let i = 0; i < diffDays; i++) {
    const week = moment(dataForm.startTime).add(i, 'd').days()
    weeks.push(week === 0 ? 1 : week + 1)
  }
  onHandleWeekList(weeks)
}
const onHandleWeekList = (weeks = [1, 2, 3, 4, 5, 6, 7]) => {
  dataForm.weekFrequency = dataForm.weekFrequency.filter(f => weeks.includes(f))
  weekList.forEach(item => {
    if (weeks.includes(item.value)) {
      item.disabled = false
    } else {
      item.disabled = true
    }
  })
}

// 跳转页面选取
const jumpUrlType = ['', '商品', '分类', '店铺', '页面', '微页面', '自定义链接', '优惠券']
const jumpUrlDialogVisible = ref(false) // 弹窗显示隐藏
const onHaneleJumpurl = () => {
  if (readonly.value) return
  jumpUrlDialogVisible.value = true
}
const handleDialogSubmit = ({ type, value }) => {
  let obj = {
    name: '',
    link: '',
    type: ''
  }
  switch (Number(type)) {
    case 1: // 商品
      obj = {
        name: value.goodsItem.spuName, // 商品名称
        link: value.goodsItem.spuId, // 商品id
        type: '1'
      }
      break
    case 2: // 分类
      obj = {
        name: value.categoryItem.label, // 分类名字[三级分类的最后的名字]
        link: value.categoryItem.data, // 分类的数据(数组)
        type: '2'
      }
      break
    case 3: // 店铺
      obj = {
        name: value.storeItem.shopName, // 店铺名
        link: value.storeItem.shopId, // 店铺id
        type: '3'
      }
      break
    case 4: // 页面
      obj = {
        name: value.pageItem.title,
        link: value.pageItem.link,
        type: '4'
      }
      break
    case 5: // 微页面
      obj = {
        name: value.smallPageItem.name, // 微页面名
        link: value.smallPageItem.renovationId,
        type: '5'
      }
      break
    case 6: // 自定义链接
      obj = {
        name: value.customLink.url,
        link: value.customLink,
        type: '6'
      }
      break
    case 7: // 优惠券
      obj = {
        name: value.couponsItem.couponName,
        link: value.couponsItem.couponId,
        type: '7'
      }
      break
    default:
      break
  }
  dataForm.jumpUrl = obj
  jumpUrlDialogVisible.value = false
  onValidateField('jumpUrl')
}
// 表单提交
const dataFormRef = ref(null)
const router = useRouter()
let isSubmit = false
const onSubmit = () => {
  if (isSubmit) {
    return
  }
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      dataForm.startTime = dataForm.startTime + ' ' + startTimeValue.value + ':00'
      dataForm.endTime = dataForm.endTime + ' ' + endTimeValue.value + ':00'
      if (dataForm.pushFrequency === 2) {
        if (frequencyType.value === 1 && !dataForm.dayFrequency) {
          return ElMessage({
            message: '请填写正确的频次天数',
            type: 'error',
            duration: 1500
          })
        }
        if (frequencyType.value === 2 && !dataForm.weekFrequency.length) {
          return ElMessage({
            message: '请选择频次周数',
            type: 'error',
            duration: 1500
          })
        }
      }
      const submitData = JSON.parse(JSON.stringify(dataForm))
      if (frequencyType.value === 1) {
        submitData.dayFrequency = Number(dataForm.dayFrequency)
        submitData.weekFrequency = null
      } else {
        submitData.dayFrequency = null
        submitData.weekFrequency = submitData.weekFrequency?.toString()
      }
      submitData.popupPic = submitData.jumpUrl.type === '7' ? '' : submitData.popupPic
      submitData.jumpUrl = JSON.stringify(submitData.jumpUrl)
      let methods = 'save'
      if (dataForm.popupId) {
        methods = 'update'
      }
      isSubmit = true
      api[methods](submitData).then(() => {
        ElMessage({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            isSubmit = false
            onBack()
          }
        })
      }).catch(() => {
        isSubmit = false
      })
    }
  })
}

const onChangeTime = () => {
  onValidateField('startTime')
  onValidateField('endTime')
}

const onValidateField = (field) => {
  dataFormRef.value?.validateField(field)
}

const validateTime = (rule, value, callback) => {
  if (rule.field === 'startTime' && (!startTimeValue.value || !dataForm.startTime)) {
    callback(new Error('开始时间不能为空'))
  }
  if (rule.field === 'endTime' && (!endTimeValue.value || !dataForm.endTime)) {
    callback(new Error('结束时间不能为空'))
  }
  if (popupStatus.value !== 1 && rule.field === 'startTime') {
    callback()
  }
  const startTime = dataForm.startTime + ' ' + startTimeValue.value + ':00'
  const endTime = dataForm.endTime + ' ' + endTimeValue.value + ':00'
  const seFlag = dataForm.startTime && dataForm.endTime
  if (popupStatus.value !== 1 && rule.field === 'endTime' && new Date() > Date.parse(endTime)) {
    callback(new Error('结束时间不能少于当前时间'))
  }
  if (rule.field === 'startTime' && new Date() > Date.parse(startTime)) {
    callback(new Error('开始时间不能少于当前时间'))
  }
  if (rule.field === 'startTime' && seFlag && Date.parse(startTime) >= Date.parse(endTime)) {
    callback(new Error('开始时间不能大于或等于结束时间'))
  }
  if (rule.field === 'endTime' && seFlag && Date.parse(startTime) >= Date.parse(endTime)) {
    callback(new Error('结束时间不能小于或等于开始时间'))
  }
  callback()
}

const dataRule = reactive({
  popupName: [
    { required: true, message: '弹窗名称不能为空', trigger: 'blur' }
  ],
  popupPic: [
    { required: true, message: '弹窗图片不能为空', trigger: 'blur' }
  ],
  jumpUrl: [
    { required: true, message: '跳转页面不能为空', trigger: 'blur' }
  ],
  startTime: [
    { required: true, message: '开始时间不能为空', trigger: 'blur' },
    { validator: validateTime, trigger: 'blur' }
  ],
  endTime: [
    { required: true, message: '结束时间不能为空', trigger: 'blur' },
    { validator: validateTime, trigger: 'blur' }
  ]
})

const onBack = () => {
  router.replace('/multishop-feature/feature-popup-ad')
}

</script>
<style lang="scss" scoped>
@use './add-or-update.scss';
</style>
