import request from '@/utils/request'

// 查询车辆导入数据列表
export function listVehicleImportData(query) {
  return request({
    url: '/tsp-vmd/mpt/vehicleImportData/list',
    method: 'get',
    params: query
  })
}

// 查询车辆导入数据
export function getVehicleImportData(id) {
  return request({
    url: '/tsp-vmd/mpt/vehicleImportData/' + id,
    method: 'get'
  })
}

// 新增车辆导入数据
export function addVehicleImportData(data) {
  return request({
    url: '/tsp-vmd/mpt/vehicleImportData',
    method: 'post',
    data: data
  })
}

// 修改车辆导入数据
export function updateVehicleImportData(data) {
  return request({
    url: '/tsp-vmd/mpt/vehicleImportData',
    method: 'put',
    data: data
  })
}

// 删除车辆导入数据
export function delVehicleImportData(ids) {
  return request({
    url: '/tsp-vmd/mpt/vehicleImportData/' + ids,
    method: 'delete'
  })
}
