import request from '@/utils/request'

export function list (params) {
  return request({
    url: '/mall4cloud_flow/m/product_analyse/get_product_effect',
    method: 'get',
    params
  })
}

export function getSingleProdTrend (params) {
  return request({
    url: '/mall4cloud_flow/m/product_analyse/get_single_prod_trend',
    method: 'get',
    params
  })
}
