import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_auth/mp/role/page',
    method: 'get',
    params: pageParam
  })
}

export function list () {
  return request({
    url: '/mall4cloud_auth/mp/role/list',
    method: 'get'
  })
}

export function get (roleId) {
  return request({
    url: '/mall4cloud_auth/mp/role',
    method: 'get',
    params: {
      roleId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_auth/mp/role',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_auth/mp/role',
    method: 'put',
    data
  })
}

export function deleteById (roleId) {
  return request({
    url: '/mall4cloud_auth/mp/role',
    method: 'delete',
    params: {
      roleId
    }
  })
}
