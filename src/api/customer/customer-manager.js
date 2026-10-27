import request from '@/utils/request'
import excelRequest from '@/utils/excel-request.js'

// 分页获取用户信息列表
export function managePage (pageParam) {
  return request({
    url: '/mall4cloud_user/m/user/shop_customer_page',
    method: 'get',
    params: pageParam
  })
}

// 获取用户信息
export function getUserInfo (userId) {
  return request({
    url: '/mall4cloud_user/m/user/user_info',
    method: 'get',
    params: {
      userId
    }
  })
}

// 修改用户成长值
export function updateGrowth (data) {
  return request({
    url: '/mall4cloud_user/p/user_level/update_growth',
    method: 'put',
    data
  })
}

// 修改用户昵称/状态u
export function update (data) {
  return request({
    url: '/mall4cloud_user/p/user',
    method: 'put',
    data
  })
}

// 交易明细
export function tradeDetail (pageParam) {
  return request({
    url: '/mall4cloud_order/mp/order/get_shop_order_by_userId',
    method: 'get',
    params: pageParam
  })
}

// 导出用户信息数据
export function soldExcel (param) {
  return excelRequest({
    url: '/mall4cloud_user/m/user/sold_excel',
    method: 'GET',
    params: param
  })
}

// 下载用户信息导入模板
export function downModel () {
  return excelRequest({
    url: '/mall4cloud_user/m/user/down_model',
    method: 'GET'
  })
}

export function getUserCountInfo () {
  return request({
    url: '/mall4cloud_user/p/user/get_user_count_info',
    method: 'get'
  })
}
