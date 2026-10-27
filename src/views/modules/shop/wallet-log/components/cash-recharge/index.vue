<template>
  <div class="component-cash-recharge">
    <el-dialog
      v-model="rechargeDialogShow"
      width="500px"
      class="recharge-money"
      title="充值"
      append-to-body
    >
      <!-- native modifier has been removed, please confirm whether the function has been affected  -->
      <el-form
        v-loading="loading"
        class="form"
        label-position="right"
        label-width="100px"
        :model="formData"
        @submit.prevent
      >
        <el-form-item label="店铺名称:">
          {{ formData.shopName }}
        </el-form-item>
        <el-form-item label="当前余额:">
          {{ amount(formData.balance) }}
        </el-form-item>
        <el-form-item
          label="充值金额:"
          required
        >
          <el-input
            v-model="formData.rechargeAmount"
            placeholder="请输入充值金额"
            class="form-input"
            @change="changAmount"
          />
        </el-form-item>
        <br>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="rechargeDialogShow=false">取 消</el-button>
          <el-button
            type="primary"
            @click="submitClick()"
          >充 值</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 微信支付 -->
    <weixinPay
      ref="weixinPayRef"
      :time-remaining="paySettlementType===1?3600:120"
    />
    <!-- 绑定手机号 -->
    <mobile-add-or-update
      v-if="mobileDialogVisible"
      ref="mobileAddOrUpdateRef"
      :is-have-mobile="false"
      @refresh-data-form="queryShopBasicInfo"
    />
  </div>
</template>

<script setup>
import Big from 'big.js'
import mobileAddOrUpdate from '../../../setting/components/mobile-add-or-update/index.vue'
import { ElMessage } from 'element-plus'
import weixinPay from '../weixin-pay/index.vue'
import * as api from '@/api/pay/pay.js'
import * as http from '@/api/multishop/shop-process.js'

const amount = (value) => {
  if (!value) {
    return 0
  }
  return new Big(value).div(100).toFixed(2)
}
const props = defineProps({
  visible: { // 是否显示
    default: false,
    type: Boolean
  },
  balance: {
    default: 0,
    type: Number
  }
})
const emit = defineEmits(['update:visible'])

const allinPayStore = useAllinpayStore()
const paySettlementType = ref(allinPayStore.paySettlementType) // 是否开启通联支付 1：开启 0：关闭
const formData = reactive({
  shopName: '自营店',
  balance: props.balance,
  rechargeAmount: null,
  validCode: null
})
const loading = ref(false)
const countdown = ref(0) // 倒计时
const isSendCode = ref(false) // 是否发送验证码
let timer = null // 定时器
const bizOrderNo = ref('') // 通联支付充值订单号(发送验证码后返回)
const mobileDialogVisible = ref(false)
const isBindPhone = ref(0) // 是否绑定手机号 0：未绑定 1：已绑定
const rechargeDialogShow = computed({
  get: function () {
    return props.visible
  },
  set: function (value) {
    emit('update:visible', value)
  }
})

const timeSetInterval = ref('')
onUnmounted(() => {
  window.clearInterval(timeSetInterval)
})

const mobileAddOrUpdateRef = ref('')
const weixinPayRef = ref('')
const submitClick = Debounce(() => {
  if (!formData.rechargeAmount) {
    ElMessage({
      message: '请输入充值金额',
      type: 'warning',
      duration: 1000
    })
    return
  }
  const { protocol, host } = window.location

  if (paySettlementType.value === 1) {
    if (isBindPhone.value === 0) {
      ElMessage({
        message: '暂未绑定手机号，请先绑定手机号',
        type: 'error',
        duration: 1500
      })
      // 绑定/解绑手机号
      mobileDialogVisible.value = true
      setTimeout(() => {
        mobileAddOrUpdateRef.value?.init()
      }, 1500)
      return
    }
    const data = {
      rechargeAmount: new Big(formData.rechargeAmount).times(100).valueOf(), // 充值金额
      returnUrl: paySettlementType.value === 1 ? '' : `${protocol}//${host}` + '/multishop/shop-walletLog'
    }
    api.rechargeAllinpay(data).then((res) => {
      weixinPayRef.value.weixinCodeUrl = res.value?.payInfo
      weixinPayRef.value.walletLogId = res.value?.walletLogId
      weixinPayRef.value.init(formData?.rechargeAmount)
    })
    return
  }
  const params = {
    payType: 3, // 3-微信支付
    returnUrl: `${protocol}//${host}` + '/multishop/shop-walletLog'
  }
  const data = {
    rechargeAmount: new Big(formData.rechargeAmount).times(100).valueOf()
  }
  api.rechargeOrder(data).then((data) => {
    params.shopWalletLogId = data
    toOrderPay(params)
  })
}, 1800)
// 支付跳转
const toOrderPay = (params) => {
  if (wxPayStatus === 0) {
    ElMessage({
      message: '系统尚未开启微信支付',
      type: 'warning',
      duration: 1000
    })
    return
  }
  api.payRecharge(params).then((data) => {
    weixinPayRef.value.weixinCodeUrl = data
    weixinPayRef.value.init(formData.rechargeAmount)
    weixinPayRef.value.isPay(params.shopWalletLogId)
  })
}

/**
 * 查询基本店铺名称
 */
let wxPayStatus = 0
onMounted(() => {
  queryShopBasicInfo()
  api.getPaymentWwitch().then((data) => {
    wxPayStatus = data.wxPayStatus
  })
})
const queryShopBasicInfo = () => {
  loading.value = true
  http.getBasicInfo().then((data) => {
    formData.shopName = data.shopName
    isBindPhone.value = data.isBindPhone
  }).finally(() => {
    loading.value = false
  })
}
// 输入金额验证
const changAmount = () => {
  const str = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/
  if (!str.test(formData.rechargeAmount) || formData.rechargeAmount > 999999) {
    formData.rechargeAmount = ''
  }
}
// 获取验证码 (通联支付)
const isFirstApply = ref(false)
const getVerificationCode = async () => {
  if (!formData.rechargeAmount) {
    ElMessage({
      message: '请输入充值金额',
      type: 'warning',
      duration: 1000
    })
    return
  }
  const { protocol, host } = window.location
  let request
  let data
  if (!isSendCode.value) {
    // 首次发送验证码，生成订单
    data = {
      rechargeAmount: formData.rechargeAmount * 100, // 充值金额
      returnUrl: `${protocol}//${host}` + '/multishop/shop-walletLog'
    }
    request = api.rechargeOrder(data)
  } else {
    // 重新发送验证码，不生成订单，使用之前的订单号
    data = {
      bizOrderNo
    }
    request = api.resendRechargeCode(data)
  }
  request.then(data => {
    bizOrderNo.value = data.bizOrderNo
    isFirstApply.value = false
    countdown.value = 60
    isSendCode.value = true
    getCountdown()
  })
}
// 倒计时1分钟
const getCountdown = () => {
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value === 0) {
      clearInterval(timer)
    }
  }, 1000)
}

defineExpose({
  getVerificationCode
})
</script>

<style lang="scss" scoped>
@use "index";
</style>
