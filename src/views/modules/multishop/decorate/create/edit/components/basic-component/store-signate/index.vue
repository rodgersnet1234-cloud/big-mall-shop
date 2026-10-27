<template>
  <div class="store-signate-page-container">
    <div
      v-if="config.storeStyle === 0"
      class="store-top-container"
      :style="config.bgUrl !== '' ? setBackground : 'baclground: #fff'"
    >
      <div class="store-top style1">
        <ImgShow
          :src="shopInfo.shopLogo"
          :class-list="['logo-img']"
        />
        <span class="store-name">{{ shopInfo.shopName }}</span>
        <span class="custom-store">{{ getStoreType(shopInfo.isPreferred) }}</span>
        <p>
          <img
            src="@/assets/pc-micro-page/connect_customer.png"
            alt=""
          >
          <span>联系客服</span>
        </p>
        <p>
          <img
            src="@/assets/pc-micro-page/collection_store.png"
            alt=""
          >
          <span>收藏店铺</span>
        </p>
        <p>
          <img
            src="@/assets/images/qualifications.png"
            style="height: 16px; width: 16px;"
            alt=""
          >
          <span>资质证照</span>
        </p>
      </div>
    </div>
    <div
      v-if="config.storeStyle === 1"
      class="store-top style2"
    >
      <div class="store-top-content">
        <span class="custom-store">{{ getStoreType(shopInfo.isPreferred) }}</span>
        <span class="store-name">{{ shopInfo.shopName }}</span>
        <p>
          <img
            src="@/assets/pc-micro-page/connect_customer.png"
            alt=""
          >
          <span>联系客服</span>
        </p>
        <p>
          <img
            src="@/assets/pc-micro-page/collection_store.png"
            alt=""
          >
          <span>收藏店铺</span>
        </p>
        <p>
          <img
            src="@/assets/images/qualifications.png"
            style="height: 16px; width: 16px;"
            alt=""
          >
          <span>资质证照</span>
        </p>
      </div>
      <div
        v-if="config.bgUrl !== ''"
        class="store-top-bottom"
        :style="config.bgUrl !== '' ? setBackground : 'baclground: #fff'"
      />
    </div>
    <div
      v-if="config.showNavs === 0"
      class="store-bottom"
      :style="{background: config.navsBg}"
    >
      <div class="bottom-content">
        <div class="navs-list">
          <ul>
            <li v-show="config.showCategory === 0">
              <span style="margin-right: 3px;">全部分类</span>
              <el-icon><CaretBottom /></el-icon>
            </li>
            <li v-show="config.announcement === 0">
              公告
            </li>
            <template v-if="config.showNavs === 0">
              <template
                v-for="(item, index) in config.navList"
                :key="index"
              >
                <li>{{ item.name }}</li>
              </template>
            </template>
          </ul>
        </div>
        <div
          v-show="config.search === 0"
          class="search-content"
        >
          <img
            src="@/assets/pc-micro-page/search-content.png"
            alt=""
          >
          <div class="search-btn">
            搜索
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import request from '@/utils/request'
const props = defineProps({
  itemComponent: { // 组件的信息
    type: Object,
    default: () => {}
  },
  currentIndex: { // 下标
    type: [Number, String],
    default: 0
  },
  currentRefs: {
    type: String,
    default: () => ''
  }
})

const config = ref({})
const shopInfo = ref({}) // 店铺信息
const setBackground = computed(() => {
  return {
    background: `url(${config.value?.bgUrl})`,
    'background-size': '100% 100%',
    'background-repeat': 'no-repeat'
  }
})
const getStoreType = computed(() => { // 店铺类型
  return (isPreferred) => {
    if (isPreferred === 1) {
      return '优选好店'
    } else if (isPreferred === 0) {
      return '普通店铺'
    } else {
      return ''
    }
  }
})
watch(() => props.itemComponent, (newVal) => {
  if (JSON.stringify(newVal.rightConfigMessage) !== '{}') {
    config.value = { ...newVal.rightConfigMessage }
  } else {
    config.value = {
      storeStyle: 0, // 店铺信息样式类型
      showCategory: 0, // 全部分类是否显示
      showNavs: 0, // 导航栏是否显示
      navsBg: 'rgba(17, 17, 19, 1)', // 导航栏背景
      search: 0, // 搜索
      announcement: 0, // 公告
      navList: [], // 导航栏个数
      bgUrl: '' // 图片背景
    }
  }
}, {
  immediate: true,
  deep: true
})

onMounted(() => {
  getHeader()
})

// 请求头部
const getHeader = () => {
  request({
    url: '/mall4cloud_admin/m/apply_shop/shop_detail',
    method: 'get'
  }).then(res => {
    res.shopLogo = checkFileUrl(res.shopLogo)
    shopInfo.value = res
  })
}

</script>
<style lang="scss" scoped>
@use './index.scss';

</style>
