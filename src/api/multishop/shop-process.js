import request from '@/utils/request'

export function getShopProtocol () {
  return request({
    url: '/mall4cloud_admin/ua/shop_user_register/get_shop_protocol',
    method: 'get'
  })
}

// 检查统一信用码是否已存在
export function checkForDuplicateCreditCode (param) {
  return request({
    url: '/mall4cloud_admin/mp/shop_company/check_credit_code',
    method: 'GET',
    params: param
  })
}

export function getBasicInfo () {
  return request({
    url: '/mall4cloud_admin/m/apply_shop/shop_detail',
    method: 'get'
  })
}

export function saveBasicInfo (data) {
  return request({
    url: '/mall4cloud_admin/m/apply_shop/shop_detail/storage',
    method: 'post',
    data
  })
}

export function getCompanyInfo () {
  return request({
    url: '/mall4cloud_admin/m/apply_shop/shop_company',
    method: 'get'
  })
}

export function saveCompanyInfo (data) {
  return request({
    url: '/mall4cloud_admin/m/apply_shop/shop_company/storage',
    method: 'post',
    data
  })
}

export function getSignCategoryList () {
  return request({
    url: '/mall4cloud_product/m/apply_shop/category/list_by_shop',
    method: 'get'
  })
}

export function signCategory (data) {
  return request({
    url: '/mall4cloud_product/m/apply_shop/category/signing',
    method: 'post',
    data
  })
}

export function getPlatformCategory () {
  return request({
    url: '/mall4cloud_product/mp/category/platform_categories',
    method: 'get'
  })
}

export function getPlatformBrand (params) {
  return request({
    url: '/mall4cloud_product/mp/brand/list_by_params',
    method: 'get',
    params
  })
}

export function getBankCartInfoList () {
  return request({
    url: '/mall4cloud_admin/m/apply_shop/shop_bank_card/list_by_shopId',
    method: 'get'
  })
}

export function saveBankCartInfo (data) {
  return request({
    url: '/mall4cloud_admin/m/apply_shop/shop_bank_card/save_and_apply_shop',
    method: 'post',
    data
  })
}

// 根据银行卡id获取新行卡账号信息
export function getBankCartInfo (shopBankCardId) {
  return request({
    url: '/mall4cloud_admin/m/apply_shop/shop_bank_card',
    method: 'GET',
    params: {
      shopBankCardId
    }
  })
}

// 保存银行卡信息
export function saveBankCart (data) {
  return request({
    url: '/mall4cloud_admin/m/apply_shop/shop_bank_card',
    method: 'post',
    data
  })
}

// 更新银行卡信息
export function updateBankCart (data) {
  return request({
    url: '/mall4cloud_admin/m/apply_shop/shop_bank_card',
    method: 'PUT',
    data
  })
}

// 删除银行卡信息
export function deleteBankCart (shopBankCardId) {
  return request({
    url: '/mall4cloud_admin/m/apply_shop/shop_bank_card',
    method: 'DELETE',
    params: {
      shopBankCardId
    }
  })
}

// 设置主账号
export function setMainAccount (shopBankCardId) {
  return request({
    url: '/mall4cloud_admin/m/apply_shop/shop_bank_card/set_primary',
    method: 'PUT',
    params: {
      shopBankCardId
    }
  })
}

// 取消主账号
export function setNotMainAccount (shopBankCardId) {
  return request({
    url: '/mall4cloud_admin/m/apply_shop/shop_bank_card/set_not_primary',
    method: 'PUT',
    params: {
      shopBankCardId
    }
  })
}

export function getSignBrandList () {
  return request({
    url: '/mall4cloud_product/m/apply_shop/brand/list_signing',
    method: 'get'
  })
}

export function signBrand (data) {
  return request({
    url: '/mall4cloud_product/m/apply_shop/brand/signing',
    method: 'post',
    data
  })
}

export function getAuditingInfo () {
  return request({
    url: '/mall4cloud_admin/m/apply_shop/shop_apply/get_auditing_info',
    method: 'get'
  })
}

export function deleteSigningCategory (params) {
  return request({
    url: '/mall4cloud_product/m/apply_shop/category/delete_signing_category',
    method: 'DELETE',
    params
  })
}

export function addSigningCategory (data) {
  return request({
    url: '/mall4cloud_product/m/apply_shop/category/add_signing_category',
    method: 'POST',
    data
  })
}

export function getApplySigningBrand (name) {
  return request({
    url: '/mall4cloud_product/m/apply_shop/brand/list_apply_signing_brand',
    method: 'get',
    params: { status: 1, name }
  })
}

export function addSigningBrand (data) {
  return request({
    url: '/mall4cloud_product/m/apply_shop/brand/add_signing_brand',
    method: 'post',
    data
  })
}

export function deleteSigningBrand (params) {
  return request({
    url: '/mall4cloud_product/m/apply_shop/brand/delete_signing_brand',
    method: 'DELETE',
    params
  })
}

// 申请变更工商信息
export function applyChangeCompanyInfo (data) {
  return request({
    url: '/mall4cloud_admin/m/shop_company_auditing/apply_change_company_info',
    method: 'POST',
    data
  })
}

// 查看申请审核情况
export function shopCompanyAuditingAuditInfo () {
  return request({
    url: '/mall4cloud_admin/mp/shop_company_auditing/auditInfo',
    method: 'GET'
  })
}

// 撤销申请
export function shopCompanyAuditingRevoke (shopId) {
  return request({
    url: '/mall4cloud_admin/m/shop_company_auditing/revoke',
    method: 'PUT',
    params: {
      shopId
    }
  })
}

// 获取企业信息（通联支付）
export function getAllinpayCompanyInfo () {
  return request({
    url: '/mall4cloud_payment/m/apply_shop/allinpay/company/get_company_info',
    method: 'GET'
  })
}

// 绑定手机号（通联支付）
export function bindAllinpayPhone (data) {
  return request({
    url: '/mall4cloud_payment/m/apply_shop/allinpay/company/bind_phone',
    method: 'POST',
    data
  })
}

// 解绑手机号（通联支付）
export function unbindAllinpayPhone (data) {
  return request({
    url: '/mall4cloud_payment/m/apply_shop/allinpay/company/unbind_phone',
    method: 'PUT',
    data
  })
}

// 获取对公账户银行列表（通联支付）
export function getBankList () {
  return request({
    url: '/mall4cloud_admin/ua/public_bank/list',
    method: 'GET'
  })
}

// 批量保存银行卡信息（通联支付）
export function saveAllinpayBankCartInfo (data) {
  return request({
    url: '/mall4cloud_admin/m/apply_shop/shop_bank_card/allinpay_save_and_apply_shop',
    method: 'POST',
    data
  })
}

// 企业绑定银行卡（通联支付）
export function bindAllinpayCorporateBankCart (data) {
  return request({
    url: '/mall4cloud_payment/m/apply_shop/allinpay/company/bind_company_account',
    method: 'POST',
    data
  })
}

// 请求绑定银行卡（通联支付）（法人账户）
export function requestBindAllinpayLegalBankCart (data) {
  return request({
    url: '/mall4cloud_payment/m/apply_shop/allinpay/company/apply_bind_bank_card',
    method: 'POST',
    data
  })
}

// 确认绑定银行卡（通联支付）（法人账户）(该接口已废弃)
export function confirmBindAllinpayLegalBankCart (data) {
  return request({
    url: '/mall4cloud_payment/m/apply_shop/allinpay/company/bind_bank_card',
    method: 'POST',
    data
  })
}

// 解绑银行卡（通联支付）
export function unbindAllinpayBankCart (data) {
  return request({
    url: '/mall4cloud_payment/m/apply_shop/allinpay/company/unbind_bank_card',
    method: 'PUT',
    data
  })
}

// 账户协议签约（通联支付）
export function getAllinpaySignContract (data) {
  return request({
    url: '/mall4cloud_payment/m/apply_shop/allinpay/company/sign_acct_protocol',
    method: 'POST',
    data
  })
}

// 更新店铺账户协议编号 (通联支付)
export function updateShopAccountProtocolNo (params) {
  return request({
    url: '/mall4cloud_admin/m/apply_shop/shop_company/update_acct_protocol_no',
    method: 'PUT',
    params
  })
}

// 创建通联会员（通联支付）
export function createAllinpayMember () {
  return request({
    url: '/mall4cloud_admin/m/apply_shop/shop_detail/create_allinpay_member',
    method: 'POST'
  })
}

// 更新影印件（通联支付）
export function updateIdCardStatus (params) {
  return request({
    url: '/mall4cloud_admin/mp/shop_company/update_id_card_status',
    method: 'PUT',
    params
  })
}

// 重新上传影印件 (通联支付)
export function reUploadIdCard (data) {
  return request({
    url: '/mall4cloud_admin/mp/shop_company/upload_id_card',
    method: 'PUT',
    data
  })
}
