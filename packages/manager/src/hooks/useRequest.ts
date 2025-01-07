import { createFetch } from '@vueuse/core'
import { computed } from 'vue'
import { ErrorType } from '@/constants/errorTypes' // 引入错误类型常量枚举
import { useUserStoreHook } from '@/pinia/user' // 使用 Pinia 的用户 Store

// 缓存存储
const cacheMap = new Map<string, any>()

enum HttpYewuCode {
  /** 业务请求成功 */
  SUCCESS = 66666,
}

// 业务请求成功判断
export const isSuccessResponse = (code: number) => code === HttpYewuCode.SUCCESS

// 创建自定义 Fetch 实例
const useRequest = createFetch({
  baseUrl: import.meta.env.VITE_API_URL, // 基础 URL
  fetchOptions: {
    mode: 'cors', // 跨域请求
  },
  options: {
    immediate: false, // 默认不立即执行
    timeout: 10000, // 请求超时时间
    async beforeFetch({ options }) {
      const token = useUserStoreHook().token
      // 自动带上 Token
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        }
      }
      // 自定义请求参数格式化
      if (options.body) {
        options.body = formatRequest(options.body)
      }
      return { options }
    },
    async afterFetch({ data, response }) {
      // 自定义响应格式化
      const formattedData = formatResponse(data)

      // 检查业务 code 错误
      if (!response.ok) {
        throw {
          type: ErrorType.BUSINESS_ERROR,
          message: formattedData.message || '未知业务错误',
        }
      }

      return { data: formattedData }
    },
    onFetchError({ error }) {
      // 统一错误处理
      if (error.name === 'AbortError') {
        console.error('请求被取消:', error)
        throw { type: ErrorType.ABORT_ERROR, message: '请求被取消' }
      } else if (error.type === ErrorType.BUSINESS_ERROR) {
        // 业务错误
        console.error('业务错误:', error.message)
        throw error
      } else {
        // 网络错误
        console.error('网络错误:', error)
        throw {
          type: ErrorType.NETWORK_ERROR,
          message: '网络请求失败，请稍后重试',
        }
      }
    },
  },
})

// 自定义响应格式化函数
const formatResponse = <T>(data: T): T & { code: number; message?: string } => {
  // 在这里可以对响应数据进行格式化
  // 假设后端返回的数据结构为 { code: number, message: string, data: T }
  return data as T & { code: number; message?: string }
}

// 自定义请求格式化函数
const formatRequest = <T>(params: T): T => {
  // 在这里可以对请求参数进行格式化
  return params
}

// 封装请求方法
export const useFetch = <T>(url: string, options: RequestInit = {}) => {
  const { data, error, isFetching, execute, abort } = useRequest<T>(url, {
    ...options, // 传递请求配置
  })

  // 请求重试逻辑
  const retry = async (retries = 3): Promise<void> => {
    for (let i = 0; i < retries; i++) {
      try {
        await execute()
        return
      } catch (err) {
        if (i === retries - 1) throw err
      }
    }
  }

  // 自动取消重复请求
  const abortFetch = (): void => {
    abort() // 直接调用 useRequest 提供的 abort 方法
  }

  // 缓存逻辑
  const fetchWithCache = async (): Promise<void> => {
    if (cacheMap.has(url)) {
      data.value = cacheMap.get(url)
      return
    }
    await execute()
    cacheMap.set(url, data.value)
  }

  return {
    data: computed(() => data.value), // 响应式数据
    error: computed(() => error.value), // 错误信息
    isFetching: computed(() => isFetching.value), // 加载状态
    fetchData: fetchWithCache, // 支持缓存的请求方法
    retry, // 支持重试的请求方法
    abortFetch, // 取消请求的方法
  }
}
