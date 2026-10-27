import request from '@/utils/request'

// 变更通知list
export function getPage (params) {
  return request({
    url: '/mall4cloud_product/m/spu_supplier_change_log/page',
    method: 'GET',
    params
  })
}

// spu信息
export function getSpuInfo (spuId = null) {
  return request({
    url: '/mall4cloud_product/mp/spu',
    method: 'GET',
    params: {
      spuId
    }
  })
}
