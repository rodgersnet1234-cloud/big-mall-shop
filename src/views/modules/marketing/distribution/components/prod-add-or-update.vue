<template>
  <div class="component-distribution-prod-add-or-update">
    <el-dialog
      v-model="visible"
      :title="
        !editFlag
          ? $t('distributionProd.newDisProducts')
          : $t('distributionProd.modifyDisnProducts')
      "
      :close-on-click-modal="false"
      :before-close="handleDialogClose"
    >
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        :label-width="$t('language') === 'English' ? '130px' : '100px'"
        @submit.prevent
        @keyup.enter="onSubmit()"
      >
        <el-form-item :label="$t('distributionProd.relatedProducts')">
          <div v-if="prodData[0] != null">
            <el-card
              :body-style="{ padding: '0px' }"
              style="height: 160px; width: 120px"
            >
              <ImgShow
                :src="prodData[0].mainImgUrl"
                :img-style="{width:'100%',height:'104px'}"
              />
              <div class="prod-bottom">
                <span>￥{{ prodData[0].priceFee }}</span>
              </div>
              <div class="prod-bottom flex-box">
                <span class="">{{ prodData[0].spuName }}</span>
                <el-button
                  type="primary"
                  link
                  class=""
                  @click="deleteRelation"
                >
                  {{ $t("table.delete") }}
                </el-button>
              </div>
            </el-card>
          </div>
          <el-button
            v-if="prodData[0] == null"
            @click="selectProds"
          >
            {{
              $t("product.select")
            }}
          </el-button>
        </el-form-item>

        <div>
          <el-form-item
            :label="$t('distributionProd.rewardRatio')"
            prop="awardType"
          >
            <el-radio-group v-model="dataForm.awardMode">
              <el-radio :label="0">
                {{ $t("distributionProd.proporteward") }}
              </el-radio>
              <el-radio :label="1">
                {{ $t("distributionProd.rewardByFixedValue") }}
                <el-tooltip
                  class="item"
                  effect="light"
                  placement="top"
                >
                  <template #content>
                    <div>{{ $t("distributionProd.tips") }}</div>
                  </template>
                  <span>
                    <el-icon><QuestionFilled /></el-icon>
                  </span>
                </el-tooltip>
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            :label="$t('distributionProd.inviterReward')"
            prop="awardType"
          >
            <el-radio-group v-model="dataForm.parentAwardSet">
              <el-radio :label="0">
                {{ $t("station.close") }}
              </el-radio>
              <el-radio :label="1">
                {{ $t("distributionProd.turnOn") }}
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            :label=" $t('distributionProd.rewardAmount')"
            prop="awardType"
          >
            <div>
              <el-input
                v-model="dataForm.awardNumbers"
                :precision="2"
                :min="0"
                type="number"
                style="width: 200px"
              >
                <template #append>
                  <span v-if="dataForm.awardMode === 1">{{
                    $t("admin.dollar")
                  }}</span>
                  <span v-else>%</span>
                </template>
              </el-input>

              <span
                v-if="dataForm.parentAwardSet === 1"
              >&nbsp; {{ $t("distributionProd.inviterRewardAmount") }}:</span>
              <el-input
                v-if="dataForm.parentAwardSet === 1"
                v-model="dataForm.parentAwardNumbers"
                :precision="2"
                type="number"
                :min="0"
                style="width: 200px"
              >
                <template #append>
                  <span v-if="dataForm.awardMode === 1">{{
                    $t("admin.dollar")
                  }}</span>
                  <span v-else>%</span>
                </template>
              </el-input>
            </div>
          </el-form-item>
        </div>

        <el-form-item
          v-if="!editFlag"
          :label="$t('product.status') + ':'"
          prop="state"
        >
          <el-radio-group v-model="dataForm.state">
            <el-radio :label="1">
              {{ $t("distributionProd.UpperShelf") }}
            </el-radio>
            <el-radio :label="0">
              {{ $t("distributionProd.LowerShelf") }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            @click="handleDialogClose()"
          >{{
            $t("table.cancel")
          }}</el-button>
          <el-button
            type="primary"
            @click="onSubmit()"
          >{{
            $t("table.confirm")
          }}</el-button>
        </span>
      </template>
      <prods-select
        v-if="prodSelectVisible"
        ref="prodSelectRef"
        :is-single="true"
        :distribution-judgment="true"
        @refresh-select-prods="selectDiscountProds"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import * as api from '@/api/distributionProd/distributionProd.js'
import Big from 'big.js'
import ProdsSelect from '@/components/prods-select/index.vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

const dataForm = reactive({
  spuId: 0,
  state: 1,
  awardMode: 0,
  awardNumbers: '',
  parentAwardNumbers: '',
  parentAwardSet: 0,
  distributionSpuId: 0
})

const prodData = ref([])
const isSubmit = ref(false)
const visible = ref(false)
const editFlag = ref(null)
const dataFormRef = ref(null)

const init = (data) => {
  visible.value = true
  isSubmit.value = false
  dataForm.distributionSpuId = 0
  if (data) {
    editFlag.value = true
    dataForm.state = data.distributionInfo.state
    dataForm.awardMode = data.distributionInfo.awardMode
    dataForm.awardNumbers = data.distributionInfo.awardNumbers
    dataForm.parentAwardNumbers = data.distributionInfo.parentAwardNumbers
    dataForm.parentAwardSet = data.distributionInfo.parentAwardSet
    dataForm.distributionSpuId = data.distributionInfo.distributionSpuId
    dataForm.spuId = data.spuId
    dataForm.awardNumbers = parseFloat(bigActualTotal(parseFloat(dataForm.awardNumbers), 100)) // 直推价*100
    dataForm.parentAwardNumbers = parseFloat(bigActualTotal(parseFloat(dataForm.parentAwardNumbers), 100)) // 间推价*100
    data.priceFee = data.priceFee = new Big(data.priceFee).div(100).toFixed(2)
    prodData.value[0] = data
  } else {
    nextTick(() => {
      dataFormRef.value?.resetFields()
      dataForm.awardMode = 0
      dataForm.parentAwardSet = 0
      dataForm.awardNumbers = 1
      dataForm.parentAwardNumbers = 1
      dataForm.state = 1
      editFlag.value = null
      prodData.value = []
    })
  }
}

// 删除关联商品数据
const deleteRelation = () => {
  dataForm.spuId = null
  prodData.value = []
}

// 选择商品
const prodSelectVisible = ref(false)
const prodSelectRef = ref(null)
const selectProds = () => {
  prodSelectVisible.value = true
  nextTick(() => {
    prodSelectRef.value?.init(null, 1)
  })
}

// 商品选择回调
const selectDiscountProds = (prods) => {
  if (prods) {
    dataForm.spuId = prods.spuId
    prodData.value[0] = prods
  }
}

const checkAwardNumberSet = () => {
  return checkAwardNumbers(dataForm.awardNumbers) ||
    (dataForm.parentAwardSet === 1 && checkAwardNumbers(dataForm.parentAwardNumbers))
}

// 表单提交
const onSubmit = () => {
  if (prodData.value[0] == null) {
    ElMessage.error($t('distributionProd.pleaseSelectAProduct'))
    return
  }
  if (checkAwardNumberSet()) {
    return
  }
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      const param = JSON.parse(JSON.stringify(dataForm))
      param.awardNumbers = parseFloat(bigProductTotalAmount(parseFloat(param.awardNumbers), 100)) // 直推价*100
      param.parentAwardNumbers = parseFloat(bigProductTotalAmount(parseFloat(param.parentAwardNumbers), 100)) // 间推价*100
      if (isSubmit.value) {
        return false
      }
      isSubmit.value = true
      if (editFlag.value) {
        api.update({ ...param }).then(() => {
          successFun(param)
        }).catch(() => {
          isSubmit.value = false
        })
      } else {
        api.save({ ...param }).then(() => {
          successFun(param)
        }).catch(() => {
          isSubmit.value = false
        })
      }
    }
  })
}

const successFun = (param) => {
  param.awardNumbers = parseFloat(bigActualTotal(parseFloat(dataForm.awardNumbers), 100)) // 直推价*100
  param.parentAwardNumbers = parseFloat(bigActualTotal(parseFloat(dataForm.parentAwardNumbers), 100)) // 间推价*100
  ElMessage({
    message: $t('table.actionSuccess'),
    type: 'success',
    duration: 1500,
    onClose: () => {
      visible.value = false
      emit('refreshDataList')
    }
  })
}

// 弹窗关闭
const handleDialogClose = () => {
  visible.value = false
  emit('refreshDataList')
}

const checkAwardNumbers = (number) => {
  if (!number && number !== 0) {
    ElMessage.error($t('distributionProd.valueSetBeEmpty'))
    return true
  }
  const regex = /^(([1-9][0-9]*)|((0\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
  if (!regex.test(parseFloat(number))) {
    ElMessage.error($t('distributionProd.valueSetting'))
    return true
  }
  // 总奖励金额/总奖励比例
  const total = dataForm.parentAwardSet ? parseFloat(dataForm.parentAwardNumbers) + parseFloat(dataForm.awardNumbers) : dataForm.awardNumbers
  const maxValue = !dataForm.awardMode ? 100 : prodData.value[0].priceFee

  if (+total > +maxValue) {
    ElMessage.error(`
      ${$t('distributionProd.rewardAmount')}
      ${dataForm.parentAwardSet ? ' + ' + $t('distributionProd.inviterReward') : ''}
      ${$t(`distributionProd.${dataForm.awardMode ? 'totalAwardOverProdPrirceTips' : 'totalAwardOverTips'}`)}
    `)
    return true
  }
}

// 精度运算-乘法
const bigProductTotalAmount = (a, b) => {
  return new Big(a).times(b).valueOf()
}
// 精度运算-除法
const bigActualTotal = (a, b) => {
  if (a == null) {
    return ''
  }
  return new Big(a).div(b).valueOf()
}

defineExpose({ init })
</script>
<style lang="scss" scoped>
.component-distribution-prod-add-or-update {
  :deep(.el-input__inner) {
    padding: 2px;
    border-radius: 3px;
  }
}
.table-template > * {
  display: inline-block;
  margin: auto;
}
.prod-bottom {
  padding: 0 5px;
  line-height: 16px;
  overflow: hidden;
}
.prod-bottom > span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.flex-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
