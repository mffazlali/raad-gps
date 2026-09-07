import {redirect, useLocation, useNavigate, useParams} from 'react-router-dom'
import styles from '../../../UsersCommon.module.css'
import cls from 'classnames'
import {useDispatch, useSelector} from 'react-redux'
import KitInputText from '../../../../../common/components/uiKits/dataEntry/kitInputText/KitInputText'
import KitInputPassword from '../../../../../common/components/uiKits/dataEntry/kitInputPassword/KitInputPassword'
import KitInputNumber from '../../../../../common/components/uiKits/dataEntry/kitInputNumber/KitInputNumber'
import KitInputWrapper from '../../../../../common/components/uiKits/dataEntry/kitInputWrapper/KitInputWrapper'
import KitInputError from '../../../../../common/components/uiKits/dataEntry/kitInputError/KitInputError'
import KitSelect from '../../../../../common/components/uiKits/dataEntry/kitSelect/KitSelect'
import KitDatePicker from '../../../../../common/components/uiKits/dataEntry/kitDatePicker/KitDatePicker'
import KitCheckbox from '../../../../../common/components/uiKits/dataEntry/kitCheckbox/KitCheckbox'
import useMessage from '../../../../../common/util/useMessage'
import React, {useEffect, useState} from 'react'
import useForm from '../../../../../common/util/useForm'
import Card from '../../../../../common/components/custom/dataDisplay/card/Card'
import Button from '../../../../../common/components/custom/general/button/Button'
import {useCatch, useEffectAsync} from '../../../../../common/util/reactHelper'
import {sessionActions} from '../../../../../common/clientStore'
import {rolesActions} from '../../../../../common/clientStore'
import useQuery from '../../../../../common/util/useQuery'
import {FormikHelpers} from 'formik'
import {useAdministrator, useManager, useRestriction} from '../../../../../common/util/permissions'
import {useTranslation} from '../../../../../common/components/LocalizationProvider'
import useCommonUserAttributes from '../../../../../common/attributes/useCommonUserAttributes'
import useUserAttributes from '../../../../../common/attributes/useUserAttributes'
import {devicesActions} from '../../../../../common/clientStore'
import axios from 'axios'
import axiosInstance from '../../../../../common/util/axiosConfig.ts'

const UserRoleRegister = () => {
  const t = useTranslation()
  const [loadingForm, setLoadingForm] = useState(false)
  const [disableForm, setDisableForm] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {contextHolder, showMessage} = useMessage()
  const admin = useAdministrator()
  const manager = useManager()
  const commonUserAttributes = useCommonUserAttributes(t)
  const userAttributes = useUserAttributes(t)
  const fixedEmail = !!useRestriction('fixedEmail')
  const query = useQuery()
  const [queryHandled, setQueryHandled] = useState(false)
  const attribute = query.get('attribute')
  const {id} = useParams()
  const {state} = useLocation()

  const handleSave = useCatch(async (values: any, actions: FormikHelpers<any>) => {
    let url = `/api/accesslevel`
    setDisableForm(true)

    const tmpValues = {
      ...values,
      userId: state.userId,
    }
    if (id) {
      tmpValues['id'] = id
    }

    try {
      const response = await axios({
        method: !id ? 'POST' : 'PUT',
        url: url,
        headers: {'Content-Type': 'application/json'},
        data: tmpValues,
      })
      if (response.status === 200) {
        navigate(`/users/users/userroles/${id}`, {state: 'ok', replace: true})
      } else {
        setDisableForm(false)
        showMessage({message: t('responseWarningAPI'), type: 'error', duration: 2, key: 'save'})
      }
    } catch (e) {
      setDisableForm(false)
      showMessage({message: t('responseErrorAPI'), type: 'error', duration: 2, key: 'save'})
    }
  })

  const handleCancelClick = () => {
    navigate(-1)
  }

  const {form} = useForm({
    formGroup: {
      'roleId': {
        value: '',
        validations: [{'required': 'وارد کردن نقش الزامی است'}],
      },
      // ...GetFormGroupPermissions(),
    },
    scrollId: 'inputsWrapper',
    handleSubmit: handleSave,
  })

  useEffectAsync(async () => {
    if (id) {
      setLoadingForm(true)
      try {
        const response = await axiosInstance.get(`/api/accesslevel/${id}`)
        if (response.status === 200) {
          const result = response.data
          setForm(result)
          setLoadingForm(false)
        }
      } catch (error) {
        setLoadingForm(false)
        throw Error(error.message)
      }
    }
  }, [id])

  const setForm = (values: any) => {
    const tmpValues = {
      ...values,
    }
    tmpValues['userId'] = state.userId
    form.setValues(tmpValues)
  }

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
              <Card title={'ضروری'} contentClassName={styles.inputs}>
                <div className={styles.input}>
                  <KitInputWrapper label="نقش" required={false}
                                   name="roleId" direction={'col'}>
                    <KitSelect placeholder="نقش" name="roleId"
                               optionLabel={'name'}
                               optionValue={'id'}
                               endpoint={'/api/role/bulk'}
                               allowClear={true}
                               showSearch={true}
                               onChange={(e) => {
                                 form.setFieldValue('roleId', e)
                                 dispatch(devicesActions.selectIds(e))
                               }}
                               onBlur={(e) => form.handleBlur(e)}
                               onSelect={(e) => {
                                 form.handleChange(e)
                               }}
                               value={form.values.roleId}
                               disabled={disableForm}
                               status={form.errors.roleId ? 'error' : ''} />
                  </KitInputWrapper>
                  <KitInputError label={form.errors.roleId} />
                </div>
              </Card>
            </div>
            <div className={styles.actionsWrapper}>
              <div className={styles.actions}>
                <Button
                  type="button"
                  title={'لغو'}
                  onClick={handleCancelClick}
                  className={cls(styles.button, styles.cancelButton, 'btn-primary-outline')}
                  titleClassName={cls(styles.label, styles.cancelLabel)} />
                <Button
                  type="submit"
                  title={'ثبت تغییرات'}
                  disabled={!form.isValid || disableForm || loadingForm}
                  className={cls(
                    styles.button,
                    styles.registerButton,
                    'btn-primary',
                  )}
                  titleClassName={cls(styles.label, styles.registerLabel)}
                  loading={disableForm} />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default UserRoleRegister
