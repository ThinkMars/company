import safeStringify from 'safe-stringify'
import { REPORT_URL } from './constants'

interface ReportOptions {
  [key: string]: any
}

// 主要使用 Beacon API 和 Image，Beacon API确保即使在页面卸载后，数据也能被发送。
export function report(msg: ReportOptions) {
  console.log(`[metrics] report: `, msg)

  const msgStr = safeStringify(msg)

  // 优先使用Beacon API发送JSON字符串
  if (navigator.sendBeacon) {
    navigator.sendBeacon(REPORT_URL, msgStr)
  } else {
    const img = new Image()
    img.src = `${REPORT_URL}?data=${safeStringify(msg)}`
    // 清理内存，防止内存泄漏
    img.onload = img.onerror = function () {
      img.onload = img.onerror = null
    }
  }
}
