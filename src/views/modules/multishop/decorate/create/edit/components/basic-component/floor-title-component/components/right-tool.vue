<template>
  <div class="floor_container_config">
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
    <el-form
      ref="floorTitleFormRef"
      :model="floorTitleForm"
      label-position="top"
      @submit.prevent
    >
      <el-form-item
        :label="$t(`pcdecorate.floorTitle.mainTitle`)"
        prop="mainTitle"
      >
        <el-input
          v-model.trim="floorTitleForm.mainTitle"
          maxlength="8"
          class="title-input"
        />
      </el-form-item>
      <el-form-item
        :label="$t(`pcdecorate.floorTitle.subTitle`)"
        prop="subTitle"
      >
        <el-input
          v-model.trim="floorTitleForm.subTitle"
          maxlength="16"
          class="title-input"
        />
      </el-form-item>
      <el-form-item>
        <span
          class="title"
          style="margin-right: 20px"
        >{{ $t(`pcdecorate.floorTitle.more`) }}</span>
        <el-radio-group v-model="floorTitleForm.more">
          <el-radio :label="0">
            {{ $t(`pcdecorate.floorTitle.show`) }}
          </el-radio>
          <el-radio :label="1">
            {{ $t(`pcdecorate.floorTitle.hide`) }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="floorTitleForm.more === 0">
        <redirect-nav
          :selected-link="floorTitleForm.path.name"
          :placeholder="$t('pcdecorate.placeholder.link')"
          @handle-nav-select="handleNavSelect"
          @handle-remove-selected="handleRemoveSelected"
        />
      </el-form-item>
      <el-form-item :label="$t(`pcdecorate.floorTitle.mainTitleColor`)">
        <pick-color-component
          :define-color="floorTitleForm.mainTextColor"
          @handle-change-color="handleChangeMainColor"
        />
      </el-form-item>
      <el-form-item :label="$t(`pcdecorate.floorTitle.subTitleColor`)">
        <pick-color-component
          :define-color="floorTitleForm.subTextColor"
          :reset-color="'rgba(153, 153, 153, 1)'"
          @handle-change-color="handleChangeSubColor"
        />
      </el-form-item>
      <el-form-item :label="$t(`pcdecorate.floorTitle.moreTitleColor`)">
        <pick-color-component
          :define-color="floorTitleForm.moreTextColor"
          :reset-color="'rgba(153, 153, 153, 1)'"
          @handle-change-color="handleChangeMoreColor"
        />
      </el-form-item>
      <el-form-item :label="$t(`pcdecorate.floorTitle.titleBgColor`)">
        <pick-color-component
          :define-color="floorTitleForm.bgColor"
          :reset-color="'rgba(244, 244, 244, 1)'"
          @handle-change-color="handleTitleBgColor"
        />
      </el-form-item>
      <div class="config-item">
        <div class="items-content slider-content">
          <div class="title">
            {{ $t(`pcdecorate.floorTitle.titleSize`) }}
          </div>
          <div class="right-select">
            <el-slider
              v-model="floorTitleForm.mainFontSize"
              :min="12"
              :max="40"
              show-input
              @change="mainChange"
            />
          </div>
        </div>
      </div>
      <div class="config-item">
        <div class="items-content slider-content">
          <div class="title">
            {{ $t(`pcdecorate.floorTitle.subTitleSize`) }}
          </div>
          <div class="right-select">
            <el-slider
              v-model="floorTitleForm.subFontSize"
              :min="12"
              :max="40"
              show-input
              @change="subChange"
            />
          </div>
        </div>
      </div>
      <div class="config-item">
        <div class="items-content slider-content">
          <div class="title">
            {{ $t(`pcdecorate.floorTitle.marginTop`) }}
          </div>
          <div class="right-select">
            <el-slider
              v-model="floorTitleForm.marginTop"
              :min="0"
              :max="100"
              show-input
              @change="topChange"
            />
          </div>
        </div>
      </div>
      <div class="config-item">
        <div class="items-content slider-content">
          <div class="title">
            {{ $t(`pcdecorate.floorTitle.marginBottom`) }}
          </div>
          <div class="right-select">
            <el-slider
              v-model="floorTitleForm.marginBottom"
              :min="0"
              :max="100"
              show-input
              @change="bottomChange"
            />
          </div>
        </div>
      </div>
    </el-form>
    <!-- 商品 | 页面 | 跳转链接弹窗 start -->
    <decorate-dialog-select
      :dialog-visible="dialogVisible"
      :current-select-type="[1, 2, 4, 5, 6]"
      @handle-close="handleDialogClose"
      @handle-dialog-submit="handleDialogSubmit"
    />
    <!-- 商品 | 页面 | 跳转链接弹窗 end -->
  </div>
</template>
<script setup>
import redirectNav from '../../../../../common-component/redirect-nav/index.vue'
import pickColorComponent from '../../../../../common-component/pick-color/index.vue'
import decorateDialogSelect from '@/components/decorate-dialog-select/index.vue' // 选择商品

const props = defineProps({
  currentRef: { // 当前组件的ref
    type: String,
    default: () => ''
  },
  currentItem: { // 点击当前组件回显右边配置信息
    type: Object,
    default: () => {}
  },
  editItem: { // 当前已经配置信息
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits(['handleUpdateMessage'])

const floorTitleForm = ref({
  mainTitle: '', // 主标题文字
  subTitle: '', // 副标题文字
  more: 0, // 查看更多
  path: {
    name: '',
    link: '',
    type: ''
  }, // 查看更多跳转的链接
  mainTextColor: 'rgba(51, 51, 51, 1)', // 主标题文字颜色
  subTextColor: 'rgba(153, 153, 153, 1)', // 副标题文字颜色
  moreTextColor: 'rgba(153, 153, 153, 1)', // 查看更多文字的颜色
  bgColor: 'rgba(244, 244, 244, 1)', // 标题的背景色
  mainFontSize: 24, // 主标题的文字大小
  subFontSize: 12, // 副标题的文字大小
  marginTop: 18, // 上边距大小
  marginBottom: 18 // 下边距大小
})
const dialogVisible = ref(false) // 弹窗显示隐藏
watch(() => floorTitleForm.value, (newVal) => {
  const obj = {
    type: 'floor_title',
    ref: props.currentRef,
    config: newVal
  }
  emit('handleUpdateMessage', obj)
}, { deep: true })
watch(() => props.currentItem, (newVal) => { // 监听组件回显
  if (newVal.currentConfigType === 'floor_title') {
    if (JSON.stringify(newVal.config) !== '{}') {
      floorTitleForm.value = { ...newVal.config }
    } else {
      init()
    }
  }
})

const init = () => {
  floorTitleForm.value = {
    mainTitle: '热卖推荐', // 主标题文字
    subTitle: '精选商品，商城热销', // 副标题文字
    more: 0, // 查看更多
    path: {
      name: '',
      link: '',
      type: ''
    }, // 查看更多跳转的链接
    mainTextColor: 'rgba(51, 51, 51, 1)', // 主标题文字颜色
    subTextColor: 'rgba(153, 153, 153, 1)', // 副标题文字颜色
    moreTextColor: 'rgba(153, 153, 153, 1)', // 查看更多文字的颜色
    bgColor: 'rgba(244, 244, 244, 1)', // 标题的背景色
    mainFontSize: 24, // 主标题的文字大小
    subFontSize: 12, // 副标题的文字大小
    marginTop: 18, // 上边距大小
    marginBottom: 18 // 下边距大小
  }
}
// 验证信息
const handleValidate = () => {
  let status = true
  let message = ''
  if (JSON.stringify(props.editItem) === '{}') {
    status = false
    message = $t('pcdecorate.floorTitle.warning1')
  } else if (props.editItem.mainTitle === '') {
    status = false
    message = $t('pcdecorate.floorTitle.warning2')
  } else if (props.editItem.subTitle === '') {
    status = false
    message = $t('pcdecorate.floorTitle.warning3')
  } else if (props.editItem.more === 0 && props.editItem.path.name === '') {
    status = false
    message = $t('pcdecorate.floorTitle.warning4')
  } else {
    status = true
  }
  return {
    status,
    message
  }
}
// 主标题文字颜色
const handleChangeMainColor = (color) => {
  floorTitleForm.value.mainTextColor = color
}
// 副标题文字颜色
const handleChangeSubColor = (color) => {
  floorTitleForm.value.subTextColor = color
}
// 查看更多文字颜色
const handleChangeMoreColor = (color) => {
  floorTitleForm.value.moreTextColor = color
}
// 标题的背景色
const handleTitleBgColor = (color) => {
  floorTitleForm.value.bgColor = color
}
// 查看更多跳转弹窗
const handleNavSelect = () => {
  dialogVisible.value = true
}
// 删除查看更多的链接
const handleRemoveSelected = () => {
  floorTitleForm.value.path.name = ''
  floorTitleForm.value.path.link = ''
  floorTitleForm.value.path.type = ''
}
// 弹窗关闭
const handleDialogClose = () => {
  dialogVisible.value = false
}
// 商品弹窗确定
const handleDialogSubmit = ({ type, value }) => {
  if (type === '1') { // 当前选择的是商品
    floorTitleForm.value.path.name = value.goodsItem.spuName
    floorTitleForm.value.path.link = value.goodsItem.spuId
    floorTitleForm.value.path.type = '1'
  } else if (type === '2') { // 当前选择的是分类
    floorTitleForm.value.path.name = value.categoryItem.label
    floorTitleForm.value.path.link = value.categoryItem.data
    floorTitleForm.value.path.type = '2'
  } else if (type === '3') { // 当前选择的是店铺
    floorTitleForm.value.path.name = value.storeItem.shopName
    floorTitleForm.value.path.link = value.storeItem.shopId
    floorTitleForm.value.path.type = '3'
  } else if (type === '4') { // 当前选择的是页面
    floorTitleForm.value.path.name = value.pageItem.title
    floorTitleForm.value.path.link = value.pageItem.link
    floorTitleForm.value.path.type = '4'
  } else if (type === '5') { // 当前选择的是微页面
    floorTitleForm.value.path.name = value.smallPageItem.name
    floorTitleForm.value.path.link = [value.smallPageItem.renovationId, value.smallPageItem.shopId]
    floorTitleForm.value.path.type = '5'
  } else if (type === '6') { // 自定义链接
    floorTitleForm.value.path.name = value.customLink.url
    floorTitleForm.value.path.link = value.customLink
    floorTitleForm.value.path.type = '6'
  }
  dialogVisible.value = false
}
// 主标题文字大小限制
const mainChange = (val) => {
  return (floorTitleForm.value.mainFontSize = Math.floor(val))
}
// 副标题文字大小限制
const subChange = (val) => {
  return (floorTitleForm.value.subFontSize = Math.floor(val))
}
// 上边距大小控制
const topChange = (val) => {
  return (floorTitleForm.value.marginTop = Math.floor(val))
}
// 下边距大小控制
const bottomChange = (val) => {
  return (floorTitleForm.value.marginBottom = Math.floor(val))
}
defineExpose({ handleValidate })
</script>
<style lang="scss" scoped>
.floor_container_config {
    :deep(.el-form-item) {
        margin-bottom: 0;
    }
    :deep(.el-form-item__label) {
        padding: 0;
        font-size: 14px;
        color: #666;
        font-family: Microsoft YaHei,sans-serif !important ;
    }
    .title-input :deep(.el-input) {
       :deep(.el-input__inner)  {
            height: 28px;
        }
    }
    .title {
        margin-left: 0 !important;
    }
    .title::before {
      width: 0 !important;
    }
     .config-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        .title {
            font-size: 14px;
            color: #666;
            font-family: Microsoft YaHei,sans-serif;
            margin-bottom: 12px;
            margin-left: 0 !important;
        }
        .title::before {
          width: 0 !important;
        }
        .title-input {
            margin-bottom: 18px;
        }
        .items-content {
            display: flex;
            &.slider-content {
                margin-bottom: 10px;
                &:nth-child(1) {
                    margin-top: 10px;
                }
                .title {
                    padding-top: 10px;
                }
            }
            .title {
                width: 80px;
                display: flex;
                align-items: center;
            }
            .right-select {
                width: 100%;
            }
        }
    }
}
</style>
