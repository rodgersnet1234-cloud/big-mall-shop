import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_product/m/voucher_item/page',
    method: 'get',
    params: pageParam
  })
}

export function get (voucherItemId) {
  return request({
    url: '/mall4cloud_product/m/voucher_item',
    method: 'get',
    params: {
      voucherItemId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_product/m/voucher_item',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_product/m/voucher_item',
    method: 'put',
    data
  })
}

export function batchDel (ids) {
  return request({
    url: '/mall4cloud_product/m/voucher_item',
    method: 'delete',
    params: {
      ids
    }
  })
}

// 下载卡券明细导入模板
export function downModel () {
  return excelRequest({
    url: '/mall4cloud_product/m/voucher_item/download_model',
    method: 'GET'
  })
}

// 导出excel
export function exportExcel (params) {
  return request({
    url: '/mall4cloud_product/m/voucher_item/export_excel',
    method: 'get',
    responseType: 'blob',
    params
  })
}
