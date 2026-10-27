<template>
  <div class="interval-container">
    <div class="config-items">
      <div class="title">
        {{ $t(`pcdecorate.axinterval.highly`) }}
      </div>
      <div class="right-select">
        <el-slider
          v-model="interConfigForm.height"
          :min="5"
          :max="1000"
          show-input
          @change="interChange"
        />
      </div>
    </div>
    <div class="config-items">
      <div
        class="title"
        style="width: 60px"
      >
        {{ $t(`pcdecorate.axinterval.background`) }}
      </div>
      <div
        class="right-select"
        style="display: flex; align-items: center;justify-content: space-around;margin-left: 10px"
      >
        <el-color-picker
          v-model="interConfigForm.bgColor"
          color-format="rgba"
          :show-alpha="true"
          @change="handleChangeColor"
        />
        <span
          class="resets"
          @click="handleReset"
        >{{ $t(`pcdecorate.axinterval.reset`) }}</span>
        <span class="color-show">{{ interConfigForm.bgColor }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>

const props = defineProps({
  currentRef: { // 当前组件的ref
    type: String,
    default: () => ''
  },
  currentItem: { // 点击组件回显右边配置的信息
    type: Object,
    default: () => {}
  },
  editItem: { // 已配置好的信息
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits(['handleUpdateMessage', 'handleChangeColor'])

const interConfigForm = ref({
  height: 20,
  bgColor: 'rgba(244, 244, 244, 1)'
})
watch(() => interConfigForm.value, (newVal) => {
  const obj = {
    type: 'auxiliary_interval',
    ref: props.currentRef,
    config: newVal
  }
  emit('handleUpdateMessage', obj)
}, { deep: true })
watch(() => props.currentItem, (newVal) => { // 监听组件的回显
  if (newVal.currentConfigType === 'auxiliary_interval') {
    if (JSON.stringify(newVal.config) !== '{}') { // 如果当前不能为空
      interConfigForm.value = { ...newVal.config }
    } else {
      interConfigForm.value = {
        height: 20,
        bgColor: 'rgba(244, 244, 244, 1)'
      }
    }
  }
})

// 选择背景颜色
const handleChangeColor = () => {
  emit('handleChangeColor', interConfigForm.value.bgColor)
}
// 重置
const handleReset = () => {
  interConfigForm.value.bgColor = 'rgba(244, 244, 244, 1)'
}
// 验证信息
const handleValidate = () => {
  let status = true
  let message = ''
  if (props.editItem.height < 5) {
    status = false
    message = $t('pcdecorate.axinterval.warning1')
  } else {
    status = true
  }
  return {
    status,
    message
  }
}
// 空白高度
const interChange = (val) => {
  interConfigForm.value.height = Math.floor(val)
}
defineExpose({ handleValidate })
</script>
<style lang="scss" scoped>
.interval-container {
    .config-items {
        margin-bottom: 25px;
        display: flex;
        position: relative;
        .title {
            width: 70px;
            display: flex;
            font-size: 13px;
            align-items: center;
            margin-left: 0 !important;
        }
        .title::before {
          width: 0 !important;
        }
        .right-select {
            width: calc(100% - 70px);
            .resets {
                cursor: pointer;
                width: 50px;
                text-align: center;
                color: rgba(21, 91, 212, 1);
            }
            .color-show {
                width: 175px;
                white-space: nowrap;
            }
        }
    }
}
</style>
<!-- eslint-disable-next-line vue-scoped-css/enforce-style-type -->
<style lang="scss">
.interval-container {
    .el-color-picker {
        height: 32px;
        .el-color-picker__trigger {
            width: 110px;
            height: 32px;
        }
    }
}
</style>
