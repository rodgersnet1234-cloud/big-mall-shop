<template>
  <div class="goods-moduleOne">
    <div class="config-items">
      <div
        class="title"
        style="margin-bottom: 18px"
      >
        {{ $t(`pcdecorate.goodsModule1.select`) }}
      </div>
      <div class="items-content">
        <div
          :class="{'items-rows': true , 'active': goodsForm.currentIndex === 1}"
          @click="handleClick(1)"
        />
        <div
          :class="{'items-rows': true , 'active': goodsForm.currentIndex === 2}"
          @click="handleClick(2)"
        />
      </div>
    </div>
    <div class="config-items">
      <div class="title">
        {{ $t(`pcdecorate.goodsModule2.customTitle`) }}
      </div>
      <el-input
        v-model.trim="goodsForm.title"
        maxlength="8"
      />
    </div>
    <div class="config-items">
      <div class="title">
        {{ $t(`pcdecorate.goodsModule2.titleLink`) }}
      </div>
      <redirectNav
        :placeholder="$t('pcdecorate.placeholder.link')"
        :selected-link="goodsForm.path.name"
        @handle-nav-select="handleNavSelect"
        @handle-remove-selected="handleRemoveSelected"
      />
    </div>
    <div
      class="config-items"
      style="margin-top: 30px"
    >
      <div
        class="title"
        style="margin-bottom: 15px"
      >
        {{ $t(`pcdecorate.goodsModule3.addOtherGoods`) }}
      </div>
      <select-goods-component
        :goods-list="goodsForm.goodsList"
        :add-length="addLength"
        @handle-add-click="handleAddClick"
        @handle-remove="handleRemove"
      />
    </div>
    <!-- 商品 | 页面 | 跳转链接弹窗 start -->
    <decorate-dialog-select
      :dialog-visible="dialogVisible"
      :current-select-type="currentSelectType"
      :is-mulilt="isMulilt"
      :echo-data-list="echoDataList"
      :goods-number="goodsNumber"
      @handle-close="handleDialogClose"
      @handle-dialog-submit="handleDialogSubmit"
    />
    <!-- 商品 | 页面 | 跳转链接弹窗 end -->
  </div>
</template>
<script setup>
import redirectNav from '../../../../../common-component/redirect-nav/index.vue' // 链接跳转组件
import selectGoodsComponent from '../../../../../common-component/select-goods-component/index.vue' // 选择商品组件
import decorateDialogSelect from '@/components/decorate-dialog-select/index.vue' // 选择商品
const props = defineProps({
  currentRef: { // 当前组件的ref
    type: String,
    default: () => ''
  },
  currentItem: { // 点击当前组件的配置
    type: Object,
    default: () => {}
  },
  editItem: { // 已经配置的信息
    type: Object,
    default: () => {}
  }
})

const emit = defineEmits(['handleUpdateMessage'])
const addLength = ref(3) // 限制商品选择的个数
const goodsForm = ref({
  currentIndex: 1, // 当前选中哪列
  title: '', // 自定义标题
  path: {
    name: '', // 链接名
    link: '', // 链接地址
    type: '' // 链接类型
  }, // 标题链接
  goodsList: [] // 商品
})
let leftConfigMessage = {} // 左列表配置信息
let rightConfigMessage = {} // 右列表配置信息
watch(() => goodsForm.value, (newVal) => { // 监听配置信改变
  if (goodsForm.value.currentIndex === 1) {
    leftConfigMessage = { ...newVal }
  } else if (goodsForm.value.currentIndex === 2) {
    rightConfigMessage = { ...newVal }
  }
  const obj = {
    type: 'goods_module3',
    ref: props.currentRef,
    config: {
      leftConfig: leftConfigMessage,
      rightConfig: rightConfigMessage
    }
  }
  emit('handleUpdateMessage', obj)
}, { deep: true })
watch(() => props.currentItem, (newVal) => { // 监听信息回显
  if (newVal.currentConfigType === 'goods_module3') {
    if (JSON.stringify(newVal.config) !== '{}') {
      if (JSON.stringify(newVal.config.leftConfig) !== '{}') {
        leftConfigMessage = { ...newVal.config.leftConfig }
        // 默认选中第一个
        goodsForm.value = { ...newVal.config.leftConfig }
      }
      if (JSON.stringify(newVal.config.rightConfig) !== '{}') {
        rightConfigMessage = { ...newVal.config.rightConfig }
      }
    } else {
      init()
    }
  }
})

const init = () => {
  leftConfigMessage = {
    currentIndex: 1, // 当前选中哪列
    title: '热卖推荐', // 自定义标题
    path: {
      name: '', // 链接名
      link: '', // 链接地址
      type: '' // 链接类型
    }, // 标题链接
    goodsList: [] // 商品
  }
  goodsForm.value = leftConfigMessage
  rightConfigMessage = {
    currentIndex: 2, // 当前选中哪列
    title: '热卖推荐', // 自定义标题
    path: {
      name: '', // 链接名
      link: '', // 链接地址
      type: '' // 链接类型
    }, // 标题链接
    goodsList: [] // 商品
  }
}
// 清空数据
const clearValues = () => {
  goodsForm.value = {
    currentIndex: 1,
    title: '',
    path: {
      name: '',
      link: '',
      type: ''
    },
    goodsList: []
  }
}
// 点击列数
const handleClick = (val) => {
  clearValues()
  if (val === 1) { // 左边列表
    if (JSON.stringify(leftConfigMessage) !== '{}') {
      goodsForm.value = { ...leftConfigMessage }
    }
  } else if (val === 2) { // 右边列表
    if (JSON.stringify(rightConfigMessage) !== '{}') {
      goodsForm.value = { ...rightConfigMessage }
    }
  }
  goodsForm.value.currentIndex = val
}
// 弹窗关闭
const dialogVisible = ref(false) // 商品弹窗是否显示
const handleDialogClose = () => {
  dialogVisible.value = false
}
// 弹窗确定
let currentClickType = '' // 当前点击的类型
const handleDialogSubmit = ({ type, value }) => {
  if (currentClickType === 'titles') { // 当前属于选择标题类型
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
    } else if (type === '6') { // 自定义链接
      goodsForm.value.path.name = value.customLink.url
      goodsForm.value.path.link = value.customLink
      goodsForm.value.path.type = '6'
    }
  } else if (currentClickType === 'goods') { // 当前属于选择商品类型
    if (type === '1') { // 当前选择的是商品
      goodsForm.value.goodsList = []
      value.goodsItem.forEach(item => {
        goodsForm.value.goodsList.push({
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
  dialogVisible.value = false
}
// 添加商品
const isMulilt = ref(false) // 是否允许多选
const goodsNumber = ref(0) // 限制商品的数量
const currentSelectType = ref([]) // 当前限制选的类型
const echoDataList = ref([]) // 回显商品数据
const handleAddClick = () => {
  currentClickType = 'goods'
  currentSelectType.value = [1]
  dialogVisible.value = true
  isMulilt.value = true // 商品允许多选
  goodsNumber.value = 3 // 限制选的数量
  echoDataList.value = []
  if (goodsForm.value.currentIndex === 1) { // 左边列表
    leftConfigMessage.goodsList.forEach(item => {
      echoDataList.value.push(item)
    })
  } else if (goodsForm.value.currentIndex === 2) { // 右边列表
    rightConfigMessage.goodsList.forEach(item => {
      echoDataList.value.push(item)
    })
  }
}
// 删除商品
const handleRemove = (index) => {
  goodsForm.value.goodsList.splice(index, 1)
}
// 选择标题链接
const handleNavSelect = () => {
  currentClickType = 'titles'
  currentSelectType.value = [1, 2, 4, 5, 6]
  dialogVisible.value = true
  isMulilt.value = false // 禁止多选
  echoDataList.value = []
}
// 删除标题链接
const handleRemoveSelected = () => {
  goodsForm.value.path.name = ''
  goodsForm.value.path.link = ''
  goodsForm.value.path.type = ''
}
// 验证信息
const handleValidate = () => {
  let status = true
  let message = ''
  if (JSON.stringify(props.editItem) !== '{}') {
    if (JSON.stringify(props.editItem.leftConfig) !== '{}' && JSON.stringify(props.editItem.rightConfig) !== '{}') {
      if (props.editItem.leftConfig.title === '' || props.editItem.rightConfig.title === '') {
        status = false
        message = $t('pcdecorate.goodsModule3.warning2')
      } else if (props.editItem.leftConfig.path.name === '' || props.editItem.rightConfig.path.name === '') {
        status = false
        message = $t('pcdecorate.goodsModule3.warning3')
      } else if (props.editItem.leftConfig.goodsList.length === 0 || props.editItem.rightConfig.goodsList.length === 0) {
        status = false
        message = $t('pcdecorate.goodsModule3.warning4')
      } else {
        status = true
      }
    } else {
      status = false
      message = $t('pcdecorate.goodsModule3.warning1')
    }
  } else {
    status = false
    message = $t('pcdecorate.goodsModule3.warning1')
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
    .config-items {
        margin-bottom: 20px;
        .title {
            margin-bottom: 12px;
            margin-left: 0 !important;
        }
        .title::before {
            width: 0 !important;
        }
        .items-content {
            width: 100%;
            height: 108px;
            display: flex;
            .items-rows {
                width: 50%;
                height: 100%;
                box-sizing: border-box;
                border: 1px solid #DCDFE6;
                background: rgba(255, 255, 255, 0.39);
                cursor: pointer;
                &:nth-child(1) {
                    border-right: none;
                }
                &:hover {
                    background: rgba(21, 91, 212, 0.04);
                    border: 1px solid #155BD4;
                }
                &.active {
                    background: rgba(21, 91, 212, 0.04);
                    border: 1px solid #155BD4;
                }
            }
        }

    }
    :deep(.el-input__inner){
      height: 32px;
    }
}
</style>
