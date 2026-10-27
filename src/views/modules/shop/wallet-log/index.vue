<template>
  <!-- 财务对账 -->
  <div class="page-shop-walletLog">
    <div class="title">
      店铺余额
    </div>
    <div class="head">
      <div class="head-item">
        <div class="text">
          <span style="margin-right:10px">店铺余额(元)</span>
          <el-tooltip
            class="item"
            effect="dark"
            :content="$t('shop.incAvaStoBal')"
            placement="right"
          >
            <span>
              <el-icon><QuestionFilled /></el-icon>
            </span>
          </el-tooltip>
        </div>
        <div class="balance">
          <span style="margin-right:20px">{{ formatPrice(shopWalletInfo.settledAmount, 1).toFixed(2) }}</span>

          <!-- 6/22 -->
          <el-button
            v-permission="['shop:shopWithdrawCash:save']"
            link
            plain
            type="primary"
            @click="caswithdrawalBtn"
          >
            提现
          </el-button>
          <el-button
            v-permission="['shop:shopRecharge:save']"
            size="small"
            type="primary"
            link
            plain
            @click="rechargeClick"
          >
            充值
          </el-button>
          <!-- 6/22 -->
        </div>
      </div>
      <div
        class="head-item"
        style="margin-left:20px"
      >
        <div class="text">
          <span style="margin-right:10px">待结算金额(元)</span>
          <el-tooltip
            class="item"
            effect="dark"
            content="用户购买商品之后，等待用户确认收货15天后，将会变成店铺余额"
            placement="right"
          >
            <span>
              <el-icon>
                <QuestionFilled />
              </el-icon>
            </span>
          </el-tooltip>
        </div>
        <div class="balance">
          <span style="margin-right:30px">{{ formatPrice(shopWalletInfo.unsettledAmount, 1).toFixed(2) }}</span>
        </div>
      </div>
      <div class="head-item">
        <div class="text">
          <span style="margin-right:10px">冻结金额(元)</span>
          <el-tooltip
            class="item"
            effect="dark"
            content="商城进行提现申请的时候，将会把余额冻结，增加冻结金额"
            placement="right"
          >
            <span>
              <el-icon><QuestionFilled /></el-icon>
            </span>
          </el-tooltip>
        </div>
        <div class="balance">
          <span style="margin-right:30px">{{ formatPrice(shopWalletInfo.freezeAmount, 1).toFixed(2) }}</span>
        </div>
      </div>
      <div class="head-item">
        <div class="text">
          <span style="margin-right:10px">总结算金额(元)</span>
          <el-tooltip
            class="item"
            effect="dark"
            content="用户确认收货15天后结算的所有金额"
            placement="left"
          >
            <span>
              <el-icon><QuestionFilled /></el-icon>
            </span>
          </el-tooltip>
        </div>
        <div class="balance">
          <span style="margin-right:30px">{{ formatPrice(shopWalletInfo.totalSettledAmount, 1).toFixed(2) }}</span>
        </div>
      </div>
    </div>
    <div class="table">
      <el-tabs
        v-model="activeName"
      >
        <el-tab-pane
          label="交易记录"
          name="trading"
        >
          <trading ref="tradingRef" />
        </el-tab-pane>
        <el-tab-pane
          label="提现记录"
          name="withdrawal"
        >
          <withdrawal ref="withdrawalRef" />
        </el-tab-pane>
        <el-tab-pane
          label="充值记录"
          name="recharge"
        >
          <recharge ref="rechargeRef" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <cash-withdrawal
      v-if="isCaswithdrawal"
      ref="caswithdrawalRef"
      @get-shop-wallet="getShopWallet"
    />
    <cash-recharge
      v-if="cashRechargeShow"
      ref="cashRechargeRef"
      v-model:visible="cashRechargeShow"
      :balance="shopWalletInfo.settledAmount/1"
    />
  </div>
</template>

<script setup>
import { useIncludeRouterName } from '@/stores/modules/include-router-name.js'
import { shopWallet } from '@/api/multishop/shop_wallet_log'
import Big from 'big.js'
import trading from './components/trading/index.vue'
import withdrawal from './components/withdrawal/index.vue'
import cashWithdrawal from './components/cash-withdrawal/index.vue'
import cashRecharge from './components/cash-recharge/index.vue'
import recharge from './components/recharge/index.vue'

const activeName = ref('trading')
const isCaswithdrawal = ref(false)

const shopWalletInfo = ref('')
const cashRechargeShow = ref(false)

onMounted(() => {
  shopWallet().then(data => {
    shopWalletInfo.value = data
  })
})

// 点击提现申请
const caswithdrawalRef = ref('')
const caswithdrawalBtn = () => {
  isCaswithdrawal.value = true
  nextTick(() => {
    caswithdrawalRef.value.init(shopWalletInfo.value.settledAmount)
  })
}
// 获取店铺余额信息
const tradingRef = ref('')
const withdrawalRef = ref('')
const getShopWallet = () => {
  shopWallet().then(data => {
    shopWalletInfo.value = data
  })
  tradingRef.value?.getData()
  withdrawalRef.value?.getData()
}

// 点击充值
const rechargeClick = () => {
  cashRechargeShow.value = true
}
const formatPrice = (price, type = 0) => {
  if (!price) {
    return 0
  }
  Big.DP = 2
  if (type === 0) {
    return +new Big(price).times(100).valueOf()
  }
  return +new Big(price).div(100).valueOf()
}

const includeRouterName = useIncludeRouterName()
// 列表页跳往详情页，页面会缓存
onBeforeRouteLeave((to, from, next) => {
  if (to.path === '/finance/billing-details') {
    includeRouterName.addData(['WalletLog'])
  } else {
    includeRouterName.addData([])
  }
  next()
})
</script>

<script>
export default {
  name: 'WalletLog'
}
</script>

<style lang="scss" scoped>
.page-shop-walletLog {
  background: #FFFFFF;
  width: 100%;
  padding: 24px;
  .title {
    font-size: 18px;
    margin-bottom: 16px;
  }
  .head {
    background: #F5F5F5;
    height: 130px;
    padding: 20px;
    display: flex;
    justify-content: space-around;
    margin-bottom: 10px;
    .head-item {
      height: 100%;
      width: 230px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .balance {
        font-size: 22px;
      }
    }
  }
  .text {
    font-size: 14px;
  }
}
</style>
