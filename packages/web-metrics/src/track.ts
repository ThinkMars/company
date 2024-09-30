import { MetricsType } from './constants'
import { report } from './report'
import { monitorInstance } from './monitor'
import { getDeviceInfo } from './device'
import {
  getLocaleLanguage,
  getNetworkType,
  getPageUrl,
  generateUniqueId,
} from './utils'
import deepMerge from 'deepmerge'

export interface TrackOptions {
  eventType: MetricsType
  eventName: string
  data?: object
}

export function track(options: TrackOptions) {
  const { data, ...otherOptions } = options

  const { projectId, userId } = monitorInstance.config

  const deviceInfo = getDeviceInfo()
  const networkType = getNetworkType()
  const localeLanguage = getLocaleLanguage()
  const pageUrl = getPageUrl()
  const baseConfig = {
    networkType,
    localeLanguage,
    pageUrl,
    ...deviceInfo,
  }

  const metricsData = deepMerge(
    { projectId, userId: userId || generateUniqueId() },
    baseConfig,
    data || {},
  )
  const reportData = { ...otherOptions, ...metricsData }

  report(reportData)
}
