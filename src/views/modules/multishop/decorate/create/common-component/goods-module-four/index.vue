<template>
  <div class="goods-module4">
    <div class="goods-module-top">
      <el-image
        :src="checkFileUrl(config.bgImg)"
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
    </div>
    <div class="bottom-content">
      <template v-if="config.goodsList && config.goodsList.length > 0">
        <template
          v-for="(item, index) in config.goodsList"
          :key="index"
        >
          <div class="bottom-items">
            <div class="bottom-items-imgs">
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
            <div class="text-content">
              <div class="name">
                {{ item.name }}{{ item.description }}
              </div>
              <div class="price">
                <span>￥</span>
                <span>{{ getPrice(item.price, 'left') }}.</span>
                <span>{{ getPrice(item.price, 'right') }}</span>
              </div>
            </div>
          </div>
        </template>
      </template>
      <template v-else>
        <template
          v-for="(item, index) in defaultArr"
          :key="index"
        >
          <div class="bottom-items">
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
            <div class="text-content">
              <div class="name">
                {{ $t(`pcdecorate.goodsList.goodsName`) }}{{ $t(`pcdecorate.goodsList.goodsDescription`) }}
              </div>
              <div class="price">
                <span>￥</span>
                <span>{{ $t(`pcdecorate.goodsList.price`) }}</span>
                <span />
              </div>
            </div>
          </div>
        </template>
      </template>
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

const defaultArr = new Array(4)
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

</script>
<style lang="scss" scoped>
@use './index.scss';
</style>
