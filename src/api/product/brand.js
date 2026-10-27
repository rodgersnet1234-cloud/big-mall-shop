import request from '@/utils/request'

// 根据分类与品牌名称，获取品牌列表（包括分类下的品牌与店铺签约的品牌）
export function listAvailableByCategoryAndBrandName (pageParam) {
  return request({
    url: '/mall4cloud_product/m/apply_shop/brand/list_available_by_category_and_name',
    method: 'get',
    params: pageParam
  })
}
