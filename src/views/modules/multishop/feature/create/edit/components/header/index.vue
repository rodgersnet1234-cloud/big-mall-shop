<!--结构必须如下 创建新组件是可以复制以下html-->
<!--
<div class="自定义class">
  <div class="design-preview-controller">
     预览区域
  </div>
  <div class="design-editor-item design-hide-class" v-if="isShowEdit">
      <div class="design-config-editor">
      <div class="design-editor-component-title">组件名称(如果为顶部配置组件可以不要该dom)</div>
      编辑区域
      </div>
  </div>
</div>
-->
<template>
  <div class="micro-header-box">
    <!--预览控制区-->
    <div class="design-preview-controller">
      <div class="preview-header">
        <div class="preview-header-title">
          {{ formData.title || $t('shopFeature.header.microTitle') }}
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
          {{ $t('shopFeature.headerAd.pageHeader') }}
        </div>
        <div style="padding: 20px 0;background: #fff">
          <el-form
            ref="formDataRef"
            :model="formData"
            label-width="100px"
            @submit.prevent
          >
            <el-form-item
              :label="$t('shopFeature.header.pageName')"
              prop="title"
              :rules="{
                required: true, message: $t('shopFeature.header.pageNameCanntEmpty'), trigger: 'blur'
              }"
            >
              <el-input
                v-model.trim="formData.title"
                maxlength="10"
                :placeholder="$t('shopFeature.header.pageNamePlaceholder')"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
/**
 * 创建新组件之后，在all-can-use-components中添加
 * 必须应用 microCreateMinis
 * 数据必须以formData包含
 * */
const props = defineProps({
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
const emit = defineEmits(['myCheckResult', 'showCheckForm', 'componentsValueChance', 'save', 'onErrorMessageTip'])

watch(() => props.dataField, (val) => {
  if (val) {
    setFormData()
  }
})

watch(() => props.isStartCheckFieldRules, () => {
  checkData()
})

const formData = reactive({
  title: '',
  description: '',
  category: '',
  gmtStart: ''
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
let errorMessage = '' // 错误提示信息
const checkData = () => {
  let isPass = true
  if (!formData.title.trim()) {
    isPass = false
    errorMessage = $t('shopFeature.header.pageNameCanntEmpty')
  }
  if (isPass) {
    myCheckResult(isPass)
  } else {
    showCheckForm()
    emit('onErrorMessageTip', {
      customRemark: '',
      rightConfigTitle: $t('shopFeature.headerAd.pageHeader'),
      errorMessage
    })
  }
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
/**
 * 可选
 * 当子组件不符合规则时，是否调用element ui 默认的规则判断
 * 需要默认结构为form
 * */
const formDataRef = ref(null)
const showCheckForm = (cb) => {
  nextTick(() => {
    if (formDataRef.value) {
      formDataRef.value.validate((valid) => {
        if (valid) {
          if (cb) cb(valid)
        } else {
          if (cb) cb(valid)
        }
      })
    }
  })
}

</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
