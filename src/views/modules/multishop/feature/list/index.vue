<template>
  <div class="app-container-10 container-f0f2f5 app-main feature-list-container">
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        :model="searchForm"
        @submit.prevent
      >
        <el-form-item
          prop="pageName"
          :label="$t('shopFeature.list.pageName')+'：'"
          class="search-form-item"
        >
          <el-input
            v-model="searchForm.pageName"
            link
            :placeholder="$t('shopFeature.list.pageName')"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            class="operation-btn"
            type="primary"
            @click="onSearch()"
          >
            {{ $t('table.search') }}
          </el-button>
          <el-button
            class="operation-btn"
            @click="onResetSearch()"
          >
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="feature-list-content container-fff app-container-15 app-ele-border-radius-0 main-content">
      <el-button
        v-permission="['shop:shopRenovation:saveMove']"
        class="primary-btn"
        type="primary"
        @click="newPageSelect"
      >
        {{ $t('shopFeature.list.newMicroPage') }}
      </el-button>
      <!--微页面列表-->
      <div class="content-box table-con">
        <el-table
          :data="miniPageList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
        >
          <el-table-column
            prop="name"
            :label="$t('shopFeature.list.pageName')"
          >
            <template #default="scope">
              <div>
                {{ scope.row.name }}
                <el-tag
                  v-if="scope.row.homeStatus===1"
                  effect="dark"
                  size="small"
                  style="margin-left: 10px;"
                >
                  {{ $t('shopFeature.list.shopHomePage') }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="createTime"
            :label="$t('shopFeature.list.createTime')"
          />
          <el-table-column
            align="center"
            prop="updateTime"
            :label="$t('shopFeature.list.updateTime')"
          />
          <el-table-column
            align="center"
            width="280"
            :label="$t('shopFeature.list.oper')"
          >
            <template #default="scope">
              <div class="text-btn-con">
                <el-button
                  link
                  type="primary"
                  @click="handleSelect(scope.row)"
                >
                  {{ $t('shopFeature.list.view') }}
                </el-button>
                <el-button
                  v-permission="['shop:shopRenovation:updateMove']"
                  link
                  type="primary"
                  @click="handleEdit(scope.row)"
                >
                  {{ $t('shopFeature.list.edit') }}
                </el-button>
                <el-button
                  v-permission="['shop:shopRenovation:deleteMove']"
                  link
                  type="primary"
                  @click="handleDelete(scope.row)"
                >
                  {{ $t('shopFeature.list.delete') }}
                </el-button>
                <el-button
                  v-permission="['shop:shopRenovation:updateHomeMove']"
                  link
                  type="primary"
                  @click="handleSetHomePage(scope.row.renovationId)"
                >
                  {{ scope.row.homeStatus!==1 ? $t('shopFeature.list.setHomePage'): $t('shopFeature.list.cancelHomePage') }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        style="float: right;"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
      />
    </div>

    <template-select
      v-if="isShowtemplateSelect"
      ref="templateSelectRef"
      @select-template="goCreatePage"
    />
  </div>
</template>

<script setup>
import templateSelect from '../template/components/template-select/index.vue'
import request from '@/utils/request'
import { checkPermission } from '@/directive/permission/index.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import Cookies from 'vue-cookies'
import { getDomain } from '@/utils/index.js'
const vPermission = checkPermission

onMounted(() => {
  getMiniPagesList()
})

const pageIndex = ref(1)
const pageSize = ref(10)
// 每页数
const sizeChangeHandle = (val) => {
  pageSize.value = val
  pageIndex.value = 1
  getMiniPagesList()
}

// 当前页
const currentChangeHandle = (val) => {
  pageIndex.value = val
  getMiniPagesList()
}

const searchForm = reactive({
  pageName: ''
})
const miniPageList = ref([])
const totalPage = ref(0)
/**
 * 获取微页面列表
 */
const getMiniPagesList = () => {
  request({
    url: '/mall4cloud_admin/mp/shop_renovation/page_h5',
    method: 'get',
    params: Object.assign(
      {
        pageNum: pageIndex.value,
        pageSize: pageSize.value,
        renovationType: 2,
        name: searchForm.pageName
      }
    )
  }).then((data) => {
    miniPageList.value = data.list
    totalPage.value = data.total
  })
}

const isShowtemplateSelect = ref(false)
const templateSelectRef = ref(null)
// 选择模板
const newPageSelect = () => {
  isShowtemplateSelect.value = true
  nextTick(() => {
    templateSelectRef.value.init()
  })
}

const router = useRouter()
const domain = getDomain()
const tid = Cookies.get('cloudTid')
/** 跳转编辑页面 */
const goCreatePage = (id) => {
  const obj = {
    type: 'add',
    template: '0',
    ...(Cookies.get(domain) ? {} : { tid })
  }
  if (id > -1) {
    obj.templateId = id
  }
  const newPage = router.resolve({
    path: 'feature-create-edit',
    query: obj
  })
  window.open(newPage.href, '_blank', 'noopener,noreferrer')
}

/** 点击编辑 */
const handleEdit = (item) => {
  const newPage = router.resolve({
    path: 'feature-create-edit',
    query: {
      renovationId: item.renovationId,
      type: 'edit',
      template: '0',
      ...(Cookies.get(domain) ? {} : { tid })
    }
  })
  window.open(newPage.href, '_blank', 'noopener,noreferrer')
}

/** 点击删除 */
const handleDelete = (item) => {
  ElMessageBox.confirm($t('shopFeature.list.deleteTips'), $t('shopFeature.list.tips'), {
    confirmButtonText: $t('shopFeature.edit.confirm'),
    cancelButtonText: $t('shopFeature.edit.cancel'),
    type: 'warning'
  }).then(() => {
    request({
      url: '/mall4cloud_admin/mp/shop_renovation/delete_h5',
      params: {
        renovationId: item.renovationId
      },
      method: 'delete'
    }).then(() => {
      const totalPagePar = Math.ceil((totalPage.value - 1) / pageSize.value)
      const currentPage = pageIndex.value > totalPagePar ? totalPagePar : pageIndex.value
      pageIndex.value = currentPage < 1 ? 1 : currentPage
      ElMessage.success($t('shopFeature.list.deleteSuccess'))
      getMiniPagesList()
    })
  })
}

/**
 * 设置主页
 */
const handleSetHomePage = (renovationId) => {
  request({
    url: '/mall4cloud_admin/mp/shop_renovation/update_h5_home_status',
    params: {
      renovationId
    },
    method: 'put'
  }).then(() => {
    ElMessage.success($t('shopFeature.list.operSuccess'))
    getMiniPagesList()
  })
}

// 查看
const handleSelect = (item) => {
  const newPage = router.resolve({
    path: 'feature-create-edit',
    query: {
      renovationId: item.renovationId,
      type: 'detail',
      ...(Cookies.get(domain) ? {} : { tid })
    }
  })
  window.open(newPage.href, '_blank', 'noopener,noreferrer')
}

const searchFormRef = ref(null)
/**
 * 重置表单
 */
const onResetSearch = () => {
  searchFormRef.value.resetFields()
  getMiniPagesList()
}

const onSearch = () => {
  pageIndex.value = 1
  pageSize.value = 10
  getMiniPagesList()
}

</script>

<style lang="scss" scoped>
@use "index";
</style>
