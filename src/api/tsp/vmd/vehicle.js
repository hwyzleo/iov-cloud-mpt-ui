import request from '@/utils/request'

// 查询车辆列表
export function listVehicle(query) {
  return request({
    url: '/tsp-vmd/mpt/vehicle/list',
    method: 'get',
    params: query
  })
}

// 查询车辆详细
export function getVehicle(vehicleId) {
  return request({
    url: '/tsp-vmd/mpt/vehicle/' + vehicleId,
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

// 修改车辆
export function updateVehicle(data) {
  return request({
    url: '/tsp-vmd/mpt/vehicle',
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
