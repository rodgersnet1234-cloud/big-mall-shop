<template>
  <div class="coupon-manage">
    <el-dialog
      v-model="visible"
      :title="dataForm.couponId? $t('table.edit'): $t('table.create')"
      :close-on-click-modal="false"
      top="4vh"
      width="670px"
    >
      <el-form
        ref="dataFormRef"
        :rules="dataRule"
        :model="dataForm"
        label-width="140px"
        @submit.prevent
      >
        <!-- 优惠券名称 -->
        <el-form-item
          class="clear-bom"
          :label="$t('coupon.coupon.couponName')"
          prop="couponName"
        >
          <el-input
            v-model="dataForm.couponName"
            maxlength="20"
            show-word-limit
            :placeholder="$t('coupon.coupon.couponName')"
            :disabled="dataForm.couponId !== 0"
          />
        </el-form-item>
        <!-- 优惠券投放状态(-1:取消投放 0:等待投放 1:投放 2:违规下架 3:等待审核) -->
        <el-form-item
          :label="$t('coupon.coupon.putonStatus')"
          prop="putonStatus"
        >
          <el-radio-group
            v-model="dataForm.putonStatus"
            :disabled="(dataForm.couponId !== 0 && dataForm.status === 0 && (dataForm.putonStatus > 1 || dataForm.putonStatus === -1)) || dataForm.putonStatus === 2 || dataForm.putonStatus === 3"
          >
            <el-radio :label="0">
              自动投放
              <el-tooltip
                class="item"
                effect="light"
                placement="top"
              >
                <template #content>
                  <div>系统会根据优惠券投放时间进行自动投放，投放后状态为投放</div>
                </template>
                <span>
                  <el-icon><QuestionFilled /></el-icon>
                </span>
              </el-tooltip>
            </el-radio>
            <el-radio :label="1">
              投放
            </el-radio>
            <el-radio :label="4">
              暂不投放
            </el-radio>
            <el-radio
              disabled
              :label="-1"
            >
              取消投放
              <el-tooltip
                class="item"
                effect="light"
                placement="top"
              >
                <template #content>
                  <div>当优惠券过期，优惠券状态为取消投放</div>
                </template>
                <span>
                  <el-icon><QuestionFilled /></el-icon>
                </span>
              </el-tooltip>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="dataForm.putonStatus === 0"
          label="投放时间"
          prop="launchTime"
        >
          <el-date-picker
            v-model="dataForm.launchTime"
            value-format="YYYY-MM-DD"
            type="date"
            style="width:168px"
            placeholder="选择投放时间"
          />
          <el-time-select
            v-model="launchTimeValue"
            start="00:00"
            step="00:30"
            end="23:30"
            style="width:130px"
            placeholder="开始时间"
          />
        </el-form-item>
        <!-- 获取方式 0:直接领取 1:店铺发放 -->
        <el-form-item
          :label="$t('coupon.coupon.getWay')"
          prop="getWay"
        >
          <el-radio-group
            v-model="dataForm.getWay"
            :disabled="dataForm.putonStatus === -1"
          >
            <el-radio :label="0">
              {{ $t("coupon.coupon.receiveDirectly") }}
            </el-radio>
            <el-radio :label="1">
              {{ $t("coupon.coupon.systemIssue") }}
              <el-tooltip
                class="item"
                effect="light"
                placement="top"
              >
                <template #content>
                  <div>该优惠券不能在用户端被直接领取，系统需通过【客户-客户列表】处勾选指定客户发放此优惠券</div>
                </template>
                <span>
                  <el-icon><QuestionFilled /></el-icon>
                </span>
              </el-tooltip>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 优惠券类型 1:代金券 2:折扣券 3:兑换券 -->
        <el-form-item
          :label="$t('coupon.coupon.couponType')"
          prop="couponType"
        >
          <el-radio-group
            v-model="dataForm.couponType"
            :disabled="dataForm.couponId !== 0"
          >
            <el-radio :label="1">
              代金券
            </el-radio>
            <el-radio :label="2">
              折扣券
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 使用条件 -->
        <el-form-item
          :label="$t('coupon.coupon.cashCondition')"
          prop="cashCondition"
          class="amount"
        >
          <span class="strong-word">消费金额满</span>
          <el-input
            v-model="dataForm.cashCondition"
            :placeholder="$t('coupon.coupon.cashCondition')"
            type="number"
            :disabled="dataForm.couponId !== 0"
            style="width:300px; margin-left:8px"
            maxlength="9999999"
            @change="cashConditionHand()"
          >
            <template #append>
              元
            </template>
          </el-input>
        </el-form-item>
        <!-- 减免金额 -->
        <el-form-item
          v-if="dataForm.couponType === 1"
          :label="$t('coupon.coupon.reduceAmount')"
          prop="reduceAmount"
        >
          <el-input
            v-model="dataForm.reduceAmount"
            :placeholder="$t('coupon.coupon.reduceAmount')"
            type="number"
            :disabled="dataForm.couponId !== 0"
            style="width:300px"
            :max="99999"
            :min="1"
            @change="reduceAmountHand()"
          >
            <template #append>
              元
            </template>
          </el-input>
        </el-form-item>
        <!-- 折扣额度 -->
        <el-form-item
          v-if="dataForm.couponType === 2"
          :label="$t('coupon.coupon.couponDiscount')"
          prop="couponDiscount"
        >
          <el-input
            v-model="dataForm.couponDiscount"
            :placeholder="$t('coupon.coupon.couponDiscount')"
            type="number"
            :disabled="dataForm.couponId !== 0"
            style="width:300px"
            @change="couponDiscountHand()"
          >
            <template #append>
              折
            </template>
          </el-input>
        </el-form-item>
        <!-- 生效时间 1:固定时间 2:领取后生效 -->
        <el-form-item
          :label="$t('coupon.coupon.validTimeType')"
          prop="validTimeType"
        >
          <el-radio-group
            v-model="dataForm.validTimeType"
            :disabled="dataForm.couponId !== 0"
          >
            <el-radio :label="1">
              固定时间
            </el-radio>
            <el-radio :label="2">
              领取后生效
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 固定时间数据 START -->
        <div v-if="dataForm.validTimeType === 1">
          <el-form-item
            v-if="dataForm.validTimeType === 1"
            :label="$t('coupon.coupon.startTime')"
            prop="startTime"
          >
            <el-date-picker
              v-model="dataForm.startTime"
              :disabled="dataForm.couponId !== 0"
              value-format="YYYY-MM-DD"
              type="date"
              placeholder="选择开始时间"
              style="width:168px"
            />
            <el-time-select
              v-model="startTimeValue"
              start="00:00"
              step="00:30"
              end="23:30"
              style="width:130px"
              :disabled="dataForm.couponId !== 0"
              placeholder="开始时间"
            />
          </el-form-item>
          <el-form-item
            v-if="dataForm.validTimeType === 1"
            :label="$t('coupon.coupon.endTime')"
            prop="endTime"
          >
            <el-date-picker
              v-model="dataForm.endTime"
              value-format="YYYY-MM-DD"
              type="date"
              placeholder="选择结束时间"
              style="width:168px"
              :disabled="dataForm.couponId !== 0 && dataForm.status === 0"
            />
            <el-time-select
              v-model="endTimeValue"
              start="00:00"
              step="00:30"
              end="23:30"
              style="width:130px"
              placeholder="结束时间"
              :disabled="dataForm.couponId !== 0 && dataForm.status === 0"
            />
          </el-form-item>
        </div>
        <!-- 固定时间数据 END -->
        <!-- 领取后生效数据 START -->
        <el-form-item
          v-if="dataForm.validTimeType === 2"
          label="领券后"
          prop="afterReceiveDays"
        >
          <el-input
            v-model="dataForm.afterReceiveDays"
            type="number"
            :mix="0"
            :max="3652"
            oninput="if(value>3652)value=1"
            :disabled="dataForm.couponId !== 0"
            style="width:300px"
          >
            <template #append>
              天生效
            </template>
          </el-input>
          <el-tooltip
            class="item"
            effect="dark"
            content="最大不得超过10年，即3652天"
            placement="top"
          >
            <el-icon><InfoFilled /></el-icon>
          </el-tooltip>
        </el-form-item>
        <el-form-item
          v-if="dataForm.validTimeType === 2"
          label="有效天数"
          prop="validDays"
        >
          <el-input
            v-model="dataForm.validDays"
            type="number"
            :disabled="dataForm.couponId !== 0"
            style="width:300px"
            :mix="0"
            :max="3652"
            oninput="if(value>3652)value=1"
          >
            <template #append>
              天
            </template>
          </el-input>
          <el-tooltip
            class="item"
            effect="dark"
            content="最大不得超过10年，即3652天"
            placement="top"
          >
            <el-icon><InfoFilled /></el-icon>
          </el-tooltip>
        </el-form-item>
        <!-- 领取后生效数据 END -->
        <!-- 每个用户领券上限，如不填则默认为1 -->
        <el-form-item
          :label="$t('coupon.coupon.limitNum')"
          prop="limitNum"
        >
          <el-input
            v-model="dataForm.limitNum"
            type="number"
            style="width:300px"
            max="999999"
            min="1"
            :disabled="dataForm.couponId !== 0 && dataForm.status === 0"
            @blur="onFormatHandle('limitNum')"
          >
            <template #append>
              张
            </template>
          </el-input>
        </el-form-item>
        <!-- 库存 -->
        <el-form-item
          :label="$t('coupon.coupon.stocks')"
          prop="stocks"
        >
          <el-input
            v-model="dataForm.stocks"
            type="number"
            :disabled="dataForm.couponId !== 0"
            style="width:300px"
            max="999999999"
            @blur="onFormatHandle('stocks')"
          >
            <template #append>
              张
            </template>
          </el-input>
        </el-form-item>
        <!-- 适用商品类型 0全部商品参与 1指定商品参与 -->
        <el-form-item
          :label="$t('coupon.coupon.suitableProdType')"
          prop="suitableProdType"
        >
          <el-radio-group
            v-model="dataForm.suitableProdType"
            :disabled="dataForm.couponId !== 0 && dataForm.status === 0"
          >
            <el-radio :label="0">
              全部商品参与
            </el-radio>
            <el-radio :label="1">
              指定商品参与
            </el-radio>
          </el-radio-group>
          <div
            v-if="dataForm.suitableProdType === 1"
            class="select-pro"
          >
            <el-button
              style="margin-bottom: 10px;"
              :disabled="dataForm.putonStatus === -1"
              @click="selectProds"
            >
              选择商品
            </el-button>
          </div>
          <div
            v-if="dataForm.suitableProdType === 1 && dataForm.spuIds.length > 0"
            class="prod-box"
          >
            <el-card
              v-for="(item,index) in dataForm.spus"
              :key="index"
              :body-style="{ padding: '0px' }"
              class="prod-item"
              style="height: 160px;width: 120px"
            >
              <ImgShow
                :src="item.mainImgUrl"
                :img-style="{width:'100%',height:'104px'}"
              />
              <div class="card-prod-bottom card-prod-d">
                <span class="card-prod-name">{{ item.spuName }}</span>
                <el-button
                  type="primary"
                  link
                  class="card-prod-name-buttons"
                  :disabled="dataForm.putonStatus === -1"
                  @click="deleteCurrentProd(index)"
                >
                  删除
                </el-button>
              </div>
            </el-card>
          </div>
          <prods-select
            v-if="prodSelectVisible"
            ref="prodSelectRef"
            :is-single="false"
            :spu-type="null"
            @refresh-select-prods="getSelectedProd"
          />
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
  </div>
</template>

<script setup>
import * as api from '@/api/coupon/coupon'
import ProdsSelect from '@/components/prods-select/index.vue'
import { getDateTimeRange, getParseTime } from '@/utils/datetime'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['close', 'refreshDataList'])

const launchTimeValue = ref('')
const startTimeValue = ref('')
const endTimeValue = ref('')
const validateNumber = (rule, value, callback) => {
  if (!/^[1-9]\d*$/.test(Number(value))) {
    callback(new Error('请输入大于0的整数'))
  } else if (value >= 2147483600) {
    callback(new Error('请输入一个小于2147483600的数'))
  } else {
    callback()
  }
}
const validateStocks = (rule, value, callback) => {
  if (value === 0 && dataForm.couponId) {
    callback()
  } else if (!/^[1-9]\d*$/.test(Number(value))) {
    callback(new Error('请输入大于0的整数'))
  } else if (value >= 2147483600) {
    callback(new Error('请输入一个小于2147483600的数'))
  } else {
    callback()
  }
}
const validateeDays = (rule, value, callback) => {
  if (!/^[0-9]\d*$/.test(value)) {
    callback(new Error('请输入大于等于0的整数'))
  } else {
    callback()
  }
}
const validateeOneDays = (rule, value, callback) => {
  if (!/^[1-9]\d*$/.test(Number(value))) {
    callback(new Error('请输入大于等于1的整数'))
  } else {
    callback()
  }
}
const validateTime = (rule, value, callback) => {
  if (rule.field === 'startTime' && (!startTimeValue.value || !dataForm.startTime)) {
    callback(new Error('开始时间不能为空'))
  }
  if (rule.field === 'endTime' && (!endTimeValue.value || !dataForm.endTime)) {
    callback(new Error('结束时间不能为空'))
  }
  const endTime = dataForm.endTime + ' ' + endTimeValue.value + ':00'
  if (rule.field === 'endTime' && dataForm.couponId === 0 && new Date() > Date.parse(endTime)) {
    callback(new Error('结束时间不能小于当前时间'))
  } else {
    callback()
  }
}
const validatePutonStatus = (rule, value, callback) => {
  if (dataForm.putonStatus < 0) {
    callback(new Error('必选一项'))
  } else {
    callback()
  }
}
const validateLaunchTime = (rule, value, callback) => {
  if (!launchTimeValue.value) {
    callback(new Error('投放时间不能为空'))
  }
  const launchTime = dataForm.launchTime + ' ' + launchTimeValue.value + ':00'
  if (dataForm.putonStatus === 0 && Date.parse(launchTime) <= Date.now()) {
    callback(new Error('投放时间不得小于当前时间'))
  } else {
    callback()
  }
}

const dataRule = reactive({
  couponName: [
    { required: true, message: '优惠券名称不能为空', trigger: 'blur', pattern: '[^ \x22]+' }
  ],
  couponType: [
    { required: true, message: '优惠券类型不能为空', trigger: 'blur' }
  ],
  reduceAmount: [
    { required: true, message: '减免金额不能为空', trigger: 'blur' }
  ],
  couponDiscount: [
    { required: true, message: '折扣额度不能为空', trigger: 'blur' }
  ],
  limitNum: [
    { required: true, message: '限领数量不能为空', trigger: 'blur' },
    { validator: validateNumber, trigger: 'blur' }
  ],
  afterReceiveDays: [
    { required: true, message: '领取后天数不能为空', trigger: 'blur' },
    { validator: validateeDays, trigger: 'blur' }
  ],
  validDays: [
    { required: true, message: '有效天数不能为空', trigger: 'blur' },
    { validator: validateeOneDays, trigger: 'blur' }
  ],
  startTime: [
    { required: true, message: '开始时间不能为空', trigger: 'blur' },
    { validator: validateTime, trigger: 'blur' }
  ],
  endTime: [
    { required: true, message: '结束时间不能为空', trigger: 'blur' },
    { validator: validateTime, trigger: 'blur' }
  ],
  cashCondition: [
    { required: true, message: '使用条件不能为空', trigger: 'blur' }
  ],
  validTimeType: [
    { required: true, message: '生效时间不能为空', trigger: 'blur' }
  ],
  stocks: [
    { required: true, message: '库存不能为空', trigger: 'blur' },
    { validator: validateStocks, trigger: 'blur' }
  ],
  suitableProdType: [
    { required: true, message: '适用商品类型不能为空', trigger: 'blur' }
  ],
  putonStatus: [
    { required: true, message: '必选', trigger: 'blur' },
    { validator: validatePutonStatus, trigger: 'blur' }
  ],
  launchTime: [
    { required: true, message: '投放时间不能为空', trigger: 'blur' },
    { validator: validateLaunchTime, trigger: 'blur' }
  ]
})

const dataFormRef = ref(null)
const dataForm = reactive({
  couponId: 0,
  shopId: null,
  couponName: '',
  couponType: 1,
  suitableProdType: 0,
  getWay: 0,
  validTimeType: 1,
  cashCondition: 1,
  reduceAmount: 1,
  couponDiscount: 9.9,
  startTime: null,
  endTime: null,
  launchTime: null,
  afterReceiveDays: 0,
  validDays: 1,
  totalStock: 1,
  stocks: 1,
  limitNum: 1,
  status: 1,
  putonStatus: 0,
  version: null,
  spus: [], // 商品列表
  spuIds: [] // 商品ids
})
const visible = ref(false)

watch(dataForm.validTimeType, newValue => {
  if (newValue === 2) {
    dataForm.startTime = null
    dataForm.endTime = null
  }
}, { deep: true })
watch(visible.value, val => {
  if (!val) {
    emit('close')
  }
})

const isSubmit = ref(false)
const init = (couponId) => {
  dataForm.couponId = couponId || 0
  visible.value = true
  dataForm.afterReceiveDays = 0
  dataForm.validDays = 1
  isSubmit.value = false
  dataForm.spus = []
  dataForm.spuIds = []
  nextTick(() => {
    dataFormRef.value?.resetFields()
    const datetimeRange = getDateTimeRange()
    dataForm.launchTime = datetimeRange.startTime
    dataForm.startTime = datetimeRange.startTime
    dataForm.endTime = datetimeRange.endTime
    launchTimeValue.value = datetimeRange.currentTime
    startTimeValue.value = datetimeRange.currentTime
    endTimeValue.value = datetimeRange.currentTime
    if (!dataForm.couponId) {
      return
    }
    api.get(couponId).then(data => {
      dataForm.couponId = data.couponId
      dataForm.shopId = data.shopId
      dataForm.couponName = data.couponName
      dataForm.couponType = data.couponType
      dataForm.suitableProdType = data.suitableProdType
      dataForm.getWay = data.getWay
      dataForm.validTimeType = data.validTimeType
      dataForm.cashCondition = data.cashCondition
      dataForm.reduceAmount = data.reduceAmount
      dataForm.couponDiscount = data.couponDiscount
      dataForm.startTime = data.startTime
      dataForm.endTime = data.endTime
      dataForm.launchTime = data.putonStatus === 0 ? data.launchTime : datetimeRange.startTime
      dataForm.afterReceiveDays = data.afterReceiveDays
      dataForm.validDays = data.validDays
      dataForm.totalStock = data.totalStock
      dataForm.stocks = data.stocks
      dataForm.limitNum = data.limitNum
      dataForm.status = data.status
      dataForm.putonStatus = data.putonStatus
      dataForm.spuIds = data.spuIds

      if (dataForm.launchTime) {
        if (data.putonStatus === 0) {
          launchTimeValue.value = dataForm.launchTime.substring(11, dataForm.launchTime.length - 3)
        } else {
          launchTimeValue.value = datetimeRange.currentTime
        }
      } else {
        launchTimeValue.value = ''
      }

      startTimeValue.value = dataForm.startTime ? dataForm.startTime.substring(11, dataForm.startTime.length - 3) : ''
      endTimeValue.value = dataForm.endTime ? dataForm.endTime.substring(11, dataForm.endTime.length - 3) : ''
      dataForm.launchTime = getParseTime(dataForm.launchTime, '{y}-{m}-{d}')
      dataForm.startTime = getParseTime(dataForm.startTime, '{y}-{m}-{d}')
      dataForm.endTime = getParseTime(dataForm.endTime, '{y}-{m}-{d}')
      dataForm.cashCondition = formatPrice(dataForm.cashCondition, 1)
      dataForm.reduceAmount = formatPrice(dataForm.reduceAmount, 1)
      dataForm.spus = data.spus || []
    })
  })
}

// 选择商品
const prodSelectVisible = ref(false)
const prodSelectRef = ref(null)
const selectProds = () => {
  prodSelectVisible.value = true
  nextTick(() => {
    prodSelectRef.value?.init(dataForm.spus)
  })
}

// 优惠折扣
const couponDiscountHand = () => {
  const couponDiscount = dataForm.couponDiscount
  dataForm.couponDiscount = !couponDiscount || couponDiscount < 0.01 ? 0.01 : couponDiscount >= 10 ||
  parseFloat(couponDiscount).toFixed(2) >= 10 ? 9.99 : parseFloat(couponDiscount).toFixed(2)
}

// 减免金额
const reduceAmountHand = () => {
  const reduceAmount = parseFloat(dataForm.reduceAmount)
  dataForm.reduceAmount = formatNumber(reduceAmount, 99999.99)
}

/**
 * 格式化输入的优惠券 减免金额 / 使用条件
 * @param {*} number 输入金额
 * @param {*} maxNumber 限制最大金额数字
 */
const formatNumber = (number, maxNumber) => {
  number = parseFloat(number.toFixed(2))
  if (!number) {
    return
  }
  if (number >= maxNumber) {
    return maxNumber
  }
  if (number < 0.01) {
    return 0.01
  }
  return number
}

// 使用条件
const cashConditionHand = () => {
  const cashCondition = parseFloat(dataForm.cashCondition)
  dataForm.cashCondition = formatNumber(cashCondition, 9999999.99)
}

const onFormatHandle = (propertyName) => {
  dataForm[propertyName] = dataForm[propertyName] ? Number(dataForm[propertyName]) : 1
}

// 选择商品组件返回
const getSelectedProd = (prods) => {
  dataForm.spus = []
  dataForm.spuIds = []
  prods.forEach(prod => {
    dataForm.spus.push(prod)
    dataForm.spuIds.push(prod.spuId)
  })
  // 去重
  dataForm.spus = removeDuplication(dataForm.spus, 'spuId')
  dataForm.spuIds = Array.from(new Set(dataForm.spuIds))
}

// 删除商品
const deleteCurrentProd = (index) => {
  dataForm.spus.splice(index, 1)
  dataForm.spuIds.splice(index, 1)
}

// 去重
const removeDuplication = (items, validKey) => {
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      if (items[i][validKey] === items[j][validKey]) {
        items.splice(i, 1)
        j--
      }
    }
  }
  return items
}

/**
 * 表单提交
 */
const onSubmit = Debounce(function () {
  if (dataForm.couponId !== 0 && dataForm.status === 0) {
    visible.value = false
    return
  }
  const startDate = dataForm.startTime && startTimeValue.value ? dataForm.startTime + ' ' + startTimeValue.value + ':00' : ''
  const endDate = dataForm.endTime && endTimeValue.value ? dataForm.endTime + ' ' + endTimeValue.value + ':00' : ''
  if (Date.parse(startDate) >= Date.parse(endDate)) {
    ElMessage.error('开始时间不能大于或等于结束时间')
    return
  }
  dataFormRef.value?.validate(valid => {
    if (!valid || isSubmit.value) {
      return
    }
    const launchTime = dataForm.launchTime
    const startTime = dataForm.startTime
    const endTime = dataForm.endTime
    dataForm.launchTime = dataForm.launchTime && launchTimeValue.value ? dataForm.launchTime + ' ' + launchTimeValue.value + ':00' : ''
    dataForm.startTime = startDate
    dataForm.endTime = endDate
    isSubmit.value = true
    const data = JSON.parse(JSON.stringify(dataForm))
    data.cashCondition = formatPrice(data.cashCondition, 0)
    data.reduceAmount = formatPrice(data.reduceAmount, 0)
    const request = dataForm.couponId ? api.update(data) : api.save(data)
    request.then(() => {
      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 1500,
        onClose: () => {
          visible.value = false
          emit('refreshDataList')
          dataFormRef.value?.resetFields()
        }
      })
    }).catch(() => {
      isSubmit.value = false
    })
    dataForm.launchTime = launchTime
    dataForm.startTime = startTime
    dataForm.endTime = endTime
  })
}, 1500)

defineExpose({ init })
</script>
<style lang="scss" scoped>
.coupon-manage {
  :deep(.el-form-item__content) {
    width: 450px;
    display: block;
  }
  :deep(.el-date-editor.el-input) {
    width: 300px;
  }

  .card-prod-bottom .card-prod-name {
    padding: 0 5px;
    line-height: 1em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }
  .card-prod-d .card-prod-name-buttons {
    display: block;
    width: 100%;
    text-align: right;
    padding-right: 5px
  }
  .prod-box {
    display: flex;
    flex-wrap: wrap;
  }
  .prod-item {
    margin-right: 10px;
    margin-bottom: 10px;
  }
  .coupon-add-update .clear-bom :deep(.el-radio-group) {
    white-space: pre;
  }
  .coupon-add-update .clear-bom :deep(.el-input__suffix){
    top: 24px;
  }
}
</style>
