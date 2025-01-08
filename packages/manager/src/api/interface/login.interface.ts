// 登录接口
export interface LoginResponse {
  access_token: string
  userInfo: {
    username: string
    avatar: string
    role: string
    permissions: string[]
  }
}

export interface CaptchaResponse {
  captchaId: string
  svg: string
}
