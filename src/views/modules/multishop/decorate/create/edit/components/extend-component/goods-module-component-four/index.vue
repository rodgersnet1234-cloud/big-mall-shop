<template>
  <div class="goods-module-component">
    <goods-module-four :config="config" />
  </div>
</template>
<script setup>
import goodsModuleFour from '../../../../common-component/goods-module-four/index.vue'
const props = defineProps({
  itemComponent: { // 组件的信息
    type: Object,
    default: () => {}
  }
})

const config = ref({})
watch(() => props.itemComponent, (newVal) => {
  if (JSON.stringify(newVal.rightConfigMessage) !== '{}') {
    config.value = {
      bgImg: newVal.rightConfigMessage.bgImg,
      goodsList: newVal.rightConfigMessage.goodsList
    }
  } else {
    config.value = {
      bgImg: '',
      goodsList: []
    }
  }
}, {
  immediate: true,
  deep: true
})

</script>
<style lang="scss" scoped>
$currentContentWidth: 1200px ; // 当前页面内容宽度
.goods-module-component {
  width: $currentContentWidth;
  background: #fff;
  margin: 0 auto;
}
</style>
