<!--
 Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

 https://www.mall4j.com/

 未经允许，不可做商业用途！

 版权所有，侵权必究！
-->
<template>
  <div class=" Mall4j dashboard-container">
    <!-- 1.店铺状态信息提示 -->
    <div
      v-if="shopStatusInfo.shopStatus !== null && shopStatusInfo.shopStatus !== 1"
      class="shop-inf-imperfect-tips"
    >
      <div v-if="shopStatusInfo.shopStatus === 2">
        <div class="tips-text">
          <el-icon>
            <Warning />
          </el-icon>
          您的店铺已下线，原因是：
          <span>{{ shopStatusInfo.offlineReason }}</span>
          <span v-if="paySettlementType !== 1">。如有问题可在店铺信息页重新申请上线</span>
          <span v-else>。如有问题请联系平台</span>
        </div>
      </div>
      <div v-if="shopStatusInfo.shopStatus === 0">
        <div class="tips-text">
          <el-icon>
            <Warning />
          </el-icon>
          您的店铺已停业，原因是：
          <span>{{ shopStatusInfo.closedReason }}</span>
          。如有问题请联系平台
        </div>
      </div>
      <div v-if="shopStatusInfo.shopStatus === 5 || shopStatusInfo.shopStatus === 3">
        <div class="tips-text">
          <el-icon>
            <Warning />
          </el-icon>
          您的店铺正在申请上线，
          <span>店铺等待审核中</span>
        </div>
      </div>
      <div v-if="shopStatusInfo.shopStatus === 7">
        <div class="tips-text">
          <el-icon>
            <Warning />
          </el-icon>
          <span>平台已被下线，如有问题请联系平台方进行沟通。</span>
        </div>
      </div>
    </div>
    <!-- 2.平台公告-->
    <div
      v-if="announcementList.length"
      class="platform-notice white-bg"
    >
      <el-icon>
        <Bell />
      </el-icon>
      <!-- 平台公告：欢迎使用后台管理系统，平台最新公告展示在这里，可以滚动展示多条！ -->
      <div class="platform-notice-box">
        <div
          class="platform-notice-list"
          :class="{marquee_top:animate}"
        >
          <div
            v-for="(item,index) in announcementList"
            :key="index"
          >
            <p class="text">
              <span
                class="see-notice"
                @click="toNoticeDetail(item.id)"
              >{{ item.title }}</span>
              <span
                class="see-more-notice"
                @click="toNotify"
              >查看更多</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div style="display:flex">
      <div style="width: 80%;margin-right:10px">
        <!-- 3.订单数量 -->
        <div class="order-all-num white-bg">
          <div
            class="wait-payment-num order-num-item"
            @click="toOrderPage(1)"
          >
            <div class="item-box">
              <div class="number">
                {{ waitPayNum }}
              </div>
              <div class="words">
                待付款
              </div>
            </div>
          </div>
          <div
            class="wait-delivery-num order-num-item"
            @click="toOrderPage(2)"
          >
            <div class="item-box">
              <div class="number">
                {{ waitDeliverNum }}
              </div>
              <div class="words">
                待发货
              </div>
            </div>
          </div>
          <div
            class="wait-receiving-goods-num order-num-item"
            @click="toOrderPage(3)"
          >
            <div class="item-box">
              <div class="number">
                {{ waitReceiveNum }}
              </div>
              <div class="words">
                待收货
              </div>
            </div>
          </div>
          <div
            class="wait-evaluate-num order-num-item"
            @click="toOrderPage(5)"
          >
            <div class="item-box">
              <div class="number">
                {{ successNum }}
              </div>
              <div class="words">
                已完成
              </div>
            </div>
          </div>
          <div
            class="wait-after-sales-num order-num-item"
            @click="toRefundOrderPage()"
          >
            <div class="item-box">
              <div class="number">
                {{ afterSalesNum }}
              </div>
              <div class="words">
                退款中/售后中
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="该数据包含买家申请、卖家接受、买家发货、申请介入、介入处理列表数据"
                  placement="right"
                >
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
            </div>
          </div>
          <div
            class="wait-after-sales-num order-num-item"
            @click="toStockWarningNumPage()"
          >
            <div class="item-box">
              <div class="number">
                {{ stockWarningNum }}
              </div>
              <div class="words">
                库存预警
              </div>
            </div>
          </div>
        </div>
        <!-- 4.实时数据情况 -->
        <div class="real-time-data-survey data-survey-box">
          <div class="data-survey data-item-box">
            <div class="title">
              <span class="bold-words">实时概况</span>
              <span class="update-time">更新时间：{{ dayStr }}</span>
            </div>
            <div class="all-number">
              <div class="one-line line">
                <div class="item-box">
                  <div class="number">
                    {{ toDayInfo.payActual }}
                  </div>
                  <div class="words">
                    收入金额
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="$t('shop.amountTip')"
                      placement="right"
                    >
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </div>
                </div>
                <div class="item-box">
                  <div class="number">
                    {{ toDayInfo.payUserCount }}
                  </div>
                  <div class="words">
                    支付客户数
                  </div>
                </div>
                <div class="item-box">
                  <div class="number">
                    {{ toDayInfo.payOrderCount }}
                  </div>
                  <div class="words">
                    支付订单数
                  </div>
                </div>
              </div>
              <div class="two-line line">
                <div class="item-box">
                  <div class="number">
                    {{ toDayInfo.chargebackCount }}
                  </div>
                  <div class="words">
                    今日退单数
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="一个订单分多次退款，只算一个退款订单"
                      placement="right"
                    >
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </div>
                </div>
                <div class="item-box">
                  <div class="number">
                    {{ conversionActual(toDayInfo.refund) }}
                  </div>
                  <div class="words">
                    实际退款金额
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="$t('shop.refundAmountTip')"
                      placement="right"
                    >
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </div>
                </div>
                <div class="item-box">
                  <div class="number">
                    {{ toDayInfo.onePrice }}
                  </div>
                  <div class="words">
                    客单价
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="收入金额/支付客户数"
                      placement="right"
                    >
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="today-report-form data-item-box">
            <div class="title">
              <span class="bold-words">今日报表
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="$t('shop.amountTip')"
                  placement="right"
                >
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>
              </span>
              <span class="update-time">更新时间：{{ dayStr }}</span>
            </div>
            <!-- 图表 -->
            <div class="chart-box">
              <common-chart
                :options="realTimeInfoChart"
                style="width: 100%; height: 220px;"
              />
            </div>
          </div>
        </div>
        <!-- 5.当月数据情况 -->
        <div class="month-data-survey data-survey-box">
          <div class="data-survey data-item-box">
            <div class="title">
              <span class="bold-words">当月概况</span>
              <span class="update-time">{{ monthStr }}</span>
            </div>
            <div class="all-number">
              <div class="one-line line">
                <div class="item-box">
                  <div class="number">
                    {{ currentMonthInfo.payActual }}
                  </div>
                  <div class="words">
                    收入金额
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="$t('shop.amountTip')"
                      placement="right"
                    >
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </div>
                </div>
                <div class="item-box">
                  <div class="number">
                    {{ currentMonthInfo.payUserCount }}
                  </div>
                  <div class="words">
                    支付客户数
                  </div>
                </div>
                <div class="item-box">
                  <div class="number">
                    {{ currentMonthInfo.payOrderCount }}
                  </div>
                  <div class="words">
                    支付订单数
                  </div>
                </div>
              </div>
              <div class="two-line line">
                <div class="item-box">
                  <div class="number">
                    {{ currentMonthInfo.chargebackCount }}
                  </div>
                  <div class="words">
                    当月退单数
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="一个订单分多次退款，只算一个退款订单"
                      placement="right"
                    >
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </div>
                </div>
                <div class="item-box">
                  <div class="number">
                    {{ conversionActual(currentMonthInfo.refund) }}
                  </div>
                  <div class="words">
                    实际退款金额
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="$t('shop.refundAmountTip')"
                      placement="right"
                    >
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </div>
                </div>
                <div class="item-box">
                  <div class="number">
                    {{ currentMonthInfo.onePrice }}
                  </div>
                  <div class="words">
                    客单价
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="收入金额/支付客户数"
                      placement="right"
                    >
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="today-report-form data-item-box">
            <div class="title">
              <span class="bold-words">本月报表
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="$t('shop.amountTip')"
                  placement="right"
                >
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>
              </span>
              <span class="update-time">{{ monthStr }}</span>
            </div>
            <!-- 图表 -->
            <div class="chart-box">
              <common-chart
                :options="monthInfoChart"
                style="width: 100%; height: 220px;"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="order-data-right">
        <div class="data-item-box">
          <div class="title">
            <div class="left-title">
              公告栏
            </div>
            <div
              class="right-title"
              @click="toNotify"
            >
              更多
            </div>
          </div>
          <div
            v-for="(item, index) in platformNotify"
            :key="index"
            class="content"
            @click="toNoticeDetail(item.id)"
          >
            {{ index + 1 + "、" + item.title }}
          </div>
          <div
            v-if="platformNotify.length <= 0"
            class="no-data"
          >
            暂无数据
          </div>
        </div>
        <div class="data-item-box">
          <div class="title">
            <div class="left-title">
              消息通知
            </div>
            <div
              class="right-title"
              @click="toManager"
            >
              更多
            </div>
          </div>
          <div
            v-for="(item, index) in notifyList"
            :key="index"
            class="content"
            :class="{
              'notify-view': !(item.sendType === 112 || item.sendType === 113)
            }"
            @click="notifyView(item)"
          >
            <!-- {{ index + 1 + "、" }} -->
            <span
              style="position: relative;margin-right: 6px;"
              :class="[item.status ? 'reads-dot': 'unread-point']"
            >●</span>
            {{ item.message }}
          </div>
          <div
            v-if="notifyList.length <= 0"
            class="no-data"
          >
            暂无数据
          </div>
        </div>
      </div>
    </div>

    <!-- 6.退款概况 -->
    <div class="refund-survey">
      <div class="title">
        <span class="bold-words">退款情况
        </span>
        <span class="update-time">仅展示最近30天</span>
      </div>
      <div class="survey-box">
        <div class="data-item-box">
          <div class="words">
            实际退款金额
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('shop.refundAmountTip')"
              placement="right"
            >
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
            <span class="amount">{{ conversionActual(totalRefundActual) }} 元</span>
          </div>
          <!-- 图表 -->
          <div class="chart-box">
            <common-chart
              :options="refundAmountDataChart"
              style="width: 100%; height: 220px"
            />
          </div>
        </div>
        <div class="data-item-box">
          <div class="words">
            退款率
            <el-tooltip
              class="item"
              effect="dark"
              content="退款订单数/支付订单数"
              placement="right"
            >
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
            <span class="amount">{{ totalRefundRate }} %</span>
          </div>
          <!-- 图表 -->
          <div class="chart-box">
            <common-chart
              :options="refundRateDataChart"
              style="width: 100%; height: 220px"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- 7.退款排行 -->
    <div class="refund-ranking data-survey-box">
      <!-- 退款商品 -->
      <div class="return-prod-ranking return-ranking-box data-item-box">
        <div class="title">
          <span class="bold-words">退款商品排行</span>
          <span class="update-time">仅展示最近30天</span>
        </div>
        <div class="ranking-content">
          <table class="refund-prod-table table">
            <tr class="table-tit">
              <td class="table-tit-item rank">
                {{ '排行' }}
              </td>
              <td class="table-tit-item prod rank-name">
                {{ '商品' }}
              </td>
              <td class="table-tit-item ref">
                {{ '退款商品数量' }}
              </td>
            </tr>
            <tr
              v-for="(item, index) in refundRankForActualTotal"
              :key="index"
              class="table-item"
            >
              <td class="rank-num">
                {{ index + 1 }}
              </td>
              <td class="rank-name">
                {{ item.refundProdName }}
              </td>
              <td class="rank-amount">
                {{ item.refundSpuCount || 0 }}
              </td>
            </tr>
          </table>
          <div
            v-if="!refundRankForActualTotal.length"
            class="table-no-data"
          >
            暂无数据
          </div>
        </div>
      </div>
      <!-- 退款原因 -->
      <div class="return-reason-ranking return-ranking-box data-item-box">
        <div class="title">
          <span class="bold-words">退款原因排行</span>
          <span class="update-time">仅展示最近30天</span>
        </div>
        <div class="ranking-content">
          <table class="refund-reason-table table">
            <tr class="table-tit">
              <td class="table-tit-item rank">
                {{ '排行' }}
              </td>
              <td class="table-tit-item reason rank-reason">
                {{ '原因' }}
              </td>
              <td class="table-tit-item percentage">
                {{ '百分比' }}
              </td>
            </tr>
            <tr
              v-for="(item, index) in refundRankForCause"
              :key="index"
              class="table-item"
            >
              <td class="rank-num">
                {{ index + 1 }}
              </td>
              <td class="rank-reason">
                {{ item.buyerReason }}
              </td>
              <td class="rank-percentage">
                {{ item.refundRate }}%
              </td>
            </tr>
          </table>
          <div
            v-if="!refundRankForCause.length"
            class="table-no-data"
          >
            暂无数据
          </div>
        </div>
      </div>
    </div>
    <!-- 公告弹窗 -->
    <el-dialog
      v-model="viewDialog"
      title="平台公告"
      width="30%"
    >
      <p style="text-align: center">
        {{ announcementData.announcementDetail.title }}
      </p>
      <br>
      <span v-rich="announcementData.announcementDetail.content" />
      <template #footer>
        <el-button
          type="primary"
          @click="viewDialog = false"
        >
          确认
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import * as orderStatisticsApi from '@/api/order/order-statistics'
import * as shopEventApi from '@/api/multishop/shop-event'
import * as api from '@/api/multishop/notice'
import * as notifyApi from '@/api/notify/notify'
import Big from 'big.js'
import { parseTime } from '@/utils'

const router = useRouter()

const shopStatusInfo = reactive({
  accountStatus: 0, // 账号状态， 1:启用 0:禁用 -1:删除
  shopStatus: null, // 店铺状态 -1:已删除 0: 停业中 1:营业中 2:平台下线 3:待审核 4:店铺申请中 5:申请失败 6:上线申请中 7：系统下线
  offlineStatus: 0, // 下线状态 1平台进行下线 2 重新申请，等待审核 3.审核通过 4 审核未通过
  offlineReason: '', // 下线原因
  contractStartTime: '', // 签约起始时间
  contractEndTime: '', // 签约终止时间
  closedReason: '' // 停业原因
})

const paySettlementType = computed(() => useAllinpayStore().paySettlementType)

// 获取店铺当前状态信息
const getShopStatusInfo = () => {
  shopEventApi.getStatusInfo().then(data => {
    if (data) {
      shopStatusInfo.accountStatus = data.accountStatus
      shopStatusInfo.shopStatus = data.shopStatus
      shopStatusInfo.offlineStatus = data.offlineStatus
      shopStatusInfo.offlineReason = data.offlineReason
      shopStatusInfo.contractStartTime = data.contractStartTime
      shopStatusInfo.contractEndTime = data.contractEndTime
      shopStatusInfo.closedReason = data.closedReason
      if (data.shopStatus === 0) {
        const now = new Date()
        const contractStartTime = new Date(Date.parse(data.contractStartTime))
        shopStatusInfo.closedReason = $t(`dashboard.${now < contractStartTime ? 'contractNotValid' : 'validityContractExpired'}`)
      }
    }
  })
}

// 公告列表
const announcementList = ref([])
const announcementTime = ref(null)

// 获取最新公告
const getNewNotice = () => {
  if (announcementList.value.length) announcementTime.value = setInterval(showMarquee, 3000)
}
const animate = ref(false)
// 公告的滚动效果
const showMarquee = () => {
  animate.value = true
  setTimeout(() => {
    announcementList.value.push(announcementList.value[0].title)
    announcementList.value.shift()
    animate.value = false
  }, 1000)
}

// 订单数量
// 待付款数量
const waitPayNum = ref(0)
// 待发货数量
const waitDeliverNum = ref(0)
// 待收货数量
const waitReceiveNum = ref(0)
// 待发货数量
const waitEvaluateNum = ref(0)
// 已完成数量
const successNum = ref(0)
// 售后数量
const afterSalesNum = ref(0)
// 库存预警数量
const stockWarningNum = ref(0)

// 获取不同状态的订单数量
const getOrderCountOfStatus = () => {
  orderStatisticsApi.getOrderCount().then(resultVO => {
    waitPayNum.value = resultVO.unPay || 0
    waitDeliverNum.value = resultVO.payed || 0
    waitReceiveNum.value = resultVO.consignment || 0
    waitEvaluateNum.value = resultVO.comment || 0
    successNum.value = resultVO.success || 0
    afterSalesNum.value = resultVO.refund || 0
  })
}

// sku库存预警数量
const getStockWarningNum = () => {
  orderStatisticsApi.getStockWarningNum().then(data => {
    stockWarningNum.value = data || 0
  })
}
// 跳转到库存预警页
const toStockWarningNumPage = () => {
  const routeList = commonStore.routeList
  let flag = 0
  routeList.forEach(item => {
    if (item.children) {
      item.children.forEach(el => {
        if (el.path === 'inquire') {
          flag = 1
        }
        if (el.children) {
          el.children.forEach(i => {
            if (i.path === 'inquire') {
              flag = 1
            }
          })
        }
      })
    }
  })
  if (!flag) {
    return ElMessage.error('您暂时没有权限访问')
  }
  router.push({
    path: '/manage/inquire',
    query: {
      stockWarning: 1
    }
  })
}

/**
 * 跳转到订单列表页
 * @param {Number} orderStatus 1-待付款 2-待发货 3-待收货 5-已完成
 */
const toOrderPage = (orderStatus) => {
  const routeList = commonStore.routeList
  let flag = 0
  routeList.forEach(item => {
    if (item.children) {
      item.children.forEach(el => {
        if (el.path === '/order/order-manage' || el.path === 'order/order-manage') {
          flag = 1
        }
        if (el.children) {
          el.children.forEach(i => {
            if (i.path === '/order/order-manage' || el.path === 'order/order-manage') {
              flag = 1
            }
          })
        }
      })
    }
  })
  if (!flag) {
    return ElMessage.error('您暂时没有权限访问')
  }
  router.push({
    path: '/order/order-manage/order',
    query: {
      orderStatus
    }
  })
}

/**
 * 跳转到退款/售后页
 */
const toRefundOrderPage = () => {
  const routeList = commonStore.routeList
  let flag = 0
  routeList.forEach(item => {
    if (item.children) {
      item.children.forEach(el => {
        if (el.path === '/order/order-manage') {
          flag = 1
        }
        if (el.children) {
          el.children.forEach(i => {
            if (i.path === 'order/order-manage') {
              flag = 1
            }
          })
        }
      })
    }
  })
  if (!flag) {
    return ElMessage.error('您暂时没有权限访问')
  }
  router.push({
    path: '/order/order-manage/refund-order',
    query: {
      sts: 1
    }
  })
}

// 当日str
const dayStr = ref(parseTime(Date.now(), '{y}-{m}-{d}'))
// 当月str
const monthStr = ref(parseTime(Date.now(), '{y}-{m}'))
// 当天统计数据
const toDayInfo = reactive({
  onePrice: 0, // 客单价
  payActual: 0, // 收入金额
  payUserCount: 0, // 支付客户数
  payOrderCount: 0, // 支付订单数
  chargebackCount: 0, // 退单数
  refund: 0, // 实际退款金额
  payActualList: [] // 收入金额列表
})
// 实时数据图表
const realTimeInfoChart = ref({})
// 获取实时数据
const getRealTimeInfo = () => {
  orderStatisticsApi.getToDayByHour().then(resultVO => {
    if (resultVO) {
      toDayInfo.onePrice = resultVO.onePrice
      toDayInfo.payActual = resultVO.payActual
      toDayInfo.payUserCount = resultVO.payUserCount
      toDayInfo.payOrderCount = resultVO.payOrderCount
      toDayInfo.chargebackCount = resultVO.chargebackCount
      toDayInfo.refund = resultVO.refund
      toDayInfo.payActualList = resultVO.payActualList
    }
    realTimeInfoChart.value = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        name: '时间',
        type: 'category',
        boundaryGap: false,
        data: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
          '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
      },
      yAxis: {
        name: '收入金额(元)',
        type: 'value'
      },
      axisLabel: {
        formatter: function (value, index) {
          // value大于10000000时除以1000并拼接k，小于10000000按原格式显示
          if (value >= 10000000) {
            value = value / 1000 + 'k'
          } else if (value < 10000000) {
            return value
          }
          return value
        }
      },
      series: [
        {
          type: 'line',
          data: toDayInfo.payActualList,
          lineStyle: {
            color: '#155bd4'
          },
          color: '#155bd4'
        }
      ]
    }
  })
}

// 当月统计数据
const currentMonthInfo = reactive({
  onePrice: 0, // 客单价
  payActual: 0, // 收入金额
  payUserCount: 0, // 支付客户数
  payOrderCount: 0, // 支付订单数
  chargebackCount: 0, // 退单数
  refund: 0, // 实际退款金额
  payActualList: [], // 收入金额列表
  dateToStringList: [] // 时间列表
})
// 当月数据图表
const monthInfoChart = ref({})
// 获取当月数据
const getCurrentMonthInfo = () => {
  orderStatisticsApi.getCurrentMonthInfoByDay().then(resultVO => {
    if (resultVO) {
      currentMonthInfo.onePrice = resultVO.onePrice
      currentMonthInfo.payActual = resultVO.payActual
      currentMonthInfo.payUserCount = resultVO.payUserCount
      currentMonthInfo.payOrderCount = resultVO.payOrderCount
      currentMonthInfo.chargebackCount = resultVO.chargebackCount
      currentMonthInfo.refund = resultVO.refund
      currentMonthInfo.payActualList = resultVO.payActualList
      currentMonthInfo.dateToStringList = resultVO.dateToStringList
    }
    monthInfoChart.value = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        name: '时间',
        type: 'category',
        boundaryGap: false,
        data: currentMonthInfo.dateToStringList
      },
      yAxis: {
        name: '收入金额(元)',
        type: 'value'
      },
      axisLabel: {
        formatter: function (value, index) {
          // value大于10000000时除以1000并拼接k，小于10000000按原格式显示
          if (value >= 10000000) {
            value = value / 1000 + 'k'
          } else if (value < 10000000) {
            return value
          }
          return value
        }
      },
      series: [
        {
          type: 'line',
          data: currentMonthInfo.payActualList,
          lineStyle: {
            color: '#155bd4'
          },
          color: '#155bd4'
        }
      ]
    }
  })
}

const platformNotify = ref([])
const getPlatformNotify = () => {
  notifyApi.page({ pageNum: 1, pageSize: 7 }).then(pageVO => {
    platformNotify.value = pageVO.list
    announcementList.value = pageVO.list.filter(item => item.isTop)
  })
}
const notifyList = ref([])
const getNotifyList = () => {
  notifyApi.unreadPage({ pageNum: 1, pageSize: 7 }).then(pageVO => {
    notifyList.value = pageVO.list
  })
}

// 总退款金额
const totalRefundActual = ref(0)
// 总退款率
const totalRefundRate = ref(0.00)
// 获取退款情况
const dataList = ref([])
const thirtyDateList = ref([])
const rateDataList = ref([])
const refundAmountDataChart = ref({})
const refundRateDataChart = ref({})
const getRefundSituation = () => {
  orderStatisticsApi.listOrderRefundInfo().then(resultVO => {
    if (resultVO) {
      let totalOrderCount = 0
      let totalRefundOrderCount = 0
      for (let i = 0; i < resultVO.length; i++) {
        thirtyDateList.value.push(resultVO[i].refundDateToString)
        dataList.value.push(bigActualTotal(resultVO[i].payActualTotal))
        totalRefundActual.value += resultVO[i].payActualTotal
        totalOrderCount += resultVO[i].totalOrderCount
        totalRefundOrderCount += resultVO[i].refundCount
        rateDataList.value.push(resultVO[i].refundRate)
      }
      if (totalOrderCount !== 0) {
        totalRefundRate.value = new Big(totalRefundOrderCount).times(100).div(totalOrderCount).toFixed(2).valueOf()
      }
    }
    refundAmountDataChart.value = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        name: '时间',
        type: 'category',
        boundaryGap: false,
        data: thirtyDateList.value
      },
      yAxis: {
        name: '退款金额(元)',
        type: 'value'
      },
      series: [
        {
          type: 'line',
          data: dataList.value,
          lineStyle: {
            color: '#155bd4'
          },
          color: '#155bd4'
        }
      ]
    }
    refundRateDataChart.value = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        name: '时间',
        type: 'category',
        boundaryGap: false,
        data: thirtyDateList.value
      },
      yAxis: {
        name: '退款率(%)',
        type: 'value'
      },

      series: [
        {
          type: 'line',
          data: rateDataList.value,
          lineStyle: {
            color: '#155bd4'
          },
          color: '#155bd4'
        }
      ]
    }
  })
}
const notifyView = (row) => {
  if (row.sendType === 112 || row.sendType === 113) {
    return
  }
  const routeList = commonStore.routeList
  const pathObj = {
    path: '',
    query: {}
  }
  if (row.sendType === 106 || row.sendType === 107) {
    pathObj.path = '/product/manage/list'
  }
  if (row.sendType === 108) {
    pathObj.path = '/consignment/consignment/change-notice'
  }
  if (row.sendType === 102 || row.sendType === 105 || row.sendType === 110) {
    pathObj.path = '/order/order-manage/order'
    pathObj.query.orderStatus = row.sendType === 102 ? 5 : row.sendType === 110 ? 8 : 2
  }
  if (row.sendType === 103 || row.sendType === 111 || row.sendType === 104) {
    pathObj.path = '/order/order-manage/refund-order'
    pathObj.query.sts = row.sendType === 103 ? 1 : row.sendType === 111 ? 4 : 5
  }
  const pathArr = pathObj.path.split('/')
  const flag = routeList.some(item => {
    if (item.children) {
      return item.children.some(el => {
        if (pathArr.length === 4) {
          if (el.path === '/' + pathArr[1] + '/' + pathArr[2] && el.children) {
            return el.children.some(element => {
              return element.path === pathArr[3]
            })
          } else {
            if (el.path === '/' + pathArr[1] && el.children) {
              return el.children.some(element => {
                return element.path === pathArr[2] + '/' + pathArr[3]
              })
            }
          }
        }
        if (el.path === '/' + pathArr[1] && el.children) {
          return el.children.some(element => {
            return element.path === pathArr[2]
          })
        } else {
          return item.path === '/' + pathArr[1] && el.path === pathArr[2]
        }
      })
    }
    return false
  })
  if (!flag) {
    return ElMessage.error('您暂时没有权限访问')
  }
  if (row.status === 0) {
    const obj = {
      logIds: row.logId,
      type: 0
    }
    notifyApi.isRead(obj).then(() => {
      router.push(pathObj)
    })
  } else {
    router.push(pathObj)
  }
}

// 退款商品排行数据
const refundRankForActualTotal = ref([])
// 退款原因排行数据
const refundRankForCause = ref([])

// 获取退款数据排行
const getRefundRanking = () => {
  orderStatisticsApi.listRefundRankingByReason().then(resultVO => {
    refundRankForCause.value = resultVO
  })
  orderStatisticsApi.listRefundRankingByProd().then(resultVO => {
    refundRankForActualTotal.value = resultVO
  })
}

onMounted(() => {
  getShopStatusInfo()
  getOrderCountOfStatus()
  getStockWarningNum()
  getRealTimeInfo()
  getCurrentMonthInfo()
  getPlatformNotify()
  getNewNotice()
  getNotifyList()
  getRefundSituation()
  getRefundRanking()
})

const commonStore = useCommonStore()
const toNotify = () => {
  const routeList = commonStore.routeList
  let flag = 0
  routeList.forEach(item => {
    if (item.children) {
      item.children.forEach(el => {
        if (el.path === 'notice') {
          flag = 1
        }
        if (el.children) {
          el.children.forEach(i => {
            if (i.path === 'platform-notice') {
              flag = 1
            }
          })
        }
      })
    }
  })
  if (!flag) {
    return ElMessage.error('您暂时没有权限访问')
  }
  router.push({ path: '/system/message-manager/platform-notice' })
}
const toManager = () => {
  const routeList = commonStore.routeList
  let flag = 0
  routeList.forEach(item => {
    if (item.children) {
      item.children.forEach(el => {
        if (el.path === 'notify') {
          flag = 1
        }
        if (el.children) {
          el.children.forEach(i => {
            if (i.path === 'notify-manager') {
              flag = 1
            }
          })
        }
      })
    }
  })
  if (!flag) {
    return ElMessage.error('您暂时没有权限访问')
  }
  router.push('/system/message-manager/notify-manager')
}

const viewDialog = ref(false)
const announcementData = reactive({
  // 公告详情
  announcementDetail: {}
})
// 查看公告
const toNoticeDetail = (id) => {
  viewDialog.value = true
  nextTick(() => {
    if (id) {
      api.get(id).then(data => {
        data.content = data.content.replace(/<img/g, "<img style='max-width:100%;height:auto;'")
        announcementData.announcementDetail = data
      })
    }
  })
}

// 精度运算-除法
const bigActualTotal = (num) => {
  if (num == null) {
    return ''
  }
  return new Big(num).div(100).toFixed(2)
}

// filters
const conversionActual = (val) => {
  // 精度运算-除法
  if (val == null) {
    return ''
  }
  return new Big(val).div(100).toFixed(2).valueOf()
}

</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 0 10px;
  min-height: 800px;
  background: #f9f9f9;
  // 1.店铺信息未完善提示
  .shop-inf-imperfect-tips {
    width: 100%;
    line-height: 32px;
    font-size: 14px;
    color: #666666;
    background: #FFF7DD;
    border: 1px solid #FFD888;
    border-radius: 2px;
    padding: 5px 10px;
    margin-bottom: 10px;
    .tips-text{
      display: flex;
      align-items: center;
    }
  }

  // 2.平台公告
  .platform-notice {
    width: 100%;
    height: 32px;
    line-height: 32px;
    font-size: 12px;
    color: #666666;
    border: 1px solid #EEEEEE;
    border-radius: 2px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    box-sizing: border-box;

    .platform-notice-box {
      width: 100%;
      position: relative;
      height: 30px;
      overflow: hidden;
      margin-left: 5px;
    }

    .platform-notice-list {
      display: block;
      position: absolute;
      top: 0;
      left: 0;

      .text {
        margin: 0;
        height: 30px;
        line-height: 30px;
      }
    }

    .see-notice {
      cursor: pointer;
    }

    .see-more-notice {
      margin-left: 5px;
      color: #155bd4;
      cursor: pointer;
    }
  }

  .marquee_top {
    transition: all 0.5s;
    margin-top: -30px;
  }

  // 3.订单数量
  .order-all-num {
    display: flex;
    width: 100%;
    height: 107px;
    // border: 1px solid #EEEEEE;
    border-radius: 2px;
    margin-bottom: 10px;

    .order-num-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20%;
      height: 100%;

      .item-box {
        text-align: center;
        cursor: pointer;

        .number {
          font-size: 20px;
          color: #155bd4;
          margin-bottom: 16px;
        }

        .words {
          font-size: 14px;
          color: #333333;
        }
      }
    }
  }

  // 4、5实时数据情况和当月数据情况
  .data-survey-box {
    display: flex;
    width: 100%;
    margin-bottom: 10px;

    .data-item-box {
      width: 50%;
      height: 224px;
      padding: 0 16px;
      background: #FFFFFF;

      .title {
        height: 39px;
        line-height: 39px;
        font-size: 14px;
        color: #333333;
        border-bottom: 1px solid #EEEEEE;
        border-radius: 1px;

        .bold-words {
          font-weight: 550;

          &::before {
            display: inline-block;
            width: 2px;
            height: 10px;
            background: #155bd4;
            margin-right: 5px;
            content: '';
          }
        }

        .update-time {
          font-size: 12px;
          color: #999999;
          margin-left: 10px;
        }
      }

      .all-number {
        .line {
          display: flex;
          align-items: center;
          height: 92px;

          .item-box {
            width: 33.3%;

            .number {
              font-size: 16px;
              font-weight: 500;
              color: #333333;
              margin-bottom: 16px;
            }

            .words {
              font-size: 12px;
              color: #999999;
            }
          }
        }
      }

      .chart-box {
        display: flex;
        align-items: center;
        width: 100%;
        height: 180px;
      }
    }

    .data-survey {
      margin-right: 10px;
    }
  }

  // 6.退款概况
  .refund-survey {
    width: 100%;
    height: 247px;
    padding: 0 16px;
    background: #FFFFFF;
    margin-bottom: 10px;

    .title {
      height: 39px;
      line-height: 39px;
      font-size: 14px;
      color: #333333;
      border-bottom: 1px solid #EEEEEE;
      border-radius: 1px;

      .bold-words {
        font-weight: 550;

        &::before {
          display: inline-block;
          width: 2px;
          height: 10px;
          background: #155bd4;
          margin-right: 5px;
          content: '';
        }
      }

      .update-time {
        font-size: 12px;
        color: #999999;
        margin-left: 10px;
      }
    }

    .survey-box {
      display: flex;
      width: 100%;

      .data-item-box {
        .words {
          position: relative;
          z-index: 1;
          font-size: 12px;
          color: #999999;
          margin-top: 20px;

          .amount {
            font-size: 16px;
            color: #333333;
            margin-left: 10px;
          }
        }

        width: 50%;

        .chart-box {
          display: flex;
          align-items: center;
          width: 100%;
          height: 180px;
        }
      }
    }
  }

  // 7.退款排行
  .refund-ranking {
    margin: 0;

    .return-ranking-box {
      height: auto;
      margin-right: 10px;

      .ranking-content {
        .table {
          width: 100%;
          border-collapse: collapse;
          border: none;
          margin-top: 15px;

          tr {
            height: 50px;
            line-height: 50px;
            text-align: center;
          }

          .table-tit {
            height: 33px;
            line-height: 33px;
            font-size: 12px;
            color: #333333;
            background: #f7f7f7;
          }

          .table-item {
            height: 42px;
            line-height: 42px;
            border-bottom: 1px solid #EEEEEE;

            &:last-child {
              border: none;
            }
          }

          .rank {
            width: 15%;
          }

          .rank-num {
            font-size: 14px;
            font-style: italic;
            color: #155bd4;
          }

          .rank-name, .rank-reason {
            display: inline-block;
            width: 277px;
            font-size: 12px;
            color: #333333;
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .rank-amount, .rank-percentage {
            font-size: 12px;
            color: #333333;
          }

          .prod, .reason {
            // width: 50%;
            text-align: left;
          }

          .ref, .percentage {
            width: 35%;
          }
        }
      }

      &:last-child {
        margin: 0;
      }
    }

    .return-reason-ranking {
      height: auto;
    }
  }

  .white-bg {
    background: #FFFFFF;
  }

  .table-no-data {
    width: 100%;
    color: #909399;
    line-height: 60px;
    text-align: center;
    font-size: 13px;
  }
}

.order-data-right {
  width: 20%;
  display: flex;
  flex-direction: column;

  .data-item-box {
    flex: 1;
    background: #FFFFFF;
    margin-bottom: 10px;
    padding: 16px;
    position: relative;

    .title {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 14px;

      .left-title {
        font-weight: 550;

        &::before {
          display: inline-block;
          width: 2px;
          height: 10px;
          background: #155bd4;
          margin-right: 5px;
          content: '';
        }
      }

      .right-title {
        color: #B3B3B3;
        font-size: 12px;
        line-height: 1;
        cursor: pointer;
      }
    }

    .content {
      font-size: 12px;
      margin-top: 19px;
      overflow: hidden;
      word-break: break-all;
      white-space: nowrap;
      text-overflow: ellipsis;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .notify-view {
      cursor: pointer;

      &:hover {
        color: #155bd4;
      }
    }

    .no-data {
      position: absolute;
      color: #999999;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

.reads-dot {
  color: #999;
}

.unread-point {
  color: #155bd4;
}
</style>
