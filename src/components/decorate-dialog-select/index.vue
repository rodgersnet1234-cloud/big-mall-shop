<template>
  <div class="dialog-message-content">
    <dialog-component
      :dialog-visible="dialogVisible"
      :dialog-width="'914px'"
      @handle-close="handleClose"
    >
      <template #title>
        <div>
          <el-tabs
            v-model="activeName"
            class="dialog-tab-pc"
          >
            <el-tab-pane
              v-for="item in switchTitleData"
              :key="item.id"
              :label="item.title"
              :name="item.id"
            >
              <component
                :is="com[item.components]"
                ref="tabbarRef"
                :active-name="activeName"
                :device-type="deviceType"
                :goods-type="goodsType"
                :is-mulilt="isMulilt"
                :goods-number="goodsNumber"
                :prod-type="prodType"
                :data-url="dataUrl"
                :custom-link-arr="customLinkArr"
                :echo-data-list="echoDataList"
                @handle-goods-select="handleGoodsSelect"
              />
            </el-tab-pane>
          </el-tabs>
        </div>
      </template>
      <template #footers>
        <el-button @click="handleClose">
          {{ $t('pcdecorate.commonModal.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="handleSure"
        >
          {{ $t('pcdecorate.commonModal.sure') }}
        </el-button>
      </template>
    </dialog-component>
  </div>
</template>
<script setup>
import DialogComponent from '@/components/dialog-component/index.vue' // 弹窗公共组件
import goodsComponent from './components/goods-component/index.vue' // 商品组件
import categoryComponent from './components/category-component/index.vue' // 分类组件
import storeComponent from './components/store-component/index.vue' // 店铺组件
import pageComponent from './components/page-component/index.vue' // 页面组件
import smallPageComponent from './components/small-page-component/index.vue' // 微页面组件
import customComponent from './components/custom-component/index.vue' // 自定义链接
import couponSelect from './components/coupon-select/index.vue' // 优惠券
import { ElMessage } from 'element-plus'
const com = shallowReactive({
  goodsComponent,
  categoryComponent,
  storeComponent,
  pageComponent,
  smallPageComponent,
  customComponent,
  couponSelect
})
const emit = defineEmits(['handleClose', 'handleDialogSubmit'])

const props = defineProps({
  dialogVisible: { // 弹窗是否显示
    type: Boolean,
    default: () => false
  },
  currentSelectType: { // 当前可选择的类型
    type: Array,
    default: () => []
  },
  goodsType: { // 查询的商品类型
    type: [String, Number],
    default: () => ''
  },
  isMulilt: { // 是否支持多选
    type: Boolean,
    default: () => false
  },
  goodsNumber: { // 限制添加的个数
    type: [String, Number],
    default: () => 0
  },
  deviceType: { // 弹窗类型 pc端： pc , 移动:mobile
    type: String,
    default: () => 'pc'
  },
  // eslint-disable-next-line vue/require-default-prop
  prodType: { // 类型
    type: Number
  },
  // eslint-disable-next-line vue/require-default-prop
  dataUrl: { // 活动的url
    type: String
  },
  echoDataList: { // 回显数据
    type: Array,
    default: () => []
  },
  customLinkArr: { // 自定义链接回显数据
    type: Object,
    default: () => {}
  }
})

const activeName = ref('') // 当前激活哪个tabbar
const switchTitleData = ref([]) // 弹窗的列表
const titleArr = [ // 对应的标题组件
  { title: $t('pcdecorate.commonModal.goods'), id: '1', components: 'goodsComponent' },
  { title: $t('pcdecorate.commonModal.category'), id: '2', components: 'categoryComponent' },
  { title: $t('pcdecorate.commonModal.store'), id: '3', components: 'storeComponent' },
  { title: $t('pcdecorate.commonModal.page'), id: '4', components: 'pageComponent' },
  { title: $t('pcdecorate.commonModal.smallPage'), id: '5', components: 'smallPageComponent' },
  { title: $t('pcdecorate.commonModal.customLink'), id: '6', components: 'customComponent' },
  { title: '优惠券', id: '7', components: 'couponSelect' }
]
let currentSelectedObj = { // 选择信息
  goodsItem: {}, // 选中的商品
  categoryItem: {}, // 选中的分类
  storeItem: {}, // 选中的店铺
  pageItem: {}, // 选中的页面
  smallPageItem: {}, // 选中的微页面
  customLink: '' // 自定义链接
}

// 弹窗关闭
const handleClose = () => {
  emit('handleClose')
  setTimeout(() => {
    activeName.value = ''
  }, 500)
}
// 选中的数据
const handleGoodsSelect = ({ type, value }) => {
  currentSelectedObj[type] = value
}
// 弹窗确定
const handleSure = () => {
  if (props.currentSelectType.indexOf(Number(activeName.value)) === -1) {
    return ElMessage.warning('不支持选择当前的类型，请切换到符合的类型')
  }
  if (handleIsValidate(activeName.value)) {
    if (activeName.value === '6') {
      return ElMessage.warning('请输入自定义链接')
    } else {
      return ElMessage.warning('请选择相应的选项！')
    }
  }
  emit('handleDialogSubmit', { type: activeName.value, value: currentSelectedObj })
  setTimeout(() => {
    activeName.value = ''
  }, 500)
}
// 弹窗验证
const handleIsValidate = (active) => {
  switch (active) {
    case '1': // 商品
      return isDataValidate(currentSelectedObj.goodsItem)
    case '2': // 分类
      return isDataValidate(currentSelectedObj.categoryItem)
    case '3': // 店铺
      return isDataValidate(currentSelectedObj.storeItem)
    case '4': // 页面
      return isDataValidate(currentSelectedObj.pageItem)
    case '5': // 微页面
      return isDataValidate(currentSelectedObj.smallPageItem)
    case '6': // 自定义链接
      return isDataValidate(currentSelectedObj.customLink)
    case '7': // 优惠券
      return isDataValidate(currentSelectedObj.couponsItem)
    default:
      break
  }
}
// 判断是否符合
const isDataValidate = (val) => {
  let status = true
  status = (JSON.stringify(val) === '{}' || val === undefined || val === null || val === '')
  return status
}
const tabbarRef = ref(null)
watch(() => props.dialogVisible, (val) => { // 监听弹窗是否显示
  if (val) {
    const newArr = []
    if (props.currentSelectType && Array.isArray(props.currentSelectType)) {
      props.currentSelectType.forEach(item => {
        titleArr.forEach(ele => {
          if (Number(item) === Number(ele.id)) {
            newArr.push(ele)
          }
        })
      })
      switchTitleData.value = newArr
    }
    nextTick(() => {
      if (props.customLinkArr && props.customLinkArr.type !== '') { // 判断如果在操作热区
        activeName.value = props.customLinkArr.type
      } else {
        activeName.value = switchTitleData.value[0].id || '1' // 进来默认激活第一个
      }
      // tabbarRef.value && tabbarRef.value[0]?.multipTableRef.value?.clearSelection()
    })
    currentSelectedObj = {
      goodsItem: {}, // 选中的商品
      categoryItem: {}, // 选中的分类
      storeItem: {}, // 选中的店铺
      pageItem: {}, // 选中的页面
      smallPageItem: {}, // 选中的微页面
      customLink: '' // 自定义链接
    }
  }
})

</script>
<style lang="scss" scoped>
:deep(.dialog-tab-pc) {
  width: 100%;
  .el-tabs__header {
    margin: 0 0 20px;
    .el-tabs__nav-scroll {
      height: 56px;
      line-height: 56px;
      padding-top: 15px;
      .el-tabs__nav {
        margin-left: 40px;
      }
    }
    .el-tabs__nav-wrap::after {
      height: 1px;
    }
  }
  .el-tabs__item {
    padding: 0 31px;
  }
}
</style>
