<template>
  <div class="supplier-add-component">
    <!-- 02、编辑商品信息 -->
    <div
      v-show="postingSteps===2"
      class="prod-sypplier-product"
    >
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        :rules="rules"
        :disabled="isViewOnly"
        @submit.prevent
      >
        <!-- 基本信息 -->
        <div class="basic">
          <div class="title">
            基本信息
          </div>
          <div
            v-if="dataForm.isSynUpdate===-1"
            class="alteration"
          >
            <el-icon color="#e6a23c">
              <WarningFilled />
            </el-icon>该商品信息已变更，请重新编辑并上架
          </div>

          <el-form-item
            label-width="120px"
            class="is-required"
            label="已选分类"
          >
            <div>
              <div class="platform-type">
                SaaS分类：{{ dataShow.stairCategory+' > '+dataShow.foxbaseCategory+' > '+dataShow.threeLevelCategory }}
              </div>
              <el-alert
                title="商品发布后SaaS分类不可修改"
                type="info"
                class="ca-warning"
                :closable="false"
                show-icon
              />
            </div>
            <div v-if="!isViewOnly">
              <div class="platform-type shop-type">
                <div class="shop-type-item">
                  店铺分类：<span class="text">{{ dataShow.stairShopCategory+(dataShow.stairShopCategory?' > ':'')+dataShow.foxbaseShopCategory }}</span>
                </div>
                <div
                  class="amend"
                  @click="selectOrReviseCategory('shop', selectedShopCategories)"
                >
                  修改
                </div>
              </div>
            </div>
          </el-form-item>
          <!-- 商品基本属性 -->
          <el-form-item
            v-if="basicAttrs.length > 0"
            label-width="120px"
            label="基本属性"
          >
            <spu-category-attrs
              :attrs-list="basicAttrs"
              :disabled="true"
              @get-value-of-basic-attrs="()=>null"
            />
          </el-form-item>

          <el-form-item
            class="item"
            prop="name"
            label-width="120px"
            label="商品名称"
          >
            <el-input
              v-model="dataForm.name"
              class="w514"
              width="120px"
              maxlength="60"
              placeholder="请输入商品名称"
            />
            <div class="hint">
              商品名称建议：商品描述+属性，长度不超过60个字符
            </div>
          </el-form-item>

          <el-form-item
            class="item"
            label-width="120px"
            label="商品卖点"
          >
            <el-input
              v-model="dataForm.sellingPoint"
              class="w514"
              width="120px"
              placeholder="请输入商品卖点"
            />
            <div class="hint">
              商品卖点展示在商品名称下面，长度不超过100个字符
            </div>
          </el-form-item>

          <el-form-item
            class="item"
            prop="imgUrls"
            label-width="120px"
            label="商品图片"
          >
            <imgs-upload
              v-model="dataForm.imgUrls"
              :type="'min'"
              :limit="9"
              :disabled="isViewOnly"
              @update:model-value="changeImages()"
            />
            <div class="hint">
              建议尺寸800*800，可拖拽调整图片顺序，最多上传9张。
            </div>
          </el-form-item>

          <el-form-item
            class="item"
            label-width="120px"
            label="商品视频"
          >
            <video-upload
              v-model:value="dataForm.video"
              :disabled="isViewOnly"
              :type="'min'"
              :limit="1"
            />
            <el-button
              v-if="dataForm.video"
              class="video-del-btn"
              type="danger"
              @click="dataForm.video = null"
            >
              删除视频
            </el-button>
            <div class="hint">
              主图视频可提升商品的成交转化，建议时长 9-30 秒，视频宽高和商品图一致。
            </div>
          </el-form-item>

          <el-form-item
            v-if="!isViewOnly"
            class="item"
            label-width="120px"
            :required="true"
            label="发货方式"
          >
            <el-radio
              v-model="dataForm.supplierDeliveryType"
              :disabled="dataForm.supplierSpuStatus===-1||dataForm.supplierSpuStatus===0||dataForm.supplierSpuStatus===2||dataForm.supplierSpuStatus===4"
              :label="1"
              @input="changeType(1)"
            >
              供应商发货
              <el-tooltip
                effect="dark"
                content="商品是由该商品相对应的供应商进行发货，商家无需操作相关发货事宜"
                placement="right"
              >
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </el-radio>

            <el-radio
              v-model="dataForm.supplierDeliveryType"
              :disabled="dataForm.spuMold === 2"
              :label="2"
              @input="changeType(2)"
            >
              商家自行发货
              <el-tooltip
                effect="dark"
                content="商家需要对该商品进行相关的发货操作"
                placement="right"
              >
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </el-radio>

            <div class="hint">
              <span v-if="dataForm.spuMold === 2">组合商品仅由供应商发货。</span>
              <span v-else>若供应商该商品处于下架状态，系统默认变更为商家发货。</span>
            </div>
          </el-form-item>

          <el-form-item
            class="item"
            label-width="120px"
            label="记件单位"
          >
            <el-input
              v-model="dataForm.measureUnit"
              :maxlength="6"
              class="w246"
              placeholder="请输入记件单位"
            />
          </el-form-item>

          <div class="flex">
            <el-form-item
              class="item"
              label-width="120px"
              label="商品品牌"
            >
              <div class="brand">
                <span>
                  <span class="brand-name">{{ dataForm.brand?dataForm.brand.name:'' }}</span>
                  <el-icon
                    v-if="dataForm.brand&&dataForm.brand.name"
                    class="el-icon-close del-brand"
                    @click="handleCloseBrand"
                  ><Close /></el-icon>
                </span>
                <span
                  v-if="!isViewOnly"
                  class="select"
                  @click="handleBrandPick"
                >选择</span>
              </div>
            </el-form-item>

            <el-form-item
              class="item"
              label-width="140px"
              label="商品排序"
            >
              <el-input
                v-model="dataForm.seq"
                class="w160"
                placeholder="请输入"
                type="number"
                :max="32767"
                :min="0"
                :step="1"
                @input="value => dataForm.seq = Math.min(value, 32767)"
              />
            </el-form-item>
          </div>
        </div>
        <!-- 规格库存 -->
        <div class="specification">
          <div class="title">
            规格库存
          </div>

          <!-- <skuTag
            ref="skuTag"
            :sku-list="dataForm.skuList"
            @change="skuTagChangeSkuHandler"
            @changeSkuImg="changeSkuImgHandler"
            @clearSkuImg="clearSkuImg"
          /> -->
          <el-form-item
            class="item"
            label-width="120px"
            label="规格库存"
          >
            <skuTable
              ref="skuTableRef"
              :sales-price-type="dataForm.salesPriceType"
              :sales-price="dataForm.salesPrice"
              :data="skuTableListData"
              :set-price="dataForm.salesType===0"
              :is-combo-spu="dataForm.isComboSpu"
              :flatten="flatten"
              :is-their-delivery="dataForm.supplierDeliveryType"
              :is-no-sku-value="isNoSkuValue"
              :spu-id="parseInt(dataForm.supplierSpuId)"
              :is-category-id="!!dataForm.shopCategoryId"
              :is-view-only="isViewOnly"
              :delivery-mode="dataForm.deliveryMode"
              :stock-point-info="stockPointInfo"
              @on-change-data="handleChangeData"
            />
          </el-form-item>
        </div>
        <!-- 运费设置 -->
        <div
          v-if="dataForm.supplierDeliveryType===2"
          class="freight"
        >
          <div class="title">
            运费设置
          </div>
          <el-form-item
            :required="true"
            class="item"
            label-width="120px"
            label="配送方式"
          >
            <el-checkbox
              v-model="dataForm.deliveryMode.hasShopDelivery"
              :true-label="0"
            >
              快递配送
            </el-checkbox>
            <el-checkbox
              v-model="dataForm.deliveryMode.hasCityDelivery"
              :disabled="stationNumber===0"
            >
              同城配送
            </el-checkbox>
            <el-checkbox
              v-model="dataForm.deliveryMode.hasUserPickUp"
              :disabled="stationNumber===0"
            >
              到店自提
            </el-checkbox>
            <div class="el-form-item-tips">
              “用户自提”及“同城配送”需在【库存一仓库门店一门店管理】处进行设置才能生效，且共享总部库存的门店无需额外设置商品库存数量
            </div>
          </el-form-item>
          <el-form-item
            v-if="dataForm.deliveryMode.hasShopDelivery"
            label="运费设置"
            label-width="120px"
            class="item"
          >
            <div class="freightSelect">
              <el-radio
                v-model="dataForm.tableRate"
                :label="0"
              >
                包邮
              </el-radio>
              <el-radio
                v-model="dataForm.tableRate"
                :label="-1"
                @change="onHandleFreight"
              >
                固定运费
              </el-radio>
              <el-radio
                v-model="dataForm.tableRate"
                :label="1"
              >
                运费模板
              </el-radio>
            </div>
          </el-form-item>
          <el-form-item
            v-if="dataForm.tableRate>0&&dataForm.deliveryMode.hasShopDelivery"
            :required="true"
            prop="deliveryTemplateId"
            class="item"
            label-width="120px"
            label="运费模板"
          >
            <div class="freightSelect">
              <el-select
                v-model="dataForm.deliveryTemplateId"
                placeholder="请选择"
                @change="changeTransportId"
              >
                <el-option
                  v-for="item in transportTemplates"
                  :key="item.transportId"
                  :label="item.transName"
                  :value="item.transportId"
                />
              </el-select>

              <div
                class="flush"
                @click="getTransportData"
              >
                刷新
              </div>
              <el-divider direction="vertical" />
              <div class="add">
                <router-link
                  target="_blank"
                  :to="{path:'/order/delivery-manage/transport'}"
                >
                  新建
                </router-link>
              </div>
            </div>
            <div class="hint">
              运费模板支持按地区、购买件数、按重量计算运费等
            </div>
          </el-form-item>
          <el-form-item
            v-if="dataForm.tableRate===-1&&dataForm.deliveryMode.hasShopDelivery"
            label="固定运费"
            prop="deliveryAmount"
            label-width="120px"
            class="item"
          >
            <div class="freight-inp">
              <el-input
                v-model="dataForm.deliveryAmount"
                :min="0.01"
                maxlength="10"
                placeholder="请输入金额"
                @blur="handleInputValue(dataForm.deliveryAmount,'deliveryAmount',0.01,9999)"
              />
            </div>
          </el-form-item>
        </div>
        <div
          v-if="isViewOnly && dataForm.detail"
          class="specification"
        >
          <div class="title">
            商品详情
          </div>
          <div
            v-rich="dataForm.detail"
            class="preview-con"
          />
        </div>
      </el-form>
      <brand-selector
        v-if="brandSelectVisible"
        ref="brandSelectRef"
        :is-single="true"
        @close="brandSelectClose"
        @refresh-select-brand="selectedBrand"
      />

      <category-selector
        v-if="categorySelectorVisible"
        ref="categorySelectorRef"
        @get-category-selected="getCategorySelected"
      />
    </div>

    <!-- 03 商品详情 -->
    <product-details
      v-if="postingSteps===3"
      ref="productDetailsRef"
      v-model:detail="dataForm.detail"
    />
  </div>
</template>

<script setup>
import Big from 'big.js'
import skuTable from './supplier-sku-table.vue'
import { transportPage } from '@/api/distribution-manage/transport'
import { treeDataTranslate, idList, getUUID } from '@/utils'
import * as api from '@/api/product/prod-info'
import { shopCategoryPage, getShopAttrs } from '@/api/product/category'
import { ElMessage } from 'element-plus'
import productDetails from './product-details.vue'
import { shopUserInfo } from '@/api/multishop/shop-user'
import { getStationListByIds } from '@/api/delivery/station'

const { postingStepsChange } = inject('prodData')

const props = defineProps({
  postingSteps: {
    required: true,
    type: Number
  },
  supplierSpuId: {
    type: Number,
    required: true
  },
  isViewOnly: {
    default: false,
    required: true,
    type: Boolean
  },
  stockPointInfo: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const Data = reactive({
  repetitionGet: false, // 判断是否重复提交请求
  deliveryTemplateId: null,
  categorySelectorVisible: false,
  dataForm: {
    tableRate: -1, // 0 包邮 -1 固定运费 大于0运费模板id
    deliveryAmount: 0.01,
    isCompose: 0, // 是否为组合商品0普通商品，1组合商品
    priceFee: null, // 售价
    marketPriceFee: null, // 市场价
    brand: {},
    categoryId: null, // 分类id
    shopCategoryId: null, // 店铺分类id
    name: '', // 商品名称
    sellingPoint: '', // 商品卖点
    mainImgUrl: '', // 主图
    imgUrls: '', // 图片
    video: '', // 视频
    supplierDeliveryType: 1, // 发货方式 1.供应商发货 2.仓库发货
    supplierId: null, // 供应商id
    supplierSpuType: 2, // 供应商商品类型 0.否 1.是 2.商家代销
    supplierSpuId: props.supplierSpuId, // 关联商品商品id，只有供应商商品为2才有
    spuCode: null, // spu编码
    supplierSpuCode: null, // 供应商spu编码
    brandId: null, // 品牌id
    deliveryMode: {
      hasShopDelivery: true,
      hasUserPickUp: false,
      hasCityDelivery: false
    }, // 配送方式
    deliveryTemplateId: null, // 运费模板id
    measureUnit: '', // 计量单位
    seq: null, // 序号
    skuList: [], // 规格列表
    totalStock: null, // 库存
    detail: '' // 商品详情
  },
  dataShow: {
    stairCategory: '', // 一级分类名称
    foxbaseCategory: '', // 二级分类名称
    threeLevelCategory: '', // 三级分类名称
    stairShopCategory: '', // 一级店铺分类名称
    foxbaseShopCategory: '', // 二级店铺分类名称
    brandName: '' // 品牌名称
  },
  brandSelectVisible: false, // 品牌选择组件显隐

  selectedShopCategories: [], // 选中的店铺分类
  transportTemplates: [], // 运费模板列表

  skuTags: [],
  skuTableListData: [],
  flatten: [],
  isNoSkuValue: false, // 回显时的商品是否有sku
  basicAttrs: [], // 基本属性列表
  salesAttrs: [], // 销售属性列表
  originalSalesAttrs: [], // 起初的(不变的)销售属性
  skuTableData: [], // sku表格返回数据
  skuTree: [],

  original: {} // 未修改的数据

})

const { categorySelectorVisible, dataForm, dataShow, brandSelectVisible, selectedShopCategories, transportTemplates, skuTableListData, flatten, isNoSkuValue, basicAttrs } = toRefs(Data)

const validateName = (rule, value, callback) => {
  if (validNoEmptySpace(value)) {
    callback(new Error('不能全为空格'))
  } else {
    callback()
  }
}

const rules = {
  imgUrls: [
    { required: true, message: '请选择商品轮播图', trigger: ['blur', 'change'] }
  ],
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { validator: validateName, trigger: 'blur' }
  ],
  deliveryTemplateId: [
    { required: true, message: '请选择运费模板', trigger: 'change' }
  ],
  deliveryAmount: [
    { required: true, message: '请输入金额', trigger: 'change' }
  ]
}

const appStore = useAppStore()

const language = computed(() => {
  return appStore.language === 'zh' ? 1 : 2
})
const stationNumber = ref(0)
onMounted(() => {
  getTransportData()
  getData()
  window.scrollTo(0, 0)
  getShopInfo()
})
const getShopInfo = () => {
  shopUserInfo().then(data => {
    stationNumber.value = data.stationNumber
  })
}
const getData = () => {
  api[props.isViewOnly ? 'getSupplierSpuProd' : 'getProdInfoPage'](props.supplierSpuId).then(data => {
    Data.dataShow.stairCategory = data.category.categories[0].name
    Data.dataShow.foxbaseCategory = data.category.categories[1].name
    Data.dataShow.threeLevelCategory = data.category.name

    if (data.shopCategory) {
      Data.dataShow.stairShopCategory = data.shopCategory.categories[0].name
      Data.dataShow.foxbaseShopCategory = data.shopCategory.name
      shopCategoryPage().then(res => {
        // 获取店铺分类数据
        const shopCategoryList = treeDataTranslate(res, 'categoryId', 'parentId')
        Data.selectedShopCategories = idList(shopCategoryList, data.shopCategoryId, 'categoryId', 'children').reverse() // 选中的分类
      })
    }
    data.deliveryMode = JSON.parse(data.deliveryMode)

    // 运费设置
    data.tableRate = data.deliveryTemplateId > 0 ? 1 : ((!data.deliveryTemplateId && data.deliveryTemplateId !== 0) ? -1 : data.deliveryTemplateId)
    data.deliveryTemplateId = data.deliveryTemplateId > 0 ? data.deliveryTemplateId : ''
    data.deliveryAmount = new Big(data.deliveryAmount || 1).div(100).valueOf()

    Data.dataForm = { ...Data.dataForm, ...data }
    if (Data.dataForm.shopCategoryId === -1) Data.dataForm.shopCategoryId = null

    Data.dataForm.spuCode = data.spuCode || Data.dataForm.supplierSpuCode
    Data.dataForm.detail = Data.dataForm.detailList && Data.dataForm.detailList.length > 0 ? Data.dataForm.detailList[0].detail : ''
    Data.dataForm.skuList = data.skus
    Data.dataForm.skus = undefined
    Data.dataForm.sellingPoint = data.spuLangList[0].sellingPoint
    if (Data.dataForm.supplierDeliveryType === 1) {
      Data.dataForm.deliveryTemplateId = null
    }

    data.spuAttrValues.forEach(spuAttrValue => {
      if (spuAttrValue.spuAttrValueLangList && spuAttrValue.spuAttrValueLangList.length > 0) {
        spuAttrValue.spuAttrValueLangList.forEach(spuAttrValueLang => {
          if (spuAttrValueLang.lang === language.value) {
            spuAttrValue.attrName = spuAttrValueLang.attrName
            spuAttrValue.attrValueName = spuAttrValueLang.attrValueName
          }
        })
      }
    })
    getAttrsByCategoryId(data.categoryId, data.spuAttrValues)

    Data.dataForm.name = data.spuLangList[0].spuName

    // sku回显
    skuBackShow(Data.dataForm.skuList) // 销售属性

    Data.dataForm.skuList.forEach(val => {
      val.myStock = val.stock || 0
      val.partyCode = val.partyCode || val.supplierSkuCode
      if (val.volume) val.volume = val.volume.toFixed(2)
      if (val.weight) val.weight = val.weight.toFixed(2)
    })
    Data.original = JSON.parse(JSON.stringify(Data.dataForm))
  })
}

/**
 * 根据分类获取基本属性列表
 */
const getAttrsByCategoryId = (categoryId, spuAttrValues) => {
  const param = {
    categoryId,
    attrType: 1 // 基本属性
  }
  api.getAttrsByCategoryId(param).then((data) => {
    // 获取数据回显
    if (spuAttrValues) {
      data.forEach((attr) => {
        spuAttrValues.forEach(spuAttr => {
          if (!attr.attrValues.length && (!spuAttr.attrValueId || spuAttr.attrValueId === 0)) {
            if (attr.attrId === spuAttr.attrId) {
              attr.attrValue = spuAttr.attrValueName
            }
          } else {
            if (attr.attrValues.some(attr => spuAttr.attrValueId === attr.attrValueId)) {
              attr.attrValue = spuAttr.attrValueId
            }
          }
        })
      })
    }
    Data.basicAttrs = data
    loadAttrsData(Data.basicAttrs)
  })
}

const dataFormRef = ref(null)
/**
 * 轮播图
 */
const changeImages = () => {
  if (Data.dataForm.imgUrls) {
    // 重新校验表单对应字段
    dataFormRef.value.validateField('imgUrls')
  }
}

/**
 * 表单验证
 */
const formValidation = () => {
  if (!Data.dataForm.name) {
    ElMessage({
      message: '请输入商品名称！',
      duration: 1000
    })
    return false
  }

  if (!Data.dataForm.imgUrls) {
    ElMessage({
      message: '请上传商品轮播图！',
      duration: 1000
    })
    return false
  }

  if (Data.dataForm.skuList?.some((skuItem) => !skuItem.priceFee)) {
    ElMessage({
      message: '商品销售价格必须大于0！',
      duration: 1000
    })
    return false
  }
  if (!Data.dataForm.shopCategoryId) {
    ElMessage({
      message: '请选择分类！',
      duration: 1000
    })
    return false
  }
  // sku数据格式转换
  changeSkuFormat()
  if (Data.dataForm.supplierDeliveryType === 1 && Data.dataForm.skuList?.some((skuItem) => skuItem.priceFee - 0 < skuItem.supplyPriceFee - 0)) {
    ElMessage({
      message: '商品销售价格不可小于供货价',
      duration: 1000
    })
    return false
  }
  if (Data.dataForm.tableRate > 0 && Data.dataForm.supplierDeliveryType === 2 && !Data.dataForm.deliveryTemplateId) {
    ElMessage({
      message: '请选择运费模板！',
      duration: 1000
    })
    return false
  }
  if (dataForm.value.skuList.length !== 0 && dataForm.value.skuList.every(temp => temp.status === 0)) {
    ElMessage({
      message: 'sku状态不能全部为禁用！',
      duration: 1000
    })
    return false
  }
  return true
}

const brandSelectRef = ref(null)
/**
 * 选择/修改品牌
 */
const handleBrandPick = () => {
  if (!Data.dataForm.categoryId) {
    return
  }
  Data.brandSelectVisible = true
  nextTick(() => {
    brandSelectRef.value.init(Data.dataForm.brand, Data.dataForm.categoryId)
  })
}

const brandSelectClose = () => {
  Data.brandSelectVisible = false
}

/**
 * 添加指定品牌
 */
const selectedBrand = (brand) => {
  if (brand) {
    Data.dataForm.brandId = brand.brandId
    Data.dataForm.brand = brand
    Data.dataForm.brand = brand
  }
}

/**
 * 运费模板
 */
const getTransportData = () => {
  transportPage().then(data => {
    Data.transportTemplates = data
  })
}

/**
 * 获取子组件返回分类数据
 */
const getCategorySelected = (selectedCategories, parentId) => {
  Data.categorySelectorVisible = false
  if (selectedCategories?.length > 1) {
    Data.dataShow.stairShopCategory = selectedCategories[0].name
    Data.dataShow.foxbaseShopCategory = selectedCategories[1].name
    Data.dataForm.shopCategoryId = parentId
  }
}

const categorySelectorRef = ref(null)
/**
 * 选择/修改分类
 */
const selectOrReviseCategory = (key, selectedCategories) => {
  const data = JSON.parse(JSON.stringify(selectedCategories))
  Data.selectKey = key
  Data.categorySelectorVisible = true
  nextTick(() => {
    categorySelectorRef.value.init(0, key, data) // 1代表从创建分类进入
  })
}

/**
 * 选择运费模板
 */
const changeTransportId = (id) => {
  Data.dataForm.deliveryTemplateId = id
}

// SkuTable返回数据
const handleChangeData = (data) => {
  Data.skuTableData = data
  const salePrices = []
  const marketPrices = []
  let totalStock = 0
  let skuNameFirst = ''
  let skuImgUrlFirst = ''
  Data.skuTableData?.forEach((sku) => {
    // 修改sku图片
    if (!skuNameFirst) {
      skuNameFirst = sku.skuName?.split(' ')[0]
      skuImgUrlFirst = sku.imgUrl
    }
    if (skuNameFirst === sku.skuName?.split(' ')[0]) {
      sku.imgUrl = skuImgUrlFirst
    } else {
      skuNameFirst = sku.skuName?.split(' ')[0]
      skuImgUrlFirst = sku.imgUrl
    }

    if (!sku.marketPriceFee) {
      sku.marketPriceFee = 0
    }
    if (sku.stock && sku.status === 1) {
      totalStock += Number(sku.stock) // 库存累加
    }
    if (sku.status === 1) {
      salePrices.push(sku.priceFee) // 售价
      marketPrices.push(sku.marketPriceFee) // 市场价
    }
    if ((!sku.stockPointList || !sku.stockPointList.length)) {
      sku.stockPointList = [{
        stock: 0,
        stockPointId: props.stockPointInfo.defaultWarehouseId,
        stockPointType: 1,
        type: 0
      }]
    }
  })
  Data.dataForm.priceFee = Math.min.apply(null, salePrices) // 最低价-售价
  Data.dataForm.marketPriceFee = Math.min.apply(null, marketPrices) // 最低价-市场价
  Data.dataForm.totalStock = totalStock // 总库存
}

/**
 * 处理提交的skuList的数据格式
 */
const changeSkuFormat = () => {
  // const nameOfAttrs = [] // 属性名组合
  /** 原始sku属性选项Id数组 */
  const originalSkuIds = Data.originalSalesAttrs.map((attr) => attr.attrId)
  Data.dataForm.hasSkuImg = 0
  const skuId = Data.skuTableData.map(x => x.skuId)
  Data.dataForm.skuList.forEach(item => {
    if (skuId.indexOf(item.skuId) === -1) {
      Data.skuTableData.push(item)
    }
  })
  Data.skuTableData.forEach(skuItem => {
    const attrsZh = []
    const attrsEn = []
    const valueZh = []
    const valueEn = []
    if (skuItem.spuSkuAttrValues?.length > 0) {
      skuItem.spuSkuAttrValues.forEach((attr, index) => {
        // sku图片
        Data.skuTree[0]?.leaf?.forEach((attrVal) => {
          if (attr.attrValueName === attrVal.text && index === 0) {
            // if (attrVal.is_show) {
            skuItem.imgUrl = attrVal.imgUrl ? attrVal.imgUrl : ''
            // }
          }
        })
        // 新增(手动输入)属性的id为空
        if (!originalSkuIds.includes(attr.attrId)) {
          attr.attrId = ''
        }
        const originalSku = getSkus(attr.attrId)
        const originalSkuValIds = originalSku.map(sku => sku.id) // 原始sku属性值选项Id数组
        // 当sku属性id为空时，sku属性值id也为空 || 请求到的属性值列表中不包含当前的id
        if (!attr.attrId || !originalSkuValIds.includes(attr.attrValueId)) {
          // 新增(手动输入)属性值的id为空
          attr.attrValueId = ''
        }

        // 多个属性名、属性值收集
        const attrInfo = getAttrInfo(Data.originalSalesAttrs, attr)
        attrsZh.push(attrInfo.attrNameZh)
        attrsEn.push(attrInfo.attrNameEn)
        valueZh.push(attrInfo.valueZh)
        valueEn.push(attrInfo.valueEn)
      })
      // attrs.push(attr.attrName)
      const skuLangZh = { lang: 1 }
      const skuLangEn = { lang: 2 }

      // attrs（属性名拼接）
      // 多个销售属性名逗号分隔  如：'颜色,版本'
      skuLangZh.attrs = Array.from(new Set(attrsZh)).join(',')
      skuLangEn.attrs = Array.from(new Set(attrsEn)).join(',')

      // skuName（属性值拼接）
      if (valueZh.length > 1) {
        skuLangZh.skuName = valueZh.join(' ') // 属性值名称 如：'红色 256G'
        skuLangEn.skuName = valueEn.join(' ') // 属性值名称 如：'红色 256G'
      } else if (skuItem.spuSkuAttrValues[0] && !skuItem.spuSkuAttrValues[1]) {
        skuLangZh.skuName = String(valueZh[0])
        skuLangEn.skuName = String(valueEn[0])
      }
      skuItem.skuLangList = []
      skuItem.skuLangList.push(skuLangZh)
      skuItem.skuLangList.push(skuLangEn)
    } else {
      skuItem.spuSkuAttrValues = []
    }

    if (skuItem.imgUrl) {
      Data.dataForm.hasSkuImg = 1
    }
  })
  // 已存在skuId&无属性的情况下，修改sku信息时应带上原本的skuId，避免skuId被更新
  if (Data.dataForm.skus?.length === 1 && Data.skuTableData.length === 1) {
    if (!Data.dataForm.skus[0].spuSkuAttrValues.length && !Data.skuTableData[0].spuSkuAttrValues.length) {
      Data.skuTableData[0].skuId = Data.dataForm.skus[0].skuId
    }
  }
  Data.dataForm.skuList = Data.skuTableData
}

/**
 * sku回显
 */
const skuBackShow = (skus) => {
  if (skus && skus.length > 0) {
    const stockPointIds = []
    const salesAttrs = []
    const ids = []
    const attrValueNameMapId = []
    skus.forEach(skuItem => {
      skuItem.marketPriceFee = formatPrice(skuItem.marketPriceFee, 1).toFixed(2) // 市场价
      skuItem.priceFee = formatPrice(skuItem.priceFee, 1).toFixed(2) // 销售价
      skuItem.supplyPriceFee = formatPrice(skuItem.supplyPriceFee, 1).toFixed(2) // 供货价
    })
    if (Data.dataForm.supplierDeliveryType === 1) {
      skus = skus.filter(x => x.supplierSkuStatus !== -1)
    }
    skus.forEach(sku => {
      sku.spuSkuAttrValues?.forEach((attrInfo, idx) => {
        if (attrInfo.spuSkuAttrValueLangList) {
          attrInfo.spuSkuAttrValueLangList.forEach(spuSkuAttrValueLang => {
            if (spuSkuAttrValueLang.lang === language.value || spuSkuAttrValueLang.lang === 0) {
              attrInfo.attrName = spuSkuAttrValueLang.attrName
              attrInfo.attrValueName = spuSkuAttrValueLang.attrValueName
            }
          })
        }
        // 无sku
        if (attrInfo.attrName === null && attrInfo.attrValueName === null) {
          Data.isNoSkuValue = true
          return
        }

        /** 有sku */
        /** left的每一项 */

        // 每一层id一致
        // 无attrId则随机生成一个新id
        ids[idx] = ids[idx] || attrInfo.attrId || getUUID()
        attrInfo.attrId = ids[idx]

        if (!attrValueNameMapId[idx]) {
          attrValueNameMapId[idx] = {}
        }

        const attrValueId = attrValueNameMapId[idx][attrInfo.attrValueName] || attrInfo.attrValueId || getUUID()
        attrValueNameMapId[idx][attrInfo.attrValueName] = attrValueId
        attrInfo.attrValueId = attrValueId
        const skuValueItem = {
          id: attrValueId,
          is_show: !!sku.imgUrl,
          text: attrInfo.attrValueName
        }

        if (idx === 0) {
          skuValueItem.imgUrl = sku.imgUrl || ''
        }
        if (salesAttrs.some(el => el.text === attrInfo.attrName)) {
          salesAttrs.forEach(el => {
            if (el.text === attrInfo.attrName) {
              el.leaf.push(skuValueItem)
            }
          })
        } else {
          salesAttrs.push({
            id: ids[idx],
            leaf: [skuValueItem],
            text: attrInfo.attrName
          })
        }
      })
      if (!sku.spuSkuAttrValues.length) {
        Data.isNoSkuValue = true
      }
      sku.stockPointList?.forEach(stockItem => {
        if (stockItem.stockPointType === 2 && stockItem.stockPointId && !stockPointIds.includes(stockItem.stockPointId)) {
          stockPointIds.push(stockItem.stockPointId)
        }
      })
      // 非自提商品，则将门店相关库存过滤并存储（提交时携带回去）
      if (!(Data.dataForm?.deliveryMode?.hasUserPickUp || Data.dataForm?.deliveryMode?.hasCityDelivery)) {
        sku.filterList = []
        sku.filterStock = 0 // 过滤出来的库存数量（库存数量变化，用于之后重新勾选后添加回去）
        sku.stockPointList = sku.stockPointList?.filter(stockItem => {
          if (stockItem.stockPointType === 2) {
            // 存储门店相关库存
            sku.filterList.push(stockItem)
            sku.filterStock += Number(stockItem.stock)
          }
          return stockItem.stockPointType === 1
        })
      }
    })
    // 去重
    salesAttrs.forEach(attr => {
      attr.leaf = removeDuplication(attr.leaf, 'text')
    })
    skus.forEach((skuItem, i) => {
      Data.flatten[i] = skuItem
    })
    salesAttrs.forEach((attr, i) => {
      Data.salesAttrs[i] = attr
    })
    Data.skuTableListData = Data.salesAttrs

    if (stockPointIds.length) {
      onGetPageStation(stockPointIds)
    }
  }

  querySalesAttrData(skus)
}

// 门店列表，用于计算库存时的状态判断
const onGetPageStation = (ids) => {
  getStationListByIds(ids).then(res => {
    const sList = res || []
    for (const flattenIt of Data.flatten) {
      flattenIt.filterList?.forEach(it => {
        const fRes = sList.find(f => f.stationId === it.stockPointId)
        it.status = fRes ? fRes.status : it.status
        it.sameCityDelivery = fRes ? fRes?.sameCityDelivery : it.sameCityDelivery
        it.selfPickup = fRes ? fRes.selfPickup : it.selfPickup
      })
      flattenIt.stockPointList?.forEach(it => {
        if (it.stockMode === 2) {
          const fRes = sList.find(f => f.stationId === it.stockPointId)
          it.status = fRes ? fRes.status : it.status
          it.sameCityDelivery = fRes ? fRes.sameCityDelivery : it.sameCityDelivery
          it.selfPickup = fRes ? fRes.selfPickup : it.selfPickup
        }
      })
    }
    skuTableRef.value.supplierDeliveryTypeChange()
  })
}

const skuTableRef = ref(null)

const changeType = (val) => {
  Data.dataForm.supplierDeliveryType = val
  let skus = JSON.parse(JSON.stringify(Data.dataForm.skuList))
  if (skus && skus.length > 0) {
    const salesAttrs = []
    const ids = []
    const attrValueNameMapId = []
    if (Data.dataForm.supplierDeliveryType === 1) {
      skus = skus.filter(x => x.supplierSkuStatus !== -1)
    }
    skus.forEach(sku => {
      sku.spuSkuAttrValues?.forEach((attrInfo, idx) => {
        ids[idx] = ids[idx] || attrInfo.attrId || getUUID()
        attrInfo.attrId = ids[idx]

        if (!attrValueNameMapId[idx]) {
          attrValueNameMapId[idx] = {}
        }
        const attrValueId = attrValueNameMapId[idx][attrInfo.attrValueName] || attrInfo.attrValueId || getUUID()
        attrValueNameMapId[idx][attrInfo.attrValueName] = attrValueId
        attrInfo.attrValueId = attrValueId
        const skuValueItem = {
          id: attrValueId,
          is_show: !!sku.imgUrl,
          text: attrInfo.attrValueName
        }

        if (idx === 0) {
          skuValueItem.imgUrl = sku.imgUrl || ''
        }
        if (salesAttrs.some(el => el.text === attrInfo.attrName)) {
          salesAttrs.forEach(el => {
            if (el.text === attrInfo.attrName) {
              el.leaf.push(skuValueItem)
            }
          })
        } else {
          salesAttrs.push({
            id: ids[idx],
            leaf: [skuValueItem],
            text: attrInfo.attrName
          })
        }
      })
    })
    Data.flatten = []
    skus.forEach((skuItem, i) => {
      Data.flatten[i] = skuItem
    })
    salesAttrs.forEach(attr => {
      attr.leaf = removeDuplication(attr.leaf, 'text')
    })
    Data.skuTableListData = salesAttrs
    skuTableRef.value.supplierDeliveryTypeChange()
  }
}

/**
 * 去重
 */
const removeDuplication = (items, validKey) => {
  items.reverse() // 倒序，保留最新的数据
  const ids = []
  const list = []
  for (let i = 0; i < items.length; i++) {
    if (ids.indexOf(items[i][validKey]) === -1) {
      list.push(items[i])
      ids.push(items[i][validKey])
    }
  }
  list.reverse()
  return list
}

/**
 * 获取店铺中的销售属性
 */
const querySalesAttrData = (skus) => {
  if (!skus) {
    Data.originalSalesAttrs.splice(0, Data.originalSalesAttrs.length)
  }
  Data.skuTree.splice(0, Data.skuTree.length) // 清空
  // 收集已创建属性id
  const usedAttridsSet = skus?.reduce((attrIdsSet, skuItem) => {
    skuItem.spuSkuAttrValues.forEach(val => attrIdsSet.add(val.attrId))
    return attrIdsSet
  }, new Set())
  getShopAttrs().then((data) => {
    loadAttrsData(data)
    Data.originalSalesAttrs = data
    let skuTrees = []
    data.forEach((item) => {
      // 将已创建属性以外的其他属性放入新数组
      if (!usedAttridsSet?.has(item.attrId) || !usedAttridsSet) {
        skuTrees.push({ id: item.attrId, text: item.name })
      }
    })
    // 去重
    skuTrees = removeDuplication(skuTrees, 'id')
    Data.originalSkuTree = skuTrees
    Data.skuTree = skuTrees
  })
}

// 国际化数据筛选
const loadAttrsData = (data) => {
  data.forEach(attr => {
    // 属性名
    let name = null
    for (let i = 0; i < attr.attrLangList.length; i++) {
      const attrLang = attr.attrLangList[i]
      name = attrLang.name ? attrLang.name : name
      if (attrLang.lang === language.value && attrLang.name) {
        break
      }
    }
    attr.name = name
    // 属性值
    for (let k = 0; k < attr.attrValues.length; k++) {
      let value = null
      const attrValues = attr.attrValues[k]
      for (let j = 0; j < attrValues.values.length; j++) {
        const attrValue = attrValues.values[j]
        if (attrValue.lang === 1 || attrValue.lang === language.value) {
          value = attrValue.value ? attrValue.value : value
        }
      }
      attrValues.value = value
    }
  })
}

// 获取规格可选值
const getSkus = (id) => {
  Data.sku = []
  Data.originalSalesAttrs.forEach(attr => {
    if (id === attr.attrId) {
      attr.attrValues.forEach(attrVal => {
        const attrValue = {}
        attrValue.text = attrVal.value
        attrValue.id = attrVal.attrValueId
        Data.sku.push(attrValue)
      })
    }
  })
  return Data.sku
}

const getAttrInfo = (data, attr) => {
  if (!attr.attrId && !attr.attrValueId) {
    return { attrNameZh: attr.attrName, valueZh: attr.attrValueName, attrNameEn: attr.attrName, valueEn: attr.attrValueName }
  }
  const attrInfo = {}
  data.forEach(spuSkuAttrValue => {
    if (spuSkuAttrValue.attrId === attr.attrId) {
      // 属性名
      if (spuSkuAttrValue.attrLangList.length === 1) {
        // attrLangList长度为1，即只存在中文
        attrInfo.attrNameZh = spuSkuAttrValue.attrLangList[0].name
        attrInfo.attrNameEn = spuSkuAttrValue.attrLangList[0].name
      } else {
        spuSkuAttrValue.attrLangList.forEach(attrLang => {
          if (attrLang.lang === 1) {
            attrInfo.attrNameZh = attrLang.name
          } else {
            attrInfo.attrNameEn = attrLang.name
          }
        })
      }
      // 属性值
      if (!attr.attrValueId) {
        attrInfo.valueZh = attr.attrValueName
        attrInfo.valueEn = attr.attrValueName
        return attrInfo
      }
      spuSkuAttrValue.attrValues.forEach(attrValue => {
        if (attrValue.attrValueId === attr.attrValueId) {
          if (attrValue.values.length === 1) {
            // attrValue.values长度为1，即只存在中文
            attrInfo.valueZh = attrValue.values[0].value
            attrInfo.valueEn = attrValue.values[0].value
          } else {
            attrValue.values.forEach(value => {
              if (value.lang === 1) {
                attrInfo.valueZh = value.value
              } else {
                attrInfo.valueEn = value.value
              }
            })
          }
        }
      })
    }
  })
  return attrInfo
}

const router = useRouter()
const route = useRoute()

const submit = () => {
  // 判断是否重复提交
  if (Data.repetitionGet) {
    return
  }
  if (!formValidation()) {
    return
  }
  dataFormRef.value.validate(valid => {
    if (!valid) {
      ElMessage({
        message: '请先将必填信息填写完整！',
        duration: 1500
      })
      return
    }
    if (!Data.dataForm.shopCategoryId) {
      ElMessage({
        message: '请选择店铺分类！',
        duration: 1500
      })
      return
    }
    if (!Data.dataForm.deliveryMode.hasShopDelivery && !Data.dataForm.deliveryMode.hasCityDelivery && !Data.dataForm.deliveryMode.hasUserPickUp) {
      ElMessage({
        message: '请选择配送方式',
        duration: 1500
      })
      return
    }
    // sku数据格式转换
    changeSkuFormat()
    const param = JSON.parse(JSON.stringify(Data.dataForm))
    // 规格处理
    param.marketPriceFee = null
    param.priceFee = null
    param.skuList.forEach(item => {
      if (param.supplierDeliveryType === 2) {
        item.changeStock = item.myStock - item.stock
        item.stock = item.myStock
      } else {
        item.stock = item.supplierStock
        item.status = 1
      }
      // 转数字类型
      item.stock = item.stock - 0
      item.changeStock = item.changeStock - 0

      item.myStock = null
      // 价格整数保存
      item.marketPriceFee = formatPrice(item.marketPriceFee)
      item.priceFee = formatPrice(item.priceFee)
      if (param.supplierDeliveryType === 2) {
        // 售价取最小值
        if (item.status === 1 && (!param.priceFee || item.priceFee < param.priceFee)) {
          param.priceFee = item.priceFee
        }
        // 市场价取最小值
        if (item.status === 1 && (!param.marketPriceFee || item.marketPriceFee < param.marketPriceFee)) {
          param.marketPriceFee = item.marketPriceFee
        }
      } else {
        // 售价取最小值
        if (item.isSell === 1 && (!param.priceFee || item.priceFee < param.priceFee)) {
          param.priceFee = item.priceFee
        }
        // 市场价取最小值
        if (item.isSell === 1 && (!param.marketPriceFee || item.marketPriceFee < param.marketPriceFee)) {
          param.marketPriceFee = item.marketPriceFee
        }
      }

      item.spuSkuAttrValues = null
    })

    param.deliveryMode = JSON.stringify(param.deliveryMode)
    // param.detailList = undefined
    param.spuLangList[0].spuName = param.name
    param.spuLangList[0].sellingPoint = param.sellingPoint
    if (param.detailList.length === 0)param.detailList.push({ detail: '', lang: 1 })
    param.detailList[0].detail = param.detail
    param.spuLangList[0].detail = param.detail

    // 主图取第一个图片
    param.mainImgUrl = param.imgUrls.split(',')[0]
    // api.save(param).then(data => {
    Data.repetitionGet = true

    // 判断哪些属性改变了
    param.nameChange = param.name === Data.original.name ? null : 1
    param.imageChange = param.imgUrls === Data.original.imgUrls ? null : 1
    param.sellingPointChange = param.sellingPoint === Data.original.sellingPoint ? null : 1
    param.videoChange = param.video === Data.original.video ? null : 1
    param.measureUnitChange = param.measureUnit === Data.original.measureUnit ? null : 1
    param.brandChange = param.brandId === Data.original.brandId ? null : 1
    param.detailChange = param.detail === Data.original.detail ? null : 1
    param.spuCodeChange = param.spuCode === Data.original.spuCode ? null : 1

    param.deliveryTemplateId = param.tableRate > 0 ? param.deliveryTemplateId : param.tableRate
    if (param.tableRate === -1) {
      param.deliveryAmount = new Big(param.deliveryAmount || 0).times(100).valueOf()
    } else {
      param.deliveryAmount = ''
    }

    api.update(param).then(() => {
      ElMessage({
        message: '修改成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          if (route.query.spuId && route.query.postingSteps && route.query.consignment) {
            router.push('/consignment/consignment/goods')
          } else if (route.query.spuId && route.query.postingSteps) {
            router.push('/product/manage/list')
          } else {
            postingStepsChange(1)
          }
        }
      })
    }).catch(() => {
      Data.repetitionGet = false
    })
  })
}

const handleCloseBrand = () => {
  if (props.isViewOnly) return
  Data.dataForm.brandId = ''
  Data.dataForm.brand = null
}

const onHandleFreight = () => {
  dataForm.value.deliveryAmount = dataForm.value.deliveryAmount < 0.01 ? 0.01 : dataForm.value.deliveryAmount
}

/**
 * 处理输入框数据
 * @param data
 * @param dataFields
 * @param min 最小值
 * @param max 最大值
 */
const handleInputValue = (data, dataFields, min, max) => {
  dataForm.value[dataFields] = checkInput(data)
  if (data || data === 0) {
    // 保留两位小数
    if (data > max) {
      dataForm.value[dataFields] = max
    }
    if (data < min) {
      dataForm.value[dataFields] = min
    }
  }
}
/**
 * 只允许输入正数和小数(保留小数点后两位)
 */
const checkInput = (num) => {
  if (num) {
    let tmpVal = String(num).replace(/[^\d^\\.]/g, '')
    const reg = /^(0|([1-9]\d*))(\.\d{1,2})?$/ // 最多允许后输入两位小数
    if (!reg.test(tmpVal)) {
      tmpVal = tmpVal + ''
      tmpVal = tmpVal.substring(0, tmpVal.indexOf('.') + 3)
      const n = (tmpVal.split('.')).length - 1
      if (n > 1) {
        tmpVal = tmpVal.substring(0, tmpVal.indexOf('.'))
      }
    }
    return tmpVal
  } else {
    return ''
  }
}

defineExpose({
  formValidation,
  submit
})
</script>
<style lang="scss" scoped>
.supplier-add-component{
  font-size: 14px;
  color: #333;
  .basic,.specification,.freight{
    .title{
      height: 40px;
      background-color: #f9f9f9;
      line-height: 40px;
      font-size: 16px;
      font-weight: bold;
      padding-left: 20px;
      margin-bottom: 20px;
    }

    .platform-type{
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 514px;
      height: 32px;
      line-height: 30px;
      background: #F7F8FA;
      border: 1px solid #E8E9EC;
      border-radius: 2px;
      padding:0 10px;
      color: #C0C4CC;
      // margin-left: 130px;

    }

    .shop-type{
      background-color: #fff;
      margin-top: 12px;
      display: flex;
      justify-content: space-between;
      .shop-type-item{
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 18px;
      }
      .text{
        color: #333;
      }
      .amend{
        cursor: pointer;
        color: #155BD4;
      }
    }

    .hint{
      font-size: 12px;
      line-height: 16px;
      margin-top: 5px;
      color: #999999;
    }
    .brand{
      width: 246px;
      height: 36px;
      border: 1px solid #dcdfe6;
      border-radius: 2px;
      display: flex;
      justify-content: space-between;
      padding: 0 10px;

      .brand-name{
        display: inline-block;
        max-width: 170px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
      }
      .del-brand {
        color: #155bd4;
        vertical-align: middle;
      }
      .del-brand:hover {
        cursor: pointer;
      }
      .select{
        color: #155BD4;
        cursor: pointer;
      }
    }
  }
  .ca-warning {
    line-height: 1em;
    max-width: 514px;
  }

  .specification{
    margin-top: 30px;
    .preview-con{
      :deep(.wscnph){
          vertical-align: middle;
          max-width: 100%;
        }
    }
  }

  .freight{
    margin-top: 30px;

    .freightSelect{
      display: flex;
      align-items: center;

      .flush{
        margin-left: 10px;
        cursor: pointer;
        color: #155BD4;
      }
      .add{
        cursor: pointer;
        color: #155BD4;
      }
    }

    .el-form-item-tips {
      font-size: 12px;
      color: #999;
      line-height: 1em;
      padding-top: 8px;
      padding-bottom: 5px;
    }

  }

  .alteration{
    height: 58px;
    line-height: 58px;
    background-color: #fff2f2;
    margin-bottom: 15px;
    font-size: 14px;
    padding-left: 10px;
  }

  :deep(.w514){
    width: 514px;
  }
  :deep(.w246){
    width: 246px;
  }
  :deep(.w160){
    width: 160px;
  }
  :deep(.inline-block){
    display: inline-block;
    vertical-align: top;
  }

  :deep(.item){
    margin-bottom: 0;
    margin-top: 30px;
  }

  .flex{
    display: flex;
  }
  .freight-inp{
    width: 175px;
  }

  :deep(.el-icon.el-tooltip__trigger){
    margin-right: 30px;
  }
}
</style>
