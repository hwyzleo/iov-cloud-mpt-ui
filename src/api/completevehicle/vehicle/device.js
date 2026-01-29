import request from '@/utils/request'

// 查询设备信息列表
export function listDevice(query) {
  return request({
    url: '/tsp-vmd/mpt/device/list',
    method: 'get',
    params: query
  })
}

// 查询所有设备项
export function listAllDeviceItem() {
  return request({
    url: '/tsp-vmd/mpt/device/listAllDeviceItem',
    method: 'get'
  })
}

// 查询所有设备
export function listAllDevice() {
  return request({
    url: '/tsp-vmd/mpt/device/listAllDevice',
    method: 'get'
  })
}

// 查询设备信息详细
export function getDevice(deviceId) {
  return request({
    url: '/tsp-vmd/mpt/device/' + deviceId,
    method: 'get'
  })
}

// 新增设备信息
export function addDevice(data) {
  return request({
    url: '/tsp-vmd/mpt/device',
    method: 'post',
    data: data
  })
}

// 修改设备信息
export function updateDevice(data) {
  return request({
    url: '/tsp-vmd/mpt/device',
    method: 'put',
    data: data
  })
}

// 删除设备信息
export function delDevice(deviceIds) {
  return request({
    url: '/tsp-vmd/mpt/device/' + deviceIds,
    method: 'delete'
  })
}
