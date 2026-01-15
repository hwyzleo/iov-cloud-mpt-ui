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

// 列出升级活动下软件内部版本
export function listActivitySoftwareBuildVersion(activityId, group) {
  return request({
    url: '/ota-fota/mpt/activity/' + activityId + '/listSoftwareBuildVersion?group=' + group,
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

// 新增关联的软件内部版本
export function addSoftwareBuildVersion(activityId, softwareBuildVersionIds) {
  return request({
    url: '/ota-fota/mpt/activity/' + activityId + '/action/addSoftwareBuildVersion/' + softwareBuildVersionIds,
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

// 提交升级活动
export function submitActivity(activityId, data) {
  return request({
    url: '/ota-fota/mpt/activity/' + activityId + '/action/submit',
    method: 'post',
    data: data
  })
}

// 审核升级任务
export function auditActivity(activityId, data) {
  return request({
    url: '/ota-fota/mpt/activity/' + activityId + '/action/audit',
    method: 'post',
    data: data
  })
}

// 发布升级活动
export function releaseActivity(activityId) {
  return request({
    url: '/ota-fota/mpt/activity/' + activityId + '/action/release',
    method: 'post'
  })
}

// 取消升级活动
export function cancelActivity(activityId) {
  return request({
    url: '/ota-fota/mpt/activity/' + activityId + '/action/cancel',
    method: 'post'
  })
}

// 删除升级活动
export function delActivity(activityIds) {
  return request({
    url: '/ota-fota/mpt/activity/' + activityIds,
    method: 'delete'
  })
}

// 删除关联的软件内部版本
export function delSoftwareBuildVersion(activityId, softwareBuildVersionIds) {
  return request({
    url: '/ota-fota/mpt/activity/' + activityId + '/action/removeSoftwareBuildVersion/' + softwareBuildVersionIds,
    method: 'post'
  })
}

// 更新关联的软件内部版本组
export function regroupSoftwareBuildVersion(activityId, data) {
  return request({
    url: '/ota-fota/mpt/activity/' + activityId + '/action/regroupSoftwareBuildVersion',
    method: 'post',
    data: data
  })
}

// 重排序关联的软件内部版本
export function resortSoftwareBuildVersion(activityId, data) {
  return request({
    url: '/ota-fota/mpt/activity/' + activityId + '/action/resortSoftwareBuildVersion',
    method: 'post',
    data: data
  })
}
