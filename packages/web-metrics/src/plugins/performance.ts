import { MetricsType, PerformanceDataType } from '../constants'
import { track } from '../track'
import { TrackOptions } from '../types'

const handlePerformanceEntry = (entryList: PerformanceEntryList) => {
  const reportData: TrackOptions = {
    eventName: MetricsType.Performance,
    eventType: MetricsType.Performance,
  }

  const commonTrack = (data: object) => {
    track({
      ...reportData,
      data,
    })
  }

  for (const entry of entryList) {
    switch (entry.name) {
      case PerformanceDataType.FirstPaint:
        commonTrack({ FP: entry.startTime })
        break
      case PerformanceDataType.FirstContentfulPaint:
        commonTrack({ FCP: entry.startTime })
        break
      default:
        break
    }

    switch (entry.entryType) {
      case PerformanceDataType.LargestContentfulPaint:
        commonTrack({ LCP: entry.startTime })
        break
      case PerformanceDataType.LongTask:
        commonTrack({ LongTask: entry.startTime })
        break
      case PerformanceDataType.Resource:
        // too many resources loaded
        break
      default:
        break
    }
  }
}

export function performancePlugin() {
  if (window.PerformanceObserver) {
    const observer = new PerformanceObserver((list) => {
      handlePerformanceEntry(list.getEntries())
    })

    observer.observe({
      type: 'paint',
      buffered: true,
    })
    observer.observe({
      type: 'largest-contentful-paint',
      buffered: true,
    })
    observer.observe({
      type: 'longtask',
      buffered: true,
    })
    // check GET request
    observer.observe({
      type: 'resource',
      buffered: true,
    })
  } else {
    // handlePerformanceEntry(window.performance.getEntries())
  }
}
