<template>
  <div class="page-station app-container">
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        :model="searchForm"
        label-width="auto"
      >
        <div class="input-row">
          <el-form-item
            prop="stationName"
            :label="$t('delivery.station.stationName')+':'"
          >
            <el-input
              v-model="searchForm.stationName"
              type="text"
              :placeholder="$t('delivery.station.stationName')"
            />
          </el-form-item>
          <el-form-item
            prop="addr"
            :label="$t('delivery.station.addr')+':'"
          >
            <el-input
              v-model="searchForm.addr"
              type="text"
              :placeholder="$t('delivery.station.addr')"
            />
          </el-form-item>
          <el-form-item
            prop="account"
            :label="$t('delivery.station.account')+':'"
          >
            <el-input
              v-model="searchForm.account"
              type="text"
              :placeholder="$t('delivery.station.account')"
            />
          </el-form-item>
          <el-form-item
            prop="stationStatus"
            :label="$t('table.status')+':'"
          >
            <el-select
              v-model="searchForm.stationStatus"
              :placeholder="$t('table.status')"
            >
              <el-option
                :label="$t('delivery.station.close')"
                :value="0"
              />
              <el-option
                :label="$t('delivery.station.business')"
                :value="1"
              />
              <el-option
                :label="$t('delivery.station.platformOffline')"
                :value="2"
              />
              <el-option
                :label="$t('delivery.station.underReview')"
                :value="3"
              />
              <el-option
                :label="$t('delivery.station.auditFailure')"
                :value="4"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="filter-item"
              @click="onSearch(true)"
            >
              {{ $t('table.search') }}
            </el-button>
            <el-button
              @click="onResetSearch"
            >
              {{ $t('table.reset') }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-content">
      <div class="operation-bar">
        <el-button
          v-permission="['delivery:station:add']"
          type="primary"
          class="filter-item"
          @click="onAddOrUpdate()"
        >
          {{ $t('table.create') }}
        </el-button>
      </div>
      <div
        ref="closePopoverRef"
        class="table-con"
      >
        <el-table
          ref="stationTableRef"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
        >
          <el-table-column
            :label="$t('table.id')"
            type="index"
            width="85"
          />
          <el-table-column
            align="left"
            prop="stationName"
            :label="$t('delivery.station.stationName')"
            width="270"
          >
            <template #default="scope">
              <span
                class="table-cell-text"
                style="display:block;white-space: nowrap;"
              >{{ scope.row.stationName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="selfPickup"
            :label="'门店用途'"
            width="160"
          >
            <template #default="scope">
              <span
                class="table-cell-text"
                style="display:block;white-space: nowrap;"
              >{{ scope.row.selfPickup?'自提 ':'' }}{{ scope.row.sameCityDelivery?' 同城配送':'' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="addr"
            :label="$t('delivery.station.addr')"
            width="390"
          >
            <template #default="scope">
              <span class="table-cell-text">{{ scope.row.province }}{{ scope.row.city }}{{ scope.row.area }}{{ scope.row.addr || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="phone"
            :label="$t('delivery.station.number')"
            min-width="220"
          >
            <template #default="scope">
              <span v-if="scope.row.mobilePrefix && scope.row.mobilePrefix !== null">{{ scope.row.mobilePrefix }}-</span>
              <span>{{ scope.row.mobile || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="account"
            :label="$t('delivery.station.account')"
            min-width="210"
          >
            <template #default="scope">
              <span>{{ scope.row.account || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="stationScore"
            label="门店评分"
            width="150"
          >
            <template #default="scope">
              {{ scope.row.stationScore || '-' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="stationScore"
            label="库存模式"
            width="200"
          >
            <template #default="scope">
              {{ ['', '共享总部库存', '独立销售库存'][scope.row.stockMode] }}
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="status"
            :label="$t('table.status')"
            min-width="150"
          >
            <template #default="scope">
              <div v-if="scope.row.status === 4">
                {{ $t("delivery.station.auditFailure") }}
              </div>
              <div v-else-if="scope.row.status === 3">
                {{ $t("delivery.station.underReview") }}
              </div>
              <div v-else-if="scope.row.status === 2">
                {{ $t("delivery.station.platformOffline") }}
              </div>
              <div v-else-if="scope.row.status === 1">
                {{ $t("delivery.station.business") }}
              </div>
              <div v-else>
                {{ $t("delivery.station.close") }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            prop="account"
            :label="$t('table.actions')"
            width="300"
          >
            <template #default="scope">
              <div class="text-btn-con">
                <div
                  v-permission="['delivery:station:edit']"
                  class="text-btn"
                  @click="onAddOrUpdate(scope.row.stationId)"
                >
                  {{ $t("table.edit") }}
                </div>
                <div
                  v-permission="['delivery:station:editPassword']"
                  class="text-btn"
                  @click="checkStationAccount(scope.row.stationId)"
                >
                  {{ scope.row.account?$t("admin.resetPwd"):$t("admin.createAcc") }}
                </div>
                <div
                  v-if="scope.row.status > 1"
                  v-permission="['delivery:station:apply']"
                  class="text-btn"
                  @click="auditEventHandle(scope.row.stationId)"
                >
                  {{ scope.row.status === 3?'等待审核':'申请上架' }}
                </div>
                <div
                  class="text-btn"
                  @click="onViewInventory(scope.row.stationId, scope.row.stockMode)"
                >
                  商品库存
                </div>
                <el-popover
                  placement="bottom-end"
                  trigger="click"
                  :width="160"
                  :show-arrow="false"
                  @show="onShowPopover(scope.row)"
                  @hide="onHidePopver(scope.row)"
                >
                  <div
                    style="cursor: pointer;color: #303133"
                    @click="onChangeMode(scope.row)"
                  >
                    {{ scope.row.stockMode === 1 ? '独立销售库存' : '共享总部库存' }}
                  </div>
                  <template #reference>
                    <div class="text-btn">
                      切换库存模式
                      <el-icon
                        v-if="scope.row.popoverVisible === false"
                        class="stock-mode-icon"
                      >
                        <ArrowDown />
                      </el-icon>
                      <el-icon
                        v-if="scope.row.popoverVisible === true"
                        class="stock-mode-icon"
                      >
                        <ArrowUp />
                      </el-icon>
                    </div>
                  </template>
                </el-popover>
                <div
                  v-permission="['delivery:station:delete']"
                  class="text-btn"
                  @click="onDelete(scope.row.stationId)"
                >
                  {{ $t("table.delete") }}
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页 -->
    <div class="pagination-box">
      <el-pagination
        v-if="dataList.length"
        :current-page="page.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
      />
    </div>

    <!-- 账号弹窗-->
    <station-account
      v-if="stationAccountVisible"
      ref="stationAccountRef"
      @refresh-data-list="refreshChange"
    />
    <!-- 下线管理弹窗-->
    <offlineEventHandle
      v-if="offlineEventHandleVisible"
      ref="offlineEventRef"
      :select-url="'/admin/station/getOfflineHandleEventByStatonId'"
      :apply-url="'/admin/station/auditApply'"
      @refresh-data-list="refreshChange"
    />

    <!-- 商品库存 -->
    <prod-inventory
      v-if="prodinventoryVisible"
      ref="prodInventoryRef"
      :stock-point-type="2"
    />

    <!--   门店库存模式 -->
    <stock-mode
      v-if="stockModeVisible"
      ref="stockModeRef"
      @refresh-data-list="refreshChange"
    />
  </div>
</template>

<script setup>
import StationAccount from './components/station-account.vue'
import stockMode from './components/stock-mode/index.vue'
import OfflineEventHandle from '@/components/offline-event-handle/index.vue'
import * as api from '@/api/delivery/station'
import { ElMessage, ElMessageBox } from 'element-plus'

onMounted(() => {
  getDataList()
})

const dataList = reactive([])
const page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
})
const searchForm = reactive({
  stationName: '', // 自提点
  addr: '', // 地址
  account: '', // 账号
  stationStatus: '' // 状态
}) // 搜索

const dataListLoading = ref(false)
let tempSearchForm = null // 保存上次点击查询的请求条件
const getDataList = (pageParam, newData = false) => {
  dataListLoading.value = true
  if (newData || !tempSearchForm) {
    tempSearchForm = JSON.parse(JSON.stringify(searchForm))
  }
  api.pageStation(
    Object.assign({
      pageNum: pageParam == null ? page.currentPage : pageParam.currentPage,
      pageSize: pageParam == null ? page.pageSize : pageParam.pageSize
    },
    tempSearchForm
    )
  ).then((data) => {
    dataList.length = 0
    data.list.map(item => {
      item.popoverVisible = false
      return item
    })
    dataList.push(...data.list)
    page.total = data.total
    dataListLoading.value = false
  })
}

const router = useRouter()

const onAddOrUpdate = (id) => {
  router.push({
    path: '/stock/warehouse-store/station-create',
    query: {
      stationId: id
    }
  })
}

const onDelete = (id) => {
  ElMessageBox.confirm('确定进行删除操作' + '?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    api.deleteStation(id)
      .then(() => {
        ElMessage({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            refreshChange()
          }
        })
      })
  }).catch(() => { })
}

// 下线管理
const offlineEventHandleVisible = ref(false)
const offlineEventRef = ref()
const auditEventHandle = (id) => {
  offlineEventHandleVisible.value = true
  nextTick(() => {
    offlineEventRef.value?.init(id)
  })
}

// 账号管理
const stationAccountRef = ref()
const stationAccountVisible = ref(false)
const checkStationAccount = (id) => {
  stationAccountVisible.value = true
  nextTick(() => {
    stationAccountRef.value?.init(id)
  })
}

const prodInventoryRef = ref(null)
const prodinventoryVisible = ref(false)
/**
 * 查看门店的商品库存
 */
const onViewInventory = (id, stockMode) => {
  prodinventoryVisible.value = true
  nextTick(() => {
    prodInventoryRef.value.init(id, 1, stockMode)
  })
}

const stockModeVisible = ref(false)
const stockModeRef = ref(null)
const closePopoverRef = ref(null)
// 修改门店库存模式
const onChangeMode = (row) => {
  stockModeVisible.value = true
  nextTick(() => {
    closePopoverRef.value.click()
    stockModeRef.value.init(row.stationId, row.stockMode)
  })
}

const onShowPopover = (row) => {
  row.popoverVisible = true
}

const onHidePopver = (row) => {
  row.popoverVisible = false
}

// 刷新回调
const refreshChange = () => {
  getDataList(page)
}

const onSearch = (newData = false) => {
  page.currentPage = 1
  getDataList(page, newData)
}

// 重置表单
const searchFormRef = ref()
const onResetSearch = () => {
  searchFormRef.value.resetFields()
}

const onPageSizeChange = (val) => {
  page.pageSize = val
  getDataList()
}

const onPageChange = (val) => {
  page.currentPage = val
  getDataList()
}
</script>

<style lang="scss" scoped>
.page-station {
  .operation-bar{
    margin-bottom: 20px;
  }
  .text-btn-con{
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
  .text-btn-con .text-btn{
    color: #155bd4;
    margin: 0 10px;
    cursor: pointer;
    .stock-mode-icon {
      vertical-align: text-bottom;
    }
  }
  .pagination-box{
    text-align: right;
    padding-top: 30px;

    :deep(.el-pagination){
      display: flex;
      justify-content: right;
    }
  }
}
</style>
