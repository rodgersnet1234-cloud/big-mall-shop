<template>
  <el-dialog
    v-model="visible"
    title="输入验证码"
    :close-on-click-modal="false"
    :append-to-body="true"
    width="378px"
    class="component-allinpay-verification"
  >
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
        {{ mobile }}
      </el-form-item>
      <el-form-item
        prop="validCode"
        label="验证码"
      >
        <el-input
          v-model="dataForm.validCode"
          placeholder="请输入验证码"
          style="width: 274px;"
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
    </el-form>
    <template #footer>
      <div>
        <el-button @click="visible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="payConfirm"
        >
          确定
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
import { Debounce } from '@/utils/debounce'

const emit = defineEmits([
  'getCode',
  'payConfirm'
])

defineProps({
  // 展示用手机号
  mobile: {
    type: String,
    default: ''
  },
  // 倒计时
  countdown: {
    type: Number,
    default: 0
  }
})

const dataForm = reactive({
  validCode: ''
})
const rules = reactive({
  validCode: [
    { required: true, message: '验证码不能为空', trigger: 'blur' }
  ]
})
const dataFormRef = ref()
const visible = ref(false)
const params = ref({}) // 参数

const init = (data) => {
  visible.value = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
    params.value = data
  })
}
const verify = ref(null)
const showCheck = () => {
  verify.value?.show()
}
// 获取验证码
const getCode = Debounce((verifyResult) => {
  console.log('🚀 ~ getCode ~ verifyResult:', verifyResult)
  emit('getCode', params, verifyResult)
})

// 确定支付（通联支付）
const payConfirm = () => {
  dataFormRef.value?.validate((valid) => {
    if (!valid) return
    emit('payConfirm', dataForm.validCode)
  })
}

defineExpose({
  init
})
</script>

<style scoped>
.component-allinpay-verification {
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
