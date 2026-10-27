import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_admin/mp/notice/page',
    method: 'get',
    params: pageParam
  })
}

export function platformPage (pageParam) {
  return request({
    url: '/mall4cloud_admin/mp/notice/p/pagePlatformNotice',
    method: 'get',
    params: pageParam
  })
}

export function get (id) {
  return request({
    url: '/mall4cloud_admin/mp/notice',
    method: 'get',
    params: {
      id
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_admin/mp/notice',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_admin/mp/notice',
    method: 'put',
    data
  })
}

export function deleteById (id) {
  return request({
    url: '/mall4cloud_admin/mp/notice',
    method: 'delete',
    params: {
      id
    }
  })
}
