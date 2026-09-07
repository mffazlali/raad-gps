import {useNavigate, useParams} from 'react-router-dom'
import styles from '../../SettingsCommon.module.css'
import cls from 'classnames'
import {useCatch} from '../../../../common/util/reactHelper'
import useForm from '../../../../common/util/useForm.tsx'
import KitInputWrapper from '../../../../common/components/uiKits/dataEntry/kitInputWrapper/KitInputWrapper.tsx'
import KitInputError from '../../../../common/components/uiKits/dataEntry/kitInputError/KitInputError.tsx'
import React, {useEffect, useState} from 'react'
import useMessage from '../../../../common/util/useMessage.tsx'
import Button from '../../../../common/components/custom/general/button/Button.tsx'
import {FormikHelpers} from 'formik'
import Card from '../../../../common/components/custom/dataDisplay/card/Card.tsx'
import {useTranslationKeys} from '../../../../common/components/LocalizationProvider'
import {prefixString, unprefixString} from '../../../../common/util/stringUtils'
import {useTranslation} from '../../../../common/components/LocalizationProvider'
import SelectField from '../../../../common/components/SelectField.tsx'
import KitCheckbox from '../../../../common/components/uiKits/dataEntry/kitCheckbox/KitCheckbox.tsx'
import {eventTypes as eventTypesUtil} from '../../../../common/util/constants.js'
import ActionsButton from '../../../../common/components/custom/general/actionsButton/ActionsButton.tsx'
import {
  useNotification,
  useCreateNotification,
  useUpdateNotification,
} from '../../../../common/serverStore'

const NotificationRegister = ({setOpen}: {setOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const t = useTranslation()
  const {id} = useParams()
  const navigate = useNavigate()
  const [loadingForm, setLoadingForm] = useState(!!id)
  const [disableForm, setDisableForm] = useState(false)
  const [allEventTypes, setAllEventTypes] = useState<any[]>([])
  const {contextHolder, showMessage} = useMessage()

  const {data: notification, isLoading: isLoadingNotification} = useNotification(id ? parseInt(id) : undefined)
  const createNotification = useCreateNotification()
  const updateNotification = useUpdateNotification()

  useEffect(() => {
    getTypes()
  }, [])

  useEffect(() => {
    if (notification) {
      setForm(notification)
      setLoadingForm(false)
    } else if (!id) {
      form.setFieldValue('notificators', ['web'])
    }
  }, [notification, id])

  const getTypes = async () => {
    // const response = await axiosInstance.get('/api/notifications/types')
    // if (response.ok) {
    //   let types = await response.json()
    //   types = types.filter((item: any) => {
    //     return (['alarm','deviceOnline', 'deviceOffline', 'deviceOverspeed', 'ignitionOn', 'ignitionOff'].includes(item?.type))
    //   })
    //   const result = [{value: 'allEvents', label: 'همه رویداد ها'}, ...types.map((it: any) => {
    //     return {value: it.type, label: t(prefixString('event', it.type))}
    //   })]
    //   setAllEventTypes(result)
    // } else {
    //   throw Error(await response.text())
    // }
    const types = eventTypesUtil.filter((item: any) => {
      return (['alarm', 'deviceOnline', 'deviceOffline', 'deviceOverspeed', 'ignitionOn', 'ignitionOff', 'geofenceEnter', 'geofenceExit', 'slopeOfArm', 'digitalInput', 'digitalOutput'].includes(item?.value))
    })
    setAllEventTypes(types)
  }

  const alarms = useTranslationKeys((it: any) => it.startsWith('alarm')).filter(it => ['alarmLowBattery', 'alarmJamming', 'alarmTow', 'alarmPowerCut'].includes(it)).map((it) => ({
    key: unprefixString('alarm', it),
    name: t(it),
  }))

  const handleSave = useCatch(async (values: any, actions: FormikHelpers<any>) => {
    setDisableForm(true)
    const tmpValues = {
      ...values,
      notificators: values?.notificators?.join(),
      attributes: {...values.attributes, alarms: values?.alarms?.join()},
    }
    delete tmpValues.alarms

    try {
      if (id) {
        await updateNotification.mutateAsync({id: parseInt(id), notification: tmpValues})
      } else {
        await createNotification.mutateAsync(tmpValues)
      }
      setDisableForm(false)
      setOpen(false)
    } catch (e) {
      setDisableForm(false)
      showMessage({
        message: e?.response?.data?.message || t('responseErrorAPI'),
        type: 'error',
        duration: 2,
        key: 'save',
      })
    }
  })

  const {form, setFieldError} = useForm({
    formGroup: {
      'type': {
        value: '',
        validations: [{required: 'وارد کردن نوع خط الزامی است'}],
      },
      'alarms': {
        value: '',
        validations: [],
      },
      'notificators': {
        value: ['web'],
        validations: [{required: 'وارد کردن "کانال ها" الزامی است'}],
      },
      'commandId': {
        value: '',
        validations: [],
      },
      'always': {
        value: false,
        validations: [],
      },
      'calendarId': {
        value: '',
        validations: [],
      },
    },
    scrollId: 'inputsWrapper',
    handleSubmit: handleSave,
  })

  const setForm = (values: any) => {
    const tmpValus = {...values}
    tmpValus.alarms = tmpValus?.attributes?.alarms ? tmpValus.attributes.alarms.split(/[, ]+/) : []
    tmpValus.notificators = tmpValus.notificators ? tmpValus.notificators.split(/[, ]+/) : []
    tmpValus.commandId = tmpValus.commandId || 0
    tmpValus.calendarId = tmpValus.calendarId || 0
    tmpValus.always = tmpValus.hasOwnProperty('always') ? values.always : false
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
          <div id={'inputsWrapper'} className={cls(styles.inputsWrapper)}>
            <Card title={'ضروری'} contentClassName={styles.inputs}>
              <div className={styles.input}>
                <KitInputWrapper label="نوع خط" required={true} name="type" direction={'col'} loading={loadingForm}>
                  <SelectField
                    value={form.values.type}
                    emptyValue={null}
                    onChange={(e: any) => form.setFieldValue('type', e)}
                    options={allEventTypes}
                    keyGetter={'value'}
                    titleGetter={'label'}
                    label={'نوع خط'}
                    status={form.errors.type ? 'error' : ''}
                    mapItems={(it) => t(prefixString('event', it.type))}
                  />
                </KitInputWrapper>
                <KitInputError label={form.errors.type} />
              </div>
              {form?.values?.type === 'alarm' && (
                <div className={styles.input}>
                  <KitInputWrapper label="هشدارها" required={false} name="alarms" direction={'col'}
                                   loading={loadingForm}>
                    <SelectField
                      value={form.values.alarms}
                      emptyValue={null}
                      onChange={(e: any) => form.setFieldValue('alarms', e)}
                      data={alarms}
                      keyGetter={'key'}
                      label={'هشدارها'}
                      status={form.errors.alarms ? 'error' : ''}
                      multiple={true}
                      mapItems={(it) => t(prefixString('event', it.type))}
                    />
                  </KitInputWrapper>
                  <KitInputError label={form.errors.alarms} />
                </div>
              )}
              {/*<div className={styles.input}>*/}
              {/*  <KitInputWrapper label="کانال ها" required={true} name="notificators" direction={'col'}*/}
              {/*                   loading={loadingForm}>*/}
              {/*    <SelectField*/}
              {/*      value={form.values.notificators}*/}
              {/*      onChange={async (e: any) => {*/}
              {/*        await form.setFieldValue('notificators', e)*/}
              {/*        if (e.includes('command')) {*/}
              {/*          setFieldError('commandId', 'وارد کردن دستور ذخیره شده الزامی است')*/}
              {/*          form.setFieldValue('commandId', '')*/}
              {/*        } else {*/}
              {/*          setFieldError('commandId')*/}
              {/*          form.setFieldValue('commandId', '0')*/}
              {/*        }*/}
              {/*      }}*/}
              {/*      endpoint="/api/notifications/notificators"*/}
              {/*      keyGetter={'type'}*/}
              {/*      label={'کانال ها'}*/}
              {/*      status={form.errors.notificators ? 'error' : ''}*/}
              {/*      multiple={true}*/}
              {/*      mapItems={(it) => t(prefixString('notificator', it.type))}*/}
              {/*    />*/}
              {/*  </KitInputWrapper>*/}
              {/*  <KitInputError label={form.errors.notificators} />*/}
              {/*</div>*/}
              {form?.values?.notificators?.includes('command') && (
                <div className={styles.input}>
                  <KitInputWrapper label="دستور ذخیره شده" required={true} name="commandId" direction={'col'}
                                   loading={loadingForm}>
                    <SelectField
                      value={form.values.commandId}
                      emptyValue={null}
                      onChange={(e: any) => form.setFieldValue('commandId', e)}
                      endpoint={'/api/commands'}
                      titleGetter={'description'}
                      label={'دستور ذخیره شده'}
                      status={form.errors.commandId ? 'error' : ''}
                    />
                  </KitInputWrapper>
                  <KitInputError label={form.errors.commandId} />
                </div>
              )}
              {/*<div className={styles.input}>*/}
              {/*  <Button*/}
              {/*    type="button"*/}
              {/*    onClick={() => testNotificators(form.values)}*/}
              {/*    title={'آزمایش کانال ها'}*/}
              {/*    className={cls(*/}
              {/*      styles.inputButton,*/}
              {/*      'btn-primary',*/}
              {/*    )}*/}
              {/*    titleClassName={cls(styles.label)}*/}
              {/*    loading={false}*/}
              {/*    disabled={!form?.values?.notificators} />*/}
              {/*</div>*/}
              <div className={styles.input}>
                <KitInputWrapper label="" required={false} name="always"
                                 loading={isLoadingNotification} direction={'col'}>
                  <KitCheckbox name="always"
                               label="همه ردیابها"
                               onChange={(e) => {
                                 // form.setFieldValue('always', e.target.checked)
                                 form.handleChange(e as any)
                               }}
                               value={form.values.always} disabled={false} />
                  <KitInputError label={form.errors.always} />
                </KitInputWrapper>
              </div>
            </Card>
            {/*<Card title={'بیشتر'} contentClassName={styles.inputs}>*/}
            {/*  <div className={styles.input}>*/}
            {/*    <KitInputWrapper label="تقویم" required={false} name="calendarId" direction={'col'}*/}
            {/*                     loading={loadingForm}>*/}
            {/*      <SelectField*/}
            {/*        value={form.values.calendarId}*/}
            {/*        onChange={(e: any) => form.setFieldValue('calendarId', e)}*/}
            {/*        endpoint={`/api/calendars`}*/}
            {/*        label={'تقویم'}*/}
            {/*        status={form.errors.calendarId ? 'error' : ''}*/}
            {/*      />*/}
            {/*    </KitInputWrapper>*/}
            {/*    <KitInputError label={form.errors.calendarId} />*/}
            {/*  </div>*/}
            {/*</Card>*/}
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

export default NotificationRegister
