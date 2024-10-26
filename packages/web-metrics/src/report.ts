import safeStringify from 'safe-stringify'
import ctxConfig from './config'

import type { ReportOptions } from './types'

// 主要使用 Beacon API 和 Image，Beacon API确保即使在页面卸载后，数据也能被发送。
export function report(msg: ReportOptions) {
  const { debug, serverUrl, useImg } = ctxConfig.get()

  if (debug) {
    console.log(`[metrics report]: `, msg)
  }

  if (!serverUrl) {
    return
  }

  const msgStr = safeStringify(msg)

  // 优先使用Beacon API发送JSON字符串
  if (navigator.sendBeacon && !useImg) {
    navigator.sendBeacon(serverUrl, new URLSearchParams({ data: msgStr }))
  } else {
    setTimeout(() => {
      const img = new Image()
      img.src = `${serverUrl}?data=${msgStr}`

      img.width = 1
      img.height = 1

      // 清理内存，防止内存泄漏
      img.onload = img.onerror = function () {
        img.onload = img.onerror = null
      }
    })
  }
}
