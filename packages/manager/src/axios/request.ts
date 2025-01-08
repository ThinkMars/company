import axios from 'axios'
import type { AxiosInstance } from 'axios'
import {
  requestInterceptor,
  requestErrorInterceptor,
} from './interceptors/request'
import {
  responseInterceptor,
  responseErrorInterceptor,
} from './interceptors/response'

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  withCredentials: true, // 允许跨域携带cookie
  headers: {
    'Content-Type': 'application/json',
  },
})

// 添加请求拦截器
request.interceptors.request.use(requestInterceptor, requestErrorInterceptor)

// 添加响应拦截器
request.interceptors.response.use(responseInterceptor, responseErrorInterceptor)

export default request
