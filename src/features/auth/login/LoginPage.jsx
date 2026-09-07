import styles from './LoginPage.module.css'
import {useNavigate} from 'react-router-dom'
import cls from 'classnames'
import AuthLayout from '../../../common/layouts/authLayout/AuthLayout.jsx'
import LogoImage from '../logoImage/LogoImage.jsx'
import {useDispatch, useSelector} from 'react-redux'
import {devicesActions, sessionActions} from '../../../common/clientStore/index.js'
import {
  handleLoginTokenListeners,
  nativeEnvironment,
  nativePostMessage,
} from '../../../common/components/NativeInterface.js'
import {useCatch} from '../../../common/util/reactHelper.js'
import React, {useEffect, useState} from 'react'
import {useMetaTags} from '../../../common/util/useMetaTags.js'
import {AuthService} from '../../../common/services/authService.jsx'
import useMessage from '../../../common/util/useMessage'
import useForm from '../../../common/util/useForm'
import Progress from '../../../common/components/custom/feedback/progress/Progress.jsx'
import {useLocalization, useTranslation} from '../../../common/components/LocalizationProvider.jsx'
import Spinner from '../../../common/components/custom/feedback/spinner/Spinner.jsx'
import {mergeDedupe} from '../../../common/util/converter.js'
import {NETWORK_RESPONSE} from '../../../common/util/constants.js'
import useConnectChecker from '../../../common/util/useConnectChecker'
import axios from 'axios'
import axiosInstance from '../../../common/util/axiosConfig'
import {askForNotificationPermission} from '../../../common/util/notificationUtils.js'
import {toJalaliMoment} from '../../../common/util/DateTimeUtil.js'
import KitInputPassword from '../../../common/components/uiKits/dataEntry/kitInputPassword/KitInputPassword.js'
import KitInputText from '../../../common/components/uiKits/dataEntry/kitInputText/KitInputText.js'

const LoginPage = () => {
  const t = useTranslation()
  const [meta, setMeta] = useMetaTags({title: 'راد: ورود', description: 'login user'})
  const {contextHolder, showMessage} = useMessage()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')
  const [failed, setFailed] = useState(true)
  const {languages, language, setLanguage} = useLocalization()
  const online = useConnectChecker()

  const registrationEnabled = useSelector(
    (state) => state.session.server?.registration,
  )
  const languageEnabled = useSelector(
    (state) => !state.session.server?.attributes['ui.disableLoginLanguage'],
  )
  const changeEnabled = useSelector(
    (state) => !state.session.server?.attributes.disableChange,
  )
  const emailEnabled = useSelector(
    (state) => state.session.server?.emailEnabled,
  )
  const openIdEnabled = useSelector(
    (state) => state.session.server?.openIdEnabled,
  )
  const openIdForced = useSelector(
    (state) =>
      state.session.server?.openIdEnabled && state.session.server?.openIdForce,
  )
  const [codeEnabled, setCodeEnabled] = useState(false)

  const [announcementShown, setAnnouncementShown] = useState(false)
  const announcement = useSelector(
    (state) => state.session.server?.announcement,
  )

  useEffect(() => {
    if (online) {
      setErrorMessage('')
    } else {
      setErrorMessage('اتصال اینترنت برقرار نیست')
    }
  }, [online])

  const handlePasswordLogin = async ({email, password}, actions) => {
    const token = localStorage.getItem('notificationToken')
    if (token) {
      window.localStorage.removeItem('notificationToken')
    }
    setErrorMessage('')
    const code = ''
    setFailed(false)

    try {
      const response = await AuthService.LoginService(email, password, code)
      if (response.status === 200) {
        const user = response.data
        await generateLoginToken()
        setLanguage('fa')
        try {
          const [deviceResponse, positionsResponse] = await Promise.all([
            axiosInstance.get(`/api/devices/sessionDevices?userId=${user.id}`),
            axiosInstance.get('/api/positions'),
          ])

          if (positionsResponse.status === 200 && deviceResponse.status === 200) {
            dispatch(sessionActions.updatePositions(positionsResponse.data))
            dispatch(devicesActions.refresh(deviceResponse.data))

            const permissionsResponse = await axiosInstance.get('/api/users/my-permissions')
            if (permissionsResponse.status === 200) {
              const resultPermissions = permissionsResponse.data
              const permissions = [...resultPermissions].map(item => item['name'])
              dispatch(sessionActions.updatePermissions(permissions))
              dispatch(sessionActions.updateUser(user))
              // await askForNotificationPermission()
              navigate('/', {replace: true})
              setFailed(true)
            }
          }
        } catch (error) {
          setErrorMessage(error?.response?.data?.message)
          // setErrorMessage(NETWORK_RESPONSE.responseWarningAPI)
          setFailed(true)
        }
      } else if (
        response.status === 401 &&
        response.headers.get('WWW-Authenticate') === 'TOTP'
      ) {
        setFailed(true)
        setCodeEnabled(true)
      } else {
        setFailed(true)
        setErrorMessage('ایمیل یا رمز عبور اشتباه است')
      }
    } catch (error) {
      // setErrorMessage('ایمیل یا رمز عبور اشتباه است')
      setErrorMessage(error?.response?.data?.message)
      setFailed(true)
    }
  }

  const generateLoginToken = async () => {
    const isToken = true// import.meta.env.VITE_APP_API_IS_TOKEN ? import.meta.env.VITE_APP_API_IS_TOKEN?.toLowerCase?.() === 'true' : false
    if (nativeEnvironment) {
      let token = ''
      try {
        const timestampResponse = await AuthService.TimestampService()
        const expiration = toJalaliMoment(timestampResponse.data).add(6, 'months').toISOString()
        // const expiration = dayjs().add(6, 'months').toISOString()
        const response = await AuthService.GenerateTokenService(expiration)
        if (response.status === 200) {
          token = response.data
        }
      } catch (error) {
        token = ''
      }
      nativePostMessage(`login|${token}`)
      if (token !== '') {
        window.localStorage.setItem('notificationToken', token)
      }
    } else {
      if (isToken) {
        let token = ''
        try {
          const timestampResponse = await AuthService.TimestampService()
          const expiration = toJalaliMoment(timestampResponse.data).add(6, 'months').toISOString()
          // const expiration = dayjs().add(6, 'months').toISOString()
          const response = await AuthService.GenerateTokenService(expiration)
          if (response.status === 200) {
            token = response.data
          }
        } catch (error) {
          token = ''
        }
        if (token !== '') {
          window.localStorage.setItem('notificationToken', token)
        }
      }
    }
  }

  const handleTokenLogin = useCatch(async (token) => {
    const response = await AuthService.TokenService(token)
    if (response.status === 200) {
      const user = response.data
      try {
        const permissionsResponse = await axiosInstance.get('/api/users/my-permissions')
        if (permissionsResponse.status === 200) {
          const resultPermissions = permissionsResponse.data
          const permissions = [...resultPermissions].map(item => item['name'])
          dispatch(sessionActions.updatePermissions(permissions))
          dispatch(sessionActions.updateUser(user))
          navigate('/')
        }
      } catch (error) {
        throw Error(error.response?.data || error.message)
      }
    } else {
      throw Error(response.statusText)
    }
  })

  const handleSpecialKey = (e) => {
    if (e.keyCode === 13 && email && password && (!codeEnabled || code)) {
      handlePasswordLogin(e)
    }
  }

  const handleOpenIdLogin = () => {
    document.location = '/api/session/openid/auth'
  }

  useEffect(() => nativePostMessage('authentication'), [])

  useEffect(() => {
    const listener = (token) => handleTokenLogin(token)
    handleLoginTokenListeners.add(listener)
    return () => handleLoginTokenListeners.delete(listener)
  }, [])

  if (openIdForced) {
    handleOpenIdLogin()
    return <Progress reload={() => navigate('/')} />
  }

  const {form} = useForm({
    formGroup: {
      'password': {
        value: '', validations: [{
          'required': 'وارد کردن رمزعبور الزامی است',
          password: {english: ' فقط از حروف انگلیسی برای رمز استفاده شود'},
        }],
      },
      'email': {
        value: '', validations: [{
          'required': 'وارد کردن ایمیل الزامی است',
          'email': 'ایمیل معتبر نمی باشد',
        }],
      },
    },
    handleSubmit: handlePasswordLogin,
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
        <form
          onSubmit={form.handleSubmit}
          className={styles.loginPageForm}>
          <div className={styles.subjectWrapper}>
            <div className={styles.subject}>
              <div className={styles.logoWrapper}>
                <LogoImage />
              </div>
              <div className={styles.helpWrapper}>
                <div className={styles.help}>وارد شوید</div>
              </div>
              <div className={styles.sloganWrapper}>
                <h2 className={styles.slogan}>
                  {(!online || (form.isValid || !form.dirty)) ? errorMessage !== '' ?
                      <span className={styles.sloganError}>{errorMessage}</span> :
                      <span>اطلاعات کاربری خود را وارد کنید</span> :
                    <span
                      className={styles.sloganError}>ایمیل یا رمز عبور معتبر نیست</span>}
                </h2>
              </div>
            </div>
          </div>
          <div className={styles.formWrapper}>
            <div className={styles.form}>
              <div className={styles.groups}>
                <div className={styles.groupWrapper}>
                  <div className={styles.group}>
                    <div className={styles.labelWrapper}>
                      <div className={cls(styles.label)}>
                        ایمیل<span>*</span>
                      </div>
                    </div>
                    <div className={styles.inputWrapper}>
                      <KitInputText classname={styles.input} name="email"
                                    onChange={(e) => form.handleChange(e)}
                                    onBlur={(e) => form.handleBlur(e)}
                                    value={form.values.email} status={form.errors.email ? 'error' : ''}
                                    disabled={!failed} />
                      {/*<input*/}
                      {/*  type="email"*/}
                      {/*  className={styles.input}*/}
                      {/*  name="email"*/}
                      {/*  onChange={form.handleChange}*/}
                      {/*  onBlur={form.handleBlur}*/}
                      {/*  value={form.values.email ?? ''}*/}
                      {/*  disabled={!failed}*/}
                      {/*/>*/}
                    </div>
                  </div>
                </div>
                <div className={styles.groupWrapper}>
                  <div className={styles.group}>
                    <div className={styles.labelWrapper}>
                      <div
                        className={cls(styles.label)}>
                        رمز عبور<span>*</span>
                      </div>
                    </div>
                    <div className={styles.inputWrapper}>
                      <KitInputPassword name="password"
                                        classname={styles.input}
                                        onChange={(e) => form.handleChange(e)}
                                        onBlur={(e) => form.handleBlur(e)}
                                        value={form.values.password}
                                        status={form.errors.password ? 'error' : ''}
                                        disabled={!failed} maxLength={50} />

                      {/*<input*/}
                      {/*  type="password"*/}
                      {/*  className={styles.input}*/}
                      {/*  name="password"*/}
                      {/*  onChange={form.handleChange}*/}
                      {/*  onBlur={form.handleBlur}*/}
                      {/*  value={form.values.password ?? ''}*/}
                      {/*  maxLength="50"*/}
                      {/*  disabled={!failed}*/}
                      {/*/>*/}
                    </div>
                  </div>
                </div>
                <div className={styles.groupRow}>
                  <div className={styles.groupRowRight}>
                    <div className={styles.checkBoxWrapper}>
                      {/*<input type="checkbox" className={styles.checkBox} />*/}
                      {/*<label className={styles.label}>مرا به خاطر بسپار</label>*/}
                    </div>
                  </div>
                  <div className={styles.groupRowLeft}>
                    {/*<div className={styles.linkWrapper}>*/}
                    {/*  <Link to="/reset-password" className={styles.link}>*/}
                    {/*    فراموشی رمز عبور*/}
                    {/*  </Link>*/}
                    {/*</div>*/}
                  </div>
                </div>
              </div>
              <div className={styles.buttonWrapper}>
                <button
                  type="submit"
                  disabled={!form.isValid || !form.dirty || !failed}
                  className={cls(
                    styles.button,
                    'btn-primary',
                  )}>
                  <span>ورود</span>{!failed &&
                  <Spinner className={'!border-b-white !border-l-white !border-t-white/10 !border-r-white/10'} />}
                </button>
              </div>
            </div>
          </div>
          {/*<div className={styles.forwardLinkWrapper}>*/}
          {/*  <Link to={'/register'} className={styles.forwardLink}>*/}
          {/*    حساب کاربری ندارید؟ <span>ثبت‌نام کنید</span>*/}
          {/*  </Link>*/}
          {/*</div>*/}
        </form>
      </AuthLayout>
    </>
  )
}

export default LoginPage
