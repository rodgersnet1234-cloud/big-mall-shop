import requese from '@/utils/request'

export function getList (params) {
  return requese({
    url: '/mall4cloud_product/mp/stock_change_reason/list',
    method: 'get',
    params
  })
}
