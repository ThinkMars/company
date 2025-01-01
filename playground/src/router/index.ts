import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/about.vue'),
  },
  {
    path: '/change-theme',
    name: 'ChangeTheme',
    component: () => import('@/views/change-theme.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
