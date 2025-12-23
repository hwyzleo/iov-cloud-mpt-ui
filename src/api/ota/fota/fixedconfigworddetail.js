import request from '@/utils/request'

// 查询固定配置字明细列表
export function listFixedConfigWordDetail(fixedConfigWordId) {
  return request({
    url: '/ota-fota/mpt/fixedConfigWord/' + fixedConfigWordId + '/detail',
    method: 'get'
  })
}

// 查询固定配置字明细详细
export function getFixedConfigWordDetail(fixedConfigWordId, fixedConfigWordDetailId) {
  return request({
    url: '/ota-fota/mpt/fixedConfigWord/' + fixedConfigWordId + '/detail/' + fixedConfigWordDetailId,
    method: 'get'
  })
}

// 新增固定配置字明细
export function addFixedConfigWordDetail(fixedConfigWordId, data) {
  return request({
    url: '/ota-fota/mpt/fixedConfigWord/' + fixedConfigWordId + '/detail',
    method: 'post',
    data: data
  })
}

// 修改固定配置字明细
export function updateFixedConfigWordDetail(fixedConfigWordId, data) {
  return request({
    url: '/ota-fota/mpt/fixedConfigWord/' + fixedConfigWordId + '/detail',
    method: 'put',
    data: data
  })
}

// 删除固定配置字明细
export function delFixedConfigWordDetail(fixedConfigWordId, fixedConfigWordDetailIds) {
  return request({
    url: '/ota-fota/mpt/fixedConfigWord/' + fixedConfigWordId + '/detail/' + fixedConfigWordDetailIds,
    method: 'delete'
  })
}
