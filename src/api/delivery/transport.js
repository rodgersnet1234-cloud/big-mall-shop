import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_order/mp/transport/page',
    method: 'get',
    params: pageParam
  })
}

export function get (transportId) {
  return request({
    url: '/mall4cloud_order/mp/transport',
    method: 'get',
    params: {
      transportId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_order/mp/transport',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_order/mp/transport',
    method: 'put',
    data
  })
}

export function deleteById (transportIds) {
  return request({
    url: '/mall4cloud_order/mp/transport?transportIds=' + transportIds,
    method: 'delete'
  })
}

export function listArea () {
  return request({
    url: '/mall4cloud_order/mp/area/list',
    method: 'get',
    params: {}
  })
}

export function listAreaInfo () {
  return request({
    url: '/mall4cloud_order/mp/area/area_list_info',
    method: 'get',
    params: {}
  })
}

export function listAreaOfEnable () {
  return request({
    url: '/mall4cloud_order/mp/area/list_area_of_enable',
    method: 'get',
    params: {}
  })
}
