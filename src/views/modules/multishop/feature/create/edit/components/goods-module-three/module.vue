<template>
  <div class="goods-module-three">
    <!-- 默认展示 start -->
    <template v-if="currentForm">
      <div class="goods-three-title">
        热卖推荐
      </div>
      <div class="goods-three-items">
        <el-image
          src=""
          fit="fill"
        >
          <template #error>
            <div class="image-slot">
              <img
                style="width: 27px"
                src="@/assets/micro-page/def.png"
                alt=""
              >
            </div>
          </template>
        </el-image>
        <div class="right-content">
          <div class="description">
            商品名称商品名称商品名称商品名称商品名称商品名称商品名称
          </div>
          <div class="right-actions">
            <div class="left-price">
              <div class="real-price">
                <span>￥</span>
                <span>59.</span>
                <span>90</span>
              </div>
              <div class="del-price">
                ￥100.00
              </div>
            </div>
            <div class="right-go">
              <div>去抢购</div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <!-- 默认展示 end -->
    <!-- 有配置信息 start -->
    <template v-else>
      <div class="goods-three-title">
        {{ moduleForm.mainTitle }}
      </div>
      <!-- 有商品信息 start -->
      <template v-if="moduleForm.goodsList && moduleForm.goodsList.length > 0">
        <template
          v-for="(item, index) in moduleForm.goodsList"
          :key="index"
        >
          <div class="goods-three-items">
            <div class="goods-three-items-imgs">
              <el-image
                :src="checkFileUrl(item.imgs)"
                fit="fill"
              >
                <template #error>
                  <div class="image-slot">
                    <img
                      style="width: 27px"
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
            <div class="right-content">
              <div class="description">
                {{ item.name }}
              </div>
              <div class="right-actions">
                <div class="left-price">
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
                <div class="right-go">
                  <div>去抢购</div>
                </div>
              </div>
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
          <div class="goods-three-items">
            <el-image fit="fill">
              <template #error>
                <div class="image-slot">
                  <img
                    style="width: 27px"
                    src="@/assets/micro-page/def.png"
                    alt=""
                  >
                </div>
              </template>
            </el-image>
            <div class="right-content">
              <div class="description">
                商品名称商品名称商品名称商品名称商品名称商品名称商品名称
              </div>
              <div class="right-actions">
                <div class="left-price">
                  <div class="real-price">
                    <span>￥</span>
                    <span>59.</span>
                    <span>90</span>
                  </div>
                  <div class="del-price">
                    ￥100.00
                  </div>
                </div>
                <div class="right-go">
                  <div>去抢购</div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
      <!-- 没有商品信息 end -->
    </template>
  </div>
</template>
<script setup>
import { formatPrice } from '@/utils'
const props = defineProps({
  config: { // 配置信息
    type: Object,
    default: () => {}
  }
})

const moduleForm = ref({})
const goodsArr = new Array(1)

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
  nextTick(() => {
    moduleForm.value = {
      ...newVal
    }
  })
}, { deep: true })

</script>
<style lang="scss" scoped>
@use './module.scss';
</style>
