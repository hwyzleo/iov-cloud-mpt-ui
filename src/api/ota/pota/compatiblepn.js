import request from '@/utils/request'

// 查询兼容零件号列表
export function listCompatiblePn(query) {
  return request({
    url: '/ota-pota/mpt/compatiblePn/list',
    method: 'get',
    params: query
  })
}

// 查询兼容零件号详细
export function getCompatiblePn(compatiblePnId) {
  return request({
    url: '/ota-pota/mpt/compatiblePn/' + compatiblePnId,
    method: 'get'
  })
}

// 新增兼容零件号
export function addCompatiblePn(data) {
  return request({
    url: '/ota-pota/mpt/compatiblePn',
    method: 'post',
    data: data
  })
}

// 修改兼容零件号
export function updateCompatiblePn(data) {
  return request({
    url: '/ota-pota/mpt/compatiblePn',
    method: 'put',
    data: data
  })
}

// 删除兼容零件号
export function delCompatiblePn(compatiblePnIds) {
  return request({
    url: '/ota-pota/mpt/compatiblePn/' + compatiblePnIds,
    method: 'delete'
  })
}
