<template>
  <!-- 商品洞察 -->
  <div class="data-analysis page-product-insights">
    <div class="product-insights-mod">
      <el-tabs>
        <!-- 商品效果 -->
        <product-effect />
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import productEffect from './components/product-effect/index.vue'
</script>

<style lang="scss" scoped>
.data-analysis.page-product-insights {
  display: block;
  width: 100%;
  :deep(.product-insights-mod) {
    .el-tabs__header {
      margin-bottom: 20px;
    }
    .el-tabs__item.is-active {
      color: #000;
      font-weight: bold;
    }
    .el-tabs__item:hover {
      color: #333;
    }
  }
  .product-insights-mod {
    display: block;
    width: 100%;
    background: #fff;
    padding: 0 20px;
  }
}
</style>
