<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '@/pinia/layout'

const { isCollapse, siderHeaderBgColor } = storeToRefs(useLayoutStore())
</script>

<template>
  <div class="logo" :class="{ 'collapsed-logo': isCollapse }">
    <img
      src="@/assets/logo.svg"
      width="32"
      height="32"
      :style="{
        backgroundColor: siderHeaderBgColor,
        marginRight: isCollapse ? '0' : '12px',
        borderRadius: isCollapse ? '50%' : '30%',
        transition: 'all 0.3s',
      }"
      alt="logo"
    />
    <span class="h1" v-show="!isCollapse">管理系统</span>
  </div>
</template>

<style lang="less" scoped>
.logo {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background-color: #2b3847;
  transition: all 0.3s;

  .h1 {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    white-space: nowrap;
  }
}

.collapsed-logo {
  padding: 0 16px;
}
</style>
