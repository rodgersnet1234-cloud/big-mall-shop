import request from '@/utils/request'

/**
 * 提现
 */

// 检查提现金额
export function checkDrawCashAmount (amount) {
  return request({
    url: '/mall4cloud_admin/m/shop_withdraw_cash/check_draw_cash_amount',
    method: 'get',
    params: {
      amount
    }
  })
}

// 获取验证码
export function sendWithdrawCode (data) {
  return request({
    url: '/mall4cloud_biz/m/sms/send_withdraw_code',
    method: 'put',
    data
  })
}

// 提现
export function shopWithdrawCash (data) {
  return request({
    url: '/mall4cloud_admin/m/shop_withdraw_cash/apply/normal',
    method: 'post',
    data
  })
}

export function page (pageParam) {
  return request({
    url: '/mall4cloud_admin/mp/shop_wallet/page',
    method: 'get',
    params: pageParam
  })
}
// get_shop_wallet
export function shopWallet () {
  return request({
    url: '/mall4cloud_admin/mp/shop_wallet/get_shop_wallet',
    method: 'get'
  })
}
// 获取银行卡列表
export function getBankCardList () {
  return request({
    url: '/mall4cloud_admin/m/apply_shop/shop_bank_card/list_by_shopId',
    method: 'get'
  })
}

// 添加银行卡
export function addBankCard (data) {
  return request({
    url: '/mall4cloud_admin/m/apply_shop/shop_bank_card',
    method: 'post',
    data
  })
}

// 设置默认银行卡 set_primary
export function setPrimary (shopBankCardId) {
  return request({
    url: '/mall4cloud_admin/m/apply_shop/shop_bank_card/set_primary',
    method: 'put',
    params: {
      shopBankCardId
    }
  })
}

// get_order_detail 订单详情列表
export function orderDetaiList (orderId, refundId) {
  return request({
    url: '/mall4cloud_order/mp/order_item/get_order_detail',
    method: 'get',
    params: {
      orderId,
      refundId
    }
  })
}

// 获取提现记录信息
export function withdrawCashList (params) {
  return request({
    url: '/mall4cloud_admin/mp/shop_withdraw_cash/page',
    method: 'get',
    params
  })
}

// 获取银行信息详情
export function withdrawCashBankInfo (cashId) {
  return request({
    url: '/mall4cloud_admin/mp/shop_withdraw_cash/info',
    method: 'get',
    params: {
      cashId
    }
  })
}

// 分页获取商家充值记录信息
export function rechargeList (params) {
  return request({
    url: '/mall4cloud_admin/mp/shop_recharge/page',
    method: 'get',
    params
  })
}

// 商家提交通联申请提现 (通联支付)
export function applyAllinpayWithdrawCash (data) {
  return request({
    url: '/mall4cloud_admin/m/shop_withdraw_cash/apply/allinpay_apply',
    method: 'post',
    data
  })
}

// 提现通联重新发送验证码 (通联支付)
export function resendAllinpayWithdrawCode (data) {
  return request({
    url: '/mall4cloud_admin/m/shop_withdraw_cash/resend_pay_sms',
    method: 'post',
    data
  })
}

// 提现确认支付 (通联支付)
export function confirmAllinpayWithdrawCash (data) {
  return request({
    url: '/mall4cloud_admin/m/shop_withdraw_cash/confirm_withdraw_pay',
    method: 'post',
    data
  })
}

// excel导出
export function exportExcel (searchParams) {
  return request({
    url: '/mall4cloud_admin/mp/shop_wallet/export',
    method: 'get',
    params: searchParams,
    responseType: 'blob'
  })
}
