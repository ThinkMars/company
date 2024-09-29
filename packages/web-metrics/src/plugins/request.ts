import { MetricsType } from '../constants'
import { Monitor } from '../monitor'
import { track } from '../track'

export function requestPlugin(ctx: Monitor) {
  const whiteURLList = ctx.config.whiteURLList
  // 拦截XMLHttpRequest
  const originalXhrOpen = XMLHttpRequest.prototype.open
  XMLHttpRequest.prototype.open = function (
    method: string,
    url: string | URL,
    async: boolean = true,
    username?: string | null,
    password?: string | null,
  ) {
    this.addEventListener('load', function () {
      if (!whiteURLList.includes(this.responseURL)) {
        track({
          eventName: MetricsType.HttpRequest,
          eventType: MetricsType.HttpRequest,
          data: {
            url: this.responseURL,
            method: method,
            status: this.status,
            // duration
          },
        })
      }
    })

    originalXhrOpen.apply(this, [method, url, async, username, password])
  }

  // 拦截Fetch
  const originalFetch = window.fetch
  window.fetch = function (...args) {
    return originalFetch.apply(this, args).then((response) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, init] = args

      if (!whiteURLList.includes(response.url)) {
        track({
          eventName: MetricsType.HttpRequest,
          eventType: MetricsType.HttpRequest,
          data: {
            url: response.url,
            method: init?.method || 'GET',
            status: response.status,
            // duration
          },
        })
      }

      return response
    })
  }
}
