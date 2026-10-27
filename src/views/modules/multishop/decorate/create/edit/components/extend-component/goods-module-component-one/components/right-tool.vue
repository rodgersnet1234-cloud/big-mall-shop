<template>
  <div class="goods-moduleOne">
    <div class="config-items">
      <div class="title">
        {{ $t(`pcdecorate.goodsModule1.select`) }}
      </div>
    </div>
    <div class="config-items">
      <div class="items-content">
        <div
          :class="{'items-rows': true, 'active': goodsOneForm.currentIndex === 1}"
          @click="handleClick(1)"
        />
        <div
          :class="{'items-rows': true, 'active': goodsOneForm.currentIndex === 2}"
          @click="handleClick(2)"
        />
        <div
          :class="{'items-rows': true, 'active': goodsOneForm.currentIndex === 3}"
          @click="handleClick(3)"
        />
      </div>
    </div>
    <div class="config-items">
      <div class="title">
        {{ $t(`pcdecorate.goodsModule1.mainTitle`) }}
      </div>
    </div>
    <div class="config-items">
      <el-input
        v-model.trim="goodsOneForm.mainTitle"
        maxlength="8"
      />
    </div>
    <div class="config-items">
      <div class="title">
        {{ $t(`pcdecorate.goodsModule1.subTitle`) }}
      </div>
    </div>
    <div class="config-items">
      <el-input
        v-model.trim="goodsOneForm.subTitle"
        maxlength="14"
      />
    </div>
    <div class="config-items">
      <div class="title">
        {{ $t(`pcdecorate.goodsModule1.titleLink`) }}
      </div>
    </div>
    <div class="config-items">
      <redirectNav
        :placeholder="$t('pcdecorate.placeholder.link')"
        :selected-link="goodsOneForm.titleLink.name"
        @handle-nav-select="handleNavSelect"
        @handle-remove-selected="handleRemoveSelected"
      />
    </div>
    <div class="config-items">
      <div
        class="title"
        style="margin-bottom: 20px"
      >
        {{ $t(`pcdecorate.goodsList.addgoods`) }}(最多添加3个)
      </div>
      <select-goods-component
        :goods-list="goodsOneForm.goodsList"
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
import redirectNav from '../../../../../common-component/redirect-nav/index.vue'
import selectGoodsComponent from '../../../../../common-component/select-goods-component/index.vue'
import decorateDialogSelect from '@/components/decorate-dialog-select/index.vue' // 选择商品

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
const addLength = ref(3) // 限制选择商品的个数
const goodsOneForm = ref({
  currentIndex: 1, // 当前选择哪列
  mainTitle: '', // 当前主标题
  subTitle: '', // 副标题
  titleLink: {
    name: '', // 跳转的名字
    link: '' // 跳转的链接
  }, // 标题跳转的链接
  goodsList: [] // 商品
})
let leftConfig = {} // 左边配置信息
let centerConfig = {} // 中间配置信息
let rightConfig = {} // 右边配置信息
watch(() => goodsOneForm.value, (newVal) => { // 监听配置信改变
  if (goodsOneForm.value.currentIndex === 1) {
    leftConfig = { ...newVal }
  } else if (goodsOneForm.value.currentIndex === 2) {
    centerConfig = { ...newVal }
  } else if (goodsOneForm.value.currentIndex === 3) {
    rightConfig = { ...newVal }
  }
  const obj = {
    type: 'goods_module1',
    ref: props.currentRef,
    config: {
      leftConfig,
      centerConfig,
      rightConfig
    }
  }
  emit('handleUpdateMessage', obj)
}, { deep: true })
watch(() => props.currentItem, (newVal) => { // 监听组件的回显
  if (newVal.currentConfigType === 'goods_module1') {
    if (JSON.stringify(newVal.config) !== '{}') {
      if (JSON.stringify(newVal.config.leftConfig) !== '{}') {
        leftConfig = { ...newVal.config.leftConfig }
        // 默认选中第一个
        goodsOneForm.value = { ...newVal.config.leftConfig }
      }
      if (JSON.stringify(newVal.config.centerConfig) !== '{}') {
        centerConfig = { ...newVal.config.centerConfig }
      }
      if (JSON.stringify(newVal.config.rightConfig) !== '{}') {
        rightConfig = { ...newVal.config.rightConfig }
      }
    } else {
      init()
    }
  }
})
const init = () => {
  leftConfig = {
    currentIndex: 1, // 当前选择哪列
    mainTitle: '热卖推荐', // 当前主标题
    subTitle: '销量引领购物新风向', // 副标题
    titleLink: {
      name: '', // 跳转的名字
      link: '' // 跳转的链接
    }, // 标题跳转的链接
    goodsList: [] // 商品
  }
  goodsOneForm.value = leftConfig // 默认选中第一列
  rightConfig = {
    currentIndex: 3, // 当前选择哪列
    mainTitle: '热卖推荐', // 当前主标题
    subTitle: '销量引领购物新风向', // 副标题
    titleLink: {
      name: '', // 跳转的名字
      link: '' // 跳转的链接
    }, // 标题跳转的链接
    goodsList: [] // 商品
  }
  centerConfig = {
    currentIndex: 2, // 当前选择哪列
    mainTitle: '热卖推荐', // 当前主标题
    subTitle: '销量引领购物新风向', // 副标题
    titleLink: {
      name: '', // 跳转的名字
      link: '' // 跳转的链接
    }, // 标题跳转的链接
    goodsList: [] // 商品
  }
}
// 清空值
const clearValues = () => {
  goodsOneForm.value = {
    currentIndex: 1,
    mainTitle: '',
    subTitle: '',
    titleLink: {
      name: '',
      link: '',
      type: ''
    },
    goodsList: []
  }
}
// 当前点击了哪列
const handleClick = (val) => {
  // 先清空所有的值
  clearValues()
  if (val === 1) { // 左边商品列表
    if (JSON.stringify(leftConfig) !== '{}') {
      goodsOneForm.value = { ...leftConfig }
    }
  } else if (val === 2) { // 中间商品列表
    if (JSON.stringify(centerConfig) !== '{}') {
      goodsOneForm.value = { ...centerConfig }
    }
  } else if (val === 3) { // 右边商品列表
    if (JSON.stringify(rightConfig) !== '{}') {
      goodsOneForm.value = { ...rightConfig }
    }
  }
  goodsOneForm.value.currentIndex = val
}
// 添加商品
const isMulilt = ref(false) // 是否允许多选
const goodsNumber = ref(0) // 限制商品的数量
const dialogVisible = ref(false) // 弹窗显示隐藏
const currentSelectType = ref([]) // 当前限制的类型
let currentClickType = '' // 当前点击的类型，判断点击的是商品，还是标题链接
const echoDataList = ref([]) // 回显商品数据
const handleAddClick = () => {
  currentSelectType.value = [1]
  currentClickType = 'goods'
  dialogVisible.value = true
  isMulilt.value = true
  goodsNumber.value = 3 // 限制选中商品的数量
  echoDataList.value = []
  if (goodsOneForm.value.currentIndex === 1) { // 左边部分
    leftConfig.goodsList.forEach(item => {
      echoDataList.value.push(item)
    })
  } else if (goodsOneForm.value.currentIndex === 2) { // 中间部分
    centerConfig.goodsList.forEach(item => {
      echoDataList.value.push(item)
    })
  } else if (goodsOneForm.value.currentIndex === 3) { // 右边部分
    rightConfig.goodsList.forEach(item => {
      echoDataList.value.push(item)
    })
  }
}
// 移除商品
const handleRemove = (index) => {
  goodsOneForm.value.goodsList.splice(index, 1)
}
// 弹窗关闭
const handleDialogClose = () => {
  dialogVisible.value = false
}
// 弹窗确定
const handleDialogSubmit = ({ type, value }) => {
  if (currentClickType === 'title') { // 如果当前点击的是标题选中
    if (type === '1') { // 当前选择的是商品
      goodsOneForm.value.titleLink.name = value.goodsItem.spuName
      goodsOneForm.value.titleLink.link = value.goodsItem.spuId
      goodsOneForm.value.titleLink.type = '1'
    } else if (type === '2') { // 当前选择的是分类
      goodsOneForm.value.titleLink.name = value.categoryItem.label
      goodsOneForm.value.titleLink.link = value.categoryItem.data
      goodsOneForm.value.titleLink.type = '2'
    } else if (type === '3') { // 当前选择的是店铺
      goodsOneForm.value.titleLink.name = value.storeItem.shopName
      goodsOneForm.value.titleLink.link = value.storeItem.shopId
      goodsOneForm.value.titleLink.type = '3'
    } else if (type === '4') { // 当前选择的是页面
      goodsOneForm.value.titleLink.name = value.pageItem.title
      goodsOneForm.value.titleLink.link = value.pageItem.link
      goodsOneForm.value.titleLink.type = '4'
    } else if (type === '5') { // 当前选择的是微页面
      goodsOneForm.value.titleLink.name = value.smallPageItem.name
      goodsOneForm.value.titleLink.link = [value.smallPageItem.renovationId, value.smallPageItem.shopId]
      goodsOneForm.value.titleLink.type = '5'
    } else if (type === '6') { // 自定义链接
      goodsOneForm.value.titleLink.name = value.customLink.url
      goodsOneForm.value.titleLink.link = value.customLink
      goodsOneForm.value.titleLink.type = '6'
    }
  } else if (currentClickType === 'goods') { // 如果当前点击的是商品选中
    goodsOneForm.value.goodsList = []
    if (type === '1') {
      value.goodsItem.forEach(item => {
        goodsOneForm.value.goodsList.push({
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
// 标题链接
const handleNavSelect = () => {
  currentSelectType.value = [1, 2, 4, 5, 6]
  currentClickType = 'title'
  dialogVisible.value = true
  isMulilt.value = false
  echoDataList.value = []
}
// 删除标题链接
const handleRemoveSelected = () => {
  goodsOneForm.value.titleLink.name = ''
  goodsOneForm.value.titleLink.link = ''
  goodsOneForm.value.titleLink.type = ''
}
// 验证信息
const handleValidate = () => {
  let status = true
  let message = ''
  if (JSON.stringify(props.editItem) !== '{}') {
    if (JSON.stringify(props.editItem.leftConfig) !== '{}' && JSON.stringify(props.editItem.centerConfig) !== '{}' && JSON.stringify(props.editItem.rightConfig) !== '{}') {
      if (props.editItem.leftConfig.mainTitle === '' || props.editItem.centerConfig.mainTitle === '' || props.editItem.rightConfig.mainTitle === '') {
        status = false
        message = $t('pcdecorate.goodsModule1.warning2')
      } else if (props.editItem.leftConfig.subTitle === '' || props.editItem.centerConfig.subTitle === '' || props.editItem.rightConfig.subTitle === '') {
        status = false
        message = $t('pcdecorate.goodsModule1.warning3')
      } else if (props.editItem.leftConfig.titleLink.name === '' || props.editItem.centerConfig.titleLink.name === '' || props.editItem.rightConfig.titleLink.name === '') {
        status = false
        message = $t('pcdecorate.goodsModule1.warning4')
      } else if (props.editItem.leftConfig.goodsList.length === 0 || props.editItem.centerConfig.goodsList.length === 0 || props.editItem.rightConfig.goodsList.length === 0) {
        status = false
        message = $t('pcdecorate.goodsModule1.warning5')
      } else {
        status = true
      }
    } else {
      status = false
      message = $t('pcdecorate.goodsModule1.warning1')
    }
  } else {
    status = false
    message = $t('pcdecorate.goodsModule1.warning1')
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
  :deep(.el-input__inner) {
        height: 32px;
    }
    .config-items {
        margin-bottom: 20px;
        .title {
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
                width: 33.3%;
                height: 100%;
                box-sizing: border-box;
                border: 1px solid #DCDFE6;
                background: rgba(255, 255, 255, 0.39);
                cursor: pointer;
                &:nth-child(1) {
                    border-right: none;
                }
                &:nth-child(2) {
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
}
</style>
