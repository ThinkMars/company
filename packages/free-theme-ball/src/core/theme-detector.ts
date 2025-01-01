import Color from 'color'
import type { ThemeVariable } from './types'

export class ThemeDetector {
  private variables: ThemeVariable[] = []

  public detectVariables(
    element: HTMLElement = document.documentElement,
  ): ThemeVariable[] {
    const styles = getComputedStyle(element)
    this.variables = []

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

  public detectElementPlusVariables(): ThemeVariable[] {
    return this.variables.filter((v) => v.name.startsWith('--el-'))
  }

  private isColorValue(value: string): boolean {
    try {
      Color(value)
      return true
    } catch {
      return false
    }
  }
}
