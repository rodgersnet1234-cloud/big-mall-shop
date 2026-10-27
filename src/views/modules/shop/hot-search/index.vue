<template>
  <div class="app-container component-hot-search ">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        :inline="true"
        :model="pageQuery"
        @submit.prevent
      >
        <el-form-item label="热搜标题：">
          <el-input
            v-model="pageQuery.title"
            placeholder="热搜标题"
            maxlength="360"
          />
        </el-form-item>
        <el-form-item label="热搜内容：">
          <el-input
            v-model="pageQuery.content"
            placeholder="热搜内容"
          />
        </el-form-item>
        <el-form-item label="启用状态：">
          <el-select
            v-model="pageQuery.status"
            placeholder="启用状态"
            clearable
          >
            <el-option
              label="启用"
              value="1"
            />
            <el-option
              label="未启用"
              value="0"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="getSearchList(true)"
          >
            {{ $t('table.search') }}
          </el-button>
          <el-button
            @click="clearSearchInfo()"
          >
            {{ $t("shop.resetMap") }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 主要内容 -->
    <div class="main-content">
      <div class="operation-bar">
        <el-button
          v-permission="['user:hotSearch:save']"
          type="primary"
          class="filter-item"
          @click="onAddOrUpdate()"
        >
          {{ $t('table.create') }}
        </el-button>
      </div>
      <!-- 列表相关区域 -->
      <div class="table-con">
        <el-table
          v-loading="pageLoading"
          :data="pageVO.list"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%;"
        >
          <!-- 热搜标题 -->
          <el-table-column
            :label="$t('multishop.hotSearch.title')"
            prop="title"
            align="left"
            width="180"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.title }}</span>
            </template>
          </el-table-column>
          <!-- 内容 -->
          <el-table-column
            :label="$t('multishop.hotSearch.content')"
            prop="content"
            align="left"
            width="180"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.content }}</span>
            </template>
          </el-table-column>
          <!-- 创建时间 -->
          <el-table-column
            :label="$t('multishop.hotSearch.createDate')"
            prop="createTime"
            align="center"
            width="180"
          >
            <template #default="{row}">
              <span>{{ row.createTime }}</span>
            </template>
          </el-table-column>
          <!-- 顺序 -->
          <el-table-column
            :label="$t('multishop.hotSearch.seq')"
            prop="seq"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.seq }}</span>
            </template>
          </el-table-column>
          <!-- 状态 0下线 1上线 -->
          <el-table-column
            :label="$t('multishop.hotSearch.status')"
            prop="status"
            align="center"
          >
            <template #default="{row}">
              <span
                v-if="row.status === 0"
              >{{ '未启用' }}</span>
              <span v-else>{{ '启用' }}</span>
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
                  v-permission="['user:hotSearch:update']"
                  type="primary"
                  link
                  @click="onAddOrUpdate(row.hotSearchId)"
                >
                  {{ $t('table.edit') }}
                </el-button>
                <el-button
                  v-permission="['user:hotSearch:delete']"
                  type="primary"
                  link
                  @click="onDelete(row.hotSearchId)"
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
      v-show="pageVO.total>0"
      v-model:current-page="pageQuery.pageNum"
      v-model:page-size="pageQuery.pageSize"
      :total="pageVO.total"
      @pagination="getPage()"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getPage()"
    />
  </div>
</template>

<script setup>
import Pagination from '@/components/Pagination/index.vue'
import AddOrUpdate from './components/add-or-update.vue'
import * as api from '@/api/multishop/hot-search'
import { ElMessageBox, ElMessage } from 'element-plus'

let tempSearchForm = ''
const pageQuery = reactive({
  pageSize: 10,
  pageNum: 1,
  title: null,
  content: null,
  status: null
})
// 返回参数
const pageVO = reactive({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
// loading
const pageLoading = ref(true)
// 查询参数
const searchParam = {}
const addOrUpdateVisible = ref(false)
onMounted(() => {
  getPage()
})

const getPage = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...pageQuery, ...searchParam }
  } else {
    tempSearchForm.pageNum = pageQuery.pageNum
    tempSearchForm.pageSize = pageQuery.pageSize
  }
  pageLoading.value = true
  api.page(tempSearchForm).then(data => {
    Object.assign(pageVO, data)
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

const addOrUpdateRef = ref('')
const onAddOrUpdate = (hotSearchId) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value.init(hotSearchId)
  })
}

const onDelete = (hotSearchId) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => deleteById(hotSearchId))
}

const deleteById = (hotSearchId) => {
  api.deleteById(hotSearchId).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => getPage()
    })
  })
}

const getSearchList = (newData = false) => {
  pageQuery.pageNum = 1
  // 若请求参数某项没值，则不传此参数
  pageQuery.title = pageQuery.title || null
  pageQuery.content = pageQuery.content || null
  pageQuery.status = pageQuery.status || null
  getPage(newData)
}

const clearSearchInfo = () => {
  // 若请求参数某项没值，则不传此参数
  pageQuery.title = null
  pageQuery.content = null
  pageQuery.status = null
}
</script>
