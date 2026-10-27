<template>
  <div class="seckill-manage sec-add-update">
    <el-dialog
      v-model="visible"
      :title="
        !dataForm.seckillId
          ? $t('table.create'): $t('table.view')
      "
      :close-on-click-modal="false"
      width="800px"
    >
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        :rules="dataRule"
        label-width="140px"
        @submit.prevent
        @keyup.enter="onSubmit()"
      >
        <el-form-item
          :label="$t('group.actName')"
          prop="seckillName"
        >
          <el-input
            v-model.trim="dataForm.seckillName"
            maxlength="36"
            show-word-limit
            :disabled="!!dataForm.seckillId"
          />
        </el-form-item>
        <el-form-item
          :label="$t('seckill.activTime')"
          prop="dateRange"
        >
          <el-date-picker
            v-model="dataForm.dateRange"
            type="datetimerange"
            :range-separator="$t('date.tip')"
            format="YYYY-MM-DD HH:mm:ss"
            :placeholder="$t('seckill.selectDate')"
            :disabled="true"
          />
        </el-form-item>

        <el-form-item
          :label="$t('seckill.selectedLot')"
          prop="selectedLot"
        >
          <el-select
            v-model="dataForm.selectedLot"
            placeholder="请选择"
            :disabled="true"
          >
            <el-option
              v-for="item in timeTable"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          :label="$t('seckill.categoryId')"
          prop="categoryId"
        >
          <el-select
            v-model="dataForm.categoryId"
            placeholder="请选择"
            :disabled="!!dataForm.seckillId"
          >
            <el-option
              v-for="item in categoryList"
              :key="item.categoryId"
              :label="item.name"
              :value="item.categoryId"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          :label="$t('seckill.purcPerPerson')"
          prop="maxNum"
        >
          <el-checkbox
            v-model="hasMaxNum"
            :disabled="!!dataForm.seckillId"
            @click="handlerChangeMaxNum"
          >
            {{ $t("seckill.openPurchaseLimit") }}
          </el-checkbox>
          <span v-show="hasMaxNum">
            {{ $t("seckill.canBePurcPer") }}
            <el-input-number
              v-model="dataForm.maxNum"
              controls-position="right"
              :min="1"
              :max="1000"
              :disabled="!!dataForm.seckillId"
              :precision="0"
            />{{ $t("unit.item") }}
          </span>
        </el-form-item>
        <!-- 库存补充 -->
        <el-form-item
          label="库存补充"
          prop="replenish"
        >
          <div>
            <el-radio-group
              v-model="dataForm.replenish"
              class="el-form-item__content"
              :disabled="!!dataForm.seckillId"
            >
              <el-radio :label="0">
                {{ $t("group.close") }}
              </el-radio>
              <el-radio :label="1">
                {{ $t("group.open") }}
              </el-radio>
            </el-radio-group>
            <div style="line-height: 1;color: rgb(192, 196, 207)">
              开启后未秒杀完的商品库存将会补充到对应库存点中
            </div>
          </div>
        </el-form-item>
        <el-form-item
          :label="$t('seckill.product')"
          prop="seckillId"
        >
          <div class="select-prod">
            <div
              v-if="spu === null"
              class="btn-con"
            >
              <el-button
                v-if="!dataForm.seckillId"
                plain
                @click="onProdsSelect()"
              >
                {{ $t("product.select") }}
              </el-button>
            </div>

            <el-card
              v-if="spu != null"
              :body-style="{ padding: '0px' }"
              class="el-cardd"
            >
              <img-show
                :src="spu.mainImgUrl"
                :width="'100%'"
                :height="104"
              />
              <div class="card-prod-bottom card-prod-d">
                <span class="card-prod-name">{{ spu.name }}</span>
                <el-button
                  type="primary"
                  link
                  class="card-prod-name-buttons"
                  :disabled="!!dataForm.seckillId"
                  @click="onDeleteProd"
                >
                  {{ $t("table.delete") }}
                </el-button>
              </div>
            </el-card>
          </div>
          <div class="warn-tip">
            <el-icon><WarningFilled /></el-icon>
            警告：秒杀商品采用独立库存，请合理安排！
          </div>
        </el-form-item>
        <div v-if="skuList.length > 0">
          <el-table
            :data="skuList"
            border
            header-cell-class-name="table-header"
            row-class-name="table-row"
            style="width: 100%"
          >
            <el-table-column
              prop="skuName"
              :label="skuList.length===1?'商品名称':'sku名称'"
            >
              <template #default="scope">
                {{ skuList.length===1? spu.name : scope.row.skuName }}
              </template>
            </el-table-column>
            <el-table-column
              prop="price"
              :label="$t('seckill.seckillPrice')"
            >
              <template #default="scope">
                <el-input-number
                  v-if="!dataForm.seckillId"
                  v-model="scope.row.seckillPriceActual"
                  :precision="2"
                  :step="0.01"
                  :min="0.01"
                  :max="scope.row.priceFeeActual"
                  :disabled="!!(!scope.row.status || dataForm.seckillId || scope.row.isSell === 0)"
                />
                <el-input-number
                  v-if="dataForm.seckillId"
                  v-model="scope.row.seckillPriceActual"
                  :precision="2"
                  :step="0.01"
                  :min="0.01"
                  :disabled="!!(!scope.row.status || dataForm.seckillId || scope.row.isSell === 0)"
                />
                <div>{{ $t("seckill.price") }}：{{ scope.row.priceFeeActual }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="stocks"
              :label="$t('seckill.inventory')"
            >
              <template #default="scope">
                <!-- 库存 -->
                <div class="stock-number">
                  <el-input-number
                    v-model="scope.row.seckillStocks"
                    type="number"
                    :min="0"
                    :precision="0"
                    tabindex="-1"
                    :controls="spuMold===1"
                    :class="(spuMold===0 && !(!scope.row.status || scope.row.isSell === 0)) ? 'shade-input' : ''"
                    :disabled="!!(!scope.row.status || dataForm.seckillId || scope.row.isSell === 0) || (spuMold!==1 && isHaveStockPoint)"
                    @change="onChangeSeckillStocks(scope)"
                  />
                  <!-- 虚拟商品直接修改，库存添加入默认仓库 -->
                  <div
                    v-if="spuMold!==1 && isHaveStockPoint"
                    class="shade"
                    @click="onSetStock(scope)"
                  />
                </div>
                <div>{{ $t("seckill.exisocks") }}：{{ scope.row.stock }}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            @click="visible = false"
          >{{
            $t("table.cancel")
          }}</el-button>
          <el-button
            type="primary"
            :disabled="!!dataForm.seckillId"
            @click="onSubmit()"
          >{{ $t("table.confirm") }}</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 商品选择弹窗 -->
    <!-- 如果要更改dataUrl，在商品选择组件选择商品后的判断处也要更改一下 -->
    <prods-select
      v-if="prodsSelectVisible"
      ref="prodsSelectRef"
      :is-single="true"
      :not-spu-molds="[3]"
      :is-supplier-delivery="true"
      @refresh-select-prods="selectSeckillProd"
    />

    <!-- 库存设置 -->
    <stock-update
      v-if="stockUpdateVisible"
      ref="stockUpdateRef"
      :is-view="!!dataForm.seckillId"
      :is-need-verify-delivery="true"
      :delivery-mode="deliveryMode"
      :is-seckill="true"
      :is-hide-station="stockPointInfo.stationSize === 0"
      @set-stock-callback="onSetStockCallback"
    />
  </div>
</template>

<script setup>
import ProdsSelect from '@/components/prods-select/index.vue'
import Big from 'big.js'
import * as api from '@/api/seckill/seckill'
import * as categoryApi from '@/api/seckill/seckill-category'
import * as spuApi from '@/api/product/list'
import { ElMessage } from 'element-plus'
import { getStockPointInfo } from '@/api/stock/warehouse-station.js'

const emit = defineEmits(['refreshDataList'])
const visible = ref(false)
const isSubmit = ref(false)
const prodsSelectVisible = ref(false)
const prodsSelectRef = ref(null)
const hasMaxNum = ref(false)
const dataForm = ref({
  dateRange: [],
  seckillId: null,
  seckillName: null,
  startTime: null,
  selectedLot: 1,
  categoryId: null,
  endTime: null,
  seckillTag: null,
  maxNum: 1,
  maxCancelTime: 2,
  replenish: 0
})
const spu = ref(null)
const timeTable = ref([
  {
    value: 0,
    label: '00:00',
    active: false
  }, {
    value: 1,
    label: '01:00',
    active: false
  }, {
    value: 2,
    label: '02:00',
    active: false
  }, {
    value: 3,
    label: '03:00',
    active: false
  }, {
    value: 4,
    label: '04:00',
    active: false
  }, {
    value: 5,
    label: '05:00',
    active: false
  }, {
    value: 6,
    label: '06:00',
    active: false
  }, {
    value: 7,
    label: '07:00',
    active: false
  }, {
    value: 8,
    label: '08:00',
    active: true
  }, {
    value: 9,
    label: '09:00',
    active: true
  }, {
    value: 10,
    label: '10:00',
    active: true
  }, {
    value: 11,
    label: '11:00',
    active: true
  }, {
    value: 12,
    label: '12:00',
    active: true
  }, {
    value: 13,
    label: '13:00',
    active: true
  }, {
    value: 14,
    label: '14:00',
    active: true
  }, {
    value: 15,
    label: '15:00',
    active: true
  }, {
    value: 16,
    label: '16:00',
    active: true
  }, {
    value: 17,
    label: '17:00',
    active: true
  }, {
    value: 18,
    label: '18:00',
    active: false
  }, {
    value: 19,
    label: '19:00',
    active: false
  }, {
    value: 20,
    label: '20:00',
    active: false
  }, {
    value: 21,
    label: '21:00',
    active: false
  }, {
    value: 22,
    label: '22:00',
    active: false
  }, {
    value: 23,
    label: '23:00',
    active: false
  }
])
const categoryList = ref([])
const skuList = ref([])
const isError = ref(false)
const value = ref('')

const validatorDateRange = (rule, value, callback) => {
  if (!dataForm.value.dateRange || !dataForm.value.dateRange[0] || !dataForm.value.dateRange[1]) {
    callback(new Error($t('seckill.pleaheyTime')))
  }
  if (!dataForm.value.seckillId && new Date() > Date.parse(dataForm.value.dateRange[1])) {
    callback(new Error($t('seckill.endTimeCheck')))
  } else {
    callback()
  }
}

const dataRule = {
  seckillName: [
    { required: true, message: $t('seckill.evenBeEmpty'), trigger: 'blur' }
  ],
  maxCancelTime: [
    { required: true, message: $t('seckill.theOrionEmpty'), trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  dateRange: [
    { required: true, validator: validatorDateRange, trigger: 'blur' }
  ],
  seckillId: [
    { required: true, message: '请选择商品', trigger: 'blur' }
  ]
}

const dataFormRef = ref(null)
const init = (seckillId, startTime, endTime) => {
  isSubmit.value = false
  visible.value = true
  onGetStockPointInfo()
  nextTick(() => {
    dataFormRef.value?.resetFields()
    spu.value = null
    skuList.value = []
    dataForm.value.seckillId = seckillId || 0
    hasMaxNum.value = false
    getCategory()
    if (dataForm.value.seckillId) {
      api.get(dataForm.value.seckillId).then(data => {
        data.dateRange = [data.startTime, data.endTime]
        spuMold.value = data.spuMold
        dataForm.value = data
        hasMaxNum.value = data.maxNum > 0
        spu.value = data.spuVO
        deliveryMode.value = data.spuVO?.deliveryModeVO
        getSkuList(data.seckillSkuList, data.skuList, data.spuVO)
      })
    } else {
      dataForm.value.dateRange = [new Date(startTime), new Date(endTime)]
      dataForm.value.selectedLot = new Date(startTime).getHours()
    }
  })
}

const stockPointInfo = ref({})
let isHaveStockPointInfo = false
// 未获取默认仓库id，则需要获取默认仓库id
const onGetStockPointInfo = () => {
  if (!isHaveStockPointInfo) {
    getStockPointInfo().then((res) => {
      isHaveStockPointInfo = true
      stockPointInfo.value = res
    })
  }
}

/**
 * 是否存在库存点，存在多余库存点时，修改库存才进行弹窗
 * @type {ComputedRef<unknown>}
 */
const isHaveStockPoint = computed(() => {
  if (stockPointInfo.value.warehouseSize > 1) {
    // 仓库数量大于1（除默认仓库外还存在仓库），则直接返回true
    return true
  } else if ((deliveryMode.value.hasUserPickUp || deliveryMode.value.hasCityDelivery) && stockPointInfo.value.stationSize > 0) {
    // 开启了自提，且门店数量大于0返回true
    return true
  }
  return false
})

const getCategory = () => {
  categoryApi.list().then(data => {
    categoryList.value = data
  })
}
const getSkuList = (seckillSkuList, skus, spuVO = {}) => {
  skus.forEach(sku => {
    sku.priceFeeActual = Number(new Big(sku.priceFee).div(100).valueOf())
    if (seckillSkuList) {
      seckillSkuList.forEach(seckillSku => {
        if (sku.skuId === seckillSku.skuId) {
          sku.oldStatus = sku.status
          sku.status = 1 // seckillSkuList里面的sku都是启用的  所以是1
          sku.seckillStocks = seckillSku.seckillStocks
          sku.seckillPriceActual = new Big(seckillSku.seckillPrice).div(100).toFixed(2)
          sku.seckillStockPointList = seckillSku.seckillStockPointList
        }
      })
    }
  })
  // 供应商发货  是要供应商库存
  if (spuVO.supplierDeliveryType === 1) {
    if (skus && skus.length) {
      skus.forEach(element => {
        element.stock = element.supplierStock
      })
    }
  }

  skuList.value = skus
}

/**
 * 判断sku中的商品价格与order库存是否有填写
 */
const checkSku = () => {
  isError.value = false
  let disableNum = 0
  skuList.value.forEach(element => {
    if (!element.seckillPriceActual && ((element.status === 1 && element.isSell !== 0) || (element.isSell === 1 && element.status !== 0))) {
      isError.value = true
      value.value = $t('seckill.commoBeEmpty')
      return true
    }
    if (!element.seckillStocks && element.seckillStocks !== 0 && ((element.status === 1 && element.isSell !== 0) || (element.isSell === 1 && element.status !== 0))) {
      isError.value = true
      value.value = $t('seckill.commodiBeEmpty')
      return true
    }
    if (element.seckillStocks === 0 && (element.status === 1 || element.isSell === 1)) {
      isError.value = true
      value.value = $t('seckill.commodiZeroBeEmpty')
      return true
    }
    if (element.status === 0 || element.isSell === 0) {
      disableNum += 1
    }
  })
  if (disableNum === skuList.value.length) {
    isError.value = true
    value.value = $t('seckill.enableMustOne')
    return true
  }
}
// 表单提交
const onSubmit = () => {
  // 秒杀不能更新
  if (dataForm.value.seckillId) {
    visible.value = false
    return
  }
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      if (!spu.value) {
        ElMessage({
          message: $t('seckill.pleaSenProc'),
          type: 'error'
        })
        return
      }
      if (!hasMaxNum.value) {
        dataForm.value.maxNum = -1
      }
      if (hasMaxNum.value && !dataForm.value.maxNum) {
        ElMessage({
          message: '请输入限购数量',
          type: 'error'
        })
        return
      }
      // 判断sku中的商品价格与库存是否有填写
      checkSku()
      if (isError.value) {
        ElMessage.error(value.value)
        return
      }
      if (isSubmit.value) {
        return
      }
      dataForm.value.startTime = null
      dataForm.value.endTime = null
      dataForm.value.startTimestamps = new Date(dataForm.value.dateRange[0]).getTime()
      dataForm.value.prodId = spu.value.prodId
      dataForm.value.seckillSkuList = skuList.value.filter(sku => sku.status && sku.isSell !== 0)
      // 检验价格
      dataForm.value.seckillSkuList.forEach(element => {
        element.priceFee = new Big(element.priceFeeActual).times(100).toFixed()
        element.seckillPrice = new Big(element.seckillPriceActual).times(100).toFixed()
      })

      isSubmit.value = true
      const paramData = Object.assign({}, dataForm.value)
      paramData.hasMaxNum = hasMaxNum.value ? 1 : 0
      api.save(paramData).then(() => {
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            visible.value = false
            isSubmit.value = false
            emit('refreshDataList')
            dataFormRef.value?.resetFields()
          }
        })
      }).catch(() => {
        isSubmit.value = false
      })
    }
  })
}
// 显示添加指定商品弹框
const onProdsSelect = () => {
  prodsSelectVisible.value = true
  nextTick(() => {
    prodsSelectRef.value?.init(null, undefined, 0)
  })
}
const handlerChangeMaxNum = (val) => {
  if (val) {
    dataForm.value.maxNum = 1
  } else {
    dataForm.value.maxNum = -1
  }
}
const deliveryMode = ref({})
// 添加指定商品
const selectSeckillProd = (prods) => {
  if (prods) {
    skuList.value = []
    spuMold.value = prods.spuMold
    spu.value = prods
    spu.value.name = prods.spuName
    dataForm.value.spuId = spu.value.spuId
    spuApi.get(spu.value.spuId).then(data => {
      deliveryMode.value = data.deliveryModeVO
      if (data.skus?.length > 1) {
        data.skus = data.skus?.filter(item => item.spuSkuAttrValues?.length > 0)
      }
      // 供应商发货  使用供应商库存
      if (data.supplierDeliveryType === 1) {
        if (data.skus && data.skus.length) {
          data.skus.forEach(element => {
            element.stock = element.supplierStock
          })
        }
      }
      spu.value.skuList = data.skus
      getSkuList(null, spu.value.skuList, spu.value)
    })
  }
}
const onDeleteProd = () => {
  spu.value = null
  skuList.value = []
}

const stockUpdateVisible = ref(false)
const stockUpdateRef = ref(null)
const onSetStock = (scope) => {
  const { $index, row } = scope
  if (row.spuMold === 1 || row.isSell === 0 || !row.status) {
    // 虚拟商品库存为默认仓库
    return
  }
  stockUpdateVisible.value = true
  nextTick(() => {
    stockUpdateRef.value.init({ stockPointList: row.seckillStockPointList }, $index)
  })
}

// 修改库存弹窗回调
const onSetStockCallback = (res, sum, index) => {
  skuList.value[index].seckillStockPointList = res
  skuList.value[index].seckillStocks = sum
}

const spuMold = ref(null)
// 修改虚拟商品库存
const onChangeSeckillStocks = (scope) => {
  if (spuMold.value === 1 || !isHaveStockPoint.value) {
    const { $index, row } = scope
    // 虚拟商品修改时更新库存信息（库存点ID为默认仓库id）
    skuList.value[$index].seckillStockPointList = [{
      stock: row.seckillStocks,
      stockPointId: stockPointInfo.value.defaultWarehouseId,
      stockPointType: 1,
      type: 0
    }]
  }
}

defineExpose({ init })
</script>

<style lang="scss" scoped>
.sec-add-update {
  .select-prod {
    display: flex;
  }
}
.el-cardd {
  height: 160px;
  width: 120px;
}

.card-prod-bottom .card-prod-name {
  padding: 0 5px;
  line-height: 1em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}
.card-prod-d .card-prod-name-buttons {
  display: block;
  width: 100%;
  text-align: right;
  padding-right: 5px
}
:deep(.el-alert--warning) {
  height: 33px !important;
}
.warn-tip {
  font-size: 12px;
  color: #e6a23c;
  width: 100%;
  display: flex;
  align-items: center;
  &:deep(.el-icon) {
    font-size: 14px;
    margin-right: 2px;
  }
}

.stock-number {
  position: relative;
  display: inline-block;
  .shade {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    cursor: pointer;
  }
  :deep(.shade-input.is-disabled) {
    .el-input__wrapper {
      background-color: #ffffff;

      .el-input__inner {
        color: var(--el-input-text-color);
        -webkit-text-fill-color: var(--el-input-text-color);
      }
    }
  }
}
:deep(.el-icon.el-tooltip__trigger){
  position: absolute;
  top: 9px;
  left: -12px;
}

.el-form-item__content{
  left: 4px;
}
</style>
