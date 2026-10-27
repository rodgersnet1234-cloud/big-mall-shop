<!--
 Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

 https://www.mall4j.com/

 未经允许，不可做商业用途！

 版权所有，侵权必究！
-->
<template>
  <el-dialog
    v-model="visible"
    :title="dataForm.shopUserId ? $t('table.edit') : $t('table.create')"
    width="600px"
    :close-on-click-modal="false"
    class="page-shop-user-add-or-update"
    @close="close"
  >
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
    <el-form
      ref="dataFormRef"
      :rules="dataForm.shopUserId ? updateDataRule : dataRule"
      :model="dataForm"
      label-position="right"
      label-width="80px"
      style="width: 90%;"
      @submit.prevent
    >
      <!-- 昵称 -->
      <el-form-item
        :label="$t('multishop.shopUser.nickName')"
        prop="nickName"
      >
        <el-input
          v-model="dataForm.nickName"
          maxlength="30"
          show-word-limit
          placeholder="请输入昵称"
        />
      </el-form-item>
      <!-- 用户名 -->
      <el-form-item
        :label="$t('multishop.shopUser.username')"
        prop="username"
      >
        <el-input
          v-model="dataForm.username"
          maxlength="16"
          show-word-limit
          :placeholder="$t('register.username')"
        />
      </el-form-item>
      <!-- 手机号 -->
      <el-form-item
        :label="$t('multishop.shopUser.mobileNumber')"
        prop="phone"
      >
        <el-input
          v-model="dataForm.phone"
          maxlength="11"
          show-word-limit
          :placeholder="$t('register.mobile')"
          @input="phoneInput"
          @change="changePhone"
        />
      </el-form-item>
      <!-- 验证码 -->
      <el-form-item
        v-if="validCodeVisible"
        :label="'验证码'"
        prop="validCode"
      >
        <el-input
          v-model="dataForm.validCode"
          type="text"
          :placeholder="'请输入验证码'"
          maxlength="6"
          autocomplete="off"
        >
          <template #append>
            <el-button
              v-if="countdown === 0"
              class="get-code"
              @click="showCheck"
            >
              获取验证码
            </el-button>
            <div
              v-else
              class="get-code"
            >
              {{ countdown }} s
            </div>
          </template>
        </el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item
        :label="$t('multishop.shopUserAccount.password')"
        prop="password"
      >
        <el-input
          v-model="dataForm.password"
          v-input-rule
          type="password"
          maxlength="20"
          show-password
          show-word-limit
          placeholder="请输入密码"
          autocomplete="new-password"
        />
      </el-form-item>
      <!-- 员工编号 -->
      <el-form-item
        :label="$t('multishop.shopUser.code')"
        prop="code"
      >
        <el-input
          v-model="dataForm.code"
          maxlength="60"
          show-word-limit
          placeholder="请输入员工编号"
        />
      </el-form-item>
      <!-- 邮箱 -->
      <el-form-item
        :label="$t('multishop.shopUserAccount.email')"
        prop="email"
      >
        <el-input
          v-model="dataForm.email"
          maxlength="50"
          show-word-limit
          placeholder="请输入邮箱"
        />
      </el-form-item>
      <!-- 选择角色 -->
      <el-form-item
        v-if="dataForm.isAdmin === 0"
        :label="'选择角色'"
        prop="roleIds"
      >
        <el-select
          v-model="dataForm.roleIds"
          multiple
          :placeholder="'请选择'"
        >
          <el-option
            v-for="item in roleOpts"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId"
          />
        </el-select>
      </el-form-item>
      <!-- 状态 -->
      <el-form-item
        v-if="dataForm.isAdmin === 0"
        :label="$t('multishop.shopUserAccount.status')"
        prop="status"
      >
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="1">
            启用
          </el-radio>
          <el-radio :label="0">
            禁用
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          plain
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
    <Verify
      ref="verify"
      :captcha-type="'blockPuzzle'"
      :img-size="{width:'400px',height:'200px'}"
      @success="getCode"
    />
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/multishop/shop-user'
import * as roleApi from '@/api/rbac/role'
import { Debounce } from '@/utils/debounce'
import { MOBILE_REGEXP, STAR_MOBILE_REGEXP, USER_NAME_REGEXP, EMAIL_REGEXP, validNoEmptySpace, noSpacesBothSides, validPassword2 } from '@/utils/validate'
import { getAddShopUserCode } from '@/api/auth/auth'
import { encrypt } from '@/utils/crypto'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
// 未修改的手机号
let phoneDb = null
const countdown = ref(0)
const dataFormRef = ref(null)
const dataForm = reactive({
  shopUserId: 0,
  userId: 0,
  shopId: null,
  nickName: null,
  username: null,
  password: null,
  avatar: null,
  isAdmin: 0,
  code: null,
  phone: null,
  phoneNum: null,
  validCode: null,
  email: null,
  hasAccount: null,
  status: 1,
  roleIds: []
})

const roleOpts = ref([])

const validPassword = (rule, value, callback) => {
  if (validNoEmptySpace(value)) {
    callback(new Error($t('multishop.shopUser.pwdBlank')))
  } else if (noSpacesBothSides(value)) {
    callback(new Error($t('multishop.shopUser.pwdNoBlank')))
  } else if (!(dataForm.shopUserId && !value) && !validPassword2(value)) {
    callback(new Error($t('register.passwordVerification')))
  } else {
    callback()
  }
}

// 新增时的验证规则
const dataRule = reactive({
  nickName: [
    { required: true, message: '昵称不能为空', trigger: 'blur' }
  ],
  avatar: [
    { required: true, message: '头像不能为空', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: MOBILE_REGEXP, message: '手机号格式有误' }
  ],
  validCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { validator: validPassword, trigger: 'blur' }
  ],
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { pattern: USER_NAME_REGEXP, message: '用户名由字母、数字或下划线4-16位组成，且不能为纯数字' }
  ],
  email: [
    { pattern: EMAIL_REGEXP, message: '邮箱格式有误' }
  ]

})

// 修改时的验证规则
const updateDataRule = reactive({
  avatar: [
    { required: true, message: '头像不能为空', trigger: 'blur' }
  ],
  nickName: [
    { required: true, message: '昵称不能为空', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: STAR_MOBILE_REGEXP, message: '手机号格式有误' }
  ],
  validCode: [
    { required: true, message: $t('register.validCode'), trigger: 'blur' }
  ],
  password: [
    { validator: validPassword, trigger: 'blur' }
  ],
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { pattern: USER_NAME_REGEXP, message: '用户名由字母、数字或下划线4-16位组成，且不能为纯数字' }
  ],
  email: [
    { pattern: EMAIL_REGEXP, message: '邮箱格式有误' }
  ]

})

const validCodeVisible = ref(true)
const init = (shopUserId) => {
  dataForm.isAdmin = 0
  dataForm.validCode = null
  dataForm.comfirmPassword = null
  countdown.value = 0
  visible.value = true
  phoneDb = null
  nextTick(() => {
    validCodeVisible.value = !shopUserId
    roleApi.list().then(data => {
      roleOpts.value = data
    })
    if (shopUserId && shopUserId !== 0) {
      api.get(shopUserId).then(data => {
        dataForm.isAdmin = data.isAdmin
        dataForm.username = data.username
        dataForm.nickName = data.nickName
        dataForm.email = data.email
        dataForm.phoneNum = data.phoneNum
        dataForm.phone = data.phone
        dataForm.roleIds = data.roleIds
        dataForm.status = data.status
        dataForm.shopUserId = shopUserId
        phoneDb = dataForm.phone
      })
    } else {
      dataForm.shopUserId = 0
      setTimeout(() => {
        dataFormRef.value?.resetFields()
        dataFormRef.value?.clearValidate()
      }, 30) // 得加上定时器否则会报错失效
    }
  })
}

let timer = null
const getCountdown = () => {
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value === 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const close = () => {
  dataFormRef.value?.resetFields()
  dataFormRef.value?.clearValidate()
}
const verify = ref(null)

const showCheck = async () => {
  mobileErrTips = false
  await dataFormRef.value.validateField(['phone'], (valid) => {
    if (!valid) {
      mobileErrTips = true
    }
  })
  if (mobileErrTips) {
    return
  }
  verify.value.show()
}
/**
 * 获取验证码
 */
let mobileErrTips = false
const getCode = Debounce((verifyResult) => {
  const phoneObj = {
    mobile: dataForm.phone,
    shopAccount: 1,
    captchaVerification: verifyResult.captchaVerification
  }

  // 在发送验证码之前，验证一下该电话号码是否存在
  const param = JSON.parse(JSON.stringify(dataForm))
  param.roleIds = []
  api.verifyAccount(param).then(data => {
    if (!data) {
      // 验证不通过
      mobileErrTips = true
    } else {
      getAddShopUserCode(phoneObj).then(() => {
        countdown.value = 60
        getCountdown()
      }).catch(() => {})
    }
  })
}, 1500)

// 修改手机号码
const changePhone = () => {
  if (!dataForm.shopUserId) {
    return
  }
  validCodeVisible.value = phoneDb !== dataForm.phone
}

const phoneInput = (val) => {
  dataForm.phone = val.replace(/[^\d|*]/g, '')
}

// 表单提交
const onSubmit = Debounce(() => {
  dataFormRef.value.validate(valid => {
    if (valid) {
      const data = JSON.parse(JSON.stringify(dataForm))
      // 删除comfirmPassword这个属性
      Reflect.deleteProperty(data, 'comfirmPassword')
      // 不填写密码默认是不更改
      if (data.password) {
        data.password = encrypt(data.password)
      }
      const request = data.shopUserId ? api.update(data) : api.save(data)
      request.then(() => {
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            visible.value = false
            countdown.value = 0
            clearInterval(timer)
            emit('refreshDataList')
            dataFormRef.value.resetFields()
          }
        })
      })
    }
  })
}, 1500)

defineExpose({ init })

</script>
