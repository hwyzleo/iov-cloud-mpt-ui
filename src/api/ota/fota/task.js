import request from '@/utils/request'

// 查询升级任务列表
export function listTask(query) {
  return request({
    url: '/ota-fota/mpt/task/list',
    method: 'get',
    params: query
  })
}

// 获取所有升级任务状态
export function listAllTaskState() {
  return request({
    url: '/ota-fota/mpt/task/listAllTaskState',
    method: 'get'
  })
}

// 查询升级任务详细
export function getTask(taskId) {
  return request({
    url: '/ota-fota/mpt/task/' + taskId,
    method: 'get'
  })
}

// 新增升级任务
export function addTask(data) {
  return request({
    url: '/ota-fota/mpt/task',
    method: 'post',
    data: data
  })
}

// 修改升级任务
export function updateTask(data) {
  return request({
    url: '/ota-fota/mpt/task',
    method: 'put',
    data: data
  })
}

// 删除升级任务
export function delTask(taskIds) {
  return request({
    url: '/ota-fota/mpt/task/' + taskIds,
    method: 'delete'
  })
}
