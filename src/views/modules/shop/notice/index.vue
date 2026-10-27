<template>
  <div class="app-container">
    <!-- 搜索相关区域 -->
    <div
      v-if="!platformNotice"
      class="search-bar"
    >
      <!-- native modifier has been removed, please confirm whether the function has been affected  -->
      <el-form
        :inline="true"
        :model="searchParam"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item label="公告标题：">
            <el-input
              v-model="searchParam.title"
              placeholder="公告标题"
              maxlength="30"
              clearable
            />
          </el-form-item>
          <el-form-item label="公告状态：">
            <el-select
              v-model="searchParam.status"
              clearable
              placeholder="公告状态"
            >
              <el-option
                label="撤销"
                value="0"
              />
              <el-option
                label="公布"
                value="1"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否置顶：">
            <el-select
              v-model="searchParam.isTop"
              clearable
              placeholder="公告是否置顶"
            >
              <el-option
                label="否"
                value="0"
              />
              <el-option
                label="是"
                value="1"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="getPage(true)"
            >
              {{ $t("table.search") }}
            </el-button>
            <el-button
              @click="clearSearchInfo()"
            >
              {{ $t("shop.resetMap") }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <!-- 列表相关区域 -->
    <div
      class="main-content"
      :class="{'top-distance': platformNotice}"
    >
      <div
        v-if="!platformNotice"
        class="operation-bar"
      >
        <el-button
          v-permission="['user:notice:save']"
          type="primary"
          class="filter-item"
          @click="onAddOrUpdate()"
        >
          {{ $t('table.create') }}
        </el-button>
      </div>
      <div class="table-con">
        <el-table
          v-loading="pageLoading"
          :data="pageVO.list"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          highlight-current-row
          style="width: 100%;"
        >
          <!-- 公告标题 -->
          <el-table-column
            :label="$t('multishop.notice.title')"
            prop="title"
            align="center"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.title }}</span>
            </template>
          </el-table-column>
          <!-- 是否置顶 -->
          <el-table-column
            :label="$t('multishop.notice.isTop')"
            prop="isTop"
            align="center"
          >
            <template #default="{row}">
              <span>{{ ['否','是'][row.isTop] }}</span>
            </template>
          </el-table-column>
          <!-- 发布时间 -->
          <el-table-column
            :label="$t('multishop.notice.publishTime')"
            prop="publishTime"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.publishTime || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 状态(1:公布 0:撤回) -->
          <el-table-column
            :label="$t('multishop.notice.status')"
            prop="status"
            align="center"
          >
            <template #default="{row}">
              <span>{{ ['撤销','公布'][row.status] }}</span>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('table.actions')"
            align="center"
            width="230"
            class-name="small-padding fixed-width"
          >
            <template #default="{row}">
              <div class="table-btn-con">
                <el-button
                  v-if="!platformNotice"
                  v-permission="['user:notice:update']"
                  type="primary"
                  link
                  @click="onAddOrUpdate(row.id)"
                >
                  {{ $t('table.edit') }}
                </el-button>
                <el-button
                  v-if="!platformNotice"
                  v-permission="['user:notice:delete']"
                  type="primary"
                  link
                  @click="onDelete(row.id)"
                >
                  {{ $t('table.delete') }}
                </el-button>
                <el-button
                  v-if="platformNotice"
                  type="primary"
                  link
                  @click="toNoticeDetail(row.id)"
                >
                  查看
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页条 -->
    <pagination
      v-show="pageVO.total>0"
      :page="pageQuery.pageNum"
      :limit="pageQuery.pageSize"
      :total="pageVO.total"
      @pagination="getPage()"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getPage()"
    />

    <!-- 公告弹窗 -->
    <el-dialog
      v-model="viewDialog"
      title="平台公告"
      width="30%"
    >
      <p style="text-align: center">
        {{ announcementDetail.title }}
      </p>
      <br>
      <div style="width:100%">
        <div v-rich="announcementDetail.content" />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            @click="viewDialog = false"
          >确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import * as api from '@/api/multishop/notice'
import { ElMessageBox, ElMessage } from 'element-plus'
import AddOrUpdate from './add-or-update.vue'

const addOrUpdateRef = ref(null)
// 是否是平台公告
const platformNotice = ref(null)
const tempSearchForm = ref(null)
const pageLoading = ref(true)
// 查询的参数
const pageQuery = ref({
  pageSize: 10,
  pageNum: 1
})
// 返回参数
const pageVO = ref({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
// 查询参数
const searchParam = ref({
  title: null,
  status: null,
  isTop: null
})
const viewDialog = ref(false) // 公告弹窗
const announcementDetail = ref({}) // 公告详情
const addOrUpdateVisible = ref(false)

onMounted(() => {
  platformNotice.value = useRoute().query.type === 'platform' ? 1 : 0
  if (platformNotice.value === 1) {
    getPlatformPage()
  } else {
    getPage()
  }
})

const getPage = (newData = false) => {
  if (newData || !tempSearchForm.value) {
    tempSearchForm.value = { ...pageQuery.value, ...searchParam.value }
  } else {
    tempSearchForm.value.pageNum = pageQuery.value.pageNum
    tempSearchForm.value.pageSize = pageQuery.value.pageSize
  }
  pageLoading.value = true
  api.page(tempSearchForm.value).then(pageVOs => {
    pageVO.value = pageVOs
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}
const getPlatformPage = () => {
  pageLoading.value = true
  api.platformPage({ ...pageQuery.value, ...searchParam.value }).then(pageVOs => {
    pageVO.value = pageVOs
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}
// 查看公告
const toNoticeDetail = (id) => {
  // noticeData.id = id || 0
  viewDialog.value = true
  nextTick(() => {
    if (id) {
      api.get(id).then(data => {
        data.content = data.content.replace(/<img/g, "<img style='max-width:100%;height:auto;'")
        data.content = data.content.replace(/<p/gi, '<p style="max-width:100% !important;word-wrap:break-word;word-break:break-word;" ')
        announcementDetail.value = data
      })
    }
  })
}
const onAddOrUpdate = (id) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(id)
  })
}
const onDelete = (id) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => deleteById(id))
}
const deleteById = (id) => {
  api.deleteById(id).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => getPage()
    })
  })
}
// 清空搜索内容
const clearSearchInfo = () => {
  searchParam.value.title = null
  searchParam.value.status = null
  searchParam.value.isTop = null
  pageQuery.value.pageNum = 1
  getPage()
}

</script>

<style lang="scss" scoped>
.app-container {
  .main-content.top-distance {
    padding-top: 0;
  }
}
</style>
