import request from '@/utils/request'

// 查询软件零件版本信息列表
export function listSoftwarePartVersion(query) {
  return request({
    url: '/ota-baseline/mpt/softwarePartVersion/list',
    method: 'get',
    params: query
  })
}

// 查询软件零件版本下软件包
export function listSoftwarePartVersionPackage(softwarePartVersionId, query) {
  return request({
    url: '/ota-baseline/mpt/softwarePartVersion/' + softwarePartVersionId + '/listSoftwarePackage',
    method: 'get',
    params: query
  })
}

// 查询软件零件版本下依赖
export function listSoftwarePartVersionDependency(softwarePartVersionId, query) {
  return request({
    url: '/ota-baseline/mpt/softwarePartVersion/' + softwarePartVersionId + '/listDependency',
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

// 新增关联的软件包
export function addSoftwarePackage(softwarePartVersionId, softwarePackageIds) {
  return request({
    url: '/ota-baseline/mpt/softwarePartVersion/' + softwarePartVersionId + '/action/addSoftwarePackage/' + softwarePackageIds,
    method: 'post'
  })
}

// 新增依赖的软件零件版本
export function addDependency(softwarePartVersionId, softwarePartVersionIds, adaptionLevel) {
  return request({
    url: '/ota-baseline/mpt/softwarePartVersion/' + softwarePartVersionId + '/action/addDependency/' + softwarePartVersionIds + '?adaptionLevel=' + adaptionLevel,
    method: 'post'
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

// 删除关联的软件包
export function delSoftwarePackage(softwarePartVersionId, softwarePackageIds) {
  return request({
    url: '/ota-baseline/mpt/softwarePartVersion/' + softwarePartVersionId + '/action/removeSoftwarePackage/' + softwarePackageIds,
    method: 'post'
  })
}

// 删除依赖的软件零件版本
export function delDependency(softwarePartVersionId, softwarePartVersionIds) {
  return request({
    url: '/ota-baseline/mpt/softwarePartVersion/' + softwarePartVersionId + '/action/removeDependency/' + softwarePartVersionIds,
    method: 'post'
  })
}
