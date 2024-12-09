import request from '@/utils/request'

// 查询客户端列表
export function listClient(query) {
  return request({
    url: '/tsp-account/mpt/client/list',
    method: 'get',
    params: query
  })
}

// 查询客户端详细
export function getClient(clientId) {
  return request({
    url: '/tsp-account/mpt/client/' + clientId,
    method: 'get'
  })
}

// 新增客户端
export function addClient(data) {
  return request({
    url: '/tsp-account/mpt/client',
    method: 'post',
    data: data
  })
}

// 修改客户端
export function updateClient(data) {
  return request({
    url: '/tsp-account/mpt/client',
    method: 'put',
    data: data
  })
}

// 删除客户端
export function delClient(clientIds) {
  return request({
    url: '/tsp-account/mpt/client/' + clientIds,
    method: 'delete'
  })
}
