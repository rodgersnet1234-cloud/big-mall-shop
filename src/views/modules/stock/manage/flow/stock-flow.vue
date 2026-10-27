<template>
  <div class="page-manage-stock-flow">
    import skuStockFlow from '@/components/sku-stock-flow.vue'
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.page-manage-stock-flow {
  div :deep(.el-tabs__item.is-active) {
    color: #000;
    font-weight: 800;
  }

  div :deep(.el-col-md-6) {
    width: 30%
  }
}
</style>
