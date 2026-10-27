import request from '@/utils/request'

export function getSameCityInfo () {
  return request({
    url: '/mall4cloud_order/m/same_city/get_same_city_info',
    method: 'get'
  })
}

export function saveOrUpdate (data) {
  return request({
    url: '/mall4cloud_order/m/same_city',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_order/m/same_city',
    method: 'put',
    data
  })
}
