import request from '@/utils/request'

// 查询基础车型列表
export function listBaseModel(query) {
  return request({
    url: '/tsp-vmd/mpt/baseModel/list',
    method: 'get',
    params: query
  })
}

// 查询基础车型列表
export function listBaseModelFeatureCode(baseModelCode, query) {
  return request({
    url: '/tsp-vmd/mpt/baseModel/' + baseModelCode + '/featureCode/list',
    method: 'get',
    params: query
  })
}

// 查询车型平台及车系及车型下基础车型列表
export function listBaseModelByPlatformCodeAndSeriesCodeAndModelCode(platformCode, seriesCode, modelCode) {
  const params = {
    platformCode: platformCode,
    seriesCode: seriesCode,
    modelCode: modelCode
  }
  return request({
    url: '/tsp-vmd/mpt/baseModel/listByPlatformCodeAndSeriesCodeAndModelCode',
    method: 'get',
    params: params
  })
}

// 查询基础车型详细
export function getBaseModel(basicModelId) {
  return request({
    url: '/tsp-vmd/mpt/baseModel/' + basicModelId,
    method: 'get'
  })
}

// 查询基础车型详细
export function getBaseModelFeatureCode(baseModelCode, baseModelFeatureCodeId) {
  return request({
    url: '/tsp-vmd/mpt/baseModel/' + baseModelCode + '/featureCode/' + baseModelFeatureCodeId,
    method: 'get'
  })
}

// 新增基础车型
export function addBaseModel(data) {
  return request({
    url: '/tsp-vmd/mpt/baseModel',
    method: 'post',
    data: data
  })
}

// 新增基础车型
export function addBaseModelFeatureCode(baseModelCode, data) {
  return request({
    url: '/tsp-vmd/mpt/baseModel/' + baseModelCode + '/featureCode',
    method: 'post',
    data: data
  })
}

// 修改基础车型
export function updateBaseModel(data) {
  return request({
    url: '/tsp-vmd/mpt/baseModel',
    method: 'put',
    data: data
  })
}

// 修改基础车型
export function updateBaseModelFeatureCode(baseModelCode, data) {
  return request({
    url: '/tsp-vmd/mpt/baseModel/' + baseModelCode + '/featureCode',
    method: 'put',
    data: data
  })
}

// 删除基础车型
export function delBaseModel(baseModelIds) {
  return request({
    url: '/tsp-vmd/mpt/baseModel/' + baseModelIds,
    method: 'delete'
  })
}

// 删除基础车型
export function delBaseModelFeatureCode(baseModelCode, baseModelIds) {
  return request({
    url: '/tsp-vmd/mpt/baseModel/' + baseModelCode + '/featureCode/' + baseModelIds,
    method: 'delete'
  })
}
