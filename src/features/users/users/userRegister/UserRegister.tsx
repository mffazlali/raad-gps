import {redirect, useLocation, useNavigate, useParams} from 'react-router-dom'
import styles from '../../UsersCommon.module.css'
import cls from 'classnames'
import {useDispatch, useSelector} from 'react-redux'
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
import {mergeDedupe} from '../../../../common/util/converter'
import axios from 'axios'
import axiosInstance from '../../../../common/util/axiosConfig.ts'
import {
  useUser,
  useCreateUser,
  useUpdateUser,
  useUpdateUserWithoutRoles,
} from '../../../../common/serverStore/useUsers.ts'
import ActionsButton from '../../../../common/components/custom/general/actionsButton/ActionsButton.tsx'
import {useDevices, useRoles} from '../../../../common/serverStore'

const coordinateFormatList = [
  {label: 'درجه اعشار', value: 'dd'},
  {label: 'درجه اعشار دقیقه', value: 'ddm'},
  {label: 'درجه اعشار ثانیه', value: 'dms'},
]

const speedUnitList = [
  {label: 'گره دریایی', value: 'kn'},
  {label: 'Km/h', value: 'kmh'},
  {label: 'M/h', value: 'mph'},
]

const distanceUnitList = [
  {label: 'Km', value: 'km'},
  {label: 'Mile', value: 'mi'},
  {label: 'مایل دریایی', value: 'nmi'},
]

const altitudeUnitList = [
  {label: 'متر', value: 'm'},
  {label: 'فوت', value: 'ft'},
]

const volumeUnitList = [
  {label: 'لیتر', value: 'ltr'},
  {label: 'US گالن', value: 'usGal'},
  {label: 'UK گالن', value: 'impGal'},
]
const UserRegister = () => {
  const t = useTranslation()
  const {id} = useParams()
  const [loadingForm, setLoadingForm] = useState(!!id)
  const [disableForm, setDisableForm] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {contextHolder, showMessage} = useMessage()
  const currentUser = useSelector((state: any) => state?.session?.user)
  const registrationEnabled = useSelector((state: any) => state?.session?.server?.registration)
  const openIdForced = useSelector((state: any) => state?.session?.server?.openIdForce)
  const totpEnable = useSelector((state: any) => state?.session?.server?.attributes?.totpEnable)
  const totpForce = useSelector((state: any) => state?.session?.server?.attributes?.totpForce)
  const [deleteEmail, setDeleteEmail] = useState()
  const [deleteFailed, setDeleteFailed] = useState(false)
  const admin = useAdministrator()
  const manager = useManager()
  const commonUserAttributes = useCommonUserAttributes(t)
  const userAttributes = useUserAttributes(t)
  const fixedEmail = !!useRestriction('fixedEmail')
  const query = useQuery()
  const [queryHandled, setQueryHandled] = useState(false)
  const attribute = query.get('attribute')
  const location = useLocation()
  const mapStyles = useMapStyles()
  const permissions = useSelector((state: any) => state.session.permissions)
  const {data: devices} = useDevices(currentUser?.id)
  const {data: roles} = useRoles()
  const {data: user, isLoading: isLoadingUser, isFetching, dataUpdatedAt} = useUser(id ? parseInt(id) : undefined)
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const updateUserWithoutRoles = useUpdateUserWithoutRoles()

  const handleSave = useCatch(async (values: any, actions: FormikHelpers<any>) => {
    setDisableForm(true)

    let tmpValues = {
      user: {
        ...values,
        attributes: {
          ...values.attributes,
          speedUnit: values.speedUnit,
          distanceUnit: values?.distanceUnit,
          altitudeUnit: values?.altitudeUnit,
          volumeUnit: values?.volumeUnit,
          timezone: values?.timezone,
          poiLayer: values?.poiLayer,
        },
      },
    }

    delete tmpValues.user.speedUnit
    delete tmpValues.user.distanceUnit
    delete tmpValues.user.altitudeUnit
    delete tmpValues.user.volumeUnit
    delete tmpValues.user.poiLayer
    delete tmpValues.user.timezone
    delete tmpValues.user.roles
    delete tmpValues.user.deviceIds

    if (currentUser.id != id) {
      tmpValues['roles'] = (Array.isArray(values.roles) && values.roles.length > 0) ? values.roles : []
      tmpValues['deviceIds'] = (Array.isArray(values.deviceIds) && values.deviceIds.length > 0) ? values.deviceIds : []
    } else {
      tmpValues = tmpValues.user
    }

    try {
      if (id) {
        const result = id == currentUser.id ? await updateUserWithoutRoles.mutateAsync({
          id: parseInt(id),
          user: tmpValues,
        }) : await updateUser.mutateAsync({id: parseInt(id), user: tmpValues})
        if (result.id == currentUser.id) {
          try {
            const responsePermissions = await axiosInstance.get('/api/users/my-permissions')
            if (responsePermissions.status === 200) {
              const permissions = [...responsePermissions.data].map(item => item['name'])
              dispatch(sessionActions.updatePermissions(permissions))
              dispatch(sessionActions.updateUser(result))
              dispatch(sessionActions.updateHistoryFlagByLiveRouteLength(result?.attributes['web.liveRouteLength']))
              setDisableForm(false)
              navigate('/')
            }
          } catch (error) {
            console.error('Error fetching permissions:', error)
            setDisableForm(false)
          }
        } else {
          setDisableForm(false)
          navigate(-1)
        }
      } else {
        const result = await createUser.mutateAsync(tmpValues)
        if (location.pathname.includes('users')) {
          dispatch(sessionActions.updateHistoryFlagByLiveRouteLength(result?.user?.attributes['web.liveRouteLength']))
          setDisableForm(false)
          navigate(-1)
        }
      }
    } catch (error) {
      setDisableForm(false)
      showMessage({message: error?.response?.data?.message, type: 'error', duration: 2, key: 'save'})
    }
  })

  const handleCancelClick = () => {
    const pathnames = location.pathname.split('/');
    let routeName = '';
    if (pathnames.length > 1) {
      routeName = pathnames.slice(0, pathnames.length - 2).join('/') || '/';
    }
    navigate(routeName || '/');
    // if (window.history.length > 1) {
    //   navigate(routeName || '/');
    //   // navigate(-1);
    // } else {
    //   navigate(routeName || '/');
    // }
  };


  const {form} = useForm({
    formGroup: {
      'name': {
        value: '',
        validations: [{'required': 'وارد کردن نام و نام خانوادگی الزامی است'}],
      },
      'password': {
        value: '', validations: (!id || (id == currentUser.id)) ? [{
          'required': 'وارد کردن رمزعبور الزامی است',
          'password': 'رمز عبور معتبر نمی باشد',
        }] : [],
      },
      'email': {
        value: '', validations: [{
          'email': 'ایمیل معتبر نمی باشد',
        }],
      },
      'roles': {
        value: [],
        validations: id != currentUser.id ? [{'required': 'وارد کردن نقش الزامی است'}] : [],
      },
      'deviceIds': {
        value: [],
        validations: id != currentUser.id ? [{'required': 'وارد کردن دستگاه الزامی است'}] : [],
      },
      'totpKey': {value: '', validations: []},
      'attributes': {value: {}, validations: []},
      'phone': {value: '', validations: []},
      'map': {value: '', validations: []},
      'coordinateFormat': {value: '', validations: []},
      'speedUnit': {value: '', validations: []},
      'distanceUnit': {value: '', validations: []},
      'altitudeUnit': {value: '', validations: []},
      'volumeUnit': {value: '', validations: []},
      'timezone': {value: '', validations: []},
      'poiLayer': {value: '', validations: []},
      'twelveHourFormat': {value: false, validations: []},
      'latitude': {value: '', validations: []},
      'longitude': {value: '', validations: []},
      'zoom': {value: '', validations: []},
      'expirationTime': {value: '', validations: [{'required': 'وارد کردن تاریخ انقضا الزامی است'}]},
      'deviceLimit': {value: '', validations: []},
      'userLimit': {value: '', validations: []},
      'disabled': {value: false, validations: []},
      'administrator': {value: false, validations: []},
      'readonly': {value: false, validations: []},
      'deviceReadonly': {value: false, validations: []},
      'limitCommands': {value: false, validations: []},
      'disableReports': {value: false, validations: []},
      'fixedEmail': {value: false, validations: []},
      // 'date': {value: '1402-11-04T01:00:57-08:00', validations: []},
    },
    scrollId: 'inputsWrapper',
    handleSubmit: handleSave,
  })

  useEffect(() => {
    if (user) {
      setLoadingForm(false)
      setForm(user)
    }
  }, [id, user])

  const handleDelete = useCatch(async () => {
    if (deleteEmail === currentUser.email) {
      setDeleteFailed(false)
      try {
        const response = await axiosInstance.delete(`/api/users/${currentUser.id}`)
        if (response.status === 204) {
          navigate('/login')
          dispatch(sessionActions.updateUser(null))
        }
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    } else {
      setDeleteFailed(true)
    }
  })

  // const handleGenerateTotp = useCatch(async () => {
  //   setLoadingForm(true)
  //   const response = await axiosInstance.get('/api/users/totp', {method: 'POST'})
  //   if (response.status === 200) {
  //     const result = response.data
  //     const resText = await response.text()
  //     setForm(result)
  //     form.setFieldValue('totpKey', resText)
  //     setLoadingForm(false)
  //   } else {
  //     setLoadingForm(false)
  //     throw Error(await response.text())
  //   }
  // })

  const setForm = (values: any) => {
    const tmpValues = {
      ...values,
      expirationTime: values.expirationTime,
      coordinateFormat: values.coordinateFormat || 'dd',
      map: values.map || 'osm',
      latitude: values.latitude || 0,
      longitude: values.longitude || 0,
      zoom: values.zoom || 0,
      deviceLimit: values.deviceLimit || 0,
      userLimit: values.userLimit || 0,
      speedUnit: values?.attributes?.speedUnit || 'kn',
      distanceUnit: values?.attributes?.distanceUnit || 'km',
      altitudeUnit: values?.attributes?.altitudeUnit || 'm',
      volumeUnit: values?.attributes?.volumeUnit || 'ltr',
      poiLayer: values?.attributes?.poiLayer,
      timezone: values?.attributes?.timezone,
      roles: values.roles,
      deviceIds: values.deviceIds,
    }
    form.setValues(tmpValues)
  }

  useEffect(() => {
    if (!queryHandled && form.values && attribute) {
      if (!form.values.attributes.hasOwnProperty('attribute')) {
        const updatedAttributes = {...form.values.attributes}
        updatedAttributes[attribute] = ''
        form.setFieldValue('attributes', updatedAttributes)
      }
      setQueryHandled(true)
    }
  }, [form.values, queryHandled, setQueryHandled, attribute])

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
                  <KitInputWrapper label="نام و نام خانوادگی" required={true} name="name" direction={'col'}
                                   loading={loadingForm}>
                    <KitInputText placeholder="نام و نام خانوادگی" name="name"
                                  onChange={(e: any) => form.handleChange(e)}
                                  onBlur={(e: any) => form.handleBlur(e)}
                                  value={form.values.name} status={form.errors.name ? 'error' : ''}
                                  disabled={disableForm || (id ? !permissions.includes('User-update') : !permissions.includes('User-persist'))}
                                  maxLength={50} />
                  </KitInputWrapper>
                  <KitInputError label={form.errors.name} />
                </div>
                <div className={styles.input}>
                  <KitInputWrapper label="ایمیل" required={true} name="email" direction={'col'} loading={loadingForm}>
                    <KitInputText placeholder="ایمیل" name="email"
                                  onChange={(e: any) => form.handleChange(e)}
                                  onBlur={(e: any) => form.handleBlur(e)}
                                  value={form.values.email} status={form.errors.email ? 'error' : ''}
                                  disabled={disableForm || fixedEmail || (id ? !permissions.includes('User-update') : !permissions.includes('User-persist'))} />
                  </KitInputWrapper>
                  <KitInputError label={form.errors.email} />
                </div>
                {(!id || (id && id == currentUser.id)) && (
                  <div className={styles.input}>
                    <KitInputWrapper label="رمز عبور" required={true} name="password" direction={'col'}
                                     loading={loadingForm}>
                      <KitInputPassword placeholder="رمز عبور" name="password"
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
                )}
              </Card>
              {/*<Card title={'تنظیمات'} contentClassName={styles.inputs}>*/}
              {/*  <div className={styles.input}>*/}
              {/*    <KitInputWrapper label="تلفن" required={false} name="phone" direction={'col'}>*/}
              {/*      <KitInputNumber placeholder="تلفن" name="phone"*/}
              {/*                      onChange={(e: any) => form.handleChange(e)}*/}
              {/*                      onBlur={(e: any) => form.handleBlur(e)}*/}
              {/*                      value={form.values.phone} status={form.errors.phone ? 'error' : ''}*/}
              {/*                      disabled={disableForm || !admin} />*/}
              {/*    </KitInputWrapper>*/}
              {/*    <KitInputError label={form.errors.phone} />*/}
              {/*  </div>*/}
              {/*  <div className={styles.input}>*/}
              {/*    <KitInputWrapper label="نقشه پیشفرض" required={false} name="map" direction={'col'}>*/}
              {/*      <KitSelect placeholder="نقشه پیشفرض" name="map"*/}
              {/*                 optionLabel={'title'}*/}
              {/*                 optionValue={'id'}*/}
              {/*                 isDefaultOption={false}*/}
              {/*                 options={mapStyles.filter((style) => style.available)}*/}
              {/*                 allowClear={true}*/}
              {/*                 showSearch={true}*/}
              {/*                 onChange={(e: any) => form.setFieldValue('map', e)}*/}
              {/*                 onBlur={(e: any) => form.handleBlur(e)}*/}
              {/*                 onSelect={(e: any) => {*/}
              {/*                   form.handleChange(e)*/}
              {/*                 }}*/}
              {/*                 value={form.values.map} status={form.errors.map ? 'error' : ''}*/}
              {/*                 disabled={disableForm || !admin} />*/}
              {/*    </KitInputWrapper>*/}
              {/*    <KitInputError label={form.errors.map} />*/}
              {/*  </div>*/}
              {/*  <div className={styles.input}>*/}
              {/*    <KitInputWrapper label="فرمت مختصاتی" required={false} name="coordinateFormat" direction={'col'}>*/}
              {/*      <KitSelect placeholder="فرمت مختصاتی" name="coordinateFormat"*/}
              {/*                 optionLabel={'label'}*/}
              {/*                 optionValue={'value'}*/}
              {/*                 isDefaultOption={false}*/}
              {/*                 options={coordinateFormatList}*/}
              {/*                 allowClear={true}*/}
              {/*                 showSearch={true}*/}
              {/*                 onChange={(e: any) => form.setFieldValue('coordinateFormat', e)}*/}
              {/*                 onBlur={(e: any) => form.handleBlur(e)}*/}
              {/*                 onSelect={(e: any) => {*/}
              {/*                   form.handleChange(e)*/}
              {/*                 }}*/}
              {/*                 value={form.values.coordinateFormat} status={form.errors.coordinateFormat ? 'error' : ''}*/}
              {/*                 disabled={disableForm || !admin} />*/}
              {/*    </KitInputWrapper>*/}
              {/*    <KitInputError label={form.errors.coordinateFormat} />*/}
              {/*  </div>*/}
              {/*  <div className={styles.input}>*/}
              {/*    <KitInputWrapper label="واحد سرعت" required={false} name="speedUnit" direction={'col'}>*/}
              {/*      <KitSelect placeholder="واحد سرعت" name="speedUnit"*/}
              {/*                 optionLabel={'label'}*/}
              {/*                 optionValue={'value'}*/}
              {/*                 isDefaultOption={false}*/}
              {/*                 options={speedUnitList}*/}
              {/*                 allowClear={true}*/}
              {/*                 showSearch={true}*/}
              {/*                 onChange={(e: any) => form.setFieldValue('speedUnit', e)}*/}
              {/*                 onBlur={(e: any) => form.handleBlur(e)}*/}
              {/*                 onSelect={(e: any) => {*/}
              {/*                   form.handleChange(e)*/}
              {/*                 }}*/}
              {/*                 value={form.values.speedUnit} status={form.errors.speedUnit ? 'error' : ''}*/}
              {/*                 disabled={disableForm || !admin} />*/}
              {/*    </KitInputWrapper>*/}
              {/*    <KitInputError label={form.errors.speedUnit} />*/}
              {/*  </div>*/}
              {/*  <div className={styles.input}>*/}
              {/*    <KitInputWrapper label="واحد مسافت" required={false} name="distanceUnit" direction={'col'}>*/}
              {/*      <KitSelect placeholder="واحد مسافت" name="distanceUnit"*/}
              {/*                 optionLabel={'label'}*/}
              {/*                 optionValue={'value'}*/}
              {/*                 isDefaultOption={false}*/}
              {/*                 options={distanceUnitList}*/}
              {/*                 allowClear={true}*/}
              {/*                 showSearch={true}*/}
              {/*                 onChange={(e: any) => form.setFieldValue('distanceUnit', e)}*/}
              {/*                 onBlur={(e: any) => form.handleBlur(e)}*/}
              {/*                 onSelect={(e: any) => {*/}
              {/*                   form.handleChange(e)*/}
              {/*                 }}*/}
              {/*                 value={form.values.distanceUnit} status={form.errors.distanceUnit ? 'error' : ''}*/}
              {/*                 disabled={disableForm || !admin} />*/}
              {/*    </KitInputWrapper>*/}
              {/*    <KitInputError label={form.errors.distanceUnit} />*/}
              {/*  </div>*/}
              {/*  <div className={styles.input}>*/}
              {/*    <KitInputWrapper label="واحد ارتفاع" required={false} name="altitudeUnit" direction={'col'}>*/}
              {/*      <KitSelect placeholder="واحد ارتفاع" name="altitudeUnit"*/}
              {/*                 optionLabel={'label'}*/}
              {/*                 optionValue={'value'}*/}
              {/*                 isDefaultOption={false}*/}
              {/*                 options={altitudeUnitList}*/}
              {/*                 allowClear={true}*/}
              {/*                 showSearch={true}*/}
              {/*                 onChange={(e: any) => form.setFieldValue('altitudeUnit', e)}*/}
              {/*                 onBlur={(e: any) => form.handleBlur(e)}*/}
              {/*                 onSelect={(e: any) => {*/}
              {/*                   form.handleChange(e)*/}
              {/*                 }}*/}
              {/*                 value={form.values.altitudeUnit} status={form.errors.altitudeUnit ? 'error' : ''}*/}
              {/*                 disabled={disableForm || !admin} />*/}
              {/*    </KitInputWrapper>*/}
              {/*    <KitInputError label={form.errors.altitudeUnit} />*/}
              {/*  </div>*/}
              {/*  <div className={styles.input}>*/}
              {/*    <KitInputWrapper label="واحد حجم" required={false} name="volumeUnit" direction={'col'}>*/}
              {/*      <KitSelect placeholder="واحد حجم" name="volumeUnit"*/}
              {/*                 optionLabel={'label'}*/}
              {/*                 optionValue={'value'}*/}
              {/*                 isDefaultOption={false}*/}
              {/*                 options={volumeUnitList}*/}
              {/*                 allowClear={true}*/}
              {/*                 showSearch={true}*/}
              {/*                 onChange={(e: any) => form.setFieldValue('volumeUnit', e)}*/}
              {/*                 onBlur={(e: any) => form.handleBlur(e)}*/}
              {/*                 onSelect={(e: any) => {*/}
              {/*                   form.handleChange(e)*/}
              {/*                 }}*/}
              {/*                 value={form.values.volumeUnit} status={form.errors.volumeUnit ? 'error' : ''}*/}
              {/*                 disabled={disableForm || !admin} />*/}
              {/*    </KitInputWrapper>*/}
              {/*    <KitInputError label={form.errors.volumeUnit} />*/}
              {/*  </div>*/}
              {/*  <div className={styles.input}>*/}
              {/*    <KitInputWrapper label="منطقه زمانی" required={false} name="timezone" direction={'col'}>*/}
              {/*      <KitSelect placeholder="منطقه زمانی" name="timezone"*/}
              {/*                 noOption={true}*/}
              {/*                 optionLabel={'value'}*/}
              {/*                 optionValue={'value'}*/}
              {/*                 isDefaultOption={true}*/}
              {/*                 endpoint={'/api/server/timezones'}*/}
              {/*                 allowClear={true}*/}
              {/*                 showSearch={true}*/}
              {/*                 onChange={(e: any) => form.setFieldValue('timezone', e)}*/}
              {/*                 onBlur={(e: any) => form.handleBlur(e)}*/}
              {/*                 onSelect={(e: any) => {*/}
              {/*                   form.handleChange(e)*/}
              {/*                 }}*/}
              {/*                 value={form.values.timezone} status={form.errors.timezone ? 'error' : ''}*/}
              {/*                 disabled={disableForm || !admin} />*/}
              {/*    </KitInputWrapper>*/}
              {/*    <KitInputError label={form.errors.timezone} />*/}
              {/*  </div>*/}
              {/*  <div className={styles.input}>*/}
              {/*    <KitInputWrapper label="لایه POI" required={false} name="poiLayer" direction={'col'}*/}
              {/*                     loading={loadingForm}>*/}
              {/*      <KitInputText placeholder="لایه POI" name="poiLayer"*/}
              {/*                    onChange={(e: any) => form.handleChange(e)}*/}
              {/*                    onBlur={(e: any) => form.handleBlur(e)}*/}
              {/*                    value={form.values.poiLayer} status={form.errors.poiLayer ? 'error' : ''}*/}
              {/*                    disabled={disableForm || !admin} maxLength={50} />*/}
              {/*    </KitInputWrapper>*/}
              {/*    <KitInputError label={form.errors.poiLayer} />*/}
              {/*  </div>*/}
              {/*  <div className={styles.input}>*/}
              {/*    <KitCheckbox name="twelveHourFormat"*/}
              {/*                 label="فرمت ساعت : 12 ساعتی"*/}
              {/*                 onChange={(e: any) => form.handleChange(e)}*/}
              {/*                 value={form.values.twelveHourFormat}*/}
              {/*                 disabled={!admin} />*/}
              {/*    <KitInputError label={form.errors.twelveHourFormat} />*/}
              {/*  </div>*/}
              {/*</Card>*/}
              {/*<Card title={'مکان'} contentClassName={styles.inputs}>*/}
              {/*  <div className={styles.input}>*/}
              {/*    <KitInputWrapper label="عرض جغرافيايى" required={false} name="latitude" direction={'col'}>*/}
              {/*      <KitInputNumber placeholder="عرض جغرافيايى" name="latitude"*/}
              {/*                      onChange={(e: any) => form.handleChange(e)}*/}
              {/*                      onBlur={(e: any) => form.handleBlur(e)}*/}
              {/*                      value={form.values.latitude} status={form.errors.latitude ? 'error' : ''}*/}
              {/*                      disabled={disableForm || !admin} />*/}
              {/*    </KitInputWrapper>*/}
              {/*    <KitInputError label={form.errors.latitude} />*/}
              {/*  </div>*/}
              {/*  <div className={styles.input}>*/}
              {/*    <KitInputWrapper label="طول جغرافيايى" required={false} name="longitude" direction={'col'}>*/}
              {/*      <KitInputNumber placeholder="طول جغرافيايى" name="longitude"*/}
              {/*                      onChange={(e: any) => form.handleChange(e)}*/}
              {/*                      onBlur={(e: any) => form.handleBlur(e)}*/}
              {/*                      value={form.values.longitude} status={form.errors.longitude ? 'error' : ''}*/}
              {/*                      disabled={disableForm || !admin} />*/}
              {/*    </KitInputWrapper>*/}
              {/*    <KitInputError label={form.errors.longitude} />*/}
              {/*  </div>*/}
              {/*  <div className={styles.input}>*/}
              {/*    <KitInputWrapper label="بزرگنمایی" required={false} name="zoom" direction={'col'}>*/}
              {/*      <KitInputNumber placeholder="بزرگنمایی" name="zoom"*/}
              {/*                      onChange={(e: any) => form.handleChange(e)}*/}
              {/*                      onBlur={(e: any) => form.handleBlur(e)}*/}
              {/*                      value={form.values.zoom} status={form.errors.zoom ? 'error' : ''}*/}
              {/*                      disabled={disableForm || !admin} />*/}
              {/*    </KitInputWrapper>*/}
              {/*    <KitInputError label={form.errors.zoom} />*/}
              {/*  </div>*/}
              {/*  {admin && <div className={styles.input}>*/}
              {/*    <Button*/}
              {/*      type="button"*/}
              {/*      onClick={() => {*/}
              {/*        const {lng, lat} = map.getCenter()*/}
              {/*        form.setFieldValue('latitude', Number(lat.toFixed(6)))*/}
              {/*        form.setFieldValue('longitude', Number(lng.toFixed(6)))*/}
              {/*        form.setFieldValue('zoom', Number(map.getZoom().toFixed(1)))*/}
              {/*      }}*/}
              {/*      title={'موقعیت فعلی'}*/}
              {/*      className={cls(*/}
              {/*        styles.inputButton,*/}
              {/*        'btn-primary',*/}
              {/*      )}*/}
              {/*      titleClassName={cls(styles.label)}*/}
              {/*      loading={disableForm} />*/}
              {/*  </div>}*/}
              {/*</Card>*/}
              <Card title={'دسترسی ها'} contentClassName={styles.inputs}>
                {id != currentUser.id && <div className={styles.input}>
                  <KitInputWrapper label="نقش" required={true}
                                   name="roles" direction={'col'} loading={loadingForm}>
                    <KitSelect placeholder="نقش" name="roles"
                               optionLabel={'name'}
                               optionValue={'id'}
                               options={roles}
                               allowClear={true}
                               showSearch={true}
                               onChange={(e) => {
                                 form.setFieldValue('roles', e)
                               }}
                               onBlur={(e) => form.handleBlur(e)}
                               onSelect={(e) => {
                                 form.handleChange(e)
                               }}
                               isDefaultOption={false}
                               mode={'multiple'}
                               value={form.values.roles}
                               disabled={disableForm}
                               status={form.errors.roles ? 'error' : ''} />
                  </KitInputWrapper>
                  <KitInputError label={form.errors.roles} />
                </div>}
                {id != currentUser.id && <div className={styles.input}>
                  <KitInputWrapper label="دستگاه" required={true}
                                   name="deviceIds" direction={'col'} loading={loadingForm}>
                    <KitSelect placeholder="دستگاه" name="deviceIds"
                               optionLabel={'name'}
                               optionValue={'id'}
                               options={devices}
                               allowClear={true}
                               showSearch={true}
                               onChange={(e) => {
                                 form.setFieldValue('deviceIds', e)
                               }}
                               onBlur={(e) => form.handleBlur(e)}
                               onSelect={(e) => {
                                 form.handleChange(e)
                               }}
                               isDefaultOption={false}
                               mode={'multiple'}
                               value={form.values.deviceIds}
                               disabled={disableForm}
                               status={form.errors.deviceIds ? 'error' : ''} />
                  </KitInputWrapper>
                  <KitInputError label={form.errors.deviceIds} />
                </div>}
                <div className={styles.input}>
                  <KitInputWrapper label="تاریخ انقضاء" required={true} name="expirationTime" direction={'col'}
                                   loading={loadingForm}>
                    <KitDatePicker placeholder="تاریخ انقضاء" name="expirationTime" value={form.values.expirationTime}
                                   onChange={(e: any) => form.handleChange(e)}
                                   onBlur={(e: any) => form.handleBlur(e)}
                                   shamsiDefaultValue={true}
                                   status={form.errors.expirationTime ? 'error' : ''}
                                   dateMode={'datetime'}
                                   disabled={disableForm || currentUser.id == id} />
                  </KitInputWrapper>
                  <KitInputError label={form.errors.expirationTime} />
                </div>
                {/*  <div className={styles.input}>*/}
                {/*    <KitInputWrapper label="محدودیت دستگاه" required={false} name="deviceLimit" direction={'col'}>*/}
                {/*      <KitInputNumber placeholder="محدودیت دستگاه" name="deviceLimit"*/}
                {/*                      onChange={(e: any) => form.handleChange(e)}*/}
                {/*                      onBlur={(e: any) => form.handleBlur(e)}*/}
                {/*                      value={form.values.deviceLimit} status={form.errors.deviceLimit ? 'error' : ''}*/}
                {/*                      disabled={disableForm || !admin} />*/}
                {/*    </KitInputWrapper>*/}
                {/*    <KitInputError label={form.errors.deviceLimit} />*/}
                {/*  </div>*/}
                {/*  <div className={styles.input}>*/}
                {/*    <KitInputWrapper label="محدودیت کاربر" required={false} name="userLimit" direction={'col'}>*/}
                {/*      <KitInputNumber placeholder="محدودیت کاربر" name="userLimit"*/}
                {/*                      onChange={(e: any) => form.handleChange(e)}*/}
                {/*                      onBlur={(e: any) => form.handleBlur(e)}*/}
                {/*                      value={form.values.userLimit} status={form.errors.userLimit ? 'error' : ''}*/}
                {/*                      disabled={disableForm || !admin} />*/}
                {/*    </KitInputWrapper>*/}
                {/*    <KitInputError label={form.errors.userLimit} />*/}
                {/*  </div>*/}
                {/*  <div className={styles.input}>*/}
                {/*    <KitCheckbox name="disabled"*/}
                {/*                 label="غیرفعال شده"*/}
                {/*                 onChange={(e: any) => form.handleChange(e)}*/}
                {/*                 value={form.values.disabled} disabled={disableForm || !manager || !admin} />*/}
                {/*    <KitInputError label={form.errors.disabled} />*/}
                {/*  </div>*/}
                {/*  <div className={styles.input}>*/}
                {/*    <KitCheckbox name="administrator"*/}
                {/*                 label="مدیر"*/}
                {/*                 onChange={(e: any) => form.handleChange(e)}*/}
                {/*                 value={form.values.administrator} disabled={disableForm || !admin} />*/}
                {/*    <KitInputError label={form.errors.administrator} />*/}
                {/*  </div>*/}
                {/*  <div className={styles.input}>*/}
                {/*    <KitCheckbox name="readonly"*/}
                {/*                 label="فقط خواندنی"*/}
                {/*                 onChange={(e: any) => form.handleChange(e)}*/}
                {/*                 value={form.values.readonly} disabled={disableForm || !manager || !admin} />*/}
                {/*    <KitInputError label={form.errors.readonly} />*/}
                {/*  </div>*/}
                {/*  <div className={styles.input}>*/}
                {/*    <KitCheckbox name="deviceReadonly"*/}
                {/*                 label="دستگاه فقط خواندنی"*/}
                {/*                 onChange={(e: any) => form.handleChange(e)}*/}
                {/*                 value={form.values.deviceReadonly} disabled={disableForm || !manager || !admin} />*/}
                {/*    <KitInputError label={form.errors.deviceReadonly} />*/}
                {/*  </div>*/}
                {/*  <div className={styles.input}>*/}
                {/*    <KitCheckbox name="limitCommands"*/}
                {/*                 label="دستورات محدود"*/}
                {/*                 onChange={(e: any) => form.handleChange(e)}*/}
                {/*                 value={form.values.limitCommands} disabled={disableForm || !manager || !admin} />*/}
                {/*    <KitInputError label={form.errors.limitCommands} />*/}
                {/*  </div>*/}
                {/*  <div className={styles.input}>*/}
                {/*    <KitCheckbox name="disableReports"*/}
                {/*                 label="گزارشات غیرفعال"*/}
                {/*                 onChange={(e: any) => form.handleChange(e)}*/}
                {/*                 value={form.values.disableReports} disabled={disableForm || !manager || !admin} />*/}
                {/*    <KitInputError label={form.errors.disableReports} />*/}
                {/*  </div>*/}
                {/*  <div className={styles.input}>*/}
                {/*    <KitCheckbox name="fixedEmail"*/}
                {/*                 label="عدم تغییر ایمیل"*/}
                {/*                 onChange={(e: any) => form.handleChange(e)}*/}
                {/*                 value={form.values.fixedEmail} disabled={disableForm || !manager || !admin} />*/}
                {/*    <KitInputError label={form.errors.fixedEmail} />*/}
                {/*  </div>*/}
                {/*</Card>*/}
                {/*{admin && registrationEnabled && form.values?.id === currentUser.id && !manager && (*/}
                {/*  <Card title={'حذف اکانت'} contentClassName={styles.inputs}>*/}
                {/*    <div className={styles.input}>*/}
                {/*      <KitInputWrapper label="ایمیل" required={false} name="email" direction={'col'}>*/}
                {/*        <KitInputText placeholder="ایمیل" name="deleteEmail"*/}
                {/*                      onChange={(e: any) => setDeleteEmail((e.target?.value) as any)}*/}
                {/*                      value={deleteEmail}*/}
                {/*                      disabled={disableForm} />*/}
                {/*      </KitInputWrapper>*/}
                {/*    </div>*/}
                {/*    <div className={styles.input}>*/}
                {/*      <Button*/}
                {/*        type="button"*/}
                {/*        onClick={() => {*/}
                {/*          handleDelete()*/}
                {/*        }}*/}
                {/*        title={'حذف اکانت'}*/}
                {/*        className={cls(*/}
                {/*          styles.inputButton,*/}
                {/*          'btn-primary',*/}
                {/*        )}*/}
                {/*        titleClassName={cls(styles.label)}*/}
                {/*        loading={disableForm} />*/}
                {/*    </div>*/}
              </Card>
              {/*)}*/}
              {/*<EditAttributes loading={loadingForm} attributes={form?.values?.attributes ?? null}*/}
              {/*                setAttributes={(attributes: any) => {*/}
              {/*                  form.setValues({...form.values, attributes})*/}
              {/*                }}*/}
              {/*                definitions={{...commonUserAttributes}}*/}
              {/*  // definitions={{...commonUserAttributes, ...userAttributes}}*/}
              {/*                disabled={id ? !permissions.includes('User-update') : !permissions.includes('User-persist')} />*/}
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

export default UserRegister
