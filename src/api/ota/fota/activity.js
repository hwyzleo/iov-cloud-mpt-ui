import request from '@/utils/request'

// 查询升级活动列表
export function listActivity(query) {
  return request({
    url: '/ota-fota/mpt/activity/list',
    method: 'get',
    params: query
  })
}

// 获取所有升级活动状态
export function listAllActivityState() {
  return request({
    url: '/ota-fota/mpt/activity/listAllActivityState',
    method: 'get'
  })
}

// 查询升级活动详细
export function getActivity(activityId) {
  return request({
    url: '/ota-fota/mpt/activity/' + activityId,
    method: 'get'
  })
}

// 新增升级活动
export function addActivity(data) {
  return request({
    url: '/ota-fota/mpt/activity',
    method: 'post',
    data: data
  })
}

// 修改升级活动
export function updateActivity(data) {
  return request({
    url: '/ota-fota/mpt/activity',
    method: 'put',
    data: data
  })
}

// 删除升级活动
export function delActivity(activityIds) {
  return request({
    url: '/ota-fota/mpt/activity/' + activityIds,
    method: 'delete'
  })
}
