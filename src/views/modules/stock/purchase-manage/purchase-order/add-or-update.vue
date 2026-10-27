<template>
  <div class="page-purchase-order-add-or-update">
    <div class="new-page-title">
      <div class="line" />
      <div class="text">
        {{
          view ? '查看采购订单' :
          !dataForm.purchaseOrderId
            ?'新建采购订单'
            : '采购订单入库'
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
      <!-- 库存点类型（新建） -->
      <el-form-item
        v-if="!view && !dataForm.purchaseOrderId"
        label="库存点类型"
      >
        <el-radio-group
          v-model="pointType"
          @change="onPointTypeChange"
        >
          <el-radio :label="0">
            仓库
          </el-radio>
          <el-radio :label="1">
            门店
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 库存点名称（新建） -->
      <el-form-item
        v-if="!view && !dataForm.purchaseOrderId"
        label="库存点名称"
        prop="warehouseId"
      >
        <el-select
          v-model="dataForm.warehouseId"
          placeholder="请选择"
          @change="onChangeWarehouse"
        >
          <el-option
            v-for="item in pointOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- 库存点类型（展示） -->
      <el-form-item
        v-if="dataForm.purchaseOrderId"
        label="库存点类型"
      >
        {{ dataForm.stockPointType===1 ? '仓库' : '门店' }}
      </el-form-item>
      <!-- 库存点名称（展示） -->
      <el-form-item
        v-if="dataForm.purchaseOrderId"
        label="库存点名称"
      >
        {{ dataForm.warehouseName }}
      </el-form-item>
      <!-- 选择商品 -->
      <el-form-item
        v-if="!view && !dataForm.purchaseOrderId"
        :label="$t('product.prod')"
      >
        <el-button
          plain
          @click="selectSupplierProd"
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
      <!-- 选择供应商商品列表（新增时使用） -->
      <el-form-item v-if="!view && prods.length > 0 && !dataForm.purchaseOrderId">
        <span>
          {{ '商品数量：' + dataForm.totalStock + ', ' +
            '总价：' + formatPrice(dataForm.totalAmount,1)
          }}
        </span>
        <el-table
          v-if="prods.length > 0 && !dataForm.purchaseOrderId"
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
                      :src="scope.row.pic"
                      :img-style="{width: '100%',height: '100%'}"
                    />
                  </div>
                  <div class="prod-name">
                    <div class="item">
                      {{ scope.row.prodName||scope.row.spuName }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- 供应商名称 -->
          <el-table-column
            label="供应商名称"
            min-width="100"
          >
            <template #default="scope">
              <span> {{ scope.row.supplierName || '-' }} </span>
            </template>
          </el-table-column>
          <!-- 商品编码 -->
          <el-table-column
            :label="$t('product.commodityCode')"
            min-width="180"
          >
            <template #default="scope">
              <span>{{ scope.row.partyCode || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 规格 -->
          <el-table-column
            label="商品规格"
            width="100"
          >
            <template #default="scope">
              <span style="margin-left: 10px">{{ scope.row.skuName || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 库存 -->
          <el-table-column
            label="供应商库存"
            width="100"
          >
            <template #default="scope">
              <span style="margin-left: 10px">{{ scope.row.supplierStock || '0' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="商家库存"
            width="100"
          >
            <template #default="scope">
              <span style="margin-left: 10px">{{ scope.row.stock || '0' }}</span>
            </template>
          </el-table-column>
          <!-- 采购数量 -->
          <el-table-column
            label="采购数量"
            width="180"
          >
            <template #default="scope">
              <el-input
                v-model.number="scope.row.purchaseStock"
                @change="changStock(scope.row)"
              />
            </template>
          </el-table-column>
          <!-- 采购价 -->
          <el-table-column
            label="采购单价(元)"
            width="150"
          >
            <template #default="scope">
              {{ formatPrice(scope.row.purchasePrice,1) }}
            </template>
          </el-table-column>
          <!-- 采购金额 -->
          <el-table-column
            label="采购金额"
            width="150"
          >
            <template #default="scope">
              <span>{{ formatPrice(scope.row.purchaseAmount,1) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
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
        v-if="!view && dataForm.purchaseOrderId"
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
        v-if="!view && dataForm.purchaseOrderId"
        prop="startTime"
        class="shop-table-wrap"
      >
        <div class="table-con">
          <el-table
            v-if="prods.length > 0"
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
                        :src="scope.row.pic"
                        :img-style="{width:'60px',height:'60px'}"
                      />
                    </div>
                    <div class="prod-name">
                      <div class="item">
                        {{ scope.row.spuName }}
                      </div>
                      <div
                        v-if="scope.row.isDelete"
                        class="item order-status"
                      >
                        采购金额
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <!-- 供应商名称 -->
            <el-table-column
              min-width="100"
              label="供应商名称"
            >
              <template #default="scope">
                <span> {{ scope.row.supplierName || '-' }} </span>
              </template>
            </el-table-column>
            <!-- 商品规格 -->
            <el-table-column
              :label="$t('product.productSpecifi')"
              min-width="180"
            >
              <template #default="scope">
                <span> {{ scope.row.skuName || '-' }} </span>
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
            <!-- 采购金额 -->
            <el-table-column
              label="采购金额"
              width="180"
            >
              <template #default="scope">
                <span>{{ formatPrice(scope.row.purchaseAmount,1) }}</span>
              </template>
            </el-table-column>
            <!-- 预计入库量 -->
            <el-table-column
              label="预计入库量"
              width="150"
            >
              <template #default="scope">
                <span style="margin-left: 10px">{{ scope.row.purchaseStock }}</span>
              </template>
            </el-table-column>
            <!-- 已入库量 -->
            <el-table-column
              label="已入库量"
              width="150"
            >
              <template #default="scope">
                <span style="margin-left: 10px">{{ scope.row.alreadyStock }}</span>
              </template>
            </el-table-column>
            <!-- 剩余入库量 -->
            <el-table-column
              label="剩余入库量"
              width="150"
            >
              <template #default="scope">
                <span style="margin-left: 10px">{{ scope.row.remainingStock }}</span>
              </template>
            </el-table-column>
            <!-- 实际入库量 -->
            <el-table-column
              label="实际入库量"
              width="180"
            >
              <template #default="scope">
                <el-input
                  v-model="scope.row.actualStock"
                  :disabled="scope.row.isDelete"
                  @change="changActualStock(scope.row)"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>

      <!-- 详情列表（查看详情时使用） -->

      <div
        v-loading="loadingDelivery"
        class="mod-order-orderInfo"
      >
        <!-- 物流详细 -->
        <el-tabs
          v-if="deliveryExpresse && deliveryExpresse.length > 0"
          class="deliveryExpresse"
          type="border-card"
          @tab-click="getdeliveryExpresse"
        >
          <el-tab-pane
            v-for="(item,i) in deliveryExpresse"
            :key="i"
            :label="$t('order.order.package') + (i + 1)"
          >
            <div class="deliver-logistics">
              <div class="deliver-msg">
                <div class="d-item">
                  <div class="text">
                    {{ $t("order.order.delType") }}：
                  </div>
                  <div class="res">
                    {{
                      [
                        $t("order.order.ordinaryExpress"),
                        $t("order.order.ordinaryExpress"),
                        $t("order.order.selfMention"),
                        $t("order.order.noNeedRequired"),
                        $t("order.order.sameCityDelivery")
                      ][item.deliveryType] || [
                        $t("order.order.ordinaryExpress"),
                        $t("order.order.ordinaryExpress"),
                        $t("order.order.selfMention"),
                        $t("order.order.noNeedRequired"),
                        $t("order.order.sameCityDelivery")
                      ][dataForm.dvyType]
                    }}
                  </div>
                </div>
                <div class="d-item">
                  <div class="text">
                    {{ $t("order.order.deliveryTime") }}：
                  </div>
                  <div class="res">
                    {{ item.createTime }}
                  </div>
                </div>
                <div
                  v-if="item.deliveryType!==3"
                  class="d-item"
                >
                  <div class="text">
                    {{ $t("order.order.courierCompany") }}：
                  </div>
                  <div class="res">
                    {{ item.deliveryName ? item.deliveryName : '' }}
                  </div>
                </div>
                <div
                  v-if="item.deliveryType!==3"
                  class="d-item"
                >
                  <div class="text">
                    {{ $t("order.order.waybillNumber") }}：
                  </div>
                  <div class="res">
                    {{ item.deliveryNo ? item.deliveryNo : '' }}
                  </div>
                </div>
                <div
                  class="d-goods"
                >
                  <div
                    v-for="(
                      orderItem, index
                    ) in item.orderItems"
                    :key="index"
                    class="item"
                  >
                    <div class="img">
                      <ImgShow
                        :src="orderItem.imgUrl"
                        :img-style="{width: '100%',height: '100%'}"
                      />
                      <div class="number">
                        ×{{ orderItem.count }}
                      </div>
                    </div>
                    <div class="name">
                      {{ orderItem.spuName }}
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="item.deliveryType!==3"
                class="logistics"
              >
                <div class="l-tit">
                  <span
                    class="text"
                  >{{ $t("order.order.logisticsStatus") }}：</span>
                  <span
                    v-if="item.status === 0"
                    class="l-state"
                  >{{ $t("order.order.noRecord") }}</span>
                  <span
                    v-if="item.delivery && item.delivery.state === 1"
                    class="l-state"
                  >{{ $t("order.order.collected") }}</span>
                  <span
                    v-if="item.delivery && item.delivery.state === 2"
                    class="l-state"
                  >{{ $t("order.order.delivering") }}</span>
                  <span
                    v-if="item.delivery && item.delivery.state === 3"
                    class="l-state"
                  >{{ $t("order.order.haveBeenReceived") }}</span>
                  <span
                    v-if="item.delivery && item.delivery.state === 201"
                    class="l-state"
                  >{{ $t("order.order.reachTheDestinationCity") }}</span>
                  <span
                    v-if="item.delivery && item.delivery.state === 4"
                    class="l-state"
                  >{{ $t("order.order.problemPiece") }}</span>
                </div>
                <div
                  v-if="item && item.delivery"
                  class="logistics-box"
                >
                  <div
                    v-if="
                      item.delivery.state === 0 &&
                        dataForm.status === 5 &&
                        dataForm.finallyTime !== null
                    "
                    class="item"
                  >
                    <div class="time">
                      {{ dataForm.finallyTime }}
                    </div>
                    <div class="text">
                      {{ $t("order.order.receivedGoods") }}
                    </div>
                  </div>
                  <div
                    v-for="(trace, index) in item.delivery
                      .traces"
                    :key="index"
                    class="item"
                  >
                    <div class="time">
                      {{ trace.acceptTime }}
                    </div>
                    <div class="text">
                      {{ trace.acceptStation }}
                    </div>
                  </div>
                  <div
                    v-if="
                      item.delivery.traces &&
                        item.delivery.traces.length < 1
                    "
                    class="item"
                  >
                    {{ $t("order.order.noLogisticsInformation") }}
                  </div>
                  <div
                    v-if="dataForm.status >= 3 && dataForm.dvyTime !== null"
                    class="item"
                  >
                    <div class="time">
                      {{ dataForm.dvyTime }}
                    </div>
                    <div class="text">
                      {{ $t("order.order.merchantHasShippedWa") }}
                    </div>
                  </div>
                  <div
                    v-if="(dataForm.status >= 2||dataForm.status === 0) && dataForm.payTime !== null"
                    class="item"
                  >
                    <div class="time">
                      {{ dataForm.payTime }}
                    </div>
                    <div class="text">
                      {{ $t("order.order.buyerHasPaidWa") }}
                    </div>
                  </div>
                  <div
                    v-if="dataForm.status >= 1||dataForm.status === 0"
                    :class="['item', dataForm.status >= 1||dataForm.status === 0?'left-line':'']"
                  >
                    <div class="time">
                      {{ dataForm.createTime }}
                    </div>
                    <div class="text">
                      {{ $t("order.order.buyerSubmittedAnOrder") }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>

        <!-- 商品列表 -->
        <el-form-item
          v-if="view && dataForm.purchaseOrderId"
          label="商品"
          prop="startTime"
        >
          <span v-if="prods.length > 0 ">
            {{ '商品数量：' + dataForm.totalStock + ', ' +
              '总价：' + formatPrice(dataForm.totalAmount,1)
            }}
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
                        :src="scope.row.pic"
                        :img-style="{width: '100%',height: '100%'}"
                      />
                    </div>
                    <div class="prod-name">
                      <div class="item">
                        {{ scope.row.spuName }}
                      </div>
                      <div
                        v-if="scope.row.isDelete"
                        class="item order-status"
                      >
                        {{ $t("purchase.order.deleted") }}
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <!-- 供应商名称 -->
            <el-table-column
              label="供应商名称"
              min-width="100"
            >
              <template #default="scope">
                <span> {{ scope.row.supplierName || '-' }} </span>
              </template>
            </el-table-column>
            <!-- 商品规格 -->
            <el-table-column
              :label="$t('product.productSpecifi')"
              width="180"
            >
              <template #default="scope">
                <span> {{ scope.row.skuName || '-' }} </span>
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
            <!-- 采购数量 -->
            <el-table-column
              label="采购数量"
              width="180"
            >
              <template #default="scope">
                <span> {{ scope.row.purchaseStock }} </span>
              </template>
            </el-table-column>
            <!-- 采购价 -->
            <el-table-column
              label="采购单价(元)"
              width="180"
            >
              <template #default="scope">
                <span> {{ formatPrice(scope.row.purchasePrice,1) }} </span>
              </template>
            </el-table-column>
            <!-- 采购金额 -->
            <el-table-column
              label="采购金额"
              width="180"
            >
              <template #default="scope">
                <span> {{ formatPrice(scope.row.purchaseAmount,1) }} </span>
              </template>
            </el-table-column>
            <!-- 预计入库量 -->
            <el-table-column
              label="预计入库量"
              width="150"
            >
              <template #default="scope">
                <span style="margin-left: 10px">{{ scope.row.purchaseStock }}</span>
              </template>
            </el-table-column>
            <!-- 实际入库量 -->
            <el-table-column
              label="实际入库量"
              width="180"
            >
              <template #default="scope">
                <span> {{ scope.row.actualStock }} </span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </div>
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
            dataForm.purchaseOrderId ? $t('stock.purchase.inbound') : $t("table.submit")
          }}
        </el-button>
      </el-form-item>
    </el-form>

    <!--    &lt;!&ndash; 供应商选择弹窗 &ndash;&gt;-->
    <supplier-select
      v-if="supplierSelectVisible"
      ref="supplierSelectRef"
      :is-single="true"
      @refresh-select-supplier="supplierSelectHandle"
    />

    <!-- 供应商商品选择弹窗 -->
    <supplier-prod-select
      v-if="supplierProdSelectVisible"
      ref="supplierProdSelectRef"
      :type="1"
      data-url="/mall4cloud_product/m/stock_point_sku/page_supplier_stock_point_spu"
      @refresh-select-supplier="supplierProdSelectHandle"
    />
    <!-- excel -->
    <excel-upload
      v-if="uploadVisible"
      ref="excelUploadRef"
      :model-url="modelUrl"
      :upload-url="uploadUrl"
      :template-name="templateName"
      @refresh-data-list="refreshDataList"
    />
  </div>
</template>

<script setup>
import Big from 'big.js'
import ExcelUpload from '../../components/purchases-prod-upload.vue'
import SupplierSelect from '@/components/supplier-select/index.vue'
import SupplierProdSelect from './components/prod-select/index.vue'
import { Debounce } from '@/utils/debounce'
import * as http from '@/api/stock/purchase-manage'
import * as api from '@/api/order/order'
import { getListWarehouse, getListStation } from '@/api/stock/warehouse-station.js'
import { ElMessage } from 'element-plus'
import { formatPrice } from '@/utils'

const uploadVisible = ref(false)
const supplierSelectVisible = ref(false)
const supplierProdSelectVisible = ref(false)
const modelUrl = ref('')
const uploadUrl = ref('')
const templateName = ref('')
const selectTime = ref([])
const prods = ref([])
const supplierProds = ref([])
const view = ref(false)
const dataForm = reactive({
  purchaseOrderId: '',
  purchaseNumber: '',
  deliverTime: '',
  dvyType: 1,
  supplierId: '',
  purchaseStock: 0,
  purchasePrice: 0,
  totalAmount: 0,
  totalStock: 0,
  actualTotalStock: 0,
  supplierName: null,
  remark: '',
  deliveryExpresses: [],
  warehouseId: '' // 库存点id
})
const isSubmit = ref(false)

const page = reactive({
  currentPage: 1, // 初始页
  pageSize: 10 // 每页数据大小
})

const pointType = ref(0)
const validateWarehouseId = (rule, value, callback) => {
  if (value && pointType.value === 0 && defaultWarehouse.warehouseId === value && !(defaultWarehouse.provinceId && defaultWarehouse.cityId && defaultWarehouse.areaId)) {
    callback(new Error('请先将默认仓库的地址信息填写完整'))
  } else {
    callback()
  }
}
const dataRule = reactive({
  supplierName: [
    { required: true, message: '请选择供应商', trigger: 'blur' }
  ],
  warehouseId: [
    { required: true, message: '请选择库存点', trigger: 'blur' },
    { validator: validateWarehouseId, trigger: 'change' }
  ]
})
const deliveryExpresse = ref([]) // 物流信息
const dataFormRef = ref(null)
const loadingDelivery = ref(false)
onMounted(() => {
  init()
})
const commonStore = useCommonStore()
const route = useRoute()
const pointOptions = ref([])
const init = async () => {
  dataForm.purchaseOrderId = route.query.purchaseOrderId ? parseInt(route.query.purchaseOrderId) : null
  view.value = !!route.query.view
  // 更新菜单路径
  const navTitles = JSON.parse(JSON.stringify(commonStore.selectMenu))
  const title = view.value ? '查看采购订单' : !dataForm.purchaseOrderId ? '新建采购订单' : '采购订单入库'
  navTitles.splice(navTitles.length - 1, 1, title)
  useCommonStore().replaceSelectMenu(title)
  // 初始化数据
  isSubmit.value = false
  prods.value = []
  // loadData()
  dataFormRef.value?.resetFields()
  if (dataForm.purchaseOrderId) {
    if (view.value) {
      loadingDelivery.value = true
    }
    http.getInfo(dataForm.purchaseOrderId).then((data) => {
      dataForm.purchaseOrderId = data.purchaseOrderId
      dataForm.purchaseNumber = data.purchaseNumber
      dataForm.deliverTime = data.deliverTime
      dataForm.dvyType = data.dvyType
      dataForm.supplierId = data.supplierId
      dataForm.purchaseStock = data.purchaseStock
      dataForm.purchasePrice = data.purchasePrice
      dataForm.totalAmount = data.totalAmount
      dataForm.totalStock = data.totalStock
      dataForm.actualTotalStock = data.actualTotalStock
      dataForm.supplierName = data.supplierName
      dataForm.remark = data.remark
      dataForm.status = data.status
      dataForm.deliveryExpresses = []
      dataForm.purchaseOrderItemList = data.purchaseOrderItemList
      dataForm.warehouseName = data.warehouseName
      dataForm.stockPointType = data.stockPointType
      dataForm.purchaseOrderItemList.forEach(item => {
        item.supplierName = dataForm.supplierName
        item.supplierId = dataForm.supplierId
      })
      if (!view.value) {
        data.purchaseOrderItemList.forEach(item => {
          item.alreadyStock = item.actualStock
          const remainingStock = item.purchaseStock - item.actualStock
          item.remainingStock = remainingStock < 0 ? 0 : remainingStock
          item.actualStock = item.remainingStock
        })
      }
      if (view.value) {
        api.deliveryExpresseInfo({ orderId: dataForm.purchaseOrderId }).then((data) => {
          dataForm.deliveryExpresses = data
          deliveryExpresse.value = data
          loadingDelivery.value = false
        })
      }
      prods.value = data.purchaseOrderItemList
    })
  } else {
    pointOptions.value = await onGetPointList('')
  }
}
// 获取包裹物流信息
const getdeliveryExpresse = (event) => {
  loadingDelivery.value = true
  const delivery = deliveryExpresse.value[event.index]
  http.deliveryPurchaseOrder(delivery.deliveryOrderId).then((data) => {
    if (dataForm.deliveryExpresses) {
      dataForm.deliveryExpresses[event.index] = data
    }
    deliveryExpresse.value[event.index] = data
    loadingDelivery.value = false
  })
}

const handleDelete = (index) => {
  prods.value.splice(index, 1)
  setTotalAmountAndCount()
}
const changActualStock = (row) => {
  const numReg = /^([0-9]|[1-9]\d+)(\.\d*)?$/
  const numRe = new RegExp(numReg)
  if (!numRe.test(row.actualStock) || !row.actualStock) {
    row.actualStock = 0
  }
  if (row.actualStock > 9999999) {
    row.actualStock = 9999999
  }
  if (row.actualStock > row.remainingStock) {
    row.actualStock = row.remainingStock
  }
  row.actualStock = Math.round(row.actualStock)
}
const changStock = (row) => {
  const numReg = /^([0-9]|[1-9]\d+)(\.\d*)?$/
  const numRe = new RegExp(numReg)
  if (!numRe.test(row.purchaseStock) || !row.purchaseStock || row.purchaseStock < row.minOrderQuantity) {
    row.purchaseStock = 0
  } else if (row.purchaseStock > row.stocks) {
    row.purchaseStock = row.stocks
  }
  row.purchaseStock = Math.round(row.purchaseStock)
  row.purchaseAmount = new Big(row.purchaseStock).times(row.purchasePrice)
  setTotalAmountAndCount()
}

const setTotalAmountAndCount = () => {
  let totalAmount = 0
  let totalStock = 0
  prods.value.forEach(item => {
    totalAmount = new Big(totalAmount).plus(item.purchaseAmount)
    totalStock = new Big(totalStock).plus(item.purchaseStock)
  })
  dataForm.totalAmount = totalAmount
  dataForm.totalStock = totalStock
}
// 表单提交
const onSubmit = Debounce(function () {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      if (!prods.value || prods.value.length < 1) {
        ElMessage.error('请选择供应商商品')
        return
      }

      if (dataForm.purchaseProds && dataForm.purchaseProds.some((element) => element.purchaseStock <= 0)) {
        ElMessage.error('请输出大于0的采购数量')
        return
      }

      dataForm.updateTime = null
      dataForm.createTime = null
      if (dataForm.dvyType !== 1) {
        dataForm.dvyId = null
        dataForm.dvyFlowId = ''
      }
      dataFormRef.value?.validate((valid) => {
        if (valid) {
          if (isSubmit.value) {
            return false
          }
          dataForm.purchaseProds = prods.value
          isSubmit.value = true
          const data = JSON.parse(JSON.stringify(dataForm))
          data.purchaseOrderItemList = JSON.parse(JSON.stringify(data.purchaseProds))
          delete data.purchaseProds
          data.addrId = 0
          http[dataForm.purchaseOrderId ? 'putInbound' : 'postOrder'](data).then(() => {
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

// 供应商选择回调
const supplierSelectHandle = (data) => {
  if (!data) {
    return
  }
  dataForm.supplierId = data[0].supplierId
  dataForm.supplierName = data[0].supplierName
  // 获取供应商商品
}
const supplierProdSelectRef = ref(null)
// 选择供应商商品
const selectSupplierProd = () => {
  if (!dataForm.warehouseId) {
    ElMessage({
      message: '请先选择库存点',
      type: 'warning',
      duration: 1500
    })
    return
  }
  const supplierProdIds = []
  supplierProds.value.forEach(item => {
    supplierProdIds.push(item.supplierProdId)
  })
  const skuIds = []
  const retailProdIds = []
  prods.value.forEach(prod => {
    skuIds.push(prod.skuId)
  })
  const data = {
    supplierId: dataForm.supplierId,
    retailProdIds,
    skuIds,
    stockPointId: dataForm.warehouseId,
    prods: JSON.parse(JSON.stringify(prods.value))
  }
  supplierProdSelectVisible.value = true
  nextTick(() => {
    supplierProdSelectRef.value.init(data)
  })
}
// 供应商商品选择回调
const supplierProdSelectHandle = (data) => {
  data.forEach(prod => {
    if (containsId(prod)) {
      prod.purchaseStock = 0

      prod.price = prod.purchasePrice

      // prod.marketPriceFee || prod.price || 0 临时数据
      prod.purchaseAmount = new Big(prod.purchasePrice).times(prod.purchaseStock || 0)

      prod.remark = ''
    }
  })
  prods.value = data
  setTotalAmountAndCount()
}
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
  if (!dataForm.purchaseOrderId) {
    if (data?.data?.purchaseSpuList?.length > 0) {
      supplierRefreshDataList(data.data.purchaseSpuList)
    }
  } else {
    if (data?.data?.length > 0) {
      inboundRefreshDataList(data.data)
    }
  }
}
// ==============================新增采购订单excel============================
const excelUploadRef = ref(null)
// 弹出导入供应商商品窗口
const getUpload = () => {
  if (!dataForm.warehouseId) {
    ElMessage({
      message: '请先选择库存点',
      type: 'warning',
      duration: 1500
    })
    return
  }
  uploadVisible.value = true
  modelUrl.value = '/mall4cloud_order/m/purchase/order/download_model'
  uploadUrl.value = '/mall4cloud_order/m/purchase/order/export_excel?warehouseId=' + dataForm.warehouseId
  templateName.value = '采购商品.xlsx'
  nextTick(() => {
    excelUploadRef.value.init()
  })
}
// 导入供应商商品回调
const supplierRefreshDataList = (purchaseSpuList) => {
  if (purchaseSpuList) {
    const ids = []
    const list = JSON.parse(JSON.stringify(purchaseSpuList))
    prods.value.forEach(item => {
      ids.push(item.skuId)
    })
    list.forEach(prod => {
      prod.purchasePrice = prod.priceFee
      prod.pic = checkFileUrl(prod.imgUrl || prod.mainImgUrl)
      prod.stocks = prod.stock || prod.supplierStock
      prod.spuName = prod.spuName || prod.name
      if (containsId(prod)) {
        prods.value.push(prod)
      }
      prod.purchaseAmount = new Big(prod.purchasePrice || 0).times(prod.purchaseStock || 0)
    })
  }
  setTotalAmountAndCount()
}

const getInboundUpload = () => {
  uploadVisible.value = true
  modelUrl.value = '/mall4cloud_order/m/purchase/order/inbound/export?purchaseOrderId=' + dataForm.purchaseOrderId || null
  uploadUrl.value = '/mall4cloud_order/m/purchase/order/inbound/exportExcel/' + dataForm.purchaseOrderId // dataForm.purchaseNumber
  templateName.value = '采购订单.xlsx'
  nextTick(() => {
    excelUploadRef.value.init()
  })
}
// 导入采购入库商品回调
const inboundRefreshDataList = (purchaseSpuList) => {
  if (purchaseSpuList) {
    const ids = []
    const list = JSON.parse(JSON.stringify(purchaseSpuList))
    list.forEach(item => {
      item.alreadyStock = item.actualStock
      const remainingStock = item.purchaseStock - item.actualStock
      item.remainingStock = remainingStock < 0 ? 0 : remainingStock
      item.actualStock = item.changeStock
      item.spuName = item.spuName || item.name
      ids.push(item.purchaseItemId)
    })
    for (let i = 0; i < prods.value.length; i++) {
      const item = prods.value[i]
      const index = ids.indexOf(item.purchaseItemId)
      if (index !== -1) {
        prods.value[i] = list[index]
      }
    }
  }
}

const onPointTypeChange = async (val) => {
  if (prods.value && prods.value.length) {
    prods.value = []
    page.currentPage = 1
  }
  dataForm.warehouseId = ''
  dataFormRef.value.clearValidate('warehouseId')
  pointOptions.value = await onGetPointList(val)
}

// 修改库存点清空商品
const onChangeWarehouse = () => {
  if (prods.value && prods.value.length) {
    prods.value = []
    page.currentPage = 1
  }
}

/**
 * 获取库存点列表
 * @param {*} val 库存点类型 typeOptions
 */
let defaultWarehouse = {}
const onGetPointList = (val) => {
  return new Promise((resolve) => {
    if (val === 1) {
      getListStation().then((res) => {
        const list = res.map((item) => {
          return {
            value: item.stationId,
            label: item.stationName
          }
        })
        resolve(list)
      })
    } else {
      getListWarehouse().then((res) => {
        const list = []
        res.forEach((item) => {
          if (item.type === 0 && val === '') {
            list.unshift({
              value: item.warehouseId,
              label: item.warehouseName
            })
            defaultWarehouse = item
            dataForm.warehouseId = item.warehouseId
          } else {
            list.push({
              value: item.warehouseId,
              label: item.warehouseName
            })
          }
        })
        resolve(list)
      })
    }
  })
}

const onPageChange = (val) => {
  page.currentPage = val
}
</script>
<style lang="scss" scoped>
.page-purchase-order-add-or-update {
  padding: 20px;

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

  .groupActivity-input {
    width: 60%;
  }
  .groupActivity-input {
    width: 524px;
  }
  .form-box {
    margin-left: 30px;
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
.order-status {
  display: inline-block;
  margin-top: 15px;
  padding: 2px 4px;
  border: 1px solid #e43130;
  border-radius: 2px;
  color: #e43130;
}

.deliveryExpresse{
  -webkit-box-shadow: none;
    box-shadow: none;
  font: 14px Arial, "PingFang SC", "Hiragino Sans GB", STHeiti, "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
    font-style: normal;
    font-variant-ligatures: normal;
    font-variant-caps: normal;
    font-variant-numeric: normal;
    font-variant-east-asian: normal;
    font-weight: normal;
    font-stretch: normal;
    line-height: normal;
    font-family: Arial, "PingFang SC", "Hiragino Sans GB", STHeiti, "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
    color: #333;
  margin: 20px;
  min-height: 280px;
}
.page-purchase-order-add-or-update{
  .deliver-logistics {
    display: flex;
    .deliver-msg {
      flex: 1;
      .d-item {
        display: flex;
        margin: 10px 0;
      }
      .d-goods {
        display: flex;
        .item {
          margin-right: 10px;
          font-size: 12px;
          cursor: pointer;
          .img {
            width: 60px;
            height: 60px;
            font-size: 0;
            margin-bottom: 4px;
            position: relative;
            .number {
              position: absolute;
              bottom: 0;
              right: 0;
              background: rgba(0, 0, 0, 0.3);
              color: #fff;
              border-radius: 6px 0 6px 0;
              font-size: 12px;
              height: 16px;
              line-height: 16px;
              padding: 0 5px;
            }
          }
          .name {
            width: 60px;
            height: 16px;
            line-height: 16px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
    .logistics {
      flex: 1;
      .logistics-box {
        height: 175px;
        overflow-y: scroll;
        position: relative;
        margin-top: 15px;
      }
      .logistics-box::before {
        position: absolute;
        left: 0;
        top: 0;
        display: block;
        width: 10px;
        height: 10px;
        content: " ";
        font-size: 0;
        background: #fff;
        z-index: 1;
      }
      .logistics-box::after {
        position: absolute;
        left: 6px;
        top: 0;
        display: block;
        // width: 1px;
        height: 100%;
        content: " ";
        font-size: 0;
        background: #eee;
        z-index: 0;
      }
      .item {
        padding: 0 0 40px 25px;
        position: relative;
        margin-left: 6px;
        border-left: 1px solid #eee;
        .time {
          color: #999;
        }
        .text {
          margin-top: 5px;
          width: 400px;
        }
      }
      .item::before {
        position: absolute;
        left: -10px;
        top: 0;
        display: block;
        width: 19px;
        height: 19px;
        border-radius: 50%;
        content: " ";
        font-size: 0;
        background: #ccc;
        border: 5px solid #fff;
        z-index: 2;
      }
      .item:first-child:before {
        background: #c00;
      }
      .item.left-line{
        border-left:1px solid transparent ;
      }
    }
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
</style>
