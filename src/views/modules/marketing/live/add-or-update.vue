<template>
  <div class="live-room-manage app-container">
    <div class="new-page-title">
      <div class="line" />
      <div class="text">
        {{
          !dataForm.roomId ? $t('live.addNewLiveRoom') : $t('live.viewLRoomInfo')
        }}
      </div>
    </div>
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-width="120px"
      @submit.prevent
      @keyup.enter="onSubmit()"
    >
      <el-form-item
        :label="$t('live.liveName')"
        prop="name"
      >
        <el-input
          v-model.trim="dataForm.name "
          :disabled="dataForm.liveStatus !== 0"
          maxlength="17"
          show-word-limit
          style="width:562px"
        />
      </el-form-item>
      <el-form-item
        :label="$t('live.anchorName')"
        prop="nickName"
      >
        <el-input
          v-model="dataForm.nickName"
          maxlength="15"
          :disabled="dataForm.liveStatus !== 0 && dataForm.liveStatus !== 3"
          show-word-limit
          style="width:562px"
        />
        <p class="live-tips">
          {{ $t("live.liveTip1") }}
        </p>
      </el-form-item>
      <el-form-item
        :label="$t('live.anchorMobile')"
        prop="userMobile"
      >
        <el-input
          v-model="dataForm.userMobile"
          :maxlength="11"
          :disabled="dataForm.liveStatus !== 0 && dataForm.liveStatus !== 3"
          show-word-limit
          style="width:562px"
        />
      </el-form-item>
      <el-form-item
        :label="$t('live.liveTime')"
        class="liveTime"
      >
        <div class="live-time-row">
          <el-form-item prop="startTime">
            <el-date-picker
              v-model="dataForm.startTime"
              :disabled="dataForm.liveStatus !== 0 || isDisabledDate"
              type="date"
              style="width:140px"
              :disabled-date="disabledDate"
              :placeholder="$t('live.chooseStartDate')"
              value-format="YYYY-MM-DD"
              @change="onChangeTime"
            />
            <el-time-select
              v-model="startTimeValue"
              start="00:00"
              step="00:30"
              end="23:30"
              style="width:125px"
              :disabled="dataForm.liveStatus !== 0 || isDisabledDate"
              placeholder="开始时间"
              @change="onChangeTime"
            />
          </el-form-item>
          <div class="tip">
            至
          </div>
          <el-form-item prop="endTime">
            <el-date-picker
              v-model="dataForm.endTime"
              :disabled="dataForm.liveStatus !== 0 || isDisabledDate"
              type="date"
              style="width:140px"
              :disabled-date="disabledDate"
              :placeholder="$t('live.chooseEndDate')"
              value-format="YYYY-MM-DD"
              @change="onChangeTime"
            />
            <el-time-select
              v-model="endTimeValue"
              start="00:00"
              step="00:30"
              end="23:30"
              style="width:125px"
              :disabled="dataForm.liveStatus !== 0 || isDisabledDate"
              placeholder="结束时间"
              @change="onChangeTime"
            />
          </el-form-item>
        </div>
        <p class="live-tips">
          {{ $t("live.liveTip2") }}
        </p>
      </el-form-item>
      <el-form-item
        :label="$t('live.liveBackgroundImage')"
        prop="coverImg"
        :class="{'my-is-error':dataForm.coverImg}"
      >
        <img-upload
          v-model="dataForm.coverImg"
          :disabled="dataForm.liveStatus !== 0"
          @update:model-value="onValidateField('coverImg')"
        />
        <p class="live-tips">
          {{ $t("live.recommendedSize") }}：1080{{ $t("live.pixel") }} * 1920{{ $t("live.pixel") }}
        </p>
      </el-form-item>
      <!-- <el-form-item
        :label="$t('live.anchorSharingPicture')"
        prop="shareImg"
        :class="{'my-is-error':dataForm.shareImg}"
      >
        <img-upload
          v-model="dataForm.shareImg"
          :disabled="dataForm.liveStatus !== 0"
        />
        <p class="live-tips">
          {{ $t("live.recommendedSize") }}：800{{ $t("live.pixel") }} * 640{{ $t("live.pixel") }}
        </p>
      </el-form-item> -->
      <el-form-item
        :label="$t('live.liveCoverImage')"
        prop="feedsImg"
        :class="{'my-is-error':dataForm.feedsImg}"
      >
        <img-upload
          v-model="dataForm.feedsImg"
          :disabled="dataForm.liveStatus !== 0"
          @update:model-value="onValidateField('feedsImg')"
        />
        <p class="live-tips">
          {{ $t("live.recommendedSize") }}：800{{ $t("live.pixel") }} * 800{{ $t("live.pixel") }}
        </p>
      </el-form-item>
      <el-form-item
        label="直播商品"
        style="width: 900px"
        class="prods-box"
        required
      >
        <el-row>
          <el-col
            v-for="(liveProd, index) in liveRoomProdList"
            :key="index"
            :span="4"
            style="margin-bottom: 10px;"
          >
            <el-card
              :body-style="{ padding: '0px' }"
              style="height: 160px; width: 120px"
            >
              <ImgShow
                :src="liveProd.mainImgUrl"
                :img-style="{width:'100%',height:'104px'}"
              />
              <div class="card-prod-bottom">
                <div class="card-prod-name">
                  {{ liveProd.spuName }}
                </div>
                <el-button
                  type="primary"
                  link
                  :disabled="dataForm.liveStatus !== 0"
                  class="card-prod-name-button"
                  @click="deleteProd(index)"
                >
                  {{ $t("table.delete") }}
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-button
          v-if="dataForm.liveStatus === 0"
          plain
          @click="onProdsSelect()"
        >
          {{ $t("discount.discount.selectProd") }}
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          @click="onBack()"
        >
          取消
        </el-button>
        <el-button
          v-if="dataForm.liveStatus === 0 || dataForm.liveStatus === 3"
          type="primary"
          @click="onSubmit()"
        >
          确定
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 商品选择弹窗-->
    <prods-select
      v-if="prodsSelectVisible"
      ref="prodsSelectRef"
      :spu-type="null"
      @refresh-select-prods="selectLiveProds"
    />
  </div>
</template>

<script setup>
import ImgUpload from '@/components/img-upload/index.vue'
import ProdsSelect from '@/components/prods-select/index.vue'
import * as api from '@/api/live/index'
import { ElMessage } from 'element-plus'
import { getDateTimeRange, getParseTime } from '@/utils/datetime'
import { isMobile } from '@/utils/validate.js'

const isSubmit = ref(false)
const dataFormRef = ref(null)
const dataForm = reactive({
  roomId: null,
  name: null,
  nickName: null,
  userMobile: null,
  coverImg: null,
  shareImg: null,
  feedsImg: null,
  liveStatus: null,
  startTime: null,
  endTime: null,
  status: null,
  spuIds: []
})
const startTimeValue = ref('')
const endTimeValue = ref('')
const liveRoomProdList = ref([])

const validatorDateRange = (rule, value, callback) => {
  if (rule.field === 'startTime' && (!startTimeValue.value || !dataForm.startTime)) {
    callback(new Error('不能为空'))
  }
  if (rule.field === 'endTime' && (!endTimeValue.value || !dataForm.endTime)) {
    callback(new Error('不能为空'))
  }
  if (dataForm.liveStatus === 3 || isDisabledDate.value) {
    callback()
  }
  const startTime = dataForm.startTime + ' ' + startTimeValue.value + ':00'
  const endTime = dataForm.endTime + ' ' + endTimeValue.value + ':00'
  if (rule.field === 'startTime' && new Date() > Date.parse(startTime)) {
    callback(new Error('开始时间不能少于当前时间'))
  }
  if (rule.field === 'startTime' && Date.parse(startTime) >= Date.parse(endTime)) {
    callback(new Error('开始时间不能大于或等于结束时间'))
  }
  if (rule.field === 'endTime' && Date.parse(startTime) >= Date.parse(endTime)) {
    callback(new Error('结束时间不能小于或等于开始时间'))
  }
  if (rule.field === 'endTime' && new Date() > Date.parse(endTime)) {
    callback(new Error('结束时间不能少于当前时间'))
  }
  callback()
}

const validateMobile = (rule, value, callback) => {
  if (isMobile(value) || (dataForm.roomId && isStarMobile(value))) {
    callback()
  } else {
    callback(new Error('请输入正确的手机号'))
  }
}

const dataRule = reactive({
  name: [
    { required: true, message: $t('live.liveRoomNameCannotBeEmpty'), trigger: 'blur' }
  ],
  nickName: [
    { required: true, message: $t('live.anchoBeEmp'), trigger: 'blur' }
  ],
  userMobile: [
    { required: true, message: $t('live.mobilePhoneNoNull'), trigger: 'blur' },
    { validator: validateMobile, trigger: 'blur' }
  ],
  coverImg: [
    { required: true, message: $t('live.backEmpty'), trigger: ['blur', 'input'] }
  ],
  // shareImg: [
  //   { required: true, message: $t('live.hostSnPict'), trigger: ['blur', 'input'] }
  // ],
  feedsImg: [
    { required: true, message: $t('live.liveEmpty'), trigger: ['blur', 'input'] }
  ],
  startTime: [
    { required: true, message: $t('table.noNull'), trigger: 'blur' },
    { required: true, validator: validatorDateRange, trigger: 'blur' }
  ],
  endTime: [
    { required: true, message: $t('table.noNull'), trigger: 'blur' },
    { required: true, validator: validatorDateRange, trigger: 'blur' }
  ]
})

// 时间选择变化时检验
const onChangeTime = () => {
  onValidateField('startTime')
  onValidateField('endTime')
}

const onValidateField = (field) => {
  dataFormRef.value?.validateField(field)
}

onMounted(() => {
  const flag = sessionStorage.getItem('cloudLiveRoomData') !== 'undefined'
  const data = flag ? JSON.parse(sessionStorage.getItem('cloudLiveRoomData')) : null
  init(data)
  const title = !dataForm.roomId ? $t('live.addNewLiveRoom') : $t('live.viewLRoomInfo')
  useCommonStore().replaceSelectMenu(title)
})

const isDisabledDate = ref(false) // 是否禁用时间选择
const init = (data) => {
  if (data) {
    dataForm.roomId = data.roomId
    dataForm.name = data.name
    dataForm.nickName = data.nickName
    dataForm.userMobile = data.userMobile
    dataForm.coverImg = data.coverImg
    dataForm.shareImg = data.shareImg
    dataForm.feedsImg = data.feedsImg
    dataForm.liveStatus = data.liveStatus
    dataForm.startTime = data.startTime
    dataForm.endTime = data.endTime
  } else {
    dataForm.liveStatus = 0
  }
  isSubmit.value = false
  nextTick(() => {
    dataFormRef.value?.resetFields()
    const datetimeRange = getDateTimeRange()
    dataForm.startTime = datetimeRange.startTime
    dataForm.endTime = datetimeRange.endTime
    startTimeValue.value = datetimeRange.currentTime
    endTimeValue.value = datetimeRange.currentTime
    if (dataForm.roomId) {
      api.getLiveRoomInfo(dataForm.roomId)
        .then((data) => {
          dataForm.roomId = data.roomId
          dataForm.name = data.name
          dataForm.nickName = data.nickName
          dataForm.userMobile = data.userMobile
          dataForm.liveStatus = data.liveStatus
          dataForm.coverImg = data.coverImg
          dataForm.shareImg = data.shareImg
          dataForm.feedsImg = data.feedsImg
          dataForm.startTime = data.startTime
          dataForm.endTime = data.endTime
          dataForm.status = data.status
          startTimeValue.value = dataForm.startTime ? dataForm.startTime.substring(11, dataForm.startTime.length - 3) : ''
          endTimeValue.value = dataForm.endTime ? dataForm.endTime.substring(11, dataForm.endTime.length - 3) : ''
          dataForm.startTime = getParseTime(dataForm.startTime, '{y}-{m}-{d}')
          dataForm.endTime = getParseTime(dataForm.endTime, '{y}-{m}-{d}')
          // 当前时间超出开始时间时，开始时间不可修改
          tmepStartTime = data.startTime
          if (new Date() > Date.parse(data.startTime)) {
            isDisabledDate.value = true
          } else {
            startTimeCountDown()
          }
        })
      // 获取直播商品 getLiveRoomProdPage
      api.getLiveRoomProdPage(dataForm.roomId).then((data) => {
        liveRoomProdList.value = data.map(spu => spu.spuSearchVO)
        if (dataForm.status !== null && dataForm.status === -1) {
          // 用户注销
          ElMessage($t('live.liveAnchorNotExist'))
        } else if (dataForm.status !== null && dataForm.status !== 1) {
          // 用户禁用
          ElMessage($t('live.liveAnchorError'))
        }
      })
    }
  })
}

const disabledDate = (time) => {
  return time.getTime() < new Date(new Date().toLocaleDateString()).getTime()
}

let liveTimer = null
let tmepStartTime = ''
const startTimeCountDown = () => {
  if (new Date().getTime() < Date.parse(tmepStartTime)) {
    liveTimer = setTimeout(startTimeCountDown, 1000)
  } else {
    isDisabledDate.value = true
    liveTimer && clearTimeout(liveTimer)
  }
}

// 删除指定商品
const deleteProd = (index) => {
  liveRoomProdList.value.splice(index, 1)
}

// 显示添加指定商品弹框
const prodsSelectVisible = ref(false)
const prodsSelectRef = ref(null)
const onProdsSelect = () => {
  prodsSelectVisible.value = true
  nextTick(() => {
    prodsSelectRef.value?.init(liveRoomProdList.value)
  })
}

// 添加指定商品
const selectLiveProds = (prods) => {
  prodsSelectVisible.value = false
  if (prods) {
    liveRoomProdList.value = prods
  }
}

// 表单提交
const onSubmit = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      if (liveRoomProdList.value.length === 0) {
        ElMessage({
          message: $t('live.liveProdTip'),
          type: 'error',
          duration: 1500
        })
        return
      }
      const startTime = dataForm.startTime
      const endTime = dataForm.endTime
      dataForm.startTime = dataForm.startTime && startTimeValue.value ? dataForm.startTime + ' ' + startTimeValue.value + ':00' : ''
      dataForm.endTime = dataForm.endTime && endTimeValue.value ? dataForm.endTime + ' ' + endTimeValue.value + ':00' : ''
      if (isSubmit.value) {
        return
      }
      dataForm.spuIds = liveRoomProdList.value.map(x => x.spuId)
      isSubmit.value = true
      api.putOrPostLiveRoom({
        method: dataForm.roomId ? 'put' : 'post',
        data: dataForm
      }).then(() => {
        isSubmit.value = true
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            onBack()
          }
        })
      }).catch(() => {
        isSubmit.value = false
      })
      dataForm.startTime = startTime
      dataForm.endTime = endTime
    }
  })
}

const onBack = () => {
  history.back()
}

</script>
<style lang="scss" scoped>
.live-room-manage {
  .live-tips {
    color: #aaa;
    line-height: 20px;
    margin: 0;
    padding: 0;
  }
  .live-time-row {
    display: flex;
    .tip {
      margin: 0 10px;
    }
  }
  .new-page-title {
    width: 100%;
    height: 62px;
    background: #f7f8fa;
    box-sizing: border-box;
    padding: 19px 20px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    margin-bottom: 20px;

    .line{
      width: 4px;
      height: 19px;
      background: #155bd4;
      opacity: 1;
      border-radius: 2px;
      margin-right: 10px;
    }
    .text{
      font-size: 18px;
      font-weight: 700;
      color: #333;
      opacity: 1;
    }
  }
}

.liveTime :deep(.el-form-item__label:before){
  content: '*';
  color: #F56C6C;
  margin-right: 4px;
}

.live-room-manage .el-form  .my-is-error :deep(.el-form-item__error) {
  opacity: 0;
}
.live-room-manage .el-form  .el-form-item .live-time-row :deep(.el-form-item){
  margin-bottom: 0;
}
.live-room-manage .el-form  .el-form-item .live-time-row :deep(.el-form-item__error){
  padding-top:24px ;
}
:deep(.el-form-item__content) {
  display: block;
}
.prods-box {
  .card-prod-bottom {
    .card-prod-name {
      display: block;
      line-height: 16px;
      padding: 0 5px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .card-prod-name-button {
      display: block;
      width: 100%;
      text-align: right;
      padding: 0 5px 0 0;
    }
  }
}
</style>
