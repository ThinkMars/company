interface MyButtonProps {
  /**
   * 按钮标题
   */
  title: string
  /**
   * 按钮样式
   * */
  className?: string
  /**
   * 点击事件
   * */
  onButtonClick?: () => void
}

export default function MyButton({
  title,
  className,
  onButtonClick,
}: MyButtonProps) {
  return (
    <button
      className={className}
      style={{ outline: 'none' }}
      onClick={onButtonClick}
    >
      {title}
    </button>
  )
}
