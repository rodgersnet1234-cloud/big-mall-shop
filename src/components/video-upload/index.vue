<template>
  <div class="video-upload-component">
    <div :class="['plugin-video',type==='min'?'min':'']">
      <div
        tabindex="0"
        :class="['el-upload el-upload--text', disabled ? 'disabled' : '']"
        @click.prevent.stop="videoboxHandle"
      >
        <video
          v-if="value"
          ref="myVideo"
          class="video"
          :src="checkFileUrl(value)"
          controls="controls"
        />

        <el-icon
          v-if="!value"
          class="el-icon-plus pic-uploader-icon"
        >
          <Plus />
        </el-icon>
        <span
          v-if="!value&&type==='min'"
          class="text"
        >上传视频</span>
      </div>
    </div>
    <!-- 弹窗, 新增视频 -->
    <video-box
      v-if="videoboxVisible"
      ref="videoboxRef"
      @refresh-pic="refreshPic"
    />
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['update:value'])

const props = defineProps({
  type: {
    default: '',
    type: String
  },
  value: {
    default: '',
    type: String
  },
  disabled: {
    default: false,
    type: Boolean
  }
})

const Data = reactive({
  videoboxVisible: false,
  visible: false
})

const { videoboxVisible } = toRefs(Data)

const videoboxRef = ref(null)
// 打开视频选择窗
const videoboxHandle = () => {
  if (props.disabled) {
    return false
  }
  Data.videoboxVisible = true
  nextTick(() => {
    videoboxRef.value.init(1)
  })
}

const refreshPic = (imagePath) => {
  emit('update:value', imagePath)
}
</script>

<style lang="scss" scoped>
.video-upload-component{
  .plugin-video {
    display: inline-block;
    width: auto;
    .el-upload {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      width: auto;
      min-width: 120px;
      max-width: 300px;
      height: auto;
      min-height: 120px;
      max-height: 250px;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      &.disabled {
        cursor: not-allowed;
      }
      .pic-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: auto;
        height: auto;
        // width: 120px;
        // height: 120px;
        // line-height: 120px;
        text-align: center;
      }
      .video {
        width: auto;
        max-width: 300px;
        // height: 120px;
        height: auto;
        max-height: 250px;
        display: block;
      }
      .el-upload:hover {
        border-color: #409eff;
      }
    }
  }
  .min{
    .el-upload{
      min-width: 80px;
      min-height: 80px;

      .pic-uploader-icon{
        font-size: 18px;
      }

      .text{
        font-size: 14px;
        color: #999;
      }
    }
  }
}
</style>
