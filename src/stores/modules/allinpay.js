import { defineStore } from 'pinia'
import { getBasicInfo } from '@/api/multishop/shop-process'
import { getAllinpayInfo } from '@/api/rbac/web-config'
export const useAllinpayStore = defineStore('allinpay', {
  state: () => {
    return {
      paySettlementType: 0, // 启用通联支付 1：启用 0：未启用
      auditStatus: -1, // 当前店铺审核状态 -1：未提交 0：审核中 1：审核通过 2：审核不通过
      idCardCollectProcessStatus: -1, // 影印件采集审核状态 0.未上传 1.待审核 2.只有工商认证通过 3.只有法人信息通过 4.均审核通过
      shopStatus: null // 店铺状态 -1:已删除 0: 停业中 1:营业中 2:平台下线 3:待审核 4:店铺申请中 5:申请失败 6:上线申请中 7：系统下线
    }
  },
  actions: {
    SET_PAY_SETTLEMENT_TYPE (paySettlementType) {
      this.paySettlementType = paySettlementType
    },
    SET_AUDIT_STATUS (auditStatus) {
      this.auditStatus = auditStatus
    },
    SET_ID_CARD_COLLECT_PROCESS_STATUS (idCardCollectProcessStatus) {
      this.idCardCollectProcessStatus = idCardCollectProcessStatus
    },
    SET_SHOP_STATUS (shopStatus) {
      this.shopStatus = shopStatus
    },

    getPaySettlementType () {
      return new Promise((resolve) => {
        getAllinpayInfo().then((res) => {
          const data = res ? JSON.parse(res) : {}
          this.SET_PAY_SETTLEMENT_TYPE(data.paySettlementType ? data.paySettlementType : 0)
          resolve(data.paySettlementType)
        })
      })
    },
    getBasicInfoStore () {
      getBasicInfo().then(data => {
        if (data.type) data.type = data.type.toString()
        if (this.paySettlementType === 1) {
          this.SET_ID_CARD_COLLECT_PROCESS_STATUS(data.idCardCollectProcessStatus)
          this.SET_SHOP_STATUS(data.shopStatus)
        }
      })
    }
  }
})
