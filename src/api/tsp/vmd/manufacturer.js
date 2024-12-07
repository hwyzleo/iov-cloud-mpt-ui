import request from '@/utils/request'

// 查询车辆工厂列表
export function listManufacturer(query) {
  return request({
    url: '/tsp-vmd/mpt/manufacturer/list',
    method: 'get',
    params: query
  })
}

// 查询车辆工厂详细
export function getManufacturer(manufacturerId) {
  return request({
    url: '/tsp-vmd/mpt/manufacturer/' + manufacturerId,
    method: 'get'
  })
}

// 新增车辆工厂
export function addManufacturer(data) {
  return request({
    url: '/tsp-vmd/mpt/manufacturer',
    method: 'post',
    data: data
  })
}

// 修改车辆工厂
export function updateManufacturer(data) {
  return request({
    url: '/tsp-vmd/mpt/manufacturer',
    method: 'put',
    data: data
  })
}

// 删除车辆工厂
export function delManufacturer(manufacturerIds) {
  return request({
    url: '/tsp-vmd/mpt/manufacturer/' + manufacturerIds,
    method: 'delete'
  })
}
