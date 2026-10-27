<template>
  <div
    v-if="comboList.length > 0"
    :class="['component-combo-list', className]"
  >
    <div
      v-for="(comboItem, comboIndex) in comboList"
      :key="comboIndex"
      class="item"
    >
      <div class="item-name">
        {{ tagName }}{{ comboItem[spuNameKey] }}
      </div>
      <div
        class="item-name"
        :class="{sku: (comboItem[skuNameKey] || comboItem[supplierSkuNameKey])}"
      >
        {{ comboItem[skuNameKey] || comboItem[supplierSkuNameKey] }}
      </div>
      <div class="item-count">
        x{{ comboItem[countKey] }}
      </div>
    </div>
  </div>
</template>

<script setup>

defineProps({
  // 列表数据
  comboList: {
    type: Array,
    default: () => {
      return []
    }
  },
  // 标志名称
  tagName: {
    type: String,
    default: '【组合】'
  },
  // 商品名称字段
  spuNameKey: {
    type: String,
    default: 'spuName'
  },
  // 商品规格字段
  skuNameKey: {
    type: String,
    default: 'skuName'
  },
  // 商品数量字段
  countKey: {
    type: String,
    default: 'count'
  },
  // 供应商商品规格字段
  supplierSkuNameKey: {
    type: String,
    default: 'supplierSkuName'
  },
  // 类名
  className: {
    type: String,
    default: ''
  }
})

</script>

<style scoped lang="scss">
@use "index";
</style>
