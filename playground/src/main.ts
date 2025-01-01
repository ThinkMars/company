import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createMonitor } from '@company/web-metrics'
import { VueThemeBallPlugin } from '@company/free-theme-ball'

const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

createMonitor({
  projectId: '1234567890',
  debug: true,
  serverUrl: 'http://localhost:3000/track',
})

// 初始化主题球
app.use(VueThemeBallPlugin)

app.use(ElementPlus)
app.use(router)
app.mount('#app')
