<template>
  <div class="page-customizereason">
    <div class="search-bar">
      <!-- native modifier has been removed, please confirm whether the function has been affected  -->
      <el-form
        ref="searchFormRef"
        :inline="true"
        class="search-form"
        :model="searchForm"
        @submit.prevent
      >
        <div class="input-row margin-bottom-none">
          <el-form-item
            prop="reason"
            :label="$t('stock.stockBillReason')+':'"
          >
            <el-input
              v-model="searchForm.reason"
              type="text"
              clearable
              :placeholder="$t('stock.stockBillReasonInputTips')"
            />
          </el-form-item>
          <el-form-item
            :label="$t('stock.stockType')+':'"
            prop="type"
          >
            <el-select
              v-model="searchForm.type"
              clearable
            >
              <el-option
                :label="$t('stock.sendStock')"
                :value="1"
              />
              <el-option
                :label="$t('stock.receiveStock')"
                :value="2"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('stock.sysSet')+':'"
            prop="sysSet"
          >
            <el-select
              v-model="searchForm.sysSet"
              clearable
            >
              <el-option
                label="是"
                :value="1"
              />
              <el-option
                label="否"
                :value="0"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('coupon.coupon.putonStatus')+':'"
            prop="status"
          >
            <el-select
              v-model="searchForm.status"
              clearable
            >
              <el-option
                :label="$t('shop.ena')"
                :value="1"
              />
              <el-option
                label="禁用"
                :value="0"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="text-btn-con">
              <el-button
                type="primary"
                @click="onSearch(true)"
              >
                {{ $t('table.search') }}
              </el-button>
              <el-button
                @click="onResetSearch(searchFormRef)"
              >
                {{ $t('shop.resetMap') }}
              </el-button>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="container">
      <div class="operation-bar">
        <!-- <div v-if="isAuth('multishop:stockReason:add')" class="default-btn primary-btn" @click="onAddOrUpdate()">{{ $t("crud.addTitle") }}</div> -->
        <el-button
          type="primary"
          @click="onAddOrUpdate()"
        >
          {{ $t("stock.addTitle") }}
        </el-button>
      </div>
      <div class="table-con">
        <el-table
          :data="dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
        >
          <el-table-column
            :label="$t('stock.stockBillReason')"
            prop="reason"
          >
            <template #default="scope">
              <span class="table-cell-text line-clamp-one">{{ scope.row.reason || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('stock.stockType')"
            prop="type"
          >
            <template #default="scope">
              <span class="table-cell-text line-clamp-one">{{ scope.row.type === 1 ? '出库' : '入库' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('stock.sysSet')"
            prop="sysSet"
          >
            <template #default="scope">
              <span class="table-cell-text line-clamp-one">{{ scope.row.sysSet ? '是' : '否' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('coupon.coupon.putonStatus')"
            prop="status"
          >
            <template #default="scope">
              <span class="table-cell-text line-clamp-one">{{ scope.row.status === 1 ? '启用' : '禁用' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('stock.remark')"
            prop="remark"
          >
            <template #default="scope">
              <el-tooltip
                class="table-cell-text line-clamp-one"
                effect="dark"
                placement="top"
              >
                <template #content>
                  <div>
                    <div style="max-width:200px">
                      {{ scope.row.remark || '-' }}
                    </div>
                  </div>
                </template>
                <span>{{ scope.row.remark || '-' }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('table.actions')"
            fixed="right"
            width="300"
          >
            <template #default="scope">
              <div class="text-btn-con">
                <!-- <div v-if="isAuth('multishop:stockReason:edit') && !scope.row.sysSet" class="default-btn text-btn" @click="onAddOrUpdate(scope.row.stockChangeReasonId)">{{ $t('crud.editTitle') }}</div>
                <div v-if="isAuth('multishop:stockReason:enable') && scope.row.status === 0" class="default-btn text-btn" @click="changeStatus(scope.row.stockChangeReasonId, 1)">{{ $t('shop.ena') }}</div>
                <div v-if="isAuth('multishop:stockReason:disable') && scope.row.status === 1" class="default-btn text-btn" @click="changeStatus(scope.row.stockChangeReasonId, 0)">{{ $t('publics.disable') }}</div>
                <div v-if="isAuth('multishop:stockReason:delete') && !scope.row.sysSet" class="default-btn text-btn" @click="onDelete(scope.row.stockChangeReasonId, -1)">{{ $t('text.delBtn') }}</div> -->
                <div
                  v-if=" !scope.row.sysSet"
                  class="default-btn text-btn"
                  @click="onAddOrUpdate(scope.row.stockChangeReasonId)"
                >
                  编辑
                </div>
                <div
                  v-if=" scope.row.status === 0"
                  class="default-btn text-btn"
                  @click="changeStatus(scope.row.stockChangeReasonId, 1)"
                >
                  启用
                </div>
                <div
                  v-if=" scope.row.status === 1"
                  class="default-btn text-btn"
                  @click="changeStatus(scope.row.stockChangeReasonId, 0)"
                >
                  禁用
                </div>
                <div
                  v-if=" !scope.row.sysSet"
                  class="default-btn text-btn"
                  @click="onDelete(scope.row.stockChangeReasonId, -1)"
                >
                  删除
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        class="pagination"
        :current-page="page.currentPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="page.pageSize"
        :total="page.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
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
import { ElMessage, ElMessageBox } from 'element-plus'
import AddOrUpdate from '../components/customizereason-add-or-update.vue'
// import http from '@/utils/request'
// import { getPage, putChangeStatus, delCustomizereason } from '@/api/stock/customizereason'
import * as http from '@/api/stock/customizereason'

let tempSearchForm = null // 保存上次点击查询的请求条件

const dataList = ref([])
const page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
})
const searchForm = reactive({
  reason: '', // 原因
  type: '', // 出入库类型
  sysSet: '', // 是否系统内置
  status: '' // 状态
}) // 搜索
const dataListLoading = ref(false)
const addOrUpdateVisible = ref(false)
onMounted(() => {
  getDataList(page)
})

const getDataList = (pageParam, newData = false) => {
  if (page) {
    const size = Math.ceil(page.total / page.pageSize)
    page.currentPage = (page.currentPage > size ? size : page.currentPage) || 1
  }
  dataListLoading.value = true
  if (newData || !tempSearchForm) {
    tempSearchForm = JSON.parse(JSON.stringify(searchForm))
  }
  http.getPage(
    Object.assign(
      {
        pageNum: pageParam == null ? page.currentPage : pageParam.currentPage,
        pageSize: pageParam == null ? page.pageSize : pageParam.pageSize
      },
      tempSearchForm
    )
  ).then((data) => {
    dataList.value = data.list
    page.total = data.total
    dataListLoading.value = false
  })
}
const addOrUpdateRef = ref(null)
// 新增 / 修改
const onAddOrUpdate = (id) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(id, null)
  })
}
const changeStatus = (id, status) => {
  http.putChangeStatus({
    stockChangeReasonId: id,
    status
  }).then(() => {
    ElMessage({
      message: '操作成功',
      type: 'success',
      duration: 1500,
      onClose: () => {
        refreshChange()
      }
    })
  })

  // http({
  //   url: http.adornUrl('/shop/stockChangeReason/changeStatus'),
  //   method: 'put',
  //   params: http.adornParams({
  //     stockChangeReasonId: id,
  //     status: status
  //   })
  // }).then(({ data }) => {
  //   ElMessage({
  //     message: $t('publics.operation'),
  //     type: 'success',
  //     duration: 1500,
  //     onClose: () => {
  //       refreshChange()
  //     }
  //   })
  // })
}
const dataListSelections = ref([])
const onDelete = (id) => {
  const ids = id ? [id] : dataListSelections.value.map(item => {
    return item.stockChangeReasonId
  })
  ElMessageBox.confirm($t('admin.isDeleOper') + '?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // changeStatus(id, -1)
    http.delCustomizereason(id).then(() => {
      ElMessage({
        message: '操作成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          refreshChange()
        }
      })
    })
    page.total = page.total - ids.length
  }).catch(() => {
  })
}
/**
 * 刷新回调
 */
const searchFormRef = ref(null)
const refreshChange = () => {
  onResetSearch(searchFormRef)
  getDataList(page)
}
const onSearch = (newData = false) => {
  getDataList(page, newData)
}
const onPageSizeChange = (val) => {
  page.pageSize = val
  getDataList(page)
}
const onPageChange = (val) => {
  page.currentPage = val
  getDataList(page)
}
const onResetSearch = (formEl) => {
  formEl.resetFields()
}

</script>
<style lang="scss" scoped>
.page-customizereason {
  padding: 20px;

  .search-bar {
    padding: 25px 20px 0;
    margin-bottom: 20px;
    background-color: #F7F8FA;

    .input-row {
      display: block;

    }

  }

  .pagination {
    text-align: right;
  }

}
</style>
