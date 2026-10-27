import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_group/mp/group_activity/page',
    method: 'get',
    params: pageParam
  })
}

export function get (groupActivityId) {
  return request({
    url: '/mall4cloud_group/mp/group_activity',
    method: 'get',
    params: {
      groupActivityId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_group/mp/group_activity',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_group/mp/group_activity',
    method: 'put',
    data
  })
}

export function deleteById (groupActivityId) {
  return request({
    url: '/mall4cloud_group/mp/group_activity',
    method: 'delete',
    params: {
      groupActivityId
    }
  })
}
export function invalid (data) {
  return request({
    url: '/mall4cloud_group/mp/group_activity/invalid',
    method: 'put',
    data
  })
}

export function active (data) {
  return request({
    url: '/mall4cloud_group/mp/group_activity/active',
    method: 'put',
    data
  })
}

export function getOfflineHandleEvent (id) {
  return request({
    url: '/mall4cloud_group/mp/group_activity/get_offline_handle_event/' + id,
    method: 'get'
  })
}

export function auditApply (data) {
  return request({
    url: '/mall4cloud_group/mp/group_activity/audit_apply',
    method: 'post',
    data
  })
}
