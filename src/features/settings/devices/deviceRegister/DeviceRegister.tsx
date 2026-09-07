import {useNavigate, useParams} from 'react-router-dom'
import styles from '../../SettingsCommon.module.css'
import cls from 'classnames'
import deviceCategories from '../../../../common/util/deviceCategories'
import {useCatch} from '../../../../common/util/reactHelper'
import {useSelector} from 'react-redux'
import useForm from '../../../../common/util/useForm.tsx'
import KitInputWrapper from '../../../../common/components/uiKits/dataEntry/kitInputWrapper/KitInputWrapper.tsx'
import KitInputText from '../../../../common/components/uiKits/dataEntry/kitInputText/KitInputText.tsx'
import KitInputError from '../../../../common/components/uiKits/dataEntry/kitInputError/KitInputError.tsx'
import React, {useEffect, useId, useState} from 'react'
import useMessage from '../../../../common/util/useMessage.tsx'
import Button from '../../../../common/components/custom/general/button/Button.tsx'
import {FormikHelpers} from 'formik'
import Card from '../../../../common/components/custom/dataDisplay/card/Card.tsx'
import KitCheckbox from '../../../../common/components/uiKits/dataEntry/kitCheckbox/KitCheckbox.tsx'
import KitSelect from '../../../../common/components/uiKits/dataEntry/kitSelect/KitSelect.tsx'
import KitInputNumber from '../../../../common/components/uiKits/dataEntry/kitInputNumber/KitInputNumber.tsx'
import KitDatePicker from '../../../../common/components/uiKits/dataEntry/kitDatePicker/KitDatePicker.tsx'
import EditAttributes from '../../../components/editAttributes/EditAttributes.tsx'
import {useTranslation} from '../../../../common/components/LocalizationProvider'
import useCommonDeviceAttributes from '../../../../common/attributes/useCommonDeviceAttributes'
import useDeviceAttributes from '../../../../common/attributes/useDeviceAttributes'
import {useAdministrator} from '../../../../common/util/permissions'
import KitImageUploader from '../../../../common/components/uiKits/dataEntry/kitImageUploader/KitImageUploader.tsx'
import KitInputColorPicker
  from '../../../../common/components/uiKits/dataEntry/kitInputColorPicker/KitInputColorPicker.tsx'
import {RcFile} from 'antd/es/upload'
import DeviceConnectionsInputs from '../deviceConnections/deviceConnectionsInputs/DeviceConnectionsInputs.tsx'
import {getType} from '@turf/turf'
import axios from 'axios'
import ActionsButton from '../../../../common/components/custom/general/actionsButton/ActionsButton.tsx'
import axiosInstance from '../../../../common/util/axiosConfig.ts'
import {useDevice, useCreateDevice, useUpdateDevice} from '../../../../common/serverStore/useDevice.ts'
import {useDrivers, useMaintenances} from '../../../../common/serverStore'

const DeviceRegister = ({setOpen}: {setOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const t = useTranslation()
  const {id} = useParams()
  const navigate = useNavigate()
  const [loadingForm, setLoadingForm] = useState(!!id)
  const [disableForm, setDisableForm] = useState(false)
  const {contextHolder, showMessage} = useMessage()
  const admin = useAdministrator()
  const commonDeviceAttributes = useCommonDeviceAttributes(t)
  const deviceAttributes = useDeviceAttributes(t)
  const currentUser = useSelector((state: any) => state?.session?.user)
  const {data: device, isLoading: isLoadingDevice} = useDevice(id ? parseInt(id) : undefined)
  const createDevice = useCreateDevice()
  const updateDevice = useUpdateDevice()

  useEffect(() => {
    if (device) {
      setForm(device)
      setLoadingForm(false)
    } else if (!id) {
      form.setFieldValue('color', '#9e9e9e')
    }
  }, [device, id])

  const handleSave = useCatch(async (values: any, actions: FormikHelpers<any>) => {
    setDisableForm(true)
    const tmpValues = {
      ...values,
      id: values.id,
      attributes: {
        ...values.attributes,
        deviceImage: values.deviceImage,
      },
    }
    const attributes = Object.keys(tmpValues.attributes)
    if (attributes.length > 0) {
      attributes.forEach(attribute => {
        delete tmpValues[attribute]
        const mainAttr = tmpValues.attributes[attribute]
        if (!mainAttr) {
          delete tmpValues.attributes[attribute]
        }
      })
    }
    delete tmpValues.userLimit
    delete tmpValues.disabled
    Object.keys(tmpValues).forEach(Value => {
      const tmpValue = tmpValues[Value]
      if (tmpValue == null || tmpValue == '') {
        delete tmpValues[Value]
      }
    })
    try {
      if (id) {
        await updateDevice.mutateAsync({id: parseInt(id), device: tmpValues})
      } else {
        await createDevice.mutateAsync(tmpValues)
      }
      setDisableForm(false)
      setOpen(false)
    } catch (e) {
      setDisableForm(false)
      showMessage({
        message: e?.response?.data?.message || e?.message || t('responseErrorAPI'),
        type: 'error',
        duration: 2,
        key: 'save',
      })
    }
  })

  const {form} = useForm({
    formGroup: {
      'name': {
        value: '',
        validations: [{required: 'وارد کردن نام الزامی است'}],
      },
      'uniqueId': {value: '', validations: [{required: 'وارد کردن شناسه الزامی است'}]},
      'groupId': {value: '', validations: []},
      'phone': {value: '', validations: []},
      'contact': {value: '', validations: []},
      'category': {value: '', validations: [{required: 'وارد کردن نوع خودرو الزامی است'}]},
      'calendarId': {value: '', validations: []},
      'expirationTime': {value: null, validations: []},
      'disabled': {value: true, validations: []},
      'deviceImage': {value: null, validations: []},
      'color': {value: '', validations: []},
      'vehicleType': {value: '', validations: []},
      'licensePlate': {value: '', validations: []},
      'enginNumber': {value: '', validations: []},
      'identificationNumber': {value: '', validations: []},
      'productionYear': {value: '', validations: []},
      'model': {value: '', validations: []},
    },
    handleSubmit: handleSave,
    scrollId: 'inputsWrapper',
  })

  const setForm = (values: any) => {
    const tmpValues = {
      ...values,
      id: values.id,
      groupId: values.groupId || 0,
      category: values.category,
      calendarId: values.calendarId || 0,
      deviceImage: Array.isArray(values.attributes.deviceImage) ? values.attributes.deviceImage : [],
      color: values.color ?? '#9e9e9e',
      expirationTime: values.expirationTime,
    }
    form.setValues(tmpValues)
  }

  const handleFiles = useCatch(async (event: RcFile) => {
    if (event) {
      try {
        const response = await axiosInstance.post(`/api/devices/${form.values.id}/image`, event, {
          headers: {
            'Content-Type': 'image/jpeg',
          },
        })
        if (response.status === 200) {
          const res = response.data
          const attributes = form.values?.attributes
          form.setFieldValue('attributes', {...attributes, deviceImage: res})
        } else {
          showMessage({message: t('responseWarningAPI'), type: 'error', duration: 2, key: 'save'})
          throw Error(response.data)
        }
      } catch (e) {
        showMessage({message: t('responseErrorAPI'), type: 'error', duration: 2, key: 'save'})
      }
    }
  })

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
                <KitInputWrapper label="نام" required={true} name="name" direction={'col'} loading={loadingForm}>
                  <KitInputText placeholder="نام" name="name"
                                onChange={(e) => form.handleChange(e)}
                                onBlur={(e) => form.handleBlur(e as any)}
                                value={form.values.name} status={form.errors.name ? 'error' : ''}
                                disabled={disableForm} maxLength={50} />
                </KitInputWrapper>
                <KitInputError label={form.errors.name} />
              </div>
              <div className={styles.input}>
                <KitInputWrapper label="شناسه ردیاب" required={true} name="uniqueId" direction={'col'}
                                 loading={loadingForm}>
                  <KitInputText placeholder="شناسه" name="uniqueId"
                                onChange={(e) => form.handleChange(e)}
                                onBlur={(e) => form.handleBlur(e as any)}
                                value={form.values.uniqueId} status={form.errors.uniqueId ? 'error' : ''}
                                disabled={disableForm || (!!(id) as boolean)} maxLength={50} />
                </KitInputWrapper>
                <KitInputError label={form.errors.uniqueId} />
              </div>
            </Card>
            <Card title={'خودرو'} contentClassName={styles.inputs}>
              <div className={styles.input}>
                <KitInputWrapper label="نوع خودرو" required={true} name="category" direction={'col'}
                                 loading={loadingForm}>
                  <KitSelect placeholder="نوع خودرو" name="category"
                             options={deviceCategories}
                    // options={typeItems}
                             optionLabel={'name'}
                             optionValue={'id'}
                             isDefaultOption={false}
                             allowClear={false}
                             showSearch={true}
                             onChange={(e) => {
                               form.setFieldValue('category', e)
                               // form.setFieldValue('model', '')
                               // getSubType(e)
                             }}
                             onBlur={(e) => form.handleBlur(e)}
                             onSelect={(e) => {
                               form.handleChange(e)
                             }}
                             value={form.values.category} status={form.errors.category ? 'error' : ''}
                             disabled={disableForm} />
                </KitInputWrapper>
                <KitInputError label={form.errors.category} />
              </div>
              <div className={styles.input}>
                <KitInputWrapper label="شماره شناسایی خودرو(VIN)" required={false} name="identificationNumber"
                                 direction={'col'} loading={loadingForm}>
                  <KitInputText placeholder="شماره شناسایی خودرو(VIN)" name="identificationNumber"
                                onChange={(e) => form.handleChange(e)}
                                onBlur={(e) => form.handleBlur(e)}
                                value={form.values.identificationNumber}
                                status={form.errors.identificationNumber ? 'error' : ''}
                                disabled={disableForm} />
                </KitInputWrapper>
                <KitInputError label={form.errors.identificationNumber} />
              </div>
              <div className={styles.input}>
                <KitInputWrapper label="شماره موتور" required={false} name="enginNumber"
                                 direction={'col'} loading={loadingForm}>
                  <KitInputText placeholder="شماره موتور" name="enginNumber"
                                onChange={(e) => form.handleChange(e)}
                                onBlur={(e) => form.handleBlur(e)}
                                value={form.values.enginNumber}
                                status={form.errors.enginNumber ? 'error' : ''}
                                disabled={disableForm} />
                </KitInputWrapper>
                <KitInputError label={form.errors.enginNumber} />
              </div>
              <div className={styles.input}>
                <KitInputWrapper label="شماره پلاک" required={false} name="licensePlate" direction={'col'}
                                 loading={loadingForm}>
                  <KitInputText placeholder="شماره پلاک" name="licensePlate"
                                onChange={(e) => form.handleChange(e)}
                                onBlur={(e) => form.handleBlur(e)}
                                value={form.values.licensePlate} status={form.errors.licensePlate ? 'error' : ''}
                                disabled={disableForm} maxLength={50} />
                </KitInputWrapper>
                <KitInputError label={form.errors.licensePlate} />
              </div>
              <div className={styles.input}>
                <KitInputWrapper label="سال ساخت" required={false} name="productionYear" direction={'col'}
                                 loading={loadingForm}>
                  <KitInputNumber placeholder="سال ساخت" name="productionYear"
                                  onChange={(e) => form.handleChange(e as any)}
                                  value={form.values.productionYear} status={form.errors.productionYear ? 'error' : ''}
                                  disabled={disableForm} />
                </KitInputWrapper>
                <KitInputError label={form.errors.productionYear} />
              </div>
              {/*<div className={styles.input}>*/}
              {/*  <KitInputWrapper label="سال ساخت" required={false} name="productionYear" direction={'col'}>*/}
              {/*    <KitDatePicker placeholder="سال ساخت" name="productionYear" value={form.values.productionYear}*/}
              {/*                   onChange={(e) => form.handleChange(e)}*/}
              {/*                   onBlur={(e) => form.handleBlur(e)}*/}
              {/*                   status={form.errors.productionYear ? 'error' : ''} disabled={disableForm}*/}
              {/*                   picker={'year'}*/}
              {/*    />*/}
              {/*  </KitInputWrapper>*/}
              {/*  <KitInputError label={form.errors.productionYear} />*/}
              {/*</div>*/}
              <div className={cls(styles.input, '!w-[fit-content]')}>
                <KitInputWrapper label="رنگ" required={false} name="color"
                                 direction={'col'} loading={loadingForm}>
                  <KitInputColorPicker placeholder="رنگ" name="color"
                                       onChange={(e) => form.handleChange(e)}
                                       onBlur={(e) => form.handleBlur(e)}
                                       value={form.values.color}
                                       status={form.errors.color ? 'error' : ''}
                                       disabled={disableForm} />
                </KitInputWrapper>
                <KitInputError label={form.errors.color} />
              </div>
              {/*<div className={styles.input}>*/}
              {/*  <KitInputWrapper label="مدل خودرو" required={true} name="model" direction={'col'}>*/}
              {/*    <KitSelect placeholder="مدل خودرو" name="model"*/}
              {/*               options={subTypeItems}*/}
              {/*               optionLabel={'name'}*/}
              {/*               optionValue={'id'}*/}
              {/*               isDefaultOption={false}*/}
              {/*               allowClear={false}*/}
              {/*               showSearch={true}*/}
              {/*               onChange={(e) => {*/}
              {/*                 form.setFieldValue('model', e)*/}
              {/*               }}*/}
              {/*               onBlur={(e) => form.handleBlur(e)}*/}
              {/*               onSelect={(e) => {*/}
              {/*                 form.handleChange(e)*/}
              {/*               }}*/}
              {/*               value={form.values.model} status={form.errors.model ? 'error' : ''}*/}
              {/*               disabled={disableForm} />*/}
              {/*  </KitInputWrapper>*/}
              {/*  <KitInputError label={form.errors.model} />*/}
              {/*</div>*/}
              {/*<div className={styles.input}>*/}
              {/*  <KitInputWrapper label="نوع خودرو" required={false} name="vehicleType"*/}
              {/*                   direction={'col'}>*/}
              {/*    <KitInputText placeholder="نوع خودرو" name="vehicleType"*/}
              {/*                  onChange={(e) => form.handleChange(e)}*/}
              {/*                  onBlur={(e) => form.handleBlur(e)}*/}
              {/*                  value={form.values.vehicleType}*/}
              {/*                  status={form.errors.vehicleType ? 'error' : ''}*/}
              {/*                  disabled={disableForm} />*/}
              {/*  </KitInputWrapper>*/}
              {/*  <KitInputError label={form.errors.vehicleType} />*/}
              {/*</div>*/}
            </Card>
            <DeviceConnectionsInputs />
            <Card title={'بیشتر'} contentClassName={styles.inputs}>
              {/*  <div className={styles.input}>*/}
              {/*    <KitInputWrapper label="گروه" required={false} name="groupId" direction={'col'}>*/}
              {/*      <KitSelect placeholder="گروه" name="groupId"*/}
              {/*                 optionLabel={'name'}*/}
              {/*                 optionValue={'id'}*/}
              {/*                 isDefaultOption={true}*/}
              {/*                 endpoint={'/api/groups'}*/}
              {/*                 allowClear={true}*/}
              {/*                 showSearch={true}*/}
              {/*                 onChange={(e) => form.setFieldValue('groupId', e)}*/}
              {/*                 onBlur={(e) => form.handleBlur(e)}*/}
              {/*                 onSelect={(e) => {*/}
              {/*                   form.handleChange(e)*/}
              {/*                 }}*/}
              {/*                 value={form.values.groupId} status={form.errors.groupId ? 'error' : ''}*/}
              {/*                 disabled={disableForm} />*/}
              {/*    </KitInputWrapper>*/}
              {/*    <KitInputError label={form.errors.groupId} />*/}
              {/*  </div>*/}
              <div className={styles.input}>
                <KitInputWrapper label="شماره سیم کارت ردیاب" required={false} name="phone" direction={'col'}
                                 loading={loadingForm}>
                  <KitInputNumber placeholder="شماره سیم کارت ردیاب" name="phone"
                                  onChange={(e) => form.handleChange(e as any)}
                                  value={form.values.phone} status={form.errors.phone ? 'error' : ''}
                                  disabled={disableForm} />
                </KitInputWrapper>
                <KitInputError label={form.errors.phone} />
              </div>
              {/*  <div className={styles.input}>*/}
              {/*    <KitInputWrapper label="تماس" required={false} name="contact" direction={'col'} loading={loadingForm}>*/}
              {/*      <KitInputText placeholder="تماس" name="contact"*/}
              {/*                    onChange={(e) => form.handleChange(e)}*/}
              {/*                    value={form.values.contact} status={form.errors.contact ? 'error' : ''}*/}
              {/*                    disabled={disableForm} maxLength={50} />*/}
              {/*    </KitInputWrapper>*/}
              {/*    <KitInputError label={form.errors.contact} />*/}
              {/*  </div>*/}
              {/*  <div className={styles.input}>*/}
              {/*    <KitInputWrapper label="تقویم" required={false} name="calendarId" direction={'col'}>*/}
              {/*      <KitSelect placeholder="تقویم" name="calendarId"*/}
              {/*                 optionLabel={'name'}*/}
              {/*                 optionValue={'id'}*/}
              {/*                 isDefaultOption={true}*/}
              {/*                 endpoint={'/api/calendars'}*/}
              {/*                 allowClear={true}*/}
              {/*                 showSearch={true}*/}
              {/*                 onChange={(e) => form.setFieldValue('calendarId', e)}*/}
              {/*                 onBlur={(e) => form.handleBlur(e)}*/}
              {/*                 onSelect={(e) => {*/}
              {/*                   form.handleChange(e)*/}
              {/*                 }}*/}
              {/*                 value={form.values.calendarId} status={form.errors.calendarId ? 'error' : ''}*/}
              {/*                 disabled={disableForm} />*/}
              {/*    </KitInputWrapper>*/}
              {/*    <KitInputError label={form.errors.calendarId} />*/}
              {/*  </div>*/}
              <div className={styles.input}>
                <KitInputWrapper label="تاریخ انقضاء" required={false} name="expirationTime" direction={'col'}
                                 loading={loadingForm}>
                  <KitDatePicker placeholder="تاریخ انقضاء" name="expirationTime" value={form.values.expirationTime}
                                 dateMode={'datetime'}
                                 shamsiDefaultValue={true}
                                 onChange={(e) => form.handleChange(e)}
                                 status={form.errors.expirationTime ? 'error' : ''} disabled={disableForm || !admin} />
                </KitInputWrapper>
                <KitInputError label={form.errors.expirationTime} />
              </div>
              {/*  <div className={styles.input}>*/}
              {/*    <KitCheckbox name="disabled"*/}
              {/*                 label="غیر فعال شده"*/}
              {/*                 onChange={(e) => form.handleChange(e as any)}*/}
              {/*                 value={form.values.disabled} disabled={disableForm || !admin} />*/}
              {/*    <KitInputError label={form.errors.disabled} />*/}
              {/*  </div>*/}
            </Card>
            {/*{form.values.id && (<Card title={'عکس دستگاه'} contentClassName={styles.inputs}>*/}
            {/*  <div className={styles.input}>*/}
            {/*    <KitInputWrapper label="" required={false} name="deviceImage" direction={'col'}>*/}
            {/*      <KitImageUploader name="deviceImage" title="انتخاب عکس"*/}
            {/*                        accept={'.jpg,.png'}*/}
            {/*                        multiple={false}*/}
            {/*                        maxCount={1}*/}
            {/*                        beforeUpload={(e) => {*/}
            {/*                          handleFiles(e.target.value)*/}
            {/*                          return true*/}
            {/*                        }}*/}
            {/*                        onChange={(e) => {*/}
            {/*                          form.handleChange(e as any)*/}
            {/*                        }}*/}
            {/*                        value={form.values.deviceImage} status={form.errors.deviceImage ? 'error' : ''}*/}
            {/*                        disabled={disableForm} />*/}
            {/*    </KitInputWrapper>*/}
            {/*    <KitInputError label={form.errors.deviceImage} />*/}
            {/*  </div>*/}
            {/*</Card>)}*/}
            <EditAttributes loading={loadingForm} attributes={form?.values?.attributes ?? null}
                            setAttributes={(attributes: any) => {
                              form.setValues({...form.values, attributes})
                            }}
                            definitions={{
                              speedLimit: {
                                name: 'سرعت مجاز',
                                type: 'number',
                              },
                              slopeLimit: {
                                name: 'شیب مجاز',
                                type: 'number',
                              },
                            }}
              // definitions={{...commonDeviceAttributes, ...deviceAttributes}}
            />
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

export default DeviceRegister
