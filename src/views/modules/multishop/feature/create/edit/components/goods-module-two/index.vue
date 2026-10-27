<template>
  <div class="micro-goodsTwo-box">
    <!-- 预览控制区 start -->
    <div class="design-preview-controller">
      <module-component :config="formData" />
    </div>
    <!-- 预览控制区 end -->
    <!-- 编辑工作区 start -->
    <div
      v-if="isShowEdit"
      class="design-editor-item design-hide-class"
    >
      <div class="design-config-editor">
        <div class="design-editor-component-title">
          <div style="flex: 1;">
            商品模块2
            {{ currentComponent.customRemark }}
          </div>
          <custom-remark-edit-popover
            :index="currentUseComponents.findIndex(item => item.id === currentComponent.id)"
            :current-edit-component="currentEditComponent"
            @set-current-component="setCurrentComponent"
            @save-edit="saveCustomRemark"
          />
        </div>
        <div class="config-item">
          <div class="title">
            选择对应的列数，进行详细设置
          </div>
          <div class="bottom-edit">
            <div
              :class="{'edit-item': true, 'active': currentActive === 1}"
              @click="handleSelect(1)"
            />
            <div class="edit-item">
              <div
                :class="{'edit-item-son': true, 'active': currentActive === 2}"
                @click="handleSelect(2)"
              />
              <div
                :class="{'edit-item-son': true, 'active': currentActive === 3}"
                @click="handleSelect(3)"
              />
            </div>
          </div>
        </div>
        <div v-show="currentActive === 1">
          <div class="config-item">
            <div class="title">
              自定义标题
            </div>
            <div class="bottom-config">
              <el-input
                v-model.trim="formData.leftConfig.mainTitle"
                maxlength="6"
              />
            </div>
          </div>
          <div class="config-item">
            <div class="title">
              自定义副标题
            </div>
            <div class="bottom-config">
              <el-input
                v-model.trim="formData.leftConfig.subTitle"
                maxlength="12"
              />
            </div>
          </div>
          <div class="config-item">
            <div class="title">
              立即抢购
            </div>
            <div class="bottom-config">
              <redirect-nav
                :selected-link="formData.leftConfig.path.name"
                :placeholder="$t('pcdecorate.placeholder.link')"
                @handle-nav-select="handleLeftNavSelect"
                @handle-remove-selected="handleLeftRemoveSelected"
              />
            </div>
          </div>
          <div class="config-item">
            <div class="title">
              标题文字颜色
            </div>
            <div class="bottom-config">
              <pick-color-component
                :define-color="formData.leftConfig.mainTitleColor"
                @handle-change-color="handleLeftTitleColor"
              />
            </div>
          </div>
          <div class="config-item">
            <div class="title">
              副标题文字颜色
            </div>
            <div class="bottom-config">
              <pick-color-component
                :define-color="formData.leftConfig.subTitleColor"
                :reset-color="'rgba(243, 52, 51, 1)'"
                @handle-change-color="handleLeftSubColor"
              />
            </div>
          </div>
          <div class="config-item special-item">
            <div class="title">
              标题字号
            </div>
            <el-slider
              v-model="formData.leftConfig.mainTitleSize"
              :min="12"
              :max="40"
              show-input
            />
          </div>
          <div class="config-item special-item">
            <div class="title">
              副标字号
            </div>
            <el-slider
              v-model="formData.leftConfig.subTitleSize"
              :min="12"
              :max="40"
              show-input
            />
          </div>
          <div class="config-item">
            <div class="title">
              添加图片
              <span class="tips">(建议选择232*220px或者同等比例的图片)</span>
            </div>
            <div class="bottom-config">
              <div class="add-img-container">
                <div class="add-btn">
                  <div
                    v-if="formData.leftConfig.imgMessage.img === ''"
                    class="add-items"
                    @click="handleAddImg"
                  >
                    <span>+</span>
                    <span>添加图片</span>
                  </div>
                  <el-image
                    v-else
                    :src="checkFileUrl(formData.leftConfig.imgMessage.img)"
                    fit="fill"
                  >
                    <template #error>
                      <img
                        class="img-slot"
                        src="@/assets/images/def.png"
                      >
                    </template>
                  </el-image>
                  <el-icon
                    v-if="formData.leftConfig.imgMessage.img != ''"
                    class="el-icon-error"
                    @click="handleRemove"
                  >
                    <CircleCloseFilled />
                  </el-icon>
                </div>
                <div class="right-content">
                  <div class="right-titles">
                    链接
                  </div>
                  <redirect-nav
                    class="link-redirect"
                    :selected-link="formData.leftConfig.imgMessage.path.name"
                    :placeholder="$t('pcdecorate.placeholder.link')"
                    @handle-nav-select="handleLeftimgNavSelect"
                    @handle-remove-selected="handleLeftImgRemove"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-show="currentActive === 2">
          <div class="config-item">
            <div class="title">
              自定义标题
            </div>
            <div class="bottom-config">
              <el-input v-model.trim="formData.topConfig.mainTitle" />
            </div>
          </div>
          <div class="config-item">
            <div class="title">
              自定义副标题
            </div>
            <div class="bottom-config">
              <el-input v-model.trim="formData.topConfig.subTitle" />
            </div>
          </div>
          <div class="config-item">
            <div class="title">
              立即抢购
            </div>
            <div class="bottom-config">
              <redirect-nav
                :selected-link="formData.topConfig.path.name"
                :placeholder="$t('pcdecorate.placeholder.link')"
                @handle-nav-select="handleTopNavSelect"
                @handle-remove-selected="handleTopRemoveSelected"
              />
            </div>
          </div>
          <div class="config-item">
            <div class="title">
              标题文字颜色
            </div>
            <div class="bottom-config">
              <pick-color-component
                :define-color="formData.topConfig.mainTitleColor"
                @handle-change-color="handleTopTitleColor"
              />
            </div>
          </div>
          <div class="config-item">
            <div class="title">
              副标题文字颜色
            </div>
            <div class="bottom-config">
              <pick-color-component
                :define-color="formData.topConfig.subTitleColor"
                :reset-color="'rgba(97, 200, 180, 1)'"
                @handle-change-color="handleTopSubColor"
              />
            </div>
          </div>
          <div class="config-item special-item">
            <div class="title">
              标题字号
            </div>
            <el-slider
              v-model="formData.topConfig.mainTitleSize"
              :min="12"
              :max="40"
              show-input
            />
          </div>
          <div class="config-item special-item">
            <div class="title">
              副标字号
            </div>
            <el-slider
              v-model="formData.topConfig.subTitleSize"
              :min="12"
              :max="40"
              show-input
            />
          </div>
          <div class="config-item">
            <div class="title">
              添加图片
              <span class="tips">(建议选择64*64px或者同等比例的图片)</span>
            </div>
            <div class="bottom-config">
              <div class="add-img-container">
                <div class="add-btn">
                  <div
                    v-if="formData.topConfig.imgMessage.img === ''"
                    class="add-items"
                    @click="handleAddImg"
                  >
                    <span>+</span>
                    <span>添加图片</span>
                  </div>
                  <el-image
                    v-else
                    :src="checkFileUrl(formData.topConfig.imgMessage.img)"
                    fit="fill"
                  >
                    <template #error>
                      <img
                        class="img-slot"
                        src="@/assets/images/def.png"
                      >
                    </template>
                  </el-image>
                  <el-icon
                    v-if="formData.topConfig.imgMessage.img != ''"
                    class="el-icon-error"
                    @click="handleRemove"
                  >
                    <CircleCloseFilled />
                  </el-icon>
                </div>
                <div class="right-content">
                  <div class="right-titles">
                    链接
                  </div>
                  <redirect-nav
                    class="link-redirect"
                    :selected-link="formData.topConfig.imgMessage.path.name"
                    :placeholder="$t('pcdecorate.placeholder.link')"
                    @handle-nav-select="handleTopimgNavSelect"
                    @handle-remove-selected="handleTopImgRemove"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-show="currentActive === 3">
          <div class="config-item">
            <div class="title">
              自定义标题
            </div>
            <div class="bottom-config">
              <el-input v-model.trim="formData.bottomConfig.mainTitle" />
            </div>
          </div>
          <div class="config-item">
            <div class="title">
              自定义副标题
            </div>
            <div class="bottom-config">
              <el-input v-model.trim="formData.bottomConfig.subTitle" />
            </div>
          </div>
          <div class="config-item">
            <div class="title">
              立即抢购
            </div>
            <div class="bottom-config">
              <redirect-nav
                :selected-link="formData.bottomConfig.path.name"
                :placeholder="$t('pcdecorate.placeholder.link')"
                @handle-nav-select="handleBottomNavSelect"
                @handle-remove-selected="handleBottomRemoveSelected"
              />
            </div>
          </div>
          <div class="config-item">
            <div class="title">
              标题文字颜色
            </div>
            <div class="bottom-config">
              <pick-color-component
                :define-color="formData.bottomConfig.mainTitleColor"
                @handle-change-color="handleBottomTitleColor"
              />
            </div>
          </div>
          <div class="config-item">
            <div class="title">
              副标题文字颜色
            </div>
            <div class="bottom-config">
              <pick-color-component
                :define-color="formData.bottomConfig.subTitleColor"
                :reset-color="'rgba(255, 110, 0, 1)'"
                @handle-change-color="handleBottomSubColor"
              />
            </div>
          </div>
          <div class="config-item special-item">
            <div class="title">
              标题字号
            </div>
            <el-slider
              v-model="formData.bottomConfig.mainTitleSize"
              :min="12"
              :max="40"
              show-input
            />
          </div>
          <div class="config-item special-item">
            <div class="title">
              副标字号
            </div>
            <el-slider
              v-model="formData.bottomConfig.subTitleSize"
              :min="12"
              :max="40"
              show-input
            />
          </div>
          <div class="config-item">
            <div class="title">
              添加图片
              <span class="tips">(建议选择64*64px或者同等比例的图片)</span>
            </div>
            <div class="bottom-config">
              <div class="add-img-container">
                <div class="add-btn">
                  <div
                    v-if="formData.bottomConfig.imgMessage.img === ''"
                    class="add-items"
                    @click="handleAddImg"
                  >
                    <span>+</span>
                    <span>添加图片</span>
                  </div>
                  <el-image
                    v-else
                    :src="checkFileUrl(formData.bottomConfig.imgMessage.img)"
                    fit="fill"
                  >
                    <template #error>
                      <img
                        class="img-slot"
                        src="@/assets/images/def.png"
                      >
                    </template>
                  </el-image>
                  <el-icon
                    v-if="formData.bottomConfig.imgMessage.img != ''"
                    class="el-icon-error"
                    @click="handleRemove"
                  >
                    <CircleCloseFilled />
                  </el-icon>
                </div>
                <div class="right-content">
                  <div class="right-titles">
                    链接
                  </div>
                  <redirect-nav
                    class="link-redirect"
                    :selected-link="formData.bottomConfig.imgMessage.path.name"
                    :placeholder="$t('pcdecorate.placeholder.link')"
                    @handle-nav-select="handleBottomimgNavSelect"
                    @handle-remove-selected="handleBottomImgRemove"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 编辑工作区 end -->
    <!-- 商品 | 页面 | 跳转链接弹窗 start -->
    <decorate-dialog-select
      :dialog-visible="dialogVisible"
      :device-type="'mobile'"
      :current-select-type="currentSelectType"
      @handle-close="handleDialogClose"
      @handle-dialog-submit="handleDialogSubmit"
    />
    <!-- 商品 | 页面 | 跳转链接弹窗 end -->
    <!-- 弹窗, 新增图片 start -->
    <elx-imgbox
      ref="elxImgboxRef"
      :max-size="10"
      :img-size-limit="false"
      @refresh-pic="refreshPic"
    />
    <!-- 弹窗，新增图片 end -->
  </div>
</template>
<script setup>
import pickColorComponent from '../../../../../decorate/create/common-component/pick-color/index.vue'
import redirectNav from '../../../../../decorate/create/common-component/redirect-nav/index.vue'
import moduleComponent from './module.vue'
import ElxImgbox from '@/components/img-box/index.vue'
import decorateDialogSelect from '@/components/decorate-dialog-select/index.vue'
import customRemarkEditPopover from '../../../../../components/custom-remark-edit-poppver/index.vue'

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
  },
  currentUseComponents: {
    type: Array,
    default: () => {}
  }
})
const emit = defineEmits(['myCheckResult', 'componentsValueChance', 'onErrorMessageTip'])

watch(() => props.dataField, (val) => {
  if (val) {
    setFormData()
  }
})
watch(() => props.isStartCheckFieldRules, () => {
  checkData()
})

const formData = reactive({
  leftConfig: {
    mainTitle: '热卖推荐', // 自定义标题
    subTitle: '团购价更优惠', // 自定义副标题
    path: { // 跳转路径
      name: '',
      link: '',
      type: ''
    },
    mainTitleColor: 'rgba(51, 51, 51, 1)', // 主标题颜色
    subTitleColor: 'rgba(243, 52, 51, 1)', // 副标题颜色
    mainTitleSize: 15, // 主标题文字大小
    subTitleSize: 12, // 副标题文字大小
    imgMessage: {
      img: '',
      path: {
        type: '', // 链接跳转类型
        link: '',
        name: ''
      }
    }
  },
  topConfig: {
    mainTitle: '热卖推荐', // 自定义标题
    subTitle: '今日上新72件', // 自定义副标题
    path: { // 跳转路径
      name: '',
      link: '',
      type: ''
    },
    mainTitleColor: 'rgba(51, 51, 51, 1)', // 主标题颜色
    subTitleColor: 'rgba(97, 200, 180, 1)', // 副标题颜色
    mainTitleSize: 15, // 主标题文字大小
    subTitleSize: 12, // 副标题文字大小
    imgMessage: {
      img: '',
      path: {
        type: '', // 链接跳转类型
        link: '',
        name: ''
      }
    }
  },
  bottomConfig: {
    mainTitle: '热卖推荐', // 自定义标题
    subTitle: '发现好店', // 自定义副标题
    path: { // 跳转路径
      name: '',
      link: '',
      type: ''
    },
    mainTitleColor: 'rgba(51, 51, 51, 1)', // 主标题颜色
    subTitleColor: 'rgba(255, 110, 0, 1)', // 副标题颜色
    mainTitleSize: 15, // 主标题文字大小
    subTitleSize: 12, // 副标题文字大小
    imgMessage: {
      img: '',
      path: {
        type: '', // 链接跳转类型
        link: '',
        name: ''
      }
    }
  }
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

// 选中哪个
const currentActive = ref(1) // 当前激活的是哪个
const handleSelect = (index) => {
  currentActive.value = index
}

// -------------- 左边配置信息 ---------------------------
// 左边跳转链接选择
const dialogVisible = ref(false) // 弹窗是否显示
const currentSelectType = ref([]) // 当前类型
const currentOperation = ref('') // 当前操作类型
const handleLeftNavSelect = () => {
  dialogVisible.value = true
  currentSelectType.value = [1, 2, 4, 5, 6]
  currentOperation.value = 'immediaty' // 立即抢购
}
// 跳转链接删除
const handleLeftRemoveSelected = () => {
  formData.leftConfig.path.name = ''
  formData.leftConfig.path.link = ''
  formData.leftConfig.path.type = ''
}
// 标题文字颜色
const handleLeftTitleColor = (color) => {
  formData.leftConfig.mainTitleColor = color
}
// 副标题文字颜色
const handleLeftSubColor = (color) => {
  formData.leftConfig.subTitleColor = color
}
// 图片跳转
const handleLeftimgNavSelect = () => {
  dialogVisible.value = true
  currentSelectType.value = [1, 2, 4, 5, 6]
  currentOperation.value = 'addImg' // 添加图片
}
// 图片链接删除
const handleLeftImgRemove = () => {
  formData.leftConfig.imgMessage.path.type = ''
  formData.leftConfig.imgMessage.path.link = ''
  formData.leftConfig.imgMessage.path.name = ''
}
// ---------------------- 上边配置信息 -------------------
// 立即抢购跳转链接选择
const handleTopNavSelect = () => {
  dialogVisible.value = true
  currentSelectType.value = [1, 2, 4, 5, 6]
  currentOperation.value = 'immediaty' // 立即抢购
}
// 删除立即抢购的链接
const handleTopRemoveSelected = () => {
  formData.topConfig.path.name = ''
  formData.topConfig.path.link = ''
  formData.topConfig.path.type = ''
}
// 标题的文字颜色
const handleTopTitleColor = (color) => {
  formData.topConfig.mainTitleColor = color
}
// 副标题的文字颜色
const handleTopSubColor = (color) => {
  formData.topConfig.subTitleColor = color
}
// 图片跳转链接
const handleTopimgNavSelect = () => {
  dialogVisible.value = true
  currentSelectType.value = [1, 2, 4, 5, 6]
  currentOperation.value = 'addImg' // 添加图片
}
// 图片链接删除
const handleTopImgRemove = () => {
  formData.topConfig.imgMessage.path.type = ''
  formData.topConfig.imgMessage.path.link = ''
  formData.topConfig.imgMessage.path.name = ''
}
// ----------------- 下边配置信息 -----------------
// 立即抢购链接
const handleBottomNavSelect = () => {
  dialogVisible.value = true
  currentSelectType.value = [1, 2, 4, 5, 6]
  currentOperation.value = 'immediaty' // 立即抢购
}
// 立即抢购链接删除
const handleBottomRemoveSelected = () => {
  formData.bottomConfig.path.name = ''
  formData.bottomConfig.path.link = ''
  formData.bottomConfig.path.type = ''
}
// 标题的文字颜色
const handleBottomTitleColor = (color) => {
  formData.bottomConfig.mainTitleColor = color
}
// 副标题文字颜色
const handleBottomSubColor = (color) => {
  formData.bottomConfig.subTitleColor = color
}
// 图片链接跳转
const handleBottomimgNavSelect = () => {
  dialogVisible.value = true
  currentSelectType.value = [1, 2, 4, 5, 6]
  currentOperation.value = 'addImg' // 添加图片
}
// 图片链接删除
const handleBottomImgRemove = () => {
  formData.bottomConfig.imgMessage.path.type = ''
  formData.bottomConfig.imgMessage.path.link = ''
  formData.bottomConfig.imgMessage.path.name = ''
}
// 弹窗关闭
const handleDialogClose = () => {
  dialogVisible.value = false
}
// 弹窗确定
const handleDialogSubmit = ({ type, value }) => {
  if (type === '1') { // 当前选择的商品
    handleDialogSubmitProduct(value)
  } else if (type === '2') { // 当前选择的是分类
    handleDialogSubmitClassified(value)
  } else if (type === '3') { // 当前选择的是店铺
    handleDialogSubmitStore(value)
  } else if (type === '4') { // 当前选择的是页面
    handleDialogSubmitPage(value)
  } else if (type === '5') { // 当前选择的是微页面
    handleDialogSubmitSmallPage(value)
  } else if (type === '6') { // 当前选择的是自定义链接
    handleDialogSubmitCustomLink(value)
  }
  dialogVisible.value = false
}
const handleDialogSubmitProduct = (value) => {
  if (currentActive.value === 1) { // 左边配置
    if (currentOperation.value === 'immediaty') { // 立即抢购
      formData.leftConfig.path.name = value.goodsItem.spuName
      formData.leftConfig.path.link = value.goodsItem.spuId
      formData.leftConfig.path.type = '1'
    } else if (currentOperation.value === 'addImg') { // 添加图片
      formData.leftConfig.imgMessage.path.name = value.goodsItem.spuName
      formData.leftConfig.imgMessage.path.link = value.goodsItem.spuId
      formData.leftConfig.imgMessage.path.type = '1'
    }
  } else if (currentActive.value === 2) { // 上边配置
    if (currentOperation.value === 'immediaty') { // 立即抢购
      formData.topConfig.path.name = value.goodsItem.spuName
      formData.topConfig.path.link = value.goodsItem.spuId
      formData.topConfig.path.type = '1'
    } else if (currentOperation.value === 'addImg') { // 添加图片
      formData.topConfig.imgMessage.path.name = value.goodsItem.spuName
      formData.topConfig.imgMessage.path.link = value.goodsItem.spuId
      formData.topConfig.imgMessage.path.type = '1'
    }
  } else if (currentActive.value === 3) { // 下边配置
    if (currentOperation.value === 'immediaty') { // 立即抢购
      formData.bottomConfig.path.name = value.goodsItem.spuName
      formData.bottomConfig.path.link = value.goodsItem.spuId
      formData.bottomConfig.path.type = '1'
    } else if (currentOperation.value === 'addImg') { // 添加图片
      formData.bottomConfig.imgMessage.path.name = value.goodsItem.spuName
      formData.bottomConfig.imgMessage.path.link = value.goodsItem.spuId
      formData.bottomConfig.imgMessage.path.type = '1'
    }
  }
}

const handleDialogSubmitClassified = (value) => {
  if (currentActive.value === 1) { // 左边配置
    if (currentOperation.value === 'immediaty') { // 立即抢购
      formData.leftConfig.path.name = value.categoryItem.label
      formData.leftConfig.path.link = value.categoryItem.data
      formData.leftConfig.path.type = '2'
    } else if (currentOperation.value === 'addImg') { // 添加图片
      formData.leftConfig.imgMessage.path.name = value.categoryItem.label
      formData.leftConfig.imgMessage.path.link = value.categoryItem.data
      formData.leftConfig.imgMessage.path.type = '2'
    }
  } else if (currentActive.value === 2) { // 上边配置
    if (currentOperation.value === 'immediaty') { // 立即抢购
      formData.topConfig.path.name = value.categoryItem.label
      formData.topConfig.path.link = value.categoryItem.data
      formData.topConfig.path.type = '2'
    } else if (currentOperation.value === 'addImg') { // 添加图片
      formData.topConfig.imgMessage.path.name = value.categoryItem.label
      formData.topConfig.imgMessage.path.link = value.categoryItem.data
      formData.topConfig.imgMessage.path.type = '2'
    }
  } else if (currentActive.value === 3) { // 下边配置
    if (currentOperation.value === 'immediaty') { // 立即抢购
      formData.bottomConfig.path.name = value.categoryItem.label
      formData.bottomConfig.path.link = value.categoryItem.data
      formData.bottomConfig.path.type = '2'
    } else if (currentOperation.value === 'addImg') { // 添加图片
      formData.bottomConfig.imgMessage.path.name = value.categoryItem.label
      formData.bottomConfig.imgMessage.path.link = value.categoryItem.data
      formData.bottomConfig.imgMessage.path.type = '2'
    }
  }
}

const handleDialogSubmitStore = (value) => {
  if (currentActive.value === 1) { // 左边配置
    if (currentOperation.value === 'immediaty') { // 立即抢购
      formData.leftConfig.path.name = value.storeItem.shopName
      formData.leftConfig.path.link = value.storeItem.shopId
      formData.leftConfig.path.type = '3'
    } else if (currentOperation.value === 'addImg') { // 添加图片
      formData.leftConfig.imgMessage.path.name = value.storeItem.shopName
      formData.leftConfig.imgMessage.path.link = value.storeItem.shopId
      formData.leftConfig.imgMessage.path.type = '3'
    }
  } else if (currentActive.value === 2) { // 上边配置
    if (currentOperation.value === 'immediaty') { // 立即抢购
      formData.topConfig.path.name = value.storeItem.shopName
      formData.topConfig.path.link = value.storeItem.shopId
      formData.topConfig.path.type = '3'
    } else if (currentOperation.value === 'addImg') { // 添加图片
      formData.topConfig.imgMessage.path.name = value.storeItem.shopName
      formData.topConfig.imgMessage.path.link = value.storeItem.shopId
      formData.topConfig.imgMessage.path.type = '3'
    }
  } else if (currentActive.value === 3) { // 下边配置
    if (currentOperation.value === 'immediaty') { // 立即抢购
      formData.bottomConfig.path.name = value.storeItem.shopName
      formData.bottomConfig.path.link = value.storeItem.shopId
      formData.bottomConfig.path.type = '3'
    } else if (currentOperation.value === 'addImg') { // 添加图片
      formData.bottomConfig.imgMessage.path.name = value.storeItem.shopName
      formData.bottomConfig.imgMessage.path.link = value.storeItem.shopId
      formData.bottomConfig.imgMessage.path.type = '3'
    }
  }
}

const handleDialogSubmitPage = (value) => {
  if (currentActive.value === 1) { // 左边配置
    if (currentOperation.value === 'immediaty') { // 立即抢购
      formData.leftConfig.path.name = value.pageItem.title
      formData.leftConfig.path.link = value.pageItem.link
      formData.leftConfig.path.type = '4'
    } else if (currentOperation.value === 'addImg') { // 添加图片
      formData.leftConfig.imgMessage.path.name = value.pageItem.title
      formData.leftConfig.imgMessage.path.link = value.pageItem.link
      formData.leftConfig.imgMessage.path.type = '4'
    }
  } else if (currentActive.value === 2) { // 上边配置
    if (currentOperation.value === 'immediaty') { // 立即抢购
      formData.topConfig.path.name = value.pageItem.title
      formData.topConfig.path.link = value.pageItem.link
      formData.topConfig.path.type = '4'
    } else if (currentOperation.value === 'addImg') { // 添加图片
      formData.topConfig.imgMessage.path.name = value.pageItem.title
      formData.topConfig.imgMessage.path.link = value.pageItem.link
      formData.topConfig.imgMessage.path.type = '4'
    }
  } else if (currentActive.value === 3) { // 下边配置
    if (currentOperation.value === 'immediaty') { // 立即抢购
      formData.bottomConfig.path.name = value.pageItem.title
      formData.bottomConfig.path.link = value.pageItem.link
      formData.bottomConfig.path.type = '4'
    } else if (currentOperation.value === 'addImg') { // 添加图片
      formData.bottomConfig.imgMessage.path.name = value.pageItem.title
      formData.bottomConfig.imgMessage.path.link = value.pageItem.link
      formData.bottomConfig.imgMessage.path.type = '4'
    }
  }
}

const handleDialogSubmitSmallPage = (value) => {
  if (currentActive.value === 1) { // 左边配置
    if (currentOperation.value === 'immediaty') { // 立即抢购
      formData.leftConfig.path.name = value.smallPageItem.name
      formData.leftConfig.path.link = value.smallPageItem.renovationId
      formData.leftConfig.path.type = '5'
    } else if (currentOperation.value === 'addImg') { // 添加图片
      formData.leftConfig.imgMessage.path.name = value.smallPageItem.name
      formData.leftConfig.imgMessage.path.link = value.smallPageItem.renovationId
      formData.leftConfig.imgMessage.path.type = '5'
    }
  } else if (currentActive.value === 2) { // 上边配置
    if (currentOperation.value === 'immediaty') { // 立即抢购
      formData.topConfig.path.name = value.smallPageItem.name
      formData.topConfig.path.link = value.smallPageItem.renovationId
      formData.topConfig.path.type = '5'
    } else if (currentOperation.value === 'addImg') { // 添加图片
      formData.topConfig.imgMessage.path.name = value.smallPageItem.name
      formData.topConfig.imgMessage.path.link = value.smallPageItem.renovationId
      formData.topConfig.imgMessage.path.type = '5'
    }
  } else if (currentActive.value === 3) { // 下边配置
    if (currentOperation.value === 'immediaty') { // 立即抢购
      formData.bottomConfig.path.name = value.smallPageItem.name
      formData.bottomConfig.path.link = value.smallPageItem.renovationId
      formData.bottomConfig.path.type = '5'
    } else if (currentOperation.value === 'addImg') { // 添加图片
      formData.bottomConfig.imgMessage.path.name = value.smallPageItem.name
      formData.bottomConfig.imgMessage.path.link = value.smallPageItem.renovationId
      formData.bottomConfig.imgMessage.path.type = '5'
    }
  }
}

const handleDialogSubmitCustomLink = (value) => {
  if (currentActive.value === 1) { // 左边配置
    if (currentOperation.value === 'immediaty') { // 立即抢购
      formData.leftConfig.path.name = value.customLink.url
      formData.leftConfig.path.link = value.customLink
      formData.leftConfig.path.type = '6'
    } else if (currentOperation.value === 'addImg') { // 添加图片
      formData.leftConfig.imgMessage.path.name = value.customLink.url
      formData.leftConfig.imgMessage.path.link = value.customLink
      formData.leftConfig.imgMessage.path.type = '6'
    }
  } else if (currentActive.value === 2) { // 上边配置
    if (currentOperation.value === 'immediaty') { // 立即抢购
      formData.topConfig.path.name = value.customLink.url
      formData.topConfig.path.link = value.customLink
      formData.topConfig.path.type = '6'
    } else if (currentOperation.value === 'addImg') { // 添加图片
      formData.topConfig.imgMessage.path.name = value.customLink.url
      formData.topConfig.imgMessage.path.link = value.customLink
      formData.topConfig.imgMessage.path.type = '6'
    }
  } else if (currentActive.value === 3) { // 下边配置
    if (currentOperation.value === 'immediaty') { // 立即抢购
      formData.bottomConfig.path.name = value.customLink.url
      formData.bottomConfig.path.link = value.customLink
      formData.bottomConfig.path.type = '6'
    } else if (currentOperation.value === 'addImg') { // 添加图片
      formData.bottomConfig.imgMessage.path.name = value.customLink.url
      formData.bottomConfig.imgMessage.path.link = value.customLink
      formData.bottomConfig.imgMessage.path.type = '6'
    }
  }
}

// 选择图片
const elxImgboxRef = ref(null)
const handleAddImg = () => {
  elxImgboxRef.value?.init(1, 1)
}
// 选择图片后回调
const refreshPic = (imagePath) => {
  if (currentActive.value === 1) { // 左边配置
    formData.leftConfig.imgMessage.img = checkFileUrl(imagePath)
  } else if (currentActive.value === 2) { // 上边的配置
    formData.topConfig.imgMessage.img = checkFileUrl(imagePath)
  } else if (currentActive.value === 3) {
    formData.bottomConfig.imgMessage.img = checkFileUrl(imagePath)
  }
}
// 删除图片
const handleRemove = () => {
  if (currentActive.value === 1) { // 左边配置
    formData.leftConfig.imgMessage.img = ''
  } else if (currentActive.value === 2) { // 上边的配置
    formData.topConfig.imgMessage.img = ''
  } else if (currentActive.value === 3) {
    formData.bottomConfig.imgMessage.img = ''
  }
}
// 校检
const checkData = () => {
  let isPass
  let errMessage
  const str = props.currentComponent.customRemark ? props.currentComponent.customRemark : props.current
  if (formData.leftConfig.mainTitle === '' || formData.topConfig.mainTitle === '' || formData.bottomConfig.mainTitle === '') {
    isPass = false
    errMessage = '自定义标题不能为空'
  } else if (formData.leftConfig.subTitle === '' || formData.topConfig.subTitle === '' || formData.bottomConfig.subTitle === '') {
    isPass = false
    errMessage = '自定义副标题不能为空'
  } else if (formData.leftConfig.path.name === '' || formData.topConfig.path.name === '' || formData.bottomConfig.path.name === '') {
    isPass = false
    errMessage = '立即抢购跳转链接不能为空'
  } else if (formData.leftConfig.imgMessage.img === '' || formData.topConfig.imgMessage.img === '' || formData.bottomConfig.imgMessage.img === '') {
    isPass = false
    errMessage = '图片不能为空'
  } else if (formData.leftConfig.imgMessage.path.name === '' || formData.topConfig.imgMessage.path.name === '' || formData.bottomConfig.imgMessage.path.name === '') {
    isPass = false
    errMessage = '图片的跳转链接不能为空'
  } else {
    isPass = true
    errMessage = ''
  }
  if (isPass) {
    myCheckResult(isPass)
  } else {
    emit('onErrorMessageTip', {
      customRemark: str,
      rightConfigTitle: '商品模块2',
      errorMessage: errMessage
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
