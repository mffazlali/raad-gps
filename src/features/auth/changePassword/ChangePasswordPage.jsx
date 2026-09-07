import styles from './ChangePasswordPage.module.css'
import { useNavigate } from 'react-router-dom'
import cls from 'classnames'
import logoIcon from '../../../resources/images/medias/logoIcon.svg'
import { Link } from 'react-router-dom'
import AuthLayout from '../../../common/layouts/authLayout/AuthLayout.jsx'
import LogoImage from '../logoImage/LogoImage.jsx'

const ChangePasswordPage = () => {
  const navigate = useNavigate()

  const handlePasswordLogin = () => {
    navigate('/')
  }

  return (
    <AuthLayout>
      <div className={styles.changePasswordForm}>
        <div className={styles.subjectWrapper}>
          <div className={styles.subject}>
            <div className={styles.logoWrapper}>
              <LogoImage />
            </div>
            <div className={styles.helpWrapper}>
              <div className={styles.help}>فراموشی رمز عبور</div>
            </div>
            <div className={styles.sloganWrapper}>
              <div className={styles.slogan}>رمز عبور جدید را وارد کنید</div>
            </div>
          </div>
        </div>
        <div className={styles.formWrapper}>
          <div className={styles.form}>
            <div className={styles.groupWrapper}>
              <div className={styles.group}>
                <div className={styles.labelWrapper}>
                  <div className={styles.label}>
                    رمز عبور<span>*</span>
                  </div>
                </div>
                <div className={styles.inputWrapper}>
                  <input type="password" className={styles.input} name="name" />
                </div>
              </div>
            </div>
            <ul className={styles.hintWrapper}>
              <li className={styles.hint}>استفاده از حروف بزرگ</li>
              <li className={styles.hint}>استفاده از حروف کوچک</li>
              <li className={styles.hint}>
                <span>استفاده از علائم خاص</span>
              </li>
              <li className={styles.hint}>ترکیب حروف و عدد</li>
              <li className={styles.hint}>بیشتر از ۸ کاراکتر</li>
            </ul>
            <div className={styles.buttonWrapper}>
              <button
                onClick={() => handlePasswordLogin()}
                type="button"
                className={cls(
                  styles.button,
                  'btn-primary'
                )}>
                <span>ثبت و ورود</span>
              </button>
            </div>
          </div>
        </div>
        <div className={styles.forwardLinkWrapper}>
          <Link to={'/login'} className={styles.forwardLink}>
            بازگشت به صفحه ورود
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}

export default ChangePasswordPage
