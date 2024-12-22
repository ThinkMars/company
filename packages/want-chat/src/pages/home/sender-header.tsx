import { CloudUploadOutlined } from '@ant-design/icons'
import { Attachments, Sender } from '@ant-design/x'
import { GetProp, UploadFile } from 'antd'
import { UploadChangeParam } from 'antd/es/upload/interface'

interface Props {
  headerOpen: boolean
  setHeaderOpen: (open: boolean) => void
  attachedFiles: GetProp<typeof Attachments, 'items'>
  handleFileChange: (info: UploadChangeParam<UploadFile<unknown>>) => void
}

const SenderHeader = ({
  headerOpen,
  setHeaderOpen,
  attachedFiles,
  handleFileChange,
}: Props) => {
  return (
    <Sender.Header
      title="附件"
      open={headerOpen}
      onOpenChange={setHeaderOpen}
      styles={{
        content: {
          padding: 0,
        },
      }}
    >
      <Attachments
        beforeUpload={() => false}
        items={attachedFiles}
        onChange={handleFileChange}
        placeholder={(type) =>
          type === 'drop'
            ? { title: '甩文件过来' }
            : {
                icon: <CloudUploadOutlined />,
                title: '上传文件',
                description: '点击或拖拽文件进行上传',
              }
        }
      />
    </Sender.Header>
  )
}

export default SenderHeader
