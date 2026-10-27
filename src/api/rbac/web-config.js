import request from '@/utils/request'

export function page (pageParam, configType) {
  return request({
    url: '/mall4cloud_admin/p/web_config/page',
    method: 'get',
    params: Object.assign(pageParam, { configType })
  })
}

export function get (id) {
  return request({
    url: '/mall4cloud_admin/p/web_config',
    method: 'get',
    params: {
      id
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_admin/p/web_config/operate',
    method: 'POST',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_admin/p/web_config/operate',
    method: 'PUT',
    data
  })
}

export function deleteById (id) {
  return request({
    url: '/mall4cloud_admin/p/web_config/operate',
    method: 'DELETE',
    params: { id }
  })
}

// 当前激活的配置
export function getActivity (webConfigType) {
  return request({
    url: '/mall4cloud_admin/ua/web_config/get_activity',
    method: 'GET',
    params: {
      webConfigType
    }
  })
}

// 获取通联支付配置（是否开启）
export function getAllinpayInfo () {
  return request({
    url: '/mall4cloud_admin/m/ua/sys_config/pay_settlement_type',
    method: 'get'
  })
}

// 获取平台端端提现设置
export function getWithdrawSetting () {
  return request({
    url: '/mall4cloud_admin/m/shop_withdraw_cash/getWithdrawCash',
    method: 'get'
  })
}

// 获取快递100配置（是否开启）
export function getQuick100Config () {
  return request({
    url: '/mall4cloud_admin/m/ua/sys_config/quick_100',
    method: 'get'
  })
}
