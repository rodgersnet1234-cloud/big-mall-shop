import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_marketing/m/combo/page',
    method: 'get',
    params: pageParam
  })
}
export function pageComboAddSpu (params) {
  return request({
    url: '/mall4cloud_search/mp/search/page_combo_add_spu',
    method: 'get',
    params
  })
}
export function getCombo (params) {
  return request({
    url: '/mall4cloud_marketing/m/combo',
    method: 'get',
    params
  })
}
export function postCombo (pageParam) {
  return request({
    url: '/mall4cloud_marketing/m/combo',
    method: 'post',
    data: pageParam
  })
}
export function putCombo (pageParam) {
  return request({
    url: '/mall4cloud_marketing/m/combo',
    method: 'put',
    data: pageParam
  })
}
export function updateComboStatus (pageParam) {
  return request({
    url: '/mall4cloud_marketing/m/combo/update_combo_status',
    method: 'put',
    data: pageParam
  })
}
