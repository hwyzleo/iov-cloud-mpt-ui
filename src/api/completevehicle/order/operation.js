import request from '@/utils/request'

// 查询车辆销售订单列表
export function listOrder(query) {
  return request({
    url: '/otd-vso/mpt/vehicleSaleOrder/list',
    method: 'get',
    params: query
  })
}

// 查询车辆销售订单详细
export function getOrder(orderId) {
  return request({
    url: '/otd-vso/mpt/vehicleSaleOrder/' + orderId,
    method: 'get'
  })
}

// 新增车辆销售订单
export function addOrder(data) {
  return request({
    url: '/otd-vso/mpt/vehicleSaleOrder',
    method: 'post',
    data: data
  })
}

// 修改车辆销售订单
export function updateOrder(data) {
  return request({
    url: '/otd-vso/mpt/vehicleSaleOrder',
    method: 'put',
    data: data
  })
}

// 删除车辆销售订单
export function delOrder(orderId) {
  return request({
    url: '/otd-vso/mpt/vehicleSaleOrder/' + orderId,
    method: 'delete'
  })
}
