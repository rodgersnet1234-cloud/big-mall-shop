<template>
  <el-dialog
    v-model="isCaswithdrawal"
    title="提现"
    class="component-cash-withdrawal"
    :close-on-click-modal="false"
    top="8vh"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-width="120px"
      @submit.prevent
    >
      <el-form-item
        label="店铺名称："
        prop="shopName"
      >
        <span class="shop-name">{{ dataForm.shopName }}</span>
      </el-form-item>

      <el-form-item
        label="可提现余额："
        prop="withdrawalAmount"
      >
        <span class="withdrawalAmount">{{ settledAmount }}元</span>
      </el-form-item>

      <el-form-item
        label="本次提现："
        prop="amount"
      >
        <div class="full-width">
          <div class="withdrawal-int">
            <el-input
              v-model="dataForm.amount"
              type="number"
              :min="0"
              :max="settledAmount"
              placeholder="请输入本次提现金额"
              @change="handleInput"
            />
            <el-button
              v-if="(paySettlementType!==1 && settledAmount >= 1)||(paySettlementType===1 && settledAmount > Number(platformWithdrawalSetting.withdrawCashLeast))"
              type="primary"
              link
              style="margin-left: 10px"
              @click="allWithdrawals"
            >
              全部提现
            </el-button>
          </div>
        </div>
      </el-form-item>

      <el-form-item
        label="到账银行卡："
        prop="shopBankCardId"
      >
        <div class="full-width">
          <div
            v-if="bankCardList.length"
            class="bankcard-box"
          >
            <div
              v-for="(item,index) in bankCardList"
              :key="index"
              :class="['bankcard',dataForm.shopBankCardId === item.shopBankCardId?'active':'']"
              @click="clickCard(item.shopBankCardId)"
            >
              <div
                v-if="paySettlementType!==1"
                class="close-icon"
                @click="deleteBankCartById(item.cardNo, item.shopBankCardId)"
              >
                ×
              </div>
              <div class="card-num">
                {{ item.cardNo }}<span
                  v-if="item.bankCardPro===0"
                  class="tip"
                >法人账户</span>
              </div>
              <div class="card-bottom">
                <div class="card-name">
                  {{ item.bankName }}
                </div>
                <div
                  v-if="item.isDefault"
                  class="default"
                >
                  默认银行卡
                </div>
                <div
                  v-if="!item.isDefault"
                  class="chooseDefault"
                >
                  <el-button
                    type="primary"
                    link
                    @click="setDefault(item.shopBankCardId)"
                  >
                    设为默认
                  </el-button>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="bankCardList.length < 5 || (paySettlementType===1 && (cardNumber<10 || legalCardNumber<1))"
            class="add-card"
          >
            <el-button
              type="primary"
              link
              @click="addBankCard"
            >
              添加银行卡
            </el-button>
          </div>
        </div>
      </el-form-item>

      <el-form-item
        label="短信验证："
        prop="validCode"
      >
        <div class="full-width">
          <el-input
            v-model="dataForm.validCode"
            maxlength="6"
          />
          <el-button
            type="primary"
            style="margin-left: 30px;width:120px"
            :loading="!!countdown"
            :disabled="!!countdown"
            @click="showCheck"
          >
            {{ countdown? countdown:'获取验证码' }}
          </el-button>
        </div>
      </el-form-item>
      <div
        v-if="isSendCode"
        class="yzm-tips"
      >
        验证码已发送到商家手机号：{{ mobile }}，请注意查看
      </div>
      <br>

      <el-form-item
        label="备注："
        prop="shopRemarks"
      >
        <el-input
          v-model="dataForm.shopRemarks"
          type="textarea"
          :rows="4"
          placeholder="最多可输入60字"
          maxlength="60"
          @input="onHandleInput"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="isCaswithdrawal = false"
        >取消</el-button>
        <el-button
          type="primary"
          @click="onSubmitData"
        >确定</el-button>
      </span>
    </template>

    <addBankCardPop
      v-if="showAddCardPop"
      ref="addBankCardPopRef"
      :card-number="cardNumber"
      :legal-card-number="legalCardNumber"
      @refresh-data-list="getList"
    />
    <Verify
      ref="verify"
      :captcha-type="'blockPuzzle'"
      :img-size="{width:'400px',height:'200px'}"
      @success="getVerificationCode"
    />
  </el-dialog>
</template>

<script setup>
import addBankCardPop from '../../../setting/components/add-or-update/index.vue'
import { deleteBankCart, getBasicInfo } from '@/api/multishop/shop-process.js'
import { validNoEmptySpace } from '@/utils/validate.js'
import { checkDrawCashAmount, getBankCardList, setPrimary, sendWithdrawCode, shopWithdrawCash, applyAllinpayWithdrawCash, confirmAllinpayWithdrawCash, resendAllinpayWithdrawCode } from '@/api/multishop/shop_wallet_log.js'
import { getWithdrawSetting } from '@/api/rbac/web-config.js'
import { Debounce } from '@/utils/debounce.js'
import Big from 'big.js'
import { ElMessageBox, ElMessage } from 'element-plus'

const emit = defineEmits(['getShopWallet'])
const valiShopRemarks = (rule, value, callback) => {
  if (value === null || value === '') {
    dataFormRef.value?.clearValidate('supplierRemarks')
    callback()
  } else if (validNoEmptySpace(value)) {
    callback(new Error($t('shop.allEmpty')))
  } else {
    callback()
  }
}

const showAddCardPop = ref(false) // 添加银行卡弹框
const isCaswithdrawal = ref(true)
const dataForm = reactive({
  shopName: '',
  shopBankCardId: '', // 当前选择的银行卡id
  amount: 0, // 提现金额
  validCode: '', // 验证码
  shopRemarks: '' // 备注
})
const mobile = ref('')
const isSendCode = ref(false)
const dataRule = reactive({
  amount: [
    { required: true, message: '本次提现金额不能为空', trigger: 'blur' }
  ],
  settledAmount: [
    { required: true, message: $t('shop.withdrawaEmpty'), trigger: 'blur' }
  ],
  validCode: [
    { required: true, message: $t('shop.pleaseEnteCode'), trigger: 'blur' }
  ],
  shopBankCardId: [
    { required: true, message: $t('shop.pleSelTheBankCard'), trigger: 'blur' }
  ],
  shopRemarks: [
    { validator: valiShopRemarks, trigger: 'blur' }
  ]
})
const bankCardList = ref([]) // 银行卡列表
const countdown = ref(0)
const legalCardNumber = ref(0) // 法人账户数量
const cardNumber = ref(0) // 非法人账户数量
const bizOrderNo = ref('') // 通联提现订单号

const allinPayStore = useAllinpayStore()
const paySettlementType = ref(allinPayStore.paySettlementType) // 是否开启通联支付 1：开启 0：关闭
const platformWithdrawalSetting = ref({}) // 平台提现设置

const userStore = useUserStore()
onMounted(() => {
  dataForm.shopName = userStore.name
})

const dataFormRef = ref('')
const isFirstApply = ref('')
const settledAmount = ref(0) // 全部可提现余额
const init = (settledAmountPar) => {
  dataFormRef.value?.resetFields() // 每次打开都清空表单
  isSendCode.value = false // 清除是否发送验证码
  isFirstApply.value = true
  isCaswithdrawal.value = true
  settledAmount.value = formatPrice(settledAmountPar, 1)
  if (paySettlementType.value === 1) {
    getPlatformWithdrawalSetting()
  }
  getList()
}

defineExpose({
  init
})
// 点击添加银行卡
const addBankCardPopRef = ref('')
const addBankCard = () => {
  showAddCardPop.value = true
  nextTick(() => {
    addBankCardPopRef.value?.init()
  })
}
// 获取银行卡列表
const getList = () => {
  getBankCardList().then(res => {
    res.sort(function (a, b) {
      return b.isDefault - a.isDefault
    })
    bankCardList.value = res
    bankCardList.value.forEach(item => {
      if (item.isDefault) {
        dataForm.shopBankCardId = item.shopBankCardId
        currentCard = item
      }
    })
    if (paySettlementType.value === 1) {
      legalCardNumber.value = res.filter(item => item.bankCardPro === 0).length
      cardNumber.value = res.length - legalCardNumber.value
    }
  })
}
// 设置默认银行卡
const setDefault = (id) => {
  setPrimary(id).then(() => [
    getList()
  ])
}

let currentCard = {} // 当前银行卡
// 选择银行卡
const clickCard = (cardId) => {
  bankCardList.value.forEach(element => {
    if (element.shopBankCardId === cardId) {
      currentCard = element
    }
  })
  dataForm.shopBankCardId = cardId
}

/**
 * 校验
 */
const handleValidate = async () => {
  if (!settledAmount.value) {
    ElMessage({
      message: '可提现余额不足，本次无法提现！',
      type: 'error',
      duration: 1000
    })
    return false
  }
  if (!dataForm.amount) {
    ElMessage({
      message: '提现金额不能为空！',
      type: 'error',
      duration: 1000
    })
    return false
  }
  const checkPriceRes = await checkPrice()
  if (!checkPriceRes) {
    return false
  }
  if (dataForm.amount > settledAmount.value) {
    ElMessage({
      message: '提现金额不能超过可提现余额',
      type: 'error',
      duration: 1000
    })
    return false
  }
  if (!bankCardList.value.length) {
    ElMessage({
      message: '请先添加银行卡！',
      type: 'error',
      duration: 1000
    })
    return false
  }
  return true
}

const checkPrice = () => {
  return new Promise((resolve) => {
    checkDrawCashAmount(formatPrice(dataForm.amount)).then(data => {
      resolve(data)
    }).catch(() => {
      resolve(false)
    })
  })
}
const verify = ref(null)
const showCheck = async () => {
  if (!currentCard.shopBankCardId) {
    ElMessage({
      message: '请先选择银行卡！',
      type: 'error',
      duration: 1000
    })
    return
  }
  if (!(await handleValidate())) {
    return
  }
  if (paySettlementType.value === 1 && !(await getMissingInfo())) {
    return
  }
  verify.value.show()
}
// 获取验证码
const getVerificationCode = async (verifyResult) => {
  if (!currentCard.shopBankCardId) {
    ElMessage({
      message: '请先选择银行卡！',
      type: 'error',
      duration: 1000
    })
    return
  }
  if (!(await handleValidate())) {
    return
  }
  if (paySettlementType.value === 1 && !(await getMissingInfo())) {
    return
  }
  let request
  if (paySettlementType.value === 1) {
    const data = {
      bankCardNo: currentCard.bankCardNo,
      amount: Number(dataForm.amount || 0) * 100
    }
    // 首次发送验证码为申请提现，非首次为重新发送验证码
    if (!isSendCode.value) {
      request = applyAllinpayWithdrawCash(data)
    } else {
      data.bizOrderNo = bizOrderNo.value
      data.captchaVerification = verifyResult.captchaVerification
      request = resendAllinpayWithdrawCode(data)
    }
  } else {
    request = sendWithdrawCode({ captchaVerification: verifyResult.captchaVerification })
  }
  request.then(data => {
    countdown.value = 60
    // 非通联接口返回手机号
    if (paySettlementType.value !== 1) {
      mobile.value = data
    }
    // 通联支付接口返回的提现订单号，保存提现订单号
    if (paySettlementType.value === 1) {
      bizOrderNo.value = data
    }
    isSendCode.value = true
    getCountdown()
  })
}

// 通联支付根据店铺信息提醒用户缺少的信息
const getMissingInfo = async () => {
  const res = await getBasicInfo()
  const tips = []
  if (currentCard.bankCardPro !== 0 && (res.companyAcctProtocolNo === null || res.companyAcctProtocolNo === '')) {
    tips.push('是否已签约对公户提现协议')
  }
  if (res.isBindPhone !== 1) {
    tips.push('是否已绑定手机')
  }
  if (res.isCreateMember !== 1) {
    tips.push('是否已创建店铺会员')
  }
  if (currentCard.bankCardPro !== 1 && (res.legalAcctProtocolNo === null || res.legalAcctProtocolNo === '')) {
    tips.push('是否已签约法人提现协议')
  }
  if (res.companyInfoProcessStatus !== 2) {
    tips.push('企业信息审核状态是否正常')
  }
  if (res.idCardCollectProcessStatus !== 4) {
    tips.push('影印件状态是否正常')
  }
  if (tips.length > 0) {
    ElMessage({
      message: `请确认${tips.join('、')}！`,
      type: 'error',
      duration: 1500
    })
    return false
  }
  return true
}

// 倒计时1分钟
const getCountdown = () => {
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value === 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 全部提现
const allWithdrawals = () => {
  dataForm.amount = settledAmount.value
}

// 输入事件
const handleInput = () => {
  if (dataForm.amount > settledAmount.value) {
    dataForm.amount = settledAmount.value
  }
  const str = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/
  if (!str.test(dataForm.amount) || dataForm.amount > 999999) {
    dataForm.amount = ''
  }
}

// 删除银行卡
const deleteBankCartById = (cardNo, shopBankCardId) => {
  const tailNumber = cardNo.substring(cardNo.length - 4)
  ElMessageBox.confirm(`是否确认删除尾号${tailNumber}的结算账户?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteBankCart(shopBankCardId).then(() => {
      ElMessage({
        message: '删除成功',
        type: 'success',
        duration: 1000
      })
      getList()
    })
  })
}

/**
 *  提交提现申请 Debounce:防抖函数
 */
const onSubmitData = Debounce(() => {
  dataFormRef.value?.validate(async valid => {
    if (valid) {
      if (!(await handleValidate())) {
        return
      }
      let request
      if (paySettlementType.value === 1) {
        const data = {
          bankCardNo: currentCard.bankCardNo,
          amount: formatPrice(dataForm.amount || 0),
          bizOrderNo: bizOrderNo.value,
          verificationCode: dataForm.validCode
        }
        request = confirmAllinpayWithdrawCash(data)
      } else {
        const data = JSON.parse(JSON.stringify(dataForm))
        data.amount = formatPrice(data.amount)
        request = shopWithdrawCash(data)
      }
      request.then(() => {
        ElMessage({
          message: '提交成功',
          type: 'success',
          duration: 1000,
          onClose: () => {
            isCaswithdrawal.value = false
            dataForm.shopName = ''
            dataForm.shopBankCardId = ''
            dataForm.amount = 0
            dataForm.validCode = null
            dataForm.shopRemarks = ''
            emit('getShopWallet')
          }
        })
      })
    }
  })
}, 1500)

// 获取平台提现设置
const getPlatformWithdrawalSetting = () => {
  getWithdrawSetting().then(data => {
    platformWithdrawalSetting.value = data
    platformWithdrawalSetting.value.withdrawCashLeast = new Big(data.withdrawCashLeast).div(100).toFixed(2).valueOf()
  })
}

const onHandleInput = (value) => {
  dataForm.shopRemarks = value.replace(/[^a-zA-Z0-9(\u4E00-\u9FA5)(，。（）【】{}！,.\-？?!.)]/g, '')
}
</script>

<style lang="scss" scoped>
@use "index";
</style>
