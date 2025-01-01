import { describe, it, expect } from 'vitest'
import { ThemeModifier } from '../index'
import { colord } from 'colord'

describe('ThemeModifier', () => {
  const baseColor = '#409EFF'

  it('应该能正确调整色相', () => {
    const amount = 180
    const adjusted = ThemeModifier.adjustHue(baseColor, amount)
    const originalHue = colord(baseColor).hue()
    const newHue = colord(adjusted).hue()

    const expectedHue = (originalHue + amount) % 360
    expect(newHue).toBe(expectedHue)
  })

  it('应该能正确调整饱和度', () => {
    const testColor = '#7f7f7f'
    const amount = 0.5
    const adjusted = ThemeModifier.adjustSaturation(testColor, amount)
    const originalSaturation = colord(testColor).toHsl().s
    const newSaturation = colord(adjusted).toHsl().s

    expect(newSaturation).toBeGreaterThan(originalSaturation)

    const reduced = ThemeModifier.adjustSaturation(baseColor, -0.5)
    const reducedSaturation = colord(reduced).toHsl().s
    const baseSaturation = colord(baseColor).toHsl().s

    expect(reducedSaturation).toBeLessThan(baseSaturation)
  })

  it('应该能正确调整亮度', () => {
    const amount = 0.2
    const adjusted = ThemeModifier.adjustLightness(baseColor, amount)
    const originalLightness = colord(baseColor).toHsl().l
    const newLightness = colord(adjusted).toHsl().l

    expect(newLightness).toBeGreaterThan(originalLightness)
  })

  it('应该能生成调色板', () => {
    const palette = ThemeModifier.generatePalette(baseColor)

    expect(palette).toHaveProperty('color-primary', colord(baseColor).toHex())
    expect(palette).toHaveProperty('color-primary-light-1')
    expect(palette).toHaveProperty('color-primary-light-2')
    expect(palette).toHaveProperty('color-primary-light-3')
    expect(palette).toHaveProperty('color-primary-light-4')
    expect(palette).toHaveProperty('color-primary-light-5')
    expect(palette).toHaveProperty('color-primary-dark-1')
    expect(palette).toHaveProperty('color-primary-dark-2')

    const light1 = colord(palette['color-primary-light-1']).toHsl().l
    const light2 = colord(palette['color-primary-light-2']).toHsl().l
    expect(light2).toBeGreaterThan(light1)
  })

  it('应该能应用主题到DOM元素', () => {
    const element = document.createElement('div')
    const variables = {
      'color-primary': baseColor,
      'color-primary-light': '#66b1ff',
    }

    ThemeModifier.applyTheme(variables, element)

    expect(element.style.getPropertyValue('--el-color-primary')).toBe(baseColor)
    expect(element.style.getPropertyValue('--el-color-primary-light')).toBe(
      '#66b1ff',
    )
  })
})
