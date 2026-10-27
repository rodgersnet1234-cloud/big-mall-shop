<template>
  <div class="component-basic-info-show">
    <!-- 店铺审核状态 -->
    <div class="audit-status">
      <!-- status 0 未审核 1已通过 -1未通过 2平台下线 3 平台下线待审核 -->
      <!-- shopStatus 店铺状态(-1:已删除 0: 停业中 1:营业中 2:平台下线 3:待审核 4:店铺申请中 5.审核失败) -->
      <div
        v-if="shopAuditStatus"
        class="audit-item"
      >
        <span class="week">审核状态：</span>
        <span v-if="shopAuditStatus.status === -1">未通过</span>
        <span v-if="shopAuditStatus.status === 0">未审核</span>
        <span v-if="shopAuditStatus.status === 1">已通过</span>
        <span v-if="shopAuditStatus.status === 2">平台下线</span>
      </div>
      <div
        v-if="shopDetail"
        class="audit-item"
      >
        <span class="week">帐号状态：</span>
        <span v-if="shopDetail.accountStatus === 0">禁用</span>
        <span v-if="shopDetail.accountStatus === 1">启用</span>
        <span v-if="shopDetail.accountStatus === -1">删除</span>
      </div>
      <div
        v-if="shopDetail"
        class="audit-item"
      >
        <span class="week">店铺状态：</span>
        <span v-if="shopDetail.shopStatus === -1">已删除</span>
        <span v-if="shopDetail.shopStatus === 0">停业中</span>
        <span v-if="shopDetail.shopStatus === 1">营业中</span>
        <span v-if="shopDetail.shopStatus === 2">平台下线</span>
        <span v-if="shopDetail.shopStatus === 3">开店待审核</span>
        <span v-if="shopDetail.shopStatus === 4">开店申请中</span>
        <span v-if="shopDetail.shopStatus === 5">上线待审核</span>
        <span v-if="shopDetail.shopStatus === 6">上线审核失败</span>
        <span v-if="shopDetail.shopStatus === 7">系统下线</span>
      </div>
      <el-button
        v-if="shopDetail.shopStatus === 2 && paySettlementType !== 1"
        v-permission="['shop:shopDetail:applyOnline']"
        type="primary"
        @click="offlineManageHandle"
      >
        申请上线
      </el-button>
    </div>
    <div class="business-info-mod">
      <!-- native modifier has been removed, please confirm whether the function has been affected  -->
      <el-form
        ref="formDataRef"
        v-loading="pageLoading"
        label-width="140px"
        :model="formData"
        @submit.prevent
      >
        <div class="ci-wrapper">
          <div class="right-wrap">
            <el-form-item
              label="店铺logo："
              required
            >
              <div class="business-license-box">
                <div class="logo-image-box">
                  <el-image
                    v-if="formData.shopLogo"
                    class="logo-image"
                    fit="contain"
                    :src="checkFileUrl(formData.shopLogo)"
                    :preview-src-list="[checkFileUrl(formData.shopLogo)]"
                  >
                    <template #error>
                      <img
                        class="img-slot"
                        src="@/assets/images/def.png"
                        alt
                      >
                    </template>
                  </el-image>
                </div>
              </div>
            </el-form-item>
            <el-form-item
              label="店铺背景图："
              required
            >
              <div class="business-license-box">
                <div class="logo-image-box">
                  <el-image
                    v-if="formData.mobileBackgroundPic"
                    class="logo-image"
                    fit="contain"
                    :src="checkFileUrl(formData.mobileBackgroundPic)"
                    :preview-src-list="[checkFileUrl(formData.mobileBackgroundPic)]"
                  >
                    <template #error>
                      <img
                        class="img-slot"
                        src="@/assets/images/def.png"
                        alt
                      >
                    </template>
                  </el-image>
                </div>
                <div class="logo-image-box">
                  <el-image
                    v-if="formData.pcBackgroundPic"
                    class="logo-image"
                    fit="contain"
                    :src="checkFileUrl(formData.pcBackgroundPic)"
                    :preview-src-list="[checkFileUrl(formData.pcBackgroundPic)]"
                  >
                    <template #error>
                      <img
                        class="img-slot"
                        src="@/assets/images/def.png"
                        alt
                      >
                    </template>
                  </el-image>
                </div>
              </div>
            </el-form-item>
          </div>
          <div class="left-wrap">
            <el-form-item
              label="商家名称："
              required
            >
              {{ formData.merchantName }}
            </el-form-item>
            <el-form-item
              label="店铺名称："
              required
            >
              {{ formData.shopName }}
            </el-form-item>
            <el-form-item
              label="联系人："
              required
            >
              {{ formData.contactName }}
            </el-form-item>
            <el-form-item
              label="联系方式："
              required
            >
              {{ formData.contactPhone }}
            </el-form-item>
            <el-form-item label="店铺简介：">
              <span
                v-if="formData.intro"
                class="intro"
              > {{ formData.intro }} </span>
              <span
                v-else
                class="noyet-wrap"
              >暂无</span>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>

    <div class="footer">
      <div class="foot-box">
        <el-button
          type="primary"
          @click="modifyBasicInfor"
        >
          修改
        </el-button>
      </div>
    </div>
    <!-- 下架管理 -->
    <offline-manage
      v-if="offlineManageVisible"
      ref="offlineDataRef"
      @on-re-apply-data-submit="reReapplyDataSubmit"
    />
  </div>
</template>

<script setup>
import * as api from '@/api/multishop/shop-process.js'
import * as eventApi from '@/api/multishop/shop-event.js'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['closeBrowse', 'changeCompanyInfoProcessStatus'])

const pageLoading = ref(false)
const shopAuditStatus = ref({})
const offlineManageVisible = ref(false)
const shopDetail = ref({})

const allinpayStore = useAllinpayStore()
const paySettlementType = allinpayStore.paySettlementType // 是否开启通联支付 1：开启 0：关闭

const formData = ref({}) // 基本信息
onBeforeUnmount(() => {
  // 防止修改信息后，数据更新赶不上视图的渲染
  formData.value = {}
})

onMounted(() => {
  queryShopAuditStatus()
  queryShopBasicInfo()
})

// 修改
const modifyBasicInfor = () => {
  emit('closeBrowse')
}
/**
 * 查询基本信息
 */
const queryShopBasicInfo = () => {
  pageLoading.value = true
  api.getBasicInfo().then(data => {
    if (data.type) data.type = data.type.toString()
    Object.assign(formData.value, data)
    if (paySettlementType === 1) {
      emit('changeCompanyInfoProcessStatus', data.companyInfoProcessStatus)
      allinpayStore.SET_ID_CARD_COLLECT_PROCESS_STATUS(data.idCardCollectProcessStatus)
      allinpayStore.SET_SHOP_STATUS(data.shopStatus)
    }
  }).finally(() => {
    pageLoading.value = false
  })
}

/**
 * 店铺审核状态
 */
const queryShopAuditStatus = () => {
  api.getAuditingInfo().then(data => {
    Object.assign(shopAuditStatus.value, data)
    Object.assign(shopDetail.value, data.shopDetail)
  })
}

/**
 * 提交上线申请
 */
let isSubmit = false
const reReapplyDataSubmit = (data) => {
  const param = {
    eventId: data.eventId,
    reapplyReason: data.reapplyReason // 申请理由
  }
  if (isSubmit) {
    return
  }
  isSubmit = true
  eventApi.auditApply(param).then(() => {
    offlineManageVisible.value = false
    ElMessage({
      message: '提交成功',
      type: 'success',
      duration: 1000,
      onClose: () => queryShopAuditStatus()
    })
    isSubmit = false
  }).catch(() => {
    isSubmit = false
  })
}

/**
 * 店铺违规下线操作
 */
const offlineManageHandle = () => {
  offlineManageVisible.value = true
  getOfflineDetailInfo()
}

/**
 * 获取最新的店铺违规下线事件信息
 */
const offlineDataRef = ref(null)
const offlineDetail = ref(null)
const getOfflineDetailInfo = () => {
  eventApi.getOfflineHandleEvent().then(data => {
    offlineDetail.value = data
    nextTick(() => {
      offlineDataRef.value?.init(data)
    })
  })
}

</script>

<style lang="scss" scoped>
@use "index";
</style>
