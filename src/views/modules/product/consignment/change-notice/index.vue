<template>
  <div class="chang-noticve">
    <!-- 商品列表 -->
    <el-table
      ref="multipleTableRef"
      v-loading="loading"
      class="table"
      :data="dataList"
      tooltip-effect="dark"
      header-cell-class-name="table-header"
      @selection-change="onSelectSome"
    >
      <el-table-column
        label="商品信息"
        min-width="200px"
      >
        <template #default="{row}">
          <div class="prod-info">
            <ImgShow
              :src="row.mainImgUrl"
            />
            <span>{{ row.spuName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="spuCode"
        label="SPU编码"
        width="130"
      >
        <template #default="{row}">
          <span>{{ row.spuCode || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="supplierName"
        label="供应商"
      />
      <el-table-column
        label="变更内容"
        min-width="200px"
      >
        <template #default="{row:list}">
          <div class="change-content">
            {{ list.contentKey }}
            <span>{{ list.contentValue || '-' }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        width="250"
        prop="updateTime"
        label="变更时间"
      />
      <el-table-column
        label="操作"
        min-width="110"
      >
        <!--          class="table-operation"-->
        <template
          #default="{row}"
        >
          <el-button
            v-permission="['prod:saleProxyInform:info']"
            type="primary"
            link
            @click="onSeeClick(row.spuId)"
          >
            查看
          </el-button>
          <el-button
            v-permission="['prod:saleProxyInform:edit']"
            type="primary"
            link
            @click="onToReleaseProdPage(row)"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="pagination"
      :current-page="pageQuery.pageNum"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pageQuery.pageSize"
      layout="->,total, sizes, prev, pager, next, jumper"
      :total="pageQuery.total"
      @size-change="onPageSizeChange"
      @current-change="onPageChange"
    />

    <!-- 查看商品详细 -->
    <operation-info ref="operationInfoRef" />
  </div>
</template>

<script setup>
import * as http from '@/api/consignment/change-notice.js'
import { ElMessage } from 'element-plus'
import operationInfo from './operation-info.vue'
// 商品列表
const dataList = ref([])

// 分页查询
const pageQuery = reactive({
  pageSize: 10,
  pageNum: 1,
  total: 0
})
const loading = ref(false) // 表单加载状态

onMounted(() => {
  doGetDataList()
})

// 获取通知列表
const doGetDataList = () => {
  loading.value = true
  http.getPage({
    pageNum: pageQuery.pageNum,
    pageSize: pageQuery.pageSize
  }).then(data => {
    if (!data) return
    pageQuery.total = data.total
    dataList.value = data.list
  }).finally(() => {
    loading.value = false
  })
}
const operationInfoRef = ref(null)
// 查看详细
const onSeeClick = (spuId) => {
  operationInfoRef.value.init(spuId)
}
const commonStore = useCommonStore()
const router = useRouter()
// 跳转发布商品页
const onToReleaseProdPage = (row) => {
  /* 判断是否拥有权限 */
  const routeList = commonStore.routeList
  let flag = 0
  routeList.forEach(item => {
    if (item.children) {
      item.children.forEach(el => {
        if (el.path === '/product/manage' && el.children) {
          el.children.forEach(element => {
            if (element.path === 'prod-info') {
              flag = 1
            }
          })
        }
      })
    }
  })
  if (!flag) {
    return ElMessage.error('您暂时没有权限访问')
  }

  if (row.spuId === -1) {
    router.push('/product/manage/prod-info')
  } else {
    router.push({
      path: '/product/manage/prod-info',
      query: {
        spuId: row.commissionSpuId,
        postingSteps: 2
      }
    })
  }
}

const onSelectSome = (e) => {
}
const onPageSizeChange = (val) => {
  pageQuery.pageSize = val
  pageQuery.pageNum = 1
  doGetDataList()
}
const onPageChange = (val) => {
  pageQuery.pageNum = val
  doGetDataList()
}

</script>

<style lang="scss" scoped>
  .chang-noticve{
    margin: 20px;
    font-weight: 400;
    .table{
      margin:20px 0 ;
      overflow-x: auto;
      // min-width: 1100px;
    }
    .prod-info{
      display: flex;
      flex-flow: nowrap;
      align-items: center;
      &>:deep(img){
        margin-right: 12px;
        width: 60px !important;
        height: 60px !important;
        object-fit: contain;
      }
      &>span{
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
    }

    .change-content{
      &>span{
        margin-right: 10px;
        color: #999999 ;
      }
    }
  }
</style>
