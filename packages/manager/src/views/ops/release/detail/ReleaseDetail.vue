<template>
  <div class="release-detail">
    <!-- Top Section -->
    <el-card class="top-section-card">
      <div class="top-section">
        <!-- Task Information -->
        <div class="task-info">
          <el-descriptions title="构建任务信息" :column="2" border>
            <el-descriptions-item label="状态" width="120px">
              <el-tag
                v-if="taskInfo.status"
                :type="getStatusType(taskInfo.status)"
              >
                {{ taskInfo.status }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="流水线名称">
              {{ taskInfo.name }}
            </el-descriptions-item>
            <el-descriptions-item label="分支">
              {{ taskInfo.branch }}
            </el-descriptions-item>
            <el-descriptions-item label="Git 仓库">
              {{ taskInfo.gitUrl }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <el-button
            type="primary"
            style="margin-right: 16px"
            :loading="isBuilding"
            :disabled="isBuilding"
            @click="triggerBuild()"
            >触发构建</el-button
          >
          <el-button
            type="danger"
            style="margin-right: 16px"
            :disabled="!isBuilding"
            @click="stopBuild()"
            >停止构建</el-button
          >
        </div>
      </div>
    </el-card>

    <!-- Bottom Section - Jenkins Logs -->
    <el-card class="bottom-section-card">
      <div class="bottom-section">
        <div class="log-header">
          <div class="header-left">
            <el-icon>
              <Document />
            </el-icon>
            <span>构建日志</span>
          </div>
          <el-button link @click="clearLogs">
            <el-icon>
              <Delete />
            </el-icon>
            清空日志
          </el-button>
        </div>
        <div class="log-content" ref="logContainer">
          <pre>{{ buildLogs }}</pre>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import {
  getJobBaseConfig,
  getJobBuildLog,
  getJobDetail,
  getJobSteamsBuildLog,
  stopJob,
  triggerJob,
} from '@/api/jenkins'
import { onMounted, ref, useTemplateRef, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const taskInfo = ref({
  name: '',
  gitUrl: '',
  branch: '',
  status: '',
})

const buildLogs = ref('')
const isBuilding = ref(false)
const logContainer = useTemplateRef('logContainer')

const scrollToBottom = () => {
  if (logContainer.value) {
    logContainer.value.scrollTop = logContainer.value.scrollHeight
  }
}

const jobName = route.params.name as string
const from = route.query.from as string

const triggerBuild = async () => {
  try {
    isBuilding.value = true
    taskInfo.value.status = 'RUNNING'

    buildLogs.value = '正在创建构建任务......\n'

    await triggerJob({ name: jobName })

    ElMessage.success('开始构建')

    buildLogs.value += '开始构建......\n'

    scrollToBottom()

    const res = await getJobSteamsBuildLog({ name: jobName })
    const reader = res.body!.getReader()
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        scrollToBottom()
        genJobBaseConfig()
        isBuilding.value = false
        break
      }

      const text = new TextDecoder().decode(value)
      buildLogs.value += text
      scrollToBottom()
    }
  } catch (error) {
    isBuilding.value = false
    ElMessage.error('触发构建失败')
  }
}

const stopBuild = async () => {
  try {
    await stopJob({ name: jobName })

    isBuilding.value = false
    ElMessage.success('构建已停止')
  } catch (error) {
    ElMessage.error('停止构建失败')
  }
}

const clearLogs = () => {
  buildLogs.value = ''
}

const getStatusType = (status: string) => {
  const types: Record<
    string,
    'success' | 'warning' | 'danger' | 'info' | 'primary'
  > = {
    SUCCESS: 'success',
    FAILURE: 'danger',
    RUNNING: 'warning',
    NOT_BUILT: 'info',
  }
  return types[status] || 'info'
}

const genJobBaseConfig = async () => {
  const res = await getJobBaseConfig({ name: jobName })
  const { gitUrl, branch, name, status } = res

  taskInfo.value = { ...taskInfo.value, gitUrl, branch, name, status }
}

onMounted(async () => {
  genJobBaseConfig()
  const res = await getJobDetail({ name: jobName })

  if (from === 'history') {
    taskInfo.value.status = res.builds?.[0].status
    getJobBuildLog({ name: jobName }).then((res) => {
      buildLogs.value = res.logs
    })
  } else {
    taskInfo.value.status = 'NOT_BUILT'
  }
})
</script>

<style lang="less" scoped>
.release-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;

  .top-section-card {
    margin-bottom: 0;

    :deep(.el-card__body) {
      padding: 16px;
    }
  }

  .bottom-section-card {
    flex: 1;
    margin-bottom: 0;

    :deep(.el-card__body) {
      height: 100%;
      padding: 0;
    }
  }

  .top-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .task-info {
      flex: 1;
    }

    .action-buttons {
      display: flex;
      gap: 12px;
      margin-left: 24px;
    }

    :deep(.el-descriptions) {
      width: 100%;

      .el-descriptions__header {
        margin-bottom: 12px;
      }

      .el-descriptions__label {
        width: 120px;
        justify-content: right;
      }
    }
  }

  .bottom-section {
    height: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid #d9d9d9;
    border-radius: 4px;

    .log-header {
      padding: 12px 16px;
      border-bottom: 1px solid var(--el-border-color-light);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--el-bg-color-page);

      .header-left {
        display: flex;
        align-items: center;
        gap: 8px;

        .el-icon {
          font-size: 16px;
          color: var(--el-text-color-secondary);
        }
      }
    }

    .log-content {
      flex: 1;
      overflow-y: auto;
      background: #fafafa; // 浅灰色纸张背景
      font-family: 'IBM Plex Mono', 'Fira Code', Consolas, monospace;
      line-height: 1.6;
      font-size: 13px;

      &::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }

      &::-webkit-scrollbar-track {
        background: #f0f0f0;
      }

      &::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 6px;
        border: 2px solid #f0f0f0;

        &:hover {
          background: #bbb;
        }
      }

      pre {
        margin: 0;
        padding: 16px;
        white-space: pre-wrap;
        background: #000; // hover 时的浅灰色背景
        color: #a3a6ad; // GitHub 风格的文本颜色

        .log-line {
          display: block;
          position: relative;
          padding: 0 8px;

          &:hover {
            background: #f0f0f0; // hover 时的浅灰色背景
          }
        }

        // 不同类型日志的颜色
        .log-info {
          color: #0366d6; // 信息类日志使用蓝色
        }

        .log-warning {
          color: #f66a0a; // 警告类日志使用橙色
        }

        .log-error {
          color: #d73a49; // 错误类日志使用红色
        }

        .log-success {
          color: #28a745; // 成功类日志使用绿色
        }
      }
    }
  }
}
</style>
