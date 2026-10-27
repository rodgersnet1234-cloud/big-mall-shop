<template>
  <el-dialog
    v-model="visible"
    :title="status ? $t('admin.resetPwd') : $t('admin.createAcc')"
    :close-on-click-modal="false"
    :width="lang === 'en'? '650px':'600px'"
    class="components-station-account"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-width="100px"
      style="width:500px;"
      @keyup.enter="onSubmit()"
    >
      <el-form-item
        :label="$t('delivery.station.stationName')"
        prop="stationName"
        style="width:500px;"
      >
        <el-input
          v-model="dataForm.stationName"
          disabled
        />
      </el-form-item>
      <el-form-item
        :label="$t('delivery.station.account')"
        prop="account"
        style="width:580px;"
      >
        <el-row style="width:100%">
          <el-col :span="20">
            <el-input
              v-model="dataForm.account"
              maxlength="30"
              show-word-limit
              class="account"
              :disabled="!editAccount"
              @change="onCheckAccount()"
            />
          </el-col>
          <el-col :span="4">
            <el-button
              v-if="!editAccount"
              type="primary"
              link
              @click="onChangeAccountInfo()"
            >
              {{ $t("admin.modifyAcc") }}
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item
        :label="$t('delivery.station.password')"
        prop="password"
        style="width:500px;"
        class="form-item-password"
      >
        <el-input
          v-model="dataForm.password"
          v-input-rule
          type="password"
          maxlength="20"
          show-word-limit
          show-password
        />
      </el-form-item>
      <el-form-item
        :label="$t('delivery.station.confirmPassword')"
        prop="passwordConfirm"
        style="width:500px;"
      >
        <el-input
          v-model="dataForm.passwordConfirm"
          v-input-rule
          type="password"
          maxlength="20"
          show-word-limit
          show-password
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="visible = false"
        >{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="onSubmit()"
        >{{ $t('table.confirm') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/delivery/station'
import { ElMessage } from 'element-plus'
import { validPassword2 } from '@/utils/validate'

const emit = defineEmits([
  'refreshDataList'
])

const dataForm = reactive({
  stationId: '',
  stationName: '',
  account: '',
  password: '',
  passwordConfirm: ''
})

// 验证账号
const lang = ref(window.localStorage.getItem('lang'))
const validateAccount = (rule, value, callback) => {
  const reg = /[^\w]/
  if (reg.test(value)) {
    callback(new Error(lang.value === 'en' ? 'The account can contain only digits or letters' : '账号只能为数字或字母'))
  } else if (!value.trim()) {
    callback(new Error($t('home.accNoNull')))
  }
  api.checkAccountInfo(dataForm.stationId, value)
    .then((data) => {
      if (!data) {
        callback(new Error('此账号已存在，请重新输入'))
      } else {
        callback()
      }
    })
}

// 验证密码
const validatePassword = (rule, value, callback) => {
  if (dataForm.password !== dataForm.passwordConfirm) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}
const validatePwd = (rule, value, callback) => {
  if (!validPassword2(value)) {
    callback(new Error($t('register.passwordVerification')))
  } else {
    callback()
  }
}

const dataRule = {
  account: [
    { required: true, message: '门店账号不能为空', trigger: 'blur' },
    { validator: validateAccount, trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { validator: validatePwd, trigger: 'blur' }
  ],
  passwordConfirm: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' }
  ]
}

// 初始化
const dataFormRef = ref()
const visible = ref(false)
const init = (stationId) => {
  dataForm.stationId = stationId || 0
  visible.value = true
  dataRule.password[0].required = true
  dataRule.passwordConfirm[0].required = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
    dataFormRef.value?.resetFields()
    dataForm.account = null
    dataForm.password = null
    dataForm.passwordConfirm = null
    onGetDataInfo()
  })
}

// 获取店铺详情数据
const editAccount = ref(true)
const status = ref(true)
const onGetDataInfo = () => {
  api.getStationInfo(dataForm.stationId)
    .then((data) => {
      onHandleDataForm(data)
      dataForm.password = ''
      status.value = !!data.account
      editAccount.value = !dataForm.account
    })
}

const onChangeAccountInfo = () => {
  editAccount.value = true
}

const onCheckAccount = () => {
  dataForm.account = dataForm.account.trim()
}

// 表单提交
const onSubmit = Debounce(() => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      const data = JSON.parse(JSON.stringify(dataForm))
      data.password = encrypt(data.password)
      data.passwordConfirm = encrypt(data.passwordConfirm)
      // 创建or修改
      onGetSaveOrUpdateReq(data)
        .then(() => {
          ElMessage({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              visible.value = false
              emit('refreshDataList')
            }
          })
        })
    }
  })
})

// 获取新增or更新请求
const onGetSaveOrUpdateReq = (data) => {
  if (status.value) {
    return api.changeAccountInfo(data)
  } else {
    return api.createAccount(data)
  }
}

// dataForm赋值
const onHandleDataForm = (data) => {
  dataForm.stationId = data.stationId
  dataForm.stationName = data.stationName
  dataForm.account = data.account
}

defineExpose({
  init
})
</script>

<style scoped>
.components-station-account {
  .account :deep(.el-input__inner) {
    padding-right: 45px !important;
  }
}
.form-item-password :deep(.el-form-item__error){
  text-wrap: nowrap
}
</style>
