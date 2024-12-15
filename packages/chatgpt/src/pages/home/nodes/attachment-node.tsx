import { PaperClipOutlined } from '@ant-design/icons'
import { type Attachments } from '@ant-design/x'
import { Badge, Button, type GetProp } from 'antd'

interface Props {
  attachedFiles: GetProp<typeof Attachments, 'items'>
  setHeaderOpen: (open: boolean) => void
  headerOpen: boolean
}
// 附件
const AttachmentsNode = ({
  attachedFiles,
  headerOpen,
  setHeaderOpen,
}: Props) => {
  return (
    <Badge dot={attachedFiles.length > 0 && !headerOpen}>
      <Button
        type="text"
        icon={<PaperClipOutlined />}
        onClick={() => setHeaderOpen(!headerOpen)}
      />
    </Badge>
  )
}

export default AttachmentsNode
