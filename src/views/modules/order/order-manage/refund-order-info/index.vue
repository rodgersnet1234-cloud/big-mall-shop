<template>
  <div class="page-refund-order-info">
    <div class="new-page-title">
      <div class="line" />
      <div class="text">
        {{ $t('order.order.refundProcessing') }}
      </div>
    </div>
    <div
      v-if="platInterveneSts===1 && stillAveTime"
      class="plat-intervene"
    >
      <el-icon :size="14">
        <WarningFilled />
      </el-icon>
      <span>用户申请平台介入售后，请在{{ dataForm.interventionEndTime }}前补充凭证</span>
    </div>
    <div class="order-refund-info">
      <div class="refundId">
        <span class="title">{{ $t('order.order.refundId') }}:</span>
        <span class="text">{{ dataForm.refundId }}</span>
      </div>
      <div class="content">
        <div class="order-number">
          <div class="num-cont">
            <div class="state-title">
              <!-- 退款类型 -->
              <div class="item">
                <div class="title">
                  {{ $t('order.order.refundType') }}：
                </div>
                <div class="text">
                  <div v-if="dataForm.refundType === 1">
                    {{ $t("order.order.wholeOrderRefund") }}
                  </div>
                  <div v-if="dataForm.refundType === 2">
                    {{ $t("order.order.singleItemRefund") }}
                  </div>
                </div>
              </div>
              <!-- 退款方式 -->
              <div class="item">
                <div class="title">
                  {{ $t('order.order.refundMethod') }}：
                </div>
                <div class="text">
                  <div v-if="dataForm.applyType === 1">
                    {{ $t("order.order.onlyRefund") }}
                  </div>
                  <div v-if="dataForm.applyType === 2">
                    {{ $t("order.order.refundAndMoney") }}
                  </div>
                </div>
              </div>
              <div
                v-if="dataForm.decisionTime && !dataForm.refundTime"
                class="item"
              >
                <div>
                  等待{{ dataForm.payType === 1 || dataForm.payType === 3 || dataForm.payType === 4 || dataForm.payType === 5 || dataForm.payType === 8 ? '微信' : '支付宝' }}进行退款
                </div>
              </div>
            </div>
            <div class="refund-progress">
              <refund-steps :refund-detail="dataForm" />
            </div>
          </div>
        </div>
        <div class="order-state">
          <div class="state-cont">
            <div class="order-info">
              <div class="order-details refund-record-left">
                <div class="detail-title">
                  <span class="prompt">{{ $t("order.order.refundDetails") }}</span>
                </div>
                <div class="detail-cont">
                  <div class="detail01">
                    <div class="text-width">
                      <div class="text-width-item">
                        <span class="title">{{ $t('order.order.number') }}：</span>
                        <span class="text">{{ dataForm.orderId }}</span>
                      </div>
                      <div
                        v-if="dataForm.actualTotal"
                        class="text-width-item"
                      >
                        <span class="title">{{ $t('order.order.orderActuallyPaid') }}：</span>
                        <span
                          v-if="dataForm.actualTotal"
                          class="text"
                        >{{ formatPrice(dataForm.actualTotal, 1).toFixed(2)
                        }}{{ $t("constant.dollar") }}</span>
                        <span
                          v-if="dataForm.actualTotal && dataForm.orderScore"
                          class="text"
                        >+
                        </span>
                        <span
                          v-if="dataForm.orderScore"
                          class="text"
                        >{{ dataForm.orderScore
                        }}{{ $t("order.order.integral") }}</span>
                      </div>
                      <div class="text-width-item">
                        <span class="title">{{ $t('order.order.refundAmount') }}：</span>
                        <span
                          v-if="dataForm.refundAmount"
                        >{{ formatPrice(dataForm.refundAmount,1).toFixed(2)
                        }}{{ $t("constant.dollar") }}</span>
                        <span
                          v-if="dataForm.refundAmount && dataForm.refundScore"
                        >+
                        </span>
                        <span
                          v-if="dataForm.refundScore"
                        >{{ dataForm.refundScore
                        }}{{ $t("order.order.integral") }}</span>
                      </div>
                      <div class="text-width-item">
                        <span class="title">{{ $t('order.order.applicationTime') }}：</span>
                        <span class="text">{{ dataForm.createTime }}</span>
                      </div>
                      <div class="text-width-item">
                        <span class="title">{{ $t('order.order.reasonForReturn') }}：</span>
                        <span class="text">{{ dataForm.buyerReasonValue }}</span>
                      </div>
                      <div class="text-width-item">
                        <span class="title">{{ $t('order.order.refundInstructions') }}：</span>
                        <span class="text">{{ dataForm.buyerDesc }}</span>
                      </div>
                      <div class="text-width-item">
                        <span class="title">手机号码：</span>
                        <span>{{ dataForm.buyerMobile || '-' }}</span>
                      </div>
                      <div class="text-width-item">
                        <span class="title">{{ $t('order.order.refundCertificate') }}：</span>
                        <div v-if="imgList.length">
                          <el-image
                            v-for="(picItem,picInx) in imgList"
                            :key="picInx"
                            :src="checkFileUrl(picItem)"
                            class="img-box"
                            :initial-index="picInx"
                            :preview-src-list="checkFileUrl(imgList)"
                          >
                            <template #error>
                              <img
                                class="img-slot"
                                src="~@/assets/images/def.png"
                              >
                            </template>
                          </el-image>
                        </div>
                        <div v-else>
                          无
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="buyers">
                <div class="refund-record-title detail-title">
                  <span>退款记录</span>
                  <span
                    v-if="platInterveneSts===1 && stillAveTime"
                    class="proof-btn"
                    @click="onAddProof"
                  >
                    <el-icon :size="16">
                      <Memo />
                    </el-icon>
                    <span class="txt">补充凭证</span>
                  </span>
                </div>
                <div class="refund-record">
                  <refundRecord :refund-detail="dataForm" />
                </div>
              </div>
            </div>
            <div
              v-if="dataForm.orderRefundAddr && dataForm.orderRefundAddr.deliveryName"
              class="order-info"
            >
              <div class="order-details">
                <div class="detail-title">
                  <span class="prompt">{{ $t("order.order.logisticsDetails") }}</span>
                </div>
                <div class="detail-cont">
                  <div class="detail01">
                    <div class="text-width">
                      <div class="text-width-item">
                        <span class="title">{{ $t('order.order.logisticsName') }}：</span>
                        <span class="text">{{ dataForm.orderRefundAddr.deliveryName }}</span>
                      </div>
                      <div
                        v-if="dataForm.orderRefundAddr?.deliveryNo"
                        class="text-width-item"
                      >
                        <span class="title">{{ $t('order.order.trackingNumber') }}：</span>
                        <span class="text">{{ dataForm.orderRefundAddr.deliveryNo }}</span>
                      </div>
                      <div
                        v-if="dataForm.orderRefundAddr?.senderRemarks"
                        class="text-width-item"
                      >
                        <span class="title">{{ $t('order.order.compradorMsg') }}：</span>
                        <span class="text">{{ dataForm.orderRefundAddr.senderRemarks }}</span>
                      </div>
                      <div
                        v-if="dataForm.orderRefundAddr?.senderMobile"
                        class="text-width-item"
                      >
                        <span class="title">{{ $t('order.order.buyerPhone') }}：</span>
                        <span>{{ dataForm.orderRefundAddr.senderMobile }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="buyers">
                <div class="detail-title">
                  <!-- 物流凭证 -->
                  <span>{{ $t('order.order.logisticsCertificate') }}</span>
                </div>
                <div class="buyers-info">
                  <div v-if="orderRefundAddrPhotos.length">
                    <el-image
                      v-for="(imgItem,imgInx) in orderRefundAddrPhotos"
                      :key="imgInx"
                      :src="checkFileUrl(imgItem)"
                      class="img-box"
                      :initial-index="imgInx"
                      :preview-src-list="orderRefundAddrPhotos"
                    >
                      <template #error>
                        <img
                          class="img-slot"
                          src="~@/assets/images/def.png"
                        >
                      </template>
                    </el-image>
                  </div>
                  <div v-else>
                    无
                  </div>
                </div>
              </div>
            </div>
            <div class="item-list">
              <el-table
                :data="dataForm.orderItems"
                header-cell-class-name="table-header"
                row-class-name="table-row"
                :row-style="{ height:'82px'}"
              >
                <el-table-column
                  :label="$t('order.order.refundGoods')"
                  width="500"
                >
                  <template #default="scope">
                    <div class="prod-info">
                      <img-show
                        :src="scope.row.pic"
                        :img-style="{width:'80px',height:'80px'}"
                      />
                      <div class="con">
                        <span
                          v-if="scope.row.giveawayOrderItemId"
                          class="gift-icon"
                        >赠品</span>
                        <span>{{ scope.row.spuName }}</span>
                        <span class="sku">{{ scope.row.skuName || '' }}</span>
                      </div>
                    </div>

                    <!-- 组合 -->
                    <div
                      v-if="scope.row.comboList"
                      class="gift-prod"
                    >
                      <combo-list
                        :combo-list="scope.row.comboList"
                        tag-name="【组合】"
                      />
                    </div>
                    <!-- / 组合 -->

                    <!-- 赠品 -->
                    <div
                      v-if="scope.row.giveawayList && prodLength === false"
                      class="gift-prod"
                    >
                      <combo-list
                        :combo-list="scope.row.giveawayList"
                        tag-name="【赠品】"
                      />
                    </div>
                    <!-- / 赠品 -->
                  </template>
                </el-table-column>
                <el-table-column
                  prop="price"
                  :label="$t('order.order.unitPrice')"
                >
                  <template #default="scope">
                    <span v-if="!scope.row.giveawayOrderItemId">{{ getUnitPrice(scope.row.spuTotalAmount, scope.row.count) }}</span>
                    <span v-if="scope.row.giveawayOrderItemId">{{ getUnitPrice(scope.row.giveawayAmount, scope.row.count) }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="count"
                  :label="$t('order.order.quantity')"
                >
                  <template #default="scope">
                    {{ scope.row.count }}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('order.order.prodTotalPrice')">
                  <template #default="scope">
                    <span v-if="dataForm.refundType === 1 && !scope.row.giveawayOrderItemId">{{
                      formatPrice(scope.row.spuTotalAmount, 1).toFixed(2)
                    }}</span>
                    <span v-if="dataForm.refundType === 2 && !scope.row.giveawayOrderItemId">{{
                      bigspuTotalAmount(scope.row.price, dataForm.refundCount)
                    }}</span>
                    <span v-if="scope.row.giveawayOrderItemId">{{ formatPrice(scope.row.giveawayAmount, 1).toFixed(2) }}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="actualTotal"
                  :label="$t('order.order.actualAmount')"
                >
                  <template #default="scope">
                    <span v-if="dataForm.refundType === 1 && !scope.row.giveawayOrderItemId">{{
                      formatPrice(scope.row.actualTotal, 1).toFixed(2)
                    }}</span>
                    <span v-if="dataForm.refundType === 2 && !scope.row.giveawayOrderItemId">{{
                      bigActualTotal(scope.row.actualTotal, scope.row.count)
                    }}</span>
                    <span v-if="scope.row.giveawayOrderItemId">-</span>
                    <el-tag
                      v-if="scope.row.shareReduce > 0"
                      type="danger"
                      effect="dark"
                    >
                      {{ $t("order.order.discount") }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="actualTotal"
                  :label="$t('order.order.refundPlatformDiscountAmount')"
                  align="center"
                >
                  <template #default="scope">
                    <span v-if="!scope.row.giveawayOrderItemId">{{
                      formatPrice((dataForm.refundType === 1 ? scope.row.platformShareReduce : dataForm.platformRefundAmount), 1).toFixed(2)
                    }}</span>
                    <span v-if="scope.row.giveawayOrderItemId">-</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="productTotalAmount"
                  :label="$t('order.order.returnAmount')"
                >
                  <template #default="scope">
                    <span
                      v-if="dataForm.refundAmount && !scope.row.giveawayOrderItemId"
                      class="totalprice"
                    >{{ formatPrice((dataForm.refundType === 1 ? scope.row.actualTotal : dataForm.refundAmount), 1).toFixed(2)
                    }}{{ $t("constant.dollar") }}</span>
                    <span
                      v-if="dataForm.refundAmount && dataForm.refundScore && !scope.row.giveawayOrderItemId"
                      class="totalprice"
                    >+
                    </span>
                    <span
                      v-if="dataForm.refundScore && !scope.row.giveawayOrderItemId"
                      class="totalprice"
                    >{{ dataForm.refundType === 1 ? scope.row.refundScore : dataForm.refundScore }}{{ $t("order.order.integral") }}</span>
                    <span v-if="scope.row.giveawayOrderItemId">-</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 申请审批 -->
            <div
              v-if="dataForm.returnMoneySts === 1 && dataForm.supplierHandleStatus < 0"
              class="sellerRemark"
            >
              <div class="remark-title">
                {{ $t("order.order.applyForApproval") }}：
              </div>
              <div class="remark-content">
                <el-radio-group v-model="isAgreeRefund">
                  <el-radio
                    v-if="paySettlementType !== 1 || paySettlementType === 1 && dataForm.paySysType !== 0"
                    :label="2"
                  >
                    <span v-if="dataForm.supplierId && dataForm.waitPurchase!==1">
                      自行处理
                    </span>
                    <span v-else>
                      {{ dataForm.applyType === 1 ? $t("order.order.agreeToRefundA") : $t("order.order.agree") }}
                    </span>
                  </el-radio>
                  <el-radio :label="3">
                    {{ $t("order.order.disagree") }}
                  </el-radio>
                  <el-radio
                    v-if="dataForm.supplierId && dataForm.waitPurchase !== 1"
                    :label="4"
                  >
                    {{
                      $t("order.order.suppliersHandle")
                    }}
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="$t('order.order.supplierPaidTips')"
                      placement="right"
                    >
                      <span>
                        <el-icon><QuestionFilled /></el-icon>
                      </span>
                    </el-tooltip>
                  </el-radio>
                </el-radio-group>
              </div>
            </div>

            <div
              v-if="dataForm.applyType === 2"
              class="sellerRemark"
            >
              <div
                v-if="dataForm.orderRefundAddr || (dataForm.returnMoneySts === 1 && isAgreeRefund === 2)"
                class="remark-title"
              >
                {{ $t("constant.deliveryAddr") }}：
              </div>
              <div
                v-if="dataForm.returnMoneySts === 1 && isAgreeRefund === 2"
                class="remark-content"
              >
                <el-select
                  v-model="dataForm.shopRefundAddrId"
                  style="width: 350px"
                  :placeholder="$t('tip.select')"
                >
                  <el-option
                    v-for="item in addrList"
                    :key="item.shopRefundAddrId"
                    :label="
                      item.consignee+'，'+item.mobile+'，'+item.province + item.city + item.area + item.addr
                    "
                    :value="item.shopRefundAddrId"
                  />
                </el-select>
                <!--新建/刷新-->
                <el-button
                  type="primary"
                  link
                  style="margin-left:5px"
                  @click="refreshChange"
                >
                  {{ $t('admin.refresh') }}
                </el-button>
                <el-divider direction="vertical" />
                <el-button
                  type="primary"
                  link
                  @click.stop="onAddOrUpdate()"
                >
                  {{ $t('admin.newConstruction') }}
                </el-button>
              </div>
              <div
                v-if="dataForm.orderRefundAddr"
                class="remark-content"
              >
                {{ dataForm.orderRefundAddr.consigneeName+'，'+dataForm.orderRefundAddr.consigneeMobile+'，'+dataForm.orderRefundAddr.consigneeAddr }}
              </div>
            </div>

            <div
              v-if="dataForm.deliveryTime &&
                !dataForm.cancelTime &&
                !dataForm.rejectTime &&
                dataForm.supplierHandleStatus === -1"
              class="sellerRemark"
            >
              <div class="remark-title">
                {{ $t("order.order.returnStatus") }}：
              </div>
              <div class="remark-content">
                <el-radio-group
                  v-model="isReceived"
                  :disabled="dataForm.returnMoneySts !== 3"
                >
                  <el-radio :label="1">
                    {{ $t("order.order.received") }}
                  </el-radio>
                  <el-radio :label="0">
                    {{ $t("order.order.unreceived") }}
                  </el-radio>
                </el-radio-group>
              </div>
            </div>
            <!-- 退货申请应该只有在买家发货时展示 -->
            <div
              v-if="dataForm.returnMoneySts === 3 && dataForm.supplierHandleStatus === -1"
              class="sellerRemark"
            >
              <div class="remark-title">
                {{ $t("order.order.returnRequest") }}：
              </div>
              <div class="remark-content">
                <el-radio-group
                  v-model="isAgreeRefund"
                  :disabled="dataForm.returnMoneySts !== 3"
                >
                  <el-radio :label="2">
                    {{ $t("order.order.agreeToRefundA") }}
                  </el-radio>
                  <el-radio :label="3">
                    {{ $t("order.order.refusalToRefund") }}
                  </el-radio>
                </el-radio-group>
              </div>
            </div>

            <div
              v-if="isAgreeRefund === 3"
              class="sellerRemark"
            >
              <div class="input-bar denial-reason">
                <div>
                  <div class="remark-title denial">
                    {{ $t("order.order.denialReason") }}：
                  </div>
                  <el-input
                    v-model="dataForm.rejectMessage"
                    type="textarea"
                    style="width: 100%;outline-style: none;"
                    :rows="6"
                    maxlength="250"
                    show-word-limit
                  />
                </div>
                <div class="right">
                  <div class="remark-title denial">
                    上传凭证：
                  </div>
                  <uploadProof
                    ref="uploadProofRef"
                    v-model="dataForm.voucherImgs"
                    :limit="3"
                  />
                </div>
              </div>
            </div>
            <div
              v-if="!(dataForm.returnMoneySts !== 1 || (dataForm.supplierId && dataForm.supplierHandleStatus !== -1))"
              class="sellerRemark"
            >
              <div
                class="input-bar"
              >
                <div class="remark-title">
                  {{ $t('order.order.merchantNotes') }}：
                </div>
                <el-input
                  v-model="dataForm.sellerMsg"
                  type="textarea"
                  style="width: 100%;outline-style: none;"
                  :rows="4"
                  maxlength="250"
                  show-word-limit
                />
              </div>
            </div>

            <div
              v-if="dataForm.supplierHandleStatus < 0"
              class="btn-bar"
            >
              <!-- 仅退款的时候进行的处理操作 -->
              <el-button
                v-if="dataForm.returnMoneySts === 1"
                type="primary"
                @click="checkHandel()"
              >
                {{ $t("order.order.confirmTreatment") }}
              </el-button>
              <!-- 退货退款的时候进行的处理操作 -->
              <el-button
                v-if="dataForm.returnMoneySts === 3"
                type="primary"
                @click="returnMoneyHandle()"
              >
                {{ $t("order.order.confirmTreatment") }}
              </el-button>
            </div>
            <div
              v-if="dataForm.supplierHandleStatus >= 0 && dataForm.returnMoneySts !== -1"
              class="btn-bar"
            >
              <span>{{ $t("order.order.supplierProcessing") }}：</span>
              <span>{{ dataForm.supplierHandleStatus === 0 ? $t("order.order.supplierPending") : dataForm.supplierHandleStatus === 1 ? $t("order.order.supplierAgree") : $t("order.order.supplierRejection") }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getRefundAddrList"
    />
    <!-- 通联支付获取验证码弹窗 -->
    <allinpay-verification
      v-if="getCodeVisible"
      ref="purchasRef"
      :mobile="allinpayMobile"
      :countdown="countdown"
      @get-code="getCode"
      @pay-confirm="payConfirm"
    />
    <!-- 绑定手机号 -->
    <mobile-add-or-update
      v-if="mobileDialogVisible"
      ref="mobileAddOrUpdateRef"
      :is-have-mobile="false"
      @refresh-data-form="queryCompany"
    />
    <add-proof
      v-if="addProofVisible"
      ref="addProofRef"
      :refund-detail="dataForm"
      @refresh-data="getRefundOrderInfo"
    />
  </div>
</template>

<script setup>
import Big from 'big.js'
import * as api from '@/api/order/order-refund'
import * as shopRefundAddrApi from '@/api/multishop/shop-refund-addr'
import { getIsUploadInvoice } from '@/api/order/order-invoice'
import { getAllinpayCompanyInfo } from '@/api/multishop/shop-process'
import { payConfirmBySmsBack, resendPayCode } from '@/api/pay/pay'
import { formatPrice } from '@/utils/index.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import AddOrUpdate from '@/views/modules/shop/refund-addr/components/add-or-update.vue'
import AllinpayVerification from '@/components/allinpay-verification/index.vue'
import MobileAddOrUpdate from '@/views/modules/shop/setting/components/mobile-add-or-update/index.vue'
import refundRecord from './conponents/refund-record/index.vue'
import addProof from './conponents/add-proof/index.vue'
import refundSteps from './conponents/refund-steps/index.vue'
import uploadProof from './conponents/upload-proof/index.vue'

const dataForm = ref({})
const isAgreeRefund = ref(2)
const isProcessing = ref(false) // 是否正在处理订单
const isReceived = ref(0)
const isUploadInvoice = ref(false)
const prodLength = ref(false) // 是否为单个赠品
const supplierHandleStatus = ref(-1) // 供应商处理状态， -1.商家自行处理 0.供应商处理 1.供应商已同意 2.供应商已拒绝
const addrList = reactive([])
const uploadProofRef = ref(null) // 上传凭证组件

const orderRefundAddrPhotos = reactive([])

const allinpayStore = useAllinpayStore()
const allinpayMobile = ref('') // 验证用手机号（通联支付）
const bizOrderNo = ref('') // 采购订单号（通联支付）
const countdown = ref(0) // 倒计时
const getCodeVisible = ref(true) // 采购弹窗(通联支付)
const paySettlementType = ref(allinpayStore.paySettlementType) // 是否开启通联支付 1：开启 0：关闭
const timer = ref('') // 倒计时定时器

watch(isAgreeRefund, (nv) => {
  supplierHandleStatus.value = nv === 4 ? 0 : -1
})

const route = useRoute()
onMounted(() => {
  if (paySettlementType.value === 1) {
    bizOrderNo.value = ''
    // 获取通联支付绑定的手机号
    queryCompany()
  }
  if (route.query.refundId) {
    dataForm.value.refundId = route.query.refundId
    getRefundOrderInfo()
  }
})

onBeforeUnmount(() => {
  clearTimeout(intervenEndTimer)
})

// 获取退款订单信息
const imgList = ref([])
// 平台介入状态 -1.没有介入 1.用户申请介入 2.平台同意介入 3.平台拒绝介入 5.平台同意退款成功 6.用户撤销
const platInterveneSts = ref(0)
const getRefundOrderInfo = () => {
  if (dataForm.value.refundId) {
    api.info(dataForm.value.refundId).then((data) => {
      dataForm.value = data
      // 处理商品列表
      const prods = data.orderItems
      if (prods && prods.length === 1 && prods[0].giveawayList && prods[0].giveawayList.length) {
        // 单个商品且有赠品时，将主商品和赠品放在同一级列表中展示
        prods[0].giveawayList.forEach(item => {
          item.giveawayOrderItemId = item.orderItemId
        })
        dataForm.value.orderItems = prods.concat(prods[0].giveawayList)
        prodLength.value = true
      }
      getIsUploadInvoice(data.orderId).then((res) => {
        isUploadInvoice.value = res
      })
      if (dataForm.value.imgUrls !== '') {
        imgList.value = dataForm.value.imgUrls.split(',')
      }
      if (dataForm.value.isReceived) {
        isReceived.value = 1
      } else {
        isReceived.value = 0
      }
      if (dataForm.value.orderRefundAddr && dataForm.value.orderRefundAddr.imgs) {
        const imgUrls = dataForm.value.orderRefundAddr.imgs.split(',')
        handleArr(orderRefundAddrPhotos, handleImgUrl(imgUrls))
      }
      // 申请类型:1,仅退款,2退款退货
      if (data.applyType === 2 && !data.handelTime) {
        getRefundAddrList()
      }
      isAgreeRefund.value = data.returnMoneySts === 1 && data.supplierId && data.waitPurchase !== 1 ? 4 : data.supplierHandleStatus !== -1 && data.supplierId && data.waitPurchase !== 1 ? 4 : 2
      supplierHandleStatus.value = data.supplierHandleStatus
      platInterveneSts.value = data.platformInterventionStatus
      if (data.interventionEndTime && platInterveneSts.value === 1) {
        intervenEndTimeCountdown()
      }
    })
  }
}

const addProofRef = ref(null)
const addProofVisible = ref(false)
const onAddProof = () => {
  addProofVisible.value = true
  nextTick(() => {
    addProofRef.value.init()
  })
}

// 平台介入时间添加凭证倒计时
let intervenEndTimer = null
const stillAveTime = ref(false)
const intervenEndTimeCountdown = () => {
  const nowTime = new Date().getTime() // 当前时间
  const endTime = new Date(dataForm.value.interventionEndTime).getTime() // 设置截止时间
  const leftTime = endTime - nowTime // 时间差

  if (leftTime >= 0) {
    stillAveTime.value = true
    // 递归每秒调用countTime方法，显示动态时间效果,
    intervenEndTimer = setTimeout(intervenEndTimeCountdown, 1000)
  } else {
    stillAveTime.value = false
    intervenEndTimer && clearTimeout(intervenEndTimer)
  }
}

const handleImgUrl = (imgUrls) => {
  const imgs = []
  imgUrls.forEach((img) => {
    imgs.push(checkFileUrl(img))
  })
  return imgs
}

/**
 * 加载收货地址模板
 */
const getRefundAddrList = () => {
  shopRefundAddrApi.list().then((data) => {
    handleArr(addrList, data)
    data.forEach(el => {
      if (el.isDefault === 1) {
        // 设置选中默认地址
        dataForm.value.shopRefundAddrId = el.shopRefundAddrId
      }
    })
  })
}

// 新增
const addOrUpdateVisible = ref(false)
const addOrUpdateRef = ref()
const onAddOrUpdate = (id) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(id, true)
  })
}

// 刷新
const refreshChange = () => {
  getRefundAddrList()
}

// 仅退款的时候，进行的退款处理操作
const checkHandel = () => {
  // 如果是代销商品订单且未进行采购, 不允许处理退款
  if (validNoEmptySpace(dataForm.value.sellerMsg) || validNoEmptySpace(dataForm.value.rejectMessage)) {
    ElMessage({
      message: '内容不能全为空格',
      type: 'error',
      duration: 1500,
      onClose: () => {}
    })
    return
  }
  if (isAgreeRefund.value === 2) {
    if (dataForm.value.returnMoneySts === 1 && !dataForm.value.shopRefundAddrId && dataForm.value.applyType === 2) {
      ElMessage({
        message: '请选择收货地址',
        type: 'error',
        duration: 1500,
        onClose: () => {}
      })
      return
    }
    if (isUploadInvoice.value) {
      ElMessageBox.confirm('该订单已上传发票，确认退款后请查看并处理已上传发票的内容。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        checkIsLastOrderItem(handelReturnMoney)
      })
      return
    }
    // 供应商发货订单退款-自行处理(同意)
    if (dataForm.value.supplierId && dataForm.value.waitPurchase !== 1) {
      ElMessageBox.confirm('将从商家的已结算金额扣除供应商该订单项的对应收入', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        checkIsLastOrderItem(handelReturnMoney, 'supplier')
      })
      return
    }
  }
  if (isAgreeRefund.value === 4) {
    if (isUploadInvoice.value) {
      ElMessageBox.confirm('该订单已上传发票，确认退款后请查看并处理已上传发票的内容。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ElMessageBox.confirm('移交后该订单后若售后成功，退款将由供应商和商家共同承担。确定移交供应商处理吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          handelReturnMoney()
        })
      })
      return
    }
    ElMessageBox.confirm('移交后该订单后若售后成功，退款将由供应商和商家共同承担。确定移交供应商处理吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      handelReturnMoney()
    })
    return
  }
  isAgreeRefund.value === 2 ? checkIsLastOrderItem(handelReturnMoney) : handelReturnMoney()
}

// 是否为最后一个退款项
const checkIsLastOrderItem = (fn, type) => {
  api.checkIsLastOrderItem(dataForm.value.refundId).then((data) => {
    if (data && dataForm.value.freightAmount) {
      const calcVal = new Big(dataForm.value.freightAmount).minus(dataForm.value.platformFreeFreightAmount).valueOf()
      if (formatPrice(calcVal, 1).toFixed(2) + '' !== '0.00') {
        ElMessageBox.confirm($t('order.order.lastProdRefundTip').replace('[d]', formatPrice(calcVal, 1).toFixed(2) + ' '), $t('table.tips'), {
          confirmButtonText: $t('table.confirm'),
          cancelButtonText: $t('table.cancel'),
          type: 'warning'
        }).then(() => {
          fn(type)
        }).catch(() => {
        })
      } else {
        fn(type)
      }
    } else {
      fn(type)
    }
  })
}

const mobileDialogVisible = ref(false)
const mobileAddOrUpdateRef = ref()
const purchasRef = ref()
const handelReturnMoney = async (type) => {
  const tempshopRefundAddrId = isAgreeRefund.value === 2 ? dataForm.value.shopRefundAddrId : undefined
  if (isProcessing.value) {
    return
  }
  if (isAgreeRefund.value === 3) {
    if (dataForm.value.rejectMessage == null || dataForm.value.rejectMessage === '') {
      ElMessage.error('拒绝原因不能为空')
      return
    }
    if (!dataForm.value.voucherImgs) {
      ElMessage({
        message: '请上传凭证',
        type: 'error',
        duration: 1500
      })
      return
    }
  }
  if (type === 'supplier' && paySettlementType.value === 1) {
    // 通过供应商发货订单退款-自行处理(同意)后，需要通过验证码验证支付
    // 需要先判断是否绑定手机号，未绑定手机号则需要先绑定手机号
    if (!allinpayMobile.value) {
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
    getCodeVisible.value = true
    purchasRef.value?.init({
      refundId: dataForm.value.refundId,
      refundSts: isAgreeRefund.value,
      rejectMessage: dataForm.value.rejectMessage,
      sellerMsg: dataForm.value.sellerMsg,
      shopRefundAddrId: tempshopRefundAddrId,
      supplierHandleStatus: supplierHandleStatus.value
    })
    return
  }
  isProcessing.value = true
  isAgreeRefund.value !== 3 && (dataForm.value.voucherImgs = '')
  if (isAgreeRefund.value === 3) {
    const saveFileRes = await uploadProofRef.value.saveAttachFileToPlat()
    if (!saveFileRes) {
      // eslint-disable-next-line require-atomic-updates
      isProcessing.value = false
      return
    }
  }
  api.returnAndRefundAudit({
    refundId: dataForm.value.refundId,
    refundSts: isAgreeRefund.value,
    rejectMessage: dataForm.value.rejectMessage,
    sellerMsg: dataForm.value.sellerMsg,
    shopRefundAddrId: tempshopRefundAddrId,
    supplierHandleStatus: supplierHandleStatus.value,
    imgUrls: dataForm.value.voucherImgs // 凭证
  }).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => {
        onGoBack()
      }
    })
  }).catch(() => {
    isProcessing.value = false
  })
}

// 确定退款
const returnMoneyHandle = async () => {
  if (isProcessing.value) {
    return
  }
  if (validNoEmptySpace(dataForm.value.sellerMsg) || validNoEmptySpace(dataForm.value.rejectMessage)) {
    ElMessage({
      message: '内容不能全为空格',
      type: 'error',
      duration: 1500,
      onClose: () => {}
    })
    return
  }
  if (isAgreeRefund.value === 3) {
    if (dataForm.value.rejectMessage == null || dataForm.value.rejectMessage === '') {
      ElMessage.error('拒绝原因不能为空')
      return
    }
    if (!dataForm.value.voucherImgs) {
      ElMessage({
        message: '请上传凭证',
        type: 'error',
        duration: 1500
      })
      return
    }
  }
  isProcessing.value = true
  isAgreeRefund.value !== 3 && (dataForm.value.voucherImgs = '')
  if (isAgreeRefund.value === 3) {
    const saveFileRes = await uploadProofRef.value.saveAttachFileToPlat()
    if (!saveFileRes) {
      // eslint-disable-next-line require-atomic-updates
      isProcessing.value = false
      return
    }
  }
  api.returnMoney({
    refundId: dataForm.value.refundId,
    refundSts: isAgreeRefund.value,
    rejectMessage: dataForm.value.rejectMessage,
    sellerMsg: dataForm.value.sellerMsg,
    isReceived: isReceived.value,
    supplierHandleStatus: dataForm.value.supplierHandleStatus,
    imgUrls: dataForm.value.voucherImgs // 凭证
  }).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => {
        onGoBack()
      }
    })
  }).catch(() => {
    isProcessing.value = false
  })
}

// 精度运算-乘法
const bigspuTotalAmount = (a, b) => {
  return new Big(a).times(b).div(100).toFixed(2)
}

// 精度运算-除法
const bigActualTotal = (a, b) => {
  if (a == null) {
    return ''
  }
  return new Big(a).div(b).times(dataForm.value.refundCount).div(100).toFixed(2)
}

// 获取企业信息（通联支付）
const queryCompany = () => {
  getAllinpayCompanyInfo().then(data => {
    allinpayMobile.value = data.phone
  })
}

// 通联支付获取验证码
const getCode = async (params, verifyResult) => {
  if (bizOrderNo.value) {
    // 存在订单号，说明是重新获取验证码
    resendPayCode({
      bizOrderNo,
      captchaVerification: verifyResult.captchaVerification
    }).then(() => {
      countdown.value = 60
      getCountdown()
    })
    return
  }
  isAgreeRefund.value !== 3 && (dataForm.value.voucherImgs = '')
  if (isAgreeRefund.value === 3) {
    const saveFileRes = await uploadProofRef.value.saveAttachFileToPlat()
    if (!saveFileRes) {
      // eslint-disable-next-line require-atomic-updates
      isProcessing.value = false
      return
    }
  }
  api.returnAndRefundAudit({
    refundId: params.refundId,
    refundSts: params.refundSts,
    rejectMessage: params.rejectMessage,
    sellerMsg: params.sellerMsg,
    shopRefundAddrId: params.shopRefundAddrId,
    supplierHandleStatus: params.supplierHandleStatus,
    imgUrls: dataForm.value.voucherImgs, // 凭证
    captchaVerification: verifyResult.captchaVerification
  }).then((res) => {
    bizOrderNo.value = res.bizOrderNo
    countdown.value = 60
    getCountdown()
  })
}

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
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 1500,
        onClose: () => {
          setTimeout(() => {
            bizOrderNo.value = ''
            getCodeVisible.value = false
            isProcessing.value = false
            onGoBack()
          }, 1500)
        }
      })
    }
  })
}

const getUnitPrice = (value, count) => {
  if (!value) {
    return 0.00
  }
  return new Big(formatPrice(value, 1)).div(count).toFixed(2)
}

const router = useRouter()
const onGoBack = () => {
  router.replace('/order/order-manage/refund-order')
}
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
