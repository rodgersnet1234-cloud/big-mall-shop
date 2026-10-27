<template>
  <div class="template-list">
    <el-button
      v-permission="['shop:shopTemplate:savePC']"
      type="primary"
      @click="goCreatePage"
    >
      {{ $t('shopFeature.template.newTemplate') }}
    </el-button>
    <el-button
      @click="getMiniPageList"
    >
      {{ $t('shopFeature.template.refresh') }}
    </el-button>
    <div
      class="main-container"
      style="display: block;margin: 0 !important;"
    >
      <div
        v-if="templateList.length"
        style="display: flex;flex-wrap: wrap;"
      >
        <div
          v-for="(item, index) in templateList"
          :key="index"
          class="card-item"
        >
          <div class="template-item">
            <ImgShow
              :src="item.image"
            />
            <div class="operation is-active">
              <div
                v-permission="['shop:shopTemplate:deletePC']"
                class="operation-item"
                @click="handleDelete(item.templateId)"
              >
                <el-icon><Delete /></el-icon>{{ $t('shopFeature.template.delete') }}
              </div>
              <div
                v-permission="['shop:shopTemplate:updatePC']"
                class="operation-item"
                @click="copyTemplatePage(item.templateId)"
              >
                <el-icon><CopyDocument /></el-icon>{{ $t('shopFeature.template.copy') }}
              </div>
              <div
                v-permission="['shop:shopTemplate:copyPC']"
                class="operation-item"
                @click="handleEdit(item.templateId)"
              >
                <el-icon><EditPen /></el-icon>{{ $t('shopFeature.template.edit') }}
              </div>
            </div>
          </div>
          <div class="title">
            {{ item.name }}
          </div>
        </div>
      </div>
      <el-empty
        v-else
        class="empty-form"
        description="暂无数据"
      />
    </div>

    <div style="clear: both;" />
    <el-pagination
      v-if="templateList.length"
      style="margin-right: 5%"
      :current-page="perProps.pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="perProps.pageSize"
      :total="perProps.total"
      layout="->,total, sizes, prev, pager, next, jumper"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
    />
  </div>
</template>

<script setup>
import request from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus'
import { checkPermission } from '@/directive/permission/index.js'
import Cookies from 'vue-cookies'
import { getDomain } from '@/utils/index.js'
const vPermission = checkPermission
const templateList = ref([]) // 列表页
const perProps = ref({
  pageNum: 1, // 当前页
  pageSize: 10, // 每页显示多少条
  total: 0 // 总数
})

onMounted(() => {
  // 获取微页面列表
  getMiniPageList()
})
// 获取微页面列表
const getMiniPageList = () => {
  const { pageNum, pageSize } = perProps.value
  request({
    url: '/mall4cloud_admin/mp/shop_template/page',
    methods: 'get',
    params: {
      pageNum, // 当前页
      pageSize, // 每页显示多少条
      type: 1 // 1表示pc端，2表示移动端
    }
  }).then((data) => {
    templateList.value = data.list
    perProps.value.total = data.total
  })
}
// 复制模板
const copyTemplatePage = (templateId) => {
  request({
    url: '/mall4cloud_admin/mp/shop_template/copy_pc',
    params: {
      templateId
    },
    method: 'post'
  }).then(() => {
    ElMessage.success($t('shopFeature.template.copySuccess'))
    getMiniPageList()
  })
}
// 新建微页面
const router = useRouter()
const tid = Cookies.get('cloudTid')
const domain = getDomain()
const goCreatePage = () => {
  // 跳转到装修页面
  const newPage = router.resolve({
    path: 'decorate-create-edit',
    query: {
      type: 'add',
      template: '1',
      ...(Cookies.get(domain) ? {} : { tid })
    }
  })
  window.open(newPage.href, '_blank', 'noopener,noreferrer')
}
// 每页数
const sizeChangeHandle = (val) => {
  perProps.value.pageSize = val
  getMiniPageList()
}
// 当前页
const currentChangeHandle = (val) => {
  perProps.value.pageNum = val
  getMiniPageList()
}
// 编辑
const handleEdit = (templateId) => {
  const newPage = router.resolve({
    path: 'decorate-create-edit',
    query: {
      templateId,
      type: 'edit',
      template: '1',
      ...(Cookies.get(domain) ? {} : { tid })
    }
  })
  window.open(newPage.href, '_blank', 'noopener,noreferrer')
}
// 删除
const handleDelete = (renovationId) => {
  ElMessageBox.confirm($t('shopFeature.list.deleteTips'), $t('shopFeature.list.tips'), {
    confirmButtonText: $t('shopFeature.edit.confirm'),
    cancelButtonText: $t('shopFeature.edit.cancel'),
    type: 'warning'
  }).then(() => {
    request({
      url: '/mall4cloud_admin/mp/shop_template/delete_pc',
      params: {
        templateId: renovationId
      },
      method: 'delete'
    }).then(() => {
      const totalPage = Math.ceil((perProps.value.total - 1) / perProps.value.pageSize)
      const currentPage = perProps.value.pageNum > totalPage ? totalPage : perProps.value.pageNum
      perProps.value.pageNum = currentPage < 1 ? 1 : currentPage
      ElMessage.success($t('shopFeature.list.deleteSuccess'))
      getMiniPageList()
    })
  })
}

</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
