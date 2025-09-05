import request from '@/utils/request'

// 查询软件零件版本信息列表
export function listSoftwarePartVersion(query) {
  return request({
    url: '/ota-baseline/mpt/softwarePartVersion/list',
    method: 'get',
    params: query
  })
}

// 查询软件零件版本信息详细
export function getSoftwarePartVersion(softwarePartVersionId) {
  return request({
    url: '/ota-baseline/mpt/softwarePartVersion/' + softwarePartVersionId,
    method: 'get'
  })
}

// 新增软件零件版本信息
export function addSoftwarePartVersion(data) {
  return request({
    url: '/ota-baseline/mpt/softwarePartVersion',
    method: 'post',
    data: data
  })
}

// 修改软件零件版本信息
export function updateSoftwarePartVersion(data) {
  return request({
    url: '/ota-baseline/mpt/softwarePartVersion',
    method: 'put',
    data: data
  })
}

// 删除软件零件版本信息
export function delSoftwarePartVersion(softwarePartVersionIds) {
  return request({
    url: '/ota-baseline/mpt/softwarePartVersion/' + softwarePartVersionIds,
    method: 'delete'
  })
}
