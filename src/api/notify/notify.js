import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_admin/mp/notice/p/pagePlatformNotice',
    method: 'get',
    params: pageParam
  })
}

export function unreadPage (pageParam) {
  return request({
    url: '/mall4cloud_biz/mp/notify_log/unread_count_list',
    method: 'get',
    params: pageParam
  })
}

export function remindPage (pageParam) {
  return request({
    url: '/mall4cloud_biz/mp/notify_template_remind/page',
    method: 'get',
    params: pageParam
  })
}

export function updateRemind (data) {
  return request({
    url: '/mall4cloud_biz/mp/notify_template_remind',
    method: 'PUT',
    data
  })
}

export function isRead (data) {
  return request({
    url: `/mall4cloud_biz/mp/notify_log/is_read?logIds=${data.logIds}&type=${data.type}`,
    method: 'PUT'
  })
}
