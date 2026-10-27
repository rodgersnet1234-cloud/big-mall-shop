import request from '@/utils/request'

export function batchDeleteImgs (fileIds) {
  return request({
    url: '/mall4cloud_biz/m/attach_file/delete_by_ids',
    method: 'delete',
    data: fileIds
  })
}

export function batchMoveImgs (groupId, imgList) {
  return request({
    url: '/mall4cloud_biz/m/attach_file/batch_move',
    method: 'put',
    params: { groupId },
    data: imgList
  })
}
