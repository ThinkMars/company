# web-metrics

## Introduction

track web data and make metrics.

## install

⚠️NOTE: this package is not published to npm yet, just for internal use.

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

## More

![document](https://company.thinkmars.cn/products/web-metrics.html)
