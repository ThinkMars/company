# Free Theme Ball

一个用于动态调整网站主题色的悬浮球组件，特别适用于 Element Plus 主题定制。

## 特性

- 🎨 实时预览主题色变化
- 🔄 支持调整色相、饱和度、亮度
- 💫 平滑的过渡动画
- 🎯 完美支持 Element Plus
- 📦 支持 ESM 和 CommonJS

## 安装

```bash
npm install free-theme-ball
```

## 使用

### Vue 3

```ts
import { createApp } from 'vue'
import { VueThemeBallPlugin } from 'free-theme-ball'
import App from './App.vue'
const app = createApp(App)
app.use(VueThemeBallPlugin)
app.mount('#app')
```

### 核心 API

如果你想自定义主题修改逻辑，可以直接使用核心 API：

```ts
import { ThemeDetector, ThemeModifier } from 'free-theme-ball'

// 检测当前主题变量
const detector = new ThemeDetector()
const variables = detector.detectVariables()

// 修改主题色
const newColor = ThemeModifier.adjustHue('#409EFF', 180)
const palette = ThemeModifier.generatePalette(newColor)
ThemeModifier.applyTheme(palette)
```

## API 文档

### ThemeDetector

用于检测和分析当前页面的 CSS 变量。

```ts
class ThemeDetector {
  // 检测所有 CSS 变量
  detectVariables(element?: HTMLElement): ThemeVariable[]
  // 仅检测 Element Plus 相关变量
  detectElementPlusVariables(): ThemeVariable[]
}
```

### ThemeModifier

提供主题色调整和应用的工具方法。

```ts
class ThemeModifier {
  // 调整色相 (-180 到 180)
  static adjustHue(color: string, amount: number): string
  // 调整饱和度 (-1 到 1)
  static adjustSaturation(color: string, amount: number): string
  // 调整亮度 (-1 到 1)
  static adjustLightness(color: string, amount: number): string
  // 生成主题色调色板
  static generatePalette(primaryColor: string): Record<string, string>
  // 应用主题变量
  static applyTheme(
    variables: Record<string, string>,
    element?: HTMLElement,
  ): void
}
```

## 浏览器支持

- Chrome >= 49
- Firefox >= 31
- Safari >= 9.1
- Edge >= 15

## 许可证

MIT License

## 贡献

欢迎提交 PR 和 Issue，共同完善这个项目。
