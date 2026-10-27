import request from '@/utils/request'
import excelRequest from '@/utils/excel-request.js'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_order/mp/order/page',
    method: 'get',
    params: pageParam
  })
}

export function changeAmount (data) {
  return request({
    url: '/mall4cloud_order/mp/order/change_amount',
    method: 'put',
    data
  })
}

export function orderInfo (orderId, params = {}) {
  return request({
    url: '/mall4cloud_order/mp/order/order_info/' + orderId,
    method: 'get',
    params
  })
}

// 原/order/delivery/getOrderItemUnDelivery
export function getOrderItemAndAddress (orderId) {
  return request({
    url: '/mall4cloud_order/mp/order/order_item_and_address/' + orderId,
    method: 'get'
  })
}

//
export function delivery (data) {
  return request({
    url: '/mall4cloud_order/mp/order/delivery',
    method: 'post',
    data
  })
}

// 获取订单物流信息
export function getOrderDeliveries (pageParam) {
  return request({
    url: '/mall4cloud_order/mp/order_delivery/info',
    method: 'get',
    params: pageParam
  })
}

// 提交订单物流包裹修改信息
export function updateOrderDeliveries (data) {
  return request({
    url: '/mall4cloud_order/mp/order_delivery/update',
    method: 'put',
    data
  })
}

// 更新es中的商品数据
export function soldExcel (param) {
  return excelRequest({
    url: '/mall4cloud_search/mp/order/search/sold_excel',
    method: 'GET',
    params: param
  })
}
// 导出待发货订单
export function deliverySoldExcel (param) {
  return excelRequest({
    url: '/mall4cloud_order/mp/order/un_delivery_sold_excel',
    method: 'GET',
    params: param
  })
}

// 修改订单收货地址
export function updateOrderAddr (data) {
  return request({
    url: '/mall4cloud_order/mp/order/change_user_addr',
    method: 'put',
    data
  })
}

// 获取改价后的价格
export function getChangeAmount (params) {
  return request({
    url: '/mall4cloud_order/mp/order/get_change_amount',
    method: 'get',
    params
  })
}

// 通过订单用户收货地址
export function getOrderAddr (orderAddrId) {
  return request({
    url: '/mall4cloud_order/mp/order/order_addr/' + orderAddrId,
    method: 'get'
  })
}

// 订单采购
export function purchase (data) {
  return request({
    url: '/mall4cloud_order/mp/order/sourcing_order',
    method: 'PUT',
    data
  })
}

/**
 * 查询订单物流包裹信息
 * @param {*} param 当前筛选条件
 */
export function deliveryExpresseInfo (param) {
  return request({
    url: '/mall4cloud_order/mp/order_delivery/info',
    method: 'GET',
    params: param
  })
}

// 获取自提订单详情
export function getStationOrderInfo (param) {
  return request({
    url: '/mall4cloud_order/m/order_self_station/get_order_item_and_station_info',
    method: 'GET',
    params: param
  })
}

// 自提订单提货
export function putStationOrder (data) {
  return request({
    url: '/mall4cloud_order/m/order_self_station/change_status_and_order_station',
    method: 'put',
    data
  })
}

// 获取虚拟商品订单详情
export function getVirtualOrderInfo (orderId) {
  return request({
    url: '/mall4cloud_order/m/order_virtual_info/order_info/' + orderId,
    method: 'GET'
  })
}

// 虚拟商品核销
export function putVirtualOrder (data) {
  return request({
    url: '/mall4cloud_order/m/order_virtual_info/order_write_off_by_order_id',
    method: 'put',
    data
  })
}
// 分页获取核销记录
export function pageVirtualInfoLog (pageParam) {
  return request({
    url: '/mall4cloud_order/m/order_virtual_info/page',
    method: 'get',
    params: pageParam
  })
}
// 导出核销记录
export function soldVirtualInfoLogExcel (param) {
  return excelRequest({
    url: '/mall4cloud_order/m/order_virtual_info/get_order_virtual_info_log_form',
    method: 'GET',
    params: param
  })
}
