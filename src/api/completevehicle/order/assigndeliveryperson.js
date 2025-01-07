import request from '@/utils/request'

// 查询没有交付人员的车辆销售订单列表
export function listOrderWithoutDeliveryPerson(query) {
  return request({
    url: '/otd-vso/mpt/vehicleSaleOrder/listWithoutDeliveryPerson',
    method: 'get',
    params: query
  })
}

// 查询交付中心员工列表
export function listDeliveryCenterStaff(query) {
  return request({
    url: '/otd-vso/mpt/vehicleSaleOrder/listDeliveryCenterStaff',
    method: 'get',
    params: query
  })
}

// 绑定交付人员到订单
export function bindingDeliveryPerson(userId, nickName, orderNum) {
  const data = {
    deliveryPersonId: userId,
    deliveryPersonName: nickName,
    orderNum: orderNum
  }
  return request({
    url: '/otd-vso/mpt/vehicleSaleOrder/action/assignDeliveryPerson',
    method: 'post',
    data: data
  })
}
