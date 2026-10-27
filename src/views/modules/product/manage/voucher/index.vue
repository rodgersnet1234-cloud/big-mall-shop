<template>
  <div class="page-voucher app-container">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        :model="searchForm"
        label-width="auto"
      >
        <div class="input-row">
          <el-form-item
            prop="name"
            :label="$t('voucher.name')"
            class="search-form-item"
          >
            <el-input
              v-model="searchForm.name"
              type="text"
              clearable
              :placeholder="$t('voucher.name')"
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
      <div class="operation-bar">
        <el-button
          v-permission="['product:voucher:save']"
          type="primary"
          @click="onAddOrUpdate()"
        >
          {{ $t('table.create') }}
        </el-button>
      </div>
      <div class="table-con voucher-table">
        <el-table
          v-loading="pageLoading"
          :data="pageData.dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
          @cell-mouse-enter="cellMouseEnter"
          @cell-mouse-leave="cellMouseLeave"
        >
          <!-- 卡券名称 -->
          <el-table-column
            align="left"
            prop="name"
            :label="$t('voucher.name')"
          >
            <template #default="scope">
              <div class="table-cell-text voucher-name-box">
                <div>{{ scope.row.name }}</div>
                <div
                  v-show="nowHoverVoucherId === scope.row.voucherId"
                  class="edit-box"
                  @click.stop="onAddOrUpdate(scope.row.voucherId)"
                >
                  <el-icon><Edit /></el-icon>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="spuName"
            :label="$t('voucher.relatedProducts')"
          >
            <template #default="scope">
              <div class="table-cell-text">
                {{ scope.row.spuName || '-' }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            align="left"
            prop="startUsingNum"
            :label="$t('voucher.startUsing')"
          >
            <template #default="scope">
              <div class="table-cell-text">
                {{ scope.row.startUsingNum }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="notEnabledNum"
          >
            <template #header>
              <div>
                {{ $t('voucher.notEnabled') }}
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  :content="$t('voucher.notEnabledTips')"
                  placement="top"
                >
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
            </template>
            <template #default="scope">
              <div class="table-cell-text">
                {{ scope.row.notEnabledNum }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="expiredNum"
            :label="$t('voucher.expired')"
          >
            <template #default="scope">
              <div class="table-cell-text">
                {{ scope.row.expiredNum }}
              </div>
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
                  v-permission="['product:voucherItem:page']"
                  type="primary"
                  link
                  @click.stop="openDetailList(scope.row)"
                >
                  {{ $t('voucher.voucherDetail') }}
                </el-button>
                <el-button
                  v-permission="['product:voucher:delete']"
                  type="primary"
                  link
                  @click="onDelete(scope.row.voucherId)"
                >
                  {{ $t('table.delete') }}
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
import * as api from '@/api/product/voucher'

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
  pageNum: 1
})
const pageLoading = ref(true)

onMounted(() => {
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
const onAddOrUpdate = (voucherId) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(voucherId)
  })
}

const router = useRouter()
const openDetailList = (val) => {
  router.push({
    path: '/product/manage/voucher/item',
    query: { voucherId: val.voucherId }
  })
}

// 删除
const onDelete = (voucherId) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => deleteById(voucherId))
}

const deleteById = (voucherId) => {
  api.deleteById(voucherId).then(() => {
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

const nowHoverVoucherId = ref(null)
const cellMouseEnter = (row) => {
  nowHoverVoucherId.value = row.voucherId
}

const cellMouseLeave = () => {
  nowHoverVoucherId.value = null
}

</script>
<style scoped lang="scss">
.voucher-name-box {
  display: flex !important;
  align-items: center;
  .edit-box {
    margin-left: 3px;
    padding-top: 3px;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
