import request from '@/utils/request'

// 查询内饰颜色列表
export function listInterior(query) {
  return request({
    url: '/tsp-vmd/mpt/interior/list',
    method: 'get',
    params: query
  })
}

// 查询车型平台及车系下内饰颜色列表
export function listInteriorByPlatformCodeAndSeriesCode(platformCode, seriesCode) {
  const params = {
    platformCode: platformCode,
    seriesCode: seriesCode
  }
  return request({
    url: '/tsp-vmd/mpt/interior/listByPlatformCodeAndSeriesCode',
    method: 'get',
    params: params
  })
}

// 查询内饰颜色详细
export function getInterior(interiorId) {
  return request({
    url: '/tsp-vmd/mpt/interior/' + interiorId,
    method: 'get'
  })
}

// 新增内饰颜色
export function addInterior(data) {
  return request({
    url: '/tsp-vmd/mpt/interior',
    method: 'post',
    data: data
  })
}

// 修改内饰颜色
export function updateInterior(data) {
  return request({
    url: '/tsp-vmd/mpt/interior',
    method: 'put',
    data: data
  })
}

// 删除内饰颜色
export function delInterior(interiorIds) {
  return request({
    url: '/tsp-vmd/mpt/interior/' + interiorIds,
    method: 'delete'
  })
}
