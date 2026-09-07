import {useLocation, useNavigate, useParams} from 'react-router-dom'
import styles from '../../UsersCommon.module.css'
import cls from 'classnames'
import {useDispatch, useSelector} from 'react-redux'
import KitInputPassword from '../../../../common/components/uiKits/dataEntry/kitInputPassword/KitInputPassword'
import KitInputWrapper from '../../../../common/components/uiKits/dataEntry/kitInputWrapper/KitInputWrapper'
import KitInputError from '../../../../common/components/uiKits/dataEntry/kitInputError/KitInputError'
import useMessage from '../../../../common/util/useMessage'
import React, {useState} from 'react'
import useForm from '../../../../common/util/useForm'
import Card from '../../../../common/components/custom/dataDisplay/card/Card'
import ActionsButton from '../../../../common/components/custom/general/actionsButton/ActionsButton.tsx'
import {useTranslation} from '../../../../common/components/LocalizationProvider'
import {useUser, useUpdateUserWithoutRoles} from '../../../../common/serverStore'

const UserChangePassword = () => {
  const t = useTranslation()
  const {id} = useParams()
  const [loadingForm, setLoadingForm] = useState(false)
  const [disableForm, setDisableForm] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {contextHolder, showMessage} = useMessage()
  const currentUser = useSelector((state: any) => state?.session?.user)
  const permissions = useSelector((state: any) => state.session.permissions)
  const location = useLocation()
  const {data: user, isLoading: isLoadingUser, isFetching, dataUpdatedAt} = useUser(id ? parseInt(id) : undefined)
  const updateUser = useUpdateUserWithoutRoles()

  const handleSave = async (values: any) => {
    setDisableForm(true)

    try {
      const result = await updateUser.mutateAsync({
        id: parseInt(id),
        user: {
          ...user,
          password: values.password
        }
      })

      if (result.id == currentUser.id) {
        setDisableForm(false)
        navigate('/')
      } else {
        setDisableForm(false)
        navigate(-1)
      }
    } catch (error) {
      setDisableForm(false)
      showMessage({message: error?.response?.data?.message, type: 'error', duration: 2, key: 'save'})
    }
  }

  const handleCancelClick = () => {
    if (location.pathname.includes('users')) {
      navigate('/users/users')
    } else {
      navigate(-1)
    }
  }

  const {form} = useForm({
    formGroup: {
      'password': {
        value: '',
        validations: [{
          'required': 'وارد کردن رمزعبور الزامی است',
          'password': 'رمز عبور معتبر نمی باشد',
        }],
      },
      'confirmPassword': {
        value: '',
        validations: [{
          'required': 'تکرار رمزعبور الزامی است',
          'custom': {
            validator: (value: string, values: any) => {
              return value === values.password ? '' : 'رمز عبور و تکرار آن باید یکسان باشند'
            }
          }
        }],
      }
    },
    scrollId: 'inputsWrapper',
    handleSubmit: handleSave,
  })

  return (
    <>
      {contextHolder}
      <div className={styles.usersRegister}>
        <div className={styles.usersRegisterContainer}>
          <form
            onSubmit={form.handleSubmit}
            className={styles.form}
          >
            <div id={'inputsWrapper'} className={styles.inputsWrapper}>
              <Card title={'تغییر رمز عبور'} contentClassName={styles.inputs}>
                <div className={styles.input}>
                  <KitInputWrapper label="رمز عبور جدید" required={true} name="password" direction={'col'}
                                   loading={loadingForm}>
                    <KitInputPassword placeholder="رمز عبور جدید" name="password"
                                      onChange={(e: any) => form.handleChange(e)}
                                      onBlur={(e: any) => form.handleBlur(e)}
                                      value={form.values.password}
                                      status={form.errors.password ? 'error' : ''}
                                      disabled={disableForm || (id ? !permissions.includes('User-update') : !permissions.includes('User-persist'))}
                    />
                  </KitInputWrapper>
                  <ul className={styles.hintWrapper}>
                    <li
                      className={cls(
                        styles.hint,
                        (Array.isArray(Object(form.errors)?.password) && Object(form.errors)?.password.includes('uppercase'))
                        || (!Array.isArray(Object(form.errors)?.password) && Object(form.errors)?.password)
                          ? styles.hintError
                          : styles.hintSuccess,
                      )}
                    >
                      <span className={styles.hintIcon}>🔠</span>
                      حداقل یک حرف بزرگ انگلیسی
                    </li>
                    <li
                      className={cls(
                        styles.hint,
                        (Array.isArray(Object(form.errors)?.password) && Object(form.errors)?.password.includes('lowercase'))
                        || (!Array.isArray(Object(form.errors)?.password) && Object(form.errors)?.password)
                          ? styles.hintError
                          : styles.hintSuccess,
                      )}
                    >
                      <span className={styles.hintIcon}>🔡</span>
                      حداقل یک حرف کوچک انگلیسی
                    </li>
                    <li
                      className={cls(
                        styles.hint,
                        (Array.isArray(Object(form.errors)?.password) && Object(form.errors)?.password.includes('english'))
                        || (!Array.isArray(Object(form.errors)?.password) && Object(form.errors)?.password)
                          ? styles.hintError
                          : styles.hintSuccess,
                      )}
                    >
                      <span className={styles.hintIcon}>🔤</span>
                      فقط از حروف انگلیسی استفاده شود
                    </li>
                    <li
                      className={cls(
                        styles.hint,
                        (Array.isArray(Object(form.errors)?.password) && Object(form.errors)?.password.includes('special'))
                        || (!Array.isArray(Object(form.errors)?.password) && Object(form.errors)?.password)
                          ? styles.hintError
                          : styles.hintSuccess,
                      )}
                    >
                      <span className={styles.hintIcon}>🔣</span>
                      حداقل یک کاراکتر خاص
                    </li>
                    <li
                      className={cls(
                        styles.hint,
                        (Array.isArray(Object(form.errors)?.password) && Object(form.errors)?.password.includes('text'))
                        || (!Array.isArray(Object(form.errors)?.password) && Object(form.errors)?.password)
                          ? styles.hintError
                          : styles.hintSuccess,
                      )}
                    >
                      <span className={styles.hintIcon}>🔤</span>
                      ترکیب حروف و عدد
                    </li>
                    <li
                      className={cls(
                        styles.hint,
                        (Array.isArray(Object(form.errors)?.password) && Object(form.errors)?.password.includes('length'))
                        || (!Array.isArray(Object(form.errors)?.password) && Object(form.errors)?.password)
                          ? styles.hintError
                          : styles.hintSuccess,
                      )}
                    >
                      <span className={styles.hintIcon}>📏</span>
                      حداقل ۸ کاراکتر
                    </li>
                  </ul>
                </div>
                <div className={styles.input}>
                  <KitInputWrapper label="تکرار رمز عبور" required={true} name="confirmPassword" direction={'col'}
                                   loading={loadingForm}>
                    <KitInputPassword placeholder="تکرار رمز عبور" name="confirmPassword"
                                      onChange={(e: any) => form.handleChange(e)}
                                      onBlur={(e: any) => form.handleBlur(e)}
                                      value={form.values.confirmPassword}
                                      status={form.errors.confirmPassword ? 'error' : ''}
                                      disabled={disableForm || (id ? !permissions.includes('User-update') : !permissions.includes('User-persist'))}
                    />
                  </KitInputWrapper>
                  <KitInputError label={form.errors.confirmPassword} />
                </div>
              </Card>
            </div>
            <ActionsButton
              onCancel={handleCancelClick}
              isSubmitDisabled={!form.isValid || disableForm || loadingForm}
              isLoading={disableForm}
              cancelText="لغو"
              submitText="ثبت"
              isSubmitHide={!permissions.includes('User-update')}
            />
          </form>
        </div>
      </div>
    </>
  )
}

export default UserChangePassword
