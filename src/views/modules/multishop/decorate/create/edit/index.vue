<template>
  <div class="micro-create-pc">
    <decorate-navbar
      ref="decorateNavbarRef"
      :is-template="isTemplate"
      :data-form-l="dataForm"
      @add-component="addComponent"
      @handle-click-component="handleClickComponent"
      @handle-save="handleSave"
      @close-component-manage="isshowComponentManage = false"
      @handle-save-template="handleSaveTemplate"
      @view="view"
      @close-right="isRightShow = false;"
    />

    <div
      class="micro-box-content"
      :style="{backgroundColor:'#fff'}"
      @click="closeDecorateNavbar"
    >
      <div class="design-page">
        <div class="design-page-content">
          <!-- 界面预览 start -->
          <div
            id="scrollbar"
            ref="designEditorRef"
            :style="{'overflow': 'auto', 'background': pageBackgroundColor}"
            class="design-container"
          >
            <div style="width:100vw">
              <div
                class="design-editor"
                :style="scaleFun"
              >
                <!-- 商家招牌 start -->
                <template v-if="HeaderComponent.length > 0">
                  <div
                    v-for="(itemHeader, itemIndex) in HeaderComponent"
                    :key="itemIndex"
                    style="cursor: pointer;position: relative"
                    class="header-component"
                    :class="currentIndex === '-1' ? 'isHeader' : ''"
                  >
                    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
                    <storeSignate
                      :item-component="itemHeader"
                      @click="handleHeaderClick(itemHeader)"
                    />
                  </div>
                </template>
                <!-- 商家招牌 end -->
                <!--
                  lockOffset="0%" -->
                <slick-list
                  v-model:list="currentUseComponents"
                  :use-drag-handle="true"
                  lock-axis="y"
                  :lock-to-container-edges="true"
                  helper-class="draggerStyles"
                  append-to=".design-editor"
                  :press-delay="500"
                  :lock-offset="['0%','100%']"
                  class="slickList-scroll"
                  @input="sortInput"
                  @sort-move="sortMove"
                  @sort-end="sortEnd"
                >
                  <slick-item
                    v-for="(item, index) in currentUseComponents"
                    :id="'previewItem_'+index"
                    :key="index"
                    :class="{'component-items': true, 'isborderActive': index === currentIndex}"
                    :index="index"
                    @mousedown="clickComponent(item, index)"
                  >
                    <div class="preiview-item">
                      <!-- 中间不同的组件进行预览 start -->
                      <component
                        :is="com[item.components]"
                        :ref="item.Ref+index"
                        :current-index="index"
                        :item-component="item"
                        :current-refs="item.Ref+index"
                      />
                      <!-- 中间不同的组件进行预览 end -->
                      <div class="component-hover-style">
                        <div
                          v-handle
                          class="drag-box"
                        />
                      </div>
                    </div>
                  </slick-item>
                </slick-list>
              </div>
            </div>
          </div>
          <!-- 界面预览 end -->

          <!-- 右边配置信息 start -->
          <!-- 组件管理 start -->
          <div
            v-show="isshowComponentManage"
            class="component-management-container"
            :class="isshowComponentManage && 'fade-open'"
          >
            <component-management
              ref="componentManageRef"
              :current-use-components="currentUseComponents"
              :header-component="HeaderComponent"
              @handle-sort-component="handleSortComponent"
              @handle-single-remove="handleSingleRemove"
              @handle-remove-componnent="handleRemoveComponnent"
              @close-component-manage-container="isshowComponentManage = false"
              @handle-header-del="handleHeaderDel"
              @handle-page-color="handlePageColor"
            />
          </div>
          <!-- 组件管理 end -->
          <!-- 右边工具配置栏 start -->
          <!-- currentUseComponents.concat(HeaderComponent) 固定头部组件在最后，不影响其他组件顺序 -->
          <div
            v-show="isRightShow"
            class="right-toolbars"
            :class="isRightShow && 'fade-open'"
          >
            <right-config-message
              ref="rightConfigFormRef"
              :config-message="configMessage"
              :current-index="currentIndex"
              :operation-type="operationType"
              :current-use-components="currentUseComponents.concat(HeaderComponent)"
              @handle-update-custom-remark="handleUpdateCustomRemark"
              @close-right-config-container="isRightShow = false"
              @handle-update-message="handleUpdateMessage"
            />
          </div>
          <!-- 右边工具配置栏 end -->
          <!-- 右边配置信息 end -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import request from '@/utils/request'
import { getDomain } from '@/utils/index.js'
// 顶边栏
import decorateNavbar from './decorate-navbar.vue'
import { SlickList, SlickItem, HandleDirective } from 'vue-slicksort' // 拖动组件
import rightConfigMessage from './components/right-config-message/index.vue' // 右边对应的配置信息
// 基础组件
import storeSignate from './components/basic-component/store-signate/index.vue' // 商家招牌组件
import pictureShuffling from './components/basic-component/picture-shuffling/index.vue' // 图片轮播组件
import intervalComponent from './components/basic-component/interval-component/index.vue' // 辅助间隔组件
import floorTitleComponent from './components/basic-component/floor-title-component/index.vue' // 楼层标题组件
import goodListComponent from './components/basic-component/good-list-component/index.vue' // 商品列表组件
import hotSpotComponent from './components/basic-component/hot-spot-component/index.vue' // 万能热区组件
import storeListComponent from './components/basic-component/store-list-component/index.vue' // 店铺列表配置信息
// 营销活动
import limitedSkillComponent from './components/marketing-activities/limited-skill-component/index.vue' // 限时秒杀组件
import discountCouponComponent from './components/marketing-activities/discount-coupon-component/index.vue' // 优惠团购组件
// 扩展组件
import goodsModuleComponentOne from './components/extend-component/goods-module-component-one/index.vue' // 商品模块1组件
import goodsModuleComponentTwo from './components/extend-component/goods-module-component-two/index.vue' // 商品模块2组件
import goodsModuleComponentThree from './components/extend-component/goods-module-component-three/index.vue' // 商品模块3组件
import goodsModuleComponentFour from './components/extend-component/goods-module-component-four/index.vue' // 商品模块4组件
import goodsModuleComponentFive from './components/extend-component/goods-module-component-five/index.vue' // 商品模块5组件间
// 组件管理
import componentManagement from './components/component-management/index.vue' // 组件管理
import { configComponentList } from './components/configComponent' // 左边组件信息
import { ElMessage } from 'element-plus'
import Cookies from 'vue-cookies'
const com = shallowReactive({
  storeSignate,
  pictureShuffling,
  intervalComponent,
  floorTitleComponent,
  goodListComponent,
  hotSpotComponent,
  storeListComponent,
  limitedSkillComponent,
  discountCouponComponent,
  goodsModuleComponentOne,
  goodsModuleComponentTwo,
  goodsModuleComponentThree,
  goodsModuleComponentFour,
  goodsModuleComponentFive
})
const vHandle = HandleDirective
export default defineComponent({
  beforeRouteEnter (to, from, next) {
    document.querySelector('body').setAttribute('style', 'overflow-x: hidden')
    next()
  }
})
</script>
<script setup>
onBeforeRouteLeave((to, from, next) => {
  document.querySelector('body').setAttribute('style', 'overflow-x: auto')
  next()
})
const currentUseComponents = ref([]) // 当前正在编辑的组件
const isRightShow = ref(false) // 右边导航是否显示
const configMessage = ref({ // 右边的配置信息
  currentConfigTitle: '', // 右边配置标题
  type: '', // 当前配置的是左边的组件还是排序信息
  currentConfigType: '', // 右边配置左边那个组件的信息
  config: {} // 配置信息
})
const windowWidth = ref('') // 当前页面窗口的大小
const scaleFun = ref({
  transform: 'scale(1)'
})
const currentIndex = ref('') // 当前点击的组件
const startX = '' // 拖拽开始距离x
let endX = '' // 拖拽结束距离x
const startY = '' // 拖拽开始距离y
let endY = '' // 拖拽结束距离y
const isshowComponentManage = ref(false) // 是否展示组件管理
let renovationId = '' // 店铺装修id
let templateId = '' // 模板装修id
const operationType = ref('') // 当前操作的类型
const pageBackgroundColor = ref('rgba(244, 244, 244, 1)') // 页面背景颜色
const HeaderComponent = ref([]) // 头部组件
let timer = null
let pageWidth = '' // 可视容器的宽度
const isTemplate = ref('0') // 是否为模板编辑
const dataForm = ref({
  name: '',
  remark: '',
  imgUrl: ''
}) // 模板信息
let pageType = ''
let isSubmit = false
const commonStore = useCommonStore()

const sidebarFold = computed(() => {
  return commonStore.sidebarFold
})
const designEditorRef = ref(null)
watch(sidebarFold, () => { // 监听侧边栏展示隐藏来展示右边内容缩放比例
  setTimeout(() => {
    pageWidth = designEditorRef.value && designEditorRef.value?.clientWidth
    setPageScale()
  }, 500)
})
watch(windowWidth, () => {
  setPageScale()
})
let windowHeight = ''
const route = useRoute()
onMounted(() => {
  isshowComponentManage.value = true
  // 将左边菜单给隐藏掉
  commonStore.updateSidebarFold(true)
  // 监听布局页面的改动
  getCurrentPageWidth()
  window.onresize = () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      windowWidth.value = document.body.clientWidth
      windowHeight = document.body.clientHeight
    }, 200)
  }
  // 拿到当前编辑的店铺装修id
  const { renovationId: isRenovationId, type, templateId: isTemplateId } = route.query
  isTemplate.value = route.query.template
  templateId = isTemplateId
  pageType = type
  if (type === 'edit') {
    operationType.value = 'edit' // 当前是编辑
    renovationId = isRenovationId
    if (isTemplate.value === '0') {
      getDetail()
    } else {
      getTemplateDetail()
    }
  } else if (type === 'add' && templateId) {
    getTemplateDetail()
  }
  localStorage.removeItem('cloudViewContent')
})

// 预览
const router = useRouter()
const domain = getDomain()
const componentManageRef = ref(null)
const view = () => {
  let finallArr = []
  finallArr = beforeSave()
  if (!finallArr.length) return
  const params = {
    content: JSON.stringify(finallArr), // 配置内容
    name: componentManageRef.value?.smallPageName // 页面名称
  }
  localStorage.setItem('cloudViewContent', JSON.stringify(params))
  const newPage = router.resolve({
    path: 'decorate-select-decorate',
    query: {
      type: 'detail',
      ...(Cookies.get(domain) ? {} : { tid: Cookies.get('cloudTid') })
    }
  })
  window.open(newPage.href, '_blank', 'noopener,noreferrer')
}
// 清除菜单选择
const decorateNavbarRef = ref(null)
const closeDecorateNavbar = () => {
  decorateNavbarRef.value.menuActive = -1
  decorateNavbarRef.value.visible = false
}
const getDetail = () => {
  request({
    url: '/mall4cloud_admin/mp/shop_renovation',
    params: {
      renovationId
    },
    method: 'get'
  }).then(async (data) => {
    const useArr = []
    let contentArr = JSON.parse(data.content)
    // 匹配商品
    contentArr = await matchproducts(contentArr)
    contentArr.forEach(ele => {
      if (ele.type === 'page_background') { // 页面背景颜色
        pageBackgroundColor.value = ele.dataField.background
        componentManageRef.value.pageBackground = ele.dataField.background
      }
      configComponentList.forEach((item, index) => {
        if (ele.type === item.type) {
          useArr.push({
            ...item,
            rightConfigMessage: ele.dataField,
            customRemark: ele.customRemark || index
          })
        }
      })
    })
    componentManageRef.value.smallPageName = data.name
    const arr = []
    const headerArr = []
    useArr.forEach(item => {
      if (item.type === 'shop_signs') {
        headerArr.push(item)
      } else {
        arr.push(item)
      }
    })
    HeaderComponent.value = headerArr // 头部组件
    currentUseComponents.value = arr // 其他组件
  }).catch(() => {
    currentUseComponents.value = []
    HeaderComponent.value = []
  })
}
// 获取模板详情
const getTemplateDetail = () => {
  request({
    url: '/mall4cloud_admin/mp/shop_template',
    params: {
      templateId
    },
    method: 'get'
  }).then(async (data) => {
    const useArr = []
    if (pageType === 'edit') {
      dataForm.value = {
        name: data.name || '',
        remark: data.remark || '',
        imgUrl: data.image || ''
      }
    }
    if (pageType === 'add' && isTemplate.value === '0') {
      templateId = null
    }
    let contentArr = JSON.parse(data.content)
    // 匹配商品
    contentArr = await matchproducts(contentArr)
    contentArr.forEach(ele => {
      if (ele.type === 'page_background') { // 页面背景颜色
        pageBackgroundColor.value = ele.dataField.background
        componentManageRef.value.pageBackground = ele.dataField.background
      }
      configComponentList.forEach(item => {
        if (ele.type === item.type) {
          useArr.push({
            ...item,
            rightConfigMessage: ele.dataField
          })
        }
      })
    })
    // componentManageRef.smallPageName = dataRef.value?.name
    const arr = []
    const headerArr = []
    useArr.forEach(item => {
      if (item.type === 'shop_signs') {
        headerArr.push(item)
      } else {
        arr.push(item)
      }
    })
    HeaderComponent.value = headerArr // 头部组件
    currentUseComponents.value = arr // 其他组件
  }).catch(() => {
    currentUseComponents.value = []
    HeaderComponent.value = []
  })
}
// 匹配商品
const matchproducts = async (arr) => {
  const res = await searchGoodsMessage(arr) // 根据现有的id查询所有的商品信息
  res.forEach(item => {
    if (item.spuActivity) {
      if (item.spuActivity.groupActivity) {
        item.groupPrice = item.spuActivity.groupActivity.price
      }
      if (item.spuActivity.sekillActivitySpuVO) {
        item.seckillPrice = item.spuActivity.sekillActivitySpuVO.seckillPrice
      }
    }
  })
  arr.forEach(item => {
    if (item.type === 'goods_list') { // 商品列表 优惠团购
      item.dataField.goodsList = handleScreenGoods(item.dataField.goodsList, res, 'id')
    } else if (item.type === 'discount_coupon') {
      const discountParams = {
        // 商品名称
        status: 'spuStatus',
        price: 'groupPrice',
        imgs: 'mainImgUrl',
        description: 'sellingPoint', // 商品描述
        orignPrice: 'priceFee'
      }
      item.dataField.goodsList = handleScreenGoods(item.dataField.goodsList, res, 'id', discountParams)
    } else if (item.type === 'limited_skill') { // 秒杀商品
      const limitedParams = {
        // 商品名称
        status: 'spuStatus',
        price: 'seckillPrice',
        imgs: 'mainImgUrl',
        description: 'sellingPoint', // 商品描述
        orignPrice: 'priceFee'
      }
      item.dataField.goodsList = handleScreenGoods(item.dataField.goodsList, res, 'id', limitedParams)
    } else if (item.type === 'goods_module1') { // 商品模块1
      item.dataField.leftConfig.goodsList = handleScreenGoods(item.dataField.leftConfig.goodsList, res, 'id')
      item.dataField.centerConfig.goodsList = handleScreenGoods(item.dataField.centerConfig.goodsList, res, 'id')
      item.dataField.rightConfig.goodsList = handleScreenGoods(item.dataField.rightConfig.goodsList, res, 'id')
    } else if (item.type === 'goods_module2') { // 商品模块2
      item.dataField.maingoodsList = handleScreenGoods(item.dataField.maingoodsList, res, 'id')
      item.dataField.othergoodsList = handleScreenGoods(item.dataField.othergoodsList, res, 'id')
    } else if (item.type === 'goods_module3') { // 商品模块3
      item.dataField.leftConfig.goodsList = handleScreenGoods(item.dataField.leftConfig.goodsList, res, 'id')
      item.dataField.rightConfig.goodsList = handleScreenGoods(item.dataField.rightConfig.goodsList, res, 'id')
    } else if (item.type === 'goods_module4' || item.type === 'goods_module5') { // 商品模块4
      item.dataField.goodsList = handleScreenGoods(item.dataField.goodsList, res, 'id')
    }
  })
  return arr
}
// 查询商品信息
const searchGoodsMessage = (arr) => {
  let goodsArr = []
  arr.forEach(item => {
    if (item.type === 'limited_skill') { // 秒杀商品
      item.dataField.goodsList.forEach(v => {
        goodsArr.push(v.id)
      })
    } else if (item.type === 'discount_coupon') { // 优惠团购
      item.dataField.goodsList.forEach(v => {
        goodsArr.push(v.id)
      })
    } else if (item.type === 'goods_list') { // 商品信息
      item.dataField.goodsList.forEach(v => {
        goodsArr.push(v.id)
      })
    } else if (item.type === 'goods_module1') { // 商品模块1
      item.dataField.leftConfig && item.dataField.leftConfig.goodsList.forEach(v => {
        goodsArr.push(v.id)
      })
      item.dataField.centerConfig && item.dataField.centerConfig.goodsList.forEach(v => {
        goodsArr.push(v.id)
      })
      item.dataField.rightConfig && item.dataField.rightConfig.goodsList.forEach(v => {
        goodsArr.push(v.id)
      })
    } else if (item.type === 'goods_module2') { // 商品模块2
      item.dataField.maingoodsList && item.dataField.maingoodsList.forEach(v => {
        goodsArr.push(v.id)
      })
      item.dataField.othergoodsList && item.dataField.othergoodsList.forEach(v => {
        goodsArr.push(v.id)
      })
    } else if (item.type === 'goods_module3') { // 商品模块3
      item.dataField.leftConfig && item.dataField.leftConfig.goodsList.forEach(v => {
        goodsArr.push(v.id)
      })
      item.dataField.rightConfig && item.dataField.rightConfig.goodsList.forEach(v => {
        goodsArr.push(v.id)
      })
    } else if (item.type === 'goods_module4') { // 商品模块4
      item.dataField.goodsList && item.dataField.goodsList.forEach(v => {
        goodsArr.push(v.id)
      })
    } else if (item.type === 'goods_module5') { // 商品模块5
      item.dataField.goodsList && item.dataField.goodsList.forEach(v => {
        goodsArr.push(v.id)
      })
    }
  })
  goodsArr = Array.from(new Set(goodsArr))
  return new Promise((resolve) => {
    request({
      url: '/mall4cloud_search/mp/search/renovation_page',
      method: 'get',
      params: {
        spuIds: goodsArr,
        pageNum: 1,
        pageSize: goodsArr.length,
        getDelete: 1
      }
    }).then((data) => {
      if (data.list) {
        resolve(data.list[0].spus)
      } else {
        resolve([])
      }
    })
  })
}
// 筛选商品回显 currentArr: 表示当前装修的商品，backReturnArr: 表示根据现有id查询后端返回的商品
const handleScreenGoods = (currentArr, backReturnArr, type, otherParams) => {
  let params = {}
  if (otherParams) {
    params = {
      ...otherParams
    }
  } else {
    params = {
      // 商品名称
      status: 'spuStatus', // 商品状态
      price: 'priceFee', // 商品价格
      imgs: 'mainImgUrl', // 商品图片
      description: 'sellingPoint', // 商品描述
      orignPrice: 'marketPriceFee' // 市场价
    }
  }
  const arr = []
  for (let i = 0; i < currentArr.length; i++) {
    for (let j = 0; j < backReturnArr.length; j++) {
      if (currentArr[i][type] === backReturnArr[j].spuId) {
        for (const key in params) {
          currentArr[i][key] = backReturnArr[j][params[key]]
        }
        if (currentArr[i].spuType) {
          currentArr[i].spuType = backReturnArr[j].spuType
        }
        arr.push(currentArr[i])
      }
    }
  }
  return arr
}
// 添加组件
const addComponent = (item) => {
  // 判断当前配置的组件是否已经有头部组件
  const isUse = HeaderComponent.value.findIndex(v => v.type === 'shop_signs')
  if (item.type === 'shop_signs' && isUse !== -1) {
    return ElMessage.warning('商家招牌只能添加一个！')
  }
  if (item.type === 'shop_signs') {
    item.rightConfigMessage = {
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
  operationType.value = 'add' // 当前是添加组件
  // 拿到当前页面已经拼接的所有组件
  const allCurrentUseComponents = currentUseComponents.value
  const isHeaderComponent = HeaderComponent.value
  if (item.type !== 'shop_signs') {
    allCurrentUseComponents.push(item)
  } else {
    isHeaderComponent.push(item)
  }
  setTimeout(() => {
    const arr = []
    allCurrentUseComponents.forEach((item, index) => {
      item.customRemark = item.customRemark || index
      arr.push(item)
    })
    currentUseComponents.value = [...arr] // 其他组件
    HeaderComponent.value = [...isHeaderComponent] // 头部组件
  }, 5)
}
// 当拖拽结束后产生新的列表触发
const sortInput = (newList) => {
  if (startX !== endX && startY !== endY) {
    // 如果在移动的过程中，招牌不在第二个，给一个提示
    for (let i = 0; i < newList.length; i++) {
      if (newList[i].type === 'shop_signs') {
        if (newList[0].type !== 'shop_signs') {
          ElMessage.warning('商家招牌组件只能显示在头部！')
        }
      }
    }
  }
  // 始终保证招牌在顶部
  const arr = []
  const HeaderComponent = []
  newList.forEach(item => {
    if (item.type === 'shop_signs') {
      HeaderComponent.push(item)
    } else {
      arr.push(item)
    }
  })
  currentUseComponents.value = [...arr]
  // 滑动之后选择当前的
  setTimeout(() => {
    currentUseComponents.value.forEach((item, index) => {
      if (currentIndex.value === index) {
        isRightShow.value = true // 显示右边配置信息
        isshowComponentManage.value = false // 右边组件管理隐藏
        configMessage.value = {
          currentConfigTitle: item.rightConfigTitle,
          type: 'basic_component',
          currentConfigType: item.type,
          Ref: item.Ref + index,
          config: item.rightConfigMessage,
          customRemark: item.customRemark
        }
      }
    })
  }, 500)
}

// 当拖拽时鼠标移动时触发
const sortMove = () => {
  isRightShow.value = false // 右边配置信息隐藏
}
// 当拖拽结束时触发
const sortEnd = (val) => {
  currentIndex.value = val.newIndex // 新的下标
  endX = val.event.x
  endY = val.event.y
}
// 点击当前某个组件
const clickComponent = (item, index) => {
  setTimeout(() => {
    isRightShow.value = true // 显示右边配置信息
    isshowComponentManage.value = false // 右边组件管理隐藏
    currentIndex.value = index // 当前选中的组件
    configMessage.value = {
      currentConfigTitle: item.rightConfigTitle,
      type: 'basic_component',
      currentConfigType: item.type,
      Ref: item.Ref + index,
      config: item.rightConfigMessage,
      customRemark: item.customRemark
    }
  }, 300)
}
// 获取当前页面的宽度
const getCurrentPageWidth = () => {
  let timer = null
  windowWidth.value = document.body.clientWidth
  windowHeight = document.body.clientHeight
  setPageScale()
  window.onresize = () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      windowWidth.value = document.body.clientWidth
      windowHeight = document.body.clientHeight
      setPageScale()
    }, 500)
  }
}
// 根据页面不同的宽度，对页面进行等比例缩放
const setPageScale = () => {
  windowWidth.value = document.body.clientWidth
  windowHeight = document.body.clientHeight
  pageWidth = designEditorRef.value && designEditorRef.value?.clientWidth
  const width = pageWidth
  if (windowWidth.value > 1400) {
    scaleFun.value.width = '100%'
    scaleFun.value = {
      'transform-origin': 'left top',
      width: '100%',
      height: (windowHeight / windowWidth.value) / width + 'px'
    }
  } else {
    scaleFun.value = {
      width: '100%',
      'transform-origin': 'left top',
      // 'transform': 'scale(' + (1100 / 1400) + ')',
      height: '100%'
    }
    designEditorRef.value.style.overflow = 'auto'
  }
}
// 头部验证
const { proxy } = getCurrentInstance()

const handleValidateHeader = () => {
  const arr = []
  HeaderComponent.value.forEach((item, index) => {
    if (proxy.$refs[item.Ref + index]) {
      arr.push(proxy.$refs[item.Ref + index][0].handleValidate())
    }
  })
  return arr
}
const rightConfigFormRef = ref(null)
const beforeSave = () => {
  const arr = [] // 其他组件信息
  const HeaderArr = [] // 头部组件信息
  const isValidateArr = rightConfigFormRef.value?.handleChangeValidate()
  // 验证头部组件信息
  const isValidateHeaderArr = handleValidateHeader()

  const indexs = isValidateArr.findIndex(item => item.status === false)
  const headerIndex = isValidateHeaderArr.findIndex(item => item.status === false)
  if (indexs !== -1) { // 各个组件的信息提示
    return ElMessage.warning(`${isValidateArr[indexs].message}`)
  }
  if (headerIndex !== -1) { // 头部信息提示
    return ElMessage.warning(`${isValidateHeaderArr[headerIndex].message}`)
  }
  // 其他组件信息
  currentUseComponents.value.forEach((item, index) => {
    arr.push({
      type: item.type, // 当前组件的类型
      dataField: {
        ...item.rightConfigMessage
      },
      customRemark: item.customRemark || index
    })
  })
  // 头部组件信息
  HeaderComponent.value.forEach(item => {
    HeaderArr.push({
      type: item.type, // 当前组件的类型
      dataField: {
        ...item.rightConfigMessage
      }
    })
  })
  const pageParams = [{
    type: 'page_background',
    dataField: {
      background: pageBackgroundColor.value
    }
  }]
  // 调用配置保存的接口
  return [...HeaderArr, ...arr, ...pageParams]
}
// 保存
const handleSave = () => {
  let finallArr = [] // 所有组件信息
  const isValidateArr = rightConfigFormRef.value?.handleChangeValidate()
  // 验证页面标题
  if (componentManageRef.value?.smallPageName === '') {
    return ElMessage.warning($t('pcdecorate.componentTitle.pageTitle'))
  }
  // 验证头部组件信息
  const isValidateHeaderArr = handleValidateHeader()
  if (isValidateArr.length > 0 || isValidateHeaderArr.length > 0) { // 判断验证情况
    if (isSubmit) {
      return
    }
    // 调用配置保存的接口
    // finallArr = [...HeaderArr, ...arr, ...pageParams]
    finallArr = beforeSave()
    if (!finallArr.length) return
    isSubmit = true
    const params = {
      content: JSON.stringify(finallArr), // 配置内容
      name: componentManageRef.value?.smallPageName, // 页面名称
      renovationType: 1, // 装修类型
      renovationId // 装修店铺id
    }
    let url = ''
    let method = ''
    let tips = ''
    if (renovationId) {
      url = '/mall4cloud_admin/mp/shop_renovation/update_pc'
      method = 'put'
      tips = '保存成功'
    } else {
      url = '/mall4cloud_admin/mp/shop_renovation/save_pc'
      method = 'post'
      tips = '保存成功'
    }
    request({
      url,
      method,
      data: params
    }).then((data) => {
      if (!renovationId) {
        renovationId = data
        router.replace({
          path: 'decorate-create-edit',
          query: {
            renovationId,
            type: 'edit',
            template: '0'
          }
        })
      }
      ElMessage.success(tips)
    }).finally(() => {
      isSubmit = false
    })
  } else {
    ElMessage.warning('当前配置组件为空，不能进行保存！')
  }
}
// 保存模板
const handleSaveTemplate = (dataForm) => {
  let finallArr = [] // 所有组件信息
  const isValidateArr = rightConfigFormRef.value?.handleChangeValidate()
  // 验证页面标题
  // 验证头部组件信息
  const isValidateHeaderArr = handleValidateHeader()
  if (isValidateArr.length > 0 || isValidateHeaderArr.length > 0) { // 判断验证情况
    if (isSubmit) {
      return
    }
    // 调用配置保存的接口
    // finallArr = [...HeaderArr, ...arr, ...pageParams]
    finallArr = beforeSave()
    if (!finallArr.length) return
    isSubmit = true
    const params = {
      remark: dataForm.remark,
      image: dataForm.imgUrl,
      content: JSON.stringify(finallArr), // 配置内容
      name: dataForm.name, // 模板名称
      type: 1, // 装修类型
      // shopId: renovationId // 装修店铺id
      templateId: templateId || null
    }
    let url = ''
    let method = ''
    let tips = ''
    if (templateId) {
      url = '/mall4cloud_admin/mp/shop_template/update_pc'
      method = 'put'
      tips = '保存成功'
    } else {
      url = '/mall4cloud_admin/mp/shop_template/save_pc'
      method = 'post'
      tips = '保存成功'
    }

    request({
      url,
      method,
      data: params
    }).then((data) => {
      if (!templateId) {
        templateId = data
      }
      ElMessage.success(tips)
    }).finally(() => {
      isSubmit = false
    })
  } else {
    ElMessage.warning('当前配置组件为空，不能进行保存！')
  }
}

// // 右边配置信息的改变
const handleUpdateMessage = (obj) => {
  let arr = []
  arr = JSON.parse(JSON.stringify(currentUseComponents.value))
  // 头部信息
  HeaderComponent.value.forEach(v => {
    if (v.Ref + '-1' === obj.ref) {
      v.rightConfigMessage = { ...obj.config }
    }
  })
  arr.forEach((item, index) => {
    if (item.type === 'picture_by') { // 图片轮播
      if (item.Ref + index === obj.ref) {
        item.rightConfigMessage = { ...obj.config }
      }
    } else if (item.type === 'auxiliary_interval') { // 辅助间隔
      if (item.Ref + index === obj.ref) {
        item.rightConfigMessage = { ...obj.config }
      }
    } else if (item.type === 'floor_title') { // 楼层标题
      if (item.Ref + index === obj.ref) {
        item.rightConfigMessage = { ...obj.config }
      }
    } else if (item.type === 'goods_list') { // 商品列表
      if (item.Ref + index === obj.ref) {
        item.rightConfigMessage = { ...obj.config }
      }
    } else if (item.type === 'universal_hotspot') { // 万能热区
      if (item.Ref + index === obj.ref) {
        item.rightConfigMessage = { ...obj.config }
      }
    } else if (item.type === 'store_list') { // 店铺列表
      if (item.Ref + index === obj.ref) {
        item.rightConfigMessage = { ...obj.config }
      }
    } else if (item.type === 'limited_skill') { // 限时秒杀
      if (item.Ref + index === obj.ref) {
        item.rightConfigMessage = { ...obj.config }
      }
    } else if (item.type === 'discount_coupon') { // 优惠团购
      if (item.Ref + index === obj.ref) {
        item.rightConfigMessage = { ...obj.config }
      }
    } else if (item.type === 'goods_module1') { // 商品模块1
      if (item.Ref + index === obj.ref) {
        item.rightConfigMessage = { ...obj.config }
      }
    } else if (item.type === 'goods_module2') { // 商品模块2
      if (item.Ref + index === obj.ref) {
        item.rightConfigMessage = { ...obj.config }
      }
    } else if (item.type === 'goods_module3') { // 商品模块3
      if (item.Ref + index === obj.ref) {
        item.rightConfigMessage = { ...obj.config }
      }
    } else if (item.type === 'goods_module4') { // 商品模块4
      if (item.Ref + index === obj.ref) {
        item.rightConfigMessage = { ...obj.config }
      }
    } else if (item.type === 'goods_module5') { // 商品模块5
      if (item.Ref + index === obj.ref) {
        item.rightConfigMessage = { ...obj.config }
      }
    }
  })
  currentUseComponents.value = JSON.parse(JSON.stringify(arr))
}
// 点击组件管理
const handleClickComponent = () => {
  isshowComponentManage.value = !isshowComponentManage.value
  isRightShow.value = false // 隐藏右边配置信息
  currentIndex.value = '' // 当前选中的组件
}
// 组件管理组件排序
const handleSortComponent = (newArr) => {
  let arr = []
  arr = JSON.parse(JSON.stringify(newArr))
  currentUseComponents.value = []
  currentUseComponents.value = arr
}
// 删除单个组件
const handleSingleRemove = (index) => {
  currentUseComponents.value.splice(index, 1)
}
// 清空组件
const handleRemoveComponnent = () => {
  currentUseComponents.value = []
  HeaderComponent.value = []
}
// 组件管理
const handlePageColor = (color) => {
  pageBackgroundColor.value = color
}

// 头部组件删除
const handleHeaderDel = () => {
  HeaderComponent.value = []
}
// 头部组件点击
const handleHeaderClick = (item) => {
  currentIndex.value = '-1'
  isRightShow.value = true // 显示右边配置信息
  isshowComponentManage.value = false // 右边组件管理隐藏
  configMessage.value = {
    currentConfigTitle: item.rightConfigTitle,
    type: 'basic_component',
    currentConfigType: item.type,
    Ref: item.Ref + '-1',
    config: item.rightConfigMessage
  }
}

// 设置自定义标记
const handleUpdateCustomRemark = (obj, index) => {
  currentUseComponents.value[index].customRemark = obj.customRemark
}

</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
