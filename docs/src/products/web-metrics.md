# 页面指标监控工具

## 仓库

[web-metrics](https://github.com/ThinkMars/company/tree/main/packages/web-metrics)

## 介绍

监控收集web数据，生成指标。

## 安装

⚠️注意: 本项目未选择发布到npm，请内部学习使用。

## 用法

```js
import { createMonitor, MetricsType } from '@company/web-metrics'

const monitor = createMonitor({
  projectId: 'my-project', // 项目ID
  serverUrl: 'http://localhost:3000/api/track', // 服务端地址
  userId: '123456', // 用户唯一性ID，如果没有，将自动生成一个deviceId
})

// 自定义抓取错误
monitor.track({
  eventName: 'your_event_name',
  data: {
    button: 'submit',
  },
})
```

## API

### createMonitor

创建一个监控实例，传入一些初始化配置。必须提前进行初始化，否则可能无法使用。

```js
interface Monitor {
  config: MonitorConfig;
  track(eventName: string, eventType?: MetricsType, data?: object);
}

createMonitor(config: MonitorConfig): Monitor;
```

### track

自定义上报数据，可以传入自定义的指标类型，默认为`MetricsType.Custom`。在初始化之后，可以随时调用此方法进行数据上报。

```typescript
track(eventName: string, eventType?: MetricsType, data?: object);
```

## 类型

### MonitorConfig

```ts
interface MonitorConfig {
  // 你的项目id
  projectId: string
  // 服务端接收数据的地址
  serverUrl?: string
  // 你的用户唯一性ID，如果没有，将自动生成一个deviceId
  userId?: string | number
  // 白名单，当url不在白名单中时，将不会进行上报
  whiteURLList?: string[]
  // debug模式下，数据将打印到控制台，而不是发送到服务器，可用于本地调试。
  debug?: boolean
  // 是否使用图片发送数据，默认为false。
  // 如果设置为false，将首先使用navigator.sendBeacon发送数据。
  useImg?: boolean
}
```

### MetricsType

```ts
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
```
