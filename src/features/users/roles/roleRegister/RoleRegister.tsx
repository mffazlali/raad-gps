import {redirect, useLocation, useNavigate, useParams} from 'react-router-dom'
import styles from '../../UsersCommon.module.css'
import cls from 'classnames'
import {useSelector} from 'react-redux'
import KitInputText from '../../../../common/components/uiKits/dataEntry/kitInputText/KitInputText'
import KitInputPassword from '../../../../common/components/uiKits/dataEntry/kitInputPassword/KitInputPassword'
import KitInputNumber from '../../../../common/components/uiKits/dataEntry/kitInputNumber/KitInputNumber'
import KitInputWrapper from '../../../../common/components/uiKits/dataEntry/kitInputWrapper/KitInputWrapper'
import KitInputError from '../../../../common/components/uiKits/dataEntry/kitInputError/KitInputError'
import KitSelect from '../../../../common/components/uiKits/dataEntry/kitSelect/KitSelect'
import KitDatePicker from '../../../../common/components/uiKits/dataEntry/kitDatePicker/KitDatePicker'
import KitCheckbox from '../../../../common/components/uiKits/dataEntry/kitCheckbox/KitCheckbox'
import useMessage from '../../../../common/util/useMessage'
import React, {useEffect, useState} from 'react'
import useForm from '../../../../common/util/useForm'
import Card from '../../../../common/components/custom/dataDisplay/card/Card'
import Button from '../../../../common/components/custom/general/button/Button'
import useMapStyles from '../../../../common/map/core/useMapStyles.js'
import {useCatch, useEffectAsync} from '../../../../common/util/reactHelper'
import {sessionActions} from '../../../../common/clientStore'
import useQuery from '../../../../common/util/useQuery'
import {FormikHelpers} from 'formik'
import {useAdministrator, useManager, useRestriction} from '../../../../common/util/permissions'
import {map} from '../../../../common/map/core/MapView.jsx'
import {useTranslation} from '../../../../common/components/LocalizationProvider'
import useCommonUserAttributes from '../../../../common/attributes/useCommonUserAttributes'
import useUserAttributes from '../../../../common/attributes/useUserAttributes'
import EditAttributes from '../../../components/editAttributes/EditAttributes.tsx'
import axios from 'axios'
import axiosInstance from '../../../../common/util/axiosConfig.ts'
import {useRole, useCreateRole, useUpdateRole} from '../../../../common/serverStore/useRole.ts'
import ActionsButton from '../../../../common/components/custom/general/actionsButton/ActionsButton.tsx'
import {accessibilityType, useAccessibility} from '../../../../common/serverStore/useAccessibility.ts'

const RoleRegister = () => {
  const t = useTranslation()
  const {id} = useParams()
  const [loadingForm, setLoadingForm] = useState(!!id)
  const [disableForm, setDisableForm] = useState(false)
  const [accessibilities, setAccessibilities] = useState<accessibilityType[]>([])
  const [accessibilitiesDisable, setAccessibilitiesDisable] = useState<string[]>([])
  const navigate = useNavigate()
  const {contextHolder, showMessage} = useMessage()
  const admin = useAdministrator()
  const manager = useManager()
  const commonUserAttributes = useCommonUserAttributes(t)
  const userAttributes = useUserAttributes(t)
  const fixedEmail = !!useRestriction('fixedEmail')
  const query = useQuery()
  const [queryHandled, setQueryHandled] = useState(false)
  const attribute = query.get('attribute')
  const location = useLocation()

  const {data: accessibilitiesData} = useAccessibility()
  const {data: role, isLoading: isLoadingRole} = useRole(id ? parseInt(id) : undefined)
  const createRole = useCreateRole()
  const updateRole = useUpdateRole()


  useEffect(() => {
    if(accessibilitiesData){
      const accessibilitiesTemp = Object.entries(accessibilitiesData).filter(item => item[1].enable == true).map(item => item[1])
      const accessibilitiesDisableTemp = Object.entries(accessibilitiesData).filter(item => item[1].enable == false).map(item => item[0])
      setAccessibilities(accessibilitiesTemp)
      setAccessibilitiesDisable(accessibilitiesDisableTemp)
    }
  }, [accessibilitiesData])

  const handleSave = useCatch(async (values: any, actions: FormikHelpers<any>) => {
    setDisableForm(true)
    const tmpValues = {
      role: {
        name: values.name,
      },
      accessibilityIds: [...values.accessibilityIds, ...accessibilitiesDisable],
    }

    if (id) {
      tmpValues.role['id'] = values.id
    }

    try {
      if (id) {
        await updateRole.mutateAsync({id: parseInt(id), role: tmpValues})
      } else {
        await createRole.mutateAsync(tmpValues)
      }
      setDisableForm(false)
      navigate('/users/roles')
    } catch (error) {
      setDisableForm(false)
      showMessage({message: error?.response?.data?.message, type: 'error', duration: 2, key: 'save'})
    }
  })

  const handleCancelClick = () => {
    navigate(-1)
  }

  const GetFormGroupPermissions = () => {
    let formGroupPermissions = {}
    for (let permission in accessibilitiesData) {
      formGroupPermissions[permission] = {
        value: null,
        validations: [],
      }
    }
    return formGroupPermissions
  }

  const {form} = useForm({
    formGroup: {
      'name': {
        value: '',
        validations: [{'required': 'وارد کردن نقش الزامی است'}],
      },
      'accessibilityIds': {value: [], validations: [{'required': 'وارد کردن دسترسی الزامی است'}]},
      // ...GetFormGroupPermissions(),
    },
    scrollId: 'inputsWrapper',
    handleSubmit: handleSave,
  })

  useEffect(() => {
    if (role) {
      setForm(role)
      setLoadingForm(false)
    } else if (!id) {
      setLoadingForm(false)
    }
  }, [role, id])

  const setForm = (values: any) => {
    const tmpValues = {
      ...values,
    }
    form.setValues(tmpValues)
  }

  const showPermissions = () => {
    const permissionItems = Object.entries(accessibilitiesData).filter(item => item[1].enable == true).map(([key, value]: any) => {
      return (
        <div className={styles.input}>
          <KitCheckbox name={key}
                       label={value?.title}
                       onChange={(e) => form.handleChange(e as any)}
                       value={form.values[key]}
                       disabled={disableForm} />
          {/*<KitInputError label={form.errors[key]} />*/}
        </div>
      )
    })

    return (
      <Card title={'دسترسی‌ها'} contentClassName={styles.inputs}>
        {permissionItems}
      </Card>
    )
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
                  <KitInputWrapper label="نقش" required={true} name="name" direction={'col'} loading={loadingForm}>
                    <KitInputText placeholder="نقش" name="name"
                                  onChange={(e: any) => form.handleChange(e)}
                                  onBlur={(e: any) => form.handleBlur(e)}
                                  value={form.values.name} status={form.errors.name ? 'error' : ''}
                                  disabled={disableForm} maxLength={50} />
                  </KitInputWrapper>
                  <KitInputError label={form.errors.name} />
                </div>
                <div className={styles.input}>
                  <KitInputWrapper label="دسترسی" required={true}
                                   name="accessibilityIds" direction={'col'} loading={loadingForm}>
                    <KitSelect placeholder="دسترسی" name="accessibilityIds"
                               optionLabel={'title'}
                               optionValue={'id'}
                               isGroup={true}
                               groupLabel={'categoryTitle'}
                               options={accessibilities}
                               allowClear={true}
                               showSearch={true}
                               onChange={(e) => {
                                 form.setFieldValue('accessibilityIds', e)
                               }}
                               onBlur={(e) => form.handleBlur(e)}
                               onSelect={(e) => {
                                 form.handleChange(e)
                               }}
                               isDefaultOption={false}
                               mode={'multiple'}
                               value={form.values.accessibilityIds}
                               disabled={disableForm}
                               status={form.errors.accessibilityIds ? 'error' : ''} />
                  </KitInputWrapper>
                  <KitInputError label={form.errors.accessibilityIds} />
                </div>
              </Card>
              {/*{showPermissions()}*/}
            </div>
            <ActionsButton
              onCancel={handleCancelClick}
              isSubmitDisabled={!form.isValid || disableForm || loadingForm}
              isLoading={disableForm}
              cancelText="لغو"
              submitText="ثبت"
            />
          </form>
        </div>
      </div>
    </>
  )
}

export default RoleRegister
