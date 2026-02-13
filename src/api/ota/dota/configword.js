import request from '@/utils/request'

// 查询配置字列表
export function listConfigWord(query) {
  return request({
    url: '/ota-dota/mpt/configWord/list',
    method: 'get',
    params: query
  })
}

// 查询配置字配置文件列表
export function listConfigWordProfile(configWordCode, query) {
  return request({
    url: '/ota-dota/mpt/configWord/' + configWordCode + '/profile/list',
    method: 'get',
    params: query
  })
}

// 查询配置字字段列表
export function listConfigWordField(configWordCode, configWordProfileCode, query) {
  return request({
    url: '/ota-dota/mpt/configWord/' + configWordCode + '/profile/' + configWordProfileCode + '/field/list',
    method: 'get',
    params: query
  })
}

// 查询配置字详细
export function getConfigWord(configWordId) {
  return request({
    url: '/ota-dota/mpt/configWord/' + configWordId,
    method: 'get'
  })
}

// 查询配置字配置文件详细
export function getConfigWordProfile(configWordCode, configWordProfileId) {
  return request({
    url: '/ota-dota/mpt/configWord/' + configWordCode + '/profile/' + configWordProfileId,
    method: 'get'
  })
}

// 查询配置字字段详细
export function getConfigWordField(configWordCode, configWordProfileCode, configWordFieldId) {
  return request({
    url: '/ota-dota/mpt/configWord/' + configWordCode + '/profile/' + configWordProfileCode + '/field/' + configWordFieldId,
    method: 'get'
  })
}

// 新增配置字
export function addConfigWord(data) {
  return request({
    url: '/ota-dota/mpt/configWord',
    method: 'post',
    data: data
  })
}

// 新增配置字配置文件
export function addConfigWordProfile(configWordCode, data) {
  return request({
    url: '/ota-dota/mpt/configWord/' + configWordCode + '/profile',
    method: 'post',
    data: data
  })
}

// 新增配置字字段
export function addConfigWordField(configWordCode, configWordProfileCode, data) {
  return request({
    url: '/ota-dota/mpt/configWord/' + configWordCode + '/profile/' + configWordProfileCode + '/field',
    method: 'post',
    data: data
  })
}

// 修改配置字
export function updateConfigWord(data) {
  return request({
    url: '/ota-dota/mpt/configWord',
    method: 'put',
    data: data
  })
}

// 修改配置字配置文件
export function updateConfigWordProfile(configWordCode, data) {
  return request({
    url: '/ota-dota/mpt/configWord/' + configWordCode + '/profile',
    method: 'put',
    data: data
  })
}

// 修改配置字字段
export function updateConfigWordField(configWordCode, configWordProfileCode, data) {
  return request({
    url: '/ota-dota/mpt/configWord/' + configWordCode + '/profile/' + configWordProfileCode + '/field',
    method: 'put',
    data: data
  })
}

// 删除配置字
export function delConfigWord(configWordIds) {
  return request({
    url: '/ota-dota/mpt/configWord/' + configWordIds,
    method: 'delete'
  })
}

// 删除配置字配置文件
export function delConfigWordProfile(configWordCode, configWordProfileIds) {
  return request({
    url: '/ota-dota/mpt/configWord/' + configWordCode + '/profile/' + configWordProfileIds,
    method: 'delete'
  })
}

// 删除配置字字段
export function delConfigWordField(configWordCode, configWordProfileCode, configWordFieldIds) {
  return request({
    url: '/ota-dota/mpt/configWord/' + configWordCode + '/profile/' + configWordProfileCode + '/field/' + configWordFieldIds,
    method: 'delete'
  })
}
