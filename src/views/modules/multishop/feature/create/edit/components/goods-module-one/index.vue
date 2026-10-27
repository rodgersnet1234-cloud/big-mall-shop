<template>
  <div class="micro-goodsOne-box">
    <!-- 预览控制区 start -->
    <div class="design-preview-controller">
      <div class="left-items">
        <module-component :config="formData.leftConfig" />
      </div>
      <div class="right-items">
        <module-component :config="formData.rightConfig" />
      </div>
    </div>
    <!-- 预览控制区 end -->
    <!-- 编辑工作区 start -->
    <div
      v-if="isShowEdit"
      class="design-editor-item design-hide-class"
    >
      <div class="design-config-editor">
        <div class="design-editor-component-title">
          商品模块1
        </div>
        <div class="config-item">
          <div class="title">
            选择对应的列数，进行详细设置
          </div>
          <div class="bottom-edit">
            <template
              v-for="(item, index) in selectArr"
              :key="index"
            >
              <div

                :class="{'edit-item': true, 'active': item.value === currentActive}"
                @click="handleSelect(index)"
              />
            </template>
          </div>
        </div>
        <div v-show="currentActive === 0">
          <div class="config-item">
            <div class="title">
              主标题文字
            </div>
            <div class="bottom-config">
              <el-input v-model.trim="formData.leftConfig.mainTitle" />
            </div>
          </div>
          <div class="config-item">
            <div class="title">
              副标题文字
            </div>
            <div class="bottom-config">
              <el-input v-model.trim="formData.leftConfig.subTitle" />
            </div>
          </div>
          <div class="config-item">
            <div class="title">
              主标题文字
            </div>
            <div class="bottom-config">
              <pick-color-component
                :define-color="formData.leftConfig.mainTitleColor"
                @handle-change-color="handleleftTitleColor"
              />
            </div>
          </div>
          <div class="config-item">
            <div class="title">
              副标题文字
            </div>
            <div class="bottom-config">
              <pick-color-component
                :define-color="formData.leftConfig.subTitleColor"
                @handle-change-color="handleleftSubTitleColor"
              />
            </div>
          </div>
          <div class="config-item special-item">
            <div class="title">
              标题字号
            </div>
            <el-slider
              v-model="formData.leftConfig.mainTitleSize"
              :min="12"
              :max="40"
              show-input
            />
          </div>
          <div class="config-item special-item">
            <div class="title">
              副标字号
            </div>
            <el-slider
              v-model="formData.leftConfig.subTitleSize"
              :min="12"
              :max="40"
              show-input
            />
          </div>
          <div class="config-item">
            <div class="title">
              添加商品(最多添加2个)
            </div>
            <div class="bottom-config">
              <select-goods-component
                :goods-list="formData.leftConfig.goodsList"
                :add-length="addLength"
                @handle-add-click="handleLeftAddClick"
                @handle-remove="handleLeftRemove"
              />
            </div>
          </div>
        </div>
        <div v-show="currentActive === 1">
          <div class="config-item">
            <div class="title">
              主标题文字
            </div>
            <div class="bottom-config">
              <el-input v-model.trim="formData.rightConfig.mainTitle" />
            </div>
          </div>
          <div class="config-item">
            <div class="title">
              副标题文字
            </div>
            <div class="bottom-config">
              <el-input v-model.trim="formData.rightConfig.subTitle" />
            </div>
          </div>
          <div class="config-item">
            <div class="title">
              主标题文字
            </div>
            <div class="bottom-config">
              <pick-color-component
                :define-color="formData.rightConfig.mainTitleColor"
                @handle-change-color="handleRightTitleColor"
              />
            </div>
          </div>
          <div class="config-item">
            <div class="title">
              副标题文字
            </div>
            <div class="bottom-config">
              <pick-color-component
                :define-color="formData.rightConfig.subTitleColor"
                @handle-change-color="handleRightSubTitleColor"
              />
            </div>
          </div>
          <div class="config-item special-item">
            <div class="title">
              标题字号
            </div>
            <el-slider
              v-model="formData.rightConfig.mainTitleSize"
              :min="12"
              :max="40"
              show-input
            />
          </div>
          <div class="config-item special-item">
            <div class="title">
              副标字号
            </div>
            <el-slider
              v-model="formData.rightConfig.subTitleSize"
              :min="12"
              :max="40"
              show-input
            />
          </div>
          <div class="config-item">
            <div class="title">
              添加商品(最多添加2个)
            </div>
            <div class="bottom-config">
              <select-goods-component
                :goods-list="formData.rightConfig.goodsList"
                :add-length="addLength"
                @handle-add-click="handleRightAddClick"
                @handle-remove="handleRightRemove"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 编辑工作区 end -->
    <!-- 商品 | 页面 | 跳转链接弹窗 start -->
    <decorate-dialog-select
      :dialog-visible="dialogVisible"
      :device-type="'mobile'"
      :is-mulilt="true"
      :goods-number="goodsNumber"
      :current-select-type="[1]"
      :echo-data-list="echoDataList"
      @handle-close="handleDialogClose"
      @handle-dialog-submit="handleDialogSubmit"
    />
    <!-- 商品 | 页面 | 跳转链接弹窗 end -->
  </div>
</template>
<script setup>
import pickColorComponent from '../../../../../decorate/create/common-component/pick-color/index.vue'
import selectGoodsComponent from '../../../../../decorate/create/common-component/select-goods-component/index.vue'
import moduleComponent from './module.vue'
import decorateDialogSelect from '@/components/decorate-dialog-select/index.vue'

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
  }
})
const emit = defineEmits(['myCheckResult', 'componentsValueChance', 'onErrorMessageTip'])

const selectArr = [
  { value: 0 },
  { value: 1 }
]
const addLength = ref(2)

watch(() => props.dataField, (val) => {
  if (val) {
    setFormData()
  }
})
watch(() => props.isStartCheckFieldRules, () => {
  checkData()
})

const formData = reactive({
  leftConfig: {
    mainTitle: '今日爆款', // 主标题文字
    subTitle: '美好新生活', // 副标题文字
    mainTitleColor: 'rgba(51, 51, 51, 1)', // 主标题颜色
    subTitleColor: 'rgba(230, 67, 45, 1)', // 副标题颜色
    mainTitleSize: 15, // 主标题字号
    subTitleSize: 12, // 副标题字号
    titleHeight: 27, // 标题高度
    goodsList: [] // 商品
  },
  rightConfig: {
    mainTitle: '新品首发', // 主标题文字
    subTitle: '大家都在买', // 副标题文字
    mainTitleColor: 'rgba(51, 51, 51, 1)', // 主标题颜色
    subTitleColor: 'rgba(255, 177, 68, 1)', // 副标题颜色
    mainTitleSize: 15, // 主标题字号
    subTitleSize: 12, // 副标题字号
    titleHeight: 27, // 标题高度
    goodsList: [] // 商品
  }
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

watch(() => formData.leftConfig, (nv) => {
  const lheight = nv.mainTitleSize + nv.subTitleSize
  const rheight = formData.rightConfig.mainTitleSize + formData.rightConfig.subTitleSize
  formData.rightConfig.titleHeight = Math.max(lheight, rheight)
  formData.leftConfig.titleHeight = Math.max(lheight, rheight)
}, {
  deep: true
})

watch(() => formData.rightConfig, (nv) => {
  const lheight = formData.leftConfig.mainTitleSize + formData.leftConfig.subTitleSize
  const rheight = nv.mainTitleSize + nv.subTitleSize
  formData.rightConfig.titleHeight = Math.max(lheight, rheight)
  formData.leftConfig.titleHeight = Math.max(lheight, rheight)
}, {
  deep: true
})

onMounted(() => {
  setFormData()
})

// 选中哪个
const currentActive = ref(0) // 当前激活的是哪个
const handleSelect = (index) => {
  currentActive.value = index
}
// 关闭商品弹窗
const dialogVisible = ref(false) // 弹窗是否显示
const handleDialogClose = () => {
  dialogVisible.value = false
}
// 商品确定
const handleDialogSubmit = ({ type, value }) => {
  if (type === '1') {
    if (currentActive.value === 0) { // 左边配置商品
      formData.leftConfig.goodsList = []
      value.goodsItem.forEach(item => {
        formData.leftConfig.goodsList.push({
          id: item.spuId || item.id, // 商品id
          name: item.spuName || item.name, // 商品名称
          prodType: item.spuType || item.prodType, // 商品类型
          price: item.priceFee || item.price, // 商品价格
          status: item.spuStatus || item.status, // 商品状态
          imgs: item.mainImgUrl || item.imgs, // 商品图片
          orignPrice: item.marketPriceFee || item.orignPrice, // 原价
          description: item.sellingPoint || item.description // 商品描述
        })
      })
    } else if (currentActive.value === 1) { // 右边配置商品
      formData.rightConfig.goodsList = []
      value.goodsItem.forEach(item => {
        formData.rightConfig.goodsList.push({
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
  }
  dialogVisible.value = false
}
// 左边的配置信息
// 选中主标题文字的颜色
const handleleftTitleColor = (color) => {
  formData.leftConfig.mainTitleColor = color
}
// 选中副标题文字颜色
const handleleftSubTitleColor = (color) => {
  formData.leftConfig.subTitleColor = color
}
// 选择商品
const goodsNumber = ref(2) // 限制选择商品的个数
const echoDataList = ref([]) // 回显商品数据
const handleLeftAddClick = () => {
  dialogVisible.value = true
  goodsNumber.value = 2 // 限制选择两个
  echoDataList.value = []
  formData.leftConfig.goodsList.forEach(item => {
    echoDataList.value.push(item)
  })
}
// 删除商品
const handleLeftRemove = (index) => {
  formData.leftConfig.goodsList.splice(index, 1)
}
// 右边配置信息
// 标题文字颜色
const handleRightTitleColor = (color) => {
  formData.rightConfig.mainTitleColor = color
}
// 副标题文字颜色
const handleRightSubTitleColor = (color) => {
  formData.rightConfig.subTitleColor = color
}
// 选择商品
const handleRightAddClick = () => {
  dialogVisible.value = true
  echoDataList.value = []
  formData.rightConfig.goodsList.forEach(item => {
    echoDataList.value.push(item)
  })
}
// 删除商品
const handleRightRemove = (index) => {
  formData.rightConfig.goodsList.splice(index, 1)
}
// 校检
const checkData = () => {
  let isPass
  let errMessage
  const str = props.currentComponent.customRemark ? props.currentComponent.customRemark : props.current
  if (formData.leftConfig.mainTitle === '') {
    isPass = false
    errMessage = '主标题文字不能为空'
  } else if (formData.leftConfig.subTitle === '') {
    isPass = false
    errMessage = '副标题文字不能为空'
  } else if (formData.leftConfig.goodsList.length === 0) {
    isPass = false
    errMessage = '商品不能为空'
  } else if (formData.rightConfig.mainTitle === '') {
    isPass = false
    errMessage = '主标题文字不能为空'
  } else if (formData.rightConfig.subTitle === '') {
    isPass = false
    errMessage = '副标题文字不能为空'
  } else if (formData.rightConfig.goodsList.length === 0) {
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
      rightConfigTitle: '商品模块1',
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

</script>
<style lang="scss" scoped>
@use './index.scss';
</style>
