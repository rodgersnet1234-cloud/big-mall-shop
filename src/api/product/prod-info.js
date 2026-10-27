import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_product/m/spu/page',
    method: 'get',
    params: pageParam
  })
}

export function getProdInfoPage (spuId) {
  return request({
    url: '/mall4cloud_product/mp/spu',
    method: 'get',
    params: {
      spuId
    }
  })
}
export function listSpecValue (spuId) {
  return request({
    url: '/prod/spec/listSpecValue',
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

export function getAttrsByCategoryId (param) {
  return request({
    url: '/mall4cloud_product/mp/attr/get_attrs_by_category_id',
    method: 'get',
    params: param
  })
}

export function uploadVideo () {
  return request({
    url: '/mp/file/upload/element',
    method: 'get'
  })
}

export function listSigning () {
  return request({
    url: '/mall4cloud_product/m/apply_shop/brand/list_signing',
    method: 'get'
  })
}

export function getSupplierInfoByspuId (param) {
  return request({
    url: '/mall4cloud_product/mp/spu/getSupplierInfoByspuId',
    method: 'get',
    params: param
  })
}

export function postImportSupplierSpu (data) {
  return request({
    url: '/mall4cloud_product/mp/spu/import_supplier_spu',
    method: 'post',
    data
  })
}

export function getSupplierSpuProd (spuId) {
  return request({
    url: '/mall4cloud_product/m/spu/getSupplierSpu',
    method: 'get',
    params: {
      spuId
    }
  })
}
