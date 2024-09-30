import { MetricsType } from '../constants'
import { track } from '../track'

export function spaPlugin() {
  const hackState = (fnName: 'pushState' | 'replaceState') => {
    const func = window.history[fnName]

    if (typeof func === 'function') {
      window.history[fnName] = function (...args) {
        track({
          eventType: MetricsType.Performance,
          eventName: 'pageChange',
          data: {},
        })

        return func.apply(this, args)
      }
    }
  }

  hackState('pushState')
  hackState('replaceState')

  window.addEventListener('hashchange', () => {
    track({
      eventType: MetricsType.Performance,
      eventName: 'pageChange',
      data: {},
    })
  })

  window.addEventListener('historystatechanged', () => {
    track({
      eventType: MetricsType.Performance,
      eventName: 'pageChange',
      data: {},
    })
  })

  // TODO: 检测路由变化后的性能？
}
