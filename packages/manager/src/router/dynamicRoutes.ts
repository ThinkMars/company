import type { RouteRecordRaw } from 'vue-router'

// 定义动态路由配置接口
export interface MenuRoute {
  path: string
  name: string
  component: string
  redirect?: string
  meta: {
    title: string
    icon?: string
  }
  children?: MenuRoute[]
}

// 组件映射表
export const componentMap = {
  Layout: () => import('@/views/layout/index.vue'),
  User: () => import('@/views/user/index.vue'),
  Role: () => import('@/views/role/index.vue'),
  Permission: () => import('@/views/permission/index.vue'),
}

// 模拟接口返回的路由数据
export const asyncRoutes: MenuRoute[] = [
  {
    path: '/system',
    name: 'System',
    component: 'Layout',
    redirect: '/system/user',
    meta: {
      title: '系统管理',
      icon: 'Setting',
    },
    children: [
      {
        path: '/system/user',
        name: 'User',
        component: 'User',
        meta: {
          title: '用户管理',
          icon: 'User',
        },
      },
      {
        path: '/system/role',
        name: 'Role',
        component: 'Role',
        meta: {
          title: '角色管理',
          icon: 'Lock',
        },
      },
      {
        path: '/system/permission',
        name: 'Permission',
        component: 'Permission',
        meta: {
          title: '权限管理',
          icon: 'Key',
        },
      },
    ],
  },
]

// 将接口返回的路由数据转换为路由对象
export function generateRoutes(routes: MenuRoute[]): RouteRecordRaw[] {
  return routes.map((route) => {
    const routeRecord: RouteRecordRaw = {
      path: route.path,
      name: route.name,
      redirect: route.redirect,
      meta: {
        title: route.meta.title,
        icon: route.meta.icon,
      },
      component: componentMap[route.component as keyof typeof componentMap],
      children: [],
    }

    if (route.children) {
      routeRecord.children = generateRoutes(route.children)
    }

    return routeRecord
  })
}
