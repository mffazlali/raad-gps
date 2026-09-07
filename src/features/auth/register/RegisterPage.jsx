import styles from './RegisterPage.module.css'
import cls from 'classnames'
import {Link, useNavigate} from 'react-router-dom'
import AuthLayout from '../../../common/layouts/authLayout/AuthLayout.jsx'
import LogoImage from '../logoImage/LogoImage.jsx'
import {useTranslation} from '../../../common/components/LocalizationProvider.jsx'
import {useCatch, useEffectAsync} from '../../../common/util/reactHelper.js'
import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useMetaTags} from '../../../common/util/useMetaTags.js'
import useMessage from '../../../common/util/useMessage'
import useForm from '../../../common/util/useForm'
import useConnectChecker from '../../../common/util/useConnectChecker'
import {NETWORK_RESPONSE} from '../../../common/util/constants.js'
import axios from 'axios'
import axiosInstance from '../../../common/util/axiosConfig'

const RegisterPage = () => {
  const [meta, setMeta] = useMetaTags({title: 'راد: ثبت نام', description: 'login user'})
  const {contextHolder, showMessage} = useMessage()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const t = useTranslation()
  const server = useSelector((state) => state.session.server)
  const totpForce = useSelector((state) => state.session.server?.attributes?.totpForce)
  const [totpKey, setTotpKey] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const online = useConnectChecker()
  const [errorMessage, setErrorMessage] = useState('')


  useEffectAsync(async () => {
    if (totpForce) {
      try {
        const response = await axiosInstance.post('/api/users/totp')
        if (response.status === 200) {
          const res = response.data
          setTotpKey(res)
          await form.setFieldValue('totpKey', res)
        }
      } catch (error) {
        throw Error(error.response?.data || error.message)
      }
    }
  }, [totpForce, setTotpKey])

  useEffect(() => {
    if (online) {
      setErrorMessage('')
    } else {
      setErrorMessage('اتصال اینترنت برقرار نیست')
    }
  }, [online])

  const registerForm = useCatch(async (data) => {
    setErrorMessage('')
    try {
      const response = await axiosInstance.post('/api/users', data)
      if (response.status === 200) {
        setSnackbarOpen(true)
        navigate('/login')
      } else {
        setErrorMessage(NETWORK_RESPONSE.responseWarningAPI)
      }
    } catch (e) {
      setErrorMessage(e?.response?.data?.message)
      // setErrorMessage(NETWORK_RESPONSE.responseErrorAPI)
    }
  })

  const {form} = useForm({
    formGroup: {
      'name': {
        value: '',
        validations: [{'required': 'وارد کردن نام الزامی است'}],
      },
      'password': {
        value: '', validations: [{
          'required': 'وارد کردن رمز عبور الزامی است',
          'password': 'رمز عبور معتبر نمی باشد',
        }],
      },
      'email': {
        value: '', validations: [{
          'required': 'وارد کردن ایمیل الزامی است',
          'email': 'ایمیل معتبر نمی باشد',
        }],
      },
      'totpKey': {value: '', validations: []},
      // 'date': {value: '1402-11-04T01:00:57-08:00', validations: []},
    },
    handleSubmit: registerForm,
  })

  useEffect(() => {
    if (!form.isValid || form.dirty) {
      setErrorMessage('')
    }
  }, [form.isValid, form.dirty])

  return (
    <>
      {contextHolder}
      <AuthLayout>
        <form onSubmit={form.handleSubmit} className={styles.registerPageForm}>
          <div className={styles.subjectWrapper}>
            <div className={styles.subject}>
              <div className={styles.logoWrapper}>
                <LogoImage />
              </div>
              <div className={styles.helpWrapper}>
                <div className={styles.help}>ثبت‌نام کنید</div>
              </div>
              <div className={styles.sloganWrapper}>
                <h2 className={styles.slogan}>
                  {(!online || (form.isValid || !form.dirty)) ? errorMessage !== '' ?
                      <span className={styles.sloganError}>{errorMessage}</span> :
                      <span>اطلاعات کاربری خود را ثبت کنید</span> :
                    <span
                      className={styles.sloganError}>{form.errors.name ? 'نام وارد نشده است' : 'ایمیل یا رمز عبور معتبر نیست'}</span>}
                </h2>
              </div>
            </div>
          </div>
          <div className={styles.formWrapper}>
            <div className={styles.form}>
              <div className={styles.groupWrapper}>
                <div className={styles.group}>
                  <div className={styles.labelWrapper}>
                    <div className={cls(styles.label)}>
                      نام<span>*</span>
                    </div>
                  </div>
                  <div className={styles.inputWrapper}>
                    <input type="text" className={styles.input} name="name" onChange={form.handleChange}
                           onBlur={form.handleBlur}
                           value={form.values.name ?? ''}
                           maxLength="50"
                    />

                  </div>
                </div>
                <div className={styles.group}>
                  <div className={styles.labelWrapper}>
                    <div className={cls(styles.label)}>
                      ایمیل<span>*</span>
                    </div>
                  </div>
                  <div className={styles.inputWrapper}>
                    <input type="email" className={styles.input} name="email"
                           onChange={form.handleChange}
                           onBlur={form.handleBlur}
                           value={form.values.email ?? ''} />
                  </div>
                </div>
                <div className={styles.group}>
                  <div className={styles.labelWrapper}>
                    <div
                      className={cls(styles.label)}>
                      رمز عبور<span>*</span>
                    </div>
                  </div>
                  <div className={styles.inputWrapper}>
                    <input type="password" className={styles.input} name="password"
                           onChange={form.handleChange}
                           onBlur={form.handleBlur}
                           value={form.values.password ?? ''}
                           maxLength="20"
                    />

                  </div>
                </div>
              </div>
              {form.values.password != null && <ul className={styles.hintWrapper}>
                <li
                  className={cls(styles.hint, (Array.isArray(form.errors?.password) && form.errors?.password?.includes('uppercase')) || (!Array.isArray(form.errors?.password) && Object.hasOwn(form.errors, 'password')) ? styles.hintError : styles.hintSuccess)}>استفاده
                  از
                  حروف بزرگ
                </li>
                <li
                  className={cls(styles.hint, (Array.isArray(form.errors?.password) && form.errors?.password?.includes('lowercase')) || (!Array.isArray(form.errors?.password) && Object.hasOwn(form.errors, 'password')) ? styles.hintError : styles.hintSuccess)}>استفاده
                  از
                  حروف کوچک
                </li>
                <li
                  className={cls(styles.hint, (Array.isArray(form.errors?.password) && form.errors?.password?.includes('special')) || (!Array.isArray(form.errors?.password) && Object.hasOwn(form.errors, 'password')) ? styles.hintError : styles.hintSuccess)}>
                  استفاده از علائم خاص
                </li>
                <li
                  className={cls(styles.hint, (Array.isArray(form.errors?.password) && form.errors?.password?.includes('text')) || (!Array.isArray(form.errors?.password) && Object.hasOwn(form.errors, 'password')) ? styles.hintError : styles.hintSuccess)}>ترکیب
                  حروف و
                  عدد
                </li>
                <li
                  className={cls(styles.hint, (Array.isArray(form.errors?.password) && form.errors?.password?.includes('length')) || (!Array.isArray(form.errors?.password) && Object.hasOwn(form.errors, 'password')) ? styles.hintError : styles.hintSuccess)}>بیشتر
                  از ۸
                  کاراکتر
                </li>
              </ul>}
              <div className={styles.buttonWrapper}>
                <button
                  type="submit"
                  disabled={!form.isValid | !form.dirty}
                  className={cls(
                    styles.button,
                    'btn-primary',
                  )}>
                  <span>ثبت‌نام</span>
                </button>
              </div>
            </div>
          </div>
          <div className={styles.forwardLinkWrapper}>
            <Link to={'/login'} className={styles.forwardLink}>
              حساب کاربری دارید؟ <span>وارد شوید</span>
            </Link>
          </div>
        </form>
      </AuthLayout>
    </>
  )
}

export default RegisterPage
