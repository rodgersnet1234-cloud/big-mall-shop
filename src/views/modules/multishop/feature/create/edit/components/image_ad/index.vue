<template>
  <div class="micro-image-ad-box">
    <!--预览区-->
    <div class="design-preview-controller">
      <div
        v-if="formData.imageList.length"
        class="ad-view-box"
        :class="'ad-view-'+formData.indicator"
      >
        <div v-if="formData.indicator ===1">
          <div
            v-for="(item,index) in formData.imageList"
            :key="index"
            :style="{display: 'block', height: formData.imgHeight + 'px'}"
          >
            <el-image
              :key="index"
              fit="fill"
              style="display: flex; align-items: center;justify-content: center; width: 100%; height: 100%"
              :src="item.url"
            >
              <template #error>
                <div class="image-slot">
                  <img
                    src="@/assets/pc-micro-page/show-default.png"
                  >
                </div>
              </template>
            </el-image>
          </div>
        </div>
        <el-image
          v-for="(item,index) in formData.imageList"
          v-else
          :key="index"
          fit="fill"
          :style="{height: formData.imgHeight + 'px'}"
          style="display: flex;justify-content: center;align-items: center;"
          class="image-ad-view"
          :src="checkFileUrl(item.url)"
        >
          <template #error>
            <div class="image-slot">
              <img
                src="@/assets/pc-micro-page/show-default.png"
              >
            </div>
          </template>
        </el-image>
        <div
          v-if="formData.indicator === 2 && formData.swiperOption.indicatorDots"
          :style="{'bottom': formData.swiperOption.indicatorBottom + 'px'}"
          class="ad-po"
        >
          <span :style="{background:formData.swiperOption.indicatorActiveColor}" />
          <span :style="{background:formData.swiperOption.indicatorColor}" />
          <span :style="{background:formData.swiperOption.indicatorColor}" />
        </div>
      </div>
      <div
        v-else
        class="image-ad-view"
      >
        <div class="image-ad-title">
          {{ $t('shopFeature.imageAd.widthSuggest') }}
        </div>
      </div>
    </div>
    <!--编辑区-->
    <div
      v-show="isShowEdit"
      class="design-editor-item design-hide-class"
    >
      <div class="design-config-editor">
        <div class="design-editor-component-title">
          <div style="flex: 1;">
            {{ $t('shopFeature.imageAd.imageAd') }}
            {{ currentComponent.customRemark }}
          </div>
          <custom-remark-edit-popover
            :index="currentUseComponents.findIndex(item => item.id === currentComponent.id)"
            :current-edit-component="currentEditComponent"
            @set-current-component="setCurrentComponent"
            @save-edit="saveCustomRemark"
          />
        </div>
        <div class="design-editor-component-container">
          <div class="image-ad-edit">
            <div class="ad-edit-item">
              <div class="ad-edit-item-title">
                {{ $t('shopFeature.imageAd.selModel') }}
              </div>
              <div class="ad-edit-item-content">
                <div
                  v-for="(item,index) in typeList"
                  :key="index"
                  :class="['item-box-type',{active:index + 1 === formData.indicator}]"
                  @click="changeIndicator(index)"
                >
                  <img
                    v-if="index + 1 === formData.indicator"
                    :src="item.picActive"
                  >
                  <img
                    v-else
                    :src="item.pic"
                  >
                  <p>{{ item.title }}</p>
                </div>
              </div>
            </div>
            <el-form
              v-if="formData.indicator === 2"
              ref="formDataRef"
              class="ad-form"
              label-width="100px"
              @submit.prevent
            >
              <el-form-item :label="$t('shopFeature.imageAd.isShowDots')">
                <el-switch
                  v-model="formData.swiperOption.indicatorDots"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                />
              </el-form-item>
              <el-form-item
                v-if="formData.swiperOption.indicatorDots"
                :label="$t('shopFeature.imageAd.dotsColor')"
              >
                <el-color-picker
                  v-model="formData.swiperOption.indicatorColor"
                  show-alpha
                />
              </el-form-item>
              <el-form-item
                v-if="formData.swiperOption.indicatorDots"
                :label="$t('shopFeature.imageAd.actDotColor')"
              >
                <el-color-picker
                  v-model="formData.swiperOption.indicatorActiveColor"
                  show-alpha
                />
              </el-form-item>
              <el-form-item
                v-if="formData.swiperOption.indicatorDots"
                label="指示点位置"
              >
                <el-slider
                  v-model="formData.swiperOption.indicatorBottom"
                  style="width: 80%"
                  :show-tooltip="showTooltip"
                  show-input
                  :min="0"
                  :max="formData.imgHeight - 10"
                  @input="changeBoxHeight(true)"
                  @change="changeBoxHeight(false)"
                />
              </el-form-item>
            </el-form>

            <div class="ad-edit-item">
              <div class="ad-edit-item-title">
                <span class="img-tips">{{ $t('shopFeature.imageAd.imgSizeTip') }}</span>
              </div>
              <div class="ad-edit-item-title ad-edit-img-height">
                {{ $t('shopFeature.imageAd.imgHeight') }}
                <el-slider
                  v-model="formData.imgHeight"
                  style="width: 80%"
                  :show-tooltip="showTooltip"
                  show-input
                  :min="100"
                  :max="400"
                  @input="changeBoxHeight(true)"
                  @change="changeBoxHeight(false)"
                />
              </div>
              <div class="ad-edit-item-title">
                {{ $t('shopFeature.imageAd.addPic') }}
                <span class="tips">{{ $t('shopFeature.imageAd.max10Ads') }}</span>
              </div>
              <VueDraggableNext
                :list="formData.imageList"
                ghost-class="ghost"
                handle=".ad-handle"
              >
                <div
                  v-for="(item,index) in formData.imageList"
                  :key="index"
                  class="ad-image-list-item"
                >
                  <div
                    class="ad-image-list-img ad-handle"
                    :style="{backgroundImage:`url(${item.url})`}"
                  >
                    <p
                      class="re-choose-img"
                      @click="changeImg(index)"
                    >
                      {{ $t('shopFeature.tabNav.changePic') }}
                    </p>
                  </div>
                  <div class="ad-image-list-content">
                    <div class="ad-image-item">
                      <div class="ad-image-title">
                        {{ $t('shopFeature.imageAd.picTit') }}
                      </div>
                      <el-input
                        v-model="item.imgTit"
                        :placeholder="$t('shopFeature.imageAd.picTit')"
                      />
                      <redirect-nav
                        style="width: 200px"
                        :selected-link="item.path && item.path.name"
                        :placeholder="$t('pcdecorate.placeholder.link')"
                        @handle-nav-select="handleNavSelect(item, index)"
                        @handle-remove-selected="handleRemoveSelected(item, index)"
                      />
                    </div>
                    <el-icon
                      class="el-icon-error close-icon"
                      @click="formData.imageList.splice(index, 1)"
                    >
                      <CircleCloseFilled />
                    </el-icon>
                  </div>
                </div>
              </VueDraggableNext>
              <!--选择图片框-->
              <div
                v-if="10 - formData.imageList.length !== 0"
                class="ad-add-image p-add-btn"
                @click="elxImgboxHandle"
              >
                <el-icon><Plus /></el-icon>{{ $t('shopFeature.imageAd.addBgImg') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 弹窗, 新增图片 -->
    <elx-imgbox
      ref="elxImgboxRef"
      :max-size="10"
      :img-size-limit="false"
      @refresh-pic="refreshPic"
    />
    <!-- 商品选择弹窗  -->
    <prods-select
      v-if="dialogChooseGoods"
      ref="ProdsSelectRef"
      :is-single="true"
      @refresh-select-prods="chooseGoodsFun"
    />
    <!--选择微页面-->
    <el-dialog
      v-model="dialogChoosePages"
      custom-class="up-dialog"
      :close-on-click-modal="false"
      top="5vh"
      :title="$t('shopFeature.tabNav.microPage')"
      width="42%"
    >
      <div class="choose-goods-compent">
        <choose-feature
          :is-get-choose-data="isGetChooseFeature"
          @choose-choose-features-fun="chooseChooseFeaturesFun"
        />
      </div>
      <template #footer>
        <div
          style="text-align: right;margin-top: 20px;"
        >
          <el-button
            type="primary"
            @click="isGetChooseFeature=!isGetChooseFeature"
          >
            {{ $t('shopFeature.tabNav.confirm') }}
          </el-button>
          <el-button
            @click="dialogChoosePages = false"
          >
            {{ $t('shopFeature.tabNav.cancel') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 弹窗: 输入自定义路径 -->
    <el-dialog
      v-model="showPathInputDialog"
      custom-class="up-dialog"
      :title="$t('shopFeature.tabNav.customPath')"
      width="40%"
      top="30vh"
    >
      <div class="custom-path-con">
        <span>{{ $t('shopFeature.tabNav.routeLink') }}</span>
        <el-input
          v-model="customPath"
          :placeholder="$t('shopFeature.tabNav.pleaseFillThePath')"
        />
      </div>
      <template #footer>
        <div style="text-align: right;">
          <el-button
            type="primary"
            @click="customPathComfirm"
          >
            {{ $t('shopFeature.tabNav.confirm') }}
          </el-button>
          <el-button
            @click="customPathCancel"
          >
            {{ $t('shopFeature.tabNav.cancel') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 商品 | 页面 | 跳转链接弹窗 start -->
    <decorate-dialog-select
      :dialog-visible="dialogVisible"
      :device-type="'mobile'"
      :current-select-type="[1, 2, 4, 5, 6]"
      @handle-close="handleDialogClose"
      @handle-dialog-submit="handleDialogSubmit"
    />
    <!-- 商品 | 页面 | 跳转链接弹窗 end -->
  </div>
</template>
<script setup>
/**
 * 创建新组件之后，在all-can-use-components中添加
 * 必须应用 microCreateMinis
 * 数据必须以formData包含
 * */
import { ElMessage } from 'element-plus'
import { VueDraggableNext } from 'vue-draggable-next'
import ProdsSelect from '@/components/prods-select/index.vue'
import ElxImgbox from '@/components/img-box/index.vue'
import ChooseFeature from '@/components/choose-feature/index.vue'
import redirectNav from '../../../../../decorate/create/common-component/redirect-nav/index.vue'
import decorateDialogSelect from '@/components/decorate-dialog-select/index.vue' // 选择商品

import oneLineOne from '@/assets/micro-page/one-line-one.png'
import oneLineOneActive from '@/assets/micro-page/one-line-one-active.png'
import carouselSwiper from '@/assets/micro-page/carousel-swiper.png'
import carouselSwiperActive from '@/assets/micro-page/carousel-swiper-active.png'
import lateralSliding from '@/assets/micro-page/lateral-sliding.png'
import lateralSlidingActive from '@/assets/micro-page/lateral-sliding-active.png'

import customRemarkEditPopover from '../../../../../components/custom-remark-edit-poppver/index.vue'

/** 图片广告 */

// mixins: [microCreateMinis],
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

const emit = defineEmits(['myCheckResult', 'showCheckForm', 'componentsValueChance', 'onErrorMessageTip'])

const typeList = [
  {
    title: $t('shopFeature.goods.oneLineItem1'),
    pic: oneLineOne,
    picActive: oneLineOneActive
  },
  {
    title: $t('shopFeature.imageAd.carouselPoster'),
    pic: carouselSwiper,
    picActive: carouselSwiperActive
  },
  {
    title: $t('shopFeature.imageAd.lateralSliding'),
    pic: lateralSliding,
    picActive: lateralSlidingActive
  }
]

const isGetChooseFeature = ref(false) // 是否可以返回微页面

watch(() => props.dataField, (val) => {
  if (val) {
    setFormData()
  }
})
watch(() => props.isStartCheckFieldRules, () => {
  checkData()
})

/** 选择图片的弹窗 */
const formData = reactive({
  indicator: 1, // 选择模板: 1一行一个; 2轮播海报; 3横向滑动; 4热区
  imgHeight: 160, // 图片高度
  imageList: [], // 图片列表
  swiperOption: { // 轮播海报设置
    indicatorDots: false, // 是否显示指示点
    indicatorColor: 'rgba(0, 0, 0, .3)', // 默认指示点颜色
    indicatorActiveColor: '#e43130', // 激活的指示点颜色
    indicatorBottom: 10 // 激活的指示点位置
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

onMounted(() => {
  setFormData()
})

/**
 * 选择图片
 * @param {String} type
 * type 1 单选; 2 多选
 */
const elxImgboxRef = ref(null)
const isChangeImg = ref(false) // 是否为更换图片模式
const elxImgboxHandle = (type) => {
  if (type !== 1) {
    isChangeImg.value = false
  }
  nextTick(() => {
    elxImgboxRef.value.init(type || 2, 10 - formData.imageList?.length)
  })
}
/**
 * 选择图片回调
 * @param {String} imagePath 无前缀的图片地址字符串(多图时用,分割)
 */
const currentEditIndex = ref(0) // 当前编辑的图片
const refreshPic = (imagePath) => {
  const imgsList = imagePath.split(',')
  for (let i = 0; i < imgsList.length; i++) {
    imgsList[i] = checkFileUrl(imgsList[i])
  }
  if (imgsList.length) {
    if (isChangeImg.value) { // 更换图片模式
      formData.imageList[currentEditIndex.value].url = imgsList[0]
      formData.imageList[currentEditIndex.value].title = ''
      return
    }
    imgsList.forEach(res => {
      formData.imageList.push({
        url: res,
        title: '',
        link: '',
        type: '',
        imgTit: '',
        path: {
          type: '',
          name: '',
          link: ''
        },
        activeBoxs: []
      })
    })
    const imgDef = new Image()
    imgDef.src = formData.imageList[0].url
    formData.imgHeight = Math.round(375 / imgDef.width * imgDef.height)
  }
}
/** 切换模板 */
const changeIndicator = (index) => {
  formData.indicator = index + 1
}
/** 更换图片 */
const changeImg = (index) => {
  isChangeImg.value = true
  currentEditIndex.value = index
  elxImgboxHandle(1)
}
// 选择商品回调
const dialogChooseGoods = ref(false) // 选择商品
const chooseGoodsFun = ($event) => {
  if ($event) {
    setLinkInfo({
      title: $event.prodName,
      link: $event.prodId
    })
  }
  dialogChooseGoods.value = false
}
/** 设置跳转信息 */
const { proxy } = getCurrentInstance()
const commandInfo = {} // 选择跳转的信息
const editLinkType = ref(0) // 当前改项目的跳转类型
const setLinkInfo = (obj) => {
  formData.imageList[currentEditIndex.value].title = obj.title
  formData.imageList[currentEditIndex.value].link = obj.link
  formData.imageList[currentEditIndex.value].type = commandInfo.type || editLinkType.value
  proxy.$forceUpdate()
}

/**
 * 自定义路径弹窗确认
 */
const customPath = ref('') // 自定义路径
const showPathInputDialog = ref(false) // 自定义路径输入弹窗
const customPathComfirm = () => {
  if (!customPath.value.trim()) {
    ElMessage.error($t('shopFeature.tabNav.pleaseFillThePath'))
    return
  }
  setLinkInfo({
    title: customPath.value,
    link: customPath.value
  })
  showPathInputDialog.value = false
  customPath.value = ''
}
/**
 * 自定义路径弹窗取消
 */
const customPathCancel = () => {
  showPathInputDialog.value = false
}

// 选择微页面回调
const dialogChoosePages = ref(false)
const chooseChooseFeaturesFun = () => {
  dialogChoosePages.value = false
}
// 选择跳转路径
const dialogVisible = ref(false) // 商品弹窗
const currentImgIndex = ref(0) // 当前操作广告
const handleNavSelect = (item, index) => {
  dialogVisible.value = true
  currentImgIndex.value = index
}
// 删除跳转路径
const handleRemoveSelected = (item, index) => {
  formData.imageList[index].path.type = ''
  formData.imageList[index].path.name = ''
  formData.imageList[index].path.link = ''
}
// 关闭弹窗
const handleDialogClose = () => {
  dialogVisible.value = false
}
// 商品弹窗确定
const handleDialogSubmit = ({ type, value }) => {
  if (type === '1') { // 当前选择的是商品
    formData.imageList[currentImgIndex.value].path.name = value.goodsItem.spuName
    formData.imageList[currentImgIndex.value].path.link = value.goodsItem.spuId
    formData.imageList[currentImgIndex.value].path.type = '1'
  } else if (type === '2') { // 当前选择的是分类
    formData.imageList[currentImgIndex.value].path.name = value.categoryItem.label
    formData.imageList[currentImgIndex.value].path.link = value.categoryItem.data
    formData.imageList[currentImgIndex.value].path.type = '2'
  } else if (type === '4') { // 当前选择的是页面
    formData.imageList[currentImgIndex.value].path.name = value.pageItem.title
    formData.imageList[currentImgIndex.value].path.link = value.pageItem.link
    formData.imageList[currentImgIndex.value].path.type = '4'
  } else if (type === '5') { // 当前选择的是微页面
    formData.imageList[currentImgIndex.value].path.name = value.smallPageItem.name
    formData.imageList[currentImgIndex.value].path.link = value.smallPageItem.renovationId
    formData.imageList[currentImgIndex.value].path.type = '5'
  } else if (type === '6') { // 自定义链接
    formData.imageList[currentImgIndex.value].path.name = value.customLink.url
    formData.imageList[currentImgIndex.value].path.link = value.customLink
    formData.imageList[currentImgIndex.value].path.type = '6'
  }
  dialogVisible.value = false
}
/* 校验 */
const checkData = () => {
  let isPass = true
  let errorMessage = ''
  const str = props.currentComponent.customRemark ? props.currentComponent.customRemark : props.current
  if (!formData.imageList.length) {
    isPass = false
    errorMessage = $t('shopFeature.tabNav.pleaseAddPic')
  }
  if (isPass) {
    myCheckResult(isPass)
  } else {
    // 弹窗提示错误消息
    showCheckForm()
    emit('onErrorMessageTip', {
      customRemark: str,
      rightConfigTitle: $t('shopFeature.imageAd.imageAd'),
      errorMessage
    })
  }
}
/* 控制滑块tooltip隐藏 */
const showTooltip = ref(true)
const changeBoxHeight = (t) => {
  showTooltip.value = t
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
/**
 * 可选
 * 当子组件不符合规则时，是否调用element ui 默认的规则判断
 * 需要默认结构为form
 * */
const formDataRef = ref(null)
const showCheckForm = (cb) => {
  nextTick(() => {
    if (formDataRef.value) {
      formDataRef.value.validate((valid) => {
        if (valid) {
          if (cb) cb(valid)
        } else {
          if (cb) cb(valid)
        }
      })
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
