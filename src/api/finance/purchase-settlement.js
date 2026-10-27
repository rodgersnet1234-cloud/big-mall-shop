import request from '@/utils/request'

// 分页获取采购金额日志
export function page (pageParam) {
  return request({
    url: '/mall4cloud_admin/m/purchase_amount_log/page',
    method: 'get',
    params: pageParam
  })
}

// 获取供应商列表
export function getSupplierList (pageParam) {
  return request({
    url: '/mall4cloud_admin/m/purchase_amount_log/list_supplier',
    method: 'get',
    params: pageParam
  })
}

// 获取采购总金额数据
export function getTotalAmount (pageParam) {
  return request({
    url: '/mall4cloud_admin/m/purchase_amount_log/get_total_amount',
    method: 'get',
    params: pageParam
  })
}

// 导出excel
export function exportExcel (params) {
  return request({
    url: '/mall4cloud_admin/m/purchase_amount_log/export_excel',
    method: 'get',
    responseType: 'blob',
    params
  })
}
