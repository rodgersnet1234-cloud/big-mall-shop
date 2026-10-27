import request from '@/utils/request'
import excelRequest from '@/utils/excel-request'
import qs from 'qs'

export function getPage (params) {
  return request({
    url: '/mall4cloud_product/m/stock_bill_log/page',
    method: 'get',
    params
  })
}

/**
 *
 * @param {Object} params 请求参数
 * @returns
 */
export function exportStockBillLog (params) {
  return excelRequest({
    url: '/mall4cloud_product/m/stock_bill_log/export_stock_bill_log?' + qs.stringify(params, { arrayFormat: 'repeat' }),
    method: 'get'
  })
}
