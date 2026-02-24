import request from '@/utils/request'

// 查询生产配置列表
export function listBuildConfig(query) {
  return request({
    url: '/tsp-vmd/mpt/buildConfig/list',
    method: 'get',
    params: query
  })
}

// 查询生产配置详细
export function getBuildConfig(buildConfigId) {
  return request({
    url: '/tsp-vmd/mpt/buildConfig/' + buildConfigId,
    method: 'get'
  })
}

// 新增生产配置
export function addBuildConfig(data) {
  return request({
    url: '/tsp-vmd/mpt/buildConfig',
    method: 'post',
    data: data
  })
}

// 修改生产配置
export function updateBuildConfig(data) {
  return request({
    url: '/tsp-vmd/mpt/buildConfig',
    method: 'put',
    data: data
  })
}

// 删除生产配置
export function delBuildConfig(buildConfigIds) {
  return request({
    url: '/tsp-vmd/mpt/buildConfig/' + buildConfigIds,
    method: 'delete'
  })
}
