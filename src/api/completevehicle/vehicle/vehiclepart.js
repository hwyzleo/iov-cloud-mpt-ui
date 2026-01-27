import request from '@/utils/request'

// 查询车辆零件列表
export function listVehiclePart(query) {
  return request({
    url: '/tsp-vmd/mpt/vehiclePart/list',
    method: 'get',
    params: query
  })
}

// 查询车辆零件详细
export function getVehiclePart(vehiclePartId) {
  return request({
    url: '/tsp-vmd/mpt/vehiclePart/' + vehiclePartId,
    method: 'get'
  })
}

// 新增车辆零件
export function addVehiclePart(data) {
  return request({
    url: '/tsp-vmd/mpt/vehiclePart',
    method: 'post',
    data: data
  })
}

// 修改车辆零件
export function updateVehiclePart(data) {
  return request({
    url: '/tsp-vmd/mpt/vehiclePart',
    method: 'put',
    data: data
  })
}

// 删除车辆零件
export function delVehiclePart(vehiclePartIds) {
  return request({
    url: '/tsp-vmd/mpt/vehiclePart/' + vehiclePartIds,
    method: 'delete'
  })
}
