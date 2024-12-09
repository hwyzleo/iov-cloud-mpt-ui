import request from '@/utils/request'

// 查询令牌列表
export function listToken(query) {
  return request({
    url: '/tsp-account/mpt/token/list',
    method: 'get',
    params: query
  })
}

// 查询令牌详细
export function getToken(tokenId) {
  return request({
    url: '/tsp-account/mpt/token/' + tokenId,
    method: 'get'
  })
}

// 新增令牌
export function addToken(data) {
  return request({
    url: '/tsp-account/mpt/token',
    method: 'post',
    data: data
  })
}

// 修改令牌
export function updateToken(data) {
  return request({
    url: '/tsp-account/mpt/token',
    method: 'put',
    data: data
  })
}

// 删除令牌
export function delToken(tokenIds) {
  return request({
    url: '/tsp-account/mpt/token/' + tokenIds,
    method: 'delete'
  })
}
