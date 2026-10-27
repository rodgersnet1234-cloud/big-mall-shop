<template>
  <div class="page-customer-add-or-update">
    <el-dialog
      v-model="visible"
      :title="!dataForm.userId ? $t('table.add') : $t('table.edit')"
      :close-on-click-modal="false"
      class="user-update-dialog"
      width="70%"
    >
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        :rules="dataRule"
        @submit.prevent
      >
        <el-divider content-position="left">
          <h3>{{ $t("customer.customerManager.userInformation") }}</h3>
        </el-divider>
        <el-container
          height="160px"
          style="margin-top:20px"
        >
          <el-aside
            width="230px"
            style="background-color: rgb(255, 255, 255)"
          >
            <el-row>
              <el-col :span="10">
                <div style="font-size: 14px;color:#606266;line-height:1">
                  用户头像：
                </div>
              </el-col>
              <el-col :span="14">
                <div>
                  <img
                    v-if="!dataForm.pic"
                    src="@/assets/images/user_img.jpg"
                    width="130"
                    height="130"
                  >
                  <img
                    v-else
                    :src="checkFileUrl(dataForm.pic)"
                    class="image"
                    width="130"
                    height="130"
                    @error="dataForm.pic=''"
                  >
                </div>
              </el-col>
            </el-row>
          </el-aside>
          <el-container>
            <el-main class="el-main-top">
              <el-row class="user-info">
                <div class="user-info-item">
                  <div class="title">
                    {{ $t('customer.customerManager.nickName') + '：' }}
                  </div>
                  <div
                    class="text"
                  >
                    {{ dataForm.nickName }}
                  </div>
                </div>
                <div class="user-info-item">
                  <div class="title">
                    {{ $t('table.status') + '：' }}
                  </div>
                  <div>
                    <div
                      v-if="dataForm.status === 0"
                      class="text"
                    >
                      {{ $t("table.disable") }}
                    </div>
                    <div
                      v-if="dataForm.status === 1"
                      class="text"
                    >
                      {{ $t("customer.customerManager.normal") }}
                    </div>
                  </div>
                </div>
              </el-row>
            </el-main>
            <el-footer>
              <el-row class="user-info">
                <!-- 发放优惠券 -->
                <div class="user-info-item">
                  <el-button
                    v-permission="['customer:customer:sendCoupons']"
                    type="primary"
                    @click="onUpdateCoupon()"
                  >
                    {{ $t("customer.customerManager.sendCoupons") }}
                  </el-button>
                </div>
              </el-row>
            </el-footer>
          </el-container>
        </el-container>
        <el-container>
          <el-main>
            <!-- 优惠券 -->
            <div>
              <h4>
                {{ $t("customer.customerManager.coupons") }}
                <el-popover
                  placement="top"
                  width="200"
                  trigger="hover"
                  :content="$t('customer.customerManager.couponTip3')"
                >
                  <template #reference>
                    <el-icon><QuestionFilled /></el-icon>
                  </template>
                </el-popover>
              </h4>
              <div>
                <span>{{ $t("customer.customerManager.notUsed") }}：{{ couponUserParam.couponUsableNums }}</span>
                <span style="margin-left: 60px">{{ $t("customer.customerManager.used") }}：{{ couponUserParam.couponUsedNums }}</span>
                <span style="margin-left: 60px">{{ $t("customer.customerManager.invalid") }}：{{ couponUserParam.couponExpiredNums }}</span>
              </div>
            </div>
            <!-- /优惠券 -->
          </el-main>
        </el-container>
        <el-divider content-position="left">
          <h3>{{ $t("customer.customerManager.otherInfo") }}</h3>
        </el-divider>
      </el-form>
      <div>
        <el-tabs>
          <!-- 交易明细 -->
          <el-tab-pane :label="$t('customer.customerManager.tradeDetails')">
            <trade-detail ref="tradeDetailRef" />
          </el-tab-pane>
          <!-- 优惠券明细 -->
          <el-tab-pane :label="$t('customer.customerManager.couponDetails')">
            <coupon-detail ref="couponDetailRef" />
          </el-tab-pane>
        </el-tabs>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            @click="visible = false"
          >
            {{ $t("table.cancel") }}
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 送优惠券弹窗 -->
    <update-coupon
      v-if="updateCouponVisible"
      ref="updateCouponRef"
      :get-way="1"
      @refresh-data-list="onRefresh"
    />
  </div>
</template>

<script setup>
import * as api from '@/api/customer/customer-manager'
import CouponDetail from './components/coupon-detail.vue'
import TradeDetail from './components/trade-detail.vue'
import UpdateCoupon from './components/user-coupon-update.vue'

const dataRule = {}

const couponUserParam = ref({
  couponUsableNums: 0,
  couponUsedNums: 0,
  couponExpiredNums: 0
})
const dataForm = ref({
  userId: 0,
  nickName: '',
  pic: '',
  status: 1
})
const userTag = reactive([])

const isSubmit = ref(false)
const visible = ref(false)
const init = (id) => {
  dataForm.value.userId = id || 0
  visible.value = true
  isSubmit.value = false
  nextTick(() => {
    if (dataForm.value.userId) {
      if (isSubmit.value) {
        return
      }
      isSubmit.value = true
      api.getUserInfo(
        dataForm.value.userId
      ).then(data => {
        dataForm.value = data
        couponUserParam.value = dataForm.value.couponUserCountDataVO
        handleArr(userTag, dataForm.value.userTagList)
        initTradeDetail(dataForm.value.userId)
        initCouponDetail(dataForm.value.userId)
      }).catch(() => {
        isSubmit.value = false
      })
    }
  })
}

// 修改后刷新
const onRefresh = () => {
  init(dataForm.value.userId)
}

// 送优惠券
const updateCouponRef = ref()
const updateCouponVisible = ref(false)
const onUpdateCoupon = (id) => {
  const ids = id ? [id] : [dataForm.value.userId]
  updateCouponVisible.value = true
  nextTick(() => {
    updateCouponRef.value?.init(ids)
  })
}

// 调用交易信息组件方法
const tradeDetailRef = ref()
const initTradeDetail = (id) => {
  tradeDetailRef.value?.init(id)
}

// 优惠券明细
const couponDetailRef = ref()
const initCouponDetail = (id) => {
  couponDetailRef.value?.init(id)
}

defineExpose({
  init
})
</script>

<style lang="scss" scoped>
.page-customer-add-or-update {
  .user-update-dialog {
    align-items: center;
  }
  .user-info {
    display: flex;
    justify-content: flex-start;
    .user-info-item {
      display: flex;
      justify-content: flex-start;
      margin-right: 30px;
      .title {
        max-width: 70px;
        white-space: nowrap;
      }
      .text {
        max-width: 200px;
        word-break: break-word;
      }
    }
  }
}
:deep(.el-main-top) {
  padding-top: 0;
}
:deep(.el-tag) {
  margin-right: 10px;
}
</style>
