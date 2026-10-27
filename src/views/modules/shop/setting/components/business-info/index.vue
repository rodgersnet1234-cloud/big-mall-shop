<template>
  <div class="component-business-info">
    <!-- 工商信息 -->
    <div class="business-info">
      <!-- native modifier has been removed, please confirm whether the function has been affected  -->
      <el-form
        ref="companyInfoFormRef"
        :model="companyInfoForm"
        :rules="companyInfoRule"
        label-width="140px"
        :disabled="auditStatus===0&&paySettlementType===1&&companyInfoProcessStatus===3"
        @submit.prevent
      >
        <div class="business-info-wrapper">
          <div class="business-info-left">
            <el-form-item
              label="统一社会信用代码"
              prop="creditCode"
            >
              <el-input
                v-model.trim="companyInfoForm.creditCode"
                maxlength="20"
                placeholder="统一社会信用代码"
                :disabled="paySettlementType===1&&companyInfoProcessStatus===2"
              />
            </el-form-item>
            <el-form-item
              label="企业名称"
              prop="firmName"
            >
              <el-input
                v-model="companyInfoForm.firmName"
                maxlength="50"
                placeholder="输入50字以内的企业名称"
              />
            </el-form-item>
            <el-form-item
              label="住所"
              prop="residence"
            >
              <el-input
                v-model="companyInfoForm.residence"
                maxlength="50"
                placeholder="输入50字以内的住所"
              />
            </el-form-item>
            <el-form-item
              v-if="!paySettlementType"
              label="法定代表人"
              prop="representative"
            >
              <el-input
                v-model="companyInfoForm.representative"
                maxlength="20"
                placeholder="输入20字以内的法定代表人"
              />
            </el-form-item>
            <el-form-item label="注册资本">
              <el-input-number
                v-model="companyInfoForm.capital"
                prop="capital"
                controls-position="right"
                style="width:200px"
                :max="99999999"
                :precision="2"
              />
              <span class="price-unit-text">万元</span>
            </el-form-item>
            <el-form-item
              label="成立日期"
              prop="foundTime"
            >
              <el-date-picker
                v-model="companyInfoForm.foundTime"
                style="width:200px"
                type="date"
                value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="选择日期"
                :picker-options="pickerOptions"
              />
            </el-form-item>
            <el-form-item
              label="营业期限"
              prop="startTime"
            >
              <div style="display: flex">
                <el-date-picker
                  v-model="companyInfoForm.startTime"
                  style="width:170px;"
                  type="date"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  placeholder="开始日期"
                  clearable
                  @change="onValidateTime('startTime')"
                />
                <span style="margin: 0 10px">-</span>
                <span class="end-time">
                  <el-date-picker
                    ref="endTimeRef"
                    v-model="companyInfoForm.endTime"
                    style="width:170px;"
                    type="date"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    :placeholder="(endTimeFlag && !companyInfoForm.endTime && companyInfoForm.startTime) ? '' : '结束日期'"
                    clearable
                    :disabled="!companyInfoForm.startTime"
                    @focus="endTimeFlag = false"
                    @change="onValidateTime('endTime')"
                  />
                  <span
                    v-if="endTimeFlag && !companyInfoForm.endTime && companyInfoForm.startTime"
                    class="text"
                    @click="focusEndTime"
                  >
                    无固定期限
                  </span>
                </span>
              </div>
            </el-form-item>
            <el-form-item
              label="经营范围"
              prop="businessScope"
              style="margin-bottom:30px;"
            >
              <el-input
                v-model="companyInfoForm.businessScope"
                type="textarea"
                resize="none"
                :rows="4"
                placeholder="请输入500字以内经营范围"
                maxlength="500"
              />
            </el-form-item>
            <el-form-item
              v-if="paySettlementType"
              label="法定代表人"
              prop="representative"
            >
              <el-input
                v-model="companyInfoForm.representative"
                maxlength="20"
                placeholder="请输入法定代表人姓名"
              />
            </el-form-item>
            <el-form-item
              v-if="paySettlementType"
              label="法人身份证"
              prop="legalIds"
            >
              <el-input
                v-model="companyInfoForm.legalIds"
                maxlength="18"
                placeholder="请输入法人身份证号"
              />
            </el-form-item>
            <el-form-item
              v-if="paySettlementType"
              label="法人手机号"
              prop="legalPhone"
            >
              <el-input
                v-model="companyInfoForm.legalPhone"
                maxlength="11"
                placeholder="输入法人手机号"
                @input="(val)=>{companyInfoForm.legalPhone=val.replace(/[^\d|*]/g,'')}"
              />
            </el-form-item>
          </div>
          <div class="business-info-right">
            <el-form-item
              label="营业执照电子版"
              prop="businessLicense"
            >
              <div class="business-license-box">
                <div class="license-content">
                  <imgs-upload
                    v-model="companyInfoForm.businessLicense"
                    :limit="1"
                  />
                  <div class="example-box">
                    <img
                      src="@/assets/example-img/Business-license.png"
                      alt
                    >
                    <div class="tips">
                      示例
                    </div>
                  </div>
                </div>
                <div class="upload-tips">
                  仅限jpg、gif、png，仅限上传1张
                </div>
              </div>
            </el-form-item>
            <div class="id-box">
              <div class="upload-content">
                <div class="upload-img">
                  <el-form-item
                    class="idcard"
                    label="法人身份证"
                    prop="identityCardFront"
                  >
                    <imgs-upload
                      v-model="companyInfoForm.identityCardFront"
                      :limit="1"
                    />
                  </el-form-item>
                  <el-form-item
                    class="idcard"
                    label-width="0"
                    prop="identityCardLater"
                  >
                    <imgs-upload
                      v-model="companyInfoForm.identityCardLater"
                      :limit="1"
                    />
                  </el-form-item>
                </div>
                <div class="upload-example">
                  <div class="example-box">
                    <img
                      src="@/assets/example-img/idcard1.png"
                      alt
                    >
                    <div class="tips">
                      人像面示例
                    </div>
                  </div>
                  <div class="example-box">
                    <img
                      src="@/assets/example-img/idcard2.png"
                      alt
                    >
                    <div class="tips">
                      国徽面示例
                    </div>
                  </div>
                </div>
                <div class="upload-tips">
                  请上传身份证正反面照片，仅限jpg、gif、png，仅限上传2张
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <div class="footer">
      <div class="foot-box">
        <div
          v-if="!paySettlementType"
          v-permission="['shop:shopCompany:save']"
          class="btn primary"
          style="margin-left:152px"
          @click="validationCompanyInfoForm"
        >
          提交并保存审核
        </div>
        <div
          v-if="paySettlementType && !(auditStatus===0&&companyInfoProcessStatus===3)"
          v-permission="['shop:shopCompany:save']"
          class="btn primary"
          style="margin-left:152px"
          @click="validationCompanyInfoForm"
        >
          确认提交
        </div>
      </div>
    </div>
    <!-- /工商信息 -->
  </div>
</template>

<script setup>
import * as api from '@/api/multishop/shop-process.js'
import { validNoEmptySpace, checkIDCard } from '@/utils/validate.js'
import moment from 'moment'
import { Debounce } from '@/utils/debounce.js'
import { ElMessage } from 'element-plus'

const props = defineProps({
  companyInfoProcessStatus: {
    default: 2,
    type: Number
  }
})
const emit = defineEmits(['setActiveName', 'getmodifyInformation', 'successUpdate'])

// 店铺工商信息
const companyInfoForm = reactive({
  creditCode: '',
  firmName: '',
  residence: '',
  representative: '',
  capital: '',
  foundTime: '',
  startTime: '',
  endTime: '',
  businessScope: '',
  businessLicense: '',
  identityCardFront: '',
  identityCardLater: '',
  legalPhone: '',
  legalIds: ''
})
const endTimeFlag = ref(true)
const allinpayStore = useAllinpayStore()
const paySettlementType = ref(allinpayStore.paySettlementType) // 是否开启通联支付 1：开启 0：关闭

// 成立日期：今日之前可选
const pickerOptions = reactive({
  disabledDate (time) {
    const date = moment().add(0, 'days').startOf('days')
    return (
      time.getTime() >= date.valueOf()
    )
  }
})

const validRepresentative = (rule, value, callback) => {
  companyInfoForm.representative = companyInfoForm.representative.trim()
  if (companyInfoForm.representative.indexOf(' ') !== -1) {
    callback(new Error('法定代表人不能有空格'))
  } else {
    callback()
  }
}

const validbusinessScope = (rule, value, callback) => {
  if (!value || !value.trim()) {
    companyInfoForm.businessScope = ''
    callback(new Error($t('multishop.shopInformation.businessScopeEmpty')))
  } else {
    callback()
  }
}

// 纯空格校验
const validEmptySpace = (rule, value, callback) => {
  if (validNoEmptySpace(value)) {
    callback(new Error($t('multishop.shopInformation.EmptyTips')))
  } else {
    callback()
  }
}

const validIDCard = (rule, value, callback) => {
  if (!value || !checkIDCard(value)) {
    callback(new Error('请输入正确的法人身份证'))
  } else {
    callback()
  }
}

const validMobile = (rule, value, callback) => {
  if (!isStarMobile(value)) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}

const companyInfoRule = reactive({
  creditCode: [
    { required: true, message: '请填写统一社会信用代码', trigger: 'blur' }
  ],
  firmName: [
    { required: true, message: '企业名称不能为空', trigger: 'blur' }
  ],
  residence: [
    // 住所，非必填，校验纯空格
    { validator: validEmptySpace, trigger: 'blur' }
  ],
  businessScope: [
    { required: true, message: '经营范围不能为空', trigger: 'blur' },
    { validator: validbusinessScope, trigger: 'blur' }
  ],
  businessLicense: [
    { required: true, message: '营业执照需要上传', trigger: 'change' }
  ],
  representative: [
    { required: true, message: '法定代表人不能为空', trigger: 'blur' },
    { validator: validRepresentative, trigger: 'blur' }
  ],
  legalIds: [
    { required: true, message: '法人身份证不能为空', trigger: 'blur' },
    { validator: validIDCard, trigger: 'blur' }
  ],
  legalPhone: [
    { required: true, message: '法人手机号不能为空', trigger: 'blur' },
    { validator: validMobile, trigger: 'blur' }
  ],
  identityCardFront: [
    { required: true, message: '上传法人身份证人像面', trigger: 'change' }
  ],
  identityCardLater: [
    { required: true, message: '上传法人身份证国徽面', trigger: 'change' }
  ]
})

const auditStatus = computed(() => {
  return allinpayStore.auditStatus
})

onMounted(() => {
  queryShopBusinessInfo()
})

/**
 * 查询工商信息
 */
const queryShopBusinessInfo = () => {
  api.getCompanyInfo().then(data => {
    Object.assign(companyInfoForm, data)
    endTimeFlag.value = true
  })
}

const endTimeRef = ref('')
const focusEndTime = () => {
  endTimeRef.value?.focus()
}

/**
 * 验证工商信息
 */
const companyInfoFormRef = ref('')
const validationCompanyInfoForm = Debounce(() => {
  // 工商信息
  companyInfoFormRef.value?.validate((valid) => {
    if (!valid) {
      return
    }
    updateCompanyInfo()
  })
}, 1500)

/**
 * 提交工商信息审核
 */

const updateCompanyInfo = Debounce(() => {
  companyInfoForm.shopId = props.shopId
  api.applyChangeCompanyInfo(companyInfoForm).then(() => {
    ElMessage({
      message: '提交工商信息审核成功！',
      type: 'success',
      duration: 1500,
      onClose: () => {
        if (paySettlementType.value === 1 && (props.companyInfoProcessStatus === 0 || props.companyInfoProcessStatus === 1 || props.companyInfoProcessStatus === 3)) {
          emit('setActiveName', '4')
          // 重新更新工商信息状态
          emit('getmodifyInformation')
        }
      }
    })
    emit('successUpdate', 1500)
  }).catch(() => {
    if (paySettlementType.value !== 1) {
      emit('successUpdate')
    }
  })
}, 1500)

const onValidateTime = (value) => {
  if (value === 'endTime') {
    endTimeFlag.value = true
    if (!companyInfoForm.endTime) companyInfoForm.endTime = undefined
  } else {
    endTimeFlag.value = false
    if (!companyInfoForm.startTime) companyInfoForm.endTime = undefined
  }
  if (companyInfoForm.endTime && Date.parse(companyInfoForm.startTime) >= Date.parse(companyInfoForm.endTime)) {
    ElMessage({
      message: '营业起始日期不能大于营业终止时间',
      type: 'error',
      duration: 1500
    })
    endTimeFlag.value = true
    companyInfoForm.endTime = undefined
  }
}

</script>

<style lang="scss" scoped>
@use "index";
</style>
