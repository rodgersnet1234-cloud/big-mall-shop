<template>
  <el-dialog
    v-model="visible"
    :title="dataForm.orderInvoiceId? $t('table.edit'): $t('table.create')"
    :close-on-click-modal="false"
    class="page-order-invoice-add-or-update"
  >
    <el-form
      ref="dataFormRef"
      :rules="rules"
      :model="dataForm"
      label-position="right"
      label-width="90px"
      style="margin-left:50px;"
      @submit.prevent
    >
      <!-- 订单id -->
      <el-form-item
        :label="$t('order.orderInvoice.orderId')+'：'"
        prop="orderId"
      >
        <div>{{ dataForm.orderId || '' }}</div>
      </el-form-item>
      <!-- 发票类型 1.电子普通发票 -->
      <el-form-item
        :label="$t('order.orderInvoice.invoiceType')+'：'"
        prop="invoiceType"
      >
        <div v-if="dataForm.invoiceType === 1">
          电子普通发票
        </div>
      </el-form-item>
      <!-- 抬头类型 1.单位 2.个人 -->
      <el-form-item
        :label="$t('order.orderInvoice.headerType')+'：'"
        prop="headerType"
      >
        <div>{{ ['','单位','个人'][dataForm.headerType] }}</div>
      </el-form-item>
      <!-- 抬头名称 -->
      <el-form-item
        v-if="dataForm.headerName"
        :label="$t('order.orderInvoice.headerName')+'：'"
        prop="headerName"
      >
        <div class="header-name">
          {{ dataForm.headerName || '' }}
        </div>
      </el-form-item>
      <!-- 发票税号 -->
      <el-form-item
        v-if="dataForm.invoiceTaxNumber && dataForm.headerType === 1"
        :label="$t('order.orderInvoice.invoiceTaxNumber')+'：'"
        prop="invoiceTaxNumber"
      >
        <div>{{ dataForm.invoiceTaxNumber || '' }}</div>
      </el-form-item>
      <!-- 订单状态 -->
      <el-form-item
        :label="$t('group.orderStatus')+'：'"
        prop="orderStatus"
      >
        <span v-if="dataForm.orderStatus === 1">{{ '待付款' }}</span>
        <span v-if="dataForm.orderStatus === 2">{{ '待发货' }}</span>
        <span v-if="dataForm.orderStatus === 3">{{ '待收货' }}</span>
        <span v-if="dataForm.orderStatus === 5">{{ '已完成' }}</span>
        <span v-if="dataForm.orderStatus === 6">{{ '交易失败' }}</span>
        <span v-if="dataForm.orderStatus === 7">{{ '待成团' }}</span>
        <span v-if="dataForm.orderStatus === 9">{{ '待付尾款' }}</span>
      </el-form-item>
      <!-- 发票状态 1.申请中 2.已开票 -->
      <el-form-item
        :label="$t('order.orderInvoice.invoiceState')+'：'"
        prop="invoiceState"
      >
        <div>{{ ['','申请中','已开票'][dataForm.invoiceState] }}</div>
      </el-form-item>
      <!-- 发票上传： -->
      <el-form-item :label="'发票上传：'">
        <div>
          <el-link
            v-if="dataForm.fileId"
            target="_blank"
            rel="noopener noreferrer"
            :href="checkFileUrl(fileInfo.filePath)"
          >
            {{ fileInfo.fileName }}
          </el-link>
          <el-upload
            ref="uploadRef"
            v-model:file-list="files"
            accept=".pdf"
            action=""
            :http-request="httpRequest"
            :multiple="true"
            :auto-upload="false"
            :limit="1"
            :before-upload="beforeUpload"
            :on-success="onUploadSuccess"
            :on-error="onUploadError"
            :on-exceed="onUploadExceedTip"
            :on-change="handleAvatarChange"
            :on-remove="handleRemove"
          >
            <template #trigger>
              <el-button
                type="primary"
              >
                选取文件
              </el-button>
            </template>
            <el-button
              v-permission="['order:orderInvoice:upload']"
              style="margin-left: 10px;"
              type="success"
              @click="onUploadConfirm"
            >
              确定上传
              <el-tooltip
                content="只能上传一个PDF文件！"
                placement="top"
                effect="light"
              >
                <el-icon class="el-icon--right">
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </el-button>
          </el-upload>
        </div>
      </el-form-item>
      <!-- 申请时间 -->
      <el-form-item
        :label="$t('order.orderInvoice.applicationTime')+'：'"
        prop="applicationTime"
      >
        <div>{{ dataForm.applicationTime }}</div>
      </el-form-item>
      <!-- 上传时间 -->
      <el-form-item
        v-if="dataForm.uploadTime"
        :label="$t('order.orderInvoice.uploadTime')+'：'"
        prop="uploadTime"
      >
        <div>{{ dataForm.uploadTime }}</div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          @click="visible = false"
        >
          {{ $t('table.cancel') }}
        </el-button>
        <el-button
          v-permission="['order:orderInvoice:commit']"
          type="primary"
          @click="onSubmit()"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/order/order-invoice'
import { getBatchPreSignUrl, awsImgUpdate } from '@/api/biz/oss'
import { savePdf } from '@/api/biz/attach-file'
import { ElMessage, ElMessageBox } from 'element-plus'

const emit = defineEmits([
  'refreshDataList'
])

const files = ref([])
const ossList = reactive([])
const dataFormRef = ref()
const visible = ref(false)
const dataForm = ref({
  orderInvoiceId: 0,
  orderId: null,
  shopId: null,
  invoiceType: null,
  headerType: null,
  headerName: null,
  invoiceTaxNumber: null,
  invoiceState: null,
  fileId: null,
  applicationTime: null,
  uploadTime: null,
  ossList: null,
  attachFile: null
})
const attachFile = ref({})
const rules = {}
const fileInfo = ref({})

// 初始化
const init = (orderInvoiceId) => {
  dataForm.value.orderInvoiceId = orderInvoiceId || 0
  visible.value = true
  nextTick(() => {
    resetDataFrom()
    api.get(orderInvoiceId).then(data => {
      dataForm.value = data
      if (dataForm.value.fileId) {
        api.fileInfo(data.fileId).then(res => {
          fileInfo.value = res
        })
      }
    })
  })
}

const resetDataFrom = () => {
  dataForm.value = {
    orderInvoiceId: 0,
    orderId: null,
    shopId: null,
    invoiceType: null,
    headerType: null,
    headerName: null,
    invoiceTaxNumber: null,
    invoiceState: null,
    fileId: null,
    applicationTime: null,
    uploadTime: null,
    ossList: null,
    attachFile: null
  }
  files.value = []
}

// 表单提交
const onSubmit = () => {
  if (files.value.length) {
    ElMessageBox.confirm('您选择的文件未上传, 是否继续提交?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      postDataForm()
    })
  } else {
    postDataForm()
  }
}

const postDataForm = () => {
  dataFormRef.value?.validate(valid => {
    if (!valid) {
      return
    }
    const request = dataForm.value.orderInvoiceId ? api.update(dataForm.value) : api.save(dataForm.value)
    request.then(() => {
      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 1500,
        onClose: () => {
          visible.value = false
          emit('refreshDataList')
          dataFormRef.value?.resetFields()
        }
      })
    })
  })
}

// 获取上传文件数据
const onUploadConfirm = () => {
  // 重置文件索引位置和完成文件记录数
  ossList.length = 0
  attachFile.value = {}
  const fileNum = files.value.length
  if (!fileNum) {
    ElMessage.error('请选择文件！')
    return
  }
  const fileNames = files.value?.map((item) => {
    return item.name
  }).join(',')
  if (dataForm.value.orderStatus !== 5) {
    ElMessageBox.confirm('该订单未确认收货, 是否继续上传?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      postFile(fileNames)
    }).catch(() => {
    })
  } else {
    postFile(fileNames)
  }
}

const uploadRef = ref()
const postFile = (fileNum) => {
  getBatchPreSignUrl(fileNum).then(response => {
    onHandleArr(ossList, response)
    nextTick(() => {
      uploadRef.value?.submit()
    })
  })
}

/**
 * 上传文件
 */
const httpRequest = (event) => {
  const file = event.file
  const typeArray = file.type.split('/')
  const attachFileVal = Object.assign({
    fileType: typeArray[1],
    fileName: file.name,
    fileSize: file.size,
    type: 3
  })
  if (ossList.length <= 0) {
    ElMessage('数据异常，请刷新后重试')
  }
  // 文件上传
  attachFileVal.filePath = '/' + ossList[0].dir + ossList[0].fileName
  awsImgUpdate(ossList[0].preSignUrl, file).then(() => {
    attachFile.value = attachFileVal
    event.onSuccess()
  }).catch(() => {
    ElMessage('上传失败')
    event.onSuccess()
  })
}

// 预上传
const handleAvatarChange = () => {
}

// 上传错误处理
const onUploadError = (err) => {
  ElMessage($t('biz.imgbox.requestError'), true)
  throw err
}

// 上传成功处理，并提交文件数据
const onUploadSuccess = () => {
  if (attachFile.value) {
    savePdf(attachFile.value).then(data => {
      dataForm.value.fileId = data.fileId
      fileInfo.value = data
      attachFile.value = {}
    })
  }
  files.value = []
}

const onUploadExceedTip = () => {
}

// 上传前检查合法性
const beforeUpload = (file) => {
  const isImage = file.type === 'application/pdf'
  if (!isImage) {
    ElMessage.error('请上传PDF文件！')
    return false
  }
  return true
}

const handleRemove = () => {
}

const onHandleArr = (arr, data) => {
  arr.length = 0
  arr.push(...data)
}

defineExpose({
  init
})
</script>

<style scoped lang="scss">
.page-order-invoice-add-or-update {
  .header-name {
    word-break: break-word;
  }
}

:deep(.el-upload-list__item-file-name) {
  white-space: break-spaces;
  text-align: left;
  overflow-wrap: break-word;
}
</style>
