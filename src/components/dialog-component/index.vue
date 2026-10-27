<template>
  <div class="component-dialog-container">
    <el-dialog
      v-model="visible"
      :title="headerTitle"
      :width="dialogWidth"
      :close-on-click-modal="closeOnClickModal"
      :append-to-body="appendToBody"
      :before-close="handleClose"
      class="dialog-container"
    >
      <template #header>
        <div>
          <slot name="title" />
        </div>
      </template>
      <div class="contents-body">
        <slot name="contents" />
      </div>
      <div class="dialog-footers">
        <slot name="footers" />
      </div>
    </el-dialog>
  </div>
</template>
<script setup>

const emit = defineEmits(['handleClose'])

const props = defineProps({
  headerTitle: { // 头部标题
    type: String,
    default: () => ''
  },
  dialogVisible: { // 弹窗是否显示
    type: Boolean,
    default: () => false
  },
  dialogWidth: { // 弹窗的宽度
    type: String,
    default: () => '50%'
  },
  closeOnClickModal: { // 是否点击遮罩层关闭
    type: Boolean,
    default: () => false
  },
  appendToBody: {
    type: Boolean,
    default: () => true
  }
})
const visible = ref(props.dialogVisible)
watch(() => props.dialogVisible, (val) => {
  visible.value = val
}, { deep: true })
// 关闭弹窗
const handleClose = () => {
  emit('handleClose')
}

</script>
<style lang="scss" scoped>
@use "index";
</style>
