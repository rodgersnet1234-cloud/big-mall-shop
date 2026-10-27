<!--
 Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

 https://www.mall4j.com/

 未经允许，不可做商业用途！

 版权所有，侵权必究！
-->
<template>
  <div class="page-notify-setting">
    <!-- 列表相关区域 -->
    <el-table
      v-loading="pageLoading"
      :data="pageVO.list"
      header-cell-class-name="table-header"
      row-class-name="table-row-low"
      style="width: 100%;"
    >
      <el-table-column
        prop="menu"
        align="left"
        :label="$t('multishop.notice.menu')"
        width="100"
      />
      <el-table-column
        :label="$t('multishop.notice.msgType')"
        prop="label"
        align="left"
      />
      <el-table-column
        align="left"
        prop="nodeName"
        :label="$t('multishop.notice.pushNode')"
      />
      <!-- 操作 -->
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template #default="{row}">
          <div class="table-btn-con">
            <el-button
              v-permission="['notify:notifySetting:edit']"
              type="primary"
              link
              @click="change(row)"
            >
              {{ row.isRemind === 0 ? $t('multishop.notice.enableReminder') : $t('multishop.notice.turnOffReminder') }}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页条 -->
    <pagination
      v-show="pageVO.total>0"
      v-model:page="pageQuery.pageNum"
      v-model:limit="pageQuery.pageSize"
      style="text-align: right"
      :total="pageVO.total"
      @pagination="getPage()"
    />
  </div>
</template>

<script setup>
import Pagination from '@/components/Pagination/index.vue'
import * as api from '@/api/notify/notify'
import { ElMessage } from 'element-plus'

// directives: { permission },

const pageQuery = reactive({
  pageSize: 10,
  pageNum: 1
})
// 返回参数
const pageVO = reactive({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
// loading
const pageLoading = ref(true)
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
    value: 111,
    label: $t('multishop.notice.reminderToNeReceived')
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
  getPage()
})

const getPage = () => {
  pageLoading.value = true
  api.remindPage(pageQuery).then(res => {
    pageVO.pages = res.pages
    pageVO.list = res.list
    pageVO.total = res.total
    pageVO.list.forEach(item => {
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
}
const change = (row) => {
  const obj = JSON.parse(JSON.stringify(row))
  obj.isRemind = obj.isRemind === 1 ? 0 : 1
  api.updateRemind(obj).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => {
        getPage()
      }
    })
  })
}

</script>
