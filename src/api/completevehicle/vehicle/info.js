import request from '@/utils/request'

// 查询车辆列表
export function listVehicle(query) {
  return request({
    url: '/tsp-vmd/mpt/vehicle/list',
    method: 'get',
    params: query
  })
}

// 查询可分配车辆列表
export function listAssignableVehicle(query) {
  return request({
    url: '/tsp-vmd/mpt/vehicle/listAssignable',
    method: 'get',
    params: query
  })
}

// 查询车辆详细
export function getVehicle(vin) {
  return request({
    url: '/tsp-vmd/mpt/vehicle/' + vin,
    method: 'get'
  })
}

// 查询车辆生命周期列表
export function listVehicleLifecycle(vin) {
  return request({
    url: '/tsp-vmd/mpt/vehicle/' + vin + '/lifecycle',
    method: 'get'
  })
}

// 新增车辆
export function addVehicle(data) {
  return request({
    url: '/tsp-vmd/mpt/vehicle',
    method: 'post',
    data: data
  })
}

// 新增车辆生命周期
export function addVehicleLifecycle(data) {
  return request({
    url: '/tsp-vmd/mpt/vehicle/' + data.vin + '/lifecycle',
    method: 'post',
    data: data
  })
}

// 修改车辆
export function updateVehicle(data) {
  return request({
    url: '/tsp-vmd/mpt/vehicle/' + data + '/lifecycle',
    method: 'put',
    data: data
  })
}

// 修改车辆生命周期
export function updateVehicleLifecycle(data) {
  return request({
    url: '/tsp-vmd/mpt/vehicle/' + data.vin + '/lifecycle',
    method: 'put',
    data: data
  })
}

// 删除车辆
export function delVehicle(vehicleIds) {
  return request({
    url: '/tsp-vmd/mpt/vehicle/' + vehicleIds,
    method: 'delete'
  })
}

// 删除车辆生命周期
export function delVehicleLifecycle(vin, lifecycleId) {
  return request({
    url: '/tsp-vmd/mpt/vehicle/' + vin + '/lifecycle/' + lifecycleId,
    method: 'delete'
  })
}
