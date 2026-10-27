<template>
  <!-- 发货信息，用于导出代发货订单的excel交给快递公司 -->
  <el-dialog
    v-model="visible"
    :modal="false"
    :title="$t('product.spu.uploadTips')"
    :close-on-click-modal="false"
    width="38%"
    class="component-order-upload"
    @close="onClose"
  >
    <div class="tips">
      <p>批量发货流程为：导出待发货订单，添加快递公司和单号后，选取该文件进而导入数据。</p>
      <p>
        注意：
      </p>
      <p>1.若存在正在退款或者已经退款或者已经部分发货的订单则无法批量发货。</p>
      <p>2.导入期间请不要对导出的订单做发货操作，否则该订单将无法批量发货。 </p>
    </div>
    <el-upload
      ref="uploadRef"
      v-loading="loading"
      :auto-upload="false"
      :v-loading="loading"
      :before-upload="beforeAvatarUpload"
      :file-list="files"
      :limit="1"
      :on-error="onUploadFalse"
      :on-preview="onHandlePreview"
      :on-remove="onHandleRemove"
      :on-success="onUploadSuccess"
      :action="baseURL + '/mall4cloud_order/mp/order/export_order_excel'"
      :headers="{Authorization: getTokenVal}"
      class="upload-demo"
      name="excelFile"
    >
      <template #tip>
        <div class="el-upload__tip" />
      </template>
      <el-button
        style="margin-left: 10px"
        type="success"
        @click="onSubmitUpload"
      >
        {{ $t("product.spu.import") }}
      </el-button>
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
        :loading="isExportOrderBtn"
        style="margin-left: 10px"
        type="success"
        @click="onExportOrder"
      >
        {{ $t("order.order.exportOrder") }}
      </el-button>
    </el-upload>
  </el-dialog>
</template>

<script setup>
import * as orderApi from '@/api/order/order'
import { ElMessage, ElMessageBox } from 'element-plus'
import { checkFile } from '@/utils/fileHandling.js'

const props = defineProps({
  param: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const emit = defineEmits([
  'refreshDataList1', 'close'
])

const baseURL = import.meta.env.VITE_APP_BASE_API

const loading = ref(false)
const upload = ref(false)
const visible = ref(false)
const files = reactive([])

const couponId = ref(3)
const getTokenVal = ref(null)
const init = (id) => {
  visible.value = true
  loading.value = false
  files.length = 0
  getTokenVal.value = getToken()
  nextTick(() => {})
  couponId.value = id
}

const isExportOrderBtn = ref(false)
const onExportOrder = () => {
  const param = props.param
  if (!param.startTime || !param.endTime) {
    ElMessage.error($t('order.order.pleExpOrderFirst'))
    return
  }
  ElMessageBox.confirm($t('table.sureToExport'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    isExportOrderBtn.value = true
    orderApi.deliverySoldExcel({
      startTime: param.startTime, // 开始时间
      endTime: param.endTime // 结束时间
    }).then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
      const fileName = '待发货订单信息.xlsx'
      const elink = document.createElement('a')
      if ('download' in elink) { // 非IE下载
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
        isExportOrderBtn.value = false
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName)
        isExportOrderBtn.value = false
      }
    }).catch((e) => {
      isExportOrderBtn.value = false
      ElMessage.error(e)
    })
  })
}

const onUploadSuccess = (response) => {
  loading.value = false
  const data = response.data
  if (!data) {
    alert($t('product.spu.fileSuccess'))
  } else {
    alert(data)
  }
  files.length = 0
  visible.value = false
  emit('refreshDataList1')
}

const onUploadFalse = () => {
  loading.value = false
  alert($t('product.spu.fileUploadFail'))
}

// 上传前对文件的大小的判断
const uploadRef = ref()
const beforeAvatarUpload = (file) => {
  upload.value = true
  const extension = checkFile(file, ['xls', 'xlsx'], 10)
  loading.value = extension
  return extension
}
const onSubmitUpload = () => {
  upload.value = false
  uploadRef.value?.submit()
  if (!upload.value) {
    ElMessage.error('请选择要上传的文件')
  }
}

const onHandleRemove = () => {}

const onHandlePreview = (file) => {
  if (file.response.status) {
    alert($t('product.spu.fileSuccess'))
  } else {
    alert($t('product.spu.fileFail'))
  }
  visible.value = false
  emit('refreshDataList1')
}

const onClose = () => {
  emit('close')
}

defineExpose({
  init
})
</script>

<style lang="scss" scoped>
.component-order-upload {
  :deep(.el-dialog__body) {
    padding: 10px 20px 30px;
  }
  .tips {
    margin-bottom: 30px;
  }
}
:deep(.is-loading) > i {
  display: inline-block;
}
</style>
