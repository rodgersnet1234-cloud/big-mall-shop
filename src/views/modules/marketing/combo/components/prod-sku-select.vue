<template>
  <el-dialog
    v-model="visible"
    :title="'选择规格'"
  >
    <el-table
      ref="dataListRef"
      :data="dataList"
      header-cell-class-name="table-header"
      row-class-name="table-row"
      :row-style="{ height:'70px'}"
      style="width: 100%"
    >
      <el-table-column
        prop="partyCode"
        header-align="center"
        align="center"
        width="60"
      >
        <template
          #header
        >
          <el-checkbox
            v-model="isCheckAll"
            :indeterminate="indeterminate"
            @change="checkAll"
          />
        </template>
        <template #default="scope">
          <el-checkbox
            v-model="scope.row.check"
            @change="checkSku(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="skuName"
        header-align="center"
        align="center"
        :label="'规格'"
      >
        <template #default="scope">
          <div class="sku-name-txt">
            {{ scope.row.skuName || '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="'库存'"
        prop="stocks"
        align="center"
        width="120"
      >
        <template #default="scope">
          <span class="table-cell-text line-clamp-one">{{ scope.row.stock }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="'销售价（元）'"
        prop="price"
        align="center"
        width="120"
      >
        <template #default="scope">
          <span class="table-cell-text line-clamp-one">{{ formatPrice(scope.row.priceFee,1).toFixed(2) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <span>
        <el-button @click="visible = false">取消</el-button>
        <el-button
          type="primary"
          @click="onSubmitProds()"
        >确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/combo/combo.js'
import { formatPrice } from '@/utils'

const emit = defineEmits(['refreshSelectSkus'])
const visible = ref(false)
const dataList = ref([]) // 数据列表
const choseSkuMap = ref({}) // 已选择的sku对象Map
const choseSkuCount = ref(0) // 选择的sku
const searchForm = reactive({
  pageSize: 1,
  pageNum: 1,
  isActive: null,
  spuId: null
})

const init = (spuId, choseSkuList) => {
  visible.value = true
  dataList.value = []
  choseSkuMap.value = {}
  choseSkuCount.value = 0
  searchForm.spuId = spuId
  choseSkuList.forEach(sku => {
    ++choseSkuCount.value
    choseSkuMap.value[sku.skuId] = sku
  })
  getDataList()
}

// 点击选择sku
const isCheckAll = ref(false) // 全部选择
const indeterminate = ref(false) // 部分选择
const checkSku = (row) => {
  if (row.check) {
    ++choseSkuCount.value
    row.check = true
  } else {
    --choseSkuCount.value
    row.check = false
  }
  isCheckAll.value = choseSkuCount.value === dataList.value.length
  indeterminate.value = choseSkuCount.value > 0 && (choseSkuCount.value < dataList.value.length)
}

// 点击全选按钮
const checkAll = () => {
  if (isCheckAll.value) {
    dataList.value.forEach(sku => {
      sku.check = true
    })
    choseSkuCount.value = dataList.value.length
  } else {
    dataList.value.forEach(sku => {
      sku.check = false
    })
    choseSkuCount.value = 0
  }
  indeterminate.value = false
}

// 获取sku列表
const getDataList = () => {
  api.pageComboAddSpu({ ...searchForm }).then(({ list }) => {
    list = list.length > 0 ? list[0].skuList : []
    list.forEach(sku => {
      sku.check = !!choseSkuMap.value[sku.skuId]
    })
    isCheckAll.value = choseSkuCount.value === list.length
    indeterminate.value = choseSkuCount.value > 0 && (choseSkuCount.value < list.length)
    dataList.value = list
  })
}

// 确认提交
const onSubmitProds = () => {
  const skuList = []
  dataList.value.forEach(sku => {
    if (sku.check) {
      const temp = choseSkuMap.value[sku.skuId] ? choseSkuMap.value[sku.skuId] : sku
      skuList.push(temp)
    }
  })
  emit('refreshSelectSkus', skuList)
  visible.value = false
}

defineExpose({ init })
</script>
<style lang="scss" scoped>
</style>
