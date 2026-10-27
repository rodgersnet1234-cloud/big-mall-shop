<template>
  <div class="sku-block-component">
    <sku-group
      v-for="(item, index) in setSalesAttrs"
      ref="skuGroupRef"
      :key="index"
      :sku="item"
      :index="index"
      :sku-tree="skuTreeData"
      :on-change-has-img="onChangeHasImg"
      :on-sku-change="rebuildSku"
      :on-sku-remove="handleSkuRemove"
      :multiple-limit="item.maxSku"
      @change="skuChange"
    />
    <!-- 添加属性 -->
    <div class="part-form-item">
      <div
        class="add-sku"
        @click="addSku"
      >
        添加商品规格
      </div>
      <div class="part-tips">
        (最多可添加100组)
      </div>
      <div
        v-if="!categoryId && warning"
        class="warning"
      >
        请先选择分类！
      </div>
      <div
        v-if="!hasSkuValue"
        class="warning"
      >
        请先选择已添加规格的规格值！
      </div>
      <div
        v-if="!hasSkuId"
        class="warning"
      >
        请先选择已添加规格！
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import skuGroup from '@/components/sku/sku-group/index.vue'
import { provide } from 'vue'
const { proxy } = getCurrentInstance()

const props = defineProps({
  maxSize: {
    type: Number,
    default: 2
  },
  hasSkuImg: {
    type: Boolean,
    default: false
  },
  showAddSkuImage: {
    type: Boolean,
    default: true
  },
  salesAttrs: {
    type: Array,
    default () {
      return []
    }
  },
  saveSalesAttrs: {
    type: Array,
    default () {
      return []
    }
  },
  action: {
    type: String,
    default: ''
  },
  headers: {
    type: Object,
    default () {
      return {}
    }
  },
  accept: {
    type: String,
    default: ''
  },
  uploadName: {
    type: String,
    default: 'resource'
  },
  // 可选规格列表
  skuTree: {
    type: Array,
    default () {
      return []
    }
  },
  sku: {
    type: Object,
    default () {
      return {}
    }
  },
  categoryId: {
    type: Number,
    default: null
  },
  // 自定义sku的id key
  optionValue: {
    type: String,
    default: 'id'
  },
  // 自定义sku的text key
  optionText: {
    type: String,
    default: 'text'
  },
  // 异步获取规格列表
  onFetchGroup: {
    type: Function,
    default: () => {}
  },
  // 异步获取规格可选值
  onFetchSku: {
    type: Function,
    default: () => {}
  },
  // 创建新的规格名
  onCreateGroup: {
    type: Function,
    default: () => {}
  },
  // 创建新的规格值
  onCreateSku: {
    type: Function,
    default: () => {}
  },
  // 涂理图片添加/更改/删除
  onHandleSkuValueImg: {
    type: Function,
    default: () => {}
  },
  // 切换选择图片状态
  switchSkuImageStatus: {
    type: Function,
    default: () => {}
  },
  hasSkuVal: {
    type: Boolean,
    default: null
  }
})

const emit = defineEmits(['update:salesAttrs', 'update:skuTree', 'on-change'])

const setSalesAttrs = computed({
  get () {
    return props.salesAttrs
  },
  set (val) {
    emit('update:salesAttrs', val)
  }
})

const Data = reactive({
  warning: false,
  hasSkuValue: props.hasSkuVal,
  hasSkuId: true

})

const { warning, hasSkuValue, hasSkuId } = toRefs(Data)

const skuTreeData = computed({
  get () {
    return props.skuTree
  },
  set (val) {
    emit('update:skuTree', val)
  }
})

watch(() => props.salesAttrs, () => {
  changeMaxSku()
  // 已选属性值，隐藏错误提示
  if (setSalesAttrs.value?.some((item) => item.id && item.leaf?.length > 0)) {
    Data.hasSkuValue = true
  }
  // 已选属性，隐藏错误提示
  if (setSalesAttrs.value?.some((item) => item.id)) {
    Data.hasSkuId = true
  }
})

watch(() => props.categoryId, () => {
  if (!props.categoryId) {
    setSalesAttrs.value.splice(0, setSalesAttrs.value.length)
  }
})

const onChangeHasImg = () => {
  // Data.hasSkuImg = data
}

const skuChange = (index, data) => {
  setSalesAttrs.value[index] = data
}

// 计算可选规格数变化
const changeMaxSku = () => {
  if (setSalesAttrs.value.length === 0) return
  const skuList = setSalesAttrs.value.map((item) => item.leaf.length > 0 ? item.leaf.length : 1)
  const dataList = setSalesAttrs.value
  skuList.forEach((item, index) => {
    if ((index + 1) === skuList.length && dataList[index].leaf.length === 0) {
      const y = skuList.length > 1 ? skuList.reduce((x, y) => x * y) : item
      dataList[index].maxSku = Math.floor(100 / y)
    } else {
      const demoList = JSON.parse(JSON.stringify(skuList))
      demoList.splice(index, 1)
      const x = skuList.length > 1 ? demoList.reduce((x, y) => x * y) : item
      dataList[index].maxSku = (Math.floor(100 / x) - item)
    }
  })
  // setSalesAttrs.value = dataList

  emit('update:salesAttrs', dataList)
}

const addSku = () => {
  Data.hasSkuValue = true
  Data.hasSkuId = true
  if (!props.categoryId) {
    Data.warning = true
    return
  }
  // 未选属性值，提示用户并禁止继续加选属性
  if (setSalesAttrs.value?.some((item) => item.id && item.leaf && !item.leaf.length)) {
    Data.hasSkuValue = false
    return
  }

  // 未选已添加属性，提示用户并禁止继续加选属性
  if (setSalesAttrs.value?.some((item) => !item.id)) {
    Data.hasSkuId = false
    return
  }
  setSalesAttrs.value.push({
    leaf: []
  })
}

const rebuildSku = (sku, index) => {
  if (
    setSalesAttrs.value.some(
      (item, idx) => item[props.optionText] === sku[props.optionText] && index !== idx
    )
  ) {
    ElMessage({
      message: '规格名不能重复',
      duration: 800
    })
    setSalesAttrs.value[index] = []
    emit('on-change', setSalesAttrs.value)
    return
  }
  setSalesAttrs.value[index] = Object.assign({}, sku)

  emit('on-change', setSalesAttrs.value)
  proxy.$forceUpdate()
}

/**
 * 删除属性
 */
const handleSkuRemove = (sku, index) => {
  setSalesAttrs.value.splice(index, 1)
  if (index === 0 && setSalesAttrs.value.length > 0) {
    setSalesAttrs.value[0].leaf.forEach((item) => {
      item.is_show = sku?.leaf[0].is_show
    })
  }
  // 属性选择列表中不存在被删除的已选属性
  if (!skuTreeData.value?.some(item => item[props.optionValue] === sku[props.optionValue])) {
    // 被删除的已选属性id为数字类型（即非手动创建的属性）
    if (typeof (sku[props.optionValue]) === 'number') {
      // 删除某个已选属性后，往属性选项列表中增加被删除的已选属性
      skuTreeData.value.push(sku)
    }
  }
  Data.hasSkuValue = true
  Data.hasSkuId = true
  emit('on-change', setSalesAttrs.value)
}

provide('ease', {
  setSalesAttrs,
  skuTreeData,
  showAddSkuImage: props.showAddSkuImage,
  onCreateGroup: props.onCreateGroup,
  switchSkuImageStatus: props.switchSkuImageStatus,
  optionValue: props.optionValue,
  optionText: props.optionText,
  onFetchSku: props.onFetchSku,
  onCreateSku: props.onCreateSku,
  onHandleSkuValueImg: props.onHandleSkuValueImg
})

</script>

<style lang="scss" scoped>
.sku-block-component {
  border: 1px solid #DCDCDC;
  .part-form-item{
    display: flex;
    background-color: #f8f8f8;
    padding: 10px;
    margin: 10px;

    .add-sku{
      height: 32px;
      line-height: 32px;
      padding: 0 15px;
      font-size: 13px;
      background-color: #fff;
      border: 1px solid #dcdfe6;
      border-radius: 2px;
      cursor: pointer;
      display: inline-block;
    }

    .add-sku:hover{
      border: 1px solid #155bd4;
      color: #155bd4;

    }
    .part-tips{
      font-size: 12px;
      color: #999999;
      margin-left: 10px;
    }
  }
  .warning {
    display: inline-block;
    margin-left: 10px;
    color: #ff4949;
    font-size: 12px;
  }
}
</style>
