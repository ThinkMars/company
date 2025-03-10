import { Spin } from 'antd'
import { lazy, Suspense } from 'react'
// routes.tsx
const Layout = lazy(() => import('@/layouts/index'))
const HomePage = lazy(() => import('@/pages/Home'))
const UserListPage = lazy(() => import('@/pages/user/user-list'))
const PermissionPage = lazy(() => import('@/pages/user/user-permission'))

import {
  createBrowserRouter,
  Navigate,
  RouteObject,
  RouterProvider,
} from 'react-router-dom'

const Wrapper = ({ children }: { children: JSX.Element }) => (
  <Suspense fallback={<Spin size="large" />}>{children}</Suspense>
)

// 动态路由
const dynamicRoutes: RouteObject[] = [
  {
    path: '/home',
    element: (
      <Wrapper>
        <HomePage />
      </Wrapper>
    ),
  },
  {
    path: '/userList',
    element: (
      <Wrapper>
        <UserListPage />
      </Wrapper>
    ),
  },
  {
    path: '/userPermission',
    element: (
      <Wrapper>
        <PermissionPage />
      </Wrapper>
    ),
  },
]

// 静态路由
const constantRoutes: RouteObject[] = [
  {
    path: '/',
    element: (
      <Wrapper>
        <Layout />
      </Wrapper>
    ),
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      ...dynamicRoutes,
    ],
  },
]

const routes = [...constantRoutes, ...dynamicRoutes]

const router = createBrowserRouter(routes)

const AppRouter = () => {
  return <RouterProvider router={router}></RouterProvider>
}

export default AppRouter
