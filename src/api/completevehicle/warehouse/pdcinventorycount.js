import request from '@/utils/request'

// 查询盘点信息列表
export function listInventoryCount(query) {
  query.warehouseLevel = "PDC";
  return request({
    url: '/otd-wms/mpt/inventoryCount/list',
    method: 'get',
    params: query
  })
}

// 查询盘点信息详细
export function getInventoryCount(inventoryCountId) {
  return request({
    url: '/otd-wms/mpt/inventoryCount/' + inventoryCountId,
    method: 'get'
  })
}

// 新增盘点信息
export function addInventoryCount(data) {
  data.warehouseLevel = "PDC";
  return request({
    url: '/otd-wms/mpt/inventoryCount',
    method: 'post',
    data: data
  })
}

// 修改盘点信息
export function updateInventoryCount(data) {
  return request({
    url: '/otd-wms/mpt/inventoryCount',
    method: 'put',
    data: data
  })
}

// 删除盘点信息
export function delInventoryCount(inventoryCountIds) {
  return request({
    url: '/otd-wms/mpt/inventoryCount/' + inventoryCountIds,
    method: 'delete'
  })
}
