<template>
  <div class="page-printer app-container">
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
            prop="printerName"
            label="打印机名称:"
          >
            <el-input
              v-model.trim="searchForm.printerName"
              type="text"
              placeholder="请输入打印机名称"
              clearable
            />
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
      <div class="operation-bar print-info">
        <el-button
          v-permission="['shop:printer:save']"
          type="primary"
          @click="onAddOrUpdate()"
        >
          {{ $t('table.create') }}
        </el-button>
        <div>
          <el-button
            type="primary"
            link
            @click="onGetInfo()"
          >
            {{ '设备连接说明' }}
          </el-button>
        </div>
      </div>
      <div class="table-con printer-table">
        <el-table
          v-loading="pageLoading"
          :data="pageData.dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
        >
          <!-- 打印机名称 -->
          <el-table-column
            :label="$t('printer.printerName')"
            prop="printerName"
            align="center"
          >
            <template #default="scope">
              <span>{{ scope.row.printerName }}</span>
            </template>
          </el-table-column>
          <!-- 设备码 -->
          <el-table-column
            :label="$t('printer.siid')"
            prop="siid"
            align="center"
          >
            <template #default="scope">
              <span>{{ scope.row.siid }}</span>
            </template>
          </el-table-column>
          <!-- 打印机备注 -->
          <el-table-column
            :label="$t('printer.printerRemark')"
            prop="printerRemark"
            align="center"
          >
            <template #default="scope">
              <span>{{ scope.row.printerRemark || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 是否默认 0否1是 -->
          <el-table-column
            :label="$t('printer.isDefault')"
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
                  v-permission="['shop:printer:update']"
                  type="primary"
                  link
                  @click="onAddOrUpdate(scope.row.printerId)"
                >
                  {{ $t("table.edit") }}
                </el-button>
                <el-button
                  v-permission="['shop:printer:delete']"
                  type="primary"
                  link
                  @click="onDelete(scope.row.printerId)"
                >
                  {{ $t('table.delete') }}
                </el-button>
                <el-button
                  v-permission="['shop:printer:setDefault']"
                  type="primary"
                  link
                  @click="onSetDefault(scope.row.printerId)"
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
  </div>
</template>

<script setup>
import AddOrUpdate from './add-or-update.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as api from '@/api/printer/printer'
import { getQuick100Config } from '@/api/rbac/web-config'

let tempSearchForm = null // 保存上次点击查询的请求条件

// 返回参数
const pageData = ref({
  dataList: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})

// 头部搜索表单
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  printerName: ''
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
const onAddOrUpdate = (printerId) => {
  if (isPrint.value === 0) {
    return ElMessage({
      message: '平台尚未开启电子面单功能，如需使用请到平台后台配置',
      type: 'error',
      duration: 1500
    })
  }
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(printerId)
  })
}

// 删除
const onDelete = (printerId) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => deleteById(printerId))
}

const deleteById = (printerId) => {
  api.deleteById(printerId).then(() => {
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

// 设为默认
const onSetDefault = (printerId) => {
  api.setDefault(printerId).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => getPageData()
    })
  })
}
// 设备说明
const onGetInfo = () => {
  ElMessageBox.alert('1、完成打印机安装，接上电源，打开开关；<br/>' +
      '2、确保手机蓝牙为开启状态；<br/>' +
      '3、打开微信扫描云打印机底部二维码，进入‘云打印机管家’小程序进行联网操作。', '设备连接说明', {
    dangerouslyUseHTMLString: true,
    confirmButtonText: $t('table.confirm')
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
.print-info {
  display: flex;
  justify-content: space-between;
}
</style>
