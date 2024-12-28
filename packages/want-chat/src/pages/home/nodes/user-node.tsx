import { UserOutlined } from '@ant-design/icons'
import { Avatar, Modal, Input, message } from 'antd'
import { useState, useEffect } from 'react'

const UserNode = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [apiKey, setApiKey] = useState('')

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

  return (
    <>
      <Avatar
        icon={<UserOutlined />}
        style={{ cursor: 'pointer' }}
        onClick={() => setIsModalOpen(true)}
      />

      <Modal
        title="设置 API Key"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
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
