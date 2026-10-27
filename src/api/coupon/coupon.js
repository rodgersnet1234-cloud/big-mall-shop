import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_marketing/mp/coupon/page',
    method: 'get',
    params: pageParam
  })
}

export function pageCustomerCoupon (pageParam) {
  return request({
    url: '/mall4cloud_marketing/mp/coupon/page_shop_coupon_user',
    method: 'get',
    params: pageParam
  })
}
export function get (couponId) {
  return request({
    url: '/mall4cloud_marketing/mp/coupon',
    method: 'get',
    params: {
      couponId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_marketing/mp/coupon',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_marketing/mp/coupon',
    method: 'put',
    data
  })
}

export function deleteById (couponId) {
  return request({
    url: '/mall4cloud_marketing/mp/coupon',
    method: 'delete',
    params: {
      couponId
    }
  })
}

// 获取最新下线活动详情
export function getOfflineHandleEvent (couponId) {
  return request({
    url: `/mall4cloud_marketing/mp/coupon/get_offline_handle_event/${couponId}`,
    method: 'GET'
  })
}

// 申请上线
export function auditApply (data) {
  return request({
    url: '/mall4cloud_marketing/mp/coupon/audit_apply',
    method: 'POST',
    data
  })
}

// 批量给用户赠送优惠券券
export function sendUserCoupon (data) {
  return request({
    url: '/mall4cloud_marketing/mp/coupon/send_user_coupon',
    method: 'put',
    data
  })
}
