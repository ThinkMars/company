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
        component: () => import('@/views/user/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'User',
          isMenu: true,
        },
      },
      {
        path: '/role',
        name: 'Role',
        component: () => import('@/views/role/index.vue'),
        meta: {
          title: '角色管理',
          icon: 'Lock',
          isMenu: true,
        },
      },
      {
        path: '/permission',
        name: 'Permission',
        component: () => import('@/views/permission/index.vue'),
        meta: {
          title: '权限管理',
          icon: 'Key',
          isMenu: true,
        },
      },
      {
        path: 'ops',
        name: 'Ops',
        redirect: '/ops/release',
        meta: {
          title: '运维管理',
          icon: 'Operation',
          role: ['admin'], // 权限控制
          isMenu: true,
        },
        children: [
          {
            path: '/ops/release',
            name: 'Release',
            component: () => import('@/views/ops/release/index.vue'),
            meta: {
              title: '发布系统',
              role: ['admin'], // 权限控制
              isMenu: true,
            },
          },
          {
            path: '/ops/release/detail/:name',
            name: 'ReleaseDetail',
            component: () =>
              import('@/views/ops/release/detail/ReleaseDetail.vue'),
            meta: {
              title: '发布详情',
              role: ['admin'], // 权限控制
            },
          },
          {
            path: '/ops/artifact',
            name: 'Artifact',
            component: () => import('@/views/ops/artifact/index.vue'),
            meta: {
              title: '制品管理',
              role: ['admin'], // 权限控制
              isMenu: true,
            },
          },
        ],
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/exception/404',
  },
]
