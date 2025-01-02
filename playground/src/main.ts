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

// 使用主题球插件
app.use(VueThemeBallPlugin, {
  initialColor: '#409EFF', // 可选，默认主题色
  position: 'right', // 可选，悬浮球位置，'left' | 'right'
  offset: 20, // 可选，距离边缘的偏移量
})

app.use(ElementPlus)
app.use(router)
app.mount('#app')
