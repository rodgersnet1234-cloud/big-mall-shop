<template>
  <div class="goods-moduleOne">
    <div class="config-items">
      <div class="title">
        {{ $t(`pcdecorate.goodsModule2.customTitle`) }}
      </div>
      <el-input
        v-model.trim="goodsForm.title"
        maxlength="15"
        :placeholder="$t(`pcdecorate.goodsModule2.placeholder`)"
      />
    </div>
    <div class="config-items">
      <div class="title">
        {{ $t(`pcdecorate.goodsModule2.titleLink`) }}
      </div>
      <redirect-nav
        :selected-link="goodsForm.path.name"
        :placeholder="$t('pcdecorate.placeholder.link')"
        @handle-nav-select="handleNavSelect"
        @handle-remove-selected="handleRemoveSelected"
      />
    </div>
    <div class="config-items">
      <div
        class="title"
        style="margin-bottom: 15px"
      >
        {{ $t(`pcdecorate.goodsModule2.addMainGoods`) }}
      </div>
      <select-goods-component
        :goods-list="goodsForm.maingoodsList"
        :add-length="mainLength"
        @handle-add-click="handleMainClick"
        @handle-remove="handleRemoveMain"
      />
    </div>
    <div class="config-items">
      <div
        class="title"
        style="margin-bottom: 15px"
      >
        {{ $t(`pcdecorate.goodsModule2.addOtherGoods`) }}
      </div>
      <select-goods-component
        :goods-list="goodsForm.othergoodsList"
        :add-length="addLength"
        @handle-add-click="handleAddClick"
        @handle-remove="handleRemove"
      />
    </div>
    <!-- 商品 | 页面 | 跳转链接弹窗 start -->
    <decorate-dialog-select
      :dialog-visible="dialogVisible"
      :current-select-type="currentSelectType"
      :goods-number="goodsNumber"
      :is-mulilt="isMulilt"
      :echo-data-list="echoDataList"
      @handle-close="handleDialogClose"
      @handle-dialog-submit="handleDialogSubmit"
    />
    <!-- 商品 | 页面 | 跳转链接弹窗 end -->
  </div>
</template>
<script setup>
import redirectNav from '../../../../../common-component/redirect-nav/index.vue'
import selectGoodsComponent from '../../../../../common-component/select-goods-component/index.vue'
import decorateDialogSelect from '@/components/decorate-dialog-select/index.vue' // 选择商品
import { defineExpose } from 'vue'

const props = defineProps({
  currentRef: { // 当前组件的ref
    type: String,
    default: () => ''
  },
  currentItem: { // 点击当前组件的配置信息
    type: Object,
    default: () => {}
  },
  editItem: { // 已经配置的信息
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits(['handleUpdateMessage'])
const mainLength = ref(1) // 主商品限制个数
const addLength = ref(6) // 其他商品限制个数
const goodsForm = ref({
  title: '', // 自定义标题
  path: {
    name: '', // 链接名
    link: '', // 链接地址
    type: '' // 链接的类型
  }, // 标题链接
  maingoodsList: [], // 主商品
  othergoodsList: [] // 其他商品
})
watch(() => goodsForm.value, (newVal) => { // 监听配置信改变
  const obj = {
    type: 'goods_module2',
    ref: props.currentRef,
    config: newVal
  }
  emit('handleUpdateMessage', obj)
}, { deep: true })
watch(() => props.currentItem, (newVal) => { // 监听信息回显
  if (newVal.currentConfigType === 'goods_module2') {
    if (JSON.stringify(newVal.config) !== '{}') {
      goodsForm.value = { ...newVal.config }
    } else {
      goodsForm.value = {
        title: '热卖推荐', // 自定义标题
        path: {
          name: '', // 链接名
          link: '', // 链接地址
          type: '' // 链接的类型
        }, // 标题链接
        maingoodsList: [], // 主商品
        othergoodsList: [] // 其他商品
      }
    }
  }
})

// 选择标题链接
const currentSelectType = ref([]) // 当前允许选择的类型
const dialogVisible = ref(false) // 弹窗是否显示
const isMulilt = ref(false) // 是否允许多选
const echoDataList = ref([]) // 回显商品数据
let currentClickType = '' // 当前点击的类型
const handleNavSelect = () => {
  currentSelectType.value = [1, 2, 4, 5, 6]
  dialogVisible.value = true
  currentClickType = 'titles'
  isMulilt.value = false // 不能多选
  echoDataList.value = []
}
// 删除标题链接
const handleRemoveSelected = () => {
  goodsForm.value.path.name = ''
  goodsForm.value.path.link = ''
  goodsForm.value.path.type = ''
}
// 关闭弹窗
const handleDialogClose = () => {
  dialogVisible.value = false
}
// 弹窗确定
let types = '' // 当前是主商品添加，还是其他商品添加
const handleDialogSubmit = ({ type, value }) => {
  if (currentClickType === 'titles') { // 当前选择的是标题
    if (type === '1') { // 当前选择的是商品
      goodsForm.value.path.name = value.goodsItem.spuName
      goodsForm.value.path.link = value.goodsItem.spuId
      goodsForm.value.path.type = '1'
    } else if (type === '2') { // 当前选择的是分类
      goodsForm.value.path.name = value.categoryItem.label
      goodsForm.value.path.link = value.categoryItem.data
      goodsForm.value.path.type = '2'
    } else if (type === '3') { // 当前选择的是店铺
      goodsForm.value.path.name = value.storeItem.shopName
      goodsForm.value.path.link = value.storeItem.shopId
      goodsForm.value.path.type = '3'
    } else if (type === '4') { // 当前选择的是页面
      goodsForm.value.path.name = value.pageItem.title
      goodsForm.value.path.link = value.pageItem.link
      goodsForm.value.path.type = '4'
    } else if (type === '5') { // 当前选择的是微页面
      goodsForm.value.path.name = value.smallPageItem.name
      goodsForm.value.path.link = [value.smallPageItem.renovationId, value.smallPageItem.shopId]
      goodsForm.value.path.type = '5'
    } else if (type === '6') { // 当前选择的是自定义链接
      goodsForm.value.path.name = value.customLink.url
      goodsForm.value.path.link = value.customLink
      goodsForm.value.path.type = '6'
    }
  } else if (currentClickType === 'goods') { // 当前选择的是商品
    if (type === '1') {
      if (types === 'main') {
        goodsForm.value.maingoodsList = []
        goodsForm.value.maingoodsList.push({
          name: value.goodsItem.spuName || value.goodsItem.prodName, // 商品名称
          id: value.goodsItem.spuId || value.goodsItem.prodId, // 商品id
          price: value.goodsItem.priceFee || value.goodsItem.price, // 商品价格
          status: value.goodsItem.spuStatus || value.goodsItem.status, // 商品状态
          orignPrice: value.goodsItem.marketPriceFee || value.goodsItem.oriPrice, // 商品原价
          imgs: value.goodsItem.mainImgUrl || value.goodsItem.pic, // 商品图片
          description: value.goodsItem.sellingPoint || value.goodsItem.brief, // 商品描述
          prodType: value.goodsItem.spuType || value.goodsItem.prodType // 商品类型
        })
      } else if (types === 'other') {
        goodsForm.value.othergoodsList = []
        value.goodsItem.forEach(item => {
          goodsForm.value.othergoodsList.push({
            name: item.spuName || item.name, // 商品名称
            id: item.spuId || item.id, // 商品id
            prodType: item.spuType || item.prodType, // 商品类型
            status: item.spuStatus || item.status, // 商品状态
            price: item.priceFee || item.price, // 商品价格
            imgs: item.mainImgUrl || item.imgs, // 商品图片
            description: item.sellingPoint || item.description, // 商品描述
            orignPrice: item.marketPriceFee || item.orignPrice // 商品原价
          })
        })
      }
    }
  }
  dialogVisible.value = false
}
// 添加主商品
const handleMainClick = () => {
  currentClickType = 'goods'
  currentSelectType.value = [1] // 表示当前只能选择商品，不能选择其他类型
  dialogVisible.value = true // 弹窗显示
  types = 'main'
  isMulilt.value = false // 主商品不允许多选
  echoDataList.value = []
  goodsForm.value.maingoodsList.forEach(item => {
    echoDataList.value.push(item)
  })
}
// 移除主商品
const handleRemoveMain = (index) => {
  goodsForm.value.maingoodsList.splice(index, 1)
}
// 添加商品
const goodsNumber = ref(0) // 限制商品的数量
const handleAddClick = () => {
  currentClickType = 'goods'
  currentSelectType.value = [1] // 表示当前只能选择商品，不能选择其他类型
  dialogVisible.value = true
  types = 'other'
  isMulilt.value = true // 其他商品允许多选
  goodsNumber.value = 6 // 限制多选的长度
  echoDataList.value = []
  goodsForm.value.othergoodsList.forEach(item => {
    echoDataList.value.push(item)
  })
}
// 移除其他商品
const handleRemove = (index) => {
  goodsForm.value.othergoodsList.splice(index, 1)
}
// 验证信息
const handleValidate = () => {
  let status = true
  let message = ''
  if (JSON.stringify(props.editItem) === '{}') {
    status = false
    message = $t('pcdecorate.goodsModule2.warning1')
  } else if (props.editItem.title === '') {
    status = false
    message = $t('pcdecorate.goodsModule2.warning2')
  } else if (props.editItem.path.name === '') {
    status = false
    message = $t('pcdecorate.goodsModule2.warning3')
  } else if (props.editItem.maingoodsList.length === 0) {
    status = false
    message = $t('pcdecorate.goodsModule2.warning4')
  } else if (props.editItem.othergoodsList.length === 0) {
    status = false
    message = $t('pcdecorate.goodsModule2.warning5')
  } else {
    status = true
  }
  return {
    status,
    message
  }
}
defineExpose({ handleValidate })
</script>
<style lang="scss" scoped>
.goods-moduleOne {
    margin-top: 10px;
    :deep(.el-input__inner)  {
        height: 32px;
    }
    .config-items {
        margin-bottom: 20px;
        .title {
            margin-bottom: 12px;
            margin-left: 0 !important;
        }
        .title::before {
            width: 0 !important;
        }
    }
}
</style>
