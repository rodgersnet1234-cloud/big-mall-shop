<template>
  <!-- 标题栏 -->
  <div class="component-customer-profile-title">
    <div class="has-tooltip">
      <span>{{ titleInfo.title }}</span>
      <el-popover
        placement="top"
        width="300"
        trigger="hover"
        :content="titleInfo.content"
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
  </div>
</template>

<script setup>
defineProps({
  titleInfo: {
    type: Object,
    default () {
      return {}
    }
  }
})

</script>

<style lang="scss" scoped>
.component-customer-profile-title {
  // 文字提示框盒子
  .has-tooltip {
    display: flex;
    align-items: center;
    // justify-content: center;
    span {
      line-height: 18px;
      font-size: 18px;
      color: #333;
      font-weight: bold;
    }
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
}
</style>
