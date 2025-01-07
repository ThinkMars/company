<script setup lang="ts">
import { useLayoutStore } from '@/pinia/layout'
import { useUserStore } from '@/pinia/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()
const layoutStore = useLayoutStore()

const toggleSidebar = () => {
  layoutStore.setCollapse(!layoutStore.isCollapse)
}

const handleLogout = () => {
  ElMessageBox.confirm('确定退出登录吗?', '提示', {
    type: 'warning',
  })
    .then(async () => {
      await userStore.logout()
      router.push('/login')
    })
    .catch(() => {})
}
</script>

<template>
  <div class="header">
    <el-icon class="fold-btn" @click="toggleSidebar">
      <Fold v-if="!layoutStore.isCollapse" />
      <Expand v-else />
    </el-icon>
    <el-dropdown>
      <el-avatar :size="35" :src="userStore.userInfo.avatar">头像</el-avatar>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang="less" scoped>
.header {
  height: 59px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  margin: 0 20px;
}
</style>
