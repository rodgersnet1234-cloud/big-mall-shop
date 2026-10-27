<template>
  <div
    v-loading="pageLoading"
    class="component-categort-page-conntent"
  >
    <div class="category-select">
      <div class="top-header">
        <div class="one-input">
          <span>{{ $t('pcdecorate.commonModal.categoryOne') }}</span>
        </div>
        <div class="one-input">
          <span>{{ $t('pcdecorate.commonModal.categoryTwo') }}</span>
        </div>
      </div>
      <div class="select-options">
        <div class="border-right" />
        <el-cascader-panel
          v-if="options.length > 0"
          ref="casCaderRef"
          v-model="category"
          :options="options"
          :props="defaultProps"
          @expand-change="handleExpandChange"
          @change="handleChange"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import request from '@/utils/request'

const emit = defineEmits([
  'handleGoodsSelect'
])
const props = defineProps({
  activeName: { // 激活tab名
    type: String,
    default: () => ''
  },
  defaultProps: {
    type: Object,
    default: () => {
      return {
        label: 'name',
        value: 'categoryId',
        children: 'childrenCategory'
      }
    }
  },
  customLinkArr: { // 自定义链接回显数据
    type: Object,
    default: () => {}
  }
})

let obj = {}
const category = ref([])
const options = ref([])
const pageLoading = ref(false) // 页面loading

// 获取分类列表
const getCategoryList = () => {
  return new Promise((resolve) => {
    request({
      url: '/mall4cloud_product/mp/category/enable_categories',
      method: 'get',
      params: {
        // maxGrade: maxGrade, // 2表示三级分类，1 表示二级分类， 0 表示一级分类
        status: 1
      }
    }).then((data) => {
      resolve(data)
    })
  })
}
// 渲染分类列表
const setCategoryList = async () => {
  const allCate = await getCategoryList()
  // 获取一级分类
  const res1 = await allCate.filter(el => el.level === 0)
  // 获取二级分类
  const res2 = await allCate.filter(el => el.level === 1)
  // 获取三级分类
  // 将三级分类合并到二级分类上
  const arr2 = JSON.parse(JSON.stringify(res2))

  // 将二级分类合并到一级分类上
  const arr3 = JSON.parse(JSON.stringify(res1))
  for (let i = 0; i < arr3.length; i++) {
    arr3[i].childrenCategory = []
    for (let j = 0; j < arr2.length; j++) { // 子元素
      if (arr3[i].categoryId === arr2[j].parentId) {
        arr3[i].childrenCategory.push(arr2[j])
      }
    }
  }
  pageLoading.value = false
  options.value = arr3
  // 数据回显
  if (props.customLinkArr && props.customLinkArr.type !== '' && props.customLinkArr.type === '2') {
    category.value = []
    props.customLinkArr.link.forEach(element => {
      category.value.push(element.value)
    })
    nextTick(() => {
      setDatas()
    })
  }
}
// 当分类展开
const handleExpandChange = (val) => {
  if (val?.length >= 1 && category.value?.length === 2 && val[val.length - 1] === category.value[val.length - 1]) {
    emit('handleGoodsSelect', { type: 'categoryItem', value: obj })
    return
  }
  emit('handleGoodsSelect', { type: 'categoryItem', value: {} })
}
const casCaderRef = ref(null)
const handleChange = (val) => {
  if (val?.length === 2) { // 说明此时选择了二级
    const datas = casCaderRef.value ? casCaderRef.value?.getCheckedNodes() : []
    obj = {
      label: datas[0].label,
      data: [
        {
          label: datas[0].pathLabels[0],
          value: datas[0].pathValues[0]
        },
        {
          label: datas[0].pathLabels[1],
          value: datas[0].pathValues[1]
        }
      ]
    }
    emit('handleGoodsSelect', { type: 'categoryItem', value: obj })
  } else {
    emit('handleGoodsSelect', { type: 'categoryItem', value: {} })
  }
}
// 设置回显
const setDatas = () => {
  const datas = casCaderRef.value ? casCaderRef.value?.getCheckedNodes() : []
  obj = {
    label: datas[0].label,
    data: [
      {
        label: datas[0].pathLabels[0],
        value: datas[0].pathValues[0]
      },
      {
        label: datas[0].pathLabels[1],
        value: datas[0].pathValues[1]
      },
      {
        label: datas[0].pathLabels[2],
        value: datas[0].pathValues[2]
      }
    ]
  }
  emit('handleGoodsSelect', { type: 'categoryItem', value: obj })
}
watch(() => props.activeName, (val) => {
  if (val === '2') {
    pageLoading.value = true
    // 获取分类列表
    casCaderRef.value && casCaderRef.value?.clearCheckedNodes()
    options.value = []
    category.value = []
    setCategoryList()
  }
}, { deep: true })

</script>
<style lang="scss" scoped>
.component-categort-page-conntent {
  min-height: 450px;
  max-height: 450px;
  height: 450px;
  padding: 0 27px;
  overflow-y: auto;
  .category-select {
    width: 572px;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    border: 1px solid #E1E6F0;
    :deep(.el-cascader-menu){
      width: 286px;
      overflow: hidden;
      border-color: #E1E6F0;
      border: none!important;
      .el-cascader-menu__wrap {
        width: 285px;
        height: 375px;
        overflow: hidden !important;
        margin-bottom: 0 !important;
        .el-cascader-menu__list {
          padding: 0;
          height: 285px;
          overflow-y: auto;
        }
      }
      .el-cascader-node {
        padding: 0 30px 0 10px;
        .el-icon-check {
          display: none;
        }
        &.in-active-path {
          background: #F5F7FA;
        }
      }
      .el-cascader-node__label {
        padding: 0 10px 0 0;
      }
      &:nth-child(2) {
        width: 287px;
      }
      &:nth-child(3) {
        width: 287px;
        .el-cascader-menu__wrap {
          width: 287px;
        }
      }
    }
    .top-header {
      width: 858px;
      height: 55px;
      display: flex;
      align-items: center;
      .one-input {
        width: 286px;
        height: 100%;
        border-right: 1px solid #E1E6F0;
        display: flex;
        align-items: center;
        padding: 0 10px;

        span {
          width: 100%;
          display: block;
          background: rgba(247, 249, 251, 0.39);
          border: 1px solid #E1E6F0;
          border-radius: 2px;
          font-size: 13px;
          color: #aaa;
          height: 30px;
          line-height: 30px;
          padding-left: 10px;
        }
      }
    }

    .select-options {
      display: flex;
      position: relative;
      height: 375px;
      :deep(.el-cascader-node__prefix){
        display: none;
      }
      .border-right {
        position: absolute;
        width: 1px;
        height: 100%;
        background: #E1E6F0;
        &:nth-child(1) {
            left: 285px;
        }
      }
      :deep(.el-cascader-panel.is-bordered) {
          border: none!important;
      }
    }
  }
  :deep(.el-scrollbar__bar.is-vertical) {
    display: none;
  }
}
</style>
