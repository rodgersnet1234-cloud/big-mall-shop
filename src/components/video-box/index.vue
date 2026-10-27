<!--
 Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

 https://www.mall4j.com/

 未经允许，不可做商业用途！

 版权所有，侵权必究！
-->
<template>
  <el-dialog
    v-model="visible"
    :title="$t('biz.videobox.videoManager')"
    class="component-video-box append-to-body-dialog"
    top="9vh"
    width="920px"
    :append-to-body="visible"
    @close="closeDialog()"
  >
    <div class="file-group">
      <div class="upload-btn">
        <div class="up-btn">
          <el-button
            v-permission="['resource:video:uploadVideo']"
            type="primary"
            plain
            class="el-icon-top"
            @click="uploadFileBtn"
          >
            上传视频
          </el-button>
        </div>
        <!-- 搜索 -->
        <el-form
          :inline="true"
          :model="dataForm"
          class="demo-form-inline form"
          @submit.prevent
        >
          <el-form-item>
            <el-input
              v-model="fileName"
              style="width: 200px;"
              :placeholder="$t('biz.videobox.videoName')"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="searchImg"
            >
              {{ $t("biz.videobox.query") }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="file-group-box">
        <!-- 左侧栏 -->
        <div class="left-sidebar">
          <div class="group-list">
            <div :class="['group-item', dataForm.attachFileGroupId===0?'active':'']">
              <span
                class="group-name"
                @click="clickOneGroup(0)"
              >全部视频</span>
            </div>
            <div
              v-for="(gItem, gIdx) in groupList"
              :key="gIdx"
              :class="['group-item', dataForm.attachFileGroupId===gItem.attachFileGroupId?'active':'']"
            >
              <span
                class="group-name"
                @click="clickOneGroup(gItem.attachFileGroupId)"
              >{{ gItem.name }}</span>
            </div>
          </div>
        </div>

        <!-- 视频列表 -->
        <div
          v-if="options.activeTab==='pick'"
          class="pick-block"
        >
          <div class="elx-main elx-img-list">
            <div
              v-if="isLoading"
              class="elx-img-list-loading"
            >
              <el-icon class="is-loading">
                <Loading />
              </el-icon>
            </div>
            <div
              v-for="(img, itemIndex) in imgRes"
              :key="itemIndex"
              class="img-item"
            >
              <div
                class="thumb-wp"
                @click.prevent.stop="onClickListImage(img)"
              >
                <video
                  :src="checkFileUrl(img.filePath)"
                  class="showVideo"
                  controls="controls"
                />
              </div>
              <div
                class="title"
                @click="onClickListImage(img)"
              >
                {{ img.fileName }}
              </div>
              <!-- <div class="label" v-if="img.label">{{img.label}}</div> -->
              <span
                v-if="img.selected"
                class="selected"
                @click="onClickListImage(img)"
              >
                <el-icon class="icon"><Check /></el-icon>
              </span>
            </div>
            <div
              v-if="!imgRes.length"
              class="empty"
            >
              暂无视频
            </div>
          </div>

          <el-pagination
            layout="total, prev, pager, next"
            style="float: right;"
            :current-page="page.current"
            :page-size="page.size"
            :total="page.total"
            @current-change="onPageNumChange"
          />

          <div class="elx-foot">
            <el-badge
              v-if="!type"
              :value="files.length"
              class="item"
            >
              <el-button
                type="primary"
                :disabled="files.length == 0"
                @click="onConfirm"
              >
                {{ $t("table.confirm") }}
              </el-button>
            </el-badge>
            <el-button
              v-else
              type="primary"
              :disabled="disabled"
              @click="onConfirm"
            >
              {{ $t("table.confirm") }}
            </el-button>
            <el-button
              v-permission="['resource:video:uploadVideo']"
              type="primary"
              plain
              @click="uploadFileBtn"
            >
              上传视频
            </el-button>
          </div>
        </div>

        <!-- 上传视频 -->
        <div
          v-if="options.activeTab==='upload'"
          class="upload-block"
        >
          <div class="elx-main">
            <div class="upload-title">
              选择视频分组：
            </div>
            <div class="file-gropu-btn">
              <span><el-tag
                v-if="selectGroupName"
                closable
                :disable-transitions="true"
                class="sel-group-name"
                @close="handleClose()"
              >{{ selectGroupName }}</el-tag></span>
              <el-button
                v-if="!selectGroupName"
                type="primary"
                link
                @click="selectOrCreateGroup(0)"
              >
                <el-select
                  v-model="groupForm.attachFileGroupId"
                  clearable
                  placeholder="选择视频分组"
                >
                  <el-option
                    v-for="item in groupList"
                    :key="item.attachFileGroupId"
                    :label="item.name"
                    :value="item.attachFileGroupId"
                  />
                </el-select>
              </el-button>
              <el-button
                v-if="!selectGroupName"
                v-permission="['resource:video:saveVideoGroup']"
                style="margin-left: 10px"
                type="primary"
                link
                @click="selectOrCreateGroup(1)"
              >
                新建分组
              </el-button>
            </div>

            <div class="upload-title">
              {{ $t("biz.videobox.selectLocalVideo") }}
            </div>

            <div class="preview-list">
              <!-- 视频预览 -->
              <div
                v-for="(item, index) in fileList"
                :key="index"
                class="video-preview video-preview-left"
              >
                <video
                  v-if="item.url"
                  class="upShowVideo"
                  :src="item.url"
                  controls="controls"
                  style="width:175px;height:88px;"
                />
                <!-- 显示查看和删除的按钮弹窗 -->
                <div
                  class="avatar-uploader-popup"
                >
                  <el-icon @click="preDeleteVideo(index)">
                    <Delete />
                  </el-icon>
                </div>
              </div>

              <el-upload
                v-show="!uploadFileFlag"
                ref="uploadRef"
                v-model:file-list="fileList"
                :class="['upload-img-preview',hideUploadEdit?'hide':'']"
                list-type="picture-card"
                accept=".mp4,.mov,.wmv "
                action=""
                :multiple="true"
                :http-request="httpRequest"
                :limit="uploadNumberLimit()"
                :on-change="handleAvatarChange"
                :before-upload="beforeUpload"
                :on-exceed="onUploadError"
                :on-remove="onRemove"
                :show-file-list="false"
                :on-progress="onUploadExceedTip"
                :auto-upload="false"
              >
                <el-icon><Plus /></el-icon>
              </el-upload>
            </div>

            <div class="upload-tip">
              {{ uploadTips() }}
            </div>

            <div class="elx-foot">
              <el-button
                type="primary"
                @click="onUploadConfirm"
              >
                {{ $t("biz.videobox.confirmUpload") }}
              </el-button>
            </div>
          </div>
        </div>

        <!-- 选择/创建/修改分组 -->
        <el-dialog
          v-model="showGroupVisible"
          :title="showGroupType===0 ? '选择分组'
            :showGroupType===1?'新建分组':'修改分组名称'"
          :append-to-body="showGroupVisible"
          :close-on-click-modal="false"
          width="600px"
        >
          <el-form
            ref="groupFormRef"
            :model="groupForm"
            label-width="90px"
            style="width:500px"
            @submit.prevent
          >
            <el-form-item
              v-if="showGroupType != 0"
              required
              :rules="[
                { required: true, message: '分组名称不能为空', trigger: 'blur'}
              ]"
              label="分组名称"
              prop="name"
            >
              <el-input
                v-model="groupForm.name"
                placeholder="请输入分组名称"
                show-word-limit
                maxlength="20"
              />
            </el-form-item>
            <el-form-item
              v-if="showGroupType===0"
              label="选择分组"
            >
              <el-select
                v-model="groupForm.attachFileGroupId"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in groupList"
                  :key="item.attachFileGroupId"
                  :label="item.name"
                  :value="item.attachFileGroupId"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <template #footer>
            <div
              class="dialog-footer"
            >
              <el-button
                plain
                @click="showGroupVisible = false"
              >
                {{ $t('table.cancel') }}
              </el-button>
              <el-button
                type="primary"
                @click="groupFormSubmit()"
              >
                {{ $t('table.confirm') }}
              </el-button>
            </div>
          </template>
        </el-dialog>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { getBatchPreSignUrl, pageFileGroup, saveFileGroup, updateFileGroup, awsImgUpdate } from '@/api/biz/oss'
import { save, page as pageApi } from '@/api/biz/attach-file'
import { reactive } from 'vue'

const emit = defineEmits(['refreshPic'])

const Data = reactive({
  videoFlag: false,
  videoUploadPercent: 0,
  files: [], // 已选视频
  fileIds: [], // 已选视频的fileId
  videoList: [], // 预览视频 队列
  videoPreview: [], // 预览视频
  sizeFlag: 0,
  upFlag: 0,
  dataForm: {
    policy: '',
    signature: '',
    key: '',
    ossaccessKeyId: '',
    dir: '',
    host: '',
    attachFileGroupId: 0
  },
  groupList: [], // 分组列表
  attachFiles: [],
  hideUploadEdit: false, // 上传按钮显示
  resourcesActionType: import.meta.env.VITE_APP_RESOURCES_TYPE,
  showGroupVisible: false, // 选择/创建分组弹窗
  showGroupType: 0, // 0选择分组 1创建分组 2修改分组
  groupForm: {
    attachFileGroupId: '', // 选择分组的值
    name: '' // 分组名称
  },
  selectGroupName: '', // 选中的分组名称
  oriImgName: null, // 视频原名称
  options: {
    multiple: true, // 是否支持选取多个视频
    limit: 10, // 最多可选择视频数量
    maxSize: 2, // 最大尺寸（M）
    activeTab: 'pick',
    enableUpload: false, // 是否启用视频上传
    callback: null
  },
  uploadFileFlag: false,
  newImgName: '',
  ossList: null,
  isTrue: true,
  imageObject: null,
  changeNameVisible: false,
  type: 2,
  fileType: 2, // 文件类型
  fileName: '',
  listType: 'picture',
  isLoading: true,
  visible: false,
  disabled: false,
  notImg: false,
  uploadSuccessCount: 0,
  imgRes: [],
  fileList: [],
  page: {
    current: 1,
    size: 9,
    total: 0
  },
  isSubmit: false
})

const { fileList, files, dataForm, groupList, hideUploadEdit, showGroupVisible, showGroupType, groupForm, selectGroupName, options, uploadFileFlag, type, fileName, isLoading, visible, disabled, imgRes, page } = toRefs(Data)

const uploadRef = ref(null)
// 初始化
// type 1：单图  2：多图
const init = (type, limit) => {
  Data.visible = true
  Data.videoFlag = true
  Data.isLoading = false
  Data.files = []
  Data.fileIds = []
  Data.type = type
  if (type === 1) {
    Data.type = true
    Data.disabled = true
  } else {
    Data.type = false
    Data.limit = limit
  }
  if (Data.fileList && Data.fileList.length) {
    Data.fileList = []
  }
  // 获取产品数据 - 第一页的数据
  Data.page.current = 1
  loadImageGroup() // 分组
  loadListImage() // 视频列表
}

// 加载视频分组列表
const loadImageGroup = () => {
  pageFileGroup({ type: Data.fileType }).then((data) => {
    Data.groupList = data
  })
}

// 点击视频分组item
const clickOneGroup = (id) => {
  Data.page.current = 1
  Data.dataForm.attachFileGroupId = id
  Data.options.activeTab = 'pick'
  loadListImage()
}

// 移除图片
const onRemove = () => {
  setTimeout(() => {
    Data.hideUploadEdit = false
  }, 600)
}
// 打开选择/新建分组
// st 0选择分组 1创建/修改分组
// showGroupType 0选择分组 1创建分组 2修改分组
const selectOrCreateGroup = (st, groupId, gIdx) => {
  Data.showGroupType = st
  if (!groupId) {
    Data.groupForm.attachFileGroupId = ''
    Data.groupForm.name = ''
  }
  // 修改分组
  if (st && groupId) {
    if (st === 1) {
      Data.groupForm.name = Data.groupList[gIdx].name
      Data.groupForm.attachFileGroupId = groupId
      Data.showGroupType = Data.fileType
    }
  }
  if (st === 0) { // 选择分组
    if (!Data.groupList.length) {
      ElMessage({
        message: '当前暂无分组可选择，请先创建分组',
        duration: 1500
      })
      Data.showGroupVisible = false
      return
    }
  }
  Data.showGroupVisible = true
}

const groupFormRef = ref(null)

// 提交选择/创建/修改分组
const groupFormSubmit = () => {
  groupFormRef.value.validate(valid => {
    if (!valid) {
      return
    }
    if (!Data.groupForm.name.trim()) {
      ElMessage({
        message: '分组名称不能为空格',
        type: 'warning',
        duration: 1000
      })
      return
    }
    if (Data.showGroupType === 0) {
      if (!Data.groupForm.attachFileGroupId) {
        ElMessage({
          message: '请选择分组',
          type: 'warning',
          duration: 1000
        })
        return
      }
      Data.groupList.forEach(el => {
        if (Data.groupForm.attachFileGroupId == el.attachFileGroupId) {
          Data.groupForm.name = el.name
          Data.selectGroupName = el.name
        }
      })
      Data.showGroupVisible = false
      return
    }
    if (Data.showGroupType !== 0) {
      if (!Data.groupForm.name) {
        ElMessage({
          message: '分组名称不能为空',
          type: 'warning',
          duration: 1000
        })
        return
      }
      const param = {
        attachFileGroupId: Data.groupForm.attachFileGroupId,
        name: Data.groupForm.name,
        type: Data.fileType
      }
      const request = Data.groupForm.attachFileGroupId ? updateFileGroup(param) : saveFileGroup(param)
      request.then(() => {
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 800,
          onClose: () => {
            Data.groupForm.attachFileGroupId = ''
            Data.showGroupVisible = false
            loadImageGroup()
          }
        })
      })
    }
  })
}

// 加载视频列表数据
const loadListImage = () => {
  Data.isLoading = true
  Data.videoList = []
  const param = {
    pageNum: Data.page.current ? Data.page.current : 1,
    pageSize: Data.page.size,
    type: Data.fileType,
    fileName: Data.fileName ? Data.fileName : null,
    attachFileGroupId: Data.dataForm.attachFileGroupId || 0,
    sysType: 3
  }
  pageApi(param).then(response => {
    Data.imgRes = response.list
    Data.imgRes.forEach(img => {
      if (Data.fileIds.indexOf(img.fileId) !== -1) {
        img.selected = true
      }
    })
    Data.page.pages = response.pages
    Data.page.total = response.total
    Data.isLoading = false
  })
}

const onConfirm = () => {
  if (Data.type) {
    emit('refreshPic', Data.files[0].filePath)
  } else {
    const imgPaths = Data.files.map(file => {
      return file.filePath
    }).join(',')
    emit('refreshPic', imgPaths)
  }
  Data.visible = false
}
// 关闭dialog 清空数据
const closeDialog = () => {
  fileName.value = ''
}
// 视频预上传
const handleAvatarChange = (file) => {
  if (['video/mp4', 'video/mov', 'video/wmv'].indexOf(file.raw.type) === -1) {
    uploadRef.value.handleRemove(file)
    ElMessage.error('请上传正确的视频格式')
    return false
  }
  const isSize = file.size / (1024 * 1024) < 20
  if (!isSize) {
    ElMessage.error('视频大小不能超过20m')
    uploadRef.value.handleRemove(file)
    return false
  }

  if (Data.fileList.length >= 20) {
    Data.hideUploadEdit = true
  }

  if (!Data.isSubmit) {
    const videoSrc = URL.createObjectURL(file.raw)
    Data.videoList.push({ url: videoSrc, uid: file.uid })
  }
}

// 点击上传视频按钮
const uploadFileBtn = () => {
  Data.options.activeTab = 'upload'
  Data.files = []
  Data.fileIds = []
  Data.disabled = false
  Data.dataForm.attachFileGroupId = null
}

/**
 * 点击视频时选中或取消选中视频
 * @param img object
 */
const onClickListImage = (img) => {
  // 单选视频
  if (Data.type) {
    clearListSelected()
    Data.files = []
    Data.fileIds = []
    Data.disabled = false
  } else {
    // 多选视频-如果已选中则取消选中
    const imgIndex = selectedImageIndex(img)
    if (imgIndex >= 0) {
      // 取消视频已选状态
      img.selected = false
      Data.files.splice(imgIndex, 1)
      Data.fileIds.splice(imgIndex, 1)
      return
    }
  }
  if (!Data.type && Data.files.length >= Data.limit) {
    ElMessage($t('biz.videobox.superiorLimit'))
    return false
  }
  Data.files.push(JSON.parse(JSON.stringify(img)))
  Data.fileIds.push(img.fileId)
  img.selected = true
}

/**
 * 清除所有已点击视频样式
 */
const clearListSelected = () => {
  if (Data.type) {
    Data.imgRes.forEach(element => {
      element.selected = false
    })
  }
}

// 按视频名称搜索视频
const searchImg = () => {
  Data.page.current = 1
  loadListImage()
}

// 视频已选则返回下标，未选则返回-1
const selectedImageIndex = (img) => {
  for (let i = 0; i < Data.files.length; i++) {
    const selectedImg = Data.files[i]
    if (selectedImg.fileId === img.fileId) {
      return i
    }
  }
  return -1
}

/**
 * 分页页面变化时刷新数据
 * @param page
 */
const onPageNumChange = (page) => {
  Data.page.current = page
  loadListImage()
}

// 获取上传视频数据
const onUploadConfirm = Debounce(() => {
  const fileNum = Data.fileList.length
  if (fileNum === 0) {
    ElMessage('没有待上传的视频！')
    return
  }
  Data.sizeFlag = 0
  Data.upFlag += 1
  Data.attachFiles = []
  Data.isSubmit = true
  const fileNames = Data.fileList?.map((item) => {
    return item.name
  }).join(',')
  getBatchPreSignUrl(fileNames).then(response => {
    Data.ossList = response
    Data.notImg = true
    nextTick(() => {
      uploadRef.value.submit()
      Data.isSubmit = false
    })
  })
})

// 上传视频
const httpRequest = (event) => {
  Data.videoList.forEach(item => {
    if (item.uid === event.file.uid) {
      uploadFile(event)
      Data.notImg = true
    }
  })
}

const uploadFile = (event) => {
  const file = event.file
  const attachFile = Object.assign({
    fileName: file.name,
    fileSize: file.size,
    type: Data.fileType
  })
  if (!Data.ossList || Data.ossList.length <= 0) {
    ElMessage('数据异常，请刷洗后重试')
  }
  attachFile.filePath = '/' + Data.ossList[0].dir + Data.ossList[0].fileName
  awsImgUpdate(Data.ossList[0].preSignUrl, file).then(() => {
    saveFileData(file, attachFile.filePath)
  }).catch(error => {
    // 上传视频失败
    if (!error) {
      event.onError()
    }
  })

  Data.attachFiles.push(attachFile)
  Data.ossList.splice(0, 1)
  if (Data.ossList <= 0) {
    event.onSuccess()
  }
}

// 保存视频文件数据
const saveFileData = (file, filePath) => {
  const uploadFile = [
    {
      attachFileGroupId: Data.groupForm.attachFileGroupId,
      fileName: file.name,
      fileSize: file.size,
      filePath,
      type: Data.fileType,
      sysType: 3
    }
  ]
  save(uploadFile).then(() => {
    Data.attachFiles = []
    Data.fileList = []
    Data.options.activeTab = 'pick'
    Data.dataForm.attachFileGroupId = 0
    loadListImage()
    Data.page.current = 1
    Data.groupForm.name = ''
    Data.groupForm.attachFileGroupId = ''
    Data.selectGroupName = ''
  })
}

/**
 * 上传视频前检查合法性
 * @param file
 * @returns {boolean}
 */
const beforeUpload = (file) => {
  const typeArray = file.type.split('/')
  const isSize = file.size / (1024 * 1024) < 20
  if (typeArray[0] !== 'video' || !isSize) {
    if (Data.sizeFlag === 0) {
      ElMessage($t('biz.videobox.onlyVideos'), true)
      Data.sizeFlag += 1
    }
    Data.videoList.forEach((item, index) => {
      if (item.uid === file.uid) {
        Data.videoList.splice(index, 1)
      }
    })
    Data.notImg = false
    return false
  }
  return true
}

const uploadNumberLimit = () => {
  if (!Data.options.multiple) {
    return 1
  }

  return Data.options.limit - Data.files.length
}

const uploadTypeTip = () => {
  return $t('biz.videobox.onlySupported') + ' mp4/mov/wmv ' + $t('biz.videobox.video')
}

const uploadSizeTip = () => {
  return $t('biz.videobox.notExceed') + '20M'
}

const uploadTips = () => {
  const tips = [uploadTypeTip(), uploadSizeTip()]

  if (!Data.options.multiple) {
    return tips.join('，')
  }

  if (Data.files.length > 0) {
    tips.push($t('biz.videobox.alreadyExist') + Data.files.length + $t('biz.videobox.unit'))
  }

  const uploadFileNum = Data.fileList.length ? Data.fileList.length : 0
  if (uploadFileNum > 0) {
    tips.push($t('biz.videobox.soonUpload') + uploadFileNum + $t('biz.videobox.unit'))
  }
  Data.uploadFileFlag = uploadFileNum >= Data.options.limit
  tips.push($t('biz.videobox.remainder') + (Data.options.limit - Data.files.length - uploadFileNum) + $t('biz.videobox.unit') + $t('biz.videobox.upload'))

  return tips.join('，')
}

/**
 * 上传错误处理
 * @param err
 */
const onUploadError = (err) => {
  if (err.length > Data.options.limit) {
    ElMessage(`当前最多只能选选择${Data.options.limit}个视频上传`)
    return
  }
  throw err
}

// 选择上传文件超过限制文件个数提示
const onUploadExceedTip = (file) => {
  ElMessage($t('biz.videobox.maxSelect') + uploadNumberLimit() + $t('biz.videobox.unit') + $t('biz.videobox.upload'))
  Data.videoFlag = true
  Data.videoUploadPercent = file.percentage.toFixed(0) * 1
}

// 删除预览视频
const preDeleteVideo = (index) => {
  Data.fileList.splice(index, 1)
  Data.videoList.splice(index, 1)
}

defineExpose({
  init
})
</script>

<style lang="scss" scoped>
@use "index";
</style>
