import request from '@/utils/request'

// // 分页
// export function pageStation (pageParam) {
//   return request({
//     url: '/mall4cloud_order/m/station/page',
//     method: 'get',
//     params: pageParam
//   })
// }

// es搜索分页
export function pageStation (pageParam) {
  return request({
    url: '/mall4cloud_search/m/station/search/page',
    method: 'get',
    params: pageParam
  })
}

// 根据门店id获取门店列表
export function getStationListByIds (data) {
  return request({
    url: '/mall4cloud_order/m/station/listByIds',
    method: 'post',
    data
  })
}

// 查看详情
export function getStationInfo (stationId) {
  return request({
    url: '/mall4cloud_order/m/station',
    method: 'get',
    params: {
      stationId
    }
  })
}

// 新增
export function saveStation (data) {
  return request({
    url: '/mall4cloud_order/m/station',
    method: 'post',
    data
  })
}

// 修改
export function updateStation (data) {
  return request({
    url: '/mall4cloud_order/m/station',
    method: 'put',
    data
  })
}

// 删除
export function deleteStation (stationId) {
  return request({
    url: '/mall4cloud_order/m/station',
    method: 'delete',
    params: {
      stationId
    }
  })
}

// 创建自提门店账号
export function createAccount (data) {
  return request({
    url: '/mall4cloud_order/m/station/create_account',
    method: 'post',
    data
  })
}

// 修改账号信息
export function changeAccountInfo (data) {
  return request({
    url: '/mall4cloud_order/m/station/change_account_info',
    method: 'put',
    data
  })
}

// 检查账号信息
export function checkAccountInfo (stationId, account) {
  return request({
    url: '/mall4cloud_order/m/station/check_station_account',
    method: 'get',
    params: {
      stationId,
      account
    }
  })
}

// 获取门店下线信息
export function getOfflineInfo (stationId) {
  return request({
    url: '/mall4cloud_order/m/station/get_offline_handle_event/' + stationId,
    method: 'get'
  })
}

// 下线审核申请
export function offlineAuditApply (data) {
  return request({
    url: '/mall4cloud_order/m/station/audit_apply',
    method: 'post',
    data
  })
}

export function getStationDelivery () {
  return request({
    url: '/mall4cloud_order/m/station/get_station_delivery',
    method: 'get'
  })
}
