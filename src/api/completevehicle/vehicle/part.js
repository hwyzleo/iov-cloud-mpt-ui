import request from '@/utils/request'

// 查询零件信息列表
export function listPart(query) {
  return request({
    url: '/tsp-vmd/mpt/part/list',
    method: 'get',
    params: query
  })
}

// 查询零件信息详细
export function getPart(partId) {
  return request({
    url: '/tsp-vmd/mpt/part/' + partId,
    method: 'get'
  })
}

// 新增零件信息
export function addPart(data) {
  return request({
    url: '/tsp-vmd/mpt/part',
    method: 'post',
    data: data
  })
}

// 修改零件信息
export function updatePart(data) {
  return request({
    url: '/tsp-vmd/mpt/part',
    method: 'put',
    data: data
  })
}

// 删除零件信息
export function delPart(partIds) {
  return request({
    url: '/tsp-vmd/mpt/part/' + partIds,
    method: 'delete'
  })
}
