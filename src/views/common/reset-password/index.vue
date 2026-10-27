<!--
 Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

 https://www.mall4j.com/

 未经允许，不可做商业用途！

 版权所有，侵权必究！
-->
<template>
  <div class="page-reset-password">
    <div class="login-frame">
      <div class="login-img">
        <WebConfigImg
          :src="webConfig.loginBgImg"
          def-img-type="loginBgImg"
        />
      </div>

      <div class="register-info">
        <div class="title-box">
          <div class="reg">
            {{ $t('forgetPassword.retrievePassword') }}
          </div>
        </div>
        <div class="input-box">
          <el-form
            ref="dataFormRef"
            :model="loginInfo"
            :rules="dataRule"
            size="large"
            @submit.prevent
          >
            <el-form-item
              prop="password"
              class="password"
            >
              <el-input
                ref="passwordRef"
                v-model="loginInfo.password"
                v-input-rule
                :type="passwordType"
                :placeholder="$t('resetPassword.passwordTips')"
                maxlength="20"
              >
                <template #suffix>
                  <div
                    v-show="passwordType === 'text'"
                    class="icon"
                    @click="changePass('password','passwordRef',0)"
                  >
                    <img
                      src="~@/assets/images/Frame-view.png"
                      width="16"
                    >
                  </div>
                  <div
                    v-show="passwordType === 'password'"
                    class="icon"
                    @click="changePass('text','passwordRef',0)"
                  >
                    <img
                      src="~@/assets/images/Frame.png"
                      width="16"
                    >
                  </div>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password2">
              <el-input
                ref="password2Ref"
                v-model="loginInfo.password2"
                v-input-rule
                :type="passwordType2"
                :placeholder="$t('resetPassword.passwordTips2')"
                maxlength="20"
              >
                <template #suffix>
                  <div
                    v-show="passwordType2 === 'text'"
                    class="icon"
                    @click="changePass('password','password2Ref',1)"
                  >
                    <img
                      src="~@/assets/images/Frame-view.png"
                      width="16"
                    >
                  </div>
                  <div
                    v-show="passwordType2 === 'password'"
                    class="icon"
                    @click="changePass('text','password2Ref',1)"
                  >
                    <img
                      src="~@/assets/images/Frame.png"
                      width="16"
                    >
                  </div>
                </template>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <div
          class="register-btn"
          @click="onConfirm"
        >
          {{ $t('table.confirm') }}
        </div>
        <div class="brightness-btn">
          <div
            class="brightness"
            @click="toLogin"
          >
            {{ $t('forgetPassword.returnLogin') }}
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      {{ language === 'zh' ? webConfig.copyrightCn : webConfig.copyrightEn }}
    </div>
    <!-- 注册成功提示弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="$t('table.tips')"
      width="350px"
      center
      class="success-dialog"
      :close-on-click-modal="false"
      :show-close="false"
      top="25vh"
    >
      <img
        src="@/assets/images/success.png"
        class="success-icon"
      >
      <div class="txt">
        {{ $t('register.registerSuccess') }}
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { forgetPassword } from '@/api/auth/auth'
import { encrypt } from '@/utils/crypto'
import { noSpacesBothSides, validPassword2 } from '@/utils/validate'
import { ElMessage } from 'element-plus'
import { useWebConfigStore } from '@/stores/modules/web-config.js'

const router = useRouter()

const webConfig = computed(() => useWebConfigStore().webConfig)

// 当前语言
const language = computed(() => useAppStore().language)
const loginInfo = reactive({
  password: '', // 用户名
  password2: '' // 密码
})
const passwordType = ref('password')
const passwordType2 = ref('password')
// 注册成功提示弹窗
const dialogVisible = ref(false)
const dataFormRef = ref(null)
const passwordRef = ref(null)
const password2Ref = ref(null)

const passwordVerification = (rule, value, callback) => {
  const password = loginInfo.password.trim()
  if (!password) {
    loginInfo.password = password
    callback(new Error($t('login.passwordTips')))
  } else if (noSpacesBothSides(loginInfo.password)) { // 如果校验到两侧有空格，提示用户
    callback(new Error($t('register.passwordErrorTips2')))
  } else if (!validPassword2(value)) {
    callback(new Error($t('register.passwordVerification')))
  } else {
    callback()
  }
}
const passwordVerification2 = (rule, value, callback) => {
  const password = loginInfo.password2.trim()
  if (!password) {
    loginInfo.password2 = password
    callback(new Error($t('login.passwordTips')))
  }
  // 如果校验到两侧有空格，提示用户
  if (noSpacesBothSides(loginInfo.password2)) {
    callback(new Error($t('register.passwordErrorTips2')))
  }
  // 二次密码校验
  if (loginInfo.password !== loginInfo.password2) {
    callback(new Error($t('resetPassword.passwordError')))
  }
  callback()
}

const dataRule = reactive({
  password: [
    { required: true, message: $t('login.pawNoNull'), trigger: 'blur' },
    { validator: passwordVerification, trigger: 'blur' }
  ],
  password2: [
    { required: true, message: $t('login.pawNoNull'), trigger: 'blur' },
    { validator: passwordVerification2, trigger: 'blur' }
  ]
})

// 确认
const onConfirm = () => {
  dataFormRef.value?.validate((valid) => {
    const checkUpdatePwdSmsFlag = localStorage.getItem('cloudCheckUpdatePwdSmsFlag') || ''
    const mobile = localStorage.getItem('cloudMobile') || ''

    if (valid && checkUpdatePwdSmsFlag && mobile) {
      const data = {
        checkUpdatePwdSmsFlag,
        mobile,
        newPassword: encrypt(loginInfo.password2),
        sysType: 1
      }
      forgetPassword(data).then(() => {
        localStorage.removeItem('cloudMobile')
        localStorage.removeItem('cloudCheckUpdatePwdSmsFlag')
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success'
        })
        router.push('/login?redirect=%2Fdashboard')
      })
    }
  })
}

const { proxy } = getCurrentInstance()
const changePass = (value, ref, index) => {
  if (index === 0) {
    passwordType.value = value
  } else {
    passwordType2.value = value
  }
  nextTick(() => { // 对焦密码框
    proxy.$refs[ref].focus()
  })
}
// 去登陆
const toLogin = () => {
  router.push('/login?redirect=%2Fdashboard')
}
</script>

<style lang="scss" scoped>
.page-reset-password {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 680px;
  min-width: 1200px;
  background: url('@/assets/images/login-bg.jpg') no-repeat;
  background-size: cover;
  .login-frame {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    width: 1000px;
    height: 544px;
    background: #fff;
    box-shadow: 0 0 80px 0 rgba(0, 0, 0, 0.1);
    margin: auto;
    border-radius: 5px;
    overflow: hidden;
    .login-img {
      // margin-left: 80px;
      height: 100%;
      width: 576px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        height: 100%;
        width: 576px;
      }
    }
    .register-info {
      margin-left: 32px;
      .brightness-btn {
        display: flex;
        justify-content: center;
        margin-top: 85px;
        .brightness {
          color: #155BD4;
          cursor: pointer;
          text-align: center;
        }
      }
      .title-box {
        display: flex;
        justify-content: center;
        font-size: 14px;
        .reg {
          font-size: 24px;
          font-weight: 500;
          color: #000;
          margin-bottom: 70px;
        }
      }
      .input-box {
        margin-top: 30px;
        .password {
          width:360px;
          margin-bottom: 0;
          :deep(.el-form-item__content){
            &>div:last-child{
              padding-bottom: 22px;
            }
            div.el-form-item__error{
              // text-wrap: nowrap;
              position: static;
              padding-bottom: 8px;
            }
          }
        }
        .icon {
          cursor: pointer;
          line-height: 46px;
        }
      }
      .register-btn {
        width: 360px;
        height: 44px;
        line-height: 44px;
        font-size: 16px;
        font-weight: 400;
        color: #FFFFFF;
        background: #155BD4;
        border-radius: 2px;
        text-align: center;
        margin-top: 30px;
        cursor: pointer;
      }
    }
  }
  .bottom {
    position: absolute;
    width: 100%;
    bottom: 42px;
    font-size: 12px;
    color: #AAA;
    text-align: center;
  }

}

:deep(.el-input__suffix) {
  right:15px;
}

@media (max-width: 1366px){
  .page-reset-password {
    .bottom {
      bottom: 42px;
    }
  }
}
</style>
