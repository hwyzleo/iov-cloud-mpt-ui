import request from '@/utils/request'

// 查询销售车型列表
export function listSaleModel(query) {
  return request({
    url: '/otd-vso/mpt/saleModel/list',
    method: 'get',
    params: query
  })
}

// 查询销售车型详细
export function getSaleModel(saleModelId) {
  return request({
    url: '/otd-vso/mpt/saleModel/' + saleModelId,
    method: 'get'
  })
}

// 查询销售车型配置列表
export function listSaleModelConfig(saleModelId) {
  return request({
    url: '/otd-vso/mpt/saleModel/' + saleModelId + '/config',
    method: 'get'
  })
}

// 查询销售车型配置详细
export function getSaleModelConfig(saleModelId, saleModelConfigId) {
  return request({
    url: '/otd-vso/mpt/saleModel/' + saleModelId + '/config/' + saleModelConfigId,
    method: 'get'
  })
}

// 新增销售车型
export function addSaleModel(data) {
  return request({
    url: '/otd-vso/mpt/saleModel',
    method: 'post',
    data: data
  })
}

// 修改销售车型
export function updateSaleModel(data) {
  return request({
    url: '/otd-vso/mpt/saleModel',
    method: 'put',
    data: data
  })
}

// 修改销售车型图片集
export function updateSaleModelImages(data) {
  return request({
    url: '/otd-vso/mpt/saleModel/images',
    method: 'put',
    data: data
  })
}

// 新增销售车型配置
export function addSaleModelConfig(saleModelId, data) {
  return request({
    url: '/otd-vso/mpt/saleModel/' + saleModelId + '/config',
    method: 'post',
    data: data
  })
}

// 修改销售车型配置
export function updateSaleModelConfig(saleModelId, data) {
  return request({
    url: '/otd-vso/mpt/saleModel/' + saleModelId + '/config',
    method: 'put',
    data: data
  })
}

// 删除销售车型
export function delSaleModel(saleModelId) {
  return request({
    url: '/otd-vso/mpt/saleModel/' + saleModelId,
    method: 'delete'
  })
}

// 删除销售车型配置
export function delSaleModelConfig(saleModelId, saleModelConfigId) {
  return request({
    url: '/otd-vso/mpt/saleModel/' + saleModelId + '/config/' + saleModelConfigId,
    method: 'delete'
  })
}
