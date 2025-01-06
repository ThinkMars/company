import type { AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

// 响应成功拦截器
export const responseInterceptor = (response: AxiosResponse) => {
  const { data } = response
  return data
  // // TODO: 处理业务状态码
  // if (data.code === 20000) {
  //   return data
  // } else {
  //   ElMessage.error(data.message || '请求失败')
  //   return Promise.reject(new Error(data.message || '请求失败'))
  // }
}

// 响应错误拦截器
export const responseErrorInterceptor = (error: any) => {
  console.log(error)
  const { response } = error

  // 处理 HTTP 状态码
  if (response) {
    switch (response.status) {
      case 401:
        ElMessage.error('未授权，请重新登录')
        // 可以在这里处理登出逻辑
        break
      case 403:
        ElMessage.error('拒绝访问')
        break
      case 404:
        ElMessage.error('请求错误，未找到该资源')
        break
      case 500:
        ElMessage.error('服务器错误')
        break
      default:
        ElMessage.error(`连接错误${response.status}`)
    }
  } else {
    // 处理断网或请求超时
    if (error.message.includes('timeout')) {
      ElMessage.error('请求超时')
    } else {
      ElMessage.error('网络连接错误')
    }
  }

  return Promise.reject(error)
}
