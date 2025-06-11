import request from '@/utils/request'

// 查询入库单列表
export function listInboundOrder(query) {
  query.warehouseLevel = "PDC";
  return request({
    url: '/otd-wms/mpt/inboundOrder/list',
    method: 'get',
    params: query
  })
}

// 查询入库单详细
export function getInboundOrder(inboundOrderId) {
  return request({
    url: '/otd-wms/mpt/inboundOrder/' + inboundOrderId,
    method: 'get'
  })
}

// 新增入库单
export function addInboundOrder(data) {
  data.warehouseLevel = "PDC";
  return request({
    url: '/otd-wms/mpt/inboundOrder',
    method: 'post',
    data: data
  })
}

// 修改入库单
export function updateInboundOrder(data) {
  return request({
    url: '/otd-wms/mpt/inboundOrder',
    method: 'put',
    data: data
  })
}

// 删除入库单
export function delInboundOrder(inboundOrderIds) {
  return request({
    url: '/otd-wms/mpt/inboundOrder/' + inboundOrderIds,
    method: 'delete'
  })
}
