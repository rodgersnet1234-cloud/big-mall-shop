import request from '@/utils/request'

// 获取店铺状态信息
export function getStatusInfo () {
  return request({
    url: '/mall4cloud_admin/m/apply_shop/shop_detail/get_status_info',
    method: 'get'
  })
}

// 获取最新下线事件详情
export function getOfflineHandleEvent () {
  return request({
    url: '/mall4cloud_admin/m/offline_handle_event/get_event_info',
    method: 'get'
  })
}

// 申请上线
export function auditApply (data) {
  return request({
    url: '/mall4cloud_admin/m/apply_shop/shop_detail/audit_apply',
    method: 'POST',
    data
  })
}
