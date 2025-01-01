import { colord } from 'colord'

/**
 * 主题修改器
 * 提供颜色调整和主题应用的工具方法
 */
export class ThemeModifier {
  /** 主题变量前缀 */
  private static prefix: string = '--el-'

  /**
   * 设置主题变量前缀
   * @param prefix - 变量前缀
   */
  public static setPrefix(prefix: string): void {
    ThemeModifier.prefix = prefix
  }

  /**
   * 调整颜色的色相
   * @param color - 原始颜色
   * @param amount - 调整量（-180 到 180）
   * @returns 调整后的颜色
   */
  public static adjustHue(color: string, amount: number): string {
    return colord(color).rotate(amount).toHex()
  }

  /**
   * 调整颜色的饱和度
   * @param color - 原始颜色
   * @param amount - 调整量（-1 到 1）
   * @returns 调整后的颜色
   */
  public static adjustSaturation(color: string, amount: number): string {
    const c = colord(color)
    return amount > 0
      ? c.saturate(amount).toHex()
      : c.desaturate(Math.abs(amount)).toHex()
  }

  /**
   * 调整颜色的亮度
   * @param color - 原始颜色
   * @param amount - 调整量（-1 到 1）
   * @returns 调整后的颜色
   */
  public static adjustLightness(color: string, amount: number): string {
    const c = colord(color)
    return amount > 0
      ? c.lighten(amount).toHex()
      : c.darken(Math.abs(amount)).toHex()
  }

  /**
   * 生成主题色调色板
   * @param primaryColor - 主题基色
   * @returns 包含不同深浅度的颜色对象
   */
  public static generatePalette(primaryColor: string): Record<string, string> {
    const base = colord(primaryColor)
    return {
      'color-primary': base.toHex(),
      'color-primary-light-1': base.lighten(0.1).toHex(),
      'color-primary-light-2': base.lighten(0.2).toHex(),
      'color-primary-light-3': base.lighten(0.3).toHex(),
      'color-primary-light-4': base.lighten(0.4).toHex(),
      'color-primary-light-5': base.lighten(0.5).toHex(),
      'color-primary-dark-1': base.darken(0.1).toHex(),
      'color-primary-dark-2': base.darken(0.2).toHex(),
    }
  }

  /**
   * 将主题变量应用到 DOM 元素
   * @param variables - 要应用的变量对象
   * @param element - 目标 DOM 元素，默认为 document.documentElement
   */
  public static applyTheme(
    variables: Record<string, string>,
    element: HTMLElement = document.documentElement,
  ): void {
    Object.entries(variables).forEach(([name, value]) => {
      element.style.setProperty(`${ThemeModifier.prefix}${name}`, value)
    })
  }
}
