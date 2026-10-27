<template>
  <div class="showAllComponents">
    <div
      id="allComponents"
      class="all-grouped all-can-use-components"
    >
      <div class="add-component-grouped">
        <div class="add-component-grouped-item">
          <div class="add-grouped-item-title">
            {{ $t('pcdecorate.baseComponent.base') }}
          </div>
          <div class="add-grouped-item-list">
            <VueDraggableNext
              :list="componentLists"
              :group="{ name: 'people', pull: 'clone', put: false}"
              :clone="cloneDog"
              ghost-class="ghost"
              :disabled="!isDrag"
            >
              <div
                v-for="(item, index) in baseList"
                :key="index"
                class="add-grouped-item-list-btn"
              >
                <div
                  class="add-grouped-item-list-con"
                  @click="addComponent(item, index)"
                >
                  <div
                    class="add-grouped-item-list-btn-title"
                    :class="{'active': item.type === currentActiveIndex}"
                  >
                    <div class="item-pic-container">
                      <img
                        v-if="item.type === currentActiveIndex "
                        :src="item.picActive"
                        alt=""
                      >
                      <img
                        v-else
                        :src="item.pic"
                        alt=""
                      >
                    </div>
                    <div>{{ $t(`pcdecorate.baseComponent.${item.title}`) }}</div>
                  </div>
                </div>
              </div>
            </VueDraggableNext>
          </div>
          <div class="add-grouped-item-title">
            {{ $t('pcdecorate.marketingActive.marketing') }}
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
                v-for="(item, index) in shopDisList"
                :key="index"
                class="add-grouped-item-list-btn"
              >
                <div @click="addComponent(item, index)">
                  <div
                    class="add-grouped-item-list-btn-title"
                    :class="{'active': item.type === currentActiveIndex}"
                  >
                    <div class="item-pic-container">
                      <img
                        v-if="item.type === currentActiveIndex "
                        :src="item.picActive"
                        alt=""
                      >
                      <img
                        v-else
                        :src="item.pic"
                        alt=""
                      >
                    </div>
                    <div>{{ $t(`pcdecorate.marketingActive.${item.title}`) }}</div>
                  </div>
                </div>
              </div>
            </VueDraggableNext>
          </div>
          <div class="add-grouped-item-title">
            {{ $t('pcdecorate.extendComponent.extend') }}
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
                v-for="(item, index) in extendComponentList"
                :key="index"
                class="add-grouped-item-list-btn"
              >
                <div @click="addComponent(item, index)">
                  <div
                    class="add-grouped-item-list-btn-title"
                    :class="{'active': item.type === currentActiveIndex}"
                  >
                    <div class="item-pic-container">
                      <img
                        v-if="item.type === currentActiveIndex "
                        :src="item.picActive"
                        alt=""
                      >
                      <img
                        v-else
                        :src="item.pic"
                        alt=""
                      >
                    </div>
                    <div>{{ $t(`pcdecorate.extendComponent.${item.title}`) }}</div>
                  </div>
                </div>
              </div>
            </VueDraggableNext>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { configComponentList } from '../configComponent'
import { VueDraggableNext } from 'vue-draggable-next'
const emit = defineEmits(['addComponent'])
const isDrag = ref(true)
const componentLists = ref(configComponentList) // [ // 所有可用的组件
const currentActiveIndex = ref('') // 当前选中的组件
const baseList = ref([]) // 基础组件
const shopDisList = ref([]) // 营销活动
const extendComponentList = ref([]) // 扩展组件
onMounted(() => {
  groupcomponent()
})
const groupcomponent = () => {
  const isBaseList = []
  const isShopDisList = []
  const isExtendComponentList = []
  for (let i = 0; i < componentLists.value.length; i++) {
    const item = componentLists.value[i]
    if (item.currentType === 'basic') {
      isBaseList.push(item)
    } else if (item.currentType === 'mark_activity') {
      isShopDisList.push(item)
    } else if (item.currentType === 'extend_component') {
      isExtendComponentList.push(item)
    }
  }
  baseList.value = isBaseList
  shopDisList.value = isShopDisList
  extendComponentList.value = isExtendComponentList
}
const cloneDog = ({ type }) => {
  return componentLists.value.find(x => x.type === type)
}
// 点击左边组件进行添加
const addComponent = (item) => {
  currentActiveIndex.value = item.type
  emit('addComponent', item)
}

</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
