export enum MetricsType {
  Performance = 'performance',
  VueJsError = 'vueJsError',
  JSError = 'jsError',
  UnHandleRejectionError = 'unHandleRejectionError',
  ResourceError = 'resourceError',
  HttpRequest = 'httpRequest',
  RouterChange = 'routerChange',
  Custom = 'custom',
}

export const HistoryType = {
  pushState: 'push',
  replaceState: 'replace',
  popstate: 'back',
  stateChange: 'stateChange',
  hashChange: 'hashChange',
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
