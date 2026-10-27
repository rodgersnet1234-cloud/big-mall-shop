<template>
  <div class="page-outlet-config app-container">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        :model="searchForm"
        label-width="auto"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item
            prop="deliveryCompanyType"
            label="快递公司:"
          >
            <el-select
              v-model="searchForm.deliveryCompanyType"
              clearable
              placeholder="请选择快递公司"
            >
              <el-option
                v-for="item in deliveryCompanyType"
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
              {{ $t('table.search') }}
            </el-button>
            <el-button
              @click="onResetSearch(searchFormRef)"
            >
              {{ $t('shop.resetMap') }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 列表相关区域 -->
    <div class="main-content">
      <div class="operation-bar">
        <el-button
          v-permission="['shop:outletConfig:save']"
          type="primary"
          @click="onAddOrUpdate()"
        >
          {{ $t('table.create') }}
        </el-button>
      </div>
      <div class="table-con outlet-config-table">
        <el-table
          v-loading="pageLoading"
          :data="pageData.dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
        >
          <!-- 快递公司类型 -->
          <el-table-column
            :label="$t('outletConfig.deliveryCompanyType')"
            prop="deliveryCompanyType"
            align="center"
          >
            <template #default="scope">
              <span>{{ deliveryCompanyType[scope.row.deliveryCompanyType - 1].label }}</span>
            </template>
          </el-table-column>
          <!-- 发货人 -->
          <el-table-column
            :label="$t('outletConfig.shipper')"
            prop="shipper"
            align="center"
          >
            <template #default="scope">
              <span>{{ scope.row.shipper }}</span>
            </template>
          </el-table-column>
          <!-- 发货人电话 -->
          <el-table-column
            :label="$t('outletConfig.mobile')"
            prop="mobile"
            align="center"
          >
            <template #default="scope">
              <span>{{ scope.row.mobile }}</span>
            </template>
          </el-table-column>
          <!-- 发货地址 -->
          <el-table-column
            :label="$t('order.order.deliveryAddress')"
            align="center"
          >
            <template #default="scope">
              <span class="addr-name">{{ scope.row.printAddr }}</span>
            </template>
          </el-table-column>
          <!-- 是否默认 0否1是 -->
          <el-table-column
            :label="$t('outletConfig.isDefault')"
            prop="isDefault"
            align="center"
          >
            <template #default="scope">
              <span>{{ scope.row.isDefault === 1 ? '是':'否' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            fixed="right"
            :label="$t('table.actions')"
            width="auto"
          >
            <template #default="scope">
              <div class="text-btn-con">
                <el-button
                  v-permission="['shop:outletConfig:paperSize']"
                  type="primary"
                  link
                  @click="onGetPaperSize(scope.row)"
                >
                  {{ '纸张规格' }}
                </el-button>
                <el-button
                  v-permission="['shop:outletConfig:update']"
                  type="primary"
                  link
                  @click="onAddOrUpdate(scope.row.outletConfigId)"
                >
                  {{ $t("table.edit") }}
                </el-button>
                <el-button
                  v-permission="['shop:outletConfig:delete']"
                  type="primary"
                  link
                  @click="onDelete(scope.row.outletConfigId)"
                >
                  {{ $t('table.delete') }}
                </el-button>
                <el-button
                  v-permission="['shop:outletConfig:setDefault']"
                  type="primary"
                  link
                  @click="onSetDefault(scope.row.outletConfigId)"
                >
                  {{ scope.row.isDefault === 1 ? '取消默认' : '设为默认' }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        v-show="pageData.total>0"
        v-model:page="searchForm.pageNum"
        v-model:limit="searchForm.pageSize"
        :total="pageData.total"
        @pagination="getPageData()"
      />
    </div>
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="refreshChange"
    />
    <PaperSize
      ref="paperSizeRef"
      @refresh-data-list="refreshChange"
    />
  </div>
</template>

<script setup>
import AddOrUpdate from './add-or-update.vue'
import PaperSize from './components/paper-size.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as api from '@/api/outlet-config/outlet-config'
import { getQuick100Config } from '@/api/rbac/web-config'

let tempSearchForm = null // 保存上次点击查询的请求条件

// 返回参数
const pageData = ref({
  dataList: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
const deliveryCompanyType = [{
  value: 1,
  label: '顺丰速运'
}, {
  value: 2,
  label: '京东快递'
}, {
  value: 3,
  label: '圆通速递'
}, {
  value: 4,
  label: '韵达快递'
}, {
  value: 5,
  label: '中通快递'
}, {
  value: 6,
  label: '申通快递'
}, {
  value: 7,
  label: '百世快递'
}, {
  value: 8,
  label: 'EMS'
}]

// 头部搜索表单
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  deliveryCompanyType: null
})
const pageLoading = ref(true)

onMounted(() => {
  onGetQuick100()
  getPageData()
})

const getPageData = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = JSON.parse(JSON.stringify(searchForm))
  } else {
    tempSearchForm.pageNum = searchForm.pageNum
    tempSearchForm.pageSize = searchForm.pageSize
  }
  pageLoading.value = true
  api.page(tempSearchForm).then(data => {
    pageData.value.dataList = data.list
    pageData.value.pages = data.pages
    pageData.value.total = data.total
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

// 新增 / 修改
const addOrUpdateRef = ref(null)
const addOrUpdateVisible = ref(false)
const onAddOrUpdate = (outletConfigId) => {
  if (isPrint.value === 0) {
    return ElMessage({
      message: '平台尚未开启电子面单功能，如需使用请到平台后台配置',
      type: 'error',
      duration: 1500
    })
  }
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(outletConfigId)
  })
}

// 删除
const onDelete = (outletConfigId) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => deleteById(outletConfigId))
}

const deleteById = (outletConfigId) => {
  api.deleteById(outletConfigId).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => getPageData()
    })
  })
}
// 条件查询
const onSearch = (newData = false) => {
  searchForm.pageNum = 1
  searchForm.pageSize = 10
  getPageData(newData)
}

// 刷新回调
const refreshChange = () => {
  searchForm.pageNum = 1
  getPageData()
}

// 重置表单
const searchFormRef = ref(null)
const onResetSearch = (formEl) => {
  formEl.resetFields()
}

// 获取纸张规格
const paperSizeRef = ref(null)
const onGetPaperSize = (item) => {
  paperSizeRef.value.init(JSON.parse(JSON.stringify(item)))
}

// 设为默认
const onSetDefault = (outletConfigId) => {
  api.setDefault(outletConfigId).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => getPageData()
    })
  })
}

// 获取快递100配置
const isPrint = ref(0)
const onGetQuick100 = () => {
  getQuick100Config().then((res) => {
    isPrint.value = res ? 1 : 0
  })
}
</script>
<style lang="scss" scoped>
.page-outlet-config {
  .addr-name {
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    -webkit-text-overflow: ellipsis;
    -moz-text-overflow: ellipsis;
    word-break: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
</style>
