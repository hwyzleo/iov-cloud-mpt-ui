import request from '@/utils/request'

// 查询软件包信息列表
export function listSoftwarePackage(query) {
  return request({
    url: '/ota-baseline/mpt/softwarePackage/list',
    method: 'get',
    params: query
  })
}

// 获取所有软件零件版本
export function listAllSoftwarePartVersion() {
  return request({
    url: '/ota-baseline/mpt/softwarePackage/listAllSoftwarePartVersion',
    method: 'get'
  })
}

// 查询软件包信息详细
export function getSoftwarePackage(softwarePackageId) {
  return request({
    url: '/ota-baseline/mpt/softwarePackage/' + softwarePackageId,
    method: 'get'
  })
}

// 新增软件包信息
export function addSoftwarePackage(data) {
  return request({
    url: '/ota-baseline/mpt/softwarePackage',
    method: 'post',
    data: data
  })
}

// 修改软件包信息
export function updateSoftwarePackage(data) {
  return request({
    url: '/ota-baseline/mpt/softwarePackage',
    method: 'put',
    data: data
  })
}

// 删除软件包信息
export function delSoftwarePackage(softwarePackageIds) {
  return request({
    url: '/ota-baseline/mpt/softwarePackage/' + softwarePackageIds,
    method: 'delete'
  })
}
