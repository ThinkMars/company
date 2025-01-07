export interface UserInfo {
  id: number
  username: string
  status: 0 | 1
  email?: string
  phone?: string
  avatar?: string
  createTime: string
  updateTime: string
}

export interface PageResult<T> {
  list: T[]
  total: number
}

export interface Result<T> {
  code: number
  data: T
  message: string
}
