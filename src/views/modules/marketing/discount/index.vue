<template>
  <div class="page-discount app-container">
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        :model="searchForm"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item
            :label="$t('discount.discount.actName') + '：'"
            prop="discountName"
          >
            <el-input
              v-model="searchForm.discountName"
              :placeholder="$t('discount.discount.actName')"
              maxlength="50"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('discount.discount.typeOfActivity') + '：'"
            prop="discountRule"
          >
            <el-select
              v-model="searchForm.discountRule"
              placeholder="请选择活动类型"
              clearable
            >
              <el-option
                :label="$t('discount.discount.fullMoneoney')"
                value="0"
              />
              <el-option
                :label="$t('discount.discount.fullMoneyDiscount')"
                value="3"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('discount.discount.status') + '：'"
            prop="status"
          >
            <el-select
              v-model="searchForm.status"
              placeholder="请选择活动状态"
              clearable
            >
              <el-option
                :label="$t('discount.discount.close')"
                value="0"
              />
              <el-option
                :label="$t('discount.discount.turnOn')"
                value="1"
              />
              <el-option
                label="违规下架"
                value="2"
              />
              <el-option
                label="等待审核"
                value="3"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="getPageData(true)"
            >
              {{ $t('table.search') }}
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
    <!-- 列表相关区域 -->
    <div class="main-content">
      <div class="operation-bar">
        <el-button
          v-permission="['marketing:discount:save']"
          type="primary"
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
          row-class-name="table-row-low"
          style="width: 100%"
        >
          <!-- 名称 -->
          <el-table-column
            :label="$t('discount.discount.actName')"
            prop="discountName"
            align="left"
            width="280"
          >
            <template #default="{ row }">
              <span class="table-cell-text">{{ row.discountName }}</span>
            </template>
          </el-table-column>

          <el-table-column
            min-width="130"
            align="center"
            :label="$t('discount.discount.mobiltyDiagram')"
          >
            <template #default="scope">
              <div class="table-cell-image">
                <ImgShow :src="scope.row.mobilePic" />
              </div>
            </template>
          </el-table-column>

          <!-- 活动开始时间 -->
          <el-table-column
            :label="$t('discount.discount.startTime')"
            prop="activTime"
            align="center"
            width="170"
          >
            <template #default="{ row }">
              <span>{{ row.startTime }}</span>
            </template>
          </el-table-column>
          <!-- 活动结束时间 -->
          <el-table-column
            :label="$t('discount.discount.endTime')"
            prop="activTime"
            align="center"
            width="170"
          >
            <template #default="{ row }">
              <span>{{ row.endTime }}</span>
            </template>
          </el-table-column>
          <!-- 活动类型 -->
          <el-table-column
            :label="$t('discount.discount.typeOfActivity')"
            prop="discountRule"
            align="center"
          >
            <template #default="{ row }">
              <!-- 满钱减钱 -->
              <span
                v-if="row.discountRule === 0"
                class="tag-text"
              >{{ $t('discount.discount.fullMoneoney') }}</span>
              <!-- 满钱打折 -->
              <span
                v-else-if="row.discountRule === 3"
                class="tag-text"
              >{{ $t('discount.discount.fullDiscount') }}</span>
            </template>
          </el-table-column>
          <!-- 状态 -->
          <el-table-column
            :label="$t('table.status')"
            prop="status"
            align="center"
          >
            <template #default="{ row }">
              <span
                v-if="row.status === 0"
                class="tag-text"
              >{{ $t("discount.discount.close") }}</span>
              <span
                v-else-if="row.status === 1"
                class="tag-text"
              >{{ $t("discount.discount.turnOn") }}</span>
              <span
                v-else-if="row.status === 2"
                class="tag-text"
              >违规下架</span>
              <span
                v-else-if="row.status === 3"
                class="tag-text"
              >等待审核</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.actions')"
            align="center"
            width="180"
            class-name="small-padding fixed-width"
          >
            <template #default="{ row }">
              <div class="table-btn-con">
                <!-- 新增、编辑 -->
                <el-button
                  v-permission="['marketing:discount:update']"
                  type="primary"
                  link
                  @click="onAddOrUpdate(row.discountId)"
                >
                  {{ $t("table.edit") }}
                </el-button>
                <!-- 申请上线 -->
                <el-button
                  v-if="row.status === 2"
                  v-permission="['marketing:discount:auditApply']"
                  type="primary"
                  link
                  @click="onOfflineManage(row)"
                >
                  {{ '申请上线' }}
                </el-button>
                <!-- 等待审核 -->
                <el-button
                  v-if="row.status === 3"
                  v-permission="['marketing:discount:waitAudit']"
                  type="primary"
                  link
                  @click="onOfflineManage(row)"
                >
                  {{ '等待审核' }}
                </el-button>
                <!-- 删除 -->
                <el-button
                  v-permission="['marketing:discount:delete']"
                  type="primary"
                  link
                  @click="onDelete(row.discountId)"
                >
                  {{ $t("table.delete") }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页条 -->
      <pagination
        v-show="pageData.total > 0"
        v-model:page="searchForm.pageNum"
        v-model:limit="searchForm.pageSize"
        :total="pageData.total"
        @pagination="getPageData"
      />
    </div>
    <!-- 下架管理 -->
    <offline-manage
      v-if="offlineManageVisible"
      ref="offlineDataRef"
      @on-re-apply-data-submit="onReApplyDataSubmit"
    />
  </div>
</template>

<script setup>
import OfflineManage from '@/components/offline-manage/index.vue'
import * as api from '@/api/discount/discount'
import { ElMessageBox, ElMessage } from 'element-plus'

let tempSearchForm = null // 保存上次点击查询的请求条件

// 头部搜索表单
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  name: null
})

const searchFormRef = ref(null)
const onResetSearch = (formEl) => {
  formEl.resetFields()
}

const pageLoading = ref(true)

const pageData = ref({
  dataList: [],
  total: 0,
  pages: 0
})

const isSubmit = ref(false)
const discountId = ref(null)
const offlineManageVisible = ref(false)

onMounted(() => {
  discountId.value = null
  isSubmit.value = false
  offlineManageVisible.value = false
  getPageData()
})

// 获取数据列表
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

const router = useRouter()
// 新增
const onAddOrUpdate = (id) => {
  router.push({
    path: '/marketing/discount/add-or-update',
    query: {
      discountId: id
    }
  })
}

// 删除
const onDelete = (id) => {
  ElMessageBox.confirm('确定进行[删除]操作?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (isSubmit.value) {
      return
    }
    isSubmit.value = true
    api.deleteById(id).then(() => {
      ElMessage({
        message: '操作成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          getPageData()
        }
      })
      isSubmit.value = false
    }).catch(() => {
      isSubmit.value = false
    })
  })
}

// 下线管理
const onOfflineManage = (row) => {
  offlineManageVisible.value = true
  discountId.value = row.discountId
  getOfflineDetailByCouponId(row.discountId)
}

const offlineDetail = ref(null)
const offlineDataRef = ref(null)
// 获取最新下线的事件
const getOfflineDetailByCouponId = (discountId) => {
  api.getOfflineHandleEvent(discountId).then((data) => {
    offlineDetail.value = data
    nextTick(() => {
      offlineDataRef.value?.init(data)
    })
  })
}

// 提交上架申请
const onReApplyDataSubmit = (data) => {
  const param = {
    handleId: discountId.value,
    eventId: data.eventId,
    reapplyReason: data.reapplyReason // 申请理由
  }
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  api.auditApply(param).then(() => {
    offlineManageVisible.value = false
    ElMessage({
      message: '提交成功',
      type: 'success',
      duration: 1500,
      onClose: () => {
        getPageData()
      }
    })
    isSubmit.value = false
  }).catch(() => {
    isSubmit.value = false
  })
}

</script>
<style lang="scss" scoped>
.page-discount {
  // 页面样式
  display: block;
}
</style>
