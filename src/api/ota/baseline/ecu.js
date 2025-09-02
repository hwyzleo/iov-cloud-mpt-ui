import request from '@/utils/request'

// 查询ECU信息列表
export function listEcu(query) {
  return request({
    url: '/ota-baseline/mpt/ecu/list',
    method: 'get',
    params: query
  })
}

// 获取所有ECU类型
export function listAllEcuType() {
  return request({
    url: '/ota-baseline/mpt/ecu/listAllEcuType',
    method: 'get'
  })
}

// 查询ECU信息详细
export function getEcu(ecuId) {
  return request({
    url: '/ota-baseline/mpt/ecu/' + ecuId,
    method: 'get'
  })
}

// 新增ECU信息
export function addEcu(data) {
  return request({
    url: '/ota-baseline/mpt/ecu',
    method: 'post',
    data: data
  })
}

// 修改ECU信息
export function updateEcu(data) {
  return request({
    url: '/ota-baseline/mpt/ecu',
    method: 'put',
    data: data
  })
}

// 删除ECU信息
export function delEcu(brandIds) {
  return request({
    url: '/ota-baseline/mpt/ecu/' + brandIds,
    method: 'delete'
  })
}
