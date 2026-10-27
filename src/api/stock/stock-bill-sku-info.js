import requese from '@/utils/request'

/**
 *
 * @param {Object} params
 * @returns
 */
export function getPageSku (params) {
  return requese({
    url: '/mall4cloud_search/mp/search/page_supplier_spu_list',
    method: 'GET',
    params
  })
}
