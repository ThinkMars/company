import { defineStore } from 'pinia'
import type { LoginResponse } from '@/api/interface/login.interface'
import pinia from '@/pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    userInfo: {
      username: '',
      avatar: '',
      role: '',
      permissions: [] as string[],
    },
  }),

  actions: {
    setToken(token: string) {
      this.token = token
    },

    setUserInfo(userInfo: LoginResponse['userInfo']) {
      this.userInfo = userInfo
    },

    setPermissions(permissions: string[]) {
      this.userInfo.permissions = permissions
    },

    logout() {
      this.token = ''
      this.userInfo = {
        username: '',
        avatar: '',
        role: '',
        permissions: [],
      }
    },
  },
  persist: true,
})

export function useUserStoreHook() {
  return useUserStore(pinia)
}
