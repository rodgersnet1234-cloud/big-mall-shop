<template>
  <div class="picture_by_container">
    <div class="config-items">
      <div class="title">
        {{ $t(`pcdecorate.pictureBy.picsize`) }}
      </div>
      <div class="right-select">
        <el-radio-group v-model="pciConfigForm.size">
          <el-radio :label="1920">
            {{ $t(`pcdecorate.univerHot.one`) }}
          </el-radio>
          <el-radio :label="1200">
            {{ $t(`pcdecorate.univerHot.two`) }}
          </el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="tips">
      {{ $t(`pcdecorate.pictureBy.picTips`) }}
    </div>
    <div class="config-items">
      <div class="title">
        {{ $t(`pcdecorate.pictureBy.highly`) }}
      </div>
      <div class="right-select">
        <el-slider
          v-model="pciConfigForm.height"
          :min="50"
          :max="1000"
          show-input
          @change="picchange"
        />
      </div>
    </div>
    <div class="config-items">
      <div class="title">
        {{ $t(`pcdecorate.pictureBy.pagenation`) }}
      </div>
      <div class="right-select">
        <el-radio-group v-model="pciConfigForm.pageation">
          <el-radio :label="0">
            {{ $t(`pcdecorate.pictureBy.show`) }}
          </el-radio>
          <el-radio :label="1">
            {{ $t(`pcdecorate.pictureBy.hide`) }}
          </el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="picture-styles">
      <div
        v-for="(item, index) in pciConfigForm.picList"
        :key="index"
        class="picture-items"
      >
        <el-image
          :src="checkFileUrl(item.img)"
          fit="fill"
        >
          <template #error>
            <div class="image-slot">
              <img
                src="@/assets/pc-micro-page/show-default.png"
                alt=""
              >
            </div>
          </template>
        </el-image>
        <div class="picture-text">
          <span
            class="title"
            style="width: 40px"
          >{{ $t(`pcdecorate.pictureBy.link`) }}</span>
          <redirect-nav
            style="width: calc(100% - 45px)"
            :selected-link="item.path.name"
            :placeholder="$t(`pcdecorate.placeholder.link`)"
            @handle-nav-select="handleNavSelect(index)"
            @handle-remove-selected="handleRemoveSelected(index)"
          />
        </div>
        <el-icon
          class="el-icon-delete"
          @click="handleRemovePic(index)"
        >
          <Delete />
        </el-icon>
      </div>
      <div
        class="b-btns"
        @click="handleAddImage"
      >
        <span>+</span>
        <span>{{ $t(`pcdecorate.pictureBy.addImg`) }}</span>
      </div>
    </div>
    <!-- 商品 | 页面 | 跳转链接弹窗 start -->
    <decorate-dialog-select
      :dialog-visible="dialogVisible"
      :current-select-type="[1, 2, 4, 5, 6]"
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
import redirectNav from '../../../../../common-component/redirect-nav/index.vue' // 导航链接跳转组件
import ElxImgbox from '@/components/img-box/index.vue' // 添加图片组件弹窗
import decorateDialogSelect from '@/components/decorate-dialog-select/index.vue' // 选择商品

const props = defineProps({
  currentRef: { // 当前操作的ref
    type: String,
    default: () => ''
  },
  currentItem: { // 当前组件的回显信息,新增的时候
    type: Object,
    default: () => {}
  },
  editItem: { // 编辑时候组件的回显信息
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits(['handleUpdateMessage'])

const pciConfigForm = ref({
  size: 1920,
  height: 500,
  pageation: 0,
  picList: []
})
let updateIndex = '' // 修改图片的下标
const dialogVisible = ref(false) // 弹窗打开关闭
let currentIndex = '' // 当前操作的index
watch(() => pciConfigForm.value, (newVal) => { // 监听图片配置信息改变
  const obj = {
    type: 'picture_by',
    ref: props.currentRef,
    config: newVal
  }
  emit('handleUpdateMessage', obj)
}, { deep: true })
watch(() => props.currentItem, (newVal) => { // 监听当前是否已经配置
  if (newVal.currentConfigType === 'picture_by') {
    if (JSON.stringify(newVal.config) !== '{}') { // 如果当前不能为空
      pciConfigForm.value = {
        ...newVal.config
      }
    } else {
      pciConfigForm.value = {
        size: 1920,
        height: 500,
        pageation: 0,
        picList: []
      }
    }
  }
})

// 选择链接
const handleNavSelect = (index) => {
  currentIndex = index
  dialogVisible.value = true
}
// 删除链接
const handleRemoveSelected = (index) => {
  pciConfigForm.value.picList.forEach((ele, i) => {
    if (index === i) {
      ele.path.name = ''
      ele.path.link = ''
    }
  })
}
// 添加图片
const elxImgboxRef = ref(null)
const handleAddImage = () => {
  /**
         * init(args, args2):
         *  第一个参数表示单选还是多选：1：单选，2：多选
         *  第二个参数：表示最多选择的数量
         */
  updateIndex = ''
  elxImgboxRef.value.init(2, 10 - pciConfigForm.value.picList.length)
}
// 选择图片之后进行回调
const refreshPic = (imagePath) => {
  let updateStatus = false
  pciConfigForm.value.picList.forEach((item, index) => {
    if (updateIndex === index) {
      item.img = checkFileUrl(imagePath)
      updateStatus = true
    } else {
      updateStatus = false
    }
  })
  let arr = []
  if (imagePath.indexOf(',')) {
    arr = imagePath.split(',')
  }
  if (arr.length > 0) { // 说明是多选
    arr.forEach(item => {
      if (!updateStatus) { // 如果不是更改图片就让他增加
        pciConfigForm.value.picList.push({
          img: checkFileUrl(item),
          path: {
            name: '',
            link: '',
            type: ''
          }
        })
      }
    })
  } else { // 就是单选
    if (!updateStatus) { // 如果不是更改图片就让他增加
      pciConfigForm.value.picList.push({
        img: checkFileUrl(imagePath),
        path: {
          name: '',
          link: '',
          type: ''
        }
      })
    }
  }
}
// 移除图片
const handleRemovePic = (index) => {
  pciConfigForm.value.picList.splice(index, 1)
}
// 商品弹窗关闭
const handleDialogClose = () => {
  dialogVisible.value = false
}
// 商品弹窗确定
const handleDialogSubmit = ({ type, value }) => {
  if (type === '1') { // 当前选择的是商品
    pciConfigForm.value.picList.forEach((ele, index) => {
      if (currentIndex === index) {
        ele.path = {
          name: value.goodsItem.spuName, // 商品名称
          link: value.goodsItem.spuId, // 商品id
          type: '1'
        }
      }
    })
  } else if (type === '2') { // 当前选择的是分类
    pciConfigForm.value.picList.forEach((ele, index) => {
      if (currentIndex === index) {
        ele.path = {
          name: value.categoryItem.label, // 分类名字
          link: value.categoryItem.data, // 分类的数据)
          type: '2'
        }
      }
    })
  } else if (type === '3') { // 当前选择的是店铺
    pciConfigForm.value.picList.forEach((ele, index) => {
      if (currentIndex === index) {
        ele.path = {
          name: value.storeItem.shopName, // 店铺名
          link: value.storeItem.shopId, // 店铺id
          type: '3'
        }
      }
    })
  } else if (type === '4') { // 当前选择的是页面
    pciConfigForm.value.picList.forEach((ele, index) => {
      if (currentIndex === index) {
        ele.path = {
          name: value.pageItem.title,
          link: value.pageItem.link,
          type: '4'
        }
      }
    })
  } else if (type === '5') { // 当前选择的是页面
    pciConfigForm.value.picList.forEach((ele, index) => {
      if (currentIndex === index) {
        ele.path = {
          name: value.smallPageItem.name, // 微页面名称
          link: [value.smallPageItem.renovationId, value.smallPageItem.shopId],
          type: '5'
        }
      }
    })
  } else if (type === '6') { // 自定义链接
    pciConfigForm.value.picList.forEach((ele, index) => {
      if (currentIndex === index) {
        ele.path = {
          name: value.customLink.url, // 微页面名称
          link: value.customLink,
          type: '6'
        }
      }
    })
  }
  dialogVisible.value = false
}
// 验证信息
const handleValidate = () => {
  let status = false
  let message = ''
  if (JSON.stringify(props.editItem) === '{}') {
    status = false
    message = $t('pcdecorate.pictureBy.warning1')
  } else if (props.editItem.height === 0) {
    status = false
    message = $t('pcdecorate.pictureBy.warning2')
  } else if (props.editItem.picList.length === 0) {
    status = false
    message = $t('pcdecorate.pictureBy.warning3')
  } else if (props.editItem.picList.length > 0) {
    status = props.editItem.picList.every(item => {
      return item.img !== '' && item.path.link !== ''
    })
    message = $t('pcdecorate.pictureBy.warning4')
  } else {
    status = true
  }
  return {
    status,
    message
  }
}
// 高度防止输入小数
const picchange = (val) => {
  return (pciConfigForm.value.height = Math.floor(val))
}
defineExpose({ handleValidate })
</script>
<style lang="scss" scoped>
@use './right-tool.scss';
</style>
