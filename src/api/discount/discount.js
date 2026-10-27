import request from '@/utils/request'
export function page (pageParam) {
  return request({
    url: '/mall4cloud_marketing/mp/discount/page',
    method: 'get',
    params: pageParam
  })
}

export function get (discountId) {
  return request({
    url: `/mall4cloud_marketing/mp/discount/info/${discountId}`,
    method: 'get',
    params: {
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_marketing/mp/discount',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_marketing/mp/discount',
    method: 'put',
    data
  })
}

export function deleteById (discountId) {
  return request({
    url: `/mall4cloud_marketing/mp/discount/${discountId}`,
    method: 'delete',
    params: {
    }
  })
}

// 获取最新下线活动详情
export function getOfflineHandleEvent (discountId) {
  return request({
    url: `/mall4cloud_marketing/mp/discount/get_offline_handle_event/${discountId}`,
    method: 'GET'
  })
}

// 申请上线
export function auditApply (data) {
  return request({
    url: '/mall4cloud_marketing/mp/discount/audit_apply',
    method: 'POST',
    data
  })
}
