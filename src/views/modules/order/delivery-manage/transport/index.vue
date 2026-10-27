<template>
  <div class="page-transport app-container">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        :inline="true"
        :model="page"
        class="demo-form-inline"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item :label="$t('delivery.transport.name') + '：'">
            <el-input
              v-model="searchForm.transName"
              :placeholder="$t('delivery.transport.name')"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onGetDataList(true)"
            >
              {{ $t("table.search") }}
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              @click="onClear()"
            >
              {{ $t("shop.resetMap") }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 列表相关区域 -->
    <div class="main-content">
      <div class="operation-bar">
        <el-button
          v-permission="['user:transport:save']"
          type="primary"
          @click="onAddOrUpdate()"
        >
          {{ $t("table.create") }}
        </el-button>
      </div>
      <div class="table-con">
        <el-table
          v-loading="pageLoading"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
        >
          <!-- 名称 -->
          <el-table-column
            :label="$t('delivery.transport.name')"
            prop="transName"
            align="left"
          >
            <template #default="{ row }">
              <span class="table-cell-text">{{ row.transName }}</span>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('delivery.transport.type')"
            prop="type"
          >
            <template #default="scope">
              <span>{{ [$t('delivery.transport.buyerPrice'),$t('delivery.transport.shopPrice')][scope.row.isFreeFee] }}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="left"
            prop="imgType"
            :label="$t('delivery.transport.chargePrice')"
          >
            <template #default="scope">
              <span>{{ [$t('delivery.transport.byCount'),$t('delivery.transport.byWeight'),$t('delivery.transport.byVolume')][scope.row.chargeType] }}</span>
            </template>
          </el-table-column>

          <!-- 创建时间 -->
          <el-table-column
            :label="$t('table.createTime')"
            prop="createTime"
            align="center"
            min-width="150"
          >
            <template #default="{ row }">
              <span>{{ row.createTime }}</span>
            </template>
          </el-table-column>
          <!-- 更新时间 -->
          <el-table-column
            :label="$t('table.updateTime')"
            prop="updateTime"
            align="center"
            min-width="150"
          >
            <template #default="{ row }">
              <span>{{ row.updateTime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.actions')"
            align="center"
            width="230"
            class-name="small-padding fixed-width"
          >
            <template #default="{ row }">
              <el-button
                v-permission="['user:transport:update']"
                type="primary"
                link
                @click="onAddOrUpdate(row.transportId)"
              >
                {{ $t("table.edit") }}
              </el-button>
              <el-button
                v-permission="['user:transport:delete']"
                type="primary"
                link
                @click="onDelete(row.transportId)"
              >
                {{ $t("table.delete") }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页条 -->
        <pagination
          v-show="page.total > 0"
          v-model:page="page.pageNum"
          v-model:limit="page.pageSize"
          :total="page.total"
          @pagination="onGetDataList()"
        />
      </div>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="onGetDataList()"
    />
  </div>
</template>

<script setup>
import Pagination from '@/components/Pagination/index.vue'
import AddOrUpdate from './add-or-update.vue'
import * as api from '@/api/delivery/transport'
import { ElMessage, ElMessageBox } from 'element-plus'

const dataList = reactive([])
const page = reactive({
  pageSize: 10,
  pageNum: 1,
  total: 0,
  pages: 0
})
const searchForm = reactive({
  transName: ''
})
const route = useRoute()

onMounted(() => {
  if (+route.query.type === 1) {
    onAddOrUpdate()
  }
  onGetDataList()
})

const pageLoading = ref(true)
let tempSearchForm = null
const onGetDataList = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = {
      pageNum: page.pageNum,
      pageSize: page.pageSize,
      ...searchForm
    }
  } else {
    tempSearchForm.pageNum = page.pageNum
    tempSearchForm.pageSize = page.pageSize
  }
  pageLoading.value = true
  api.page(
    tempSearchForm
  ).then(data => {
    onHandleArr(dataList, data.list)
    page.total = data.total
    page.pages = data.pages
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

// 新增 / 修改
const addOrUpdateRef = ref()
const addOrUpdateVisible = ref(false)
const onAddOrUpdate = (id) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(id)
  })
}

// 删除
const onDelete = (id) => {
  ElMessageBox.confirm(
    $t('table.sureToDelete'),
    $t('table.tips'),
    {
      confirmButtonText: $t('table.confirm'),
      cancelButtonText: $t('table.cancel'),
      type: 'warning'
    }
  ).then(() => {
    api.deleteById(
      id
    ).then(() => {
      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 1500,
        onClose: () => onGetDataList()
      })
    })
  })
}

// 清空搜索内容
const onClear = () => {
  searchForm.transName = ''
}

// 数组赋值
const onHandleArr = (arr, data) => {
  arr.length = 0
  arr.push(...data)
}
</script>

<style lang="scss" scoped>
.page-transport {
  :deep(.el-table__empty-block) {
    border-bottom: 1px solid #dfe6ec !important;
  }
  :deep(.el-pagination .el-select .el-input){
    width: 100px !important;
  }
}
</style>
