<template>
  <div class="goods-two-items">
    <div class="top-header">
      <span>{{ config.title }}</span>
      <img
        src="@/assets/pc-micro-page/goods_recommand.png"
        alt=""
      >
    </div>
    <div class="bottom-content">
      <template v-if="config.maingoodsList && config.maingoodsList.length > 0">
        <template
          v-for="(item, index) in config.maingoodsList"
          :key="index"
        >
          <div class="left-content">
            <div class="left-content-img">
              <el-image
                :src="checkFileUrl(item.imgs)"
                fit="fill"
              >
                <template #error>
                  <div class="image-slot">
                    <img
                      style="width: 24px"
                      src="@/assets/pc-micro-page/show-default.png"
                      alt=""
                    >
                  </div>
                </template>
              </el-image>
              <!-- 下架商品蒙版 start  -->
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
              <!-- 下架商品蒙版 end -->
            </div>

            <div class="title">
              {{ item.name }}{{ item.description }}
            </div>
            <div class="totals">
              <span>￥</span>
              <span>{{ getPrice(item.price, 'left') }}.</span>
              <span>{{ getPrice(item.price, 'right') }}</span>
            </div>
          </div>
        </template>
      </template>
      <template v-else>
        <div class="left-content">
          <el-image
            src=""
            fit="fill"
          >
            <template #error>
              <div class="image-slot">
                <img
                  style="width: 24px"
                  src="@/assets/pc-micro-page/show-default.png"
                  alt=""
                >
              </div>
            </template>
          </el-image>
          <div class="title">
            {{ $t(`pcdecorate.goodsList.goodsName`) }}{{ $t(`pcdecorate.goodsList.goodsDescription`) }}
          </div>
          <div class="totals">
            <span>￥</span>
            <span>{{ $t(`pcdecorate.goodsList.price`) }}</span>
            <span />
          </div>
        </div>
      </template>
      <div class="right-content">
        <template v-if="config.othergoodsList && config.othergoodsList.length > 0">
          <div class="right-top-content">
            <template
              v-for="(item, index) in config.othergoodsList.slice(0, 3)"
              :key="index"
            >
              <div class="right-items">
                <div class="right-content-img">
                  <el-image
                    :src="checkFileUrl(item.imgs)"
                    fit="fill"
                  >
                    <template #error>
                      <div class="image-slot">
                        <img
                          style="width: 24px"
                          src="@/assets/pc-micro-page/show-default.png"
                          alt=""
                        >
                      </div>
                    </template>
                  </el-image>
                  <!-- 下架商品蒙版 start  -->
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
                  <!-- 下架商品蒙版 end -->
                </div>
                <div class="goods-message">
                  <div class="name">
                    {{ item.name }}{{ item.description }}
                  </div>
                  <div class="totals">
                    <div
                      class="actual"
                      :style="setPriceLength(item, 'style')"
                    >
                      <span>￥</span>
                      <span>{{ getPrice(item.price, 'left') }}.</span>
                      <span>{{ getPrice(item.price, 'right') }}</span>
                    </div>
                    <div
                      v-show="setPriceLength(item, 'boolean') && item.orignPrice >= item.price"
                      class="del-price"
                    >
                      {{ getPrice(item.orignPrice, 'left') }}.{{ getPrice(item.orignPrice, 'right') }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div class="right-bottom-content">
            <template
              v-for="(item, index) in config.othergoodsList.slice(3)"
              :key="index"
            >
              <div class="right-items">
                <div class="right-content-img">
                  <el-image
                    :src="checkFileUrl(item.imgs)"
                    fit="fill"
                  >
                    <template #error>
                      <div class="image-slot">
                        <img
                          style="width: 24px"
                          src="@/assets/pc-micro-page/show-default.png"
                          alt=""
                        >
                      </div>
                    </template>
                  </el-image>
                  <!-- 下架商品蒙版 start -->
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
                  <!-- 下架商品蒙版 end -->
                </div>
                <div class="goods-message">
                  <div class="name">
                    {{ item.name }}{{ item.description }}
                  </div>
                  <div class="totals">
                    <div
                      class="actual"
                      :style="setPriceLength(item, 'style')"
                    >
                      <span>￥</span>
                      <span>{{ getPrice(item.price, 'left') }}.</span>
                      <span>{{ getPrice(item.price, 'right') }}</span>
                    </div>
                    <div
                      v-show="setPriceLength(item, 'boolean')"
                      class="del-price"
                    >
                      {{ getPrice(item.orignPrice, 'left') }}.{{ getPrice(item.orignPrice, 'right') }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </template>
        <template v-else>
          <div class="right-top-content">
            <template
              v-for="(item, index) in defaultOtherArr.slice(0, 3)"
              :key="index"
            >
              <div class="right-items">
                <el-image
                  src=""
                  fit="fill"
                >
                  <template #error>
                    <div class="image-slot">
                      <img
                        style="width: 24px"
                        src="@/assets/pc-micro-page/show-default.png"
                        alt=""
                      >
                    </div>
                  </template>
                </el-image>
                <div class="goods-message">
                  <div class="name">
                    {{ $t(`pcdecorate.goodsList.goodsName`) }}{{ $t(`pcdecorate.goodsList.goodsDescription`) }}
                  </div>
                  <div class="totals">
                    <div class="actual">
                      <span>￥</span>
                      <span>{{ $t(`pcdecorate.goodsList.price`) }}</span>
                      <span />
                    </div>
                    <div class="del-price">
                      ￥0.00
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div class="right-bottom-content">
            <template
              v-for="(item, index) in defaultOtherArr.slice(3)"
              :key="index"
            >
              <div class="right-items">
                <el-image
                  src=""
                  fit="fill"
                >
                  <template #error>
                    <div class="image-slot">
                      <img
                        style="width: 24px"
                        src="@/assets/pc-micro-page/show-default.png"
                        alt=""
                      >
                    </div>
                  </template>
                </el-image>
                <div class="goods-message">
                  <div class="name">
                    {{ $t(`pcdecorate.goodsList.goodsName`) }}{{ $t(`pcdecorate.goodsList.goodsDescription`) }}
                  </div>
                  <div class="totals">
                    <div class="actual">
                      <span>￥</span>
                      <span>{{ $t(`pcdecorate.goodsList.price`) }}</span>
                      <span />
                    </div>
                    <div class="del-price">
                      ￥0.00
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script setup>
defineProps({
  config: { // 配置信息
    type: Object,
    default: () => {}
  }
})

const defaultOtherArr = new Array(6)
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
// 设置价格样式
const setPriceLength = computed(() => {
  return (val, type) => {
    let status = true
    let style = {}
    if (val && val.price.toString().length >= 4) {
      status = false
      style = 'width: calc(100% - 5px);text-overflow: ellipsis;overflow: hidden;word-break: break-all;white-space: nowrap'
    } else {
      status = true
      style = ''
    }
    if (type === 'style') {
      return style
    } else if (type === 'boolean') {
      return status
    }
  }
})

</script>
<style lang="scss" scoped>
@use './index.scss';
</style>
