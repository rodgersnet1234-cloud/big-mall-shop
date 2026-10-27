<template>
  <div class="micro-title-text">
    <div class="design-preview-controller">
      <div
        class="title-text-content"
        :style="{textAlign:formData.align}"
      >
        <div
          class="title-text-title"
          :style="{fontSize:formData.titleSize+'px',fontWeight:formData.titleWeight, 'width':!formData.isLink?'100%':formData.linkStyle==1?'80%':formData.linkStyle==2?'75%':'90%'}"
        >
          {{ formData.title }}
        </div>
        <div
          v-if="formData.isLink"
          class="show-more"
        >
          <span v-if="formData.linkStyle!==3">{{ formData.linkText }} </span>
          <el-icon
            v-if="formData.linkStyle!==1"
            class="el-icon-arrow-right"
          >
            <ArrowRight />
          </el-icon>
        </div>
        <div
          v-if="formData.desc"
          class="title-text-desc"
          :style="{fontSize:formData.descSize+'px',fontWeight:formData.descWeight}"
        >
          {{ formData.desc }}
        </div>
      </div>
    </div>
    <div
      v-show="isShowEdit"
      class="design-editor-item design-hide-class"
    >
      <div class="design-config-editor">
        <div class="design-editor-component-title">
          <div style="flex: 1;">
            {{ $t('shopFeature.titText.titText') }}
            {{ currentComponent.customRemark }}
          </div>
          <custom-remark-edit-popover
            :index="currentUseComponents.findIndex(item => item.id === currentComponent.id)"
            :current-edit-component="currentEditComponent"
            @set-current-component="setCurrentComponent"
            @save-edit="saveCustomRemark"
          />
        </div>
        <div class="design-editor-component-container">
          <el-form
            ref="formDataRef"
            class="edit-form"
            :model="formData"
            @submit.prevent
          >
            <el-form-item
              prop="title"
              :rules="rules.title"
            >
              <div><span class="required">*</span>{{ $t('shopFeature.titText.titContent') }}</div>
              <el-input
                v-model="formData.title"
                :maxlength="100"
                :placeholder="$t('shopFeature.titText.titContent')"
              />
            </el-form-item>
            <el-form-item>
              <div>{{ $t('shopFeature.titText.decsContent') }}</div>
              <el-input
                v-model="formData.desc"
                type="textarea"
                maxlength="100"
                :rows="3"
                :placeholder="$t('shopFeature.titText.decsContentPlaceholder')"
              />
            </el-form-item>
            <el-form-item :label="$t('shopFeature.titText.showPos')">
              <el-radio-group v-model="formData.align">
                <el-radio label="left">
                  {{ $t('shopFeature.titText.left') }}
                </el-radio>
                <el-radio label="center">
                  {{ $t('shopFeature.titText.center') }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('shopFeature.titText.titSize')">
              <el-radio-group v-model="formData.titleSize">
                <el-radio label="12">
                  12px
                </el-radio>
                <el-radio label="14">
                  14px
                </el-radio>
                <el-radio label="16">
                  16px
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('shopFeature.titText.titWeight')">
              <el-radio-group v-model="formData.titleWeight">
                <el-radio label="500">
                  {{ $t('shopFeature.titText.normal') }}
                </el-radio>
                <el-radio label="600">
                  {{ $t('shopFeature.titText.bold') }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('shopFeature.titText.descWeight')">
              <el-radio-group v-model="formData.descWeight">
                <el-radio label="500">
                  {{ $t('shopFeature.titText.normal') }}
                </el-radio>
                <el-radio label="600">
                  {{ $t('shopFeature.titText.bold') }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('shopFeature.titText.linkText')">
              <div class="view-more-item">
                <el-checkbox v-model="formData.isLink" />
              </div>
            </el-form-item>
            <div
              v-if="formData.isLink"
              class="btn-style"
            >
              <div class="btn-styles-con">
                <el-radio
                  v-for="(item,index) in 3"
                  :key="index"
                  v-model="formData.linkStyle"
                  :label="item"
                >
                  {{ $t('shopFeature.titText.style') }}{{ item }}
                </el-radio>
              </div>
              <div
                v-if="formData.linkStyle!==3"
                class="btn-type-input"
              >
                <div class="item-label">
                  {{ $t('shopFeature.titText.textContent') }}
                </div>
                <el-form-item
                  prop="linkText"
                  style="margin-bottom: 0;"
                  :rules="{
                    required: true, message: $t('shopFeature.titText.pleaseFillTextContent'), trigger: 'blur'}"
                >
                  <el-input
                    v-model="formData.linkText"
                    style="width: 243px"
                    :placeholder="$t('shopFeature.titText.more')"
                    maxlength="6"
                  />
                </el-form-item>
              </div>
              <div class="btn-type-input">
                <div class="item-label">
                  {{ $t('shopFeature.tabNav.routeLink') }}
                </div>
                <redirect-nav
                  :selected-link="formData.path.name"
                  :placeholder="$t('pcdecorate.placeholder.link')"
                  style="width:calc(100% - 100px)"
                  @handle-nav-select="handleNavSelect"
                  @handle-remove-selected="handleRemoveSelected"
                />
              </div>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <!-- 商品 | 页面 | 跳转链接弹窗 start -->
    <decorate-dialog-select
      :dialog-visible="dialogVisible"
      :device-type="'mobile'"
      :current-select-type="[1, 2, 4, 5, 6]"
      @handle-close="handleDialogClose"
      @handle-dialog-submit="handleDialogSubmit"
    />
    <!-- 商品 | 页面 | 跳转链接弹窗 end -->
    <!-- 商品选择弹窗  -->
    <prods-select
      v-if="dialogChooseGoods"
      ref="ProdsSelectRef"
      :is-single="true"
      @refresh-select-prods="chooseGoodsFun"
    />
    <!-- 弹窗: 输入自定义路径 -->
    <el-dialog
      v-model="showPathInputDialog"
      custom-class="up-dialog"
      :title="$t('shopFeature.tabNav.customPath')"
      width="40%"
      top="30vh"
    >
      <div class="custom-path-con">
        <span>{{ $t('shopFeature.tabNav.routeLink') }}</span>
        <el-input
          v-model="customPath"
          :placeholder="$t('shopFeature.tabNav.pleaseFillThePath')"
        />
      </div>
      <template #footer>
        <div style="text-align: right;">
          <el-button
            type="primary"
            @click="customPathComfirm"
          >
            {{ $t('shopFeature.tabNav.confirm') }}
          </el-button>
          <el-button
            @click="customPathCancel"
          >
            {{ $t('shopFeature.tabNav.cancel') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ElMessage } from 'element-plus'
import ProdsSelect from '@/components/prods-select/index.vue'
import redirectNav from '../../../../../decorate/create/common-component/redirect-nav/index.vue'
import decorateDialogSelect from '@/components/decorate-dialog-select/index.vue' // 选择商品
import customRemarkEditPopover from '../../../../../components/custom-remark-edit-poppver/index.vue'

const props = defineProps({
  current: {
    type: Number,
    default: 0
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
  },
  currentUseComponents: {
    type: Array,
    default: () => {}
  }
})

const emit = defineEmits(['myCheckResult', 'showCheckForm', 'componentsValueChance', 'save', 'onErrorMessageTip'])

const formData = reactive({
  title: '', // 标题
  desc: '', // 描述内容
  align: 'left', // 显示位置
  titleSize: '12', // 标题大小
  descSize: '12', //
  titleWeight: '500',
  descWeight: '500',
  isLink: 0,
  linkStyle: 1,
  linkText: $t('shopFeature.titText.linkText'),
  path: {
    name: '',
    link: '',
    type: ''
  }
})

const validateTitle = (rule, value, callback) => {
  if (!value.trim()) {
    callback(new Error($t('shopFeature.titText.pleaseFillTit')))
  } else {
    callback()
  }
}
const rules = reactive({
  title: [
    { required: true, message: $t('shopFeature.titText.pleaseFillTit'), trigger: 'blur' },
    { validator: validateTitle, trigger: 'blur' }
  ]
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

// 查看更多链接选择
const dialogVisible = ref(false) // 商品弹窗是否显示
const handleNavSelect = () => {
  dialogVisible.value = true
}
// 删除查看更多选中
const handleRemoveSelected = () => {
  formData.path.name = ''
  formData.path.link = ''
  formData.path.type = ''
}
// 商品弹窗关闭
const handleDialogClose = () => {
  dialogVisible.value = false
}
// 弹窗确定
const handleDialogSubmit = ({ type, value }) => {
  if (type === '1') { // 当前选择的是商品
    formData.path.name = value.goodsItem.spuName
    formData.path.link = value.goodsItem.spuId
    formData.path.type = '1'
  } else if (type === '2') { // 当前选择的是分类
    formData.path.name = value.categoryItem.label
    formData.path.link = value.categoryItem.data
    formData.path.type = '2'
  } else if (type === '4') { // 当前选择的是页面
    formData.path.name = value.pageItem.title
    formData.path.link = value.pageItem.link
    formData.path.type = '4'
  } else if (type === '5') { // 当前选择的是微页面
    formData.path.name = value.smallPageItem.name
    formData.path.link = value.smallPageItem.renovationId
    formData.path.type = '5'
  } else if (type === '6') { // 自定义链接
    formData.path.name = value.customLink.url
    formData.path.link = value.customLink
    formData.path.type = '6'
  }
  dialogVisible.value = false
}

/**
 * 自定义路径弹窗确认
 */
const customPath = ref('') // 自定义路径
const showPathInputDialog = ref(false) // 自定义路径输入弹窗
const customPathComfirm = () => {
  if (!customPath.value.trim()) {
    ElMessage.error($t('shopFeature.tabNav.pleaseFillThePath'))
    return
  }
  setLinkInfo({
    link: customPath.value,
    type: 4
  })
  showPathInputDialog.value = false
  customPath.value = ''
}
/**
 * 自定义路径弹窗取消
 */
const customPathCancel = () => {
  showPathInputDialog.value = false
}
// 选择商品回调
const dialogChooseGoods = ref(false) // 商品选择弹窗显隐
const currentItem = {}
const chooseGoodsFun = ($event) => {
  formData.link = currentItem
  setLinkInfo({
    title: $event.prodName,
    link: $event.prodId,
    type: 1
  })
  dialogChooseGoods.value = false
}
/** 设置跳转信息 */
const { proxy } = getCurrentInstance()
const setLinkInfo = (obj) => {
  formData.link = obj
  if (!obj && customPath.value) formData.link.link = customPath.value
  proxy.$forceUpdate()
}
/**
 * 开始验证
 **/
const checkData = () => {
  let isPass = true
  let errorMessage = ''
  const str = props.currentComponent.customRemark ? props.currentComponent.customRemark : props.current
  if (formData.title.trim() === '') {
    isPass = false
    errorMessage = $t('shopFeature.titText.pleaseFillTit')
  } else if (formData.isLink) {
    if (formData.linkStyle !== 3 && !formData.linkText.trim()) {
      isPass = false
      errorMessage = $t('shopFeature.titText.pleaseFillTextContent')
    } else if (formData.path.name === '') {
      isPass = false
      errorMessage = $t('shopFeature.tabNav.pleaseChooseRouteLink')
    }
  }
  if (isPass) {
    myCheckResult(isPass)
  } else {
    // 弹窗提示错误消息
    showCheckForm()
    emit('onErrorMessageTip', {
      customRemark: str,
      rightConfigTitle: $t('shopFeature.titText.titText'),
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
