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

// 注册
export function register(data: any) {
  return request({
    url: '/admin/register',
    method: 'post',
    data,
  })
}
