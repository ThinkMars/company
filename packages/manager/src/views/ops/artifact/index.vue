<template>
  <el-card class="container-manager">
    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="容器列表" name="containers">
        <ContainerList />
      </el-tab-pane>
      <el-tab-pane label="镜像仓库" name="images">
        <ImageList />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import ContainerList from './components/ContainerList.vue'
import ImageList from './components/ImageList.vue'

const activeTab = ref('containers')

const handleTabChange = (tab: TabsPaneContext) => {
  // 可以在这里处理tab切换逻辑
}
</script>

<style scoped>
.container-manager {
  min-height: calc(100vh - 120px);
}
</style>
