import requese from '@/utils/request'

// 分页查询库存盘点信息
export function takePage (params) {
  return requese({
    url: '/mall4cloud_product/m/take_stock/page',
    method: 'GET',
    params
  })
}

// 导出盘点
export function exportTakeStock (params) {
  return requese({
    url: '/mall4cloud_product/m/take_stock/export_take_stock',
    method: 'GET',
    params,
    responseType: 'blob'
  })
}

// 新增盘点
export function takeNew (data) {
  return requese({
    url: '/mall4cloud_product/m/take_stock',
    method: 'post',
    data
  })
}

// 作废盘点
export function voidedInventory (data) {
  return requese({
    url: '/mall4cloud_product/m/take_stock/voided_inventory/' + data,
    method: 'put'
  })
}

// 根据id查询库存盘点信息
export function takeInfo (data) {
  return requese({
    url: '/mall4cloud_product/m/take_stock/info/' + data,
    method: 'get'
  })
}

// 保存草稿
export function saveTake (data) {
  return requese({
    url: '/mall4cloud_product/m/take_stock',
    method: 'PUT',
    data
  })
}

// 完成盘点
export function finishInventory (data) {
  return requese({
    url: '/mall4cloud_product/m/take_stock/finish_inventory',
    method: 'PUT',
    data
  })
}

// 根据takeStockSpuId获取盘点商品列表
export function takeStockSpuById (params) {
  return requese({
    url: '/mall4cloud_product/m/take_stock_spu/list_by_take_stock_id',
    method: 'GET',
    params
  })
}

// 实物盘点商品Excel模板下载
export function downloadModel () {
  return requese({
    url: '/mall4cloud_product/m/take_stock_spu/download_model',
    method: 'get',
    responseType: 'blob'
  })
}

// 实物盘点商品Excel导出
export function exportTakeStockSpu (params) {
  return requese({
    url: '/mall4cloud_product/m/take_stock_spu/export_take_stock_spu',
    method: 'get',
    responseType: 'blob',
    params
  })
}
