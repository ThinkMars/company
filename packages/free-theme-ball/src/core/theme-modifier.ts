import Color from 'color'

export class ThemeModifier {
  public static adjustHue(color: string, amount: number): string {
    return Color(color).rotate(amount).hex()
  }

  public static adjustSaturation(color: string, amount: number): string {
    return Color(color).saturate(amount).hex()
  }

  public static adjustLightness(color: string, amount: number): string {
    return Color(color).lighten(amount).hex()
  }

  public static generatePalette(primaryColor: string): Record<string, string> {
    const base = Color(primaryColor)
    return {
      primary: base.hex(),
      'primary-light-1': base.lighten(0.1).hex(),
      'primary-light-2': base.lighten(0.2).hex(),
      'primary-light-3': base.lighten(0.3).hex(),
      'primary-light-4': base.lighten(0.4).hex(),
      'primary-light-5': base.lighten(0.5).hex(),
      'primary-dark-1': base.darken(0.1).hex(),
      'primary-dark-2': base.darken(0.2).hex(),
    }
  }

  public static applyTheme(
    variables: Record<string, string>,
    element: HTMLElement = document.documentElement,
  ): void {
    Object.entries(variables).forEach(([name, value]) => {
      element.style.setProperty(`--el-${name}`, value)
    })
  }
}
