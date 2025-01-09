<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  pipeline: any
}>()

interface Stage {
  id: number
  name: string
  status: 'running' | 'success' | 'failed' | 'pending'
  steps: Step[]
}

interface Step {
  id: number
  name: string
  status: 'running' | 'success' | 'failed' | 'pending'
  duration: string
  logs: string[]
}

const activeStage = ref(0)
const activeStep = ref(0)
const showLogs = ref(false)
const currentStep = ref<Step | null>(null)

// 模拟流水线阶段数据
const stages = ref<Stage[]>([
  {
    id: 1,
    name: '构建',
    status: 'success',
    steps: [
      {
        id: 1,
        name: '安装依赖',
        status: 'success',
        duration: '2分钟',
        logs: ['正在安装依赖...', '依赖安装完成'],
      },
      {
        id: 2,
        name: '编译',
        status: 'success',
        duration: '3分钟',
        logs: ['开始编译...', '编译完成'],
      },
    ],
  },
  {
    id: 2,
    name: '测试',
    status: 'running',
    steps: [
      {
        id: 3,
        name: '单元测试',
        status: 'running',
        duration: '进行中',
        logs: ['运行测试用例...'],
      },
    ],
  },
  {
    id: 3,
    name: '部署',
    status: 'pending',
    steps: [
      {
        id: 4,
        name: '部署到测试环境',
        status: 'pending',
        duration: '-',
        logs: [],
      },
    ],
  },
])

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    running: 'primary',
    success: 'success',
    failed: 'danger',
    pending: 'warning',
  }
  return map[status] || 'info'
}

const handleViewLogs = (step: Step) => {
  currentStep.value = step
  showLogs.value = true
}
</script>

<template>
  <div class="pipeline-detail">
    <el-loading v-if="loading" />
    <div class="pipeline-info">
      <h3>{{ pipeline.name }}</h3>
      <p>分支：{{ pipeline.branch }}</p>
      <p>创建时间：{{ pipeline.createTime }}</p>
    </div>

    <div class="pipeline-flow">
      <div class="stage-flow">
        <div
          v-for="(stage, index) in stages"
          :key="stage.id"
          class="stage-item"
          :class="[
            `status-${stage.status}`,
            { 'has-next': index < stages.length - 1 },
          ]"
        >
          <div class="stage-header">
            <span class="stage-name">{{ stage.name }}</span>
            <el-tag
              :type="getStatusType(stage.status)"
              size="small"
              effect="dark"
            >
              {{ stage.status }}
            </el-tag>
          </div>
          <div class="stage-steps">
            <div v-for="step in stage.steps" :key="step.id" class="step-item">
              <div class="step-info">
                <h4>{{ step.name }}</h4>
                <p>{{ step.duration }}</p>
              </div>
              <el-button
                type="primary"
                size="small"
                @click="handleViewLogs(step)"
                :disabled="step.logs.length === 0"
              >
                查看日志
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="showLogs"
      :title="`${currentStep?.name || ''} - 执行日志`"
      width="60%"
      :close-on-click-modal="false"
      class="log-dialog"
    >
      <div class="log-content">
        <pre v-for="(log, index) in currentStep?.logs" :key="index">{{
          log
        }}</pre>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showLogs = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.pipeline-detail {
  padding: 20px;
}

.pipeline-info {
  margin-bottom: 30px;
}

.pipeline-flow {
  margin: 30px 0;
  overflow-x: auto;
  padding: 20px 0;
}

.stage-flow {
  display: flex;
  min-width: min-content;
  padding: 0 20px;
}

.stage-item {
  position: relative;
  min-width: 250px;
  background: #f5f7fa;
  border-radius: 8px;
  padding: 15px;
  margin-right: 50px;
}

.stage-item.has-next::after {
  content: '';
  position: absolute;
  right: -30px;
  top: 50%;
  width: 30px;
  height: 2px;
  background: #dcdfe6;
}

.stage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.stage-name {
  font-weight: bold;
  font-size: 16px;
}

.stage-steps {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.step-item {
  background: white;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.step-info {
  margin-bottom: 10px;
}

.step-info h4 {
  margin: 0 0 5px 0;
}

.step-info p {
  margin: 0;
  font-size: 12px;
  color: #909399;
}

.status-success {
  background: #f0f9eb;
  border: 1px solid #e1f3d8;
}

.status-running {
  background: #ecf5ff;
  border: 1px solid #d9ecff;
}

.status-failed {
  background: #fef0f0;
  border: 1px solid #fde2e2;
}

.status-pending {
  background: #f4f4f5;
  border: 1px solid #e9e9eb;
}

.log-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.log-content {
  padding: 20px;
  background: #1e1e1e;
  color: #fff;
  font-family: monospace;
  min-height: 300px;
  max-height: 600px;
  overflow-y: auto;
}

.log-content pre {
  margin: 5px 0;
  white-space: pre-wrap;
  line-height: 1.5;
}

.dialog-footer {
  padding: 10px 20px;
}
</style>
