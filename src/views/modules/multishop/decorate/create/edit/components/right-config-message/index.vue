<template>
  <div class="right-config-container">
    <div class="title">
      <div class="text-con">
        {{ $t(`pcdecorate.componentTitle.${configMessage.currentConfigTitle}`) }}
        <span class="custom-remark">{{ showCustomRemark }}</span>
      </div>
      <div class="title-icon-box">
        <custom-remark-edit-popover
          :index="currentIndex"
          :current-edit-component="configMessage"
          @set-current-component="setCurrentComponent"
          @save-edit="saveCustomRemark"
        />
        <el-icon
          :size="18"
          @click="closeRightConfigContainer"
        >
          <Close />
        </el-icon>
      </div>
    </div>
    <div class="title-border" />
    <div class="show-components">
      <div
        v-for="(item, index) in currentUseComponents"
        :key="index"
      >
        <!-- 商城招牌配置信息 start -->
        <template v-if="item.type === 'shop_signs'">
          <store-signate-tool
            v-show="configMessage.Ref === item.Ref+'-1'"
            :ref="item.Ref+index"
            :current-ref="configMessage.Ref"
            :current-item="configMessage"
            :edit-item="item.rightConfigMessage"
            @handle-update-message="handleUpdateMessage"
          />
        </template>
        <!-- 商城招牌配置信息 end -->
        <!-- 图片轮播配置信息 start -->
        <template v-if="item.type === 'picture_by'">
          <picture-shuffling-tool
            v-show="configMessage.Ref === item.Ref+index"
            :ref="item.Ref+index"
            :current-ref="configMessage.Ref"
            :current-item="configMessage"
            :edit-item="item.rightConfigMessage"
            @handle-update-message="handleUpdateMessage"
          />
        </template>
        <!-- 图片轮播配置信息 end -->
        <!-- 辅助间隔配置信息 start -->
        <template v-if="item.type === 'auxiliary_interval'">
          <interval-component-tool
            v-show="configMessage.Ref === item.Ref+index"
            :ref="item.Ref+index"
            :current-ref="configMessage.Ref"
            :current-item="configMessage"
            :edit-item="item.rightConfigMessage"
            @handle-update-message="handleUpdateMessage"
          />
        </template>
        <!-- 辅助间隔配置信息 end -->
        <!-- 楼层标题配置信息 start -->
        <template v-if="item.type === 'floor_title'">
          <floor-title-component-tool
            v-show="configMessage.Ref === item.Ref+index"
            :ref="item.Ref+index"
            :current-ref="configMessage.Ref"
            :current-item="configMessage"
            :edit-item="item.rightConfigMessage"
            @handle-update-message="handleUpdateMessage"
          />
        </template>
        <!-- 楼层标题配置信息 end -->
        <!-- 商品列表配置信息 start -->
        <template v-if="item.type === 'goods_list'">
          <good-list-component-tool
            v-show="configMessage.Ref === item.Ref+index"
            :ref="item.Ref+index"
            :current-ref="configMessage.Ref"
            :current-item="configMessage"
            :edit-item="item.rightConfigMessage"
            @handle-update-message="handleUpdateMessage"
          />
        </template>
        <!-- 商品列表配置信息 end -->
        <!-- 万能热区配置信息 start -->
        <template v-if="item.type === 'universal_hotspot'">
          <hot-spot-component-tool
            v-show="configMessage.Ref === item.Ref+index"
            :ref="item.Ref+index"
            :current-ref="configMessage.Ref"
            :current-item="configMessage"
            :edit-item="item.rightConfigMessage"
            @handle-update-message="handleUpdateMessage"
          />
        </template>
        <!-- 万能热区配置信息 end -->

        <!-- 限时秒杀配置信息 start -->
        <template v-if="item.type === 'limited_skill'">
          <limited-skill-component-tool
            v-show="configMessage.Ref === item.Ref+index"
            :ref="item.Ref+index"
            :current-ref="configMessage.Ref"
            :current-item="configMessage"
            :edit-item="item.rightConfigMessage"
            @handle-update-message="handleUpdateMessage"
          />
        </template>
        <!-- 限时秒杀配置信息 end -->
        <!-- 优惠团购配置信息 start -->
        <template v-if="item.type === 'discount_coupon'">
          <discount-coupon-component-tool
            v-show="configMessage.Ref === item.Ref+index"
            :ref="item.Ref+index"
            :current-ref="configMessage.Ref"
            :current-item="configMessage"
            :edit-item="item.rightConfigMessage"
            @handle-update-message="handleUpdateMessage"
          />
        </template>
        <!-- 优惠团购配置信息 end -->
        <!-- 商品模块1配置信息 start -->
        <template v-if="item.type === 'goods_module1'">
          <goods-module-component-one-tool
            v-show="configMessage.Ref === item.Ref+index"
            :ref="item.Ref+index"
            :current-ref="configMessage.Ref"
            :current-item="configMessage"
            :edit-item="item.rightConfigMessage"
            @handle-update-message="handleUpdateMessage"
          />
        </template>
        <!-- 商品模块1配置信息 end -->
        <!-- 商品模块2配置信息 start -->
        <template v-if="item.type === 'goods_module2'">
          <goods-module-component-two-tool
            v-show="configMessage.Ref === item.Ref+index"
            :ref="item.Ref+index"
            :current-ref="configMessage.Ref"
            :current-item="configMessage"
            :edit-item="item.rightConfigMessage"
            @handle-update-message="handleUpdateMessage"
          />
        </template>
        <!-- 商品模块2配置信息 end -->
        <!-- 商品模块3配置信息 start -->
        <template v-if="item.type === 'goods_module3'">
          <goods-module-component-three-tool
            v-show="configMessage.Ref === item.Ref+index"
            :ref="item.Ref+index"
            :current-ref="configMessage.Ref"
            :current-item="configMessage"
            :edit-item="item.rightConfigMessage"
            @handle-update-message="handleUpdateMessage"
          />
        </template>
        <!-- 商品模块3配置信息 end -->
        <!-- 商品模块4配置信息 start -->
        <template v-if="item.type === 'goods_module4'">
          <goods-module-component-four-tool
            v-show="configMessage.Ref === item.Ref+index"
            :ref="item.Ref+index"
            :current-ref="configMessage.Ref"
            :current-item="configMessage"
            :edit-item="item.rightConfigMessage"
            @handle-update-message="handleUpdateMessage"
          />
        </template>
        <!-- 商品模块4配置信息 end -->
        <!-- 商品模块5配置信息 start -->
        <template v-if="item.type === 'goods_module5'">
          <goods-module-component-five-tool
            v-show="configMessage.Ref === item.Ref+index"
            :ref="item.Ref+index"
            :current-ref="configMessage.Ref"
            :current-item="configMessage"
            :edit-item="item.rightConfigMessage"
            @handle-update-message="handleUpdateMessage"
          />
        </template>
        <!-- 商品模块5配置信息 end -->
      </div>
    </div>
  </div>
</template>
<script setup>
// 基础组件配置信息
import storeSignateTool from '../basic-component/store-signate/components/right-tool.vue' // 商家招牌配置信息组件
import pictureShufflingTool from '../basic-component/picture-shuffling/components/right-tool.vue' // 图片轮播配置信息组件
import intervalComponentTool from '../basic-component/interval-component/components/right-tool.vue' // 辅助间隔配置组件
import floorTitleComponentTool from '../basic-component/floor-title-component/components/right-tool.vue' // 楼层标题配置组件
import goodListComponentTool from '../basic-component/good-list-component/components/right-tool.vue' // 商品列表配置组件
import hotSpotComponentTool from '../basic-component/hot-spot-component/components/right-tool.vue' // 万能热区配置组件
// 营销活动配置信息
import limitedSkillComponentTool from '../marketing-activities/limited-skill-component/components/right-tool.vue' // 限时秒杀配置组件
import discountCouponComponentTool from '../marketing-activities/discount-coupon-component/components/right-tool.vue' // 优惠团购配置组件
// 扩展组件配置信息
import goodsModuleComponentOneTool from '../extend-component/goods-module-component-one/components/right-tool.vue' // 商品模块1配置组件
import goodsModuleComponentTwoTool from '../extend-component/goods-module-component-two/components/right-tool.vue' // 商品模块2配置组件
import goodsModuleComponentThreeTool from '../extend-component/goods-module-component-three/components/right-tool.vue' // 商品模块3配置组件
import goodsModuleComponentFourTool from '../extend-component/goods-module-component-four/components/right-tool.vue' // 商品模块4配置组件
import goodsModuleComponentFiveTool from '../extend-component/goods-module-component-five/components/right-tool.vue' // 商品模块5配置组件
import { Close } from '@element-plus/icons-vue'
import customRemarkEditPopover from '../../../../../components/custom-remark-edit-poppver/index.vue'

const props = defineProps({
  configMessage: { // 配置信息
    type: Object,
    default: () => {}
  },
  currentUseComponents: { // 当前页面编辑的所有组件
    type: Array,
    default: () => []
  },
  operationType: { // 当前的操作类型
    type: String,
    default: () => ''
  },
  currentIndex: {
    type: [String, Number],
    default: ''
  }
})
const emit = defineEmits(['closeRightConfigContainer', 'handleUpdateMessage', 'handleUpdateCustomRemark'])

const showCustomRemark = ref('')
watch(() => props.configMessage, newVal => {
  showCustomRemark.value = newVal.customRemark
})
let remarkIndex = 0
const setCurrentComponent = (index) => {
  remarkIndex = index
}
const saveCustomRemark = (remark) => {
  const newConfigMessage = Object.assign({}, props.configMessage)
  newConfigMessage.customRemark = remark
  showCustomRemark.value = remark
  emit('handleUpdateCustomRemark', newConfigMessage, remarkIndex)
}

// 关闭工具配置栏
const closeRightConfigContainer = () => {
  emit('closeRightConfigContainer')
}
// 验证各个组件
const { proxy } = getCurrentInstance()
const handleChangeValidate = () => {
  // 根据配置的组件，对每个组件进行验证
  const arr = []
  props.currentUseComponents.forEach((item, index) => {
    if (proxy.$refs[item.Ref + index]) {
      const obj = proxy.$refs[item.Ref + index][0]?.handleValidate()
      // 提示：组件名称 + 自定义名称 + 提示语
      obj.message = $t(`pcdecorate.componentTitle.${item.rightConfigTitle}`) + (item.customRemark ? (' ' + item.customRemark) : '') + '：' + obj.message
      arr.push(obj)
    }
  })
  return arr
}
// 同步有边编辑的数据
const handleUpdateMessage = (obj) => {
  emit('handleUpdateMessage', obj)
}
defineExpose({ handleChangeValidate })
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
