import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_product/m/voucher/page',
    method: 'get',
    params: pageParam
  })
}

export function get (voucherId) {
  return request({
    url: '/mall4cloud_product/m/voucher',
    method: 'get',
    params: {
      voucherId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_product/m/voucher',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_product/m/voucher',
    method: 'put',
    data
  })
}

export function deleteById (voucherId) {
  return request({
    url: '/mall4cloud_product/m/voucher',
    method: 'delete',
    params: {
      voucherId
    }
  })
}
