import { HistoryType, MetricsType } from '../constants'
import { track } from '../track'

export function spaPlugin() {
  const hackState = (fnName: 'pushState' | 'replaceState') => {
    const func = window.history[fnName]

    if (typeof func === 'function') {
      window.history[fnName] = function (...args) {
        track({
          eventType: MetricsType.RouterChange,
          eventName: HistoryType[fnName],
        })

        return func.apply(this, args)
      }
    }
  }

  hackState('pushState')
  // hackState('replaceState')

  window.addEventListener('popstate', () => {
    track({
      eventType: MetricsType.RouterChange,
      eventName: HistoryType.popstate,
    })
  })

  // TODO: 检测路由变化后的性能？
  // TODO: 监听路由
}
