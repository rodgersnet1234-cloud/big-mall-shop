import request from '@/utils/request'
import excelRequest from '@/utils/excel-request.js'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_search/mp/search/page',
    method: 'get',
    params: pageParam
  })
}

export function get (spuId) {
  return request({
    url: '/mall4cloud_product/mp/spu',
    method: 'get',
    params: {
      spuId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_product/mp/spu',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_product/mp/spu',
    method: 'put',
    data
  })
}

export function deleteById (spuId) {
  return request({
    url: '/mall4cloud_product/mp/spu',
    method: 'delete',
    params: {
      spuId
    }
  })
}

// 批量删除
export function deleteByIds (spuIds) {
  return request({
    url: '/mall4cloud_product/mp/spu/delete_batch',
    method: 'delete',
    params: {
      spuIds
    }
  })
}

// 获取可以参与秒杀活动的商品分页列表
export function pageCanSeckillProd (pageParam) {
  return request({
    url: '/mall4cloud_product/mp/spu/page_can_seckill_prod',
    method: 'get',
    params: pageParam
  })
}

// 商品上下架
export function updateProdStatus (data) {
  return request({
    url: '/mall4cloud_product/mp/spu/prod_status',
    method: 'put',
    data
  })
}

// 修改spu（名称、价格、库存、序号）信息
export function updatePartProdStatus (data) {
  return request({
    url: '/mall4cloud_product/mp/spu/update_spu_data',
    method: 'put',
    data
  })
}

// 获取最新下线活动详情
export function getOfflineHandleEvent (spuId) {
  return request({
    url: `/mall4cloud_product/mp/spu/get_offline_handle_event/${spuId}`,
    method: 'GET'
  })
}

// 申请上线
export function auditApply (data) {
  return request({
    url: '/mall4cloud_product/mp/spu/audit_apply',
    method: 'POST',
    data
  })
}

// 下载商品excel
export function soldExcel (pageParam) {
  return excelRequest({
    url: '/mall4cloud_product/mp/spu/sold_excel',
    method: 'GET',
    params: pageParam
  })
}

// 下载商品excel模板
export function downModel () {
  return excelRequest({
    url: '/mall4cloud_product/mp/spu/down_model',
    method: 'GET'
  })
}

// 获取供应商商品列表
export function pageSupplySpu (pageParam) {
  return request({
    url: '/mall4cloud_search/mp/search/page_supply_spu',
    method: 'get',
    params: pageParam
  })
}
