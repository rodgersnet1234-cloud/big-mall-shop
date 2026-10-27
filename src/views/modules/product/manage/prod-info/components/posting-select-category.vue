<template>
  <!-- 发布商品：01、选择商品类目 -->
  <div class="posting-select-category-component">
    <!-- 商品来源 -->
    <div class="prod-type-box prod-origin">
      <div class="prod-title-row">
        <span>商品来源</span>
      </div>
      <div class="type-select">
        <!-- 直接发布（商家货源） -->
        <div
          class="type-item"
          :class="{'active': dataForm.goodsType === 0}"
          @click="switchProdType(0,0)"
        >
          <div class="big-txt">
            直接发布
          </div>
          <div class="weak-txt">
            &ensp;(商家货源)
          </div>
          <i class="active-icon" />
        </div>
        <!-- 供应商商品（供应商提供货源） -->
        <div
          class="type-item"
          :class="{'active': dataForm.goodsType === 1}"
          @click="switchProdType(1,0)"
        >
          <div class="big-txt">
            供应商商品
          </div>
          <div class="weak-txt">
            &ensp;(供应商提供货源)
          </div>
          <i class="active-icon" />
        </div>
      </div>
    </div>

    <!-- 商品类型 -->
    <div
      v-show="dataForm.goodsType !== 1"
      class="prod-type-box"
    >
      <div class="prod-title-row">
        <span>商品类别</span>
      </div>
      <div class="type-select">
        <!-- 实物商品（物流发货） -->
        <div
          class="type-item"
          :class="{'active': dataForm.goodsType === 0&&dataForm.spuMold === 0}"
          @click="switchProdType(0,0)"
        >
          <div class="big-txt">
            实物商品
          </div>
          <div class="weak-txt">
            &ensp;(物流发货)
          </div>
          <i class="active-icon" />
        </div>
        <div
          class="type-item"
          :class="{'active': dataForm.spuMold === 2}"
          @click="switchProdType(0,2)"
        >
          <div class="big-txt">
            组合商品
          </div>
          <div class="weak-txt">
            &ensp;(物流发货)
          </div>
          <i class="active-icon" />
        </div>
        <!-- 虚拟商品（无需物流） -->
        <div
          class="type-item"
          :class="{'active': dataForm.spuMold === 1}"
          @click="switchProdType(0,1)"
        >
          <div class="big-txt">
            虚拟商品
          </div>
          <div class="weak-txt">
            &ensp;(无需物流)
          </div>
          <i class="active-icon" />
        </div>
        <!-- 电子卡券（无需物流） -->
        <div
          class="type-item"
          :class="{'active': dataForm.spuMold === 3}"
          @click="switchProdType(0,3)"
        >
          <div class="big-txt">
            电子卡券
          </div>
          <div class="weak-txt">
            &ensp;(无需物流)
          </div>
          <i class="active-icon" />
        </div>
      </div>
    </div>

    <!-- 实物商品分类 -->
    <div
      v-show="dataForm.goodsType !== 1"
      class="prod-category-box"
    >
      <div class="prod-title-row">
        <span>商品分类</span>
      </div>
      <div class="select-category-containers">
        <!-- 选择平台类目 -->
        <div
          v-show="!dataForm.spuId"
          class="category-com"
        >
          <div class="title">
            <span class="stress">*</span>选择SaaS分类（仅展示已签约分类）：
          </div>
          <categorySelection
            ref="platformRef"
            :data-form="dataForm"
            :category-id="dataForm.categoryId"
            :category-type="'platform'"
            @close="getSelectedCategory(arguments)"
            @re-selection="reSelectionCategory"
          />
        </div>
        <!-- 选择店铺分类 -->
        <div class="category-com">
          <div class="title">
            <span class="stress">*</span>选择店铺分类：
          </div>
          <categorySelection
            ref="storeRef"
            :data-form="dataForm"
            :category-id="dataForm.shopCategoryId"
            :category-type="'store'"
            @close="getSelectedCategory(arguments)"
            @re-selection="reSelectionCategory"
          />
        </div>
      </div>
    </div>

    <!-- 供应商商品 -->
    <prod-sopplier
      v-if="dataForm.goodsType === 1&&postingSteps === 1"
      ref="prodSupplierRef"
    />
  </div>
</template>

<script setup>
import ProdSopplier from './prod-supplier.vue'
import categorySelection from './category-selection.vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  dataForm: {
    required: true,
    type: Object
  },
  postingSteps: {
    required: true,
    type: Number
  }
})

const emit = defineEmits(['update:dataForm', 'clearStock'])

const Data = reactive({
  // 分类名称组合
  categoryName: '',
  // 分类类型
  categoryType: '',
  // 模板导入
  uploadVisible: false
})

const setDataForm = computed({
  get: () => props.dataForm,
  set: val => emit('update:dataForm', val)
})

const prodSupplierRef = ref(null)

// 调用子组件方法
const prodSopplierNext = (spuId) => {
  nextTick(() => {
    prodSupplierRef.value.next(spuId)
  })
}

const platformRef = ref(null)
const storeRef = ref(null)
// 分类回显
const init = (categoryId, shopCategoryId) => {
  platformRef.value.getDataList(categoryId)
  storeRef.value.getDataList(shopCategoryId)
}

// 切换商品类型
const switchProdType = (type, mold) => {
  if (props.dataForm.prodId) {
    if (type !== props.dataForm.goodsType) {
      ElMessage({
        message: $t('product.cannotModifyProdType'),
        type: 'error',
        duration: 1500,
        onClose: () => {}
      })
      return
    }
  }
  setDataForm.value.goodsType = type
  setDataForm.value.spuMold = mold
  emit('clearStock')
  if (type === 3) {
    // 模板导入
    getUpload()
  }
}

const prodUploadRef = ref(null)
// 跳转至导入选择
const getUpload = () => {
  Date.uploadVisible = true
  nextTick(() => {
    prodUploadRef.value.init()
  })
}

/**
 * 获取选定的类别
 */
const getSelectedCategory = (flag) => {
  // 分类类型（平台/店铺）
  Data.categoryType = flag[0]
  // 选择的末级分类id
  if (flag[0] === 'platform') {
    setDataForm.value.categoryId = flag[1]
  }
  if (flag[0] === 'store') {
    setDataForm.value.shopCategoryId = flag[1]
  }
  // 分类名称展示
  Data.categoryName =
        flag[5] && flag[4] && flag[3] ? flag[3] + ' > ' + flag[4] + ' > ' + flag[5] : flag[4] && flag[3] ? flag[3] + ' > ' + flag[4] : flag[3] ? flag[3] : ''
}

/**
 * 重选分类
 */
const reSelectionCategory = (categoryType) => {
  if (categoryType === 'platform' && props.dataForm.categoryId) {
    setDataForm.value.categoryId = null
    Data.categoryName = ''
  }
}

defineExpose({
  init,
  prodSupplierRef,
  prodSopplierNext
})
</script>

<style lang="scss" scoped>
.posting-select-category-component {
  .prod-origin{
    margin-bottom: 30px;
  }
  // 商品类型
  .prod-type-box {
    .type-select {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .type-item:not(:last-child) {
        margin-right: 10px;
      }
      .type-item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        padding: 16px;
        border: 1px solid #dcdcdc;
        cursor: pointer;
        .weak-txt {
          font-size: 12px;
          line-height: 1px;
          color: #999;
        }
        &.active {
          border-color: #155bd4;
          .big-txt {
            color: #155bd4;
          }
          .active-icon {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 0;
            height: 0;
            border-bottom: 20px solid #155bd4;
            border-left: 20px solid transparent;
            &::after {
              content: "";
              position: absolute;
              right: 2px;
              bottom: -16px;
              width: 10px;
              height: 5px;
              border: 1px solid #fff;
              border-radius: 1px;
              border-top: none;
              border-right: none;
              background: transparent;
              transform: rotate(-45deg);
            }
          }
        }
      }
      .type-item:last-child {
        &.active {
          .active-icon {
            right: -1px;
          }
        }
      }
    }
  }

  // 商品分类
  .prod-category-box {
    margin-top: 30px;
    .select-category-containers {
      .category-com {
        display: inline-block;
        margin-right: 50px;
        .title {
          font-size: 12px;
          margin-bottom: 10px;
          .stress {
            font-size: 14px;
            color: #d40000;
            padding-right: 4px;
          }
        }
      }
    }
  }
}
</style>
