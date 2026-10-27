<template>
  <div class="pick-color-component">
    <el-color-picker
      v-model="pickForm.color"
      color-format="rgba"
      :show-alpha="true"
      @change="handleChangeColor"
    />
    <span @click="handleReset">{{ $t(`pcdecorate.axinterval.reset`) }}</span>
    <span>{{ pickForm.color }}</span>
  </div>
</template>
<script setup>

const props = defineProps({
  defineColor: { // 选择的颜色
    type: String,
    default: () => ''
  },
  resetColor: { // 重置的颜色
    type: String,
    default: () => ''
  }
})
const emit = defineEmits(['handleChangeColor'])

const pickForm = ref({
  color: 'rgba(51, 51, 51, 1)'
})

watch(() => props.defineColor, (newVal) => {
  if (newVal) {
    pickForm.value.color = newVal
  }
}, {
  immediate: true,
  deep: true
})

// 当颜色改变
const handleChangeColor = () => {
  emit('handleChangeColor', pickForm.value.color)
}
// 重置
const handleReset = () => {
  if (props.resetColor === '') {
    pickForm.value.color = 'rgba(51, 51, 51, 1)'
  } else {
    pickForm.value.color = props.resetColor
  }
  handleChangeColor()
}

</script>
<style lang="scss" scoped>
.pick-color-component {
    display: flex;
    align-items: center;
    :deep(.el-color-picker) {
        height: 32px;
        .el-color-picker__trigger {
            width: 160px!important;
            height: 32px!important;
        }
    }
    span {
        font-size: 14px;
        font-family: Microsoft YaHei, sans-serif;
        color: #333333;
        &:nth-child(2) {
            color: #155BD4;
            cursor: pointer;
            width: 15%;
            text-align: center;
            display: block;
            margin: 0 5px;
            white-space: nowrap;
        }
        &:nth-child(3) {
            width: calc(100% - 15% - 160px);
            justify-content: center;
            white-space: nowrap;
            font-size: 13px;
            display: flex;
            align-items: center;
        }
    }
}
</style>
