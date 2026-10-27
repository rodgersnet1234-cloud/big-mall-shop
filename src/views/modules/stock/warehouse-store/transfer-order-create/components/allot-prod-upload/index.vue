<template>
  <el-dialog
    v-model="visible"
    class="component-purchases-prod-upload"
    :modal="false"
    :title="$t('product.uploadTips')"
    :close-on-click-modal="false"
    width="38%"
  >
    <div>
      <p>导入调拨订单商品</p>
    </div>
    <div style="display: inline-block">
      <el-upload
        ref="uploadRef"
        class="upload-demo"
        :action="baseURL+uploadUrl"
        :data="uploadData"
        :headers="{ Authorization:token}"
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
          <div class="el-upload__tip" />
        </template>
        <template #trigger>
          <el-button
            style="margin-right:10px"
            type="primary"
          >
            {{
              $t("product.selectFile")
            }}
          </el-button>
        </template>
        <el-button
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
    </div>
  </el-dialog>
</template>
<script setup>
import request from '@/utils/request'
import { getToken } from '@/utils/auth'
import { ElMessage } from 'element-plus'
import { checkFile } from '@/utils/fileHandling.js'

const props = defineProps({
  // 下载模板的url
  modelUrl: {
    default: '/mall4cloud_order/m/allot_order/download_model',
    type: String
  },
  // 上传模板的url
  uploadUrl: {
    default: '/mall4cloud_order/m/allot_order/import_excel',
    type: String
  },
  // 下载模板名称
  templateName: {
    default: '模板.xlsx',
    type: String
  },
  // 上传携带的参数
  uploadData: {
    default: () => {},
    type: Object
  }
})
const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const upload = ref(false)
const files = ref([])
const baseURL = import.meta.env.VITE_APP_BASE_API
const token = getToken()

const uploadSuccess = (response) => {
  alert(response.msg || response.data?.tips || '导入成功')
  const data = response
  visible.value = false
  files.value = []
  emit('refreshDataList', data)
}
const uploadFalse = () => {
  alert('文件上传失败！')
}
const init = () => {
  visible.value = true
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
  request({
    url: props.modelUrl,
    method: 'get',
    responseType: 'blob'
  }).then((data) => {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
    const elink = document.createElement('a')
    if ('download' in elink) { // 非IE下载
      elink.download = props.templateName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    } else { // IE10+下载
      navigator.msSaveBlob(blob, props.templateName)
    }
  })
}
defineExpose({ init })
</script>
<style scoped>
</style>
