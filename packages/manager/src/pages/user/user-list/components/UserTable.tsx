import CardBox from '@/components/wrapper/card-box'
import { Button, Space, Table } from 'antd'

export interface UserTableType {
  username: string
  roles: string[]
  createTime: string
}

const UserTable = ({ data }: { data: UserTableType[] }) => {
  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '角色',
      dataIndex: 'roles',
      key: 'roles',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: UserTableType) => (
        <Space size="middle">
          <Button type="link" onClick={() => console.log(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => console.log(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <CardBox>
      <Table pagination={false} columns={columns} dataSource={data} />
    </CardBox>
  )
}

export default UserTable
