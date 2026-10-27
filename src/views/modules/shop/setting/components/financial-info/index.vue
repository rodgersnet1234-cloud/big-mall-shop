<template>
  <div class="component-financial-info">
    <!-- 财务信息 -->
    <div class="financial-info">
      <div class="table-box">
        <!-- 通联开启情况下，申请待审核和审核成功显示 -->
        <template v-if="(paySettlementType===1 && !(companyInfoProcessStatus===0 || companyInfoProcessStatus===3) || paySettlementType !== 1)">
          <div class="table-data-title">
            <div class="text">
              <span class="stress">*</span>结算银行账户
            </div>
            <div
              v-if="paySettlementType!==1"
              class="tips"
            >
              已添加
              <span class="txt-bold">{{ settlementAccounts.length }}</span>
              个结算账户，最多可添加
              <span class="txt-bold">5</span>
              个结算账户
            </div>
            <div
              v-if="paySettlementType===1"
              class="tips"
            >
              已添加
              <span class="txt-bold">{{ cardNumber }}</span>
              个结算账户，最多可添加
              <span class="txt-bold">10</span>
              个结算账户
              <span>
                ，
                <span class="txt-bold">1</span>
                个法人账户
              </span>
              <span v-if="mobile">
                ，绑定手机号：<span class="txt-bold">{{ mobile }}</span>
              </span>
            </div>
          </div>
          <el-button
            v-if="settlementAccounts.length < 5 || (paySettlementType===1 && (legalCardNumber<1 || cardNumber<10))"
            v-permission="['shop:shopBankCard:save']"
            class="create-btn"
            type="primary"
            @click="showDialog(null)"
          >
            新增账号
          </el-button>
          <el-button
            v-if="!mobile && paySettlementType===1"
            class="create-btn"
            @click="showMobileDialog"
          >
            绑定手机号
          </el-button>
          <el-button
            v-if="mobile && paySettlementType===1"
            class="create-btn"
            @click="showMobileDialog"
          >
            解除绑定
          </el-button>
          <el-button
            v-if="!(legalAcctProtocolNo&&acctProtocolNo) && paySettlementType===1"
            class="create-btn"
            @click="showSignDialog"
          >
            签约协议
          </el-button>
        </template>
        <template v-else>
          <div class="table-data-title">
            <div class="text">
              <span class="stress">*</span>结算银行账户
            </div>
            <div class="tips">
              请添加1个对公账户
            </div>
          </div>
        </template>
        <div class="main-content">
          <el-table
            v-if="(paySettlementType===1 && !(companyInfoProcessStatus===0 || companyInfoProcessStatus===3) || paySettlementType !== 1)"
            :data="settlementAccounts"
            style="width: 100%"
            header-cell-class-name="table-header"
            row-class-name="table-row-low"
            :cell-style="{ padding:'0px'}"
            class="table-con"
          >
            <el-table-column
              align="left"
              prop="bankName"
              min-width="140"
              label="银行名称"
            />
            <el-table-column
              align="left"
              prop="recipientName"
              :min-width="paySettlementType===1?'130':null"
              label="账户名"
            >
              <template #default="scope">
                <div class="recipient-name">
                  <span>{{ scope.row.recipientName }}</span>
                  <div
                    v-if="paySettlementType===1&&scope.row.bankCardPro===0"
                    class="tip"
                  >
                    法人账户
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="left"
              :prop="paySettlementType===1?'bankCardNo':'cardNo'"
              min-width="150"
              label="账号"
            />
            <el-table-column
              align="left"
              prop="branchName"
              min-width="200"
              label="支行名称"
            />
            <!-- <el-table-column
              align="left"
              prop="cardNo"
              label="身份证号码"
            />
            <el-table-column
              align="left"
              prop="branchName"
              label="手机号"
            /> -->
            <el-table-column
              align="center"
              prop="isDefault"
              label="主账号"
              width="100"
            >
              <template #default="scope">
                <span>{{ scope.row.isDefault ? '是' : '否' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="操作"
              width="230"
            >
              <template #default="scope">
                <el-button
                  v-if="paySettlementType!==1"
                  v-permission="['shop:shopBankCard:update']"
                  type="primary"
                  link
                  @click="showDialog(scope.row.shopBankCardId)"
                >
                  编辑
                </el-button>
                <el-button
                  v-if="(!scope.row.isDefault)"
                  v-permission="['shop:shopUser:update']"
                  type="primary"
                  link
                  @click="setMainAccountById(scope.row.shopBankCardId)"
                >
                  设为主账号
                </el-button>
                <el-button
                  v-if="scope.row.isDefault===1"
                  v-permission="['shop:shopUser:notmain']"
                  type="primary"
                  link
                  @click="setNotMainAccountById(scope.row.shopBankCardId)"
                >
                  取消主账号
                </el-button>
                <el-button
                  v-if="paySettlementType!==1||(paySettlementType===1&&scope.row.bankCardPro===0 )"
                  v-permission="['shop:shopUser:delete']"
                  type="primary"
                  link
                  @click="deleteBankCartById(scope.row.cardNo, scope.row.shopBankCardId)"
                >
                  {{ paySettlementType===1?'解绑':'删除' }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- native modifier has been removed, please confirm whether the function has been affected  -->
          <el-form
            v-if="(companyInfoProcessStatus===0 || companyInfoProcessStatus===3) && paySettlementType===1"
            ref="bankCartInfoFormRef"
            :model="bankCartInfoForm"
            :rules="bankCartInfoForm.rule"
            @submit.prevent
          >
            <el-table
              ref="bankTableRef"
              class="add-bank-info-table"
              :data="bankCartInfoForm.data"
              :header-cell-style="{height:'50px',background:'#F5F5F5',color:'#000','font-weight': '400'}"
              style="width: 100%"
            >
              <el-table-column
                type="index"
                label="序号"
                width="80"
              />
              <el-table-column
                prop="parentBankName"
                label="银行名称"
              >
                <template #default="scope">
                  <el-form-item
                    :prop="'data.' + scope.$index + '.parentBankName'"
                    :rules="bankCartInfoForm.rule.parentBankName"
                  >
                    <el-select
                      v-model="selectBank"
                      filterable
                      placeholder="请选择"
                      style="width:200px"
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
                </template>
              </el-table-column>
              <el-table-column
                prop="bankName"
                label="开户分行名称"
              >
                <template #default="scope">
                  <el-form-item
                    :prop="'data.' + scope.$index + '.bankName'"
                    :rules="bankCartInfoForm.rule.bankName"
                  >
                    <el-input
                      v-model="scope.row.bankName"
                      maxlength="20"
                      placeholder="例如：南京市雨花区雨花支行"
                      style="width:200px"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="accountNo"
                label="企业对公账户"
              >
                <template #default="scope">
                  <el-form-item
                    :prop="'data.' + scope.$index + '.accountNo'"
                    :rules="bankCartInfoForm.rule.accountNo"
                  >
                    <el-input
                      v-model.trim="scope.row.accountNo"
                      maxlength="23"
                      oninput="value=value.replace(/[^\d]/g,'')"
                      placeholder="请输入企业对公账户"
                      style="width:200px"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="unionBank"
                label="支付行号"
              >
                <template #default="scope">
                  <el-form-item
                    :prop="'data.' + scope.$index + '.unionBank'"
                    :rules="bankCartInfoForm.rule.unionBank"
                  >
                    <el-input
                      v-model="scope.row.unionBank"
                      placeholder="请输入12位的支付行号"
                      oninput="value=value.replace(/[^\d]/g,'')"
                      maxlength="12"
                      style="width:200px"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
          <div
            v-if="(companyInfoProcessStatus===0 || companyInfoProcessStatus===3) && paySettlementType===1"
            class="footer"
          >
            <div class="foot-box">
              <div
                class="btn"
                @click="toNextStep"
              >
                提交
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- /财务信息 -->
    <!-- 账号管理 -->
    <addOrUpdate
      v-if="dialogVisible"
      ref="addOrUpdateRef"
      :card-number="cardNumber"
      :legal-card-number="legalCardNumber"
      @refresh-data-list="queryShopFinancialInfo"
    />
    <!-- 绑定手机号 -->
    <mobile-add-or-update
      v-if="mobileDialogVisible"
      ref="mobileAddOrUpdateRef"
      :is-have-mobile="!!mobile"
      @refresh-data-form="queryCompany"
    />
    <!-- 签约协议 -->
    <sign-acct-protocol
      v-if="signDialogVisible"
      ref="signAcctProtocolRef"
      :acct-protocol-no="acctProtocolNo"
      :legal-acct-protocol-no="legalAcctProtocolNo"
      :mobile="mobile"
      :legal-card-number="legalCardNumber"
    />
  </div>
</template>

<script setup>
import * as api from '@/api/multishop/shop-process'
import addOrUpdate from '../add-or-update/index.vue'
import mobileAddOrUpdate from '../mobile-add-or-update/index.vue'
import signAcctProtocol from '../sign-acct-protocol/index.vue'
import { validNoEmptySpace } from '@/utils/validate'
import { ElMessage, ElMessageBox } from 'element-plus'

const emit = defineEmits('changeActiveName')

// 店铺财务信息
const settlementAccounts = ref([])
const dialogVisible = ref(false)

const allinpayStore = useAllinpayStore()
const paySettlementType = ref(allinpayStore.paySettlementType)
const mobile = ref('') // 绑定的手机号 通联
const mobileDialogVisible = ref(false)
const acctProtocolNo = ref('') // 签约提现协议号
const legalAcctProtocolNo = ref('') // 法人签约提现协议号
const signDialogVisible = ref(false)
const legalCardNumber = ref(0) // 法人账户数量
const cardNumber = ref(0) // 非法人账户数量
const validEmptyTab = (rule, value, callback) => {
  if (validNoEmptySpace(value)) {
    callback(new Error('内容不能全为空格'))
  } else {
    callback()
  }
}
const bankCartInfoForm = reactive({
  data: [
    {
      bankName: '',
      recipientName: '',
      cardNo: '',
      branchName: '',
      accountNo: '', // 企业对公账户
      parentBankName: '', // 开户银行名称
      unionBank: '', // 支付行号 12位数字
      bankCardPro: 1 // 银行卡属性 0法人 1企业对公
    }
  ],
  rule: {
    bankName: [
      { required: true, message: '请填写开户支行名称', trigger: 'blur' },
      { min: 2, max: 20, message: '开户支行名称长度在2到20个字符', trigger: 'blur' },
      { validator: validEmptyTab, trigger: 'blur' }
    ],
    cardNo: [
      { required: true, message: '账号不能为空', trigger: 'blur' },
      { min: 8, max: 30, message: '账号在8到30个字符', trigger: 'blur' },
      { validator: validEmptyTab, trigger: 'blur' }
    ],
    branchName: [
      { required: true, message: '支行名称不能为空', trigger: 'blur' },
      { min: 2, max: 20, message: '支行名称长度在2到20个字符', trigger: 'blur' },
      { validator: validEmptyTab, trigger: 'blur' }
    ],
    accountNo: [
      { required: true, message: '请填写企业对公账户', trigger: 'blur' }
    ],
    parentBankName: [
      { required: true, message: '请填写开户银行名称', trigger: 'change' }
    ],
    unionBank: [
      { required: true, message: '请填写支付行号', trigger: 'blur' },
      { min: 12, max: 12, message: '请填写正确的支付行号', trigger: 'blur' }
    ]
  }
})
const selectBank = ref('') // 选择的银行，通联
const bankList = ref([]) // 银行列表，通联
const submit = ref(false)

const companyInfoProcessStatus = computed(() => {
  return useAllinpayStore.companyInfoProcessStatus
})

onMounted(() => {
  if ((companyInfoProcessStatus.value === 0 || companyInfoProcessStatus.value === 3) && paySettlementType.value === 1) {
    getBankList()
  }
  // 查询财务信息
  queryShopFinancialInfo()
  if (paySettlementType.value === 1 && companyInfoProcessStatus.value !== 0 && companyInfoProcessStatus.value !== 3) {
    // 查询企业信息
    queryCompany()
  }
})

/**
 * 查询财务信息
 */
const queryShopFinancialInfo = () => {
  api.getBankCartInfoList().then(data => {
    if (paySettlementType.value === 1 && data && data.length > 0) {
      legalCardNumber.value = data.filter(item => item.bankCardPro === 0).length
      cardNumber.value = data.length - legalCardNumber.value
      bankCartInfoForm.data = [{
        ...data[0],
        parentBankName: data[0].bankName,
        bankName: data[0].branchName,
        accountNo: data[0].bankCardNo
      }]
      selectBank.value = data[0].bankName
    }
    settlementAccounts.value = data
  })
}
// 查询企业信息（通联支付）
const queryCompany = () => {
  api.getBasicInfo().then(data => {
    acctProtocolNo.value = data.companyAcctProtocolNo
    legalAcctProtocolNo.value = data.legalAcctProtocolNo
  })
  api.getAllinpayCompanyInfo().then(data => {
    mobile.value = data.phone
  })
}
/**
 * 新增账号
 */
const addOrUpdateRef = ref('')
const showDialog = (shopBankCardId) => {
  dialogVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(shopBankCardId)
  })
}

// 删除银行卡
const deleteBankCartById = (cardNo, shopBankCardId) => {
  if (paySettlementType.value === 1) {
    ElMessageBox.confirm('是否解绑法人账号?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      api.unbindAllinpayBankCart({ cardNo, shopBankCardId }).then(() => {
        ElMessage({
          message: '删除成功',
          type: 'success',
          duration: 1000
        })
        queryShopFinancialInfo()
      })
    })
    return
  }
  const tailNumber = cardNo.substring(cardNo.length - 4)
  ElMessageBox.confirm('是否确认删除尾号' + tailNumber + '的结算账户?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    api.deleteBankCart(shopBankCardId).then(() => {
      ElMessage({
        message: '删除成功',
        type: 'success',
        duration: 1000
      })
      queryShopFinancialInfo()
    })
  })
}

// 设置主账号
const setMainAccountById = (shopBankCardId) => {
  api.setMainAccount(shopBankCardId).then(() => {
    ElMessage({
      message: '设置成功',
      type: 'success',
      duration: 1000
    })
    queryShopFinancialInfo()
  })
}

// 取消主账号
const setNotMainAccountById = (shopBankCardId) => {
  api.setNotMainAccount(shopBankCardId).then(() => {
    ElMessage({
      message: '设置成功',
      type: 'success',
      duration: 1000
    })
    queryShopFinancialInfo()
  })
}
// 绑定/解绑手机号
const mobileAddOrUpdateRef = ref('')
const showMobileDialog = () => {
  mobileDialogVisible.value = true
  nextTick(() => {
    mobileAddOrUpdateRef.value?.init(mobile.value)
  })
}

// 签约协议
const signAcctProtocolRef = ref('')
const showSignDialog = () => {
  signDialogVisible.value = true
  queryCompany()
  nextTick(() => {
    signAcctProtocolRef.value.init()
  })
}

// 获取可选银行名称列表（通联）
const getBankList = () => {
  api.getBankList().then(data => {
    bankList.value = data
  })
}

const changeBank = (value) => {
  bankCartInfoForm.data[0].parentBankName = value
}

// 提交
const bankCartInfoFormRef = ref('')
const toNextStep = Debounce(() => {
  bankCartInfoFormRef.value?.validate((valid) => {
    if (valid) {
      if (submit.value) {
        return
      }
      submit.value = true
      const req = api.saveAllinpayBankCartInfo(bankCartInfoForm.data[0])
      req.then(() => {
        ElMessage({
          message: '提交申请成功！',
          type: 'success',
          duration: 1500
        })
        if (paySettlementType.value === 1) {
          location.reload()
          return
        }
        emit('changeActiveName', '1')
        // 获取银行卡列表
        // getBankCartInfo()
      }).finally(() => {
        submit.value = false
      })
    }
  })
}, 1500)
</script>

<style lang="scss" scoped>
@use "index";
</style>
