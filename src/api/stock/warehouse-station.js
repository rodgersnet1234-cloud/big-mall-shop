import request from '@/utils/request'

// 获取仓库列表
export function getPageList (params) {
  return request({
    url: '/mall4cloud_product/m/warehouse/page',
    method: 'get',
    params
  })
}
// 获取仓库信息
export function getWarehouse (params) {
  return request({
    url: '/mall4cloud_product/m/warehouse',
    method: 'get',
    params
  })
}
// 保存仓库
export function postWarehouse (data) {
  return request({
    url: '/mall4cloud_product/m/warehouse',
    method: 'post',
    data
  })
}

// 更新仓库
export function putWarehouse (data) {
  return request({
    url: '/mall4cloud_product/m/warehouse',
    method: 'put',
    data
  })
}

// 删除非默认仓库
export function deleteWarehouse (param) {
  return request({
    url: '/mall4cloud_product/m/warehouse',
    method: 'delete',
    params: param
  })
}

// 获取已存在仓库的区域数组
export function listWarehouseCity (param) {
  return request({
    url: '/mall4cloud_product/m/warehouse/list_warehouse_city',
    method: 'get',
    params: param
  })
}

// 获取仓库列表（不分页）
export function getListWarehouse () {
  return request({
    url: '/mall4cloud_product/m/warehouse/list_warehouse',
    method: 'get'
  })
}

// 获取门店列表（不分页）
export function getListStation () {
  return request({
    url: '/mall4cloud_order/m/station/list_station',
    method: 'get'
  })
}
// 获取店铺所有门店列表
export function getListAllStation () {
  return request({
    url: '/mall4cloud_order/m/station/list_shop_all_station',
    method: 'get'
  })
}

// 获取库存点库存数
export function getPageStockPointSku (params) {
  return request({
    url: '/mall4cloud_product/m/stock_point_sku/page',
    method: 'get',
    params
  })
}

// 获取库存点库存数
export function getPageStockPointHasStockSku (params) {
  return request({
    url: '/mall4cloud_product/m/stock_point_sku/page_has_stock_spu',
    method: 'get',
    params
  })
}

// 切换门店库存模式
export function switchStationMode (params) {
  return request({
    url: '/mall4cloud_order/m/station/switch_station_stock_mode',
    method: 'put',
    params
  })
}

export function getStockPointInfo () {
  return request({
    url: '/mall4cloud_product/m/stock_point_sku/stock_point',
    method: 'get'
  })
}
