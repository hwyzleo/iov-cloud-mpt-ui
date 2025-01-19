import request from '@/utils/request'

// 查询基础车型列表
export function listBasicModel(query) {
  return request({
    url: '/tsp-vmd/mpt/basicModel/list',
    method: 'get',
    params: query
  })
}

// 查询车型平台及车系及车型下基础车型列表
export function listBasicModelByPlatformCodeAndSeriesCodeAndModelCode(platformCode, seriesCode, modelCode) {
  const params = {
    platformCode: platformCode,
    seriesCode: seriesCode,
    modelCode: modelCode
  }
  return request({
    url: '/tsp-vmd/mpt/basicModel/listByPlatformCodeAndSeriesCodeAndModelCode',
    method: 'get',
    params: params
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
