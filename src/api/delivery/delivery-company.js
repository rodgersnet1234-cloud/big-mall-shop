import request from '@/utils/request'

export function list () {
  return request({
    url: '/mall4cloud_order/mp/delivery_company/list',
    method: 'get'
  })
}
export function page (param) {
  return request({
    url: '/mall4cloud_order/mp/delivery_company/page',
    method: 'get',
    params: param
  })
}

export function deliveryOrder (id) {
  return request({
    url: '/mall4cloud_order/mp/order_delivery/' + id,
    method: 'get'
  })
}
