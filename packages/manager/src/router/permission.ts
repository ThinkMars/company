import router from '@/router'
import { useUserStore } from '@/pinia/user'
import { usePermissionStore } from '@/pinia/permission'

// 白名单路由
const whiteList = ['/login', '/status/401', '/status/404']

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()

  if (userStore.token) {
    if (to.path === '/login') {
      next('/')
    } else {
      if (!permissionStore.routes.length) {
        // 获取用户权限路由
        await permissionStore.generateRoutes()
        next({ ...to, replace: true })
      } else {
        if (permissionStore.hasPermission(to.path)) {
          next()
        } else {
          next('/status/401')
        }
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})
