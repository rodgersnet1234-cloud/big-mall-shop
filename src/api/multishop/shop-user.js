import request from '@/utils/request'

export function shopUserInfo () {
  return request({
    url: '/mall4cloud_admin/m/apply_shop/shop_user/info',
    method: 'get'
  })
}

export function page (pageParam) {
  return request({
    url: '/mall4cloud_admin/m/shop_user/page',
    method: 'get',
    params: pageParam
  })
}

export function get (shopUserId) {
  return request({
    url: '/mall4cloud_admin/m/shop_user',
    method: 'get',
    params: {
      shopUserId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_admin/m/shop_user',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_admin/m/shop_user',
    method: 'put',
    data
  })
}

export function deleteById (shopUserId) {
  return request({
    url: '/mall4cloud_admin/m/shop_user',
    method: 'delete',
    params: {
      shopUserId
    }
  })
}
// 验证手机号/邮箱/用户名
export function verifyAccount (data) {
  return request({
    url: '/mall4cloud_admin/m/shop_user/verify_account',
    method: 'get',
    params: data
  })
}
