/**
 * CSS 变量定义
 */
export interface ThemeVariable {
  /** 变量名称 */
  name: string
  /** 变量值 */
  value: string
  /** 变量类型 */
  type: 'color' | 'other'
}

/**
 * 主题球配置选项
 */
export interface ThemeBallOptions {
  /** 主题变量前缀，默认为 '--el-' */
  prefix?: string
  /** 初始主题色 */
  initialColor?: string
  /** 悬浮球位置 */
  position?: 'left' | 'right'
  /** 偏移距离 */
  offset?: number
}
