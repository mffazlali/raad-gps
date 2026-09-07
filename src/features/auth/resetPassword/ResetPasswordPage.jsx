import styles from './ResetPasswordPage.module.css'
import { useNavigate } from 'react-router-dom'
import cls from 'classnames'
import logoIcon from '../../../resources/images/medias/logoIcon.svg'
import { Link } from 'react-router-dom'
import AuthLayout from '../../../common/layouts/authLayout/AuthLayout.jsx'
import LogoImage from '../logoImage/LogoImage.jsx'

const ResetPasswordPage = () => {
  const navigate = useNavigate()

  const handlePasswordLogin = () => {
    navigate('/')
  }

  return (
    <AuthLayout>
      <div className={styles.resetPasswordForm}>
        <div className={styles.subjectWrapper}>
          <div className={styles.subject}>
            <div className={styles.logoWrapper}>
              <LogoImage />
            </div>
            <div className={styles.helpWrapper}>
              <div className={styles.help}>فراموشی رمز عبور</div>
            </div>
            <div className={styles.sloganWrapper}>
              <div className={styles.slogan}>
                ایمیل خود را برای دریافت لینک بازنشانی رمز عبور وارد کنید
              </div>
            </div>
          </div>
        </div>
        <div className={styles.formWrapper}>
          <div className={styles.form}>
            <div className={styles.groupWrapper}>
              <div className={styles.group}>
                <div className={styles.labelWrapper}>
                  <div className={styles.label}>
                    ایمیل<span>*</span>
                  </div>
                </div>
                <div className={styles.inputWrapper}>
                  <input type="email" className={styles.input} name="name" />
                </div>
              </div>
            </div>
            <div className={styles.buttonWrapper}>
              <button
                onClick={() => handlePasswordLogin()}
                type="button"
                className={cls(
                  styles.button,
                  'btn-primary'
                )}>
                <span>ارسال لینک</span>
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

export default ResetPasswordPage
