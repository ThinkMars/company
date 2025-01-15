<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { deleteJob, getJobs, stopJob, triggerJob } from '@/api/jenkins'
import PipelineCreateDialog from './PipelineCreateDialog.vue'
import { useRouter } from 'vue-router'

interface Pipeline {
  id: number
  name: string
  branch: string
  buildStatus: 'SUCCESS' | 'FAILURE' | 'RUNNING' | 'UNKNOWN'
  creator: string
  createdAt: string
  type?: string // 添加类型字段
}

const loading = ref(false)
const pipelineList = ref<Pipeline[]>([])
const showCreateDialog = ref(false)
const isCreate = ref(true) // 添加创建/更新状态标识
const currentPipeline = ref<Partial<Pipeline>>({}) // 添加当前选中的流水线数据

const handleCreate = () => {
  isCreate.value = true
  currentPipeline.value = {}
  showCreateDialog.value = true
}

const handleUpdate = (row: Pipeline) => {
  isCreate.value = false
  currentPipeline.value = { ...row }
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
    const res = await getJobs(queryParams.value)
    pipelineList.value = res?.results || []
    total.value = res.total || 0
  } finally {
    loading.value = false
  }
}

const getStatusType = (
  status: string,
): 'success' | 'warning' | 'danger' | 'info' | 'primary' => {
  const map: Record<
    string,
    'success' | 'warning' | 'danger' | 'info' | 'primary'
  > = {
    SUCCESS: 'success',
    FAILURE: 'danger',
    RUNNING: 'warning',
  }
  return map[status] || 'info'
}

const handleDelete = async (row: Pipeline) => {
  try {
    await ElMessageBox.confirm('确认删除该流水线吗?', '提示', {
      type: 'warning',
    })
    await deleteJob({ name: row.name })
    ElMessage.success('删除成功')
    await fetchPipelineList()
  } catch (error) {
    // 用户取消删除或删除失败
  }
}

const router = useRouter()
const handleDetail = (row: Pipeline) => {
  router.push(`/ops/release/detail/${row.name}`)
}

onMounted(() => {
  fetchPipelineList()
})
</script>

<template>
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
    <el-table-column prop="name" label="流水线名称" width="150" />
    <el-table-column prop="type" label="类型" width="80">
      <template #default="{ row }">
        {{
          row.type === 'frontend'
            ? '前端'
            : row.type === 'node'
              ? 'Node后端'
              : 'Java后端'
        }}
      </template>
    </el-table-column>
    <el-table-column prop="gitUrl" label="仓库地址" width="200">
      <template #default="{ row }">
        <el-link :href="row.gitUrl" target="_blank">{{ row.gitUrl }}</el-link>
      </template>
    </el-table-column>
    <el-table-column prop="branch" label="分支" width="80" />
    <el-table-column prop="subDir" label="子目录" width="150" />
    <el-table-column prop="buildStatus" label="状态" width="100">
      <template #default="{ row }">
        <el-tag :type="getStatusType(row.buildStatus)">
          {{ row.buildStatus }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="creator" label="创建人" width="120" />
    <el-table-column prop="createdAt" label="创建时间" width="180" />
    <el-table-column label="操作" width="220" fixed="right">
      <template #default="{ row }">
        <el-button type="primary" size="small" @click="handleDetail(row)"
          >详情</el-button
        >
        <el-button type="primary" size="small" @click="handleUpdate(row)"
          >更新</el-button
        >
        <el-button type="danger" size="small" @click="handleDelete(row)"
          >删除</el-button
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
  <PipelineCreateDialog
    v-if="showCreateDialog"
    :is-create="isCreate"
    :form-data="currentPipeline"
    @close="showCreateDialog = false"
    @submit="handleCreateSubmit"
  />
</template>

<style scoped>
.search-form {
  margin-bottom: 20px;
}

.el-link {
  word-break: break-all;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
