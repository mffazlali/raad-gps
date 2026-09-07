import styles from './LogoImage.module.css'
import LazyImage from '../../../common/components/custom/dataDisplay/lazyImage.jsx'

// Lazy loaded image imports
const logoImageIcon = () => import('../../../resources/images/medias/logoIcon.svg')
const logoRaadIcon = () => import('../../../resources/images/medias/logoRaad.svg')

const LogoImage = () => {
  return (
    <div className={styles.logoImage}>
      <div className={styles.logoImageContainer}>
        <div className={styles.logoImageIconWrapper}>
          <LazyImage src={logoImageIcon} alt="" className={styles.logoImageIcon} />
        </div>
        <div className={styles.logoImageIconRaadWrapper}>
          <LazyImage src={logoRaadIcon} alt="" className={styles.logoImageIconRaad} />
        </div>
      </div>
    </div>
  )
}

export default LogoImage
