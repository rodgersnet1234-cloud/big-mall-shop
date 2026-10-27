<template>
  <div class="consignment-settings">
    <div class="header">
      <i class="header-icon" />代销设置
    </div>
    <!-- 代销商品设价格方式 -->
    <el-form
      label-position="right"
      label-width="auto"
      :model="dataForm"
      :rules="formDataRules"
      class="form"
      @submit.prevent
    >
      <el-form-item
        class="form-item"
        required
        label="代销商品设价格方式"
      >
        <div>
          <el-radio-group
            v-model="dataForm.salesType"
            @change="onTypeChange"
          >
            <el-radio :label="0">
              智能设价
            </el-radio>
            <el-radio :label="1">
              手动设价
            </el-radio>
          </el-radio-group>
          <div class="tip">
            <div>选择智能设价，导入供应商商品后将会自动按照加价比例设置销售价，供应商改价后销售价也会自动调整</div>
            <div> 选择手动设价，导入供应商商品后需要手动设置销售价 </div>
            <!-- <div>智能设价时供应商商品无法设置积分价格，如果供应商商品主要是用于积分消耗，建议使用手动设价，如已设置积分价后切换为智能设价，积分价会清零</div> -->
          </div>
        </div>
      </el-form-item>

      <!-- 默认加价比例 -->
      <el-form-item
        v-if="dataForm.salesType === 0"
        prop="salesPrice"
        class="form-item"
        label="默认加价比例"
      >
        <div>
          <el-radio-group
            v-model="dataForm.salesPriceType"
            @input="resourceChange"
          >
            <el-radio :label="0">
              按比例加价
            </el-radio>
            <el-radio :label="1">
              按固定数值加价
            </el-radio>
          </el-radio-group>
          <div>
            <el-input
              v-if="dataForm.salesPriceType === 0"
              v-model.number="dataForm.salesPrice"
              maxlength="15"
              class="input"
              placeholder="请输入内容"
              @change="onSalesPriceChange"
            >
              <template #append>
                %
              </template>
            </el-input>
            <el-input
              v-else-if="dataForm.salesPriceType==1"
              v-model="dataForm.salesPrice"
              maxlength="15"
              class="input"
              placeholder="请输入内容"
              @change="onSalesPriceChange"
            >
              <template #append>
                元
              </template>
            </el-input>
          </div>
        </div>
      </el-form-item>

      <!-- 商家收入低于供货价订单形式 -->
      <el-form-item
        class="form-item"
        required
      >
        <template #label>
          商家收入低于供货价订单形式
          <span>
            <el-tooltip placement="right">
              <template #content>
                <div class="tooltip-content">
                  若商家因为营销活动，优惠劵，满减活动的使用导致用户实付金额低于供应商供货价
                </div>
              </template>
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>&nbsp;&nbsp;
          </span>
        </template>
        <div class="orderShape">
          <el-radio
            v-model="dataForm.orderShape"
            :disabled="paySettlementType===1"
            :label="0"
          >
            直接转换为待采购订单
          <!-- <el-tooltip
            placement="right"
          >
            <template slot="content">
              <div class="tooltip-content">
                当用户实付金额低于供货价，商家订单多一个状   态为：待采购。该订单在供应商端没有显示，需要等到商家补上余额，点击该订单进行采购，才可以显示在供应商端发货。
              </div>
            </template>
            <i class="el-icon-question" />
          </el-tooltip> -->
          </el-radio>
          <el-radio
            v-if="paySettlementType !== 1"
            v-model="dataForm.orderShape"
            :label="1"
          >
            自动通过已结算账户金额扣除差价
          <!-- <el-tooltip
            placement="right"
          >
            <template slot="content">
              <div class="tooltip-content">
                当用户实付金额低于供货价，差价在商家承担【店铺】- “店铺结算”已结算余额中直接扣除，订单即生效。若店铺已结算余额不足扣除，则该订单列为“待采购”订单中，需要等到商家补上余额，点击该订单进行采购，才可以显示在供应商端发货
              </div>
            </template>
            <i class="el-icon-question" />
          </el-tooltip> -->
          </el-radio>
          <div
            v-if="paySettlementType!==1"
            class="tip"
          >
            选择直接转换为待采购订单: 当用户实付金额低于供货价，商家订单多一个状态为：待采购。该订单在供应商端没有显示，需要等到商家补上余额，点击该订单进行采购，才可以显示在供应商端发货。 选择通过已结算账户金额扣除差价: 当用户实付金额低于供货价，差价在商家承担
            <span>财务>财务结算</span>
            已结算余额中直接扣除，订单即生效。若店铺已结算余额不足扣除，则该订单列为
            <span> 待采购</span>
            订单中，需要等商家补上余额，点击该订单进行采购，才可以显示在供应商端发货。
          </div>
          <div
            v-else
            class="tip"
          >
            当用户实付金额低于供货价，商家订单多一个状态为：待采购。该订单在供应商端没有显示，需要等到商家补上余额，点击该订单进行采购，才可以显示在供应商端发货。
          </div>
        </div>
      </el-form-item>
      <el-form-item
        class="form-item"
        label=""
      >
        <el-button
          v-permission="['shop:substituteSales:save']"
          class="submit"
          type="primary"
          @click="onSubmit"
        >
          保存
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import * as http from '@/api/consignment/settings'
import Big from 'big.js'
import { ElMessage } from 'element-plus'

// 是否开启通联支付 1：开启 0：关闭
const paySettlementType = computed(() => useAllinpayStore().paySettlementType)
const dataForm = reactive({
  salesPrice: 0,
  salesType: 0,
  salesPriceType: 0,
  shopSubstituteSalesId: 0,
  orderShape: 0
})
// 设置信息是否存在
const isNotstituteSales = ref(false)
const isLoading = ref(false)
const formDataRules = {
  salesPrice: [
    { required: true, message: '请输入加价比例', trigger: 'blur' }
  ]
}

onMounted(() => {
  getInfo()
})

const getInfo = () => {
  http.getSubstituteSales().then((data) => {
    if (!data) {
      isNotstituteSales.value = true
      return
    }
    isNotstituteSales.value = false
    data.salesPrice /= 100
    dataForm.salesPrice = data.salesPrice
    dataForm.salesType = data.salesType
    dataForm.salesPriceType = data.salesPriceType
    dataForm.orderShape = data.orderShape
    dataForm.shopSubstituteSalesId = data.shopSubstituteSalesId
    dataForm.automaticOff = data.automaticOff
    dataForm.createTime = data.createTime
    dataForm.modifier = data.modifier
    dataForm.updateTime = data.updateTime
  })
}

// 保存
const onSubmit = () => {
  if (dataForm.salesType === 0 && dataForm.salesPrice < 0) {
    ElMessage.error('加价比例不能小于0')
    return
  }
  if (dataForm.salesType === 1) {
    dataForm.salesPrice = null
  }
  if (isLoading.value) {
    return
  }
  isLoading.value = true
  const params = { ...dataForm, salesPrice: dataForm.salesPrice !== null ? new Big(dataForm.salesPrice).times(100) : null }
  if (params.salesType === 1) {
    params.salesPrice = null
  }
  http.postSubstituteSales(params).then(() => {
    ElMessage.success('操作成功')
    getInfo()
  }).finally(() => {
    isLoading.value = false
  })
}
const resourceChange = () => {
  dataForm.salesPrice = 0
}
const onTypeChange = (e) => {
  if (e === 0 && !(dataForm.salesPriceType === 1 || dataForm.salesPriceType === 0)) {
    dataForm.salesPriceType = dataForm.salesPriceType || 0
    dataForm.salesPrice = dataForm.salesPrice || 0
  }
  // formData.salesType = e
}
const onSalesPriceChange = (val) => {
  if (dataForm.salesPriceType === 0 && val > 1000) {
    dataForm.salesPrice = 1000
    return
  } else if (dataForm.salesPriceType === 1 && val > 9999999.98) {
    dataForm.salesPrice = 9999999.98
    return
  }
  val = val * 1
  dataForm.salesPrice = dataForm.salesPrice * 1

  const srt = /^([1-9][0-9]*)+(.[0-9]{1,2})?$/
  if (!srt.test(val)) {
    dataForm.salesPrice = 0
  }
}
</script>

<style lang="scss" scoped>
.consignment-settings{
  margin: 20px;
  height: calc(100vh - 170px);
  font-size: 16px;
  font-family: Microsoft YaHei;
}
.header{
  width: 100%;
  height: 61px;
  background: #F7F8FA;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  line-height: 20px;
  color: #333333;
  .header-icon{
    margin: 0 12px 0 22px;
    width: 4px;
    height: 20px;
    background: #155BD4;
    border-radius: 5px;
  }
}

.form{
  margin:32px 0 0 50px;
  .form-item{
      margin-bottom:20px ;
    .tip{
      max-width: 1054px;
      font-size: 12px;
      color: #999999;
      line-height: 18px;
      &>span {
        color: #333;
        text-decoration: underline;
      }
    }
    .input{
      width: 200px;
    }
  }
}

.tooltip-content{
  max-width:400px ;
}

</style>
