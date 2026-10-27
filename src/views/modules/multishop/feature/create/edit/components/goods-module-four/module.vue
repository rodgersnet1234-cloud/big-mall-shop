<template>
  <div class="goods-module-four">
    <!-- 默认显示 start -->
    <template v-if="currentForm">
      <div class="top-image">
        <el-image
          src=""
          fit="fill"
        >
          <template #error>
            <div class="image-slot">
              <img
                style="width: 27px"
                src="@/assets/micro-page/def.png"
              >
            </div>
          </template>
        </el-image>
      </div>
      <div class="bottom-content">
        <div class="bottom-items">
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
          <div class="goods-description">
            商品名称商品名称商品名称
          </div>
          <div class="bottom-actions">
            <div class="real-price">
              <span>￥</span>
              <span>25.</span>
              <span>90</span>
            </div>
            <div class="add-carts">
              +
            </div>
          </div>
        </div>
        <div class="bottom-items">
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
          <div class="goods-description">
            商品名称商品名称商品名称
          </div>
          <div class="bottom-actions">
            <div class="real-price">
              <span>￥</span>
              <span>25.</span>
              <span>90</span>
            </div>
            <div class="add-carts">
              +
            </div>
          </div>
        </div>
        <div class="bottom-items">
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
          <div class="goods-description">
            商品名称商品名称商品名称
          </div>
          <div class="bottom-actions">
            <div class="real-price">
              <span>￥</span>
              <span>25.</span>
              <span>90</span>
            </div>
            <div class="add-carts">
              +
            </div>
          </div>
        </div>
      </div>
    </template>
    <!-- 默认显示 end -->
    <!-- 有配置信息 start -->
    <template v-else>
      <div class="top-image">
        <el-image
          :src="checkFileUrl(config.topImg)"
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
      </div>
      <div class="bottom-content">
        <!-- 有商品数据 start -->
        <template v-if="config.goodsList.length > 0">
          <template
            v-for="(item, index) in config.goodsList"
            :key="index"
          >
            <div class="bottom-items">
              <div class="bottom-items-img">
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
              <div class="goods-description">
                {{ item.name }}
              </div>
              <div class="bottom-actions">
                <div class="real-price">
                  <span>￥</span>
                  <span>{{ getPrice(item.price, 'left') }}.</span>
                  <span>{{ getPrice(item.price, 'right') }}</span>
                </div>
                <div class="add-carts">
                  +
                </div>
              </div>
            </div>
          </template>
        </template>
        <!-- 有商品数据 end -->
        <!-- 没有商品数据 start -->
        <template v-else>
          <template
            v-for="(item, index) in goodsArr"
            :key="index"
          >
            <div class="bottom-items">
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
              <div class="goods-description">
                商品名称商品名称商品名称
              </div>
              <div class="bottom-actions">
                <div class="real-price">
                  <span>￥</span>
                  <span>25.</span>
                  <span>90</span>
                </div>
                <div class="add-carts">
                  +
                </div>
              </div>
            </div>
          </template>
        </template>
        <!-- 没有商品数据 end -->
      </div>
    </template>
    <!-- 有配置信息 end -->
  </div>
</template>
<script setup>
const props = defineProps({
  config: { // 配置信息
    type: Object,
    default: () => {}
  }
})

const moduleForm = ref({})
const goodsArr = new Array(3)
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
}, {
  deep: true
})

</script>
<style lang="scss" scoped>
@use './module.scss';
</style>
