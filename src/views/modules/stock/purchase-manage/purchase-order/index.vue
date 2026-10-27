<template>
  <div class="page-purchase-order app-container">
    <div class="search-bar">
      <el-form
        :inline="true"
        :model="searchForm"
        label-width="auto"
        @submit.prevent
        @keyup.enter="getDataList(page)"
      >
        <div class="input-row">
          <el-form-item :label="$t('stock.purchase.purchaseNumber') + ':'">
            <el-input
              v-model="searchForm.purchaseOrderId"
              oninput="value=value.replace(/[^0-9]/g,'')"
              :placeholder="$t('stock.purchase.purchaseNumber')"
              clearable
              :maxlength="16"
              @change="changeNumber(searchForm)"
            />
          </el-form-item>
          <el-form-item :label="$t('stock.purchase.supplier') + ':'">
            <el-input
              v-model="searchForm.supplierName"
              :maxlength="50"
              :placeholder="$t('stock.purchase.supplier')"
              clearable
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
          v-permission="['inventory:purchaseOrder:add']"
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
            name="0"
            :label="$t('date.a')"
          />
          <el-tab-pane
            name="5"
            label="待付款"
          />
          <el-tab-pane
            name="7"
            label="待审核"
          />
          <el-tab-pane
            name="1"
            :label="$t('stock.purchase.voided')"
          />
          <el-tab-pane
            name="2"
            label="待发货"
          />
          <el-tab-pane
            name="3"
            label="待入库"
          />
          <el-tab-pane
            name="4"
            :label="$t('stock.purchase.partiallyComplete')"
          />
          <el-tab-pane
            name="6"
            :label="$t('stock.purchase.complete')"
          />
        </el-tabs>
        <el-table
          ref="imgTableRef"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
        >
          <!-- 采购编号 -->
          <el-table-column
            prop="seq"
            :label="$t('stock.purchase.purchaseNumber')"
          >
            <template #default="scope">
              <span>{{ scope.row.purchaseOrderId || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 物流编号 -->
          <!-- <el-table-column
            :label="$t('purchase-order.purchase-order.logisticsNumber')"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.dvyFlowId }}</span>
            </template>
          </el-table-column> -->
          <!-- 供应商 -->
          <el-table-column
            :label="$t('product.supplier')"
          >
            <template #default="scope">
              <span>{{ scope.row.supplierName || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="库存点名称"
            width="100"
          >
            <template #default="scope">
              <span>{{ scope.row.warehouseName || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="库存点类型"
            width="100"
          >
            <template #default="scope">
              <span>{{ scope.row.stockPointType === 1 ? '仓库' : '门店' }}</span>
            </template>
          </el-table-column>
          <!-- 采购金额 -->
          <el-table-column
            prop="imgType"
            :label="$t('stock.purchase.purchaseAmount')"
          >
            <template #default="scope">
              <span>{{ formatPrice(scope.row.totalAmount,1) }}</span>
            </template>
          </el-table-column>
          <!-- 采购数量 -->
          <el-table-column
            prop="imgType"
            :label="$t('stock.purchase.purchaseNum')"
          >
            <template #default="scope">
              <span>{{ scope.row.totalStock || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 送达日期 -->
          <el-table-column
            prop="imgType"
            :label="$t('stock.purchase.deliverTime')"
            min-width="180"
          >
            <template #default="scope">
              <span>{{ scope.row.deliverTime || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 状态 -->
          <el-table-column
            prop="imgType"
            :label="$t('table.status')"
          >
            <template #default="scope">
              <span v-if="scope.row.status === 0">已作废</span>
              <span v-if="scope.row.status === 1">待发货</span>
              <span v-if="scope.row.status === 2">待入库</span>
              <span v-if="scope.row.status === 3">部分入库</span>
              <span v-if="scope.row.status === 4">待付款</span>
              <span v-if="scope.row.status === 5">已完成</span>
              <span v-if="scope.row.status === 6">待审核</span>
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
                  v-if="scope.row.status === 2||scope.row.status === 3"
                  v-permission="['inventory:purchaseOrder:putStorage']"
                  type="primary"
                  link
                  @click="onAddOrUpdate(scope.row.purchaseOrderId)"
                >
                  {{ $t('stock.purchase.inbound') }}
                </el-button>
                <el-button
                  v-if="scope.row.status !== 5 &&scope.row.status !== 0"
                  v-permission="['inventory:purchaseOrder:delete']"
                  type="primary"
                  link
                  @click="nullifyHandle(scope.row.purchaseOrderId)"
                >
                  作废
                </el-button>
                <el-button
                  v-if="scope.row.status === 3"
                  v-permission="['inventory:purchaseOrder:accomplish']"
                  type="primary"
                  link
                  class="default-btn text-btn"
                  @click="completeHandle(scope.row)"
                >
                  完成
                </el-button>
                <el-button
                  v-permission="['inventory:purchaseOrder:detail']"
                  type="primary"
                  link
                  class="default-btn text-btn"
                  @click="onAddOrUpdate(scope.row.purchaseOrderId, true)"
                >
                  详情
                </el-button>
                <el-button
                  v-if="scope.row.status === 4"
                  v-permission="['inventory:purchaseOrder:payment']"
                  type="primary"
                  link
                  class="default-btn text-btn"
                  @click="uploadPay(scope.row.purchaseOrderId, scope.row.voucherImgUrls)"
                >
                  付款
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
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
      <el-dialog
        v-model="visible"
        title="上传付款凭证"
        width="650px"
        :close-on-click-modal="false"
      >
        <!-- native modifier has been removed, please confirm whether the function has been affected  -->
        <el-form
          ref="dataFormRef"
          :model="dataForm"
          :rules="rules"
          @submit.prevent
        >
          <el-form-item
            label=""
            prop="voucherFlag"
          >
            <el-radio-group v-model="dataForm.voucherFlag">
              <el-radio :label="0">
                提交付款凭证
              </el-radio>
              <el-radio :label="1">
                已线下结算
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="dataForm.voucherFlag === 0"
            label="付款凭证"
            prop="voucherImgUrls"
            label-width="100px"
          >
            <imgs-upload
              v-model="dataForm.voucherImgUrls"
              @update:model-value="changeImages()"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button
              @click="visible = false"
            >
              取消
            </el-button>
            <el-button
              type="primary"
              @click="uploadSubmit"
            >
              确定
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { formatPrice } from '@/utils'

import * as api from '@/api/stock/purchase-manage'
import { ElMessage, ElMessageBox } from 'element-plus'

let tempSearchForm = null // 保存上次点击查询的请求条件
const dataList = ref([])
const dataForm = reactive({
  voucherImgUrls: null,
  voucherFlag: 0
})
const sts = ref(0)
const status = ref(-1)
const isSubmit = ref(false)
const searchForm = reactive({
  supplierName: '',
  purchaseOrderId: ''
})
const activeName = ref('0')
const page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
})
const visible = ref(false)
const rules = {
  voucherImgUrls: [
    { required: true, message: '请选择付款凭证图', trigger: ['blur', 'change'] }
  ]
}

onActivated(() => {
  // 携带参数查询
  const query = useRoute().query
  if (Object.keys(query).length > 0) {
    getDataList(page, query)
  }
})
onMounted(() => {
  // 携带参数查询
  getDataList(page, useRoute().query)
  isSubmit.value = false
  // 监听页面滚动
  window.addEventListener('scroll', scrollToTop)
})

onUnmounted(() => {
  // // 页面销毁时移除监听
  // window.removeEventListener('scroll', handleScroll)
})

/**
 * 页面滚动事件
 */
const scrollToTop = () => {
  // const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  // showHeadScroll = scrollTop > 400
}

/**
 * 获取数据列表
 */
const getDataList = (pageParam, newData = false) => {
  pageParam = (page === undefined ? pageParam : page)
  // dataListLoading = true
  if (newData || !tempSearchForm) {
    tempSearchForm = JSON.parse(JSON.stringify(searchForm))
  }
  api.getPage(
    Object.assign(
      {
        pageNum: pageParam == null ? page.currentPage : pageParam.currentPage,
        pageSize: pageParam == null ? page.pageSize : pageParam.pageSize,
        status: status.value >= 0 ? status.value : null
      },
      tempSearchForm
    )
  ).then((data) => {
    dataList.value = data.list
    page.total = data.total
    sts.value = status.value >= 0 ? status.value + 1 : 0
    // dataListLoading = false
  })
}
const router = useRouter()
// 新增 / 修改
const onAddOrUpdate = (id, view) => {
  router.push({
    // name: 'stock-newPurchasesOrder',
    path: '/purchase-manage/purchase-order-create',
    query: {
      purchaseOrderId: id,
      view
    }
  })
}
// 作废
const nullifyHandle = (id) => {
  ElMessageBox.confirm('确定作废该采购订单?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (isSubmit.value) {
      return
    }
    isSubmit.value = true
    api.delNullifyOrder(id).then(() => {
      // ElMessage.success('编辑成功')
      ElMessage({
        message: '操作成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          setTimeout(getDataList(page), 1000)
        }
      })
    }).finally(() => {
      isSubmit.value = false
    })
  })
}
// 完成
const completeHandle = (row) => {
  const data = {
    purchaseOrderId: row.purchaseOrderId
  }
  ElMessageBox.confirm('确定完成该采购订单?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (isSubmit.value) {
      return
    }
    isSubmit.value = true
    api.putComplete(
      data
    ).then(() => {
      // ElMessage.success('编辑成功')
      ElMessage({
        message: '操作成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          setTimeout(getDataList(page), 1000)
        }
      })
      isSubmit.value = false
    }).catch(() => {
      isSubmit.value = false
    })
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
  const orderStatus = e.paneName
  activeName.value = orderStatus
  sts.value = parseInt(orderStatus)
  status.value = sts.value ? parseInt(sts.value) - 1 : null
  page.currentPage = 1
  getDataList(page)
}
// const orderStatus = (val) => {
//   status.value = val
// }
// 清空按钮
const onResetSearch = () => {
  searchForm.supplierName = ''
  searchForm.purchaseOrderId = ''
}
// 搜索查询
const onSearch = (newData = false) => {
  page.currentPage = 1
  getDataList(page, newData)
}
// 采购编号输入限制 number
const changeNumber = (data) => {
  const numReg = /^([0-9]|[1-9]\d+)(\.\d*)?$/
  if (numReg.test(data.purchaseOrderId)) {
    searchForm.purchaseOrderId = data.purchaseOrderId
  } else {
    searchForm.purchaseOrderId = null
  }
}
const uploadPay = (id, voucherImgUrls) => {
  dataForm.purchaseOrderId = id
  dataForm.voucherImgUrls = voucherImgUrls
  dataForm.voucherFlag = 0
  visible.value = true
}

const dataFormRef = ref(null)
const uploadSubmit = () => {
  dataFormRef.value.validate((valid) => {
    if (valid) {
      if (isSubmit.value) {
        return
      }
      isSubmit.value = true
      if (dataForm.voucherFlag === 1) {
        dataForm.voucherImgUrls = 1
      }
      api.updatePayVoucher(dataForm).then(() => {
        ElMessage({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            setTimeout(getDataList(page), 1000)
          }
        })
        visible.value = false
      }).finally(() => {
        isSubmit.value = false
      })
    }
  })
}
/**
 * 轮播图
 */
const changeImages = () => {
  if (dataForm.voucherImgUrls) {
    // 重新校验表单对应字段
    dataFormRef.value.validateField('voucherImgUrls')
  }
}

</script>
<style lang="scss" scoped>
.page-purchase-order{
  .pagination{
    margin-top: 20px;
    text-align: right;
  }
}

</style>
