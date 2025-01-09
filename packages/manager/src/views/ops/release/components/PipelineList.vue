<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

interface Pipeline {
  id: number
  name: string
  branch: string
  status: 'running' | 'success' | 'failed' | 'pending'
  creator: string
  createTime: string
  duration: string
}

const loading = ref(false)
const pipelineList = ref<Pipeline[]>([])
const queryParams = ref({
  name: '',
  status: '',
  pageNum: 1,
  pageSize: 10,
})
const total = ref(0)

// 模拟数据
const mockPipelineList = [
  {
    id: 1,
    name: 'frontend-deploy',
    branch: 'main',
    status: 'success',
    creator: 'admin',
    createTime: '2024-03-20 10:00:00',
    duration: '5分钟',
  },
  {
    id: 2,
    name: 'backend-deploy',
    branch: 'develop',
    status: 'running',
    creator: 'developer',
    createTime: '2024-03-20 09:30:00',
    duration: '15分钟',
  },
] as Pipeline[]

const fetchPipelineList = async () => {
  try {
    loading.value = true
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1000))
    pipelineList.value = mockPipelineList
    total.value = mockPipelineList.length
  } finally {
    loading.value = false
  }
}

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    running: 'primary',
    success: 'success',
    failed: 'danger',
    pending: 'warning',
  }
  return map[status] || 'info'
}

const handleTrigger = async (row: Pipeline) => {
  try {
    ElMessage.success('触发成功')
    await fetchPipelineList()
  } catch (error) {
    ElMessage.error('触发失败')
  }
}

const emit = defineEmits(['selectPipeline'])

const handleDetail = (row: Pipeline) => {
  emit('selectPipeline', row)
}

onMounted(() => {
  fetchPipelineList()
})
</script>

<template>
  <div class="pipeline-list">
    <div class="search-form">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="流水线名称">
          <el-input v-model="queryParams.name" placeholder="请输入流水线名称" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态">
            <el-option label="全部" value="" />
            <el-option label="运行中" value="running" />
            <el-option label="成功" value="success" />
            <el-option label="失败" value="failed" />
            <el-option label="等待中" value="pending" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchPipelineList">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="pipelineList" v-loading="loading">
      <el-table-column prop="name" label="流水线名称" />
      <el-table-column prop="branch" label="分支" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="creator" label="创建人" width="120" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column prop="duration" label="耗时" width="100" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleDetail(row)"
            >详情</el-button
          >
          <el-button type="success" size="small" @click="handleTrigger(row)"
            >触发</el-button
          >
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
.pipeline-list {
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
</style>
