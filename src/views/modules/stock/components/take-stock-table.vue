<template>
  <!-- 表格 -->
  <div class="component-take-stock-table">
    <div class="table-con">
      <el-table
        ref="dataListRef"
        :data="dataList"
        header-cell-class-name="table-header"
        row-class-name="table-row-low"
        style="width: 100%"
      >
        <el-table-column
          label="盘点单号"
          prop="takeStockNo"
          fixed="left"
          width="250"
        >
          <template #default="scope">
            <span class="table-cell-text line-clamp-one">{{ scope.row.takeStockNo }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="库存点类型"
          prop="stockPointType"
          fixed="left"
          width="250"
        >
          <template #default="scope">
            <span>{{ ['-', '仓库', '门店'][scope.row.stockPointType] || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="库存点名称"
          prop="warehouseName"
          fixed="left"
          width="250"
        >
          <template #default="scope">
            {{ scope.row.warehouseName || '-' }}
          </template>
        </el-table-column>
        <el-table-column
          label="盘点状态"
          prop="billStatus"
        >
          <template #default="scope">
            <span
              v-if="scope.row.billStatus === 0"
              class="table-cell-text line-clamp-one"
            >已作废</span>
            <span
              v-if="scope.row.billStatus === 1"
              class="table-cell-text line-clamp-one"
            >盘点中</span>
            <span
              v-if="scope.row.billStatus === 2"
              class="table-cell-text line-clamp-one"
            >已完成</span>
          </template>
        </el-table-column>
        <el-table-column
          label="sku个数"
          prop="skuCount"
        >
          <template #default="scope">
            <span class="table-cell-text line-clamp-one">{{ scope.row.skuCount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="盘点时间"
          prop="createTime"
          :show-overflow-tooltip="true"
        >
          <template #default="scope">
            <span class="table-cell-text line-clamp-one">{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="制单人"
          prop="phoneNum"
        >
          <template #default="scope">
            <span class="table-cell-text line-clamp-one">{{ scope.row.makerName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          fixed="right"
          width="200"
        >
          <template #default="scope">
            <div class="text-btn-con">
              <el-button
                v-if="scope.row.billStatus === 1"
                type="primary"
                link
                @click="updateHandle(scope.row.takeStockId)"
              >
                编辑
              </el-button>
              <el-popconfirm
                v-if="scope.row.billStatus === 1"
                class="default-btn text-btn"
                style="margin:0 10px;padding:1px 0"
                confirm-button-text="作废"
                cancel-button-text="取消"
                :hide-icon="true"
                title="作废后无法编辑，确认作废？"
                placement="top"
                @confirm="voidedHandle(scope.row.takeStockId)"
              >
                <template #reference>
                  <el-button
                    v-if="scope.row.billStatus === 1"
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
                @click="detailHandle(scope.row.takeStockId,scope.row.billStatus)"
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
import * as api from '@/api/stock/takeStock.js'
import { ElMessage } from 'element-plus'

defineProps({
  dataList: {
    type: Array,
    default: () => {}
  }
})
const emit = defineEmits(['refreshChange'])
const route = useRouter()
const updateHandle = (takeStockId) => {
  route.push({
    path: '/stock/edit-take-stock',
    query: {
      takeStockId
    }
  })
}

const voidedHandle = (takeStockId) => {
  api.voidedInventory(takeStockId).then(() => {
    ElMessage({
      message: '操作成功',
      type: 'success',
      duration: 1000
    })
    refreshChange()
  })
}

const detailHandle = (takeStockId, billStatus) => {
  route.push({
    path: '/stock/detail-take-stock',
    query: {
      takeStockId,
      billStatus
    }
  })
}
const refreshChange = () => {
  emit('refreshChange')
}

</script>
<style lang="scss" scoped>
.component-take-stock-table{
  div :deep(.table-cell-text){
    display: inline !important;
  }
}

</style>
