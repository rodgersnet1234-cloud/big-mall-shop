<template>
  <div class="hot-spot-container">
    <div
      :class="{'hot-spot-content': true, 'two': !(config.width === '100%') }"
      :style="{width: config.width ? config.width : '100%'}"
    >
      <template v-if="config.imgList && config.imgList.length > 0">
        <template
          v-for="(item, index) in config.imgList"
          :key="index"
        >
          <el-image

            class="hotimg-items"
            :src="checkFileUrl(item.url)"
            fit="fill"
          >
            <template #error>
              <div class="image-slot">
                <img
                  src="@/assets/pc-micro-page/show-default.png"
                  alt=""
                >
              </div>
            </template>
          </el-image>
        </template>
      </template>
      <template v-else>
        <div class="hot-spot-default">
          <el-image
            src=""
            fit="fill"
          >
            <template #error>
              <div class="image-slot">
                <img
                  src="@/assets/pc-micro-page/show-default.png"
                  alt=""
                >
              </div>
            </template>
          </el-image>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  itemComponent: { // 组件信息
    type: Object,
    default: () => {}
  }
})

const config = ref({})

watch(() => props.itemComponent, (newVal) => { // 监听组件配置信息
  if (JSON.stringify(newVal.rightConfigMessage) !== '{}') {
    let contentWidth = '100%'
    if (newVal.rightConfigMessage.size === 1200) {
      contentWidth = '1200px'
    } else {
      contentWidth = '100%'
    }
    config.value = {
      width: contentWidth,
      imgList: newVal.rightConfigMessage.imgList
    }
  } else {
    let contentWidth = '100%'
    if (newVal.rightConfigMessage.size === 1200) {
      contentWidth = '1200px'
    } else {
      contentWidth = '100%'
    }
    config.value = {
      width: contentWidth,
      imgList: []
    }
  }
}, {
  deep: true,
  immediate: true
})
</script>
<style lang="scss" scoped>
.hot-spot-container {
    margin: 0 auto;
    width: 100%;
    .image-slot {
    font-size: 60px;
    color: rgba(220, 223, 230, 0.39);
  }
    .hot-spot-content {
        margin: 0 auto;
    }
    :deep(.el-image) {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .hot-spot-default {
        width: 100%;
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
