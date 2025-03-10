import { Menu, MenuProps } from 'antd'
import { HomeOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

type MenuItem = Required<MenuProps>['items'][number]

// 配置菜单项
const menuItems: MenuItem[] = [
  {
    label: '首页',
    key: 'home',
    icon: <HomeOutlined />,
  },
  {
    label: '用户管理',
    key: 'userList',
    icon: <UserOutlined />,
  },
  {
    label: '权限设置',
    key: 'userPermission',
    icon: <SettingOutlined />,
  },
]

const LeftMenu: React.FC = () => {
  const navigate = useNavigate()

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('e: ', e)
    void navigate(e.key)
  }
  return (
    <Menu
      mode="inline"
      theme="dark"
      defaultOpenKeys={['home']}
      style={{ height: '100%', borderRight: 0 }}
      items={menuItems}
      onSelect={onClick}
    ></Menu>
  )
}

export default LeftMenu
