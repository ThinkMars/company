<script setup lang="ts">
import { ref } from 'vue'

const backgroundColor = ref('#ffffff')

const changePageBackgroundColor = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0]
    if (activeTab) {
      chrome.scripting.executeScript(
        {
          target: { tabId: activeTab.id! },
          files: ['src/changeBackgroundColor.ts'],
        },
        () => {
          chrome.tabs.sendMessage(activeTab.id!, {
            action: 'changeBackgroundColor',
            color: backgroundColor.value,
          })
        },
      )
    }
  })
}

changePageBackgroundColor()
</script>

<template>
  <div class="extension-container">
    <h1 class="title">Free Theme Extension</h1>
    <div class="content">
      <p>Welcome to Free Theme Extension!</p>
    </div>
  </div>
</template>

<style scoped>
.extension-container {
  width: 300px;
  padding: 16px;
}

.title {
  font-size: 18px;
  margin-bottom: 16px;
}

.content {
  font-size: 14px;
}
</style>
