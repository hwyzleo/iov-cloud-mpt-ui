import request from '@/utils/request'

// 查询移库信息列表
export function listInventoryTransfer(query) {
  query.warehouseLevel = "PDC";
  return request({
    url: '/otd-wms/mpt/inventoryTransfer/list',
    method: 'get',
    params: query
  })
}

// 查询移库信息详细
export function getInventoryTransfer(inventoryTransferId) {
  return request({
    url: '/otd-wms/mpt/inventoryTransfer/' + inventoryTransferId,
    method: 'get'
  })
}

// 新增移库信息
export function addInventoryTransfer(data) {
  data.warehouseLevel = "PDC";
  return request({
    url: '/otd-wms/mpt/inventoryTransfer',
    method: 'post',
    data: data
  })
}

// 修改移库信息
export function updateInventoryTransfer(data) {
  return request({
    url: '/otd-wms/mpt/inventoryTransfer',
    method: 'put',
    data: data
  })
}

// 删除移库信息
export function delInventoryTransfer(inventoryTransferIds) {
  return request({
    url: '/otd-wms/mpt/inventoryTransfer/' + inventoryTransferIds,
    method: 'delete'
  })
}
