<!--
 Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

 https://www.mall4j.com/

 未经允许，不可做商业用途！

 版权所有，侵权必究！
-->
<template>
  <div class="page-platform-notice">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <!-- native modifier has been removed, please confirm whether the function has been affected  -->
      <el-form
        ref="searchFormRef"
        :inline="true"
        :model="searchForm"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item
            :label="$t('multishop.notice.title') + '：'"
            prop="title"
          >
            <el-input
              v-model="searchForm.title"
              :placeholder="$t('multishop.notice.title')"
              maxlength="20"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('multishop.notice.publishTime')+ '：'"
          >
            <el-date-picker
              v-model="dateRange"
              type="datetimerange"
              :range-separator="$t('date.tip')"
              value-format="YYYY-MM-DD HH:mm:ss"
              :start-placeholder="$t('date.start')"
              :end-placeholder="$t('date.end')"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="loadSearchParam()"
            >
              {{ $t('table.search') }}
            </el-button>
            <el-button
              plain
              @click="onResetSearch(searchFormRef)"
            >
              {{ $t('table.reset') }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-content">
      <!-- 列表相关区域 -->
      <div class="table-con">
        <el-table
          v-loading="pageLoading.value"
          :data="pageVO.list"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%;"
        >
          <el-table-column
            type="index"
            align="left"
            :label="$t('table.id')"
            width="100"
          />
          <el-table-column
            :label="$t('multishop.notice.title')"
            prop="title"
            align="left"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="publishTime"
            :label="$t('multishop.notice.publishTime')"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.publishTime }}</span>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column
            :label="$t('table.actions')"
            align="center"
            width="230"
            class-name="small-padding fixed-width"
          >
            <template #default="{row}">
              <div class="table-btn-con">
                <el-button
                  v-permission="['notify:platformNotify:view']"
                  type="primary"
                  link
                  @click="onAddOrUpdate(row.id)"
                >
                  {{ $t('table.view') }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页条 -->
      <pagination
        v-show="pageVO.total>0"
        v-model:page="searchParam.pageNum"
        v-model:limit="searchParam.pageSize"
        style="text-align: right"
        :total="pageVO.total"
        @pagination="getPage()"
      />
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <AddOrUpdate
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getPage()"
    />
  </div>
</template>

<script setup>
import Pagination from '@/components/Pagination/index.vue'
import AddOrUpdate from './add-or-update.vue'
import * as api from '@/api/notify/notify'

const pageLoading = ref(true)
const pageVO = ref({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
const searchParam = reactive({
  pageSize: 10,
  pageNum: 1,
  title: '',
  startTime: null,
  endTime: null
})
// 表单
const searchForm = reactive({
  title: ''
})
const searchFormRef = ref(null)
const addOrUpdateVisible = ref(false)
const addOrUpdateRef = ref(null)
const dateRange = ref([])
const loadSearchParam = () => {
  searchParam.pageNum = 1
  searchParam.title = searchForm.title
  searchParam.startTime = dateRange.value === null ? null : dateRange.value[0] // 开始时间
  searchParam.endTime = dateRange.value === null ? null : dateRange.value[1] // 结束时间
  getPage()
}
const getPage = () => {
  pageLoading.value = true
  api.page(searchParam).then(res => {
    pageVO.value.list = res.list
    pageVO.value.pages = res.pages
    pageVO.value.total = res.total
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

// 重置表单
const onResetSearch = formName => {
  formName.resetFields()
  dateRange.value = []
}

const onAddOrUpdate = (id) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value.init(id)
  })
}

onMounted(() => {
  getPage()
})
</script>
<style lang="scss" scoped>
.page-platform-notice{
  padding: 20px;
  background: #fff;
  .search-bar {
    padding-bottom: 6px !important;
  }

}
</style>
