<!--公共广告头部组件-->
<template>
  <div class="micro-search-bar-box">
    <!--预览控制区-->
    <div class="design-preview-controller">
      <div
        class="search-con"
        :style="{background:formData.bgColor }"
      >
        <div
          class="micro-search-bar"
          :style="{height: formData.boxHeight + 'px',background:formData.boxColor, color: formData.textColor, borderRadius: formData.boxRadio+ 'px', justifyContent: formData.textAlgin }"
        >
          <el-icon class="el-icon-search">
            <Search />
          </el-icon>
          <div class="tit-text">
            {{ $t('shopFeature.searchBar.search') }}
          </div>
        </div>
      </div>
    </div>
    <!--编辑工作区-->
    <div
      v-show="isShowEdit"
      class="design-editor-item design-hide-class"
    >
      <div class="design-config-editor">
        <div class="design-editor-component-title">
          <div style="flex: 1;">
            {{ formData.title }}
            {{ currentComponent.customRemark }}
          </div>
          <custom-remark-edit-popover
            :index="currentUseComponents.findIndex(item => item.id === currentComponent.id)"
            :current-edit-component="currentEditComponent"
            @set-current-component="setCurrentComponent"
            @save-edit="saveCustomRemark"
          />
        </div>
        <el-form
          ref="formDataRef"
          label-width="100px"
          label-position="left"
          @submit.prevent
        >
          <el-form-item :label="$t('shopFeature.searchBar.showPos')">
            <el-radio
              v-for="(itemPosition,indexPosition) in positionType"
              :key="indexPosition"
              v-model="formData.position"
              :label="itemPosition.label"
            >
              {{ itemPosition.title }}
            </el-radio>
          </el-form-item>
          <el-form-item :label="$t('shopFeature.searchBar.textPos')">
            <el-radio
              v-for="(textItem,textIndex) in textAlgin"
              :key="textIndex"
              v-model="formData.textAlgin"
              :label="textItem.label"
            >
              {{ textItem.title }}
            </el-radio>
          </el-form-item>
          <el-form-item :label="$t('shopFeature.searchBar.boxStyle')">
            <el-radio
              v-for="(redioItem,styleIndex) in boxRadio"
              :key="styleIndex"
              v-model="formData.boxRadio"
              :label="redioItem.label"
            >
              {{ redioItem.title }}
            </el-radio>
          </el-form-item>
          <el-form-item :label="$t('shopFeature.searchBar.boxHeight')">
            <el-slider
              v-model="formData.boxHeight"
              style="width: 100%"
              :show-tooltip="showTooltip"
              show-input
              :min="28"
              :max="40"
              @input="changeBoxHeight(true)"
              @change="changeBoxHeight(false)"
            />
          </el-form-item>
          <el-form-item :label="$t('shopFeature.searchBar.bgColor')">
            <el-color-picker v-model="formData.bgColor" />
          </el-form-item>
          <el-form-item :label="$t('shopFeature.searchBar.boxColor')">
            <el-color-picker v-model="formData.boxColor" />
          </el-form-item>
          <el-form-item :label="$t('shopFeature.searchBar.textColor')">
            <el-color-picker v-model="formData.textColor" />
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script setup>
import './index.scss'
import customRemarkEditPopover from '../../../../../components/custom-remark-edit-poppver/index.vue'
/**
 * 创建新组件之后，在all-can-use-components中添加
 * 必须应用 microCreateMinis
 * 数据必须以formData包含
 * */
const props = defineProps({
  current: {
    type: Number,
    default: 0
  },
  currentUseComponents: {
    type: Array,
    default: () => {}
  },
  isCheckMySelf: { // 是否开始内部验证 比如提示弹窗等。。。
    type: Boolean,
    default: false
  },
  currentComponent: { // 当前组件
    type: Object,
    default: () => {}
  },
  indexKey: { // 当前组件排序索引 type_ + key
    type: String,
    default: ''
  },
  isShowEdit: { // 是否为编辑状态
    type: Boolean,
    default: false
  },
  dataField: { // 所有上传到后端的字段
    type: Object,
    default: () => {
    }
  },
  isStartCheckFieldRules: { // 是否开始校验规则
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['topFixed', 'setCurrentUseComponents', 'myCheckResult', 'showCheckForm', 'componentsValueChance', 'save'])

// 各项设置
const positionType = [
  { label: 1, title: $t('shopFeature.searchBar.normal') },
  { label: 2, title: $t('shopFeature.searchBar.topThenLock') }
]
const boxRadio = [
  { label: 2, title: $t('shopFeature.searchBar.square') },
  { label: 50, title: $t('shopFeature.searchBar.fillet') }
]
const textAlgin = [
  { label: 'start', title: $t('shopFeature.searchBar.left') },
  { label: 'center', title: $t('shopFeature.searchBar.center') }
]

const formData = reactive({
  title: $t('shopFeature.searchBar.search'),
  position: 1,
  boxRadio: 2,
  textAlgin: 'start',
  boxHeight: 28,
  bgColor: '#FFFFFF',
  boxColor: '#EEEEEE',
  textColor: '#999999'
})

const position = computed(() => {
  return formData.position
})
watch(position, (val) => {
  if (val === 2) {
    emit('setCurrentUseComponents', props.current)
    emit('topFixed')
  }
})

watch(() => props.dataField, (val) => {
  if (val) {
    setFormData()
  }
})
watch(() => props.isStartCheckFieldRules, () => {
  checkData()
})
watch(() => formData, (val) => {
  if (val) {
    emit('componentsValueChance', {
      indexKey: props.indexKey,
      current: props.current,
      dataField: val
    })
  }
}, {
  deep: true
})

onMounted(() => {
  setFormData()
})

/**
 * 开始验证
 */
const checkData = () => {
  myCheckResult(formData.title)
}
/* 控制滑块tooltip隐藏 */
const showTooltip = ref(true)
const changeBoxHeight = (t) => {
  showTooltip.value = t
}

/** 设置或者重设formData的数据 */
const setFormData = () => {
  if (props.dataField) {
    for (const el in props.dataField) {
      formData[el] = props.dataField[el]
    }
  }
}
/**
 * 返回校验结果
 * isHeader 是否为顶部 特殊情况
 * 结果：Boolean true false
 * */
const myCheckResult = ($isPass) => {
  emit('myCheckResult', {
    data: {
      isPass: $isPass,
      dataField: props.dataField,
      isHeader: (props.currentComponent.type.indexOf('config') !== -1),
      current: props.current
    }
  })
}

// 自定义标签
const currentEditComponent = ref({})
const setCurrentComponent = (index) => {
  currentEditComponent.value = props.currentUseComponents[index]
}
const saveCustomRemark = (remark) => {
  currentEditComponent.value.customRemark = remark
}

</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
