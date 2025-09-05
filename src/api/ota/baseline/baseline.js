import request from '@/utils/request'

// 查询基线信息列表
export function listBaseline(query) {
  return request({
    url: '/ota-baseline/mpt/baseline/list',
    method: 'get',
    params: query
  })
}

// 查询基线信息详细
export function getBaseline(baselineId) {
  return request({
    url: '/ota-baseline/mpt/baseline/' + baselineId,
    method: 'get'
  })
}

// 新增基线信息
export function addBaseline(data) {
  return request({
    url: '/ota-baseline/mpt/baseline',
    method: 'post',
    data: data
  })
}

// 修改基线信息
export function updateBaseline(data) {
  return request({
    url: '/ota-baseline/mpt/baseline',
    method: 'put',
    data: data
  })
}

// 删除基线信息
export function delBaseline(baselineIds) {
  return request({
    url: '/ota-baseline/mpt/baseline/' + baselineIds,
    method: 'delete'
  })
}
