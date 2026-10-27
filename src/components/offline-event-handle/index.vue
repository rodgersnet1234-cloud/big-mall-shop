<template>
  <el-dialog
    v-model="visible"
    :title="dataForm.status === 1 ? '申请上架' : '等待审核'"
    :close-on-click-modal="false"
    width="600px"
    class="components-offline-event-handle"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-width="80px"
      @submit.prevent
      @keyup.enter="onSubmit()"
    >
      <el-form-item
        label="处理人"
        prop="handler"
      >
        <el-input
          v-model="dataForm.handler"
          :disabled="true"
          size="small"
        />
      </el-form-item>
      <el-form-item
        label="处理状态"
        prop="status"
      >
        <span v-if="dataForm.status === 1">违规下架</span>
        <span v-else-if="dataForm.status === 2">等待审核</span>
        <span v-else-if="dataForm.status === 3">审核通过</span>
        <span v-else-if="dataForm.status === 4">审核不通过</span>
        <span v-else>其他</span>
      </el-form-item>
      <el-form-item
        label="下线原因"
        prop="offlineReason"
      >
        <el-input
          v-model="dataForm.offlineReason"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 10}"
          maxlength="200"
          :disabled="true"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="下线时间"
        prop="createTime"
      >
        <el-input
          v-model="dataForm.createTime"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item
        v-if="dataForm.status === 1 || dataForm.status === 4"
        class="textarea-right"
        label="申请理由"
        prop="reapplyReason"
      >
        <el-input
          v-model="dataForm.reapplyReason"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 10}"
          maxlength="200"
          show-word-limit
          :disabled="!(dataForm.status === 1 || dataForm.status === 4)"
        />
      </el-form-item>
    </el-form>
    <el-divider v-if="dataForm.offlineHandleEventItemList && dataForm.offlineHandleEventItemList.length && dataForm.offlineHandleEventItemList[0].createTime" />
    <div
      v-if="dataForm.offlineHandleEventItemList && dataForm.offlineHandleEventItemList.length && dataForm.offlineHandleEventItemList[0].createTime"
      style="margin-left: 12px"
    >
      <div style="margin-bottom:10px">
        <strong>申请日志</strong>
      </div>
      <div
        v-for="item in dataForm.offlineHandleEventItemList"
        :key="item.eventItemId"
        style="line-height: 1.5em"
      >
        <el-row justify="space-around">
          <el-col :span="4">
            <strong>申请时间：</strong>
          </el-col>
          <el-col :span="20">
            <span class="content-color">{{ item.createTime }}</span>
          </el-col>
        </el-row>
        <el-row justify="space-around">
          <el-col :span="4">
            <strong>申请理由：</strong>
          </el-col>
          <el-col :span="20">
            <div>
              <span class="content-color">{{ item.reapplyReason }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row
          v-if="item.auditTime"
          justify="space-around"
        >
          <el-col :span="4">
            <strong>审核时间：</strong>
          </el-col>
          <el-col :span="20">
            <div>
              <span class="content-color">{{ item.auditTime }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row
          v-if="item.refuseReason"
          justify="space-around"
        >
          <el-col :span="4">
            <strong>拒绝原因：</strong>
          </el-col>
          <el-col :span="20">
            <div>
              <span class="content-color">{{ item.refuseReason }}</span>
            </div>
          </el-col>
        </el-row>
        <div style="width:100%">
          <el-divider />
        </div>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button
          type="primary"
          :disabled="dataForm.status !== 1 && dataForm.status !== 4"
          @click="onSubmit(dataForm.status !== 1 && dataForm.status !== 4)"
        >提交申请</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/delivery/station'
import { ElMessage, ElMessageBox } from 'element-plus'

defineProps({
  selectUrl: {
    default: '',
    type: String
  },
  applyUrl: {
    default: '',
    type: String
  }
})

const emit = defineEmits(['refreshDataList'])

const dataForm = reactive({
  createTime: null,
  eventId: null,
  handleId: null,
  handler: '',
  handlerId: null,
  handleType: null,
  offlineHandleEventItemList: [],
  offlineReason: null,
  reapplyReason: '',
  shopId: null,
  status: null
})

const validateReason = (rule, value, callback) => {
  const reg = /^\s+$/g
  if (!value) {
    callback(new Error('申请理由不能为空'))
  } else {
    if (reg.test(value)) {
      callback(new Error('申请理由不能全为空格'))
    }
    callback()
  }
}

const dataRule = {
  reapplyReason: [
    { validator: validateReason, trigger: 'blur' }
  ]
}

// 初始化
const dataFormRef = ref()
const visible = ref(false)
const init = (stationId) => {
  stationId = stationId || 0
  visible.value = true
  nextTick(() => {
    dataFormRef.value.resetFields()
    if (stationId) {
      api.getOfflineInfo(stationId).then((data) => {
        if (!data) {
          ElMessage({
            message: '商品不在审核状态，请刷新后重试',
            type: 'error',
            duration: 1500,
            onClose: () => {
              dataForm.reapplyReason = ''
              visible.value = false
              emit('refreshDataList')
            }
          })
        } else {
          onHandleDataForm(data)
        }
      })
    }
  })
}

// 表单提交
const onSubmit = (status) => {
  if (status) {
    return
  }
  dataFormRef.value.validate((valid) => {
    if (valid) {
      sendData()
    } else {
      return false
    }
  })
}

// 发送信息
const sendData = () => {
  ElMessageBox.confirm('确定提交申请吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    api.offlineAuditApply({
      eventId: dataForm.eventId,
      handleId: dataForm.handleId,
      reapplyReason: dataForm.reapplyReason
    }).then(() => {
      visible.value = false
      ElMessage({
        message: '操作成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          dataForm.reapplyReason = ''
          emit('refreshDataList')
        }
      })
    })
  })
}

// dataForm赋值
const onHandleDataForm = (data) => {
  dataForm.createTime = data.createTime
  dataForm.eventId = data.eventId
  dataForm.handleId = data.handleId
  dataForm.handler = data.handler
  dataForm.handlerId = data.handlerId
  dataForm.handleType = data.handleType
  dataForm.offlineHandleEventItemList = data.offlineHandleEventItemList
  dataForm.offlineReason = data.offlineReason
  dataForm.reapplyReason = data.reapplyReason
  dataForm.shopId = data.shopId
  dataForm.status = data.status
}

defineExpose({
  init
})
</script>

<style lang="scss" scoped>
.components-offline-event-handle{
  .textarea-right :deep(.el-textarea__inner){
    padding-right: 50px;
  }
  .content-color {
    color: #4395ff;
    word-break: break-word;
  }
}
</style>
