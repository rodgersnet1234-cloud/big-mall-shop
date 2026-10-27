<template>
  <!--所有可以选择的组件-->
  <div
    v-show="isShowAllComponents"
    id="allComponents"
    class="all-grouped all-can-use-components"
  >
    <div class="add-component-grouped">
      <div class="add-component-grouped-item">
        <div class="add-grouped-item-title">
          {{ $t('shopFeature.allCanUse.basicComponents') }}
        </div>
        <div class="add-grouped-item-list">
          <VueDraggableNext
            :list="componentLists"
            :group="{ name: 'people', pull: 'clone', put: false }"
            :clone="cloneDog"
            ghost-class="ghost"
            :disabled="!isDrag"
          >
            <div
              v-for="(item,index) in baseList"
              :key="index"
              class="add-grouped-item-list-btn"
            >
              <div
                v-if="!item.isHide"
                class="add-grouped-item-list-con"
                @click="addComponent(item, index)"
              >
                <div
                  class="add-grouped-item-list-btn-title"
                  :class="{'active': item.type === currentActiveType}"
                >
                  <div class="item-pic-container">
                    <img
                      v-if="item.type === currentActiveType "
                      :src="item.picActive"
                      alt=""
                    >
                    <img
                      v-else
                      :src="item.pic"
                      alt=""
                    >
                  </div>
                  <div>{{ item.title }}</div>
                </div>
              </div>
            </div>
          </VueDraggableNext>
        </div>
        <div class="add-grouped-item-title">
          {{ $t('shopFeature.allCanUse.productMarketing') }}
        </div>
        <div class="add-grouped-item-list">
          <VueDraggableNext
            :list="componentLists"
            :group="{ name: 'people', pull: 'clone', put: false }"
            :clone="cloneDog"
            ghost-class="ghost"
            :disabled="!isDrag"
          >
            <div
              v-for="(item,index) in shopDisList"
              :key="index"
              class="add-grouped-item-list-btn"
            >
              <div
                v-if="!item.isHide"
                @click="addComponent(item, index)"
              >
                <div
                  class="add-grouped-item-list-btn-title"
                  :class="{'active': item.type === currentActiveType}"
                >
                  <div class="item-pic-container">
                    <img
                      v-if="item.type === currentActiveType "
                      :src="item.picActive"
                      alt=""
                    >
                    <img
                      v-else
                      :src="item.pic"
                      alt=""
                    >
                  </div>
                  <div>{{ item.title }}</div>
                </div>
              </div>
            </div>
          </VueDraggableNext>
        </div>
        <div class="add-grouped-item-title">
          {{ $t('shopFeature.allCanUse.extendComponent') }}
        </div>
        <div class="add-grouped-item-list">
          <VueDraggableNext
            :list="componentLists"
            :group="{name: 'people', pull: 'clone', put: false}"
            :clone="cloneDog"
            ghost-class="ghost"
            :disabled="!isDrag"
          >
            <div
              v-for="(item, index) in extendComponentList"
              :key="index"
              class="add-grouped-item-list-btn"
            >
              <div
                v-if="!item.isHide"
                @click="addComponent(item, index)"
              >
                <div
                  class="add-grouped-item-list-btn-title"
                  :class="{'active': item.type === currentActiveType}"
                >
                  <div class="item-pic-container">
                    <img
                      v-if="item.type === currentActiveType "
                      :src="item.picActive"
                      alt=""
                    >
                    <img
                      v-else
                      :src="item.pic"
                      alt=""
                    >
                  </div>
                  <div>{{ item.title }}</div>
                </div>
              </div>
            </div>
          </VueDraggableNext>
        </div>
      </div>
    </div>
  </div>
  <!--end 所有可以选择的组件-->
</template>
<script setup>
import { VueDraggableNext } from 'vue-draggable-next'
import header from '../header/index.vue'
import goods from '../goods/index.vue'
import goodsWaterfall from '../goods-waterfall/index.vue'
import goodsModuleFive from '../goods-module-five/index.vue'
import goodsModuleFour from '../goods-module-four/index.vue'
import goodsModuleThree from '../goods-module-three/index.vue'
import goodsModuleTwo from '../goods-module-two/index.vue'
import goodsModuleOne from '../goods-module-one/index.vue'
import headerAd from '../header_ad/index.vue'
import titleText from '../title-text/index.vue'
import notice from '../notice/index.vue'
import search from '../search/index.vue'
import imageAd from '../image_ad/index.vue'
import tabNav from '../tab-nav/index.vue'
import promotionalActivities from '../promotional-activities/index.vue'
import hotArea from '../hot-area/index.vue'

import pTextPng from '@/assets/micro-page/p-text.png'
import pTextActivePng from '@/assets/micro-page/p-text-active.png'
import pNoticePng from '@/assets/micro-page/p-notice.png'
import pNoticeActivePng from '@/assets/micro-page/p-notice-active.png'
import pSearchPng from '@/assets/micro-page/p-search.png'
import pSearchActivePng from '@/assets/micro-page/p-search-active.png'
import pProdListPng from '@/assets/micro-page/p-prod-list.png'
import pProdListActivePng from '@/assets/micro-page/p-prod-list-active.png'
import pImageAdPng from '@/assets/micro-page/p-image-ad.png'
import pImageAdActivePng from '@/assets/micro-page/p-image-ad-active.png'
import goodsWaterfallPng from '@/assets/micro-page/goods-waterfall.png'
import goodsWaterfallActivePng from '@/assets/micro-page/goods-waterfall-active.png'
import pTagsPng from '@/assets/micro-page/p-tabs.png'
import pTagsActivePng from '@/assets/micro-page/p-tabs-active.png'
import pPromotionPng from '@/assets/micro-page/p-promotion.png'
import pPromotionActivePng from '@/assets/micro-page/p-promotion-active.png'
import pHotareaPng from '@/assets/micro-page/p-hotarea.png'
import pHotareaActivePng from '@/assets/micro-page/p-hotarea-active.png'
import pcGoodsModulePng from '@/assets/pc-micro-page/pc_goods_module.png'
import pcGoodsModuleActivePng from '@/assets/pc-micro-page/pc_goods_module_active.png'

const props = defineProps({
  /**
   * 结构
   * hideTheseComponents = [{type: 'config',isHide:true}]
   * */
  hideTheseComponents: { // 隐藏这些组件
    type: Array,
    default: () => []
  },
  showTheseComponents: { // 显示这些组件
    type: Array,
    default: () => []
  },
  isShowAllComponents: { // 是否隐藏所有组件
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['retAllCanUseComponents', 'addComponent'])

const isDrag = ref(true)

watch(() => props.hideTheseComponents, () => {
  hideComponents()
}, {
  deep: true
})
watch(() => props.showTheseComponents, () => {
  showComponents()
}, {
  deep: true
})

const componentLists = ref([// 所有可用的组件
  {
    type: 'config', // 组件名称标识
    title: $t('shopFeature.allCanUse.config'),
    isHide: true, // 是否隐藏选择
    isHeader: true, // 是否为头部
    routerPath: shallowRef(header) // 路由地址
  },
  { // 公共广告头部配置
    type: 'config_common_ad',
    title: $t('shopFeature.allCanUse.config'),
    isHide: true, // 是否隐藏选择
    isHeader: true, // 是否为头部
    routerPath: shallowRef(headerAd)
  },
  // 标题文本
  {
    type: 'titleText',
    title: $t('shopFeature.allCanUse.titleText'),
    pic: pTextPng,
    picActive: pTextActivePng,
    routerPath: shallowRef(titleText)
  },
  // 公告
  {
    type: 'notice',
    title: $t('shopFeature.allCanUse.notice'),
    pic: pNoticePng,
    picActive: pNoticeActivePng,
    routerPath: shallowRef(notice)
  },
  // 搜索
  {
    type: 'search',
    title: $t('shopFeature.searchBar.searchBar'),
    pic: pSearchPng,
    picActive: pSearchActivePng,
    routerPath: shallowRef(search)
  },
  // 商品列表
  {
    type: 'goods',
    title: $t('shopFeature.allCanUse.goodsList'),
    pic: pProdListPng,
    picActive: pProdListActivePng,
    routerPath: shallowRef(goods)
  },
  // 商品瀑布流
  {
    type: 'goodsWaterfall',
    title: $t('shopFeature.allCanUse.goodsWaterfall'),
    pic: goodsWaterfallPng,
    picActive: goodsWaterfallActivePng,
    routerPath: shallowRef(goodsWaterfall)
  },
  // 图片广告
  {
    type: 'imageAd',
    title: $t('shopFeature.allCanUse.imgAd'),
    pic: pImageAdPng,
    picActive: pImageAdActivePng,
    routerPath: shallowRef(imageAd)
  },
  // 导航栏
  {
    type: 'tabNav',
    title: $t('shopFeature.allCanUse.navigationBar'),
    pic: pTagsPng,
    picActive: pTagsActivePng,
    routerPath: shallowRef(tabNav)
  },
  // 促销活动
  {
    type: 'promotionalActivities',
    title: $t('shopFeature.allCanUse.activities'),
    pic: pPromotionPng,
    picActive: pPromotionActivePng,
    routerPath: shallowRef(promotionalActivities)
  },
  // 热区
  {
    type: 'hotArea',
    title: $t('shopFeature.imageAd.hotAreaTit'),
    pic: pHotareaPng,
    picActive: pHotareaActivePng,
    routerPath: shallowRef(hotArea)
  },
  {
    type: 'goodsModule1',
    title: $t('shopFeature.allCanUse.goodsModule1'),
    pic: pcGoodsModulePng,
    picActive: pcGoodsModuleActivePng,
    routerPath: shallowRef(goodsModuleOne)
  },
  {
    type: 'goodsModule2',
    title: $t('shopFeature.allCanUse.goodsModule2'),
    pic: pcGoodsModulePng,
    picActive: pcGoodsModuleActivePng,
    routerPath: shallowRef(goodsModuleTwo)
  },
  {
    type: 'goodsModule3',
    title: $t('shopFeature.allCanUse.goodsModule3'),
    pic: pcGoodsModulePng,
    picActive: pcGoodsModuleActivePng,
    routerPath: shallowRef(goodsModuleThree)
  },
  {
    type: 'goodsModule4',
    title: $t('shopFeature.allCanUse.goodsModule4'),
    pic: pcGoodsModulePng,
    picActive: pcGoodsModuleActivePng,
    routerPath: shallowRef(goodsModuleFour)
  },
  {
    type: 'goodsModule5',
    title: $t('shopFeature.allCanUse.goodsModule5'),
    pic: pcGoodsModulePng,
    picActive: pcGoodsModuleActivePng,
    routerPath: shallowRef(goodsModuleFive)
  }
])
onMounted(() => {
  groupcomponent()

  emit('retAllCanUseComponents', componentLists.value)
  hideComponents()
  showComponents()
})

/**
 *  组件分组
 */
const shopDisList = ref([])
const baseList = ref([])
const extendComponentList = ref([]) // 扩展组件
const groupcomponent = () => {
  const baseListVal = []
  const shopDisListVal = []
  const extendComponent = []
  for (let i = 0; i < componentLists.value.length; i++) {
    const item = componentLists.value[i]
    if (item.type === 'promotionalActivities' || item.type === 'goods' || item.type === 'goodsWaterfall') {
      shopDisListVal.push(item)
    } else if (item.type === 'goodsModule1' || item.type === 'goodsModule2' || item.type === 'goodsModule3' || item.type === 'goodsModule4' || item.type === 'goodsModule5') {
      extendComponent.push(item)
    } else {
      baseListVal.push(item)
    }
  }
  baseList.value = baseListVal
  shopDisList.value = shopDisListVal
  extendComponentList.value = extendComponent
}

const cloneDog = ({ type }) => {
  return componentLists.value.find(x => x.type === type)
}
/** 添加组件 */
const currentActiveType = ref('') // 当前选中的组件
const addComponent = (item) => {
  currentActiveType.value = item.type
  emit('addComponent', item)
}
/** 隐藏组件 */
const hideComponents = () => {
  if (props.hideTheseComponents.length) { // 判断是否隐藏这些组件，那么其他的组件均显示（除了isHeader的）
    componentLists.value.map(res => {
      if (!res.isHeader) {
        res.isHide = false
      }
      return ''
    })
  }
  isShowOrHide(props.hideTheseComponents, true)
}
const showComponents = () => {
  if (props.showTheseComponents.length) { // 判断是否显示这些组件，那么其他的组件均隐藏
    componentLists.value.map(res => {
      if (!res.isHeader) {
        res.isHide = true
      }
      return ''
    })
  }
  isShowOrHide(props.showTheseComponents, false)
}
const isShowOrHide = ($data, isHide) => {
  if (!$data.length) return
  $data.map(res => {
    if (res.type) {
      const $index = componentLists.value.findIndex(x => x.type === res.type)
      if ($index >= 0) {
        componentLists.value[$index].isHide = isHide
      }
    }
    return ''
  })
}

</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
