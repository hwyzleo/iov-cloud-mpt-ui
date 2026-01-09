import request from '@/utils/request'

// 查询软件内部版本信息列表
export function listSoftwareBuildVersion(query) {
  return request({
    url: '/ota-baseline/mpt/softwareBuildVersion/list',
    method: 'get',
    params: query
  })
}

// 查询软件内部版本下软件包
export function listSoftwareBuildVersionPackage(softwareBuildVersionId, query) {
  return request({
    url: '/ota-baseline/mpt/softwareBuildVersion/' + softwareBuildVersionId + '/listSoftwarePackage',
    method: 'get',
    params: query
  })
}

// 查询软件内部版本下依赖
export function listSoftwareBuildVersionDependency(softwareBuildVersionId, query) {
  return request({
    url: '/ota-baseline/mpt/softwareBuildVersion/' + softwareBuildVersionId + '/listDependency',
    method: 'get',
    params: query
  })
}

// 查询软件内部版本信息详细
export function getSoftwareBuildVersion(softwareBuildVersionId) {
  return request({
    url: '/ota-baseline/mpt/softwareBuildVersion/' + softwareBuildVersionId,
    method: 'get'
  })
}

// 新增软件内部版本信息
export function addSoftwareBuildVersion(data) {
  return request({
    url: '/ota-baseline/mpt/softwareBuildVersion',
    method: 'post',
    data: data
  })
}

// 新增关联的软件包
export function addSoftwarePackage(softwareBuildVersionId, softwarePackageIds) {
  return request({
    url: '/ota-baseline/mpt/softwareBuildVersion/' + softwareBuildVersionId + '/action/addSoftwarePackage/' + softwarePackageIds,
    method: 'post'
  })
}

// 新增依赖的软件内部版本
export function addDependency(softwareBuildVersionId, softwareBuildVersionIds, adaptionLevel) {
  return request({
    url: '/ota-baseline/mpt/softwareBuildVersion/' + softwareBuildVersionId + '/action/addDependency/' + softwareBuildVersionIds + '?adaptionLevel=' + adaptionLevel,
    method: 'post'
  })
}

// 修改软件内部版本信息
export function updateSoftwareBuildVersion(data) {
  return request({
    url: '/ota-baseline/mpt/softwareBuildVersion',
    method: 'put',
    data: data
  })
}

// 删除软件内部版本信息
export function delSoftwareBuildVersion(softwareBuildVersionIds) {
  return request({
    url: '/ota-baseline/mpt/softwareBuildVersion/' + softwareBuildVersionIds,
    method: 'delete'
  })
}

// 删除关联的软件包
export function delSoftwarePackage(softwareBuildVersionId, softwarePackageIds) {
  return request({
    url: '/ota-baseline/mpt/softwareBuildVersion/' + softwareBuildVersionId + '/action/removeSoftwarePackage/' + softwarePackageIds,
    method: 'post'
  })
}

// 删除依赖的软件内部版本
export function delDependency(softwareBuildVersionId, softwarePartVersionIds) {
  return request({
    url: '/ota-baseline/mpt/softwareBuildVersion/' + softwareBuildVersionId + '/action/removeDependency/' + softwarePartVersionIds,
    method: 'post'
  })
}
