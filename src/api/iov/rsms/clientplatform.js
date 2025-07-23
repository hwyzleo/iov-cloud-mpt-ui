import request from '@/utils/request'

// 查询客户端平台列表
export function listClientPlatform(query) {
  return request({
    url: '/tsp-rsms/mpt/clientPlatform/list',
    method: 'get',
    params: query
  })
}

// 查询客户端平台账号列表
export function listClientPlatformAccount(clientPlatformId) {
  return request({
    url: '/tsp-rsms/mpt/clientPlatform/' + clientPlatformId + '/account',
    method: 'get'
  })
}

// 查询客户端平台登录历史列表
export function listClientPlatformLoginHistory(clientPlatformId) {
  return request({
    url: '/tsp-rsms/mpt/clientPlatform/' + clientPlatformId + '/loginHistory',
    method: 'get'
  })
}

// 查询客户端平台详细
export function getClientPlatform(clientPlatformId) {
  return request({
    url: '/tsp-rsms/mpt/clientPlatform/' + clientPlatformId,
    method: 'get'
  })
}

// 查询客户端平台详细
export function getClientPlatformAccount(clientPlatformId, clientPlatformAccountId) {
  return request({
    url: '/tsp-rsms/mpt/clientPlatform/' + clientPlatformId + '/' + clientPlatformAccountId,
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

// 新增客户端平台账号
export function addClientPlatformAccount(clientPlatformId, data) {
  return request({
    url: '/tsp-rsms/mpt/clientPlatform/' + clientPlatformId,
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

// 修改客户端平台账号
export function updateClientPlatformAccount(clientPlatformId, data) {
  return request({
    url: '/tsp-rsms/mpt/clientPlatform/' + clientPlatformId,
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

// 删除客户端平台账号
export function delClientPlatformAccount(clientPlatformId, clientPlatformAccountIds) {
  return request({
    url: '/tsp-rsms/mpt/clientPlatform/' + clientPlatformId + '/' + clientPlatformAccountIds,
    method: 'delete'
  })
}

// 同步客户端平台信息
export function syncClientPlatformInfo(clientPlatformId) {
  return request({
    url: '/tsp-rsms/mpt/clientPlatform/' + clientPlatformId + '/action/syncPlatform',
    method: 'post'
  })
}

// 客户端平台登录
export function login(clientPlatformId, hostname) {
  return request({
    url: '/tsp-rsms/mpt/clientPlatform/' + clientPlatformId + '/action/login?hostname=' + hostname,
    method: 'post'
  })
}

// 客户端平台登出
export function logout(clientPlatformId, hostname) {
  return request({
    url: '/tsp-rsms/mpt/clientPlatform/' + clientPlatformId + '/action/logout?hostname=' + hostname,
    method: 'post'
  })
}
