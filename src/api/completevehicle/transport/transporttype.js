import request from '@/utils/request'

// 查询运输方式列表
export function listTransportType(query) {
  return request({
    url: '/otd-tms/mpt/transportType/list',
    method: 'get',
    params: query
  })
}

// 查询所有运输方式列表
export function listAllTransportType() {
  return request({
    url: '/otd-tms/mpt/transportType/listAll',
    method: 'get'
  })
}

// 查询运输方式详细
export function getTransportType(transportTypeId) {
  return request({
    url: '/otd-tms/mpt/transportType/' + transportTypeId,
    method: 'get'
  })
}

// 新增运输方式
export function addTransportType(data) {
  return request({
    url: '/otd-tms/mpt/transportType',
    method: 'post',
    data: data
  })
}

// 修改运输方式
export function updateTransportType(data) {
  return request({
    url: '/otd-tms/mpt/transportType',
    method: 'put',
    data: data
  })
}

// 删除运输方式
export function delTransportType(transportTypeIds) {
  return request({
    url: '/otd-tms/mpt/transportType/' + transportTypeIds,
    method: 'delete'
  })
}
