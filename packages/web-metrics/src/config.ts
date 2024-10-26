import { MonitorConfig } from './types'
import deepMerge from 'deepmerge'

class CtxConfig {
  private config: MonitorConfig = {
    projectId: '',
    whiteURLList: [],
    serverUrl: '',
    userId: '',
    debug: false,
    useImg: false,
  }

  get<T>(key?: T extends string ? keyof MonitorConfig : undefined) {
    if (!key) {
      return this.config
    } else {
      return this.config[key]
    }
  }

  set(config: Partial<MonitorConfig>) {
    this.config = deepMerge(this.config || {}, config)
  }
}

export default new CtxConfig()
