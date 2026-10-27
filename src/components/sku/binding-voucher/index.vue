<template>
  <el-dialog
    v-model="dialogTableVisible"
    :title="$t('voucher.chooseVoucher')"
    width="40%"
    class="component-association-goods"
    :close-on-click-modal="false"
  >
    <div
      class="search-bar"
    >
      <el-form
        :inline="true"
        class="demo-form-inline"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item
            prop="name"
            :label="$t('voucher.voucherName')"
            class="search-form-item"
          >
            <el-input
              v-model="searchForm.name"
              type="text"
              clearable
              :placeholder="$t('tip.input') + $t('voucher.voucherName')"
            />
          </el-form-item>
          <el-form-item>
            <div
              class="default-btn primary-btn"
              @click="onSearch"
            >
              {{ $t('table.search') }}
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <el-table
      :data="dataList"
      header-row-class-name="header-row"
      style="margin-top: 10px"
    >
      <el-table-column
        header-align="center"
        align="center"
        width="50px"
      >
        <template #default="scope">
          <div :key="scope.row.voucherId">
            <el-radio
              v-model="singleSelectBrandId"
              :label="scope.row.voucherId"
              @change="getSelectBrandRow(scope.row)"
            >
              &nbsp;&nbsp;
            </el-radio>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        property="name"
        :label="$t('voucher.voucherName')"
        align="left"
      >
        <template #default="scope">
          {{ scope.row.name || '-' }}
        </template>
      </el-table-column>
      <el-table-column
        property="notEnabledNum"
        :label="$t('voucher.notEnabled')"
        align="center"
      >
        <template #header>
          {{ $t('voucher.notEnabled') }}<el-tooltip
            class="box-item"
            effect="dark"
            :content="$t('voucher.notEnabledTips')"
            placement="top"
          >
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="dataList.length"
      :current-page="page.currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="page.pageSize"
      layout="->, total, sizes, prev, pager, next, jumper"
      :total="page.total"
      style="margin-top: 20px"
      @size-change="onPageSizeChange"
      @current-change="onPageChange"
    />

    <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="dialogTableVisible = false"
        >
          {{ $t('table.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="onSubmit"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/product/voucher.js'

const props = defineProps({
  // 查询是（否）已被关联的卡券
  skuRelation: {
    type: Number || String,
    default: 0
  },
  // 过滤掉已经选择的卡券
  notInVoucherIds: {
    type: Array,
    default: () => []
  },
  // 需要查询保留的卡券，优先级低于notInVoucherIds
  preBindVoucherList: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['onSelectSuccess'])
const reserveVoucherIds = computed(() => {
  return props.preBindVoucherList.map(i => i.voucherId)
})

const singleSelectBrandId = ref(0)
let selectBrand = {}
// 单选商品事件
const getSelectBrandRow = (row) => {
  singleSelectBrandId.value = row.voucherId
  selectBrand = row
}

const dialogTableVisible = ref(false)
/**
 * 打开关联商品弹窗
 */
const init = (row = {}) => {
  singleSelectBrandId.value = row.voucherId || 0
  resetData()
  selectBrand = {
    voucherId: row.voucherId,
    notEnabledNum: row.stocks,
    name: row.voucherName
  }
  dialogTableVisible.value = true
}

const onSubmit = () => {
  dialogTableVisible.value = false
  const data = JSON.parse(JSON.stringify(selectBrand))
  emit('onSelectSuccess', data)
}

// 初始化数据
const resetData = () => {
  dataList.value = []
  selectBrand = {}
  page.currentPage = 1
  page.pageSize = 10
  getDataList()
}

const page = reactive({
  total: 0, // 总页数
  currentPage: 1, // 当前页数
  pageSize: 10 // 每页显示多少条
})

const onSearch = () => {
  page.currentPage = 1
  page.pageSize = 10
  getDataList()
}

const onPageSizeChange = (val) => {
  page.pageSize = val
  getDataList()
}
const onPageChange = (val) => {
  page.currentPage = val
  getDataList()
}

// 获取数据列表
const searchForm = reactive({
  name: ''
})
const dataList = ref([])
const getDataList = () => {
  api.page({
    pageSize: page.pageSize,
    pageNum: page.currentPage,
    name: searchForm.name,
    skuRelation: props.skuRelation,
    notInVoucherIds: props.notInVoucherIds.filter(i => i !== singleSelectBrandId.value),
    reserveVoucherIds: reserveVoucherIds.value
  }).then((data) => {
    dataList.value = data.list
    page.total = data.total
  })
}

defineExpose({
  init
})

</script>

<style scoped lang="scss">
// 定义表头样式
:deep(.header-row) {
  .el-table__cell {
    background-color: #F7F8FA;
    height: 57px;
    font-weight: bold;
  }
}

</style>
