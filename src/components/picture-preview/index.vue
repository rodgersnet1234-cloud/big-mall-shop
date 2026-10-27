<template>
  <el-dialog
    v-model="visible"
    :close-on-click-modal="false"
    top="10vh"
    :append-to-body="true"
    :lock-scroll="true"
    class="picture-preview-compoment"
    width="650px"
  >
    <div class="img-box">
      <ImgShow
        :src="imgUrl"
        :class-list="['img']"
      />
    </div>
  </el-dialog>
</template>

<script setup>

const Data = reactive({
  imgUrl: '',
  visible: false
})

const { imgUrl, visible } = toRefs(Data)

const init = (imgUrl) => {
  Data.imgUrl = checkFileUrl(imgUrl)
  Data.visible = true
}

defineExpose({
  init
})

</script>

<style lang="scss" scoped>
.picture-preview-compoment {
  .img-box {
    display: block;
    width: 100%;
    max-height: 700px;
    overflow: auto;
  }
  .img-box::-webkit-scrollbar {
    display: none;
  }
}
</style>
