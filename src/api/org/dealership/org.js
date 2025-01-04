import request from '@/utils/request'

// 查询组织结构列表
export function listOrg(query) {
  return request({
    url: '/dms-org/mpt/org/list',
    method: 'get',
    params: query
  })
}

// 查询组织结构列表（排除节点）
export function listOrgExcludeChild(orgId) {
  return request({
    url: '/dms-org/mpt/org/list/exclude/' + orgId,
    method: 'get'
  })
}

// 查询组织结构详细
export function getOrg(orgId) {
  return request({
    url: '/dms-org/mpt/org/' + orgId,
    method: 'get'
  })
}

// 新增组织结构
export function addOrg(data) {
  return request({
    url: '/dms-org/mpt/org',
    method: 'post',
    data: data
  })
}

// 修改组织结构
export function updateOrg(data) {
  return request({
    url: '/dms-org/mpt/org',
    method: 'put',
    data: data
  })
}

// 删除组织结构
export function delOrg(orgId) {
  return request({
    url: '/dms-org/mpt/org/' + orgId,
    method: 'delete'
  })
}
