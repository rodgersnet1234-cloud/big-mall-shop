<template>
  <div class="page-combo app-container">
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
            label-width="100"
            :label="'套餐名称' + ':'"
            prop="name"
          >
            <el-input
              v-model="searchForm.name"
              :placeholder="'套餐名称'"
            />
          </el-form-item>
          <el-form-item
            label-width="100"
            :label="'活动状态' + ':'"
            prop="status"
          >
            <el-select
              v-model="searchForm.status"
              :placeholder="'活动状态'"
            >
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label-width="120"
            :label="'主商品名称' + ':'"
            prop="mainSpuName"
          >
            <el-input
              v-model="searchForm.mainSpuName"
              :placeholder="'主商品名称'"
            />
          </el-form-item>
          <el-form-item
            label-width="140"
            :label="'搭配商品名称' + ':'"
            prop="matchSpuName"
          >
            <el-input
              v-model="searchForm.matchSpuName"
              :placeholder="'搭配商品名称'"
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
          @click="onAddOrUpdate(0, 1)"
        >
          新增
        </el-button>
      </div>
      <!-- 表格 -->
      <div class="table-con">
        <el-table
          v-loading="pageLoading"
          :data="pageData.dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
        >
          <el-table-column
            prop="name"
            :label="'套餐名称'"
          >
            <template #default="scope">
              <span class="table-cell-text line-clamp-one">{{ scope.row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="主商品信息"
            width="320"
          >
            <template #default="{row}">
              <div class="table-cell-con">
                <div class="table-cell-image">
                  <ImgShow :src="row.mainSpuImgUrl" />
                </div>
                <span class="table-cell-text">{{ row.mainSpuName }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="name"
            :label="'商品数量'"
          >
            <template #default="scope">
              <span
                class="table-cell-text line-clamp-one"
              >{{ scope.row.spuCount }}件</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="status"
            :label="'活动状态'"
          >
            <template #default="scope">
              <div class="tag-text">
                {{ ["已失效", "进行中","未开始"][scope.row.status] }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="soldNum"
            :label="'套餐销量'"
          />

          <el-table-column
            prop="price"
            :label="'套餐销售价'"
          >
            <template #default="scope">
              <div>{{ formatPrice(scope.row.price, 1).toFixed(2) }}</div>
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
                  v-if="scope.row.status === 1||scope.row.status === 2"
                  type="primary"
                  link
                  @click="onAddOrUpdate(scope.row.comboId, 1)"
                >
                  编辑
                </el-button>
                <el-button
                  v-if="scope.row.status === 0"
                  type="primary"
                  link
                  @click="onAddOrUpdate(scope.row.comboId, 2)"
                >
                  查看
                </el-button>
                <el-button
                  v-if="scope.row.status === 1"
                  type="primary"
                  link
                  @click="changeStatus(scope.row.comboId, '失效活动', 0)"
                >
                  失效活动
                </el-button>
                <el-button
                  v-if="true"
                  type="primary"
                  link
                  @click="changeStatus(scope.row.comboId, '删除', -1)"
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
        @pagination="getPageData"
      />
    </div>
    <!-- 表格主体end -->
  </div>
</template>

<script setup>
import { formatPrice } from '@/utils'
import * as api from '@/api/combo/combo'
import { ElMessageBox, ElMessage } from 'element-plus'

const statusList = [
  {
    value: 0,
    label: '已失效'
  },
  {
    value: 1,
    label: '进行中'
  },
  {
    value: 2,
    label: '未开始'
  }
]
let tempSearchForm = null // 保存上次点击查询的请求条件

// 头部搜索表单
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  name: '',
  status: null,
  mainSpuName: '',
  matchSpuName: ''
})

// 条件查询
const onSearch = (newData = false) => {
  searchForm.pageNum = 1
  searchForm.pageSize = 10
  getPageData(newData)
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
const getPageData = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = JSON.parse(JSON.stringify(searchForm))
  } else {
    tempSearchForm.pageNum = searchForm.pageNum
    tempSearchForm.pageSize = searchForm.pageSize
  }
  api.page(tempSearchForm).then(res => {
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

// 新增 / 修改
const router = useRouter()
const onAddOrUpdate = (comboId, pageType) => {
  router.push({
    path: '/marketing/combo/add-or-update',
    query: {
      comboId,
      pageType
    }
  })
}

// 改变套餐状态
const changeStatus = (comboId, operDesc, status) => {
  ElMessageBox.confirm('确定进行[' + operDesc + ']操作?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    api.updateComboStatus({ status, comboId }).then(() => {
      ElMessage({
        message: '操作成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          getPageData()
        }
      })
    })
  })
}

</script>
<style lang="scss" scoped>
// 操作按钮容器
.text-btn-con {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
