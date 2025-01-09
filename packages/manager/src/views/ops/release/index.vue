<script setup lang="ts">
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import PipelineList from './components/PipelineList.vue'
import PipelineDetail from './components/PipelineDetail.vue'
import ReleaseHistory from './components/ReleaseHistory.vue'

const activeTab = ref('pipeline')
const currentPipeline = ref<any>(null)

const handleTabChange = (tab: TabsPaneContext) => {
  if (tab.paneName === 'pipeline') {
    currentPipeline.value = null
  }
}

const handlePipelineSelect = (pipeline: any) => {
  currentPipeline.value = pipeline
  activeTab.value = 'detail'
}
</script>

<template>
  <el-card class="pipeline-container">
    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="流水线列表" name="pipeline">
        <PipelineList @select-pipeline="handlePipelineSelect" />
      </el-tab-pane>
      <el-tab-pane
        label="流水线详情"
        name="detail"
        :disabled="!currentPipeline"
      >
        <PipelineDetail v-if="currentPipeline" :pipeline="currentPipeline" />
      </el-tab-pane>
      <el-tab-pane label="发布记录" name="history">
        <ReleaseHistory />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<style scoped>
.pipeline-container {
  min-height: calc(100vh - 120px);
}
</style>
