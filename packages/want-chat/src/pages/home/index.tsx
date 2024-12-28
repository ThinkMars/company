import {
  Attachments,
  Bubble,
  Conversations,
  ConversationsProps,
  Prompts,
  Sender,
  useXAgent,
  useXChat,
} from '@ant-design/x'
import { useEffect, useState, type FC } from 'react'

import { PlusOutlined, UserOutlined, DeleteOutlined } from '@ant-design/icons'
import { Button, type GetProp, message, Modal } from 'antd'

import { useStyle } from './use-style'
import { placeholderPromptsItems } from './placeholder-prompts-items'
import { senderPromptsItems } from './sender-prompts-items'
import PlaceholderNode from './nodes/placeholder-node'
import AttachmentsNode from './nodes/attachment-node'
import SenderHeader from './sender-header'
import LogoNode from './nodes/logo-node'
import UserNode from './nodes/user-node'

// ==================== Data ====================

const roles: GetProp<typeof Bubble.List, 'roles'> = {
  assistant: {
    placement: 'start',
    typing: { step: 5, interval: 20 },
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

const Home: FC = () => {
  // ==================== Style ====================
  const { styles } = useStyle()

  // ==================== State ====================
  const [headerOpen, setHeaderOpen] = useState(false)

  const [inputContent, setInputContent] = useState('')

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      key: '0',
      label: '默认对话',
      messages: [],
    },
  ])

  const [activeConversationKey, setActiveConversationKey] = useState('0')

  const [attachedFiles, setAttachedFiles] = useState<
    GetProp<typeof Attachments, 'items'>
  >([])

  // ==================== Runtime ====================
  const [agent] = useXAgent({
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
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

  const onPromptsItemClick: GetProp<typeof Prompts, 'onItemClick'> = (info) => {
    onRequest(info.data.description as string)
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
   * @description 附件
   */
  const handleFileChange: GetProp<typeof Attachments, 'onChange'> = (info) =>
    setAttachedFiles(info.fileList)

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
        label: conversation.label,
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
          <Prompts
            items={senderPromptsItems}
            onItemClick={onPromptsItemClick}
          />
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
            prefix={AttachmentsNode({
              attachedFiles,
              headerOpen,
              setHeaderOpen,
            })}
            loading={agent.isRequesting()}
            className={styles.sender}
          />
        </div>
      </div>
    </div>
  )
}

export default Home
