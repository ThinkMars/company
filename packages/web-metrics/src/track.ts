import { MetricsType } from './constants'
import { report } from './report'
import ctxConfig from './config'
import { getDeviceInfo } from './device'
import {
  getLocaleLanguage,
  getNetworkType,
  getPageUrl,
  generateUniqueId,
} from './utils'
import deepMerge from 'deepmerge'

import { TrackOptions } from './types'

export function track(options: { eventName: string; data?: any }): void
export function track(options: TrackOptions): void
export function track(options: TrackOptions): void {
  const { data, eventType = MetricsType.Custom, ...otherOptions } = options

  const { projectId, userId } = ctxConfig.get()

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

  const reportData = Object.assign({}, { eventType }, otherOptions, metricsData)

  report(reportData)
}
