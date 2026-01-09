import request from '@/utils/request'

// 查询基线信息列表
export function listBaseline(query) {
  return request({
    url: '/ota-baseline/mpt/baseline/list',
    method: 'get',
    params: query
  })
}

// 分页查询基线下软件内部版本
export function listBaselineSoftwareBuildVersion(baselineId, query) {
  return request({
    url: '/ota-baseline/mpt/baseline/' + baselineId + '/listSoftwareBuildVersion',
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

// 新增关联的软件内部版本
export function addSoftwareBuildVersion(baselineId, softwareBuildVersionIds) {
  return request({
    url: '/ota-baseline/mpt/baseline/' + baselineId + '/action/addSoftwareBuildVersion/' + softwareBuildVersionIds,
    method: 'post'
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

// 删除关联的软件内部版本
export function delSoftwareBuildVersion(baselineId, softwareBuildVersionIds) {
  return request({
    url: '/ota-baseline/mpt/baseline/' + baselineId + '/action/removeSoftwareBuildVersion/' + softwareBuildVersionIds,
    method: 'post'
  })
}
