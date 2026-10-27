<!--
 Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

 https://www.mall4j.com/

 未经允许，不可做商业用途！

 版权所有，侵权必究！
-->
<template>
  <div class="component-upload-proof">
    <el-upload
      ref="uploadRef"
      v-model:file-list="fileList"
      :class="['upload-img-preview',!uploadNumberLimit?'hide':'']"
      list-type="picture-card"
      accept=".jpg,.png,.gif,.jpeg"
      action=""
      :http-request="httpRequest"
      :multiple="multiple"
      :auto-upload="true"
      :limit="limit"
      :before-upload="beforeUpload"
      :on-error="onUploadError"
      :on-exceed="onUploadExceedTip"
      :on-remove="onRemove"
      :on-preview="handlePictureCardPreview"
    >
      <el-icon class="el-icon-plus">
        <Plus />
      </el-icon>
    </el-upload>
    <span class="tips">最多上传3张</span>
    <el-dialog
      v-model="dialogVisible"
      :append-to-body="dialogVisible"
      :modal="modal"
      top="7vh"
    >
      <ImgShow :src="dialogImageUrl" />
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import ImageCompressor from 'compressorjs'
import { savePlat } from '@/api/biz/attach-file'
import { awsImgUpdate, getBatchPreSignUrl } from '@/api/biz/oss'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  limit: { // 最大上传数量
    type: Number,
    default: 3
  },
  multiple: { // 是否支持多选
    type: Boolean,
    default: true
  },
  maxSize: { // 最大尺寸（kb）
    type: Number,
    default: 512
  },
  modal: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue'])
const fileList = ref([])
const attachFiles = ref([])

watch(attachFiles, (val) => {
  const imgUrls = val.map(m => m.filePath).join(',')
  emit('update:modelValue', imgUrls)
}, { deep: true })

const httpRequest = (event) => {
  const file = event.file
  getBatchPreSignUrl(file.name).then(response => {
    awsImgUpdate(response[0].preSignUrl, event.file, event).then(() => {
      attachFiles.value.push({
        attachFileGroupId: '',
        fileType: onGetFileType(file),
        filePath: '/' + response[0].dir + response[0].fileName,
        fileName: file.name,
        fileSize: file.size,
        sysType: 3,
        type: 1
      })
      event.onSuccess()
    }).catch(() => {
      ElMessage('图片上传失败', true)
    })
  })
}

const onGetFileType = (file) => {
  const fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
  if (['jpg', 'png', 'gif', 'jpeg'].includes(fileType)) {
    return fileType
  }
  return file.type.split('/')[1]
}

// 移除图片
const onRemove = (file) => {
  for (let i = 0; i < attachFiles.value.length; i++) {
    if (attachFiles.value[i].fileName === file.name) {
      attachFiles.value.splice(i, 1)
      break
    }
  }
}

const uploadNumberLimit = computed(() => {
  if (!props.multiple) {
    return 1
  }
  return props.limit - fileList.value.length
})

/**
 * 选择上传文件超过限制文件个数提示
 */
const onUploadExceedTip = () => {
  ElMessage($t('biz.imgbox.maxSelect') + uploadNumberLimit.value + $t('biz.imgbox.unit') + $t('biz.imgbox.upload'))
}

// 上传图片前检查合法性
const beforeUpload = async (file) => {
  const isImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
  const isSize = file.size / 1024 < props.maxSize
  if (!isImage) {
    ElMessage($t('biz.imgbox.onlyPictures'), true)
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

/**
 * 上传错误处理
 * @param err
 */
const onUploadError = (err) => {
  ElMessage($t('biz.imgbox.requestError'), true)
  throw err
}

// 放大图片
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}

// 保存图片到平台资源管理器
const saveAttachFileToPlat = async () => {
  return new Promise((resolve) => {
    savePlat(attachFiles.value).then(() => {
      resolve(true)
    }).catch(() => {
      resolve(false)
    })
  })
}

const uploadRef = ref(null)
const clearFiles = () => {
  uploadRef.value?.clearFiles()
  attachFiles.value = []
}

defineExpose({
  saveAttachFileToPlat,
  clearFiles
})

</script>

<style lang="scss" scoped>
.component-upload-proof {
  :deep(.upload-img-preview) {
    /* 上传图片预览改为使用背景图片按比例缩放方式 */
    .el-upload--picture-card,
    .el-upload-list--picture-card .el-upload-list__item,
    .el-upload-list--picture-card .el-upload-list__item .wp {
      width: 120px;
      height: 120px;
      line-height: 120px;
      background-size: cover;
      background-position: 50% 50%;
      background-color: #fbfdff;
      border: 1px dashed var(--el-border-color-darker);
    }
    .el-icon--close-tip{
      color: transparent;
    }
  }
  .hide{
    :deep(.el-upload--picture-card){
      display: none;
    }
  }
  .tips{
    font-size: 12px;
    color: #999;
  }
}
</style>
