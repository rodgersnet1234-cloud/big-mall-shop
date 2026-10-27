<template>
  <div class="im-msg-biz-slills">
    <div class="new-page-title">
      <div class="line" />
      <div class="text">
        {{ $t("imMsgBizSkills.automaticReply") }}
      </div>
    </div>
    <div class="im-msg-content">
      <div class="im-msg-letf">
        <div
          class="content-box"
        >
          <el-form
            label-position="left"
          >
            <el-form-item
              class="el-form-item"
              :label="$t('imMsgBizSkills.enablingStatus')"
            >
              <el-switch
                v-model="imAutoReplyData.status"
                @change="onChangeState"
              />
              <div class="status-tips">
                <div>{{ $t('imMsgBizSkills.enablingStatusTips') }}</div>
                <div>{{ $t('imMsgBizSkills.enablingStatusTips2') }}</div>
              </div>
            </el-form-item>
          </el-form>
          <div class="checkbox-msg">
            <el-checkbox
              v-model="imAutoReplyData.content.sendTextState"
              :label="$t('imMsgBizSkills.sendTextMessage')"
              name="type"
              @change="changeSendTextState"
            />
            <div class="text-msg">
              <p style="margin: 0">
                {{ $t('imMsgBizSkills.content') }}:
              </p>
              <div>
                <div class="content">
                  <div v-if="editText">
                    <el-input
                      v-model="content"
                      class="tarea"
                      type="textarea"
                      maxlength="500"
                    />
                    <div class="count">
                      <div class="count-text">
                        {{ $t('imMsgBizSkills.canAlsoInput') }}
                        <i>
                          {{ remainingCount }}
                        </i>
                        {{ $t('imMsgBizSkills.words') }}
                      </div>
                    </div>
                    <div class="save-btn">
                      <el-button
                        style="margin-right: 10px;"
                        type="primary"
                        @click="onSave"
                      >
                        {{ $t('imMsgBizSkills.confirm') }}
                      </el-button>
                      <el-button @click="editText = !editText">
                        {{ $t('imMsgBizSkills.cancel') }}
                      </el-button>
                    </div>
                  </div>
                  <span
                    v-else
                    class="show-text"
                  >
                    <span>
                      {{ imAutoReplyData.content.content }}
                    </span>
                    <el-icon
                      size="18"
                      class="el-icon-edit"
                      @click="onEditText"
                    >
                      <EditPen />
                    </el-icon>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div style="margin-top:10px">
            <div class="checkbox">
              <el-checkbox
                v-model="imAutoReplyData.content.sendIssusState"
                :label="$t('imMsgBizSkills.sendCommonQuestions')"
                name="type"
                @change="changeCommonQuestion"
              />
              <p class="max-msg">
                {{ $t('imMsgBizSkills.addUpToTenItems') }}
              </p>
            </div>
            <div class="issues-box">
              <div
                v-if="imAutoReplyData.content.issues?.length<10||!imAutoReplyData.content.issues"
                class="default-btn add-issues-btn"
                @click="onAddOrUpdate()"
              >
                {{ $t('imMsgBizSkills.addQuestion') }}
              </div>

              <el-table
                :data="imAutoReplyData.content.issues"
                style="width: 100%"
                header-cell-class-name="table-header"
                row-class-name="table-row-low"
              >
                <el-table-column
                  label="序号"
                  width="80"
                >
                  <template #default="scope">
                    <div>
                      {{ scope.$index+1 }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="issues"
                  :label="$t('imMsgBizSkills.question')"
                  width="250"
                />
                <el-table-column
                  prop="content"
                  label="回复内容"
                  width="auto"
                />
                <el-table-column
                  align="right"
                  label="操作"
                  width="200"
                >
                  <template #default="scope">
                    <el-button
                      v-if="scope.$index!==0"
                      type="primary"
                      link
                      @click="updateList(scope.$index,'up')"
                    >
                      {{ $t('imMsgBizSkills.up') }}
                    </el-button>
                    <el-button
                      v-if="scope.$index<imAutoReplyData.content.issues.length-1"
                      type="primary"
                      link
                      @click="updateList(scope.$index,'down')"
                    >
                      {{ $t('imMsgBizSkills.down') }}
                    </el-button>
                    <el-button
                      type="primary"
                      link
                      @click="onAddOrUpdate(scope.row.id)"
                    >
                      {{ $t('imMsgBizSkills.edit') }}
                    </el-button>
                    <el-button
                      type="primary"
                      link
                      @click="removeItem(scope.row.id)"
                    >
                      {{ $t('imMsgBizSkills.delete') }}
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div
              class="default-btn primary-btn"
              @click="onSubmit"
            >
              {{ $t('imMsgBizSkills.save') }}
            </div>
          </div>
        </div>
      </div>
      <div class="im-msg-right">
        <div class="dialog-preview">
          {{ '对话预览' }}
        </div>
        <div class="message-box">
          <div class="navigation-bar">
            <el-icon><ArrowLeft /></el-icon>
            <div class="user-name">
              {{ userName }}
            </div>
          </div>
          <div class="msg-box">
            <div class="user-send">
              <div class="bubble">
                {{ '你好' }}
              </div>
              <div class="image">
                <img
                  src="@/assets/chat/userImg.jpg"
                  alt=""
                >
              </div>
            </div>
            <div
              v-if="imAutoReplyData.content.sendTextState||imAutoReplyData.content.sendIssusState"
              class="service-send"
            >
              <div class="image">
                <img-show
                  :src="avatar"
                />
              </div>
              <div
                class="bubble"
              >
                <div
                  v-if="imAutoReplyData.content.sendTextState"
                  class="text"
                >
                  {{ imAutoReplyData.content.content || content }}
                </div>
                <ul v-if="imAutoReplyData.content.sendIssusState">
                  <li
                    v-for="item in imAutoReplyData.content.issues"
                    :key="item.id"
                  >
                    • {{ item.issues }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="reply">
            <div class="input-box" />
            <img
              src="@/assets/chat/add.png"
            >
            <el-button class="send-btn">
              {{ $t('chat.send') }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="refreshChange"
    />
  </div>
</template>
<script setup>
import addOrUpdate from './add-or-update.vue'
import * as http from '@/api/im-msg-biz-skills'
import { ElMessage } from 'element-plus'
import { Debounce } from '@/utils/debounce.js'

const userStore = useUserStore()
const userName = computed(() => {
  return userStore.name
})
const avatar = computed(() => {
  return userStore.avatar
})
const editText = ref(false)
const onEditText = () => {
  content.value = imAutoReplyData.value.content.content
  editText.value = !editText.value
}

const imAutoReplyData = ref({
  content: { sendIssusState: false, sendTextState: false },
  status: false
})
const issuesArr = ref([])
const dataInfo = ref(false)
const infoStatus = {
  sendIssusState: false,
  sendTextState: false
}
onMounted(() => {
  imAutoReplyInfo()
})
const imAutoReplyInfo = () => {
  http.getImAutoReply().then((data) => {
    dataInfo.value = !data
    if (data?.content) {
      data.content = JSON.parse(data.content)
      imAutoReplyData.value = data
      infoStatus.sendIssusState = imAutoReplyData.value.content.sendIssusState
      infoStatus.sendTextState = imAutoReplyData.value.content.sendTextState
      imAutoReplyData.value.status = !!imAutoReplyData.value.status
    }
  })
}
const updateData = ref({ type: -1 })
const onSave = () => {
  if (!content.value || typeof content.value !== 'string' || content.value.trim() === '') {
    return ElMessage({
      message: $t('imMsgBizSkills.noNull'),
      type: 'warning',
      duration: 1500,
      onClose: () => {}
    })
  }
  imAutoReplyData.value.content.content = content.value
  editText.value = false
}
const onChangeState = (state) => {
  if (state && !imAutoReplyData.value.content.sendTextState && !imAutoReplyData.value.content.sendIssusState) {
    imAutoReplyData.value.status = false
    return ElMessage({
      message: $t('imMsgBizSkills.checkOneOptions'),
      type: 'warning',
      duration: 1500,
      onClose: () => {}
    })
  }
}
const addOrUpdateVisible = ref(false)
const addOrUpdateRef = ref(null)
const onAddOrUpdate = (id) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(id, imAutoReplyData.value.content.issues)
  })
}
let result
const refreshChange = (obj) => {
  issuesArr.value.push(obj)
  if (imAutoReplyData.value.content.issues) {
    imAutoReplyData.value.content.issues = replaceItem(imAutoReplyData.value.content.issues, obj)
    result = mergeArraysAndRemoveDuplicates(issuesArr.value, imAutoReplyData.value.content.issues)
  }
  imAutoReplyData.value.content.issues = result || issuesArr.value
  issuesArr.value = []
}
const mergeArraysAndRemoveDuplicates = (arrayA, arrayB) => {
  const mergedArray = arrayB.concat(arrayA)
  const uniqueObjects = Array.from(new Set(mergedArray.map(obj => obj.id))).map(id => {
    return mergedArray.find(obj => obj.id === id)
  })
  return uniqueObjects
}
// 移动数组
const updateList = (index, direction) => {
  const newList = [...imAutoReplyData.value.content.issues]
  if (direction === 'up' && index > 0) {
    // 上移操作
    [newList[index], newList[index - 1]] = [newList[index - 1], newList[index]]
  } else if (direction === 'down' && index < newList.length - 1) {
    // 下移操作
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]]
  }
  imAutoReplyData.value.content.issues = newList
}
// 删除
const removeItem = (id) => {
  imAutoReplyData.value.content.issues = imAutoReplyData.value.content.issues.filter(item => item.id !== id)
}
// 编辑
const replaceItem = (array, newItem) => {
  return array.map(item => {
    if (item.id === newItem.id) {
      return { ...newItem }
    }
    return item
  })
}
const changeCommonQuestion = (e) => {
  if (e && (!imAutoReplyData.value.content.issues || imAutoReplyData.value.content.issues.length === 0)) {
    imAutoReplyData.value.content.sendIssusState = !e
    return ElMessage({
      message: $t('imMsgBizSkills.questionEmpty'),
      type: 'warning',
      duration: 1500,
      onClose: () => {}
    })
  }
}
const changeSendTextState = (e) => {
  if (e && !imAutoReplyData.value.content.content) {
    imAutoReplyData.value.content.sendTextState = !e
    return ElMessage({
      message: $t('imMsgBizSkills.messageEmpty'),
      type: 'warning',
      duration: 1500,
      onClose: () => {}
    })
  }
}
const onSubmit = Debounce(() => {
  updateData.value.content = imAutoReplyData.value.content.content
  updateData.value.sendIssusState = imAutoReplyData.value.content.sendIssusState && imAutoReplyData.value.content.issues.length > 0
  updateData.value.sendTextState = imAutoReplyData.value.content.sendTextState
  updateData.value.issues = imAutoReplyData.value.content.issues
  if (!updateData.value.sendIssusState && !updateData.value.sendTextState) {
    imAutoReplyData.value.status = false
  }
  if (imAutoReplyData.value.status && !imAutoReplyData.value.content.sendTextState && !imAutoReplyData.value.content.sendIssusState) {
    return ElMessage({
      message: $t('imMsgBizSkills.checkOneOptions'),
      type: 'warning',
      duration: 1500,
      onClose: () => {}
    })
  }
  if (!updateData.value.content && (!updateData.value.issues || updateData.value.issues.length === 0)) {
    return ElMessage({
      message: $t('imMsgBizSkills.replyContentEmpty'),
      type: 'warning',
      duration: 1500,
      onClose: () => {}
    })
  }
  const handleRequest = (httpMethod, data) => {
    httpMethod(data).then(() => {
      imAutoReplyInfo()
      ElMessage({
        message: $t('shopFeature.list.operSuccess'),
        type: 'success',
        duration: 1500
      })
    })
  }

  const data = {
    autoReplyId: imAutoReplyData.value.autoReplyId,
    content: JSON.stringify(updateData.value),
    shopId: imAutoReplyData.value.shopId,
    status: imAutoReplyData.value.status ? 1 : 0
  }
  if (dataInfo.value) {
    handleRequest(http.saveImAutoReply, data)
  } else {
    handleRequest(http.updateImAutoReply, data)
  }
})
const content = ref('')
const maxCharCount = 500
const remainingCount = ref(500)
watch(() => content.value, () => {
  remainingCount.value = content.value ? maxCharCount - content.value.length : maxCharCount
}, { deep: true })
</script>
<style lang="scss" scoped>
.im-msg-biz-slills {
  padding: 20px;
  .new-page-title {
    width: 100%;
    height: 62px;
    background: #F7F8FA;
    box-sizing: border-box;
    padding: 19px 20px;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  .line {
    width: 4px;
    height: 19px;
    background: #155BD4;
    opacity: 1;
    border-radius: 2px;
    margin-right: 10px;
  }
  .text {
    font-size: 18px;
    font-weight: bold;
    color: #333333;
    opacity: 1;
  }
  }
  .im-msg-content{
    display: flex;
    justify-content: space-around;
  }
  .im-msg-letf {
    border-right: 1px solid #f7f8fa;
    width: 80%;
   .content-box{
     padding: 0 20px;
     :deep(.el-form-item__content){
       display: flex;
       flex: 1;
       line-height: 32px;
       position: relative;
       font-size: var(--font-size);
       min-width: 0;
       align-items: flex-start;
     }
   }
   .status-tips {
    flex: 1;
    color: #999999;
    margin-left: 20px;
    font-weight: 900;
   }
   .checkbox-msg {
     width: 500px;
     .text-msg{
      display: flex;
      align-items: center;
      margin: 15px 0 0 24px;
      font-size: 14px;
      .content {
        position: relative;
        width: 350px;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        word-break: break-word;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        overflow: hidden;
        -webkit-box-orient: vertical;
        line-height: 20px;
        margin-left:8px;
      }
      .save-btn{
        margin-top: 30px;
      }
      .show-text{
        background: #f9f9f9;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 8px;
      }
     }
   }
   :deep(.el-button) {
      margin: 0;
   }
   .button-list > *:not(:last-child)::after {
      content: "|";
      margin: 0 5px;
      color: #999;
   }
   .checkbox{
      display: flex;
      .max-msg {
        margin: 8px 0 0 10px;
        font-size: 14px;
        color: #999;
      }
   }
   :deep(textarea) {
    height: 100px;
    width: 100%;
    border: none;
    outline: none;
    font-family: "Micrsofot Yahei";
    resize: none;
    border-radius: 1px;
    box-shadow:0 0 0 1px var(--el-input-border-color,var(--el-border-color)) inset;
   }
   :deep(.el-textarea__inner:focus){
  box-shadow:0 0 0 1px var(--el-input-border-color,var(--el-border-color)) inset
   }
   .count{
    height: 25px;
    line-height: 25px;
    position: absolute;
    bottom: 38px;
    width: 100%;
    color: var(--el-input-border-color, var(--el-border-color));
    font-size: 12px;
    box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
    .count-text {
      position: absolute;
      right: 6px;
    }
   }
   .default-btn.primary-btn{
    margin-top: 50px;
   }
  }
  .add-issues-btn{
    margin: 15px 0 50px 20px;
  }
  .im-msg-right {
    width: 16%;
    height: 500px;
    margin-top: 60px;
    .dialog-preview{
      text-align: center;
      margin-bottom: 15px;
      font-weight: 900;
    }
    .message-box{
      border: 1px solid #ebebeb;
    }
    .navigation-bar {
      display: flex;
      height: 35px;
      line-height: 35px;
      background: #fff;
      border-bottom: 1px solid #ebebeb;
      :deep(.el-icon) {
        height: 35px;
      }
      .user-name{
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: center;
      }
    }
    .msg-box {
      height: 430px;
      padding-right: 5px;
      padding-left: 5px;
      background: #f5f6fa;
      overflow-y: auto;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        /*隐藏滚轮*/
        display: none;
      }
      .image{
        width: 26px;
        height: 26px;
        img{
         vertical-align: middle;
         max-width: 100%;
        }
      }
      .user-send {
        display: flex;
        justify-content: flex-end;
        padding-top: 10px;
        .bubble {
          position: relative;
          margin-right: 4px;
          padding: 5px 8px;
          word-break: break-all;
          background: #9ee559;
          border-radius: 5px;
          max-width: 180px;
          &:before{
            content: "";
            position: absolute;
            right: -10px;
            top: 5px;
            border: 6px solid;
            border-color: transparent transparent transparent #9ee559;
          }
        }
      }
      .service-send{
        display: flex;
        justify-content: flex-start;
        padding-top: 20px;
        .bubble {
          max-width: 70%;
          position: relative;
          margin-left: 4px;
          padding: 5px 8px;
          word-break: break-all;
          background: #fff;
          border-radius: 5px;
          white-space:normal;
          word-break:break-all;
          word-wrap:break-word;
          font-size: 14px;
          .text {
            margin-bottom: 8px;
          }
          ul,li{
           margin: 0;
           padding: 0;
           list-style: none;
           color: #409eff;
          }
          &:after{
            content: "";
            position: absolute;
            width: 0;
            height: 0;
            left: -7px;
            top: 7px;
            border: 4px solid;
            border-color: transparent #fff transparent transparent;
          }
        }

      }
    }
    .reply{
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 33px;
      padding: 5px;
      background-color: #fff;
      .input-box {
        width: 65%;
        padding: 0 2%;
        height: 22px;
        border: 1px solid #ddd;
        border-radius: 16px;
      }
      img{
        width: 22px;
        height: 22px;
      }
      .send-btn{
       width: 40px;
       height: 22px;
       background: #E43130;
       border-radius: 16px;
       font-size: 12px;
       font-family: PingFang SC;
       font-weight: 400;
       color: #fff;
       text-align: center;
      }
    }
  }
  .default-btn{
    margin-left: 0;
  }
}
</style>
