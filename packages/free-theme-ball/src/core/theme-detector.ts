import { colord } from 'colord'
import type { ThemeVariable } from './types'

/**
 * 主题变量检测器
 * 用于检测和分析当前页面中的 CSS 变量
 */
export class ThemeDetector {
  /** 存储检测到的 CSS 变量 */
  private variables: ThemeVariable[] = []
  /** 主题变量前缀 */
  private prefix: string

  constructor(prefix: string = '--el-') {
    this.prefix = prefix
  }

  /**
   * 获取当前主题变量前缀
   * @returns 主题变量前缀
   */
  public getPrefix(): string {
    return this.prefix
  }

  /**
   * 检测指定元素上的所有 CSS 变量
   * @param element - 要检测的 DOM 元素，默认为 document.documentElement
   * @returns 检测到的 CSS 变量数组
   */
  public detectVariables(
    element: HTMLElement = document.documentElement,
  ): ThemeVariable[] {
    const styles = getComputedStyle(element)
    this.variables = []

    // 解析所有 CSS 变量
    const cssProps = styles.cssText.split(';')
    cssProps.forEach((prop) => {
      const match = prop.match(/--[\w-]+/)
      if (match) {
        const name = match[0]
        const value = styles.getPropertyValue(name).trim()
        this.variables.push({
          name,
          value,
          type: this.isColorValue(value) ? 'color' : 'other',
        })
      }
    })

    return this.variables
  }

  /**
   * 筛选出指定前缀的主题变量
   * @returns 符合前缀的 CSS 变量数组
   */
  public detectThemeVariables(): ThemeVariable[] {
    return this.variables.filter((v) => v.name.startsWith(this.prefix))
  }

  /**
   * 判断一个值是否为有效的颜色值
   * @param value - 要检测的值
   * @returns 是否为颜色值
   */
  private isColorValue(value: string): boolean {
    return colord(value).isValid()
  }
}
