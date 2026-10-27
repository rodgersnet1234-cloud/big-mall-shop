import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_order/mp/printer/page',
    method: 'get',
    params: pageParam
  })
}

export function get (printerId) {
  return request({
    url: '/mall4cloud_order/mp/printer',
    method: 'get',
    params: {
      printerId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_order/mp/printer',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_order/mp/printer',
    method: 'put',
    data
  })
}

export function deleteById (printerId) {
  return request({
    url: '/mall4cloud_order/mp/printer',
    method: 'delete',
    params: {
      printerId
    }
  })
}

// 设为/取消默认
export function setDefault (printerId) {
  return request({
    url: '/mall4cloud_order/mp/printer/set_default',
    method: 'put',
    params: {
      printerId
    }
  })
}

// list_printer
export function list () {
  return request({
    url: '/mall4cloud_order/mp/printer/list_printer',
    method: 'get'
  })
}
