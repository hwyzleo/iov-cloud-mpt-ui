import request from '@/utils/request'

// 查询MES车辆数据列表
export function listMesVehicleData(query) {
  return request({
    url: '/tsp-vmd/mpt/mesVehicleData/list',
    method: 'get',
    params: query
  })
}

// 查询车辆MES车辆数据
export function getMesVehicleData(id) {
  return request({
    url: '/tsp-vmd/mpt/mesVehicleData/' + id,
    method: 'get'
  })
}

// 新增MES车辆数据
export function addMesVehicleData(data) {
  return request({
    url: '/tsp-vmd/mpt/mesVehicleData',
    method: 'post',
    data: data
  })
}

// 修改MES车辆数据
export function updateMesVehicleData(data) {
  return request({
    url: '/tsp-vmd/mpt/mesVehicleData',
    method: 'put',
    data: data
  })
}

// 删除MES车辆数据
export function delMesVehicleData(ids) {
  return request({
    url: '/tsp-vmd/mpt/mesVehicleData/' + ids,
    method: 'delete'
  })
}
