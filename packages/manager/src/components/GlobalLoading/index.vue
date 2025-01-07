<template>
  <div v-if="isLoading" class="global-loading">
    <el-loading :fullscreen="true" />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLoadingStore } from '@/pinia/loading'

const loadingStore = useLoadingStore()
const { isLoading } = storeToRefs(loadingStore)
</script>

<style scoped lang="less">
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
</style>
