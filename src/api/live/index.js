import request from '@/utils/request'

/**
 * 获取直播商品列表
 * @param {*} params
 * @returns
 */
export function getLiveRoomProdPage (roomId = null) {
  return request({
    url: '/mall4cloud_marketing/m/live_room/list_live_room_prod',
    method: 'GET',
    params: { roomId }
  })
}

// 获取直播间列表
export function getLiveRoomPage (params) {
  return request({
    url: '/mall4cloud_marketing/m/live_room/page',
    method: 'GET',
    params
  })
}

/**
 * 删除直播间
 * @param {*} roomId //根据直播间id删除直播间
 * @returns
 */
export function delLiveRoom (roomId = null) {
  return request({
    url: '/mall4cloud_marketing/m/live_room',
    method: 'DELETE',
    params: {
      roomId
    }
  })
}

/**
 * 获取直播间
 * @param {*} id 根据id获取直播间
 * @returns
 */
export function getLiveRoomInfo (roomId = '') {
  return request({
    url: '/mall4cloud_marketing/m/live_room',
    method: 'GET',
    params: {
      roomId
    }
  })
}

/**
 *  保存或编辑直播间
 */
export function putOrPostLiveRoom (params) {
  return request({
    url: '/mall4cloud_marketing/m/live_room',
    ...params
  })
}
