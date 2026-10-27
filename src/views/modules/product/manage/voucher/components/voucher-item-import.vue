<template>
  <!-- 供应商导入 -->
  <el-dialog
    v-model="visible"
    :modal="false"
    :title="$t('product.uploadTips')"
    :close-on-click-modal="false"
    width="38%"
  >
    <div class="tips">
      <div>{{ $t('voucher.uploadText') }}</div>
      <p>{{ $t('voucher.uploadTipsOne') }}</p>
      <p>{{ $t('voucher.uploadTipsTwo') }}</p>
      <p>{{ $t('voucher.uploadTipsThree') }}</p>
    </div>
    <div style="display: inline-block">
      <el-upload
        ref="uploadRef"
        class="upload-demo"
        :action="baseURL + '/mall4cloud_product/m/voucher_item/import_excel'"
        :data="{ voucherId: voucherId }"
        :headers="{Authorization: tokenVal}"
        :limit="1"
        name="excelFile"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-error="uploadFalse"
        :on-success="uploadSuccess"
        :file-list="files"
        :auto-upload="false"
        :before-upload="beforeAvatarUpload"
      >
        <template #tip>
          <div

            class="el-upload__tip"
          />
        </template>
        <template #trigger>
          <div class="default-btn primary-btn">
            {{ $t("product.selectFile") }}
          </div>
        </template>
        <div
          class="default-btn download-btn"
          @click="submitUpload"
        >
          {{ $t("product.import") }}
        </div>
        <div
          class="default-btn download-btn"
          @click="downloadModel"
        >
          {{ $t("product.downloadTemplate") }}
        </div>
      </el-upload>
    </div>
  </el-dialog>
</template>
<script setup>
import { ElMessage } from 'element-plus'
import { downModel } from '@/api/product/voucher-item.js'

const baseURL = import.meta.env.VITE_APP_BASE_API
const emit = defineEmits(['refreshDataList', 'refreshDataList'])

const visible = ref(false)
let upload = false
const files = ref([])

defineProps({
  voucherId: {
    type: Number,
    default: null
  }
})

const tokenVal = ref(null)

const uploadSuccess = (response) => {
  if (!response.success) {
    alert(response.msg)
  } else {
    alert(response.data)
  }
  files.value = []
  visible.value = false
  emit('refreshDataList')
}
const uploadFalse = (response) => {
  alert($t('product.fileUploadFail'))
}
const init = () => {
  visible.value = true
  nextTick(() => {})
  tokenVal.value = getToken()
}
defineExpose({ init })
// 上传前对文件的大小的判断
const beforeAvatarUpload = (file) => {
  upload = true
  const extension = file.name.split('.')[1] === 'xls'
  const extension2 = file.name.split('.')[1] === 'xlsx'
  const isLt2M = file.size / 1024 / 1024 < 10
  if (!extension && !extension2) {
    alert($t('product.downloadTemplateTips1'))
  }
  if (!isLt2M) {
    alert($t('product.downloadTemplateTips2'))
  }
  return extension || (extension2 && isLt2M)
}
const uploadRef = ref(null)
const submitUpload = () => {
  upload = false
  uploadRef.value?.submit()
  if (!upload) {
    ElMessage.error($t('shop.fileNullTip'))
  }
}
const handleRemove = () => {
}
const handlePreview = (file) => {
  if (file.response.status) {
    alert($t('product.fileSuccess'))
    emit('refreshDataList')
  } else {
    alert($t('product.fileFail'))
  }
}
// 下载模板
const downloadModel = () => {
  downModel().then((data) => {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
    const fileName = $t('voucher.excelModel')
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
  })
}

</script>
<style scoped>
.download-btn {
  margin-left: 12px;
}
div :deep(.el-dialog__body) {
  padding-top: 10px;
}
</style>
