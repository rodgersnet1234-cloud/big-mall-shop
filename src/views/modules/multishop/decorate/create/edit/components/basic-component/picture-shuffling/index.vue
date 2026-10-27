<template>
  <div
    :class="{'picture-shutting-com': true, 'two': config.width ==='1200px'}"
    :style="{width: config.width ==='1200px' ? '1200px' : '100%', 'margin': '0 auto'}"
  >
    <div
      class="picture-shutting-container"
      :style="getContainerStyle"
    >
      <template v-if="config.imgList && config.imgList.length > 0">
        <template
          v-for="(item, index) in config.imgList"
          :key="index"
        >
          <div

            class="picture-items"
            :style="{'width': '100%', 'height': config.height}"
          >
            <el-image
              :src="checkFileUrl(item.img)"
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
      </template>
      <template v-else>
        <div
          class="picture-items"
          :style="{'width': config.width, 'height': config.height, 'background': config.background}"
        >
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
                <div class="advise">
                  {{ $t('pcdecorate.pictureBy.suggest') }}
                </div>
              </div>
            </template>
          </el-image>
        </div>
      </template>
    </div>
    <div
      v-show="config.pageation === 0"
      class="page-container"
    >
      <template
        v-for="(item, index) in config.imgList"
        :key="index"
      >
        <div :class="{'page-items': true,'active': index === 0 }" />
      </template>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  itemComponent: { // 当前组件对应的信息
    type: Object,
    default: () => {}
  }
})

const config = ref({})
// 设置主图样式
const getContainerStyle = computed(() => {
  return {
    height: config.value.height
  }
})
watch(() => props.itemComponent, (newVal) => {
  if (JSON.stringify(newVal.rightConfigMessage) !== '{}') {
    let contentWidth = '100%'
    if (newVal.rightConfigMessage.size === 1200) {
      contentWidth = '1200px'
    } else {
      contentWidth = '100%'
    }
    config.value = {
      width: contentWidth,
      height: newVal.rightConfigMessage.height + 'px',
      pageation: newVal.rightConfigMessage.pageation,
      background: '#fff',
      imgList: newVal.rightConfigMessage.picList
    }
  } else {
    config.value = {
      width: '100%',
      height: '500px',
      pageation: 0,
      background: '#fff',
      imgList: []
    }
  }
}, {
  deep: true,
  immediate: true
})

</script>
<style lang="scss" scoped>
.picture-shutting-com {
    width: 100%;
    overflow: hidden;
    position: relative;
    .image-slot {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        .advise {
            font-size: 13px;
            color: #9FA4B1;
            margin-top: 23px;
        }
    }
    .picture-shutting-container {
        width: 100%;
        overflow: hidden;
        position: relative;
        display: flex;
        .picture-items {
            max-width: 1920px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto;
            position: absolute;
            left: 50%;
            transform: translate(-50%);
            :deep(.el-image) {
                width: 100%;
                height: 100%;
            }
        }
    }
    .page-container {
        position: absolute;
        left: 50%;
        transform: translate(-50%);
        bottom: 10px;
        width: 100%;
        height: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        .page-items {
            width: 31px;
            height: 2px;
            background: rgba(255, 255, 255, 0.39);
            margin-right: 10px;
            &.active {
                background: #fff;
            }
            &:last-child {
                margin-right: 0;
            }
        }
    }
}
</style>
