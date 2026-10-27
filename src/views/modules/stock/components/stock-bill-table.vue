<template>
  <div class="component-stock-bill-table">
    <!-- 表格 -->
    <div class="table-con">
      <el-table
        ref="dataListRef"
        :data="dataList"
        header-cell-class-name="table-header"
        row-class-name="table-row-low"
        style="width: 100%"
        :row-key="(row) => { return row.stockBillNo }"
        @selection-change="onSelectSome"
      >
        <el-table-column
          type="selection"
          fixed="left"
          width="55"
          :reserve-selection="true"
        />
        <el-table-column
          :label="type === 1 ? $t('stock.outStockOrderNo') : $t('stock.inStockOrderNo')"
          prop="stockBillNo"
          fixed="left"
          width="240"
        >
          <template #default="scope">
            <span class="table-cell-text line-clamp-one">{{ scope.row.stockBillNo }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="库存点名称"
          prop="stockPointName"
          width="200"
        >
          <template #default="scope">
            {{ scope.row.stockPointName || '-' }}
          </template>
        </el-table-column>
        <el-table-column
          label="库存点类型"
          prop="stockPointType"
          width="120"
        >
          <template #default="scope">
            <span class="table-cell-text line-clamp-one">{{ ['', '仓库', '门店'][scope.row.stockPointType] || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="120"
          :label="$t('stock.stockBillType')"
          prop="stockBillType"
        >
          <template #default="scope">
            <span class="table-cell-text line-clamp-one">{{ typeMethod( scope.row.stockBillType ) }}{{ scope.row.reason ? '-' + scope.row.reason : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="160"
          label="关联单号"
          prop="stockBillType"
        >
          <template #default="scope">
            <span class="table-cell-text line-clamp-one">{{ scope.row.sourceOrderNo ? scope.row.sourceOrderNo : '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('stock.billStatus')"
          prop="status"
          width="200"
        >
          <template #default="scope">
            <span class="table-cell-text line-clamp-one">{{ type === 1 ? statusStrOutArr[scope.row.status] : statusStrInArr[scope.row.status] }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="type === 1 ? $t('stock.actualOutCount') : $t('stock.actualInCount')"
          prop="totalCount"
          min-width="120"
        >
          <template #default="scope">
            <span class="table-cell-text line-clamp-one">{{ scope.row.totalCount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="type === 1 ? $t('stock.totalOutAmount') : $t('stock.totalInAmount')"
          prop="totalAmount"
          width="180"
        >
          <template #default="scope">
            <span class="table-cell-text line-clamp-one">{{ formatPrice(scope.row.totalAmount,1) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('stock.maker')"
          prop="makerName"
          width="180"
        >
          <template #default="scope">
            <span class="table-cell-text line-clamp-one">{{ scope.row.makerName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('stock.createOrderTime')"
          prop="createTime"
          width="200"
        >
          <template #default="scope">
            <span class="table-cell-text line-clamp-one">{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('table.actions')"
          fixed="right"
          width="150"
        >
          <template #default="scope">
            <div class="text-btn-con">
              <el-button
                v-if="(type === 2 || type === 1) && scope.row.status === 2"
                v-permission="[type===1?'recSendManage:receiveList:edit':'recSendManage:sendList:edit']"
                type="primary"
                link
                @click="updateHandle(scope.row.stockBillLogId)"
              >
                编辑
              </el-button>
              <el-popconfirm
                v-if="( type === 2 || type === 1) && scope.row.status === 2"
                v-permission="[type===1?'recSendManage:receiveList:voided':'recSendManage:sendList:voided']"
                class="default-btn text-btn"
                confirm-button-text="作废"
                cancel-button-text="取消"
                :hide-icon="true"
                :title="$t('stock.voidInventoryTips')"
                placement="top"
                @confirm="voidedHandle(scope.row.stockBillLogId)"
              >
                <template #reference>
                  <el-button
                    v-if="( type === 2 || type === 1) && scope.row.status === 2"
                    type="primary"
                    link
                  >
                    作废
                  </el-button>
                </template>
              </el-popconfirm>
              <el-button
                type="primary"
                link
                @click="detailHandle(scope.row.stockBillLogId)"
              >
                详情
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import * as http from '@/api/stock/receive-detail'
import { ElMessage } from 'element-plus'
import { formatPrice } from '@/utils'

const props = defineProps({
  dataList: {
    default: function () {
      return []
    },
    type: Array // 数据列表
  },
  type: {
    default: 0,
    type: Number // 1 出库 2 入库
  }
})
const emit = defineEmits(['refreshList'])

const typeMethod = (type) => {
  switch (type) {
    case 1:return '采购入库'
    case 2:return '退款入库'
    case 3:return '其他入库'
    case 4:return '销售出库'
    case 5:return '编辑出库'
    case 6:return '其他出库'
    case 7:return '库存初始化'
    case 8:return '订单取消'
    case 9:return '编辑入库'
    case 10:return '盘盈入库'
    case 11:return '盘亏出库'
    case 12:return '调拨入库'
    case 13:return '调拨出库'
    case 14:return '库存模式切换出库'
    case 15:return '库存模式切换入库'
    case 16:return '秒杀补充库存'
  }
}

const isSubmit = ref(false)
const dataListSelections = ref([])
const statusStrInArr = [
  '已作废',
  '已入库',
  '待提交'
]
const statusStrOutArr = [
  '已作废',
  '已出库',
  '待提交'
]

// 多选变化
const onSelectSome = (val) => {
  dataListSelections.value = val
}

const getSelectList = () => {
  return dataListSelections.value
}
const updateHandle = (stockBillLogId) => {
  const path = props.type === 1 ? '/rec-send-manage/stock-send-add-or-update' : '/rec-send-manage/stock-receive-add-or-update'
  router.push({
    path,
    query: {
      type: props.type,
      stockBillLogId
    }
  })
}
const voidedHandle = (stockBillLogId) => {
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  http.putVoided(stockBillLogId
  ).then(() => {
    ElMessage({
      message: '操作成功',
      type: 'success',
      duration: 1000
    })
    isSubmit.value = false
    emit('refreshList')
  }).catch(() => {
    isSubmit.value = false
  })
}
const router = useRouter()
const detailHandle = (stockBillLogId) => {
  const path = props.type === 1 ? '/rec-send-manage/send-detail' : '/rec-send-manage/receive-detail'
  router.push({
    path,
    query: {
      type: props.type,
      stockBillLogId
    }
  })
}
const dataListRef = ref(null)
const clearSelection = () => {
  dataListRef.value?.clearSelection()
}

defineExpose({ clearSelection, getSelectList })

</script>
<style lang="scss" scoped>
</style>
