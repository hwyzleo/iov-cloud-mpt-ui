import request from '@/utils/request'

// 查询软件零件信息列表
export function listSoftwarePart(query) {
  return request({
    url: '/ota-baseline/mpt/softwarePart/list',
    method: 'get',
    params: query
  })
}

// 获取所有软件零件
export function listAllSoftwarePart(query) {
  return request({
    url: '/ota-baseline/mpt/softwarePart/listAllSoftwarePart',
    method: 'get',
    params: query
  })
}

// 查询软件零件信息详细
export function getSoftwarePart(softwarePartId) {
  return request({
    url: '/ota-baseline/mpt/softwarePart/' + softwarePartId,
    method: 'get'
  })
}

// 新增软件零件信息
export function addSoftwarePart(data) {
  return request({
    url: '/ota-baseline/mpt/softwarePart',
    method: 'post',
    data: data
  })
}

// 修改软件零件信息
export function updateSoftwarePart(data) {
  return request({
    url: '/ota-baseline/mpt/softwarePart',
    method: 'put',
    data: data
  })
}

// 删除软件零件信息
export function delSoftwarePart(softwarePartIds) {
  return request({
    url: '/ota-baseline/mpt/softwarePart/' + softwarePartIds,
    method: 'delete'
  })
}
