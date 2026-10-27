<template>
  <el-dialog
    v-model="visible"
    :title="dataForm.hotSearchId? $t('table.edit'): $t('table.create')"
    :close-on-click-modal="false"
  >
    <el-form
      ref="dataFormRef"
      :rules="rules"
      :model="dataForm"
      label-position="right"
      label-width="80px"
      @submit.prevent
    >
      <!-- 热搜标题 -->
      <el-form-item
        :label="$t('multishop.hotSearch.title')"
        prop="title"
      >
        <el-col :span="20">
          <el-input
            v-model="dataForm.title"
            maxlength="36"
            show-word-limit
          />
        </el-col>
      </el-form-item>
      <!-- 内容 -->
      <el-form-item
        :label="$t('multishop.hotSearch.content')"
        prop="content"
      >
        <el-col :span="20">
          <el-input
            v-model="dataForm.content"
            maxlength="255"
            show-word-limit
          />
        </el-col>
      </el-form-item>
      <!-- 顺序 -->
      <el-form-item
        :label="$t('multishop.hotSearch.seq')"
        prop="seq"
      >
        <el-input-number
          v-model="dataForm.seq"
          controls-position="right"
          style="width: 120px"
          :precision="0"
          :min="0"
          :max="10000000"
          @blur="seqDefault"
        />
      </el-form-item>
      <!-- 状态 0下线 1上线 -->
      <el-form-item
        :label="$t('multishop.hotSearch.status')"
        prop="status"
      >
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">
            {{ '未启用' }}
          </el-radio>
          <el-radio :label="1">
            {{ '启用' }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">
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
import * as api from '@/api/multishop/hot-search'
import { Debounce } from '@/utils/debounce'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataForm = reactive({
  hotSearchId: 0,
  content: null,
  seq: 0,
  status: 1,
  title: null
})

const validate = (rule, value, callback) => {
  if (String(value).trim() === '') {
    callback(new Error('输入不能为空字符串'))
  } else {
    callback()
  }
}

const rules = reactive({
  title: [
    { required: true, message: '标题不能为空', trigger: 'blur' },
    { validator: validate, trigger: 'blur' }
  ],
  content: [
    { required: true, message: '内容不能为空', trigger: 'blur' },
    { validator: validate, trigger: 'blur' }
  ]
})

const dataFormRef = ref('')
const init = (hotSearchId) => {
  dataForm.hotSearchId = hotSearchId || 0
  visible.value = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (!dataForm.hotSearchId) {
      return
    }
    api.get(hotSearchId).then(data => {
      Object.assign(dataForm, data)
      // dataForm = data
    })
  })
}

defineExpose({
  init
})

const seqDefault = () => {
  if (!dataForm.seq) {
    dataForm.seq = 0
  }
}

// 表单提交
const onSubmit = Debounce(() => {
  dataFormRef.value?.validate(valid => {
    if (!valid) {
      return
    }
    const request = dataForm.hotSearchId ? api.update(dataForm) : api.save(dataForm)
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

</script>
