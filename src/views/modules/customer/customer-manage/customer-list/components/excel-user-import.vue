<template>
  <el-dialog
    v-model="visible"
    :title="$t('customer.customerManager.userImport')"
    :close-on-click-modal="false"
    width="38%"
    class="component-excel-user-import"
  >
    <p
      v-for="note in (isEn() ? notesEn : notes)"
      :key="note"
    >
      {{ note }}
    </p>
    <el-button
      style="margin-left: 10px;"
      type="primary"
      link
      @click="downloadModel"
    >
      {{ $t('customer.customerManager.downloadTemplate') }}
    </el-button>
    <el-upload
      ref="uploadRef"
      class="upload-demo"
      :action="baseURL + '/mall4cloud_user/m/user/import_excel'"
      :headers="{Authorization: tokenVal}"
      :limit="1"
      name="excelFile"
      :on-preview="handlePreview"
      :on-error="uploadFalse"
      :on-success="uploadSuccess"
      :file-list="files"
      :auto-upload="false"
      :before-upload="beforeAvatarUpload"
      :on-change="uploadChange"
    >
      <template #trigger>
        <el-button
          type="success"
        >
          {{ $t('customer.customerManager.selectFile') }}
        </el-button>
      </template>
      <el-button
        style="margin-left: 10px;"
        type="primary"
        @click="submitUpload"
      >
        {{ $t('customer.customerManager.confirmUpload') }}
      </el-button>
    </el-upload>
  </el-dialog>
</template>

<script setup>
import { getLanguage } from '@/lang/index'
import * as api from '@/api/customer/customer-manager'
import { ElMessage } from 'element-plus'
import { checkFile } from '@/utils/fileHandling.js'

const emit = defineEmits([
  'refreshDataList'
])

const baseURL = import.meta.env.VITE_APP_BASE_API
const notes = [
  '注意：',
  '   1、请勿修改表格中的字段顺序，或随意增加、删除表格字段,上传模板大小不能超过 10MB,超过应该分批导入',
  '   2、根据手机号(必须是11位)作为唯一标识，如果导入的手机号已存在，不会更新用户的任何数据.',
  '   3、国家/地区不同，手机号的验证规则也不同，导入时不会验证手机号码的真实性，请谨慎填写，导入错误数据请自行负责.'
]
const notesEn = [
  ' Note: ',
  ' 1, Please do not modify the order of the fields in the form, or arbitrarily add or delete form fields, upload the template size can not exceed 10MB, more than should be imported in batches ',
  ' 2、According to the cell phone number as a unique identification, if the imported cell phone number already exists, will not update any data of the user.',
  ' 3、The verification rules for cell phone numbers are different for different countries/regions, and the authenticity of cell phone numbers will not be verified when importing, so please fill in the form carefully and be responsible for importing wrong data.'
]

const tokenVal = ref(null)
const visible = ref(false)
const files = ref([])

const init = () => {
  visible.value = true
  nextTick(() => {
  })
  tokenVal.value = getToken()
}

// 上传前对文件的大小的判断
const beforeAvatarUpload = (file) => {
  return checkFile(file, ['xls', 'xlsx'], 10)
}

const uploadRef = ref()
const submitUpload = () => {
  // 触发组件的action
  if (!files.value.length) {
    ElMessage.error('请选择文件上传')
  }
  uploadRef.value?.submit()
}

const handlePreview = (file) => {
  if (file.response.data) {
    alert(isEn() ? 'This file import success' : '此文件导入成功')
  } else {
    alert(isEn() ? 'This file import failed' : '此文件导入失败')
  }
}

const uploadChange = (file, fileList) => {
  files.value = fileList
}

const uploadSuccess = (response) => {
  const code = response.code
  const msg = response.msg
  if (code === '00000') {
    alert(response.data)
  } else {
    alert(isEn() ? 'File import failed.' + msg : '导入失败，' + msg)
  }
  emit('refreshDataList')
  files.value = []
  visible.value = false
}

const uploadFalse = (response) => {
  alert(isEn() ? 'File upload failed!' : '文件上传失败！')
}

// 下载模板
const downloadModel = () => {
  api.downModel().then((data) => {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
    const fileName = isEn() ? 'UserInfoImportTemplate.xlsx' : '导入客户信息模板.xlsx'
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
  }).catch((e) => {
    ElMessage.error(e)
  })
}

const isEn = () => {
  return getLanguage === 'en'
}

defineExpose({
  init
})
</script>

<style scoped lang="scss">
p:nth-child(4) {
  display: inline;
  margin-top: 0;
}
.upload-demo {
  margin-top: 14px;
}
</style>
