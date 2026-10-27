<template>
  <div class="mod-marketing-distribution">
    <el-tabs>
      <el-tab-pane label="分销商品管理">
        <distributionProd />
      </el-tab-pane>
      <el-tab-pane label="分销记录">
        <distributionRecords />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import distributionProd from './components/prod.vue'
import distributionRecords from './components/records.vue'
</script>

<style lang="scss" scoped>
.mod-marketing-distribution {
  :deep(.el-tabs__nav-scroll) {
    padding-top: 10px;
    margin-left: 20px;
  }
}
</style>
