import type { InternalAxiosRequestConfig } from 'axios'
import { useUserStore } from '@/pinia/user'

export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  console.log(config)
  const userStore = useUserStore()
  console.log(userStore)

  // 如果有token则添加到请求头
  if (userStore.token) {
    config.headers.set('Authorization', `Bearer ${userStore.token}`)
  }

  return config
}

export const requestErrorInterceptor = (error: any) => {
  return Promise.reject(error)
}
