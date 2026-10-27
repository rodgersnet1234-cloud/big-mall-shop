<!--
 Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

 https://www.mall4j.com/

 未经允许，不可做商业用途！

 版权所有，侵权必究！
-->
<template>
  <div class="Mall4j page-picture-manager">
    <div class="file-group">
      <div class="upload-btn">
        <div class="up-btn">
          <el-button
            v-permission="['resource:img:uploadImg']"
            type="primary"
            plain
            @click="uploadFileBtn"
          >
            <el-icon class="el-icon">
              <Top />
            </el-icon>
            上传图片
          </el-button>
          <el-button
            v-permission="['resource:img:saveImgGroup']"
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
              :placeholder="$t('biz.imgbox.picName')"
              style="width: 200px !important"
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
              <span class="sidebar-operate">
                <el-icon
                  v-permission="['resource:img:editImgGroup']"
                  class="el-icon-edit"
                  @click="selectOrCreateGroup(1,gItem.attachFileGroupId,gIdx)"
                ><EditPen />
                </el-icon>
                <el-icon
                  v-permission="['resource:img:deleteImgGroup']"
                  class="el-icon-delete"
                  @click="onDeleteFileGroup(gItem.attachFileGroupId)"
                >
                  <Delete />
                </el-icon>

              </span>
            </div>
          </div>
        </div>

        <!-- 图片列表 -->
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
                v-permission="['resource:img:deleteImgs']"
                class="text"
                @click="delectImgs"
              >删除</span>
              <span
                v-permission="['resource:img:moveImgs']"
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
              <div class="operate">
                <el-link
                  v-permission="['resource:img:editImg']"
                  type="info"
                  class="edit"
                  @click="changeName(img)"
                >
                  {{ $t("table.edit") }}
                </el-link>
                <el-link
                  v-permission="['resource:img:deleteImg']"
                  type="danger"
                  class="del"
                  @click="delectImg(img.fileName, img.fileId)"
                >
                  {{ $t("table.delete") }}
                </el-link>
              </div>
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
              暂无图片
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
              <span>分组：</span>
              <el-select
                v-model="groupForm.attachFileGroupId"
                class="select-array"
                placeholder="选择图片分组"
                clearable
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
              class="upload-img-preview"
              list-type="picture-card"
              accept=".jpg,.png,.gif"
              action=""
              :http-request="httpRequest"
              :multiple="true"
              :auto-upload="false"
              :limit="uploadNumberLimit()"
              :before-upload="beforeUpload"
              :on-success="onUploadSuccess"
              :on-error="onUploadError"
              :on-exceed="onUploadExceedTip"
              :on-change="onUploadChange"
              :before-remove="beforeRemove"
              :on-remove="onRemove"
              :class="{hide: hideUploadEdit}"
            >
              <el-icon>
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
        :title="showGroupType.value===0 ? '选择分组'
          :showGroupType.value===1?'新建分组':'修改分组名称'"
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
            v-if="showGroupType!== 0"
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
            v-if="showGroupType.value ===0"
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
      <!-- native modifier has been removed, please confirm whether the function has been affected  -->
      <el-form
        v-if="changeNameVisible"
        ref="imgDataFormRef"
        :model="imageObject"
        label-width="90px"
        @submit.prevent
      >
        <el-form-item :label="`图片`">
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
            maxlength="20"
            :placeholder="$t('biz.imgbox.inputNewName')"
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
    <!-- /修改图片名称 -->

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
import { batchDeleteImgs, batchMoveImgs } from '@/api/resource/picture-store'
import ImageCompressor from 'compressorjs'
import { Debounce } from '@/utils/debounce'
const fileList = ref([])
let images = [] // 已选图片
let fileIds = [] // 已选图片的fileId
const sizeFlag = ref(0) // 避免错误提示重复弹出
const uploadRef = ref(null)
const groupFormRef = ref(null)
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
const showGroupVisible = ref(false) // 选择/创建分组弹窗
const showGroupType = ref(0) // 0选择分组 1创建分组 2修改分组
const groupForm = ref({
  attachFileGroupId: '', // 选择分组的值
  name: '' // 分组名称
})
const fileType = ref(1) // 文件类型
const selectGroupName = ref('') // 选中的分组名称
let oriImgName = null // 图片原名称
const options = reactive({
  multiple: true, // 是否支持选取多个图片
  limit: 20, // 最多可选择图片数量
  maxSize: 512, // 最大尺寸（kb）
  activeTab: 'pick',
  enableUpload: false, // 是否启用图片上传
  callback: null
})
const newImgName = ref('')
let ossList = []
const isTrue = ref(true)
const changeNameVisible = ref(false)
const changeNameVisible1 = ref(false)
const type = ref(2)
const fileName = ref('')
const isLoading = ref(true)
const visible = ref(false)
const disabled = ref(false)
const notImg = ref(false)
const imgRes = ref([])
const checkedAll = ref(false)
const pageQuery = reactive({
  current: 1,
  size: 18,
  total: 0
})
const fileNum = ref(0)
const limit = ref(0)
const creatingGroup = ref(false) // 正在新建分组
const fileIndex = ref(0) // 图片位置索引，用于获取文件数组中当前上传文件的位置
const completeCount = ref(0) // 传输完成数量，用于控制文件全部上传成功才进入onSuccess方法
const uploadDisabled = ref(false)
const uploadSubmitFlag = ref(false)
const showPicUploadSuccessMessage = ref(true)// 是否提示上传成功

const isIndeterminate = computed(() => {
  const someRes = imgRes.value.some(imgItem => imgItem.selected)
  const everyRes = imgRes.value.every(imgItem => imgItem.selected)
  return someRes && !everyRes
})
const rules = reactive({
  name: [
    { required: true, message: '分组名称不能为空', trigger: 'blur' },
    { min: 1, max: 20, message: '长度在1-20个字符', trigger: 'blur' }
  ]
})
onMounted(() => {
  loadImageGroup()
  loadListImage()
})
/**
 * 加载图片分组列表
 */
const loadImageGroup = () => {
  pageFileGroup({ type: fileType.value }).then((responeseData) => {
    groupList.value = responeseData
    groupForm.value.attachFileGroupId = null
    if (changeNameVisible1.value || options.activeTab === 'upload') {
      responeseData.forEach(item => {
        if (groupForm.value.name === item.name) {
          groupForm.value.attachFileGroupId = item.attachFileGroupId
        }
      })
    }
  })
}
/**
 * 点击图片分组item
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
      showGroupType.value = 2 // 修改分组名称
    }
  }
  if (st === 0) { // 选择分组
    if (!groupList.value.length) {
      ElMessage({
        message: '当前暂无分组可选择，请先创建分组',
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
        message: '分组名称不能为空格',
        type: 'warning',
        duration: 1000
      })
      return
    }
    if (showGroupType.value === 0) {
      if (!groupForm.value.attachFileGroupId) {
        ElMessage({
          message: '请选择分组',
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
          message: '分组名称不能为空',
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
          message: '分组已存在',
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
        loadImageGroup()
        groupForm.value.attachFileGroupId = ''
        showGroupVisible.value = false
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
 * 加载图片列表数据
 */
const loadListImage = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = {
      pageNum: pageQuery.current ? pageQuery.current : 1,
      pageSize: pageQuery.size,
      fileName: fileName.value || null,
      attachFileGroupId: dataForm.attachFileGroupId || '',
      type: fileType.value,
      sysType: 3
    }
  } else {
    tempSearchForm.pageNum = pageQuery.current ? pageQuery.current : 1
    tempSearchForm.pageSize = pageQuery.size
    tempSearchForm.attachFileGroupId = dataForm.attachFileGroupId || ''
    tempSearchForm.type = fileType.value
  }
  isLoading.value = true
  page(tempSearchForm).then(response => {
    imgRes.value = response.list
    checkedAll.value = true
    checkedAll.value = imgRes.value.length === 0 ? false : checkedAll.value
    imgRes.value.forEach(img => {
      // img.selected = false
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
  })
}

let imageObject = null
/**
 * 修改图片名称
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
 * 提交修改后的图片名称
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
 * 全选
 */
const AllImgs = () => {
  if (!checkedAll.value) {
    imgRes.value.forEach(img => {
      img.selected = false
    })
    images = []
    fileIds = []
  } else {
    imgRes.value.forEach(img => {
      images.push(JSON.parse(JSON.stringify(img)))
      fileIds.push(img.fileId)
      img.selected = true
    })
  }
}
// 保存图片全选状态
const isExist = (img) => {
  for (let i = 0; i < images.length; i++) {
    if (img.fileId === images[i].fileId) {
      return true
    }
  }
  return false
}
/**
 * 批量移动分组
 */
const imgDataFormRef = ref(null)
const showMoveImgs = () => {
  if (images.length === 0 || fileIds.length === 0) {
    return message('请选择图片')
  }
  changeNameVisible1.value = true
  groupForm.value = {
    attachFileGroupId: '', // 选择分组的值
    name: '' // 分组名称
  }
}
const MoveImgs = () => {
  batchMoveImgs(groupForm.value.attachFileGroupId, fileIds).then(() => {
    images = []
    fileIds = []
    changeNameVisible1.value = false
    ElMessage.success($t('table.actionSuccess'))
    searchImg()
  })
}
/**
 * 批量删除图片
 */
const delectImgs = () => {
  if (images.length === 0 || fileIds.length === 0) {
    return message('请选择图片')
  }
  ElMessageBox.confirm('确定要删除图片吗？', $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    batchDeleteImgs(fileIds).then(() => {
      images = []
      fileIds = []
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
 * 删除图片
 */
const delectImg = (fileName, fileId) => {
  ElMessageBox.confirm('确定要删除图片“' + fileName + '”吗？', $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    const data = {
      fileId
    }
    deleteFile(data).then(() => {
      images = []
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
 * 点击上传图片按钮
 */
const uploadFileBtn = () => {
  options.activeTab = 'upload'
  images = []
  fileIds = []
  disabled.value = false
  groupForm.value.attachFileGroupId = dataForm.attachFileGroupId || null
}

const instance = getCurrentInstance()
/**
 * 点击图片时选中或取消选中图片
 * @param img object
 */
const onClickListImage = (img) => {
  // 多选图片-如果已选中则取消选中
  const imgIndex = selectedImageIndex(img)
  if (img.selected) {
    // 取消图片已选状态
    img.selected = false
    images.splice(imgIndex, 1)
    fileIds.splice(imgIndex, 1)
    checkedAll.value = checkAll(images, imgRes.value)
    instance.proxy.$forceUpdate()
    return
  }
  if (!type.value && images.length >= limit.value) {
    message($t('biz.imgbox.superiorLimit'))
    return false
  }

  images.push(JSON.parse(JSON.stringify(img)))
  fileIds.push(img.fileId)

  img.selected = true
  checkedAll.value = checkAll(images, imgRes.value)
  instance.proxy.$forceUpdate()
}

/**
 * 检查是否全选了
 * 检查a是否全包含b
 */
const checkAll = (a, b) => {
  // a和b其中一个不是数组，直接返回false
  if (!(a instanceof Array) || !(b instanceof Array)) return false
  const len = b.length
  // a的长度小于b的长度，直接返回false
  if (a.length < len) return false
  for (let i = 0; i < len; i++) {
    // 遍历b中的元素，遇到a没有包含某个元素的，直接返回false
    if (!a.some(item => item.fileId === b[i].fileId)) return false
  }
  // 遍历结束，返回true
  return true
}

/**
 * 按图片名称搜索图片
 */
const searchImg = (newData = false) => {
  pageQuery.current = 1
  loadListImage(newData)
}

/**
 * 图片已选则返回下标，未选则返回-1
 */
const selectedImageIndex = (img) => {
  for (let i = 0; i < images.length; i++) {
    const selectedImg = images[i]
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

/**
 * 获取上传图片数据
 */
const onUploadConfirm = Debounce(() => {
  uploadSubmitFlag.value = true
  const time = setTimeout(() => {
    uploadSubmitFlag.value = false
    clearTimeout(time)
  }, 1000)
  // 重置文件索引位置和完成文件记录数
  fileIndex.value = 0
  completeCount.value = 0
  ossList = []
  attachFiles.value = []
  sizeFlag.value = 0
  if (fileNum.value === 0) {
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
    notImg.value = true
    nextTick(() => {
      uploadRef.value?.submit()
    })
  })
}, 1500)

/**
 * 上传图片
 */
const httpRequest = (event) => {
  if (sizeFlag.value !== 0) {
    return
  }
  // 获取本次上传文件的位置
  const index = ossList.findIndex(item => item.name === event.file.name)
  const file = event.file
  const typeArray = file.type.split('/')
  if (typeArray[1] === 'jpeg') {
    typeArray[1] = 'jpg'
  }
  const attachFile = Object.assign({
    attachFileGroupId: file.attachFileGroupId,
    fileType: typeArray[1],
    fileName: file.name,
    fileSize: file.size,
    type: 1
  })
  const uploadSuccess = () => {
    if (showPicUploadSuccessMessage.value) {
      showPicUploadSuccessMessage.value = false
      ElMessage({
        message: '上传成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          showPicUploadSuccessMessage.value = true
        }
      })
    }
  }

  if (ossList.length <= 0) {
    message('数据异常，请刷新后重试')
  }
  // 文件上传
  attachFile.filePath = '/' + ossList[index].dir + ossList[index].fileName
  awsImgUpdate(ossList[index].preSignUrl, file, event).then(() => {
    attachFiles.value.push(attachFile)
    completeCount.value++
    if (completeCount.value === ossList.length) {
      event.onSuccess()
    }
    uploadSuccess()
  }).catch(() => {
    message($t('biz.imgbox.uploadBefore') + (index + 1) + $t('biz.imgbox.uploadAfter'), true)
    completeCount.value++
    if (completeCount.value === ossList.length) {
      event.onSuccess()
    }
  })
}
// 图片预上传
// eslint-disable-next-line no-unused-vars
let fileNames = []
const onUploadChange = (file, fileList) => {
  fileNames = fileList?.map((item) => {
    return item.name
  }).join(',')
  if (fileList.length >= 20) {
    hideUploadEdit.value = true
  }
  fileNum.value = fileList.length
}
// eslint-disable-next-line no-unused-vars
const onRemove = (file, fileList) => {
  fileNum.value = fileList.length
  const time = setTimeout(() => {
    hideUploadEdit.value = false
    clearTimeout(time)
  }, 1000)
  if (uploadSubmitFlag.value) {
    uploadDisabled.value = false
  } else {
    uploadDisabled.value = true
    const time1 = setTimeout(() => {
      uploadDisabled.value = false
      clearTimeout(time1)
    }, 1000)
  }
}
const beforeRemove = () => {
  // 防止用户频繁点击导致删除过多
  return !uploadDisabled.value
}
/**
 * 上传图片前检查合法性
 * @param file
 * @returns {boolean}
 */
const beforeUpload = async (file) => {
  const isImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
  const isSize = file.size / 1024 < options.maxSize
  if (!isImage) {
    if (sizeFlag.value === 0) {
      message($t('biz.imgbox.onlyPictures'), true)
      sizeFlag.value += 1
    }
    notImg.value = false
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

  return options.limit - images.length
}

const uploadTypeTip = () => {
  return $t('biz.imgbox.onlySupported') + ' jpg/png/gif ' + $t('biz.imgbox.pic')
}

// const uploadSizeTip = () => {
//   return $t('biz.imgbox.notExceed') + '2M'
// }

const uploadTips = () => {
  const tips = [uploadTypeTip()]
  if (!options.multiple) {
    return tips.join('，')
  }

  if (fileNum.value > 0) {
    tips.push($t('biz.imgbox.alreadyExist') + fileNum.value + $t('biz.imgbox.unit'))
  }
  if (fileNum.value > 0) {
    tips.push($t('biz.imgbox.soonUpload') + fileNum.value + $t('biz.imgbox.unit'))
  }

  tips.push($t('biz.imgbox.remainder') + (options.limit - fileNum.value) + $t('biz.imgbox.unit') + $t('biz.imgbox.upload'))

  return tips.join('，')
}

/**
 * 上传错误处理
 * @param err
 */
const onUploadError = (err) => {
  message($t('biz.imgbox.requestError'), true)
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
      obj.attachFileGroupId = groupForm.value.attachFileGroupId
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
  if (uploadRef.value) {
    uploadRef.value?.clearFiles()
  }
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
const onUploadExceedTip = () => {
  message($t('biz.imgbox.maxSelect') + uploadNumberLimit() + $t('biz.imgbox.unit') + $t('biz.imgbox.upload'))
  hideUploadEdit.value = false
}
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
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
