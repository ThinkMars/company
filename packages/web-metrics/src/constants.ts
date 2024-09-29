export enum MetricsType {
  Performance = 'performance',
  VueJsError = 'vueJsError',
  JSError = 'jsError',
  UnHandleRejectionError = 'unHandleRejectionError',
  ResourceError = 'resourceError',
  HttpRequest = 'httpRequest',
  Custom = 'custom',
}

export const REPORT_URL = 'https://api.metrics.cn/report'
