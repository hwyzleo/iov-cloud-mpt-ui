import request from '@/utils/request'

// 查询运输相关车辆销售订单列表
export function listTransportOrder(query) {
  return request({
    url: '/otd-vso/mpt/vehicleSaleOrder/listTransport',
    method: 'get',
    params: query
  })
}

// 申请发运
export function applyTransport(orderNum) {
  const data = {
    orderNum: orderNum
  }
  return request({
    url: '/otd-vso/mpt/vehicleSaleOrder/action/applyTransport',
    method: 'post',
    data: data
  })
}
