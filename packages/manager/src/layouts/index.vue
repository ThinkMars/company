<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '@/pinia/layout'
import Header from './components/Header.vue'
import SideMenu from './components/SideMenu.vue'

const { isCollapse } = storeToRefs(useLayoutStore())
</script>

<template>
  <el-container class="layout">
    <el-aside :width="isCollapse ? '64px' : '220px'" class="aside-container">
      <SideMenu></SideMenu>
    </el-aside>

    <el-container>
      <el-header>
        <Header></Header>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="less">
.el-header {
  --el-header-padding: 0;
  border-bottom: 1px solid #dcdfe6;
}

.layout {
  height: 100vh;
}

.aside-container {
  transition: width 0.3s;
  overflow: hidden;
}

.el-aside {
  background-color: #304156;
  color: #fff;
}
</style>
