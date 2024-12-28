import { useStyle } from '../use-style'

const LogoNode = () => {
  const { styles } = useStyle()

  return (
    <div className={styles.logo}>
      <span>Want Chat</span>
    </div>
  )
}

export default LogoNode
