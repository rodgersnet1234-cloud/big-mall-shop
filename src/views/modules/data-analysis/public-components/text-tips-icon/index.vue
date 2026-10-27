<template>
  <!-- 文字提示icon -->
  <div class="component-text-tips-icon">
    <el-popover
      placement="top"
      width="200"
      trigger="hover"
      :content="content"
    >
      <template #reference>
        <el-button class="tit-mod-btn">
          <div class="que-mark">
            ?
          </div>
        </el-button>
      </template>
    </el-popover>
  </div>
</template>

<script setup>
defineProps({
  content: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss" scoped>
.component-text-tips-icon {
  // 文字提示框的问号icon
  .que-mark {
    display: inline-block;
    width: 14px;
    height: 14px;
    line-height: 14px;
    font-size: 12px;
    text-align: center;
    color: #fff;
    background: #C8C9CC;
    border-radius: 50%;
    margin-left: 5px;
    cursor: default;
  }
}
</style>
