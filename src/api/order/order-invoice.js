import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_search/m/order_invoice_search/page',
    method: 'get',
    params: pageParam
  })
}

export function get (orderInvoiceId) {
  return request({
    url: '/mall4cloud_order/m/order_invoice',
    method: 'get',
    params: {
      orderInvoiceId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_order/m/order_invoice',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_order/m/order_invoice',
    method: 'put',
    data
  })
}

export function fileInfo (fileId) {
  return request({
    url: '/mall4cloud_biz/m/attach_file/get_file_by_id',
    method: 'get',
    params: {
      fileId
    }
  })
}

export function getIsUploadInvoice (orderId) {
  return request({
    url: '/mall4cloud_order/m/order_invoice/is_upload',
    method: 'get',
    params: {
      orderId
    }
  })
}
