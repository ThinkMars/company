import { MetricsType } from '../constants'
import { track, type TrackOptions } from '../track'

const handlePerformanceEntry = (entryList: PerformanceEntryList) => {
  const reportData: TrackOptions = {
    eventName: MetricsType.Performance,
    eventType: MetricsType.Performance,
  }

  const performanceData: any = {}

  for (const entry of entryList) {
    if (entry.name === 'first-paint') {
      // 单位ms
      performanceData.FP = entry.startTime
    } else if (entry.name === 'first-contentful-paint') {
      performanceData.FCP = entry.startTime
    } else if (entry.name === 'largest-contentful-paint') {
      performanceData.LCP = entry.startTime
    }
  }

  reportData.data = performanceData

  track(reportData)
}

export function performancePlugin() {
  if (window.PerformanceObserver) {
    const observer = new PerformanceObserver((list) => {
      handlePerformanceEntry(list.getEntries())
    })
    observer.observe({
      entryTypes: [
        'first-paint',
        'first-contentful-paint',
        'largest-contentful-paint',
      ],
    })
  } else {
    handlePerformanceEntry(window.performance.getEntries())
  }
}
