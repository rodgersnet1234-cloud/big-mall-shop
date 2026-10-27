import request from '@/utils/request'

export function putSubmitStock (params) {
  return request({
    url: '/mall4cloud_product/m/stock_bill_log',
    method: 'POST',
    ...params
  })
}
