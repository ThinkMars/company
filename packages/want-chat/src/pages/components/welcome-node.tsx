import { Welcome } from '@ant-design/x'
import { Space } from 'antd'

const PlaceholderNode = () => {
  return (
    <Space direction="vertical" size={16} style={{ paddingTop: '32px' }}>
      {/* 顶部欢迎语 */}
      <Welcome
        variant="borderless"
        icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
        title="你好，我是你的智能助手"
        description="有什么可以帮助你的吗？"
      />
    </Space>
  )
}

export default PlaceholderNode
