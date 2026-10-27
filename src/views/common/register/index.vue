<!--
 Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

 https://www.mall4j.com/

 未经允许，不可做商业用途！

 版权所有，侵权必究！
-->
<template>
  <div class="page-register">
    <div class="login-frame">
      <div class="login-img">
        <WebConfigImg
          :src="webConfig.loginBgImg"
          def-img-type="loginBgImg"
        />
      </div>

      <div class="register-info">
        <!-- <div class="title">蓝海创新科技商家端管理系统</div> -->
        <div class="title-box">
          <div class="reg">
            商家注册
          </div>
          <div class="has-account">
            {{ $t('register.hasAccount') }}<span
              class="brightness"
              @click="toLogin"
            >{{ $t('register.toLogin') }}</span>
          </div>
        </div>
        <div class="input-box">
          <div :class="['inp-item', usernameErrTips || usernameEmptyTips ? 'error':'']">
            <input
              v-model="username"
              maxlength="16"
              :placeholder="$t('register.username')"
              @blur="validateProp('username')"
            >
            <div
              v-if="usernameEmptyTips"
              class="err-tips"
            >
              {{ $t('register.usernameEmptyTips') }}
            </div>
            <div
              v-else-if="usernameErrTips"
              class="err-tips"
            >
              {{ $t('register.usernameErrTips') }}
            </div>
          </div>
          <div :class="['inp-item', mobileErrTips ? 'error':'']">
            <div :class="['mobile',mobileBorder ? 'borderColor' : '']">
              <el-select
                v-model="value"
                :placeholder="$t('tip.select')"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <input
                v-model="mobile"
                class="mobile-input"
                type="text"
                oninput="value=value.replace(/[^\d]/g,'')"
                maxlength="11"
                :placeholder="$t('register.mobile')"
                @focus="mobileCus"
                @blur="mobileCus"
              >
            </div>
            <div
              v-if="mobileErrTips"
              class="err-tips"
            >
              {{ $t('register.mobileErrTips') }}
            </div>
          </div>
          <div :class="['inp-item', validCodeErrTips ? 'error':'']">
            <div :class="['yzm',isFocus ? 'focus' : '']">
              <input
                v-model="validCode"
                maxlength="6"
                type="text"
                :placeholder="$t('register.validCode')"
                @focus="onCodeIntFocus"
                @blur="onCodeIntBlur"
              >
              <div
                v-if="countdown=== 0"
                class="get-code"
                @click="showCheck"
              >
                {{ $t('register.getCode') }}
              </div>
              <div
                v-else
                class="get-code"
              >
                {{ countdown }} s
              </div>
            </div>
            <div
              v-if="validCodeErrTips"
              class="err-tips"
            >
              {{ $t('register.validCodeErrTips') }}
            </div>
          </div>
          <div :class="['inp-item', passwordEmptyTips || passwordErrorTips || passwordErrorTips2 ? 'error':'']">
            <!-- 占位文本框 -->
            <input
              type="text"
              value=""
              style="position: absolute; top:0; opacity:0; width:0; height:0; border:0"
            >
            <input
              ref="passwordRef"
              v-model="password"
              v-input-rule
              :type="passwordType"
              maxlength="20"
              autocomplete="new-password"
              :placeholder="$t('register.passwordTips')"
              @blur="validateTrim()"
            >
            <div class="conceal-icon">
              <div
                v-show="passwordType === 'text'"
                class="icon"
                @click="changePass('password')"
              >
                <img
                  src="~@/assets/images/Frame-view.png"
                  width="16"
                >
              </div>
              <div
                v-show="passwordType === 'password'"
                class="icon"
                @click="changePass('text')"
              >
                <img
                  src="~@/assets/images/Frame.png"
                  width="16"
                >
              </div>
            </div>

            <div
              v-if="passwordEmptyTips"
              class="err-tips"
            >
              {{ $t('register.passwordEmptyTips') }}
            </div>
            <div
              v-if="passwordErrorTips2"
              class="err-tips"
            >
              {{ $t('register.passwordErrorTips2') }}
            </div>
            <div
              v-if="passwordErrorTips"
              class="err-tips"
            >
              {{ $t('register.passwordVerification') }}
            </div>
          </div>
        </div>
        <div class="agreement">
          <el-checkbox
            v-model="checked"
            @change="changeCheckbox"
          />
          <div class="ag-txt">
            {{ $t('register.agree') }}<a
              class="strong"
              @click="queryRegisterProtocol"
            >《商家注册协议》</a>
          </div>
        </div>
        <div
          class="register-btn"
          @click="handleRegister"
        >
          {{ $t('register.register') }}
        </div>
      </div>
    </div>
    <div class="bottom">
      {{ language === 'zh' ? webConfig.copyrightCn : webConfig.copyrightEn }}
    </div>

    <!-- 商家注册协议弹窗 -->
    <el-dialog
      v-model="protocolDialogVisible"
      title="商家注册协议"
      width="80%"
      top="6vh"
      :close-on-click-modal="false"
      class="merchant-register-protocol"
    >
      <div class="registration-agreement">
        <div v-rich="registerProtocol" />
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button
            type="primary"
            @click="readAndAgree"
          >
            {{ $t('register.agree2') }}
          </el-button>
        </div>
      </template>
    </el-dialog>

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
      <div class="success-tip">
        <img
          src="@/assets/images/success.png"
          class="success-icon"
        >
        <div class="txt">
          {{ $t('register.registerSuccess') }}
        </div>
      </div>
    </el-dialog>
    <Verify
      ref="verify"
      :captcha-type="'blockPuzzle'"
      :img-size="{width:'400px',height:'200px'}"
      @success="getCode"
    />
  </div>
</template>

<script setup>
import { isMobile, isUserName, validPassword, noSpacesBothSides, validNoEmptySpace, validPassword2 } from '@/utils/validate'
import { getRegisterCode, register, getMerchantRegisterProtocol } from '@/api/auth/auth'
import { encrypt } from '@/utils/crypto'
import { Debounce } from '@/utils/debounce'
import { ElMessage } from 'element-plus'

const router = useRouter()
const passwordType = ref('password')
const usernameErrTips = ref(false)
const usernameEmptyTips = ref(false)
const mobileErrTips = ref(false)
const passwordEmptyTips = ref(false)
const passwordErrorTips = ref(false)
const passwordErrorTips2 = ref(false)
const validCodeErrTips = ref(false)
const username = ref('')
const mobile = ref('')
const password = ref('')
const validCode = ref('')
const isFocus = ref(false) // 是否获取焦点
const countdown = ref(0)
const checked = ref(false) // 是否选中
let timer = null

// 注册成功提示弹窗
const dialogVisible = ref(false)

// 注册协议弹窗显隐
const protocolDialogVisible = ref(false)
// 注册协议内容
const registerProtocol = ref('')
const options = [{
  value: '0',
  label: '+86'
}]
const value = ref('0')
const mobileBorder = ref(false)
const webConfig = JSON.parse(localStorage.getItem('cloudShopWebConfigData')) || {}
// 当前语言
const language = computed(() => useAppStore().language)

watch(username, () => {
  if (username.value && usernameEmptyTips) {
    usernameEmptyTips.value = false
    return
  }
  if (isUserName(username) && usernameErrTips) {
    usernameErrTips.value = false
  }
})

watch(mobile, () => {
  if (!mobile.value || isMobile(mobile.value)) {
    mobileErrTips.value = false
  }
})

watch(validCode, () => {
  if (validCode.value) {
    validCodeErrTips.value = false
  }
})

watch(password, () => {
  if (password.value.trim() && passwordEmptyTips.value) {
    passwordEmptyTips.value = false
    return
  }
  if (validPassword(password.value) && passwordErrorTips.value) {
    passwordErrorTips.value = false
  }
})

const getCountdown = () => {
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value === 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 验证码输入框聚焦监听
const onCodeIntFocus = () => {
  isFocus.value = true
}
// 验证码输入框失焦监听
const onCodeIntBlur = () => {
  isFocus.value = false
}
const verify = ref(null)
const showCheck = () => {
  if (!isMobile(mobile.value)) {
    mobileErrTips.value = true
    return
  }
  verify.value.show()
}
/**
 * 获取验证码
 */
const getCode = Debounce(function (verifyResult) {
  mobileErrTips.value = false
  const data = {
    mobile: mobile.value,
    shopAccount: 1,
    captchaVerification: verifyResult.captchaVerification
  }
  getRegisterCode(data).then(() => {
    countdown.value = 60
    getCountdown()
  })
}, 1500)

/**
 * 校验密码
 */
const validateTrim = () => {
  passwordEmptyTips.value = false
  passwordErrorTips.value = false
  passwordErrorTips2.value = false
  // 密码为空
  if (!password.value.trim()) {
    password.value = password.value.trim()
    passwordEmptyTips.value = true
    return
  }
  // 如果校验到两侧有空格，提示用户
  if (noSpacesBothSides(password.value)) {
    passwordErrorTips2.value = true
    return
  }
  // 密码验证
  if (!validPassword2(password.value)) {
    passwordErrorTips.value = true
  }
}

// 多选框变化
const changeCheckbox = (val) => {
  checked.value = val
}

// 校验是否通过
const handleRegister = () => {
  username.value = username.value.trim()
  if (!username.value) {
    usernameEmptyTips.value = true
    return
  }
  if (!isUserName(username.value)) {
    usernameErrTips.value = true
    return
  }
  if (!isMobile(mobile.value)) {
    mobileErrTips.value = true
    return
  }
  if (!validCode.value || validNoEmptySpace(validCode.value)) {
    validCode.value = ''
    validCodeErrTips.value = true
    return
  }
  if (!password.value || !password.value.trim()) {
    passwordEmptyTips.value = true
    return
  }
  if (passwordEmptyTips.value || passwordErrorTips.value || passwordErrorTips2.value) {
    return
  }

  usernameEmptyTips.value = false
  usernameErrTips.value = false
  mobileErrTips.value = false
  validCodeErrTips.value = false
  passwordEmptyTips.value = false
  passwordErrorTips.value = false

  if (!checked.value) {
    ElMessage({
      message: $t('register.readAgreement'),
      type: 'error',
      duration: 1500
    })
    return
  }
  onRegister()
}
// 注册
const onRegister = Debounce(function () {
  const registerInfo = {
    username: username.value,
    mobile: mobile.value,
    validCode: validCode.value,
    password: encrypt(password.value)
  }

  register(registerInfo).then(() => {
    dialogVisible.value = true
    setTimeout(() => {
      dialogVisible.value = false
      router.push('/login?redirect=%2Fdashboard')
    }, 1500)
  })
})

/**
 * 商家注册协议
 */
const queryRegisterProtocol = () => {
  protocolDialogVisible.value = true
  getMerchantRegisterProtocol().then((data) => {
    registerProtocol.value = data
  })
}

// 已阅读并同意注册协议
const readAndAgree = () => {
  protocolDialogVisible.value = false
  checked.value = true
}

// 去登录
const toLogin = () => {
  router.push('/login?redirect=%2Fdashboard')
}
const mobileCus = () => {
  mobileBorder.value = !mobileBorder.value
}
const passwordRef = ref()
const changePass = (value) => {
  passwordType.value = value
  nextTick(() => { // 对焦密码框
    passwordRef.value?.focus()
  })
}
/**
 * @param {String } prop 需要验证字段 enum {username，mobile，validCode，password}
 */
const validateProp = (prop) => {
  const validateObj = {
    username () {
      username.value = username.value.trim()
      if (!username.value) {
        usernameEmptyTips.value = true
        return
      }
      if (!isUserName(username.value)) {
        usernameErrTips.value = true
        return
      }
      usernameEmptyTips.value = false
      usernameErrTips.value = false
    },
    mobile () {
      if (!isMobile(mobile.value)) {
        mobileErrTips.value = true
        return
      }
      mobileErrTips.value = false
    },
    validCode () {
      if (!validCode.value || validNoEmptySpace(validCode.value)) {
        validCode.value = ''
        validCodeErrTips.value = true
        return
      }
      mobileErrTips.value = false
    },
    password () {
      if (!password.value || !password.value.trim()) {
        passwordEmptyTips.value = true
        return
      }
      if (passwordEmptyTips.value || passwordErrorTips.value || passwordErrorTips2.value) {
        return
      }
      passwordEmptyTips.value = false
      passwordErrorTips.value = false
    }
  }
  validateObj?.[prop]?.()
}
</script>

<style lang="scss" scoped>
.page-register {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 680px;
  min-width: 1200px;
  background: url("@/assets/images/login-bg.jpg") no-repeat;
  background-size: cover;
  .login-frame {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    width: 1050px;
    height: 594px;
    background: #fff;
    box-shadow: 0 0 80px 0 rgba(0, 0, 0, 0.1);
    margin: auto;
    border-radius: 5px;
    overflow: hidden;
    .login-img {
      // margin-left: 80px;
      width: 626px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 626px;
        height: 594px;
      }
    }
    .register-info {
      margin-left: 32px;
      .title-box {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        font-size: 14px;
        .reg {
          font-size: 24px;
          font-weight: 500;
          color: #000;
        }
        .has-account {
          color: #999;
        }
        .brightness {
          color: #155BD4;
          cursor: pointer;
        }
      }
      .input-box {
        margin-top: 30px;
        .inp-item {
          position: relative;
          width: 360px;
          margin-bottom: 20px;
          .mobile {
            display: flex;
            border: 1px solid #eaeaea;
          }
          .mobile-input{
            border: none;
          }
          img {
            width: 20px;
            height: 20px;
          }
          input {
            // border: none;
            outline: none;
            width: 100%;
            height: 40px;
            font-size: 14px;
            border-radius: 2px;
            padding: 0 12px;
            border: 1px solid#eaeaea;
          }
          input::-webkit-input-placeholder {
            font-size: 14px;
            color: #999;
          }
          input:focus {
            border-color: #007DE4;
          }
        }
        .error {
          .yzm, input {
            border-color: #FF2120;
          }
          .yzm {
            .get-code {
              border: none;
              background: #155BD4;
            }
          }
          .yzm.focus {
            border-color: #FF2120;
          }
          .err-tips {
            // position: absolute;
            // bottom: -22px;
            font-size: 12px;
            color: #FF2120;
            margin-top: 6px;
          }
        }
        .yzm.focus {
          border-color: #007DE4;
        }
        .yzm {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 44px;
          border-radius: 2px;
          border: 1px solid#eaeaea;
          box-sizing: border-box;
          input {
            border: none;
            width: 73%;
          }
          .get-code {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100px;
            height: 100%;
            line-height: 100%;
            font-size: 14px;
            // background: #F8F8F8;
            color: #fff;
            // border-left: 1px solid #eaeaea;
            cursor: pointer;
            border-radius: 0 2px 2px 0;
            background: #155BD4;
          }
        }
        .conceal-icon {
          display: flex;
          position: absolute;
          top: 0;
          right: 15px;
          height: 40px;
          align-items: center;
          width: 16px;
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
      .agreement {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-top: 15px;
        .ag-txt {
          margin-left: 6px;
          font-size: 14px;
          color: #999999;
          a.strong {
            color: #155BD4;
            cursor: pointer;
          }
          a:hover {
            text-decoration: underline;
          }
        }
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
  .success-tip {
    display: flex;
    align-items: center;
    .success-icon {
      width: 25px;
      height: 25px;
    }
    .txt {
      margin-left: 10px;
      font-size: 15px;
      line-height: 1em;
    }
  }
}

.borderColor {
  border-color: #007DE4 !important;
}
:deep(.el-select){
  width: 124px;
  outline: none;
  .el-input.is-focus {
    .el-input__wrapper {
      box-shadow: none !important;
    }
  }
  .el-input__wrapper.is-focus {
    box-shadow: none !important;
  }
  .el-input__inner {
    height: 40px;
    line-height: 40px;
    border: none;
  }
  .el-input--suffix{
    white-space: nowrap;
    .el-input__wrapper {
      box-shadow: none;
    }
  }
  .el-input--suffix:after {
    content: '';
  border-left: 1px solid #eaeaea;
  }
}

// 商家注册协议
.merchant-register-protocol {
  :deep(.el-dialog__body) {
    height: 700px;
    overflow-y: auto;
    padding: 0 30px;
  }
  :deep(.el-dialog__body::-webkit-scrollbar) {
    display: none; /* Chrome Safari */
  }
  :deep(.el-dialog__footer) {
    padding-top: 20px;
  }
}

@media (max-width: 1366px){
  .page-register {
    .bottom {
      bottom: 40px;
    }
  }
}
</style>
