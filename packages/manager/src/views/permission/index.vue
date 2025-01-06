<script setup lang="ts">
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import type { Permission } from '@/api/permission'
import PermissionForm from './components/PermissionForm.vue'
import { usePermissionCRUD } from './hooks/usePermissionCRUD'

// 权限管理逻辑
</script>

<template>
  <div class="permission-container">
    <!-- 权限管理模板 -->
  </div>
</template>

<style scoped lang="less">
.permission-container {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-base);
  }
}
</style>
