import styles from './AuthLayout.module.css'
import bgAuth from '../../../resources/images/medias/bgAuth.png'
import {getAppVersion} from '../../util/version.js'

const AuthLayout = (props) => {
  return (
    <div className={styles.authLayout}>
      <div className={styles.authLayoutContainer}>
        <div className={styles.authLayoutFormWrapper}>{props.children}</div>
        <div className={styles.authLayoutBackgroundWrapper}>
          <img src={bgAuth} className={styles.authLayoutBackground} alt="" />
        </div>
      </div>
      <div className="fixed bottom-2 right-2 text-xs text-gray-500">
        v{getAppVersion()}
      </div>
    </div>
  )
}

export default AuthLayout
