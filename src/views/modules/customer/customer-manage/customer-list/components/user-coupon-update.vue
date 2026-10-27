<template>
  <div class="component-user-coupon-update">
    <el-dialog
      v-model="visible"
      title="选择优惠券"
      width="50%"
      :append-to-body="true"
    >
      <el-form
        :inline="true"
        :model="searchForm"
        class="search-bar"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item>
            <el-input
              v-model="couponName"
              :placeholder="$t('customer.customerManager.couponTip1')"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSearch"
            >
              {{ $t("table.search") }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
      <el-main>
        <div class="prods-select-body">
          <el-table
            ref="couponTableRef"
            v-loading="dataListLoading"
            :data="dataList"
            header-cell-class-name="table-header"
            row-class-name="table-row-low"
            style="width: 100%;"
            @selection-change="selectChangeHandle"
          >
            <el-table-column
              v-if="props.isSingle"
              width="50"
              header-align="center"
              align="center"
            >
              <template #default="{row}">
                <div>
                  <el-radio
                    v-model="singleSelectCouponId"
                    :label="row.couponId"
                    @change="getSelectProdRow(row)"
                  >
                    &nbsp;
                  </el-radio>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="!props.isSingle"
              type="selection"
              :selectable="checkSelectable"
              header-align="center"
              align="center"
              width="50"
            />
            <el-table-column
              prop="couponName"
              header-align="center"
              align="center"
              :label="$t('coupon.coupon.couponName')"
            />
            <el-table-column
              prop="couponType"
              header-align="center"
              align="center"
              :label="$t('coupon.coupon.couponType')"
            >
              <template #default="{ row }">
                <span class="tag-text">
                  {{ ["", "代金券", "折扣券", "兑换券"][row.couponType] }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="stocks"
              header-align="center"
              align="center"
              :label="$t('customer.customerManager.stockNum')"
            />
            <el-table-column
              prop="limitNum"
              header-align="center"
              align="center"
              :label="$t('coupon.coupon.couponUpperLimit')"
            />
            <el-table-column
              header-align="center"
              align="center"
              :label="$t('customer.customerManager.perRecevies')"
              width="200"
            >
              <template #header>
                <span>{{ $t('customer.customerManager.perRecevies') }}</span>
                <el-popover
                  placement="top"
                  width="200"
                  trigger="hover"
                  :content="$t('customer.customerManager.couponTip2')"
                >
                  <el-icon><QuestionFilled /></el-icon>
                </el-popover>
              </template>
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.eachObtain"
                  size="small"
                  controls-position="right"
                  :precision="0"
                  :min="scope.row.stocks>0?1:0"
                  :max=" scope.row.stocks>0?(scope.row.stocks >= scope.row.limitNum ? scope.row.limitNum:scope.row.stocks):0"
                  @blur="onChangeEachObtain(scope.row)"
                />
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <pagination
            v-show="page.total>0"
            v-model:page="page.pageNum"
            v-model:limit="page.pageSize"
            :total="page.total"
            @pagination="getDataList()"
          />
        </div>
      </el-main>
      <el-alert
        :title="$t('发放优惠券时，库存不足或者达到用户领券上限则用户无法收到该优惠券')"
        type="warning"
        show-icon
        :closable="false"
      />
      <template #footer>
        <span>
          <el-button
            @click="visible = false"
          >{{ $t('table.cancel') }}</el-button>
          <el-button
            type="primary"
            :loading="confirmLoad"
            @click="submitProds()"
          >{{ $t('table.confirm') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import * as api from '@/api/coupon/coupon'
import Pagination from '@/components/Pagination/index.vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  value: {
    default: '',
    type: String
  },
  // 获取方式 null:默认（客户领取+平台发放） 0=客户领取 1=平台发放
  getWay: {
    default: null,
    type: Number
  },
  isSingle: {
    default: false,
    type: Boolean
  },
  // 最大上传数量
  limit: {
    default: 9,
    type: Number
  }
})

const emit = defineEmits([
  'refreshSelectCouponList',
  'refreshDataList'
])

let dataListSelections = []

const couponName = ref(null)
const dataForm = ref({
  userIds: [],
  sendCoupons: []
})
const visible = ref(false)
const dataList = reactive([])
const page = reactive({
  pageSize: 10,
  pageNum: 1,
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
const searchForm = reactive({
  couponName: null,
  putonStatus: null,
  getWay: null
})

const init = (ids) => {
  visible.value = true
  dataForm.value.userIds = ids
  couponName.value = null
  searchForm.couponName = null
  getDataList()
}

// 分页获取标签
const dataListLoading = ref(false)
const getDataList = () => {
  dataListLoading.value = true
  searchForm.putonStatus = 1
  searchForm.getWay = 1
  api.page({
    pageNum: page.pageNum,
    pageSize: page.pageSize,
    ...searchForm
  }).then((data) => {
    handleArr(dataList, data.list)
    page.total = data.total
    page.pages = data.pages
    dataList.forEach(item => {
      item.eachObtain = 1
    })
    dataListLoading.value = false
  })
}

// 搜索
const onSearch = () => {
  searchForm.couponName = couponName.value
  getDataList()
}

// 单选事件
const getSelectProdRow = (row) => {
  dataListSelections = [row]
}

// 禁用多选按钮
const checkSelectable = (row) => {
  return row.stocks > 0
}

// 多选点击事件
const selectChangeHandle = (selection) => {
  dataList.forEach((tableItem) => {
    const selectedProdIndex = selection.findIndex((selectedCoupon) => {
      if (!selectedCoupon) {
        dataListSelections = []
        return false
      }
      return selectedCoupon.couponId === tableItem.couponId
    })
    const dataSelectedProdIndex = dataListSelections.findIndex((dataSelectedCoupon) => dataSelectedCoupon.couponId === tableItem.couponId)
    if (selectedProdIndex > -1 && dataSelectedProdIndex === -1) {
      dataListSelections.push(tableItem)
    } else if (selectedProdIndex === -1 && dataSelectedProdIndex > -1) {
      dataListSelections.splice(dataSelectedProdIndex, 1)
    }
  })
}
const onChangeEachObtain = (row) => {
  if (!row.eachObtain && row.eachObtain !== 0) {
    row.eachObtain = row.stocks > 0 ? 1 : 0
  }
}
// 确定事件
const submitProds = () => {
  // 商品单选的情况
  if (props.isSingle) {
    dataListSelections.length && emit('refreshSelectCouponList', dataListSelections[0])
    dataListSelections = []
    visible.value = false
    return
  }
  // 多选
  const coupons = []
  if (dataListSelections.length >= 1) {
    dataListSelections.forEach(item => {
      const couponIndex = coupons.findIndex((coupon) => coupon.couponId === item.couponId)
      if (couponIndex === -1) {
        coupons.push({ couponId: item.couponId, couponName: item.couponName, subTitle: item.subTitle, limitNum: item.limitNum, eachObtain: item.eachObtain })
      }
    })
  }
  dataForm.value.sendCoupons = coupons
  dataListSelections = []
  confirm()
}

const confirmLoad = ref(false)
const confirm = () => {
  if (!dataForm.value.userIds) {
    return
  }
  if (!dataForm.value.sendCoupons.length) {
    return ElMessage.error('请选择优惠券！')
  }
  confirmLoad.value = true
  const coupons = []
  dataForm.value.sendCoupons.forEach(element => {
    const obj = {}
    obj.couponId = element.couponId
    obj.nums = element.eachObtain
    coupons.push(obj)
  })
  dataForm.value.sendCoupons = coupons
  api.sendUserCoupon(dataForm.value).then(() => {
    dataForm.value.sendCoupons = []
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 500,
      onClose: () => {
        visible.value = false
        confirmLoad.value = false
        emit('refreshDataList', page)
      }
    })
  }).catch(() => {
    dataForm.value.sendCoupons = []
    confirmLoad.value = false
  })
}

defineExpose({
  init
})
</script>

<style lang="scss" scoped>

</style>
