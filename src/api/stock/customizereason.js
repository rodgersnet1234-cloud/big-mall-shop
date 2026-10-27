import request from '@/utils/request'

/**
 *
 * @param {*} params
 * @returns
 */
export function getPage (params) {
  return request({
    url: '/mall4cloud_product/mp/stock_change_reason/page',
    method: 'get',
    params
  })
}

/**
 *
 * @param {Object} params
 * @param {Number} params.status   状态
 * @param {Number} params.stockChangeReasonId id
 * @returns
 */
export function putChangeStatus (params) {
  return request({
    url: '/mall4cloud_product/mp/stock_change_reason/change_status',
    method: 'put',
    params
  })
}

/**
 * @function
 * @param {Number}  stockChangeReasonId   出入库原因id
 * @returns
 */
export function delCustomizereason (stockChangeReasonId) {
  return request({
    url: '/mall4cloud_product/mp/stock_change_reason',
    method: 'DELETE',
    params: {
      stockChangeReasonId
    }
  })
}

/**
 *
 * @param {Object} params
 * @param {String} params.method  请求方式
 * @param {Object} params.params 请求参数
 * @returns
 */
export function changeReason (params) {
  return request({
    url: '/mall4cloud_product/mp/stock_change_reason',
    ...params
  })
}
