<template>
  <div class="component-business-info-reupload">
    <el-dialog
      v-model="dialogVisible"
      title="影印件上传"
      :close-on-click-modal="false"
      :append-to-body="true"
      width="500px"
    >
      <el-alert
        :title="msg"
        type="error"
        show-icon
        style="margin-bottom: 20px;"
      />
      <!-- native modifier has been removed, please confirm whether the function has been affected  -->
      <el-form
        ref="companyInfoFormRef"
        :model="companyInfoForm"
        :rules="companyInfoRule"
        label-width="140px"
        class="business-info"
        @submit.prevent
      >
        <el-form-item
          label="营业执照电子版"
          prop="businessLicense"
        >
          <div class="business-license-box">
            <div class="license-content">
              <imgs-upload
                v-model="companyInfoForm.businessLicense"
                :limit="1"
              />
              <div class="example-box">
                <img
                  src="@/assets/example-img/Business-license.png"
                  alt
                >
                <div class="tips">
                  示例
                </div>
              </div>
            </div>
            <div class="upload-tips">
              仅限jpg、gif、png，仅限上传1张
            </div>
          </div>
        </el-form-item>
        <div class="id-box">
          <div class="upload-content">
            <div class="upload-img">
              <el-form-item
                class="idcard"
                label="法人身份证"
                prop="identityCardFront"
              >
                <imgs-upload
                  v-model="companyInfoForm.identityCardFront"
                  :limit="1"
                />
              </el-form-item>
              <el-form-item
                class="idcard"
                label-width="0"
                prop="identityCardLater"
              >
                <imgs-upload
                  v-model="companyInfoForm.identityCardLater"
                  :limit="1"
                />
              </el-form-item>
            </div>
            <div class="upload-example">
              <div class="example-box">
                <img
                  src="@/assets/example-img/idcard1.png"
                  alt
                >
                <div class="tips">
                  人像面示例
                </div>
              </div>
              <div class="example-box">
                <img
                  src="@/assets/example-img/idcard2.png"
                  alt
                >
                <div class="tips">
                  国徽面示例
                </div>
              </div>
            </div>
            <div class="upload-tips">
              请上传身份证正反面照片，仅限jpg、gif、png，仅限上传2张
            </div>
          </div>
        </div>
      </el-form>
      <template #footer>
        <div>
          <el-button
            @click="dialogVisible = false"
          >
            取消
          </el-button>
          <el-button
            v-permission="['shop:uploadIdCard:update']"
            type="primary"
            @click="submitForm"
          >
            上传
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { Debounce } from '@/utils/debounce.js'
import { reUploadIdCard } from '@/api/multishop/shop-process.js'
import { ElMessage } from 'element-plus'
const props = defineProps({
  shopCompanyId: {
    type: Number,
    default: 0
  },
  shopId: {
    type: Number,
    default: 0
  }
})

const dialogVisible = ref(false)
const companyInfoForm = reactive({
  businessLicense: '',
  identityCardFront: '',
  identityCardLater: ''
})
const msg = ref('') // 提示信息

const companyInfoRule = computed(() => {
  return {
    businessLicense: [
      { required: true, message: $t('multishop.shopInformation.businessLicenseTips'), trigger: 'change' }
    ],
    identityCardFront: [
      { required: true, message: $t('multishop.shopInformation.identityCardFrontTips'), trigger: 'change' }
    ],
    identityCardLater: [
      { required: true, message: $t('multishop.shopInformation.identityCardLaterTips'), trigger: 'change' }
    ]
  }
})

const companyInfoFormRef = ref('')
const init = (data) => {
  dialogVisible.value = true
  if (data === 0) {
    msg.value = '审核未通过，请重新上传'
  } else if (data === 2) {
    msg.value = '法人身份证审核失败，请重新上传'
  } else if (data === 3) {
    msg.value = '工商营业执照审核失败，请重新上传'
  }
  nextTick(() => {
    companyInfoFormRef.value?.resetFields()
  })
}
const submitForm = Debounce(() => {
  companyInfoForm.shopCompanyId = props.shopCompanyId
  companyInfoForm.shopId = props.shopId
  companyInfoFormRef.value?.validate(valid => {
    if (valid) {
      reUploadIdCard(companyInfoForm).then((data) => {
        ElMessage({
          message: data,
          type: 'success',
          onClose: () => {
            // 上传成功后，刷新页面
            location.reload()
          }
        })
      })
    }
  })
}, 1500)

defineExpose({
  init
})
</script>

<style lang="scss" scoped>
@use "index";
</style>
