import request from '@/utils/request'

// 查询已注册车辆列表
export function listRegisteredVehicle(query) {
  return request({
    url: '/tsp-rsms/mpt/registeredVehicle/list',
    method: 'get',
    params: query
  })
}

// 查询已注册车辆详细
export function getRegisteredVehicle(registeredVehicleId) {
  return request({
    url: '/tsp-rsms/mpt/registeredVehicle/' + registeredVehicleId,
    method: 'get'
  })
}

// 新增已注册车辆
export function addRegisteredVehicle(data) {
  return request({
    url: '/tsp-rsms/mpt/registeredVehicle',
    method: 'post',
    data: data
  })
}

// 修改已注册车辆
export function updateRegisteredVehicle(data) {
  return request({
    url: '/tsp-rsms/mpt/registeredVehicle',
    method: 'put',
    data: data
  })
}

// 删除已注册车辆
export function delRegisteredVehicle(registeredVehicleIds) {
  return request({
    url: '/tsp-rsms/mpt/registeredVehicle/' + registeredVehicleIds,
    method: 'delete'
  })
}
