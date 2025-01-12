<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getJobs } from '@/api/jenkins'
import PipelineCreateDialog from './PipelineCreateDialog.vue'

interface Pipeline {
  id: number
  name: string
  branch: string
  status: 'running' | 'success' | 'failed' | 'pending'
  creator: string
  createTime: string
  type?: string // 添加类型字段
}

const loading = ref(false)
const pipelineList = ref<Pipeline[]>([])
const showCreateDialog = ref(false)

const handleCreate = () => {
  showCreateDialog.value = true
}

const handleCreateSubmit = () => {
  showCreateDialog.value = false
  fetchPipelineList()
}

const queryParams = ref({
  name: '',
  status: '',
  type: '', // 添加类型查询参数
  pageNum: 1,
  pageSize: 10,
})
const total = ref(0)

const fetchPipelineList = async () => {
  try {
    loading.value = true
    const res = await getJobs()
    pipelineList.value = res
    total.value = pipelineList.value.length
  } finally {
    loading.value = false
  }
}

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    notbuilt: 'primary',
    grey: 'primary',
    blue: 'success',
    red: 'danger',
    yellow: 'warning',
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
        <el-form-item label="类型">
          <el-select
            style="width: 120px"
            v-model="queryParams.type"
            placeholder="请选择类型"
          >
            <el-option label="全部" value="" />
            <el-option label="前端" value="frontend" />
            <el-option label="Node后端" value="node" />
            <el-option label="Java后端" value="java" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            style="width: 100px"
            v-model="queryParams.status"
            placeholder="请选择状态"
          >
            <el-option label="全部" value="" />
            <el-option label="未开始" value="notbuilt" />
            <el-option label="运行中" value="grey" />
            <el-option label="成功" value="blue" />
            <el-option label="失败" value="red" />
            <el-option label="等待中" value="yellow" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchPipelineList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleCreate">新建流水线</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="pipelineList" v-loading="loading">
      <el-table-column prop="name" label="流水线名称" />
      <el-table-column prop="branch" label="分支" width="120" />
      <el-table-column prop="color" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="creator" label="创建人" width="120" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button
            type="primary"
            v-if="row.buildable"
            size="small"
            @click="handleDetail(row)"
            >详情</el-button
          >
          <el-button
            type="success"
            v-if="row.buildable"
            size="small"
            @click="handleTrigger(row)"
            >触发</el-button
          >
          <el-button type="primary" v-if="row.buildable" size="small"
            >更新</el-button
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

  <PipelineCreateDialog
    v-if="showCreateDialog"
    @close="showCreateDialog = false"
    @submit="handleCreateSubmit"
  />
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
