<template>
  <div class="component-manage-container">
    <div class="title">
      {{ $t('pcdecorate.componentTitle.component') }}
      <el-icon
        class="el-icon-close"
        @click="closeComponentManageContainer"
      >
        <Close />
      </el-icon>
    </div>
    <div class="title-border" />
    <div class="config-container">
      <div class="titles">
        页面名称
      </div>
      <div class="config-items">
        <el-input
          v-model.trim="smallPageName"
          maxlength="10"
          :placeholder="$t('pcdecorate.placeholder.pageName')"
        />
      </div>
    </div>
    <div class="config-container">
      <div class="titles">
        页面背景
      </div>
      <div class="config-items">
        <pick-color-component
          :define-color="pageBackground"
          :reset-color="'rgba(244, 244, 244, 1)'"
          @handle-change-color="handleBackColor"
        />
      </div>
    </div>
    <div class="top-header">
      <span>{{ $t('pcdecorate.componentTitle.componentSort') }}</span>
      <span @click="handelRemove">{{ $t('pcdecorate.componentTitle.clearComponent') }}</span>
    </div>
    <div class="component-list">
      <div
        v-if="isHeaderComponent.length > 0"
        class="items-header"
      >
        <div
          v-for="(item, index) in isHeaderComponent"
          :key="index"
          class="items-content"
        >
          <span>{{ $t(`pcdecorate.componentTitle.${item.rightConfigTitle}`) }}</span>
          <el-icon
            class="el-icon-delete"
            style="cursor: pointer"
            @click="handleHeaderDel(index)"
          >
            <Delete />
          </el-icon>
        </div>
      </div>
      <SlickList
        v-model:list="componentList"
        :use-drag-handle="true"
        axis="y"
        helper-class="drag-class"
        :transition-duration="300"
        :dragged-settling-duration="1"
        @update:list="componentSortInput"
      >
        <SlickItem
          v-for="(item, index) in componentList"
          :key="index"
          class="component-list-item"
          :index="index"
        >
          <div class="items-content">
            <div
              v-handle
              class="item-drag-box"
            />
            <span>{{ $t(`pcdecorate.componentTitle.${item.rightConfigTitle}`) }}  {{ item.customRemark || index }}</span>
            <div class="icon-con">
              <custom-remark-edit-popover
                :index="index"
                :current-edit-component="currentEditComponent"
                @set-current-component="setCurrentComponent"
                @save-edit="saveCustomRemark"
              />
              <el-icon
                :size="18"
                @click="handleDel(index)"
              >
                <Delete />
              </el-icon>
            </div>
          </div>
        </SlickItem>
      </SlickList>
    </div>

    <div
      v-if="currentUseComponents.length === 0"
      class="empty-template-pc"
    >
      {{ $t('shopFeature.edit.emptyTemplate') }}
    </div>
  </div>
</template>
<script setup>
import { SlickList, SlickItem, HandleDirective } from 'vue-slicksort' // 拖动组件
import pickColorComponent from '../../../common-component/pick-color/index.vue' // 选择颜色
import customRemarkEditPopover from '../../../../../components/custom-remark-edit-poppver/index.vue'

const vHandle = HandleDirective
const props = defineProps({
  currentUseComponents: { // 当前组件个数
    type: Array,
    default: () => []
  },
  headerComponent: { // 头部组件
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'handleSortComponent',
  'closeComponentManageContainer',
  'handleSingleRemove',
  'handleHeaderDel',
  'handleRemoveComponnent',
  'handlePageColor'
])

const componentList = ref([]) // 组件列表
const smallPageName = ref('') // 页面名称
const pageBackground = ref('rgba(244, 244, 244, 1)') // 页面背景
watch(() => props.currentUseComponents, (newVal) => {
  componentList.value = []
  newVal.forEach(item => {
    componentList.value.push(item)
  })
}, {
  deep: true
})
const isHeaderComponent = ref(props.headerComponent)
watch(() => props.headerComponent, (newVal) => {
  isHeaderComponent.value = newVal
}, {
  deep: true
})

// 关闭组件管理
const closeComponentManageContainer = () => {
  emit('closeComponentManageContainer')
}
// 组件排序
const componentSortInput = (newList) => {
  emit('handleSortComponent', newList)
}
// 删除组件
const handleDel = (index) => {
  emit('handleSingleRemove', index)
}
// 头部组件删除
const handleHeaderDel = (index) => {
  emit('handleHeaderDel', index)
}
// 清空组件
const handelRemove = () => {
  emit('handleRemoveComponnent')
}
// 页面背景
const handleBackColor = (color) => {
  pageBackground.value = color
  emit('handlePageColor', pageBackground)
}

// 自定义标签
const currentEditComponent = ref(null)
const currentEditComponentIndex = ref(0)
const setCurrentComponent = (index) => {
  currentEditComponent.value = componentList.value[index]
  currentEditComponentIndex.value = index
}
const saveCustomRemark = (remark) => {
  componentList.value[currentEditComponentIndex.value].customRemark = remark
}

defineExpose({ smallPageName, pageBackground })
</script>
<style lang="scss" scoped>
@use './index.scss';
</style>
