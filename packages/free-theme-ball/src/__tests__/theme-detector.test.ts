import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { ThemeDetector } from '../index'

describe('ThemeDetector', () => {
  let detector: ThemeDetector

  beforeEach(() => {
    detector = new ThemeDetector()
    const style = document.createElement('style')
    style.textContent = `
      :root {
        --el-color-primary: #409EFF;
        --el-text-color: #303133;
        --el-font-size: 14px;
        --custom-color: #ff0000;
      }
    `
    document.head.appendChild(style)
  })

  afterEach(() => {
    // 清理添加的样式
    const style = document.head.querySelector('style')
    if (style) {
      document.head.removeChild(style)
    }
  })

  it('应该能检测所有CSS变量', () => {
    const variables = detector.detectVariables()

    expect(variables).toContainEqual(
      expect.objectContaining({
        name: '--el-color-primary',
        value: '#409EFF',
        type: 'color',
      }),
    )

    expect(variables).toContainEqual(
      expect.objectContaining({
        name: '--el-font-size',
        value: '14px',
        type: 'other',
      }),
    )
  })

  it('应该能正确筛选Element Plus变量', () => {
    detector.detectVariables()
    const elVariables = detector.detectElementPlusVariables()

    expect(elVariables.every((v) => v.name.startsWith('--el-'))).toBe(true)
    expect(elVariables).toContainEqual(
      expect.objectContaining({
        name: '--el-color-primary',
        value: '#409EFF',
      }),
    )
    expect(elVariables).not.toContainEqual(
      expect.objectContaining({
        name: '--custom-color',
      }),
    )
  })
})
