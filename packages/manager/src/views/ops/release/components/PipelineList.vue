<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { deleteJob, getJobs, stopJob, triggerJob } from '@/api/jenkins'
import PipelineCreateDialog from './PipelineCreateDialog.vue'

interface Pipeline {
  id: number
  name: string
  branch: string
  lastBuildStatus: 'notbuilt' | 'running' | 'success' | 'failed' | 'pending'
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

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    notbuilt: 'info',
    running: 'primary',
    success: 'success',
    failed: 'danger',
    pending: 'warning',
  }
  return map[status] || 'info'
}

// const jobStatus = ref('')

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    notbuilt: '未构建',
    running: '运行中',
    success: '成功',
    failed: '失败',
    pending: '等待中',
  }
  return map[status] || '未知'
}

const handleTrigger = async (row: Pipeline) => {
  try {
    ElMessage.success('触发成功')
    row.lastBuildStatus = 'running'

    await triggerJob({ name: row.name })
    await fetchPipelineList()
  } catch (error) {
    ElMessage.error('触发失败')
    await fetchPipelineList()
  }
}

const handleCancelBuild = async (row: Pipeline) => {
  await stopJob({ name: row.name })
  await fetchPipelineList()

  ElMessage.success('取消构建成功')
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

const emit = defineEmits(['selectPipeline'])

const handleDetail = (row: Pipeline) => {
  emit('selectPipeline', row)
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
    <el-table-column prop="lastBuildStatus" label="状态" width="100">
      <template #default="{ row }">
        <el-tag :type="getStatusType(row.lastBuildStatus)">
          {{ getStatusText(row.lastBuildStatus) }}
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
        <el-button
          type="success"
          style="margin-right: 16px"
          v-if="row.lastBuildStatus !== 'running'"
          size="small"
          @click="handleTrigger(row)"
          >触发</el-button
        >
        <el-button
          type="success"
          style="margin-right: 16px"
          v-else
          size="small"
          @click="handleCancelBuild(row)"
          >取消</el-button
        >
        <el-dropdown>
          <el-button size="small" type="primary">
            更多<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleUpdate(row)">
                <el-icon>
                  <edit /> </el-icon
                >更新
              </el-dropdown-item>
              <el-dropdown-item @click="handleDelete(row)">
                <el-icon>
                  <delete /> </el-icon
                >删除
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
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
