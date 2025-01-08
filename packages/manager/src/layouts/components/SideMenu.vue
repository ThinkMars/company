<script setup lang="ts">
import { computed } from 'vue'
import { routes } from '@/router'
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '@/pinia/layout'
import { useRoute } from 'vue-router'
import SiderHeader from './SiderHeader.vue'

const route = useRoute()

// 只获取根路由的子路由作为菜单项
const menuItems = computed(() => {
  const rootRoute = routes.find((route) => route.path === '/')
  return rootRoute?.children || []
})

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
    <template v-for="item in menuItems" :key="item.path">
      <el-menu-item :index="item.path" v-if="!item.meta?.hidden">
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
