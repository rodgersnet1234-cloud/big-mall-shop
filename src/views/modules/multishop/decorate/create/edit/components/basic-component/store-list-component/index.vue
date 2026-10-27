<template>
  <div class="store-list-container">
    <div class="store-list-pages">
      <div class="store-top">
        <common-floor-title :config="titleConfig" />
      </div>
      <div class="store-bottom">
        <store-list-component :config="storeConfig" />
      </div>
    </div>
  </div>
</template>
<script setup>
import commonFloorTitle from '../../../../common-component/floor-title-component/index.vue'
import storeListComponent from '../../../../common-component/storelist-component/index.vue'
const props = defineProps({
  itemComponent: { // 当前组件的信息
    type: Object,
    default: () => {}
  }
})

const titleConfig = ref({
  mainContent: {
    title: $t('pcdecorate.storeList.storeTitle'),
    fontSize: '16px',
    color: '#333'
  },
  background: '',
  marginTop: '0px',
  marginBottom: '0px',
  showMore: 0,
  moreLink: '',
  moreTextColor: '#999',
  showSubTitle: 0,
  subContent: {
    title: $t('pcdecorate.storeList.storeSubTitle'),
    fontSize: '12px',
    color: '#999'
  }
}) // 标题配置
const storeConfig = ref({}) // 店铺配置

watch(() => props.itemComponent, (newVal) => {
  if (JSON.stringify(newVal.rightConfigMessage) !== '{}') {
    titleConfig.value = {
      mainContent: { // 主标题
        title: $t('pcdecorate.storeList.storeTitle'),
        fontSize: newVal.rightConfigMessage.mainFontSize + 'px', // 主标题文字大小
        color: newVal.rightConfigMessage.mainTextColor // 主标题颜色
      },
      background: newVal.rightConfigMessage.bgColor, // 标题的背景颜色
      marginTop: newVal.rightConfigMessage.marginTop + 'px', // 上边距
      marginBottom: newVal.rightConfigMessage.marginBottom + 'px', // 下边距
      showMore: 0,
      moreLink: '',
      moreTextColor: '#999',
      showSubTitle: newVal.rightConfigMessage.showSubTitle, // 是否展示副标题
      subContent: {
        title: newVal.rightConfigMessage.subTitle,
        fontSize: newVal.rightConfigMessage.subFontSize + 'px',
        color: newVal.rightConfigMessage.subTextColor
      }
    }
    // 店铺列表展示
    storeConfig.value = {
      storeList: newVal.rightConfigMessage.storeList
    }
  }
}, {
  immediate: true,
  deep: true
})
</script>
<style lang="scss" scoped>
$maxWidth: 1150px; // 设计图整个宽度
$contentWidth: 886px; // 设计内容宽度
$currentMaxWidth: 1145px; // 当前页面的实际宽度
$currentContentWidth: calc(($contentWidth * $currentMaxWidth) / $maxWidth) ; // 当前页面内容宽度
.store-list-container {
    width: 100%;
    overflow: hidden;
    background: #fff;
    .store-list-pages {
        width: $currentContentWidth;
        margin: 0 auto;
        display: flex;
        flex-direction: column; // 上10  下15
        .store-bottom {
            margin-bottom: 26px;
        }
    }
}

</style>
