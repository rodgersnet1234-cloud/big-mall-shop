import request from '@/utils/request'

// 分页查询调拨订单
export function searchAllotOrder (params) {
  return request({
    url: '/mall4cloud_search/m/allot_order_search/page',
    method: 'get',
    params
  })
}

// 获取调拨订单详情
export function getAllotOrderInfo (id) {
  return request({
    url: '/mall4cloud_order/m/allot_order/info/' + id,
    method: 'get'
  })
}

// 新增调拨订单
export function postAllotOrder (data) {
  return request({
    url: '/mall4cloud_order/m/allot_order',
    method: 'post',
    data
  })
}

// 入库调拨订单
export function inboundAllotOrder (data) {
  return request({
    url: '/mall4cloud_order/m/allot_order/inbound',
    method: 'put',
    data
  })
}

// 完成调拨订单
export function completeAllotOrder (allotOrderId) {
  return request({
    url: '/mall4cloud_order/m/allot_order/complete/' + allotOrderId,
    method: 'put'
  })
}

// 作废调拨订单
export function nullifyAllotOrder (id) {
  return request({
    url: '/mall4cloud_order/m/allot_order/nullify/' + id,
    method: 'delete'
  })
}
