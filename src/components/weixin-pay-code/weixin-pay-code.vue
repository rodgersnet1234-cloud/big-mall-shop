<template>
  <div class="component-weixin-pay-code">
    <div class="code-box">
      <div
        v-show="!isShowCodeMask"
        class="qrcode"
      >
        <canvas id="wxPayQrCode" />
      </div>
      <div
        v-show="isShowCodeMask"
        class="code-mask"
      >
        二维码已过期，请重新下单
      </div>
      <div class="text">
        微信扫一扫支付
      </div>
    </div>
    <div class="wx-bg">
      <img
        src="@/assets/images/wxPayBg.png"
        alt
      >
    </div>
  </div>
</template>

<script setup>
import QRCode from 'qrcode'
const props = defineProps({
  isShowCodeMask: {
    type: Boolean,
    default: false
  },
  // eslint-disable-next-line vue/require-default-prop
  weixinCodeUrl: {
    type: String
  }

})
const checkIsPay = ref('')
onMounted(() => {
  wxPayCode()
})

onUnmounted(() => {
  window.clearInterval(checkIsPay)
})

// 生成微信支付二维码
const wxPayCode = () => {
  QRCode.toCanvas(document.getElementById('wxPayQrCode'), props.weixinCodeUrl, { version: 6, errorCorrectionLevel: 'L' })
}

</script>

<style scoped>
  .component-weixin-pay-code {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    border-top: 0;
  }

  .text {
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    margin-top: 10px;
  }

/* 订单支付 */

.weixin-pay .weixin-pay-code .code-box {
    margin-right: 100px;
}

.weixin-pay .weixin-pay-code .code-box .qrcode {
    font-size: 0;
    width: 196px;
    height: 196px;
    border: 1px solid #eee;
}

.weixin-pay .weixin-pay-code .code-box .code-mask {
    border: 1px solid #eee;
    background: #eee;
    width: 196px;
    height: 196px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.weixin-pay .weixin-pay-code .code-box .text {
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    margin-top: 10px;
}

.weixin-pay .weixin-pay-code .wx-bg {
    font-size: 0;
}

/* 订单支付 end  */

</style>
