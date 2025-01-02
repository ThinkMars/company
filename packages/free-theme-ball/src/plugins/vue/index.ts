import { type App, createApp } from 'vue'
import type { ThemeBallOptions } from '../../core/types'
import { ThemeModifier } from '../../core/theme-modifier'
import ThemeBall from './components/ThemeBall.vue'
import ThemePanel from './components/ThemePanel.vue'

const ThemeBallPlugin = (app: App, options: ThemeBallOptions = {}) => {
  const {
    prefix = '--el-',
    initialColor = '#409EFF',
    position = 'right',
    offset = 20,
  } = options

  // 设置主题前缀
  ThemeModifier.setPrefix(prefix)

  // 创建并挂载主题球
  const mountThemeBall = () => {
    const container = document.createElement('div')
    container.id = 'theme-ball-container'
    document.body.appendChild(container)

    const themeBall = createApp(ThemeBall, {
      initialColor,
      position,
      offset,
    })
    themeBall.mount(container)
  }

  if (document.readyState === 'complete') {
    mountThemeBall()
  } else {
    window.addEventListener('load', mountThemeBall)
  }

  // 注册全局组件
  app.component('VueThemeBall', ThemeBall)
  app.component('VueThemePanel', ThemePanel)
}

export { ThemeBallPlugin, ThemeBall, ThemePanel }
