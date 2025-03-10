import React, { useState } from 'react'
import { Layout, theme } from 'antd'
import { Outlet } from 'react-router-dom'
import HeaderBox from './HeaderBox'
import LeftMenu from './LeftMenu'

const { Header, Content, Sider } = Layout

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)

  const {
    token: { colorBgContainer },
  } = theme.useToken()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <LeftMenu />
      </Sider>
      <Layout>
        <Header
          style={{ padding: 0, background: colorBgContainer, height: '50px' }}
        >
          <HeaderBox />
        </Header>
        <Content className="m-16px">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
