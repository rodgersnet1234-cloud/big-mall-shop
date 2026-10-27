<template>
  <div class="component-page-modal-content">
    <div class="page-contents">
      <div
        v-for="(item, index) in currentPageList"
        :key="index"
        :class="{'page-items': true, 'active': currentIndex === index}"
        @click="handleSelectPage(item, index)"
      >
        <img
          :src="item.img"
          alt=""
        >
        <span>{{ item.title }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import pcModalIndex from '@/assets/pc-micro-page/pc_modal_index.png'
import pcModalCart from '@/assets/pc-micro-page/pc_modal_cart.png'
import pcModalOrder from '@/assets/pc-micro-page/pc_modal_order.png'
import pcModalProfile from '@/assets/pc-micro-page/pc_modal_profile.png'
import pcModalCollection from '@/assets/pc-micro-page/pc_modal_collection.png'
import pcModalNew from '@/assets/pc-micro-page/pc_modal_new.png'
import pcModalPreferential from '@/assets/pc-micro-page/pc_modal_preferential.png'
import pcModalBulk from '@/assets/pc-micro-page/pc_modal_bulk.png'
import pcModalSkill from '@/assets/pc-micro-page/pc_modal_skill.png'
import pcModalSecurities from '@/assets/pc-micro-page/pc_modal_securities.png'
import pcModalIntegral from '@/assets/pc-micro-page/pc_modal_integral.png'
import pcModalMembers from '@/assets/pc-micro-page/pc_modal_members.png'
import pcModalDistribution from '@/assets/pc-micro-page/pc_modal_distribution.png'
import pcModalLive from '@/assets/pc-micro-page/pc_modal_live.png'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['handleGoodsSelect'])
const props = defineProps({
  activeName: { // 动态切换tab
    type: String,
    default: () => ''
  },
  deviceType: { // 弹窗类型 pc端： pc , 移动:mobile
    type: String,
    default: () => 'pc'
  },
  customLinkArr: { // 自定义链接回显数据
    type: Object,
    default: () => {}
  }
})

const pageList = [
  {
    img: pcModalIndex,
    title: $t('pcdecorate.commonModal.pageComponent.index'),
    link: '/shop-index?sid='
  },
  {
    img: pcModalCart,
    title: $t('pcdecorate.commonModal.pageComponent.cart'),
    link: '/cart'
  },
  {
    img: pcModalOrder,
    title: $t('pcdecorate.commonModal.pageComponent.order'),
    link: '/user-center/uc-order'
  },
  {
    img: pcModalProfile,
    title: $t('pcdecorate.commonModal.pageComponent.profile'),
    link: '/user-center'
  },
  {
    img: pcModalCollection,
    title: $t('pcdecorate.commonModal.pageComponent.collection'),
    link: '/user-center/uc-collection'
  },
  {
    img: pcModalNew,
    title: $t('pcdecorate.commonModal.pageComponent.recommand'),
    link: '/list?st=1'
  },
  {
    img: pcModalPreferential,
    title: $t('pcdecorate.commonModal.pageComponent.limitTime'),
    link: '/special-discount'
  },
  {
    img: pcModalBulk,
    title: $t('pcdecorate.commonModal.pageComponent.discount'),
    link: '/group-buy'
  },
  {
    img: pcModalSkill,
    title: $t('pcdecorate.commonModal.pageComponent.skill'),
    link: '/flash-sale'
  },
  {
    img: pcModalSecurities,
    title: $t('pcdecorate.commonModal.pageComponent.coupon'),
    link: '/coupons'
  },
  {
    img: pcModalIntegral,
    title: $t('pcdecorate.commonModal.pageComponent.IntegralMall'),
    link: '/member-center/integral-mall'
  },
  {
    img: pcModalMembers,
    title: $t('pcdecorate.commonModal.pageComponent.memberCenter'),
    link: '/member-center/member-center'
  }
]
const currentIndex = ref('') // 当前点击选中的哪个
const mobileList = [ // 移动端页面内容
  {
    img: pcModalIndex,
    title: $t('pcdecorate.commonModal.pageComponent.index'),
    link: '/package-shop/pages/feature-index/feature-index'
  },
  {
    img: pcModalCart,
    title: $t('pcdecorate.commonModal.pageComponent.cart'),
    link: '/pages/cart/cart'
  },
  {
    img: pcModalOrder,
    title: $t('pcdecorate.commonModal.pageComponent.order'),
    link: '/package-user/pages/order/order?orderStatus=0'
  },
  {
    img: pcModalProfile,
    title: $t('pcdecorate.commonModal.pageComponent.profile'),
    link: '/pages/my/my'
  },
  {
    img: pcModalCollection,
    title: $t('pcdecorate.commonModal.pageComponent.collection'),
    link: '/package-activities/pages/my-collection/my-collection'
  },
  {
    img: pcModalNew,
    title: $t('pcdecorate.commonModal.pageComponent.recommand'),
    link: '/package-activities/pages/new-prods/new-prods'
  },
  {
    img: pcModalPreferential,
    title: $t('pcdecorate.commonModal.pageComponent.limitTime'),
    link: '/package-activities/pages/discount-list/discount-list'
  },
  {
    img: pcModalBulk,
    title: $t('pcdecorate.commonModal.pageComponent.discount'),
    link: '/package-activities/pages/group-prods/group-prods'
  },
  {
    img: pcModalSkill,
    title: $t('pcdecorate.commonModal.pageComponent.skill'),
    link: '/package-activities/pages/seckill-prods/seckill-prods'
  },
  {
    img: pcModalSecurities,
    title: $t('pcdecorate.commonModal.pageComponent.coupon'),
    link: '/package-activities/pages/coupon-center/coupon-center'
  },
  {
    img: pcModalIntegral,
    title: $t('pcdecorate.commonModal.pageComponent.IntegralMall'),
    link: '/package-activities/pages/integral-mall/integral-mall'
  },
  {
    img: pcModalMembers,
    title: $t('pcdecorate.commonModal.pageComponent.memberCenter'),
    link: '/package-activities/pages/member-center-general/member-center-general'
  },
  {
    img: pcModalDistribution,
    title: '分销中心',
    link: '/package-activities/pages/distribution-center/distribution-center'
  },
  {
    img: pcModalLive,
    title: '直播中心',
    link: '/pages/live-broadcast/live-broadcast'
  }
]
const currentPageList = ref([]) // 当前的页面

// 选中哪个页面
const handleSelectPage = (item, index) => {
  if (item.link === '/package-activities/pages/distribution-center/distribution-center' && !distributionSwitch.value) {
    ElMessage({
      message: '分销未开启',
      type: 'error',
      duration: 1500
    })
    return
  }
  currentIndex.value = index
  emit('handleGoodsSelect', { type: 'pageItem', value: item })
}
// 重置组件的信息
const resetComponent = () => {
  currentIndex.value = ''
}
// 设置页面内容
const setPageContent = () => {
  if (props.deviceType === 'pc') { // 如果是pc端选择进来
    currentPageList.value = pageList
  } else if (props.deviceType === 'mobile') { // 否则就是移动端选择进来
    currentPageList.value = mobileList
  }
  // 回显
  if (props.customLinkArr && props.customLinkArr.type !== '' && props.customLinkArr.type === '4') { // 如果在操作热区
    currentPageList.value.forEach((item, index) => {
      if (item.link === props.customLinkArr.link) {
        currentIndex.value = index
        emit('handleGoodsSelect', { type: 'pageItem', value: item })
      }
    })
  }
}
watch(() => props.activeName, (newVal) => { // 激活tabbar
  if (newVal === '4') {
    resetComponent()
    setPageContent()
    onGetDistributionSet()
  }
})
//
// 分销设置
const distributionSwitch = ref(false)
const onGetDistributionSet = () => {
  request({
    url: 'mall4cloud_admin/m/ua/sys_config/distribution',
    method: 'get'
  }).then((data) => {
    distributionSwitch.value = data
  })
}

</script>
<style lang="scss" scoped>
.component-page-modal-content {
    min-height: 450px;
    max-height: 450px;
    height: 450px;
    overflow-y: auto;
    .page-contents {
        width: calc(100% - 40px);
        max-height: 400px;
        overflow-y: auto;
        overflow-x: hidden;
        display: flex;
        flex-wrap: wrap;
        margin: 20px;
        .page-items {
            width: 20%;
            height: 88px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-bottom: 20px;
            cursor: pointer;
            &:hover {
                border: 1px solid #155BD4;
                border-radius: 6px;
            }
            &.active {
                border: 1px solid #155BD4;
                border-radius: 6px;
            }
            img {
                width: 40px;
                height: 40px;
            }
            span {
                margin-top: 6px;
                font-size: 14px;
                font-family: Microsoft YaHei, sans-serif;
                color: #333;
            }
        }
    }
}
</style>
