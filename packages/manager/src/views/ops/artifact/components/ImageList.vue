<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

interface Image {
  id: string
  name: string
  tag: string
  size: string
  pullCount: number
  lastUpdated: string
  service: string
  description: string
  versions: Array<{
    tag: string
    size: string
    createTime: string
    digest: string // 添加镜像摘要
  }>
}

const loading = ref(false)
const imageList = ref<Image[]>([])
const queryParams = ref({
  name: '',
  service: '',
  tag: '',
  pageNum: 1,
  pageSize: 10,
})
const total = ref(0)

// 模拟数据
const mockImageList = [
  {
    id: 'img1',
    name: 'web-frontend',
    tag: 'latest',
    size: '128MB',
    pullCount: 1000,
    lastUpdated: '2024-03-20 10:00:00',
    service: 'web-frontend',
    description: '前端服务镜像',
    versions: [
      {
        tag: 'v1.1.0',
        size: '128MB',
        createTime: '2024-03-20 10:00:00',
        digest: 'sha256:abc123',
      },
      {
        tag: 'v1.0.1',
        size: '125MB',
        createTime: '2024-03-19 15:30:00',
        digest: 'sha256:def456',
      },
      {
        tag: 'v1.0.0',
        size: '120MB',
        createTime: '2024-03-18 09:00:00',
        digest: 'sha256:ghi789',
      },
    ],
  },
  {
    id: 'img2',
    name: 'backend-api',
    tag: 'v1.0.0',
    size: '256MB',
    pullCount: 800,
    lastUpdated: '2024-03-19 15:30:00',
    service: 'backend-api',
    description: '后端API服务镜像',
    versions: ['v1.0.0', 'latest'],
  },
] as Image[]

const fetchImageList = async () => {
  try {
    loading.value = true
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1000))
    imageList.value = mockImageList
    total.value = mockImageList.length
  } finally {
    loading.value = false
  }
}

const handleCreateContainer = async (image: Image) => {
  try {
    await ElMessageBox.confirm(
      `确认使用镜像 ${image.name}:${image.tag} 创建容器？`,
    )
    ElMessage.success('创建成功')
  } catch {
    // 取消操作
  }
}

const handleCreateContainerFromVersion = async (
  image: Image,
  version: Image['versions'][0],
) => {
  try {
    await ElMessageBox.confirm(
      `确认使用镜像 ${image.name}:${version.tag} 创建容器？`,
      '创建确认',
      {
        confirmButtonText: '确认创建',
        cancelButtonText: '取消',
        type: 'info',
      },
    )
    ElMessage.success('创建成功')
  } catch {
    // 取消操作
  }
}

const handleDelete = async (image: Image) => {
  try {
    await ElMessageBox.confirm(
      `确认删除镜像 ${image.name}:${image.tag}？`,
      '警告',
      {
        type: 'error',
      },
    )
    ElMessage.success('删除成功')
    await fetchImageList()
  } catch {
    // 取消操作
  }
}

const handleQuery = () => {
  queryParams.value.pageNum = 1
  fetchImageList()
}

const resetQuery = () => {
  queryParams.value = {
    name: '',
    service: '',
    tag: '',
    pageNum: 1,
    pageSize: 10,
  }
  fetchImageList()
}

// 添加历史版本对话框的状态
const showHistoryDialog = ref(false)
const currentImage = ref<Image | null>(null)

// 查看历史版本
const handleViewHistory = (image: Image) => {
  currentImage.value = image
  showHistoryDialog.value = true
}

onMounted(() => {
  fetchImageList()
})
</script>

<template>
  <div class="image-list">
    <div class="search-form">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="镜像名称">
          <el-input v-model="queryParams.name" placeholder="请输入镜像名称" />
        </el-form-item>
        <el-form-item label="服务">
          <el-input
            v-model="queryParams.service"
            placeholder="请输入服务名称"
          />
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="queryParams.tag" placeholder="请输入标签" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="imageList" v-loading="loading">
      <el-table-column prop="name" label="镜像名称" min-width="180">
        <template #default="{ row }">
          <div class="image-name">
            <span class="name">{{ row.name }}</span>
            <div class="description text-ellipsis">{{ row.description }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="service" label="服务" width="150" />
      <el-table-column label="版本信息" width="150">
        <template #default="{ row }">
          <div class="version-info">
            <el-tag type="success">{{ row.tag }}</el-tag>
            <div class="version-count text-muted">
              共 {{ row.versions.length }} 个版本
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="镜像信息" width="200">
        <template #default="{ row }">
          <div class="image-info">
            <div class="info-item">
              <el-icon>
                <Document />
              </el-icon>
              <span>{{ row.size }}</span>
            </div>
            <div class="info-item">
              <el-icon>
                <Download />
              </el-icon>
              <span>{{ row.pullCount }} 次拉取</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="lastUpdated" label="最后更新" width="180" />
      <el-table-column label="操作" width="280" fixed="right">
        <template #default="{ row }">
          <el-button-group>
            <el-button
              type="primary"
              size="small"
              @click="handleCreateContainer(row)"
            >
              创建容器
            </el-button>
            <el-button type="info" size="small" @click="handleViewHistory(row)">
              历史版本
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!-- 历史版本对话框 -->
    <el-dialog
      v-model="showHistoryDialog"
      :title="`${currentImage?.name || ''} - 历史版本`"
      width="800px"
      destroy-on-close
    >
      <el-table :data="currentImage?.versions || []" style="width: 100%">
        <el-table-column prop="tag" label="版本" width="120">
          <template #default="{ row }">
            <el-tag size="small">{{ row.tag }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="size" label="大小" width="100" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="digest" label="摘要" min-width="200">
          <template #default="{ row }">
            <el-tooltip :content="row.digest" placement="top">
              <span class="digest-text">{{ row.digest }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="handleCreateContainerFromVersion(currentImage!, row)"
            >
              创建容器
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showHistoryDialog = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

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
.image-list {
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

.image-name {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.image-name .name {
  font-weight: 500;
}

.image-name .description {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.version-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.version-list {
  font-size: 12px;
}

.image-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.text-muted {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.digest-text {
  display: inline-block;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: monospace;
}

.version-list {
  margin-top: 4px;
}

:deep(.el-dialog__body) {
  padding-top: 10px;
}

.dialog-footer {
  padding: 10px 20px;
}

.version-count {
  margin-top: 4px;
  font-size: 12px;
}
</style>
