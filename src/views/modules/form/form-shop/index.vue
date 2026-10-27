<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form
        :inline="true"
        :model="pageQuery"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item label="报表名称：">
            <el-input
              v-model="pageQuery.formName"
              link
              clearable
              placeholder="输入报表名称"
            />
          </el-form-item>
          <el-form-item label="报表类型：">
            <el-select
              v-model="pageQuery.timeType"
              clearable
              placeholder="报表类型"
            >
              <el-option
                v-for="item in reportType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="getPage(true)"
            >
              {{ $t('table.search') }}
            </el-button>
            <el-button
              @click="clearSearchInfo()"
            >
              {{ $t('table.reset') }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="main-content">
      <div class="operation-bar">
        <el-button
          v-permission="['shop:form:save']"
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
          :data="pageVO.list"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%"
          highlight-current-row
          row-key="formId"
        >
          <el-table-column
            type="index"
            label="序号"
            fixed
            width="80"
          />
          <el-table-column
            label="报表名称"
            prop="formName"
          />
          <el-table-column
            prop="updateTime"
            label="更新时间"
          />
          <el-table-column label="报表类型">
            <template #default="scope">
              <span v-if="scope.row.timeType === 1">{{ '天' }}</span>
              <span v-if="scope.row.timeType === 2">{{ '周' }}</span>
              <span v-if="scope.row.timeType === 3">{{ '月' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            :label="$t('table.actions')"
            width="200"
          >
            <template #default="scope">
              <div class="text-btn-con">
                <el-button
                  v-permission="['shop:form:update']"
                  type="primary"
                  link
                  @click="onAddOrUpdate(`${scope.row.formId}`)"
                >
                  {{ $t("table.edit") }}
                </el-button>
                <el-button
                  v-permission="['shop:form:excel']"
                  type="primary"
                  link
                  @click="getFormExcel(scope.row)"
                >
                  {{ $t("table.export") }}
                </el-button>
                <el-button
                  v-if="scope.row.formId > 0"
                  v-permission="['shop:form:delete']"
                  type="primary"
                  link
                  @click="onDelete(`${scope.row.formId}`)"
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
        v-show="pageVO.total > 0"
        v-model:page="pageQuery.pageNum"
        v-model:limit="pageQuery.pageSize"
        :total="pageVO.total"
        @pagination="getPage()"
      />
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getPage()"
    />
  </div>
</template>

<script setup>
import AddOrUpdate from '../components/form-add-or-update/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import * as api from '@/api/form/form.js'
import { ElMessage, ElMessageBox } from 'element-plus'

// 查询的参数
const pageQuery = reactive({
  pageSize: 10,
  pageNum: 1,
  timeType: null,
  formName: ''
})
const reportType = [
  {
    label: '天',
    value: 1
  }, {
    label: '周',
    value: 2
  }, {
    label: '月',
    value: 3
  }
]

let isSubmit = false
onMounted(() => {
  isSubmit = false
  getPage()
})

const pageLoading = ref(false)
// 返回参数
const pageVO = ref({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
let tempSearchForm = null // 保存上次点击查询的请求条件
// 获取数据列表
const getPage = (newData = false) => {
  pageLoading.value = true
  pageVO.value.list = []
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...pageQuery }
  } else {
    tempSearchForm.pageSize = pageQuery.pageSize
    tempSearchForm.pageNum = pageQuery.pageNum
  }
  api.page(tempSearchForm).then(pageVOPar => {
    pageVO.value = pageVOPar
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

const addOrUpdateVisible = ref(false)
const addOrUpdateRef = ref(null)
// 新增 / 修改
const onAddOrUpdate = (id) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(id)
  })
}
// 删除
const onDelete = (id) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'),
    {
      confirmButtonText: $t('table.confirm'),
      cancelButtonText: $t('table.cancel'),
      type: 'warning'
    }).then(() => {
    if (isSubmit) {
      return
    }
    isSubmit = true
    api.deleteById(id).then(() => {
      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 1500,
        onClose: () => getPage()
      })
      isSubmit = false
    }).catch(() => {
      isSubmit = false
    })
  })
}
// 清空搜索内容
const clearSearchInfo = () => {
  pageQuery.formName = ''
  pageQuery.timeType = null
}
const getFormExcel = (form) => {
  ElMessageBox.confirm($t('table.sureToExport'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    if (isSubmit) {
      return
    }
    isSubmit = true
    api.formExcel(form.formId).then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
      const fileName = form.formName + '.xlsx'
      const elink = document.createElement('a')
      if ('download' in elink) { // 非IE下载
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName)
      }
      isSubmit = false
    }).catch((e) => {
      ElMessage.error(e)
      isSubmit = false
    })
  })
}

</script>
