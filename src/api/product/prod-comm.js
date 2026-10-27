import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_product/m/spu_comm/page',
    method: 'get',
    params: pageParam
  })
}

export function get (spuCommId) {
  return request({
    url: '/mall4cloud_product/m/spu_comm',
    method: 'get',
    params: {
      spuCommId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_product/m/spu_comm',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_product/m/spu_comm',
    method: 'put',
    data
  })
}

export function deleteById (spuCommId) {
  return request({
    url: '/mall4cloud_product/m/spu_comm',
    method: 'delete',
    params: {
      spuCommId
    }
  })
}
