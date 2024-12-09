import request from '@/utils/request'

// 查询可改配车辆销售订单列表
export function listModelConfigChangeableOrder(query) {
  return request({
    url: '/otd-vso/mpt/vehicleSaleOrder/listModelConfigChangeable',
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

// 修改销售车型配置
export function updateSaleModelConfig(saleModelId, data) {
  return request({
    url: '/otd-vso/mpt/saleModel/' + saleModelId + '/config',
    method: 'put',
    data: data
  })
}