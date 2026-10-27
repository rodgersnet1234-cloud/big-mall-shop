<template>
  <!-- 财务对账 -->
  <div class="box">
    <div class="manage-check">
      <div class="title">
        <span>结算明细</span>
        <span>
          <el-tooltip
            class="item"
            effect="dark"
            placement="right"
          >
            <template #content><div class="title-con-pit">
              <p>如果一笔订单进行整单退款或每个订单项都已经退款完成，那么会立即结算给商家。其他情况皆为确认收货15天后进行结算；</p>
              <p>&nbsp;</p>
              <p>名词解释：</p>
              <p>- 购买数量：用户购买商品数量，不包含售后数量；</p>
              <p>- 商品总金额：商品原价*购买数量，不包含售后金额；</p>
              <p>- 用户支付金额：扣除平台优惠(平台优惠券优惠、会员折扣优惠、积分抵扣金额)、店铺优惠(优惠券、满减折、秒杀优惠、团购优惠、优惠套餐、订单改价)，商品实际支付的金额；</p>
              <p>- 商家优惠金额：商品使用店铺优惠总和，包含商家改价金额；</p>
              <p>- 平台优惠金额：商品使用平台优惠总和，成本由平台承担，在结算时补偿给商家；</p>
              <p>&nbsp;&nbsp;&nbsp;商家未改价：平台优惠金额=平台优惠券优惠+会员折扣优惠+积分抵扣金额</p>
              <p>&nbsp;&nbsp;&nbsp;商家改价：平台优惠金额=原平台优惠-(商品减少金额/商品原价*(平台优惠券优惠+会员折扣优惠+积分抵扣金额))</p>
              <p>- 平台津贴减少金额：商家改价减少的平台优惠金额；</p>
              <p>&nbsp;&nbsp;&nbsp;商家改价：平台津贴减少金额=商品减少金额/商品原价*(平台优惠券优惠+会员折扣优惠+积分抵扣金额)</p>
              <p>- 分销金额：商家支付给分销员的佣金；</p>
              <p>&nbsp;&nbsp;&nbsp;按比例奖励：分销金额=商品扣除平台优惠支付金额*分销奖励比例</p>
              <p>&nbsp;&nbsp;&nbsp;按固定数值奖励：分销金额=固定数值奖励，商品扣除平台优惠支付金额如果小于奖励数值，分销金额为0</p>
              <p>- 使用积分：用户在支付时使用的积分；</p>
              <p>类目扣率：该商品签约分类的对应扣率；</p>
              <p>- 平台佣金：商品所属类目产生销售时需支付给平台的佣金；</p>
              <p>每件商品的平台佣金=（商品实付金额+平台优惠券优惠+会员折扣优惠+积分抵扣金额）*类目扣率；</p>
              <p>- 积分抵扣金额：用户使用积分抵扣的金额，根据平台端的使用比例和抵扣比例计算；</p>
              <p>- 会员折扣金额：会员等级特权中折扣产生的优惠金额，成本由平台承担，在结算时补偿给商家；</p>
              <p>- 平台优惠券优惠金额：商品使用了平台优惠券减免的金额，成本由平台承担，在结算时补偿给商家；</p>
              <p>- 商家优惠券优惠金额：商品使用了店铺优惠券减免的金额，成本由商家承担；</p>
              <p>- 满减优惠金额：商品参加满减、满折活动减免的金额，成本由商家承担；</p>
              <p>- 拼团优惠金额：商品参加拼团活动减免的金额，成本由商家承担；</p>
              <p>- 秒杀优惠金额：商品参加秒杀活动减免的金额，成本由商家承担；</p>
              <p>- 套餐优惠金额：商品参加优惠套餐活动减免的金额，成本由商家承担；</p>
              <p>- 店铺改价金额：用户提交订单后商家更改商品的金额；</p>
              <p>- 退款金额：订单发生售后，用户申请的退款金额；</p>
              <p>- 退款数量：订单发生售后，用户申请的退款数量；</p>
              <p>- 运费：计算优惠时，不包含运费；</p>
              <p>&nbsp;&nbsp;&nbsp;商家改运费：用户提交订单后商家更改订单运费金额</p>
              <p>&nbsp;&nbsp;&nbsp;直营店包邮：用户等级特权中包邮产生的优惠金额，成本由平台承担，在结算时补偿给商家</p>
            </div>
            </template>
            <span style="font-size:14px;color:#155bd4;cursor:pointer;">
              结算说明
            </span>
          </el-tooltip>
        </span>
      </div>
      <div class="table">
        <el-table
          :data="data.tableData"
          style="width: 100%;margin-bottom: 20px;"
          row-key="id"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          default-expand-all
          scrollbar-always-on
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <el-table-column
            prop="spuName"
            label="商品名称"
            width="130"
            align="center"
            fixed
          />
          <el-table-column
            prop="categoryName"
            label="分类名称"
            width="130"
            align="center"
            fixed
          >
            <template #default="scope">
              <span>{{ scope.row.categoryName || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="spuTotalAmount"
            label="商品总金额"
            width="130"
            align="center"
          >
            <template #default="scope">
              <span v-if="scope.row.giveawayOrderItemId">-</span>
              <span v-else>￥ {{ price(scope.row.spuTotalAmount) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="actualTotal"
            label="用户支付金额"
            width="130"
            align="center"
          >
            <template #default="scope">
              <span>￥ {{ price(scope.row.actualTotal) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="supplyPriceFee"
            label="供货总价"
            width="130"
            align="center"
          >
            <template #default="scope">
              <span>￥ {{ price(scope.row.supplyPriceFee) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="multishopReduce"
            label="商家优惠金额"
            width="130"
            align="center"
          >
            <template #default="scope">
              <span>￥ {{ price(scope.row.multishopReduce) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="platformShareReduce"
            label="平台优惠金额"
            width="130"
            align="center"
          >
            <template #default="scope">
              <span>￥ {{ price(scope.row.platformShareReduce) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="distributionAmount"
            label="分销金额"
            width="130"
            align="center"
          >
            <template #default="scope">
              <span>￥ {{ price(scope.row.distributionAmount) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="useScore"
            label="使用积分"
            width="130"
            align="center"
          />
          <el-table-column
            prop="rate"
            label="分账比例"
            width="130"
            align="center"
          >
            <template #default="scope">
              <span>{{ scope.row.rate }}%</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="platformCommission"
            label="平台佣金"
            width="130"
            align="center"
          >
            <template #default="scope">
              <span>￥ {{ price(scope.row.platformCommission) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="scoreAmount"
            label="积分抵扣金额"
            width="130"
            align="center"
          >
            <template #default="scope">
              <span>￥ {{ price(scope.row.scoreAmount) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="memberAmount"
            label="会员折扣金额"
            width="130"
            align="center"
          >
            <template #default="scope">
              <span>￥ {{ price(scope.row.memberAmount) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="platformCouponAmount"
            label="平台优惠券优惠金额"
            width="160"
            align="center"
          >
            <template #default="scope">
              <span>￥ {{ price(scope.row.platformCouponAmount) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="shopCouponAmount"
            label="商家优惠券优惠金额"
            width="160"
            align="center"
          >
            <template #default="scope">
              <span>￥ {{ price(scope.row.shopCouponAmount) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="discountAmount"
            label="满减优惠金额"
            width="130"
            align="center"
          >
            <template #default="scope">
              <span>￥ {{ price(scope.row.discountAmount) }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="seckillAmount"
            label="秒杀优惠金额"
            width="130"
            align="center"
          >
            <template #default="scope">
              <span>￥ {{ price(scope.row.seckillAmount) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="groupAmount"
            label="拼团优惠金额"
            width="130"
            align="center"
          >
            <template #default="scope">
              <span>￥ {{ price(scope.row.groupAmount) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="shopChangeFreeAmount"
            label="店铺改价金额"
            width="130"
            align="center"
          >
            <template #default="scope">
              <span>￥ {{ scope.row.shopChangeFreeAmount > 0 ? '+' : '' }}{{
                price(scope.row.shopChangeFreeAmount)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="refundAmount"
            label="退款金额"
            width="130"
            align="center"
          >
            <template #default="scope">
              <span>￥ {{ price(scope.row.refundAmount) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="refundCount"
            label="商品数量"
            width="130"
            align="center"
          >
            <template #default="scope">
              <span>{{ scope.row.count || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="refundCount"
            label="申请退款数量"
            width="130"
            align="center"
          >
            <template #default="scope">
              <span>{{ scope.row.refundCount || 0 }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template v-if="isLoaded">
        <div class="message">
          <span>运费金额：{{ formatPrice(data.freightAmount, 1).toFixed(2) }} 元</span>
        </div>
        <div
          v-if="data.freeFreightAmount !== 0"
          class="message"
        >
          <span>运费变化金额：{{
            data.freeFreightAmount > 0 ? '+' : ''
          }}{{ formatPrice(data.freeFreightAmount, 1).toFixed(2) }} 元
            <el-tooltip
              class="item"
              effect="dark"
              content="订单管理中修改的订单运费金额"
              placement="top"
            >
              <span style="font-size:14px;color:#46a6ff;cursor:pointer;">
                <el-icon><QuestionFilled /></el-icon>
              </span>
            </el-tooltip>
          </span>
        </div>
        <div
          v-if="data.platformFreeFreightAmount !== 0"
          class="message"
        >
          <span>平台运费减免金额：{{ formatPrice(data.platformFreeFreightAmount, 1).toFixed(2) }} 元
            <el-tooltip
              class="item"
              effect="dark"
              content="用户等级特权中包邮产生的优惠金额"
              placement="top"
            >
              <span style="font-size:14px;color:#46a6ff;cursor:pointer;">
                <el-icon><QuestionFilled /></el-icon>
              </span>
            </el-tooltip>
          </span>
        </div>
      </template>
      <div class="back">
        <el-button
          type="primary"
          @click="back"
        >
          返回
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { orderDetaiList } from '@/api/multishop/shop_wallet_log'
import { formatPrice } from '@/utils'
import Big from 'big.js'

const price = computed(() => {
  return function (value) {
    if (value) {
      return new Big(value).div(100).toFixed(2)
    }
    return 0
  }
})

const orderId = useRoute().query.orderId
const refundId = useRoute().query.refundId || ''
const data = reactive({
  freightAmount: 0,
  tableData: []
})
const isLoaded = ref(false)

onMounted(() => {
  getData(orderId, refundId)
})
// 获取订单详情
const getData = (orderId, refundId) => {
  isLoaded.value = false
  orderDetaiList(orderId, refundId).then(res => {
    data.freightAmount = res.freightAmount
    data.freeFreightAmount = -(res.freeFreightAmount ? res.freeFreightAmount : 0)
    data.platformFreeFreightAmount = res.platformFreeFreightAmount ? res.platformFreeFreightAmount : 0
    data.tableData = res.orderItemDetailList
    isLoaded.value = true
  })
}
const router = useRouter()
const back = () => {
  router.back()
}

</script>

<style lang="scss" scoped>
.box {
  padding: 24px;
  width: 100%;
  height: 100%;
}

.manage-check {
  background: #FFFFFF;
  width: 100%;
  padding: 0;

  .title {
    font-size: 18px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
  }

  .message {
    font-size: 16px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
  }
}

.table {
  margin-top: 20px;
}

.title-con-pit {
  max-height: 80vh;
  max-width: 80vw;
  overflow-y: auto;
}
</style>
