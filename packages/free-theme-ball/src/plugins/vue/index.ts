import { type App, createApp } from 'vue'
import type { ThemeBallOptions } from '../../core/types'
import { ThemeModifier } from '../../core/theme-modifier'
import ThemeBall from './components/ThemeBall.vue'

const ThemeBallPlugin = (app: App, options: ThemeBallOptions = {}) => {
  const {
    prefix = '--el-',
    initialColor = '#409EFF',
    position = 'right',
    offset = 20,
  } = options

  app.component('ThemeBall', ThemeBall)

  // 设置主题前缀
  ThemeModifier.setPrefix(prefix)

  // 创建主题球实例
  const mountThemeBall = () => {
    const themeBallDiv = document.createElement('div')
    document.body.appendChild(themeBallDiv)

    const themeBallInstance = createApp(ThemeBall, {
      initialColor,
      position,
      offset,
      prefix,
    })
    themeBallInstance.mount(themeBallDiv)
  }

  if (document.readyState === 'complete') {
    mountThemeBall()
  } else {
    window.addEventListener('load', mountThemeBall)
  }
}

export { ThemeBallPlugin, ThemeBall }
