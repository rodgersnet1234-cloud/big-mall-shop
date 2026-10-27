<template>
  <div class="app-container page-index-img">
    <!-- 搜索相关区域 -->
    <div class="main-content">
      <!-- 搜索相关区域 -->
      <div class="search-bar">
        <!-- native modifier has been removed, please confirm whether the function has been affected  -->
        <el-form
          :inline="true"
          :model="pageQuery"
          @submit.prevent
        >
          <div class="input-row">
            <el-form-item label="用户端：">
              <el-select
                v-model="pageQuery.imgType"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="getPage()"
              >
                {{ $t("table.search") }}
              </el-button>
              <el-button
                @click="clearSearchInfo()"
              >
                {{ $t("shop.resetMap") }}
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>

      <div class="operation-bar">
        <el-button
          v-permission="['user:indexImg:save']"
          type="primary"
          class="filter-item"
          @click="onAddOrUpdate()"
        >
          {{ $t('table.create') }}
          <el-tooltip
            class="item"
            effect="dark"
            content="每个用户端的最大轮播图数量为10"
            placement="top"
          >
            <el-icon><WarningFilled /></el-icon>
          </el-tooltip>
        </el-button>
      </div>

      <!-- 列表相关区域 -->
      <div class="table-con">
        <el-table
          v-loading="pageLoading"
          :data="pageVO.list"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          row-key="imgId"
          highlight-current-row
          style="width: 100%;"
        >
          <!-- 图片 -->
          <el-table-column
            label="图片"
            prop="imgUrl"
            align="center"
          >
            <template #default="{row}">
              <div class="table-cell-image index-img-lun">
                <ImgShow
                  :src="row.imgUrl"
                  :class-list="['img']"
                />
              </div>
            </template>
          </el-table-column>
          <!-- 顺序 -->
          <el-table-column
            label="顺序"
            prop=""
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.seq }}</span>
            </template>
          </el-table-column>
          <!-- 状态 -->
          <el-table-column
            label="状态"
            prop="status"
            align="center"
          >
            <template #default="{row}">
              <span
                v-if="row.status === 0"
                type="danger"
              >{{ $t("product.category.offline") }}</span>
              <span
                v-else
              >{{ $t("product.category.normal") }}</span>
            </template>
          </el-table-column>
          <!-- 平台 -->
          <el-table-column
            label="用户端"
            prop="icon"
            align="center"
          >
            <template #default="{row}">
              <span>{{ ['移动端', 'PC端'][row.imgType] }}</span>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column
            :label="$t('table.actions')"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template #default="{row}">
              <div class="table-btn-con">
                <el-button
                  v-permission="['user:indexImg:update']"
                  type="primary"
                  link
                  @click="onAddOrUpdate(row.imgId)"
                >
                  {{ $t('table.edit') }}
                </el-button>
                <el-button
                  v-permission="['user:indexImg:delete']"
                  type="primary"
                  link
                  @click="onDelete(row.imgId)"
                >
                  {{ $t('table.delete') }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页条 -->
    <pagination
      v-show="pageVO.total>0"
      v-model:page="pageQuery.pageNum"
      v-model:limit="pageQuery.pageSize"
      :total="pageVO.total"
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
import * as api from '@/api/multishop/index-img.js'
import { ElMessageBox, ElMessage } from 'element-plus'
import AddOrUpdate from './components/add-or-update.vue'

// 查询的参数
const pageQuery = reactive({
  pageSize: 10,
  pageNum: 1,
  name: null,
  attrType: null,
  imgType: ''
})
// 返回参数
const pageVO = reactive({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
// loading
const pageLoading = ref(true)
const addOrUpdateVisible = ref(false)
const options = reactive([{
  value: 1,
  label: 'PC端'
}, {
  value: 0,
  label: '移动端'
}])

onMounted(() => {
  getPage()
})

const getPage = () => {
  pageLoading.value = true
  api.page({ ...pageQuery }).then(data => {
    Object.assign(pageVO, data)
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

const addOrUpdateRef = ref('')
const onAddOrUpdate = (imgId) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value.init(imgId)
  })
}

const onDelete = (imgId) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => deleteById(imgId))
}

const deleteById = (imgId) => {
  api.deleteById(imgId).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => getPage()
    })
  })
}

// 清空搜索内容
const clearSearchInfo = () => {
  pageQuery.imgType = ''
}
</script>

<style lang="scss" scoped>
.app-container.page-index-img{
  .main-content {
    padding-top: 0;
    .index-img-lun {
      width: 130px;
    }

    .operation-bar {
      margin-top: 20px;
    }
  }
}
</style>
