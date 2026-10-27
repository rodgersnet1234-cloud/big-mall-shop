<template>
  <div
    class="select-decorate-page"
    :style="{background: pageBackground}"
  >
    <div class="select-decorate-content">
      <div
        v-for="(item, index) in configArr"
        :key="index"
      >
        <component
          :is="com[item.components]"
          :item-component="item"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import request from '@/utils/request'
import { configComponentList } from '../edit/components/configComponent'
// 基础组件
import storeSignate from '../edit/components/basic-component/store-signate/index.vue' // 商家招牌组件
import pictureShuffling from '../edit/components/basic-component/picture-shuffling/index.vue' // 图片轮播组件
import intervalComponent from '../edit/components/basic-component/interval-component/index.vue' // 辅助间隔组件
import floorTitleComponent from '../edit/components/basic-component/floor-title-component/index.vue' // 楼层标题组件
import goodListComponent from '../edit/components/basic-component/good-list-component/index.vue' // 商品列表组件
import hotSpotComponent from '../edit/components/basic-component/hot-spot-component/index.vue' // 万能热区组件
import storeListComponent from '../edit/components/basic-component/store-list-component/index.vue' // 店铺列表配置信息
// 营销活动
import limitedSkillComponent from '../edit/components/marketing-activities/limited-skill-component/index.vue' // 限时秒杀组件
import discountCouponComponent from '../edit/components/marketing-activities/discount-coupon-component/index.vue' // 优惠团购组件
// 扩展组件
import goodsModuleComponentOne from '../edit/components/extend-component/goods-module-component-one/index.vue' // 商品模块1组件
import goodsModuleComponentTwo from '../edit/components/extend-component/goods-module-component-two/index.vue' // 商品模块2组件
import goodsModuleComponentThree from '../edit/components/extend-component/goods-module-component-three/index.vue' // 商品模块3组件
import goodsModuleComponentFour from '../edit/components/extend-component/goods-module-component-four/index.vue' // 商品模块4组件
import goodsModuleComponentFive from '../edit/components/extend-component/goods-module-component-five/index.vue' // 商品模块5组件间
// 组件管理
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
const route = useRoute()
onMounted(() => {
  const { renovationId } = route.query
  if (renovationId) {
    getDetail(renovationId)
  } else if (localStorage.getItem('cloudViewContent')) {
    viewContent(JSON.parse(localStorage.getItem('cloudViewContent')))
    document.title = '预览'
  }
})

// 预览
const configArr = ref([])
const pageBackground = ref('') // 页面背景颜色
const viewContent = async (data) => {
  document.title = data.name
  const useArr = []
  let contentArr = JSON.parse(data.content)
  // 匹配商品
  contentArr = await matchproducts(contentArr)
  contentArr.forEach(ele => {
    if (ele.type === 'page_background') {
      pageBackground.value = ele.dataField.background
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
  configArr.value = useArr
}
// 获取详情
const getDetail = (id) => {
  request({
    url: '/mall4cloud_admin/mp/shop_renovation',
    params: {
      renovationId: id
    },
    method: 'get'
  }).then(async (data) => {
    document.title = data.name
    const useArr = []
    let contentArr = JSON.parse(data.content)
    // 匹配商品
    contentArr = await matchproducts(contentArr)
    contentArr.forEach(ele => {
      if (ele.type === 'page_background') {
        pageBackground.value = ele.dataField.background
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
    configArr.value = useArr
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
    if (item.type === 'goods_list') { // 商品列表
      item.dataField.goodsList = handleScreenGoods(item.dataField.goodsList, res, 'id')
    } else if (item.type === 'discount_coupon') {
      const discountParams = {
        // 商品名称
        status: 'spuStatus',
        price: 'groupPrice',
        imgs: 'mainImgUrl',
        description: 'sellingPoint' // 商品描述
      }
      item.dataField.goodsList = handleScreenGoods(item.dataField.goodsList, res, 'id', discountParams)
    } else if (item.type === 'limited_skill') { // 秒杀商品
      const limitedParams = {
        // 商品名称
        status: 'spuStatus',
        price: 'seckillPrice',
        imgs: 'mainImgUrl',
        description: 'sellingPoint' // 商品描述
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
        data.list[0].spus.forEach(item => {
          item.id = item.spuId
        })
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
      prodType: 'spuType', // 商品类型
      status: 'spuStatus', // 商品状态
      price: 'priceFee', // 商品价格
      orignPrice: 'marketPriceFee', // 原价
      imgs: 'mainImgUrl', // 商品图片
      description: 'sellingPoint' // 商品描述
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

</script>
<style lang="scss" scoped>
.select-decorate-page {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: #f4f4f4;
    left: 0;
    top: 0;
    z-index: 1030;
    bottom: 0;
    right: 0;
    overflow-y: auto;
    // 头部样式
}
</style>
