<template>
  <div class="container">
    <span class="title">基本信息</span>
    <el-divider />
    <div class="basic-container">
      <div class="basic-row">
        <div class="basic-row-item">
          <p class="sub-tit">
            {{ $t('stock.outStockOrderNo') }}:
          </p>
          <p class="txt">
            {{ stockBillLogInfo.stockBillNo }}
          </p>
        </div>
        <div class="basic-row-item">
          <p class="sub-tit">
            {{ $t('stock.billStatus') }}:
          </p>
          <p class="txt">
            {{ status(stockBillLogInfo.status) }}
          </p>
        </div>
        <div class="basic-row-item">
          <p class="sub-tit">
            库存点类型:
          </p>
          <p class="txt">
            {{ ['', '仓库', '门店'][stockBillLogInfo.stockPointType] }}
          </p>
        </div>
        <div class="basic-row-item">
          <p class="sub-tit">
            {{ $t('stock.createOrderRemark') }}:
          </p>
          <p class="txt">
            {{ stockBillLogInfo.remark }}
          </p>
        </div>
      </div>
      <div class="basic-row">
        <div class="basic-row-item">
          <p class="sub-tit">
            {{ $t('stock.maker') }}:
          </p>
          <p class="txt">
            {{ stockBillLogInfo.makerName||'--' }}
          </p>
        </div>
        <div class="basic-row-item">
          <p class="sub-tit">
            {{ $t('stock.createOrderTime') }}:
          </p>
          <p class="txt">
            {{ stockBillLogInfo.createTime }}
          </p>
        </div>
        <div class="basic-row-item">
          <p class="sub-tit">
            库存点名称:
          </p>
          <p class="txt">
            {{ stockBillLogInfo.stockPointName }}
          </p>
        </div>
      </div>
      <div class="basic-row">
        <div class="basic-row-item">
          <p class="sub-tit">
            {{ $t('stock.sourceOrderNo') }}:
          </p>
          <p class="txt">
            {{ stockBillLogInfo.sourceOrderNo||'--' }}
          </p>
        </div>
        <div class="basic-row-item">
          <p class="sub-tit">
            {{ $t('stock.outStockTime') }}:
          </p>
          <p class="txt">
            {{ stockBillLogInfo.businessTime }}
          </p>
        </div>
        <div class="basic-row-item">
          <p class="sub-tit">
            {{ $t('stock.stockBillType') }}:
          </p>
          <p class="txt">
            {{ type(stockBillLogInfo.stockBillType) }}{{ stockBillLogInfo.reason ? '-' + stockBillLogInfo.reason : '' }}
          </p>
        </div>
      </div>
    </div>
    <div style="height: 20px" />
    <span class="title">{{ $t('stock.appendix') }}</span>
    <el-divider />
    <div class="qualifications-container">
      <span class="sub-tit">{{ $t('stock.deliveryCertificate') }}:</span>
      <div v-if="imgs.length">
        <el-image
          v-for="(img,index) in imgs"
          :key="index"
          class="tab-img"
          :src="checkFileUrl(img)"
          :preview-src-list="checkFileUrl(imgs)"
        >
          <template #error>
            <img
              class="tab-img"
              src="~@/assets/images/def.png"
            >
          </template>
        </el-image>
      </div>
      <span v-if="!imgs.length">--</span>
    </div>
    <div style="height: 20px" />
    <span class="title">{{ $t('group.prodInfo') }}</span>
    <el-divider />
    <div class="prod-container">
      <div class="sub-tit">
        共{{ stockBillLogItems.length }}{{ $t('stock.prodCountOutTips') }}:{{ totalCount }},{{ $t('stock.totalOutAmount2') }}:{{ formatPrice(totalAmount, 1) }}
      </div>
      <div class="prodItem-table">
        <el-table
          :data="stockBillLogItems.slice((page.currentPage - 1) * page.pageSize, page.currentPage * page.pageSize)"
          header-cell-class-name="table-header"
          row-class-name="table-row"
        >
          <el-table-column
            :label="$t('group.prodInfo')"
            prop="reason"
            fixed="left"
            align="center"
            width="320px"
          >
            <template #default="scope">
              <div class="prod-info-container">
                <div class="prod-image">
                  <ImgShow
                    :src="scope.row.imgUrl || scope.row.mainImgUrl"
                    :img-style="{width: '100%',height: '100%'}"
                    @img-error="scope.row.imgUrl=''"
                  />
                </div>
                <div class="prod-name">
                  <el-tooltip
                    :content="scope.row.spuName"
                    placement="top"
                    effect="light"
                  >
                    <div class="prod-name-txt">
                      {{ scope.row.spuName }}
                    </div>
                  </el-tooltip>
                  <el-tooltip
                    :content="scope.row.skuName"
                    placement="top"
                    effect="light"
                  >
                    <div class="spec">
                      {{ scope.row.skuName }}
                    </div>
                  </el-tooltip>
                  <div class="prod-no">
                    {{ scope.row.partyCode }}
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('stock.unit')"
            prop="type"
            align="center"
          >
            <span class="table-cell-text line-clamp-one">{{ $t('stock.pieces') }}</span>
          </el-table-column>
          <el-table-column
            :label="$t('stock.deliveryCount')"
            prop="type"
            align="center"
          >
            <template #default="scope">
              <span class="table-cell-text line-clamp-one">{{ scope.row.stockCount }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('stock.costAmount')"
            prop="type"
            align="center"
          >
            <template #default="scope">
              <span class="table-cell-text line-clamp-one">{{ formatPrice(scope.row.unitPrice,1) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('stock.costTotalAmount')"
            prop="type"
            align="center"
          >
            <template #default="scope">
              <span class="table-cell-text line-clamp-one">{{ formatPrice(scope.row.totalAmount,1) }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagination"
          :current-page="page.currentPage"
          :page-size="page.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="stockBillLogItems.length"
          @current-change="onPageChange"
        />
      </div>
    </div>
    <div
      v-if="stockBillLogInfo.status === 2"
      class="foot-btn"
    >
      <el-button
        type="primary"
        @click="editHandle"
      >
        编辑
      </el-button>
      <el-button @click="voidedHandle">
        作废
      </el-button>
    </div>
    <!-- 作废提示对话框 -->
    <el-dialog
      v-model="voidedVisibleDialog"
      title="提示"
    >
      <div>
        {{ $t('stock.voidInventoryTips') }}
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="voidedVisibleDialog = false">取消</el-button>
          <el-button
            type="primary"
            @click="confirmVoided"
          >确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import Big from 'big.js'
import * as http from '@/api/stock/receive-detail'
import { ElMessage } from 'element-plus'
import { checkFileUrl, formatPrice } from '@/utils'

const status = (val) => {
  switch (val) {
    case 0:
      return '已作废'
    case 1:
      return '已出库'
    case 2:
      return '待提交'
  }
}
const type = (val) => {
  switch (val) {
    case 4:return '销售出库'
    case 5:return '编辑出库'
    case 6:return '其他出库'
    case 10:return '盘盈入库'
    case 11:return '盘亏出库'
    case 13:return '调拨出库'
    case 14:return '库存模式切换出库'
  }
}

const isSubmit = ref(false)
const stockBillLogId = ref(null)
const stockBillLogInfo = ref({})
const stockBillLogItems = ref([])
const totalCount = ref('')
const totalAmount = ref('')
const imgs = ref([])
const page = reactive({
  currentPage: 1, // 初始页
  pageSize: 10 // 每页数据大小
})
const voidedVisibleDialog = ref(false)
onMounted(() => {
  stockBillLogId.value = useRoute().query.stockBillLogId
  init()
})

const init = () => {
  getStockBillInfo()
}
const getStockBillInfo = () => {
  http.getInfo(stockBillLogId.value)
    .then((data) => {
      imgs.value = data.qualifications ? data.qualifications.split(',') : []
      stockBillLogInfo.value = data
      totalAmount.value = data.totalAmount

      stockBillLogItems.value = data.stockBillItemLogs
      let totalCountVal = 0

      stockBillLogItems.value.forEach(item => {
        totalCountVal += parseInt(item.stockCount)
        item.totalAmount = bigProductTotalAmount(item.unitPrice, item.stockCount)
      })
      totalCount.value = totalCountVal
    })
}
const router = useRouter()
const editHandle = () => {
  router.push({
    path: '/rec-send-manage/stock-send-add-or-update',
    query: {
      type: 1,
      stockBillLogId: stockBillLogId.value
    }
  })
}
const confirmVoided = () => {
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  http.putVoided(stockBillLogId.value).then(() => {
    ElMessage({
      message: '操作成功',
      type: 'success',
      duration: 1000
    })
    voidedVisibleDialog.value = false
    isSubmit.value = false
    getStockBillInfo()
  }).catch(() => {
    voidedVisibleDialog.value = false
    isSubmit.value = false
  })
}
const voidedHandle = () => {
  voidedVisibleDialog.value = true
}
const onPageChange = (val) => {
  page.currentPage = val
}
// 精度运算-乘法
const bigProductTotalAmount = (a, b) => {
  return new Big(a).times(b)
}

</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
  padding: 20px 20px 80px 20px;
  .title {
    color: #333333;
    font-size: 14px;
    font-weight: bold;
  }
  .basic-container {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    .basic-row {
      display: flex;
      flex-direction: column;
      margin-right: 10px;
      .basic-row-item {
        width: 400px;
        height: 50px;
        display: flex;
        flex-direction: row;
        .sub-tit {
          min-width: 80px;
          font-size: 14px;
          color: #333333;
        }
        .txt {
          font-size: 14px;
          color: #333333;
          word-break: break-word;
        }
      }
    }
  }
  .qualifications-container {
    display: flex;
    flex-direction: row;
    .sub-tit {
      font-size: 14px;
      color: #333333;
      margin-right: 10px;
    }
    .tab-img {
      width: 60px;
      height: 60px;
      margin-right: 5px;
      cursor: pointer;
    }
  }
  .prod-container {
    .sub-tit {
      font-size: 14px;
      color: #333333;
      margin-bottom: 16px;
    }
    .prodItem-table {
      .prod-info-container {
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .prod-image {
          margin-right: 20px;
          width: 80px;
          height: 80px;
          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }
        .prod-name {
          flex: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          .prod-name-txt {
            font-size: 14px;
            color: #333333;
            word-break: break-all;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
          }
          .spec {
            font-size: 10px;
            color: #333333;
            word-break: break-all;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
          }
          .prod-no {
            font-size: 14px;
            color: #333333;
          }
        }
      }
    }
    .pagination{
      text-align: right;
    }
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
