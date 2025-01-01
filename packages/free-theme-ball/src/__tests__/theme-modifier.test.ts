import { describe, it, expect } from 'vitest'
import { ThemeModifier } from '../index'

describe('ThemeModifier', () => {
  it('应该能正确调整色相', () => {
    const color = '#409EFF'
    const adjusted = ThemeModifier.adjustHue(color, 180)
    expect(adjusted).not.toBe(color)
  })

  it('应该能正确调整饱和度', () => {
    const color = '#409EFF'
    const adjusted = ThemeModifier.adjustSaturation(color, 0.5)
    expect(adjusted).not.toBe(color)
  })

  it('应该能正确调整亮度', () => {
    const color = '#409EFF'
    const adjusted = ThemeModifier.adjustLightness(color, 0.2)
    expect(adjusted).not.toBe(color)
  })

  it('应该能生成调色板', () => {
    const primaryColor = '#409EFF'
    const palette = ThemeModifier.generatePalette(primaryColor)

    expect(palette).toHaveProperty('primary', primaryColor)
    expect(palette).toHaveProperty('primary-light-1')
    expect(palette).toHaveProperty('primary-light-2')
    expect(palette).toHaveProperty('primary-dark-1')
    expect(palette).toHaveProperty('primary-dark-2')
  })

  it('应该能应用主题到DOM元素', () => {
    const element = document.createElement('div')
    const variables = {
      primary: '#409EFF',
      'primary-light': '#66b1ff',
    }

    ThemeModifier.applyTheme(variables, element)

    expect(element.style.getPropertyValue('--el-primary')).toBe('#409EFF')
    expect(element.style.getPropertyValue('--el-primary-light')).toBe('#66b1ff')
  })
})
