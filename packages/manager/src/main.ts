import { createApp } from 'vue'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import pinia from './pinia'

import '@/styles/index.less'

const app = createApp(App)

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 按照正确的顺序使用插件
app.use(pinia) // Pinia 需要在 router 之前注册
app.use(router)

app.mount('#app')
