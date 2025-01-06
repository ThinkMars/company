import request from '@/axios/request'

// 获取验证码
export function getCaptcha() {
  return request({
    url: '/admin/captcha',
    method: 'get',
  })
}

// 登录
export function login(data: any) {
  return request({
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
