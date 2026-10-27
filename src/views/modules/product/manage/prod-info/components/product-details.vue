<template>
  <!-- 发布商品：03、编辑商品详情 -->
  <div class="product-details-component">
    <div class="prod-det-box">
      <div class="prod-content">
        <tiny-mce
          ref="tinyMce"
          v-model:modelValue="detailPar"
          :height="600"
        />
      </div>
      <!-- 详情预览 -->
      <div class="details-preview">
        <div class="preview-box-title">
          详情页预览图
        </div>
        <div
          v-rich="detailPar"
          class="preview-con"
        />
      </div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  detail: {
    type: String,
    default: null
  }
})

const detailPar = ref(props.detail)

const emit = defineEmits(['updateDetail', 'update:detail'])

watch(() => detailPar.value, (newVal) => {
  emit('update:detail', newVal)
})

</script>

<style lang="scss" scoped>
.product-details-component {
  .prod-det-box {
    display: flex;
    justify-content: space-between;
    .prod-content {
      width: 60%;
      margin-right: 30px;
      // 富文本编辑框样式修改
      & :deep(.tinymce-container) {
        .mce-panel,
        .mce-container-body.mce-flow-layout {
          border-color: #DCDCDC !important;
        }
        .mce-edit-area {
          border-top: 0;
        }
      }
    }

    // 详情预览
    .details-preview {
      width: 40%;
      border: 1px solid #DCDCDC;
      box-sizing: border-box;
      .preview-box-title {
        height: 45px;
        line-height: 45px;
        background: #f9f9f9;
        text-align: center;
        border-bottom: 1px solid #DCDCDC;
      }
      .preview-con {
        height: 540px;
        word-wrap: break-word;
        overflow-y: auto;
        padding: 0 10px;
        box-sizing: border-box;
        :deep(.wscnph){
          vertical-align: middle;
          max-width: 100%;
        }
      }
    }

    @media only screen and (min-width: 1470px){//当屏幕最小1470时
      .preview-con{
        max-height: 580px;
      }
    }
    @media only screen and (max-width:1469px){//当屏幕最大1469时
      .preview-con{
        max-height: 623px;
      }
    }

  }
}
</style>
