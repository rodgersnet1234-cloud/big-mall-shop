<template>
  <div class="components-seckill-detail app-container mod-seckill-detail">
    <!-- 新的秒杀页 -->
    <div class="top-container">
      <div class="title">
        {{ startTime }}场次 结束时间:{{ endTime }}
      </div>
    </div>

    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        :model="searchForm"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item
            label="商品名称"
            prop="keyword"
          >
            <el-input
              v-model="searchForm.keyword"
              placeholder="请输入商品名称"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="getPageData()"
            >
              查询
            </el-button>
            <el-button
              @click="onResetSearch"
            >
              {{ $t("shop.resetMap") }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-content">
      <div class="operation-bar">
        <el-button
          v-if="canJoin === '1'"
          type="primary"
          class="filter-item"
          @click="onAddOrUpdate()"
        >
          {{ $t("table.create") }}
        </el-button>
      </div>
      <div class="table-con">
        <el-table
          v-loading="pageLoading"
          :data="pageData.dataList"
          highlight-current-row
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%;"
        >
          <!-- 商品信息 -->
          <el-table-column
            :label="$t('product.prodInfo')"
            min-width="200"
          >
            <template #default="{row}">
              <div class="table-cell-con">
                <div class="table-cell-image">
                  <ImgShow :src="row.mainImgUrl" />
                </div>
                <span class="table-cell-text">{{ row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="seckillOriginStocks"
            label="秒杀总库存"
          />
          <el-table-column
            align="center"
            prop="priceFee"
            label="销售价"
          />
          <el-table-column
            align="center"
            prop="categoryName"
            label="分类"
          />
          <el-table-column
            align="center"
            prop="seckillTotalStocks"
            label="现有库存"
          />
          <el-table-column
            align="center"
            prop="maxNum"
            label="限购数量"
          >
            <template #default="{row}">
              <span v-if="row.maxNum !== -1">{{ row.maxNum }}</span>
              <span v-else-if="!row.maxNum || row.maxNum === -1">不限</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="seckillPrice"
            label="抢购价"
          />
          <el-table-column
            :label="$t('seckill.status')"
            prop="status"
            align="center"
          >
            <!-- 秒杀状态(0:未启用、1:启用、2:违规下架、3:等待审核) -->
            <template #default="{row}">
              <span
                v-if="row.status === 0"
                class="tag-text"
              >
                {{ $t("seckill.invalidated") }}
              </span>
              <span
                v-else-if="row.status === 1"
                class="tag-text"
              >{{
                $t("seckill.open")
              }}</span>
              <span
                v-else-if="row.status === 2"
                class="tag-text"
              >{{
                $t("table.platformDown")
              }}</span>
              <span
                v-else-if="row.status === 3"
                class="tag-text"
              >{{
                $t("table.waitReview")
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
          >
            <template #default="{row}">
              <div class="table-btn-con">
                <el-button
                  type="primary"
                  link
                  @click="onAddOrUpdate(row.seckillId)"
                >
                  {{ $t("table.view") }}
                </el-button>
                <el-button
                  v-if="row.status === 1"
                  type="primary"
                  link
                  @click="invalidHandle(row)"
                >
                  {{ $t("seckill.invalidActivity") }}
                </el-button>
                <el-button
                  v-if="row.status > 1"
                  type="primary"
                  link
                  @click="auditEventHandle(row.seckillId)"
                >
                  {{
                    row.status === 2
                      ? $t("table.applyForListing")
                      : $t("table.waitReview")
                  }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!--  秒杀设置 -->
    <!-- 分页条 -->
    <pagination
      v-show="pageData.total !== null && pageData.total>0"
      v-model:page="searchForm.pageNum"
      v-model:limit="searchForm.pageSize"
      :total="pageData.total"
      @pagination="getPageData()"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getPageData()"
    />
    <!-- 下架管理 -->
    <offline-manage
      v-if="operateDialogVisible"
      ref="offlineDataRef"
      @on-re-apply-data-submit="onReApplyDataSubmit"
    />
  </div>
</template>

<script setup>
import OfflineManage from '@/components/offline-manage/index.vue'
import AddOrUpdate from '../add-or-update.vue'
import Big from 'big.js'
import * as api from '@/api/seckill/seckill.js'
import { ElMessageBox, ElMessage } from 'element-plus'

const pageLoading = ref(true)
const addOrUpdateVisible = ref(false)
const operateDialogVisible = ref(false)
// 返回参数
const pageData = ref({
  dataList: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
// 查询的参数
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  keyword: '',
  startTimestamp: null
})
const startTime = ref(null)
const endTime = ref(null)
const canJoin = ref(0)

const router = useRouter()
onMounted(() => {
  if (!useRoute().query.startTime) {
    ElMessageBox.confirm('当前秒杀场次不存在！', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error',
      showClose: false,
      showCancelButton: false
    }).then(() => {
      router.replace({
        path: '/marketing/seckill'
      })
    })
    return
  }
  searchForm.startTimestamp = useRoute().query.startTime
  const startDate = new Date(Number(useRoute().query.startTime))
  canJoin.value = useRoute().query.canJoin
  const endDate = new Date(Number(useRoute().query.endTime))
  startTime.value = dateFormat('YYYY-mm-dd HH:MM', startDate)
  endTime.value = dateFormat('YYYY-mm-dd HH:MM', endDate)
  getPageData()
})

const isSubmit = ref(false)
const getPageData = () => {
  isSubmit.value = false
  pageLoading.value = true
  api.listSeckillSpuByTime({ ...searchForm }).then(data => {
    pageData.value.dataList = data.list
    pageData.value.pages = data.pages
    pageData.value.total = data.total
    pageLoading.value = false
    if (pageData.value.dataList) {
      pageData.value.dataList.forEach(data => {
        data.priceFee = new Big(data.priceFee).div(100).toFixed(2)
        data.seckillPrice = new Big(data.seckillPrice).div(100).toFixed(2)
      })
    }
  }).catch(() => {
    pageLoading.value = false
  })
}
// 新增 / 修改
const addOrUpdateRef = ref(null)
const onAddOrUpdate = (id) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(id, startTime.value, endTime.value)
  })
}
/**
 * 提交上架申请
 */
const groupActivityId = ref(null)
const onReApplyDataSubmit = (data) => {
  const param = {
    handleId: groupActivityId.value,
    eventId: data.eventId,
    reapplyReason: data.reapplyReason // 申请理由
  }
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  api.auditApply(param).then(() => {
    operateDialogVisible.value = false
    ElMessage({
      message: '提交成功',
      type: 'success',
      duration: 1000,
      onClose: () => getPageData()
    })
    isSubmit.value = false
  }).catch(() => {
    isSubmit.value = false
  })
}

const invalidHandle = (seckill) => {
  ElMessageBox.confirm($t('group.sureToInvalidate'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    if (isSubmit.value) {
      return
    }
    isSubmit.value = true
    api.invalid(seckill.seckillId).then(() => {
      isSubmit.value = false
      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 1500,
        onClose: () => {
          getPageData()
        }
      })
      getPageData()
    })
  }).catch(() => {
    isSubmit.value = false
  })
}

const searchFormRef = ref(null)
const onResetSearch = () => {
  searchFormRef.value.resetFields()
  getPageData()
}

const dateFormat = (fmt, date) => {
  let ret
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }
  for (const k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
    }
  }
  return fmt
}

// 下线管理
const offlineDataRef = ref(null)
const auditEventHandle = (id) => {
  operateDialogVisible.value = true
  groupActivityId.value = id
  api.getOfflineHandleEvent(id).then((data) => {
    nextTick(() => {
      offlineDataRef.value?.init(data)
    })
  })
}

</script>
<style lang="scss" scoped>
.mod-seckill-detail {
  .top-container {
    .title {
      margin-bottom: 15px;
      font-weight: 600;
    }
  }
}
</style>
