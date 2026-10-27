<template>
  <el-dialog
    v-model="dialogVisible"
    class="component-sign-acct-protocol"
    title="签约协议"
    :close-on-click-modal="false"
    :append-to-body="true"
    width="378px"
  >
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      label-width="100px"
      @submit.prevent
    >
      <el-form-item
        prop="signAcctType"
        label="协议类别："
        :rules="[{ required: true, message: '请选择签约类别' }]"
      >
        <el-radio-group v-model="dataForm.signAcctType">
          <el-radio
            :disabled="legalAcctProtocolNo?true:undefined"
            :label="2"
          >
            对私签约
          </el-radio>
          <el-radio
            :disabled="acctProtocolNo?true:undefined"
            :label="3"
          >
            对公签约
          </el-radio>
        </el-radio-group>
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
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/multishop/shop-process'
import { ElMessage } from 'element-plus'

const props = defineProps({
  acctProtocolNo: {
    type: String,
    default: ''
  },
  legalAcctProtocolNo: {
    type: String,
    default: ''
  },
  mobile: {
    type: String,
    default: ''
  },
  legalCardNumber: {
    type: Number,
    default: 0
  }
})

const dialogVisible = ref(false)
const dataForm = reactive({
  signAcctType: '' // 签约类型 1.个人 2.法人 3.企业
})

const init = () => {
  dialogVisible.value = true

  if (props.legalAcctProtocolNo) dataForm.signAcctType = 2
  if (props.acctProtocolNo) dataForm.signAcctType = 3
}

defineExpose({
  init
})
const submitForm = () => {
  if (dataForm.signAcctType === '') {
    ElMessage.error('请选择签约类别')
    return
  }
  if (dataForm.signAcctType === 3 && (props.mobile === '' || props.mobile === null)) {
    ElMessage.error('请先绑定手机号')
    return
  }
  if (dataForm.signAcctType === 2 && props.legalCardNumber === 0) {
    ElMessage.error('请先绑定法人账户')
    return
  }
  const { protocol, host } = window.location
  const data = {
    signAcctType: dataForm.signAcctType,
    jumpUrl: `${protocol}//${host}/#/supplier/shop-information?isSuccess=1&signAcctType=${dataForm.signAcctType}&activeName=4`,
    noContractUrl: `${protocol}//${host}/#/supplier/shop-information?isSuccess=0&signAcctType=${dataForm.signAcctType}&activeName=4`
  }
  api.getAllinpaySignContract(data).then(data => {
    window.location.href = data
  })
}
</script>
