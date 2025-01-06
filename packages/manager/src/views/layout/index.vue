<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { usePermissionStore } from '@/store/permission'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const isCollapse = ref(false)

// 获取路由数据
const permissionStore = usePermissionStore()
const menuRoutes = computed(() => {
  return (
    permissionStore.routes.find((route) => route.path === '/')?.children || []
  )
})

// 替换原来的 menuList
const menuList = computed(() => {
  return menuRoutes.value.map((route) => ({
    path: route.path,
    title: route.meta?.title,
    icon: route.meta?.icon,
  }))
})

const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

const handleCommand = (command: string) => {
  if (command === 'logout') {
    userStore.logout()
    router.push('/login')
  }
}
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="menu-logo">
        <img src="@/assets/logo.svg" alt="logo" />
        <span>管理系统</span>
      </div>
      <el-menu
        :default-active="route.path"
        class="menu-sidebar"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
      >
        <el-menu-item
          v-for="item in menuList"
          :key="item.path"
          :index="item.path"
        >
          <el-icon>
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.title }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header>
        <div class="header-left">
          <el-icon class="fold-btn" @click="toggleSidebar">
            <Expand v-if="isCollapse" />
            <Fold v-else />
          </el-icon>
        </div>
        <div class="header-right">
          <el-dropdown trigger="click" @command="handleCommand">
            <div class="avatar-wrapper">
              <el-avatar :size="30" :src="userStore.userInfo.avatar" />
              <span class="username">{{ userStore.userInfo.username }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="less">
.layout-container {
  height: 100vh;

  .el-aside {
    background-color: #304156;

    .menu-logo {
      height: var(--header-height);
      display: flex;
      align-items: center;
      padding: var(--spacing-base) var(--spacing-large);
      color: #fff;

      img {
        width: 32px;
        height: 32px;
        margin-right: var(--spacing-base);
      }

      span {
        font-size: var(--font-size-large);
        font-weight: 600;
      }
    }

    .menu-sidebar {
      border-right: 1px solid var(--border-color-base);
    }
  }

  .el-header {
    background-color: #fff;
    border-bottom: 1px solid var(--border-color-base);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--spacing-large);

    .header-left {
      .fold-btn {
        font-size: var(--font-size-large);
        cursor: pointer;
      }
    }

    .header-right {
      .avatar-wrapper {
        display: flex;
        align-items: center;
        cursor: pointer;

        .username {
          margin-left: var(--spacing-base);
          font-size: var(--font-size-base);
        }
      }
    }
  }

  .el-main {
    background-color: var(--background-color-base);
    padding: var(--spacing-large);
  }
}
</style>
