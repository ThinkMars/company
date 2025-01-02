// 监听安装事件
chrome.runtime.onInstalled.addListener(() => {
  // 初始化存储
  chrome.storage.local.set({
    themeColor: '#409EFF',
  })
})

// 存储每个标签页的 Element Plus 检测状态
const tabElementPlusStatus = new Map()

// 监听来自 content script 的消息
chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.action === 'elementPlusDetected' && sender.tab?.id) {
    console.log('收到检测结果:', request.detected, '来自:', sender.tab.url)
    tabElementPlusStatus.set(sender.tab.id, request.detected)

    // 更新扩展图标状态
    chrome.action.setIcon({
      tabId: sender.tab.id,
      path: {
        16: 'icons/icon.png',
        48: 'icons/icon.png',
        128: 'icons/icon.png',
      },
    })

    // 更新扩展标题提示
    chrome.action.setTitle({
      tabId: sender.tab.id,
      title: request.detected ? '点击预览主题' : '当前页面未使用 Element Plus',
    })

    // 如果未检测到 Element Plus，禁用点击
    if (!request.detected) {
      chrome.action.disable(sender.tab.id)
    } else {
      chrome.action.enable(sender.tab.id)
    }
  }
})

// 监听标签页更新
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
    // 获取当前主题设置
    chrome.storage.local.get(['themeColor'], (result) => {
      // 检查该标签页是否使用了 Element Plus
      if (tabElementPlusStatus.get(tabId)) {
        // 应用主题色
        if (result.themeColor) {
          chrome.tabs.sendMessage(tabId, {
            action: 'updateTheme',
            palette: generatePalette(result.themeColor),
          })
        }
      }
    })
  }
})

// 清理已关闭标签页的状态
chrome.tabs.onRemoved.addListener((tabId) => {
  tabElementPlusStatus.delete(tabId)
})

// 简化版调色板生成函数
function generatePalette(color: string) {
  // 这里可以复用 free-theme-ball 的逻辑，或者使用简化版
  return {
    'color-primary': color,
    // ... 其他颜色变体
  }
}
