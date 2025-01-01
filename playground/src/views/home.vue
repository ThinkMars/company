<template>
  <div class="home-container">
    <div class="content-wrapper">
      <el-row :gutter="30" class="welcome-section">
        <el-col :span="24">
          <el-card class="welcome-card">
            <h1>欢迎来到示例页面</h1>
            <p>这是一个基于 Vue 3 + Element Plus 的示例项目</p>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="30" class="feature-section">
        <el-col :span="8">
          <el-card class="feature-card" @click="handleNav('/about')">
            <el-icon class="card-icon">
              <InfoFilled />
            </el-icon>
            <h3>关于页面</h3>
            <p>查看系统相关信息</p>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="feature-card" @click="handleNav('/change-theme')">
            <el-icon class="card-icon">
              <Brush />
            </el-icon>
            <h3>主题设置</h3>
            <p>自定义系统主题和样式</p>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="feature-card" @click="handleFetch">
            <el-icon class="card-icon">
              <Connection />
            </el-icon>
            <h3>接口测试</h3>
            <p>测试系统接口连接</p>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { InfoFilled, Brush, Connection } from '@element-plus/icons-vue'

const router = useRouter()

function handleFetch() {
  fetch('http://localhost:3000/', {
    method: 'GET',
  })
}

function handleNav(path: string) {
  router.push(path)
}
</script>

<style scoped>
.home-container {
  padding: 40px;
  min-height: 100vh;
  background-color: #f8fafc;
}

.content-wrapper {
  width: 100%;
  margin: 0 auto;
}

.welcome-section {
  margin-bottom: 40px;
}

.welcome-card {
  text-align: center;
  padding: 60px;
  border-radius: 8px;
  background: linear-gradient(to right, #f9f9f9, #ffffff);
  border: none;
  margin: 0 20px;
}

.feature-section {
  padding: 0 20px;
}

.feature-card {
  height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s ease;
  border-radius: 8px;
  border: none;
  background: #ffffff;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(149, 157, 165, 0.1);
  background: linear-gradient(to bottom right, #ffffff, #f8fafc);
}

.card-icon {
  font-size: 48px;
  color: #6b7280;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.feature-card:hover .card-icon {
  color: #4b92e5;
}

.feature-card h3 {
  margin: 12px 0;
  color: #374151;
  font-size: 20px;
  font-weight: 500;
}

.feature-card p {
  color: #6b7280;
  font-size: 16px;
}
</style>
