import request from '@/utils/request'

// 查询预入库单列表
export function listPreInboundOrder(query) {
  query.warehouseLevel = "PDC";
  return request({
    url: '/otd-wms/mpt/preInboundOrder/list',
    method: 'get',
    params: query
  })
}

// 查询预入库单详细
export function getPreInboundOrder(preInboundOrderId) {
  return request({
    url: '/otd-wms/mpt/preInboundOrder/' + preInboundOrderId,
    method: 'get'
  })
}

// 新增预入库单
export function addPreInboundOrder(data) {
  data.warehouseLevel = "PDC";
  return request({
    url: '/otd-wms/mpt/preInboundOrder',
    method: 'post',
    data: data
  })
}

// 修改预入库单
export function updatePreInboundOrder(data) {
  return request({
    url: '/otd-wms/mpt/preInboundOrder',
    method: 'put',
    data: data
  })
}

// 删除预入库单
export function delPreInboundOrder(preInboundOrderIds) {
  return request({
    url: '/otd-wms/mpt/preInboundOrder/' + preInboundOrderIds,
    method: 'delete'
  })
}
