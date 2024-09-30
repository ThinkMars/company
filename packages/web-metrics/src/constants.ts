export enum MetricsType {
  Performance = 'performance',
  VueJsError = 'vueJsError',
  JSError = 'jsError',
  UnHandleRejectionError = 'unHandleRejectionError',
  ResourceError = 'resourceError',
  HttpRequest = 'httpRequest',
  Custom = 'custom',
}

export enum PerformanceDataType {
  FirstPaint = 'first-paint',
  FirstContentfulPaint = 'first-contentful-paint',
  LargestContentfulPaint = 'largest-contentful-paint',
  LongTask = 'longtask',
  TimeToInteractive = 'time-to-interactive',
  TimeBlockingTime = 'total-blocking-time',
  Resource = 'resource',
}

// export const REPORT_URL = 'https://api.metrics.cn/report'
