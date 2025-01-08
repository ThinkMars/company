<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Warning, CircleClose, Lock } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 状态配置
const statusConfig = {
  '404': {
    title: '404',
    message: '抱歉，您访问的页面不存在',
    icon: CircleClose,
    color: '#f56c6c',
  },
  '401': {
    title: '401',
    message: '抱歉，您没有权限访问该页面',
    icon: Lock,
    color: '#e6a23c',
  },
  '403': {
    title: '403',
    message: '抱歉，禁止访问该页面',
    icon: Warning,
    color: '#f56c6c',
  },
}

// 根据路由参数获取状态信息
const status = computed(() => {
  const code = route.params.code as keyof typeof statusConfig
  return statusConfig[code] || statusConfig['404']
})

// 返回首页
const backHome = () => {
  router.push('/')
}

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="status-page">
    <div class="status-content">
      <el-icon :size="120" :color="status.color">
        <component :is="status.icon" />
      </el-icon>
      <h1 class="status-title">{{ status.title }}</h1>
      <p class="status-message">{{ status.message }}</p>
      <div class="status-actions">
        <el-button type="primary" @click="backHome">返回首页</el-button>
        <el-button @click="goBack">返回上一页</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.status-page {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--background-color-base);

  .status-content {
    text-align: center;
    padding: var(--spacing-extra-large);
    background-color: #fff;
    border-radius: var(--border-radius-base);
    box-shadow: var(--box-shadow-light);

    .status-title {
      font-size: 48px;
      color: var(--text-primary);
      margin: var(--spacing-large) 0;
    }

    .status-message {
      font-size: var(--font-size-large);
      color: var(--text-regular);
      margin-bottom: var(--spacing-extra-large);
    }

    .status-actions {
      .el-button + .el-button {
        margin-left: var(--spacing-base);
      }
    }
  }
}
</style>
