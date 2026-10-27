<template>
  <div class="component-offline-manage">
    <el-dialog
      v-model="operateDialogVisible"
      :close-on-click-modal="false"
      title="申请上线"
      :lock-scroll="true"
      :append-to-body="true"
      :destroy-on-close="true"
      width="750px"
      top="4vh"
      class="operate-dlg"
    >
      <div class="off-shelf-mag">
        <div class="msg">
          <div class="msg-item">
            <div class="tit">
              处理人：
            </div>
            <div class="int">
              {{ offlineDetail.handler }}
            </div>
          </div>
          <div class="msg-item">
            <div class="tit">
              下线时间：
            </div>
            <div class="int">
              {{ offlineDetail.createTime }}
            </div>
          </div>
          <div class="msg-item">
            <div class="tit">
              处理状态：
            </div>
            <el-tag
              v-if="offlineDetail.status === 1"
              type="danger"
            >
              {{ takedown }}
            </el-tag>
            <el-tag
              v-if="offlineDetail.status === 2"
              type="warning"
            >
              等待审核
            </el-tag>
            <el-tag
              v-if="offlineDetail.status === 3"
              type="success"
            >
              审核通过
            </el-tag>
            <el-tag
              v-if="offlineDetail.status === 4"
              type="danger"
            >
              审核未通过
            </el-tag>
          </div>
          <div class="msg-item">
            <div class="tit">
              下线原因：
            </div>
            <div class="int">
              {{ offlineDetail.offlineReason }}
            </div>
          </div>
          <div
            v-if="offlineDetail.status === 1 || offlineDetail.status === 4"
            class="msg-item"
          >
            <div class="tit reason">
              <span class="star">*</span>申请理由：
            </div>
            <div class="int">
              <el-input
                v-model="reapplyReason"
                maxlength="200"
                type="textarea"
              />
            </div>
          </div>
        </div>
        <div
          v-if="offlineDetail.offlineHandleEventItemList && offlineDetail.offlineHandleEventItemList.length > 0"
          class="log"
        >
          <div class="log-tit">
            申请历史
          </div>
          <div
            v-for="(item,index) in offlineDetail.offlineHandleEventItemList"
            :key="index"
            class="log-item"
          >
            <p>申请时间：{{ item.createTime }}</p>
            <div class="ints">
              <div class="ints-tit">
                申请理由：
              </div>
              <div class="ints-content">
                {{ item.reapplyReason }}
              </div>
            </div>
            <p v-if="item.auditTime">
              审核时间：{{ item.auditTime }}
            </p>
            <div
              v-if="item.refuseReason"
              class="ints"
            >
              <div class="ints-tit">
                拒绝原因：
              </div>
              <div class="ints-content">
                {{ item.refuseReason }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            @click="operateDialogVisible = false"
          >
            取消
          </el-button>
          <el-button
            v-if="offlineDetail.status === 1 || offlineDetail.status === 4"
            type="primary"
            @click="onReApplyDataSubmit()"
          >
            提交申请
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ElMessage } from 'element-plus'

defineProps({
  takedown: {
    type: String,
    default: '平台下架'
  }
})

const emit = defineEmits(['onReApplyDataSubmit'])

const operateDialogVisible = ref(false)// 操作对话框
// 最新下线商品
const offlineDetail = reactive({
  eventId: null,
  handler: '',
  createTime: '',
  status: null,
  offlineReason: '',
  offlineHandleEventItemList: []
})
// 申请理由
const reapplyReason = ref('')
const init = (data) => {
  operateDialogVisible.value = true
  offlineDetail.eventId = data.eventId
  offlineDetail.handler = data.handler
  offlineDetail.createTime = data.createTime
  offlineDetail.status = data.status
  offlineDetail.offlineReason = data.offlineReason
  offlineDetail.offlineHandleEventItemList = data.offlineHandleEventItemList
}

// 提交上架申请
const onReApplyDataSubmit = () => {
  if (!reapplyReason.value || !reapplyReason.value.trim()) {
    ElMessage({
      message: '请填写申请理由',
      type: 'warning',
      duration: 1000
    })
    return
  }
  const data = {
    eventId: offlineDetail.eventId,
    reapplyReason: reapplyReason.value
  }
  emit('onReApplyDataSubmit', data)
}
defineExpose({ init })
</script>
<style lang="scss" scoped>
.component-offline-manage {
  :deep(.el-dialog__body) {
    max-height: 100vh;
    overflow-y: auto;
    padding: 10px 20px 10px 15px;
  }
  :deep(.el-dialog__wrapper) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.operate-dlg {
  .off-shelf-mag {
    max-height: 70vh;
    overflow: auto;
    .msg {
      margin-bottom: 10px;
      .msg-item {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        margin-bottom: 20px;
        .tit {
          width: 92px;
          padding-right: 10px;
          text-align-last: justify;
          align-self: flex-start;
        }
        .reason {
          .star {
            color: #e43130;
            padding-right: 2px;
          }
        }
        .int {
          flex: 1;
          word-break: break-word;
        }
      }
    }
    .log {
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
      padding: 10px 0;
      p {
        margin: 0;
        padding: 0;
        line-height: 1.5em;
      }
      .log-tit {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .log-item:not(:last-child) {
        margin-bottom: 8px;
      }
      .ints {
        word-break: break-word;
        display: flex;
        margin: 10px 0;
        &:last-child {
          margin-bottom: 0;
        }
        .ints-content {
          flex: 1;
        }
      }
    }
  }
}
.dialog-footer {
  text-align: right;
  margin-bottom: 10px;
  margin-top: 30px;
}
</style>
