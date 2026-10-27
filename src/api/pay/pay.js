import request from '@/utils/request'

// 余额充值接口
export function payRecharge (data) {
  return request({
    url: '/mall4cloud_payment/m/pay/recharge',
    method: 'post',
    data
  })
}

// 根据订单号查询该订单是否已经支付
export function isPay (orderIds) {
  return request({
    url: '/mall4cloud_payment/m/pay/is_pay/1/' + orderIds,
    method: 'get'
  })
}

// 申请充值订单
export function rechargeOrder (data) {
  return request({
    url: '/mall4cloud_admin/m/shop_recharge/recharge',
    method: 'post',
    data
  })
}

// 申请充值订单 (通联支付)
export function rechargeAllinpay (data) {
  return request({
    url: '/mall4cloud_admin/m/shop_recharge/allinpay_recharge',
    method: 'post',
    data
  })
}

// 重新发送充值验证码 (通联支付)--暂不调用
export function resendRechargeCode (data) {
  return request({
    url: '/mall4cloud_admin/m/shop_recharge/resend_pay_sms',
    method: 'post',
    data
  })
}

// 确认充值支付 (通联支付)--暂不调用
export function confirmRecharge (data) {
  return request({
    url: '/mall4cloud_admin/m/shop_recharge/confirm_recharge_pay',
    method: 'post',
    data
  })
}

// 确定支付 - 密码验证(通联支付)
export function payConfirmByFrontPwd (data) {
  return request({
    url: '/mall4cloud_payment/m/allinpay/order/pay_confirm_by_front_pwd',
    method: 'post',
    data
  })
}

// 确定支付 - 前台+短信验证(通联支付)
export function payConfirmBySms (data) {
  return request({
    url: '/mall4cloud_payment/m/allinpay/order/pay_confirm_by_front_sms',
    method: 'post',
    data
  })
}

// 确定支付 - 后台+短信验证(通联支付)
export function payConfirmBySmsBack (data) {
  return request({
    url: '/mall4cloud_payment/m/allinpay/order/pay_confirm_by_back_sms',
    method: 'post',
    data
  })
}

// 重新发送支付验证码 (通联支付)
export function resendPayCode (param) {
  return request({
    url: '/mall4cloud_payment/m/allinpay/order/resend_pay_sms',
    method: 'get',
    params: param
  })
}
// 获取支付配置
export function getPaymentWwitch () {
  return request({
    url: '/mall4cloud_admin/ua/app/sys_config/get_payment_switch',
    method: 'get'
  })
}
