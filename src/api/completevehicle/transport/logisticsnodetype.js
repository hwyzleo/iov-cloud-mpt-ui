import request from '@/utils/request'

// 查询物流据点类型列表
export function listLogisticsNodeType(query) {
  return request({
    url: '/otd-tms/mpt/logisticsNodeType/list',
    method: 'get',
    params: query
  })
}

// 查询物流据点类型详细
export function getLogisticsNodeType(logisticsNodeTypeId) {
  return request({
    url: '/otd-tms/mpt/logisticsNodeType/' + logisticsNodeTypeId,
    method: 'get'
  })
}

// 新增物流据点类型
export function addLogisticsNodeType(data) {
  return request({
    url: '/otd-tms/mpt/logisticsNodeType',
    method: 'post',
    data: data
  })
}

// 修改物流据点类型
export function updateLogisticsNodeType(data) {
  return request({
    url: '/otd-tms/mpt/logisticsNodeType',
    method: 'put',
    data: data
  })
}

// 删除物流据点类型
export function delLogisticsNodeType(logisticsNodeTypeIds) {
  return request({
    url: '/otd-tms/mpt/logisticsNodeType/' + logisticsNodeTypeIds,
    method: 'delete'
  })
}
