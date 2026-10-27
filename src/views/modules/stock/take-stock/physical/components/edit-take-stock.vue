<template>
  <div class="component-edit-take-stock">
    <div class="container">
      <div class="new-page-title">
        <div class="line" />
        <div class="text">
          实盘录入
        </div>
      </div>
      <div class="info-title">
        基本信息
      </div>
      <el-divider />
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        :rules="dataRule"
        class="form-box"
        label-width="auto"
        @submit.prevent
        @keyup.enter="onSubmit()"
      >
        <el-form-item
          label="盘点单号"
          prop="takeStockNo"
        >
          <span class="table-cell-text line-clamp-one">{{ dataForm.takeStockNo }}</span>
        </el-form-item>
        <el-form-item
          label="盘点时间"
          prop="createTime"
        >
          <span class="table-cell-text line-clamp-one">{{ dataForm.createTime }}</span>
        </el-form-item>
        <el-form-item
          label="库存点类型"
          prop="stockPointType"
        >
          <span class="table-cell-text line-clamp-one">{{ dataForm.stockPointType === 1 ? '仓库' : '门店' }}</span>
        </el-form-item>
        <el-form-item
          label="库存点名称"
          prop="warehouseName"
        >
          <span class="table-cell-text line-clamp-one">{{ dataForm.warehouseName }}</span>
        </el-form-item>
        <el-form-item
          label="盘点区域名称"
          prop="stockRegionName"
        >
          <el-input
            v-model="dataForm.stockRegionName"
            style="width: 320px"
            type="text"
            show-word-limit
            maxlength="20"
            placeholder="盘点区域名称"
          />
          <el-tooltip
            class="item"
            effect="dark"
            content="自定义该盘点区域名称，例如冷藏区。"
            placement="top"
          >
            <el-icon><InfoFilled /></el-icon>
          </el-tooltip>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remark"
        >
          <el-input
            v-model="dataForm.remark"
            style="width: 200px"
            type="textarea"
            show-word-limit
            maxlength="200"
            :autosize="{ minRows: 2, maxRows: 5 }"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <!--sku列表-->
      <skuListInfo
        v-if="dataForm.takeStockId"
        ref="skuListInfoRef"
        :take-stock-id="dataForm.takeStockId"
        :stock-point-id="dataForm.stockPointId"
        :stock-point-type="dataForm.stockPointType"
      />
    </div>
    <div
      class="footer"
      style="z-index: 3"
    >
      <el-button @click="back()">
        返回
      </el-button>
      <el-button
        type="primary"
        @click="updateStock()"
      >
        保存草稿
      </el-button>
      <el-button
        type="primary"
        @click="finishStock()"
      >
        完成盘点
      </el-button>
    </div>
  </div>
</template>

<script setup>
import skuListInfo from '../../../components/take-stock-sku-info.vue'
import { validNoEmptySpace } from '@/utils/validate'
import * as api from '@/api/stock/takeStock'
import { ElMessage } from 'element-plus'

const skuIds = ref([])
const dataForm = reactive({
  takeStockId: null,
  takeStockNo: null,
  billStatus: null,
  createTime: null,
  stockRegionName: null,
  remark: null,
  shopId: null,
  takeStockSpuList: [],
  stockPointId: null,
  warehouseName: null,
  stockPointType: null
})

const validateStockRegionName = (rule, value, callback) => {
  if (validNoEmptySpace(value)) {
    callback(new Error('内容不能全为空格'))
  } else {
    callback()
  }
}
const validateRemark = (rule, value, callback) => {
  if (validNoEmptySpace(value)) {
    callback(new Error('内容不能全为空格'))
  } else {
    callback()
  }
}

const dataRule = {
  stockRegionName: [
    { validator: validateStockRegionName, trigger: 'blur' }
  ],
  remark: [
    { validator: validateRemark, trigger: 'blur' }
  ]
}
onMounted(() => {
  if (useRoute().query.takeStockId) {
    dataForm.takeStockId = useRoute().query.takeStockId
  }
  getDataList()
})

const getDataList = () => {
  api.takeInfo(dataForm.takeStockId).then((data) => {
    dataForm.takeStockId = data.takeStockId
    dataForm.takeStockNo = data.takeStockNo
    dataForm.billStatus = data.billStatus
    dataForm.createTime = data.createTime
    dataForm.stockRegionName = data.stockRegionName
    dataForm.remark = data.remark
    dataForm.shopId = data.shopId
    dataForm.takeStockSpuList = data.takeStockSpuList
    dataForm.warehouseName = data.warehouseName
    dataForm.stockPointType = data.stockPointType
    dataForm.stockPointId = data.warehouseId
  })
}

const dataFormRef = ref(null)
const skuListInfoRef = ref(null)
const updateStock = () => {
  const flag = checkInfo()
  if (!flag) {
    return
  }
  dataFormRef.value.validate(valid => {
    if (valid) {
      api.saveTake(dataForm).then(() => {
        ElMessage({
          message: '操作成功',
          type: 'success',
          duration: 1000
        })
        skuListInfoRef.value.getSkuList()
        refreshChange()
      })
    }
  })
}
const route = useRouter()
const finishStock = () => {
  const flag = checkInfo()
  if (!flag) {
    return
  }
  dataFormRef.value.validate(valid => {
    if (valid) {
      api.finishInventory(dataForm).then(() => {
        ElMessage({
          message: '操作成功',
          type: 'success',
          duration: 1000
        })
        route.push({
          path: '/stock/takeStock',
          query: {
          }
        })
      })
    }
  })
}

const back = () => {
  route.push('/stock/takeStock')
}
const refreshChange = () => {
  skuIds.value = []
  getDataList()
}
const checkInfo = () => {
  dataForm.takeStockSpuList = skuListInfoRef.value.verifyDataForm()
  if (!dataForm.takeStockSpuList) {
    ElMessage({
      message: '盘点商品不能为空',
      type: 'error',
      duration: 1500
    })
    return false
  }
  if (dataForm.takeStockSpuList && dataForm.takeStockSpuList.find(el => !el.totalStock && el.totalStock !== 0)) {
    ElMessage({
      message: '商品实盘库存不能为空',
      type: 'error',
      duration: 1500
    })
    return false
  }
  return true
}

</script>

<style lang="scss" scoped>
.component-edit-take-stock {
  // 标题栏目
  .new-page-title {
    width: 100%;
    height: 62px;
    background: #F7F8FA;
    box-sizing: border-box;
    padding: 19px 20px;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .line {
      width: 4px;
      height: 19px;
      background: #155BD4;
      opacity: 1;
      border-radius: 2px;
      margin-right: 10px;
    }
    .text {
      font-size: 18px;
      font-weight: bold;
      color: #333333;
      opacity: 1;
    }
  }

  div :deep(.is-always-shadow) {
    margin-bottom: 20px !important;
  }

  div :deep(.is-success .el-input-number__decrease),
  div :deep(.is-success .el-input-number__increase),
  div :deep(.is-error .el-input-number__decrease),
  div :deep(.is-error .el-input-number__increase) {
    right: 1px !important;
  }

  div :deep(.el-date-editor .el-range-separator) {
    width: 8%;
  }

  .form-box {
    margin-left: 10px;
  }

  .container {
    padding: 20px;
    margin-bottom: 30px;
  }

  .new-supplier-mod .footer {
    height: 50px;
    position: fixed;
    bottom: 0;
    width: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 -3px 5px #eee;
    background: #FFF;
  }

  .info-title {
    color: #333333;
    font-size: 16px;
    font-weight: bold;
  }

  .prod-info .text {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-left: 10px;
    width: 170px;
  }

  :deep(.el-table__row .el-input__suffix) {
    right: -42px;
  }

// 底部固定按钮区域
  .footer {
    height: 50px;
    position: fixed;
    bottom: 0;
    width: 90%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 -3px 5px #eee;
    background: #FFF;
  }
}
</style>
