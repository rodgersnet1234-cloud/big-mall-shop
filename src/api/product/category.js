import request from '@/utils/request'

// 获取店铺所有的分类信息
export function shopCategoryPage () {
  return request({
    url: '/mall4cloud_product/mp/category/shop_categories',
    method: 'get',
    params: {}
  })
}

// 获取平台所有的分类信息
export function platformCategoryPage () {
  return request({
    url: '/mall4cloud_product/mp/category/platform_categories',
    method: 'get',
    params: {}
  })
}

// 导出平台所有的分类信息
export function soldExcel (pageParam) {
  return request({
    url: '/mall4cloud_product/mp/category/sold_excel',
    method: 'get',
    params: pageParam,
    responseType: 'blob'
  })
}

// 获取平台/店铺启用的分类信息
export function enableCategories (params) {
  return request({
    url: '/mall4cloud_product/mp/category/enable_categories',
    method: 'get',
    params
  })
}

// 获取店铺签约的启用分类列表
export function getMySigningCategoryList (params = { status: 1 }) {
  return request({
    url: '/mall4cloud_product/m/apply_shop/category/list_signing_category',
    method: 'get',
    params
  })
}

// 获取店铺中的销售属性
export function getShopAttrs () {
  return request({
    url: '/mall4cloud_product/mp/attr/get_shop_attrs',
    method: 'get',
    params: {}
  })
}

export function get (categoryId) {
  return request({
    url: '/mall4cloud_product/mp/category',
    method: 'get',
    params: {
      categoryId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_product/mp/category',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_product/mp/category',
    method: 'put',
    data
  })
}

export function deleteById (categoryId) {
  return request({
    url: '/mall4cloud_product/mp/category',
    method: 'delete',
    params: {
      categoryId
    }
  })
}

export function enableOrDisable (data) {
  return request({
    url: '/mall4cloud_product/mp/category/category_enable_or_disable',
    method: 'put',
    data
  })
}

export function listApplySigningCategory () {
  return request({
    url: '/mall4cloud_product/m/apply_shop/category/list_apply_signing_category',
    method: 'get'
  })
}
