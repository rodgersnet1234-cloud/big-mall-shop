<template>
  <!-- 当前页面是招牌的配置信息 -->
  <div class="store-signate-Config">
    <div class="config-items">
      <div class="title">
        店铺信息
      </div>
      <div class="right-select">
        <el-radio-group
          v-model="configForm.storeStyle"
          @change="handleStoreStyle"
        >
          <el-radio :label="0">
            样式一
          </el-radio>
          <el-radio :label="1">
            样式二
          </el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="config-items">
      <div class="title">
        {{ $t(`pcdecorate.storeSignate.navsBar`) }}
      </div>
      <div class="right-select">
        <el-radio-group
          v-model="configForm.showNavs"
          class="special-radio"
        >
          <el-radio :label="0">
            {{ $t(`pcdecorate.storeSignate.show`) }}
          </el-radio>
          <el-radio :label="1">
            {{ $t(`pcdecorate.storeSignate.hide`) }}
          </el-radio>
        </el-radio-group>
      </div>
    </div>
    <div
      v-show="configForm.showNavs === 0"
      class="config-items"
    >
      <div class="title">
        {{ $t(`pcdecorate.storeSignate.goodsCategory`) }}
      </div>
      <div class="right-select">
        <el-radio-group
          v-model="configForm.showCategory"
          class="special-radio"
        >
          <el-radio :label="0">
            {{ $t(`pcdecorate.storeSignate.show`) }}
          </el-radio>
          <el-radio :label="1">
            {{ $t(`pcdecorate.storeSignate.hide`) }}
          </el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="config-items">
      <div
        class="title"
        style="padding-top: 9px"
      >
        导航背景
      </div>
      <div
        class="right-select"
        style="display: flex;align-items: center"
      >
        <el-color-picker
          v-model="configForm.navsBg"
          color-format="rgba"
          :show-alpha="true"
          style="height: 32px"
        />
        <span
          style="margin: 0 15px;color: #155BD4;white-space: nowrap;cursor: pointer;"
          @click="handleBgReset"
        >{{ $t('pcdecorate.axinterval.reset') }}</span>
        <span style="white-space: nowrap">{{ configForm.navsBg }}</span>
      </div>
    </div>
    <div
      v-show="configForm.showNavs === 0"
      class="config-items"
      style="margin-bottom: 15px"
    >
      <div
        class="add-navs"
        @click="addNav"
      >
        <span style="font-size: 17px;margin-right: 4px">+</span>
        <span>{{ $t(`pcdecorate.storeSignate.addNavs`) }}</span>
      </div>
      <div class="tips">
        {{ $t(`pcdecorate.storeSignate.navsBarTip`) }}
      </div>
    </div>
    <div
      v-show="configForm.showNavs === 0"
      class="config-items nav-solid"
    >
      <div class="navs-config">
        <div class="title">
          搜索
        </div>
        <div class="right-select">
          <el-radio-group v-model="configForm.search">
            <el-radio :label="0">
              {{ $t(`pcdecorate.storeSignate.show`) }}
            </el-radio>
            <el-radio :label="1">
              {{ $t(`pcdecorate.storeSignate.hide`) }}
            </el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="navs-config">
        <div class="title">
          公告
        </div>
        <div class="right-select">
          <el-radio-group v-model="configForm.announcement">
            <el-radio :label="0">
              {{ $t(`pcdecorate.storeSignate.show`) }}
            </el-radio>
            <el-radio :label="1">
              {{ $t(`pcdecorate.storeSignate.hide`) }}
            </el-radio>
          </el-radio-group>
        </div>
      </div>
      <template v-if="configForm.navList && configForm.navList.length > 0">
        <div
          v-for="(item, index) in configForm.navList"
          :key="index"
          class="navs-items"
        >
          <el-row
            class="navs-hovers"
            style="margin: 10px 5px;position: relative;"
          >
            <el-col
              :span="11"
              style="display: flex;font-size: 12px;align-items: center;"
            >
              <span style="width: 35px;margin-right:3%;white-space: nowrap">{{ $t(`pcdecorate.storeSignate.navs`) }}{{ index + 1 }}</span>
              <el-input
                v-model.trim="item.name"
                maxlength="6"
                placeholder="输入导航名称"
                class="config-input"
                style="width: 100px;"
              />
            </el-col>
            <el-col
              :span="11"
              style="display: flex;font-size: 12px;align-items: center;"
            >
              <span style="width: 55px;margin-right:3%;white-space: nowrap">{{ $t(`pcdecorate.storeSignate.path`) }}</span>
              <direction-navs
                style="overflow: hidden"
                :placeholder="$t('pcdecorate.placeholder.link')"
                :selected-link="item.path.name"
                @handle-nav-select="handleNavSelect(index)"
                @handle-remove-selected="handleRemoveSelected( index)"
              />
            </el-col>

            <el-icon
              class="nav-close"
              @click="handleNavsDel(index)"
            >
              <Close />
            </el-icon>
          </el-row>
        </div>
      </template>
      <template v-else>
        <div class="special-water">
          {{ $t(`pcdecorate.storeSignate.navBarsArea`) }}
        </div>
      </template>
    </div>
    <div
      v-show="configForm.storeStyle !== 0"
      class="config-items config-bg"
    >
      <div class="b-title">
        {{ $t(`pcdecorate.storeSignate.signboardBack`) }}
      </div>
      <div class="b-tips">
        {{ $t(`pcdecorate.storeSignate.signTips`) }}
      </div>
      <add-bg-component
        :img-url="configForm.bgUrl"
        @handle-add-image="handleAddImage"
        @handle-remmove-image="handleRemmoveImage"
      />
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
import directionNavs from '../../../../../common-component/redirect-nav/index.vue' // 导航链接
import addBgComponent from '../../../../../common-component/add-bg-component/index.vue' // 添加背景图
import ElxImgbox from '@/components/img-box/index.vue' // 添加图片组件弹窗
import decorateDialogSelect from '@/components/decorate-dialog-select/index.vue' // 选择商品
import { ElMessage } from 'element-plus'

const props = defineProps({
  currentRef: { // 当前组件显示的ref
    type: String,
    default: () => ''
  },
  currentItem: { // 当前组件信息
    type: Object,
    default: () => {}
  },
  editItem: { // 编辑时候验证消息
    type: Object,
    default: () => {}
  }
})

const emit = defineEmits(['handleUpdateMessage'])

const configForm = ref({
  storeStyle: 0, // 店铺信息样式类型
  showCategory: 0, // 全部分类是否显示
  showNavs: 0, // 导航栏是否显示
  navsBg: 'rgba(0, 0, 0, 1)', // 导航栏背景
  search: 0, // 搜索
  announcement: 0, // 公告
  navList: [], // 导航栏个数
  bgUrl: '' // 图片背景
})
const dialogVisible = ref(false) // 弹窗是否打开
let currentIndex = '' // 当前操作的index
watch(() => configForm.value, (newVal) => {
  const obj = {
    tpye: 'shop_signs',
    ref: props.currentRef,
    config: newVal
  }
  emit('handleUpdateMessage', obj)
}, {
  deep: true
})
watch(() => props.currentItem, (newVal) => { // 对当前组件绑定的信息进行回显
  if (newVal.currentConfigType === 'shop_signs') { // 商家招牌
    if (JSON.stringify(newVal.config) !== '{}') { // 如果当前配置信息不为空，则表示已经配置过
      configForm.value = { ...newVal.config }
    } else {
      configForm.value = {
        storeStyle: 0, // 店铺信息样式类型
        showCategory: 0, // 全部分类是否显示
        showNavs: 0, // 导航栏是否显示
        navsBg: 'rgba(0, 0, 0, 1)', // 导航栏背景
        search: 0, // 搜索
        announcement: 0, // 公告
        navList: [], // 导航栏个数
        bgUrl: '' // 图片背景
      }
    }
  }
})

// 添加导航
const addNav = () => {
  if (configForm.value.navList.length >= 7) {
    return ElMessage.warning($t('pcdecorate.storeSignate.warning1'))
  }
  configForm.value.navList.push({
    name: '', // 导航名
    path: {
      name: '',
      link: '',
      type: ''
    } // 导航链接
  })
}
// 删除添加的导航栏
const handleNavsDel = (index) => {
  configForm.value.navList.splice(index, 1)
}
// 选择跳转路径打开弹窗
const handleNavSelect = (index) => {
  currentIndex = index
  dialogVisible.value = true
}
// 关闭商品弹窗
const handleDialogClose = () => {
  dialogVisible.value = false
}
// 弹窗确定
const handleDialogSubmit = ({ type, value }) => {
  let obj = {
    name: '',
    link: '',
    type: ''
  }
  switch (Number(type)) {
    case 1: // 商品
      obj = {
        name: value.goodsItem.spuName, // 商品名称
        link: value.goodsItem.spuId, // 商品id
        type: '1'
      }
      break
    case 2: // 分类
      obj = {
        name: value.categoryItem.label, // 分类名字[三级分类的最后的名字]
        link: value.categoryItem.data, // 分类的数据(数组)
        type: '2'
      }
      break
    case 3: // 店铺
      obj = {
        name: value.storeItem.shopName, // 店铺名
        link: value.storeItem.shopId, // 店铺id
        type: '3'
      }
      break
    case 4: // 页面
      obj = {
        name: value.pageItem.title,
        link: value.pageItem.link,
        type: '4'
      }
      break
    case 5: // 微页面
      obj = {
        name: value.smallPageItem.name, // 微页面名
        link: [value.smallPageItem.renovationId, value.smallPageItem.shopId],
        type: '5'
      }
      break
    case 6: // 自定义链接
      obj = {
        name: value.customLink.url,
        link: value.customLink,
        type: '6'
      }
      break
    default:
      break
  }
  configForm.value.navList.forEach((ele, index) => {
    if (currentIndex === index) {
      ele.path = obj
    }
  })
  dialogVisible.value = false
}
// 删除跳转路径
const handleRemoveSelected = (index) => {
  configForm.value.navList.forEach((ele, i) => {
    if (index === i) {
      ele.path.name = ''
      ele.path.link = ''
      ele.path.type = ''
    }
  })
}
// 添加招牌背景图
const elxImgboxRef = ref(null)
const handleAddImage = () => {
  elxImgboxRef.value?.init(2, 1)
}
// 选择图片之后的回调
const refreshPic = (imagePath) => {
  configForm.value.bgUrl = checkFileUrl(imagePath)
}
// 删除招牌背景图
const handleRemmoveImage = () => {
  configForm.value.bgUrl = ''
}
// 导航背景重置
const handleBgReset = () => {
  configForm.value.navsBg = 'rgba(0, 0, 0, 1)'
}
// 店铺样式触发
const handleStoreStyle = () => {
  if (configForm.value.storeStyle === 0) {
    configForm.value.bgUrl = ''
  }
}
// 验证信息
const handleValidate = () => {
  let status = true
  let message = ''
  if (JSON.stringify(props.editItem) === ' {}') {
    status = false
    message = '商家招牌配置信息不能为空'
  } else if (props.editItem.showNavs === 0) {
    const currentStatus = props.editItem.navList.every(item => {
      return item.name !== '' && item.path.name !== '' && item.path.link !== ''
    })
    if (currentStatus) {
      status = true
    } else {
      status = false
      message = $t('pcdecorate.storeSignate.warning2')
    }
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
