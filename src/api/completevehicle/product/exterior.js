import request from '@/utils/request'

// 查询车身颜色列表
export function listExterior(query) {
  return request({
    url: '/tsp-vmd/mpt/exterior/list',
    method: 'get',
    params: query
  })
}

// 查询车型平台及车系下车身颜色列表
export function listExteriorByPlatformCodeAndSeriesCode(platformCode, seriesCode) {
  const params = {
    platformCode: platformCode,
    seriesCode: seriesCode
  }
  return request({
    url: '/tsp-vmd/mpt/exterior/listByPlatformCodeAndSeriesCode',
    method: 'get',
    params: params
  })
}

// 查询车身颜色详细
export function getExterior(exteriorId) {
  return request({
    url: '/tsp-vmd/mpt/exterior/' + exteriorId,
    method: 'get'
  })
}

// 新增车身颜色
export function addExterior(data) {
  return request({
    url: '/tsp-vmd/mpt/exterior',
    method: 'post',
    data: data
  })
}

// 修改车身颜色
export function updateExterior(data) {
  return request({
    url: '/tsp-vmd/mpt/exterior',
    method: 'put',
    data: data
  })
}

// 删除车身颜色
export function delExterior(exteriorIds) {
  return request({
    url: '/tsp-vmd/mpt/exterior/' + exteriorIds,
    method: 'delete'
  })
}
