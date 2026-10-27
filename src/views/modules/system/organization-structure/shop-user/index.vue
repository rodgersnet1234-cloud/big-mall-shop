<!--
 Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

 https://www.mall4j.com/

 未经允许，不可做商业用途！

 版权所有，侵权必究！
-->
<template>
  <div class="page-shop-user">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :model="pageQuery"
        :inline="true"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item
            :label="'昵称' + '：'"
            prop="nickName"
          >
            <el-input
              v-model="pageQuery.nickName"
              :placeholder="'输入昵称'"
              maxlength="30"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('multishop.shopUser.phoneNum') + '：'"
            prop="phoneNum"
          >
            <el-input
              v-model="pageQuery.phoneNum"
              :placeholder="'输入联系方式'"
              maxlength="11 "
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
          v-permission="['multishop:shopUser:save']"
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
          :data="pageData.list"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
          @selection-change="selectionChange"
        >
          <!-- 用户名 -->
          <el-table-column
            :label="$t('multishop.shopUser.username')"
            prop="username"
            align="center"
            width="240"
          >
            <template #default="{ row }">
              <div :class="{ 'name-cell': row.isAdmin === 1 }">
                <div class="table-cell-text">
                  {{ row.username }}
                </div>
                <div
                  v-if="row.isAdmin === 1"
                  class="super-admin-tab"
                >
                  （超级管理员）
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- 昵称 -->
          <el-table-column
            :label="$t('multishop.shopUser.nickName')"
            prop="nickName"
            align="center"
            width="200"
          >
            <template #default="{ row }">
              <span class="table-cell-text">{{ row.nickName }}</span>
            </template>
          </el-table-column>
          <!-- 员工编号 -->
          <el-table-column
            :label="$t('multishop.shopUser.code')"
            prop="code"
            align="center"
          >
            <template #default="{ row }">
              <span class="table-cell-text">{{ row.code || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 手机号码 -->
          <el-table-column
            :label="$t('multishop.shopUser.mobileNumber')"
            prop="phoneNum"
            align="center"
          >
            <template #default="{ row }">
              <span>{{ row.phoneNum }}</span>
            </template>
          </el-table-column>
          <!-- 状态 -->
          <el-table-column
            :label="$t('multishop.shopUser.status')"
            prop="status"
            align="center"
          >
            <template #default="{ row }">
              <span v-if="row.status === 1">启用</span>
              <span v-if="row.status === 0">禁用</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.actions')"
            align="center"
            width="150"
            class-name="small-padding fixed-width"
          >
            <template #default="{ row }">
              <div class="table-btn-con">
                <el-button
                  v-permission="['multishop:shopUser:update']"
                  type="primary"
                  link
                  @click="onAddOrUpdate(row.shopUserId)"
                >
                  {{ $t("table.edit") }}
                </el-button>
                <el-button
                  v-if="row.isAdmin !== 1"
                  v-permission="['multishop:shopUser:delete']"
                  type="primary"
                  link
                  @click="onDelete(row.shopUserId)"
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
      v-model:page="pageQuery.pageNum"
      v-model:limit="pageQuery.pageSize"
      style="text-align: right"
      :total="pageData.total"
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
import AddOrUpdate from './add-or-update.vue'
import * as api from '@/api/multishop/shop-user'
import { ElMessage, ElMessageBox } from 'element-plus'

// 查询的参数
const pageQuery = reactive({
  pageSize: 10,
  pageNum: 1,
  phoneNum: '',
  nickName: ''
})
// 返回参数
const pageData = reactive({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})

const pageLoading = ref(true)
const searchFormRef = ref(null)
const selectAll = ref(false)
const dataListSelections = ref([])
// 保存上次点击查询的请求条件
let tempSearchForm = null

onMounted(() => {
  getPage()
})

const getPage = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...pageQuery }
  } else {
    tempSearchForm.pageNum = pageQuery.pageNum
    tempSearchForm.pageSize = pageQuery.pageSize
  }
  pageLoading.value = true
  api.page(tempSearchForm).then(res => {
    pageData.list = res.list
    pageData.pages = res.pages
    pageData.total = res.total
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

const addOrUpdateRef = ref(null)
const addOrUpdateVisible = ref(false)
const onAddOrUpdate = (supplierUserId) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value.init(supplierUserId)
  })
}
const onDelete = (supplierUserId) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => deleteById(supplierUserId))
}

const deleteById = (supplierUserId) => {
  api.deleteById(supplierUserId).then(() => {
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
  formEl.resetFields()
}

// 多选变化
const selectionChange = (val) => {
  dataListSelections.value = val
  selectAll.value = val.length === pageData.length
}

</script>

<style lang="scss" scoped>
.page-shop-user {
  padding: 20px;
  .name-cell {
    display: flex;
    align-items: center;
    justify-content: center;

    .table-cell-text {
      max-width: 45%;
    }

    .super-admin-tab {
      color: #ff4949;
    }
  }

  .search-bar {
    padding-bottom: 6px !important;
  }
}
</style>
