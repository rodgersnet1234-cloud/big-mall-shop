<!--
 Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

 https://www.mall4j.com/

 未经允许，不可做商业用途！

 版权所有，侵权必究！
-->
<template>
  <div class="imgs-upload-components">
    <div class="el-upload-list el-upload-list--picture-card">
      <vue-draggable-next
        v-model="imageList"
        @start="onDragStart"
        @end="onDragEnd"
      >
        <!--拷贝上传图片组件生成的预览图元素代码，用绑定的model循环生成可拖拽元素-->
        <li
          v-for="(item,index) in imageList"
          :key="index"
          tabindex="0"
          class="el-upload-list__item is-success"
        >
          <img-show
            :src="item.url"
            :class-list="['el-upload-list__item-thumbnail']"
          />
          <a class="el-upload-list__item-name">
            <el-icon><Document /></el-icon>
          </a>
          <label class="el-upload-list__item-status-label">
            <el-icon class="el-icon-check"><Check /></el-icon>
          </label>
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-preview">
              <el-icon @click="handlePictureCardPreview(item.url)"><ZoomIn /></el-icon>
            </span>
            <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleRemove(index)"
            >
              <el-icon><Delete /></el-icon>
            </span>
          </span>
        </li>
      </vue-draggable-next>
      <li
        v-if="!disabled && imageList.length < limit"
        class="el-upload-list__item"
        @click="elxImgboxHandle"
      >
        <div
          tabindex="0"
          class="el-upload el-upload--picture-card"
        >
          <el-icon><Plus /></el-icon>
        </div>
        <!-- 弹窗, 新增图片 -->
        <img-box
          v-if="elxImgboxVisible"
          ref="elxImgboxRef"
          @refresh-pic="refreshPic"
        />
      </li>
    </div>
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
import { watch } from 'vue'
import { ElMessage } from 'element-plus'
import { VueDraggableNext } from 'vue-draggable-next'

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const elxImgboxVisible = ref(false)
const imageList = ref([])

const props = defineProps({
  modelValue: {
    default: '',
    type: String
  },
  // 最大上传数量
  limit: {
    default: 9,
    type: Number
  },
  // false: 能对图片进行操作  true: 不能对图片进行操作
  disabled: {
    default: false,
    type: Boolean
  },
  modal: {
    default: true,
    type: Boolean
  },
  prompt: {
    default: true,
    type: Boolean
  }
})

const emit = defineEmits(['update:modelValue'])

watch(() => imageList.value, () => {
  const pics = imageList.value.map(file => {
    return file.response
  }).join(',')
  emit('update:modelValue', pics)
})

watch(() => props.modelValue, () => {
  getImgArr()
})

onMounted(() => {
  getImgArr()
})

// 将图片路径传入数组
const getImgArr = () => {
  const res = []
  if (props.modelValue) {
    const imageArray = props.modelValue.split(',')
    for (let i = 0; i < imageArray.length; i++) {
      if (imageArray[i]) {
        res.push({ url: getImgSrc(imageArray[i]), response: imageArray[i] })
      }
    }
  }
  imageList.value = res
}

// 获取图片路径
const getImgSrc = (img) => {
  return checkFileUrl(img)
}

// 删除图片
const handleRemove = (index) => {
  imageList.value.splice(index, 1)
  const pics = imageList.value.map(file => {
    return file.response
  }).join(',')
  emit('update:modelValue', pics)
}

// 放大图片
const handlePictureCardPreview = (imgUrl) => {
  dialogImageUrl.value = imgUrl
  dialogVisible.value = true
}

const onDragStart = (e) => {
  e.target.classList.add('hideShadow')
}

const onDragEnd = (e) => {
  e.target.classList.remove('hideShadow')
}

// 打开图片选择窗
const elxImgboxRef = ref(null)
const elxImgboxHandle = () => {
  const num = props.limit - imageList.value.length
  if (num < 1) {
    ElMessage.error($t('components.imgsUpload.maximumPic'))
    return
  }
  elxImgboxVisible.value = true
  nextTick(() => {
    elxImgboxRef.value.init(0, num)
  })
}

// 接收回调的图片数据
const refreshPic = (imagePath) => {
  const imageArray = imagePath.split(',')
  imageList.value = imageList.value.concat(imageArray.map(img => {
    return { url: getImgSrc(img), response: img }
  }))
  let pics = imageArray.map(img => {
    return img
  }).join(',')
  if (props.modelValue) {
    pics = props.modelValue + ',' + pics
  }

  emit('update:modelValue', pics)
}
</script>

<style lang="scss" scoped>
.imgs-upload-components {
  .el-upload-list--picture-card .el-upload-list__item {
    width: 120px;
    height: 120px;
    border: 1px dashed #d9d9d9;
  }
  .el-upload--picture-card {
    border: 0;
    font-size: 28px;
    color: #8c939d;
    background: #fff;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .el-icon-check {
    color: #fff;
  }
}
</style>
