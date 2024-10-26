import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from '@/router/index'
import { createMonitor } from '@company/web-metrics'
createMonitor({
  projectId: '1234567890',
  debug: true,
  serverUrl: 'http://localhost:3000/track', // your server url
  // useImg: true,
})
const app = createApp(App)
app.use(router)
app.mount('#app')
