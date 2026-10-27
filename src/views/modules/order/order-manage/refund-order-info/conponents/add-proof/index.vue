<template>
  <el-dialog
    v-model="visible"
    title="补充凭证"
    :close-on-click-modal="false"
    width="600px"
    class="page-station-add-or-update"
    @closed="onClosed"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-width="100px"
      label-position="top"
    >
      <el-form-item
        label="凭证说明"
        prop="proof"
      >
        <el-input
          v-model.trim="dataForm.proof"
          type="textarea"
          :rows="4"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="上传凭证"
        prop="imgs"
        style="width:624px;"
      >
        <uploadProof
          ref="uploadProofRef"
          v-model="dataForm.imgs"
          :limit="3"
        />
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
          type="primary"
          @click="onSubmit()"
        >
          {{ $t('table.submit') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { addProof } from '@/api/order/order-refund'
import uploadProof from '../upload-proof/index.vue'

const props = defineProps({
  refundDetail: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['close', 'refreshData'])
const dataForm = reactive({
  proof: '',
  imgs: ''
})
const dataRule = {
  proof: [
    { required: true, message: '凭证说明不能为空', trigger: 'blur' }
  ],
  imgs: [
    { required: true, message: '请上传凭证', trigger: 'blur' }
  ]
}

const onClosed = () => {
  uploadProofRef.value.clearFiles()
  emit('close')
}

const dataFormRef = ref()
const visible = ref(false)
const init = () => {
  visible.value = true
  dataFormRef.value?.resetFields()
  isSubmit = false
}

// 表单提交
const uploadProofRef = ref(null)
let isSubmit = false
const onSubmit = () => {
  dataFormRef.value?.validate(async (valid) => {
    if (valid) {
      if (isSubmit) {
        return false
      }
      isSubmit = true
      const saveFileRes = await uploadProofRef.value.saveAttachFileToPlat()
      if (!saveFileRes) {
        // eslint-disable-next-line require-atomic-updates
        isSubmit = false
        return
      }
      addProof({
        refundId: props.refundDetail.refundId,
        sysType: 1, // 0.普通用户 1.商家端 2.平台端 3.供应商端
        refundSts: props.refundDetail.refundStatus,
        voucherDesc: dataForm.proof,
        imgUrls: dataForm.imgs
      }).then(() => {
        ElMessage({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            isSubmit = false
            visible.value = false
            emit('refreshData')
          }
        })
      }).catch(() => {
        isSubmit = false
      })
    }
  })
}

defineExpose({
  init
})
</script>
