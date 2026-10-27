<template>
  <div class="page-warehouse-manage">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        :model="searchForm"
        label-width="auto"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item
            :label="'仓库名称' + ':'"
            prop="warehouseName"
          >
            <el-input
              v-model="searchForm.warehouseName"
              :placeholder="'输入名称'"
            />
          </el-form-item>
          <el-form-item
            label-width="100"
            :label="'仓库类型' + ':'"
            prop="type"
          >
            <el-select
              v-model="searchForm.type"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label-width="120"
            :label="'管理人' + ':'"
            prop="manage"
          >
            <el-input
              v-model="searchForm.manage"
              :placeholder="'输入管理人'"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSearch(true)"
            >
              搜索
            </el-button>
            <el-button
              @click="onResetSearch(searchFormRef)"
            >
              重置
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 搜索栏end -->
    <!-- 表格主体 -->
    <div class="main main-content">
      <div class="operation-bar">
        <el-button
          type="primary"
          @click="onAddOrUpdate(-1, 1)"
        >
          新增
        </el-button>
      </div>
      <!-- 表格 -->
      <div class="table-con seckill-table">
        <el-table
          v-loading="pageLoading"
          :data="pageData.dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
        >
          <el-table-column
            prop="warehouseName"
            :label="'仓库名称'"
          >
            <template #default="scope">
              <span class="table-cell-text line-clamp-one">{{ scope.row.warehouseName }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="仓库地址"
            width="320"
          >
            <template #default="{row}">
              <div class="table-cell-con">
                <span class="table-cell-text">{{ ((row.province || '') + (row.city || '') + (row.area || '') + (row.address || '')) || '-' }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="manage"
            :label="'管理人'"
          >
            <template #default="scope">
              <span
                class="table-cell-text line-clamp-one"
              >{{ scope.row.manage || '-' }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="phone"
            :label="'管理人电话'"
          >
            <template #default="scope">
              {{ scope.row.phone || '-' }}
            </template>
          </el-table-column>

          <el-table-column
            prop="soldNum"
            :label="'仓库类型'"
          >
            <template #default="scope">
              {{ scope.row.type === 1 ? '区域仓库' : '默认仓库' }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="'操作'"
            width="250"
          >
            <template #default="scope">
              <div class="text-btn-con">
                <el-button
                  type="primary"
                  link
                  @click="onAddOrUpdate(scope.row.warehouseId, scope.row.type)"
                >
                  编辑
                </el-button>
                <el-button
                  type="primary"
                  link
                  @click="onViewInventory(scope.row.warehouseId, scope.row.type)"
                >
                  商品库存
                </el-button>
                <el-button
                  v-if="scope.row.type!==0"
                  type="primary"
                  link
                  @click="onDeleteWarehouse(scope.row.warehouseId)"
                >
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <pagination
        v-show="pageData.total > 0"
        v-model:page="searchForm.pageNum"
        v-model:limit="searchForm.pageSize"
        style="text-align: right"
        :total="pageData.total"
        @pagination="()=>onGetPageData()"
      />
    </div>
    <!-- 表格主体end -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="onGetPageData()"
      @react-add-or-update="onReactAddOrUpdate()"
    />
    <!-- 商品库存 -->
    <prod-inventory
      v-if="prodinventoryVisible"
      ref="prodInventoryRef"
      :stock-point-type="1"
    />
  </div>
</template>

<script setup>
import { ElMessageBox, ElMessage } from 'element-plus'
import * as api from '@/api/stock/warehouse-station.js'
import AddOrUpdate from './add-or-update.vue'

const typeList = [
  {
    value: 0,
    label: '默认仓库'
  },
  {
    value: 1,
    label: '区域仓库'
  }
]
let tempSearchForm = null // 保存上次点击查询的请求条件

// 头部搜索表单
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  warehouseName: '',
  manage: '',
  type: ''
})

// 条件查询
const onSearch = (newData = false) => {
  searchForm.pageNum = 1
  onGetPageData(newData)
}

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

// 获取数据列表
const onGetPageData = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = JSON.parse(JSON.stringify(searchForm))
  } else {
    tempSearchForm.pageNum = searchForm.pageNum
    tempSearchForm.pageSize = searchForm.pageSize
  }
  api.getPageList(tempSearchForm).then(res => {
    pageData.value.dataList = res.list
    pageData.value.pages = res.pages
    pageData.value.total = res.total
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

onMounted(() => {
  onGetPageData()
})

// 新增 / 修改
const addOrUpdateRef = ref(null)
const onAddOrUpdate = (id, type) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(id, type)
  })
}

const addOrUpdateVisible = ref(false)
const onReactAddOrUpdate = () => {
  addOrUpdateVisible.value = false
  onGetPageData()
}

const prodInventoryRef = ref(null)
const prodinventoryVisible = ref(false)
/**
 * 查看仓库的商品库存
 */
const onViewInventory = (id, type) => {
  prodinventoryVisible.value = true
  nextTick(() => {
    prodInventoryRef.value.init(id, type)
  })
}

const onDeleteWarehouse = (warehouseId) => {
  ElMessageBox.confirm('确定进行删除操作' + '?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    api.deleteWarehouse({ warehouseId }).then(() => {
      ElMessage({
        message: '操作成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          onGetPageData()
        }
      })
    })
  }).catch(() => { })
}
</script>
<style lang="scss" scoped>
.page-warehouse-manage {
  padding: 20px;
  // 操作按钮容器
  .text-btn-con {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>
