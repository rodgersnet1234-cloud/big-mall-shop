import request from '@/utils/request'

export function batchDeleteVedio (fileIds) {
  return request({
    url: '/mall4cloud_biz/m/attach_file/delete_by_ids',
    method: 'delete',
    data: fileIds
  })
}

export function batchMoveVedio (groupId, imgList) {
  return request({
    url: '/mall4cloud_biz/m/attach_file/batch_move',
    method: 'put',
    params: { groupId },
    data: imgList
  })
}
