import request from '@/utils/request'

// 查询车载域列表
export function listVehicleDomain(query) {
  return request({
    url: '/tsp-vmd/mpt/vehicleDomain/list',
    method: 'get',
    params: query
  })
}

// 查询车载域详细
export function getVehicleDomain(vehicleDomainId) {
  return request({
    url: '/tsp-vmd/mpt/vehicleDomain/' + vehicleDomainId,
    method: 'get'
  })
}

// 新增车载域
export function addVehicleDomain(data) {
  return request({
    url: '/tsp-vmd/mpt/vehicleDomain',
    method: 'post',
    data: data
  })
}

// 修改车载域
export function updateVehicleDomain(data) {
  return request({
    url: '/tsp-vmd/mpt/vehicleDomain',
    method: 'put',
    data: data
  })
}

// 删除车载域
export function delVehicleDomain(vehicleDomainIds) {
  return request({
    url: '/tsp-vmd/mpt/vehicleDomain/' + vehicleDomainIds,
    method: 'delete'
  })
}
