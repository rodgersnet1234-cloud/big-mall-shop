import request from '@/utils/request'
// 分销商品列表接口
export function discountPage (pageParam) {
  return request({
    url: '/mall4cloud_search/mp/search/page_distribution_spu',
    method: 'get',
    params: pageParam
  })
}
// 分销记录列表接口
export function distributionRecordsPage (pageParam) {
  return request({
    url: '/mall4cloud_marketing/mp/distribution_user_income/page_sales_record',
    method: 'get',
    params: pageParam
  })
}
// 获取分销商品
export function get (discountId) {
  return request({
    url: `/mall4cloud_marketing/m/distribution_spu/?distributionSpuId=${discountId}`,
    method: 'get',
    params: {
    }
  })
}
// 保存分销商品
export function save (data) {
  return request({
    url: '/mall4cloud_marketing/m/distribution_spu',
    method: 'post',
    data
  })
}
// 更新分销商品
export function update (data) {
  return request({
    url: '/mall4cloud_marketing/m/distribution_spu',
    method: 'put',
    data
  })
}
// 删除分销商品
export function deleteById (distributionSpuId) {
  return request({
    url: '/mall4cloud_marketing/m/distribution_spu',
    method: 'delete',
    params: {
      distributionSpuId
    }
  })
}
// 上架或下架分销商品
export function updateState (distributionSpuId, state) {
  return request({
    url: '/mall4cloud_marketing/m/distribution_spu/update_state',
    method: 'PUT',
    params: {
      distributionSpuId,
      state
    }
  })
}
// 获取最新下线活动详情
export function getOfflineHandleEvent (distributionSpuId) {
  return request({
    url: '/mall4cloud_marketing/m/distribution_spu/get_offline_handle_event',
    method: 'GET',
    params: {
      distributionSpuId
    }
  })
}
// 申请上线
export function auditApply (data) {
  return request({
    url: '/mall4cloud_marketing/m/distribution_spu/audit_apply',
    method: 'POST',
    data
  })
}
