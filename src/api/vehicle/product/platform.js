import request from '@/utils/request'

// 查询车辆平台列表
export function listPlatform(query) {
  return request({
    url: '/tsp-vmd/mpt/platform/list',
    method: 'get',
    params: query
  })
}

// 查询所有车辆平台列表
export function listAllPlatform() {
  return request({
    url: '/tsp-vmd/mpt/platform/listAll',
    method: 'get'
  })
}

// 查询车辆平台详细
export function getPlatform(platformId) {
  return request({
    url: '/tsp-vmd/mpt/platform/' + platformId,
    method: 'get'
  })
}

// 新增车辆平台
export function addPlatform(data) {
  return request({
    url: '/tsp-vmd/mpt/platform',
    method: 'post',
    data: data
  })
}

// 修改车辆平台
export function updatePlatform(data) {
  return request({
    url: '/tsp-vmd/mpt/platform',
    method: 'put',
    data: data
  })
}

// 删除车辆平台
export function delPlatform(platformId) {
  return request({
    url: '/tsp-vmd/mpt/platform/' + platformId,
    method: 'delete'
  })
}
