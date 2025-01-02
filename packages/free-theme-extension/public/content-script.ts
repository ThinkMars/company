console.log('Content script 已加载')

// 检测是否使用了 Element Plus
function detectElementPlus() {
  console.log('开始检测 Element Plus...')
  // 检查多个 Element Plus 特征
  const features = [
    // 检查常见组件
    () =>
      !!document.querySelector(
        '.el-button, .el-input, .el-form, .el-menu, .el-table',
      ),
    // 检查 CSS 变量
    () => {
      const style = getComputedStyle(document.documentElement)
      return style.getPropertyValue('--el-color-primary') !== ''
    },
    // 检查特定类名前缀
    () => {
      const elements = document.querySelectorAll('[class]')
      return Array.from(elements).some((el) =>
        el.className.split(' ').some((cls) => cls.startsWith('el-')),
      )
    },
  ]

  const result = features.some((check) => {
    try {
      return check()
    } catch (e) {
      console.error('检测出错:', e)
      return false
    }
  })
  console.log('Element Plus 检测结果:', result)
  return result
}

// 定期检测 Element Plus
function startDetection() {
  console.log('开始检测流程...')
  let detected = false

  const check = () => {
    const isElementPlus = detectElementPlus()
    if (isElementPlus !== detected) {
      detected = isElementPlus
      console.log('发送检测结果到 background:', detected)
      chrome.runtime.sendMessage(
        {
          action: 'elementPlusDetected',
          detected,
        },
        (response) => {
          console.log('background 响应:', response)
        },
      )
    }
  }

  // 初始检测
  check()

  // 监听 DOM 变化
  const observer = new MutationObserver(() => {
    check()
  })

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  })

  // 多次检查以处理延迟加载的情况
  const checkTimes = [100, 500, 1000, 2000]
  checkTimes.forEach((delay) => {
    setTimeout(check, delay)
  })
}

// 确保 DOM 加载完成后再开始检测
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startDetection)
} else {
  startDetection()
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('收到消息:', request.action, sender)
  if (request.action === 'checkElementPlus') {
    const result = detectElementPlus()
    console.log('响应 checkElementPlus:', result)
    sendResponse({ isElementPlus: result })
  } else if (request.action === 'updateTheme') {
    const { palette } = request as { palette: Record<string, string> }
    Object.entries(palette).forEach(([key, value]: [string, string]) => {
      document.documentElement.style.setProperty(`--el-${key}`, value)
    })
    sendResponse({ success: true })
  }
  return true
})
