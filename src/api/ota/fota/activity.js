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

// 列出升级活动下软件零件版本
export function listActivitySoftwarePartVersion(activityId) {
  return request({
    url: '/ota-fota/mpt/activity/' + activityId + '/listSoftwarePartVersion',
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

// 新增关联的软件零件版本
export function addSoftwarePartVersion(activityId, softwarePartVersionIds) {
  return request({
    url: '/ota-fota/mpt/activity/' + activityId + '/action/addSoftwarePartVersion/' + softwarePartVersionIds,
    method: 'post'
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

// 删除关联的软件零件版本
export function delSoftwarePartVersion(activityId, softwarePartVersionIds) {
  return request({
    url: '/ota-fota/mpt/activity/' + activityId + '/action/removeSoftwarePartVersion/' + softwarePartVersionIds,
    method: 'post'
  })
}
