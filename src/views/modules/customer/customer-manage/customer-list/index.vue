<template>
  <div class="page-customer-list">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        :inline="true"
        :model="searchForm"
        class="demo-form-inline"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item label="用户昵称：">
            <el-input
              v-model="searchForm.nickName"
              placeholder="用户昵称"
              maxlength="30"
              clearable
            />
          </el-form-item>
          <el-form-item label="手机号：">
            <el-input
              v-model="searchForm.phone"
              placeholder="手机号"
              maxlength="11"
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
              @click="onClear()"
            >
              {{ $t("shop.resetMap") }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-content">
      <div class="operation-bar">
        <!-- 送优惠券 -->
        <el-button
          v-permission="['customer:customer:sendCoupons']"
          type="primary"
          :disabled="dataListSelections.length <= 0"
          @click="onUpdateCoupon()"
        >
          {{ $t('customer.customerManager.sendCoupons') }}
        </el-button>
        <!-- 导入客户 -->
        <el-button
          v-permission="['customer:customer:import']"
          type="primary"
          :disabled="importDisabled"
          @click="onImportCustomer()"
        >
          {{ $t('customer.customerManager.userImport') }}
        </el-button>
        <!-- 导出客户 -->
        <el-button
          v-permission="['customer:customer:export']"
          type="primary"
          :disabled="exportDisabled"
          @click="onExportCustomer()"
        >
          {{ $t('customer.customerManager.export') }}
        </el-button>
      </div>
      <div class="table-con">
        <!-- 列表相关区域 -->
        <el-table
          ref="elTableRef"
          v-loading="pageLoading"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          row-key="userId"
          highlight-current-row
          style="width: 100%;"
          @selection-change="selectionChange"
          @sort-change="orderConditionSort"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <!-- 用户昵称 -->
          <el-table-column
            label="用户昵称"
            align="center"
            fixed
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.nickName }}</span>
            </template>
          </el-table-column>
          <!-- 用户头像 -->
          <el-table-column
            label="用户头像"
            prop="pic"
            align="center"
            width="80px;"
            fixed
          >
            <template #default="{row}">
              <el-image
                v-if="!row.pic"
                :src="userImg"
                class="img"
                alt="暂无图片"
              />
              <el-image
                v-else
                :src="checkFileUrl(row.pic)"
                fit="contain"
                class="img"
                style="width:60px;height:60px"
                @error="row.pic=''"
              />
            </template>
          </el-table-column>
          <!-- 手机号 -->
          <el-table-column
            label="手机号"
            prop="phone"
            align="center"
            width="120"
          >
            <template #default="{row}">
              <span class="phone-number">{{ formatPhoneNumber(row.phone) }}</span>
            </template>
          </el-table-column>
          <!-- 消费金额 -->
          <el-table-column
            label="消费金额"
            prop="consAmount"
            align="center"
            sortable="custom"
          >
            <template #default="{row}">
              <span>{{ row.consAmount }}</span>
            </template>
          </el-table-column>

          <!-- 实付金额 -->
          <el-table-column
            label="实付金额"
            prop="actualAmount"
            align="center"
            sortable="custom"
          >
            <template #default="{row}">
              <span>{{ row.actualAmount }}</span>
            </template>
          </el-table-column>

          <!-- 消费次数 -->
          <el-table-column
            label="消费次数"
            prop="consTimes"
            align="center"
            sortable="custom"
          >
            <template #default="{row}">
              <span>{{ row.consTimes }}</span>
            </template>
          </el-table-column>

          <!-- 下单次数 -->
          <el-table-column
            label="下单次数"
            prop="allCount"
            align="center"
            sortable="custom"
          >
            <template #default="{row}">
              <span>{{ row.allCount }}</span>
            </template>
          </el-table-column>

          <!-- 平均折扣 -->
          <el-table-column
            label="平均折扣"
            prop="averDiscount"
            align="center"
            sortable="custom"
          >
            <template #default="{row}">
              <span>{{ row.averDiscount }}</span>
            </template>
          </el-table-column>

          <!-- 退款金额 -->
          <el-table-column
            label="退款金额"
            prop="afterSaleAmount"
            align="center"
            sortable="custom"
          >
            <template #default="{row}">
              <span>{{ row.afterSaleAmount }}</span>
            </template>
          </el-table-column>
          <!-- 退款次数 -->
          <el-table-column
            label="退款次数"
            prop="afterSaleTimes"
            align="center"
            sortable="custom"
          >
            <template #default="{row}">
              <span>{{ row.afterSaleTimes }}</span>
            </template>
          </el-table-column>

          <!-- 操作 -->
          <el-table-column
            fixed="right"
            :label="$t('table.actions')"
            align="center"
            width="180"
            class-name="small-padding fixed-width"
          >
            <template #default="{row}">
              <!-- 会员详情 -->
              <el-button
                v-permission="['customer:customer:info']"
                type="primary"
                link
                @click="onAddOrUpdate(row.userId)"
              >
                {{ $t('table.edit') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 分页条 -->
    <pagination
      v-show="page.total>0"
      v-model:page="page.pageNum"
      v-model:limit="page.pageSize"
      :total="page.total"
      @pagination="onGetPage()"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="onGetPage()"
    />
    <!-- 弹窗，给用户发平台优惠券 -->
    <send-coupon
      v-if="updateCouponVisible"
      ref="updateCouponRef"
      :get-way="1"
      @refresh-data-list="onGetPage()"
    />
    <!-- 导入用户信息 -->
    <import-user
      v-if="importUserVisible"
      ref="importUserRef"
      @refresh-data-list="onGetPage()"
    />
  </div>
</template>

<script setup>
import userImg from '@/assets/images/user_img.jpg'
import * as api from '@/api/customer/customer-manager'
import { ElMessage } from 'element-plus'
import AddOrUpdate from './add-or-update.vue'
import ImportUser from './components/excel-user-import.vue'
import Pagination from '@/components/Pagination/index.vue'
import SendCoupon from './components/user-coupon-update.vue'

const dataList = reactive([])
const dataListSelections = reactive([])
const page = reactive({
  pageSize: 10,
  pageNum: 1,
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
const searchForm = reactive({
  nickName: null,
  phone: null,
  sort: null
})

const formatPhoneNumber = (value) => {
  if (!value) return ''
  value = value.toString()
  return value.slice(0, 3) + '****' + value.slice(7)
}

onMounted(() => {
  onGetPage()
})

/**
 * 条件排序
 * consAmount:消费金额      1-正序 2-倒序
 * actualAmount:实付金额 3正序 4-倒序
 * consTimes:消费次数 5正序 6倒序
 * allCount:下单次数      7-正序 8-倒序
 * averDiscount 平均折扣 9-正序 10-倒序
 * afterSaleTimes:退款次数      11-正序 12-倒序
 * afterSaleAmount:退款金额     13-正序 14-倒序
 * @param data
 */
const orderConditionSort = (data) => {
  const { order, prop: sortType } = data
  let sort = null
  page.pageNum = 1
  if (sortType === 'consAmount') {
    sort = order ? order === 'ascending' ? 1 : 2 : null
  } else if (sortType === 'actualAmount') {
    sort = order ? order === 'ascending' ? 3 : 4 : null
  } else if (sortType === 'consTimes') {
    sort = order ? order === 'ascending' ? 5 : 6 : null
  } else if (sortType === 'allCount') {
    sort = order ? order === 'ascending' ? 7 : 8 : null
  } else if (sortType === 'averDiscount') {
    sort = order ? order === 'ascending' ? 9 : 10 : null
  } else if (sortType === 'afterSaleTimes') {
    sort = order ? order === 'ascending' ? 11 : 12 : null
  } else if (sortType === 'afterSaleAmount') {
    sort = order ? order === 'ascending' ? 13 : 14 : null
  }
  searchForm.sort = sort
  onGetPage(true)
}

const elTableRef = ref(null)
let tempSearchForm = null // 保存上次点击查询的请求条件
const pageLoading = ref(true)
const onGetPage = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = {
      pageNum: page.pageNum,
      pageSize: page.pageSize,
      ...searchForm
    }
  } else {
    tempSearchForm.pageSize = page.pageSize
    tempSearchForm.pageNum = page.pageNum
  }
  pageLoading.value = true
  api.managePage(tempSearchForm).then(data => {
    handleArr(dataList, data.list)
    page.pages = data.pages
    page.total = data.total
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
  // 清空多选框选项
  elTableRef.value?.clearSelection()
}

// 查看
const addOrUpdateRef = ref()
const addOrUpdateVisible = ref(false)
const onAddOrUpdate = (userId) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(userId)
  })
}

const onSearch = (newData = false) => {
  page.pageNum = 1
  onGetPage(newData)
}

// 清空搜索条件
const onClear = () => {
  searchForm.nickName = null
  searchForm.phone = null
}

// 多选变化
const selectionChange = (val) => {
  handleArr(dataListSelections, val)
}

// 送优惠券
const updateCouponRef = ref()
const updateCouponVisible = ref(false)
const onUpdateCoupon = (id) => {
  const ids = id ? [id] : dataListSelections.map(item => {
    return item.userId
  })
  updateCouponVisible.value = true
  nextTick(() => {
    updateCouponRef.value?.init(ids)
  })
}

// 导入用户
const importUserRef = ref()
const importDisabled = ref(false)
const importUserVisible = ref(false)
const onImportCustomer = () => {
  importUserVisible.value = true
  nextTick(() => {
    importUserRef.value?.init()
  })
}

// 导出客户
const exportDisabled = ref(false)
const onExportCustomer = () => {
  exportDisabled.value = true
  api.soldExcel({
    pageNum: page.pageNum,
    pageSize: page.pageSize,
    ...searchForm
  }).then(data => {
    if (data.type !== 'application/vnd.ms-excel') {
      exportDisabled.value = false
      return ElMessage.error('无客户数据导出')
    }
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
    const fileName = $t('customer.customerManager.userInformationForm')
    const elink = document.createElement('a')
    if ('download' in elink) { // 非IE下载
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    } else { // IE10+下载
      navigator.msSaveBlob(blob, fileName)
    }
    exportDisabled.value = false
  }).catch((e) => {
    ElMessage.error(e)
    exportDisabled.value = false
  })
}
</script>

<style lang="scss" scoped>
.page-customer-list {
  padding: 20px;
  .main-content{
    .phone-number{
      width:100%;
    }
  }
  .img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100px;

  }
}
</style>
