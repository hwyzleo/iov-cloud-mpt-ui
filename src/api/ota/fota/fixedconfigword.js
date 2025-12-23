import request from '@/utils/request'

// 查询固定配置字列表
export function listFixedConfigWord(query) {
  return request({
    url: '/ota-fota/mpt/fixedConfigWord/list',
    method: 'get',
    params: query
  })
}

// 查询固定配置字详细
export function getFixedConfigWord(fixedConfigWordId) {
  return request({
    url: '/ota-fota/mpt/fixedConfigWord/' + fixedConfigWordId,
    method: 'get'
  })
}

// 新增固定配置字
export function addFixedConfigWord(data) {
  return request({
    url: '/ota-fota/mpt/fixedConfigWord',
    method: 'post',
    data: data
  })
}

// 修改固定配置字
export function updateFixedConfigWord(data) {
  return request({
    url: '/ota-fota/mpt/fixedConfigWord',
    method: 'put',
    data: data
  })
}

// 删除固定配置字
export function delFixedConfigWord(fixedConfigWordIds) {
  return request({
    url: '/ota-fota/mpt/fixedConfigWord/' + fixedConfigWordIds,
    method: 'delete'
  })
}
