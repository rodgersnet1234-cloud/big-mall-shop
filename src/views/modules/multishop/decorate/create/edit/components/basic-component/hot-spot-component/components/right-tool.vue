<template>
  <div class="micro-image-ad-box">
    <div class="design-editor-item design-hide-class">
      <div class="design-config-editor">
        <div class="image-ad-edit">
          <div class="config-items">
            <div class="title">
              {{ $t(`pcdecorate.univerHot.picSize`) }}
            </div>
            <div class="right-select">
              <el-radio-group v-model="hotForm.size">
                <el-radio :label="1920">
                  {{ $t(`pcdecorate.univerHot.one`) }}
                </el-radio>
                <el-radio :label="1200">
                  {{ $t(`pcdecorate.univerHot.two`) }}
                </el-radio>
              </el-radio-group>
            </div>
          </div>
          <div
            class="config-items"
            style="margin-bottom: 15px;"
          >
            <div class="title">
              {{ $t(`pcdecorate.univerHot.addImage`) }}
            </div>
            <div class="right-select tips">
              {{ $t(`pcdecorate.univerHot.imageTips`) }}
            </div>
          </div>
          <div class="hot-preivew-container">
            <VueDraggableNext
              :list="hotForm.imgList"
              ghost-class="ghost"
              handle=".ad-handle"
            >
              <div
                v-for="(item, index) in hotForm.imgList"
                :key="index"
                class="ad-image-hot"
              >
                <div
                  class="add-ad-image"
                  @click="showHotAreaPop(index)"
                >
                  {{ $t(`pcdecorate.univerHot.addHot`) }}
                </div>
                <div
                  class="add-ad-image"
                  @click="changeImg(index)"
                >
                  {{ $t(`pcdecorate.univerHot.updateImage`) }}
                </div>
                <div class="ad-image-hot-box">
                  <div
                    v-show="item.activeBoxs && item.activeBoxs.length"
                    class="ad-image-hot-content ad-handle"
                  >
                    <span
                      v-for="(hotItem, hotIndex) in item.activeBoxs"
                      :key="hotIndex"
                      class="ad-hot-box-item"
                      :style="`transform: translate(${hotItem.translateX * hotScale}px,${hotItem.translateY * hotScale}px);width:${hotItem.width * hotScale}px;height:${hotItem.height * hotScale}px;`"
                    >
                      <span class="redirect-title">{{ hotItem.title }}</span>
                      <el-icon
                        class="el-icon-close close-icon "
                        @click="item.activeBoxs.splice(hotIndex, 1)"
                      >
                        <Close />
                      </el-icon>
                    </span>
                  </div>
                  <ImgShow
                    :src="item.url"
                    :class-list="['ad-hanlde']"
                  />
                  <div
                    class="icon-error"
                    @click="hotForm.imgList.splice(index, 1)"
                  >
                    x
                  </div>
                </div>
              </div>
            </VueDraggableNext>
          </div>
          <div
            v-if="hotForm.imgList.length < 10"
            class="config-items"
          >
            <div
              class="b-btns"
              @click="handleAddImage"
            >
              <span>+</span>
              <span>{{ $t(`pcdecorate.univerHot.addImage`) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加热区弹窗 start -->
    <el-dialog
      v-model="dialogHot"
      class="up-dialog"
      :close-on-click-modal="false"
      top="5vh"
      :title="$t('shopFeature.imageAd.addHotArea')"
      append-to-body
      width="550px"
    >
      <div class="ad-hot-box">
        <div v-if="dialogHot&&hotForm.imgList.length">
          <ImgShow
            :src="hotForm.imgList[currentEditIndex].url"
            :class-list="['box-img']"
          />
          <div
            v-for="(item,index) in cacheImageActiveBox"
            :key="index"
            v-drag="{cacheImageActiveBox,index}"
            class="ad-drag"
          >
            <div
              class="title"
              @click="handleSelectRedirect(index)"
            >
              {{ item.title }}
            </div>
            <el-icon
              class="el-icon-close "
              @click="cacheImageActiveBox.splice(index, 1)"
            >
              <Close />
            </el-icon>
          </div>
        </div>
      </div>
      <template #footer>
        <div style="text-align: right;margin-top: 20px;">
          <el-button
            type="primary"
            @click="addHotArea"
          >
            {{ $t('shopFeature.imageAd.addHotArea') }}
          </el-button>
          <el-button
            @click="saveHotBox"
          >
            {{ $t('shopFeature.imageAd.save') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 添加热区弹窗 end -->
    <!-- 弹窗, 新增图片 start -->
    <elx-imgbox
      ref="elxImgboxRef"
      :max-size="10"
      :img-size-limit="false"
      @refresh-pic="refreshPic"
    />
    <!-- 弹窗，新增图片 end -->
    <!-- 商品 | 页面 | 跳转链接弹窗 start -->
    <decorate-dialog-select
      :dialog-visible="dialogVisible"
      :current-select-type="[1, 2, 4, 5, 6]"
      :custom-link-arr="customLinkArr"
      @handle-close="handleDialogClose"
      @handle-dialog-submit="handleDialogSubmit"
    />
    <!-- 商品 | 页面 | 跳转链接弹窗 end -->
  </div>
</template>
<script setup>
import { VueDraggableNext } from 'vue-draggable-next'
import ElxImgbox from '@/components/img-box/index.vue'
import decorateDialogSelect from '@/components/decorate-dialog-select/index.vue' // 选择商品
import { ElMessage } from 'element-plus'

const props = defineProps({
  currentRef: { // 当前操作的ref
    type: String,
    default: () => ''
  },
  currentItem: { // 点击当前组件的回显配置信息
    type: Object,
    default: () => {}
  },
  editItem: { // 当前组件的配置信息
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits(['handleUpdateMessage'])

const dialogVisible = ref(false) // 弹窗是否显示
const hotScale = ref(350 / 500) // 热区比例
const dialogHot = ref(false) // 是否显示热区
/** 选择图片的弹窗 */
let isChangeImg = false // 是否为更换图片模式
const currentEditIndex = ref(0) // 当前编辑的图片
let currentHotEditIndex = 0 // 当前编辑的热区
const hotForm = ref({
  size: 1920, // 图片尺寸大小
  imgList: [] // 图片
})
const cacheImageActiveBox = ref([]) // 缓存当前box list
const boxItem = { // 盒子模板
  link: '',
  type: '',
  title: '跳转链接',
  left: 0,
  top: 0,
  translateX: 0,
  translateY: 0,
  width: 102,
  height: 102
}
const customLinkArr = ref({}) // 自定义链接回显
watch(() => hotForm.value, (newVal) => {
  const obj = {
    type: 'universal_hotspot',
    ref: props.currentRef,
    config: newVal
  }
  emit('handleUpdateMessage', obj)
}, {
  deep: true
})
watch(() => props.currentItem, (newVal) => { // 监听当前是否已经配置
  if (newVal.currentConfigType === 'universal_hotspot') {
    if (JSON.stringify(newVal.config) != '{}') {
      hotForm.value = {
        ...newVal.config
      }
    } else {
      hotForm.value = {
        size: 1920, // 图片尺寸大小
        imgList: [] // 图片
      }
    }
  }
})

// 打开商品弹窗
const handleSelectRedirect = (index) => {
  currentHotEditIndex = index
  dialogVisible.value = true
  customLinkArr.value = cacheImageActiveBox.value[index]
}
// 关闭商品弹窗
const handleDialogClose = () => {
  dialogVisible.value = false
}
// 商品弹窗确定
const handleDialogSubmit = ({ type, value }) => {
  if (type === '1') { // 当前选择的是商品
    cacheImageActiveBox.value[currentHotEditIndex].title = value.goodsItem.spuName // 商品名称
    cacheImageActiveBox.value[currentHotEditIndex].link = value.goodsItem.spuId // 商品id
    cacheImageActiveBox.value[currentHotEditIndex].type = '1' // 当前选择的类型
  } else if (type === '2') { // 当前选择的是分类
    cacheImageActiveBox.value[currentHotEditIndex].title = value.categoryItem.label // 分类标题
    cacheImageActiveBox.value[currentHotEditIndex].link = value.categoryItem.data // 分类数据
    cacheImageActiveBox.value[currentHotEditIndex].type = '2' // 当前选择的类型
  } else if (type === '3') { // 当前选择的是店铺
    cacheImageActiveBox.value[currentHotEditIndex].title = value.storeItem.shopName // 店铺名称
    cacheImageActiveBox.value[currentHotEditIndex].link = value.storeItem.shopId // 店铺id
    cacheImageActiveBox.value[currentHotEditIndex].type = '3' // 当前选择的类型
  } else if (type === '4') { // 当前选择的是页面
    cacheImageActiveBox.value[currentHotEditIndex].title = value.pageItem.title // 页面名称
    cacheImageActiveBox.value[currentHotEditIndex].link = value.pageItem.link // 页面路径
    cacheImageActiveBox.value[currentHotEditIndex].type = '4' // 当前选择的类型
  } else if (type === '5') { // 当前选择的是微页面
    cacheImageActiveBox.value[currentHotEditIndex].title = value.smallPageItem.name // 微页面名称
    cacheImageActiveBox.value[currentHotEditIndex].link = [value.smallPageItem.renovationId, value.smallPageItem.shopId] // 微页面装修id
    cacheImageActiveBox.value[currentHotEditIndex].type = '5' // 当前选择的类型
  } else if (type === '6') { // 当前选择的是自定义链接
    cacheImageActiveBox.value[currentHotEditIndex].title = value.customLink.url // 自定义链接名称
    cacheImageActiveBox.value[currentHotEditIndex].link = value.customLink // 自定义链接路径
    cacheImageActiveBox.value[currentHotEditIndex].type = '6' // 当前选择的类型
  }
  dialogVisible.value = false
}
// 添加图片
const elxImgboxRef = ref(null)
const handleAddImage = () => {
  elxImgboxRef.value.init(2, 10 - hotForm.value.imgList.length)
  isChangeImg = false
}
/**
     * 选择图片回调
     * @param {String} imagePath 无前缀的图片地址字符串(多图时用,分割)
     */
const refreshPic = (imagePath) => {
  if (isChangeImg) { // 更换图片模式
    hotForm.value.imgList[currentEditIndex.value].url = checkFileUrl(imagePath)
    return
  }
  let arr = []
  if (imagePath.indexOf(',')) {
    arr = imagePath.split(',')
  }
  if (arr.length > 0) { // 说明是多选
    arr.forEach(item => {
      hotForm.value.imgList.push({
        url: checkFileUrl(item),
        title: '',
        link: '',
        type: '',
        imgTit: '',
        activeBoxs: []
      })
    })
  } else { // 就是单选
    hotForm.value.imgList.push({
      url: checkFileUrl(imagePath),
      title: '',
      link: '',
      type: '',
      imgTit: '',
      activeBoxs: []
    })
  }
}
/** 显示添加热区 */
const showHotAreaPop = (index) => {
  dialogHot.value = true
  currentEditIndex.value = index
  cacheImageActiveBox.value = JSON.parse(JSON.stringify(hotForm.value.imgList[currentEditIndex.value].activeBoxs))
}
/** 点击添加热区 */
const addHotArea = () => {
  cacheImageActiveBox.value.push(JSON.parse(JSON.stringify(boxItem)))
}
/** 保存热区 */
const saveHotBox = () => {
  const status = cacheImageActiveBox.value.some(item => item.link === '')
  if (status) {
    return ElMessage.warning($t('pcdecorate.univerHot.warning3'))
  }
  hotForm.value.imgList[currentEditIndex.value].activeBoxs = cacheImageActiveBox.value
  dialogHot.value = false
}
/** 更换图片 */
const changeImg = (index) => {
  isChangeImg = true // 开启当前是否更换图片
  currentEditIndex.value = index
  elxImgboxRef.value?.init(2, 1)
}
// 验证
const handleValidate = () => {
  let status = true
  let message = ''
  if (JSON.stringify(props.editItem) === '{}') {
    status = false
    message = $t('pcdecorate.univerHot.warning1')
  } else if (props.editItem.imgList.length === 0) {
    status = false
    message = $t('pcdecorate.univerHot.warning2')
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
