<template>
  <div class="micro-create">
    <decorate-navbar
      v-show="currentOperationType!=='detail'"
      ref="decorateNavbarRef"
      :is-template="isTemplate"
      :data-form-l="dataForm"
      @handle-save="save"
      @view="view"
      @handle-save-template="handleSaveTemplate"
      @handle-click-component="handleClickComponent"
    />

    <div
      class="micro-box-content"
      :style="{backgroundColor:setOther.bgColor}"
    >
      <div class="design-page">
        <div class="design-page-content">
          <!-- 左侧所有装修组件 -->
          <div
            v-show="currentOperationType!=='detail'"
            class="all-use-components"
            :class="{'border-left': !sidebarFold}"
          >
            <!--所有可以选择的组件-->
            <allCanUseComponents
              :is-show-all-components="isShowAllComponents"
              :hide-these-components="hideTheseComponents"
              :show-these-components="showTheseComponents"
              @add-component="addComponent"
              @ret-all-can-use-components="retAllCanUseComponents"
            />
            <!--end 所有可以选择的组件-->
          </div>
          <!-- 界面预览 -->
          <div
            id="scrollbar"
            class="design-editor"
            :class="currentOperationType === 'detail' ? 'view-class' : ''"
          >
            <div
              ref="designBoxRef"
              class="design-box"
            >
              <div
                ref="designPreviewRef"
                class="design-preview"
                :style="{margin: currentOperationType!=='detail' ? '30px 350px 0 0' : '0'}"
              >
                <div
                  v-if="componentLists.length"
                  ref="PreviewRef"
                  class="item-list"
                >
                  <!--头部-->
                  <div
                    v-for="(item,index) in configComponents"
                    id="headBox"
                    :key="index"
                    class="preview-item"
                    :index="index"
                    @click.stop="clickComponent(index,1)"
                  >
                    <component
                      :is="componentLists.find(x=>x.type === item.type) ? componentLists.find(x=>x.type === item.type).routerPath : ''"
                      :current="index"
                      :is-show-edit="currentEditConfigComponentsShow === index&&configComponentsShow&&currentOperationType!=='detail'"
                      :index-key="item.type+'_'+index"
                      :data-field="item.dataField || {}"
                      :current-component="item"
                      :is-check-my-self="item.isCheckMySelf"
                      :is-start-check-field-rules="isStartCheckFieldRules"
                      @my-check-result="everyComponentsCheckResultFun"
                      @on-error-message-tip="onErrorMessageTip"
                      @components-value-chance="componentsValueChanceFromConfig"
                      @save="save"
                    />
                  </div>
                  <!--组价-->
                  <slick-list
                    v-model:list="currentUseComponents"
                    :use-drag-handle="true"
                    lock-axis="y"
                    :press-delay="500"
                    class="slickList-scroll"
                    @input="sortInput"
                    @sort-start="sortStart"
                    @sort-move="sortMove"
                    @sort-end="sortEnd"
                  >
                    <slick-item
                      v-for="(item,index) in currentUseComponents"
                      :id="'previewItem_'+index"
                      :key="item.id"
                      :class="['preview-box',{isMoveIng:isMoveIng}]"
                      :index="index"
                    >
                      <div
                        class="preview-item"
                        @click.stop="clickComponent(index)"
                      >
                        <component
                          :is="componentLists.find(x=>x.type === item.type) ? componentLists.find(x=>x.type === item.type).routerPath : ''"
                          :current="index"
                          :is-show-edit="currentEditComponent === index&&isShowEdit&&currentOperationType!=='detail'"
                          :current-use-components="currentUseComponents"
                          :index-key="item.type+'_'+index"
                          :data-field="item.dataField || {}"
                          :current-component="item"
                          :is-check-my-self="item.isCheckMySelf"
                          :is-start-check-field-rules="isStartCheckFieldRules"
                          @top-fixed="topFixed"
                          @set-current-use-components="setCurrentUseComponents"
                          @my-check-result="everyComponentsCheckResultFun"
                          @on-error-message-tip="onErrorMessageTip"
                          @components-value-chance="componentsValueChance"
                          @save="save"
                        />
                        <!--边框、删除、添加-->
                        <div
                          v-if="currentOperationType!=='detail'"
                          :style="{borderColor:setOther.viewTheme,borderStyle:'solid'}"
                          class="preview-item-border design-hide-class"
                          :class="currentEditComponent === index ? 'show':''"
                        >
                          <div
                            v-handle
                            class="drag-box"
                            :style="{cursor:setOther.dragCursor}"
                          />
                        </div>
                        <!--边框、删除、添加-->
                      </div>
                    </slick-item>

                    <!-- 商品瀑布 start -->
                    <template v-if="goodsWaterfallComponent.length > 0">
                      <div
                        v-for="(item, index) in goodsWaterfallComponent"
                        :key="item.type"
                        class="preview-box"
                        @click.stop="clickgoodsWaterfallComponent()"
                      >
                        <div class="preview-item">
                          <component
                            :is="componentLists.find(x=>x.type === item.type) ? componentLists.find(x=>x.type === item.type).routerPath : ''"
                            :current="index"
                            :is-show-edit="goodsWEdit &&isShowEdit"
                            :current-use-components="goodsWaterfallComponent"
                            :index-key="item.type+'_'+index"
                            :data-field="item.dataField || {}"
                            :current-component="item"
                            :is-check-my-self="item.isCheckMySelf"
                            :is-start-check-field-rules="isStartCheckFieldRules"
                            @top-fixed="topFixed"
                            @set-current-use-components="setCurrentUseComponents"
                            @components-value-chance="goodsWaterfallComponentValueChance"
                            @save="save"
                          />
                          <!--边框、删除、添加-->
                          <div
                            v-if="currentOperationType!=='detail'"
                            :style="{borderColor:setOther.viewTheme,borderStyle:'solid'}"
                            class="preview-item-border design-hide-class"
                            :class="goodsWEdit ? 'show':''"
                          >
                            <div
                              v-handle
                              class="drag-box"
                              :style="{cursor:setOther.dragCursor}"
                            />
                          </div>
                          <!--边框、删除、添加-->
                        </div>
                      </div>
                    </template>
                    <!-- 商品瀑布 end -->
                  </slick-list>
                  <!--插入-->
                  <div
                    v-if="isShowEditorAllComponents"
                    class="design-editor-item append-component-box"
                  >
                    <div class="design-config-editor">
                      <allCanUseComponents
                        :hide-these-components="hideTheseComponents"
                        @add-component="addComponent"
                        @ret-all-can-use-components="retAllCanUseComponents"
                      />
                    </div>
                  </div>
                  <!--插入-->
                </div>
              </div>
            </div>
            <!--右侧管理列表-->
            <div
              v-if="currentOperationType!=='detail'"
              class="preview-wrap"
            >
              <div
                class="preview-wrap-item"
                :style="setOther.componentOperation ? 'background-color:'+setOther.viewTheme+';color:#fff;' : ''"
                @click="setOther.componentOperation = true"
              >
                <el-icon><Coin /></el-icon>{{ $t('shopFeature.edit.componentManagement') }}
              </div>
            </div>
          </div>
          <!-- 组件管理 -->
          <div
            v-if="setOther.componentOperation"
            class="design-editor-item"
          >
            <div class="design-config-editor">
              <div class="design-editor-component-title">
                {{ $t('shopFeature.edit.componentManagement') }}
              </div>
              <div class="components-list-edit">
                <p
                  class="clear-current-component"
                  :style="[{color:setOther.viewTheme}]"
                >
                  <span>{{ $t('shopFeature.edit.componentSorting') }}</span>
                  <span
                    @click="removeAll"
                  >{{ $t('shopFeature.edit.removeAll') }}</span>
                </p>
                <slick-list
                  v-model:list="currentUseComponents"
                  :use-drag-handle="true"
                  axis="y"
                  helper-class="drag-class"
                  @input="componentsSortInput"
                >
                  <slick-item
                    v-for="(item,index) in currentUseComponents"
                    :key="index"
                    class="components-list-edit-item"
                    :index="index"
                  >
                    <div
                      v-handle
                      class="drag-box"
                    >
                      {{ componentLists.find(x=>x.type === item.type) ?
                        componentLists.find(x=>x.type === item.type).title : '' }}
                      <span class="drag-box-remark">{{ item.customRemark }}</span>
                    </div>
                    <div class="drag-box-icon">
                      <custom-remark-edit-popover
                        :index="index"
                        :current-edit-component="currentEditComponent"
                        @set-current-component="setCurrentComponent"
                        @save-edit="saveCustomRemark"
                      />
                      <el-icon
                        :size="18"
                        title="删除组件"
                        @click="popBtn(2, 'pop_'+index,index)"
                      >
                        <Delete />
                      </el-icon>
                    </div>
                  </slick-item>
                </slick-list>

                <!-- 商品瀑布 start -->
                <template v-if="goodsWaterfallComponent.length > 0">
                  <div
                    v-for="(item, index) in goodsWaterfallComponent"
                    :key="item.type"
                    class="components-list-edit-item"
                  >
                    <div
                      v-handle
                      class="drag-box"
                    >
                      {{ componentLists.find(x=>x.type === item.type) ?
                        componentLists.find(x=>x.type === item.type).title : '' }}
                    </div>
                    <div class="drag-box-icon">
                      <el-icon
                        :title="$t('shopFeature.edit.removeComponent')"
                        @click="popBtn(1, 'pop_'+index,index)"
                      >
                        <Delete />
                      </el-icon>
                    </div>
                  </div>
                </template>
                <!-- 商品瀑布 end -->

                <div
                  v-if="currentUseComponents.length === 0"
                  class="empty-template"
                >
                  {{ $t('shopFeature.edit.emptyTemplate') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { SlickList, SlickItem } from 'vue-slicksort'
import allCanUseComponents from './components/all-can-use-components/index.vue'
import Cookies from 'vue-cookies'
import { ElMessage } from 'element-plus'
// 顶边栏
import decorateNavbar from './decorate-navbar.vue'
import request from '@/utils/request'
import { getDomain } from '@/utils/index.js'
import customRemarkEditPopover from '../../../components/custom-remark-edit-poppver/index.vue'

/**
 * 作为组件时传入说明
 *  props 解析看下文
 *  currentConfigComponents  默认配置顶部项的组件  默认为config组件
 *  currentUseComponents 正在预览区的组件  默认 []
 * */

const props = defineProps({
  isShowPushAdd: { // 是否显示插入的模式
    type: Boolean,
    default: true
  },
  isShowClose: { // 是否关闭的模式
    type: Boolean,
    default: true
  },
  hideTheseComponents: { // 隐藏这些组件 结构如：[{type: 'config',isHide:true}]
    type: Array,
    default: () => []
  },
  showTheseComponents: { // 显示这些组件 结构如：[{type: 'config',isHide:true}]
    type: Array,
    default: () => []
  },
  isShowAllComponents: { // 是否隐藏所有组件
    type: Boolean,
    default: true
  },
  isShowSaveBtn1: { // 是否显示 上架 按扭
    type: Boolean,
    default: true
  },
  isShowSaveBtn2: { // 是否显示 保存并继续 按扭
    type: Boolean,
    default: true
  },
  isShowSaveBtn3: { // 是否显示 更多操作 按扭
    type: Boolean,
    default: true
  },
  // 是否需要返回最后保存的值，在当前页面被用作组件的时候可使用
  isNeedReturnSaveData: {
    type: Boolean,
    default: false
  },
  /** 配置顶部项的组件 */
  currentConfigComponents: {
    type: Array,
    default: () => [{ type: 'config' }] // 配置项不能删除、排序
  },
  /** 其他的组件传过来只能使用的组件 */
  currentCanUseComponents: {
    type: Array,
    default: () => [] //
  },
  microId: { // 主要运用于其他的调用微页面组件获取详情使用，具体可参考：公告广告
    type: Number,
    default: null
  },
  microKeyWord: { // 微页面 主要运用于其他的调用微页面组件获取详情使用，具体可参考：微集合
    type: String,
    default: ''
  }
})

const emit = defineEmits(['currentUseComponentsChange', 'returnData'])

const commonStore = useCommonStore()
const sidebarFold = computed(() => {
  return commonStore.sidebarFold
})

const id = ref(null)
watch(() => props.microId, (val) => {
  if (val) {
    id.value = val
    getInfo()
  }
})

const currentUseComponents = ref([])
watch(() => props.microKeyWord, (val) => {
  if (val) {
    id.value = null
    currentUseComponents.value = []
    if (val !== 'productCatalog') {
      // props.microKeyWord = 'other'
    }
    getInfo()
  }
})
watch(() => currentUseComponents.value, (val) => {
  nextTick(() => {
    emit('currentUseComponentsChange', val)
  })
})

const renovationId = ref(useRoute().query.renovationId || null)
const templateId = ref(useRoute().query.templateId || null)
const configComponents = ref([{ type: 'config' }]) // 配置顶部项的组件
const isTemplate = ref('0') // 是否为模板编辑
const pageType = ref('')
onMounted(() => {
  isTemplate.value = useRoute().query.template
  const renovationIdVal = useRoute().query.renovationId
  const templateIdVal = useRoute().query.templateId
  pageType.value = useRoute().query.type
  handleInit()
  if (pageType.value === 'edit') {
    renovationId.value = renovationIdVal
    templateId.value = templateIdVal
    if (isTemplate.value === '0') {
      getInfo()
    } else {
      getTemplateDetail()
    }
    localStorage.removeItem('cloudViewContent')
  } else if (pageType.value === 'add' && templateIdVal) {
    templateId.value = templateIdVal
    getTemplateDetail()
    localStorage.removeItem('cloudViewContent')
  } else {
    configComponents.value = JSON.parse(JSON.stringify(props.currentConfigComponents))
  }
  if (pageType.value === 'detail' && renovationIdVal) {
    getInfo()
  } else if (pageType.value === 'detail' && localStorage.getItem('cloudViewContent')) {
    viewContent(JSON.parse(localStorage.getItem('cloudViewContent')))
  }

  nextTick(() => {
    commonStore.updateSidebarFold(true)
  })
})

onActivated(() => {
  if (useRoute().query.renovationId && useRoute().query.renovationId !== renovationId.value) {
    renovationId.value = useRoute().query.renovationId
    getInfo()
  }
})

onDeactivated(() => {
  configComponents.value = []
  configComponents.value = JSON.parse(JSON.stringify(props.currentConfigComponents))
})

const currentOperationType = ref('') // 当前操作类型
const handleInit = () => {
  if (useRoute().query.type === 'detail') {
    currentOperationType.value = 'detail'
  }
}
// 预览
const isStartCheckFieldRules = ref(false) // 是否开始校验所有组件的规则
const allCheckResult = ref([]) // 所有每次校验的结果
const isView = ref(false) // 是否预览
const view = () => {
  allCheckResult.value = []
  isStartCheckFieldRules.value = !isStartCheckFieldRules.value// 开始校验
  isView.value = true
}

const router = useRouter()
const domain = getDomain()
const goodsWaterfallComponent = ref([]) // 底部瀑布组件
const toView = () => {
  const $data = configComponents.value.concat(currentUseComponents.value, goodsWaterfallComponent.value)
  const par = {
    content: JSON.stringify($data),
    name: $data[0].dataField.title || $t('shopFeature.header.microTitle')
  }
  localStorage.setItem('cloudViewContent', JSON.stringify(par))
  const newPage = router.resolve({
    path: 'feature-create-edit',
    query: {
      type: 'detail',
      ...(Cookies.get(domain) ? {} : { tid: Cookies.get('cloudTid') })
    }
  })
  isView.value = false
  window.open(newPage.href, '_blank', 'noopener,noreferrer')
}
// 组件管理
const isShowEditorAllComponents = ref(false) // 是否显示插入组件区域，永远与isShowEdit相反
const setOther = reactive({ // 设置
  viewTheme: '#155BD4',
  bgColor: '#fff', // 背景
  dragCursor: 'all-scroll', // 显示的图标 all-scroll
  componentOperation: false// 是否操作组件
})
const handleClickComponent = () => {
  setOther.componentOperation = !setOther.componentOperation
  isShowEditorAllComponents.value = false
}
/** 关闭组件管理 */
const componentOperation = () => {
  setOther.componentOperation = false
}
/**
 * 获取所有可用的组件
 * */
const componentLists = ref([]) // 所有可用的组件
const retAllCanUseComponents = ($list) => {
  if ($list) {
    componentLists.value = $list
  } else {
    ElMessage.success($t('shopFeature.edit.noneUseableCom'))
  }
}
/**
 *添加组件
 **/
const { proxy } = getCurrentInstance()
let scrollTopHeight = 0
const appendPosition = ref({
  index: '',
  position: 'bottom', // 默认底部
  theRefs: null
}) // 插入组件的位置
const currentEditComponent = ref(0) // 正在编辑的组件
const goodsWEdit = ref(false) // 是否修改瀑布组件
const addComponent = (item) => {
  if (item.type === 'goodsWaterfall' && goodsWaterfallComponent.value.length === 1) {
    return ElMessage.warning('瀑布流只能添加一个！')
  }
  const goodsWaterfallComponentVal = goodsWaterfallComponent.value
  const scrollBox = document.getElementById('scrollbar')
  scrollTopHeight = scrollBox.scrollTop
  const allCurrentUseComponents = currentUseComponents.value
  const $par = { type: item.type, id: Math.floor(Math.random() * 10000000000) }
  const $appendPositionIndex = appendPosition.value.index
  if (item.type !== 'goodsWaterfall') {
    if ($appendPositionIndex !== '') { // 插入模式
      const $in = appendPosition.value.position === 'top' ? $appendPositionIndex : $appendPositionIndex + 1
      allCurrentUseComponents.splice($in, 0, item)
      currentEditComponent.value = $in
    } else {
      allCurrentUseComponents.push($par)
      currentEditComponent.value = allCurrentUseComponents.length - 1
    }
    goodsWEdit.value = false
  } else {
    currentEditComponent.value = -1
    goodsWEdit.value = true
    goodsWaterfallComponentVal.push($par)
  }
  setTimeout(() => {
    // 重置插入位置为空
    proxy.$forceUpdate()
    currentUseComponents.value = allCurrentUseComponents
    goodsWaterfallComponent.value = goodsWaterfallComponentVal // 瀑布组件
    appendPosition.value.index = ''
    reSetIsShowEdit()
    scrollBox.scrollTop = scrollTopHeight
  }, 5)
}

/**
 * 重置isShowEdit
 * */
const isShowEdit = ref(false) // 是否显示组件的编辑区
const configComponentsShow = ref(true)
const reSetIsShowEdit = ($is = true, isReSetOperation = true) => {
  configComponentsShow.value = false
  isShowEdit.value = $is
  isShowEditorAllComponents.value = !isShowEdit.value
  if (isReSetOperation) {
    componentOperation()
  }
}
/**
 *点击某个组件
 *$isConfigComponents =  1 时为顶部
 **/
const currentEditConfigComponentsShow = ref(0) // 正在编辑的组件
const clickComponent = ($index, $isConfigComponents = 0) => {
  goodsWEdit.value = false
  if ($isConfigComponents === 1) {
    currentEditConfigComponentsShow.value = $index
    configComponentsShow.value = true
    isShowEdit.value = false
    isShowEditorAllComponents.value = false
  } else {
    currentEditComponent.value = $index
    reSetIsShowEdit()
  }
  componentOperation()
}
// 点击商品瀑布组件
const clickgoodsWaterfallComponent = () => {
  currentEditComponent.value = -1
  goodsWEdit.value = true
  reSetIsShowEdit()
  componentOperation()
}
/**
 * 移除某个组件
 * */
const popBtn = ($type, ref, index) => {
  if ($type === 1) {
    goodsWaterfallComponent.value = []
  }
  if ($type === 2) { // 确定
    const $currentUseComponents = currentUseComponents.value
    $currentUseComponents.splice(index, 1)
    currentUseComponents.value = []
    setTimeout(() => {
      currentUseComponents.value = $currentUseComponents
    }, 5)
  }
  isShowEditorAllComponents.value = false
}
// 监听某个组件的变化
const componentsValueChanceFromConfig = ($val) => {
  if ($val) {
    configComponents.value[$val.current].dataField = $val.dataField
  }
}
const componentsValueChance = ($val) => {
  if ($val) {
    currentUseComponents.value[$val.current].dataField = $val.dataField
  }
}
const goodsWaterfallComponentValueChance = ($val) => {
  if ($val) {
    goodsWaterfallComponent.value[$val.current].dataField = $val.dataField
  }
}
// 拖拽
const isMoveIng = ref(false) // 是否正在移动
const sortStart = () => {
  setOther.dragCursor = 'all-scroll'
  isMoveIng.value = true
}
// 拖动过程，改变鼠标样式
const sortMove = () => {
}
// 结束拖拽
const sortEnd = (val) => {
  currentEditComponent.value = val.newIndex
  isMoveIng.value = false
}
// 拖拽之后的结果
const isDrag = ref(false) // 是否拖动了位置
const sortInput = (val, isReSet = true) => {
  if (isDrag.value) {
    for (let i = 0; i < val.length; i++) {
      if (val[i].type === 'goodsWaterfall') {
        if (val[val.length - 1].type !== 'goodsWaterfall') {
          ElMessage.warning('瀑布流组件只能显示在底部！')
        }
      }
    }
    // 始终保证招牌在顶部
    const arr = []
    const goodsWaterfallComponentVal = []
    val.forEach(item => {
      if (item.type === 'goodsWaterfall') {
        goodsWaterfallComponentVal.push(item)
      } else {
        arr.push(item)
      }
    })
    currentUseComponents.value = []
    setTimeout(() => {
      currentUseComponents.value = arr
    }, 5)
    appendPosition.value.index = ''
  }
  isDrag.value = false
  configComponentsShow.value = false
  reSetIsShowEdit(true, isReSet)
}
/** 右边组件的拖拽 */
const componentsSortInput = (val) => {
  isDrag.value = true
  sortInput(val, false)
}
/**
 * 保存事件 先校验
 * @param {Number/String} $type 保存类型: 1保存后返回列表页;  2保存后留在编辑页
 * @param {Boolean} dontShowMessageVal 是否显示 "保存成功" 消息提示
 * */
const saveType = ref(2) // 保存的类型=> 2保存 1上架 3更多操作
const dontShowMessage = ref(false)
const savePageType = ref('0') // 保存类型
const save = ($type, dontShowMessageVal) => {
  savePageType.value = '0'
  saveType.value = $type
  dontShowMessage.value = dontShowMessageVal
  allCheckResult.value = []
  isStartCheckFieldRules.value = !isStartCheckFieldRules.value // 开始校验
}
/**
 * 保存模板 先校验
 * @param {Boolean} dataForm 模板信息
 * */
const dataForm = ref({
  name: '',
  remark: '',
  imgUrl: ''
}) // 模板信息
const handleSaveTemplate = (dataFormVal) => {
  savePageType.value = '1'
  dataForm.value = dataFormVal
  allCheckResult.value = []
  isStartCheckFieldRules.value = !isStartCheckFieldRules.value // 开始校验
}
/** 所有的正在编辑的校验结果 */
const isCheckMySelf = ref(false) // 在规则判断不通过改变通知子组件
const everyComponentsCheckResultFun = (ev) => {
  allCheckResult.value.push(ev.data)
  /** 统计当前所有正在使用组件的数量 */
  const currentUserAllComponentsList = currentUseComponents.value.length + configComponents.value.length
  if (allCheckResult.value.length === currentUserAllComponentsList) {
    const $allCheckResult = allCheckResult.value
    for (let i = 0; i < $allCheckResult.length; i++) {
      const cur = $allCheckResult[i]
      if (!cur.isPass) {
        let $type = 0
        if (cur.isHeader) { // 头部的验证规则不通过
          configComponents.value[cur.current].isCheckMySelf = !configComponents.value[cur.current].isCheckMySelf
          $type = 1
        } else { // 底部的不通过
          currentUseComponents.value[cur.current].isCheckMySelf = !currentUseComponents.value[cur.current].isCheckMySelf
        }
        clickComponent(cur.current, $type)
        isStartCheckFieldRules.value = false
        // 开始通知子组件开始提示用户 ，弹窗等。。。
        isCheckMySelf.value = !isCheckMySelf.value
        break
      }
      if (i === $allCheckResult.length - 1) { // 验证完成，可以保存了
        if (isView.value) {
          toView()
        } else {
          savePush()
        }
      }
    }
  }
}
// 验证完毕之后发布push
const savePush = () => {
  const $parameter = configComponents.value.concat(currentUseComponents.value, goodsWaterfallComponent.value)
  $parameter.map(re => { // 移除isCheckMySelf字段，不能上传数据库
    delete re.isCheckMySelf
    return ''
  })
  if (props.isNeedReturnSaveData) { // 返回最后保存的值  当前微页面被使用成组件时
    emit('returnData',
      {
        type: saveType.value, // 按钮类型
        data: $parameter
      }
    )
    return
  }
  if (savePageType.value === '0') {
    saveData($parameter, saveType.value)
  } else {
    saveTemplateData($parameter, saveType.value)
  }
}
/** 保存到数据库 */
const isSubmit = ref(false)
const saveData = async ($data) => {
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  const par = {
    content: JSON.stringify($data),
    name: $data[0].dataField.title || $t('shopFeature.header.microTitle')
  }
  if (renovationId.value) {
    par.renovationId = renovationId.value
    par.pageType = 0
  }
  let url = ''
  let method = ''
  if (renovationId.value) {
    url = '/mall4cloud_admin/mp/shop_renovation/update_h5'
    method = 'put'
  } else {
    url = '/mall4cloud_admin/mp/shop_renovation/save_h5'
    method = 'post'
  }
  request({
    url,
    method,
    data: par
  }).then((data) => {
    if (!renovationId.value) {
      renovationId.value = data
      router.replace({
        path: 'feature-create-edit',
        query: {
          renovationId: renovationId.value,
          type: 'edit',
          template: '0'
        }
      })
    }
    if (!dontShowMessage.value) {
      ElMessage({
        message: $t('shopFeature.edit.saveSuccess'),
        type: 'success',
        duration: 1500,
        onClose: () => {
        }
      })
    } else {
      dontShowMessage.value = false
    }
  }).finally(() => {
    isSubmit.value = false
  })
}
/** 保存模板到数据库 */
const saveTemplateData = async ($data) => {
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  const par = {
    content: JSON.stringify($data),
    remark: dataForm.value.remark,
    image: dataForm.value.imgUrl,
    name: dataForm.value.name, // 模板名称
    type: 2 // 装修类型
  }
  if (templateId.value) {
    par.templateId = templateId.value
  }
  let url = ''
  let method = ''
  if (templateId.value) {
    url = '/mall4cloud_admin/mp/shop_template/update_h5'
    method = 'put'
  } else {
    url = '/mall4cloud_admin/mp/shop_template/save_h5'
    method = 'post'
  }
  request({
    url,
    method,
    data: par
  }).then((data) => {
    if (!templateId.value) {
      templateId.value = data
    }
    if (!dontShowMessage.value) {
      ElMessage({
        message: $t('shopFeature.edit.saveSuccess'),
        type: 'success',
        duration: 1500
      })
    } else {
      dontShowMessage.value = false
    }
  }).finally(() => {
    isSubmit.value = false
  })
}
const viewContent = async (data) => {
  configComponents.value = []
  let detail = {
    keyword: 'other',
    pageData: data.content
  }
  if (props.microKeyWord === 'productCatalog') {
    detail = {
      keyword: 'productCatalog',
      pageData: data.content
    }
  }
  let $data = JSON.parse(detail.pageData)
  $data = await matchproducts($data)
  if ($data.length) {
    configComponents.value = []
    $data.map(re => {
      if (re.type.indexOf('config') !== -1) {
        configComponents.value.push(re)
      } else {
        currentUseComponents.value.push(re)
      }
      return ''
    })
  }
}
/**
 * 获取详情
 */
const getInfo = () => {
  request({
    url: '/mall4cloud_admin/mp/shop_renovation/get_h5',
    params: {
      renovationId: renovationId.value
    },
    method: 'GET'
  }).then(async (data) => { //
    configComponents.value = []
    const par = {}
    if (props.microKeyWord) {
      par.keyword = props.microKeyWord
    }
    if (renovationId.value) {
      par.renovationId = renovationId.value
    }
    let detail = {
      keyword: 'other',
      pageData: data.content
    }
    if (props.microKeyWord === 'productCatalog') {
      detail = {
        keyword: 'productCatalog',
        pageData: data.content
      }
    }
    let $data = JSON.parse(detail.pageData)
    $data = await matchproducts($data)
    if ($data.length) {
      configComponents.value = []
      $data.map(re => {
        re.id = Math.floor(Math.random() * 10000000000)
        if (re.type.indexOf('config') !== -1) {
          configComponents.value.push(re)
        } else if (re.type.indexOf('goodsWaterfall') !== -1) {
          goodsWaterfallComponent.value.push(re)
        } else {
          currentUseComponents.value.push(re)
        }
        return ''
      })
    }
  }).catch(() => {
  })
}
// 获取模板详情
const getTemplateDetail = () => {
  request({
    url: '/mall4cloud_admin/mp/shop_template',
    params: {
      templateId: templateId.value
    },
    method: 'GET'
  }).then(async (data) => {
    configComponents.value = []
    if (pageType.value === 'edit') {
      dataForm.value = {
        name: data.name || '',
        remark: data.remark || '',
        imgUrl: data.image || ''
      }
    }
    if (pageType.value === 'add' && isTemplate.value === '0') {
      templateId.value = null
    }
    const par = {}
    if (props.microKeyWord) {
      par.keyword = props.microKeyWord
    }
    if (templateId.value) {
      par.templateId = templateId.value
    }
    let detail = {
      keyword: 'other',
      pageData: data.content
    }
    if (props.microKeyWord === 'productCatalog') {
      detail = {
        keyword: 'productCatalog',
        pageData: data.content
      }
    }
    let $data = JSON.parse(detail.pageData)
    $data = await matchproducts($data)
    if ($data.length) {
      configComponents.value = []
      $data.map(re => {
        re.id = Math.floor(Math.random() * 10000000000)
        if (re.type.indexOf('config') !== -1) {
          configComponents.value.push(re)
        } else if (re.type.indexOf('goodsWaterfall') !== -1) {
          goodsWaterfallComponent.value.push(re)
        } else {
          currentUseComponents.value.push(re)
        }
        return ''
      })
    }
  }).catch(() => {
  })
}
// 匹配商品
const matchproducts = async (arr) => {
  const res = await searchGoodsMessage(arr)
  res.forEach(item => {
    if (item.spuActivity) {
      if (item.spuActivity.groupActivity) {
        item.activityPrice = item.spuActivity.groupActivity.price
      }
      if (item.spuActivity.sekillActivitySpuVO) {
        item.activityPrice = item.spuActivity.sekillActivitySpuVO.seckillPrice
      }
    }
  })
  arr.forEach(item => {
    if (item.type === 'goods') { // 商品列表
      const goodsParams = {
        prodName: 'spuName',
        status: 'spuStatus',
        price: 'priceFee',
        pic: 'mainImgUrl',
        oriPrice: 'marketPriceFee',
        brief: 'sellingPoint'
      }
      item.dataField.goods = handleScreenGoods(item.dataField.goods, res, 'prodId', goodsParams)
    } else if (item.type === 'promotionalActivities') { // 促销活动
      const promoParams = {
        prodName: 'spuName',
        prodType: 'spuType',
        status: 'spuStatus',
        price: 'activityPrice',
        groupNumber: 'groupNumber',
        pic: 'mainImgUrl',
        brief: 'sellingPoint',
        oriPrice: 'marketPriceFee',
        activityPrice: 'activityPrice'
      }
      item.dataField.prodIds = handleScreenGoods(item.dataField.prodIds, res, 'prodId', promoParams)
    } else if (item.type === 'goodsModule1') { // 商品模块1
      item.dataField.leftConfig.goodsList = handleScreenGoods(item.dataField.leftConfig.goodsList, res, 'id')
      item.dataField.rightConfig.goodsList = handleScreenGoods(item.dataField.rightConfig.goodsList, res, 'id')
    } else if (item.type === 'goodsModule3' || item.type === 'goodsModule4' || item.type === 'goodsModule5') { // 商品模块3 4 5
      item.dataField.goodsList = handleScreenGoods(item.dataField.goodsList, res, 'id')
    }
  })
  return arr
}
// 查询商品信息
const searchGoodsMessage = (arr) => {
  let goodsArr = []
  arr.forEach(item => {
    if (item.type === 'goods') { // 商品信息
      item.dataField.goods.forEach(v => {
        goodsArr.push(v.prodId)
      })
    } else if (item.type === 'promotionalActivities') { // 促销和活动
      item.dataField.prodIds.forEach(v => {
        goodsArr.push(v.prodId)
      })
    } else if (item.type === 'goodsModule1') { // 商品模块1
      item.dataField.leftConfig.goodsList.forEach(v => {
        goodsArr.push(v.id)
      })
      item.dataField.rightConfig.goodsList.forEach(v => {
        goodsArr.push(v.id)
      })
    } else if (item.type === 'goodsModule3') { // 商品模块3
      item.dataField.goodsList.forEach(v => {
        goodsArr.push(v.id)
      })
    } else if (item.type === 'goodsModule4') { // 商品模块4
      item.dataField.goodsList.forEach(v => {
        goodsArr.push(v.id)
      })
    } else if (item.type === 'goodsModule5') { // 商品模块5
      item.dataField.goodsList.forEach(v => {
        goodsArr.push(v.id)
      })
    }
  })
  goodsArr = Array.from(new Set(goodsArr))
  return new Promise((resolve) => {
    request({
      url: '/mall4cloud_search/mp/search/renovation_page',
      method: 'get',
      params: {
        spuIds: goodsArr,
        pageNum: 1,
        pageSize: goodsArr.length,
        getDelete: 1
      }
    }).then((data) => {
      if (data.list) {
        data.list[0].spus.forEach(item => {
          if (item.spuActivity && item.spuActivity.groupActivity) {
            item.groupNumber = item.spuActivity.groupActivity.groupNumber
          }
        })
        resolve(data.list[0].spus)
      } else {
        resolve([])
      }
    })
  })
}
// 筛选商品回显 currentArr: 表示当前装修的商品，backReturnArr: 表示根据现有id查询后端返回的商品
const handleScreenGoods = (currentArr, backReturnArr, type, otherParams) => {
  let params = {}
  if (otherParams) {
    params = {
      ...otherParams
    }
  } else {
    params = {
      // 商品名称
      prodType: 'spuType', // 商品类型
      status: 'spuStatus', // 商品状态
      price: 'priceFee', // 商品价格
      imgs: 'mainImgUrl', // 商品图片
      orignPrice: 'marketPriceFee', // 商品原价
      description: 'sellingPoint' // 商品描述
    }
  }
  const arr = []
  for (let i = 0; i < currentArr.length; i++) {
    for (let j = 0; j < backReturnArr.length; j++) {
      if (currentArr[i][type] == backReturnArr[j].spuId) {
        for (const key in params) {
          currentArr[i][key] = backReturnArr[j][params[key.toString()]]
        }
        currentArr[i].spuType = currentArr[i].spuType ? backReturnArr[j].spuType : currentArr[i].spuType
        arr.push(currentArr[i])
      }
    }
  }
  return arr
}
const topFixed = () => {
  currentEditComponent.value = 0
}

const setCurrentUseComponents = (current) => {
  currentUseComponents.value.unshift(currentUseComponents.value[current])
  currentUseComponents.value.splice(current + 1, 1)
}

const removeAll = () => {
  currentUseComponents.value = []
  goodsWaterfallComponent.value = []
}

let errorMessageTipList = []
/**
 * 获取所有组件的错误提示，集中处理
 * 利用防抖函数，每次只展示一条报错信息
 */
const onErrorMessageTip = Debounce((errorTip) => {
  errorMessageTipList.push(errorTip)
  if (errorMessageTipList.length > 0) {
    for (let i = 0; i < 1; i++) {
      const obj = errorMessageTipList[0]
      const tip = obj.rightConfigTitle + (obj.customRemark ? (' ' + obj.customRemark) : '') + '：' + obj.errorMessage
      ElMessage.error(tip)
    }
    errorMessageTipList = []
  }
}, 1000)

// 自定义标签名
const setCurrentComponent = (index) => {
  currentEditComponent.value = currentUseComponents.value[index]
}
const saveCustomRemark = (remark) => {
  currentEditComponent.value.customRemark = remark
}

</script>
<!-- eslint-disable-next-line vue-scoped-css/enforce-style-type -->
<style lang="scss">
@import './edit.scss';
</style>
