<template>
  <div class="micro-goodsFive-box">
    <!-- 预览控制区 start -->
    <div class="design-preview-controller">
      <module-component :config="formData" />
    </div>
    <!-- 预览控制区 end -->
    <!-- 编辑工作区 start -->
    <div
      v-if="isShowEdit"
      class="design-editor-item design-hide-class"
    >
      <div class="design-config-editor">
        <div class="design-editor-component-title">
          <div style="flex: 1;">
            商品模块5
            {{ currentComponent.customRemark }}
          </div>
          <custom-remark-edit-popover
            :index="currentUseComponents.findIndex(item => item.id === currentComponent.id)"
            :current-edit-component="currentEditComponent"
            @set-current-component="setCurrentComponent"
            @save-edit="saveCustomRemark"
          />
        </div>
        <div class="config-item">
          <div class="title">
            添加大图 <span>(建议选择334*196px或者同等比例的图片)</span>
          </div>
          <div class="bottom-contents">
            <div class="add-btn">
              <div
                v-if="formData.leftMessage.img === ''"
                class="add-items"
                @click="handleAddLeftImg"
              >
                <span>+</span>
                <span>添加图片</span>
              </div>
              <el-image
                v-else
                :src="checkFileUrl(formData.leftMessage.img)"
                fit="fill"
              >
                <template #error>
                  <img
                    class="img-slot"
                    src="~@/assets/images/def.png"
                  >
                </template>
              </el-image>
              <el-icon
                v-if="formData.leftMessage.img != ''"
                class="el-icon-error"
                @click="handleRemoveLeftImgs"
              >
                <CircleCloseFilled />
              </el-icon>
            </div>
            <div class="right-content">
              <div class="right-titles">
                链接
              </div>
              <redirect-nav
                class="link-redirect"
                :selected-link="formData.leftMessage.path.name"
                :placeholder="$t('pcdecorate.placeholder.link')"
                @handle-nav-select="handleLeftNavSelect"
                @handle-remove-selected="handleLeftRemoveSelected"
              />
            </div>
          </div>
        </div>
        <div class="config-item">
          <div class="bottom-contents">
            <div class="add-btn">
              <div
                v-if="formData.rightMessage.img === ''"
                class="add-items"
                @click="handleAddRightImg"
              >
                <span>+</span>
                <span>添加图片</span>
              </div>
              <el-image
                v-else
                :src="checkFileUrl(formData.rightMessage.img)"
                fit="fill"
              >
                <template #error>
                  <img
                    class="img-slot"
                    src="~@/assets/images/def.png"
                  >
                </template>
              </el-image>
              <el-icon
                v-if="formData.rightMessage.img != ''"
                class="el-icon-error"
                @click="handleRemoveRightImgs"
              >
                <CircleCloseFilled />
              </el-icon>
            </div>
            <div class="right-content">
              <div class="right-titles">
                链接
              </div>
              <redirect-nav
                class="link-redirect"
                :selected-link="formData.rightMessage.path.name"
                :placeholder="$t('pcdecorate.placeholder.link')"
                @handle-nav-select="handleRightNavSelect"
                @handle-remove-selected="handleRightRemoveSelected"
              />
            </div>
          </div>
        </div>
        <div class="config-item">
          <div class="title">
            添加商品 <span>(最多添加12个商品)</span>
          </div>
          <div class="bottom-config">
            <select-goods-component
              :goods-list="formData.goodsList"
              :add-length="addLength"
              @handle-add-click="handleAddClick"
              @handle-remove="handleRemove"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- 编辑工作区 end -->
    <!-- 商品 | 页面 | 跳转链接弹窗 start -->
    <decorate-dialog-select
      :dialog-visible="dialogVisible"
      :current-select-type="currentSelectType"
      :is-mulilt="isMulilt"
      :device-type="'mobile'"
      :echo-data-list="echoDataList"
      :goods-number="goodsNumber"
      @handle-close="handleDialogClose"
      @handle-dialog-submit="handleDialogSubmit"
    />
    <!-- 商品 | 页面 | 跳转链接弹窗 end -->
    <!-- 弹窗, 新增图片 start -->
    <elx-imgbox
      ref="elxImgboxRef"
      :max-size="10"
      :img-size-limit="false"
      @refresh-pic="refreshPic"
    />
    <!-- 弹窗，新增图片 end -->
  </div>
</template>
<script setup>
import selectGoodsComponent from '../../../../../decorate/create/common-component/select-goods-component/index.vue'
import moduleComponent from './module.vue'
import redirectNav from '../../../../../decorate/create/common-component/redirect-nav/index.vue'
import ElxImgbox from '@/components/img-box/index.vue'
import decorateDialogSelect from '@/components/decorate-dialog-select/index.vue'
import customRemarkEditPopover from '../../../../../components/custom-remark-edit-poppver/index.vue'

const props = defineProps({
  currentComponent: { // 当前组件
    type: Object,
    default: () => {}
  },
  indexKey: { // 当前组件排序索引 type_ + key
    type: String,
    default: ''
  },
  current: { // 当前排序索引 key
    type: Number,
    default: 0
  },
  isShowEdit: { // 是否为编辑状态
    type: Boolean,
    default: false
  },
  dataField: { // 所有上传到后端的字段
    type: Object,
    default: () => {
    }
  },
  isStartCheckFieldRules: { // 是否开始校验规则
    type: Boolean,
    default: false
  },
  currentUseComponents: {
    type: Array,
    default: () => {}
  }
})
const emit = defineEmits(['myCheckResult', 'componentsValueChance', 'onErrorMessageTip'])

const addLength = ref(12)

watch(() => props.dataField, (val) => {
  if (val) {
    setFormData()
  }
})
watch(() => props.isStartCheckFieldRules, () => {
  checkData()
})

const formData = reactive({
  leftMessage: {
    img: '',
    path: {
      name: '',
      link: '',
      type: ''
    }
  },
  rightMessage: {
    img: '',
    path: {
      name: '',
      link: '',
      type: ''
    }
  },
  goodsList: [] // 商品列表
})
watch(() => formData, (val) => {
  if (val) {
    emit('componentsValueChance', {
      indexKey: props.indexKey,
      current: props.current,
      dataField: val
    })
  }
}, {
  deep: true
})

onMounted(() => {
  setFormData()
})

// 添加图片1
const elxImgboxRef = ref(null)
const currentOperation = ref('')
const handleAddLeftImg = () => {
  currentOperation.value = 'addImg1'
  elxImgboxRef.value?.init(1, 1)
}
// 删除图片1
const handleRemoveLeftImgs = () => {
  formData.leftMessage.img = ''
}
// 添加图片2
const handleAddRightImg = () => {
  currentOperation.value = 'addImg2'
  elxImgboxRef.value?.init(1, 1)
}
// 删除图片2
const handleRemoveRightImgs = () => {
  formData.rightMessage.img = ''
}
// 图片1的选择跳转链接
const dialogVisible = ref(false) // 商品弹窗
const currentSelectType = ref([]) // 当前的限制选择的类型
const isMulilt = ref(false) // 是否可以多选
const echoDataList = ref([]) // 回显商品数据
const handleLeftNavSelect = () => {
  currentOperation.value = 'link1'
  dialogVisible.value = true
  currentSelectType.value = [1, 2, 4, 5, 6]
  isMulilt.value = false
  echoDataList.value = []
}
// 图片1的删除跳转链接
const handleLeftRemoveSelected = () => {
  formData.leftMessage.path.name = ''
  formData.leftMessage.path.link = ''
  formData.leftMessage.path.type = ''
}
// 图片2的选择跳转链接
const handleRightNavSelect = () => {
  currentOperation.value = 'link2'
  dialogVisible.value = true
  currentSelectType.value = [1, 2, 4, 5, 6]
  isMulilt.value = false
  echoDataList.value = []
}
// 图片2的删除跳转链接
const handleRightRemoveSelected = () => {
  formData.rightMessage.path.name = ''
  formData.rightMessage.path.link = ''
  formData.rightMessage.path.type = ''
}
// 图片选择回调
const refreshPic = (imagePath) => {
  if (currentOperation.value === 'addImg1') {
    formData.leftMessage.img = checkFileUrl(imagePath)
  } else if (currentOperation.value === 'addImg2') {
    formData.rightMessage.img = checkFileUrl(imagePath)
  }
}
// 关闭弹窗
const handleDialogClose = () => {
  dialogVisible.value = false
}
// 弹窗确定
const handleDialogSubmit = ({ type, value }) => {
  if (currentOperation.value === 'goods') {
    if (type === '1') {
      formData.goodsList = []
      value.goodsItem.forEach(item => {
        formData.goodsList.push({
          id: item.prodId || item.spuId, // 商品id
          name: item.prodName || item.spuName, // 商品名称
          prodType: item.prodType || item.spuType, // 商品类型
          price: item.price || item.priceFee, // 商品价格
          status: item.status || item.spuStatus, // 商品状态
          imgs: item.pic || item.mainImgUrl, // 商品图片
          orignPrice: item.oriPrice || item.marketPriceFee, // 商品原价
          description: item.brief || item.sellingPoint // 商品描述
        })
      })
    }
  } else if (currentOperation.value === 'link1') {
    if (type === '1') { // 当前选择的是商品
      formData.leftMessage.path.name = value.goodsItem.spuName
      formData.leftMessage.path.link = value.goodsItem.spuId
      formData.leftMessage.path.type = '1'
    } else if (type === '2') { // 当前选择的是分类
      formData.leftMessage.path.name = value.categoryItem.label
      formData.leftMessage.path.link = value.categoryItem.data
      formData.leftMessage.path.type = '2'
    } else if (type === '3') { // 当前选择的是店铺
      formData.leftMessage.path.name = value.storeItem.shopName
      formData.leftMessage.path.link = value.storeItem.shopId
      formData.leftMessage.path.type = '3'
    } else if (type === '4') { // 当前选择的是页面
      formData.leftMessage.path.name = value.pageItem.title
      formData.leftMessage.path.link = value.pageItem.link
      formData.leftMessage.path.type = '4'
    } else if (type === '5') { // 当前选择的是微页面
      formData.leftMessage.path.name = value.smallPageItem.name
      formData.leftMessage.path.link = value.smallPageItem.renovationId
      formData.leftMessage.path.type = '5'
    } else if (type === '6') { // 自定义链接
      formData.leftMessage.path.name = value.customLink.url
      formData.leftMessage.path.link = value.customLink
      formData.leftMessage.path.type = '6'
    }
  } else if (currentOperation.value === 'link2') {
    if (type === '1') { // 当前选择的是商品
      formData.rightMessage.path.name = value.goodsItem.spuName
      formData.rightMessage.path.link = value.goodsItem.spuId
      formData.rightMessage.path.type = '1'
    } else if (type === '2') { // 当前选择的是分类
      formData.rightMessage.path.name = value.categoryItem.label
      formData.rightMessage.path.link = value.categoryItem.data
      formData.rightMessage.path.type = '2'
    } else if (type === '3') { // 当前选择的是店铺
      formData.rightMessage.path.name = value.storeItem.shopName
      formData.rightMessage.path.link = value.storeItem.shopId
      formData.rightMessage.path.type = '3'
    } else if (type === '4') { // 当前选择的是页面
      formData.rightMessage.path.name = value.pageItem.title
      formData.rightMessage.path.link = value.pageItem.link
      formData.rightMessage.path.type = '4'
    } else if (type === '5') { // 当前选择的是微页面
      formData.rightMessage.path.name = value.smallPageItem.name
      formData.rightMessage.path.link = value.smallPageItem.renovationId
      formData.rightMessage.path.type = '5'
    } else if (type === '6') { // 自定义链接
      formData.rightMessage.path.name = value.customLink.url
      formData.rightMessage.path.link = value.customLink
      formData.rightMessage.path.type = '6'
    }
  }
  dialogVisible.value = false
}
// 选择商品
const goodsNumber = ref(0) // 限制多少个商品
const handleAddClick = () => {
  dialogVisible.value = true
  currentOperation.value = 'goods'
  currentSelectType.value = [1]
  isMulilt.value = true // 商品可以多选
  goodsNumber.value = 12 // 限制选择商品的个数
  echoDataList.value = []
  formData.goodsList.forEach(item => {
    echoDataList.value.push(item)
  })
}
// 删除商品
const handleRemove = (index) => {
  formData.goodsList.splice(index, 1)
}
// 校检
const checkData = () => {
  let isPass
  let errMessage
  const str = props.currentComponent.customRemark ? props.currentComponent.customRemark : props.current
  if (formData.leftMessage.img === '' || formData.rightMessage.img === '') {
    isPass = false
    errMessage = '大图不能为空'
  } else if (formData.leftMessage.path.name === '' || formData.rightMessage.path.name === '') {
    isPass = false
    errMessage = '大图跳转链接不能为空'
  } else if (formData.goodsList.length === 0) {
    isPass = false
    errMessage = '商品不能为空'
  } else {
    isPass = true
    errMessage = ''
  }
  if (isPass) {
    myCheckResult(isPass)
  } else {
    emit('onErrorMessageTip', {
      customRemark: str,
      rightConfigTitle: '商品模块5',
      errorMessage: errMessage
    })
  }
}

/** 设置或者重设formData的数据 */
const setFormData = () => {
  if (props.dataField) {
    for (const el in props.dataField) {
      formData[el] = props.dataField[el]
    }
  }
}
/**
 * 返回校验结果
 * isHeader 是否为顶部 特殊情况
 * 结果：Boolean true false
 * */
const myCheckResult = ($isPass) => {
  emit('myCheckResult', {
    data: {
      isPass: $isPass,
      dataField: props.dataField,
      isHeader: (props.currentComponent.type.indexOf('config') !== -1),
      current: props.current
    }
  })
}

// 自定义标签
const currentEditComponent = ref({})
const setCurrentComponent = (index) => {
  currentEditComponent.value = props.currentUseComponents[index]
}
const saveCustomRemark = (remark) => {
  currentEditComponent.value.customRemark = remark
}

</script>
<style lang="scss" scoped>
@use './index.scss';
</style>
