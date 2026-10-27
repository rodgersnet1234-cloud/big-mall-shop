<template>
  <el-dialog
    v-model="visible"
    :title="dataForm.id? $t('table.edit'): $t('table.create')"
    :close-on-click-modal="false"
    width="870px"
    :z-index="1300"
    top="5vh"
    class="page-natice-dialog"
  >
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
    <el-form
      ref="dataFormRef"
      :rules="rules"
      :model="dataForm"
      label-position="right"
      label-width="80px"
      style="margin: 0 20px;"
      @submit.prevent
    >
      <!-- 公告标题 -->
      <el-form-item
        :label="$t('multishop.notice.title')"
        prop="title"
      >
        <el-col :span="14">
          <el-input
            v-model="dataForm.title"
            maxlength="30"
            style="width:550px"
            placeholder="请输入公告标题"
            show-word-limit
          />
        </el-col>
      </el-form-item>
      <!-- 状态(1:公布 0:撤回) -->
      <el-form-item
        :label="$t('multishop.notice.status')"
        prop="status"
      >
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">
            撤销
          </el-radio>
          <el-radio :label="1">
            公布
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 是否置顶 -->
      <el-form-item
        :label="$t('multishop.notice.isTop')"
        prop="isTop"
      >
        <el-radio-group v-model="dataForm.isTop">
          <el-radio :label="0">
            否
          </el-radio>
          <el-radio :label="1">
            是
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 公告内容 -->
      <el-form-item
        :label="$t('multishop.notice.content')"
        prop="content"
      >
        <tiny-mce
          v-if="visible"
          ref="contentRef"
          v-model="dataForm.content"
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
import { ElMessage } from 'element-plus'
import * as api from '@/api/multishop/notice'
// import TinyMce from '@/components/Tinymce'
import { Debounce } from '@/utils/debounce'
// import { isHtmlNull } from '@/utils/index'

const emit = defineEmits(['refreshDataList'])
const contentRef = ref(null)
const dataFormRef = ref(null)
const visible = ref(false)
const dataForm = ref({
  // id: 1, // 公告id
  // shopId: 1, // 店铺id
  title: '', // 公告标题
  content: '', // 公告内容
  status: 1, // 状态(1:公布 0:撤回)
  isTop: 0, // 是否置顶
  type: 2 // 类型(1:平台公告 2:商城公告)
  // publishTime: '' // 发布时间
})

const validateTitle = (rule, value, callback) => {
  if (String(value).trim() === '') {
    callback(new Error('请输入公告标题'))
  } else {
    callback()
  }
}

const validateContent = (rule, value, callback) => {
  if (isHtmlNull(value)) {
    callback(new Error('请输入公告内容'))
  } else {
    callback()
  }
}
watch(() => dataForm.value.content, (newVal) => {
  if (newVal) {
    dataFormRef.value?.clearValidate('content')
  } else if (!newVal) {
    dataFormRef.value?.validateField('content')
  }
}, { deep: true })
const rules = {
  title: [
    { required: true, validator: validateTitle, trigger: 'blur' }
  ],
  content: [
    { required: true, validator: validateContent, trigger: 'blur' }
  ]
}

const init = (id) => {
  dataForm.value.id = id || 0
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (!dataForm.value.id) {
      visible.value = true
      dataForm.value = {
        title: '',
        content: '',
        status: 1,
        isTop: 0,
        type: 2
      }
      return
    }
    api.get(id).then(data => {
      dataForm.value = data
    }).finally(() => {
      visible.value = true
    })
  })
}

// 表单提交
const onSubmit = Debounce(function () {
  dataFormRef.value?.validate(valid => {
    const isContentLimit = LimitWordCount()
    if (!isContentLimit) {
      return ElMessage({
        message: '公告内容字数过多，请重新输入！',
        type: 'error',
        duration: 1500
      })
    }
    if (!valid) {
      return
    }

    const request = dataForm.value.id ? api.update(dataForm.value) : api.save(dataForm.value)
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
/**
 * 富文本字数限制
 */
const LimitWordCount = () => {
  if (!dataForm.value.content) return true
  // 获取富文本中的内容（去标签去空格）
  const contentStr = dataForm.value.content
    .replace(/<[^<>]+>/g, '')
    .replace(/&nbsp;/gi, '')
    .replace(/(\s)+/gi, '')
  // 限制不超过两万字
  return contentStr.length < 20000
}
defineExpose({
  init
})

</script>

<style lang="scss" scoped>
.page-natice-dialog {
  :deep(.el-dialog) {
    min-width: 740px
  }
  :deep(.el-dialog__body) {
    padding: 10px 20px;
  }
}
</style>
