<template>
  <div class="components-distribution-records app-container">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        :model="searchForm"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item
            :label="$t('distributionProd.prodName') + '：'"
            prop="spuName"
          >
            <el-input
              v-model="searchForm.spuName"
              :placeholder="$t('distributionProd.prodName')"
            />
          </el-form-item>
          <el-form-item
            :label="$t('distributionProd.distributor') + '：'"
            prop="nickName"
          >
            <el-input
              v-model="searchForm.nickName"
              :placeholder="$t('distributionProd.distributor')"
            />
          </el-form-item>
          <el-form-item
            :label="$t('distributionProd.phoneNum') + '：'"
            prop="userMobile"
          >
            <el-input
              v-model="searchForm.userMobile"
              :placeholder="$t('distributionProd.phoneNum')"
            />
          </el-form-item>
          <el-form-item
            :label="$t('distributionProd.distriStatus') + '：'"
            prop="state"
          >
            <el-select
              v-model="searchForm.state"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSearch(true)"
            >
              {{ $t("table.search") }}
            </el-button>
            <el-button
              @click="onResetSearch(searchFormRef)"
            >
              {{ $t("shop.resetMap") }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="main-content">
      <div class="table-con">
        <el-table
          v-loading="pageLoading"
          :data="pageData.dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%"
        >
          <!-- 商品信息 -->
          <el-table-column
            :label="$t('product.prodInfo')"
            min-width="200"
          >
            <template #default="{row}">
              <div class="table-cell-con">
                <div class="table-cell-image">
                  <ImgShow :src="row.mainImgUrl" />
                </div>
                <span class="table-cell-text">{{ row.spuName }}</span>
              </div>
            </template>
          </el-table-column>

          <!-- 佣金数额 -->
          <el-table-column
            align="center"
            prop="incomeAmount"
            :label="$t('distributionProd.commAmount')"
            sortable
          >
            <template #default="scope">
              <span>￥ {{ price(scope.row.incomeAmount) }}</span>
            </template>
          </el-table-column>

          <!-- 分销员 -->
          <el-table-column
            align="center"
            prop="nickName"
            :label="$t('distributionProd.distributor')"
          >
            <template #default="scope">
              <span
                v-if="scope.row.distributionUser"
                class="table-cell-text"
              >{{ scope.row.distributionUser.nickName || '-' }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>

          <!-- 手机号 -->
          <el-table-column
            align="center"
            prop="userMobile"
            :label="$t('distributionProd.phoneNum')"
          >
            <template #default="scope">
              <span
                v-if="scope.row.distributionUser"
                class="table-cell-text"
              >{{ scope.row.distributionUser.userMobile || '-' }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>

          <!-- 下单时间 -->
          <el-table-column
            align="center"
            prop="createTime"
            min-width="100"
            :label="$t('distributionProd.createTime')"
          >
            <template #default="scope">
              <span class="table-cell-text">{{ scope.row.createTime || '-' }}</span>
            </template>
          </el-table-column>

          <!-- 订单号 -->
          <el-table-column
            align="center"
            prop="orderId"
            :label="$t('distributionProd.orderNumber')"
          />

          <!-- 分销状态 -->
          <el-table-column
            align="center"
            prop="state"
            :label="$t('distributionProd.distriStatus')"
          >
            <template #default="scope">
              <div
                v-if="scope.row.state>0"
                class="tag-text"
              >
                {{ ['', $t("distributionProd.waitSettle"), $t("distributionProd.settled")]
                  [scope.row.state] }}
              </div>
              <div
                v-else
                class="tag-text"
              >
                {{ $t('distributionProd.invOrder') }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 列表相关区域 -->
    <!-- 分页条 -->
    <pagination
      v-show="pageData.total > 0"
      v-model:page="searchForm.pageNum"
      v-model:limit="searchForm.pageSize"
      :total="pageData.total"
      @pagination="getPageData()"
    />
  </div>
</template>

<script setup>
import * as api from '@/api/distributionProd/distributionProd.js'
import Big from 'big.js'

let tempSearchForm = null
const searchFormRef = ref(null)
// 查询的参数
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  spuName: null,
  nickName: null,
  userMobile: null,
  state: null
})
// 返回参数
const pageData = ref({
  dataList: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
// loading
const pageLoading = ref(true)
const statusList = [
  {
    label: $t('distributionProd.waitSettle'),
    value: 1
  }, {
    label: $t('distributionProd.settled'),
    value: 2
  }, {
    label: $t('distributionProd.invOrder'),
    value: -1
  }
]

onMounted(() => {
  getPageData()
})

const getPageData = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...searchForm }
  } else {
    tempSearchForm.pageNum = searchForm.pageNum
    tempSearchForm.pageSize = searchForm.pageSize
  }
  pageLoading.value = true
  api.distributionRecordsPage(tempSearchForm).then(data => {
    pageData.value.dataList = data.list
    pageData.value.pages = data.pages
    pageData.value.total = data.total
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

const onSearch = (newData = false) => {
  searchForm.pageNum = 1
  getPageData(newData)
}

const onResetSearch = (formEl) => {
  formEl.resetFields()
}

const price = (value) => {
  if (value) {
    return new Big(value).div(100).toFixed(2)
  }
  return 0
}

</script>
<style lang="scss" scoped>
</style>
