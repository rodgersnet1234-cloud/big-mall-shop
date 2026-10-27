import request from '@/utils/request'
import httpExcel from '@/utils/excel-request'

export function postOrder (data) {
  return request({
    url: '/mall4cloud_order/m/purchase/order',
    method: 'post',
    data
  })
}

export function getPage (params) {
  return request({
    url: '/mall4cloud_search/m/purchase_order_search/page',
    method: 'get',
    params
  })
}

/**
 *
 * @param {Number} purchaseNumber  采购编号
 * @returns
 */
export function getInfo (purchaseNumber) {
  return request({
    url: '/mall4cloud_order/m/purchase/order/info/' + purchaseNumber,
    method: 'GET'
  })
}

/**
 *
 * @param {Number} purchaseNumber  采购编号
 * @returns
 */
export function delNullifyOrder (purchaseNumber) {
  return request({
    url: '/mall4cloud_order/m/purchase/order/nullify/' + purchaseNumber,
    method: 'DELETE'
  })
}

export function putInbound (data) {
  return request({
    url: '/mall4cloud_order/m/purchase/order/inbound',
    method: 'PUT',
    data
  })
}

/**
 * 完成采购订单
 * @param {*} data
 * @returns
 */
export function putComplete (data) {
  return request({
    url: '/mall4cloud_order/m/purchase/order/complete',
    method: 'PUT',
    data
  })
}

export function excel (purchaseNumber = null) {
  return httpExcel({
    url: '/mall4cloud_order/m/purchase/order/inbound/export',
    method: 'get',
    params: {
      purchaseNumber
    }
  })
}

// 采购订单物流查询
export function deliveryPurchaseOrder (id) {
  return request({
    url: '/mall4cloud_order/mp/order_delivery/' + id,
    method: 'get'
  })
}

// 采购订单物流查询
export function updatePayVoucher (data) {
  return request({
    url: '/mall4cloud_order/m/purchase/order/updatePayVoucher',
    method: 'PUT',
    data
  })
}
