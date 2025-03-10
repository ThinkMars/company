import CardBox from '@/components/wrapper/card-box'
import { Button, Form, Input, Select, Space } from 'antd'

export interface FormField {
  username: string
  roles: string[]
}

const SearchForm = ({
  onSearch,
}: {
  onSearch: (values: FormField) => void
}) => {
  const [form] = Form.useForm()

  const onFinish = (values: FormField) => {
    onSearch(values)
    form.resetFields()
  }

  return (
    <CardBox>
      <Form form={form} onFinish={onFinish} layout="inline">
        <Form.Item name="username" label="用户名">
          <Input />
        </Form.Item>
        <Form.Item name="roles" label="角色">
          <Select
            mode="multiple"
            style={{ width: '200px' }}
            options={[
              { label: '管理员', value: 'admin' },
              { label: '普通用户', value: 'normal' },
            ]}
          />
        </Form.Item>
        <Form.Item>
          <Space size="middle">
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button onClick={() => form.resetFields()}>重置</Button>
            <Button type="primary" onClick={() => console.log('新增用户')}>
              新增用户
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </CardBox>
  )
}

export default SearchForm
