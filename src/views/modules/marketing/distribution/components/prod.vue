<template>
  <div class="components-distribution-prod app-container">
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
            :label="$t('distributionProd.status') + '：'"
            prop="distributionState"
          >
            <el-select
              v-model="searchForm.distributionState"
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

    <!-- 主体区域 -->
    <div class="main-content">
      <div class="operation-bar">
        <el-button
          v-permission="['marketing:distributionSpu:save']"
          type="primary"
          class="filter-item"
          @click="onAddOrUpdate()"
        >
          {{ $t("table.create") }}
        </el-button>
      </div>
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
          <!-- 分销状态(-1:删除、0:未启用、1:启用、2:违规下架、3:等待审核 4:已失效 5:已结束) -->
          <el-table-column
            :label="$t('distributionProd.status')"
            prop="distributionInfo.state"
            align="center"
          >
            <template #default="{ row }">
              <span
                v-if="row.distributionInfo.state === 0"
              >商家下架</span>
              <span
                v-else-if="row.distributionInfo.state === 1"
                type="success"
              >商家上架</span>
              <span
                v-else-if="row.distributionInfo.state === 2"
                type="danger"
              >违规下架</span>
              <span
                v-else-if="row.distributionInfo.state === 3"
                type="warning"
              >待审核</span>
            </template>
          </el-table-column>
          <!-- 奖励比例 -->
          <el-table-column
            prop="state"
            :label="$t('distributionProd.rewardRatio')"
          >
            <template #default="{row}">
              <div
                v-if="row.distributionInfo.awardMode === 0"
                class="tag-text"
              >
                {{ $t("distributionProd.proporteward") }}
              </div>
              <div
                v-if="row.distributionInfo.awardMode === 1"
                class="tag-text"
              >
                {{ $t("distributionProd.rewardByFixedValue") }}
              </div>
            </template>
          </el-table-column>
          <!-- 间推奖励 -->
          <el-table-column
            prop="state"
            :label="$t('distributionProd.inviterReward')"
          >
            <template #default="{row}">
              <div
                v-if="row.distributionInfo.parentAwardSet === 0"
                class="tag-text"
              >
                {{ $t("seckill.close") }}
              </div>
              <div
                v-if="row.distributionInfo.parentAwardSet === 1"
                class="tag-text"
              >
                {{ $t("seckill.open") }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('table.actions')"
          >
            <template #default="{ row }">
              <div class="table-btn-con">
                <el-button
                  v-permission="['marketing:distributionSpu:edit']"
                  type="primary"
                  link
                  @click="onAddOrUpdate(row)"
                >
                  {{ $t("table.edit") }}
                </el-button>
                <el-button
                  v-if="row.distributionInfo.state === 0"
                  v-permission="['marketing:distributionSpu:putShelf']"
                  type="primary"
                  link
                  @click="onUpdateState(row.distributionInfo.distributionSpuId, 1)"
                >
                  上架
                </el-button>
                <el-button
                  v-if="row.distributionInfo.state === 1"
                  v-permission="['marketing:distributionSpu:offShelf']"
                  type="primary"
                  link
                  @click="onUpdateState(row.distributionInfo.distributionSpuId, 0)"
                >
                  下架
                </el-button>
                <el-button
                  v-if="row.distributionInfo.state === 2"
                  v-permission="['marketing:distributionSpu:applyOnline']"
                  type="primary"
                  link
                  @click="onOfflineManage(row.distributionInfo.distributionSpuId)"
                >
                  申请上线
                </el-button>
                <el-button
                  v-if="row.distributionInfo.state === 3"
                  type="primary"
                  link
                  @click="onOfflineManage(row.distributionInfo.distributionSpuId)"
                >
                  等待审核
                </el-button>
                <el-button
                  v-permission="['marketing:distributionSpu:delete']"
                  type="primary"
                  link
                  @click="onDelete(row)"
                >
                  {{ $t("table.delete") }}
                </el-button>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getPageData()"
      @leave-data-list="getPageData()"
    />
    <!-- 下架管理 -->
    <offline-manage
      v-if="operateDialogVisible"
      ref="offlineDataRef"
      @on-re-apply-data-submit="onReApplyDataSubmit"
    />
  </div>
</template>

<script setup>
import OfflineManage from '@/components/offline-manage/index.vue'
import AddOrUpdate from './prod-add-or-update.vue'
import * as api from '@/api/distributionProd/distributionProd.js'
import { ElMessageBox, ElMessage } from 'element-plus'

let tempSearchForm = null
// 查询的参数
const searchFormRef = ref(null)
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  distributionSpu: true,
  spuName: null,
  distributionState: null,
  keyword: null
})

// 返回参数
const pageData = ref({
  dataList: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
// loading
const pageLoading = ref(true)

const offlineDetail = ref({})
const isSubmit = ref(false)
const addOrUpdateVisible = ref(false)
const operateDialogVisible = ref(false)
const statusList = ref([
  {
    label: '商家下架',
    value: 0
  }, {
    label: '商家上架',
    value: 1
  }, {
    label: '违规下架',
    value: 2
  }, {
    label: '待审核',
    value: 3
  }
])

onMounted(() => {
  isSubmit.value = false
  operateDialogVisible.value = false
  addOrUpdateVisible.value = false
  getPageData()
})

const getPageData = (newData = false) => {
  searchForm.keyword = searchForm.spuName
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...searchForm }
  } else {
    tempSearchForm.pageNum = searchForm.pageNum
    tempSearchForm.pageSize = searchForm.pageSize
  }
  pageLoading.value = true
  api.discountPage(tempSearchForm).then(data => {
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

const addOrUpdateRef = ref(null)
const onAddOrUpdate = (data) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(data)
  })
}

const onDelete = (row) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => deleteById(row.distributionInfo.distributionSpuId))
}
/**
 * 上架或下架分销商品
 */
const onUpdateState = (distributionId, state) => {
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  api.updateState(distributionId, state).then(() => {
    ElMessage({
      message: state === 1 ? '商品上架成功' : '商品下架成功',
      type: 'success',
      duration: 1500,
      onClose: () => getPageData()
    })
    isSubmit.value = false
  }).catch(() => {
    isSubmit.value = false
  })
}
/**
 * 商品违规下架操作
 */
const distributionSpuId = ref(null)
const onOfflineManage = (rowDistributionSpuId) => {
  operateDialogVisible.value = true
  distributionSpuId.value = rowDistributionSpuId
  getOfflineDetailBydistributionSpuId(rowDistributionSpuId)
}
/**
 * 获取最新下线商品的事件
 */
const offlineDataRef = ref(null)
const getOfflineDetailBydistributionSpuId = (rowDistributionSpuId) => {
  api.getOfflineHandleEvent(rowDistributionSpuId).then((data) => {
    offlineDetail.value = data
    nextTick(() => {
      offlineDataRef.value?.init(data)
    })
  })
}

/**
 * 提交上架申请
 */
const onReApplyDataSubmit = (data) => {
  const param = {
    handleId: distributionSpuId.value,
    eventId: data.eventId,
    reapplyReason: data.reapplyReason // 申请理由
  }
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  api.auditApply(param)
    .then(() => {
      operateDialogVisible.value = false
      ElMessage({
        message: '提交成功',
        type: 'success',
        duration: 1000,
        onClose: () => getPageData()
      })
      isSubmit.value = false
    })
    .catch(() => {
      isSubmit.value = false
    })
}
const deleteById = (distributionSpuId) => {
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  api.deleteById(distributionSpuId)
    .then(() => {
      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 1500,
        onClose: () => getPageData()
      })
      isSubmit.value = false
    })
    .catch(() => {
      isSubmit.value = false
    })
}
</script>
<style lang="scss" scoped>
</style>
