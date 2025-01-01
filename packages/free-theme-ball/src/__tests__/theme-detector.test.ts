import { describe, it, expect } from 'vitest'
import { ThemeDetector } from '../core/theme-detector'

describe('ThemeDetector', () => {
  it('应该能检测到 CSS 变量', () => {
    document.documentElement.style.setProperty('--test-var1', '#ff0000')
    document.documentElement.style.setProperty('--test-var2', '16px')

    const detector = new ThemeDetector()
    const variables = detector.detectVariables()

    document.documentElement.style.removeProperty('--test-var1')
    document.documentElement.style.removeProperty('--test-var2')

    expect(variables.length).toBeGreaterThan(0)
    expect(variables.some((v) => v.name === '--test-var1')).toBe(true)
    expect(variables.some((v) => v.name === '--test-var2')).toBe(true)
  })

  it('应该能正确识别颜色变量', () => {
    document.documentElement.style.setProperty('--test-color', '#ff0000')
    document.documentElement.style.setProperty('--test-other', '12px')

    const detector = new ThemeDetector()
    const variables = detector.detectVariables()

    const colorVar = variables.find((v) => v.name === '--test-color')
    const otherVar = variables.find((v) => v.name === '--test-other')

    document.documentElement.style.removeProperty('--test-color')
    document.documentElement.style.removeProperty('--test-other')

    expect(colorVar?.type).toBe('color')
    expect(otherVar?.type).toBe('other')
  })

  it('应该能检测到 Element Plus 变量', () => {
    const detector = new ThemeDetector('--el-')
    document.documentElement.style.setProperty('--el-color-primary', '#409EFF')
    document.documentElement.style.setProperty('--el-font-size', '14px')
    document.documentElement.style.setProperty('--other-var', '#fff')

    const variables = detector.detectVariables()
    const elVariables = detector.detectThemeVariables()

    document.documentElement.style.removeProperty('--el-color-primary')
    document.documentElement.style.removeProperty('--el-font-size')
    document.documentElement.style.removeProperty('--other-var')

    expect(
      elVariables.every((v: { name: string }) => v.name.startsWith('--el-')),
    ).toBe(true)
    expect(elVariables.length).toBeLessThan(variables.length)
  })
})
