<template>
  <el-image
    v-for="(imgUrl,imgInx) in imgList"
    :key="imgInx"
    :src="checkFileUrl(imgUrl)"
    class="img-box"
    :preview-src-list="checkFileUrl(imgList)"
    :initial-index="initialIndex"
    @click="initialIndex=imgInx"
  >
    <template #error>
      <img
        class="img-box"
        src="~@/assets/images/def.png"
      >
    </template>
  </el-image>
</template>

<script setup>
defineProps({
  imgList: {
    type: Array,
    default: () => ([])
  }
})
const initialIndex = ref(0)
</script>

<style lang="scss" scoped>
.img-box {
  margin-right: 8px;
  width: 40px;
  height: 40px;
  font-size: 0;
  border-radius: 2px;
  overflow: hidden;
}
</style>
