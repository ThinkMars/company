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
import UserNode from './nodes/user-node'

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
  assistant: {
    placement: 'start',
    typing: { step: 5, interval: 20 },
    avatar: {
      src: 'https://api.dicebear.com/7.x/bottts/svg?seed=ai', // AI头像
      style: { backgroundColor: '#f0f0f0' },
    },
    styles: {
      content: {
        borderRadius: 16,
      },
    },
  },
  user: {
    placement: 'end',
    variant: 'shadow',
    avatar: {
      src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user', // 用户头像
      style: { backgroundColor: '#f0f0f0' },
    },
  },
}

const Home: FC = () => {
  // ==================== Style ====================
  const { styles } = useStyle()

  // ==================== State ====================
  const [headerOpen, setHeaderOpen] = useState(false)

  const [inputContent, setInputContent] = useState('')

  const [conversationsItems, setConversationsItems] = useState(
    defaultConversationsItems,
  )

  const [activeConversationKey, setActiveConversationKey] = useState(
    defaultConversationsItems[0].key,
  )

  const [attachedFiles, setAttachedFiles] = useState<
    GetProp<typeof Attachments, 'items'>
  >([])

  // ==================== Runtime ====================
  const [agent] = useXAgent({
    request: async ({ message }, { onUpdate, onSuccess, onError }) => {
      try {
        const apiKey = sessionStorage.getItem('apiKey')
        let currentContent = ''

        const response = await fetch(`http://localhost:3000/want-chat/stream`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ message }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        // 立即显示一个空的回复
        onUpdate('')

        // 创建文本解码流
        const textStream = response.body!.pipeThrough(new TextDecoderStream())
        const reader = textStream.getReader()

        let buffer = ''
        const processChunk = async () => {
          const { done, value } = await reader.read()
          if (done) {
            onSuccess(currentContent)
            reader.releaseLock()
            return
          }

          buffer += value
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6)) as { content: string }
                if (data.content) {
                  currentContent += data.content
                  onUpdate(currentContent)
                }
              } catch (e) {
                console.warn('Failed to parse SSE data:', line, e)
              }
            }
          }

          // 递归处理下一个数据块
          await processChunk()
        }

        await processChunk()
      } catch (error) {
        console.error('Streaming error:', error)
        onError(error as Error)
      }
    },
  })

  const { onRequest, messages, setMessages } = useXChat({
    agent,
  })

  console.warn('messages: ', messages)

  useEffect(() => {
    if (activeConversationKey !== undefined) {
      setMessages([])
    }
  }, [activeConversationKey, setMessages])

  // ==================== Event ====================
  const onInputSubmit = (nextContent: string) => {
    if (!nextContent) return
    onRequest(nextContent)
    setInputContent('')
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
    setActiveConversationKey(`${conversationsItems.length}`)
  }

  /**
   * @description 切换会话
   */
  const onConversationClick: GetProp<typeof Conversations, 'onActiveChange'> = (
    key,
  ) => {
    setActiveConversationKey(key)
  }

  /**
   * @description 附件��
   */
  const handleFileChange: GetProp<typeof Attachments, 'onChange'> = (info) =>
    setAttachedFiles(info.fileList)

  // ==================== Nodes ====================
  const messageItems: GetProp<typeof Bubble.List, 'items'> = messages.map(
    ({ id, message, status }) => ({
      key: id,
      loading: status === 'loading',
      role: status === 'local' ? 'user' : 'assistant',
      content: message,
    }),
  )

  // ==================== Render =================
  return (
    <div className={styles.layout}>
      <div className={styles.menu}>
        <LogoNode />
        <Button
          onClick={onAddConversation}
          type="link"
          className={styles.addBtn}
          icon={<PlusOutlined />}
        >
          新建会话
        </Button>
        <Conversations
          items={conversationsItems}
          className={styles.conversations}
          activeKey={activeConversationKey}
          onActiveChange={onConversationClick}
        />
      </div>
      <div className={styles.chat}>
        <div className={styles.chatHeader}>
          <UserNode />
        </div>
        <Bubble.List
          items={
            messageItems.length > 0
              ? messageItems
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
        <Prompts items={senderPromptsItems} onItemClick={onPromptsItemClick} />
        <Sender
          value={inputContent}
          header={SenderHeader({
            headerOpen,
            setHeaderOpen,
            attachedFiles,
            handleFileChange,
          })}
          onSubmit={onInputSubmit}
          onChange={setInputContent}
          prefix={AttachmentsNode({ attachedFiles, headerOpen, setHeaderOpen })}
          loading={agent.isRequesting()}
          className={styles.sender}
        />
      </div>
    </div>
  )
}

export default Home
