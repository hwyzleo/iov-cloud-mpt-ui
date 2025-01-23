import request from '@/utils/request'

// 查询轮胎轮毂列表
export function listWheel(query) {
  return request({
    url: '/tsp-vmd/mpt/wheel/list',
    method: 'get',
    params: query
  })
}

// 查询车型平台及车系下轮胎轮毂列表
export function listWheelByPlatformCodeAndSeriesCode(platformCode, seriesCode) {
  const params = {
    platformCode: platformCode,
    seriesCode: seriesCode
  }
  return request({
    url: '/tsp-vmd/mpt/wheel/listByPlatformCodeAndSeriesCode',
    method: 'get',
    params: params
  })
}

// 查询轮胎轮毂详细
export function getWheel(wheelId) {
  return request({
    url: '/tsp-vmd/mpt/wheel/' + wheelId,
    method: 'get'
  })
}

// 新增轮胎轮毂
export function addWheel(data) {
  return request({
    url: '/tsp-vmd/mpt/wheel',
    method: 'post',
    data: data
  })
}

// 修改轮胎轮毂
export function updateWheel(data) {
  return request({
    url: '/tsp-vmd/mpt/wheel',
    method: 'put',
    data: data
  })
}

// 删除轮胎轮毂
export function delWheel(wheelIds) {
  return request({
    url: '/tsp-vmd/mpt/wheel/' + wheelIds,
    method: 'delete'
  })
}
