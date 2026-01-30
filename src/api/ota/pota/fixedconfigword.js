import request from '@/utils/request'

// 查询固定配置字列表
export function listFixedConfigWord(query) {
  return request({
    url: '/ota-pota/mpt/fixedConfigWord/list',
    method: 'get',
    params: query
  })
}

// 查询固定配置字详细
export function getFixedConfigWord(fixedConfigWordId) {
  return request({
    url: '/ota-pota/mpt/fixedConfigWord/' + fixedConfigWordId,
    method: 'get'
  })
}

// 新增固定配置字
export function addFixedConfigWord(data) {
  return request({
    url: '/ota-pota/mpt/fixedConfigWord',
    method: 'post',
    data: data
  })
}

// 修改固定配置字
export function updateFixedConfigWord(data) {
  return request({
    url: '/ota-pota/mpt/fixedConfigWord',
    method: 'put',
    data: data
  })
}

// 删除固定配置字
export function delFixedConfigWord(fixedConfigWordIds) {
  return request({
    url: '/ota-pota/mpt/fixedConfigWord/' + fixedConfigWordIds,
    method: 'delete'
  })
}

// 查询固定配置字下配置字列表
export function listConfigWord(fixedConfigWordId) {
  return request({
    url: '/ota-pota/mpt/fixedConfigWord/' + fixedConfigWordId + '/configWord',
    method: 'get'
  })
}

// 查询固定配置字下配置字详细
export function getConfigWord(fixedConfigWordId, configWordId) {
  return request({
    url: '/ota-pota/mpt/fixedConfigWord/' + fixedConfigWordId + '/configWord/' + configWordId,
    method: 'get'
  })
}

// 新增固定配置字下配置字
export function addConfigWord(fixedConfigWordId, data) {
  return request({
    url: '/ota-pota/mpt/fixedConfigWord/' + fixedConfigWordId + '/configWord',
    method: 'post',
    data: data
  })
}

// 修改固定配置字下配置字
export function updateConfigWord(fixedConfigWordId, data) {
  return request({
    url: '/ota-pota/mpt/fixedConfigWord/' + fixedConfigWordId + '/configWord',
    method: 'put',
    data: data
  })
}

// 删除固定配置字下配置字
export function delConfigWord(fixedConfigWordId, configWordIds) {
  return request({
    url: '/ota-pota/mpt/fixedConfigWord/' + fixedConfigWordId + '/configWord/' + configWordIds,
    method: 'delete'
  })
}
