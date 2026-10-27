<template>
  <el-dialog
    v-model="visible"
    class="compoment-customizereason-add-or-update"
    :title="!dataForm.stockChangeReasonId ? $t('stock.addTitle') : '修改'"
    :close-on-click-modal="false"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-width="130px"
      @submit.prevent
      @keyup.enter="onSubmit()"
    >
      <el-form-item
        :label="$t('stock.stockType')"
        prop="type"
      >
        <el-radio
          v-model="dataForm.type"
          :label="1"
          :value="1"
        >
          {{ $t('stock.sendStock') }}
        </el-radio>
        <el-radio
          v-model="dataForm.type"
          :label="2"
          :value="2"
        >
          {{ $t('stock.receiveStock') }}
        </el-radio>
      </el-form-item>
      <el-form-item
        label="出入库原因"
        prop="reason"
      >
        <el-input
          v-model.trim="dataForm.reason"
          maxlength="10"
          type="primary"
          link
        />
      </el-form-item>
      <el-form-item
        label="备注"
        prop="remark"
      >
        <el-input
          v-model="dataForm.remark"
          maxlength="100"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          class="default-btn"
          @click="visible = false"
        >取消</el-button>
        <el-button
          class="default-btn primary-btn"
          type="primary"
          @click="onSubmit()"
        >确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import http from '@/utils/request'
import { changeReason } from '@/api/stock/customizereason'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])
const visible = ref(false)
const dataForm = reactive({
  type: 1,
  reason: null,
  status: null,
  remark: null

})
const dataRule = reactive({
  reason: [
    { required: true, message: '出入库原因不能为空', trigger: 'blur' }
  ],
  type: [
    { required: true, message: $t('stock.stockTypeNotEmpty'), trigger: 'blur' }
  ]
})

const dataFormRef = ref(null)
const init = (stockChangeReasonId, type) => {
  dataForm.stockChangeReasonId = stockChangeReasonId || null
  dataForm.reason = null
  dataForm.status = null
  dataForm.remark = null
  visible.value = true
  if (!stockChangeReasonId) {
    dataForm.type = type === 2 ? 2 : 1
    return
  }
  nextTick(() => {
    dataFormRef.value.resetFields()
    if (dataForm.stockChangeReasonId) {
      http({
        url: '/mall4cloud_product/mp/stock_change_reason',
        method: 'get',
        params:
          { stockChangeReasonId: dataForm.stockChangeReasonId }
      }).then((data) => {
        dataForm.type = data.type
        dataForm.status = data.status
        dataForm.reason = data.reason
        dataForm.remark = data.remark
      })
    }
  })
}
// 表单提交
const onSubmit = Debounce(() => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      // window.removeEventListener
      changeReason({
        method: dataForm.stockChangeReasonId ? 'put' : 'post',
        data: dataForm
      }).then(() => {
        ElMessage({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            visible.value = false
            emit('refreshDataList')
          }
        })
      })
    }
  })
}, 1500)
defineExpose({ init })
</script>
