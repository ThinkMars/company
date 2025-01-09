import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/pinia/user'
import { staticRoutes } from './staticRoutes'

// 定义路由表
export const routes: RouteRecordRaw[] = [...staticRoutes]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 白名单路由
const whiteList = ['/login', '/status/401', '/status/404']

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  if (userStore.token) {
    next()
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }

  next()
})

export default router
