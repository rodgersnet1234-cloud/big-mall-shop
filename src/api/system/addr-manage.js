import request from '@/utils/request'

export function page (params) {
  return request({
    url: '/mall4cloud_order/mp/area/list',
    method: 'get',
    params
  })
}

export function get (areaId) {
  return request({
    url: '/mall4cloud_order/mp/area',
    method: 'get',
    params: {
      areaId
    }
  })
}

export function listByPid (pid) {
  return request({
    url: '/mall4cloud_order/mp/area/list_by_pid',
    method: 'get',
    params: {
      pid
    }
  })
}

export function getAreaListInfo () {
  return request({
    url: '/mall4cloud_order/mp/area/area_list_info',
    method: 'get'
  })
}

export function getListAreaOfEnable () {
  return request({
    url: '/mall4cloud_order/mp/area/list_area_of_enable',
    method: 'get'
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_order/m/area',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_order/m/area',
    method: 'put',
    data
  })
}

export function deleteById (areaId) {
  return request({
    url: '/mall4cloud_order/m/area',
    method: 'delete',
    params: {
      areaId
    }
  })
}
