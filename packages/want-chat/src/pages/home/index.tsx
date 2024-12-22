import {
  Attachments,
  Bubble,
  Conversations,
  Prompts,
  Sender,
  useXAgent,
  useXChat,
} from '@ant-design/x'
import { useEffect, useState, type FC } from 'react'

import { PlusOutlined } from '@ant-design/icons'
import { Button, type GetProp } from 'antd'

import { useStyle } from './use-style'
import { placeholderPromptsItems } from './placeholder-prompts-items'
import { senderPromptsItems } from './sender-prompts-items'
import PlaceholderNode from './nodes/placeholder-node'
import AttachmentsNode from './nodes/attachment-node'
import SenderHeader from './sender-header'
import LogoNode from './nodes/logo-node'

// ==================== Data ====================
/**
 * @description default conversations items, beside the window
 */
const defaultConversationsItems = [
  {
    key: '0',
    label: '对话',
  },
]

const roles: GetProp<typeof Bubble.List, 'roles'> = {
  ai: {
    placement: 'start',
    typing: { step: 5, interval: 20 },
    styles: {
      content: {
        borderRadius: 16,
      },
    },
  },
  local: {
    placement: 'end',
    variant: 'shadow',
  },
}

const Home: FC = () => {
  // ==================== Style ====================
  const { styles } = useStyle()

  // ==================== State ====================
  const [headerOpen, setHeaderOpen] = useState(false)

  const [content, setContent] = useState('')

  const [conversationsItems, setConversationsItems] = useState(
    defaultConversationsItems,
  )

  const [activeKey, setActiveKey] = useState(defaultConversationsItems[0].key)

  const [attachedFiles, setAttachedFiles] = useState<
    GetProp<typeof Attachments, 'items'>
  >([])

  // ==================== Runtime ====================
  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess }) => {
      console.log('message: ', message)
      // TODO: request to agent
      onSuccess(`模拟回复: ${message}`)
    },
  })

  const { onRequest, messages, setMessages } = useXChat({
    agent,
  })

  useEffect(() => {
    if (activeKey !== undefined) {
      setMessages([])
    }
  }, [activeKey, setMessages])

  // ==================== Event ====================
  const onSubmit = (nextContent: string) => {
    if (!nextContent) return
    onRequest(nextContent)
    setContent('')
  }

  const onPromptsItemClick: GetProp<typeof Prompts, 'onItemClick'> = (info) => {
    onRequest(info.data.description as string)
  }

  /**
   * @description 添加会话
   */
  const onAddConversation = () => {
    setConversationsItems([
      ...conversationsItems,
      {
        key: `${conversationsItems.length}`,
        label: `新对话 ${conversationsItems.length}`,
      },
    ])
    // 定位到最后一个
    setActiveKey(`${conversationsItems.length}`)
  }

  /**
   * @description 切换会话
   */
  const onConversationClick: GetProp<typeof Conversations, 'onActiveChange'> = (
    key,
  ) => {
    setActiveKey(key)
  }

  /**
   * @description 附件改变
   */
  const handleFileChange: GetProp<typeof Attachments, 'onChange'> = (info) =>
    setAttachedFiles(info.fileList)

  // ==================== Nodes ====================
  const items: GetProp<typeof Bubble.List, 'items'> = messages.map(
    ({ id, message, status }) => ({
      key: id,
      loading: status === 'loading',
      role: status === 'local' ? 'local' : 'ai',
      content: message,
    }),
  )

  // ==================== Render =================
  return (
    <div className={styles.layout}>
      <div className={styles.menu}>
        {/* 🌟 Logo */}
        <LogoNode />
        {/* 🌟 添加会话 */}
        <Button
          onClick={onAddConversation}
          type="link"
          className={styles.addBtn}
          icon={<PlusOutlined />}
        >
          新建会话
        </Button>
        {/* 🌟 会话管理 */}
        <Conversations
          items={conversationsItems}
          className={styles.conversations}
          activeKey={activeKey}
          onActiveChange={onConversationClick}
        />
      </div>
      <div className={styles.chat}>
        {/* 🌟 消息列表 */}
        <Bubble.List
          items={
            items.length > 0
              ? items
              : [
                  {
                    content: PlaceholderNode({
                      placeholderPromptsItems,
                      onPromptsItemClick,
                    }),
                    variant: 'borderless',
                  },
                ]
          }
          roles={roles}
          className={styles.messages}
        />
        {/* 🌟 提示词 */}
        <Prompts items={senderPromptsItems} onItemClick={onPromptsItemClick} />
        {/* 🌟 输入框 */}
        <Sender
          value={content}
          header={SenderHeader({
            headerOpen,
            setHeaderOpen,
            attachedFiles,
            handleFileChange,
          })}
          onSubmit={onSubmit}
          onChange={setContent}
          prefix={AttachmentsNode({ attachedFiles, headerOpen, setHeaderOpen })}
          loading={agent.isRequesting()}
          className={styles.sender}
        />
      </div>
    </div>
  )
}

export default Home
