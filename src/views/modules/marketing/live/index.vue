<template>
  <div class="page-live-room app-container">
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
            :label="$t('live.liveName')+':'"
          >
            <el-input
              v-model="searchForm.name"
              type="text"
              :placeholder="$t('live.liveName')"
            />
          </el-form-item>
          <el-form-item
            prop="nickName"
            :label="$t('live.anchorName')+':'"
          >
            <el-input
              v-model="searchForm.nickName"
              type="text"
              :placeholder="$t('live.anchorName')"
            />
          </el-form-item>
          <el-form-item
            prop="liveStatus"
            :label="$t('live.liveStatus')+':'"
          >
            <el-select
              v-model="searchForm.liveStatus"
              :placeholder="$t('live.liveStatus')"
            >
              <el-option
                :label="$t('live.liveing')"
                :value="1"
              />
              <el-option
                :label="$t('live.noStart')"
                :value="0"
              />
              <el-option
                :label="$t('live.over')"
                :value="2"
              />
              <el-option
                :label="$t('live.banned')"
                :value="-1"
              />
              <el-option
                :label="$t('live.pause')"
                :value="3"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('live.broadcastTime')+':'"
            prop="dateRange"
          >
            <el-date-picker
              v-model="dateRange"
              type="datetimerange"
              range-separator="至"
              value-format="YYYY-MM-DD HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="defaultTime"
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
              {{ $t('shop.resetMap') }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main main-content">
      <div class="operation-bar">
        <el-button
          v-permission="['marketing:liveRoom:save']"
          type="primary"
          @click="onAddOrUpdate()"
        >
          新增
        </el-button>
      </div>
      <div class="table-con live-room-table">
        <el-table
          :data="pageData.dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
        >
          <el-table-column
            align="left"
            prop="name"
            :label="$t('live.liveName')"
            min-width="260"
          >
            <template #default="scope">
              <span class="table-cell-text line-clamp-one">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="nickName"
            :label="$t('live.anchorName')"
            min-width="200"
          >
            <template #default="scope">
              <span class="table-cell-text line-clamp-one">{{ scope.row.nickName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="userMobile"
            :label="$t('live.anchorMobile')"
            min-width="180"
          />
          <el-table-column
            align="left"
            prop="liveStatus"
            :label="$t('live.liveStatus')"
            min-width="120"
          >
            <template #default="scope">
              <span
                v-if="scope.row.liveStatus === 1"
                class="tag-text"
              >{{ $t("live.liveing") }}</span>
              <span
                v-if="scope.row.liveStatus === 0"
                class="tag-text"
              >{{
                $t("live.noStart")
              }}</span>
              <span
                v-if="scope.row.liveStatus === 2"
                class="tag-text"
              >{{
                $t("live.over")
              }}</span>
              <span
                v-if="scope.row.liveStatus === -1"
                class="tag-text"
              >{{
                $t("live.banned")
              }}</span>
              <span
                v-if="scope.row.liveStatus === 3"
                class="tag-text"
              >{{
                $t("live.pause")
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            :label="$t('live.liveStartTime')"
            min-width="160"
          >
            <template #default="scope">
              {{ getParseTime(scope.row.startTime, '{y}-{m}-{d} {h}:{i}') }}
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            :label="$t('live.liveEndTime')"
            min-width="160"
          >
            <template #default="scope">
              {{ getParseTime(scope.row.endTime, '{y}-{m}-{d} {h}:{i}') }}
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            label="操作"
            min-width="230"
          >
            <template #default="scope">
              <div class="text-btn-con">
                <el-button
                  v-if="scope.row.liveStatus !== 0 && scope.row.liveStatus !== 3"
                  v-permission="['marketing:liveRoom:get']"
                  type="primary"
                  link
                  @click="onAddOrUpdate(scope.row)"
                >
                  {{ $t("table.view") }}
                </el-button>
                <el-button
                  v-if="scope.row.liveStatus === 0 || scope.row.liveStatus === 3"
                  v-permission="['marketing:liveRoom:update']"
                  type="primary"
                  link
                  @click="onAddOrUpdate(scope.row)"
                >
                  {{ $t("table.edit") }}
                </el-button>
                <el-button
                  v-if="scope.row.liveStatus === -1"
                  type="primary"
                  link
                  @click="getOfflineRemark(scope.row.remark)"
                >
                  {{ $t('live.reasonForOffline') }}
                </el-button>
                <el-button
                  v-if="scope.row.liveStatus !== 1"
                  v-permission="['marketing:liveRoom:delete']"
                  type="primary"
                  link
                  @click="onDelete(scope.row.roomId)"
                >
                  {{ $t('table.delete') }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页条 -->
      <pagination
        v-show="pageData.total>0"
        v-model:page="searchForm.pageNum"
        v-model:limit="searchForm.pageSize"
        :total="pageData.total"
        @pagination="getPageData()"
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
import { ElMessageBox, ElMessage } from 'element-plus'
import AddOrUpdate from './add-or-update.vue'
import * as api from '@/api/live/index'
import { getParseTime } from '@/utils/datetime.js'

let tempSearchForm = null // 保存上次点击查询的请求条件
const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59)
]
// 返回参数
const pageData = ref({
  dataList: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
const searchFormRef = ref(null)
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  name: '',
  nickName: '',
  liveStatus: '',
  roomTop: '',
  startTime: '',
  endTime: ''
})
const pageLoading = ref(false)
const dateRange = ref([])
const addOrUpdateVisible = ref(false)

onMounted(() => {
  getPageData()
})
const getPageData = (newData = false) => {
  if (newData || !tempSearchForm) {
    searchForm.startTime = dateRange.value === null ? null : dateRange.value[0] // 开始时间
    searchForm.endTime = dateRange.value === null ? null : dateRange.value[1] // 结束时间
    tempSearchForm = { ...searchForm }
  } else {
    tempSearchForm.pageNum = searchForm.pageNum
    tempSearchForm.pageSize = searchForm.pageSize
  }
  api.getLiveRoomPage(tempSearchForm).then((data) => {
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
const onAddOrUpdate = (data) => {
  router.push({
    path: '/marketing/live/add-or-update'
  })
  sessionStorage.setItem('cloudLiveRoomData', JSON.stringify(data))
}

// 查看下线原因
const getOfflineRemark = (remark) => {
  ElMessageBox.confirm(remark, $t('live.reasonForOffline'), {
    confirmButtonText: $t('table.confirm')
  })
}

const onDelete = (id) => {
  ElMessageBox.confirm($t('admin.isDeleOper'), '提示', {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    api.delLiveRoom(id)
      .then(() => {
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            refreshChange()
          }
        })
      })
  })
}

/**
 * 刷新回调
 */
const refreshChange = () => {
  searchForm.pageNum = 1
  getPageData()
}
const onSearch = (newData = false) => {
  searchForm.pageNum = 1
  getPageData(newData)
}

const onResetSearch = (formEl) => {
  formEl.resetFields()
  dateRange.value = []
}

</script>
