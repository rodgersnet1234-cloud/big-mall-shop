<template>
  <el-dialog
    v-model="dialogVisible"
    class="component-mobile-add-or-unbind"
    :title="isHaveMobile ? '解绑手机号' : '绑定手机号'"
    :close-on-click-modal="false"
    :append-to-body="true"
    width="378px"
  >
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="rules"
      label-width="64px"
      @submit.prevent
    >
      <el-form-item
        prop="mobile"
        label="手机号"
      >
        <el-input
          v-model="dataForm.mobile"
          placeholder="请输入手机号"
          :disabled="isHaveMobile"
          style="width: 274px;"
          maxlength="11"
          @input="(val)=>{ dataForm.mobile=val.replace(/[^\d]/g,'') }"
        >
          <template #suffix>
            <div
              v-if="countdown===0"
              class="get-code"
              @click="showCheck"
            >
              获取验证码
            </div>
            <div
              v-else
              class="get-code"
            >
              {{ countdown }} s
            </div>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item
        prop="validCode"
        label="验证码"
      >
        <el-input
          v-model="dataForm.validCode"
          placeholder="请输入验证码"
          style="width: 274px;"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div>
        <el-button
          @click="dialogVisible = false"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitForm"
        >
          {{ isHaveMobile?'解绑':'绑定' }}
        </el-button>
      </div>
    </template>
    <Verify
      ref="verify"
      :captcha-type="'blockPuzzle'"
      :img-size="{width:'400px',height:'200px'}"
      @success="getCode"
    />
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/multishop/shop-process.js'
import { getVerificationCode } from '@/api/auth/auth.js'
import { isMobile } from '@/utils/validate.js'
import { Debounce } from '@/utils/debounce.js'
import { ElMessage } from 'element-plus'

const props = defineProps({
  // 是否拥有（已绑定）手机号
  isHaveMobile: {
    default: false,
    type: Boolean
  }
})
const emit = defineEmits('refreshDataForm')

const dialogVisible = ref(false)
const dataForm = reactive({
  mobile: '', // 手机号
  validCode: ''
})
const validateMobile = (rule, value, callback) => {
  if (!isMobile(value)) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}
const rules = reactive({
  mobile: [
    { required: true, message: '手机号不能为空', trigger: 'blur' },
    { validator: validateMobile, trigger: 'blur' }
  ],
  validCode: [
    { required: true, message: '验证码不能为空', trigger: 'blur' }
  ]
})
const countdown = ref(0) // 倒计时
const timer = ref('')

const dataFormRef = ref(null)
const init = (mobile) => {
  dialogVisible.value = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
    dataForm.mobile = mobile || null
  })
}

defineExpose({
  init
})
/**
 * 绑定或解绑手机号
 */
const submitForm = () => {
  dataFormRef.value?.validate(valid => {
    if (!valid) {
      return
    }
    const data = {
      phone: dataForm.mobile,
      verificationCode: dataForm.validCode
    }
    const req = props.isHaveMobile ? api.unbindAllinpayPhone(data) : api.bindAllinpayPhone(data)
    req.then(() => {
      ElMessage({
        message: '操作成功',
        type: 'success',
        duration: 1000
      })
      dialogVisible.value = false
      emit('refreshDataForm')
      dataFormRef.value?.resetFields()
    })
  })
}
const verify = ref(null)
const showCheck = () => {
  if (!isMobile(dataForm.mobile)) {
    ElMessage({
      message: '请输入正确手机号',
      type: 'error',
      duration: 1000
    })
    return
  }
  verify.value.show()
}
/**
 * 获取验证码
 */
const getCode = Debounce((verifyResult) => {
  if (!isMobile(dataForm.mobile)) {
    ElMessage({
      message: '请输入正确手机号',
      type: 'error',
      duration: 1000
    })
    return
  }
  const data = {
    phone: dataForm.mobile,
    verificationCodeType: props.isHaveMobile ? 6 : 9,
    captchaVerification: verifyResult.captchaVerification
  }
  getVerificationCode(data).then(() => {
    countdown.value = 60
    getCountdown()
  })
})

const getCountdown = () => {
  timer.value = setInterval(() => {
    countdown.value--
    if (countdown.value === 0) {
      clearInterval(timer.value)
    }
  }, 1000)
}

</script>

<style lang="scss" scoped>
.component-mobile-add-or-unbind{
  .get-code {
    font-size: 14px;
    line-height: 18px;
    color: #155BD4;
    margin-right: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    height: 100%;
  }
  :deep(.el-dialog__header) {
    border-bottom: 1px solid rgba(0,0,0,0.06);
  }
  :deep(.el-dialog__footer) {
    border-top: 1px solid rgba(0,0,0,0.06);
    padding-bottom: 10px;
  }
}

</style>
