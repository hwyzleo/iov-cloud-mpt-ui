import request from '@/utils/request'

// 查询车型配置列表
export function listModelConfig(query) {
  return request({
    url: '/tsp-vmd/mpt/modelConfig/list',
    method: 'get',
    params: query
  })
}

// 查询车型配置详细
export function getModelConfig(modelConfigId) {
  return request({
    url: '/tsp-vmd/mpt/modelConfig/' + modelConfigId,
    method: 'get'
  })
}

// 新增车型配置
export function addModelConfig(data) {
  return request({
    url: '/tsp-vmd/mpt/modelConfig',
    method: 'post',
    data: data
  })
}

// 修改车型配置
export function updateModelConfig(data) {
  return request({
    url: '/tsp-vmd/mpt/modelConfig',
    method: 'put',
    data: data
  })
}

// 删除车型配置
export function delModelConfig(modelConfigIds) {
  return request({
    url: '/tsp-vmd/mpt/modelConfig/' + modelConfigIds,
    method: 'delete'
  })
}
