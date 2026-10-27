<template>
  <el-dialog
    v-model="visible"
    title="工商信息变更申请"
    :append-to-body="true"
    :before-close="onBeforeCloseDialog"
    :close-on-click-modal="false"
    top="10vh"
    width="70%"
    class="component-view-modify-business"
  >
    <div class="popup">
      <!-- 审核状态 -->
      <div class="topModifyColumn">
        <div>
          <span>
            审核状态:
          </span>
          <span>
            {{ modifyStatus(auditStatus) }}
            <span v-if="auditStatus === -1">&nbsp;&nbsp;&nbsp;&nbsp;拒绝原因： {{ formData.remarks ? formData.remarks : '暂无' }}</span>
          </span>
        </div>
        <el-button
          v-if="auditStatus === 0 && paySettlementType!==1"
          v-permission="['shop:shopCompany:revoke']"
          type="primary"
          @click="withdrawalSubmission"
        >
          撤回修改申请
        </el-button>
      </div>
      <!-- 修改信息 -->
      <!-- native modifier has been removed, please confirm whether the function has been affected  -->
      <el-form
        ref="formDataRef"
        v-loading="pageLoading"
        label-width="140px"
        :model="formData"
        @submit.prevent
      >
        <div class="ci-wrapper">
          <div class="left-wrap">
            <el-form-item label="统一社会信用代码：">
              <span v-if="formData.creditCode ">{{ formData.creditCode }}</span>
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
              v-if="paySettlementType!==1"
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
            <template v-if="paySettlementType===1">
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
            <!-- <el-form-item v-show="auditStatus == -1" label="拒绝原因：" required>
              <span v-if="formData.remarks"> {{ formData.remarks }} </span>
              <span v-else class="noyet-wrap">暂无</span>
            </el-form-item> -->
          </div>

          <div class="right-wrap">
            <el-form-item
              label="营业执照电子版："
              required
            >
              <div class="image-box-wrap">
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
                <div class="image-box-wrap">
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
                <div class="image-box-wrap">
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
          </div>
        </div>
      </el-form>
    </div>
    <div class="foot-box">
      <el-button
        @click="closeLog"
      >
        关闭
      </el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/multishop/shop-process.js'
import { ElMessage } from 'element-plus'

const modifyStatus = (val) => {
  if (val === -1) {
    return '未通过'
  } else if (val === 1) {
    return '已通过'
  }
  return '未审核'
}
const emit = defineEmits(['closeLog', 'closeLog'])

const visible = ref(false) // 控制显示
const formData = ref({
  creditCode: '',
  firmName: '',
  residence: '',
  representative: '',
  capital: '',
  foundTime: '',
  endTime: '',
  startTime: '',
  businessScope: '',
  businessLicense: '',
  identityCardFront: '',
  identityCardLater: '',
  remarks: ''
})
const auditStatus = ref('')
const pageLoading = ref(false)

const allinPayStore = useAllinpayStore()
const paySettlementType = allinPayStore.paySettlementType // 是否开启通联支付 1：开启 0：关闭

watch(() => visible.value, () => {
  if (!visible.value) emit('closeLog')
})

const init = () => {
  visible.value = true
  getmodifyInformation()
}

// 获取申请审核情况
const getmodifyInformation = () => {
  pageLoading.value = true
  // 走接口拿数据
  nextTick(() => {
    api.shopCompanyAuditingAuditInfo().then(data => {
      formData.value = { ...data, ...data.shopCompanyVO }
      auditStatus.value = data.status
    }).catch(() => {

    }).finally(() => {
      pageLoading.value = false
    })
  })
}
// 撤销申请
const withdrawalSubmission = () => {
  api.shopCompanyAuditingRevoke().then(() => {
    ElMessage({
      message: '撤销修改申请成功',
      type: 'success',
      duration: 1500,
      onClose: () => {
        closeLog()
      }
    })
  })
}
const closeLog = () => {
  visible.value = false
  emit('closeLog')
}

const onBeforeCloseDialog = (done) => {
  // 按下esc 关闭预览图时不关闭dialog
  const imgPreviewDom = document.getElementsByClassName('el-image-viewer__wrapper')[0]
  if (!imgPreviewDom) {
    done()
  }
}

defineExpose({
  init
})
</script>

<style lang="scss" scoped>
@use "index";
</style>
