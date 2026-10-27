import request from '@/utils/request'

export function login (data) {
  return request({
    url: '/mall4cloud_auth/ua/admin_login',
    method: 'post',
    data
  })
}

export function logout () {
  return request({
    url: '/mall4cloud_auth/ma/login_out',
    method: 'post'
  })
}

export function getRegisterCode (data) {
  return request({
    url: '/mall4cloud_biz/ua/sms/verification_code/apply_shop',
    method: 'PUT',
    data
  })
}
export function updatePassword (data) {
  return request({
    url: '/mall4cloud_auth/mp/password/update_password',
    method: 'PUT',
    data
  })
}

// 忘记密码
export function forgetPassword (data) {
  return request({
    url: '/mall4cloud_auth/ua/forget_password',
    method: 'PUT',
    data
  })
}

// 获取忘记密码验证码
export function getForgetCode (data) {
  return request({
    url: '/mall4cloud_biz/m/sms/ua/update_pwd',
    method: 'POST',
    data
  })
}

// 校验忘记密码验证码
export function checkUpdatePwd (data) {
  return request({
    url: '/mall4cloud_biz/m/sms/ua/check_update_pwd',
    method: 'put',
    data
  })
}

export function register (data) {
  return request({
    url: '/mall4cloud_admin/ua/shop_user_register',
    method: 'POST',
    data
  })
}

// 商家注册协议
export function getMerchantRegisterProtocol () {
  return request({
    url: '/mall4cloud_admin/ua/shop_user_register/get_merchant_register_protocol',
    method: 'GET'
  })
}

// 商家添加职工信息验证职工手机号
export function getAddShopUserCode (data) {
  return request({
    url: '/mall4cloud_biz/m/sms/send_auth_shop_user_code',
    method: 'PUT',
    data
  })
}

// 发送短信验证码（通联绑定手机号）
export function getVerificationCode (data) {
  return request({
    url: '/mall4cloud_payment/m/apply_shop/allinpay/company/send_verification_code',
    method: 'POST',
    data
  })
}
// 获取域名对应tid
export function getTid (domain) {
  return request({
    url: '/mall4cloud_admin/ua/web_config/get_tid?url=' + domain + '&fromType=1',
    method: 'GET'
  })
}
