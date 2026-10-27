import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_search/mp/search/order_refund/page',
    method: 'get',
    params: pageParam
  })
}

export function info (refundId) {
  return request({
    url: '/mall4cloud_order/m/order_refund/info/' + refundId,
    method: 'get'
  })
}

/**
 * 进入这个方法，会出现两种情况：
 * 1. 仅退款，此时商家同意买家的退款申请，执行发放退款的操作
 * 2. 退货退款操作:
 *   2.1)退货退款的第一步，商家允许买家退款的申请，商家进行设置退货地址，不执行发放退款的操作
 */
export function returnAndRefundAudit (data) {
  return request({
    url: '/mall4cloud_order/m/order_refund/return_and_refund_audit',
    method: 'put',
    data
  })
}

/**
 * 退货退款的第二步，当商家收到货之后，同意买家退款，此时需要发放退款
 */
export function returnMoney (data) {
  return request({
    url: '/mall4cloud_order/m/order_refund/return_money',
    method: 'put',
    data
  })
}

/**
 * 是否为最后一个退款项
 */
export function checkIsLastOrderItem (refundId) {
  return request({
    url: '/mall4cloud_order/m/order_refund/is_last_refund',
    method: 'get',
    params: {
      refundId
    }
  })
}
export function addProof (data) {
  return request({
    url: '/mall4cloud_order/m/order_refund_intervention/save_intervention_voucher',
    method: 'put',
    data
  })
}

/**
 * 查询是否可以主动退款
 */
export function getActiveRefund (orderId) {
  return request({
    url: '/mall4cloud_order/mp/order/can_active_refund',
    method: 'get',
    params: {
      orderId
    }
  })
}

/**
 * 主动退款
 */
export function doActiveRefund (data) {
  return request({
    url: '/mall4cloud_order/m/order_refund/do_active_refund',
    method: 'post',
    data
  })
}
