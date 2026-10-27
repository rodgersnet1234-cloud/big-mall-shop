<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dataForm.shopBankCardId ? '修改账户' : '新增账户'"
    :close-on-click-modal="false"
    :append-to-body="true"
    width="600px"
    class="component-shop-setting-add-or-update"
    @close="closeDialog"
  >
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="rules"
      :label-width="paySettlementType===1?'120px':'100px'"
      @submit.prevent
    >
      <el-form-item
        v-if="paySettlementType===1"
        prop="bankCardPro"
        label="账户类型"
      >
        <el-radio-group v-model="dataForm.bankCardPro">
          <el-radio
            :disabled="!(legalCardNumber<1)"
            :label="0"
          >
            法人账户
          </el-radio>
          <el-radio
            :disabled="!(cardNumber<10)"
            :label="1"
          >
            对公账户
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="paySettlementType===1&&dataForm.bankCardPro===1"
        prop="parentBankName"
        label="银行名称"
      >
        <el-select
          v-model="selectBank"
          filterable
          placeholder="请选择"
          style="width:400px"
          @change="changeBank"
        >
          <el-option
            v-for="item in bankList"
            :key="item.bankId"
            :label="item.bankName"
            :value="item.bankName"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="paySettlementType===1&&dataForm.bankCardPro===1"
        prop="bankName"
        label="开户支行名称"
      >
        <el-input
          v-model.trim="dataForm.bankName"
          placeholder="如：“中国工商银行股份有限公司北京樱桃园支行”"
          maxlength="20"
          style="width: 400px;"
        />
      </el-form-item>
      <el-form-item
        v-if="paySettlementType===1&&dataForm.bankCardPro===1"
        prop="accountNo"
        label="企业对公账户"
      >
        <el-input
          v-model.trim="dataForm.accountNo"
          placeholder="请输入企业对公账户"
          maxlength="23"
          style="width: 400px;"
          @input="(val)=>{ dataForm.accountNo = val.replace(/[^\d]/g,'') }"
        />
      </el-form-item>
      <el-form-item
        v-if="paySettlementType===1&&dataForm.bankCardPro===1"
        prop="unionBank"
        label="支付行号"
      >
        <el-input
          v-model.trim="dataForm.unionBank"
          placeholder="请输入支付行号"
          maxlength="12"
          style="width: 400px;"
          @input="(val)=>{ dataForm.unionBank = val.replace(/[^\d]/g,'') }"
        />
      </el-form-item>
      <el-form-item
        v-if="paySettlementType===0"
        prop="bankName"
        label="银行名称"
      >
        <el-input
          v-model.trim="dataForm.bankName"
          placeholder="输入银行名称"
          maxlength="20"
          style="width: 400px;"
        />
      </el-form-item>
      <el-form-item
        v-if="paySettlementType===0"
        prop="branchName"
        label="支行名称"
      >
        <el-input
          v-model.trim="dataForm.branchName"
          placeholder="输入支行"
          maxlength="20"
          style="width: 400px;"
        />
      </el-form-item>
      <el-form-item
        v-if="paySettlementType===0"
        prop="recipientName"
        label="账户名"
      >
        <el-input
          v-model.trim="dataForm.recipientName"
          placeholder="输入账户名"
          maxlength="20"
          style="width: 400px;"
        />
      </el-form-item>
      <el-form-item
        v-if="paySettlementType===0||(paySettlementType===1&&dataForm.bankCardPro===0)"
        prop="cardNo"
        label="账号"
      >
        <el-input
          v-model="dataForm.cardNo"
          placeholder="输入账号"

          maxlength="23"
          style="width: 400px;"
          @input="onCardNoInput"
        />
      </el-form-item>
      <el-form-item
        v-if="paySettlementType===1&&dataForm.bankCardPro===0"
        prop="identityNo"
        label="身份证"
      >
        <el-input
          v-model="dataForm.identityNo"
          placeholder="请输入身份证号"
          style="width: 400px;"
          maxlength="20"
        />
      </el-form-item>
      <el-form-item
        v-if="paySettlementType===1&&dataForm.bankCardPro===0"
        prop="mobile"
        label="手机号"
      >
        <el-input
          v-model="dataForm.mobile"
          placeholder="请输入银行预存手机号"
          style="width: 400px;"
          maxlength="11"
          @input="(val)=>{ dataForm.mobile=val.replace(/[^\d]/g,'') }"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div>
        <el-button
          @click="dialogVisible = false"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitForm"
        >
          提交
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/multishop/shop-process.js'
import { isMobile, validNoEmptySpace, checkIDCard } from '@/utils/validate.js'
import { Debounce } from '@/utils/debounce.js'

import { ElMessage } from 'element-plus'

const props = defineProps({
  cardNumber: {
    type: Number,
    default: 0
  },
  legalCardNumber: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits('refreshDataList')

const allinPayStore = useAllinpayStore()
const paySettlementType = ref(allinPayStore.paySettlementType)
const dialogVisible = ref(false)

const dataForm = reactive({
  bankName: '',
  recipientName: '',
  cardNo: '',
  branchName: '',
  isDefault: 0,
  shopBankCardId: null,
  // 以下为通联支付
  mobile: '', // 银行预存手机号
  bankCardPro: props.cardNumber < 10 ? 1 : 0, // 银行卡类型 0：法人账户 1：对公账户
  unionBank: '', // 支付行号
  accountNo: '', // 企业对公账户
  parentBankName: '', // 银行名称
  identityNo: '' // 身份证号
})

const setDataForm = (val) => {
  dataForm.bankName = val.bankName
  dataForm.recipientName = val.recipientName
  dataForm.cardNo = val.cardNo
  dataForm.branchName = val.branchName
  dataForm.isDefault = val.isDefault
  dataForm.shopBankCardId = val.shopBankCardId
  dataForm.mobile = val.mobile
  dataForm.bankCardPro = val.bankCardPro
  dataForm.unionBank = val.unionBank
  dataForm.accountNo = val.accountNo
  dataForm.parentBankName = val.parentBankName
  dataForm.identityNo = val.identityNo
}

const bankList = ref([])
const selectBank = ref('')
const validEmptyTab = (rule, value, callback) => {
  if (validNoEmptySpace(value)) {
    callback(new Error($t('multishop.shopInformation.EmptyTips')))
  } else {
    callback()
  }
}
const validateMobile = (rule, value, callback) => {
  if (!isMobile(value)) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}
const validIDCard = (rule, value, callback) => {
  if (!value || !checkIDCard(value)) {
    callback(new Error('请输入正确的法人身份证'))
  } else {
    callback()
  }
}

const rules = computed(() => {
  return {
    bankName: [
      { required: true, message: '银行名称不能为空', trigger: 'blur' },
      { min: 2, max: 20, message: '银行名称长度在2到20个字符', trigger: 'blur' }
    ],
    recipientName: [
      { required: true, message: '账户名不能为空', trigger: 'blur' },
      { min: 2, max: 20, message: '账户名长度在2到20个字符', trigger: 'blur' }
    ],
    cardNo: [
      { required: true, message: '账号不能为空', trigger: 'blur' },
      { min: 8, max: 30, message: '账号在8到30个字符', trigger: 'blur' },
      { validator: validEmptyTab, trigger: 'blur' }
    ],
    branchName: [
      { required: true, message: '支行名称不能为空', trigger: 'blur' },
      { min: 2, max: 20, message: '支行名称长度在2到20个字符', trigger: 'blur' }
    ],
    identityNo: [
      { required: true, message: '身份证号码不能为空', trigger: 'blur' },
      { validator: validIDCard, trigger: 'blur' }
    ],
    mobile: [
      { required: true, message: '手机号不能为空', trigger: 'blur' },
      { validator: validateMobile, trigger: 'blur' }
    ],
    unionBank: [
      { required: true, message: '请输入支付行号', trigger: 'blur' },
      { min: 12, max: 12, message: '请输入12位数字', trigger: 'blur' }
    ],
    parentBankName: [
      { required: true, message: '请填写开户银行名称', trigger: 'change' }
    ],
    accountNo: [
      { required: true, message: '企业对公账户不能为空', trigger: 'blur' }
    ]
  }
})

const init = (shopBankCardId) => {
  dialogVisible.value = true
  nextTick(() => {
    getBankList()
    dataForm.shopBankCardId = shopBankCardId || null
    if (!shopBankCardId) {
      dataForm.isDefault = 0
      return
    }
    api.getBankCartInfo(shopBankCardId).then(data => {
      setDataForm(data)
    })
  })
}

defineExpose({ init })

/**
 * 创建或修改账号
 */
const dataFormRef = ref('')
const submitForm = Debounce(() => {
  dataFormRef.value?.validate(valid => {
    if (!valid) {
      return
    }
    let request
    if (paySettlementType.value === 1) {
      // 通联支付
      if (dataForm.bankCardPro === 1) {
        // 对公账户
        const _dataForm = {
          accountNo: dataForm.accountNo,
          bankName: dataForm.bankName,
          parentBankName: dataForm.parentBankName,
          unionBank: dataForm.unionBank
        }
        request = api.bindAllinpayCorporateBankCart(_dataForm)
      } else {
        // 法人账户
        const _dataForm = {
          cardNo: dataForm.cardNo,
          phone: dataForm.mobile,
          identityNo: dataForm.identityNo
        }
        request = api.requestBindAllinpayLegalBankCart(_dataForm)
      }
    } else {
      request = dataForm.shopBankCardId ? api.updateBankCart(dataForm) : api.saveBankCart(dataForm)
    }
    request.then(() => {
      ElMessage({
        message: '保存成功',
        type: 'success',
        duration: 1000
      })
      dialogVisible.value = false
      emit('refreshDataList')
      dataFormRef.value?.resetFields()
    })
  })
})

// 获取银行列表
const getBankList = () => {
  api.getBankList().then(data => {
    bankList.value = data
  })
}
const changeBank = (val) => {
  dataForm.parentBankName = val
}
const closeDialog = () => {
  dataFormRef.value?.resetFields()
  selectBank.value = ''
}
const onCardNoInput = (value, index) => {
  dataForm.cardNo = value.replace(/[^\d]/g, '')
}
</script>
