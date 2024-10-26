# @company/web-metrics

## introduction

track web data and make metrics.

## install

⚠️NOTE: this package is not published to npm yet, just for internal use.

```bash
## npm install @company/web-metrics
```

## usage

```js
import { createMonitor, MetricsType } from '@company/web-metrics'

const monitor = createMonitor({
  projectId: 'my-project', // your project id
  serverUrl: 'http://localhost:3000/api/track', // your server url
  userId: '123456', // your unique user id
})

// define my own track event
monitor.track({
  eventName: 'your_event_name',
  data: {
    button: 'submit',
  },
})
```

## api

### createMonitor

```js
interface Monitor {
  config: MonitorConfig;
  track(eventName: string, eventType?: MetricsType, data?: object);
}

createMonitor(config: MonitorConfig): Monitor;
```

### track

```typescript
track(eventName: string, eventType?: MetricsType, data?: object);
```

## MonitorConfig

```ts
interface MonitorConfig {
  // The ID of the project.
  projectId: string
  // The URL of the server to send the data to.
  serverUrl?: string
  // The ID of the user to associate with the data.
  userId?: string | number
  // The list of URLs to exclude from tracking.
  whiteURLList?: string[]
  // Whether to enable debug mode. Default is false.
  // In debug mode, the data will be printed to the console instead of being sent to the server.
  debug?: boolean
  // Whether to use image to send data. Default is false.
  // If set to false, the data will be sent first use navigator.sendBeacon
  useImg?: boolean
}
```

## MetricsType

```ts
export enum MetricsType {
  Performance = 'performance',
  VueJsError = 'vueJsError',
  JSError = 'jsError',
  UnHandleRejectionError = 'unHandleRejectionError',
  ResourceError = 'resourceError',
  HttpRequest = 'httpRequest',
  Custom = 'custom',
}
```
