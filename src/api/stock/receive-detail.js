import request from '@/utils/request'

export function getInfo (stockBillLogId) {
  return request({
    url: '/mall4cloud_product/m/stock_bill_log/info/' + stockBillLogId,
    method: 'get'
  })
}
export function getList (params) {
  return request({
    url: '/mall4cloud_product/m/stock_bill_log/info/',
    params,
    method: 'get'
  })
}

export function putVoided (stockBillLogId = null) {
  return request({
    url: '/mall4cloud_product/m/stock_bill_log/voided',
    method: 'PUT',
    params: {
      stockBillLogId
    }
  })
}
