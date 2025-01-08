import request from '@/axios/request'

// 权限类型
export interface Permission {
  id: number
  parentId: number | null
  type: 1 | 2 | 3 // 1:目录 2:菜单 3:按钮
  name: string
  code: string
  path?: string
  icon?: string
  sort: number
  children?: Permission[]
}

// 获取权限列表
export function getPermissionList() {
  return request({
    url: '/permission/list',
    method: 'get',
  })
}

// 新增权限
export function addPermission(data: Omit<Permission, 'id' | 'children'>) {
  return request({
    url: '/permission',
    method: 'post',
    data,
  })
}

// 更新权限
export function updatePermission(id: number, data: Partial<Permission>) {
  return request({
    url: `/permission/${id}`,
    method: 'put',
    data,
  })
}

// 删除权限
export function deletePermission(id: number) {
  return request({
    url: `/permission/${id}`,
    method: 'delete',
  })
}
