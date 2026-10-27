<template>
  <div class="page-group app-container mod-group">
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
            :label="$t('product.prodName') + '：'"
            prop="spuName"
          >
            <el-input
              v-model="searchForm.spuName"
              :placeholder="$t('product.prodName')"
            />
          </el-form-item>
          <el-form-item
            :label="$t('group.activityName') + '：'"
            prop="activityName"
          >
            <el-input
              v-model="searchForm.activityName"
              :placeholder="$t('group.activityName')"
            />
          </el-form-item>
          <el-form-item
            :label="$t('group.status') + '：'"
            prop="status"
          >
            <el-select
              v-model="searchForm.status"
              placeholder="请选择"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="getSearchList(true)"
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
      <div class="operation-bar">
        <el-button
          v-permission="['marketing:group:save']"
          type="primary"
          @click="onAddOrUpdate()"
        >
          {{ $t('table.create') }}
        </el-button>
      </div>
      <div class="table-con">
        <!-- 列表相关区域 -->
        <el-table
          v-loading="pageLoading"
          :data="pageData.dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%;"
        >
          <!-- 活动名称 -->
          <el-table-column
            :label="$t('group.activityName')"
            prop="activityName"
            align="left"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.activityName }}</span>
            </template>
          </el-table-column>
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
          <!-- 成团人数 -->
          <el-table-column
            :label="$t('group.groupsNum')"
            prop="groupOrderCount"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.groupNumber }}</span>
            </template>
          </el-table-column>
          <!-- 活动开始时间（活动状态：未开始、经行中、已结束） -->
          <el-table-column
            :label="$t('group.startTime')"
            prop="startTime"
            align="center"
            width="180"
          >
            <template #default="{row}">
              <span>{{ row.startTime }}</span>
            </template>
          </el-table-column>
          <!-- 活动结束时间（活动状态：未开始、经行中、已结束） -->
          <el-table-column
            :label="$t('group.endTime')"
            prop="endTime"
            align="center"
            width="180"
          >
            <template #default="{row}">
              <span>{{ row.endTime }}</span>
            </template>
          </el-table-column>
          <!-- 已成团订单数（统计） -->
          <el-table-column
            :label="$t('group.groupOrderCount')"
            prop="groupOrderCount"
            align="center"
            width="100"
          >
            <template #default="{row}">
              <span>{{ row.groupOrderCount }}</span>
            </template>
          </el-table-column>
          <!-- 已成团人数（统计） -->
          <el-table-column
            :label="$t('group.groupNumberCount')"
            prop="groupNumberCount"
            align="center"
            width="100"
          >
            <template #default="{row}">
              <span>{{ row.groupNumberCount }}</span>
            </template>
          </el-table-column>
          <!-- 拼团状态(-1:删除、0:未启用、1:启用、2:违规下架、3:等待审核 4:已失效 5:已结束) -->
          <el-table-column
            :label="$t('group.status')"
            prop="status"
            align="center"
          >
            <template #default="{row}">
              <span
                v-if="row.status === 0"
                class="tag-text"
              >未启用</span>
              <span
                v-else-if="row.status === 1"
                class="tag-text"
              >启用</span>
              <span
                v-else-if="row.status === 2"
                class="tag-text"
              >平台下架</span>
              <span
                v-else-if="row.status === 3"
                class="tag-text"
              >等待审核</span>
              <span
                v-else-if="row.status === 4"
                class="tag-text"
              >已失效</span>
              <span
                v-else-if="row.status === 5"
                class="tag-text"
              >已结束</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.actions')"
            align="center"
            width="180"
          >
            <template #default="{row}">
              <div class="table-btn-con">
                <el-button
                  v-if="row.status === 0"
                  type="primary"
                  link
                  @click="onActiveGroupActivity(row.groupActivityId)"
                >
                  {{ $t('group.startUsing') }}
                </el-button>
                <el-button
                  v-if="row.status >= 0 && row.status < 4"
                  v-permission="['marketing:group:update']"
                  type="primary"
                  link
                  @click="onAddOrUpdate(row.groupActivityId)"
                >
                  {{ $t('table.edit') }}
                </el-button>
                <el-button
                  v-if="row.status >= 4"
                  v-permission="['marketing:group:update']"
                  type="primary"
                  link
                  @click="onAddOrUpdate(row.groupActivityId)"
                >
                  查看
                </el-button>
                <!-- 申请上架-->
                <el-button
                  v-if="row.status === 2"
                  v-permission="['marketing:group:auditApply']"
                  type="primary"
                  link
                  @click="onAuditEvent(row.groupActivityId)"
                >
                  {{ $t('table.applyForListing') }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('group.ifNotDealtWith')"
                    placement="right"
                  >
                    <el-icon><QuestionFilled /></el-icon>
                  </el-tooltip>
                </el-button>
                <!-- 等待审核-->
                <el-button
                  v-if="row.status === 3"
                  v-permission="['marketing:group:waitAudit']"
                  type="primary"
                  link
                  @click="onAuditEvent(row.groupActivityId)"
                >
                  {{ $t('table.waitReview') }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('group.ifNotDealtWith')"
                    placement="right"
                  >
                    <el-icon><QuestionFilled /></el-icon>
                  </el-tooltip>
                </el-button>
                <!-- 失效活动-->
                <el-button
                  v-if="row.status === 1"
                  v-permission="['marketing:group:delete']"
                  type="primary"
                  link
                  @click="onInvalidActivity(row.groupActivityId)"
                >
                  {{ $t('group.invalidActivity') }}
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="$t('group.invalidate')"
                    placement="right"
                  >
                    <el-icon><QuestionFilled /></el-icon>
                  </el-tooltip>
                </el-button>
                <!-- 如果活动状态在 【启用】的状态下无法进行删除操作-->
                <el-button
                  v-permission="['marketing:group:delete']"
                  :disabled="row.status === 1"
                  :type="row.status === 1 ? 'info': 'primary'"
                  link
                  @click="onDelete(row.groupActivityId)"
                >
                  {{ $t('table.delete') }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 分页条 -->
    <pagination
      v-show="pageData.total>0"
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
      @react-add-or-update="reactAddOrUpdate()"
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
import AddOrUpdate from './add-or-update.vue'
import * as api from '@/api/group/group'
import { ElMessageBox, ElMessage } from 'element-plus'

let tempSearchForm = null
// 查询的参数
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  activityName: null,
  spuName: null,
  status: null
})
// 返回参数
const pageData = ref({
  dataList: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
// loading
const pageLoading = ref(true)
const groupActivityId = ref(null)
const isSubmit = ref(false)
const addOrUpdateVisible = ref(false)
const operateDialogVisible = ref(false)

const statusOptions = [{
  value: 0,
  label: '未启用'
}, {
  value: 1,
  label: '启用'
}, {
  value: 2,
  label: '平台下架'
}, {
  value: 3,
  label: '等待审核'
}, {
  value: 4,
  label: '已失效'
}]
onMounted(() => {
  isSubmit.value = false
  operateDialogVisible.value = false
  addOrUpdateVisible.value = false
  groupActivityId.value = null
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
  addOrUpdateVisible.value = false
  api.page(tempSearchForm).then(data => {
    pageData.value.dataList = data.list
    pageData.value.pages = data.pages
    pageData.value.total = data.total
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}
const getSearchList = (newData = false) => {
  searchForm.pageNum = 1
  getPageData(newData)
}

const searchFormRef = ref(null)
const onResetSearch = (formEl) => {
  formEl.resetFields()
}

const addOrUpdateRef = ref(null)
const onAddOrUpdate = (rowGroupActivityId) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(rowGroupActivityId)
  })
}
const onDelete = (rowGroupActivityId) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => deleteById(rowGroupActivityId))
}
// 启用活动
const onActiveGroupActivity = (rowGroupActivityId) => {
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  api.active({ groupActivityId: rowGroupActivityId }).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => {
        getPageData()
        isSubmit.value = false
      }
    })
  }).catch(() => {
    isSubmit.value = false
  })
}
// 失效活动
const onInvalidActivity = (rowGroupActivityId) => {
  ElMessageBox.confirm($t('group.sureToInvalidate'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    if (isSubmit.value) {
      return
    }
    isSubmit.value = true
    api.invalid({ groupActivityId: rowGroupActivityId }).then(() => {
      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 1500,
        onClose: () => {
          getPageData()
          isSubmit.value = false
        }
      })
      getPageData()
    })
  }).catch(() => {
    isSubmit.value = false
  })
}
const offlineDataRef = ref(null)
// 下线管理
const onAuditEvent = (rowGroupActivityId) => {
  operateDialogVisible.value = true
  groupActivityId.value = rowGroupActivityId
  api.getOfflineHandleEvent(rowGroupActivityId).then((data) => {
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
    handleId: groupActivityId.value,
    eventId: data.eventId,
    reapplyReason: data.reapplyReason // 申请理由
  }
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  api.auditApply(param).then(() => {
    operateDialogVisible.value = false
    ElMessage({
      message: '提交成功',
      type: 'success',
      duration: 1000,
      onClose: () => getPageData()
    })
    isSubmit.value = false
  }).catch(() => {
    isSubmit.value = false
  })
}
const deleteById = (rowGroupActivityId) => {
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  api.deleteById(rowGroupActivityId).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => getPageData()
    })
    isSubmit.value = false
  }).catch(() => {
    isSubmit.value = false
  })
}
const reactAddOrUpdate = () => {
  addOrUpdateVisible.value = false
}
</script>
