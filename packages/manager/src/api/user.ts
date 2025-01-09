import request from '@/axios/request'
import type { UserInfo } from '@/types'

export interface UserQuery {
  username?: string
  status?: 0 | 1
  pageNum: number
  pageSize: number
}

export interface UserForm {
  id?: number
  username: string
  password?: string
  status: 0 | 1
  email?: string
  phone?: string
  avatar?: string
}

export interface UserRoleForm {
  userId: number
  roles: string[]
}

// 获取用户列表
export const getUserList = (params: UserQuery) => {
  return request.get<{
    list: UserInfo[]
    total: number
  }>('/user/list', { params })
}

// 创建用户
export const createUser = (data: UserForm) => {
  return request.post('/user/create', data)
}

// 更新用户
export const updateUser = (data: UserForm) => {
  return request.put(`/user/update/${data.id}`, data)
}

// 删除用户
export const deleteUser = (id: number) => {
  return request.delete(`/user/delete/${id}`)
}

// 更新用户角色
export const updateUserRoles = (data: UserRoleForm) => {
  return request.put('/user/update-roles', data)
}

// 获取单个用户详情
export const getUserDetail = (id: number) => {
  return request.get<UserInfo>(`/user/detail/${id}`)
}
