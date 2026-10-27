<template>
  <div class="app-container page-popup-ad">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        :inline="true"
        :model="searchForm"
        class="demo-form-inline"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item label="弹窗名称">
            <el-input
              v-model="searchForm.popupName"
              placeholder="弹窗名称"
              clearable
            />
          </el-form-item>
          <!-- status 表示状态  1.未开始 2.投放中 3.已结束 -->
          <el-form-item label="弹窗状态">
            <el-select
              v-model="searchForm.status"
              placeholder="弹窗状态"
              clearable
            >
              <el-option
                label="未开始"
                value="1"
              />
              <el-option
                label="投放中"
                value="2"
              />
              <el-option
                label="已结束"
                value="3"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSearch()"
            >
              {{ $t('table.search') }}
            </el-button>
            <el-button
              @click="onReset()"
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
          v-permission="['multishop:popup:save']"
          type="primary"
          class="filter-item"
          @click="onAddOrUpdate()"
        >
          新增弹窗
        </el-button>
      </div>
      <div class="table-con">
        <el-table
          v-loading="pageLoading"
          :data="dataList"
          row-key="popupId"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%;"
        >
          <!-- 图片 -->
          <el-table-column
            label="弹窗名称"
            prop="popupName"
            align="center"
            width="300"
          />
          <!-- 顺序 -->
          <el-table-column
            label="开始时间"
            prop="startTime"
            align="center"
          />
          <el-table-column
            label="结束时间"
            prop="endTime"
            align="center"
          />
          <!-- 状态 -->
          <el-table-column
            label="弹窗状态"
            prop="status"
            align="center"
          >
            <template #default="{row}">
              <span>{{ ['','未开始','投放中','已结束'][row.status] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.actions')"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template #default="{row}">
              <el-button
                v-if="row.status !== 3"
                v-permission="['multishop:popup:update']"
                link
                type="primary"
                @click="onAddOrUpdate(row.popupId,1)"
              >
                {{ $t('table.edit') }}
              </el-button>
              <el-button
                v-if="row.status === 3"
                v-permission="['multishop:popup:view']"
                link
                type="primary"
                @click="onAddOrUpdate(row.popupId,2)"
              >
                查看
              </el-button>
              <el-button
                v-if="row.status !== 3"
                v-permission="['multishop:popup:invalid']"
                link
                type="primary"
                @click="onSetInvalid(row.popupId)"
              >
                失效活动
              </el-button>
              <el-button
                v-permission="['multishop:popup:delete']"
                link
                type="primary"
                @click="onDelete(row.popupId)"
              >
                {{ $t('table.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 分页条 -->
    <div class="pagination-box">
      <el-pagination
        :current-page="page.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="page.pageSize"
        :total="page.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
      />
    </div>
  </div>
</template>

<script setup>
import * as api from '@/api/popup-ad/index.js'
import { ElMessageBox, ElMessage } from 'element-plus'

// 查询的参数
const searchForm = reactive({
  popupName: null,
  status: null
})
let tempSearchForm = null
const page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
})

onMounted(() => {
  getDataList()
})

const dataList = ref([])
const pageLoading = ref(true)
const getDataList = (newData = false) => {
  pageLoading.value = true
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...searchForm }
  }
  api.page({
    ...tempSearchForm,
    pageNum: page.currentPage,
    pageSize: page.pageSize
  }).then(data => {
    pageLoading.value = false
    dataList.value = data.list
    page.total = data.total
  }).catch(() => {
    pageLoading.value = false
  })
}

const router = useRouter()
const onAddOrUpdate = (popupId, pageType) => {
  router.push({
    path: 'feature-popup-ad/add-or-update',
    query: {
      popupId,
      pageType
    }
  })
}

// 失效弹窗
const onSetInvalid = (popupId) => {
  ElMessageBox.confirm($t('确定进行失效操作?'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    api.setInvalid(popupId).then(() => {
      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 1500,
        onClose: () => getDataList()
      })
    })
  }).catch()
}

// 删除
const onDelete = (popupId) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    api.deleteById(popupId).then(() => {
      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 1500,
        onClose: () => {
          if (dataList.value.length === 1 && page.currentPage > 1) {
            page.currentPage--
          }
          getDataList()
        }
      })
    })
  }).catch()
}

// 查询
const onPageSizeChange = (val) => {
  page.pageSize = val
  getDataList()
}
const onPageChange = (val) => {
  page.currentPage = val
  getDataList()
}

const onSearch = () => {
  page.currentPage = 1
  getDataList(true)
}
const onReset = () => {
  searchForm.popupName = null
  searchForm.status = null
}

</script>

<style lang="scss" scoped>
.page-popup-ad{
  .pagination-box{
    display: flex;
    justify-content: flex-end;
  }
}
</style>
