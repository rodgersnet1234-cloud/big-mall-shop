<template>
  <div class="component-img-upload-box">
    <div class="plugin-images">
      <div
        tabindex="0"
        :class="['el-upload el-upload--text', disabled && !modelValue ? 'disabled' : '']"
        @click="elxImgboxHandle"
      >
        <ImgShow
          v-if="modelValue"
          :src="modelValue"
          :class-list="['pic']"
        />
        <el-icon
          v-else
          class="el-icon-plus pic-uploader-icon"
        >
          <Plus />
        </el-icon>
      </div>
    </div>
    <!-- 弹窗, 新增图片 -->
    <img-box
      v-if="elxImgboxVisible"
      ref="elxImgboxRef"
      @refresh-pic="refreshPic"
    />
    <el-dialog
      v-model="visible"
      :append-to-body="visible"
    >
      <ImgShow :src="modelValue" />
    </el-dialog>
  </div>
</template>

<script setup>
const emit = defineEmits(['update:modelValue'])

const elxImgboxVisible = ref(false)
const visible = ref(false)

const props = defineProps({
  modelValue: {
    default: '',
    type: String
  },
  disabled: {
    default: false,
    type: Boolean
  }
})

// 打开图片选择窗
const elxImgboxRef = ref(null)
const elxImgboxHandle = () => {
  if (props.disabled) {
    if (props.modelValue) openImg()
    return false
  }
  elxImgboxVisible.value = true
  nextTick(() => {
    elxImgboxRef.value?.init(1)
  })
}

const openImg = () => {
  visible.value = true
}

const refreshPic = (imagePath) => {
  emit('update:modelValue', imagePath)
}

</script>
<style lang="scss" scoped>
.component-img-upload-box {
  max-height: 120px;
}
.plugin-images {
  display: inline-block;
  width: auto;
  .el-upload {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 120px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    box-sizing: border-box;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &.disabled {
      cursor: not-allowed;
    }
    .pic-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 120px;
      height: 120px;
      line-height: 120px;
      text-align: center;
    }
    .el-upload:hover {
      border-color: #409eff;
    }
  }
}
</style>
