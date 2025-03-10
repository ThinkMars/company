import { useState } from 'react'
import UserTable, { UserTableType } from './components/UserTable'
import SearchForm, { FormField } from './components/SearchForm'
import { Space } from 'antd'

const UserListPage = () => {
  const [data, setData] = useState<UserTableType[]>([])

  const onSearch = (values: FormField) => {
    console.log('values: ', values)

    try {
      // 假设这里是调用接口的代码，返回的数据格式与UserTable的data格式一致
      const result = [
        {
          username: 'admin',
          roles: ['admin'],
          createTime: '2023-05-01',
        },
        {
          username: 'user',
          roles: ['normal'],
          createTime: '2023-05-02',
        },
      ]
      setData(result)
    } catch (error) {
      console.error('查询失败', error)
    }
  }

  return (
    <Space direction="vertical" size="middle" className="flex">
      <SearchForm onSearch={onSearch} />
      <UserTable data={data} />
    </Space>
  )
}

export default UserListPage
