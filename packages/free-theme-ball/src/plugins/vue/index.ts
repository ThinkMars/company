import { type App, createApp } from 'vue'
import ThemeBall from './components/ThemeBall.vue'

export const ThemeBallPlugin = {
  install(app: App) {
    app.component('ThemeBall', ThemeBall)

    const mountThemeBall = () => {
      const themeBallDiv = document.createElement('div')
      document.body.appendChild(themeBallDiv)

      const themeBallInstance = createApp(ThemeBall)
      themeBallInstance.mount(themeBallDiv)
    }

    if (document.readyState === 'complete') {
      mountThemeBall()
    } else {
      window.addEventListener('load', mountThemeBall)
    }
  },
}

export default ThemeBallPlugin
