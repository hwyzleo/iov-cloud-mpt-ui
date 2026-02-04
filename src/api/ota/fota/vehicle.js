import request from '@/utils/request'

// 查询升级车辆列表
export function listVehicle(query) {
  return request({
    url: '/ota-fota/mpt/vehicle/list',
    method: 'get',
    params: query
  })
}

// 查询升级车辆详细
export function getVehicle(vin) {
  return request({
    url: '/ota-fota/mpt/vehicle/' + vin,
    method: 'get'
  })
}
