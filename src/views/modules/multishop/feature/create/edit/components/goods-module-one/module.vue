<template>
  <div class="module-one-component">
    <!-- 默认显示 start -->
    <template v-if="currentForm">
      <div
        class="module-one-header"
        :style="{height: (28 + config.titleHeight) + 'px'}"
      >
        <div
          class="main-title"
          style="font-size: 16px; color: #333;"
        >
          {{ moduleForm.mainTitle }}
        </div>
        <div
          class="sub-title"
          :style="{
            'color': config.subTitleColor,
            'font-size': config.subTitleSize + 'px'}"
        >
          {{ moduleForm.subTitle }}
        </div>
      </div>
      <div class="module-one-goodsList">
        <div class="goods-items">
          <el-image fit="fill">
            <template #error>
              <div class="image-slot">
                <img
                  style="width: 14px"
                  src="@/assets/micro-page/def.png"
                  alt=""
                >
              </div>
            </template>
          </el-image>
          <div class="real-price">
            <span>￥</span>
            <span>9.</span>
            <span>90</span>
          </div>
          <div class="del-price">
            ￥40.00
          </div>
        </div>
        <div class="goods-items">
          <el-image fit="fill">
            <template #error>
              <div class="image-slot">
                <img
                  style="width: 14px"
                  src="@/assets/micro-page/def.png"
                  alt=""
                >
              </div>
            </template>
          </el-image>
          <div class="real-price">
            <span>￥</span>
            <span>9.</span>
            <span>90</span>
          </div>
          <div class="del-price">
            ￥40.00
          </div>
        </div>
      </div>
    </template>
    <!-- 默认显示 end -->
    <!-- 有配置信息 start -->
    <template v-else>
      <div
        class="module-one-header"
        :style="{height: (28 + config.titleHeight) + 'px'}"
      >
        <div
          class="main-title"
          :style="{
            'color': moduleForm.mainTitleColor,
            'font-size': moduleForm.mainTitleSize + 'px'}"
        >
          {{ moduleForm.mainTitle }}
        </div>
        <div
          class="sub-title"
          :style="{
            'color': moduleForm.subTitleColor,
            'font-size': moduleForm.subTitleSize + 'px'}"
        >
          {{ moduleForm.subTitle }}
        </div>
      </div>
      <div class="module-one-goodsList">
        <!-- 有商品信息 start -->
        <template v-if="moduleForm.goodsList.length > 0">
          <template
            v-for="(item, index) in moduleForm.goodsList"
            :key="index"
          >
            <div class="goods-items">
              <div class="goods-items-img">
                <el-image
                  :src="checkFileUrl(item.imgs)"
                  fit="fill"
                >
                  <template #error>
                    <div class="image-slot">
                      <img
                        style="width: 14px"
                        src="@/assets/micro-page/def.png"
                        alt=""
                      >
                    </div>
                  </template>
                </el-image>
                <!-- 下架商品蒙版 start -->
                <div
                  v-if="item.status != 1"
                  class="imgs_shelves"
                >
                  <img
                    class="been_imgs"
                    src="@/assets/pc-micro-page/been_shelves.png"
                  >
                </div>
                <!-- 下架商品蒙版 end -->
              </div>
              <div class="real-price">
                <span>￥</span>
                <span>{{ getPrice(item.price, 'left') }}.</span>
                <span>{{ getPrice(item.price, 'right') }}</span>
              </div>
              <div
                v-if="item.orignPrice >= item.price"
                class="del-price"
              >
                ￥{{ formatPrice(item.orignPrice, 1 ).toFixed(2) }}
              </div>
            </div>
          </template>
        </template>
        <!-- 有商品信息 end -->
        <!-- 没有商品信息 start -->
        <template v-else>
          <template
            v-for="(item, index) in goodsArr"
            :key="index"
          >
            <div class="goods-items">
              <el-image fit="fill">
                <template #error>
                  <div class="image-slot">
                    <img
                      style="width: 14px"
                      src="@/assets/micro-page/def.png"
                      alt=""
                    >
                  </div>
                </template>
              </el-image>
              <div class="real-price">
                <span>￥</span>
                <span>9.</span>
                <span>90</span>
              </div>
              <div class="del-price">
                ￥40.00
              </div>
            </div>
          </template>
        </template>
        <!-- 没有商品信息 end -->
      </div>
    </template>
    <!-- 有配置信息 end -->
  </div>
</template>
<script setup>
import { formatPrice } from '@/utils/index'
const props = defineProps({
  config: { // 配置信息
    type: Object,
    default: () => {}
  }
})

const moduleForm = ref({})
const goodsArr = new Array(2)

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
const currentForm = computed(() => {
  return JSON.stringify(moduleForm.value) === '{}'
})
watch(() => props.config, (newVal) => {
  moduleForm.value = {
    ...newVal
  }
}, {
  immediate: true,
  deep: true
})

</script>
<style lang="scss" scoped>
@use './module.scss';
</style>
