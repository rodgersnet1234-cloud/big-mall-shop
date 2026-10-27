<template>
  <!-- 属性组 -->
  <div class="sku-group-component">
    <div class="spec-box">
      <div
        class="spec-select-container"
      >
        <div class="spec-select">
          <div class="sel-box">
            <div class="sku-name">
              规格名
            </div>
            <div class="select">
              <el-select
                v-model="skuValue"
                placeholder="请选择"
                filterable
                allow-create
                default-first-option
                :popper-append-to-body="false"
                @change="handleSelectSku"
              >
                <el-option
                  v-for="item in skuTreeData"
                  :key="item[optionValue]"
                  :label="item[optionText]"
                  :value="item[optionValue]"
                />
              </el-select>
            </div>
          </div>
          <div
            v-if="index === 0 && ease.showAddSkuImage"
            class="sel-add-img"
          >
            <el-checkbox
              :model-value="prodData.hasSkuImage.value"
              @change="handleCheckedSkuImage"
            >
              添加规格图片
            </el-checkbox>
          </div>
        </div>
        <div
          class="del-btn"
          @click="onSkuRemove(sku, index)"
        >
          删除规格
        </div>
      </div>
      <div class="tips">
        支持手动输入创建新规格名，鼠标点击或回车均可添加，规格名称不超过10个字符
      </div>
    </div>
    <!-- sku值 -->
    <sku-container
      v-model:sku="setSku"
      :multiple-limit="multipleLimit"
      :has-sku-image="index===0?prodData.hasSkuImage.value:false"
      :on-sku-leaf-change="handleSkuLeafChange"
    />
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { computed } from 'vue'

const ease = inject('ease')
const prodData = inject('prodData')

const props = defineProps({
  index: {
    type: Number,
    default: 0
  },
  sku: {
    type: Object,
    default () {
      return {}
    }
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
  onSkuChange: {
    type: Function,
    default: () => {}
  },
  onSkuRemove: {
    type: Function,
    default: () => {}
  },
  multipleLimit: {
    type: Number,
    default: 100
  }
})
const emit = defineEmits(['change'])
const Data = reactive({
  currentValue: '',
  currentSku: '',
  skuValue: '',
  newsSkuText: ''
})

const { skuValue } = toRefs(Data)

const skuTreeData = computed({
  get () {
    if (ease.setSalesAttrs.value.length) {
      return ease.skuTreeData.value.filter(item => !ease.setSalesAttrs.value.some(el => el.text === item[props.optionText]) || Data.skuValue === item[props.optionText])
    }
    return ease.skuTreeData.value
  }
})

const setSku = computed({
  get () {
    return props.sku
  },
  set (val) {
    emit('change', props.index, val)
  }
})

watch(() => props.sku, (sku) => {
  Data.skuValue = ''
  if (sku[props.optionText]) {
    nextTick(() => {
      Data.skuValue = sku[props.optionText]
      Data.currentSku = sku
    })
  }
}, {
  immediate: true,
  deep: true
})

// 选择sku
const handleSelectSku = (value) => {
  const reg = /[\\;\\:\\；\\：]/g
  // 特殊符号
  if (reg.test(value)) {
    Data.skuValue = ''
    ElMessage({
      message: '不允许包含特殊字符:;',
      duration: 1500,
      type: 'error'
    })
    return
  }
  // 空格判断
  if (!String(value).trim()) {
    Data.skuValue = ''
    return
  }
  if (value.length > 10) {
    ElMessage({
      message: '规格名长度不可超过10个字符',
      duration: 1500
    })
    Data.skuValue = ''
    return
  }
  // 当切换当前属性时，把非手动创建的当前属性重新放入可选择列表中
  if (Data.currentSku && value !== Data.currentSku.id &&
        typeof (Data.currentSku.id) === 'number' &&
        !ease.skuTreeData.value.find(el => el.id === Data.currentSku.id)) {
    ease.skuTreeData.value.push(Data.currentSku)
  }
  if (typeof (value) === 'number') {
    const sku = ease.skuTreeData.value.find(item => item[props.optionValue] === value)
    sku.leaf = []
    if (props.onSkuChange(sku, props.index) === false) {
      Data.skuValue = ''
    } else {
      // const skutree = ease.skuTreeData.value.filter(item => item[optionValue] !== value);
      // Data.$set(ease, 'skuTreeData.value', skutree)
      ease.skuTreeData.value.some((item, idx) => {
        // 列表删除已选中属性
        if (item[props.optionValue] === value) {
          Data.currentSku = ease.skuTreeData.value[idx]
        }
        return false
      })
    }
    return
  }
  createSku(value)
}

// 创建sku
const createSku = (text) => {
  ease.onCreateGroup(text).then(data => {
    if (data && data !== 0) {
      setSku.value = {
        [props.optionValue]: data,
        [props.optionText]: text,
        leaf: []
      }
      props.onSkuChange({
        [props.optionValue]: data,
        [props.optionText]: text,
        leaf: []
      }, props.index)
    }
  })
}

// 添加图片复选框
const handleCheckedSkuImage = (checked) => {
  prodData.hasSkuImage.value = checked
  // 切换添加图片的状态
  ease.switchSkuImageStatus(prodData.hasSkuImage.value)
}

const handleSkuLeafChange = (leaf) => {
  setSku.value.leaf = leaf
  props.onSkuChange(props.sku, props.index)
}
</script>

<style lang="scss" scoped>
/* 商品属性 */
.sku-group-component {
  padding: 10px 10px 0;
  .spec-box {
    width: 100%;
    min-width: 400px;
    padding: 8px 10px;
    background: #f8f8f8;
    .spec-select-container {
      display: flex;
      justify-content: space-between;
      .spec-select {
        display: flex;
        .sel-box{
          display: flex;
          .sku-name{
            margin-right: 10px;
          }
        }
      }
      .spec-select .sel-add-img {
        margin-left: 20px;
      }
      .del-btn {
        font-size: 13px;
        color: #155bd4;
        cursor: pointer;
      }
    }
  }
  .tips {
    color: #999;
    font-size: 12px;
    height: 1em;
    line-height: 1em;
    margin: 5px 0 5px 52px;
  }
}
</style>
