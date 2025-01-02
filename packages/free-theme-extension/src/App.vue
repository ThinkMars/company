<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { VueThemePanel } from '@company/free-theme-ball'

const currentColor = ref('#409EFF')

// 从存储中获取当前主题色
onMounted(async () => {
  const result = await chrome.storage.local.get(['themeColor'])
  if (result.themeColor) {
    currentColor.value = result.themeColor
  }
})

// 监听主题色变化
watch(currentColor, async (newColor) => {
  // 保存到存储
  await chrome.storage.local.set({ themeColor: newColor })

  // 获取当前标签页
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0]
    if (activeTab?.id) {
      // 使用 executeScript 直接在页面中执行主题更新
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: (color) => {
          // 设置主题色相关变量
          document.documentElement.style.setProperty(
            '--el-color-primary',
            color,
          )
          document.documentElement.style.setProperty(
            '--el-color-primary-light-3',
            color,
          )
          document.documentElement.style.setProperty(
            '--el-color-primary-light-5',
            color,
          )
          document.documentElement.style.setProperty(
            '--el-color-primary-light-7',
            color,
          )
          document.documentElement.style.setProperty(
            '--el-color-primary-light-8',
            color,
          )
          document.documentElement.style.setProperty(
            '--el-color-primary-light-9',
            color,
          )
          document.documentElement.style.setProperty(
            '--el-color-primary-dark-2',
            color,
          )
        },
        args: [newColor],
      })
    }
  })
})
</script>

<template>
  <div class="extension-container">
    <h1 class="title">自由主题预览</h1>
    <div class="content">
      <VueThemePanel v-model:currentColor="currentColor" />
    </div>
  </div>
</template>

<style scoped>
.extension-container {
  width: 360px;
  padding: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.title {
  font-size: 18px;
  margin-bottom: 12px;
  color: #303133;
}

.content {
  display: flex;
  flex-direction: column;
  margin: -8px;
}
</style>
