<template>
  <el-dialog
    v-model="visible"
    :title="$t('product.select')"
    top="100px"
    :close-on-click-modal="false"
    width="1000px"
  >
    <div class="mod-order-order">
      <div class="screening-conditions search-bar">
        <el-form
          :inline="true"
          :model="dataForm"
          @submit.prevent
          @keyup.enter="getDataList(true)"
        >
          <div class="search input-row">
            <el-form-item label="商品名称">
              <el-input
                v-model="dataForm.spuName"
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
                    :disabled="disable"
                    @change="checkAllProd()"
                  />
                </span>
              </el-col>
              <el-col
                :span="7"
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
                :span="6"
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
                :offset="1"
                :span="2"
                class="column-title"
              >
                <span class="item">库存</span>
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
                  :span="7"
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
                        {{ prod.name }}
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
                      [ '删除', '下架', '上架', '平台下架', '等待审核'][prod.status +1 ]
                    }}
                  </div>
                </el-col>
                <el-col
                  :span="13"
                  style="height: 100%"
                >
                  <div
                    v-for="(sku, skuIndex) in prod.skus"
                    :key="sku.skuId"
                    class="items name"
                    :class="{'public-height': prod.skus.length === 1}"
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
                            v-if="prod.skus.length > 1"
                            v-model="sku.check"
                            :disabled="sku.disable"
                            @change="checkSku(index, skuIndex)"
                          />
                          <span />
                        </div>
                      </el-col>
                      <el-col
                        :span="9"
                        style="height: 100%"
                      >
                        <div class="item">
                          {{ judgeLang(sku.skuLangList) }}
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
                        :offset="0"
                        :span="6"
                        style="height: 100%"
                      >
                        <div class="item">
                          {{ sku.stock || '0' }}
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
import { getPageStockPointSku } from '@/api/stock/warehouse-station.js'
const emit = defineEmits(['refreshSelectSupplier'])

const visible = ref(false)
const dataForm = reactive({
  partyCodes: null,
  spuName: null
})
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

const props = defineProps({
  // 库存点Id
  stockPointId: {
    default: 0,
    type: Number
  },
  // 库存点类型
  stockPointType: {
    default: 2,
    type: Number
  },
  // 是否实物盘点(实物盘点不查询虚拟商品)
  isTakeStock: {
    default: false,
    type: Boolean
  }
})

const indeterminate = computed(() => {
  return dataList.value.length > 0 && dataList.value.filter((e) => e.check).length > 0 && dataList.value.filter((e) => e.check).length < dataList.value.length
})

onActivated(() => {
  getDataList()
})

const judgeLang = (langList) => {
  const lang = $t('language') === 'English' ? 2 : 1
  return langList.find(item => item.lang === lang)?.skuName || '-'
}

// 获取数据列表
const init = (data) => {
  disableSkuIds.value = data.skuIds ? data.skuIds : []
  disableRetailProdIds.value = data.retailProdIds ? data.retailProdIds : []
  visible.value = true
  checkAll.value = false
  selectProds.value = data.prods ? data.prods : []
  selectSkuIds.value = data.skuIds ? data.skuIds : []
  pageIndex.value = 1
  pageSize.value = 10
  totalPage.value = 0
  dataListLoading.value = true
  clear()
  getDataList()
}

const getDataList = (newData = false) => {
  let search = {}
  if (newData) {
    search = dataForm
    search.partyCode = search.partyCodes
  }
  const params = {
    pageNum: pageIndex.value,
    pageSize: pageSize.value,
    stockPointType: props.stockPointType,
    stockPointId: props.stockPointId,
    type: null,
    spuMold: props.isTakeStock ? 0 : null,
    ...search
  }
  getPageStockPointSku(params).then((res) => {
    loadCheck(res)
    dataList.value = res.list
    totalPage.value = res.total
    dataListLoading.value = false
  })
}

const loadCheck = (data) => {
  let checkAllStatus = true
  data.list.forEach(prod => {
    let check = true
    prod.disable = true
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
    if (selectSkuIds.value.indexOf(sku.skuId) !== -1) {
      return
    }
    selectProds.value.push({
      prodId: prod.prodId,
      skuId: sku.skuId,
      spuId: sku.spuId,
      spuName: prod.name,
      prodName: prod.prodName,
      skuName: sku.skuName,
      stocks: sku.stock,
      partyCode: sku.partyCode,
      pic: sku.imgUrl || prod.mainImgUrl,
      supplierName: prod.supplierName
    })
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
    prod.skus.forEach(sku => {
      // 勾选或取消勾选没有被禁用的sku
      sku.check = checkAll.value
      selectProduct(prod, sku)
    })
  })
}
const checkProd = (index) => {
  const prod = dataList.value[index]
  prod.skus.forEach(sku => {
    // 勾选或取消勾选没有被禁用的sku
    sku.check = prod.check
    selectProduct(prod, sku)
  })
  dataList.value[index] = prod
  checkStatus()
}
const checkSku = (index, skuIndex) => {
  const prod = dataList.value[index]
  let check = true
  for (let i = 0; i < prod.skus.length; i++) {
    const sku = prod.skus[i]
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
  dataForm.spuName = null
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
  return Boolean(prod.skus.length > 0 && prod.skus.filter((e) => e.check).length > 0 && prod.skus.filter((e) => e.check).length < prod.skus.length)
}

defineExpose({ init })

</script>

<style lang="scss" scoped>
@use "index";
</style>
