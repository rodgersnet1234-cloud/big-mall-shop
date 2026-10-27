<template>
  <div class="component-custom-page-container">
    <div class="config-items">
      <div class="title">
        {{ $t('pcdecorate.commonModal.customLink') }}
      </div>
      <el-input
        v-model="link.url"
        placeholder="输入自定义链接"
        style="width: 50%"
        @blur="link.url=link.url.trim()"
      />
      <img
        src="@/assets/pc-micro-page/selected_link.png"
        alt=""
      >
    </div>
    <div
      v-if="deviceType === 'pc'"
      class="config-items"
    >
      <div class="title">
        是否在浏览器新标签页打开
      </div>
      <el-checkbox v-model="link.checked" />
    </div>
    <div class="config-items config-items-tips">
      <div class="title">
        网站外部链接需填写完整地址，网站内部链接可写为：'/' + 页面路径
      </div>
    </div>
  </div>
</template>
<script setup>

const emit = defineEmits(['handleGoodsSelect'])
const props = defineProps({
  activeName: { // 激活tab名
    type: String,
    default: () => ''
  },
  customLinkArr: { // 自定义链接回显数据
    type: Object,
    default: () => {}
  },
  deviceType: {
    type: String,
    default: () => 'pc'
  }
})

const link = ref({
  url: '',
  checked: true
})

// 回显
const setDatas = () => {
  if (props.customLinkArr && props.customLinkArr.type !== '' && props.customLinkArr.type === '6') {
    link.value = props.customLinkArr.link
    emit('handleGoodsSelect', { type: 'customLink', value: link.value })
  }
}

watch(() => link.value, (val) => {
  emit('handleGoodsSelect', { type: 'customLink', value: val.url.trim() ? val : null })
}, { deep: true })
watch(() => props.activeName, (val) => {
  if (val === '6') {
    link.value = {
      url: '',
      checked: true
    }
    setDatas()
  }
})
</script>
<style lang="scss" scoped>
.component-custom-page-container {
  min-height: 450px;
  max-height: 450px;
  height: 450px;
  overflow-y: auto;
  padding: 20px;
  .config-items {
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: 20px;
    .title {
      margin-right: 20px;
    }
    img {
      position: absolute;
      top: 6px;
      width: 20px;
      height: 20px;
      left: 57.5%;
    }
  }
  .config-items-tips {
    color: #5e5e5e;
  }
  :deep(.el-input__inner) {
    height: 32px;
  }
}
</style>
