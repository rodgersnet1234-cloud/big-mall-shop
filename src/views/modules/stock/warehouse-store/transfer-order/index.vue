<template>
  <div class="page-transfer-order">
    <div class="search-bar">
      <el-form
        :inline="true"
        :model="searchForm"
        label-width="auto"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item
            :label="'调拨编号' + ':'"
            prop="allotOrderId"
          >
            <el-input
              v-model="searchForm.allotOrderId"
              oninput="value=value.replace(/[^0-9]/g,'')"
              placeholder="调拨编号"
              clearable
              :maxlength="16"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSearch(true)"
            >
              {{ $t("table.search") }}
            </el-button>
            <el-button
              @click="onResetSearch()"
            >
              {{ $t("shop.resetMap") }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-content">
      <div class="operation-bar">
        <el-button
          type="primary"
          @click="onAddOrUpdate(0)"
        >
          {{ $t('product.addNew') }}
        </el-button>
      </div>
      <!-- 表格 -->
      <div class="table-con">
        <!-- 导航 -->
        <el-tabs
          v-model="activeName"
          @tab-click="selectNav"
        >
          <el-tab-pane
            :name="0"
            :label="$t('date.a')"
          />
          <el-tab-pane
            v-for="item in statusList"
            :key="item.value"
            :name="item.value"
            :label="item.label"
          />
        </el-tabs>
        <el-table
          ref="imgTableRef"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
        >
          <!-- 调拨编号 -->
          <el-table-column
            prop="seq"
            label="调拨编号"
            width="250"
          >
            <template #default="scope">
              <span>{{ scope.row.allotOrderId || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 调出库存点 -->
          <el-table-column
            label="调出库存点"
            min-width="140"
          >
            <template #default="scope">
              <span>{{ scope.row.outWarehouseName || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 调入库存点 -->
          <el-table-column
            label="调入库存点"
            min-width="140"
          >
            <template #default="scope">
              <span>{{ scope.row.inWarehouseName || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 调拨类型 -->
          <el-table-column
            label="调拨类型"
            width="120"
          >
            <template #default="scope">
              <span>{{ ['', '仓库', '门店'][scope.row.outStockPointType] + '-' + ['', '仓库', '门店'][scope.row.inStockPointType] }}</span>
            </template>
          </el-table-column>
          <!-- 调拨数量 -->
          <el-table-column
            label="调拨数量"
          >
            <template #default="scope">
              <span>{{ scope.row.totalAllotCount || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 调拨日期 -->
          <el-table-column
            label="调拨日期"
            min-width="180"
          >
            <template #default="scope">
              <span>{{ scope.row.createTime || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 状态 -->
          <el-table-column
            :label="$t('table.status')"
            width="120"
          >
            <template #default="scope">
              <span v-if="scope.row.status === 0">已作废</span>
              <span v-if="scope.row.status === 1">待入库</span>
              <span v-if="scope.row.status === 2">部分入库</span>
              <span v-if="scope.row.status === 3">已完成</span>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column
            align="center"
            :label="$t('table.actions')"
            width="220"
          >
            <template #default="scope">
              <div class="text-btn-con">
                <el-button
                  v-if="scope.row.status === 1||scope.row.status === 2"
                  type="primary"
                  link
                  @click="onAddOrUpdate(scope.row.allotOrderId)"
                >
                  {{ $t('stock.purchase.inbound') }}
                </el-button>
                <el-button
                  v-if="scope.row.status !== 3 &&scope.row.status !== 0"
                  type="primary"
                  link
                  @click="nullifyHandle(scope.row.allotOrderId)"
                >
                  作废
                </el-button>
                <el-button
                  type="primary"
                  link
                  class="default-btn text-btn"
                  @click="onAddOrUpdate(scope.row.allotOrderId, true)"
                >
                  详情
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        v-if="dataList.length"
        :current-page="page.currentPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="page.pageSize"
        :total="page.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
      />
    </div>
  </div>
</template>

<script setup>
import { ElMessageBox, ElMessage } from 'element-plus'
import * as api from '@/api/stock/transfer-order.js'

const statusList = [
  {
    value: 1,
    label: '已作废'
  }, {
    value: 2,
    label: '待入库'
  }, {
    value: 3,
    label: '部分入库'
  }, {
    value: 4,
    label: '已完成'
  }
]

let tempSearchForm = null // 保存上次点击查询的请求条件
const dataList = ref([])
const searchForm = reactive({
  allotOrderId: ''
})
const activeName = ref(0)
const page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
})

onMounted(() => {
  // 携带参数查询
  getDataList(page)
})

const status = ref('')
/**
 * 获取数据列表
 */
const getDataList = (pageParam, newData = false) => {
  pageParam = (page === undefined ? pageParam : page)
  if (newData || !tempSearchForm) {
    tempSearchForm = JSON.parse(JSON.stringify(searchForm))
  }
  api.searchAllotOrder(
    Object.assign(
      {
        pageNum: pageParam == null ? page.currentPage : pageParam.currentPage,
        pageSize: pageParam == null ? page.pageSize : pageParam.pageSize,
        status: status.value
      },
      tempSearchForm
    )
  ).then((data) => {
    dataList.value = data.list
    page.total = data.total
  })
}

// 每页数
const sizeChangeHandle = (val) => {
  page.pageSize = val
  page.currentPage = 1
  getDataList(page)
}
// 当前页
const currentChangeHandle = (val) => {
  page.currentPage = val
  getDataList(page)
}
/**
 * 导航选择状态
 */
const selectNav = (e) => {
  const orderStatus = Number(e.paneName)
  status.value = orderStatus ? orderStatus - 1 : ''
  onSearch(true)
}
// 清空按钮
const onResetSearch = () => {
  searchForm.allotOrderId = ''
}
// 搜索查询
const onSearch = (newData = false) => {
  page.currentPage = 1
  getDataList(page, newData)
}
const router = useRouter()
// 新增 / 修改
const onAddOrUpdate = (id, view) => {
  router.push({
    path: '/stock/warehouse-store/transfer-order-create',
    query: {
      allotOrderId: id,
      view
    }
  })
}

let isSubmit = false
// 作废
const nullifyHandle = (id) => {
  ElMessageBox.confirm('确定作废该调拨订单?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (isSubmit) {
      return
    }
    isSubmit = true
    api.nullifyAllotOrder(id).then(() => {
      ElMessage({
        message: '操作成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          setTimeout(() => getDataList(page), 1000)
        }
      })
    }).finally(() => {
      isSubmit = false
    })
  })
}

</script>
<style lang="scss" scoped>
.page-transfer-order{
  padding: 20px;
  :deep(.el-pagination){
    margin-top: 20px;
    justify-content: flex-end;
  }
}
</style>
