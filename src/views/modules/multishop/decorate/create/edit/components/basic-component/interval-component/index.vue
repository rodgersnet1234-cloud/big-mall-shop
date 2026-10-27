<template>
  <div
    class="interval-component"
    :style="{'height': config.height, 'background': config.bgColor}"
  />
</template>
<script setup>
const props = defineProps({
  itemComponent: { // 组件信息
    type: Object,
    default: () => {}
  }
})

const config = ref({})
watch(() => props.itemComponent, (newVal) => {
  if (JSON.stringify(newVal.rightConfigMessage) !== '{}') {
    config.value = {
      height: newVal.rightConfigMessage.height + 'px',
      bgColor: newVal.rightConfigMessage.bgColor
    }
  } else {
    config.value = {
      height: '20px',
      bgColor: 'rgba(244, 244, 244, 1)'
    }
  }
}, {
  deep: true,
  immediate: true
})

</script>
<style lang="scss" scoped>
.interval-component {
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9FA4B1;
}
</style>
