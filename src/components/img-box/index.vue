<!--
 Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

 https://www.mall4j.com/

 未经允许，不可做商业用途！

 版权所有，侵权必究！
-->
<template>
  <div class="component-img-box">
    <el-dialog
      v-model="visible"
      :title="$t('biz.imgbox.picManager')"
      class="elx-imgbox-dialog append-to-body-dialog"
      top="9vh"
      width="920px"
      :append-to-body="visible"
      @close="closeDialog()"
    >
      <div class="file-group up-imgs">
        <div class="upload-btn">
          <div class="up-btn">
            <el-button
              v-permission="['resource:img:uploadImg']"
              type="primary"
              plain
              @click="uploadFileBtn"
            >
              {{ $t('biz.imgbox.uploadPic') }}
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
                :placeholder="$t('biz.imgbox.picName')"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="searchImg"
              >
                {{ $t("biz.imgbox.query") }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="img-group-box">
          <!-- 左侧栏 -->
          <div class="left-sidebar">
            <div class="group-list">
              <div :class="['group-item', dataForm.attachFileGroupId===0?'active':'']">
                <span
                  class="group-name"
                  @click="clickOneGroup(0)"
                >全部图片</span>
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
                <span class="sidebar-operate" />
              </div>
            </div>
          </div>

          <!-- 图片列表 -->
          <div
            v-if="options.activeTab==='pick'"
            class="pick-block"
          >
            <div
              class="elx-main elx-img-list"
              style="width:100%;"
            >
              <div
                v-if="isLoading"
                class="elx-img-list-loading"
              >
                <el-icon class="el-icon-loading">
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
                  @click="onClickListImage(img)"
                >
                  <ImgShow :src="img.filePath" />
                </div>
                <div
                  class="title"
                  @click="onClickListImage(img)"
                >
                  {{ img.fileName }}
                </div>
                <span
                  v-if="img.selected"
                  class="selected"
                  @click="onClickListImage(img)"
                >
                  <el-icon class="icon el-icon-check"><Check /></el-icon>
                </span>
              </div>
              <div
                v-if="!imgRes.length"
                class="empty"
              >
                暂无图片
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
                :value="images.length"
                class="item"
              >
                <el-button
                  type="primary"
                  :disabled="images.length === 0"
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
                v-permission="['resource:img:uploadImg']"
                type="primary"
                plain
                @click="uploadFileBtn"
              >
                {{ $t("biz.imgbox.uploadPic") }}
              </el-button>
            </div>
          </div>

          <!-- 上传图片 -->
          <div
            v-if="options.activeTab==='upload'"
            class="upload-block"
          >
            <div class="elx-main">
              <div class="upload-title">
                选择图片分组：
              </div>
              <div class="file-gropu-btn">
                <el-select
                  v-model="groupForm.attachFileGroupId"
                  class="select-array"
                  placeholder="选择图片分组"
                >
                  <el-option
                    v-for="item in groupList"
                    :key="item.attachFileGroupId"
                    :label="item.name"
                    :value="item.attachFileGroupId"
                  />
                </el-select>
                <el-button
                  v-if="!selectGroupName"
                  v-permission="['resource:img:saveImgGroup']"
                  style="margin-left: 10px"
                  type="primary"
                  link
                  @click="selectOrCreateGroup(1)"
                >
                  新建分组
                </el-button>
              </div>
              <div class="upload-title">
                {{ $t("biz.imgbox.selectLocalPic") }}
              </div>
              <el-upload
                ref="uploadRef"
                v-model:file-list="fileList"
                :class="['upload-img-preview',hideUploadEdit?'hide':'']"
                list-type="picture-card"
                accept=".jpg,.png,.gif,.jpeg"
                action=""
                :http-request="httpRequest"
                :multiple="true"
                :auto-upload="false"
                :limit="uploadNumberLimit()"
                :before-upload="beforeUpload"
                :on-change="handleAvatarChange"
                :on-success="onUploadSuccess"
                :on-error="onUploadError"
                :on-exceed="onUploadExceedTip"
                :before-remove="beforeRemove"
                :on-remove="onRemove"
              >
                <el-icon class="el-icon-plus">
                  <Plus />
                </el-icon>
              </el-upload>

              <div class="upload-tip">
                {{ uploadTips() }}
              </div>

              <div class="elx-foot">
                <el-button
                  type="primary"
                  @click="onUploadConfirm"
                >
                  {{ $t("biz.imgbox.confirmUpload") }}
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 选择/创建/修改分组 -->
        <el-dialog
          v-model="showGroupVisible"
          :title="showGroupType===0?'选择分组'
            :showGroupType===1?'新建分组':'修改分组名称'"
          :append-to-body="showGroupVisible"
          :close-on-click-modal="false"
          width="600px"
        >
          <el-form
            ref="groupFormRef"
            :model="groupForm"
            :rules="rules"
            label-width="90px"
            style="width:500px"
            @submit.prevent
          >
            <el-form-item
              v-if="showGroupType != 0"
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

      <!-- 修改图片名称 -->
      <el-dialog
        v-model="changeNameVisible"
        :title="$t('biz.imgbox.revisePicName')"
        :close-on-click-modal="false"
        top="160px"
        :append-to-body="visible"
        width="500px"
        class="changebox"
      >
        <el-form
          v-if="changeNameVisible"
          ref="imgDataForm"
          :model="imageObject"
          label-width="90px"
          @submit.prevent
        >
          <el-form-item :label="$t('biz.imgbox.pic')">
            <ImgShow
              :src="imageObject.filePath"
              :class-list="['changebox-img']"
            />
          </el-form-item>
          <el-form-item :label="$t('biz.imgbox.oldName')">
            <span class="old-name">{{ imageObject.fileName }}</span>
          </el-form-item>
          <el-form-item :label="$t('biz.imgbox.revName')">
            <el-input
              v-model="newImgName"
              :placeholder="$t('biz.imgbox.inputNewName')"
              maxlength="20"
              clearable
              style="width:350px"
            />
          </el-form-item>
          <el-form-item :label="$t('biz.imgbox.group')">
            <el-select
              v-model="groupForm.attachFileGroupId"
              :placeholder="$t('biz.imgbox.selectTips')"
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
          <span
            class="dialog-footer"
          >
            <el-button
              plain
              @click="changeNameVisible = false"
            >{{ $t("table.cancel") }}</el-button>
            <el-button
              type="primary"
              @click="submitImgName()"
            >{{ $t("table.confirm") }}</el-button>
          </span>
        </template>
      </el-dialog>
      <!-- /修改图片名称 -->
    </el-dialog>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import ImageCompressor from 'compressorjs'
import { page as pageApi, save, updateFileName } from '@/api/biz/attach-file'

import { awsImgUpdate, getBatchPreSignUrl, pageFileGroup, saveFileGroup, updateFileGroup } from '@/api/biz/oss'
import { Debounce } from '@/utils/debounce'

const { proxy } = getCurrentInstance()
const fileList = ref([])
const images = ref([]) // 已选图片
const fileIds = ref([]) // 已选图片的fileId
const sizeFlag = ref(0) // 避免错误提示重复弹出
const dataForm = reactive({
  policy: '',
  signature: '',
  key: '',
  ossaccessKeyId: '',
  dir: '',
  host: '',
  attachFileGroupId: ''
})
const groupList = ref([]) // 分组列表
const hideUploadEdit = ref(false) // 上传按钮显示
const attachFiles = ref([])
const showGroupVisible = ref(false) // 选择/创建分组弹窗
const showGroupType = ref(0) // 0选择分组 1创建分组 2修改分组
const groupForm = reactive({
  attachFileGroupId: '', // 选择分组的值
  name: '' // 分组名称
})
const fileType = 1 // 文件类型
const selectGroupName = ref('') // 选中的分组名称
const oriImgName = null // 图片原名称
const options = reactive({
  multiple: true, // 是否支持选取多个图片
  limit: 20, // 最多可选择图片数量
  maxSize: 512, // 最大尺寸（kb）
  activeTab: 'pick',
  enableUpload: false, // 是否启用图片上传
  callback: null
})
const newImgName = ref('')
let ossList = null
let isTrue = true
const imageObject = ref(null)
const changeNameVisible = ref(false)
const type = ref(2)
const fileName = ref('')
const isLoading = ref(true)
const visible = ref(false)
const disabled = ref(false)
const imgRes = ref([])
const page = reactive({
  current: 1,
  size: 15,
  total: 0
})
let completeCount = 0 // 传输完成数量，用于控制文件全部上传成功才进入onSuccess方法
let uploadDisabled = false
let uploadSubmitFlag = false

const emit = defineEmits(['refreshPic'])

const rules = computed(() => ({
  name: [
    { required: true, message: '分组名称不能为空', trigger: 'blur' },
    { min: 1, max: 20, message: '长度在1-20个字符', trigger: 'blur' }
  ]
}))
let limit = 0
const uploadRef = ref(null)
// 初始化
// isType 1：单图  2：多图
const init = (isType, isLimit) => {
  visible.value = true
  isLoading.value = false
  images.value = []
  fileIds.value = []
  type.value = isType
  if (isType === 1) {
    type.value = true
    disabled.value = true
  } else {
    type.value = false
    limit = isLimit
  }
  fileList.value = []
  // 获取产品数据 - 第一页的数据
  page.current = 1
  loadImageGroup() // 分组
  loadListImage() // 图片列表
}

// 加载图片分组列表
const loadImageGroup = () => {
  pageFileGroup({ type: fileType }).then((data) => {
    groupList.value = data
  })
}

// 点击图片分组item
const clickOneGroup = (id) => {
  page.current = 1
  dataForm.attachFileGroupId = id
  options.activeTab = 'pick'
  loadListImage()
}

// 打开选择/新建分组
// st 0选择分组 1创建/修改分组
// showGroupType 0选择分组 1创建分组 2修改分组
const selectOrCreateGroup = (st, groupId, gIdx) => {
  showGroupType.value = st
  if (!groupId) {
    groupForm.attachFileGroupId = ''
    groupForm.name = ''
  }
  // 修改分组
  if (st && groupId) {
    if (st === 1) {
      groupForm.name = groupList.value[gIdx].name
      groupForm.attachFileGroupId = groupId
      showGroupType.value = 2 // 修改分组名称
    }
  }
  if (st === 0) { // 选择分组
    if (!groupList.value.length) {
      ElMessage({
        message: $t('biz.imgbox.noGroupSelect'),
        duration: 1500
      })
      showGroupVisible.value = false
      return
    }
  }
  showGroupVisible.value = true
}

// 提交选择/创建/修改分组
const groupFormRef = ref(null)
const groupFormSubmit = () => {
  groupFormRef.value.validate(valid => {
    if (!valid) {
      return
    }
    if (!groupForm.name.trim()) {
      ElMessage({
        message: '分组名称不能为空',
        type: 'warning',
        duration: 1000
      })
      return
    }
    if (showGroupType.value === 0) {
      if (!groupForm.attachFileGroupId) {
        ElMessage({
          message: $t('biz.imgbox.pleaseSelectGroup'),
          type: 'warning',
          duration: 1000
        })
        return
      }
      groupList.value.forEach(el => {
        if (groupForm.attachFileGroupId == el.attachFileGroupId) {
          groupForm.name = el.name
          selectGroupName.value = el.name
        }
      })
      showGroupVisible.value = false
      return
    }
    if (showGroupType.value !== 0) {
      if (!groupForm.name) {
        ElMessage({
          message: '分组名称不能为空',
          type: 'warning',
          duration: 1000
        })
        return
      }
      const param = {
        attachFileGroupId: groupForm.attachFileGroupId,
        name: groupForm.name,
        type: fileType
      }
      const request = groupForm.attachFileGroupId ? updateFileGroup(param) : saveFileGroup(param)
      request.then(() => {
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 800,
          onClose: () => {
            groupForm.attachFileGroupId = ''
            showGroupVisible.value = false
            loadImageGroup()
          }
        })
      }).catch(() => {})
    }
  })
}

// 加载图片列表数据
const loadListImage = () => {
  isLoading.value = true
  const param = {
    pageNum: page.current ? page.current : 1,
    pageSize: page.size,
    fileName: fileName.value || null,
    attachFileGroupId: dataForm.attachFileGroupId || '',
    type: fileType,
    sysType: 3
  }
  pageApi(param).then(response => {
    imgRes.value = response.list
    imgRes.value.forEach(img => {
      if (fileIds.value.indexOf(img.fileId) !== -1) {
        img.selected = true
      }
    })
    page.pages = response.pages
    page.total = response.total
    isLoading.value = false
  })
}

const onConfirm = Debounce(() => {
  if (type.value) {
    emit('refreshPic', images.value[0].filePath)
  } else {
    const imgPaths = images.value.map(file => {
      return file.filePath
    }).join(',')
    emit('refreshPic', imgPaths)
  }
  visible.value = false
}, 1000)

// 提交修改后的图片名称
const submitImgName = () => {
  if (!isTrue) {
    return false
  }

  isTrue = false
  const data = {
    fileId: imageObject.value.fileId,
    fileName: newImgName.value || oriImgName,
    attachFileGroupId: groupForm.attachFileGroupId,
    sysType: 3
  }
  updateFileName(data).then(() => {
    newImgName.value = ''
    isTrue = true
    changeNameVisible.value = false
    loadListImage()
  }).catch(() => {
    isTrue = true
  })
}

// 点击上传图片按钮
const uploadFileBtn = () => {
  options.activeTab = 'upload'
  fileList.value = []
  groupForm.attachFileGroupId = dataForm.attachFileGroupId || ''
  images.value = []
  fileIds.value = []
  disabled.value = false
  dataForm.attachFileGroupId = null
}

// 点击图片时选中或取消选中图片
const onClickListImage = (img) => {
  // 单选图片
  if (type.value) {
    clearListSelected()
    images.value = []
    fileIds.value = []
    disabled.value = false
  } else {
    // 多选图片-如果已选中则取消选中
    const imgIndex = selectedImageIndex(img)
    if (imgIndex >= 0) {
      // 取消图片已选状态
      img.selected = false
      images.value.splice(imgIndex, 1)
      fileIds.value.splice(imgIndex, 1)
      return
    }
  }
  if (!type.value && images.value.length >= limit) {
    ElMessage($t('biz.imgbox.superiorLimit'))
    return false
  }
  images.value.push(JSON.parse(JSON.stringify(img)))
  fileIds.value.push(img.fileId)
  img.selected = true
}

/**
 * 清除所有已点击图片样式
 */
const clearListSelected = () => {
  if (type.value) {
    imgRes.value.forEach(element => {
      element.selected = false
    })
  }
}

// 按图片名称搜索图片
const searchImg = () => {
  page.current = 1
  loadListImage()
}

// 图片已选则返回下标，未选则返回-1
const selectedImageIndex = (img) => {
  for (let i = 0; i < images.value.length; i++) {
    const selectedImg = images.value[i]
    if (selectedImg.fileId === img.fileId) {
      return i
    }
  }
  return -1
}

// 分页页面变化时刷新数据
const onPageNumChange = (current) => {
  page.current = current
  loadListImage()
}

// 移除图片
const onRemove = () => {
  // eslint-disable-next-line no-var, max-statements-per-line
  var time = setTimeout(() => { hideUploadEdit.value = false; clearTimeout(time) }, 1000)
  if (uploadSubmitFlag) {
    uploadDisabled = false
  } else {
    uploadDisabled = true
    // eslint-disable-next-line no-var, max-statements-per-line
    var time1 = setTimeout(() => { uploadDisabled = false; clearTimeout(time1) }, 1000)
  }
}
const beforeRemove = () => {
  // 防止用户频繁点击导致删除过多
  return !uploadDisabled
}

// 获取上传图片数据
const onUploadConfirm = Debounce(() => {
  uploadSubmitFlag = true
  // eslint-disable-next-line no-var, max-statements-per-line
  var time = setTimeout(() => { uploadSubmitFlag = false; clearTimeout(time) }, 1000)
  completeCount = 0
  ossList = []
  attachFiles.value = []
  sizeFlag.value = 0

  const fileNum = fileList.value.length
  if (fileNum === 0) {
    return ElMessage({
      message: $t('product.plePictureToUpload'),
      type: 'warning'
    })
  }
  const fileNames = fileList.value?.map((item) => {
    return item.name
  }).join(',')
  const fileNamesArr = fileNames.split(',')
  getBatchPreSignUrl(fileNames).then(response => {
    ossList = response
    for (let i = 0; i < ossList.length; i++) {
      ossList[i].name = fileNamesArr[i]
    }
    nextTick(() => {
      uploadRef.value.submit()
    })
  })
}, 1500)

// 上传图片
const httpRequest = (event) => {
  // 获取本次上传文件的位置
  const index = ossList.findIndex(item => item.name === event.file.name)
  if (sizeFlag.value !== 0) {
    return
  }

  const file = event.file
  const attachFile = Object.assign({
    fileType: onGetFileType(file),
    fileName: file.name,
    fileSize: file.size,
    type: 1
  })

  if (ossList.length <= 0) {
    ElMessage('数据异常，请刷新后重试')
  }
  // 文件上传
  attachFile.filePath = '/' + ossList[index].dir + ossList[index].fileName
  awsImgUpdate(ossList[index].preSignUrl, file, event).then(() => {
    attachFiles.value.push(attachFile)
    completeCount++
    if (completeCount === ossList.length) {
      event.onSuccess()
    }
  }).catch(() => {
    ElMessage('第' + (index + 1) + '张图片上传失败', true)
    completeCount++
    if (completeCount === ossList.length) {
      event.onSuccess()
    }
  })
}

const onGetFileType = (file) => {
  const fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
  if (['jpg', 'png', 'gif', 'jpeg'].includes(fileType)) {
    return fileType
  }
  return file.type.split('/')[1]
}

// 上传图片前检查合法性
const beforeUpload = async (file) => {
  const isImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
  const isSize = file.size / 1024 < options.maxSize
  if (!isImage) {
    if (sizeFlag.value === 0) {
      ElMessage($t('biz.imgbox.onlyPictures'), true)
      sizeFlag.value += 1
    }
    return Promise().reject()
  }
  if (!isSize) {
    // 0.5m~5m，从0.8开始循环。5m~10m，从0.6开始循环。10m以上就直接0.4。
    // 最低使用0.4
    let quality
    if (file.size / 1024 / 1024 < 5) {
      quality = 0.8
    } else if (file.size / 1024 / 1024 < 10) {
      quality = 0.6
    } else {
      quality = 0.4
    }
    try {
      let resultBlob
      let index = true
      while (index) {
        resultBlob = await ImageCompressorFn(file, quality)
        if (resultBlob.size / 1024 < 512 || quality <= 0.4) {
          index = false
        } else {
          quality = (quality * 10 - 2) / 10
        }
      }
      return new File([resultBlob], file.name, {
        type: file.type
      })
    } catch (error) {
      return Promise().reject()
    }
  }
  return true
}

const ImageCompressorFn = (file, quality) => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-new
    new ImageCompressor(file, {
      quality, // 压缩大小
      convertSize: 512000,
      success (result) {
        resolve(result)
      },
      error (err) {
        reject(err)
      }
    })
  })
}

const uploadNumberLimit = () => {
  if (!options.multiple) {
    return 1
  }
  return options.limit - images.value.length
}

const uploadTypeTip = () => {
  return $t('biz.imgbox.onlySupported') + ' jpg/png/gif ' + $t('biz.imgbox.pic')
}

const show = ref(true)
const uploadTips = () => {
  const tips = [uploadTypeTip()]
  if (!options.multiple) {
    return tips.join('，')
  }

  if (images.value.length > 0) {
    tips.push($t('biz.imgbox.alreadyExist') + images.value.length + $t('biz.imgbox.unit'))
  }
  const uploadFileNum = fileList.value ? fileList.value.length : 0
  if (uploadFileNum > 0) {
    tips.push($t('biz.imgbox.soonUpload') + uploadFileNum + $t('biz.imgbox.unit'))
  }

  tips.push($t('biz.imgbox.remainder') + (options.limit - uploadFileNum) + $t('biz.imgbox.unit') + $t('biz.imgbox.upload'))
  show.value = options.limit - uploadFileNum
  return tips.join('，')
}

// 图片预上传 提示文字变更
// eslint-disable-next-line no-unused-vars
const handleAvatarChange = (file, files) => {
  fileList.value = files
  if (files.length >= 20) {
    hideUploadEdit.value = true
  }
  proxy.$forceUpdate()
}

/**
 * 上传错误处理
 * @param err
 */
const onUploadError = (err) => {
  ElMessage($t('biz.imgbox.requestError'), true)
  throw err
}

/**
 * 上传成功处理，并提交图片数据
 * @param response
 * @param file
 * @param fileList
 * @returns {boolean}
 */
// eslint-disable-next-line no-unused-vars
const onUploadSuccess = (response, file, fileList) => {
  const filesNames = []
  fileList.forEach(file => {
    filesNames.push(file.name)
  })
  let uploadFile = []
  filesNames.forEach(name => {
    const obj = attachFiles.value.find(i => i.fileName === name)
    if (obj) {
      obj.sysType = 3
      obj.attachFileGroupId = groupForm.attachFileGroupId
      uploadFile.push(obj)
    }
  })
  if (uploadFile.length > 0) {
    // 倒序数组：使得上传预览时的顺序与上传成功后获取到的顺序一致
    uploadFile = uploadFile.reverse()
    save(uploadFile).then(() => {
      attachFiles.value = []
      options.activeTab = 'pick'
      dataForm.attachFileGroupId = 0
      loadListImage()
    })
  }
  disabled.value = true
  fileList.value = []
  page.current = 1
  groupForm.name = ''
  groupForm.attachFileGroupId = ''
  selectGroupName.value = ''
  setTimeout(() => {
    hideUploadEdit.value = false
  }, 1000)
}

/**
 * 选择上传文件超过限制文件个数提示
 */
const onUploadExceedTip = () => {
  ElMessage($t('biz.imgbox.maxSelect') + uploadNumberLimit() + $t('biz.imgbox.unit') + $t('biz.imgbox.upload'))
}

// 关闭dialog 清空数据
const closeDialog = () => {
  options.activeTab = 'pick'
  fileName.value = ''
}

defineExpose({
  init
})
</script>

<style lang="scss" scoped>
@use './index.scss';

</style>
