import { type InternalAxiosRequestConfig } from 'axios'

export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  console.log(config)
  // console.log(userStore)

  // 如果有token则添加到请求头
  // if (userStore.token) {
  //   config.headers.set('Authorization', `Bearer ${userStore.token}`)
  // }

  return config
}

export const requestErrorInterceptor = (error: Error) => {
  return Promise.reject(error)
}
