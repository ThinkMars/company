import { useStyle } from '../../../hooks/use-style'

const LogoNode = () => {
  const { styles } = useStyle()

  return (
    <div className={styles.logo}>
      <img
        src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
        alt="logo"
      />
      <span>Want Chat</span>
    </div>
  )
}

export default LogoNode
