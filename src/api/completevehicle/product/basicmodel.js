import request from '@/utils/request'

// 查询基础车型列表
export function listBasicModel(query) {
  return request({
    url: '/tsp-vmd/mpt/basicModel/list',
    method: 'get',
    params: query
  })
}

// 查询基础车型详细
export function getBasicModel(basicModelId) {
  return request({
    url: '/tsp-vmd/mpt/basicModel/' + basicModelId,
    method: 'get'
  })
}

// 新增基础车型
export function addBasicModel(data) {
  return request({
    url: '/tsp-vmd/mpt/basicModel',
    method: 'post',
    data: data
  })
}

// 修改基础车型
export function updateBasicModel(data) {
  return request({
    url: '/tsp-vmd/mpt/basicModel',
    method: 'put',
    data: data
  })
}

// 删除基础车型
export function delBasicModel(basicModelIds) {
  return request({
    url: '/tsp-vmd/mpt/basicModel/' + basicModelIds,
    method: 'delete'
  })
}
