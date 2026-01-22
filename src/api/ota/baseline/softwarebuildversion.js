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

// 查询软件内部版本下配置字
export function listSoftwareBuildVersionConfigWord(softwareBuildVersionId, query) {
  return request({
    url: '/ota-baseline/mpt/softwareBuildVersion/' + softwareBuildVersionId + '/listConfigWord',
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

// 查询软件内部版本配置字
export function getSoftwareBuildVersionConfigWord(softwareBuildVersionId, configWordId) {
  return request({
    url: '/ota-baseline/mpt/softwareBuildVersion/' + softwareBuildVersionId + '/configWord/' + configWordId,
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
export function addSoftwareBuildVersionPackage(softwareBuildVersionId, softwarePackageIds) {
  return request({
    url: '/ota-baseline/mpt/softwareBuildVersion/' + softwareBuildVersionId + '/action/addSoftwarePackage/' + softwarePackageIds,
    method: 'post'
  })
}

// 新增依赖的软件内部版本
export function addSoftwareBuildVersionDependency(softwareBuildVersionId, softwareBuildVersionIds, adaptionLevel) {
  return request({
    url: '/ota-baseline/mpt/softwareBuildVersion/' + softwareBuildVersionId + '/action/addDependency/' + softwareBuildVersionIds + '?adaptionLevel=' + adaptionLevel,
    method: 'post'
  })
}

// 新增软件内部版本配置字
export function addSoftwareBuildVersionConfigWord(softwareBuildVersionId, data) {
  return request({
    url: '/ota-baseline/mpt/softwareBuildVersion/' + softwareBuildVersionId + '/action/addConfigWord',
    method: 'post',
    data: data
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

// 修改依赖的软件内部版本
export function updateSoftwareBuildVersionDependency(softwareBuildVersionId, softwareBuildVersionIds, adaptionLevel) {
  return request({
    url: '/ota-baseline/mpt/softwareBuildVersion/' + softwareBuildVersionId + '/action/editDependency/' + softwareBuildVersionIds + '?adaptionLevel=' + adaptionLevel,
    method: 'post'
  })
}

// 修改依赖的软件内部版本
export function updateSoftwareBuildVersionConfigWord(softwareBuildVersionId, data) {
  return request({
    url: '/ota-baseline/mpt/softwareBuildVersion/' + softwareBuildVersionId + '/action/editConfigWord',
    method: 'post',
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
export function delSoftwareBuildVersionPackage(softwareBuildVersionId, softwarePackageIds) {
  return request({
    url: '/ota-baseline/mpt/softwareBuildVersion/' + softwareBuildVersionId + '/action/removeSoftwarePackage/' + softwarePackageIds,
    method: 'post'
  })
}

// 删除依赖的软件内部版本
export function delSoftwareBuildVersionDependency(softwareBuildVersionId, softwarePartVersionIds) {
  return request({
    url: '/ota-baseline/mpt/softwareBuildVersion/' + softwareBuildVersionId + '/action/removeDependency/' + softwarePartVersionIds,
    method: 'post'
  })
}

// 删除软件内部版本配置字
export function delSoftwareBuildVersionConfigWord(softwareBuildVersionId, configWordIds) {
  return request({
    url: '/ota-baseline/mpt/softwareBuildVersion/' + softwareBuildVersionId + '/action/removeConfigWord/' + configWordIds,
    method: 'post'
  })
}
