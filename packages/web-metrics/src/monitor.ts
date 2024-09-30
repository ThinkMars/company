import { track } from './track'
import {
  spaPlugin,
  errorPlugin,
  performancePlugin,
  requestPlugin,
} from './plugins/index'

interface MonitorConfig {
  projectId: string
  serverUrl?: string
  userId?: string | number
  whiteURLList?: string[]
  debug?: boolean
}

export interface Monitor {
  track: typeof track
  config: Omit<MonitorConfig, 'whiteURLList'> &
    Required<Pick<MonitorConfig, 'whiteURLList'>>
}

export let monitorInstance: Monitor

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

  const { whiteURLList = [], ...resConfig } = config || {}

  const initConfig = {
    whiteURLList,
    ...resConfig,
  }

  monitorInstance = Object.freeze({
    track,
    config: initConfig,
  })

  initPlugins(monitorInstance)

  return monitorInstance
}
