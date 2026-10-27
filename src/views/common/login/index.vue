<template>
  <div class="Mall4j page-login login-container">
    <div class="login-frame">
      <div class="login-img">
        <WebConfigImg
          v-show="isLoadUseWebConfigStoreAddData"
          :src="webConfig.loginBgImg"
          def-img-type="loginBgImg"
        />
      </div>
      <div class="login-info">
        <div
          v-show="isLoadUseWebConfigStoreAddData"
          class="title"
        >
          {{ webConfig.titleContentCn }}
        </div>
        <div class="input-box">
          <el-form
            ref="dataFormRef"
            :model="loginInfo"
            :rules="dataRule"
            @keyup.enter="onSubmit(dataFormRef)"
          >
            <el-form-item prop="userName">
              <el-input
                v-model="loginInfo.userName"
                v-input-rule
                :maxlength="16"
                :placeholder="$t('login.userNameTips')"
              />
            </el-form-item>
            <el-form-item prop="passWord">
              <el-input
                ref="passwordRef"
                v-model="loginInfo.passWord"
                v-input-rule
                :type="passwordType"
                :placeholder="$t('login.passwordTips')"
                maxlength="20"
                show-password
                @keyup.enter="onSubmit(dataFormRef)"
              />
            </el-form-item>
          </el-form>
          <div class="reg">
            <div>
              <router-link
                class="to-reg"
                to="/register"
              >
                免费开店，商户入驻
              </router-link>
            </div>
            <router-link
              to="/forget-password"
              class="to-reg"
            >
              {{ $t('login.forgetPassword') }}
            </router-link>
          </div>
          <div
            class="login-btn"
            :loading="loading"
            @click="onSubmit(dataFormRef)"
          >
            {{ $t('login.login') }}
          </div>
        </div>
      </div>
    </div>
    <div
      v-show="isLoadUseWebConfigStoreAddData"
      class="bottom"
    >
      {{ language === 'zh' ? webConfig.copyrightCn : webConfig.copyrightEn }}
    </div>
    <Verify
      ref="verify"
      :captcha-type="'blockPuzzle'"
      :img-size="{width:'400px',height:'200px'}"
      @success="onLogin"
    />
  </div>
</template>
<script setup>
import { getBasicInfo, createAllinpayMember } from '@/api/multishop/shop-process'
import { useWebConfigStore } from '@/stores/modules/web-config.js'
const isLoadUseWebConfigStoreAddData = inject('isLoadUseWebConfigStoreAddData')
const webConfig = computed(() => useWebConfigStore().webConfig)

// 当前语言
const language = computed(() => useAppStore().language)
// 登录表单
const loginInfo = reactive({
  userName: '', // 用户名
  passWord: '', // 密码
  captchaVerification: '', // 验证码
  sysType: 1
})

const passwordType = ref('password')
const passwordRef = ref(null)
const userNameVerification = (rule, value, callback) => {
  if (!validUsername(value)) {
    callback(new Error($t('login.usernameTips')))
  }
  callback()
}
const passwordVerification = (rule, value, callback) => {
  const passWord = loginInfo.passWord.trim()
  if (!passWord) {
    loginInfo.passWord = passWord
    callback(new Error($t('login.passwordTips')))
  }
  callback()
}

const dataRule = reactive({
  userName: [
    { required: true, message: $t('login.userNameNoNull'), trigger: 'blur' },
    { validator: userNameVerification, trigger: 'blur' }
  ],
  passWord: [
    { required: true, message: $t('login.pawNoNull'), trigger: 'blur' },
    { validator: passwordVerification, trigger: 'blur' }
  ]
})
const dataFormRef = ref(null)
const verify = ref(null)
const onSubmit = async formEl => {
  if (!formEl) return
  await formEl.validate(valid => {
    if (valid) {
      verify.value.show()
    }
  })
}
const router = useRouter()
const redirect = ref('/')
let otherQuery = {}
const getOtherQuery = (query) => {
  if (query.redirect) {
    // 解析 redirect 参数的值，获取其中的查询参数部分
    const redirectParams = new URLSearchParams(query.redirect.split('?')[1])
    redirectParams.forEach((value, key) => {
      // 排除掉重复的参数
      if (!query[key]) {
        query[key] = value
      }
    })
    // 排除 redirect 参数本身
    delete query.redirect
  }
  // 返回剩余的参数
  return query
}

watch(
  () => useRoute(),
  (route) => {
    const query = route.query
    if (query && query.redirect) {
      redirect.value = query.redirect
      otherQuery = getOtherQuery(query)
    }
  },
  { immediate: true }
)

const loading = ref(false)
const userStore = useUserStore()
// 登录
const onLogin = verifyResult => {
  const preUserId = localStorage.getItem('cloudNowUserId')
  loading.value = true
  loginInfo.captchaVerification = verifyResult.captchaVerification
  const loginData = JSON.parse(JSON.stringify(loginInfo))
  loginData.passWord = encrypt(loginInfo.passWord)
  userStore.login(loginData).then(() => {
    localStorage.removeItem('cloudVsNotificationMessage')
    // 获取用户信息
    userStore.getUserInfo().then(data => {
      // 储存当前登录的用户Id
      localStorage.setItem('cloudNowUserId', data.userId)
      const allinpayStore = useAllinpayStore()
      // 获取并更新通联支付配置信息（平台开启通联支付会清除所有用户token，所以重新登录时更新通联支付配置信息）
      allinpayStore.getPaySettlementType().then(paySettlementType => {
        if (paySettlementType === 1 && data.isPassShop) {
          // 已开店且通联支付开启的未创建通联会员的用户，创建通联会员
          getBasicInfo().then(res => {
            if (res.isCreateMember !== 1) {
              createAllinpayMember()
            }
          })
        }
      })
      if (!data.isAdmin) {
        redirect.value = '/dashboard'
      }
      if (data.isPassShop) {
        // 如果用户发生变化则返回到首页，未改变则返回退出登录前的页面
        if (preUserId !== data.userId) {
          router.push({
            path: '/'
          })
        } else {
          router.push({ path: redirect.value === '/multishop/shop-process' ? '/' : redirect.value, query: otherQuery })
        }
      } else {
        // 如果未开店就跳转到开店页面
        router.push({ path: '/multishop/shop-process' })
      }
    })
    // 获取用户权限
    userStore.listPermissions()
    // 获取用户菜单ids
    userStore.listMenuIds()
  }).catch(() => {
    loading.value = false
  })
}
</script>

<style lang="scss" scoped>
.login-container {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 680px;
  min-width: 1200px;
  background: url('@/assets/images/login-bg.jpg') no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;
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
      width: 626px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .login-info {
      margin-left: 32px;
      width: 360px;
      .title {
        font-size: 24px;
        font-weight: 400;
        color: #000000;
        margin-bottom: 70px;
        text-align: center;
      }
      .input-box {
        margin-top: 10px;
        :deep(.el-form) {
          .el-form-item {
            margin-bottom: 22px;
            .el-input__wrapper {
              padding: 1px;
              background-color: #e8f0fe;
              .el-input__inner {
                text-indent: 15px;
                height: 38px;
                border-radius: 4px;
              }
              .el-input__suffix {
                padding-right: 10px;
              }
            }
          }
        }
      }
      .reg {
        display: flex;
        font-size: 14px;
        color: #999;
        justify-content: space-between;
      }
      .to-reg {
        color: #155BD4;
        cursor: pointer;
        text-decoration: none;
      }
      .login-btn {
        width: 363px;
        height: 48px;
        line-height: 48px;
        font-size: 18px;
        font-weight: 400;
        color: #FFFFFF;
        background: #155BD4;
        border-radius: 2px;
        text-align: center;
        margin-top: 60px;
        cursor: pointer;
        letter-spacing: 2px;
      }
    }
  }
  .bottom {
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
    bottom: 42px;
    font-size: 12px;
    color: #AAA;
  }
}
</style>
