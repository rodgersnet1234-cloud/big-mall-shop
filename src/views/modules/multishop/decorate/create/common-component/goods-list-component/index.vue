<template>
  <!-- 这个是商品列表 -->
  <div class="goods_list_container">
    <div class="goods_list_component">
      <template v-if="config.dataList && config.dataList.length > 0">
        <template
          v-for="(item, index) in config.dataList"
          :key="index"
        >
          <div
            :style="setGoodsListStyle"
            :class="setClassName"
          >
            <div class="goods-img-content">
              <el-image
                :src="checkFileUrl(item.imgs)"
                fit="fill"
              >
                <template #error>
                  <div class="image-slot">
                    <img
                      src="@/assets/pc-micro-page/show-default.png"
                      style="width: 34px"
                      alt=""
                    >
                  </div>
                </template>
              </el-image>
              <!-- 下架商品蒙版 start -->
              <!-- 限时秒活动 -->
              <template v-if="currentType">
                <div
                  v-if="setImgs(item, 'show')"
                  class="imgs_shelves"
                >
                  <img
                    class="been_imgs"
                    :src="setImgs(item, 'src')"
                    alt=""
                  >
                </div>
              </template>
              <!-- 普通商品下架 -->
              <template v-else>
                <div
                  v-if="item.status !== 1"
                  class="imgs_shelves"
                >
                  <img
                    class="been_imgs"
                    src="@/assets/pc-micro-page/been_shelves.png"
                    alt=""
                  >
                </div>
              </template>
              <!-- 下架商品蒙版 end -->
            </div>

            <div class="goods-text">
              <div class="top">
                <span
                  v-show="config.showName === 0"
                  class="name"
                >{{ item.name }}</span>
              </div>
              <div
                v-show="config.showPrice === 0"
                class="price"
              >
                <div class="count">
                  <span>￥</span>
                  <span>{{ getPrice(item.price || item.orignPrice, 'left') }}.</span>
                  <span>{{ getPrice(item.price || item.orignPrice, 'right') }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
      <template v-else>
        <template
          v-for="(item, index) in config.listTypeList"
          :key="index"
        >
          <div
            :style="setGoodsListStyle"
            :class="setClassName"
          >
            <el-image
              fit="cover"
              style="background: rgba(243, 245, 247, 0.39);"
            >
              <template #error>
                <div class="image-slot">
                  <img
                    src="@/assets/pc-micro-page/show-default.png"
                    style="width: 34px"
                    alt=""
                  >
                </div>
              </template>
            </el-image>
            <div class="goods-text">
              <div class="top">
                <span
                  v-show="config.showName === 0"
                  class="name"
                >{{ $t(`pcdecorate.goodsList.goodsName`) }}</span>
              </div>
              <div
                v-show="config.showPrice === 0"
                class="price"
              >
                <div class="count">
                  <span>￥{{ $t(`pcdecorate.goodsList.price`) }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
<script setup>

import hasEnd from '@/assets/pc-micro-page/has_end.png'
import beenShelves from '@/assets/pc-micro-page/been_shelves.png'
const props = defineProps({
  config: { // 商品配置信息
    type: Object,
    default: () => {}
  },
  currentType: { // 当是是否是活动
    type: Boolean,
    default: () => false
  },
  type: { // 当前是什么类型，限时秒杀，还是优惠团购
    type: String,
    default: () => ''
  }
})

// 得到价格显示
const getPrice = computed(() => {
  return (price, type) => {
    if (!price) return
    price = formatPrice(price, 1).toFixed(2)
    const point = price.toString().indexOf('.') // 如果为-1则表示没找到
    let leftPrice = ''
    let rightPrice = ''
    if (point === -1) { // 当前是整数
      leftPrice = price
      rightPrice = '00'
    } else {
      leftPrice = price.toString().slice(0, point)
      rightPrice = price.toString().slice(point + 1)
    }
    switch (type) {
      case 'left':
        return leftPrice
      case 'right':
        return rightPrice
      default:
        break
    }
  }
})
// 设置商品列表样式
const setGoodsListStyle = computed(() => {
  let width = ''
  // 如果当前每行展示三个，此时每个对应的宽度是
  if (props.config.showMany === 3) {
    width = 'calc(33.3% - (20px - (20px / 3)))'
  } else if (props.config.showMany === 4) {
    width = 'calc(25% - (20px - (20px / 4)))'
  } else if (props.config.showMany === 5) {
    width = 'calc(20% - (20px - (20px / 5)))'
  }
  return {
    width

  }
})
// 设置类名
const setClassName = computed(() => {
  let className = 'goods-list-items'
  if (props.config.showMany === 3) {
    className = 'goods-list-items three'
  } else if (props.config.showMany === 4) {
    className = 'goods-list-items four'
  } else if (props.config.showMany === 5) {
    className = 'goods-list-items five'
  }
  return className
})
// 活动商品下架或者结束
const setImgs = computed(() => {
  return (item, val) => {
    const params = {
      status: false,
      imgs: beenShelves
    }
    if (props.type === 'skill') { // 秒杀
      if (item.status !== 1) { // 当前就显示下架图标
        params.imgs = beenShelves
        params.status = true
      } else if (!item.price && item.prodType === 2) { // 显示结束图标
        params.imgs = hasEnd
        params.status = true
      } else {
        params.status = false
      }
    } else if (props.type === 'discount') { // 拼团
      if (item.status !== 1) { // 当前就显示下架图标
        params.imgs = beenShelves
        params.status = true
      } else if (!item.price && item.prodType === 1) { // 显示结束图标
        params.imgs = hasEnd
        params.status = true
      } else {
        params.status = false
      }
    }

    if (val === 'show') {
      return params.status
    } else if (val === 'src') {
      return params.imgs
    }
  }
})

</script>
<style lang="scss" scoped>
@use './index.scss';
</style>
