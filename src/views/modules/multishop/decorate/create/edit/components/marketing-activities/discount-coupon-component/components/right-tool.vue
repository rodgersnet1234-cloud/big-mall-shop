<template>
  <div class="limit-skill-config">
    <div class="config-items">
      <div class="title">
        {{ $t(`pcdecorate.storeList.showSubTitle`) }}
      </div>
    </div>
    <div class="config-items">
      <div class="title-input">
        <el-radio-group
          v-model="disCountForm.showSubTitle"
          style="display: flex;margin-bottom: 20px"
        >
          <el-radio :label="0">
            {{ $t(`pcdecorate.storeList.show`) }}
          </el-radio>
          <el-radio :label="1">
            {{ $t(`pcdecorate.storeList.hide`) }}
          </el-radio>
        </el-radio-group>
        <el-input
          v-show="disCountForm.showSubTitle === 0"
          v-model="disCountForm.subTitle"
        />
      </div>
    </div>
    <div class="config-items">
      <div class="title">
        {{ $t(`pcdecorate.goodsList.showContent`) }}
      </div>
    </div>
    <div class="config-items">
      <div class="title-checkbox">
        <el-checkbox-group
          v-model="disCountForm.showContent"
          style="display: flex;"
        >
          <el-checkbox
            label="0"
            style="width: 33.3%;text-align: center"
          >
            {{ $t(`pcdecorate.goodsList.goodsName`) }}
          </el-checkbox>
          <el-checkbox
            label="1"
            style="width: 33.3%;text-align: center"
          >
            {{ $t(`pcdecorate.goodsList.goodsPrice`) }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div class="config-items">
      <div class="title">
        {{ $t(`pcdecorate.storeList.mainTileColor`) }}
      </div>
    </div>
    <div class="config-items">
      <pick-color-component
        :define-color="disCountForm.mainTextColor"
        @handle-change-color="handleMainTitleColor"
      />
    </div>
    <div class="config-items">
      <div class="title">
        {{ $t(`pcdecorate.storeList.subTitleColor`) }}
      </div>
    </div>
    <div class="config-items">
      <pick-color-component
        :define-color="disCountForm.subTextColor"
        :reset-color="'rgba(153, 153, 153, 1)'"
        @handle-change-color="handleSubTitleColor"
      />
    </div>
    <div class="config-items">
      <div class="title">
        {{ $t(`pcdecorate.storeList.titleBgColor`) }}
      </div>
    </div>
    <div class="config-items">
      <pick-color-component
        :define-color="disCountForm.bgColor"
        :reset-color="'rgba(244, 244, 244, 1)'"
        @handle-change-color="handleBgColor"
      />
    </div>
    <div class="config-items">
      <div class="items-content">
        <div class="title">
          {{ $t(`pcdecorate.storeList.titleSize`) }}
        </div>
        <div class="right-select">
          <el-slider
            v-model="disCountForm.mainFontSize"
            :min="12"
            :max="40"
            show-input
            @change="mainChange"
          />
        </div>
      </div>
    </div>
    <div class="config-items">
      <div class="items-content">
        <div class="title">
          {{ $t(`pcdecorate.storeList.subTitleSize`) }}
        </div>
        <div class="right-select">
          <el-slider
            v-model="disCountForm.subFontSize"
            :min="12"
            :max="40"
            show-input
            @change="subChange"
          />
        </div>
      </div>
    </div>
    <div class="config-items">
      <div class="items-content">
        <div class="title">
          {{ $t(`pcdecorate.storeList.marginTop`) }}
        </div>
        <div class="right-select">
          <el-slider
            v-model="disCountForm.marginTop"
            :min="0"
            :max="100"
            show-input
            @change="topChange"
          />
        </div>
      </div>
    </div>
    <div class="config-items">
      <div class="items-content">
        <div class="title">
          {{ $t(`pcdecorate.storeList.marginBottom`) }}
        </div>
        <div class="right-select">
          <el-slider
            v-model="disCountForm.marginBottom"
            :min="0"
            :max="100"
            show-input
            @change="bottomChange"
          />
        </div>
      </div>
    </div>
    <div class="config-items">
      <div class="title">
        {{ $t(`pcdecorate.goodsList.addgoods`) }}
      </div>
    </div>
    <div class="config-items">
      <select-goods-component
        :goods-list="disCountForm.goodsList"
        @handle-add-click="handleAddClick"
        @handle-remove="handleRemove"
      />
    </div>
    <!-- 商品 | 页面 | 跳转链接弹窗 start -->
    <decorate-dialog-select
      :dialog-visible="dialogVisible"
      :current-select-type="[1]"
      :goods-type="1"
      :is-mulilt="true"
      :echo-data-list="echoDataList"
      @handle-close="handleDialogClose"
      @handle-dialog-submit="handleDialogSubmit"
    />
    <!-- 商品 | 页面 | 跳转链接弹窗 end -->
  </div>
</template>
<script setup>
import pickColorComponent from '../../../../../common-component/pick-color/index.vue' // 颜色选择器
import selectGoodsComponent from '../../../../../common-component/select-goods-component/index.vue' // 选择商品
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
  editItem: { // 当前已经配置信息
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits(['handleUpdateMessage'])

const disCountForm = ref({
  showSubTitle: 0, // 显示副标题
  subTitle: '', // 副标题的内容
  showContent: ['0', '1', '2'], // 显示内容
  mainTextColor: 'rgba(51, 51, 51, 1)', // 主标题文字颜色
  subTextColor: 'rgba(153, 153, 153, 1)', // 副标题文字颜色
  bgColor: 'rgba(244, 244, 244, 1)', // 标题背景颜色
  mainFontSize: 24, // 主标题字号
  subFontSize: 12, // 副标题字号
  marginTop: 30, // 上边距
  marginBottom: 20, // 下边距
  goodsList: []
})
const dialogVisible = ref(false) // 弹窗是否显示
watch(() => disCountForm.value, (newVal) => { // 监听信息的改变
  const obj = {
    type: 'discount_coupon',
    ref: props.currentRef,
    config: newVal
  }
  emit('handleUpdateMessage', obj)
}, { deep: true })

watch(() => props.currentItem, (newVal) => { // 监听当前是否已经配置
  if (newVal.currentConfigType === 'discount_coupon') {
    if (JSON.stringify(newVal.config) !== '{}') {
      disCountForm.value = { ...newVal.config }
    } else {
      init()
    }
  }
})

const init = () => {
  disCountForm.value = {
    showSubTitle: 0, // 显示副标题
    subTitle: '好物推荐，一起拼团', // 副标题的内容
    showContent: ['0', '1', '2'], // 显示内容
    mainTextColor: 'rgba(51, 51, 51, 1)', // 主标题文字颜色
    subTextColor: 'rgba(153, 153, 153, 1)', // 副标题文字颜色
    bgColor: 'rgba(244, 244, 244, 1)', // 标题背景颜色
    mainFontSize: 24, // 主标题字号
    subFontSize: 12, // 副标题字号
    marginTop: 30, // 上边距
    marginBottom: 20, // 下边距
    goodsList: []
  }
}
// 标题文字颜色
const handleMainTitleColor = (color) => {
  disCountForm.value.mainTextColor = color
}
// 副标题文字颜色
const handleSubTitleColor = (color) => {
  disCountForm.value.subTextColor = color
}
// 标题的背景颜色
const handleBgColor = (color) => {
  disCountForm.value.bgColor = color
}
// 添加商品
const echoDataList = ref([]) // 回显商品数据
const handleAddClick = () => {
  dialogVisible.value = true
  echoDataList.value = []
  disCountForm.value.goodsList.forEach(item => {
    echoDataList.value.push(item)
  })
}
// 移除商品
const handleRemove = (index) => {
  disCountForm.value.goodsList.splice(index, 1)
}
// 弹窗关闭
const handleDialogClose = () => {
  dialogVisible.value = false
}
// 弹窗确定
const handleDialogSubmit = ({ type, value }) => {
  if (type === '1') { // 表示当前选择的是商品
    const selectList = value.goodsItem
    selectList.forEach(item => {
      if (item.spuActivity) {
        if (item.spuActivity.groupActivity) {
          item.activityPrice = item.spuActivity.groupActivity.price
        }
        if (item.spuActivity.sekillActivitySpuVO) {
          item.activityPrice = item.spuActivity.sekillActivitySpuVO.seckillPrice
        }
      }
    })
    disCountForm.value.goodsList = []
    selectList.forEach(item => {
      disCountForm.value.goodsList.push({
        name: item.spuName || item.name, // 商品名称
        id: item.spuId || item.id, // 商品id
        prodType: item.spuType || item.prodType, // 商品类型
        status: item.spuStatus || item.status, // 商品状态
        price: item.activityPrice || item.price, // 商品价格
        imgs: item.mainImgUrl || item.imgs, // 商品图片
        description: item.sellingPoint || item.description, // 商品描述
        orignPrice: item.marketPriceFee || item.orignPrice // 商品原价
      })
    })
  }
  dialogVisible.value = false
}
// 验证信息
const handleValidate = () => {
  let status = true
  let message = ''
  if (JSON.stringify(props.editItem) === '{}') {
    status = false
    message = $t('pcdecorate.disCountForm.warning1')
  } else if (props.editItem.showSubTitle === 0 && props.editItem.subTitle === '') {
    status = false
    message = $t('pcdecorate.disCountForm.warning2')
  } else if (props.editItem.goodsList.length === 0) {
    status = false
    message = $t('pcdecorate.disCountForm.warning3')
  } else {
    status = true
  }
  return {
    status,
    message
  }
}

// 主标题限制小数
const mainChange = (val) => {
  return (disCountForm.value.mainFontSize = Math.floor(val))
}
// 副标题限制小数
const subChange = (val) => {
  return (disCountForm.value.subFontSize = Math.floor(val))
}
// 上边距限制小数
const topChange = (val) => {
  return (disCountForm.value.marginTop = Math.floor(val))
}
// 下边距限制小数
const bottomChange = (val) => {
  return (disCountForm.value.marginBottom = Math.floor(val))
}
defineExpose({ handleValidate })
</script>
<style lang="scss" scoped>
.limit-skill-config {
  :deep(.el-input__inner) {
        height: 32px;
    }
    .config-items {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
        .title {
            margin-left: 0 !important;
        }
        .title::before {
            width: 0 !important;
        }
        .items-content {
            display: flex;
            align-items: center;
            .title {
                width: 90px;
            }
            .right-select {
                width: calc(100% - 90px);
            }
        }
    }
}
</style>
