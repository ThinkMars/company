<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
// 导入主题面板组件
import { VueThemePanel } from '@company/free-theme-ball'

// 当前主题色，默认为 Element Plus 的蓝色
const currentColor = ref('#409EFF')

// 组件挂载时从 Chrome 存储中读取保存的主题色
onMounted(async () => {
  const result = await chrome.storage.local.get(['themeColor'])
  if (result.themeColor) {
    currentColor.value = result.themeColor
  }
})

// 监听主题色变化，当颜色改变时：
// 1. 保存新的颜色到 Chrome 存储
// 2. 在当前活动标签页中应用新的主题色
watch(currentColor, async (newColor) => {
  // 将新的主题色保存到 Chrome 本地存储
  await chrome.storage.local.set({ themeColor: newColor })

  // 获取当前激活的标签页
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0]
    if (activeTab?.id) {
      // 在当前标签页中执行脚本，更新 Element Plus 的主题相关 CSS 变量
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: (color) => {
          // 设置 Element Plus 的主题相关 CSS 变量
          // 包括主色及其不同亮度的变体
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
    <!-- 使用主题面板组件，双向绑定当前颜色值 -->
    <div class="content">
      <VueThemePanel v-model:currentColor="currentColor" />
    </div>
  </div>
</template>

<style scoped>
/* 容器样式：设置固定宽度和内边距 */
.extension-container {
  width: 360px;
  padding: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 标题样式 */
.title {
  font-size: 18px;
  margin-bottom: 12px;
  color: #303133;
}

/* 内容区域样式：弹性布局 */
.content {
  display: flex;
  flex-direction: column;
  margin: -8px;
}
</style>
