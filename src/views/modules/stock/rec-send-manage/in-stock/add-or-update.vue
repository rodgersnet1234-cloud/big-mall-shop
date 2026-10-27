<template>
  <div class="container">
    <div class="content-container">
      <div class="new-page-title">
        <div class="line" />
        <div class="text">
          {{ $t('stock.newWarehousingDetails') }}
        </div>
      </div>
      <basic-info
        ref="basicInfoRef"
        :type="dataForm.type"
        :stock-bill-log-id="parseInt(stockBillLogId)"
        :stock-bill-log-info="stockBillLogInfo"
        @change-stock-point-id="onChangeStockPointId"
      />
      <sku-list-info
        ref="skuListInfoRef"
        :type="dataForm.type"
        :stock-bill-log-id="parseInt(stockBillLogId)"
        :stock-bill-log-info="stockBillLogInfo"
      />
    </div>
    <div class="foot-btn">
      <el-button
        type="primary"
        @click="confirmSave(1)"
      >
        {{ $t('stock.confirmWarehousing') }}
      </el-button>
      <el-button
        @click="confirmSave(2)"
      >
        {{ $t('stock.saveDraft') }}
      </el-button>
    </div>
  </div>
</template>

<script setup>
import BasicInfo from '../../components/stock-bill-basic-info.vue'
import SkuListInfo from '../../components/stock-bill-sku-info.vue'
import * as http from '@/api/stock/rec-send-manage/receive-add-or-update'
import { getInfo } from '@/api/stock/receive-detail'
import { ElMessage } from 'element-plus'

const isSubmit = ref(false)
const stockBillLogId = ref(0) // 出入明细id
const dataForm = reactive({
  businessTime: '', // 入库时间
  stockChangeReasonId: '', // 入库原因
  remark: '', // 备注
  qualifications: '', // 入库凭证
  stockBillLogItems: [], // 商品项
  type: 2,
  stockBillType: 3
})
const type = ref(2) // 1：出库 2：入库
const stockBillLogInfo = ref({
  stockPointType: 1,
  stockPointId: ''
})

const basicInfoRef = ref(null)
const skuListInfoRef = ref(null)
const router = useRouter()
const confirmSave = async (status) => {
  const dataForm = await basicInfoRef.value.verifyDataForm()
  const stockBillLogItems = skuListInfoRef.value.verifyDataForm()
  if (!dataForm || !stockBillLogItems) {
    return
  }
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  dataForm.stockBillLogItems = stockBillLogItems
  dataForm.status = status
  dataForm.type = type
  dataForm.stockBillLogId = stockBillLogId.value || ''
  http.putSubmitStock({
    method: dataForm.stockBillLogId ? 'put' : 'post',
    data: dataForm
  }).then(() => {
    ElMessage({
      message: '操作成功',
      type: 'success',
      duration: 1500,
      onClose: () => {
        isSubmit.value = false
        router.push({
          path: '/rec-send-manage/receive-list'
        })
      }
    })
  }).catch(() => {
    isSubmit.value = false
  })
}

const { query } = useRoute()
onMounted(() => {
  stockBillLogId.value = query.stockBillLogId
  getSentInfo(stockBillLogId.value)
})
const getSentInfo = (stockBillLogId) => {
  if (stockBillLogId) {
    getInfo(stockBillLogId).then((data) => {
      stockBillLogInfo.value = data
    })
  }
}

// 更换库存点后，删除选择的商品 data: 库存点信息；retainProductItem true：保留商品信息 false：清空商品信息
const onChangeStockPointId = (data, retainProductItem) => {
  skuListInfoRef.value?.onResetData(data, retainProductItem)
}

</script>

<style lang="scss" scoped>
  .container {
    height: 100%;

    .new-page-title{
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
    .content-container {
      padding: 20px 20px 60px 20px;
    }
    /* 脚部按钮 */
    .foot-btn {
      position: fixed;
      bottom: 0;
      width: 100%;
      padding: 15px 0;
      display: flex;
      justify-content: center;
      background: #fff;
      // border-top: 1px solid #ddd;
      box-shadow: 0 -2px 3px rgba(139, 139, 139, 0.1);
      z-index: 1999;
    }
  }

</style>
