import request from '@/utils/request'

// 查询库存列表
export function listInventory(query) {
  query.warehouseLevel = "PDC";
  return request({
    url: '/otd-wms/mpt/inventory/list',
    method: 'get',
    params: query
  })
}

// 查询库存详细
export function getInventory(inventoryId) {
  return request({
    url: '/otd-wms/mpt/inventory/' + inventoryId,
    method: 'get'
  })
}

// 新增库存
export function addInventory(data) {
  data.warehouseLevel = "PDC";
  return request({
    url: '/otd-wms/mpt/inventory',
    method: 'post',
    data: data
  })
}

// 修改库存
export function updateInventory(data) {
  return request({
    url: '/otd-wms/mpt/inventory',
    method: 'put',
    data: data
  })
}

// 删除库存
export function delInventory(inventoryIds) {
  return request({
    url: '/otd-wms/mpt/inventory/' + inventoryIds,
    method: 'delete'
  })
}
