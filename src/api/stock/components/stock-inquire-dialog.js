import request from '@/utils/request'

/**
 *
 * @param {Number} params  spuId
 */
export function getAllSkuList (params) {
  return request({
    url: '/mall4cloud_product/m/sku/get_all_skuList',
    method: 'GET',
    params
  })
}
