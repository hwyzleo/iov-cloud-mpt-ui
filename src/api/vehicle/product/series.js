import request from '@/utils/request'

// 查询车系列表
export function listSeries(query) {
  return request({
    url: '/tsp-vmd/mpt/series/list',
    method: 'get',
    params: query
  })
}

// 查询车系详细
export function getSeries(seriesId) {
  return request({
    url: '/tsp-vmd/mpt/series/' + seriesId,
    method: 'get'
  })
}

// 新增车系
export function addSeries(data) {
  return request({
    url: '/tsp-vmd/mpt/series',
    method: 'post',
    data: data
  })
}

// 修改车系
export function updateSeries(data) {
  return request({
    url: '/tsp-vmd/mpt/series',
    method: 'put',
    data: data
  })
}

// 删除车系
export function delSeries(seriesId) {
  return request({
    url: '/tsp-vmd/mpt/series/' + seriesId,
    method: 'delete'
  })
}
