import { EllipsisOutlined, ShareAltOutlined } from '@ant-design/icons'
import { type PromptProps, Prompts, Welcome } from '@ant-design/x'
import { Button, Space } from 'antd'
import { PromptsItem } from '../placeholder-prompts-items'

interface Props {
  placeholderPromptsItems: PromptsItem[]
  onPromptsItemClick: (info: { data: PromptProps }) => void
}

const PlaceholderNode = ({
  placeholderPromptsItems,
  onPromptsItemClick,
}: Props) => {
  return (
    <Space direction="vertical" size={16} style={{ paddingTop: '32px' }}>
      {/* 顶部欢迎语 */}
      <Welcome
        variant="borderless"
        icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
        title="你好，我是你的智能助手"
        description="基于Ant Design X的视觉解决方案"
        extra={
          <Space>
            <Button icon={<ShareAltOutlined />} />
            <Button icon={<EllipsisOutlined />} />
          </Space>
        }
      />

      {/* 提示词 */}
      <Prompts
        title="猜你想要问?"
        items={placeholderPromptsItems}
        styles={{
          list: {
            width: '100%',
          },
          item: {
            flex: 1,
          },
        }}
        onItemClick={onPromptsItemClick}
      />
    </Space>
  )
}

export default PlaceholderNode
