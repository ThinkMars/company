import errorStackParser from 'error-stack-parser'
import stringify from 'safe-stringify'
import { MetricsType } from '../constants'
import { track, type TrackOptions } from '../track'

export function errorPlugin() {
  const oldOnError = window.onerror
  const oldUnHandleRejection = window.onunhandledrejection

  window.onerror = function (...args) {
    if (oldOnError) {
      oldOnError(...args)
    }

    const [msg, url, line, column, error] = args

    const stackTrace = error ? errorStackParser.parse(error) : []
    const msgText = typeof msg === 'string' ? msg : msg.type
    const errorObj: TrackOptions = {
      data: {
        msgText,
        url,
        line,
        column,
        stackTrace: stringify(stackTrace),
      },
      eventType: MetricsType.JSError,
      eventName: MetricsType.JSError,
    }

    track(errorObj)
  }

  window.onunhandledrejection = function (e: PromiseRejectionEvent) {
    if (oldUnHandleRejection) {
      oldUnHandleRejection.call(window, e)
    }

    const error = e.reason
    const errMsg = error instanceof Error ? error.message : error

    const errorObj: TrackOptions = {
      data: errMsg,
      eventType: MetricsType.UnHandleRejectionError,
      eventName: MetricsType.UnHandleRejectionError,
    }

    track(errorObj)
  }

  window.addEventListener(
    'error',
    function (event) {
      const target: any = event.target || event.srcElement
      const isElementTarget =
        target instanceof HTMLScriptElement ||
        target instanceof HTMLLinkElement ||
        target instanceof HTMLImageElement
      if (!isElementTarget) return false

      let url: string
      if (target instanceof HTMLLinkElement) {
        url = target.href
      } else {
        url = target.src
      }

      const errorType = MetricsType.ResourceError
      const errorObj: TrackOptions = {
        data: { url },
        eventType: errorType,
        eventName: MetricsType.ResourceError,
      }

      track(errorObj)
    },
    true,
  )
}
