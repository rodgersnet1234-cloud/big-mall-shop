import request from '@/utils/request'
import excelRequest from '@/utils/excel-request.js'
import qs from 'qs'

// 代销商品列表
export function getConsignmentSpu (params) {
  return request({
    url: '/mall4cloud_search/mp/search/page_consignment_spu',
    method: 'GET',
    params
  })
}

// 获取SaaS分类
export function getMySigningCategoryList () {
  return request({
    url: '/mall4cloud_product/m/apply_shop/category/list_signing_category',
    method: 'get'
  })
}

// 获取店铺下已签约的品牌列表
export function getListSigning () {
  return request({
    url: '/mall4cloud_product/m/apply_shop/brand/list_signing',
    method: 'GET'
  })
}

// 商品上下架
export function putSpuStatus (data) {
  return request({
    url: '/mall4cloud_product/mp/spu/prod_status',
    method: 'put',
    data
  })
}

/**
 *  批量商品上下架
 * @param {Object} data
 * @param {Number} data.status    状态 1:enable, 0:disable, -1:deleted
 * @param {Array} data.spuIds     spuId列表
 * @returns
 */
export function putProdStatus (data) {
  return request({
    url: '/mall4cloud_product/mp/spu/prod_status',
    method: 'PUT',
    data
  })
}

/**
 *
 * @param {Array} params spuId列表
 * @returns
 */
export function getSupplierExcel (params) {
  return excelRequest({
    url: '/mall4cloud_product/mp/spu/supplier_excel?' + qs.stringify(
      params
      , { arrayFormat: 'repeat' }),
    method: 'GET'
  })
}

/**
 * 删除spu信息
 * @param {Number} params spuId
 * @returns
 */
export function delSpu (params) {
  return request({
    url: '/mall4cloud_product/mp/spu',
    method: 'DELETE',
    params: {
      spuId: params
    }
  })
}
