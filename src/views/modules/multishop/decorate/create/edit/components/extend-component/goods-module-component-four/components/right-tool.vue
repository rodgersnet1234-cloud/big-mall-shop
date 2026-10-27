<template>
  <div class="goods-modulefour-configPage">
    <div class="config-items">
      <div
        v-if="goodsForm.bgImg === ''"
        class="bg-pic"
        @click="handAddBg"
      >
        <div class="bg-icon">
          <span>+</span>
          <span>{{ $t(`pcdecorate.goodsModule4.addBg`) }}</span>
        </div>
        <div class="bg-title">
          {{ $t(`pcdecorate.goodsModule4.addTips`) }}
        </div>
      </div>
      <div
        v-else
        class="bg-pic has-bg"
      >
        <el-image
          :src="checkFileUrl(goodsForm.bgImg)"
          fit="fill"
        >
          <template #error>
            <div class="image-slot">
              <el-icon><Picture /></el-icon>
            </div>
          </template>
        </el-image>
        <div
          class="close-icon"
          @click="hanldeBgRemove"
        >
          x
        </div>
      </div>
    </div>
    <div class="config-items">
      <div class="title">
        {{ $t(`pcdecorate.goodsModule4.picLink`) }}
      </div>
      <redirect-nav
        :placeholder="$t('pcdecorate.placeholder.link')"
        :selected-link="goodsForm.path.name"
        @handle-nav-select="handleNavSelect"
        @handle-remove-selected="handleRemoveSelected"
      />
    </div>
    <div class="config-items">
      <div
        class="title"
        style="margin-bottom: 14px"
      >
        {{ $t(`pcdecorate.goodsModule4.addOtherGoods`) }}
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
      :goods-number="goodsNumber"
      :echo-data-list="echoDataList"
      @handle-close="handleDialogClose"
      @handle-dialog-submit="handleDialogSubmit"
    />
    <!-- 商品 | 页面 | 跳转链接弹窗 end -->
    <!-- 添加图片弹窗组件 start -->
    <elx-imgbox
      ref="elxImgboxRef"
      :max-size="10"
      :img-size-limit="false"
      @refresh-pic="refreshPic"
    />
    <!-- 添加图片弹窗组件 end -->
  </div>
</template>
<script setup>
import redirectNav from '../../../../../common-component/redirect-nav/index.vue' // 链接跳转
import selectGoodsComponent from '../../../../../common-component/select-goods-component/index.vue'
import ElxImgbox from '@/components/img-box/index.vue' // 添加图片组件弹窗
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
const goodsForm = ref({
  bgImg: '', // 背景图
  path: { // 图片跳转路径
    name: '',
    link: '',
    type: ''
  },
  goodsList: [] // 商品
})
const addLength = ref(4) // 限制添加商品的个数
watch(() => goodsForm.value, (newVal) => { // 监听配置信息的改变
  const obj = {
    type: 'goods_module4',
    ref: props.currentRef,
    config: newVal
  }
  emit('handleUpdateMessage', obj)
}, { deep: true })
watch(() => props.currentItem, (newVal) => { // 监听信息回显
  if (newVal.currentConfigType === 'goods_module4') {
    if (JSON.stringify(newVal.config) !== '{}') {
      goodsForm.value = { ...newVal.config }
    } else {
      goodsForm.value = {
        bgImg: '', // 背景图
        path: { // 图片跳转路径
          name: '',
          link: '',
          type: ''
        },
        goodsList: [] // 商品
      }
    }
  }
})

// 跳转路径选择
const currentSelectType = ref([]) // 当前选择的类型
const dialogVisible = ref(false) // 弹窗是否显示
const echoDataList = ref([]) // 回显商品数据
const isMulilt = ref(false) // 是否允许多选
let currentClickType = '' // 当前点击的类型
const handleNavSelect = () => {
  currentClickType = 'titles'
  currentSelectType.value = [1, 2, 4, 5, 6]
  dialogVisible.value = true
  isMulilt.value = false // 禁止多选
  echoDataList.value = []
}
// 删除跳转链接
const handleRemoveSelected = () => {
  goodsForm.value.path.name = ''
  goodsForm.value.path.link = ''
  goodsForm.value.path.type = ''
}
// 关闭弹窗
const handleDialogClose = () => {
  dialogVisible.value = false
}
// 弹窗的确定
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
const goodsNumber = ref(0) // 限制商品的数量
const handleAddClick = () => {
  currentClickType = 'goods'
  currentSelectType.value = [1]
  dialogVisible.value = true
  isMulilt.value = true // 允许多选
  goodsNumber.value = 4// 限制多选的数量
  echoDataList.value = []
  goodsForm.value.goodsList.forEach(item => {
    echoDataList.value.push(item)
  })
}
// 移除商品
const handleRemove = (index) => {
  goodsForm.value.goodsList.splice(index, 1)
}
// 添加背景图
const elxImgboxRef = ref(null)
const handAddBg = () => {
  elxImgboxRef.value?.init(1, 1)
}
// 删除背景图片
const hanldeBgRemove = () => {
  goodsForm.value.bgImg = ''
}
// 选择图片之后的回调
const refreshPic = (imagePath) => {
  goodsForm.value.bgImg = checkFileUrl(imagePath)
}
// 验证信息
const handleValidate = () => {
  let status = true
  let message = ''
  if (JSON.stringify(props.editItem) === '{}') {
    status = false
    message = $t('pcdecorate.goodsModule4.warning1')
  } else if (props.editItem.bgImg === '') {
    status = false
    message = $t('pcdecorate.goodsModule4.warning4')
  } else if (props.editItem.path.name === '') {
    status = false
    message = $t('pcdecorate.goodsModule4.warning2')
  } else if (props.editItem.goodsList.length === 0) {
    status = false
    message = $t('pcdecorate.goodsModule4.warning3')
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
@use './right-tool.scss';
</style>
