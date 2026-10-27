<!--
 Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

 https://www.mall4j.com/

 未经允许，不可做商业用途！

 版权所有，侵权必究！
-->
<template>
  <div class="page-attr app-container">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        :model="searchForm"
        @submit.prevent
      >
        <el-form-item
          :label="$t('product.attr.name') + '：'"
          prop="name"
        >
          <el-input
            v-model="searchForm.name"
            :placeholder="$t('product.attr.name')"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSearch"
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
      </el-form>
    </div>
    <div class="main-content">
      <div class="operation-bar">
        <el-button
          v-permission="['product:attr:save']"
          type="primary"
          @click="onAddOrUpdate()"
        >
          {{ $t('table.create') }}
        </el-button>
      </div>
      <!-- 列表相关区域 -->
      <div class="table-con">
        <el-table
          v-loading="pageLoading"
          :data="pageData.dataList"
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
          <!-- 规格名称 -->
          <el-table-column
            :label="$t('product.attr.name')"
            prop="name"
            align="left"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.attrLangList[0].name }}</span>
            </template>
          </el-table-column>
          <!-- 规格值 -->
          <el-table-column
            :label="$t('product.attr.attrValue')"
            prop="attrType"
            align="left"
          >
            <template #default="{row}">
              <div class="table-cell-text">
                {{ row.propValueList.join('/') }}
              </div>
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
                  v-permission="['product:attr:update']"
                  link
                  type="primary"
                  @click="onAddOrUpdate(row.attrId)"
                >
                  {{ $t('table.edit') }}
                </el-button>
                <el-button
                  v-permission="['product:attr:delete']"
                  link
                  type="primary"
                  @click="deleteHandle(row.attrId)"
                >
                  {{ $t('table.delete') }}
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
        style="text-align: right"
        :total="pageData.total"
        @pagination="getPageData"
      />
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <AddOrUpdate
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getPageData"
    />
  </div>
</template>

<script setup>
import { ElMessageBox, ElMessage } from 'element-plus'
import AddOrUpdate from './add-or-update.vue'
import * as api from '@/api/product/attr.js'

// 保存上次点击查询的请求条件
let tempSearchForm = null
// 表单
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  name: '',
  attrType: ''
})
// 点击搜索按钮
const onSearch = () => {
  getPageData(true)
}

const searchFormRef = ref(null)
// 重置表单
const onResetSearch = (formEl) => {
  // if (!formEl) return
  formEl.resetFields()
}

const pageData = ref({
  dataList: [],
  total: 0,
  pages: 0
})

const pageLoading = ref(true)

const getPageData = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...searchForm }
  } else {
    tempSearchForm.pageNum = searchForm.pageNum
    tempSearchForm.pageSize = searchForm.pageSize
  }
  api.page(tempSearchForm).then(res => {
    for (let i = 0; i < res.list.length; i++) {
      const item = res.list[i]
      item.propValueList = []
      item.propValueEnList = []
      for (let j = 0; j < item.attrValues.length; j++) {
        const element = item.attrValues[j]
        item.propValueList.push(element.value)
        if (element.values[1]) {
          item.propValueEnList.push(element.values[1].value)
        }
      }
    }
    pageData.value.dataList = res.list
    pageData.value.pages = res.pages
    pageData.value.total = res.total
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

onMounted(() => {
  getPageData()
})

const addOrUpdateVisible = ref(false)
const addOrUpdateRef = ref(null)
const onAddOrUpdate = (attrId) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value.init(attrId)
  })
}

const deleteHandle = (attrId) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => deleteById(attrId))
}
const deleteById = (attrId) => {
  api.deleteById(attrId).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => getPageData()
    })
  })
}
</script>
<style lang="scss" scoped>
.page-attr {
  .search-bar {
    padding-bottom: 6px !important;
  }
}
</style>
