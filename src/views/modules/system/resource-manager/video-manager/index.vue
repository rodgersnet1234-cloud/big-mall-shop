<!--
 Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

 https://www.mall4j.com/

 未经允许，不可做商业用途！

 版权所有，侵权必究！
-->
<template>
  <div class="Mall4j selx-imgbox page-video-manager">
    <div class="file-group">
      <div class="upload-btn">
        <div class="up-btn">
          <el-button
            v-permission="['resource:video:uploadVideo']"
            plain
            type="primary"
            @click="uploadFileBtn"
          >
            <el-icon class="el-icon">
              <Top />
            </el-icon>
            上传视频
          </el-button>
          <el-button
            v-permission="['resource:video:saveVideoGroup']"
            plain
            @click="selectOrCreateGroup(1)"
          >
            <el-icon class="el-icon">
              <Plus />
            </el-icon>
            新建分组
          </el-button>
        </div>
        <!-- 搜索 -->
        <!-- native modifier has been removed, please confirm whether the function has been affected  -->
        <el-form
          :inline="true"
          :model="dataForm"
          class="demo-form-inline form"
          @submit.prevent
        >
          <el-form-item>
            <el-input
              v-model="fileName"
              style="width: 200px !important"
              :placeholder="$t('biz.videobox.videoName')"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="searchImg(true)"
            >
              {{ $t("table.search") }}
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
              <span class="sidebar-operate">
                <el-icon
                  v-permission="['resource:video:editVideoGroup']"
                  class="el-icon-edit"
                  @click="selectOrCreateGroup(1,gItem.attachFileGroupId,gIdx)"
                ><EditPen />
                </el-icon>
                <el-icon
                  v-permission="['resource:video:deleteVideoGroup']"
                  class="el-icon-delete"
                  @click="onDeleteFileGroup(gItem.attachFileGroupId)"
                >
                  <Delete />
                </el-icon>
              </span>
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
            <div class="batch">
              <span class="text">
                <el-checkbox
                  v-model="checkedAll"
                  :indeterminate="isIndeterminate"
                  @change="AllImgs"
                >
                  全选
                </el-checkbox>
              </span>
              <span
                v-permission="['resource:video:deleteVideos']"
                class="text"
                @click="delectImgs"
              >删除</span>
              <span
                v-permission="['resource:video:moveVideos']"
                class="text"
                @click="showMoveImgs"
              >移动</span>
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
                  controls="controls"
                  class="showVideo"
                  style="width:175px;height:88px;"
                />
              </div>
              <div
                class="title"
                @click="onClickListImage(img)"
              >
                {{ img.fileName }}
              </div>
              <div class="operate">
                <el-link
                  v-permission="['resource:Video:editVideo']"
                  type="info"
                  class="edit"
                  @click="changeName(img)"
                >
                  {{ $t("table.edit") }}
                </el-link>
                <el-link
                  v-permission="['resource:Video:deleteVideo']"
                  type="danger"
                  class="del"
                  @click="delectImg(img.fileName, img.fileId)"
                >
                  {{ $t("table.delete") }}
                </el-link>
              </div>
              <span
                class="selected-def"
                @click="onClickListImage(img)"
              />
              <span
                v-if="img.selected"
                class="selected"
                @click="onClickListImage(img)"
              >
                <el-icon class="icon "><Check /></el-icon>
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
            layout="->,total, prev, pager, next"
            :current-page="pageQuery.current"
            :page-size="pageQuery.size"
            :total="pageQuery.total"
            @current-change="onPageNumChange"
          />
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
              <el-button
                v-if="!selectGroupName"
                type="primary"
                link
                @click="selectOrCreateGroup(0)"
              >
                <el-select
                  v-model="groupForm.attachFileGroupId"
                  class="select-array"
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
                v-for="(item, index) in videoList"
                :key="index"
                class="video-preview"
              >
                <video
                  v-if="item.url"
                  class="upShowVideo"
                  :src="checkFileUrl(item.url)"
                  controls="controls"
                  style="width:175px;height:88px;"
                />
                <!-- 显示查看和删除的按钮弹窗 -->
                <div
                  class="avatar-uploader-popup"
                >
                  <el-icon
                    @click="preDeleteVideo(index)"
                  >
                    <Delete />
                  </el-icon>
                </div>
              </div>

              <el-upload
                v-show="!uploadFileFlag"
                ref="uploadRef"
                class="upload-img-preview"
                list-type="picture-card"
                accept=".mp4,.mov,.wmv "
                action=""
                :multiple="true"
                :http-request="httpRequest"
                :limit="uploadNumberLimit()"
                :on-change="onUploadChange"
                :before-upload="beforeUpload"
                :on-success="onUploadSuccess"
                :on-exceed="onUploadError"
                :show-file-list="false"
                :auto-upload="false"
                :class="{hide: hideUploadEdit}"
              >
                <el-icon>
                  <Plus />
                </el-icon>
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
      </div>

      <!-- 选择/创建/修改分组 -->
      <el-dialog
        v-model="showGroupVisible"
        :title="showGroupType===0 ?'选择分组'
          :showGroupType===1?'新建分组':'修改分组名称'"
        :append-to-body="showGroupVisible"
        :close-on-click-modal="false"
        width="600px"
        class="group-box"
      >
        <!-- native modifier has been removed, please confirm whether the function has been affected  -->
        <el-form
          ref="groupFormRef"
          :model="groupForm"
          :rules="rules"
          label-width="90px"
          style="width:500px"
          @submit.prevent
        >
          <el-form-item
            v-if="showGroupType !== 0"
            :label="`分组名称`"
            prop="name"
          >
            <!-- native modifier has been removed, please confirm whether the function has been affected  -->
            <el-input
              v-model="groupForm.name"
              :placeholder="`请输入分组名称`"
              maxlength="20"
              show-word-limit
              @keyup.enter="groupFormSubmit()"
            />
          </el-form-item>
          <el-form-item
            v-if="showGroupType===0"
            :label="`选择分组`"
          >
            <el-select
              v-model="groupForm.attachFileGroupId"
              :placeholder="`请选择`"
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
          <div class="dialog-footer">
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

    <!-- 修改视频名称 -->
    <el-dialog
      v-model="changeNameVisible"
      :title="$t('biz.videobox.reviseVideoName')"
      :close-on-click-modal="false"
      top="160px"
      :append-to-body="visible"
      width="500px"
      class="changebox"
    >
      <!-- native modifier has been removed, please confirm whether the function has been affected  -->
      <el-form
        v-if="changeNameVisible"
        ref="imgDataFormRef"
        :model="imageObject"
        label-width="90px"
        @submit.prevent
      >
        <el-form-item :label="`视频`">
          <video
            :src="checkFileUrl(imageObject.filePath)"
            class="changebox-img"
            controls="controls"
          />
        </el-form-item>
        <el-form-item :label="$t('biz.videobox.oldName')">
          <span class="old-name">{{ imageObject.fileName }}</span>
        </el-form-item>
        <el-form-item :label="$t('biz.videobox.revName')">
          <el-input
            v-model="newImgName"
            maxlength="20"
            :placeholder="$t('biz.videobox.inputNewName')"
            clearable
            style="width:350px"
          />
        </el-form-item>
        <el-form-item :label="`分组`">
          <el-select
            v-model="groupForm.attachFileGroupId"
            :placeholder="`请选择`"
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
        <span class="dialog-footer">
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
    <!-- /修改视频名称 -->

    <!-- 移动分组 -->
    <el-dialog
      v-model="changeNameVisible1"
      :title="'移动分组'"
      :close-on-click-modal="false"
      top="160px"
      :append-to-body="visible"
      width="500px"
      class="changebox"
    >
      <!-- native modifier has been removed, please confirm whether the function has been affected  -->
      <el-form
        v-if="changeNameVisible1"
        ref="imgDataFormRef"
        :model="groupForm"
        label-width="90px"
        @submit.prevent
      >
        <el-form-item :label="`分组`">
          <el-select
            v-model="groupForm.attachFileGroupId"
            clearable
            :placeholder="`请选择`"
          >
            <el-option
              v-for="item in groupList"
              :key="item.attachFileGroupId"
              :label="item.name"
              :value="item.attachFileGroupId"
            />
          </el-select>
          <el-button
            style="margin-left:10px"
            type="primary"
            link
            @click="selectOrCreateGroup(1)"
          >
            新建分组
          </el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            plain
            @click="changeNameVisible1 = false"
          >{{ $t("table.cancel") }}</el-button>
          <el-button
            type="primary"
            @click="MoveImgs()"
          >{{ $t("table.confirm") }}</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- /移动分组 -->
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getBatchPreSignUrl, pageFileGroup, saveFileGroup, updateFileGroup, deleteFileGroup, awsImgUpdate } from '@/api/biz/oss'
import { save, page, updateFileName, deleteFile } from '@/api/biz/attach-file'
import { batchDeleteVedio, batchMoveVedio } from '@/api/resource/video-store'

const uploadRef = ref(null)
const files = ref([]) // 已选视频
const fileIds = ref([]) // 已选视频的fileId
const videoList = ref([]) // 预览视频 队列
const sizeFlag = ref(0)
const fileNum = ref(0)
const dataForm = reactive({
  policy: '',
  signature: '',
  key: '',
  ossaccessKeyId: '',
  dir: '',
  host: '',
  attachFileGroupId: 0
})
const groupList = ref([]) // 分组列表
const hideUploadEdit = ref(false) // 上传按钮显示
const attachFiles = ref([])
const fileIndex = ref(0) // 视频位置索引，用于获取文件数组中当前上传文件的位置
const completeCount = ref(0) // 传输完成数量，用于控制文件全部上传成功才进入onSuccess方法
const showGroupVisible = ref(false) // 选择/创建分组弹窗
const showGroupType = ref(0) // 0选择分组 1创建分组 2修改分组
const groupForm = ref({
  attachFileGroupId: '', // 选择分组的值
  name: '123123' // 分组名称
})
const selectGroupName = ref('') // 选中的分组名称
let oriImgName = null // 视频原名称
const options = reactive({
  multiple: true, // 是否支持选取多个视频
  limit: 10, // 最多可选择视频数量
  maxSize: 2, // 最大尺寸（M）
  activeTab: 'pick',
  enableUpload: false, // 是否启用视频上传
  callback: null
})
const newImgName = ref('')
let ossList = null
const isTrue = ref(true)
let imageObject = null
const changeNameVisible = ref(false)
const changeNameVisible1 = ref(false)
const type = ref(2)
const fileType = ref(2) // 文件类型
const fileName = ref('')
const isLoading = ref(true)
const visible = ref(false)
const disabled = ref(false)
const notImg = ref(false)
const checkedAll = ref(false)
const imgRes = ref([])

const isSubmit = ref(false)
const uploadFileFlag = ref(false)
const creatingGroup = ref(false) // 正在新建分组
let showVideoUploadSuccessMessage = true

const isIndeterminate = computed(() => {
  const someRes = imgRes.value.some(imgItem => imgItem.selected)
  const everyRes = imgRes.value.every(imgItem => imgItem.selected)
  return someRes && !everyRes
})
const rules = computed(() => {
  return {
    name: [
      { required: true, message: $t('biz.imgbox.groupEmpty'), trigger: 'blur' },
      { min: 1, max: 20, message: $t('biz.imgbox.groupBetween'), trigger: 'blur' }
    ]
  }
})
watch(() => fileIds.value, (newValue) => {
  checkedAll.value = !!(newValue.length === imgRes.value.length && imgRes.value.length !== 0)
}, { deep: true })

watch(() => imgRes.value, (newValue) => {
  checkedAll.value = !!(newValue.length !== 0 && newValue.filter(element => fileIds.value.includes(element.fileId)).length === newValue.length)
}, { deep: true })

onMounted(() => {
  loadImageGroup() // 分组
  loadListImage() // 视频列表
})

/**
 * 初始化
 * type 1：单图  2：多图
 */
const init = (type) => {
  visible.value = true
  isLoading.value = false
  files.value = []
  fileIds.value = []
  if (type === 1) {
    type.value = true
    disabled.value = true
  } else {
    type.value = false
  }
  if (uploadRef.value) {
    uploadRef.value?.clearFiles()
  }
  // 获取产品数据 - 第一页的数据
  pageQuery.current = 1
  loadImageGroup() // 分组
  loadListImage() // 视频列表
}
defineExpose({
  init
})

/**
 * 加载视频分组列表
 */
const loadImageGroup = () => {
  pageFileGroup({ type: fileType.value }).then((responseData) => {
    groupList.value = responseData
    groupForm.value.attachFileGroupId = null
    if (changeNameVisible1.value || options.activeTab === 'upload') {
      responseData.forEach(item => {
        if (groupForm.value.name === item.name) {
          groupForm.value.attachFileGroupId = item.attachFileGroupId
        }
      })
    }
  })
}
/**
 * 点击视频分组item
 */
const clickOneGroup = (id) => {
  pageQuery.current = 1
  dataForm.attachFileGroupId = id
  options.activeTab = 'pick'
  loadListImage()
}
/**
 * 打开选择/新建分组
 * st 0选择分组 1创建/修改分组
 * showGroupType 0选择分组 1创建分组 2修改分组
 */
const groupFormRef = ref(null)
const selectOrCreateGroup = (st, groupId, gIdx) => {
  showGroupType.value = st
  if (!groupId) {
    groupForm.value.attachFileGroupId = ''
    groupForm.value.name = ''
  }
  // 修改分组
  if (st && groupId) {
    if (st === 0 || st === 1) {
      nextTick(() => {
        groupFormRef.value?.validate(valid => {
          if (!valid) { /* empty */ }
        }
        )
      })
    }
    if (st === 1) {
      groupForm.value.name = groupList.value[gIdx].name
      groupForm.value.attachFileGroupId = groupId
      showGroupType.value = fileType.value
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
/**
 * 提交选择/创建/修改分组
 */
const groupFormSubmit = () => {
  groupFormRef.value?.validate(valid => {
    if (!valid) {
      return
    }
    if (!groupForm.value.name.trim()) {
      ElMessage({
        message: $t('biz.imgbox.groupEmpty'),
        type: 'warning',
        duration: 1000
      })
      return
    }
    if (showGroupType.value === 0) {
      if (!groupForm.value.attachFileGroupId) {
        ElMessage({
          message: $t('biz.imgbox.groupEmpty'),
          type: 'warning',
          duration: 1000
        })
        return
      }
      groupList.value.forEach(el => {
        if (groupForm.value.attachFileGroupId === el.attachFileGroupId) {
          groupForm.value.name = el.name
          selectGroupName.value = el.name
        }
      })
      showGroupVisible.value = false
      return
    }
    if (showGroupType.value !== 0) {
      if (!groupForm.value.name) {
        ElMessage({
          message: $t('biz.imgbox.groupEmpty'),
          type: 'warning',
          duration: 1000
        })
        return
      }
      const flag = groupList.value.some(item => {
        return item.name === groupForm.value.name
      })
      if (flag && !groupForm.value.attachFileGroupId) {
        ElMessage({
          message: $t('biz.imgbox.groupExists'),
          type: 'warning',
          duration: 1000
        })
        return
      }
      if (creatingGroup.value) {
        return
      }
      creatingGroup.value = true
      const param = {
        attachFileGroupId: groupForm.value.attachFileGroupId,
        name: groupForm.value.name,
        type: fileType.value
      }
      const request = groupForm.value.attachFileGroupId ? updateFileGroup(param) : saveFileGroup(param)
      request.then(() => {
        groupForm.value.attachFileGroupId = ''
        showGroupVisible.value = false
        loadImageGroup()
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 800,
          onClose: () => {
            creatingGroup.value = false
          }
        })
      }).catch(() => {
        creatingGroup.value = false
      })
    }
  })
}
/**
 * 全选
 */
const AllImgs = () => {
  if (!checkedAll.value) {
    imgRes.value.forEach(img => {
      img.selected = false
    })
    files.value = []
    fileIds.value = []
  } else {
    imgRes.value.forEach(img => {
      files.value.push(JSON.parse(JSON.stringify(img)))
      fileIds.value.push(img.fileId)
      img.selected = true
    })
    const showVideoList = document.querySelectorAll('.showVideo')
    showVideoList.forEach((item) => {
      if (!item.paused) {
        item.pause()
      }
    })
  }
}
// 保存视频全选状态
const isExist = (img) => {
  for (let i = 0; i < files.value.length; i++) {
    if (img.fileId === files.value[i].fileId) {
      return true
    }
  }
  return false
}
/**
 * 批量移动分组
 */
const showMoveImgs = () => {
  if (fileIds.value.length === 0) {
    return message('请选择视频')
  }
  changeNameVisible1.value = true
  groupForm.value = {
    attachFileGroupId: '', // 选择分组的值
    name: '' // 分组名称
  }
}
const MoveImgs = () => {
  batchMoveVedio(groupForm.value.attachFileGroupId, fileIds.value).then(() => {
    files.value = []
    fileIds.value = []
    changeNameVisible1.value = false
    ElMessage.success($t('table.actionSuccess'))
    searchImg()
  })
}
/**
 * 批量删除
 */
const delectImgs = () => {
  if (fileIds.value.length === 0) {
    return message('请选择视频')
  }
  ElMessageBox.confirm('确定要删除视频吗？', $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    batchDeleteVedio(fileIds.value).then(() => {
      files.value = []
      fileIds.value = []
      ElMessage({
        message: '批量删除成功',
        type: 'success',
        duration: 1500
      })
      searchImg()
    })
  })
}

/**
 * 删除分组
 */
const onDeleteFileGroup = (groupId) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    const data = {
      attachFileGroupId: groupId
    }
    deleteFileGroup(data).then(() => {
      dataForm.attachFileGroupId = 0
      loadImageGroup()
      searchImg()
      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 800,
        onClose: () => {
        }
      })
    })
  })
}
// 保存上次点击查询的请求条件
let tempSearchForm = null
/**
 * 加载视频列表数据
 */
const loadListImage = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = {
      pageNum: pageQuery.current ? pageQuery.current : 1,
      pageSize: pageQuery.size,
      type: fileType.value,
      fileName: fileName.value || null,
      attachFileGroupId: dataForm.attachFileGroupId || 0
    }
  } else {
    tempSearchForm.pageNum = pageQuery.current ? pageQuery.current : 1
    tempSearchForm.pageSize = pageQuery.size
    tempSearchForm.type = fileType.value
    tempSearchForm.attachFileGroupId = dataForm.attachFileGroupId || 0
  }
  isLoading.value = true
  videoList.value = []
  page(tempSearchForm).then(response => {
    imgRes.value = response.list
    checkedAll.value = true
    imgRes.value.forEach(img => {
      if (!isExist(img)) {
        img.selected = false
        checkedAll.value = false
      } else {
        img.selected = true
      }
    })
    pageQuery.pages = response.pages
    pageQuery.total = response.total
    isLoading.value = false
    checkedAll.value = false
    disabled.value = true
  })
}

/**
 * 修改视频名称
 */
const changeName = (img) => {
  isTrue.value = true
  changeNameVisible.value = true
  imageObject = img
  oriImgName = img.fileName
  if (img.attachFileGroupId) {
    groupForm.value.attachFileGroupId = img.attachFileGroupId
  } else {
    groupForm.value.attachFileGroupId = ''
  }
  newImgName.value = ''
}
/**
 * 提交修改后的视频名称
 */
const submitImgName = () => {
  if (!isTrue.value) {
    return false
  }
  isTrue.value = false
  const data = {
    fileId: imageObject.fileId,
    fileName: newImgName.value || oriImgName,
    attachFileGroupId: groupForm.value.attachFileGroupId,
    sysType: 3
  }
  updateFileName(data).then(() => {
    newImgName.value = ''
    isTrue.value = true
    changeNameVisible.value = false
    ElMessage({
      message: '保存成功',
      type: 'success',
      duration: 1500
    })
    loadListImage()
  }).catch(() => {
    isTrue.value = true
  })
}
/**
 * 删除视频
 */
const delectImg = (fileName, fileId) => {
  ElMessageBox.confirm('确定要删除视频“' + fileName + '”吗？', $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    const data = {
      fileId
    }
    deleteFile(data).then(() => {
      files.value = []
      ElMessage({
        message: '删除成功',
        type: 'success',
        duration: 1500
      })
      searchImg()
    })
  })
}

/**
 * 点击上传视频按钮
 */
const uploadFileBtn = () => {
  groupForm.value.attachFileGroupId = dataForm.attachFileGroupId || null
  options.activeTab = 'upload'
  files.value = []
  fileIds.value = []
  disabled.value = false
}
const instance = getCurrentInstance()
const limit = ref(0)
/**
 * 点击视频时选中或取消选中视频
 * @param img object
 */
const onClickListImage = (img) => {
  // 多选视频-如果已选中则取消选中
  const imgIndex = selectedImageIndex(img)
  const exist = fileIds.value.some((item) => {
    return img.fileId === item
  })

  if (exist) {
    // 取消视频已选状态
    img.selected = false
    const secodeFiles = JSON.parse(JSON.stringify(files.value))
    const secodeFileIds = JSON.parse(JSON.stringify(fileIds.value))
    secodeFiles.splice(imgIndex, 1)
    secodeFileIds.splice(imgIndex, 1)
    files.value = secodeFiles
    fileIds.value = secodeFileIds
    instance.proxy.$forceUpdate()
    return
  }
  if (!type.value && files.value.length >= limit.value) {
    message($t('biz.videobox.superiorLimit'))
    return false
  }
  files.value.push(JSON.parse(JSON.stringify(img)))
  fileIds.value.push(img.fileId)
  const showVideoList = document.querySelectorAll('.showVideo')
  showVideoList.forEach((item) => {
    if (!item.paused) {
      item.pause()
    }
  })
  img.selected = true
  instance.proxy.$forceUpdate()
}

const pageQuery = reactive({
  current: 1,
  size: 12,
  total: 0
})
/**
 * 按视频名称搜索视频
 */
const searchImg = (newData = false) => {
  pageQuery.current = 1
  loadListImage(newData)
}

/**
 * 视频已选则返回下标，未选则返回-1
 */
const selectedImageIndex = (img) => {
  for (let i = 0; i < fileIds.value.length; i++) {
    const selectedImg = fileIds.value[i]
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
  pageQuery.current = page
  loadListImage()
}

// 视频预上传
let fileNames = []
const onUploadChange = (file, fileList) => {
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
  fileNames = fileList?.map((item) => {
    return item.name
  }).join(',')
  fileNum.value = fileList.length
  if (isSubmit.value) {
    return
  }
  const showVideoList = document.querySelectorAll('.upShowVideo')
  if (fileList.length >= 20) {
    hideUploadEdit.value = true
  }
  const videoSrc = URL.createObjectURL(file.raw)
  videoList.value.push({ url: videoSrc, uid: file.uid })
  showVideoList.forEach((item) => {
    if (!item.paused) {
      item.pause()
    }
  })
}

/**
 * 获取上传视频数据
 */
const onUploadConfirm = () => {
  // 重置文件索引位置和完成文件记录数
  fileIndex.value = 0
  completeCount.value = 0
  if (!uploadRef.value) {
    return
  }
  isSubmit.value = true
  if (fileNum.value === 0) {
    return ElMessage.warning('请选择视频上传')
  }
  sizeFlag.value = 0
  attachFiles.value = []
  getBatchPreSignUrl(fileNames).then(response => {
    ossList = response
    notImg.value = true
    nextTick(() => {
      uploadRef.value?.submit()
    })
  })
}
/**
 * 上传视频
 */
const httpRequest = (event) => {
  videoList.value.forEach(item => {
    if (item.uid === event.file.uid) {
      uploadFile(event)
      notImg.value = true
    }
  })
}
const uploadFile = (event) => {
  const file = event.file

  // 获取本次上传文件的位置
  const currentIndex = fileIndex.value++

  const attachFile = Object.assign({
    fileName: file.name,
    fileSize: file.size,
    type: fileType.value
  })
  const uploadSuccess = () => {
    if (showVideoUploadSuccessMessage) {
      showVideoUploadSuccessMessage = false
      ElMessage({
        message: '上传成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          showVideoUploadSuccessMessage = true
        }
      })
    }
  }

  if (!ossList || ossList.length <= 0) {
    message('数据异常，请刷新后重试')
  }

  // 文件上传
  attachFile.filePath = '/' + ossList[currentIndex].dir + ossList[currentIndex].fileName
  awsImgUpdate(ossList[currentIndex].preSignUrl, file).then(() => {
    attachFiles.value.push(attachFile)
    completeCount.value++
    if (completeCount.value === ossList.length) {
      event.onSuccess()
    }
    uploadSuccess()
  }).catch(() => {
    message('第' + (currentIndex + 1) + '个视频上传失败', true)
    completeCount.value++
    if (completeCount.value === ossList.length) {
      event.onSuccess()
    }
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
    if (sizeFlag.value === 0) {
      message($t('biz.videobox.onlyVideos'), true)
      sizeFlag.value += 1
    }
    videoList.value.forEach((item, index) => {
      if (item.uid === file.uid) {
        videoList.value.splice(index, 1)
      }
    })
    notImg.value = false
    return false
  }
  return true
}

const uploadNumberLimit = () => {
  if (!options.multiple) {
    return 1
  }

  return options.limit - files.value.length
}

const uploadTypeTip = () => {
  return $t('biz.videobox.onlySupported') + ' mp4/mov/wmv ' + $t('biz.videobox.video')
}

const uploadSizeTip = () => {
  return $t('biz.videobox.notExceed') + '20M'
}

const uploadTips = () => {
  const tips = [uploadTypeTip(), uploadSizeTip()]
  if (!options.multiple) {
    return tips.join('，')
  }

  if (files.value.length > 0) {
    tips.push($t('biz.videobox.alreadyExist') + files.value.length + $t('biz.videobox.unit'))
  }

  const uploadFileNum = videoList.value.length ? videoList.value.length : 0
  if (uploadFileNum > 0) {
    tips.push($t('biz.videobox.soonUpload') + uploadFileNum + $t('biz.videobox.unit'))
  }

  uploadFileFlag.value = uploadFileNum >= options.limit
  tips.push($t('biz.videobox.remainder') + (options.limit - files.value.length - uploadFileNum) + $t('biz.videobox.unit') + $t('biz.videobox.upload'))

  return tips.join('，')
}

/**
 * 上传错误处理
 */
const onUploadError = () => {
  message($t('biz.videobox.maxSelect') + uploadNumberLimit() + $t('biz.videobox.unit') + $t('biz.videobox.upload'))

  // videoUploadPercent = file.percentage.toFixed(0) * 1
  hideUploadEdit.value = false
}

/**
 * 上传成功处理，并提交视频数据·
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
      obj.attachFileGroupId = groupForm.value.attachFileGroupId
      obj.type = fileType.value
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
      isSubmit.value = false
      loadListImage()
    })
  }
  disabled.value = true
  uploadRef.value.uploadFiles = []
  pageQuery.current = 1
  groupForm.value.name = ''
  groupForm.value.attachFileGroupId = ''
  selectGroupName.value = ''
  setTimeout(() => {
    hideUploadEdit.value = false
  }, 1000)
}
/**
 * 选择上传文件超过限制文件个数提示
 */
const message = (msg, isInfo) => {
  let type = 'error'
  if (isInfo) {
    type = 'info'
  }
  ElMessage({
    message: msg,
    type,
    duration: 1500
  })
}

// 删除预览视频
const preDeleteVideo = (index) => {
  uploadRef.value.handleRemove(videoList.value[index])
  videoList.value.splice(index, 1)
  // upload.uploadFilesRef.value?.splice(index, 1)
  setTimeout(() => {
    hideUploadEdit.value = false
  }, 1000)
}

</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
