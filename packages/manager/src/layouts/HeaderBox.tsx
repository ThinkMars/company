// 用antd组件生成一个头部盒子，包含标题、头像、退出登录功能
import { ExclamationCircleFilled } from '@ant-design/icons'
import { Avatar, Dropdown, message, Modal } from 'antd'

const { confirm } = Modal

const showConfirm = () => {
  confirm({
    title: '确认退出登录吗?',
    icon: <ExclamationCircleFilled />,
    okText: '确认',
    cancelText: '取消',
    onOk() {
      message.success('退出成功')
    },
  })
}

const items = [
  {
    label: '退出登录',
    key: 'logout',
    onClick: showConfirm,
  },
]

const HeaderBox = () => {
  return (
    <div className="flex justify-between items-center h-50px px-4">
      <h1 className="text-xl font-bold">管理后台</h1>
      <Dropdown menu={{ items }}>
        <Avatar
          src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
          alt="头像"
        />
      </Dropdown>
    </div>
  )
}
export default HeaderBox
