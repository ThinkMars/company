import type { RouteRecordRaw } from 'vue-router'

export const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/exception/:code',
    name: 'Exception',
    component: () => import('@/views/exception/index.vue'),
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layouts/index.vue'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          icon: 'House',
          isMenu: true,
        },
      },
      {
        path: '/user',
        name: 'User',
        component: () => import('@/views/user/UserList.vue'),
        meta: {
          title: '用户管理',
          icon: 'User',
          isMenu: true,
        },
      },
      {
        path: '/role',
        name: 'Role',
        component: () => import('@/views/role/RoleLndex.vue'),
        meta: {
          title: '角色管理',
          icon: 'Lock',
          isMenu: true,
        },
      },
      {
        path: '/permission',
        name: 'Permission',
        component: () => import('@/views/permission/PermissionIndex.vue'),
        meta: {
          title: '权限管理',
          icon: 'Key',
          isMenu: true,
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/exception/404',
  },
]
