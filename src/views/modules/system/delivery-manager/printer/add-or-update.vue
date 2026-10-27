<template>
  <el-dialog
    v-model="visible"
    class="component-printer-add-or-update"
    :title="dataForm.printerId? $t('table.edit'): $t('table.create')"
    :close-on-click-modal="false"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-position="left"
      label-width="120px"
      style="width: 400px; margin-left:10px;"
      @keyup.enter="onSubmit()"
    >
      <!-- 打印机名称 -->
      <el-form-item
        :label="$t('printer.printerName')"
        prop="printerName"
      >
        <el-input
          v-model.trim="dataForm.printerName"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>
      <!-- 设备码 -->
      <el-form-item
        :label="$t('printer.siid')"
        prop="siid"
      >
        <el-input
          v-model.trim="dataForm.siid"
          maxlength="50"
          show-word-limit
          @input="inputLimit"
        />
        <span style="color: #999999; font-size: 13px">设备码仅支持英文及数字</span>
      </el-form-item>
      <!-- 打印机备注 -->
      <el-form-item
        :label="$t('printer.printerRemark')"
        prop="printerRemark"
      >
        <el-input
          v-model.trim="dataForm.printerRemark"
          maxlength="50"
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
import * as api from '@/api/printer/printer'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])
const visible = ref(false)

const dataFormRef = ref(null)
const dataForm = ref({
  printerId: 0,
  printerName: null,
  siid: null,
  printerRemark: null,
  isDefault: 0
})

const dataRule = reactive({
  printerName: [
    { required: true, message: '打印机名称不能为空', trigger: 'blur' }
  ],
  siid: [
    { required: true, message: '设备码不能为空', trigger: 'blur' }
  ]
})
const init = (printerId) => {
  dataForm.value.printerId = printerId || 0
  visible.value = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (!dataForm.value.printerId) {
      return
    }
    api.get(printerId).then(data => {
      dataForm.value = data
    })
  })
}

// 表单提交
const onSubmit = Debounce(function () {
  dataFormRef.value.validate(valid => {
    if (!valid) {
      return
    }
    const request = dataForm.value.printerId ? api.update(dataForm.value) : api.save(dataForm.value)
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
})
const { proxy } = getCurrentInstance()
const inputLimit = (val) => {
  // 正则匹配英文及数字的字符
  const reg = /[^a-zA-Z0-9]/
  // 查找是否有英文及数字的字符
  // 没有则返回-1，有则返回对应位置
  const n = val.search(reg)
  if (n !== -1) {
    dataForm.value.siid = val.slice(0, n)
    proxy.$forceUpdate()
  }
}
defineExpose({
  init
})
</script>
