import { useEffect, useState, type FC, useRef, lazy, Suspense } from 'react'
import { Button, type GetProp, message, Modal } from 'antd'
import {
  Bubble,
  Conversations,
  type ConversationsProps,
  Sender,
  useXAgent,
  useXChat,
} from '@ant-design/x'
import { PlusOutlined, UserOutlined, DeleteOutlined } from '@ant-design/icons'

// Lazy load local components
const PlaceholderNode = lazy(() => import('../components/welcome-node'))
const LogoNode = lazy(() => import('../components/logo-node'))
const UserNode = lazy(() => import('../components/user-card'))
import markdownRender from '../components/markdown-render'

import { useStyle } from '../../../hooks/use-style'

// 添加消息类型定义
interface ChatMessage {
  id: string
  message: string
  status: 'loading' | 'local' | 'success' | 'error'
}

// 修改会话类型定义
interface Conversation {
  key: string
  label: string
  messages: ChatMessage[]
}
// ==================== Data ====================
const roles: GetProp<typeof Bubble.List, 'roles'> = {
  assistant: {
    placement: 'start',
    // typing: { step: 5, interval: 20 },
    avatar: {
      src: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp', // AI头像
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
      icon: <UserOutlined />, // 用户头像
      style: { backgroundColor: '#f0f0f0' },
      shape: 'circle',
      size: 'large',
    },
  },
}

const Home: FC = () => {
  // ==================== Style ====================
  const { styles } = useStyle()

  // ==================== State ====================
  const [isRequesting, setRequesting] = useState(false)

  const [inputContent, setInputContent] = useState('')

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      key: '0',
      label: '默认对话',
      messages: [],
    },
  ])

  const [activeConversationKey, setActiveConversationKey] = useState('0')

  // ==================== Runtime ====================
  const abortController = useRef<AbortController | null>(null)

  const [agent] = useXAgent({
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    request: async ({ message }, { onUpdate, onSuccess, onError }) => {
      try {
        const apiKey = sessionStorage.getItem('apiKey')
        let currentContent = ''

        abortController.current = new AbortController()
        setRequesting(true)

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/want-chat/stream`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({ message }),
            signal: abortController.current.signal,
          },
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        // 创建文本解码流
        const reader = response.body!.getReader()

        while (true) {
          const { done, value } = await reader.read()

          if (done) {
            onSuccess(currentContent)
            setRequesting(false)
            break
          }

          // 将 Uint8Array 转换为字符串
          const chunk = new TextDecoder().decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6)) as { content: string }
                if (data.content) {
                  currentContent += data.content
                  // 立即更新UI显示
                  onUpdate(currentContent)
                }
              } catch (e) {
                console.warn('Failed to parse SSE data:', line, e)
              }
            }
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('Request aborted')
          return
        }
        console.error('Streaming error:', error)
        onError(error as Error)
        setRequesting(false)
      } finally {
        abortController.current = null
      }
    },
  })

  // 使用 useXChat 时使用当前会话的消息
  const { onRequest, messages, setMessages } = useXChat({
    agent,
  })

  // 修改消息监听逻辑，添加错误处理
  useEffect(() => {
    if (messages.length > 0) {
      try {
        setConversations((prev) =>
          prev.map((conv) =>
            conv.key === activeConversationKey
              ? {
                  ...conv,
                  messages: messages.map((msg) => ({
                    id: String(msg.id),
                    message: msg.message,
                    status: msg.status,
                  })),
                }
              : conv,
          ),
        )
      } catch (error) {
        console.error('Failed to update conversation messages:', error)
      }
    }
  }, [messages, activeConversationKey])

  // ==================== Event ====================
  const onInputSubmit = (nextContent: string) => {
    if (!nextContent) return
    onRequest(nextContent)
    setInputContent('')
  }
  // 取消发送
  const onInputCancel = () => {
    if (abortController.current) {
      abortController.current.abort()
      abortController.current = null
    }
    setInputContent('')
    const failMessages = messages.slice(-1)
    failMessages.forEach((msg) => {
      msg.status = 'error'
      msg.message = '本次回答已被终止'
    })

    setMessages([...messages.slice(0, -1), ...failMessages])
    setRequesting(false)
  }

  /**
   * @description 添加会话
   */
  const onAddConversation = () => {
    const newKey = `${conversations.length}`
    setConversations([
      ...conversations,
      {
        key: newKey,
        label: `新对话 ${conversations.length}`,
        messages: [],
      },
    ])
    setActiveConversationKey(newKey)
    setMessages([]) // 清空当前显示的消息
  }

  /**
   * @description 切换会话
   */
  const onConversationClick: GetProp<typeof Conversations, 'onActiveChange'> = (
    key,
  ) => {
    try {
      setActiveConversationKey(key)
      const targetConvMessages =
        conversations.find((conv) => conv.key === key)?.messages ?? []
      setMessages(targetConvMessages)
    } catch (error) {
      console.error('Failed to switch conversation:', error)
      Modal.error({
        title: '切换失败',
        content: '切换会话时发生错误，请稍后重试。',
      })
    }
  }

  /**
   * @description 删除会话
   */
  const handleDeleteConversation = (key: string) => {
    if (key === '0') return // 不允许删除第一个对话

    try {
      setConversations((prev) => prev.filter((conv) => conv.key !== key))

      // 如果删除的是当前对话，切换到第一个对话
      if (key === activeConversationKey) {
        setActiveConversationKey('0')
        const firstConvMessages =
          conversations.find((conv) => conv.key === '0')?.messages ?? []
        setMessages(firstConvMessages)
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error)
      Modal.error({
        title: '删除失败',
        content: '删除会话时发生错误，请稍后重试。',
      })
    }
  }

  // ==================== Nodes ====================
  const messageItems: GetProp<typeof Bubble.List, 'items'> = messages.map(
    ({ id, message, status }) => ({
      key: id,
      loading: status === 'loading',
      role: status === 'local' ? 'user' : 'assistant',
      content: message,
      // although it's not a real typing, but it's a good way to show the loading state
      typing: { step: 2, interval: 50 },
      messageRender: markdownRender,
    }),
  )

  // 修改会话列表项的渲染
  const conversationsItems = conversations.map((conv) => ({
    key: conv.key,
    label: conv.label,
  }))

  // action menu
  const menuConfig: ConversationsProps['menu'] = (conversation) => ({
    items: [
      {
        label: '删除',
        key: conversation.key,
        icon: <DeleteOutlined />,
        danger: true,
      },
    ],
    onClick: (menuInfo) => {
      if (menuInfo.key === '0') {
        message.warning('默认对话无法删除')
        return
      }

      Modal.confirm({
        title: '确认删除',
        content: '确定要删除这个对话吗？删除后无法恢复。',
        okText: '确认',
        cancelText: '取消',
        okButtonProps: { danger: true },
        onOk: () => handleDeleteConversation(menuInfo.key),
      })
    },
  })

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
          menu={menuConfig}
          items={conversationsItems}
          className={styles.conversations}
          activeKey={activeConversationKey}
          onActiveChange={onConversationClick}
        />
      </div>
      <div className={styles.rightContent}>
        <div className={styles.chatHeader}>
          <UserNode />
        </div>
        <div className={styles.chat}>
          <Bubble.List
            items={
              messageItems.length > 0
                ? messageItems
                : [
                    {
                      content: (
                        <Suspense fallback={null}>
                          <PlaceholderNode />
                        </Suspense>
                      ),
                      variant: 'borderless',
                    },
                  ]
            }
            roles={roles}
            className={styles.messages}
          />
          <Sender
            value={inputContent}
            onSubmit={onInputSubmit}
            onCancel={onInputCancel}
            onChange={setInputContent}
            loading={isRequesting}
            className={styles.sender}
          />
        </div>
      </div>
    </div>
  )
}

export default Home
