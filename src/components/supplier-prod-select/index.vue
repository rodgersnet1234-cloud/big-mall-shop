<template>
  <el-dialog
    v-model="visible"
    :title="$t('product.select')"
    top="100px"
    :close-on-click-modal="false"
    width="1000px"
  >
    <div class="mod-order-order">
      <div class="screening-conditions">
        <el-form
          :inline="true"
          :model="dataForm"
          @submit.prevent
          @keyup.enter="getDataList(true)"
        >
          <div class="search">
            <el-form-item label="商品名称">
              <el-input
                v-model="dataForm[shopNameKey]"
                placeholder="商品名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="编码">
              <el-input
                v-model="dataForm.partyCodes"
                placeholder="编码"
                clearable
              />
            </el-form-item>
            <el-form-item
              v-if="typeSelect === 0"
              label="供应商列表"
            >
              <el-select
                v-model="supplierId"
                placeholder="供应商列表"
              >
                <el-option
                  v-for="item in options"
                  :key="item.supplierId"
                  :label="item.supplierName"
                  :value="item.supplierId"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="searchProd()"
              >
                查询
              </el-button>
              <el-button
                @click="clear()"
              >
                {{ $t("shop.resetMap") }}
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="main">
        <div class="content">
          <!-- 列标题 -->
          <div :class="['tit']">
            <el-row style="width: 100%">
              <el-col :span="1">
                <span class="item">
                  <el-checkbox
                    v-model="checkAll"
                    :indeterminate="indeterminate"
                    :disabled="checkAllDisable"
                    @change="checkAllProd()"
                  />
                </span>
              </el-col>
              <el-col
                :span="typeSelect === 0 ? 5 : 7"
                class="column-title"
              >
                <span class="item">{{ $t("product.prodInfo") }}</span>
              </el-col>
              <el-col
                :span="3"
                class="column-title"
              >
                <span class="item">商品状态</span>
              </el-col>
              <el-col
                v-if="typeSelect === 0"
                :span="3"
                class="column-title"
              >
                <span class="item">供应商名称</span>
              </el-col>
              <el-col
                :span="typeSelect === 0 ? 4 : 6"
                class="column-title"
              >
                <span class="item">{{ $t("product.productSpecifi") }}</span>
              </el-col>
              <el-col
                :span="3"
                class="column-title"
              >
                <span class="item">编码</span>
              </el-col>
              <el-col
                v-if="typeSelect !== 0"
                :offset="1"
                :span="2"
                class="column-title"
              >
                <span class="item">库存</span>
              </el-col>
              <el-col
                v-if="typeSelect === 0"
                :span="3"
                class="column-title"
              >
                <span class="item">供应商库存</span>
              </el-col>
              <el-col
                v-if="typeSelect === 0"
                :span="2"
                class="column-title"
              >
                <span class="item">商家库存</span>
              </el-col>
            </el-row>
          </div>

          <div
            v-for="(prod, index) in dataList"
            :key="prod.prodId"
            class="prod"
            style="margin-bottom: 10px"
          >
            <div class="prod-cont">
              <el-row style="width: 100%">
                <el-col
                  :span="1"
                  style="height: 100%"
                >
                  <div class="item">
                    <el-checkbox
                      v-model="prod.check"
                      :indeterminate="indeterminateItem(prod)"
                      :disabled="prod.disable"
                      @change="checkProd(index)"
                    />
                  </div>
                </el-col>
                <el-col
                  :span="typeSelect === 0 ? 5 : 7"
                  class="public-height"
                >
                  <div class="prod-item">
                    <div
                      class="item"
                      style="margin-left:15%;width:80%"
                    >
                      <div
                        class="prod-image"
                        style="margin-right:4px"
                      >
                        <ImgShow :src="prod.mainImgUrl" />
                      </div>
                      <div class="prod-name">
                        {{ prod[typeSelect === 1 ? 'name' : 'spuName'] || prod?.spuLangList?.[0].spuName }}
                      </div>
                    </div>
                  </div>
                </el-col>
                <el-col
                  :span="3"
                  style="height: 100%"
                >
                  <div class="item">
                    {{
                      [ '删除', '下架', '上架', '平台下架', '等待审核'][prod[typeSelect === 1 ? 'status' : 'spuStatus'] +1 ]
                    }}
                  </div>
                </el-col>
                <el-col
                  v-if="typeSelect === 0"
                  :span="3"
                  style="height: 100%"
                >
                  <div class="item">
                    {{ prod.supplierName }}
                  </div>
                </el-col>
                <el-col
                  :span="typeSelect === 0 ? 12 : 13"
                  style="height: 100%"
                >
                  <div
                    v-for="(sku, skuIndex) in prod[skuKey]"
                    :key="sku.skuId"
                    class="items name"
                    :class="{'public-height': prod[skuKey].length === 1}"
                  >
                    <el-row
                      style="width: 100%"
                      class="public-height"
                    >
                      <el-col
                        :span="1"
                        style="height: 100%"
                      >
                        <div class="item">
                          <el-checkbox
                            v-if="prod[skuKey].length > 1"
                            v-model="sku.check"
                            :disabled="sku.disable"
                            @change="checkSku(index, skuIndex)"
                          />
                          <span />
                        </div>
                      </el-col>
                      <el-col
                        :span="typeSelect === 0 ? 6 : 9"
                        style="height: 100%"
                      >
                        <div class="item">
                          {{ sku.skuName || '-' }}
                        </div>
                      </el-col>
                      <el-col
                        :offset="0"
                        :span="8"
                        style="height: 100%"
                      >
                        <div class="item">
                          {{ sku.partyCode || '-' }}
                        </div>
                      </el-col>
                      <el-col
                        v-if="typeSelect !== 0"
                        :offset="0"
                        :span="6"
                        style="height: 100%"
                      >
                        <div class="item">
                          {{ sku.stock || '0' }}
                        </div>
                      </el-col>
                      <el-col
                        v-if="typeSelect === 0"
                        :span="4"
                        style="height: 100%"
                      >
                        <div class="item">
                          {{ sku.supplierStock || '-' }}
                        </div>
                      </el-col>
                      <el-col
                        v-if="typeSelect === 0"
                        :offset="1"
                        :span="4"
                        style="height: 100%"
                      >
                        <div class="item">
                          {{ sku.stock }}
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <!-- 无数据提示 -->
          <div
            v-if="dataList.length === 0"
            class="prod notDataTip"
          >
            暂无数据
          </div>
        </div>
        <el-pagination
          v-if="dataList.length"
          class="pagination"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
        />
      </div>
    </div>
    <template #footer>
      <div>
        <!-- 提交及返回按钮 -->
        <div class="submit-box">
          <el-button @click="back()">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="submitProds()"
          >
            确定
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import http from '@/utils/request'
const emit = defineEmits(['refreshSelectSupplier'])

const visible = ref(false)
const dataForm = reactive({
  partyCodes: null,
  name: null,
  spuName: null
})
const supplierId = ref(0)
const selectProds = ref([])
const selectSkuIds = ref([])
const disableSkuIds = ref([])
const disableRetailProdIds = ref([])
const dataList = ref([])
const checkAll = ref(false)
const disable = ref(false)
const pageIndex = ref(1)
const pageSize = ref(10)
const totalPage = ref(0)
const dataListLoading = ref(false)
const dataListSelections = ref([])

const options = ref([])
const props = defineProps({
  type: {
    // 0：普通商品， 1：供应商商品
    default: 0,
    type: Number
  },
  dataUrl: {
    default: '',
    type: String
  },
  typeSelect: {
    default: 0,
    type: Number
  }
})

const skuKey = computed(() => {
  return props.typeSelect === 1 ? 'skus' : 'skuList'
})
const shopNameKey = computed(() => {
  return props.typeSelect === 1 ? 'name' : 'spuName'
})
const indeterminate = computed(() => {
  return dataList.value.length > 0 && dataList.value.filter((e) => e.check).length > 0 && dataList.value.filter((e) => e.check).length < dataList.value.length
})
const checkAllDisable = computed(() => {
  if (dataList.value.length) {
    const checkDataListLen = dataList.value.filter((e) => e.check).length
    if (checkDataListLen === dataList.value.length && initShopIDs.length) return true
  }
  return false
})

onActivated(() => {
  getDataList()
  getSupplierList()
})

let initShopIDs = []
let stockPointId = '' // 库存点id
// 获取数据列表
const init = (data) => {
  initShopIDs = data.skuIds ? [...data.skuIds] : []
  supplierId.value = data.supplierId
  disableSkuIds.value = data.skuIds ? [...data.skuIds] : []
  disableRetailProdIds.value = data.retailProdIds ? [...data.retailProdIds] : []
  visible.value = true
  checkAll.value = false
  selectProds.value = data.prods ? [...data.prods] : []
  selectSkuIds.value = data.skuIds ? [...data.skuIds] : []
  stockPointId = data.stockPointId ? data.stockPointId : ''
  pageIndex.value = 1
  pageSize.value = 10
  totalPage.value = 0
  dataListLoading.value = true
  clear()
  getDataList()
  getSupplierList()
}
const getDataList = (newData = false) => {
  let search = {}
  if (newData) {
    search = dataForm
    if (props.typeSelect === 1) {
      search.partyCode = search.partyCodes
    }
  }
  if (props.typeSelect === 0) {
    search.shopQuerySupplierSpu = true
  }
  http({
    url: props.dataUrl ? props.dataUrl : (props.typeSelect === 1 ? '/mall4cloud_product/m/spu/pageSpuSku' : 'mall4cloud_search/mp/search/page_supplier_spu_list'),
    method: 'get',
    params:
      Object.assign(
        {
          pageNum: pageIndex.value,
          pageSize: pageSize.value,
          supplierIds: supplierId.value,
          stockPointId
        }, search
      )
  }).then(data => {
    loadCheck(data)
    dataList.value = data.list
    totalPage.value = data.total
    dataListLoading.value = false
  })
}
const getSupplierList = () => {
  http({
    url: 'mall4cloud_admin/m/supplier_detail/page_supplier',
    method: 'get',
    params: {
      pageSize: 10000,
      pageNum: 1
    }
  }).then(data => {
    options.value = data.list
  })
}
const loadCheck = (data) => {
  let checkAllStatus = true
  data.list.forEach(prod => {
    if (props.type === 0) {
      prod.type = 1
    }
    let check = true
    prod.disable = props.typeSelect === 1
    if (props.typeSelect === 1) {
      prod.skus.forEach(sku => {
        // 禁用已选择的sku及商品
        if (containsId(sku.skuId)) {
          sku.check = true
          sku.disable = true
        } else {
          prod.disable = false
          sku.disable = false
          sku.check = containsId(sku.skuId)
        }
        if (!sku.check) {
          // 普通商品
          sku.check = selectSkuIds.value.indexOf(sku.skuId) !== -1
        }
        if (check && !sku.check) {
          check = false
        }
      })
    } else {
      const list = prod.skuList ? prod.skuList : prod.skus
      list.forEach(sku => {
        if (containsId(sku.skuId)) {
          sku.check = true
        } else {
          sku.disable = false
          sku.check = containsId(sku.skuId)
        }
        if (!sku.check) {
          // 普通商品
          sku.check = selectSkuIds.value.indexOf(sku.skuId) !== -1
        }
        if (check && !sku.check) {
          check = false
        }
      })
    }

    prod.check = check
    if (checkAllStatus && !prod.check) {
      checkAllStatus = false
    }
  })
  disable.value = checkAllStatus
  checkAll.value = checkAllStatus
}
const containsId = (skuId) => {
  return disableSkuIds.value.indexOf(skuId) !== -1
}
const selectProduct = (prod, sku) => {
  // 勾选
  if (sku.check) {
    if (props.type === 0) {
      if (selectSkuIds.value.indexOf(sku.skuId) !== -1) {
        return
      }
      selectProds.value.push({
        prodId: prod.prodId,
        skuId: sku.skuId,
        spuId: sku.spuId,
        spuName: props.typeSelect === 1 ? prod.name : prod.spuName,
        prodName: prod.prodName,
        skuName: sku.skuName,
        stocks: sku.stock,
        partyCode: sku.partyCode,
        pic: sku.imgUrl || prod.mainImgUrl,
        supplierId: prod.supplierId,
        supplierName: prod.supplierName
      })
    } else if (props.type === 1) {
      // 普通商品
      if (selectSkuIds.value.indexOf(sku.skuId) !== -1) {
        return
      }
      selectProds.value.push({
        prodId: prod.prodId,
        prodName: prod.prodName,
        pic: sku.imgUrl || prod.mainImgUrl,
        skuId: sku.skuId,
        spuId: sku.spuId,
        spuName: props.typeSelect === 1 ? prod.name : prod.spuName,
        skuName: sku.skuName,
        stocks: sku.supplierStock,
        partyCode: sku.partyCode,
        minOrderQuantity: sku.minOrderQuantity,
        purchasePrice: sku.priceFee,
        supplierProdId: sku.supplierProdId,
        type: prod.type,
        supplierId: prod.supplierId,
        supplierName: prod.supplierName,
        stock: sku.stock, // 采购订单商家库存
        supplierStock: sku.supplierStock // 采购订单供应商库存
      })
    }
    selectSkuIds.value.push(sku.skuId)
  } else {
    if (selectSkuIds.value.indexOf(sku.skuId) === -1) {
      return
    }
    // 取消勾选
    for (let i = 0; i < selectProds.value.length; i++) {
      if (selectProds.value[i].skuId === sku.skuId) {
        selectProds.value.splice(i, 1)
      }
    }

    selectSkuIds.value.splice(selectSkuIds.value.indexOf(sku.skuId), 1)
  }
}
const checkAllProd = () => {
  dataList.value.forEach(prod => {
    prod.check = checkAll.value
    if (props.typeSelect === 1) {
      prod.skus.forEach(sku => {
        // 勾选或取消勾选没有被禁用的sku
        if (!sku.disable) {
          sku.check = checkAll.value
          selectProduct(prod, sku)
        }
      })
    } else {
      prod.skuList.forEach(sku => {
        // 勾选或取消勾选没有被禁用的sku
        if (!sku.disable) {
          sku.check = checkAll.value
          selectProduct(prod, sku)
        }
      })
    }
  })
}
const checkProd = (index) => {
  const prod = dataList.value[index]
  if (props.typeSelect === 1) {
    prod.skus.forEach(sku => {
      // 勾选或取消勾选没有被禁用的sku
      if (!sku.disable) {
        sku.check = prod.check
        selectProduct(prod, sku)
      }
    })
  } else {
    prod.skuList.forEach(sku => {
      // 勾选或取消勾选没有被禁用的sku
      if (!sku.disable) {
        sku.check = prod.check
        selectProduct(prod, sku)
      }
    })
  }
  dataList.value[index] = prod
  checkStatus()
}
const checkSku = (index, skuIndex) => {
  const prod = dataList.value[index]
  let check = true
  for (let i = 0; i < prod[skuKey.value].length; i++) {
    const sku = prod[skuKey.value][i]
    if (check && !sku.check) {
      check = false
    }
    if (skuIndex === i) {
      selectProduct(prod, sku)
    }
  }

  prod.check = check
  dataList.value[index] = prod
  checkStatus()
}
const checkStatus = () => {
  let checkAllStatus = true
  for (let i = 0; i < dataList.value.length; i++) {
    if (!dataList.value[i].check) {
      checkAllStatus = false
      break
    }
    const prod = dataList.value[i]
    if (prod.skuList) {
      for (let j = 0; j < prod.skuList.length; j++) {
        if (!prod.skuList[j].check) {
          checkAllStatus = false
          break
        }
      }
    }
  }
  checkAll.value = checkAllStatus
}
// 每页数
const sizeChangeHandle = (val) => {
  pageSize.value = val
  pageIndex.value = 1
  getDataList()
}
// 当前页
const currentChangeHandle = (val) => {
  pageIndex.value = val
  getDataList()
}
/**
 * 根据条件搜索商品
 */
const searchProd = () => {
  pageIndex.value = 1
  getDataList(true)
}
/**
 * 清空搜索条件
 */
const clear = () => {
  dataForm.partyCodes = null
  dataForm.name = null
  dataForm.spuName = null
  supplierId.value = null
}
// 确定事件
const submitProds = () => {
  emit('refreshSelectSupplier', selectProds.value)
  dataListSelections.value = []
  visible.value = false
}
// 取消事件
const back = () => {
  dataListSelections.value = []
  visible.value = false
}

// 商品多规格是否部分选中
const indeterminateItem = (prod) => {
  return Boolean(prod[skuKey.value].length > 0 && prod[skuKey.value].filter((e) => e.check).length > 0 && prod[skuKey.value].filter((e) => e.check).length < prod[skuKey.value].length)
}
defineExpose({ init })
</script>
<style lang="scss" scoped>
.search {
  width: 100%;
}
.public-height {
  height: 100%;
}

.screening-conditions {
  display: block;
  padding: 20px !important;
  background: #f8f8f9;
  margin-bottom: 20px;
}

.submit-box {
  display: inline-block;
  margin-top: 15px;
}
.mod-order-order {
  .main {
    .tit {
      margin-bottom: 15px;
      background: #F7F8FA;
      z-index: 11;
      height: 57px;
      font-weight: bold;
    }
    .column-title {
      text-align: center;
    }
  }
  .tit {
    display: flex;
    height: 45px;
    align-items: center;
  }
  .tit .item {
    padding: 0 10px;
    width: 10%;
    text-align: center;
  }
  .prod-tit span {
    margin-right: 15px;
  }
  .prod-cont {
    display: flex;
    border: 1px solid #EBEDF0;
    color: #495060;
  }
  .prod-cont .item {
    display: flex;
    display: -webkit-flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    text-align: center;
    height: 100%;
  }
  .item span {
    display: inline-block !important;
  }
  .prod-cont .prod-item {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .prod-item .prod-name {
    width: 55%;
    text-align: left;
    // 超过2行溢出隐藏
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2;
    overflow:hidden;
    word-break: break-all;
  }
  .prod-price span {
    display: block;
  }
  .prod-price span:first-child {
    margin-bottom: 10px;
  }
  .prod-cont .items.name {
    display: flex;
    align-items: center;
    position: relative;
    padding: 10px;
    border-bottom: 1px solid #EBEDF0;
  }
  .prod-cont .items.name:last-child {
    border-bottom: none;
  }
  .prod-image {
    margin-right: 5px;
    width: 80px;
    height: 80px;
  }

  // 修改物流弹窗
  .change-logistics .item {
    padding-bottom: 20px;
  }

  .change-logistics .item .i-con .con .con-radio span {
    display: inline-block;
    vertical-align: middle;
    margin-right: 8px;
  }

  .goods-box .item {
    margin-right: 10px;
    font-size: 12px;
    cursor: pointer;
  }

  .goods-box .item:last-child {
    margin: 0;
  }

  .goods-box .item .name {
    width: 60px;
    height: 16px;
    line-height: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #999;
  }
}
</style>
<style scoped>
div :deep(.el-tabs__active-bar) {
  width: 0 !important;
}
div :deep(.el-tabs__item) {
  padding: 0 20px !important;
  min-width: 68px;
  width: auto;
  text-align: center;
}
div :deep(.el-tabs__item.is-active) {
  background: rgba(21, 91, 212, 0.1);
  border-bottom: 2px solid #155BD4;
}
.notDataTip{
  text-align: center;
  color:#999
}
.pagination{
  text-align: right;
}
</style>
