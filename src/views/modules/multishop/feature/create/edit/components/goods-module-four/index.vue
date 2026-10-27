<template>
  <div class="micro-goodsFour-box">
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
            商品模块4
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
            添加大图 <span>(建议选择720*196px或者同等比例的图片)</span>
          </div>
          <div class="bottom-contents">
            <div class="add-btn">
              <div
                v-if="formData.topImg === ''"
                class="add-items"
                @click="handleAddImg"
              >
                <span>+</span>
                <span>添加图片</span>
              </div>
              <el-image
                v-else
                :src="checkFileUrl(formData.topImg)"
                fit="fill"
              >
                <template #error>
                  <img
                    class="img-slot"
                    src="@/assets/images/def.png"
                  >
                </template>
              </el-image>
              <el-icon
                v-if="formData.topImg != ''"
                class="el-icon-error"
                @click="handleRemoveImgs"
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
                :selected-link="formData.path.name"
                :placeholder="$t('pcdecorate.placeholder.link')"
                @handle-nav-select="handleNavSelect"
                @handle-remove-selected="handleRemoveSelected"
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
const formData = reactive({
  topImg: '',
  path: {
    name: '',
    link: '',
    type: ''
  },
  goodsList: []
})
const dialogVisible = ref(false) // 弹窗
const currentSelectType = ref([])
const currentOperation = ref('') // 当前操作的类型
const isMulilt = ref(false) // 是否可以多选
const goodsNumber = ref(0) // 限制选择的数量
const echoDataList = ref([]) // 回显商品数据

watch(() => props.dataField, (val) => {
  if (val) {
    setFormData()
  }
})
watch(() => props.isStartCheckFieldRules, () => {
  startCheckFieldRulesCommonFun()
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

// 选择商品
const handleAddClick = () => {
  dialogVisible.value = true
  currentSelectType.value = [1]
  currentOperation.value = 'goods'
  isMulilt.value = true // 可以多选
  goodsNumber.value = 12 // 限制选择的数量
  echoDataList.value = []
  formData.goodsList.forEach(item => {
    echoDataList.value.push(item)
  })
}
// 删除商品
const handleRemove = (index) => {
  formData.goodsList.splice(index, 1)
}
// 添加图片
const elxImgboxRef = ref(null)
const handleAddImg = () => {
  elxImgboxRef.value?.init(1, 1)
}
// 选择图片的回调
const refreshPic = (imagePath) => {
  formData.topImg = checkFileUrl(imagePath)
}
// 删除图片
const handleRemoveImgs = () => {
  formData.topImg = ''
}
// 选择商品链接
const handleNavSelect = () => {
  dialogVisible.value = true
  currentSelectType.value = [1, 2, 4, 5, 6]
  currentOperation.value = 'links'
  isMulilt.value = false // 不能多选
  echoDataList.value = []
}
// 删除图片链接
const handleRemoveSelected = () => {
  formData.path.name = ''
  formData.path.link = ''
  formData.path.type = ''
}
// 弹窗关闭
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
  } else if (currentOperation.value === 'links') {
    if (type === '1') { // 当前选择的是商品
      formData.path.name = value.goodsItem.spuName
      formData.path.link = value.goodsItem.spuId
      formData.path.type = '1'
    } else if (type === '2') { // 当前选择的是分类
      formData.path.name = value.categoryItem.label
      formData.path.link = value.categoryItem.data
      formData.path.type = '2'
    } else if (type === '3') { // 当前选择的是店铺
      formData.path.name = value.storeItem.shopName
      formData.path.link = value.storeItem.shopId
      formData.path.type = '3'
    } else if (type === '4') { // 当前选择的是页面
      formData.path.name = value.pageItem.title
      formData.path.link = value.pageItem.link
      formData.path.type = '4'
    } else if (type === '5') { // 当前选择的是微页面
      formData.path.name = value.smallPageItem.name
      formData.path.link = value.smallPageItem.renovationId
      formData.path.type = '5'
    } else if (type === '6') { // 自定义链接
      formData.path.name = value.customLink.url
      formData.path.link = value.customLink
      formData.path.type = '6'
    }
  }
  dialogVisible.value = false
}
// 校检
const checkData = () => {
  let isPass
  let errMessage
  const str = props.currentComponent.customRemark ? props.currentComponent.customRemark : props.current
  if (formData.topImg === '') {
    isPass = false
    errMessage = '大图不能为空'
  } else if (formData.path.name === '') {
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
      rightConfigTitle: '商品模块4',
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
 * 从父级传过来默认开始验证规格的时候
 * 一般为保存时
 * */
const startCheckFieldRulesCommonFun = () => {
  checkData()
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
