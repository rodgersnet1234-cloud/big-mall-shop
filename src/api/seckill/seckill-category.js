import request from '@/utils/request'

export function list () {
  return request({
    url: '/mall4cloud_seckill/mp/seckill_category/list',
    method: 'get',
    params: {}
  })
}
