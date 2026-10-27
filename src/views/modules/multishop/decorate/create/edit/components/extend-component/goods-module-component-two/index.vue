<template>
  <div class="goods-module-two-component">
    <goods-module-two :config="configMessage" />
  </div>
</template>
<script setup>
import goodsModuleTwo from '../../../../common-component/goods-module-two/index.vue'
const props = defineProps({
  itemComponent: { // 组件信息
    type: Object,
    default: () => {}
  }
})

const configMessage = ref({
  title: $t('pcdecorate.floorTitle.mainTitle')
})

watch(() => props.itemComponent, (newVal) => {
  if (JSON.stringify(newVal.rightConfigMessage) !== '{}') {
    configMessage.value = {
      title: newVal.rightConfigMessage.title, // 自定义标题
      maingoodsList: newVal.rightConfigMessage.maingoodsList, // 主商品
      othergoodsList: newVal.rightConfigMessage.othergoodsList // 其他商品
    }
  } else {
    configMessage.value = {
      title: '热卖推荐',
      maingoodsList: [],
      othergoodsList: []
    }
  }
}, {
  immediate: true,
  deep: true
})
</script>
<style lang="scss" scoped>
$currentContentWidth: 1200px; // 当前页面内容宽度
.goods-module-two-component {
  width: $currentContentWidth;
  margin: 0 auto;
}
</style>
