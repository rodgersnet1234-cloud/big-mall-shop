<template>
  <div class="goods-module-three">
    <div class="left">
      <goods-module-three :config="config.leftConfig" />
    </div>
    <div class="right">
      <goods-module-three :config="config.rightConfig" />
    </div>
  </div>
</template>
<script setup>
import goodsModuleThree from '../../../../common-component/goods-module-three/index.vue'
const props = defineProps({
  itemComponent: { // 组件的信息
    type: Object,
    default: () => {}
  }
})

const config = ref({ // 配置信息
  leftConfig: {
    title: $t('pcdecorate.floorTitle.mainTitle')
  }, // 左边配置信息
  rightConfig: {
    title: $t('pcdecorate.floorTitle.mainTitle')
  } // 右边配置信息
})

watch(() => props.itemComponent, (newVal) => { // 监听组件的信息
  if (JSON.stringify(newVal.rightConfigMessage) !== '{}') {
    config.value.leftConfig = { // 左边商品列表
      title: newVal.rightConfigMessage.leftConfig.title,
      goodsList: newVal.rightConfigMessage.leftConfig.goodsList
    }
    config.value.rightConfig = { // 右边商品列表
      title: newVal.rightConfigMessage.rightConfig.title,
      goodsList: newVal.rightConfigMessage.rightConfig.goodsList
    }
  } else {
    config.value.leftConfig = {
      title: '热卖推荐',
      goodsList: []
    }
    config.value.rightConfig = {
      title: '热卖推荐',
      goodsList: []
    }
  }
}, {
  immediate: true,
  deep: true
})
</script>
<style lang="scss" scoped>
$currentContentWidth: 1200px; // 当前页面内容宽度
.goods-module-three {
  width: $currentContentWidth;
  margin: 0 auto;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  .left {
    width: calc(50% - 10px);
    margin-right: 10px;
  }
  .right {
    width: calc(50% - 10px);
    margin-left: 10px;
  }
}
</style>
