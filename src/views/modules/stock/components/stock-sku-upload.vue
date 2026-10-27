<template>
  <!-- 发货信息，用于导出代发货订单的excel交给快递公司 -->
  <el-dialog
    v-model="visible"
    class="component-stock-sku-upload"
    :modal="false"
    :title="$t('product.uploadTips')"
    :close-on-click-modal="false"
    width="38%"
  >
    <el-upload
      ref="uploadRef"
      class="upload-demo"
      :action="uploadURL"
      :headers="{ Authorization: token }"
      :data="{
        type,
        stockPointId
      }"
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
            $t("product.selectFile")
          }}
        </el-button>
      </template>
      <el-button
        style="margin-left:10px"
        @click="submitUpload"
      >
        {{ $t("product.import") }}
      </el-button>
      <el-button
        @click="downloadModel"
      >
        {{ $t("product.downloadTemplate") }}
      </el-button>
    </el-upload>
  </el-dialog>
</template>
<script setup>
import { getToken } from '@/utils/auth'
import * as http from '@/api/stock/components/stock-sku-upload'
import { ElMessage } from 'element-plus'
import { checkFile } from '@/utils/fileHandling.js'

const props = defineProps({
  type: {
    default: 0,
    type: Number // 1 出库 2 入库
  },
  stockPointId: {
    default: null,
    type: Number
  }
})
const emit = defineEmits(['refreshDataList', 'refreshDataList'])

const isSubmit = ref(false)
const visible = ref(false)
const upload = ref(false)
const couponId = ref(3)
const files = ref([])
const uploadURL = reactive(http.importExcelURL)
const token = ref(null)

const uploadSuccess = (response) => {
  alert(response.data.tips)
  files.value = []
  visible.value = false
  emit('refreshDataList', response.data)
}
const uploadFalse = () => {
  alert($t('product.fileUploadFail'))
}
const init = (id) => {
  visible.value = true
  token.value = getToken()
  couponId.value = id
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
const handleRemove = () => {
  // console.log(file)
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
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  http.downloadModel(props.type)
    .then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
      const fileName = props.type === 1 ? $t('stock.outProdFileName') : $t('stock.inProdFileName')
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
      ElMessage({
        message: $t('stock.downloadSuccessful'),
        type: 'success',
        duration: 1500
      })
      isSubmit.value = false
    }).catch(() => {
      isSubmit.value = false
    })
}
defineExpose({ init })
</script>
<style scoped>

div :deep(.el-dialog__body) {
  padding-top: 10px;
}
</style>
