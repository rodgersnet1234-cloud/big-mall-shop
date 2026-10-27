<template>
  <el-dialog
    v-model="visible"
    :title="!isEdit ? '查看': '编辑'"
    :close-on-click-modal="false"
    width="700px"
    class="page-prod-comment-add-or-update"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-width="80px"
      @submit.prevent
      @keyup.enter="onSubmit()"
    >
      <div v-if="!isEdit">
        <el-row>
          <el-col :span="12">
            <!-- 记录时间 -->
            <el-form-item
              label="记录时间"
              prop="userName"
            >
              <el-input
                v-model="dataForm.createTime"
                :readonly="true"
                :disabled="!isEdit"
              />
            </el-form-item>
            <!-- IP来源 -->
            <el-form-item
              label="IP来源"
              prop="userName"
            >
              <el-input
                v-model="dataForm.postip"
                :readonly="true"
                :disabled="!isEdit"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 回复时间 -->
            <el-form-item
              label="回复时间"
              prop="userName"
              :readonly="true"
            >
              <el-input
                v-model="dataForm.replyTime"
                :readonly="true"
                :disabled="!isEdit"
              />
            </el-form-item>
            <!-- 评价得分 -->
            <el-form-item
              label="评价得分"
              prop="score"
            >
              <el-input
                v-model="dataForm.score"
                :readonly="true"
                :disabled="!isEdit"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 评论内容 -->
        <el-form-item
          label="评论内容"
          prop="userName"
        >
          <el-input
            v-model="dataForm.content"
            type="textarea"
            :rows="4"
            :readonly="true"
            :disabled="!isEdit"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <!-- 掌柜回复 -->
        <el-form-item
          label="掌柜回复"
          type="textarea"
          prop="userName"
        >
          <el-input
            v-model="dataForm.replyContent"
            type="textarea"
            :rows="4"
            :readonly="!isEdit"
            :disabled="!isEdit"
            maxlength="480"
            show-word-limit
          />
        </el-form-item>
        <!-- 评论图片 -->
        <el-form-item
          label="评论图片"
          prop="userName"
        >
          <div v-if="!pics">
            无
          </div>
          <imgs-upload
            v-model="pics"
            :disabled="true"
            :modal="false"
            :prompt="false"
          />
        </el-form-item>
        <!-- 是否匿名 -->
        <el-form-item
          label="是否匿名"
          prop="isAnonymous"
        >
          <el-radio-group
            v-model="dataForm.isAnonymous"
            :disabled="true"
          >
            <el-radio :label="1">
              是
            </el-radio>
            <el-radio :label="0">
              否
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <div v-if="isEdit">
        <el-form-item
          label="掌柜回复"
          type="textarea"
          prop="replyContent"
          class="textarea-right"
        >
          <el-input
            v-model="dataForm.replyContent"
            type="textarea"
            :rows="5"
            :readonly="!isEdit"
            :disabled="!isEdit"
            maxlength="480"
            show-word-limit
          />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          @click="visible = false"
        >
          取消
        </el-button>
        <el-button
          v-if="isEdit"
          type="primary"
          @click="onSubmit()"
        >
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/product/prod-comm'
import { ElMessage } from 'element-plus'

const emit = defineEmits([
  'refreshDataList'
])

const dataFormRef = ref()
const dataForm = ref({
  prodCommId: null,
  prodId: null,
  spuCommId: null,
  orderItemId: null,
  userId: null,
  content: null,
  replyContent: null,
  recTime: null,
  replyTime: null,
  replySts: null,
  postip: null,
  score: null,
  usefulCounts: null,
  photoJson: null,
  isAnonymous: null,
  status: 1,
  createTime: null
})
const dataRule = ref({})

// 初始化
const isEdit = ref(false)
const pics = ref('')
const visible = ref(false)
const init = (spuCommId, isEditVal) => {
  isEdit.value = isEditVal
  dataForm.value.spuCommId = spuCommId || 0
  visible.value = true
  pics.value = ''
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (dataForm.value.spuCommId) {
      api.get(dataForm.value.spuCommId).then(data => {
        dataForm.value = data
        pics.value = data.pics
      })
    }
  })
}

// 表单提交
const onSubmit = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      if (!dataForm.value.replyContent) {
        ElMessage({
          message: '回复内容不能为空！',
          type: 'error',
          duration: 1500
        })
        return
      }
      api.update(dataForm.value).then(() => {
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
}

defineExpose({
  init
})
</script>

<style scoped lang="scss">
.page-prod-comment-add-or-update {
  .textarea-right :deep(.el-textarea__inner){
    padding-right: 50px;
    padding-bottom: 20px;
  }
  .textarea-right :deep(.el-textarea .el-input__count) {
    right: 21px;
  }
}
</style>
