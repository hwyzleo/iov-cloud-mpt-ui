import request from '@/utils/request'

// 查询承运商列表
export function listCarrier(query) {
  return request({
    url: '/otd-tms/mpt/carrier/list',
    method: 'get',
    params: query
  })
}

// 查询所有承运商列表
export function listAllCarrier() {
  return request({
    url: '/otd-tms/mpt/carrier/listAll',
    method: 'get'
  })
}

// 查询承运商详细
export function getCarrier(carrierId) {
  return request({
    url: '/otd-tms/mpt/carrier/' + carrierId,
    method: 'get'
  })
}

// 新增承运商
export function addCarrier(data) {
  return request({
    url: '/otd-tms/mpt/carrier',
    method: 'post',
    data: data
  })
}

// 修改承运商
export function updateCarrier(data) {
  return request({
    url: '/otd-tms/mpt/carrier',
    method: 'put',
    data: data
  })
}

// 删除承运商
export function delCarrier(carrierIds) {
  return request({
    url: '/otd-tms/mpt/carrier/' + carrierIds,
    method: 'delete'
  })
}
