export interface PresetColor {
  name: string
  value: string
}

export interface PresetCategory {
  name: string
  colors: PresetColor[]
}

export const leftThemes: PresetCategory[] = [
  {
    name: '科技',
    colors: [
      { name: '科技蓝', value: '#1890FF' }, // Ant Design 默认主题色
      { name: '极光绿', value: '#13C2C2' }, // 清新科技感
      { name: '极客紫', value: '#722ED1' }, // 创新感
    ],
  },
  {
    name: '商务',
    colors: [
      { name: '商务蓝', value: '#0052CC' }, // Atlassian 主题色
      { name: '稳重灰', value: '#454D64' }, // 专业感
      { name: '深邃蓝', value: '#003A8C' }, // 可信赖感
    ],
  },
]

export const rightThemes: PresetCategory[] = [
  {
    name: '生活',
    colors: [
      { name: '活力橙', value: '#FA8C16' }, // 活力四射
      { name: '自然绿', value: '#52C41A' }, // 生机盎然
      { name: '温暖粉', value: '#F5317F' }, // 亲和力
    ],
  },
  {
    name: '创意',
    colors: [
      { name: '珊瑚红', value: '#FF5A5A' }, // 创意活力
      { name: '薄荷绿', value: '#14C9C9' }, // 清新文艺
      { name: '梦幻紫', value: '#9254DE' }, // 想象力
    ],
  },
]
