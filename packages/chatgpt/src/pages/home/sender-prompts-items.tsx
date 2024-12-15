import { FireOutlined, ReadOutlined } from '@ant-design/icons'
import { type Prompts } from '@ant-design/x'
import { type GetProp } from 'antd'

/**
 * 快速发送关键词
 */
export const senderPromptsItems: GetProp<typeof Prompts, 'items'> = [
  {
    key: '1',
    description: '热门提示词',
    icon: <FireOutlined style={{ color: '#FF4D4F' }} />,
  },
  {
    key: '2',
    description: '设计指导',
    icon: <ReadOutlined style={{ color: '#1890FF' }} />,
  },
]
