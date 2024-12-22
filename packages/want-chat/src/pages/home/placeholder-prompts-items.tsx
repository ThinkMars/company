import { type GetProp } from 'antd'
import { renderTitle } from './render-title'
import { type Prompts } from '@ant-design/x'
import {
  CommentOutlined,
  FireOutlined,
  HeartOutlined,
  ReadOutlined,
  SmileOutlined,
} from '@ant-design/icons'

export type PromptsItem = GetProp<typeof Prompts, 'items'>[number]

/**
 * @description 推荐问题
 */
export const placeholderPromptsItems: PromptsItem[] = [
  {
    key: '1',
    label: renderTitle(
      <FireOutlined style={{ color: '#FF4D4F' }} />,
      'Hot Topics',
    ),
    description: '你最感兴趣的是什么？',
    children: [
      {
        key: '1-1',
        description: `今天吃什么?`,
      },
      {
        key: '1-2',
        description: `明天吃什么?`,
      },
      {
        key: '1-3',
        description: `后天吃什么?`,
      },
    ],
  },
  {
    key: '2',
    label: renderTitle(
      <ReadOutlined style={{ color: '#1890FF' }} />,
      'Design Guide',
    ),
    description: '如何设计一个产品?',
    children: [
      {
        key: '2-1',
        icon: <HeartOutlined />,
        description: `知道`,
      },
      {
        key: '2-2',
        icon: <SmileOutlined />,
        description: `设置`,
      },
      {
        key: '2-3',
        icon: <CommentOutlined />,
        description: `使用`,
      },
    ],
  },
]
