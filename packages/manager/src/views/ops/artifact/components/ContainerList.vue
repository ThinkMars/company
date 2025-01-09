<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

interface Container {
  id: string
  name: string
  image: string
  tag: string
  status: 'running' | 'stopped' | 'error'
  service: string
  createTime: string
  ports: string[]
  memory: string
  cpu: string
  isLatest: boolean
  version: string
}

const loading = ref(false)
const containerList = ref<Container[]>([])
const queryParams = ref({
  name: '',
  service: '',
  status: '',
  pageNum: 1,
  pageSize: 10,
})
const total = ref(0)

// 添加详情弹窗相关的状态
const showDetailDialog = ref(false)
const currentContainer = ref<Container | null>(null)

// 模拟数据
const mockContainerList = [
  {
    id: 'abc123',
    name: 'web-frontend-1',
    image: 'nginx',
    tag: '1.21',
    status: 'running',
    service: 'web-frontend',
    createTime: '2024-03-20 10:00:00',
    ports: ['80:80', '443:443'],
    memory: '256MB',
    cpu: '0.5',
    isLatest: true,
    version: 'v1.0.1',
  },
  {
    id: 'abc124',
    name: 'web-frontend-old',
    image: 'nginx',
    tag: '1.20',
    status: 'stopped',
    service: 'web-frontend',
    createTime: '2024-03-19 10:00:00',
    ports: ['80:80', '443:443'],
    memory: '256MB',
    cpu: '0.5',
    isLatest: false,
    version: 'v1.0.0',
  },
  {
    id: 'def456',
    name: 'backend-api-1',
    image: 'node',
    tag: '16-alpine',
    status: 'running',
    service: 'backend-api',
    createTime: '2024-03-20 09:30:00',
    ports: ['3000:3000'],
    memory: '512MB',
    cpu: '1.0',
    isLatest: true,
    version: 'v2.0.0',
  },
  {
    id: 'def457',
    name: 'backend-api-old',
    image: 'node',
    tag: '14-alpine',
    status: 'stopped',
    service: 'backend-api',
    createTime: '2024-03-18 09:30:00',
    ports: ['3000:3000'],
    memory: '512MB',
    cpu: '1.0',
    isLatest: false,
    version: 'v1.9.0',
  },
] as Container[]

const fetchContainerList = async () => {
  try {
    loading.value = true
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1000))
    containerList.value = mockContainerList
    total.value = mockContainerList.length
  } finally {
    loading.value = false
  }
}

const getStatusType = (status: string): 'success' | 'danger' | 'warning' => {
  const map: Record<string, 'success' | 'danger' | 'warning'> = {
    running: 'success',
    stopped: 'warning',
    error: 'danger',
  }
  return map[status] || 'warning'
}

const handleStart = async (container: Container) => {
  try {
    await ElMessageBox.confirm(`确认启动容器 ${container.name}？`, '启动确认')
    ElMessage.success('启动成功')
    await fetchContainerList()
  } catch {
    // 取消操作
  }
}

const handleStop = async (container: Container) => {
  try {
    await ElMessageBox.confirm(`确认停止容器 ${container.name}？`, '停止确认', {
      type: 'warning',
    })
    ElMessage.success('停止成功')
    await fetchContainerList()
  } catch {
    // 取消操作
  }
}

const handleRestart = async (container: Container) => {
  try {
    await ElMessageBox.confirm(`确认重启容器 ${container.name}？`, '重启确认', {
      type: 'warning',
    })
    ElMessage.success('重启成功')
    await fetchContainerList()
  } catch {
    // 取消操作
  }
}

const handleDelete = async (container: Container) => {
  try {
    await ElMessageBox.confirm(`确认删除容器 ${container.name}？`, '删除确认', {
      type: 'error',
    })
    ElMessage.success('删除成功')
    await fetchContainerList()
  } catch {
    // 取消操作
  }
}

const handleQuery = () => {
  queryParams.value.pageNum = 1
  fetchContainerList()
}

const resetQuery = () => {
  queryParams.value = {
    name: '',
    service: '',
    status: '',
    pageNum: 1,
    pageSize: 10,
  }
  fetchContainerList()
}

// 获取服务列表
const getServiceList = () => {
  const services = new Set(mockContainerList.map((item) => item.service))
  return Array.from(services)
}

// 按服务分组数据
const groupedContainers = computed(() => {
  const groups: Record<string, Container[]> = {}
  mockContainerList.forEach((container) => {
    if (!groups[container.service]) {
      groups[container.service] = []
    }
    groups[container.service].push(container)
  })
  return groups
})

// 重新部署历史版本
const handleRedeploy = async (container: Container) => {
  try {
    await ElMessageBox.confirm(
      `确认重新部署 ${container.service} 的版本 ${container.version}？`,
    )
    ElMessage.success('重新部署成功')
    await fetchContainerList()
  } catch {
    // 取消操作
  }
}

// 添加查看详情的处理函数
const handleViewDetail = (container: Container) => {
  currentContainer.value = container
  showDetailDialog.value = true
}

onMounted(() => {
  fetchContainerList()
})
</script>

<template>
  <div class="container-list">
    <div class="search-form">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="容器名称">
          <el-input v-model="queryParams.name" placeholder="请输入容器名称" />
        </el-form-item>
        <el-form-item label="服务">
          <el-input
            v-model="queryParams.service"
            placeholder="请输入服务名称"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态">
            <el-option label="全部" value="" />
            <el-option label="运行中" value="running" />
            <el-option label="已停止" value="stopped" />
            <el-option label="异常" value="error" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      :data="containerList"
      v-loading="loading"
      style="width: 100%"
      row-key="id"
    >
      <el-table-column prop="service" label="服务" width="300">
        <template #default="{ row }">
          <div class="service-info">
            {{ row.service }}
            <el-tag v-if="row.isLatest" size="small" type="success"
              >当前版本</el-tag
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="version" label="版本" width="100" />
      <el-table-column prop="name" label="容器名称" min-width="150" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{
              row.status === 'running'
                ? '运行中'
                : row.status === 'stopped'
                  ? '已停止'
                  : '异常'
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="300" fixed="right">
        <template #default="{ row }">
          <el-button-group>
            <el-button type="info" size="small" @click="handleViewDetail(row)">
              详情
            </el-button>
            <el-button
              v-if="row.status !== 'running'"
              type="success"
              size="small"
              @click="handleStart(row)"
            >
              启动
            </el-button>
            <el-button
              v-if="row.status === 'running'"
              type="warning"
              size="small"
              @click="handleStop(row)"
            >
              停止
            </el-button>
            <el-button
              v-if="row.status === 'running'"
              type="primary"
              size="small"
              @click="handleRestart(row)"
            >
              重启
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </el-button-group>
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

    <!-- 添加详情弹窗 -->
    <el-dialog
      v-model="showDetailDialog"
      :title="`容器详情 - ${currentContainer?.name || ''}`"
      width="700px"
      destroy-on-close
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="容器ID" :span="2">{{
          currentContainer?.id
        }}</el-descriptions-item>
        <el-descriptions-item label="服务">{{
          currentContainer?.service
        }}</el-descriptions-item>
        <el-descriptions-item label="版本">{{
          currentContainer?.version
        }}</el-descriptions-item>
        <el-descriptions-item label="镜像">{{
          currentContainer?.image
        }}</el-descriptions-item>
        <el-descriptions-item label="标签">{{
          currentContainer?.tag
        }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag
            v-if="currentContainer"
            :type="getStatusType(currentContainer.status)"
          >
            {{
              currentContainer.status === 'running'
                ? '运行中'
                : currentContainer.status === 'stopped'
                  ? '已停止'
                  : '异常'
            }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{
          currentContainer?.createTime
        }}</el-descriptions-item>
        <el-descriptions-item label="端口映射" :span="2">
          <el-tag
            v-for="port in currentContainer?.ports"
            :key="port"
            size="small"
            class="port-tag"
          >
            {{ port }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="资源限制" :span="2">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-statistic title="内存限制" :value="currentContainer?.memory">
                <template #suffix>MB</template>
              </el-statistic>
            </el-col>
            <el-col :span="12">
              <el-statistic title="CPU限制" :value="currentContainer?.cpu">
                <template #suffix>Core</template>
              </el-statistic>
            </el-col>
          </el-row>
        </el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDetailDialog = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.container-list {
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

.container-detail {
  padding: 20px;
}

.port-tag {
  margin-right: 5px;
}

.port-tag:last-child {
  margin-right: 0;
}

.service-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.version-tag {
  margin-left: 8px;
}

.dialog-footer {
  padding: 10px 20px;
}

.el-dropdown {
  margin-left: 4px;
}

:deep(.el-descriptions__cell) {
  padding: 12px 16px;
}

.port-tag {
  margin-right: 8px;
  margin-bottom: 4px;
}

/* 优化按钮组样式 */
.el-button-group {
  display: flex;
  gap: 4px;
}

.el-button-group .el-button {
  margin-left: 0 !important;
}
</style>
