<template>
  <div class="app-container page-shop-detail">
    <div class="tabs-con">
      <el-tabs v-model="activeName">
        <el-tab-pane
          :key="activeName"
          label="基本信息"
          name="1"
        >
          <div v-if="activeName==='1'">
            <alertTips
              :audit-status="auditStatus"
              :company-info-process-status="companyInfoProcessStatus"
              :status-remark="statusRemark"
              :shop-status="shopStatus"
            />
            <basic-information-show
              v-if="isbacisInforShow"
              @close-browse="closeBasicBrowse"
              @change-company-info-process-status="changeCompanyInfoProcessStatus"
            />
            <base-info
              v-else
              @success-update="modifyBaseInfo"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane
          :key="activeName"
          label="工商信息"
          name="2"
        >
          <div v-if="activeName==='2'">
            <alertTips
              :audit-status="auditStatus"
              :company-info-process-status="companyInfoProcessStatus"
              :status-remark="statusRemark"
              :shop-status="shopStatus"
            />
            <business-information-show
              v-if="isbusinessInforShow"
              :company-info-process-status="companyInfoProcessStatus"
              @close-browse="closeBusinessBrowse"
            />
            <business-info
              v-else
              :company-info-process-status="companyInfoProcessStatus"
              @success-update="modifyBusinessInfo"
              @set-active-name="setActiveName"
              @getmodify-information="getmodifyInformation"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane
          :key="activeName"
          label="签约信息"
          name="3"
        >
          <alertTips
            :audit-status="auditStatus"
            :company-info-process-status="companyInfoProcessStatus"
            :status-remark="statusRemark"
            :shop-status="shopStatus"
          />
          <contract-info v-if="activeName==='3'" />
        </el-tab-pane>
        <el-tab-pane
          :key="activeName"
          label="财务信息"
          name="4"
        >
          <alertTips
            :audit-status="auditStatus"
            :company-info-process-status="companyInfoProcessStatus"
            :status-remark="statusRemark"
            :shop-status="shopStatus"
          />
          <financial-info
            v-if="activeName==='4'"
            :company-info-process-status="companyInfoProcessStatus"
            @change-active-name="changeActiveName"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { updateShopAccountProtocolNo, shopCompanyAuditingAuditInfo, getCompanyInfo } from '@/api/multishop/shop-process'
import { ElMessage } from 'element-plus'
import { computed } from 'vue'
import basicInformationShow from './components/basic-information-show/index.vue'
import businessInformationShow from './components/business-information-show/index.vue'
import baseInfo from './components/base-info/index.vue'
import businessInfo from './components/business-info/index.vue'
import contractInfo from './components/contract-info/index.vue'
import financialInfo from './components/financial-info/index.vue'
import alertTips from './components/alert-tips/index.vue'

const route = useRoute()
const allinpayStore = useAllinpayStore()

const activeName = ref(route.query.activeName || '1')
// 浏览基本信息页
const isbacisInforShow = ref(true)
// 浏览工商信息页
const isbusinessInforShow = ref(true)
const paySettlementType = allinpayStore.paySettlementType // 是否开启通联支付 1：开启 0：关闭
const companyInfoProcessStatus = ref(2) // 工商信息审核状态 0:未提交审核 2：审核通过
const statusRemark = ref('') // 审核不通过原因

const auditStatus = computed(() => {
  return allinpayStore.auditStatus // 企业信息审核状态
})
const shopStatus = computed(() => {
  return allinpayStore.shopStatus // 店铺状态 -1:已删除 0: 停业中 1:营业中 2:平台下线 3:待审核 4:店铺申请中 5:申请失败 6:上线申请中 7：系统下线
})

watch(() => companyInfoProcessStatus, (val) => {
  // 通联支付且审核不通过，则获取工商信息审核情况
  if ((val === 3) && paySettlementType === 1) {
    getmodifyInformation()
  }
}, { immediate: true })

watch(() => auditStatus, (val) => {
  if (val === 0) {
    modifyBusinessInfo()
  }
})

const router = useRouter()
onMounted(() => {
  if (paySettlementType === 1 && route.query.isSuccess === '1') {
    // 通联支付签约成功，则保存签约协议号
    const signAcctType = route.query.signAcctType ? Number(route.query.signAcctType) : '' // 签约类型 2.法人 3.企业
    const bizContent = route.query.bizContent ? JSON.parse(route.query.bizContent) : {}
    router.push({ query: {} })
    if (signAcctType && (bizContent && bizContent.acctProtocolNo)) {
      updateAcctProtocalNo(signAcctType, bizContent.acctProtocolNo)
    }
  } else if (route.query.isSuccess === '0') {
    ElMessage.error('签约失败')
    router.push({ query: {} })
  }
})

const closeBasicBrowse = () => {
  isbacisInforShow.value = false
}
const modifyBaseInfo = () => {
  isbacisInforShow.value = true
}

const closeBusinessBrowse = () => {
  isbusinessInforShow.value = false
}
const modifyBusinessInfo = (time = 0) => {
  setTimeout(() => {
    isbusinessInforShow.value = true
    if ((companyInfoProcessStatus.value === 0 || companyInfoProcessStatus.value === 3) && paySettlementType === 1) {
      activeName.value = '4'
    }
  }, time || 0)
}
// 切换tab
const setActiveName = (val) => {
  activeName.value = val
}
// 签约成功后回到页面保存签约协议号
const updateAcctProtocalNo = (signAcctType, acctProtocolNo) => {
  updateShopAccountProtocolNo({
    signAcctType,
    acctProtocolNo: acctProtocolNo + ''
  }).then(() => {
    ElMessage.success('签约成功')
  })
}
const changeCompanyInfoProcessStatus = (val) => {
  companyInfoProcessStatus.value = val
  getCompanyInfo().then(data => {
    if ((val === 0 || val === 3) && data.newStatus !== 0 && paySettlementType === 1) {
      // 未提交审核，则显示工商信息编辑页
      closeBusinessBrowse()
    }
  })
}
const changeActiveName = (val) => {
  activeName.value = val
}
// 获取并更新申请审核情况
const getmodifyInformation = () => {
  // 走接口拿数据
  nextTick(() => {
    shopCompanyAuditingAuditInfo().then(data => {
      statusRemark.value = data.remarks
      allinpayStore.SET_AUDIT_STATUS(data.status)
    })
  })
}

</script>

<style lang="scss" scoped>
.app-container.page-shop-detail {
  font-size: 14px;
  color: #333;
}
</style>
