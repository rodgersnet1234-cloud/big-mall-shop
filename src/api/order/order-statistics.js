import request from '@/utils/request'

export function getOrderCount () {
  return request({
    url: '/mall4cloud_order/m/order_statistics/order_count',
    method: 'get'
  })
}

export function getCurrentMonthInfoByDay () {
  return request({
    url: '/mall4cloud_order/m/order_statistics/get_current_month_by_day',
    method: 'get'
  })
}

export function listOrderRefundInfo () {
  return request({
    url: '/mall4cloud_order/m/order_statistics/list_order_refund_info',
    method: 'get'
  })
}

export function getToDayByHour () {
  return request({
    url: '/mall4cloud_order/m/order_statistics/get_to_day_by_hour',
    method: 'get'
  })
}

export function listRefundRankingByReason () {
  return request({
    url: '/mall4cloud_order/m/order_statistics/list_refund_ranking_by_reason',
    method: 'get'
  })
}

export function listRefundRankingByProd () {
  return request({
    url: '/mall4cloud_order/m/order_statistics/list_refund_ranking_by_prod',
    method: 'get'
  })
}

export function test (data) {
  return request({
    url: '/mall4cloud_product/m/apply_shop/brand/signing',
    method: 'post',
    data
  })
}

export function getStockWarningNum () {
  return request({
    url: '/mall4cloud_product/m/sku/get_stock_warning_num',
    method: 'GET'
  })
}
