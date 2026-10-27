<template>
  <div class="micro-promotional-activities-box">
    <div class="design-preview-controller">
      <!-- 预览区域 -->
      <div class="active-goods-show">
        <div class="activet-tit-con">
          <span class="activet-tit">{{ formData.activityType==1? $t('shopFeature.promotionalActivities.groupPurchase'):$t('shopFeature.promotionalActivities.spike') }}</span>
          <span class="view-more">{{ $t('shopFeature.promotionalActivities.more') }}
            <el-icon
              v-if="formData.linkStyle!==1"
              class="el-icon-arrow-right"
            >
              <ArrowRight />
            </el-icon>
          </span>
        </div>

        <template v-if="formData.prodIds.length">
          <div
            v-for="(item, index) in formData.prodIds"
            :key="index"
            class="active-goods-box"
          >
            <div
              v-if="formData.activityType==1 && item.groupNumber"
              class="group-number"
            >
              {{ item.groupNumber }}人团
            </div>
            <div
              class="img-box"
              :class="{empty: !formData.prodIds[0].prodName}"
            >
              <el-image
                :src="checkFileUrl(item.pic)"
                style="width: 100px;height: 100px;"
                fit="fill"
              >
                <template #error>
                  <img src="~@/assets/images/def.png">
                </template>
              </el-image>
              <!-- 下架商品蒙版 start -->
              <!-- 限时秒活动 -->
              <div
                v-if="setImgs(item, 'show')"
                class="imgs_shelves"
              >
                <img
                  class="been_imgs"
                  :src="setImgs(item, 'src')"
                >
              </div>
              <!-- 下架商品蒙版 end -->
            </div>
            <div class="active-price-con">
              <span class="active-price">{{ formatPrice((item.price || item.oriPrice), 1).toFixed(2) }}</span>
              <span class="origin-price">{{ formatPrice(item.oriPrice, 1).toFixed(2) }}</span>
            </div>
          </div>
        </template>
        <template v-else>
          <div
            v-for="(item, index) in goodsList"
            :key="index"
            class="active-goods-box"
          >
            <div
              class="img-box"
              :class="{empty: !goodsList[0].prodName}"
            >
              <img :src="item.pic">
            </div>
            <div class="active-price-con">
              <span class="active-price">{{ item.price }}</span>
              <span class="origin-price">{{ item.oriPrice }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>
    <!-- 右侧编辑内容 -->
    <div
      v-if="isShowEdit"
      class="design-editor-item design-hide-class"
    >
      <div class="design-config-editor">
        <div class="design-editor-component-title">
          <div style="flex: 1;">
            {{ $t('shopFeature.promotionalActivities.promotionalActivity') }}
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
          :model="formData"
          label-position="left"
          label-width="100px"
          @submit.prevent
        >
          <el-form-item :label="$t('shopFeature.promotionalActivities.activityType')">
            <el-radio-group
              v-model="formData.activityType"
              @change="handRadioChange"
            >
              <el-radio :label="1">
                {{ $t('shopFeature.promotionalActivities.groupPurchase') }}
              </el-radio>
              <el-radio :label="2">
                {{ $t('shopFeature.promotionalActivities.spike') }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <!-- 已添加的商品列表 -->
      <div
        v-if="formData.prodIds.length && !formData.prodIds[0].listType"
        class="goods-list"
      >
        <div
          v-for="(item, index) in formData.prodIds"
          :key="index"
          class="goods-item"
        >
          <div
            class="goods-delete-btn"
            @click="formData.prodIds.splice(index,1)"
          >
            <el-icon class="el-icon-close">
              <Close />
            </el-icon>
          </div>
          <div class="img-box">
            <img-show :src="item.pic" />
            <div
              v-if="setImgs(item, 'show')"
              class="imgs_shelves"
            >
              <img
                class="been_imgs"
                :src="setImgs(item, 'src')"
              >
            </div>
          </div>
          <div class="goods-info">
            <div class="goods-name">
              {{ item.prodName }}
            </div>
            <div class="goods-decs">
              <span>{{ $t('shopFeature.promotionalActivities.promotionPrice') }}
                <i style="font-weight:600;color:red;font-style:normal">{{ formatPrice((item.price || item.oriPrice), 1).toFixed(2) }}</i>
              </span>
              <span style="text-decoration: line-through; color:#888;padding-left:10px;">{{ formatPrice(item.oriPrice, 1).toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="formData.prodIds.length<3"
        class="p-add-btn"
        @click="addActivityProds"
      >
        <el-icon class="el-icon-plus">
          <Plus />
        </el-icon>
        {{ $t('shopFeature.promotionalActivities.addActivityProds') }}
      </div>
      <div class="ad-edit-item-title">
        <span class="tips">{{ $t('shopFeature.promotionalActivities.addActivityProdsTip') }}</span>
      </div>
    </div>
    <!-- 商品选择弹窗  -->
    <prods-select
      v-if="dialogChooseGoods"
      ref="ProdsSelectRef"
      :is-single="false"
      :data-url="'/prod/prod/activityPage'"
      :prod-type="formData.activityType"
      @refresh-select-prods="chooseGoodsFun"
    />
    <!-- 活动商品失效提示 -->
    <el-dialog
      v-model="showTipsDialog"
      :title="$t('shopFeature.list.tips')"
      width="30%"
    >
      <span>{{ $t('shopFeature.promotionalActivities.tipsContent') }}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            @click="showTipsDialog = false"
          >{{ $t('shopFeature.edit.cancel') }}</el-button>
          <el-button
            type="primary"
            @click="tipsDialogConfirm"
          >{{ $t('shopFeature.edit.confirm') }}</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 商品 | 页面 | 跳转链接弹窗 start -->
    <decorate-dialog-select
      :dialog-visible="dialogVisible"
      :device-type="'mobile'"
      :is-mulilt="true"
      :current-select-type="[1]"
      :goods-number="3"
      :echo-data-list="echoDataList"
      :data-url="'/mall4cloud_search/mp/search/renovation_page'"
      :prod-type="formData.activityType"
      @handle-close="handleDialogClose"
      @handle-dialog-submit="handleDialogSubmit"
    />
    <!-- 商品 | 页面 | 跳转链接弹窗 end -->
  </div>
</template>

<script setup>
/**
 * 创建新组件之后，在all-can-use-components中添加
 * 必须应用 microCreateMinis
 * 数据必须以formData包含
 * */
import { formatPrice } from '@/utils'
import ProdsSelect from '@/components/prods-select/index.vue'
import decorateDialogSelect from '@/components/decorate-dialog-select/index.vue'

import beenShelves from '@/assets/pc-micro-page/been_shelves.png'
import hasEnd from '@/assets/pc-micro-page/has_end.png'
import defPic from '@/assets/micro-page/def.png'
import customRemarkEditPopover from '../../../../../components/custom-remark-edit-poppver/index.vue'
/** 商品组件 */

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
const emit = defineEmits(['myCheckResult', 'componentsValueChance', 'save', 'onErrorMessageTip'])

const formData = reactive({
  activityType: 1, // 活动类型: 1团购  2秒杀
  prodIds: [] // 活动商品id
})

const setImgs = computed(() => {
  return (item, val) => {
    const params = {
      status: false,
      imgs: beenShelves
    }
    if (formData.activityType === 2) { // 秒杀
      if (item.status != 1) { // 当前就显示下架图标
        params.imgs = beenShelves
        params.status = true
      } else if (item.status === 1 && item.prodType != 2) { // 显示结束图标
        params.imgs = hasEnd
        params.status = true
      } else {
        params.status = false
      }
    } else if (formData.activityType === 1) { // 拼团
      if (item.status != 1) { // 当前就显示下架图标
        params.imgs = beenShelves
        params.status = true
      } else if (item.status === 1 && item.prodType != 1) { // 显示结束图标
        params.imgs = hasEnd
        params.status = true
      } else {
        params.status = false
      }
    }

    if (val === 'show') {
      return params.status
    } else if (val === 'src') {
      return params.imgs
    }
  }
})

const demoGoods = [] // 默认数据
const goodsList = ref([]) // 获取的接口数据
watch(() => formData.activityType, (nv, ov) => {
  if (nv !== ov) {
    goodsList.value = demoGoods
  }
}, { deep: true })
watch(() => goodsList.value.value, (nv) => {
  if (!nv.length) {
    goodsList.value = demoGoods
    return
  }
  for (let i = 0; i < nv.length; i++) {
    const el = nv[i]
    if (el.listType) {
      break
    } else {
      if (formData.prodIds.indexOf(el.prodId) === -1) {
        formData.prodIds.push(el.prodId)
      }
    }
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
  for (let i = 0; i < 3; i++) {
    demoGoods.push(
      {
        listType: 'demo',
        pic: defPic,
        oriPrice: '999',
        price: '90'
      }
    )
  }
  if (!goodsList.value.length) {
    goodsList.value = demoGoods
  }
})

/**
 * 添加活动商品按钮
 */
const dialogVisible = ref(false) // 商品弹窗
const echoDataList = ref([]) // 回显商品数据
const addActivityProds = () => {
  // activityType 活动类型: 1团购 2秒杀
  dialogVisible.value = true
  echoDataList.value = []
  formData.prodIds.forEach(item => {
    echoDataList.value.push(item)
  })
}
/**
 * 选择商品回调
 */
const dialogChooseGoods = ref(false) // 选择商品弹窗显隐
const chooseGoodsFun = (selectedGoodsList) => {
  if (selectedGoodsList) {
    if (goodsList.value[0].listType === 'demo') {
      goodsList.value = []
    }

    // 重置选择数据
    goodsList.value = []
    formData.prodIds = []
    selectedGoodsList.forEach(goodItem => {
      goodItem.pic = goodItem.pic.includes('https') ? goodItem.pic : import.meta.env.VITE_APP_RESOURCES_URL + goodItem.pic
      if (formData.prodIds.indexOf(goodItem.prodId) === -1 && formData.prodIds.length < 5) {
        goodsList.value.push(goodItem)
        formData.prodIds.push(goodItem.prodId)
      }
    })
  }
  dialogChooseGoods.value = false
}

/**
 * 提示弹窗确定按钮: 刷新活动商品数据
 */
const showTipsDialog = ref(false)
const validProdIds = ref([]) // 有效的商品id数组
const tipsDialogConfirm = () => {
  formData.prodIds = validProdIds.value
  handleActivityProdInvalid()
  showTipsDialog.value = false
}
// 关闭弹窗
const handleDialogClose = () => {
  dialogVisible.value = false
}
// 弹窗确定
const handleDialogSubmit = ({ type, value }) => {
  if (type === '1') {
    const selectList = value.goodsItem.slice(0, 3)
    formData.prodIds = []
    selectList.forEach(item => {
      if (item.spuActivity) {
        if (item.spuActivity.groupActivity) {
          item.activityPrice = item.spuActivity.groupActivity.price
        }
        if (item.spuActivity.sekillActivitySpuVO) {
          item.activityPrice = item.spuActivity.sekillActivitySpuVO.seckillPrice
        }
        if (item.spuActivity.groupActivity) {
          item.groupNumber = item.spuActivity.groupActivity.groupNumber
        }
      }
    })
    selectList.forEach(item => {
      formData.prodIds.push({
        groupNumber: item.groupNumber, // 拼团人数
        prodId: item.spuId || item.prodId, // 商品id
        prodName: item.spuName || item.prodName, // 商品名称
        id: item.spuId || item.prodId,
        spuId: item.spuId || item.prodId,
        prodType: item.spuType || item.prodType, // 活动类型
        price: item.activityPrice || item.price, // 商品价格
        status: item.spuStatus || item.status, // 商品状态
        oriPrice: item.priceFee == null ? '' : item.priceFee || item.oriPrice, // 活动价格
        pic: item.mainImgUrl || item.pic, // 商品图片
        brief: item.sellingPoint || item.brief // 商品描述
      })
    })
  }
  dialogVisible.value = false
}
/**
 * 开始验证
 */
const checkData = () => {
  const str = props.currentComponent.customRemark ? props.currentComponent.customRemark : props.current
  if (formData.prodIds.length > 0) {
    myCheckResult(true)
  } else {
    emit('onErrorMessageTip', {
      customRemark: str,
      rightConfigTitle: $t('shopFeature.allCanUse.activities'),
      errorMessage: $t('shopFeature.promotionalActivities.addProd')
    })
  }
}
const handRadioChange = () => {
  formData.prodIds = []
}

/**
 * 重新保存数据
 */
const handleActivityProdInvalid = () => {
  // 检测到有活动商品失效，剔除无效商品直接保存
  emit('save', 2, true)
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
