import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_order/mp/outlet_config/page',
    method: 'get',
    params: pageParam
  })
}

export function get (outletConfigId) {
  return request({
    url: '/mall4cloud_order/mp/outlet_config',
    method: 'get',
    params: {
      outletConfigId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_order/mp/outlet_config',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_order/mp/outlet_config',
    method: 'put',
    data
  })
}

export function deleteById (outletConfigId) {
  return request({
    url: '/mall4cloud_order/mp/outlet_config',
    method: 'delete',
    params: {
      outletConfigId
    }
  })
}
// 设为/取消默认
export function setDefault (outletConfigId) {
  return request({
    url: '/mall4cloud_order/mp/outlet_config/set_default',
    method: 'put',
    params: {
      outletConfigId
    }
  })
}
// 获取网点信息列表
export function listOutletConfig (outletConfigId) {
  return request({
    url: '/mall4cloud_order/mp/outlet_config/list_outlet_config',
    method: 'get'
  })
}
