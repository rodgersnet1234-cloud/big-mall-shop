<template>
  <!-- 发货信息，用于导出代发货订单的excel交给快递公司 -->
  <el-dialog
    v-model="visible"
    :modal="false"
    :title="$t('product.spu.uploadTips')"
    :close-on-click-modal="false"
    width="38%"
    class="page-product-list-spu-upload"
  >
    <div class="spu-import-tips">
      {{ $t('product.spu.sameNumber') }}
    </div>
    <el-upload
      ref="uploadRef"
      v-loading="loading"
      :auto-upload="false"
      :v-loading="loading"
      :before-upload="beforeAvatarUpload"
      :file-list="files"
      :limit="1"
      :on-error="uploadFalse"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="uploadSuccess"
      :action="baseURL + '/mall4cloud_product/mp/spu/export_excel'"
      :headers="{Authorization: token}"
      class="upload-demo"
      name="excelFile"
    >
      <!-- :file-list="fileList" -->
      <!-- multiple -->
      <template #tip>
        <div class="el-upload__tip" />
      </template>
      <template #trigger>
        <el-button
          type="primary"
        >
          {{
            $t("product.spu.selectFile")
          }}
        </el-button>
      </template>
      <el-button
        style="margin-left: 10px"
        type="success"
        @click="submitUpload"
      >
        {{ $t("product.spu.import") }}
      </el-button>
      <el-button
        style="margin-left: 10px"
        type="success"
        @click="downloadModel"
      >
        {{ $t("product.spu.downloadTemplate") }}
      </el-button>
    </el-upload>
  </el-dialog>
</template>
<script setup>
import * as api from '@/api/product/list'
import { getToken } from '@/utils/auth'
import { ElMessage } from 'element-plus'
import { checkFile } from '@/utils/fileHandling.js'

const emit = defineEmits(['refreshDataList'])
const visible = ref(false)
const loading = ref(false)
const upload = ref(false)
const baseURL = import.meta.env.VITE_APP_BASE_API
const couponId = ref(3)
const files = ref([])
const token = ref(null)
const isSubmit = ref(false)

const uploadSuccess = (response) => {
  loading.value = false
  const data = response.data
  if (!data && response.success) {
    alert($t('product.spu.fileSuccess'))
  } else {
    if (response.code === 'A00005') {
      alert($t('product.spu.fileFail'))
    } else {
      alert(data)
    }
  }
  files.value = []
  visible.value = false
  emit('refreshDataList')
}
const uploadFalse = () => {
  loading.value = false
  alert($t('product.spu.fileUploadFail'))
}
const init = (id) => {
  visible.value = true
  loading.value = false
  files.value = []
  token.value = getToken()
  nextTick(() => {
    // $refs['dataForm'].resetFields()
  })
  couponId.value = id
}
// 上传前对文件的大小的判断
const beforeAvatarUpload = (file) => {
  upload.value = true
  const extension = checkFile(file, ['xls', 'xlsx'], 10)
  loading.value = true
  return extension
}

const uploadRef = ref(null)
const submitUpload = () => {
  upload.value = false
  uploadRef.value.submit()
  if (!upload.value) {
    ElMessage.error('请选择要上传的文件')
  }
}
const handleRemove = () => {
}
const handlePreview = (file) => {
  if (file.response.status) {
    alert($t('product.spu.fileSuccess'))
  } else {
    alert($t('product.spu.fileFail'))
  }
  visible.value = false
  emit('refreshDataList')
}
// 下载模板
const downloadModel = () => {
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  loading.value = true
  api.downModel().then((data) => {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
    // var blob = data
    const fileName = '商品模板信息.xlsx'
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
    isSubmit.value = false
    loading.value = false
  }).catch((e) => {
    ElMessage.error(e)
    isSubmit.value = false
    loading.value = false
  })
  visible.value = false
  emit('refreshDataList')
}
defineExpose({ init })
</script>

<style lang="scss" scoped>
.page-product-list-spu-upload {
  :deep(.el-dialog__body) {
    padding-top: 10px;
  }
  .spu-import-tips {
    margin-bottom: 10px;
  }
}
</style>
