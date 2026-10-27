<template>
  <!-- 这种楼层标题的公共组件 -->
  <div
    class="floor-title-container"
    :style="{'background': configMessage.background}"
  >
    <div
      class="floor_titles_content"
      :style="setMarginStyle()"
    >
      <div class="common_floor_titles">
        <div class="left-content">
          <div
            class="main-title"
            :style="setMainStyle()"
          >
            {{ configMessage.mainContent.title }}
          </div>
          <div
            v-show="configMessage.showSubTitle === 0"
            class="other-title"
            :style="setSubStyle()"
          >
            {{ configMessage.subContent.title }}
          </div>
        </div>
        <div class="right-content">
          <div
            v-show="configMessage.showMore === 0"
            class="see-more"
          >
            <span :style="{color: configMessage.moreTextColor}">{{ $t(`pcdecorate.floorTitle.more`) }}</span>
            <el-icon
              :style="{color: configMessage.moreTextColor}"
              class="el-icon-arrow-right"
            >
              <ArrowRight />
            </el-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  config: { // 配置信息
    type: Object,
    default: () => {}
  }
})

const configMessage = ref({
  mainContent: { // 主标题配置内容
    title: $t('pcdecorate.floorTitle.mainTitle'),
    fontSize: '16px',
    color: 'rgba(51, 51, 51, 1)'
  },
  background: 'rgba(244, 244, 244, 1)', // 背景颜色
  marginTop: '18px', // 上边距
  marginBottom: '18px', // 下边距
  showMore: 0, // 查看更多是否展示
  path: {
    link: '',
    name: '',
    type: ''
  }, // 查看更多的链接
  moreTextColor: 'rgba(153, 153, 153, 1)', // 查看更多的文字颜色
  showSubTitle: 0, // 是否展示副标题
  subContent: { // 副标题配置内容
    title: $t('pcdecorate.floorTitle.subTitle'),
    fontSize: '12px',
    color: 'rgba(153, 153, 153, 1)'
  }
}
)
watch(() => props.config, (newVal) => { // 监听配置信息的改变
  if (JSON.stringify(newVal) !== '{}') {
    configMessage.value = newVal
  }
}, {
  immediate: true,
  deep: true
})
// 主标题的样式
const setMainStyle = () => {
  const { fontSize, color } = configMessage.value.mainContent
  return {
    'font-size': fontSize,
    color
  }
}
// 副标题的样式
const setSubStyle = () => {
  const { fontSize, color } = configMessage.value.subContent
  return {
    'font-size': fontSize,
    color
  }
}
// 上下边距的样式
const setMarginStyle = () => {
  const { marginTop, marginBottom } = configMessage.value
  return {
    'margin-top': marginTop,
    'margin-bottom': marginBottom
  }
}

</script>
<style lang="scss" scoped>
$currentContentWidth: 1200px; // 当前页面内容宽度
.floor-title-container {
    width: 100%;
    overflow: hidden;
  .floor_titles_content {
    width: 100%;
    .common_floor_titles {
    width: $currentContentWidth;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 auto;
    .left-content {
        display: flex;
        width: 80%;
        white-space: nowrap;
        overflow: hidden;
        .main-title {
            font-family: Microsoft YaHei,sans-serif;
        }
        .other-title {
            margin-left: 12px;
            font-family: Microsoft YaHei,sans-serif;
            display: flex;
            align-items: flex-end;
        }
    }
    .right-content {
        .see-more {
            display: flex;
            align-items: center;
            span {
                font-size: 12px;
                color: #999;
                font-family: Microsoft YaHei,sans-serif;
            }
            .el-icon-arrow-right {
                color: #999;
                font-size: 12px;
            }
        }
    }
  }
}
}

</style>
