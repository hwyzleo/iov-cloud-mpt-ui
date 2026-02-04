import request from '@/utils/request'

// 查询车辆升级任务列表
export function listTaskVehicle(query) {
  return request({
    url: '/ota-fota/mpt/taskVehicle/list',
    method: 'get',
    params: query
  })
}

// 查询车辆升级任务详细
export function getTaskVehicle(taskVehicleId) {
  return request({
    url: '/ota-fota/mpt/taskVehicle/' + taskVehicleId,
    method: 'get'
  })
}

// 获取车辆升级任务过程
export function listTaskVehicleProcess(taskVehicleId) {
  return request({
    url: '/ota-fota/mpt/taskVehicle/' + taskVehicleId + '/process',
    method: 'get'
  })
}
