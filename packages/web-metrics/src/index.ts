import { track } from './track'
import {
  spaPlugin,
  errorPlugin,
  performancePlugin,
  requestPlugin,
} from './plugins/index'

import type { MonitorConfig, Monitor } from './types'

import ctxConfig from './config'

function initPlugins(ctx: Monitor) {
  ;[spaPlugin, errorPlugin, performancePlugin, requestPlugin].forEach(
    (plugin) => plugin(ctx),
  )
}

let monitorInstance: Monitor

// 1 作为创建的入口，使用之前创建一个监视器，其中传入一个userId作为唯一标识
// 2 监视器中包含一个track方法，用于收集数据
// 3 初始化的时候，可存储设备信息，浏览器信息等
// 4 PV UV 行为数据没添加
export function createMonitor(config: Partial<MonitorConfig>) {
  if (monitorInstance) {
    return monitorInstance
  }

  ctxConfig.set(config)

  monitorInstance = Object.freeze({
    track,
    config: ctxConfig.get(),
  })

  initPlugins(monitorInstance)

  return monitorInstance
}
