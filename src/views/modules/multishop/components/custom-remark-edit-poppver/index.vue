<template>
  <div
    :class="[showPop ? 'mask' : '']"
    @click="cancelEdit"
  />
  <el-popover
    :visible="showPop"
    :width="235"
    trigger="click"
  >
    <template #reference>
      <el-icon
        class="edit-icon"
        :size="18"
        @click="setComponent"
      >
        <Edit />
      </el-icon>
    </template>
    <div class="custom-con">
      <el-input
        ref="inputRrf"
        v-model="customRemark"
        maxlength="10"
        show-word-limit
        @keydown.enter="saveEdit"
      />
      <div class="btn-row">
        <el-button
          plain
          @click="cancelEdit"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="saveEdit"
        >
          保存
        </el-button>
      </div>
    </div>
  </el-popover>
</template>

<script setup>
const props = defineProps({
  index: {
    type: Number,
    required: true
  },
  currentEditComponent: {
    type: [Object, Number],
    default: () => {},
    require: true
  }
})
const showPop = ref(false)
const currentCom = ref({})
watch(() => props.currentEditComponent, (newVal) => {
  currentCom.value = newVal
  customRemark.value = newVal.customRemark || ''
})

const inputRrf = ref()
const customRemark = ref('')

const emit = defineEmits(['save-edit', 'set-current-component'])

const setComponent = () => {
  emit('set-current-component', props.index)
  showPop.value = true
  inputRrf.value.focus()
}
const cancelEdit = () => {
  customRemark.value = currentCom.value.customRemark || ''
  showPop.value = false
}
const saveEdit = () => {
  emit('save-edit', customRemark.value)
  showPop.value = false
}
</script>

<style scoped lang="scss">
// eslint-disable-next-line
.design-editor-component-title {
  .edit-icon {
    color: #999;
  }
}
.mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0);
  z-index: 9999;
}
.edit-icon {
  cursor: pointer;
  :hover {
    color: var(--el-color-primary);
  }
}
.custom-con {
  display: flex;
  flex-direction: column;
  align-items: center;
  .btn-row {
    margin-top: 20px;
  }
}
</style>
