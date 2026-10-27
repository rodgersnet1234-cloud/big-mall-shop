<template>
  <div class="store-list-components">
    <template v-if="config.storeList && config.storeList.length > 0">
      <div
        v-for="(item, index) in config.storeList"
        :key="index"
        class="store-list-items"
      >
        <div class="images">
          <el-image
            :src="checkFileUrl(item.shoplogo)"
            fit="cover"
          >
            <template #error>
              <div class="image-slot">
                <img
                  style="width: 30px"
                  src="@/assets/pc-micro-page/show-default.png"
                  alt=""
                >
              </div>
            </template>
          </el-image>
        </div>
        <div class="right-content">
          <span>{{ item.shopName }}</span>
          <span>{{ item.shopFocusNumber }}{{ $t('pcdecorate.storeList.storeAttention') }}</span>
          <span>{{ $t('pcdecorate.storeList.storeIn') }}</span>
        </div>
      </div>
    </template>
    <template v-else>
      <template
        v-for="(item, index) in defaultArr"
        :key="index"
      >
        <div class="store-list-items">
          <div class="images">
            <el-image
              src=""
              fit="cover"
            >
              <template #error>
                <div class="image-slot">
                  <img
                    style="width: 30px"
                    src="@/assets/pc-micro-page/show-default.png"
                    alt=""
                  >
                </div>
              </template>
            </el-image>
          </div>
          <div class="right-content">
            <span>{{ $t('pcdecorate.storeList.storeName') }}</span>
            <span>0{{ $t('pcdecorate.storeList.storeAttention') }}</span>
            <span>{{ $t('pcdecorate.storeList.storeIn') }}</span>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
<script setup>
defineProps({
  config: { // 配置店铺
    type: Object,
    default: () => {}
  }
})
const defaultArr = new Array(4)

</script>
<style lang="scss" scoped>
$maxWidth: 1150px; // 设计图整个宽度
$contentWidth: 886px; // 设计内容宽度
$currentMaxWidth: 1145px; // 当前页面的实际宽度
$currentContentWidth: calc(($contentWidth * $currentMaxWidth) / $maxWidth) ; // 当前页面内容宽度
$marginRight: calc(($currentContentWidth * 10px) / $contentWidth);
$marginLeft: calc(($currentContentWidth * 14px) / $contentWidth);
.store-list-components {
    width: 100%;
    background: #fff;
    display: flex;
    flex-wrap: wrap;
    .store-list-items {
        width: calc((100% - 36px ) / 4);
        height: 100%;
        border: 1px solid #F5F5F5;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        margin-right: 12px;
        margin-top: 12px;
        overflow: hidden;
        &:nth-child(1),&:nth-child(2),&:nth-child(3),&:nth-child(4) {
            margin-top: 0;
        }
        &:nth-child(4n) {
            margin-right: 0;
        }
        .images {
            width: calc(($currentContentWidth * 73px) / $contentWidth);
            height: calc(($currentContentWidth * 73px) / $contentWidth);
            margin: calc(($currentContentWidth * 10px) / $contentWidth) calc(($currentContentWidth * 14px) / $contentWidth) calc(($currentContentWidth * 10px) / $contentWidth) calc(($currentContentWidth * 10px) / $contentWidth);
            :deep(.el-image) {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f6f7fa;
            }
        }
        .right-content {
            width: calc(100% - ($currentContentWidth * 73px) / $contentWidth - $marginLeft - $marginRight);
            height: calc(($currentContentWidth * 73px) / $contentWidth);
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            span {
                white-space: nowrap;
                overflow: hidden;
                display: block;
                text-overflow: ellipsis;
                word-break: break-all;
                font-size: 12px;
                font-family: Microsoft YaHei,sans-serif;
                color: #999999;
                &:nth-child(3) {
                    width: calc(($currentContentWidth * 72px) / $contentWidth);
                    height: calc(($currentContentWidth * 23px) / $contentWidth);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #E1251B;
                    border-radius: 12px;
                    color: #fff;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
