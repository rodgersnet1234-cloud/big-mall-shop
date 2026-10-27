import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_user/m/cost_per_popup/page',
    method: 'get',
    params: pageParam
  })
}

// 根据popupId获取弹窗广告
export function get (popupId) {
  return request({
    url: '/mall4cloud_user/m/cost_per_popup',
    method: 'get',
    params: {
      popupId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_user/m/cost_per_popup',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_user/m/cost_per_popup',
    method: 'put',
    data
  })
}

export function deleteById (popupId) {
  return request({
    url: '/mall4cloud_user/m/cost_per_popup',
    method: 'delete',
    params: {
      popupId
    }
  })
}
// 根据弹窗广告id失效弹窗广告
export function setInvalid (popupId) {
  return request({
    url: '/mall4cloud_user/m/cost_per_popup/invalid',
    method: 'put',
    params: {
      popupId
    }
  })
}
