<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

interface ReleaseRecord {
  id: number
  version: string
  environment: string
  status: 'success' | 'failed'
  creator: string
  createTime: string
  duration: string
  description: string
  changes: string[]
}

const loading = ref(false)
const releaseList = ref<ReleaseRecord[]>([])
const queryParams = ref({
  version: '',
  environment: '',
  status: '',
  pageNum: 1,
  pageSize: 10,
})
const total = ref(0)

// 模拟数据
const mockReleaseList = [
  {
    id: 1,
    version: 'v1.0.0',
    environment: '生产环境',
    status: 'success',
    creator: 'admin',
    createTime: '2024-03-20 15:30:00',
    duration: '10分钟',
    description: '首次正式发布',
    changes: ['新增用户管理功能', '优化登录界面', '修复已知bug'],
  },
  {
    id: 2,
    version: 'v1.0.1',
    environment: '生产环境',
    status: 'failed',
    creator: 'developer',
    createTime: '2024-03-21 10:15:00',
    duration: '5分钟',
    description: '紧急修复版本',
    changes: ['修复登录失败问题', '优化性能'],
  },
] as ReleaseRecord[]

const fetchReleaseList = async () => {
  try {
    loading.value = true
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1000))
    releaseList.value = mockReleaseList
    total.value = mockReleaseList.length
  } finally {
    loading.value = false
  }
}

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    success: 'success',
    failed: 'danger',
  }
  return map[status] || 'info'
}

const handleQuery = () => {
  queryParams.value.pageNum = 1
  fetchReleaseList()
}

const resetQuery = () => {
  queryParams.value = {
    version: '',
    environment: '',
    status: '',
    pageNum: 1,
    pageSize: 10,
  }
  fetchReleaseList()
}

onMounted(() => {
  fetchReleaseList()
})
</script>

<template>
  <div class="release-history">
    <div class="search-form">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="版本号">
          <el-input v-model="queryParams.version" placeholder="请输入版本号" />
        </el-form-item>
        <el-form-item label="环境">
          <el-select v-model="queryParams.environment" placeholder="请选择环境">
            <el-option label="全部" value="" />
            <el-option label="测试环境" value="test" />
            <el-option label="预发环境" value="staging" />
            <el-option label="生产环境" value="production" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态">
            <el-option label="全部" value="" />
            <el-option label="成功" value="success" />
            <el-option label="失败" value="failed" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="releaseList" v-loading="loading">
      <el-table-column prop="version" label="版本号" width="120" />
      <el-table-column prop="environment" label="环境" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ row.status === 'success' ? '成功' : '失败' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="creator" label="发布人" width="120" />
      <el-table-column prop="createTime" label="发布时间" width="180" />
      <el-table-column prop="duration" label="耗时" width="100" />
      <el-table-column prop="description" label="描述" />
      <el-table-column label="变更内容" min-width="300">
        <template #default="{ row }">
          <el-popover placement="right" :width="300" trigger="hover">
            <template #reference>
              <el-button link type="primary">查看变更</el-button>
            </template>
            <div class="changes-list">
              <ul>
                <li v-for="(change, index) in row.changes" :key="index">
                  {{ change }}
                </li>
              </ul>
            </div>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="queryParams.pageNum"
        v-model:page-size="queryParams.pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </div>
  </div>
</template>

<style scoped>
.release-history {
  padding: 20px 0;
}

.search-form {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.changes-list {
  max-height: 300px;
  overflow-y: auto;
}

.changes-list ul {
  margin: 0;
  padding-left: 20px;
}

.changes-list li {
  margin-bottom: 8px;
}

.changes-list li:last-child {
  margin-bottom: 0;
}
</style>
