import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    userInfo: {
      username: '',
      avatar: '',
      role: '',
    },
  }),

  actions: {
    setToken(token: string) {
      this.token = token
    },

    setUserInfo(userInfo: any) {
      this.userInfo = userInfo
    },

    logout() {
      this.token = ''
      this.userInfo = {
        username: '',
        avatar: '',
        role: '',
      }
    },
  },
  persist: {
    enabled: true, // 启用持久化
    strategies: [
      {
        key: 'user', // 存储的 key，默认为 store 的 id（'user'）
        storage: localStorage, // 存储方式，默认为 localStorage
        paths: ['token', 'userInfo'], // 只持久化 name 字段
      },
    ],
  },
})
