import request from '@/utils/request'

// 查询仓库列表
export function listWarehouse(query) {
  return request({
    url: '/otd-wms/mpt/warehouse/list',
    method: 'get',
    params: query
  })
}

// 查询仓库下库区列表
export function listWarehouseStorageArea(warehouseId) {
  return request({
    url: '/otd-wms/mpt/warehouse/' + warehouseId + '/storageArea',
    method: 'get'
  })
}

// 查询仓库详细
export function getWarehouse(warehouseId) {
  return request({
    url: '/otd-wms/mpt/warehouse/' + warehouseId,
    method: 'get'
  })
}

// 新增仓库
export function addWarehouse(data) {
  return request({
    url: '/otd-wms/mpt/warehouse',
    method: 'post',
    data: data
  })
}

// 新增仓库储区
export function addWarehouseStorageArea(warehouseId, data) {
  return request({
    url: '/otd-wms/mpt/warehouse/' + warehouseId + '/storageArea',
    method: 'post',
    data: data
  })
}

// 修改仓库
export function updateWarehouse(data) {
  return request({
    url: '/otd-wms/mpt/warehouse',
    method: 'put',
    data: data
  })
}

// 修改仓库储区
export function updateWarehouseStorageArea(warehouseId, data) {
  return request({
    url: '/otd-wms/mpt/warehouse/' + warehouseId + '/storageArea',
    method: 'put',
    data: data
  })
}

// 删除仓库
export function delWarehouse(warehouseIds) {
  return request({
    url: '/otd-wms/mpt/warehouse/' + warehouseIds,
    method: 'delete'
  })
}

// 删除仓库储区
export function delWarehouseStorageArea(warehouseId, storageAreaId) {
  return request({
    url: '/otd-wms/mpt/warehouse/' + warehouseId + '/storageArea/' + storageAreaId,
    method: 'delete'
  })
}
