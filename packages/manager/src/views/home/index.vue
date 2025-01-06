<script setup lang="ts">
import { ref } from 'vue'
import { User, Lock, Key, Setting } from '@element-plus/icons-vue'

const cardList = ref([
  {
    title: '用户总数',
    value: '1,234',
    icon: 'User',
    type: 'success',
  },
  {
    title: '角色总数',
    value: '12',
    icon: 'Lock',
    type: 'warning',
  },
  {
    title: '权限总数',
    value: '56',
    icon: 'Key',
    type: 'danger',
  },
  {
    title: '系统配置',
    value: '8',
    icon: 'Setting',
    type: 'info',
  },
])
</script>

<template>
  <div class="home-container">
    <el-row :gutter="20">
      <el-col :span="6" v-for="card in cardList" :key="card.title">
        <el-card shadow="hover" :body-style="{ padding: '20px' }">
          <div class="card-header">
            <span class="card-title">{{ card.title }}</span>
            <el-icon :size="40" :class="card.type">
              <component :is="card.icon" />
            </el-icon>
          </div>
          <div class="card-body">
            <span class="card-value">{{ card.value }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="less">
.home-container {
  .el-card {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      .card-title {
        font-size: 16px;
        color: #606266;
      }

      .el-icon {
        &.success {
          color: #67c23a;
        }

        &.warning {
          color: #e6a23c;
        }

        &.danger {
          color: #f56c6c;
        }

        &.info {
          color: #909399;
        }
      }
    }

    .card-body {
      .card-value {
        font-size: 28px;
        font-weight: bold;
        color: #303133;
      }
    }
  }
}
</style>
