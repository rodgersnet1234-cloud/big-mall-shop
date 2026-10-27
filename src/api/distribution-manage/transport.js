import request from '@/utils/request'

export function transportPage () {
  return request({
    url: '/mall4cloud_order/mp/transport/list',
    method: 'get'
  })
}

export function transportGet (transportId) {
  return request({
    url: '/mall4cloud_order/mp/transport',
    method: 'get',
    params: {
      transportId
    }
  })
}

export function transportSave (data) {
  return request({
    url: '/mall4cloud_order/mp/transport',
    method: 'post',
    data
  })
}

export function transportUpdate (data) {
  return request({
    url: '/mall4cloud_order/mp/transport',
    method: 'put',
    data
  })
}

export function deleteTransportById (transportIds) {
  return request({
    url: '/mall4cloud_order/mp/transport?transportIds=' + transportIds,
    method: 'delete'
  })
}
