<script setup lang="ts">
import { computed } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { routes } from '@/router'
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '@/pinia/layout'
import { useRoute } from 'vue-router'
import SiderHeader from './SiderHeader.vue'

interface MenuItem extends Omit<RouteRecordRaw, 'children'> {
  path: string
  meta?: {
    title?: string
    icon?: string
    isMenu?: boolean
  }
  children?: MenuItem[]
}

const route = useRoute()

// 只获取根路由的子路由作为菜单项
const menuItems = computed<MenuItem[]>(() => {
  const rootRoute = routes.find((route: MenuItem) => route.path === '/')
  return (rootRoute?.children as MenuItem[]) || []
})

// 过滤掉不需要显示的菜单项
const filterMenuItems = (menuItems: MenuItem[]): MenuItem[] => {
  return menuItems.filter((item) => {
    if (item.children && item.children.length > 0) {
      item.children = filterMenuItems(item.children)
    }
    return item.meta?.isMenu
  })
}
const filteredMenuItems = filterMenuItems(menuItems.value)

const { isCollapse, asideBgColor, asideTextColor, asideActiveTextColor } =
  storeToRefs(useLayoutStore())
</script>

<template>
  <SiderHeader />
  <el-menu
    :default-active="route.path"
    class="menu"
    :unique-opened="true"
    :router="true"
    :collapse="isCollapse"
    :background-color="asideBgColor"
    :text-color="asideTextColor"
    :active-text-color="asideActiveTextColor"
  >
    <template v-for="item in filteredMenuItems" :key="item.path">
      <template v-if="item.children && item.children.length > 0">
        <el-sub-menu :index="item.path">
          <template #title>
            <el-icon>
              <component :is="item.meta?.icon" />
            </el-icon>
            <span>{{ item.meta?.title }}</span>
          </template>
          <el-menu-item
            v-for="child in item.children"
            :key="child.path"
            :index="child.path"
          >
            <span>{{ child.meta?.title }}</span>
          </el-menu-item>
        </el-sub-menu>
      </template>
      <el-menu-item v-else :index="item.path">
        <el-icon>
          <component :is="item.meta?.icon" />
        </el-icon>
        <span>{{ item.meta?.title }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<style lang="less" scoped>
.menu {
  border-right: none;

  :deep(.el-menu-item) {
    &:hover {
      background-color: #263445 !important;
    }

    &.is-active {
      background-color: #1890ff !important;
    }
  }

  :deep(.el-sub-menu__title) {
    &:hover {
      background-color: #263445 !important;
    }
  }
}
</style>
