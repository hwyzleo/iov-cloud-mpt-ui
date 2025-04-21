import request from '@/utils/request'

// 查询可配车车辆销售订单列表
export function listAssignableOrder(query) {
  return request({
    url: '/otd-vso/mpt/vehicleSaleOrder/listAssignable',
    method: 'get',
    params: query
  })
}

// 绑定车辆到订单
export function bindingVehicle(vin, orderNum) {
  const data = {
    vin: vin,
    orderNum: orderNum
  }
  return request({
    url: '/otd-vso/mpt/vehicleSaleOrder/action/assignVehicle',
    method: 'post',
    data: data
  })
}
