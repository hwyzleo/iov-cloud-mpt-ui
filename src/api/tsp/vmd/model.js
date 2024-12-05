import request from '@/utils/request'

// 查询车型列表
export function listModel(query) {
  return request({
    url: '/tsp-vmd/mpt/model/list',
    method: 'get',
    params: query
  })
}

// 查询车型详细
export function getModel(modelId) {
  return request({
    url: '/tsp-vmd/mpt/model/' + modelId,
    method: 'get'
  })
}

// 新增车型
export function addModel(data) {
  return request({
    url: '/tsp-vmd/mpt/model',
    method: 'post',
    data: data
  })
}

// 修改车型
export function updateModel(data) {
  return request({
    url: '/tsp-vmd/mpt/model',
    method: 'put',
    data: data
  })
}

// 删除车型
export function delModel(modelIds) {
  return request({
    url: '/tsp-vmd/mpt/model/' + modelIds,
    method: 'delete'
  })
}
