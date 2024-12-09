import request from '@/utils/request'

// 查询可配车车辆销售订单列表
export function listAssignableOrder(query) {
  return request({
    url: '/otd-vso/mpt/vehicleSaleOrder/listAssignable',
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

// 查询可分配车辆列表
export function listAssignableVehicle(query) {
  return request({
    url: '/otd-vso/mpt/vehicleSaleOrder/' + saleModelId + '/config',
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
