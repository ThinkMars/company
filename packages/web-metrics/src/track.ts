import { MetricsType } from './constants'
import { report } from './report'
import { monitorInstance } from './monitor'
import deepMerge from 'deepmerge'

export interface TrackOptions {
  eventType: MetricsType
  eventName: string
  data?: object
}

export function track(options: TrackOptions) {
  const { data, ...otherOptions } = options

  if (!data) {
    console.warn('track data is empty')
    return
  }

  const initData = monitorInstance!.config

  const metricsData = deepMerge(initData, data || {})
  const reportData = { ...initData, ...otherOptions, metricsData }

  report(reportData)
}
