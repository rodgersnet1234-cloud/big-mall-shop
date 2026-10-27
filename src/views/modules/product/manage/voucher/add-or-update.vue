<template>
  <el-dialog
    v-model="visible"
    class="component-voucher-add-or-update"
    :title="dataForm.voucherId? $t('table.edit'): $t('table.create') + $t('voucher.voucher')"
    :close-on-click-modal="false"
    style="width: 600px;"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-width="80px"
      @submit.prevent
      @keyup.enter="onSubmit()"
    >
      <!-- 卡券名称 -->
      <el-form-item
        :label="$t('voucher.name')"
        prop="name"
      >
        <el-input
          v-model="dataForm.name"
          style="width: 300px"
          maxlength="20"
          show-word-limit
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
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/product/voucher'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])
const visible = ref(false)

const dataFormRef = ref(null)
const dataForm = ref({
  voucherId: 0,
  name: null,
  status: null,
  shopId: null
})

/**
 * 检查 是否包含特殊字符 :;
 * @param rule
 * @param value
 * @param callback
 */
const validateWord = (rule, value, callback) => {
  const reg = /[\\;\\:\\；\\：]/g
  if (reg.test(value)) {
    callback(new Error('不允许包含特殊字符'))
  }
  if (!value.trim()) {
    callback(new Error('卡券名称不能全为空格'))
  }
  callback()
}
const dataRule = reactive({
  name: [
    { required: true, message: '卡券名称不能为空', trigger: 'blur' },
    { validator: validateWord, trigger: 'blur' }
  ]
})
const init = (voucherId) => {
  dataForm.value.voucherId = voucherId || 0
  visible.value = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (!dataForm.value.voucherId) {
      return
    }
    api.get(voucherId).then(data => {
      dataForm.value = data
    })
  })
}

// 表单提交
const onSubmit = Debounce(() => {
  dataFormRef.value.validate(valid => {
    if (!valid) {
      return
    }
    const request = dataForm.value.voucherId ? api.update(dataForm.value) : api.save(dataForm.value)
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
}, 1500)

defineExpose({
  init
})
</script>
