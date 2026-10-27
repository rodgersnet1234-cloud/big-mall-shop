<template>
  <!-- 基本信息 -->
  <div class="component-stock-bill-basic-info">
    <el-form
      ref="dataFormRef"
      label-width="auto"
      :model="dataForm"
      :rules="rules"
      @submit.prevent
    >
      <span class="title">{{ $t('stock.basicInformation') }}</span>
      <el-divider />
      <!-- 基本信息 -->
      <!-- 库存点类型 -->
      <el-form-item
        label="库存点类型"
      >
        <el-radio-group
          v-model="dataForm.stockPointType"
          @change="onPointTypeChange"
        >
          <el-radio :label="1">
            仓库
          </el-radio>
          <el-radio :label="2">
            门店
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 库存点名称（新建） -->
      <el-form-item
        label="库存点名称"
        prop="stockPointId"
      >
        <el-select
          v-model="dataForm.stockPointId"
          placeholder="请选择"
          @change="onPointIdChange"
        >
          <el-option
            v-for="item in pointOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="type === 1 ? $t('stock.deliveryDate') : $t('stock.warehousingDate')"
        prop="businessTime"
      >
        <el-date-picker
          v-model="dataForm.businessTime"
          type="date"
          :placeholder="$t('admin.seleData')"
          value-format="YYYY-MM-DD HH:mm:ss"
          :disabled-date="businessTimeOptions"
          class="el-date-picker"
        />
      </el-form-item>
      <el-form-item
        ref="stockChangeReasonIdRef"
        :label="type === 1 ? $t('stock.deliveryReason') : $t('stock.warehousingReason')"
        prop="stockChangeReasonId"
      >
        <el-select
          v-model="dataForm.stockChangeReasonId"
          :placeholder="$t('tip.select')"
          @change="selectReason"
        >
          <el-option
            v-for="node in reasonList"
            :key="node.stockChangeReasonId"
            :label="node.reason"
            :value="node.stockChangeReasonId"
          />
        </el-select>
        <!--新建/刷新-->
        <div class="create-refresh-btn">
          <el-button
            type="primary"
            link
            class="default-btn text-btn"
            @click="getReasonList"
          >
            {{ $t('admin.refresh') }}
          </el-button>
          <el-divider direction="vertical" />
          <el-button
            type="primary"
            link
            class="default-btn text-btn"
            @click.stop="createReason()"
          >
            {{ $t('admin.newConstruction') }}
          </el-button>
        </div>
      </el-form-item>
      <el-form-item
        :label="$t('stock.remark')"
        prop="remark"
      >
        <el-input
          v-model="dataForm.remark"
          class="remark"
          maxlength="50"
          type="textarea"
          show-word-limit
          :row="5"
        />
      </el-form-item>
      <!-- 附件 -->
      <span class="title">{{ $t('stock.appendix') }}</span>
      <el-divider />
      <el-form-item :label="type === 1 ? $t('stock.deliveryCertificate') : $t('stock.warehousingCertificate')">
        <div class="business-qual">
          <imgs-upload
            v-model="dataForm.qualifications"
            :limit="4"
            :prompt="false"
          />
        </div>
        <div class="upload-tips">
          {{ type === 1 ? $t('stock.businessOutQualTips') : $t('stock.businessInQualTips') }}
        </div>
      </el-form-item>
    </el-form>
    <reason-add-or-update
      v-if="reasonAddOrUpdateVisible"
      ref="reasonAddOrUpdateRef"
      @refresh-data-list="getReasonList"
    />
  </div>
</template>

<script setup>
import reasonAddOrUpdate from './customizereason-add-or-update.vue'
import { getList } from '@/api/stock/stock-bill-basic-info'
import { getListWarehouse, getListStation } from '@/api/stock/warehouse-station.js'

const props = defineProps({
  type: {
    default: 0,
    type: Number // 1 出库 2 入库
  },
  stockBillLogId: {
    default: 0,
    type: Number
  },
  stockBillLogInfo: {
    default: () => {},
    type: Object
  }
})

const emit = defineEmits(['changeStockPointId'])

const dataForm = reactive({
  stockBillLogId: null,
  businessTime: '', // 出入库时间
  stockChangeReasonId: '', // 出入库原因id
  remark: '', // 出入库备注信息
  qualifications: '', // 出入库凭证
  status: '',
  stockPointType: 1,
  stockPointId: ''
})
const reasonAddOrUpdateVisible = ref(false)
const reasonList = ref([]) // 出入库原因
// 出入库日期选择限制
const businessTimeOptions = (time) => {
  return time.getTime() > Date.now()
}
const validateWarehouseId = (rule, value, callback) => {
  if (value && dataForm.stockPointType === 1 && warehouseList[value].type === 0 && !(warehouseList[value].provinceId && warehouseList[value].cityId && warehouseList[value].areaId)) {
    callback(new Error('请先将默认仓库的地址信息填写完整'))
  } else {
    callback()
  }
}
const rules = {
  businessTime: [
    { required: true, message: props.type === 1 ? $t('stock.deliveryDateNotEmpty') : $t('stock.warehousingDateNotEmpty'), trigger: 'blur' }
  ],
  stockChangeReasonId: [
    { required: true, message: props.type === 1 ? $t('stock.deliveryReasonNotEmpty') : $t('stock.warehousingReasonNotEmpty'), trigger: 'blur' }
  ],
  stockPointId: [
    { required: true, message: '请选择库存点', trigger: 'blur' },
    { validator: validateWarehouseId, trigger: 'change' }
  ]
}
watch(
  () => props.stockBillLogInfo,
  async (val) => {
    const data = JSON.parse(JSON.stringify(val))
    dataForm.stockBillLogId = data.stockBillLogId
    dataForm.businessTime = data.businessTime // 出入库时间
    dataForm.stockChangeReasonId = data.stockChangeReasonId// 出入库原因id
    dataForm.remark = data.remark// 出入库备注信息
    dataForm.qualifications = data.qualifications// 出入库凭证
    dataForm.status = data.status
    dataForm.warehouseType = data.warehouseType || ''
    dataForm.stockPointType = data.stockPointType
    dataForm.stockPointId = data.stockPointId || ''
    dataForm.stockMode = data.stockMode || ''
    if (props.stockBillLogId) {
      // 获取完出入库详情之后，获取对应库存点信息
      pointOptions.value = await onGetPointList(data.stockPointType, false)
      // 存在stockBillLogId的，则在请求完成之后，将dataForm的值传给sku-info组件，并且保留商品信息
      emit('changeStockPointId', {
        warehouseType: dataForm.warehouseType,
        stockPointId: dataForm.stockPointId,
        stockMode: dataForm.stockMode,
        stockPointType: dataForm.stockPointType
      }, true)
    }
  },
  { immediate: true },
  { deep: true }
)

onMounted(() => {
  init()
})

const pointOptions = ref([])
const init = async () => {
  if (props.stockBillLogId) {
    getReasonList()
  } else {
    // 初始化出入库原因
    getReasonList()
    // 非编辑直接获取（仓库）库存点信息
    pointOptions.value = await onGetPointList(1, true)
  }
}
const stockChangeReasonIdRef = ref(null)
const selectReason = () => {
  stockChangeReasonIdRef.value.clearValidate()
}

const reasonAddOrUpdateRef = ref(null)
const createReason = () => {
  reasonAddOrUpdateVisible.value = true
  nextTick(() => {
    reasonAddOrUpdateRef.value.init(null, props.type)
  })
}
/**
 * 获取出入库原因
 */
const getReasonList = () => {
  getList(
    {
      status: 1,
      type: props.type
    }
  ).then((data) => {
    if (data && props.stockBillLogId && dataForm) {
      let isExist = false
      for (let i = 0; i < data.length; i++) {
        if (data[i].stockChangeReasonId === dataForm.stockChangeReasonId) {
          isExist = true
        }
      }
      if (!isExist) {
        dataForm.stockChangeReasonId = null
      }
    }
    reasonList.value = data
  })
}
const dataFormRef = ref(null)

/**
 * 校验表单数据，校验成功返回表单数据，校验失败返回null (父组件调用）
 */
const verifyDataForm = () => {
  return new Promise((resolve) => {
    dataFormRef.value.validate(valid => {
      if (!valid) {
        resolve(null)
      } else {
        dataForm.type = props.type
        resolve(dataForm)
      }
    })
  })
}

const onPointTypeChange = async (val) => {
  dataForm.warehouseType = ''
  dataForm.stockMode = ''
  dataForm.stockPointId = ''
  dataFormRef.value.clearValidate('stockPointId')
  pointOptions.value = await onGetPointList(val, true)
}

const onPointIdChange = async (val) => {
  if (dataForm.stockPointType === 1) {
    dataForm.warehouseType = warehouseList[val].type
  } else {
    dataForm.stockMode = stationList[val].stockMode
  }
  // 选择的库存点改变，则清空选择的商品，并将库存点信息传递到商品选择组件
  emit('changeStockPointId', {
    warehouseType: dataForm.warehouseType,
    stockPointId: dataForm.stockPointId,
    stockMode: dataForm.stockMode,
    stockPointType: dataForm.stockPointType
  })
}

const warehouseList = {}
const stationList = {}
/**
 * 获取库存点列表
 * @param {*} val 库存点类型 typeOptions
 * @param {*} flag 是否需要清空sku-info组件的信息
 */
const onGetPointList = (val, flag = false) => {
  return new Promise((resolve) => {
    if (val === 2) {
      getListStation().then((res) => {
        const list = res.map((item) => {
          stationList[item.stationId] = item
          return {
            value: item.stationId,
            label: item.stationName
          }
        })
        if (flag) {
          emit('changeStockPointId', {
            warehouseType: '',
            stockPointId: '',
            stockMode: '',
            stockPointType: dataForm.stockPointType
          })
        }
        resolve(list)
      })
    } else {
      getListWarehouse().then((res) => {
        const list = []
        res.forEach((item) => {
          warehouseList[item.warehouseId] = item
          if (item.type === 0 && !val) {
            // 仓库默认选择默认仓库
            dataForm.warehouseType = item.type
            dataForm.stockPointId = item.warehouseId
            list.unshift({
              value: item.warehouseId,
              label: item.warehouseName
            })
            return
          }
          list.push({
            value: item.warehouseId,
            label: item.warehouseName
          })
        })
        if (flag) {
          emit('changeStockPointId', {
            defaultWarehouse: dataForm.stockPointId,
            warehouseType: dataForm.warehouseType,
            stockPointId: dataForm.stockPointId,
            stockMode: dataForm.stockMode,
            stockPointType: dataForm.stockPointType
          })
        }
        resolve(list)
      })
    }
  })
}

defineExpose({ verifyDataForm })
</script>

<style lang="scss" scoped>

.component-stock-bill-basic-info {
  .title {
    color: #333333;
    font-size: 16px;
    font-weight: bold;
  }
  .el-date-picker {
    width: 200px;
  }
  .remark {
    width: 30%;
  }
  .upload-tips {
    font-size: 12px;
    color: #999;
    height: 16px;
    line-height: 20px;
    margin-top: 13px;
  }
}
// 刷新 | 新建
.create-refresh-btn {
  display: inline-block;
  margin-left: 10px;
  & :deep(.el-divider--vertical) {
    margin: 0 2px;
  }
}

:deep(.el-form-item__content) {
  display: block;
}
</style>
