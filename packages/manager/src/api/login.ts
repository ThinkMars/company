import request from '@/axios/request'
import type {
  CaptchaResponse,
  LoginResponse,
} from './interface/login.interface'

// 获取验证码
export function getCaptcha() {
  return request<any, CaptchaResponse>({
    url: '/admin/captcha',
    method: 'get',
  })
}

// 登录
export function login(data: any) {
  return request<any, LoginResponse>({
    url: '/admin/login',
    method: 'post',
    data,
  })
}

// 修改密码
export function changePassword(data: {
  oldPassword: string
  newPassword: string
  confirmPassword: string
  captchaId: string
  captchaText: string
}) {
  return request({
    url: '/admin/change-password',
    method: 'post',
    data,
  })
}
