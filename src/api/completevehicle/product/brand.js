import request from '@/utils/request'

// 查询车辆品牌列表
export function listBrand(query) {
  return request({
    url: '/tsp-vmd/mpt/brand/list',
    method: 'get',
    params: query
  })
}

// 查询车辆品牌详细
export function getBrand(brandId) {
  return request({
    url: '/tsp-vmd/mpt/brand/' + brandId,
    method: 'get'
  })
}

// 新增车辆品牌
export function addBrand(data) {
  return request({
    url: '/tsp-vmd/mpt/brand',
    method: 'post',
    data: data
  })
}

// 修改车辆品牌
export function updateBrand(data) {
  return request({
    url: '/tsp-vmd/mpt/brand',
    method: 'put',
    data: data
  })
}

// 删除车辆品牌
export function delBrand(brandIds) {
  return request({
    url: '/tsp-vmd/mpt/brand/' + brandIds,
    method: 'delete'
  })
}
