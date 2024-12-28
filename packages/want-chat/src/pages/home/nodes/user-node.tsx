import { UserOutlined } from '@ant-design/icons'
import { Avatar, Modal, Input, message, Card, Switch, Popover } from 'antd'
import { useState, useEffect } from 'react'
import { useTheme, createStyles } from 'antd-style'

// 样式定义
const useStyles = createStyles(({ token, css }) => ({
  card: css`
    background: ${token.colorBgElevated};
    border-radius: ${token.borderRadius}px;
    box-shadow: ${token.boxShadowSecondary};
    width: 240px;

    // 亮色主题
    [data-theme='light'] & {
      background: rgba(230, 247, 255, 0.8);
    }

    // 暗色主题
    [data-theme='dark'] & {
      background: rgba(0, 0, 0, 0.45);
    }
  `,
  header: css`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border-bottom: 1px solid ${token.colorBorderSecondary};

    // 亮色主题
    [data-theme='light'] & {
      background: rgba(230, 247, 255, 0.6);
      border-bottom-color: rgba(5, 145, 255, 0.1);
    }

    // 暗色主题
    [data-theme='dark'] & {
      background: rgba(255, 255, 255, 0.04);
      border-bottom-color: rgba(255, 255, 255, 0.08);
    }
  `,
  content: css`
    padding: 12px 16px;

    // 亮色主题
    [data-theme='light'] & {
      background: rgba(230, 247, 255, 0.3);
    }

    // 暗色主题
    [data-theme='dark'] & {
      background: rgba(255, 255, 255, 0.02);
    }
  `,
  item: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    cursor: pointer;
    color: ${token.colorText};

    &:hover {
      color: ${token.colorPrimary};
      margin: 0 -16px;
      padding: 8px 16px;
      transition: all 0.3s;

      // 亮色主题
      [data-theme='light'] & {
        background: rgba(230, 247, 255, 0.4);
      }

      // 暗色主题
      [data-theme='dark'] & {
        background: rgba(255, 255, 255, 0.08);
      }
    }
  `,
  status: css`
    font-size: 12px;
    color: ${token.colorTextSecondary};
  `,
}))

const UserNode = () => {
  const { styles } = useStyles()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const { themeMode, setThemeMode } = useTheme()
  const [username] = useState(() => `User${Math.floor(Math.random() * 1000)}`) // 随机用户名

  useEffect(() => {
    const savedKey = sessionStorage.getItem('apiKey')
    if (savedKey) {
      setApiKey(savedKey)
    }
  }, [])

  const handleOk = () => {
    if (apiKey.trim()) {
      sessionStorage.setItem('apiKey', apiKey)
      message.success('API Key 保存成功')
      setIsModalOpen(false)
    } else {
      message.error('请输入有效的 API Key')
    }
  }

  const handleThemeChange = (checked: boolean) => {
    setThemeMode(checked ? 'dark' : 'light')
  }

  const userCard = (
    <Card className={styles.card} bordered={false}>
      <div className={styles.header}>
        <Avatar
          size="large"
          icon={<UserOutlined />}
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
        />
        <div>
          <div style={{ fontWeight: 500 }}>{username}</div>
          <div className={styles.status}>{apiKey ? '已登录' : '未登录'}</div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.item} onClick={() => setIsModalOpen(true)}>
          <span>设置 API Key</span>
        </div>
        <div className={styles.item}>
          <span>暗色主题</span>
          <Switch
            checked={themeMode === 'dark'}
            onChange={handleThemeChange}
            size="small"
          />
        </div>
      </div>
    </Card>
  )

  return (
    <>
      <Popover
        content={userCard}
        trigger="hover"
        placement="bottomRight"
        arrow={{ pointAtCenter: true }}
        overlayInnerStyle={{ padding: 0 }}
      >
        <div style={{ display: 'inline-block' }}>
          <Avatar
            icon={<UserOutlined />}
            style={{ cursor: 'pointer' }}
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
          />
        </div>
      </Popover>

      <Modal
        title="设置 API Key"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        styles={{
          mask: {
            backgroundColor: 'rgba(0,0,0,0.45)',
          },
        }}
        style={{ top: '30%' }}
        width={400}
      >
        <Input.Password
          placeholder="请输入您的 API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </Modal>
    </>
  )
}

export default UserNode
