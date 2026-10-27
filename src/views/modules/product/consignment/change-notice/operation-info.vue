<template>
  <el-dialog
    v-model="dialogVisible"
    title="提示"
    width="80%"
    class="prod-detail-dialog"
  >
    <div class="prod-row">
      <span class="row-title">商品名称:</span>
      <span class="row-txt">{{ prodInfo.spuLangList?prodInfo.spuLangList[0].spuName :'' }}</span>
    </div>
    <div class="prod-row">
      <span class="row-title">商品卖点:</span>
      <span class="row-txt">{{ prodInfo.spuLangList? prodInfo.spuLangList[0].sellingPoint:'' }}</span>
    </div>
    <div class="prod-row">
      <span class="row-title inline-block">商品图片:</span>
      <div
        v-for="(item, index) in prodInfo.imgUrls"
        :key="index"
        class="flex-box-img"
      >
        <ImgShow
          :src="item"
          :class-list="['prod-img']"
        />
      </div>
    </div>
    <div class="main-container1">
      <div class="table-con table-box">
        <!-- <span class="row-title">规格:</span> -->
        <!-- 规格表格 -->
        <el-table
          :data="prodInfo.skus"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          class="table"
          style="width: 100%"
        >
          <el-table-column
            fixed
            prop="prodName"
            width="240"
            label="商品名称"
          >
            <span class="table-cell-text">{{ prodInfo.spuLangList? prodInfo.spuLangList[0].spuName:'' }}</span>
          </el-table-column>
          <el-table-column
            label="商品规格"
            width="240"
          >
            <template #default="{row}">
              {{ row.skuName || '-' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="pic"
            label="商品图片"
          >
            <template #default="{row}">
              <ImgShow
                v-if="row.imgUrl || row.mainImgUrl"
                :width="100"
                :height="100"
                :src="row.imgUrl || row.mainImgUrl"
                :class-list="['tab-img']"
                @img-error="row.imgUrl=''"
              />
              <p
                v-else
                class="weak"
              >
                暂无图片
              </p>
            </template>
          </el-table-column>

          <el-table-column
            prop="priceFee"
            label="销售价(元)"
          >
            <template #default="{row}">
              {{ formatPrice(row.priceFee,1) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="marketPriceFee"
            label="市场价(元)"
          >
            <template #default="{row}">
              {{ formatPrice(row.marketPriceFee,1) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="stock"
            label="商品总库存"
          />
          <el-table-column
            prop="weight"
            label="商品重量(kg)"
          />
          <el-table-column
            prop="volume"
            label="商品体积(m³)"
          />
        </el-table>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
        <el-button
          type="primary"
          @click="dialogVisible = false"
        >确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import * as http from '@/api/consignment/change-notice.js'
import { formatPrice } from '@/utils'
const dialogVisible = ref(false)
const prodInfo = ref({})
const init = (spuId) => {
  reset()
  getInfo(spuId)
  dialogVisible.value = true
}
const getInfo = (spuId) => {
  http.getSpuInfo(spuId).then((data) => {
    data.imgUrls = data.imgUrls?.split(',') || [data.mainImgUrl]
    prodInfo.value = data
  })
}
// 重置
const reset = () => {
  dialogVisible.value = false
  prodInfo.value = {}
}

defineExpose({ init })
</script>

<style lang="scss" scoped>
   .prod-detail-dialog {
   .flex-box-img :deep(.prod-img) {
      display: inline-block;
      width: auto;
      height: auto;
      max-width: 100px !important;
      max-height: 100px !important;
      margin-right: 10px;
    }
    .main-container1 {
      .table-cell-text {
        -webkit-line-clamp: 1;
      }
    }
    .row-title {
      display: inline-block;
      margin-right: 12px;
      min-width: 70px;
      line-height: 1.5em;
    }
    .prod-row {
      display: flex;
      align-items: flex-start;
      margin-bottom: 15px;
      .row-txt {
        word-break: break-word;
        line-height: 1.5em;
      }
    }
    .table-box {
      .table {
        margin-top: 10px;
        .weak {
          color: #aaa;
        }
      }
    }
  }
</style>
