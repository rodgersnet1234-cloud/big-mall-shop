<template>
  <div class="page-giveaway app-container">
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
            prop="name"
            label-width="100"
            label="活动名称:"
          >
            <el-input
              v-model="searchForm.name"
              placeholder="活动名称"
            />
          </el-form-item>
          <el-form-item
            prop="spuName"
            label-width="120"
            label="主商品名称:"
          >
            <el-input
              v-model="searchForm.spuName"
              placeholder="主商品名称"
            />
          </el-form-item>
          <el-form-item
            prop="giveawaySpuName"
            label-width="100"
            label="赠品名称:"
          >
            <el-input
              v-model="searchForm.giveawaySpuName"
              placeholder="赠品名称"
            />
          </el-form-item>
          <el-form-item
            prop="status"
            label-width="100"
            label="活动状态:"
          >
            <el-select
              v-model="searchForm.status"
              placeholder="活动状态"
            >
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSearch(true)"
            >
              搜索
            </el-button>
            <el-button @click="onResetSearch(searchFormRef)">
              重置
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 搜索栏end -->
    <!-- 表格主体 -->
    <div class="operation-bar">
      <el-button
        v-permission="['marketing:giveaway:add']"
        type="primary"
        @click="onAddOrUpdate(0, 1)"
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
          prop="name"
          label="活动名称"
        >
          <template #default="scope">
            <span class="table-cell-text line-clamp-one">{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="主商品信息"
          prop="reason"
          width="320px"
        >
          <template #default="scope">
            <div class="table-cell-con">
              <div class="table-cell-image">
                <ImgShow
                  :src="scope.row.mainImgUrl"
                  :img-style="{width:'60px',height:'60px'}"
                />
              </div>
              <span class="table-cell-text">{{ scope.row.spuName }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="status"
          label="活动状态"
        >
          <template #default="scope">
            <div class="tag-text">
              {{ ['已失效', '进行中', '未开启']
                [scope.row.status] }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="startTime"
          label="生效时间"
        />

        <el-table-column
          prop="endTime"
          label="失效时间"
        />

        <el-table-column
          align="center"
          label="操作"
          width="250"
        >
          <template #default="scope">
            <el-button
              v-if="scope.row.status === 1 || scope.row.status === 2"
              v-permission="['marketing:giveaway:edit']"
              type="primary"
              link
              @click="onAddOrUpdate(scope.row.giveawayId, 1)"
            >
              编辑
            </el-button>
            <el-button
              v-if="scope.row.status === 0"
              type="primary"
              link
              @click="onAddOrUpdate(scope.row.giveawayId, 2)"
            >
              查看
            </el-button>
            <el-button
              v-if="scope.row.status === 1"
              v-permission="['marketing:giveaway:close']"
              type="primary"
              link
              @click="changeStatus(scope.row.giveawayId, '失效活动', 0)"
            >
              失效活动
            </el-button>
            <el-button
              v-permission="['marketing:giveaway:delete']"
              type="primary"
              link
              @click="changeStatus(scope.row.giveawayId, '删除', -1)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <pagination
      v-show="pageData.total > 0"
      v-model:page="searchForm.pageNum"
      v-model:limit="searchForm.pageSize"
      style="text-align:right"
      :total="pageData.total"
      @pagination="getPageData()"
    />
  </div>
  <!-- 表格主体end -->
</template>

<script setup>
import * as api from '@/api/giveaway/giveaway'
import { ElMessageBox, ElMessage } from 'element-plus'

let tempSearchForm = null // 保存上次点击查询的请求条件

const pageData = ref({
  dataList: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})

// 头部搜索表单
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  name: null,
  spuName: null,
  status: null,
  giveawaySpuName: null
})

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
    label: '未开启'
  }
]
const pageLoading = ref(false)

onMounted(() => {
  getPageData()
})

// 获取数据列表
const getPageData = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...searchForm }
  } else {
    tempSearchForm.pageNum = searchForm.pageNum
    tempSearchForm.pageSize = searchForm.pageSize
  }
  pageLoading.value = true
  api.page(tempSearchForm).then(data => {
    pageData.value.dataList = data.list
    pageData.value.pages = data.pages
    pageData.value.total = data.total
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

// 新增 / 修改
const router = useRouter()
const onAddOrUpdate = (giveawayId, pageType) => {
  router.push({
    path: '/marketing/giveaway/add-or-update',
    query: {
      giveawayId,
      pageType
    }
  })
}

// 改变赠品状态
const changeStatus = (giveawayId, operDesc, status) => {
  ElMessageBox.confirm('确定进行[' + operDesc + ']操作?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const obj = {
        status,
        giveawayId
      }
      api.changeStatus(obj).then(() => {
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

</script>
<style lang="scss" scoped>
.operation-bar {
  margin: 20px 0;
}
.table-con {
  // 图片 + 文本
  .table-cell-con {
    display: flex;
    align-items: center;
    .table-cell-image {
      margin-right: auto;
      width: 60px;
      height: 60px;
    }
    .table-cell-text {
      flex: 1;
      margin-left: 10px;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      word-break: break-word;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 20px;
    }
  }
}
</style>
