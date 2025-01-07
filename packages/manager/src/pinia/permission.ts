import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router'
import { staticRoutes } from '@/router/staticRoutes'
import { asyncRoutes, generateRoutes } from '@/router/dynamicRoutes'
import router from '@/router'

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    routes: [] as RouteRecordRaw[],
    dynamicRoutes: [] as RouteRecordRaw[],
  }),

  actions: {
    generateRoutes() {
      return new Promise<RouteRecordRaw[]>((resolve) => {
        // 这里可以调用后端接口获取路由数据
        // 现在使用模拟数据
        const accessedRoutes = generateRoutes(asyncRoutes)

        this.routes = [...staticRoutes, ...accessedRoutes]
        this.dynamicRoutes = accessedRoutes

        // 动态添加路由
        accessedRoutes.forEach((route) => {
          router.addRoute(route)
        })

        resolve(accessedRoutes)
      })
    },

    resetRoutes() {
      this.routes = []
      this.dynamicRoutes = []
      // 重置路由
      this.dynamicRoutes.forEach((route) => {
        router.removeRoute(route.name as string)
      })
    },
    hasPermission(path: string) {
      return this.routes.some((route) => route.path === path)
    },
  },
})
