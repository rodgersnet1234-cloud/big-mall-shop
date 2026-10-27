<template>
  <div class="component-choose-goods">
    <el-table
      :data="list"
      style="width: 100%"
      highlight-current-row
      @current-change="onPageChange"
    >
      <el-table-column
        prop="name"
        :label="$t('shopFeature.chooseFeature.pageTitle')"
      />
      <el-table-column
        prop="createTime"
        :label="$t('shopFeature.chooseFeature.createTime')"
      />
    </el-table>
    <el-pagination
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage"
      @size-change="onPageSizeChange"
      @current-change="handleCurrentPageChange"
    />
  </div>
</template>
<script setup>
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const emit = defineEmits(['chooseChooseFeaturesFun'])
const props = defineProps({
  isGetChooseData: { // 是否开始返回数据
    type: Boolean,
    default: false
  }
})

let currentchooseFeatures = {} // 当前选择的
const pageIndex = ref(1)
const pageSize = ref(10)

watch(() => props.isGetChooseData, () => {
  if (!currentchooseFeatures.renovationId) {
    ElMessage.error($t('shopFeature.chooseFeature.choosePageTips'))
    return
  }
  emit('chooseChooseFeaturesFun', {
    data: currentchooseFeatures
  })
})

onMounted(() => {
  getMiniPagesList()
})

const list = ref([])
const totalPage = ref(0)
/**
 * 获取微页面列表
 */
const getMiniPagesList = () => {
  request({
    url: '/shop/shopRenovation/page',
    method: 'get',
    params: {
      current: pageIndex.value,
      size: pageSize.value
    }
  }).then(({ data }) => {
    list.value = data.records
    totalPage.value = data.total
  })
}

// 当前页
const handleCurrentPageChange = (val) => {
  pageIndex.value = val
  getMiniPagesList()
}

/**
 * 选择微页面
 */
const handleCurrentChange = (ev) => {
  currentchooseFeatures = ev
}

defineExpose({
  handleCurrentChange
})

</script>

<style lang="scss" scoped>
@use "index";
</style>
