import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_product/m/giveaway/page',
    method: 'get',
    params: pageParam
  })
}

export function get (giveawayId) {
  return request({
    url: '/mall4cloud_product/m/giveaway',
    method: 'get',
    params: {
      giveawayId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_product/m/giveaway',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_product/m/giveaway',
    method: 'put',
    data
  })
}

export function deleteById (giveawayId) {
  return request({
    url: '/mall4cloud_product/m/giveaway',
    method: 'delete',
    params: {
      giveawayId
    }
  })
}

export function changeStatus (data) {
  return request({
    url: '/mall4cloud_product/m/giveaway/change_status',
    method: 'put',
    params: data
  })
}

export function mainSpuPage (pageParam) {
  return request({
    url: '/mall4cloud_product/m/giveaway_spu/main_spu_page',
    method: 'get',
    params: pageParam
  })
}

export function comboPage (pageParam) {
  return request({
    url: '/mall4cloud_search/mp/search/page_combo_add_spu',
    method: 'get',
    params: pageParam
  })
}
