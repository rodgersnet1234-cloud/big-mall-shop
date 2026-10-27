<template>
  <el-dialog
    v-model="weixinPayShow"
    width="950px"
    class="weixin-pay"
    @close="close"
  >
    <template #header>
           &nbsp;
    </template>
    <div class="weixin-pay-title">
      <div>请在<span class="font-red">{{ time }}</span>内付款,否则交易会被取消</div>
      <div>充值金额:<span class="fontRed">¥{{ rechargeMoney }}</span></div>
    </div>
    <div class="weixin-pay-code">
      <weixin-pay-code
        v-if="weixinPayShow"
        :weixin-code-url="weixinCodeUrl"
      />
    </div>
    <template #footer>
      <span
        v-if="paySettlementType===1"
        class="dialog-footer"
      >
        <el-button @click="weixinPayShow=false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitClick()"
        >确 定</el-button>
      </span>
    </template>
    <!-- <template slot="footer">
      <el-button>已完成支付</el-button>
    </template> -->
  </el-dialog>
</template>

<script setup>
import weixinPayCode from '@/components/weixin-pay-code/weixin-pay-code.vue'
import moment from 'moment'
import * as api from '@/api/pay/pay.js'
import { Debounce } from '@/utils/debounce.js'
import { ElMessage } from 'element-plus'

const props = defineProps({
  /**
   * @params {Number} 倒计时时间   /s
   */
  timeRemaining: {
    type: Number,
    default: 120
  }
})

const rechargeMoney = ref(0)
let checkIsPay = null
const weixinPayShow = ref(false)
let timeSetInterval = null
const time = ref(null)
const walletLogId = null
const weixinCodeUrl = ref('') // http://localhost:9527/?#/multishop/shop-walletLog

const allinpayStore = useAllinpayStore()
const paySettlementType = allinpayStore.paySettlementType // 是否开启通联支付 1：开启 0：关闭

watch(weixinPayShow, (nval) => {
  if (nval === false) {
    window.clearInterval(timeSetInterval)
    window.clearInterval(checkIsPay)
  }
})
onUnmounted(() => {
  window.clearInterval(timeSetInterval)
  window.clearInterval(checkIsPay)
})

const init = (maney) => {
  rechargeMoney.value = maney
  weixinPayShow.value = true
  const entTime = moment().add(props.timeRemaining, 's')
  time.value = moment((entTime - moment())).subtract(1, 'second').format('mm:ss')
  weixinPayShow.value = true
  window.clearInterval(timeSetInterval)
  // isPay()
  timeSetInterval = window.setInterval(() => {
    time.value = moment((entTime - moment())).format('mm:ss')
    if (time.value === '00:00') {
      window.clearInterval(timeSetInterval)
      ElMessage({
        message: '支付失败',
        type: 'warning'
      })
      weixinPayShow.value = false
    }
  }
  , 1000)
}
const router = useRouter()
const submitClick = Debounce(() => {
  api.isPay(walletLogId).then((data) => {
    if (data) {
      ElMessage({
        message: '支付成功',
        type: 'success'
      })
      router.go(0)
    } else {
      ElMessage({
        message: '未完成支付',
        type: 'warning'
      })
    }
  }).catch(() => {
    ElMessage({
      message: '支付失败',
      type: 'warning'
    })
    weixinPayShow.value = false
  })
}, 1800)
const isPay = (shopWalletLogId) => {
  api.isPay(shopWalletLogId).then((data) => {
    if (data) {
      ElMessage({
        message: '支付成功',
        type: 'success'
      })
      router.go(0)
    } else {
      checkIsPay = setTimeout(() => {
        isPay(shopWalletLogId)
      }, 3000)
    }
  }).catch(() => {
    ElMessage({
      message: '支付失败',
      type: 'warning'
    })
    weixinPayShow.value = false
  })
}
const close = () => {
  const entTime = moment().add(props.timeRemaining, 's')
  time.value = moment((entTime - moment())).subtract(1, 'second').format('mm:ss')
  window.clearInterval(timeSetInterval)
  window.clearTimeout(checkIsPay)
}
defineExpose({
  init,
  isPay,
  weixinCodeUrl,
  walletLogId
})
</script>

<style lang="scss" scoped>
.weixin-pay-title{
  margin-top: -10px;
  padding: 0 20px;
  height: 65px;
  line-height: 65px;
  display: flex;
  background: #F7F8FA;
  justify-content: space-between;
   &>div:first-child{
      font-weight: bold;
      color: #333333;
   }
   &>div:last-child{
    color:  #000000;
    >span{
      margin-left: 12px;
      color:rgba(255, 0, 0, 0.85);
      font-size: 18px;
      font-weight: bold;
    }
   }

}
.weixin-pay-code{
   border: 1px solid #eee;
}
.weixin-pay :deep(.el-dialog .el-dialog__header){
  border-bottom: 1px rgba(0,0,0,0.0600) solid;
}
</style>
<style scoped>
.weixin-pay-code :deep(.weixin-pay .weixin-pay-code){
  border:unset
}
.font-red{
  color:rgba(255, 0, 0, 0.85)
}
</style>
