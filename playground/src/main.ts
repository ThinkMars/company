import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createMonitor } from '@company/web-metrics'
createMonitor({
  projectId: '1234567890',
  debug: true,
})
createApp(App).mount('#app')
