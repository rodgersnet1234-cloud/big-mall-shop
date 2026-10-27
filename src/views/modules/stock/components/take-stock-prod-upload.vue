<template>
  <!-- 实物盘点商品导入 -->
  <el-dialog
    v-model="visible"
    :modal="false"
    :title="$t('product.uploadTips')"
    class="component-take-stock-prod-upload"
    :close-on-click-modal="false"
    width="38%"
  >
    <div class="tips">
      <p>导入根据商品编码进行导入，即以一个商品规格为单位，若该商品规格无商品编码，请补充后再进行导入。</p>
      <p>若导入盘点数量为空则默认为0</p>
      <p>若该盘点已有商品保存，则无法使用批量导入功能。</p>
    </div>
    <div style="display: inline-block">
      <el-upload
        ref="uploadRef"
        class="upload-demo"
        :action="baseUrl + '/mall4cloud_product/m/take_stock_spu/import_excel'"
        :headers="{ Authorization:token}"
        :limit="1"
        name="excelFile"
        :data="{takeStockId: takeStockId}"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-error="uploadFalse"
        :on-success="uploadSuccess"
        :file-list="files"
        :auto-upload="false"
        :before-upload="beforeAvatarUpload"
      >
        <template #tip>
          <div class="el-upload__tip" />
        </template>
        <template #trigger>
          <el-button
            type="primary"
          >
            {{ $t("product.selectFile") }}
          </el-button>
        </template>
        <el-button
          class="download-btn"
          @click="submitUpload"
        >
          {{ $t("product.import") }}
        </el-button>
        <el-button
          class="download-btn"
          @click="downloadModel"
        >
          {{ $t("product.downloadTemplate") }}
        </el-button>
      </el-upload>
    </div>
  </el-dialog>
</template>
<script setup>
import * as api from '@/api/stock/takeStock.js'
import { getToken } from '@/utils/auth'
import { ElMessage } from 'element-plus'
import { checkFile } from '@/utils/fileHandling.js'

const emit = defineEmits('refreshDataList')

const visible = ref(false)
const upload = ref(false)
const takeStockId = ref(null)
const files = ref([])
const token = getToken()
const baseUrl = import.meta.env.VITE_APP_BASE_API

const uploadSuccess = (response) => {
  alert(response.data.tips)
  files.value = []
  visible.value = false
  emit('refreshDataList')
}

const uploadFalse = (response) => {
  alert(response.data || '文件上传失败！')
}

const init = (id) => {
  visible.value = true
  takeStockId.value = id
}
// 上传前对文件的大小的判断
const beforeAvatarUpload = (file) => {
  upload.value = true
  return checkFile(file, ['xls', 'xlsx'], 10)
}
const uploadRef = ref(null)
const submitUpload = () => {
  upload.value = false
  uploadRef.value.submit()
  if (!upload.value) {
    ElMessage.error('请选择要上传的文件')
  }
}

const handlePreview = (file) => {
  if (file.response.status) {
    alert('文件导入成功')
    emit('refreshDataList')
  } else {
    alert('文件导入失败')
  }
}
// 下载模板
const downloadModel = () => {
  api.downloadModel().then((data) => {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
    const fileName = '盘点商品导入模板.xlsx'
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
defineExpose({ init })
</script>
<style scoped>
.download-btn {
  margin-left: 12px;
}
div :deep(.el-dialog__body) {
  padding-top: 10px;
}
</style>
