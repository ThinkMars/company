export interface MonitorConfig {
  projectId: string
  whiteURLList: string[]
  serverUrl: string
  userId: string | number
  debug: boolean
  useImg: boolean
}

export interface Monitor {
  track: typeof track
  config: MonitorConfig
  // config: Omit<MonitorConfig, 'whiteURLList'> &
  //   Required<Pick<MonitorConfig, 'whiteURLList'>>
}

interface ReportOptions {
  [key: string]: any
}

export interface TrackOptions {
  eventName: string
  eventType?: MetricsType
  data?: object
}

export interface IDeviceInfo {
  browser: string
  mobile?: string
  isPhone: boolean
  userAgent: string
  os: string
  cpu: string
  engine: string
  screenW: number
  screenH: number
  dpr: number
}
