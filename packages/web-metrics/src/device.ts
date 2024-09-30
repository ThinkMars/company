import { UAParser } from 'ua-parser-js'

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

export function getDeviceInfo(): IDeviceInfo {
  const parser = new UAParser()
  // console.log(parser.getResult())

  const { browser, cpu, device, os, engine, ua } = parser.getResult()

  return {
    browser: `${browser.name} ${browser.version}`,
    mobile: device.vendor,
    isPhone: device.type === 'mobile',
    userAgent: ua,
    os: `${os.name} ${os.version}`,
    cpu: `${cpu.architecture}`,
    engine: `${engine.name} ${engine.version}`,
    dpr: window.devicePixelRatio,
    screenW: document.documentElement.clientWidth || document.body.clientWidth,
    screenH:
      document.documentElement.clientHeight || document.body.clientHeight,
  }
}
