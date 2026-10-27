<template>
  <div class="component-business-information-show">
    <div class="business-info-mod">
      <!-- native modifier has been removed, please confirm whether the function has been affected  -->
      <el-form
        ref="formDataRef"
        label-width="140px"
        :model="formData"
        @submit.prevent
      >
        <div class="ci-wrapper">
          <div class="left-wrap">
            <el-form-item label="统一社会信用代码：">
              <span v-if="formData.creditCode">{{ formData.creditCode }}</span>
              <span
                v-else
                class="noyet-wrap"
              >暂无</span>
            </el-form-item>
            <el-form-item
              label="企业名称："
              required
            >
              {{ formData.firmName }}
            </el-form-item>
            <el-form-item label="住所：">
              <span v-if="formData.residence"> {{ formData.residence }} </span>
              <span
                v-else
                class="noyet-wrap"
              >暂无</span>
            </el-form-item>
            <el-form-item
              v-if="paySettlementType === 0"
              label="法定代表人："
              required
            >
              {{ formData.representative }}
            </el-form-item>
            <el-form-item label="注册资本：">
              <span v-if="formData.capital"> {{ formData.capital }} </span>
              <span
                v-else
                class="noyet-wrap"
              >暂无</span>
            </el-form-item>
            <el-form-item label="成立日期：">
              <span v-if="formData.foundTime"> {{ formData.foundTime }} </span>
              <span
                v-else
                class="noyet-wrap"
              >暂无</span>
            </el-form-item>
            <el-form-item
              label="营业期限："
            >
              <span v-if="formData.startTime && formData.endTime">
                {{ formData.startTime.slice(0, 10) + ' - ' + formData.endTime.slice(0, 10) }}
              </span>
              <span v-else-if="formData.startTime">
                {{ formData.startTime.slice(0, 10) + ' - ' + '无固定期限' }}
              </span>
              <span
                v-else
                class="noyet-wrap"
              >
                暂无
              </span>
            </el-form-item>
            <el-form-item
              label="经营范围："
              required
            >
              <span class="business-scope">{{ formData.businessScope }}</span>
            </el-form-item>
            <template v-if="paySettlementType === 1">
              <el-form-item
                label="法定代表人："
                required
              >
                {{ formData.representative }}
              </el-form-item>
              <el-form-item
                label="法人身份证："
                required
              >
                {{ formData.legalIds }}
              </el-form-item>
              <el-form-item
                label="法人手机号："
                required
              >
                {{ formData.legalPhone }}
              </el-form-item>
            </template>
          </div>

          <div class="right-wrap">
            <el-form-item
              label="营业执照电子版："
              required
            >
              <div class="logo-image-box">
                <el-image
                  v-if="formData.businessLicense"
                  class="logo-image"
                  fit="contain"
                  :src="checkFileUrl(formData.businessLicense)"
                  :preview-src-list="[checkFileUrl(formData.businessLicense)]"
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
            </el-form-item>
            <el-form-item
              label="法人身份证："
              required
            >
              <div class="business-license-box">
                <div class="logo-image-box">
                  <el-image
                    v-if="formData.identityCardFront"
                    class="logo-image"
                    fit="contain"
                    :src="checkFileUrl(formData.identityCardFront)"
                    :preview-src-list="[checkFileUrl(formData.identityCardFront)]"
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
                    v-if="formData.identityCardLater"
                    class="logo-image"
                    fit="contain"
                    :src="checkFileUrl(formData.identityCardLater)"
                    :preview-src-list="[checkFileUrl(formData.identityCardLater)]"
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
              v-if="paySettlementType === 1 && idCardCollectProcessStatus !== 4 && (shopStatus === 3 || shopStatus === 5)"
            >
              <span
                v-permission="['shop:idCardStatus:update']"
                class="update-btn"
                @click="dataUpdate"
              >
                <el-icon><RefreshRight /></el-icon>
                <span>{{ formData.updateTime }}数据更新</span>
              </span>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <div class="footer">
      <div class="foot-box">
        <!-- newStatus: 审核状态：1已通过 0待审核 -1未通过 -->
        <el-button
          v-if="formData.newStatus !== 0 && (paySettlementType !== 1 || paySettlementType === 1 && (formData.newStatus !== 0 || companyInfoProcessStatus === 3) && companyInfoProcessStatus !== 1)"
          type="primary"
          @click="modifyBasicInfor"
        >
          修改
        </el-button>
        <el-button
          v-if="formData.edit"
          v-permission="['shop:view:companyAuditInfo']"
          type="primary"
          @click="modifyLog"
        >
          查看修改信息
        </el-button>
      </div>
    </div>

    <viewModifyBusiness
      v-if="isModifyLog"
      ref="viewModifysRef"
      @close-log="closeModifyLog"
    />
    <businessInfoReupload
      v-if="reuploadVisible"
      ref="businessInfoReuploadRef"
      :shop-company-id="formData.shopCompanyId"
      :shop-id="formData.shopId"
    />
  </div>
</template>

<script setup>
import { Debounce } from '@/utils/debounce'
import * as api from '@/api/multishop/shop-process'
import viewModifyBusiness from '../view-modify-business/index.vue'
import businessInfoReupload from '../business-info-reupload/index.vue'
const emit = defineEmits(['closeBrowse'])

defineProps({
  // 企业信息审核状态 0.未提交 1.待审核 2.审核成功 3.审核失败
  companyInfoProcessStatus: {
    type: Number,
    default: 0
  }
})

const isModifyLog = ref(false) // 查看工商信息修改记录
const formData = ref({})

const allinpayStore = useAllinpayStore()
const paySettlementType = ref(allinpayStore.paySettlementType) // 是否开启通联支付 1：开启 0：关闭
const reuploadVisible = ref(false) // 重新上传弹窗

const shopStatus = computed(() => {
  return allinpayStore.shopStatus // 店铺状态 -1:已删除 0: 停业中 1:营业中 2:平台下线 3:待审核 4:店铺申请中 5:申请失败 6:上线申请中 7：系统下线
})

const idCardCollectProcessStatus = computed(() => {
  return allinpayStore.idCardCollectProcessStatus
})

onMounted(() => {
  queryShopBusinessInfo()
})

// 修改
const modifyBasicInfor = () => {
  formData.value = {}
  emit('closeBrowse')
}
const viewModifysRef = ref(null)
const modifyLog = () => {
  if (!isModifyLog.value) isModifyLog.value = true
  nextTick(() => {
    viewModifysRef.value.init()
  })
}
const closeModifyLog = () => {
  isModifyLog.value = false
  nextTick(() => {
    queryShopBusinessInfo()
  })
}
/**
 * 查询工商信息
 */
const queryShopBusinessInfo = () => {
  api.getCompanyInfo().then(data => {
    Object.assign(formData.value, data)
  })
}

// 数据更新
const businessInfoReuploadRef = ref(null)
const dataUpdate = Debounce(() => {
  api.updateIdCardStatus({ shopId: formData.value.shopId }).then(data => {
    data = Number(data)
    if (data === 4) {
      // 审核成功就刷新页面
      location.reload()
    } else if (data === 0 || data === 2 || data === 3) {
      // 审核失败，弹窗让用户重新上传
      reuploadVisible.value = true
      nextTick(() => {
        businessInfoReuploadRef.value?.init(data)
      })
      queryShopBusinessInfo()
    } else if (data === 1) {
      // 待审核则更新工商信息
      queryShopBusinessInfo()
    }
  })
}, 1500)

</script>

<style lang="scss" scoped>
@use "index";
</style>
