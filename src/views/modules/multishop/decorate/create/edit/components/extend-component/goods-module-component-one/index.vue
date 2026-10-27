<template>
  <div class="goods-module-one-component">
    <div class="one-items">
      <goods-module-one :config="config.leftConfigMessage" />
    </div>
    <div class="one-items">
      <goods-module-one :config="config.centerConfigMessage" />
    </div>
    <div class="one-items">
      <goods-module-one :config="config.rightConfigMessage" />
    </div>
  </div>
</template>
<script setup>
import goodsModuleOne from '../../../../common-component/goods-module-one/index.vue'
const props = defineProps({
  itemComponent: { // 组件信息展示
    type: Object,
    default: () => {}
  }
})

const config = ref({ // 配置信息
  leftConfigMessage: {
    mainTitle: $t('pcdecorate.floorTitle.mainTitle'),
    subTitle: $t('pcdecorate.floorTitle.subTitle')
  }, // 左边配置信息
  centerConfigMessage: {
    mainTitle: $t('pcdecorate.floorTitle.mainTitle'),
    subTitle: $t('pcdecorate.floorTitle.subTitle')
  }, // 中间配置信息
  rightConfigMessage: {
    mainTitle: $t('pcdecorate.floorTitle.mainTitle'),
    subTitle: $t('pcdecorate.floorTitle.subTitle')
  } // 右边配置信息
}
)
const init = () => {
  config.value.leftConfigMessage = {
    currentIndex: 1, // 当前选择哪列
    mainTitle: '热卖推荐', // 当前主标题
    subTitle: '销量引领购物新风向', // 副标题
    titleLink: {
      name: '', // 跳转的名字
      link: '' // 跳转的链接
    }, // 标题跳转的链接
    goodsList: [] // 商品
  }
  config.value.centerConfigMessage = {
    currentIndex: 3, // 当前选择哪列
    mainTitle: '热卖推荐', // 当前主标题
    subTitle: '销量引领购物新风向', // 副标题
    titleLink: {
      name: '', // 跳转的名字
      link: '' // 跳转的链接
    }, // 标题跳转的链接
    goodsList: [] // 商品
  }
  config.value.rightConfigMessage = {
    currentIndex: 2, // 当前选择哪列
    mainTitle: '热卖推荐', // 当前主标题
    subTitle: '销量引领购物新风向', // 副标题
    titleLink: {
      name: '', // 跳转的名字
      link: '' // 跳转的链接
    }, // 标题跳转的链接
    goodsList: [] // 商品
  }
}
watch(() => props.itemComponent, (newVal) => {
  if (JSON.stringify(newVal.rightConfigMessage) !== '{}') {
    config.value.leftConfigMessage = { ...newVal.rightConfigMessage.leftConfig }
    config.value.centerConfigMessage = { ...newVal.rightConfigMessage.centerConfig }
    config.value.rightConfigMessage = { ...newVal.rightConfigMessage.rightConfig }
  } else {
    init()
  }
}, {
  immediate: true,
  deep: true
})
</script>
<style lang="scss" scoped>
$currentContentWidth: 1200px; // 当前页面内容宽度
.goods-module-one-component {
  width: $currentContentWidth;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .one-items{
    width: calc((100% - 40px) / 3)
  }
}
</style>
