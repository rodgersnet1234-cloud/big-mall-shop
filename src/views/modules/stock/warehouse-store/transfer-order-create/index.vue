<template>
  <div class="page-transfer-order-create">
    <div class="new-page-title">
      <div class="line" />
      <div class="text">
        {{
          view ? '查看调拨订单' :
          !dataForm.allotOrderId
            ?'新建调拨订单'
            : '调拨订单入库'
        }}
      </div>
    </div>
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="view?{}:dataRule"
      label-width="auto"
      class="form-box"
      @submit.prevent
    >
      <el-form-item
        label="调出库存点"
        prop="outWarehouseId"
      >
        <!-- 调出库存点类型 仓库/门店 -->
        <el-select
          v-model="outPointsType"
          class="type-select"
          placeholder="请选择"
          :disabled="!!dataForm.allotOrderId"
          @change="(val)=>{onSetPointType(val, 'out')}"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <!-- 调出库存点 具体的仓库/门店 （新增用） -->
        <el-select
          v-if="!dataForm.allotOrderId"
          v-model="dataForm.outWarehouseId"
          class="storm-name-select"
          placeholder="请选择调出库存点"
          @change="onSetOutId"
        >
          <!-- 设置disabled，禁止重复选择同一门店或仓库 -->
          <el-option
            v-for="item in outPointsOption"
            :key="item.value"
            :disabled="transferPointsType===outPointsType && item.value === dataForm.inWarehouseId"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-else
          v-model="dataForm.outStockPointName"
          class="view-input"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item
        label="调入库存点"
        prop="inWarehouseId"
      >
        <!-- 调入库存点类型 仓库/门店 -->
        <el-select
          v-model="transferPointsType"
          class="type-select"
          placeholder="请选择"
          :disabled="!!dataForm.allotOrderId"
          @change="(val)=>{onSetPointType(val,'transfer')}"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <!-- 调入库存点 具体的仓库/门店 -->
        <el-select
          v-if="!dataForm.allotOrderId"
          v-model="dataForm.inWarehouseId"
          class="storm-name-select"
          placeholder="请选择调入库存点"
          @change="onSetInId"
        >
          <el-option
            v-for="item in transferPointsOption"
            :key="item.value"
            :disabled="transferPointsType===outPointsType && item.value === dataForm.outWarehouseId"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-else
          v-model="dataForm.inStockPointName"
          class="view-input"
          :disabled="true"
        />
      </el-form-item>
      <!-- 配送类型 -->
      <el-form-item
        label="配送方式"
        prop="dvyType"
      >
        <el-radio
          v-model="dataForm.dvyType"
          :label="1"
          :disabled="!!dataForm.allotOrderId"
        >
          快递配送
        </el-radio>
        <el-radio
          v-model="dataForm.dvyType"
          :label="3"
          :disabled="!!dataForm.allotOrderId"
        >
          无需快递
        </el-radio>
      </el-form-item>
      <el-form-item
        v-if="dataForm.dvyType === 1"
        label="物流公司"
        prop="dvyCompanyId"
      >
        <select-lazy
          v-model="dataForm.dvyCompanyId"
          place-tips="请选择快递公司"
          :disabled="!!dataForm.allotOrderId"
        />
      </el-form-item>
      <!-- 物流编号 -->
      <el-form-item
        v-if="dataForm.dvyType === 1"
        label="物流单号"
        prop="dvyOrderNumber"
      >
        <el-input
          v-model="dataForm.dvyOrderNumber"
          placeholder="请输入快递单号"
          maxlength="20"
          show-word-limit
          :disabled="!!dataForm.allotOrderId"
          class="groupActivity-input"
        />
      </el-form-item>

      <!-- 选择商品 -->
      <el-form-item
        v-if="!view && !dataForm.allotOrderId"
        :label="$t('product.prod')"
      >
        <el-button
          plain
          @click="onSelectProd"
        >
          {{ $t("product.select") }}
        </el-button>
        <el-button
          plain
          @click="getUpload"
        >
          {{ $t("product.importGoods") }}
        </el-button>
      </el-form-item>
      <!-- 选择商品列表（新增时使用） -->
      <el-form-item v-if="!view && prods.length > 0 && !dataForm.allotOrderId">
        <span v-if="prods.length > 0 ">
          {{ '商品数量：' + totalStock }}
        </span>
        <el-table
          v-if="prods.length > 0 && !dataForm.allotOrderId"
          :data="prods.slice((page.currentPage - 1) * page.pageSize, page.currentPage * page.pageSize)"
          style="width: 100%"
        >
          <el-table-column
            label="商品信息"
            min-width="300"
          >
            <template #default="scope">
              <div class="mod-order-order">
                <div class="item">
                  <div class="prod-image">
                    <ImgShow
                      :src="scope.row.mainImgUrl"
                      :img-style="{width: '100%',height: '100%'}"
                    />
                  </div>
                  <div class="prod-name">
                    <div class="item">
                      {{ scope.row.spuName }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- 规格 -->
          <el-table-column
            label="商品规格"
            width="120"
          >
            <template #default="scope">
              <div class="sku-container">
                <div
                  v-if="scope.row.skuLangList && scope.row.skuLangList.length"
                  class="name"
                >
                  {{ scope.row.skuLangList[0].skuName || '-' }}
                </div>
                <div v-else>
                  -
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- 商品编码 -->
          <el-table-column
            :label="$t('product.commodityCode')"
            min-width="180"
          >
            <template #default="scope">
              <div class="sku-container party-code">
                <div class="name">
                  {{ scope.row.partyCode || '-' }}
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- 调出仓库存 -->
          <el-table-column
            label="调出仓库存"
            min-width="180"
          >
            <template #default="scope">
              <div class="sku-container">
                <div class="name">
                  {{ scope.row.stock || 0 }}
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- 调入仓库存 -->
          <el-table-column
            label="调入仓库存"
            min-width="180"
          >
            <template #default="scope">
              <div class="sku-container">
                <div class="name">
                  {{ scope.row.inStockPointStock || 0 }}
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- 调拨数量 -->
          <el-table-column
            label="调拨数量"
            min-width="180"
          >
            <template #default="scope">
              <div class="sku-container">
                <div class="stock-input">
                  <el-input
                    v-model="scope.row.allotCount"
                    :min="0"
                    maxlength="7"
                    class="stock-number"
                    :disabled="view"
                    @change="onChangeAllotCount(scope.row)"
                  />
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100"
          >
            <template #default="scope">
              <el-button
                type="primary"
                @click="handleDelete(scope.$index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!-- 入库商品列表（入库时使用） -->
      <el-form-item
        v-if="!view && dataForm.allotOrderId"
        label="商品"
        prop="startTime"
      >
        <el-button
          plain
          @click="getInboundUpload"
        >
          导入入库商品
        </el-button>
      </el-form-item>
      <el-form-item
        v-if="!view && dataForm.allotOrderId"
        prop="startTime"
        class="shop-table-wrap"
      >
        <div
          v-if="prods.length > 0"
          class="table-con"
        >
          <el-table
            :data="prods.slice((page.currentPage - 1) * page.pageSize, page.currentPage * page.pageSize)"
            header-cell-class-name="table-header"
            row-class-name="table-row-low"
          >
            <el-table-column
              label="商品信息"
              min-width="300"
              fixed
            >
              <template #default="scope">
                <div class="mod-order-order">
                  <div class="item">
                    <div class="prod-image">
                      <ImgShow
                        :src="scope.row.imgUrl"
                        :img-style="{width:'60px',height:'60px'}"
                      />
                    </div>
                    <div class="prod-name">
                      <div class="item">
                        {{ scope.row.spuLangVOList[0].spuName }}
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <!-- 商品规格 -->
            <el-table-column
              :label="$t('product.productSpecifi')"
              min-width="180"
            >
              <template #default="scope">
                <div class="sku-container">
                  <div class="name">
                    {{ scope.row.skuLangVOList[0]?.skuName || '-' }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <!-- 商品编码 -->
            <el-table-column
              :label="$t('product.commodityCode')"
              width="180"
            >
              <template #default="scope">
                <span> {{ scope.row.partyCode }} </span>
              </template>
            </el-table-column>
            <!-- 预计入库量 -->
            <el-table-column
              label="预计入库量"
              width="180"
            >
              <template #default="scope">
                <span style="margin-left: 10px">{{ scope.row.allotCount }}</span>
              </template>
            </el-table-column>
            <!-- 已入库量 -->
            <el-table-column
              label="已入库量"
              width="150"
            >
              <template #default="scope">
                <span style="margin-left: 10px">{{ scope.row.allotInCount }}</span>
              </template>
            </el-table-column>
            <!-- 剩余入库量 -->
            <el-table-column
              label="剩余入库量"
              width="150"
            >
              <template #default="scope">
                <span style="margin-left: 10px">{{ scope.row.surplusCount }}</span>
              </template>
            </el-table-column>
            <!-- 实际入库量 -->
            <el-table-column
              label="实际入库量"
              width="180"
            >
              <template #default="scope">
                <el-input
                  v-model="scope.row.inboundCount"
                  :disabled="!scope.row.surplusCount"
                  @change="changActualStock(scope.row)"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>

      <!-- 详情列表（查看详情时使用） -->
      <!-- 商品列表 -->
      <el-form-item
        v-if="view && dataForm.allotOrderId"
        label="商品"
        prop="startTime"
      >
        <span v-if="prods.length > 0 ">
          {{ '商品数量：' + dataForm.totalAllotCount }}
        </span>
        <el-table
          v-if="prods.length > 0"
          :data="prods.slice((page.currentPage - 1) * page.pageSize, page.currentPage * page.pageSize)"
          style="width: 100%"
        >
          <el-table-column
            label="商品信息"
            min-width="300"
          >
            <template #default="scope">
              <div class="mod-order-order">
                <div class="item">
                  <div class="prod-image">
                    <ImgShow
                      :src="scope.row.imgUrl"
                      :img-style="{width: '100%',height: '100%'}"
                    />
                  </div>
                  <div class="prod-name">
                    <div class="item">
                      {{ scope.row.spuLangVOList[0].spuName }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- 商品规格 -->
          <el-table-column
            :label="$t('product.productSpecifi')"
            width="180"
          >
            <template #default="scope">
              <span> {{ scope.row.skuLangVOList[0]?.skuName || '-' }} </span>
            </template>
          </el-table-column>
          <!-- 商品编码 -->
          <el-table-column
            :label="$t('product.commodityCode')"
            min-width="180"
          >
            <template #default="scope">
              <span> {{ scope.row.partyCode }} </span>
            </template>
          </el-table-column>
          <!-- 预计入库数 -->
          <el-table-column
            label="预计入库数"
            width="180"
          >
            <template #default="scope">
              <span> {{ scope.row.allotCount }} </span>
            </template>
          </el-table-column>
          <!-- 实际入库数 -->
          <el-table-column
            label="实际入库数"
            width="180"
          >
            <template #default="scope">
              <span> {{ scope.row.allotInCount }} </span>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!-- end详情列表（查看详情时使用） -->

      <el-form-item class="pagination-box">
        <el-pagination
          v-if="prods.length"
          :current-page="page.currentPage"
          :page-size="page.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="prods.length"
          @current-change="onPageChange"
        />
      </el-form-item>
      <!-- 备注 -->
      <el-form-item
        :label="$t('stock.purchase.remark')"
        prop="startTime"
      >
        <el-input
          v-model="dataForm.remark"
          :placeholder="$t('stock.purchase.remark')"
          maxlength="50"
          show-word-limit
          type="textarea"
          class="groupActivity-input"
          :disabled="view"
        />
      </el-form-item>
      <!-- 操作 -->
      <el-form-item>
        <el-button
          @click="back()"
        >
          {{
            $t("stock.purchase.back")
          }}
        </el-button>
        <el-button
          v-if="!view"
          type="primary"
          @click="onSubmit()"
        >
          {{
            dataForm.allotOrderId ? $t('stock.purchase.inbound') : $t("table.submit")
          }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 商品选择弹窗 -->
    <prod-select
      v-if="prodSelectVisible"
      ref="prodSelectRef"
      :chosen-check-items="prods"
      @refresh-select-prods="selectedProds"
    />
    <!-- excel -->
    <excel-upload
      v-if="uploadVisible"
      ref="excelUploadRef"
      :model-url="modelUrl"
      :upload-url="uploadUrl"
      :template-name="templateName"
      :upload-data="uploadData"
      @refresh-data-list="refreshDataList"
    />
  </div>
</template>

<script setup>
import ExcelUpload from './components/allot-prod-upload/index.vue'
import ProdSelect from './components/prod-select/index.vue'
import { Debounce } from '@/utils/debounce'
import * as api from '@/api/stock/transfer-order.js'
import { getListWarehouse, getListStation } from '@/api/stock/warehouse-station.js'
import { ElMessage } from 'element-plus'

const uploadVisible = ref(false)
const modelUrl = ref('')
const uploadUrl = ref('')
const templateName = ref('')
const selectTime = ref([])
const prods = ref([]) // 商品
const view = ref(false)
const dataForm = reactive({
  dvyType: 1, // 物流方式(1:快递, 3:无需快递)
  remark: '',
  dvyCompanyId: '', // 物流公司id
  dvyOrderNumber: '', // 物流单号
  outWarehouseId: '', // 调出库存点 具体的仓库/门店
  inWarehouseId: '' // 调入库存点 具体的仓库/门店
})
const outPointsType = ref('') // 调出库存点类型 仓库/门店
const transferPointsType = ref('') // 调入库存点类型 仓库/门店
const isSubmit = ref(false)

const page = reactive({
  currentPage: 1, // 初始页
  pageSize: 10 // 每页数据大小
})

const totalStock = computed(() => {
  if (!dataForm.allotOrderId && prods.value && prods.value.length) {
    return prods.value.reduce((total, prodItem) => {
      return total + Number(prodItem.allotCount) || 0
    }, 0)
  } else {
    return 0
  }
})

const validateDvyFlowId = (rule, value, callback) => {
  const reg = /^[A-Za-z0-9]+$/
  if (!reg.test(value)) {
    callback(new Error('请输入正确的物流单号！'))
  } else {
    callback()
  }
}

const validateInWarehouseId = (rule, value, callback) => {
  if (!dataForm.allotOrderId && value && transferPointsType.value === 1 && warehouseList[value].type === 0 && !(warehouseList[value].provinceId && warehouseList[value].cityId && warehouseList[value].areaId)) {
    callback(new Error('请先将默认仓库的地址信息填写完整'))
  } else {
    callback()
  }
}

const validateOutWarehouseId = (rule, value, callback) => {
  if (!dataForm.allotOrderId && value && outPointsType.value === 1 && warehouseList[value].type === 0 && !(warehouseList[value].provinceId && warehouseList[value].cityId && warehouseList[value].areaId)) {
    callback(new Error('请先将默认仓库的地址信息填写完整'))
  } else {
    callback()
  }
}

const dataRule = {
  outWarehouseId: [
    { required: true, message: '调出库存点不能为空', trigger: 'blur' },
    { validator: validateOutWarehouseId, trigger: 'blur' }
  ],
  inWarehouseId: [
    { required: true, message: '调入库存点不能为空', trigger: 'blur' },
    { validator: validateInWarehouseId, trigger: 'blur' }
  ],
  dvyCompanyId: [
    { required: true, message: '请选择快递公司', trigger: 'change' }
  ],
  dvyOrderNumber: [
    { required: true, message: '物流单号不能为空', trigger: 'blur' },
    { validator: validateDvyFlowId, trigger: 'blur' }
  ]
}

const validateData = (field) => {
  dataFormRef.value.validateField(field, () => null)
}

const dataFormRef = ref(null)
onMounted(() => {
  init()
})
const commonStore = useCommonStore()
const route = useRoute()
const init = () => {
  dataForm.allotOrderId = route.query.allotOrderId ? parseInt(route.query.allotOrderId) : null
  view.value = !!route.query.view
  // 更新菜单路径
  const navTitles = JSON.parse(JSON.stringify(commonStore.selectMenu))
  const title = view.value ? '查看调拨订单' : !dataForm.allotOrderId ? '新建调拨订单' : '调拨订单入库'
  navTitles.splice(navTitles.length - 1, 1, title)
  useCommonStore().replaceSelectMenu(title)
  // 初始化数据
  isSubmit.value = false
  prods.value = []
  // loadData()
  dataFormRef.value?.resetFields()
  if (dataForm.allotOrderId) {
    api.getAllotOrderInfo(dataForm.allotOrderId).then((data) => {
      dataForm.allotOrderId = data.allotOrderId
      dataForm.dvyType = data.dvyType
      dataForm.dvyOrderNumber = data.dvyOrderNumber
      dataForm.inStockPointName = data.inStockPointName
      transferPointsType.value = data.inStockPointType
      dataForm.inWarehouseId = data.inWarehouseId
      dataForm.outWarehouseId = data.outWarehouseId
      dataForm.outStockPointName = data.outStockPointName
      outPointsType.value = data.outStockPointType
      dataForm.dvyCompanyId = data.dvyCompanyId
      dataForm.remark = data.remark
      dataForm.status = data.status
      dataForm.totalAllotCount = data.totalAllotCount
      if (!view.value) {
        data.allotOrderItemVOList.forEach(item => {
          item.surplusCount = item.allotCount - item.allotInCount
        })
      }
      prods.value = data.allotOrderItemVOList
    })
  }
}

const changActualStock = (row) => {
  const numReg = /^([0-9]|[1-9]\d+)(\.\d*)?$/
  const numRe = new RegExp(numReg)
  if (!numRe.test(row.inboundCount) || !row.inboundCount) {
    row.inboundCount = 0
  }
  if (row.inboundCount > 9999999) {
    row.inboundCount = 9999999
  }
  if (row.inboundCount > row.surplusCount) {
    row.inboundCount = row.surplusCount
  }
  row.inboundCount = Math.round(row.inboundCount)
}

let nowOutPoint = {}
const onSetOutId = (val) => {
  if (prods.value && prods.value.length) {
    prods.value = []
    page.currentPage = 1
  }
  if (!val) return
  nowOutPoint = outPointsType.value === 2 ? stationList[val] : warehouseList[val]
  validateData('outWarehouseId')
}

const onSetInId = () => {
  if (prods.value && prods.value.length) {
    prods.value = []
    page.currentPage = 1
  }
  if (dataForm.inWarehouseId) {
    validateData('inWarehouseId')
  }
}

const prodSelectVisible = ref(false)
const prodSelectRef = ref(null)
const onSelectProd = () => {
  if (!(dataForm.inWarehouseId && dataForm.outWarehouseId)) {
    ElMessage.error('请先选择调出库存点与调入库存点')
    return
  }
  prodSelectVisible.value = true
  const data = {
    inWarehouseId: dataForm.inWarehouseId,
    outWarehouseId: dataForm.outWarehouseId,
    nowOutPoint
  }
  nextTick(() => {
    prodSelectRef.value?.init(data)
  })
}

// 表单提交
const onSubmit = Debounce(function () {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      if (!prods.value || prods.value.length < 1) {
        ElMessage.error('请选择调拨商品')
        return
      }
      if (prods.value.findIndex(item => !item.allotCount || item.allotCount === '0') !== -1) {
        ElMessage.error('调拨数量不能为0')
        return
      }

      dataForm.allotOrderItemDTOList = JSON.parse(JSON.stringify(prods.value))
      dataForm.updateTime = null
      dataForm.createTime = null
      if (dataForm.dvyType !== 1) {
        dataForm.dvyCompanyId = null
        dataForm.dvyOrderNumber = ''
      }
      dataFormRef.value?.validate((valid) => {
        if (valid) {
          if (isSubmit.value) {
            return false
          }
          isSubmit.value = true
          const data = JSON.parse(JSON.stringify(dataForm))
          data.addrId = 0
          api[dataForm.allotOrderId ? 'inboundAllotOrder' : 'postAllotOrder'](data).then(() => {
            selectTime.value = []
            ElMessage({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                back()
                isSubmit.value = false
              }
            })
          }).catch(() => {
            isSubmit.value = false
          })
        }
      })
    }
  })
})

const containsId = (prod) => {
  const skuIds = []
  prods.value.forEach(prod => {
    skuIds.push(prod.skuId)
  })
  return skuIds.indexOf(prod.skuId) === -1
}

const router = useRouter()
const back = () => {
  router.back()
}
// excel上传回调
const refreshDataList = (data) => {
  if (data?.data?.allotSpuVOList?.length > 0) {
    if (!dataForm.allotOrderId) {
      prodRefreshDataList(data.data.allotSpuVOList)
    }
  } else if (data?.data?.allotOrderItemVOList?.length > 0) {
    data.data.allotOrderItemVOList.forEach(item => {
      item.surplusCount = item.allotCount - item.allotInCount
    })
    prods.value = data.data.allotOrderItemVOList
  }
}
// ==============================新增调拨订单excel============================
const excelUploadRef = ref(null)
const uploadData = ref({})
// 弹出导入商品窗口(新增)
const getUpload = () => {
  if (!(dataForm.inWarehouseId && dataForm.outWarehouseId)) {
    ElMessage.error('请先选择调出库存点与调入库存点')
    return
  }
  uploadVisible.value = true
  modelUrl.value = '/mall4cloud_order/m/allot_order/download_model'
  uploadUrl.value = '/mall4cloud_order/m/allot_order/import_excel'
  templateName.value = '调拨订单商品模板.xlsx'
  uploadData.value = {
    outWarehouseId: dataForm.outWarehouseId,
    inWarehouseId: dataForm.inWarehouseId
  }
  nextTick(() => {
    excelUploadRef.value.init()
  })
}
// 导入商品回调
const prodRefreshDataList = (allotSpuList) => {
  if (allotSpuList) {
    const list = JSON.parse(JSON.stringify(allotSpuList))
    list.forEach(prod => {
      prod.purchasePrice = prod.priceFee
      prod.pic = prod.imgUrl
      prod.stocks = prod.stock
      prod.skuLangList = prod.skuLangVOList
      prod.spuName = prod.spuLangVOList[0]?.spuName
      prod.inStockPointStock = prod.inWarehouseStock
      prod.stock = prod.outWarehouseStock
      if (containsId(prod)) {
        prods.value.push(prod)
      }
    })
  }
}

// 导入商品（入库）
const getInboundUpload = () => {
  uploadVisible.value = true
  modelUrl.value = '/mall4cloud_order/m/allot_order/download_inbound_model?allotOrderId=' + dataForm.allotOrderId || null
  uploadUrl.value = '/mall4cloud_order/m/allot_order/import_inbound_excel?allotOrderId=' + dataForm.allotOrderId
  templateName.value = '调拨订单入库.xlsx'
  nextTick(() => {
    excelUploadRef.value.init()
  })
}

// 库存点类型列表
const typeOptions = [{
  label: '仓库',
  value: 1
}, {
  label: '门店',
  value: 2
}]
const outPointsOption = ref([]) // 调出库存点列表
const transferPointsOption = ref([]) // 调入库存点列表
/**
 * 修改库存点类型
 * @param {*} val 库存点类型 1 仓库 2 门店
 * @param {string} type 修改类型 out：调出库存点  transfer：调入库存点
 */
const onSetPointType = async (val, type) => {
  // 库存点类型修改后，重置对应库存点与选择的商品，并更换选项
  if (prods.value && prods.value.length) {
    prods.value = []
    page.currentPage = 1
  }
  if (!val) return
  if (type === 'out') {
    outPointsOption.value = await onGetPointList(val)
    dataForm.outWarehouseId = ''
    dataFormRef.value.clearValidate('outWarehouseId') // 清除表单项的校验结果
  } else {
    transferPointsOption.value = await onGetPointList(val)
    dataForm.inWarehouseId = ''
    dataFormRef.value.clearValidate('inWarehouseId')
  }
}

const warehouseList = {}
const stationList = {}

/**
 * 获取库存点列表
 * @param {*} val 库存点类型 typeOptions
 */
const onGetPointList = (val) => {
  return new Promise((resolve) => {
    if (val === 2) {
      getListStation().then((res) => {
        const list = res.map((item) => {
          if (!stationList[item.stationId]) {
            item.type = 1
            stationList[item.stationId] = item
          }
          return {
            value: item.stationId,
            label: item.stationName
          }
        })
        resolve(list)
      })
    } else {
      getListWarehouse().then((res) => {
        const list = res.map((item) => {
          if (!warehouseList[item.warehouseId]) {
            warehouseList[item.warehouseId] = item
          }
          return {
            value: item.warehouseId,
            label: item.warehouseName
          }
        })
        resolve(list)
      })
    }
  })
}

// 选择商品回调
const selectedProds = (list) => {
  prods.value = list
}

const onChangeAllotCount = (row) => {
  row.allotCount = row.allotCount.replace(/[^\d]/g, '')
  row.allotCount = Number(row.allotCount || 0) > row.stock ? row.stock : row.allotCount
}

const handleDelete = (index) => {
  prods.value.splice(index, 1)
}

const onPageChange = (val) => {
  page.currentPage = val
}

</script>
<style lang="scss" scoped>
.page-transfer-order-create {
  padding: 20px;
  margin-bottom: 20px;
  .new-page-title {
    width: 100%;
    height: 62px;
    background: #f7f8fa;
    box-sizing: border-box;
    padding: 19px 20px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    margin-bottom: 20px;
    .line{
      width: 4px;
      height: 19px;
      background: #155bd4;
      opacity: 1;
      border-radius: 2px;
      margin-right: 10px;
    }
    .text{
      font-size: 18px;
      font-weight: 700;
      color: #333;
      opacity: 1;
    }
  }

  .type-select {
    width: 100px;
  }
  .storm-name-select {
    width: 300px;
  }

  .groupActivity-input {
    width: 60%;
  }
  .groupActivity-input {
    width: 524px;
  }
  .form-box {
    margin-left: 30px;
    .view-input {
      width: 300px
    }
    .pagination-box :deep(.el-form-item__content) {
      justify-content: right;
    }
  }
}
.mod-order-order {
  .prod-image {
    margin-right: 10px;
    width: 80px;
    height: 80px;
    float: left;
  }
  .prod-name {
    width: 100%;
    text-align: left;
    float: right;
  }
}
:deep(.el-tabs--border-card) {
  box-shadow: none;
}
:deep(.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active) {
  color: #333333;
}
:deep(.el-tabs--border-card > .el-tabs__header .el-tabs__item:not(.is-disabled):hover) {
  color: #333333;
}
.shop-table-wrap {
  :deep(.el-form-item__content) {
    display: block;
    width: 100%;
  }
}
.sku-container {
  width: 120px;
  display: flex;
  flex-direction: row;
  min-height: 40px;
  align-items: center;

  &.party-code {
    width: 180px;
    .name {
      width: 180px;
    }
  }
  .name {
    width: 100px;
    font-size: 14px;
    color: #333333;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
