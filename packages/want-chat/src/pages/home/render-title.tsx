import { Space } from 'antd'
import { type ReactElement } from 'react'

export const renderTitle = (icon: ReactElement, title: string) => (
  <Space align="start">
    {icon}
    <span>{title}</span>
  </Space>
)
