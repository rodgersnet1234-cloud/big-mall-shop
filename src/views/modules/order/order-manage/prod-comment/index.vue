<template>
  <div class="page-prod-comment app-container">
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        class="search-form"
        :model="searchForm"
        label-width="auto"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item
            prop="spuName"
            label="商品名称:"
          >
            <el-input
              v-model="searchForm.spuName"
              type="text"
              placeholder="商品名称"
            />
          </el-form-item>
          <el-form-item
            prop="nickName"
            label="用户昵称:"
          >
            <el-input
              v-model="searchForm.nickName"
              type="text"
              placeholder="用户昵称"
            />
          </el-form-item>
          <el-form-item
            prop="stationName"
            label="门店名称:"
          >
            <el-input
              v-model="searchForm.stationName"
              type="text"
              placeholder="门店名称"
            />
          </el-form-item>
          <el-form-item label="记录时间:">
            <el-date-picker
              v-model="recDateRange"
              type="datetimerange"
              :range-separator="'至'"
              value-format="YYYY-MM-DD HH:mm:ss"
              :start-placeholder="'开始时间'"
              :end-placeholder="'结束时间'"
              :default-time="defaultTime"
            />
          </el-form-item>
          <el-form-item label="回复时间:">
            <el-date-picker
              v-model="replyDateRange"
              type="datetimerange"
              :range-separator="'至'"
              value-format="YYYY-MM-DD HH:mm:ss"
              :start-placeholder="'开始时间'"
              :end-placeholder="'结束时间'"
              :default-time="defaultTime"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="filter-item"
              @click="onSearch(true)"
            >
              搜索
            </el-button>
            <el-button
              @click="onResetSearch"
            >
              重置
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="main-content">
      <div class="table-con">
        <el-table
          ref="prodCommTableRef"
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
        >
          <el-table-column
            align="left"
            prop="spuName"
            label="商品名称"
            width="360"
          >
            <template #default="scope">
              <div class="table-cell-con">
                <div class="table-cell-image">
                  <ImgShow
                    :src="scope.row.spuImg"
                    :img-style="{width:'60px',height:'60px'}"
                  />
                </div>
                <span class="table-cell-text">{{ scope.row.spuName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="stationName"
            label="门店名称"
            width="200"
          >
            <template #default="scope">
              <span
                class="table-cell-text"
              >{{ scope.row.stationName || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="nickName"
            label="用户昵称"
          >
            <template #default="scope">
              <span v-if="scope.row.isAnonymous">匿名用户</span>
              <span
                v-else
                class="table-cell-text"
              >{{ scope.row.nickName || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="score"
            label="评价得分"
          />
          <el-table-column
            align="left"
            prop="isAnonymous"
            label="是否匿名"
          >
            <template #default="scope">
              <div class="tag-text">
                {{ ['否', '是'][scope.row.isAnonymous] }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="createTime"
            label="记录时间"
            width="250"
          >
            <template #default="scope">
              <div>{{ scope.row.createTime || '-' }}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="replyTime"
            label="回复时间"
            width="250"
          >
            <template #default="scope">
              <div>{{ scope.row.replyTime || '-' }}</div>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            label="操作"
            width="200"
          >
            <template #default="{row}">
              <el-button
                v-permission="['prod:prodComm:update']"
                type="primary"
                link
                @click="onAddOrUpdate(row.spuCommId,true)"
              >
                编辑
              </el-button>
              <el-button
                type="primary"
                link
                @click="onAddOrUpdate(row.spuCommId,false)"
              >
                查看
              </el-button>
              <el-button
                v-permission="['prod:prodComm:delete']"
                type="primary"
                link
                @click="onDelete(row.spuCommId)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="pagination-box">
      <pagination
        v-show="pageData.total > 0"
        v-model:page="searchForm.pageNum"
        v-model:limit="searchForm.pageSize"
        style="text-align: right"
        :total="pageData.total"
        @pagination="onGetDataList"
      />
    </div>
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="refreshChange"
    />
  </div>
</template>

<script setup>
import AddOrUpdate from './add-or-update.vue'
import * as api from '@/api/product/prod-comm'
import { ElMessage, ElMessageBox } from 'element-plus'

const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59)
]
const recDateRange = ref([])
const replyDateRange = ref([])
const dataList = ref([])
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  spuName: '',
  stationName: '',
  nickName: ''
})
const pageData = ref({
  total: 0,
  pages: 0
})
onMounted(() => {
  onGetDataList()
})

let tempSearchForm = null // 保存上次点击查询的请求条件
const dataListLoading = ref(false)
const onGetDataList = (newData = false) => {
  dataListLoading.value = true
  if (newData || !tempSearchForm) {
    tempSearchForm = JSON.parse(JSON.stringify(searchForm))
  } else {
    tempSearchForm.pageNum = searchForm.pageNum
    tempSearchForm.pageSize = searchForm.pageSize
  }
  api.page({
    ...tempSearchForm
  }).then(data => {
    dataList.value = data.list
    pageData.value.pages = data.pages
    pageData.value.total = data.total
  })
}

// 新增 / 修改
const addOrUpdateRef = ref()
const addOrUpdateVisible = ref(false)
const onAddOrUpdate = (id, isEdit) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(id, isEdit)
  })
}

const onDelete = (spuCommId) => {
  ElMessageBox.confirm($t('admin.isDeleOper') + '?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    api.deleteById(spuCommId).then(() => {
      ElMessage({
        message: '操作成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          refreshChange()
        }
      })
    })
  }).catch(() => { })
}

// 刷新回调用
const refreshChange = () => {
  onGetDataList()
}

const onSearch = (newData = false) => {
  searchForm.pageNum = 1
  searchForm.pageSize = 10
  onGetDataList(newData)
}

// 重置表单
const searchFormRef = ref()
const onResetSearch = () => {
  searchFormRef.value.resetFields()
  replyDateRange.value = []
  recDateRange.value = []
  onGetDataList(true)
}

</script>

<style lang="scss" scoped>
.page-prod-comment {
  .search-bar {
    background-color: #F7F8FA;
    .input-row {
      display: block;
    }
  }
  .pagination-box{
    text-align: right;
    padding: 20px 0;
  }
}
</style>
