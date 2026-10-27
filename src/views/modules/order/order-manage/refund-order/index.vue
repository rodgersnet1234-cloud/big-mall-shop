<template>
  <div class="page-refund-order">
    <div class="screening-conditions search-bar">
      <el-form
        :inline="true"
        :model="dataForm"
        @submit.prevent
        @keyup.enter="onGetDataList(true)"
      >
        <div class="search input-row">
          <el-form-item :label="$t('order.order.refundId') + '：'">
            <el-input
              v-model="searchForm.refundId"
              oninput="value=value.replace(/[^0-9]/g,'')"
              :placeholder="$t('order.order.refundId')"
              maxlength="19"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('order.order.typeOfRefund') + '：'"
          >
            <el-select
              v-model="searchForm.refundType"
              clearable
              :placeholder="$t('order.order.typeOfRefund')"
            >
              <el-option
                v-for="item in refundType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            :label="$t('order.order.afterSalesStatus') + '：'"
          >
            <el-select
              v-model="returnMoneySts"
              clearable
              :placeholder="$t('order.order.pleSelAfterSalesSta')"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('order.order.number') + '：'">
            <el-input
              v-model="searchForm.orderId"
              oninput="value=value.replace(/[^0-9]/g,'')"
              :placeholder="$t('order.order.number')"
              maxlength="20"
              clearable
            />
          </el-form-item>
        </div>

        <div class="search input-row">
          <el-form-item :label="$t('order.order.orderType') + '：'">
            <el-select
              v-model="searchForm.orderType"
              clearable
              :placeholder="$t('order.order.pleaseSelectOrderType')"
            >
              <el-option
                v-for="item in orderType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('order.order.applicationType') + '：'"
          >
            <el-select
              v-model="searchForm.applyType"
              clearable
              :placeholder="
                $t('order.order.pleaseChooseHowToApply')
              "
            >
              <el-option
                v-for="item in applyType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>

        <div class="search input-row">
          <el-form-item :label="$t('order.order.applyTime') + '：'">
            <el-date-picker
              v-model="dateRange"
              type="datetimerange"
              :range-separator="$t('date.tip')"
              value-format="YYYY-MM-DD HH:mm:ss"
              :start-placeholder="$t('date.start')"
              :end-placeholder="$t('date.end')"
              :default-time="defaultTime"
            />
            <div
              class="select-time-btn"
              style="margin-left: 10px;"
              :class="{ 'is-active': createTimeActive === 1 }"
              @click="setDateRange(1)"
            >
              {{
                $t("date.t")
              }}
            </div>
            <div
              class="select-time-btn"
              :class="{ 'is-active': createTimeActive === 2 }"
              @click="setDateRange(2)"
            >
              {{
                $t("date.y")
              }}
            </div>
            <div
              class="select-time-btn"
              :class="{ 'is-active': createTimeActive === 3 }"
              @click="setDateRange(3)"
            >
              {{
                $t("date.n")
              }}
            </div>
            <div
              class="select-time-btn"
              :class="{ 'is-active': createTimeActive === 4 }"
              @click="setDateRange(4)"
            >
              {{
                $t("date.m")
              }}
            </div>
          </el-form-item>
        </div>

        <div class="operation-box">
          <el-form-item>
            <el-button
              class="operation-btn"
              type="primary"
              @click="onSearch(true)"
            >
              {{ $t("table.search") }}
            </el-button>
            <el-button
              class="operation-btn"
              @click="onClear()"
            >
              {{ $t("shop.resetMap") }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main">
      <div class="content">
        <!-- 导航 -->
        <div class="status-nav clearfix">
          <ul
            :class="[
              'clearfix',
              $t('language') === 'English' ? 'nav-list-ul-en' : 'nav-list-ul-zh',
            ]"
          >
            <li
              :class="['nav-item-li', sts === 0 ? 'selected' : '']"
              data-sts="0"
              @click="onSelectNav($event)"
            >
              {{ $t("date.a") }}
            </li>
            <li
              :class="['nav-item-li', sts === 1 ? 'selected' : '']"
              data-sts="1"
              @click="onSelectNav($event)"
            >
              {{ $t("order.order.buyerApplication") }}
            </li>
            <li
              :class="['nav-item-li', sts === 2 ? 'selected' : '']"
              data-sts="2"
              @click="onSelectNav($event)"
            >
              {{ $t("order.order.merchantAccepts") }}
            </li>
            <li
              :class="['nav-item-li', sts === 3 ? 'selected' : '']"
              data-sts="3"
              @click="onSelectNav($event)"
            >
              {{ $t("order.order.buyShipment") }}
            </li>
            <li
              :class="['nav-item-li', sts === 4 ? 'selected' : '']"
              data-sts="4"
              @click="onSelectNav($event)"
            >
              {{ $t("order.order.merReceiving") }}
            </li>
            <li
              :class="['nav-item-li', sts === 5 ? 'selected' : '']"
              data-sts="5"
              @click="onSelectNav($event)"
            >
              {{ $t("order.order.refundsuccessfully") }}
            </li>
            <li
              :class="['nav-item-li', sts === -1 ? 'selected' : '']"
              data-sts="-1"
              @click="onSelectNav($event)"
            >
              {{ $t("order.order.refundClosed") }}
            </li>
            <li
              :class="['nav-item-li', sts === 6 ? 'selected' : '']"
              data-sts="6"
              @click="onSelectNav($event)"
            >
              申请介入
            </li>
            <li
              :class="['nav-item-li', sts === 7 ? 'selected' : '']"
              data-sts="7"
              @click="onSelectNav($event)"
            >
              介入处理
            </li>
          </ul>
        </div>

        <!-- 列标题 -->
        <div
          v-if="showHeadScroll"
          class="tit"
        />
        <div :class="['tit', showHeadScroll ? (sidebarOpenState?'fixed-top fixed-top-w1':'fixed-top fixed-top-w2') : '']">
          <el-row
            style="width: 100%"
            class="pr-width"
          >
            <el-col :span="6">
              <span class="item product">{{ $t("constant.product") }}</span>
            </el-col>
            <el-col
              :span="4"
              class="text-right"
            >
              <span class="item">{{
                $t("order.order.commodityUnitPriceYuanQuantity")
              }}</span>
            </el-col>
            <el-col
              :span="3"
              class="column-title"
            >
              <span
                class="item"
              >{{ $t("order.order.returnAmount") }}({{
                $t("constant.dollar")
              }})</span>
            </el-col>
            <el-col
              :span="3"
              class="column-title"
            >
              <span class="item">{{
                $t("order.order.commodityCondition")
              }}</span>
            </el-col>
            <el-col
              :span="2"
              class="column-title"
            >
              <span class="item">{{ $t("order.order.typeOfRefund") }}</span>
            </el-col>
            <el-col
              :span="2"
              class="column-title"
            >
              <span class="item">{{ $t("order.order.status") }}</span>
            </el-col>
            <el-col
              :span="2"
              class="column-title"
            >
              <span class="item">{{ $t("order.order.afterSalesStatus") }}</span>
            </el-col>
            <el-col
              :span="2"
              class="column-title"
            >
              <span class="item">{{ $t("table.actions") }}</span>
            </el-col>
          </el-row>
        </div>

        <div
          v-for="orderRefund in dataList"
          :key="orderRefund.refundId"
          class="prod"
          style="margin-bottom: 15px"
        >
          <div class="prod-tit">
            <span>{{ $t("order.order.refundId") }}：{{
              orderRefund.refundId
            }}</span>
            <span>{{ $t("order.order.number") }}:{{ orderRefund.orderId }}</span>
            <span>{{ $t("order.order.applyTime") }}：{{
              orderRefund.createTime
            }}</span>
          </div>
          <div class="prod-cont">
            <el-row style="width: 100%">
              <el-col :span="10">
                <div class="prod-item">
                  <div
                    v-for="orderItem in orderRefund.orderItems"
                    :key="orderItem.orderItemId"
                    class="items name"
                  >
                    <div class="info">
                      <div class="prod-image">
                        <ImgShow
                          :src="orderItem.pic"
                          :img-style="{width:'80px',height:'80px'}"
                        />
                      </div>
                      <div class="prod-name">
                        <div class="prod-con">
                          <div class="prod-name-txt">
                            {{ orderItem.spuName }}
                          </div>
                          <div
                            v-if="
                              orderRefund.orderType === 1 ||
                                orderRefund.orderType === 2
                            "
                            class="order-status"
                          >
                            {{
                              orderRefund.orderType === 1
                                ? $t("order.order.groupPurchaseOrder")
                                : orderRefund.orderType === 2
                                  ? $t("order.order.spikeOrder")
                                  : ""
                            }}
                          </div>
                          <div
                            v-if="orderItem.giveawayOrderItemId != null"
                            class="order-status"
                          >
                            赠品
                          </div>
                        </div>
                      </div>
                      <div class="prod-price">
                        <span>{{ formatPrice(orderItem.price, 1).toFixed(2) }}</span>
                        <span>{{ orderItem.count }}{{ $t("constant.piece") }}</span>
                      </div>
                    </div>
                    <!-- 组合信息 -->
                    <div
                      v-if="orderItem.comboList"
                      class="order-prod-item-give-con"
                    >
                      <combo-list
                        :combo-list="orderItem.comboList"
                        tag-name="【组合】"
                      />
                    </div>

                    <!-- 赠品信息 -->
                    <div
                      v-if="orderItem.giveawayList"
                      class="order-prod-item-give-con"
                    >
                      <combo-list
                        :combo-list="orderItem.giveawayList"
                        tag-name="【赠品】"
                      />
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col
                :span="3"
                style="height: 100%"
              >
                <div class="item">
                  <div class="price-block">
                    <span
                      v-if="orderRefund.refundAmount > 0"
                      class="totalprice"
                    >{{ formatPrice(orderRefund.refundAmount, 1).toFixed(2)
                    }}{{ $t("constant.dollar") }}</span>
                    <span
                      v-if="orderRefund.refundAmount && orderRefund.refundScore"
                      class="totalprice"
                    >&nbsp;+&nbsp;</span>
                    <span
                      v-if="orderRefund.refundScore"
                      class="totalprice"
                    >{{ orderRefund.refundScore
                    }}{{ $t("order.order.integral") }}</span>
                    <div>
                      <span>{{ orderRefund.refundCount
                      }}{{ $t("constant.piece") }}</span>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col
                :span="3"
                style="height: 100%"
              >
                <div class="item">
                  <div class="buyer-info">
                    <span>{{
                      orderRefund.applyType === 1
                        ? $t("order.order.onlyRefund")
                        : $t("order.order.refunds")
                    }}</span>
                    <span class="totalprice">{{
                      orderRefund.isReceived
                        ? $t("order.order.goodsReceived")
                        : $t("order.order.goodsNotReceived")
                    }}</span>
                    <span class="totalprice">{{
                      orderRefund.buyerReasonValue
                    }}</span>
                  </div>
                </div>
              </el-col>
              <el-col
                :span="2"
                style="height: 100%"
              >
                <div class="item">
                  <div>
                    <span v-if="orderRefund.refundType === 1">{{
                      $t("order.order.wholeGoodsRefund")
                    }}</span>
                    <span v-if="orderRefund.refundType === 2">{{
                      $t("order.order.singleItemRefund")
                    }}</span>
                  </div>
                </div>
              </el-col>
              <!-- 订单状态 -->
              <el-col
                :span="2"
                style="height: 100%"
              >
                <div class="item">
                  <span
                    v-if="orderRefund.orderStatus === 2 && orderRefund.waitPurchase === 1"
                    type="danger"
                  >
                    {{ $t('order.order.toBePurchased') }}
                  </span>
                  <span
                    v-else
                    type="danger"
                  >{{
                    [
                      "",
                      $t("pay.obligation"),
                      $t("order.order.toBeShipped"),
                      $t("order.order.pendingReceipt"),
                      "",
                      $t("order.order.successfulTransaction"),
                      $t("order.order.transactionFailed"),
                      $t("group.waitGroup"),
                    ][orderRefund.orderStatus]
                  }}</span>
                </div>
              </el-col>
              <el-col
                :span="2"
                style="height: 100%"
              >
                <div class="item">
                  <div
                    v-if="orderRefund.platformInterventionStatus && orderRefund.platformInterventionStatus!==-1"
                    class="buyer-info"
                  >
                    <!-- 平台介入状态 -1.没有介入 1.用户申请介入 2.平台同意介入 3.平台拒绝介入 5.平台同意退款成功 7.平台介入处理中 -->
                    <span>{{
                      [
                        "",
                        '申请介入',
                        '平台同意介入',
                        '退款关闭',
                        '',
                        '退款成功',
                        '',
                        '介入处理'
                      ][orderRefund.platformInterventionStatus]
                    }}</span>
                  </div>
                  <div
                    v-else
                    class="buyer-info"
                  >
                    <span
                      v-if="orderRefund.returnMoneySts !== -1"
                      type="danger"
                    >{{
                      [
                        "",
                        $t("order.order.buyerApplication"),
                        $t("order.order.merchantAccepts"),
                        $t("order.order.buyShipment"),
                        $t("order.order.merReceiving"),
                        $t("order.order.refundsuccessfully"),
                      ][orderRefund.returnMoneySts]
                    }}</span>
                    <span
                      v-else
                      type="danger"
                    >{{
                      $t("order.order.refundClosed")
                    }}</span>
                    <span
                      v-if="orderRefund.supplierHandleStatus > -1 && orderRefund.closeType !== 1"
                      class="totalprice"
                    >
                      {{ orderRefund.supplierHandleStatus === 0 ? $t('order.order.waitSupHandle') : orderRefund.supplierHandleStatus === 1 ? $t('order.order.supAgree') : $t('order.order.supRefused') }}
                    </span>
                  </div>
                </div>
              </el-col>
              <el-col
                :span="2"
                style="height: 100%"
              >
                <div class="item">
                  <div class="operate">
                    <el-button
                      v-permission="['order:refund:order']"
                      type="primary"
                      link
                      @click="viewOrderHandle(orderRefund.orderId)"
                    >
                      {{ $t("order.order.viewOrder") }}
                    </el-button>
                    <!-- 普通商品退款按钮 -->
                    <el-button
                      v-if="!orderRefund.supplierId"
                      v-permission="['order:refund:refund']"
                      type="primary"
                      link
                      @click="
                        refundHandle(orderRefund.refundId, orderRefund.shopId)
                      "
                    >
                      {{ [-1,2,5].includes(orderRefund.returnMoneySts) ? $t("order.order.refundDetails") : $t("order.order.processingRefunds") }}
                    </el-button>
                    <!-- 供应商代销商品退款按钮 -->
                    <el-button
                      v-if="orderRefund.supplierId"
                      v-permission="['order:refund:refund']"
                      type="primary"
                      link
                      @click="
                        refundHandle(orderRefund.refundId, orderRefund.shopId)
                      "
                    >
                      {{
                        orderRefund.returnMoneySts === -1 ? $t("order.order.refundDetails") : orderRefund.supplierHandleStatus > -1 || orderRefund.returnMoneySts === 5 ? $t("order.order.refundDetails") : $t("order.order.processingRefunds")
                      }}
                    </el-button>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div
          v-if="!dataList.length"
          class="empty"
        >
          {{ $t("order.order.noData") }}
        </div>
      </div>
    </div>
    <!-- 分页条 -->
    <pagination
      v-show="page.total > 0"
      v-model:page="page.pageNum"
      v-model:limit="page.pageSize"
      :total="page.total"
      @pagination="onGetDataList()"
    />
    <order-info
      v-if="orderInfoVisible"
      ref="orderInfoRef"
      @refresh-data-list="refreshChange"
    />
  </div>
</template>

<script setup>
import moment from 'moment'
import * as api from '@/api/order/order-refund'
import { formatPrice } from '@/utils/index.js'
import OrderInfo from '../order/components/order-info.vue'
import Pagination from '@/components/Pagination/index.vue'

const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59)
]
const options = [{
  value: 1,
  label: $t('order.order.buyerApplication')
}, {
  value: 2,
  label: $t('order.order.merchantAccepts')
}, {
  value: 3,
  label: $t('order.order.buyShipment')
}, {
  value: 4,
  label: $t('order.order.merReceiving')
}, {
  value: 5,
  label: $t('order.order.refundsuccessfully')
}, {
  value: -1,
  label: $t('order.order.refundClosed')
}, {
  value: 6,
  label: '申请介入'
}, {
  value: 7,
  label: '介入处理'
}]
const orderType = [{
  value: 0,
  label: $t('order.order.normalOrder')
}, {
  value: 1,
  label: $t('order.order.groupPurchaseOrder')
}, {
  value: 2,
  label: $t('order.order.spikeOrder')
}]
const refundType = [{
  value: 1,
  label: $t('order.order.wholeOrderRefund')
}, {
  value: 2,
  label: $t('order.order.singleItemRefund')
}]
const applyType = [{
  value: 1,
  label: $t('order.order.onlyRefund')
}, {
  value: 2,
  label: $t('order.order.refunds')
}]

const dateRange = ref([])
const returnMoneySts = ref(null)
const searchForm = ref([])
const sts = ref(0)
const dataForm = ref({})
const dataList = reactive([])
const page = reactive({
  pageSize: 10,
  pageNum: 1,
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})

const appStore = useAppStore()
const sidebarOpenState = computed(() => {
  return appStore.sidebar.opened
})

onActivated(() => {
  // 携带参数查询
  const query = useRoute().query
  if (Object.keys(query).length > 0) {
    searchForm.value = useRoute().query
    returnMoneySts.value = null
    onGetDataList()
  }
})
onMounted(() => {
  // 携带参数查询
  searchForm.value = useRoute().query
  if (searchForm.value.sts) {
    onSelectNavBySts(searchForm.value.sts)
  } else {
    onGetDataList()
  }
  // 监听页面滚动
  window.addEventListener('scroll', onScrollToTop)
})

// 页面滚动事件
const showHeadScroll = ref(false)
const onScrollToTop = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  showHeadScroll.value = scrollTop > 400
}

// 获取数据列表
let tempSearchForm = null
const dataListLoading = ref(false)
const onGetDataList = (newdata = false) => {
  const params = searchForm.value
  if (newdata || !tempSearchForm) {
    tempSearchForm = {
      pageNum: page.pageNum,
      pageSize: page.pageSize,
      orderId: params ? (params.orderId ? params.orderId : null) : null,
      returnMoneySts: returnMoneySts.value || null,
      refundId: params ? (params.refundId ? params.refundId : null) : null,
      orderType: params ? (params.orderType ? params.orderType : null) : null,
      applyType: params ? (params.applyType ? params.applyType : null) : null,
      refundType: params ? (params.refundType ? params.refundType : null) : null,
      beginTime: dateRange.value ? (dateRange.value[0] ? dateRange.value[0] : null) : null, // 开始时间
      endTime: dateRange.value ? (dateRange.value[1] ? dateRange.value[1] : null) : null // 结束时间
    }
  } else {
    tempSearchForm.returnMoneySts = returnMoneySts.value || null
    tempSearchForm = {
      ...tempSearchForm,
      pageNum: page.pageNum,
      pageSize: page.pageSize
    }
  }
  dataListLoading.value = true
  api.page(Object.assign(tempSearchForm, params)).then(data => {
    handleArr(dataList, data.list)
    page.total = data.total
    page.pages = data.pages
    dataListLoading.value = false
    sts.value = returnMoneySts.value || 0
  })
}

// 点击导航选择状态
const onSelectNav = (e) => {
  const stsVal = e.currentTarget.dataset.sts
  onSelectNavBySts(stsVal)
}

// 根据状态切换导航tag
const onSelectNavBySts = (stsVal) => {
  sts.value = parseInt(stsVal)
  returnMoneySts.value = sts.value === 0 ? null : parseInt(stsVal)
  page.pageNum = 1
  onGetDataList()
}

// 查看订单
const orderInfoRef = ref()
const orderInfoVisible = ref(false)
const viewOrderHandle = (id) => {
  orderInfoVisible.value = true
  nextTick(() => {
    orderInfoRef.value?.init(id)
  })
}

// 处理退款
const router = useRouter()
const refundHandle = (refundId) => {
  router.push({
    path: '/order/order-manage/refund-order-info',
    query: {
      refundId
    }
  })
}

/**
 * 根据选项设置时间
 * 1:今天 2:昨天 3: 近七天 4:近30天 5:近60天
 */
const createTimeActive = ref(0)
const setDateRange = (val) => {
  let startDay = null
  let endDay = null
  if (val === 1) {
    startDay = 0
    endDay = 0
  } else if (val === 2) {
    startDay = -1
    endDay = -1
  } else if (val === 3) {
    startDay = -7
    endDay = -1
  } else if (val === 4) {
    startDay = -30
    endDay = -1
  } else {
    return
  }
  // 开始时间
  const startTime = moment().add(startDay, 'days').startOf('days').format('LL')
  // 结束时间
  const endTime = moment().add(endDay, 'days').endOf('days').format('LL')
  dateRange.value = [startTime, endTime]
  createTimeActive.value = val
}

// 清空按钮
const onClear = () => {
  searchForm.value = {}
  dateRange.value = []
  returnMoneySts.value = null
}

// 刷新回调用
const refreshChange = () => {
  page.current = 1
  onGetDataList()
}

// 搜索查询
const onSearch = (newData = false) => {
  page.pageNum = 1
  onGetDataList(newData)
}
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
