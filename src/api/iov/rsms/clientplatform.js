import request from '@/utils/request'

// 查询客户端平台列表
export function listClientPlatform(query) {
  return request({
    url: '/tsp-rsms/mpt/clientPlatform/list',
    method: 'get',
    params: query
  })
}

// 查询客户端平台详细
export function getClientPlatform(clientPlatformId) {
  return request({
    url: '/tsp-rsms/mpt/clientPlatform/' + clientPlatformId,
    method: 'get'
  })
}

// 新增客户端平台
export function addClientPlatform(data) {
  return request({
    url: '/tsp-rsms/mpt/clientPlatform',
    method: 'post',
    data: data
  })
}

// 修改客户端平台
export function updateClientPlatform(data) {
  return request({
    url: '/tsp-rsms/mpt/clientPlatform',
    method: 'put',
    data: data
  })
}

// 删除客户端平台
export function delClientPlatform(clientPlatformIds) {
  return request({
    url: '/tsp-rsms/mpt/clientPlatform/' + clientPlatformIds,
    method: 'delete'
  })
}
