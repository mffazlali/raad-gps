import {useLocation, useNavigate, useParams} from 'react-router-dom'
import styles from '../../SettingsCommon.module.css'
import cls from 'classnames'
import {useCatch} from '../../../../common/util/reactHelper'
import useForm from '../../../../common/util/useForm.tsx'
import KitInputWrapper from '../../../../common/components/uiKits/dataEntry/kitInputWrapper/KitInputWrapper.tsx'
import KitInputError from '../../../../common/components/uiKits/dataEntry/kitInputError/KitInputError.tsx'
import React, {useState} from 'react'
import useMessage from '../../../../common/util/useMessage.tsx'
import Button from '../../../../common/components/custom/general/button/Button.tsx'
import {FormikHelpers} from 'formik'
import Card from '../../../../common/components/custom/dataDisplay/card/Card.tsx'
import {useTranslation} from '../../../../common/components/LocalizationProvider'
import SelectField from '../../../../common/components/SelectField.tsx'
import useGeofenceAttributes from '../../../../common/attributes/useGeofenceAttributes'
import KitInputText from '../../../../common/components/uiKits/dataEntry/kitInputText/KitInputText.tsx'
import KitTextArea from '../../../../common/components/uiKits/dataEntry/kitTextArea/KitTextArea.tsx'
import EditAttributes from '../../../components/editAttributes/EditAttributes.tsx'
import ActionsButton from '../../../../common/components/custom/general/actionsButton/ActionsButton.tsx'
import {useGeofence, useCreateGeofence, useUpdateGeofence} from '../../../../common/serverStore'

const GeofenceRegister = ({setOpen}: {setOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const t = useTranslation()
  const {id} = useParams()
  const navigate = useNavigate()
  const [loadingForm, setLoadingForm] = useState(!!id)
  const [disableForm, setDisableForm] = useState(false)
  const {contextHolder, showMessage} = useMessage()
  const geofenceAttributes = useGeofenceAttributes(t)
  const {state} = useLocation()

  const { data: geofence, isLoading: isLoadingGeofence } = useGeofence(id ? parseInt(id) : undefined)
  const createGeofence = useCreateGeofence()
  const updateGeofence = useUpdateGeofence()

  React.useEffect(() => {
    if (geofence) {
      setForm(geofence)
      setLoadingForm(false)
    }
  }, [geofence])

  const handleSave = useCatch(async (values: any, actions: FormikHelpers<any>) => {
    setDisableForm(true)
    let tmpValues = {
      ...values,
    }

    if (!id) {
      tmpValues = {
        ...tmpValues, ...state,
      }
    }

    try {
      if (id) {
        await updateGeofence.mutateAsync({ id: parseInt(id), geofence: tmpValues })
      } else {
        await createGeofence.mutateAsync(tmpValues)
      }
      setDisableForm(false)
      setOpen(false)
    } catch (e) {
      setDisableForm(false)
      showMessage({message: e?.response?.data?.message || t('responseErrorAPI'), type: 'error', duration: 2, key: 'save'})
    }
  })

  const {form, setFieldError} = useForm({
    formGroup: {
      'name': {value: '', validations: [{required: 'وارد کردن نام الزامی است'}]},
      'description': {value: '', validations: []},
      'calendarId': {value: '', validations: []},
    },
    handleSubmit: handleSave,
  })

  const setForm = (values: any) => {
    const tmpValus = {...values}
    tmpValus.calendarId = tmpValus.calendarId || 0
    form.setValues(tmpValus)
  }

  const handleCancelClick = () => {
    navigate(-1)
  }

  return (
    <div className={styles.settingsRegister}>
      <div className={styles.settingsRegisterContainer}>
        {contextHolder}
        <form
          onSubmit={(e) => form.handleSubmit(e)}
          onChange={(e) => form.handleChange(e)}
          className={styles.form}
        >
          <div className={cls(styles.inputsWrapper)}>
            <Card title={'ضروری'} contentClassName={styles.inputs}>
              <div className={styles.input}>
                <KitInputWrapper label="نام" required={true} name="name" direction={'col'} loading={loadingForm}>
                  <KitInputText placeholder="نام" name="name"
                                onChange={(e) => form.handleChange(e)}
                                onBlur={(e) => form.handleBlur(e)}
                                value={form.values.name} status={form.errors.name ? 'error' : ''}
                                disabled={disableForm} maxLength={50} />
                </KitInputWrapper>
                <KitInputError label={form.errors.name} />
              </div>
            </Card>
            <Card title={'بیشتر'} contentClassName={styles.inputs}>
              <div className={styles.input}>
                <KitInputWrapper label="توضیحات" required={false} name="description" direction={'col'}>
                  <KitTextArea placeholder="توضیحات" name="description" value={form.values.description}
                               onChange={(e) => form.handleChange(e)}
                               status={form.errors.description ? 'error' : ''} disabled={disableForm} />
                </KitInputWrapper>
                {/*<div className={styles.input}>*/}
                {/*  <KitInputWrapper label="تقویم" required={false} name="calendarId" direction={'col'}*/}
                {/*                   loading={loadingForm}>*/}
                {/*    <SelectField*/}
                {/*      value={form.values.calendarId}*/}
                {/*      onChange={(e: any) => form.setFieldValue('calendarId', e)}*/}
                {/*      endpoint={`/api/calendars`}*/}
                {/*      label={'تقویم'}*/}
                {/*      status={form.errors.calendarId ? 'error' : ''}*/}
                {/*      disabled={disableForm}*/}
                {/*    />*/}
                {/*  </KitInputWrapper>*/}
                {/*  <KitInputError label={form.errors.calendarId} />*/}
                {/*</div>*/}
              </div>
              {/*<EditAttributes loading={loadingForm} attributes={form?.values?.attributes ?? null}*/}
              {/*                setAttributes={(attributes: any) => {*/}
              {/*                  form.setValues({...form.values, attributes})*/}
              {/*                }} definitions={geofenceAttributes} />*/}
            </Card>
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
  )
}

export default GeofenceRegister
