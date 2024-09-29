import { getDeviceInfo } from './device'
import { track } from './track'
import { getNetworkType, getLocaleLanguage, getPageUrl } from './utils'
import {
  spaPlugin,
  errorPlugin,
  performancePlugin,
  requestPlugin,
} from './plugins/index'

interface MonitorConfig {
  userId?: string | number
  whiteURLList: string[]
}

export interface Monitor {
  track: typeof track
  config: MonitorConfig
}

export let monitorInstance: Monitor | null = null

function initPlugins(ctx: Monitor) {
  ;[spaPlugin, errorPlugin, performancePlugin, requestPlugin].forEach(
    (plugin) => plugin(ctx),
  )
}

// 1 作为创建的入口，使用之前创建一个监视器，其中传入一个userId作为唯一标识
// 2 监视器中包含一个track方法，用于收集数据
// 3 初始化的时候，可存储设备信息，浏览器信息等
export function createMonitor(config: MonitorConfig) {
  if (monitorInstance) {
    return monitorInstance
  }

  const { userId, whiteURLList = [] } = config

  const deviceInfo = getDeviceInfo()
  const networkType = getNetworkType()
  const localeLanguage = getLocaleLanguage()
  const pageUrl = getPageUrl()

  const initConfig = {
    deviceInfo,
    networkType,
    localeLanguage,
    pageUrl,
    userId,
    whiteURLList,
  }

  monitorInstance = Object.freeze({
    track,
    config: initConfig,
  })

  initPlugins(monitorInstance)

  return monitorInstance
}
