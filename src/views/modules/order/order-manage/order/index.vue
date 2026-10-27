<template>
  <div class="page-order">
    <div class="screening-conditions">
      <el-form
        :inline="true"
        :model="dataForm"
        @submit.prevent
        @keyup.enter="getDataList(true)"
      >
        <div class="search">
          <el-form-item :label="$t('order.order.number') + '：'">
            <el-input
              v-model="dataForm.orderId"
              class="input-text-algin"
              maxlength="19"
              :placeholder="$t('order.order.number')"
              oninput="value=value.replace(/[^0-9]/g,'')"
              clearable
            />
          </el-form-item>

          <el-form-item :label="$t('order.order.orderType') + '：'">
            <!-- 订单类型 -->
            <el-select
              v-model="dataForm.orderType"
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
          <el-form-item label="订单类别：">
            <!-- 订单类别 -->
            <el-select
              v-model="dataForm.orderMold"
              clearable
              placeholder="请选择订单类别"
            >
              <el-option
                v-for="item in orderMold"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('order.order.status') + '：'">
            <!-- 订单状态 -->
            <el-select
              v-model="status"
              clearable
              :placeholder="$t('order.order.statusMsg')"
              @change="orderStatus"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('order.order.supplierDeliveryType') + '：'">
            <!-- 发货方式 -->
            <el-select
              v-model="dataForm.supplierDeliveryType"
              clearable
              :placeholder="$t('order.order.supplierDeliveryTypeMsg')"
            >
              <el-option
                v-for="item in supplierDeliveryType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('order.order.theRecipientSName') + '：'"
          >
            <el-input
              v-model="dataForm.consignee"
              :placeholder="$t('order.order.pleaseEnRecipName')"
              maxlength="100"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('constant.contactTel') + '：'">
            <el-input
              v-model="dataForm.mobile"
              :placeholder="$t('order.order.pleaseEnterNumber')"
              maxlength="11"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('order.order.paymentMethod') + '：'"
          >
            <!-- 支付方式 -->
            <el-select
              v-model="dataForm.payType"
              clearable
              :placeholder="$t('order.order.pleaseSePayt')"
            >
              <el-option
                v-for="item in payType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('order.order.afterSalesStatus') + '：'"
          >
            <!-- 售后状态 -->
            <el-select
              v-model="dataForm.refundStatus"
              clearable
              :placeholder="$t('order.order.pleSelAfterSalesSta')"
            >
              <el-option
                v-for="item in refund"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('order.order.logisticsType') + '：'"
          >
            <!-- 物流类型 -->
            <el-select
              v-model="dataForm.deliveryType"
              clearable
              :placeholder="$t('order.order.pleSelTypeOfLog')"
            >
              <el-option
                v-for="item in deliveryType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="是否预售："
          >
            <el-select
              v-model="dataForm.isPreSale"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in isPreSale"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="search">
          <el-form-item :label="$t('order.order.createTime') + '：'">
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
              @click="onSearch()"
            >
              {{ $t("table.search") }}
            </el-button>
            <el-button
              v-permission="['order:order:sold']"
              class="operation-btn"
              @click="getSoldExcel()"
            >
              {{ $t("table.export") }}
            </el-button>
            <el-button
              class="operation-btn"
              @click="clear()"
            >
              {{ $t("shop.resetMap") }}
            </el-button>
            <el-button
              v-permission="['order:delivery:getExcel']"
              @click="uploadSpu"
            >
              批量发货
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main">
      <div class="content">
        <!-- 导航 -->
        <div class="status-nav clearfix">
          <ul class="nav-list clearfix">
            <li
              :class="['nav-item', sts === 0 ? 'selected' : '']"
              @click="selectNav(0)"
            >
              {{ $t("date.a") }}
            </li>
            <li
              :class="['nav-item', sts === 1 ? 'selected' : '']"
              @click="selectNav(1)"
            >
              {{ $t("pay.obligation") }}
            </li>
            <li
              :class="['nav-item', sts === 2 ? 'selected' : '']"
              @click="selectNav(2)"
            >
              {{ $t("order.order.toBeShipped") }}
            </li>
            <li
              :class="['nav-item', sts === 3 ? 'selected' : '']"
              @click="selectNav(3)"
            >
              {{ $t("order.order.pendingReceipt") }}
            </li>
            <li
              :class="['nav-item', sts === 5 ? 'selected' : '']"
              @click="selectNav(5)"
            >
              {{ $t("order.order.successfulTransaction") }}
            </li>
            <li
              :class="['nav-item', sts === 6 ? 'selected' : '']"
              @click="selectNav(6)"
            >
              {{ $t("order.order.transactionFailed") }}
            </li>
            <li
              :class="['nav-item', sts === 7 ? 'selected' : '']"
              @click="selectNav(7)"
            >
              {{ $t("group.waitGroup") }}
            </li>
            <li
              :class="['nav-item', sts === 8 ? 'selected' : '']"
              @click="selectNav(8)"
            >
              {{ $t("order.order.toBePurchased") }}
            </li>
          </ul>
        </div>

        <!-- 列标题 -->
        <div :class="['tit', showHeadScroll ? (sidebarOpenState?'fixed-top fixed-top-w1':'fixed-top fixed-top-w2') : '']">
          <el-row style="width: 100%">
            <el-col :span="5">
              <span class="item product">{{ $t("constant.product") }}</span>
            </el-col>
            <el-col
              :span="5"
              class="transaction-price"
            >
              <span class="item">{{ $t("order.order.transaQuantity") }}</span>
            </el-col>
            <el-col
              :span="3"
              class="column-title"
            >
              <span class="item">
                {{ $t("order.order.actualPaymentAmount") }}
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="该笔订单中用户实际支付的钱"
                  placement="top-start"
                >
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>
              </span>
            </el-col>
            <el-col
              :span="2"
              class="column-title"
            >
              <span class="item">{{ $t("order.order.paymentMethod") }}</span>
            </el-col>
            <el-col
              :span="3"
              class="column-title"
            >
              <span class="item">{{ $t("order.order.buyerConsignee") }}</span>
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
          v-for="order in dataList"
          :key="order.orderId"
          class="prod"
          style="margin-bottom: 15px"
        >
          <div>
            <div class="prod-tit">
              <span>{{ $t("order.order.number") }}:{{ order.orderId }}</span>
              <span>{{ $t("order.order.createTime") }}:{{ order.createTime }}</span>
            </div>
            <div class="prod-cont">
              <el-row style="width: 100%;">
                <el-col
                  :span="10"
                  style="height: 100%"
                >
                  <order-prod-card
                    :order="order"
                  />
                </el-col>
                <el-col
                  :span="3"
                  style="height: 100%"
                >
                  <div class="item">
                    <div class="price-block">
                      <span
                        v-if="order.actualTotal"
                        class="totalprice"
                      >{{ formatPrice(order.actualTotal, 1).toFixed(2)
                      }}{{ $t("constant.dollar") }}</span>
                      <span
                        v-if="order.actualTotal && order.orderScore"
                        class="totalprice"
                      >&nbsp;+&nbsp;</span>
                      <span
                        v-if="order.orderScore"
                        class="totalprice"
                      >{{ order.orderScore
                      }}{{ $t("order.order.integral") }}</span>
                      <div
                        v-if="order.freightAmount"
                        class="totalprice"
                      >
                        &nbsp;
                        {{ $t("order.order.freightAmount") + '：￥' + formatPrice(order.freightAmount, 1).toFixed(2) }}
                      </div>
                      <div
                        v-if="order.platformFreeFreightAmount"
                        class="totalprice"
                      >
                        {{ $t("order.order.platformFreeFreightAmount") + '：￥' + formatPrice(order.platformFreeFreightAmount, 1).toFixed(2) }}
                      </div>
                      <div>
                        {{ $t("order.order.total") }}{{ order.allCount
                        }}{{ $t("constant.piece") }}
                      </div>
                      <br>
                      <el-button
                        v-if="order.status === 1"
                        v-permission="['order:order:amount']"
                        type="primary"
                        link
                        @click="editAmount(order)"
                      >
                        {{ $t("order.order.modifyTheAmount") }}
                      </el-button>
                    </div>
                  </div>
                </el-col>
                <el-col
                  :span="2"
                  style="height: 100%"
                >
                  <div class="item">
                    <div>
                      <span v-if="!order.payType && order.payType !== 0">{{
                        $t("order.order.unpaid")
                      }}</span>
                      <span v-else>
                        {{
                          [
                            $t("order.order.pointsPayment"),
                            $t("order.order.wecProPay"),
                            $t("order.order.alipayPCPayment"),
                            $t("order.order.wechatScanCodePayment"),
                            $t("order.order.wechatH5Payment"),
                            $t("order.order.weclAccountPay"),
                            $t("order.order.alipayH5Payment"),
                            $t("order.order.alipayAPPPayment"),
                            $t("order.order.wechatAPPPayment"),
                            $t("order.order.balancePayment"),
                          ][order.payType]
                        }}
                      </span>
                    </div>
                  </div>
                </el-col>
                <el-col
                  :span="3"
                  style="height: 100%"
                >
                  <div class="item">
                    <div class="buyer-info">
                      <div
                        v-if="(order.orderMold !== 1 && order.orderMold !== 3)"
                        class="buyer-name"
                      >
                        {{ order.consignee }}
                      </div>
                      <div
                        v-else
                        class="buyer-name"
                      >
                        {{ order.userName }}
                      </div>
                      <div
                        v-if="(order.orderMold !== 1 && order.orderMold !== 3)"
                        class="buyer-phone"
                      >
                        {{ order.mobile }}
                      </div>
                    </div>
                  </div>
                </el-col>
                <el-col
                  :span="2"
                  style="height: 100%"
                >
                  <div class="item">
                    <span>
                      <span v-if="order.status === 1||order.status === 9">{{ $t("pay.obligation") }}</span>
                      <span v-if="order.status === 2">{{ order.waitPurchase === 1 ? $t("order.order.toBePurchased") : $t("order.order.toBeShipped") }}</span>
                      <span v-if="order.status === 3">{{ $t("order.order.pendingReceipt") }}</span>
                      <span v-if="order.status === 7">{{ $t("group.waitGroup") }}</span>
                      <span v-if="order.status === 5">{{ $t("order.order.successfulTransaction") }}</span>
                      <span
                        v-if="order.status === 6"
                      >{{ $t("order.order.transactionFailed") }}</span>
                      <span
                        v-if="order.supplierDeliveryType === 1 && order.status === 2 && order.waitPurchase !== 1"
                        style="color: #999"
                      >({{ $t('order.order.pendingPurchaseDelivery') }})</span>
                      <div
                        v-if="order.preSaleType === 1"
                        style="color: #999"
                      >
                        <template v-if="order.status === 1">(待付定金)</template>
                        <template v-if="order.status === 9">(待付尾款)</template>
                      </div>
                    </span>
                  </div>
                </el-col>
                <el-col
                  :span="2"
                  style="height: 100%"
                >
                  <div class="item">
                    <span
                      v-if="order.refundStatus === 1"
                      type="danger"
                    >{{ $t("order.order.refundApplication") }}</span>
                    <span
                      v-else-if="order.refundStatus === 2"
                      type="danger"
                    >{{ $t("order.order.refundsuccessfully") }}</span>
                    <span
                      v-else-if="order.refundStatus === 3"
                      type="danger"
                    >{{ $t("order.order.partialRefundSucc") }}</span>
                    <span
                      v-else-if="order.refundStatus === 4"
                      type="danger"
                    >{{ $t("order.order.refundFailed") }}</span>
                    <span
                      v-else
                      type="danger"
                    >{{
                      $t("order.order.noAfterSales")
                    }}</span>
                  </div>
                </el-col>
                <el-col
                  :span="2"
                  style="height: 100%"
                >
                  <div class="item">
                    <div class="operate">
                      <el-button
                        v-if="order.status === 2 && order.waitPurchase === 1 && order.refundStatus !== 1"
                        v-permission="['order:order:delivery']"
                        type="primary"
                        link
                        @click="purchaseHandle(order)"
                      >
                        {{ $t("order.order.purchase") }}
                      </el-button>
                      <el-button
                        v-permission="['order:order:info']"
                        type="primary"
                        link
                        @click="onAddOrUpdate(order.orderId, order.orderType)"
                      >
                        {{ $t("order.order.seeDetails") }}
                      </el-button>
                      <!-- 修改物流 -->
                      <el-button
                        v-if="
                          order.status === 3 &&
                            (!order.refundStatus || order.refundStatus > 2) &&
                            order.deliveryType === 1 && order.updateOrViewDeliveryInfo === 1 &&
                            order.supplierDeliveryType !==1 &&
                            order.orderMold !== 1 && order.orderMold !== 3
                        "
                        v-permission="['order:order:logistics']"
                        type="primary"
                        link
                        @click="reviseLogistics(order.orderId)"
                      >
                        {{ $t("order.order.modifyLogistics") }}
                      </el-button>
                      <el-button
                        v-if="order.status === 2 && order.deliveryType !== 2 && order.supplierDeliveryType !==1 && dataForm.orderMold !==1"
                        v-permission="['order:order:delivery']"
                        type="primary"
                        link
                        @click="changeOrder(order)"
                      >
                        {{ $t("order.order.delivery") }}
                      </el-button>
                      <!-- 提货 -->
                      <el-button
                        v-if="order.status === 2 && order.deliveryType === 2"
                        v-permission="['admin:station:orderItemsDelivery']"
                        type="primary"
                        link
                        @click="stationOrder(order)"
                      >
                        {{ $t("order.order.pickUp") }}
                      </el-button>
                      <el-button
                        v-if="order.refundStatus"
                        v-permission="['order:order:refund']"
                        type="primary"
                        link
                        @click="refundRoute(order.orderId)"
                      >
                        {{ $t("order.order.refundInformation") }}
                      </el-button>
                      <el-button
                        v-permission="['order:order:info']"
                        type="primary"
                        link
                        @click="toImbox(order)"
                      >
                        {{ $t("order.order.contactBuyer") }}
                      </el-button>
                      <!-- 核销 -->
                      <!--
                        暂无售后、退款失败时
                        非待付款、交易失败、待成团状态时
                        非单次核销、核销未完成
                       -->
                      <el-button
                        v-if="(!order.refundStatus || order.refundStatus === 4) &&
                          !(order.status === 1||order.status === 9||order.status === 6||order.status === 7) &&
                          order.orderMold === 1 && order.writeOffNum !== 0 && order.writeOffStatus!==1 &&
                          ((order.writeOffNum!==1 && order.orderVirtualInfoList && order.orderVirtualInfoList.length > 0) ||
                            order.writeOffNum === 1) && judgeEndTime(order.writeOffEnd)"
                        v-permission="['order:virtual:update']"
                        type="primary"
                        link
                        @click="stationOrder(order)"
                      >
                        核销
                      </el-button>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
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
      @pagination="getDataList(false)"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getDataList"
    />
    <order-station
      v-if="orderStationVisible"
      ref="orderStationRef"
      @refresh-order-station-data-list="getDataList"
    />
    <order-amount-update
      v-if="orderAmountUpdateVisible"
      ref="orderAmountUpdateRef"
      @refresh-order-amount-update="getDataList"
    />
    <order-delivery-update
      v-if="devyVisible"
      ref="orderDeliveryUpdateRef"
      @refresh-order-delivery-update="getDataList"
    />
    <!-- 修改物流弹窗 -->
    <div class="delivery-dialog">
      <el-dialog
        v-model="logVisible"
        :title="$t('order.order.modifyLogistics')"
        :close-on-click-modal="false"
        width="50%"
      >
        <!-- 修改 -->
        <div
          v-if="isReviseLog"
          v-loading="isLogLoading"
          class="revise-log"
        >
          <div class="change-logistics">
            <div class="warning">
              {{ $t("order.order.ifModifyTheLog") }}
            </div>
            <div class="log-list">
              <div
                v-for="(logItem, index) in logisticsInfo"
                :key="index"
                class="item"
              >
                <div class="i-tit">
                  <div class="big">
                    {{ $t("order.order.package") }}{{ index + 1 }}
                  </div>
                  <div class="text">
                    {{ $t("order.order.total") }} {{ logItem.allCount }}
                    {{ $t("constant.piece") }}{{ $t("constant.product") }}
                  </div>
                </div>
                <div class="delivery-goods-box">
                  <div
                    v-for="(
                      orderItem, curIndex
                    ) in logItem.orderItems"
                    :key="curIndex"
                    class="item"
                  >
                    <div class="img">
                      <ImgShow :src="orderItem.imgUrl" />
                      <div class="number">
                        ×{{ orderItem.count }}
                      </div>
                    </div>
                    <div class="name">
                      {{ orderItem.spuName }}
                    </div>
                  </div>
                  <el-form
                    ref="logDataFormRef"
                    :model="logDataForm"
                    label-width="95px"
                    @submit.prevent
                    @keyup.enter="logDataFormSubmit()"
                  >
                    <!--发货方式-->
                    <el-form-item
                      :label="$t('order.order.deliveryMethod') + '：'"
                      style="text-align: left;"
                    >
                      <el-radio-group v-model="logItem.tempDeliveryType">
                        <el-radio
                          :label="1"
                          disabled
                        >
                          {{
                            $t("order.order.ordinaryExpress")
                          }}
                        </el-radio>
                        <el-radio
                          :label="3"
                          disabled
                        >
                          {{
                            $t("order.order.noNeedRequired")
                          }}
                        </el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <!--配送方式 线上 线下-->
                    <el-form-item
                      v-if="logItem.tempDeliveryType === 1"
                      :label="$t('order.order.delType') + '：'"
                      style="text-align: left;"
                    >
                      <el-radio-group v-model="logItem.deliveryType">
                        <el-radio
                          :label="0"
                          disabled
                        >
                          {{
                            $t("order.order.onlineDelivery")
                          }}
                        </el-radio>
                        <el-radio
                          :label="1"
                          disabled
                        >
                          {{
                            $t("order.order.selfDelivery")
                          }}
                        </el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <div
                      v-if="logItem.deliveryType === 1"
                      class="info-int"
                    >
                      <el-form-item
                        :label="$t('order.order.courierCompany') + '：'"
                        class="form-item"
                        style="text-align: left;"
                      >
                        <div
                          v-if="logVisible"
                          class="con"
                        >
                          <select-lazy v-model="logItem.deliveryCompanyId" />
                        </div>
                      </el-form-item>
                      <el-form-item
                        :label="$t('order.order.trackingNumber') + '：'"
                        class="form-item"
                      >
                        <el-input
                          v-model="logItem.deliveryNo"
                          controls-position="right"
                          :min="0"
                          :class="['int-frame', errorNum === 1 ? 'errortip' : '']"
                        />
                      </el-form-item>
                    </div>
                    <div
                      v-if="logItem.deliveryType === 0"
                      class="info-int"
                    >
                      <el-form-item
                        :label="$t('order.order.courierCompany') + '：'"
                        class="form-item"
                        style="text-align: left;"
                      >
                        <div
                          v-if="logVisible"
                          class="con"
                        >
                          {{ deliveryCompanyType[logItem.deliveryCompanyId - 1].label }}
                        </div>
                      </el-form-item>
                      <el-form-item
                        :label="$t('order.order.trackingNumber') + '：'"
                        class="form-item"
                      >
                        {{ logItem.deliveryNo }}
                      </el-form-item>
                    </div>
                  </el-form>
                </div>
              </div>
            </div>
          </div>
          <!-- 确认 -->
          <div
            v-if="!isReviseLog"
            class="change-logistics"
          >
            <div class="warning">
              {{ $t("order.order.ifModifyTheLog") }}
            </div>
            <el-table
              class="log-info-table"
              :data="confirmList"
            >
              <el-table-column
                property="deliveryCompanyIdName"
                :label="$t('order.order.packageName')"
                width="220"
                style="text-align: left"
              />
              <el-table-column
                property="allCount"
                :label="$t('order.order.amountOfGoods')"
                width="140"
              />
              <el-table-column
                property="delMethod"
                :label="$t('order.order.deliveryMethod')"
                width="140"
              />
              <el-table-column
                property="name"
                :label="$t('order.order.logisticsCompany')"
                width="170"
              />
              <el-table-column
                property="deliveryNo"
                :label="$t('order.order.trackingNumber')"
              />
            </el-table>
          </div>
          <div
            v-if="isReviseLog"
            class="dialog-footer"
          >
            <el-button @click="logVisible = false">
              {{
                $t("table.cancel")
              }}
            </el-button>
            <el-button
              type="primary"
              @click="logDataFormSubmit()"
            >
              {{
                $t("order.order.save")
              }}
            </el-button>
          </div>
          <div
            v-if="!isReviseLog"
            class="dialog-footer"
          >
            <el-button @click="backToRevise()">
              {{
                $t("order.order.backToModify")
              }}
            </el-button>
            <el-button
              type="primary"
              @click="confirmRevise()"
            >
              {{
                $t("order.order.confirmTheChanges")
              }}
            </el-button>
          </div>
        </div>
      </el-dialog>
    </div>
    <!-- 通联支付采购获取验证码弹窗 -->
    <PurchaseVerification
      v-if="purchaseVisible"
      ref="purchaseRef"
      :mobile="allinpayMobile"
      :countdown="countdown"
      @get-code="getCode"
      @pay-confirm="payConfirm"
    />
    <!-- /修改物流弹窗 -->
    <order-upload
      v-if="uploadVisible"
      ref="spuUploadRef"
      :param="dataForm"
      @refresh-data-list1="getWaitingConsignmentExcel"
      @close="uploadVisible = false"
    />
  </div>
</template>

<script setup>
import moment from 'moment'
import * as api from '@/api/order/order'
import * as deliveryCompanyApi from '@/api/delivery/delivery-company'
import { getAllinpayCompanyInfo } from '@/api/multishop/shop-process'
import { payConfirmBySmsBack, resendPayCode } from '@/api/pay/pay'
import { formatPrice, getDomain } from '@/utils/index.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import AddOrUpdate from './components/order-info.vue'
import OrderAmountUpdate from './components/order-amount-update.vue'
import OrderDeliveryUpdate from './components/order-delivery-update.vue'
import OrderStation from './components/order-station.vue'
import OrderUpload from './components/order-upload.vue'
import Pagination from '@/components/Pagination/index.vue'
import PurchaseVerification from '@/components/allinpay-verification/index.vue'
import SelectLazy from '@/components/select-lazy/index.vue'
import OrderProdCard from './components/order-prod-card/index.vue'
import Cookies from 'vue-cookies'

const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59)
]
const dataForm = ref({})
const dateRange = ref([])
const errorNum = ref(0)
const isReviseLog = ref(true) // 是否正在修改物流信息
const logVisible = ref(false)
const status = ref(null)
const sts = ref(0)
const confirmList = reactive([]) // 确认修改信息
const dataList = ref([])
const logDataForm = reactive({
  deliveryCompanyId: '', // 当前物流公司id
  deliveryNo: '', // 物流单号
  names: [] // 物流公司列表
})
const logisticsInfo = reactive([]) // 包裹列表
const page = reactive({
  pageSize: 10,
  pageNum: 1,
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})

const deliveryCompanyType = [{
  value: 1,
  label: '顺丰速运'
}, {
  value: 2,
  label: '京东快递'
}, {
  value: 3,
  label: '圆通速递'
}, {
  value: 4,
  label: '韵达快递'
}, {
  value: 5,
  label: '中通快递'
}, {
  value: 6,
  label: '申通快递'
}, {
  value: 7,
  label: '百世快递'
}, {
  value: 8,
  label: 'EMS'
}]

const allinpayStore = useAllinpayStore()
const bizOrderNo = ref('') // 采购订单号（通联支付）
const countdown = ref(0) // 倒计时
const paySettlementType = ref(allinpayStore.paySettlementType) // 是否开启通联支付 1：开启 0：关闭
const purchaseVisible = ref(true) // 采购弹窗(通联支付)

let fromChat = null
const options = [{
  value: 1,
  label: $t('pay.obligation')
}, {
  value: 2,
  label: $t('order.order.toBeShipped')
}, {
  value: 3,
  label: $t('order.order.pendingReceipt')
}, {
  value: 5,
  label: $t('order.order.successfulTransaction')
}, {
  value: 6,
  label: $t('order.order.transactionFailed')
}, {
  value: 7,
  label: $t('group.waitGroup')
}, {
  value: 8,
  label: $t('order.order.toBePurchased')
}]
const refund = [{
  value: 0,
  label: $t('order.order.noAfterSales')
}, {
  value: 1,
  label: $t('order.order.refundApplication')
}, {
  value: 2,
  label: $t('order.order.refundsuccessfully')
}, {
  value: 3,
  label: $t('order.order.partialRefundSucc')
}, {
  value: 4,
  label: $t('order.order.refundFailed')
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
const supplierDeliveryType = [{
  value: 1,
  label: '供应商发货'
}, {
  value: 2,
  label: '商家发货'
}]
const orderMold = [{
  value: 0,
  label: '实物商品订单'
}, {
  value: 1,
  label: '虚拟商品订单'
}, {
  value: 2,
  label: '组合商品订单'
}, {
  value: 3,
  label: '电子卡券订单'
}]
const deliveryType = [{
  value: 1,
  label: $t('order.order.ordinaryExpress')
}, {
  value: 2,
  label: $t('order.order.selfMention')
}, {
  value: 3,
  label: $t('order.order.noNeedRequired')
}, {
  value: 4,
  label: $t('order.order.sameCityDelivery')
}]
const payType = [{
  value: -1,
  label: $t('admin.unpay')
}, {
  value: 1,
  label: $t('admin.weChatPay')
}, {
  value: 2,
  label: $t('admin.aliPay')
}, {
  value: 3,
  label: $t('admin.balancePay')
}, {
  value: 0,
  label: $t('order.order.pointsPayment')
}]
const isPreSale = [{
  value: 1,
  label: '是'
}, {
  value: 0,
  label: '否'
}]

// 侧边栏显隐状态
const appStore = useAppStore()
const sidebarOpenState = computed(() => {
  return appStore.sidebar.opened
})

const route = useRoute()
onMounted(() => {
  // 获取首页跳转传递的参数
  if (route.query.orderNumber) {
    fromChat = route.query.orderNumber
    onAddOrUpdate(route.query.orderNumber, undefined, route.query.userId)
  }
  if (route.query.orderStatus) {
    selectNav(route.query.orderStatus)
  } else {
    getDataList()
  }
  getLogisticsList()
  if (paySettlementType.value === 1) {
    // 获取通联支付绑定的手机号
    queryCompany()
  }
  // 监听页面滚动
  window.addEventListener('scroll', scrollToTop)
})

// 页面滚动事件
const showHeadScroll = ref(false) // 修改物流相关
const scrollToTop = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  showHeadScroll.value = scrollTop > 440 && dataList.value.length > 5
}

// 请求物流公司列表
const getLogisticsList = () => {
  deliveryCompanyApi.list().then((data) => {
    logDataForm.names = data
  })
}

// 获取包裹物流信息
const isLogLoading = ref(false) // 物流数据加载中
const reviseLogistics = (orderId) => {
  logVisible.value = !logVisible.value
  isLogLoading.value = true
  logDataForm.deliveryCompanyId = ''
  logDataForm.deliveryNo = ''
  logDataForm.names = []
  logisticsInfo.length = 0
  getLogisticsList()
  api.getOrderDeliveries({
    orderId
  }).then(data => {
    handleArr(logisticsInfo, data)
    logisticsInfo.forEach((el, index) => {
      el.tempDeliveryType = el.deliveryType === 1 || el.deliveryType === 0 ? 1 : el.deliveryType
      el.newDeliveryNo = el.deliveryNo
      el.newDeliveryCompanyId = el.deliveryCompanyId
      el.deliveryCompanyIdName = $t('order.order.package') + Number(index + 1)
      // 修改弹窗
      confirmList.length = 0 // 清空确认列表
    })
    isLogLoading.value = false
  })
  errorNum.value = 0
}

const uploadVisible = ref(false)
const spuUploadRef = ref()
const uploadSpu = () => {
  dataForm.value.startTime = dateRange.value === null ? null : dateRange.value[0]
  dataForm.value.endTime = dateRange.value === null ? null : dateRange.value[1]
  uploadVisible.value = true
  nextTick(() => {
    spuUploadRef.value?.init()
  })
}

const getWaitingConsignmentExcel = () => {
  getDataList()
}

// 点击保存
const logDataFormSubmit = () => {
  let flag = true
  logisticsInfo.forEach((el) => {
    if (el.deliveryType === 3 || el.deliveryType === 0) {
      return
    }
    if (!flag) {
      return false
    }
    const reg = /^[a-zA-Z0-9]{4,30}$/
    if (el.deliveryNo.length === 0) {
      ElMessage({
        message: $t('order.order.logEmpty'),
        type: 'warning'
      })
      flag = false
      errorNum.value = 1
    } else if (!reg.test(el.deliveryNo)) {
      ElMessage({
        message: $t('order.order.checkDeliveryNo'),
        type: 'warning'
      })
      flag = false
      errorNum.value = 1
    } else {
      errorNum.value = 0
      if ((el.newDeliveryNo.length !== 0 && el.newDeliveryNo !== el.deliveryNo) || (el.newDeliveryCompanyId !== el.deliveryCompanyId)) {
        confirmList.push(el)
        confirmList.forEach((el) => {
          el.delMethod = $t('order.order.logistics')
          // el.packageName = "包裹" + Number(index+1)
          logDataForm.names.forEach((name) => {
            if (el.deliveryCompanyId === name.deliveryCompanyId) {
              el.name = name.name
            }
          })
        })
      }
    }
  })
  if (errorNum.value === 1) {
    return
  } else if (confirmList.length === 0) {
    ElMessage({
      message: $t('order.order.noLogIsChanged'),
      type: 'warning'
    })
    flag = false
  }
  if (flag) {
    confirmRevise()
  }
}

// 确认修改物流信息
const confirmRevise = () => {
  api.updateOrderDeliveries(confirmList).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success'
    })
    logDataForm.deliveryCompanyId = ''
    logDataForm.deliveryNo = ''
    logDataForm.names = []
    logisticsInfo.length = 0
    isReviseLog.value = true
    logVisible.value = false
  })
}

// 返回修改（物流信息）
const backToRevise = () => {
  isReviseLog.value = true
  // 修改弹窗
  confirmList.length = 0 // 清空确认列表
}

// 获取数据列表
const dataListLoading = ref(false)
let tempSearchForm = null
const getDataList = (newdata = false) => {
  if (newdata || !tempSearchForm) {
    tempSearchForm = {
      pageNum: page.pageNum,
      pageSize: page.pageSize,
      orderId: fromChat === 1 ? dataForm.value.orderId : fromChat,
      orderType: dataForm.value.orderType,
      payType: dataForm.value.payType,
      consignee: dataForm.value.consignee,
      mobile: dataForm.value.mobile,
      isPreSale: dataForm.value.isPreSale,
      status: status.value,
      deliveryType: dataForm.value.deliveryType,
      refundStatus: dataForm.value.refundStatus,
      supplierDeliveryType: dataForm.value.supplierDeliveryType,
      startTime: dateRange.value === null ? null : dateRange.value[0], // 开始时间
      endTime: dateRange.value === null ? null : dateRange.value[1], // 结束时间
      orderMold: dataForm.value.orderMold
    }
  } else {
    tempSearchForm.status = status.value
    tempSearchForm = {
      ...tempSearchForm,
      pageNum: page.pageNum,
      pageSize: page.pageSize
    }
  }
  dataListLoading.value = true
  api.page(Object.assign(tempSearchForm)).then(data => {
    page.total = data.total
    page.pages = data.pages
    handleArr(dataList.value, data.list)
    sts.value = !status.value ? 0 : status.value
    dataListLoading.value = false
    fromChat = 1
  })
}

// 导航选择状态
const selectNav = (stsVal) => {
  sts.value = parseInt(stsVal)
  status.value = sts.value === 0 ? null : parseInt(stsVal)
  page.pageNum = 1
  getDataList(false)
}

const orderStatus = (val) => {
  status.value = val
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

// 新增 / 修改
const addOrUpdateVisible = ref(false)
const addOrUpdateRef = ref()
const onAddOrUpdate = (val, orderType, usreId) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(val, orderType, usreId)
  })
}

// 退款路由跳转
const commonStore = useCommonStore()
const router = useRouter()
const refundRoute = (val) => {
  /* 判断是否拥有权限 */
  const routeList = commonStore.routeList
  const flag = isAuth(routeList, ['/order', '/order/order-manage', 'refund-order'])
  if (!flag) {
    return ElMessage.error('您暂时没有权限访问')
  }
  router.push({
    path: '/order/order-manage/refund-order',
    query: { orderId: val }
  })
}

// 清空按钮
const clear = () => {
  dataForm.value = {}
  dateRange.value = []
  status.value = null
}

// 搜索查询
const onSearch = () => {
  page.pageNum = 1
  getDataList(true)
}

// 更改订单金额
const orderAmountUpdateVisible = ref(false)
const orderAmountUpdateRef = ref()
const editAmount = (order) => {
  orderAmountUpdateVisible.value = true
  nextTick(() => {
    orderAmountUpdateRef.value?.init(order)
  })
}

// 发货
const devyVisible = ref(false)
const orderDeliveryUpdateRef = ref()
const changeOrder = (order) => {
  devyVisible.value = true
  nextTick(() => {
    orderDeliveryUpdateRef.value?.init(order)
  })
}

// 提货
const orderStationVisible = ref(false)
const orderStationRef = ref()
const stationOrder = (order) => {
  orderStationVisible.value = true
  nextTick(() => {
    orderStationRef.value?.init(order)
  })
}

// 采购
const purchaseRef = ref()
const purchaseHandle = (order) => {
  if (paySettlementType.value === 1) {
    purchaseVisible.value = true
    purchaseRef.value?.init({ order })
    return
  }
  ElMessageBox.confirm($t('order.order.purchaseConfirmTips').replace('[d]', formatPrice(order.purchaseSpreadAmount, 1).toFixed(2)), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    api.purchase({
      orderId: order.orderId
    }).then(() => {
      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 1500,
        onClose: () => {
          getDataList()
        }
      })
    })
  })
}

// 前往消息盒子
const domain = getDomain()
const toImbox = (order) => {
  if (order.isWriteOff) {
    ElMessage({
      message: '该用户已注销',
      type: 'error'
    })
    return
  }
  const path = router.resolve({
    path: '/im-box',
    query: {
      userId: order.orderItems[0].userId,
      orderNumber: order.orderId,
      ...(Cookies.get(domain) ? {} : { tid: Cookies.get('cloudTid') })
    }
  })
  const win = window.open(path.href, 'view_window', 'noopener,noreferrer')
  if (win) win.opener = null
}

const getSoldExcel = () => {
  if (!dateRange.value || dateRange.value.length < 2) {
    ElMessage.error($t('order.order.pleExpOrderFirst'))
    return
  }
  ElMessageBox.confirm($t('table.sureToExport'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    api.soldExcel({
      orderId: dataForm.value.orderId,
      orderType: dataForm.value.orderType,
      payType: dataForm.value.payType,
      consignee: dataForm.value.consignee,
      supplierDeliveryType: dataForm.value.supplierDeliveryType,
      mobile: dataForm.value.mobile,
      status: status.value,
      deliveryType: dataForm.value.deliveryType,
      refundStatus: dataForm.value.refundStatus,
      startTime: dateRange.value === null ? null : dateRange.value[0], // 开始时间
      endTime: dateRange.value === null ? null : dateRange.value[1], // 结束时间
      isPreSale: dataForm.value.isPreSale,
      orderMold: dataForm.value.orderMold
    }).then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
      const fileName = $t('order.order.orderInfCollationXls')
      const elink = document.createElement('a')
      if ('download' in elink) { // 非IE下载
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName)
      }
    }).catch((e) => {
      ElMessage.error(e)
    })
  })
}

// 获取企业信息（通联支付）
const allinpayMobile = ref('') // 验证用手机号（通联支付）
const queryCompany = () => {
  getAllinpayCompanyInfo().then(data => {
    allinpayMobile.value = data.phone
  })
}

// 通联支付获取验证码
const getCode = (params, verifyResult) => {
  if (bizOrderNo.value) {
    resendPayCode({
      bizOrderNo: bizOrderNo.value,
      captchaVerification: verifyResult.captchaVerification
    }).then(() => {
      countdown.value = 60
      getCountdown()
    })
    return
  }
  api.purchase({
    orderId: params.order.orderId,
    captchaVerification: verifyResult.captchaVerification
  }).then((res) => {
    bizOrderNo.value = res.bizOrderNo
    countdown.value = 60
    getCountdown()
  })
}

const timer = ref('') // 倒计时定时器
const getCountdown = () => {
  timer.value = setInterval(() => {
    countdown.value--
    if (countdown.value === 0) {
      clearInterval(timer.value)
    }
  }, 1000)
}

// 通联支付确认支付
const payConfirm = (validCode) => {
  payConfirmBySmsBack({
    bizOrderNo: bizOrderNo.value,
    verificationCode: validCode
  }).then((res) => {
    if (res.payStatus === 'success') {
      ElMessage({
        message: '采购成功',
        type: 'success',
        duration: 2000,
        onClose: () => {
          purchaseVisible.value = false
          bizOrderNo.value = ''
          getDataList()
        }
      })
    }
  })
}

/**
 * 判断核销是否到期
 */
const judgeEndTime = (endTime) => {
  let bol
  if (!endTime) {
    bol = true
  } else {
    const newTime = new Date()
    endTime = new Date(endTime)
    bol = newTime < endTime
  }
  return bol
}

</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
