import request from '@/utils/request'
import qs from 'qs'

import service from '@/utils/excel-request'

export function getSupplierPageSku (params) {
  return request({
    url: '/mall4cloud_search/mp/search/page_supplier_spu_list?' + qs.stringify(params, { arrayFormat: 'repeat' }),
    method: 'GET'
  })
}

export function getPageSku (params) {
  return request({
    url: '/mall4cloud_product/m/sku/page_sku?' + qs.stringify(params, { arrayFormat: 'repeat' }),
    method: 'GET'
  })
}

export function getCategories () {
  return request({
    url: '/mall4cloud_product/mp/category/enable_categories',
    method: 'GET'
  })
}

export function getSigningList () {
  return request({
    url: '/mall4cloud_product/m/apply_shop/brand/list_signing',
    method: 'GET'
  })
}

/**
 *
 * @param {Object} params
 */
export function getExportExce (params) {
  return service({
    url: '/mall4cloud_product/m/sku/sold_excel?' + qs.stringify(params, { arrayFormat: 'repeat' }),
    method: 'GET'
    // params: qs.stringify(params, { arrayFormat: 'repeat' })
  })
}
