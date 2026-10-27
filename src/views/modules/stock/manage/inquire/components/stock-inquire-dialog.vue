<template>
  <el-dialog
    v-model="visible"
    class="component-stock-inquire-dialog"
    :title="dataList[0]?.spuName ? dataList[0].spuName : $t('stock.skuStockInfo')"
  >
    <el-table
      ref="dataListRef"
      :data="dataList"
      header-cell-class-name="table-header"
      row-class-name="table-row"
      :row-style="{ height: '70px' }"
      style="width: 100%"
    >
      <el-table-column
        prop="partyCode"
        header-align="center"
        align="center"
        :label="$t('product.commodityCode')"
      >
        <template #default="scope">
          <el-tooltip
            :content="scope.row.partyCode"
            placement="top"
            effect="light"
          >
            <div class="sku-name-txt">
              {{ scope.row.partyCode }}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column
        prop="skuName"
        header-align="center"
        align="center"
        :label="$t('stock.spec')"
      >
        <template #default="{ row }">
          <el-tooltip
            :content="row.skuLangList && row.skuLangList.length ? row.skuLangList[0].skuName : '--'"
            placement="top"
            effect="light"
          >
            <div class="sku-name-txt">
              {{ row.skuLangList && row.skuLangList.length ? row.skuLangList[0].skuName : '--' }}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('stock.unit')"
        prop="createTime"
        align="center"
        width="120"
      >
        <span class="table-cell-text line-clamp-one">{{ $t('stock.pieces') }}</span>
      </el-table-column>
      <el-table-column
        label="库存"
        prop="stock"
        align="center"
        width="120"
      >
        <template #default="scope">
          <span class="table-cell-text line-clamp-one">{{ scope.row.stock }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('stock.price')"
        prop="priceFee"
        align="center"
        width="120"
      >
        <template #default="scope">
          <span class="table-cell-text line-clamp-one">{{ formatPrice(scope.row.priceFee, 1) }}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script setup>
import { formatPrice } from '@/utils'
import { getAllSkuList } from '@/api/stock/components/stock-inquire-dialog'

const Data = reactive({
  visible: false,
  dataList: [], // 数据列表
  searchForm: {
    prodId: null
  }
})

const { visible, dataList } = toRefs(Data)

const init = (prodId) => {
  Data.visible = true
  Data.dataList = []
  Data.page = {
    total: 0, // 总页数
    currentPage: 1, // 当前页数
    pageSize: 10 // 每页显示多少条
  }
  Data.searchForm.prodId = prodId
  getDataList()
}

const getDataList = () => {
  getAllSkuList(Data.searchForm)
    .then((data) => {
      Data.dataList = data
      Data.dataListLoading = false
    }).catch(() => {
      Data.dataListLoading = false
    })
}

defineExpose({
  init
})

</script>

<style lang="scss" scoped>
.component-stock-inquire-dialog {

  :deep(.el-dialog__title) {
    max-width: 95%;
    display: block;
    word-break: break-all;
  }
}
</style>
