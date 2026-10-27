<template>
  <div class="discount-manage">
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-width="120px"
      style="width: 900px"
      @submit.prevent
      @keyup.enter="onSubmit()"
    >
      <el-form-item
        :label="$t('discount.discount.actName')"
        prop="discountName"
        :rules="[{ required: true, message: $t('table.noNull') }]"
      >
        <el-input
          v-model="dataForm.discountName"
          maxlength="50"
          show-word-limit
          style="width: 540px"
          :placeholder="$t('discount.discount.actName')"
        />
      </el-form-item>
      <el-form-item
        :label="$t('discount.discount.mobiltyDiagram') + '（710*260）'"
        prop="mobilePic"
      >
        <img-upload
          v-model="dataForm.mobilePic"
          @update:model-value="onChangeImages()"
        />
        <span>{{ $t("discount.discount.suggestImg") }}</span>
      </el-form-item>
      <el-form-item
        :label="$t('discount.discount.pcActivityListChart') + '（590*240）'"
        prop="pcPic"
      >
        <img-upload
          v-model="dataForm.pcPic"
          @update:model-value="onChangeImages()"
        />
      </el-form-item>
      <el-form-item
        :label="$t('discount.discount.pcActiviroundMap') + '（1200*360）'"
        prop="pcBackgroundPic"
      >
        <img-upload
          v-model="dataForm.pcBackgroundPic"
          @update:model-value="onChangeImages()"
        />
      </el-form-item>
      <el-form-item :label="$t('discount.discount.activTime')">
        <div class="activ-time">
          <el-form-item
            prop="startTime"
            style="margin-bottom:0"
          >
            <el-date-picker
              v-model="dataForm.startTime"
              type="date"
              :placeholder="$t('discount.discount.chooseStartDate')"
              value-format="YYYY-MM-DD"
              style="width:140px"
              @change="onChangeTime"
            />
            <el-time-select
              v-model="startTimeValue"
              :class="[startTimeValue ? 'select-time': '']"
              start="00:00"
              step="00:30"
              end="23:30"
              style="width:120px"
              placeholder="开始时间"
              @change="onChangeTime"
            />
          </el-form-item>
          <div class="underline">
            -
          </div>
          <el-form-item
            prop="endTime"
            class="endTime"
            style="margin-bottom:0"
          >
            <el-date-picker
              v-model="dataForm.endTime"
              type="date"
              :placeholder="$t('discount.discount.chooseEndDate')"
              value-format="YYYY-MM-DD"
              style="width:140px"
              @change="onChangeTime"
            />
            <el-time-select
              v-model="endTimeValue"
              :class="[endTimeValue ? 'select-time': '']"
              start="00:00"
              step="00:30"
              end="23:30"
              style="width:120px"
              placeholder="结束时间"
              @change="onChangeTime"
            />
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item
        :label="$t('discount.discount.typeOfActivity')"
        prop="discountRule"
      >
        <el-radio-group
          v-model="dataForm.discountRule"
          :disabled="!!dataForm.discountId"
          @change="onChangeDiscountRule"
        >
          <el-radio :label="0">
            {{ $t("discount.discount.fullMoneoney") }}
          </el-radio>
          <el-radio :label="3">
            {{ $t("discount.discount.fullDiscount") }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="dataForm.discountRule === 0 || dataForm.discountRule === 1"
        :label="$t('discount.discount.typeOfExemption')"
        prop="discountType"
      >
        <el-radio-group
          v-model="dataForm.discountType"
          @change="discountTypeChange"
        >
          <el-radio :label="0">
            {{
              $t("discount.discount.decreaseOestLevel")
            }}
          </el-radio>
          <el-radio :label="1">
            {{ $t("discount.discount.decreaeryTime") }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 卡片 START -->
      <el-form-item :label="$t('discount.discount.offerContent')">
        <el-card
          v-for="(discountItem, index) in discountItemList"
          :key="index"
          class="box-card"
          style="width: 540px"
        >
          <template #header>
            <div
              v-if="!dataForm.discountType"
              class="clearfix"
            >
              <span>{{ $t("discount.discount.activityLevel") }} {{ index + 1 }}</span>
              <el-button
                v-if="discountItemList.length > 1"
                style="float: right; padding: 3px 0"
                type="primary"
                link
                @click="deleteActivityClass(index)"
              >
                {{ $t("table.delete") }}
              </el-button>
            </div>
          </template>
          <!-- 使用条件 -->
          <el-form-item
            class="text item"
            :label="$t('discount.discount.conditionsOfUse')"
            style="margin-bottom: 20px"
            :rules="[{ required: true, message: $t('table.noNull') }]"
          >
            <el-input
              v-model="discountItem.needAmount"
              type="number"
              style="width: 240px"
              oninput="if(value>9999999.99) value =9999999.99"
              @change="checkNeedAmount(index)"
            >
              <template #prepend>
                {{ $t("discount.discount.full") }}
              </template>
              <template #append>
                {{ discountItemTexts[0] }}
              </template>
            </el-input>
            <div class="tips-box">
              <div
                v-if="dataForm.discountRule < 2"
                class="tips-txt"
              >
                {{ $t("discount.discount.pleaseEnteThan0") }}
              </div>
              <div
                v-else
                class="tips-txt"
              >
                {{ $t("discount.discount.pleaseThan0") }}
              </div>
              <el-tooltip
                v-if="dataForm.discountType === 0"
                class="item"
                effect="light"
                placement="top"
              >
                <template #content>
                  <div>{{ $t("discount.discount.conditionsOfUseIn") }}</div>
                </template>
                <span>
                  <el-icon><QuestionFilled /></el-icon>
                </span>
              </el-tooltip>
            </div>
          </el-form-item>
          <!-- 优惠金额、折扣 -->
          <el-form-item
            class="text item"
            :label="$t('discount.discount.discountedPrice')"
            :rules="[{ required: true, message: $t('table.noNull') }]"
          >
            <el-input
              v-model="discountItem.discount"
              type="number"
              style="width: 240px;"
              oninput="if(value>9999999) value=9999999"
              @change="checkNumber(index)"
            >
              <template
                v-if="dataForm.discountRule < 2"
                #prepend
              >
                {{ $t("discount.discount.reducea") }}
              </template>
              <template
                v-else
                #prepend
              >
                {{ $t("discount.discount.dozen") }}
              </template>
              <template #append>
                {{ discountItemTexts[1] }}
              </template>
            </el-input>
            <div
              v-if="dataForm.discountRule <2"
              style="color:#c0c4cf"
            >
              {{ $t("discount.discount.pleaseThan0") }}
            </div>
            <div
              v-else
              style="color:#c0c4cf"
            >
              {{ $t("discount.discount.pleaseEnterTheNumber310") }}
            </div>
          </el-form-item>
        </el-card>
      </el-form-item>
      <!-- 卡片 END -->
      <el-form-item>
        <el-button
          v-if="dataForm.discountType === 0 && discountItemList.length < 20"
          plain
          @click="onAddActivityClass()"
        >
          {{ $t("discount.discount.addAct") }}
        </el-button>
      </el-form-item>
      <el-form-item
        v-if="dataForm.discountRule >= 2 || dataForm.discountType !== 0"
        :label="$t('discount.discount.maximumDiscountAmount')"
        prop="maxReduceAmount"
        :rules="[{ required: true, message: $t('table.noNull') }]"
      >
        <el-input-number
          v-model="maxReduceAmount"
          :placeholder="$t('discount.discount.maximumDiscountAmount')"
          :max="999999999"
          :min="1"
          controls-position="right"
          @blur="maxReduceAmountCheck"
        />
      </el-form-item>
      <el-form-item
        :label="$t('discount.discount.applicableProductType')"
        prop="suitableSpuType"
        :rules="[{ required: true, message: $t('table.noNull') }]"
      >
        <el-radio-group v-model="dataForm.suitableSpuType">
          <el-radio :label="0">
            {{ $t("discount.discount.allProdsPar") }}
          </el-radio>
          <el-radio :label="1">
            {{ $t("discount.discount.participateInD") }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="dataForm.suitableSpuType !== 0"
        style="width: 900px"
        class="prods-box"
      >
        <el-row>
          <el-col
            v-for="(discountProd, index) in discountProds"
            :key="index"
            :span="4"
            style="margin-bottom: 10px;"
          >
            <el-card
              :body-style="{ padding: '0px' }"
              style="height: 160px; width: 120px"
            >
              <ImgShow
                :src="discountProd.mainImgUrl"
                :img-style="{width:'100%',height:'104px'}"
              />
              <div class="card-prod-bottom">
                <div class="card-prod-name">
                  {{ discountProd.spuName }}
                </div>
                <el-button
                  type="primary"
                  link
                  class="card-prod-name-button"
                  @click="deleteProd(index)"
                >
                  {{ $t("table.delete") }}
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item
        v-if="dataForm.suitableSpuType === 1 || dataForm.suitableSpuType === 2"
      >
        <el-button
          plain
          @click="onProdsSelect()"
        >
          {{ $t("discount.discount.selectProd") }}
        </el-button>
      </el-form-item>
      <!-- 商品 -->
      <el-form-item
        v-if="dataForm.status === 1 || dataForm.status === 0"
        :label="$t('discount.discount.status')"
        prop="status"
      >
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="1">
            {{ $t("discount.discount.turnOn") }}
          </el-radio>
          <el-radio :label="0">
            {{ $t("discount.discount.close") }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <span class="dialog-footer">
          <el-button
            @click="onClose()"
          >{{
            $t('table.cancel')
          }}</el-button>
          <el-button
            type="primary"
            @click="onSubmit()"
          >{{
            $t('table.confirm')
          }}</el-button>
        </span>
      </el-form-item>
    </el-form>

    <!-- 商品选择弹窗-->
    <prods-select
      v-if="prodsSelectVisible"
      ref="prodsSelectRef"
      :spu-type="null"
      @refresh-select-prods="selectDiscountProds"
    />
  </div>
</template>

<script setup>
import ImgUpload from '@/components/img-upload/index.vue'
import ProdsSelect from '@/components/prods-select/index.vue'
import * as api from '@/api/discount/discount'
import Big from 'big.js'
import { getDateTimeRange, getParseTime } from '@/utils/datetime'
import { ElMessage } from 'element-plus'

const dataFormRef = ref(null)
const dataForm = reactive({
  discountId: 0,
  discountName: '',
  mobilePic: '',
  pcPic: '',
  pcBackgroundPic: '',
  discountRule: 0,
  discountType: 0,
  suitableSpuType: 0,
  maxReduceAmount: 1,
  shopId: '',
  startTime: '',
  endTime: '',
  status: 1,
  groupActivityId: null,
  discountItemList: [],
  discountProds: [],
  spuIds: [],
  spuList: []
})
// 时间选择变化时检验
const onChangeTime = () => {
  onValidateField('startTime')
  onValidateField('endTime')
}

const onValidateField = (field) => {
  dataFormRef.value?.validateField(field)
}
const startTimeValue = ref('')
const endTimeValue = ref('')
const validEndTime = ref(null)

const validateTime = (rule, value, callback) => {
  if (rule.field === 'startTime' && (!startTimeValue.value || !dataForm.startTime)) {
    callback(new Error('开始时间不能为空'))
  }
  if (rule.field === 'endTime' && (!endTimeValue.value || !dataForm.endTime)) {
    callback(new Error('结束时间不能为空'))
  }
  const startTime = dataForm.startTime + ' ' + startTimeValue.value + ':00'
  const endTime = dataForm.endTime + ' ' + endTimeValue.value + ':00'
  if (dataForm.status === 1 && rule.field === 'endTime' && new Date() > Date.parse(endTime)) {
    callback(new Error($t('discount.discount.endTimeCheck')))
  }
  if (Date.parse(startTime) >= Date.parse(endTime)) {
    callback(new Error($t('discount.discount.startTimeTooBig')))
  } else if (dataForm.status === 1 && dataForm.groupActivityId && Date.parse(validEndTime.value) > Date.parse(endTime)) {
    callback(new Error($t('discount.discount.extendedEndTime')))
  } else {
    callback()
  }
}

const dataRule = reactive({
  mobilePic: [
    { required: true, message: $t('discount.discount.pleaseUploadAPicture'), trigger: ['blur', 'change'] }
  ],
  pcPic: [
    { required: true, message: $t('discount.discount.pleaseUploadAPicture'), trigger: ['blur', 'change'] }
  ],
  pcBackgroundPic: [
    { required: true, message: $t('discount.discount.pleaseUploadAPicture'), trigger: ['blur', 'change'] }
  ],
  startTime: [
    { required: true, message: $t('discount.discount.startTimeCannotBeEmpty'), trigger: 'blur' },
    { validator: validateTime, trigger: 'blur' }
  ],
  endTime: [
    { required: true, message: $t('discount.discount.endTimeCannotBeEmpty'), trigger: 'blur' },
    { validator: validateTime, trigger: 'blur' }
  ]
})

const discountItemTexts = computed(() => {
  const texts = []
  if (dataForm.discountRule === 0 || dataForm.discountRule === 2) {
    texts[0] = $t('unit.dollar')
  } else {
    texts[0] = $t('discount.discount.item')
  }
  if (dataForm.discountRule === 0 || dataForm.discountRule === 1) {
    texts[1] = $t('unit.dollar')
  } else {
    texts[1] = $t('discount.discount.fold')
  }
  return texts
})

watch(() => dataForm.discountRule, val => {
  if (val === 2 || val === 3) {
    dataForm.discountType = 0
  }
})

const route = useRoute()
onMounted(() => {
  if (route.query.discountId !== undefined) {
    dataForm.discountId = route.query.discountId
  }
  getData()
})

const maxReduceAmount = ref(1)
const discountProds = ref([])
const discountItemList = ref([{
  needAmount: 10,
  discount: 1
}])
const discountItemListAll = ref([])
const getData = () => {
  nextTick(() => {
    dataFormRef.value?.resetFields()
    const datetimeRange = getDateTimeRange()
    dataForm.startTime = datetimeRange.startTime
    dataForm.endTime = datetimeRange.endTime
    startTimeValue.value = datetimeRange.currentTime
    endTimeValue.value = datetimeRange.currentTime

    if (dataForm.discountId) {
      api.get(dataForm.discountId).then(data => {
        dataForm.discountId = data.discountId
        dataForm.discountName = data.discountName
        dataForm.mobilePic = data.mobilePic
        dataForm.pcBackgroundPic = data.pcBackgroundPic
        dataForm.pcPic = data.pcPic
        dataForm.discountRule = data.discountRule
        dataForm.discountType = data.discountType
        dataForm.suitableSpuType = data.suitableSpuType
        dataForm.maxReduceAmount = data.maxReduceAmount
        dataForm.shopId = data.shopId
        dataForm.startTime = data.startTime
        dataForm.endTime = data.endTime
        dataForm.status = data.status
        dataForm.groupActivityId = data.groupActivityId
        dataForm.discountProds = data.discountProds
        dataForm.spuList = data.spuList
        dataForm.discountItemList = data.discountItemList
        startTimeValue.value = dataForm.startTime ? dataForm.startTime.substring(11, dataForm.startTime.length - 3) : ''
        endTimeValue.value = dataForm.endTime ? dataForm.endTime.substring(11, dataForm.endTime.length - 3) : ''
        dataForm.startTime = getParseTime(dataForm.startTime, '{y}-{m}-{d}')
        dataForm.endTime = getParseTime(dataForm.endTime, '{y}-{m}-{d}')
        discountProds.value = dataForm.spuList
        maxReduceAmount.value = +new Big(dataForm.maxReduceAmount).div(100).valueOf()
        discountItemList.value = JSON.parse(JSON.stringify(dataForm.discountItemList))
        discountItemList.value.forEach(discountItem => {
          discountItem.discount = parseFloat(new Big(discountItem.discount).div(100).toFixed(2))
          discountItem.needAmount = parseFloat(new Big(discountItem.needAmount).div(100).toFixed(2))
        })
        discountItemListAll.value = discountItemList.value
      })
    }
  })
}

// 活动类型变化时，更新优惠内容的值
const onChangeDiscountRule = (val) => {
  if (val === 0) {
    // 满钱减钱
    discountItemList.value = [{ needAmount: 10, discount: 1 }]
  } else if (val === 3) {
    // 满件打折
    discountItemList.value = [{ needAmount: 10, discount: 3 }]
  }
  for (let i = 0; i < discountItemList.value.length; i++) {
    checkNeedAmount(i)
    checkNumber(i)
  }
}

// 输入框的数据改变时，对所需金额进行校验
const checkNeedAmount = (index) => {
  const discountItem = discountItemList.value[index]
  if (discountItem.needAmount < 1) {
    discountItem.needAmount = 1
  }
  if (dataForm.discountRule < 2) {
    discountItem.needAmount = parseFloat(discountItem.needAmount).toFixed(2)
  } else {
    discountItem.needAmount = parseFloat(discountItem.needAmount).toFixed(0)
  }
}

// 输入框的数据改变时，对满减值、折扣进行校验
const checkNumber = (index) => {
  const discountItem = discountItemList.value[index]
  const minDiscount = 3
  const minAmount = 1
  // 最低满减金额为1
  if (discountItem.discount < minAmount && dataForm.discountRule < 2) {
    discountItem.discount = minAmount
  }
  // 最低折扣为3折
  if (discountItem.discount < minDiscount && dataForm.discountRule >= 2) {
    discountItem.discount = minDiscount
  }
  // 优惠金额只能为大于0的整数
  if (dataForm.discountRule < 2) {
    discountItem.discount = parseFloat(discountItem.discount).toFixed(0)
    return
  }
  // 折扣保留一位小数
  discountItem.discount = parseFloat(discountItem.discount).toFixed(1)
  discountItem.discount = discountItem.discount >= 10 ? 9.9 : discountItem.discount
}

// 优惠金额上限校验
const maxReduceAmountCheck = () => {
  const maxReduceAmountTemp = Math.round(maxReduceAmount.value)
  maxReduceAmount.value = maxReduceAmountTemp < 1 ? 1 : maxReduceAmountTemp
  maxReduceAmount.value = maxReduceAmountTemp > 9999999 ? 9999999 : maxReduceAmountTemp
}

// 减免类型选择时，更新数据
const discountTypeChange = (e) => {
  if (e !== 0) {
    discountItemList.value = [discountItemList.value[0]]
  }
}

// 添加活动层级
const onAddActivityClass = () => {
  if (discountItemList.value.length >= 20) {
    return
  }
  discountItemList.value.push({})
}

// 删除活动层级
const deleteActivityClass = (index) => {
  discountItemList.value.splice(index, 1)
}

// 删除指定商品
const deleteProd = (index) => {
  discountProds.value.splice(index, 1)
}

// 显示添加指定商品弹框
const prodsSelectVisible = ref(false)
const prodsSelectRef = ref(null)
const onProdsSelect = () => {
  prodsSelectVisible.value = true
  nextTick(() => {
    prodsSelectRef.value?.init(discountProds.value)
  })
}

// 添加指定商品
const selectDiscountProds = (prods) => {
  if (prods) {
    discountProds.value = prods
  }
}

// 关闭当前标签页
const router = useRouter()
const onClose = () => {
  router.go(-1)
}

// 错误提示框
const errorMsg = (message) => {
  ElMessage({
    message,
    type: 'error',
    duration: 1500
  })
}

const isTrue = ref(false)
const errorValue = ref(false)
// 校验优惠内容是否正确
const checkdiscountItemList = () => {
  isTrue.value = false
  let minAmount = null
  let maxAmount = null
  if (discountItemList.value[0].discount && discountItemList.value[0].needAmount) {
    const initAmount = new Big(discountItemList.value[0].discount)
    minAmount = initAmount.toFixed()
    maxAmount = initAmount.toFixed()
    discountItemList.value[0].discount = parseFloat(initAmount)
  }
  let amount = 0
  let prevDiscount = 0
  discountItemList.value.forEach((item, index) => {
    const idx = index + 1
    if (dataForm.discountType === 0 && Number(item.needAmount) <= amount) {
      isTrue.value = true
      errorValue.value = $t('discount.discount.activityLevel') + idx + $t('discount.discount.theConditierThan') + amount
      return true
    }
    amount = item.needAmount
    if (dataForm.discountRule === 0) {
      if (parseFloat(item.needAmount) <= parseFloat(item.discount)) {
        isTrue.value = true
        errorValue.value = $t('discount.discount.activityLevel') + idx + $t('discount.discount.activimount')
        return true
      }
    }

    // 限制层级高的优惠金额不得低于层级低的优惠金额
    if (dataForm.discountType === 0 &&
        dataForm.discountRule === 0 &&
        Number(item.discount) <= Number(prevDiscount)) {
      isTrue.value = true
      errorValue.value = $t('discount.discount.activityLevel') + idx + $t('discount.discount.theOfferAmountThan') + prevDiscount
      return true
    }

    if (!item.needAmount) {
      isTrue.value = true
      errorValue.value = $t('discount.discount.activitytBeEmpty')
      return true
    }
    if (!item.discount) {
      isTrue.value = true
      errorValue.value = $t('discount.discount.promotioBeEmpty')
      return true
    }
    prevDiscount = item.discount
    minAmount = item.discount < minAmount ? item.discount : minAmount
    maxAmount = item.discount > maxAmount ? item.discount : maxAmount
  })
  // 活动类型：满钱减钱 => 减免类型：按满足最高层减一次 => 优惠金额上限为最大金额
  if (dataForm.discountRule === 0 && dataForm.discountType === 0) {
    maxReduceAmount.value = maxAmount
  }
  if (dataForm.suitableSpuType !== 0 && (!discountProds.value || discountProds.value.length < 1)) {
    isTrue.value = true
    errorValue.value = $t('discount.discount.pleaseSelectAProduct')
    return true
  }
}

// 图片校验
const onChangeImages = () => {
  if (dataForm.mobilePic) {
    // 重新校验表单对应字段
    dataFormRef.value?.validateField('mobilePic')
  }
  if (dataForm.pcPic) {
    // 重新校验表单对应字段
    dataFormRef.value?.validateField('pcPic')
  }
  if (dataForm.pcBackgroundPic) {
    // 重新校验表单对应字段
    dataFormRef.value?.validateField('pcBackgroundPic')
  }
}
// 表单提交
const onSubmit = Debounce(function () {
  dataForm.spuIds = []
  checkdiscountItemList()
  if (isTrue.value) {
    errorMsg(errorValue.value)
    return
  }
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      const startTime = dataForm.startTime
      const endTime = dataForm.endTime
      dataForm.startTime = dataForm.startTime && startTimeValue.value ? dataForm.startTime + ' ' + startTimeValue.value + ':00' : ''
      dataForm.endTime = dataForm.endTime && endTimeValue.value ? dataForm.endTime + ' ' + endTimeValue.value + ':00' : ''
      if (!dataForm.discountName.trim()) {
        return ElMessage.error('活动名称不能为空')
      }
      if (dataForm.endTime < dataForm.startTime) {
        errorMsg($t('discount.discount.eventEndanStartTime'))
        return
      } else if (dataForm.status === 1 && new Date() > dataForm.endTime) {
        errorMsg($t('discount.discount.endTimeCheck'))
      }
      // 处理数据
      dataForm.discountItemList = JSON.parse(JSON.stringify(discountItemList.value))
      dataForm.discountItemList.forEach(item => {
        item.discount = new Big(item.discount).times(100).valueOf()
        item.needAmount = new Big(item.needAmount).times(100).valueOf()
      })
      dataForm.maxReduceAmount = new Big(maxReduceAmount.value).times(100).valueOf()
      // 指定商品
      if (dataForm.suitableSpuType === 1) {
        discountProds.value.forEach(discountProd => {
          dataForm.spuIds.push(discountProd.spuId)
        })
      }
      const request = dataForm.discountId ? api.update(dataForm) : api.save(dataForm)
      request.then(() => {
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            router.go(-1)
          }
        })
      })
      dataForm.startTime = startTime
      dataForm.endTime = endTime
    }
  })
}, 1500)

</script>
<style lang="scss" scoped>
.discount-manage {
  padding: 20px;
}
:deep(.el-form-item__content){
  display: block;
}
.prods-box {
  .card-prod-bottom {
    .card-prod-name {
      display: block;
      line-height: 1em;
      padding: 0 5px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .card-prod-name-button {
      display: block;
      width: 100%;
      text-align: right;
      padding: 0 5px 0 0;
    }
  }
}
.activ-time {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .underline {
    margin: 0 6px;
  }

  :deep(.el-input__suffix-inner){
    display: none;
  }
  .select-time:hover :deep(.el-input__suffix-inner){
    display: inline-flex;
  }
}
.box-card {
  .tips-box {
    display: flex;
    .tips-txt {
      color:#c0c4cf;
      margin-right: 5px;
    }
  }
}
.endTime{
  :deep(.el-form-item__error){
    white-space: nowrap;
  }
}
</style>
