import request from '@/utils/request'

export function getCategories () {
  return request({
    url: '/mall4cloud_product/mp/category/shop_categories',
    method: 'GET'
  })
}
