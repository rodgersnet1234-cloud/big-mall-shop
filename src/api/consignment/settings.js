import request from '@/utils/request'

// 获取代销设置表
export function getSubstituteSales () {
  return request({
    url: '/mall4cloud_admin/m/shop_substitute_sales',
    method: 'GET'
  })
}

// 保存代销设置表
export function postSubstituteSales (data) {
  return request({
    url: '/mall4cloud_admin/m/shop_substitute_sales',
    method: 'POST',
    data
  })
}
