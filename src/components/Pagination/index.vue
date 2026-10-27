<!--
 Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

 https://www.mall4j.com/

 未经允许，不可做商业用途！

 版权所有，侵权必究！
-->
<template>
  <div
    :class="{'hidden':hidden}"
    class="component-pagination-container"
  >
    <el-pagination
      :background="background"
      :current-page="currentPage"
      :page-size="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  total: {
    required: true,
    type: Number
  },
  page: {
    type: Number,
    default: 1
  },
  limit: {
    type: Number,
    default: 10
  },
  pageSizes: {
    type: Array,
    default () {
      return [10, 20, 30, 50]
    }
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  background: {
    type: Boolean,
    default: false
  },
  autoScroll: {
    type: Boolean,
    default: true
  },
  hidden: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:page', 'update:limit', 'pagination'])
const currentPage = computed({
  get: () => props.page,
  set: (val) => emit('update:page', val)
})
const pageSize = computed({
  get: () => props.limit,
  set: (val) => emit('update:limit', val)
})

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  emit('pagination', { pageNum: currentPage.value, pageSize: val })
}
const handleCurrentChange = (val) => {
  currentPage.value = val
  emit('pagination', { pageNum: val, pageSize: pageSize.value })
}

</script>

<style lang="scss" scoped>
.component-pagination-container {
  display: flex;
  background: #fff;
  padding: 32px 16px;
  justify-content: flex-end;
}
.pagination-container.hidden {
  display: none;
}
</style>
