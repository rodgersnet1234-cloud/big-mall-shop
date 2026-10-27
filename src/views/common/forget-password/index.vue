<template>
  <div class="page-forget-password">
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
                maxlength="11"
                :placeholder="$t('register.mobile')"
                @focus="mobileBorder = true"
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
                type="text"
                :placeholder="$t('register.validCode')"
                maxlength="6"
                @focus="isFocus = true"
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
        </div>
        <div
          class="register-btn"
          @click="nextStep"
        >
          {{ $t('forgetPassword.nextStep') }}
        </div>
        <div
          class="brightness"
          @click="toLogin"
        >
          {{ $t('forgetPassword.returnLogin') }}
        </div>
      </div>
    </div>
    <div class="bottom">
      {{ language === 'zh' ? webConfig.copyrightCn : webConfig.copyrightEn }}
    </div>
    <Verify
      ref="verify"
      :captcha-type="'blockPuzzle'"
      :img-size="{width:'400px',height:'200px'}"
      @success="getCode"
    />
  </div>
</template>

<!--
 Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

 https://www.mall4j.com/

 未经允许，不可做商业用途！

 版权所有，侵权必究！
-->
<script setup>
import { isMobile, validNoEmptySpace } from '@/utils/validate'
import { getForgetCode, checkUpdatePwd } from '@/api/auth/auth'
import { Debounce } from '@/utils/debounce'
import { ElMessage } from 'element-plus'

const webConfig = JSON.parse(localStorage.getItem('cloudShopWebConfigData')) || {}

// 当前语言
const language = computed(() => useAppStore().language)

const options = reactive([{
  value: '0',
  label: '+86'
}])

const mobileErrTips = ref(false)
const validCodeErrTips = ref(false)
const mobile = ref('')
const validCode = ref('')
const isFocus = ref(false)
const countdown = ref(0)
const value = ref('0')
const mobileBorder = ref(false)
const timer = ref('')
const router = useRouter()

const getCountdown = () => {
  timer.value = setInterval(() => {
    countdown.value--
    if (countdown.value === 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 验证码输入框失焦监听
const onCodeIntBlur = () => {
  isFocus.value = false
  validCodeErrTips.value = !validCode.value
}
const verify = ref(null)
const showCheck = () => {
  if (!isMobile(mobile.value)) {
    mobileErrTips.value = true
    return
  }
  verify.value.show()
}
// 获取验证码
const getCode = Debounce(function (verifyResult) {
  mobileErrTips.value = false
  const data = {
    mobile: mobile.value,
    shopAccount: 1,
    captchaVerification: verifyResult.captchaVerification
  }
  getForgetCode(data).then(() => {
    countdown.value = 60
    getCountdown()
  }).catch(() => {})
}, 1800)
// 校验是否通过
const nextStep = () => {
  if (!isMobile(mobile.value)) {
    mobileErrTips.value = true
    return
  }
  if (!validCode.value || validNoEmptySpace(validCode.value)) {
    validCode.value = ''
    validCodeErrTips.value = true
    return
  }
  mobileErrTips.value = false
  validCodeErrTips.value = false
  const params = {
    mobile: mobile.value,
    shopAccount: 1,
    validCode: validCode.value
  }
  checkUpdatePwd(params).then((data) => {
    if (data.code !== 'A00006') {
      localStorage.setItem('cloudMobile', mobile.value)
      localStorage.setItem('cloudCheckUpdatePwdSmsFlag', data)
      router.push('/reset-password')
    } else {
      ElMessage.error(data.msg)
    }
  })
}

// 去登录
const toLogin = () => {
  router.push('/login?redirect=%2Fdashboard')
}
const mobileCus = () => {
  mobileBorder.value = false
  mobileErrTips.value = !mobile.value || !isMobile(mobile.value)
}
</script>

<style lang="scss" scoped>
.page-forget-password {
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
    width: 1050px;
    height: 594px;
    background: #fff;
    box-shadow: 0 0 80px 0 rgba(0, 0, 0, 0.1);
    margin: auto;
    border-radius: 10px;
    overflow: hidden;
    .login-img {
      // margin-left: 80px;
      width: 626px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .register-info {
      margin-left: 32px;
      .brightness {
        color: #155BD4;
        cursor: pointer;
        text-align: center;
        margin-top: 85px;
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
          .yzm.focus {
            border-color: #FF2120;
          }
          .mobile, input {
            border-color: #FF2120 !important;;
          }
          .mobile.borderColor {
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

.borderColor {
  border-color: #007DE4 !important;
}
:deep(.el-select){
  width: 124px;
}
:deep(.el-input__inner) {
  height: 40px;
  line-height: 40px;
  border: none;
}
:deep(.el-input--suffix:after) {
  content: '';
  border-left: 1px solid #999999;
}
:deep(.el-input--suffix){
  white-space: nowrap;
}

</style>
