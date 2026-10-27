<!--公共广告头部组件-->
<template>
  <div class="micro-header-ad-box">
    <!--预览控制区-->
    <div class="design-preview-controller">
      <div class="preview-header">
        <div class="preview-header-title">
          {{ title }}
        </div>
      </div>
    </div>
    <!--编辑工作区-->
    <div
      v-show="isShowEdit"
      class="design-editor-item design-hide-class"
    >
      <div class="design-config-editor">
        <!-- native modifier has been removed, please confirm whether the function has been affected  -->
        <el-form
          ref="formRef"
          :model="formData"
          label-width="100px"
          @submit.prevent
        >
          <el-form-item :label="$t('shopFeature.headerAd.showPosition')">
            <el-radio
              v-for="(itemPosition,indexPosition) in positions"
              :key="indexPosition"
              v-model="formData.position"
              :label="itemPosition.label"
            >
              {{ itemPosition.title }}
            </el-radio>
          </el-form-item>
          <el-form-item :label="$t('shopFeature.headerAd.showPages')">
            <el-checkbox-group v-model="formData.page">
              <el-checkbox
                v-for="(itemShowContent,indexShowContent) in pages"
                :key="indexShowContent"
                :label="itemShowContent.label"
              >
                {{ itemShowContent.title }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
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
  current: { // 当前排序索引 key
    type: Number,
    default: 0
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
const emit = defineEmits(['myCheckResult', 'showCheckForm', 'componentsValueChance', 'save'])

const title = $t('shopFeature.headerAd.pageTitle')
const positions = [
  { title: $t('shopFeature.headerAd.pageHeader'), label: 1 },
  { title: $t('shopFeature.headerAd.pageFooter'), label: 2 }
]
const pages = [
  { title: $t('shopFeature.headerAd.microPage'), label: 1 },
  { title: $t('shopFeature.headerAd.prodDetail'), label: 3 }
]
const formData = {
  position: 1,
  page: [1, 3]
}

watch(() => props.dataField, (val) => {
  if (val) {
    setFormData()
  }
})
watch(() => props.isStartCheckFieldRules, () => {
  myCheckResult(true)
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
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
