<!--
 Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

 https://www.mall4j.com/

 未经允许，不可做商业用途！

 版权所有，侵权必究！
-->
<template>
  <div class="page-rbac">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        :model="searchForm"
        class="demo-form-inline"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item
            label="角色名称："
            prop="roleName"
          >
            <el-input
              v-model="searchForm.roleName"
              placeholder="输入角色名称"
              maxlength="30"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="getPage(true)"
            >
              {{ $t("table.search") }}
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

    <!-- 列表相关区域 -->
    <div class="main-content">
      <div class="operation-bar">
        <el-button
          v-permission="['rbac:role:save']"
          type="primary"
          class="filter-item"
          @click="onAddOrUpdate()"
        >
          {{ $t("table.create") }}
        </el-button>
      </div>
      <div class="table-con">
        <el-table
          ref="roleTableRef"
          v-loading="pageLoading"
          :data="pageData.list"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
          @selection-change="selectionChange"
        >
          <!-- 角色名称 -->
          <el-table-column
            :label="$t('rbac.role.roleName')"
            prop="roleName"
            align="center"
          >
            <template #default="{ row }">
              <span class="table-cell-text">{{ row.roleName }}</span>
            </template>
          </el-table-column>
          <!-- 备注 -->
          <el-table-column
            :label="$t('rbac.role.remark')"
            prop="remark"
            align="center"
          >
            <template #default="{ row }">
              <span class="table-cell-text">{{ row.remark ? row.remark : '-' }}</span>
            </template>
          </el-table-column>
          <!-- 创建时间 -->
          <el-table-column
            :label="$t('table.createTime')"
            prop="createTime"
            align="center"
          >
            <template #default="{ row }">
              <span>{{ row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.actions')"
            align="center"
            width="230"
            class-name="small-padding fixed-width"
          >
            <template #default="{ row }">
              <div class="table-btn-con">
                <el-button
                  v-permission="['rbac:role:update']"
                  type="primary"
                  link
                  @click="onAddOrUpdate(row.roleId)"
                >
                  {{ $t("table.edit") }}
                </el-button>
                <el-button
                  v-permission="['rbac:role:delete']"
                  type="primary"
                  link
                  @click="onDelete(row.roleId)"
                >
                  {{ $t("table.delete") }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页条 -->
    <pagination
      v-show="pageData.total > 0"
      v-model:page="searchForm.pageNum"
      v-model:limit="searchForm.pageSize"
      style="text-align: right"
      :total="pageData.total"
      @pagination="getPage()"
    />
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
import * as api from '@/api/rbac/role'
import { ElMessage, ElMessageBox } from 'element-plus'

// loading
const pageLoading = ref(true)
const searchFormRef = ref(null)
const selectAll = ref(false)
const dataListSelections = ref([])
// 返回参数
const pageData = ref({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
// 查询的参数
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1
})

// 保存上次点击查询的请求条件
let tempSearchForm = null

const addOrUpdateVisible = ref(false)
const addOrUpdateRef = ref(null)

onMounted(() => {
  getPage()
})
const getPage = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...searchForm }
  } else {
    tempSearchForm.pageNum = searchForm.pageNum
    tempSearchForm.pageSize = searchForm.pageSize
  }
  pageLoading.value = true
  api.page(tempSearchForm).then(res => {
    pageData.value.list = res.list
    pageData.value.pages = res.pages
    pageData.value.total = res.total
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

const onAddOrUpdate = (roleId) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value.init(roleId)
  })
}

const onDelete = (roleId) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => deleteById(roleId))
}

const deleteById = (roleId) => {
  api.deleteById(roleId).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => getPage()
    })
  })
}

// 清空搜索内容
const onResetSearch = (formEl) => {
  // if (!formEl) return
  formEl.resetFields()
}

// 多选变化
const selectionChange = (val) => {
  dataListSelections.value = val
  selectAll.value = val.length === pageData.value.list.length
}

</script>

<style lang="scss" scoped>
.page-rbac{
  padding: 20px;
}
.search-bar {
  padding-bottom: 6px !important;
}
</style>
