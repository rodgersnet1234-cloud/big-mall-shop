<!--
 Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

 https://www.mall4j.com/

 未经允许，不可做商业用途！

 版权所有，侵权必究！
-->
<template>
  <div class="page-notify-list">
    <!-- 1.条件筛选 -->
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        :model="searchParam"
        @submit.prevent
      >
        <div class="input-row">
          <!-- 商品名称 -->
          <el-form-item :label="$t('multishop.notice.msgContent') + '：'">
            <el-input
              v-model="searchParam.message"
              :placeholder="$t('multishop.notice.msgContent')"
              maxlength="100"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('multishop.notice.msgType') + '：'">
            <el-select
              v-model="searchParam.sendType"
              :placeholder="$t('multishop.notice.msgType')"
              clearable
            >
              <el-option
                v-for="item in msgStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('multishop.notice.msgStatus') + '：'">
            <el-select
              v-model="searchParam.status"
              :placeholder="$t('multishop.notice.msgStatus')"
              clearable
            >
              <el-option
                :label="$t('chat.read')"
                :value="1"
              />
              <el-option
                :label="$t('chat.unRead')"
                :value="0"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('multishop.notice.publishTime') + '：'">
            <el-date-picker
              v-model="dateRange"
              type="datetimerange"
              :range-separator="$t('date.tip')"
              value-format="YYYY-MM-DD HH:mm:ss"
              :start-placeholder="$t('date.start')"
              :end-placeholder="$t('date.end')"
              :picker-options="{ disabledDate }"
            />
          </el-form-item>
          <!-- 查询按钮 -->
          <el-form-item>
            <el-button
              type="primary"
              @click="loadSearchParam()"
            >
              {{ $t('table.search') }}
            </el-button>
            <el-button
              plain
              @click="clearSearchInfo()"
            >
              {{ $t('table.reset') }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="main-content">
      <!-- 2.发布/展示/处理商品操作 -->
      <div class="operation-bar">
        <el-checkbox
          v-if="pageVO.list.length"
          v-model="isSelectedAll"
          :indeterminate="isIndeterminate"
          class="all-check-btn"
          @change="onSelectAll"
        >
          {{ $t('table.allSelect') }}
        </el-checkbox>
        <span
          v-if="selectedProdList.length"
          class="had-selected-tips"
        >{{ $t('multishop.notice.selectedItem') }} {{
          selectedProdList.length }}</span>
        <div class="inline-btn-row">
          <el-button
            v-show="pageVO.list.length"
            v-permission="['notify:notifyList:edit']"
            type="primary"
            @click="batchRead([])"
          >
            {{ $t('multishop.notice.allRead') }}
          </el-button>
          <el-button
            v-permission="['notify:notifyList:edit']"
            plain
            :disabled="!selectedProdList.length"
            @click="batchRead(selectedProdList)"
          >
            {{ $t('multishop.notice.batchRead') }}
          </el-button>
        </div>
      </div>

      <!-- 商品展示表格 -->
      <div
        ref="closepopoverRef"
        class="table-con"
      >
        <el-table
          ref="prodListTableRef"
          :data="pageVO.list"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%"
          @selection-change="onSelectSome"
        >
          <el-table-column
            type="selection"
            align="center"
            width="45"
          />
          <el-table-column
            :label="$t('multishop.notice.msgContent')"
            width="600"
            prop="message"
          />
          <el-table-column
            :label="$t('multishop.notice.msgType')"
            prop="label"
            min-width="120"
          />
          <el-table-column
            label="消息状态"
            prop="status"
            min-width="120"
          >
            <template #default="{ row }">
              {{ row.status === 0 ? '未读' : '已读' }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('multishop.notice.publishTime')"
            prop="createTime"
            min-width="120"
          />
          <el-table-column
            fixed="right"
            align="center"
            :label="$t('table.actions')"
            width="100"
          >
            <template #default="{ row }">
              <div class="table-btn-con">
                <div v-if="row.sendType === 112 || row.sendType === 113">
                  -
                </div>
                <el-button
                  v-else
                  v-permission="['notify:notifyList:view']"
                  type="primary"
                  link
                  @click="toReleasePage(row)"
                >
                  {{ $t('table.view') }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页条 -->
    <pagination
      v-show="pageVO.total > 0"
      v-model:page="pageQuery.pageNum"
      v-model:limit="pageQuery.pageSize"
      style="text-align: right"
      :total="pageVO.total"
      @pagination="getData()"
    />
  </div>
</template>

<script setup>

import * as api from '@/api/notify/notify'
import Pagination from '@/components/Pagination/index.vue'
import { ElMessage } from 'element-plus'

const commonStore = useCommonStore()
const searchFormRef = ref(null)
const searchParam = reactive({
  message: '',
  sendType: '',
  skuCode: '',
  spuCode: ''
})
const pageQuery = reactive({
  pageSize: 10,
  pageNum: 1
})
// 商品表格数据
const prodListTableRef = ref(null)
// 多选
const isSelectedAll = ref(false)
const isIndeterminate = ref(false)
const selectedProdList = ref([]) // 被选中的列表
// 返回参数
const pageVO = ref({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
// loading
const pageLoading = ref(true)
const dateRange = ref([])
const msgStatusList = computed(() => {
  return [{
    value: 104,
    label: $t('multishop.notice.buyerReturnedGoodsReminder')
  }, {
    value: 105,
    label: $t('multishop.notice.reminderOfPendingShipment')
  }, {
    value: 106,
    label: $t('multishop.notice.productRemovalReminder')
  }, {
    value: 107,
    label: $t('multishop.notice.commodityAuditResultReminder')
  }, {
    value: 108,
    label: $t('multishop.notice.ReminderChangeConsignment')
  }, {
    value: 102,
    label: $t('multishop.notice.userConfirmsReceiptNotification')
  }, {
    value: 110,
    label: $t('multishop.notice.ReminderPurchased')
  }, {
    value: 103,
    label: $t('multishop.notice.reminderOfPendingRefund')
  }, {
    value: 112,
    label: $t('multishop.notice.ReminderMarketingActivityOffShelf')
  }, {
    value: 113,
    label: $t('multishop.notice.ActivityAuditResultReminder')
  }]
}
)
onMounted(() => {
  getData()
})

// 限制时间选择，不能选择未来时间
const disabledDate = (curDate) => {
  curDate = new Date(curDate).getTime()
  return curDate > Date.now()
}
const loadSearchParam = () => {
  pageQuery.pageNum = 1
  pageQuery.message = searchParam.message
  pageQuery.sendType = searchParam.sendType
  pageQuery.status = searchParam.status
  pageQuery.startTime = dateRange.value === null ? null : dateRange.value[0] // 开始时间
  pageQuery.endTime = dateRange.value === null ? null : dateRange.value[1] // 结束时间
  getData()
}

/**
 * 获取消息列表
 */
const getData = () => {
  pageLoading.value = true
  api.unreadPage(pageQuery).then(res => {
    pageVO.value.pages = res.pages
    pageVO.value.total = res.total
    pageVO.value.list = res.list
    pageVO.value.list.forEach(item => {
      msgStatusList.value.forEach(obj => {
        if (obj.value === item.sendType) {
          item.label = obj.label
        }
      })
    })
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
  isSelectedAll.value = false
  isIndeterminate.value = false
  selectedProdList.value = []
}

const router = useRouter()
// 查看跳转页面
const toReleasePage = (row) => {
  const routeList = commonStore.routeList
  const pathObj = {
    path: '',
    query: {}
  }
  if (row.sendType === 106 || row.sendType === 107) {
    pathObj.path = '/product/manage/list'
  }
  if (row.sendType === 108) {
    pathObj.path = '/consignment/consignment/change-notice'
  }
  if (row.sendType === 102 || row.sendType === 105 || row.sendType === 110) {
    pathObj.path = '/order/order-manage/order'
    pathObj.query.orderStatus = row.sendType === 102 ? 5 : row.sendType === 110 ? 8 : 2
  }
  if (row.sendType === 103 || row.sendType === 111 || row.sendType === 104) {
    pathObj.path = '/order/order-manage/refund-order'
    pathObj.query.sts = row.sendType === 103 ? 1 : row.sendType === 111 ? 4 : 5
  }
  if (row.sendType === 112 || row.sendType === 113) {
    pathObj.path = '/marketing/discount'
  }
  const pathArr = pathObj.path
  const flag = treeTolist(routeList, '').includes(pathArr)
  if (!flag) {
    return ElMessage.error('您暂时没有权限访问')
  }
  if (row.status === 0) {
    const obj = {
      logIds: row.logId,
      type: 0
    }
    api.isRead(obj).then(() => {
      router.push(pathObj)
    })
  } else {
    router.push(pathObj)
  }
}
const treeTolist = (list, name = '', newList = []) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i].path[0] != '/') {
      newList.push(name + '/' + list[i].path)
    } else {
      newList.push(name + list[i].path)
    }
    if (list[i].children?.length > 0) {
      newList = newList.concat(treeTolist(list[i].children, list[i].path))
    }
  }
  return newList
}
/**
 * 监听表格选中
 */
const onSelectSome = (val) => {
  selectedProdList.value = val.map(item => item.logId)
  isSelectedAll.value = val.length === pageVO.value.list.length
}

/**
 * 全选按钮
 */
const onSelectAll = () => {
  isSelectedAll.value = prodListTableRef.value.getSelectionRows().length < pageVO.value.list.length
  prodListTableRef.value?.toggleAllSelection()
}
// 批量已读
const batchRead = (ids) => {
  const obj = {
    logIds: ids,
    type: ids.length > 0 ? 0 : 1
  }
  api.isRead(obj).then(() => {
    getData()
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500
    })
  })
}
/**
 * 清空
 */
const clearSearchInfo = () => {
  searchParam.message = ''
  searchParam.status = ''
  searchParam.sendType = ''
  dateRange.value = []
}

</script>

<style lang="scss" scoped>
.page-notify-list {
  .table-btn-con {
    display: flex;
    flex-wrap: wrap;
  }

  // 1.筛选条件搜索
  .search-bar {
    padding: 20px;
    background: #f9f9f9;
  }

  .main-content {
    .operation-bar {
      .had-selected-tips {
        font-size: 12px;
        margin-right: 10px;
        color: #155bd4;
      }

      .all-check-btn {
        margin: 0 15px;
      }

    }
  }
}
</style>
