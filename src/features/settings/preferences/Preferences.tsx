import {useNavigate} from 'react-router-dom'
import styles from '../SettingsCommon.module.css'
import cls from 'classnames'
import {useDispatch, useSelector} from 'react-redux'
import KitInputText from '../../../common/components/uiKits/dataEntry/kitInputText/KitInputText'
import KitTextArea from '../../../common/components/uiKits/dataEntry/kitTextArea/KitTextArea.tsx'
import KitInputWrapper from '../../../common/components/uiKits/dataEntry/kitInputWrapper/KitInputWrapper'
import KitInputError from '../../../common/components/uiKits/dataEntry/kitInputError/KitInputError'
import KitSelect from '../../../common/components/uiKits/dataEntry/kitSelect/KitSelect'
import KitDatePicker from '../../../common/components/uiKits/dataEntry/kitDatePicker/KitDatePicker'
import KitCheckbox from '../../../common/components/uiKits/dataEntry/kitCheckbox/KitCheckbox'
import useMessage from '../../../common/util/useMessage'
import React, {useEffect, useState} from 'react'
import useForm from '../../../common/util/useForm'
import Card from '../../../common/components/custom/dataDisplay/card/Card'
import Button from '../../../common/components/custom/general/button/Button'
import useMapStyles from '../../../common/map/core/useMapStyles.js'
import {useCatch} from '../../../common/util/reactHelper'
import store, {sessionActions} from '../../../common/clientStore'
import {FormikHelpers} from 'formik'
import {useAdministrator, useRestriction} from '../../../common/util/permissions'
import {useTranslation, useTranslationKeys} from '../../../common/components/LocalizationProvider'
import useMapOverlays from '../../../common/map/overlay/useMapOverlays.js'
import usePositionAttributes from '../../../common/attributes/usePositionAttributes.js'
import {prefixString, unprefixString} from '../../../common/util/stringUtils.js'
import SelectField from '../../../common/components/SelectField.tsx'
import moment from 'moment-jalaali'
import axiosInstance from '../../../common/util/axiosConfig.ts'
import KitInputNumber from '../../../common/components/uiKits/dataEntry/kitInputNumber/KitInputNumber.tsx'
import {usePreference, useUpdatePreference} from '../../../common/serverStore/usePreference.ts'
import {toJalaliMoment} from '../../../common/util/DateTimeUtil'
import PageWrapper from '../../../common/components/custom/feedback/pageWrapper/PageWrapper.tsx'
import PreferencesInputsWrapper from './PreferencesInputsWrapper'
import PreferencesActionsWrapper from './PreferencesActionsWrapper'

const mapLiveList = [
  {label: 'غیرفعال شده', value: 'none'},
  {label: 'دستگاه انتخاب شده', value: 'selected'},
  {label: 'همه ردیابها', value: 'all'},
]

const deviceFields = [
  {id: 'name', name: 'نام'},
  {id: 'uniqueId', name: 'سريال دستگاه'},
  {id: 'phone', name: 'تلفن'},
  {id: 'model', name: 'مدل'},
  {id: 'contact', name: 'تماس'},
]

const Preferences = () => {
  const t = useTranslation()
  const [loadingForm, setLoadingForm] = useState(false)
  const [disableForm, setDisableForm] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {contextHolder, showMessage} = useMessage()
  const readonly = useRestriction('readonly')
  const admin = true
  const user = useSelector((state: any) => state.session.user)
  const permissions = useSelector((state: any) => state.session.permissions)
  const versionApp = t('versionApp')
  const versionServer = useSelector((state: any) => state?.session?.server?.version)
  const socket = useSelector((state: any) => state.session.socket)
  const [token, setToken] = useState<any>(null)
  const [tokenExpiration, setTokenExpiration] = useState<string | undefined>()
  const mapStyles = useMapStyles()
  const mapOverlays = useMapOverlays()
  const positionAttributes = usePositionAttributes(t)
  const isAPN = import.meta.env.VITE_APP_APN_ENABLE?.toLowerCase?.() === 'true'

  const {data: preferences, isFetching, isLoading: isLoadingPreferences} = usePreference(user?.id)
  const updatePreferences = useUpdatePreference()

  useEffect(() => {
    if (preferences) {
      setForm({...preferences, ...preferences.attributes})
    }
  }, [preferences])

  // useEffect(() => {
  //   setDisableForm(isFetching)
  // }, [isFetching])

  const generateToken = useCatch(async () => {
    const timestamp = store.getState().session.timestamp // این باعث ری‌ رندر نمی‌شه
    const miladiString = toJalaliMoment(timestamp).add(1, 'week').locale('en').format('YYYY-MM-DD')
    setTokenExpiration(miladiString)
    const expiration = moment(miladiString, 'YYYY-MM-DD').toISOString()
    const response = await axiosInstance.post('/api/session/token', new URLSearchParams(`expiration=${expiration}`))
    if (response.status === 200) {
      setToken(response.data)
      setDisableForm(false)
    } else {
      setDisableForm(false)
      showMessage({message: t('responseWarningAPI'), type: 'error', duration: 2, key: 'save'})
      throw Error(response.data)
    }
  })

  const alarms = useTranslationKeys((it: any) => it.startsWith('alarm')).map((it) => ({
    key: unprefixString('alarm', it),
    name: t(it),
  }))

  const handleSave = useCatch(async (values: any, actions: FormikHelpers<any>) => {
    setDisableForm(true)

    const tmpValues = {
      ...values,
      attributes: {
        ...values.attributes,
        activeMapStyles: values?.activeMapStyles ? values?.activeMapStyles?.join(',') : [],
        selectedMapOverlay: values?.selectedMapOverlay,
        positionItems: values?.positionItems ? values?.positionItems?.join(',') : [],
        mapLiveRoutes: values?.mapLiveRoutes,
        mapDirection: values?.mapDirection,
        mapGeofences: values?.mapGeofences,
        mapFollow: values?.mapFollow,
        mapCluster: values?.mapCluster,
        mapOnSelect: values?.mapOnSelect,
        timezone: values?.timezone,
        poiLayer: values?.poiLayer,
        devicePrimary: values?.devicePrimary,
        deviceSecondary: values?.deviceSecondary,
        soundEvents: Array.isArray(values?.soundEvents) ? values?.soundEvents.join(',') : '',
        soundAlarms: Array.isArray(values?.soundAlarms) ? values?.soundAlarms.join(',') : '',
        web: {
          liveRouteLength: values.liveRouteLength,
          routeLinesLength: values.routeLinesLength,
          routeLocationsLength: values.routeLocationsLength,
        },
      },
    }

    delete tmpValues.web
    delete tmpValues.activeMapStyles
    delete tmpValues.selectedMapOverlay
    delete tmpValues.positionItems
    delete tmpValues.mapLiveRoutes
    delete tmpValues.mapDirection
    delete tmpValues.mapGeofences
    delete tmpValues.mapFollow
    delete tmpValues.mapCluster
    delete tmpValues.mapOnSelect
    delete tmpValues.devicePrimary
    delete tmpValues.deviceSecondary
    delete tmpValues.soundEvents
    delete tmpValues.soundAlarms
    delete tmpValues.altitudeUnit
    delete tmpValues.distanceUnit
    delete tmpValues.poiLayer
    delete tmpValues.speedUnit
    delete tmpValues.volumeUnit
    delete tmpValues.timezone
    delete tmpValues.liveRouteLength
    delete tmpValues.routeLinesLength
    delete tmpValues.routeLocationsLength

    try {
      await updatePreferences.mutateAsync({userId: user.id, preferences: tmpValues})
      dispatch(sessionActions.updateUser(tmpValues))
      setDisableForm(false)
      dispatch(sessionActions.updateLengthRoutes({
        routeLinesLength: values?.routeLinesLength,
        routeLocationsLength: values?.routeLocationsLength,
      }))
      showMessage({message: 'ثبت اطلاعات با موفقیت انجام شد', type: 'success', duration: 2, key: 'save'})
    } catch (e) {
      setDisableForm(false)
      showMessage({message: e?.response?.data?.message, type: 'error', duration: 2, key: 'save'})
    }
  })

  const handleCancelClick = () => {
    navigate('/')
  }

  const {form} = useForm({
    formGroup: {
      'activeMapStyles': {value: [], validations: [{required: 'انتخاب نقشه الزامی است'}]},
      'selectedMapOverlay': {value: '', validations: []},
      'positionItems': {value: [], validations: []},
      'mapLiveRoutes': {value: '', validations: []},
      'mapDirection': {value: '', validations: []},
      'mapGeofences': {value: false, validations: []},
      'mapFollow': {value: false, validations: []},
      'mapCluster': {value: false, validations: []},
      'mapOnSelect': {value: false, validations: []},
      'devicePrimary': {value: '', validations: []},
      'deviceSecondary': {value: '', validations: []},
      'soundEvents': {value: null, validations: []},
      'soundAlarms': {value: [], validations: []},
      'liveRouteLength': {value: [], validations: []},
      'routeLinesLength': {value: [], validations: []},
      'routeLocationsLength': {value: [], validations: []},
    },
    handleSubmit: handleSave,
  })

  const setForm = (values: any) => {
    const tmpValues = {
      ...values,
      activeMapStyles: values?.activeMapStyles?.split(',') || ['locationIqStreets', 'osm', 'carto'],
      positionItems: values?.positionItems?.split(',') || ['speed', 'address', 'totalDistance', 'course'],
      mapLiveRoutes: values?.mapLiveRoutes || 'selected',
      liveRouteLength: values?.attributes?.web?.liveRouteLength || 10,
      routeLinesLength: values?.attributes?.web?.routeLinesLength || 5,
      routeLocationsLength: values?.attributes?.web?.routeLocationsLength || 10,
      mapDirection: values?.mapDirection || 'selected',
      mapGeofences: values?.hasOwnProperty('mapGeofences') ? values.mapGeofences : true,
      mapFollow: values?.hasOwnProperty('mapFollow') ? values.mapFollow : true,
      mapCluster: values?.hasOwnProperty('mapCluster') ? values.mapCluster : true,
      mapOnSelect: values?.hasOwnProperty('mapOnSelect') ? values.mapOnSelect : true,
      devicePrimary: values?.devicePrimary || 'name',
      soundEvents: values?.soundEvents ? String(values?.soundEvents).split(',') || '' : '',
      soundAlarms: values?.soundAlarms ? String(values?.soundAlarms).split(',') || ['sos'] : '',
    }
    form.setValues(tmpValues)
  }

  const copyToClipboard = (content: string) => {
    if (window.isSecureContext && navigator.clipboard) {
      navigator.clipboard.writeText(content)
    }
  }

  return (
    <>
      {contextHolder}
      <PageWrapper>
        <div className={styles.settings}>
          <div className={styles.settingsContainer}>
            <form
              onSubmit={form.handleSubmit}
              className={cls(styles.form, 'flex flex-col h-full')}
            >
              <PreferencesInputsWrapper containerId="preferencesInputsContainer">
                <Card title={'نقشه'} contentClassName={styles.inputsSettings}>
                  {!isAPN && <div className={styles.input}>
                    <KitInputWrapper label="نقشه های فعال" required={true} name="activeMapStyles"
                                     loading={isLoadingPreferences} direction={'col'}>
                      <KitSelect placeholder="نقشه های فعال" name="activeMapStyles"
                                 optionLabel={'title'}
                                 optionValue={'id'}
                                 isDefaultOption={false}
                                 options={mapStyles.filter(style => style['available'])}
                                 allowClear={true}
                                 showSearch={true}
                                 onChange={(e) => {
                                   form.setFieldValue('activeMapStyles', e ?? [])
                                 }}
                                 onBlur={(e) => form.handleBlur(e)}
                                 onSelect={(e) => {
                                   const clicked = mapStyles.find((s) => s.id == e as any)
                                   if (clicked) {
                                     if (clicked.available) {
                                       // setAttributes({...attributes, activeMapStyles: e})
                                     } else if (clicked.id !== 'custom') {
                                       const query = new URLSearchParams({attribute: String(clicked.attribute)})
                                       navigate(`/settings/user/${user.id}?${query.toString()}`)
                                     }
                                   }
                                   form.handleChange(e)
                                 }}
                                 value={form.values.activeMapStyles}
                                 status={form.errors.activeMapStyles ? 'error' : ''}
                                 disabled={disableForm || readonly || !admin}
                                 mode={'multiple'} />
                    </KitInputWrapper>
                    <KitInputError label={form.errors.activeMapStyles} />
                  </div>}
                  {/*<div className={styles.input}>*/}
                  {/*  <KitInputWrapper label="لایه نقشه" required={false} name="selectedMapOverlay" direction={'col'}>*/}
                  {/*    <KitSelect placeholder="لایه نقشه" name="selectedMapOverlay"*/}
                  {/*               optionLabel={'title'}*/}
                  {/*               optionValue={'id'}*/}
                  {/*               isDefaultOption={false}*/}
                  {/*               options={mapOverlays}*/}
                  {/*               allowClear={true}*/}
                  {/*               showSearch={true}*/}
                  {/*               onChange={(e) => {*/}
                  {/*                 form.setFieldValue('selectedMapOverlay', e)*/}
                  {/*                 const clicked = mapOverlays.find((o) => o.id == e as any)*/}
                  {/*                 if (!clicked || clicked.available) {*/}
                  {/*                   form.setFieldValue('selectedMapOverlay', e)*/}
                  {/*                 } else if (clicked.id !== 'custom') {*/}
                  {/*                   const query = new URLSearchParams({attribute: String(clicked.attribute)})*/}
                  {/*                   // navigate(`/settings/user/${user.id}?${query.toString()}`)*/}
                  {/*                 }*/}
                  {/*               }}*/}
                  {/*               onBlur={(e) => form.handleBlur(e)}*/}
                  {/*               onSelect={(e) => {*/}
                  {/*                 form.handleChange(e)*/}
                  {/*               }}*/}
                  {/*               value={form.values.selectedMapOverlay}*/}
                  {/*               status={form.errors.selectedMapOverlay ? 'error' : ''}*/}
                  {/*               disabled={disableForm} />*/}
                  {/*  </KitInputWrapper>*/}
                  {/*  <KitInputError label={form.errors.selectedMapOverlay} />*/}
                  {/*</div>*/}
                  {/*<div className={styles.input}>*/}
                  {/*  <KitInputWrapper label="اطلاعات Popup" required={false} name="positionItems" direction={'col'}>*/}
                  {/*    <KitSelect placeholder="اطلاعات Popup" name="positionItems"*/}
                  {/*               optionLabel={'name'}*/}
                  {/*               optionValue={'key'}*/}
                  {/*               isDefaultOption={false}*/}
                  {/*               options={Object.entries(positionAttributes).map(([key, value]) => {*/}
                  {/*                 return {key, ...value}*/}
                  {/*               })}*/}
                  {/*               allowClear={true}*/}
                  {/*               showSearch={true}*/}
                  {/*               onChange={(e) => form.setFieldValue('positionItems', e)}*/}
                  {/*               onBlur={(e) => form.handleBlur(e)}*/}
                  {/*               onSelect={(e) => {*/}
                  {/*                 form.handleChange(e)*/}
                  {/*               }}*/}
                  {/*               value={form.values.positionItems} status={form.errors.positionItems ? 'error' : ''}*/}
                  {/*               disabled={disableForm}*/}
                  {/*               mode={'multiple'} />*/}
                  {/*  </KitInputWrapper>*/}
                  {/*  <KitInputError label={form.errors.positionItems} />*/}
                  {/*</div>*/}
                  <div className={styles.input}>
                    <KitInputWrapper label="تعقیب مسیر" required={false} name="mapLiveRoutes"
                                     loading={isLoadingPreferences} direction={'col'}>
                      <KitSelect placeholder="تعقیب مسیر" name="mapLiveRoutes"
                                 optionLabel={'label'}
                                 optionValue={'value'}
                                 isDefaultOption={false}
                                 options={mapLiveList}
                                 allowClear={false}
                                 showSearch={true}
                                 onChange={(e) => form.setFieldValue('mapLiveRoutes', e)}
                                 onBlur={(e) => form.handleBlur(e)}
                                 onSelect={(e) => {
                                   form.handleChange(e)
                                 }}
                                 value={form.values.mapLiveRoutes} status={form.errors.mapLiveRoutes ? 'error' : ''}
                                 disabled={disableForm || readonly || !admin} />
                    </KitInputWrapper>
                    <KitInputError label={form.errors.mapLiveRoutes} />
                  </div>
                  <div className={styles.input}>
                    <KitInputWrapper label="نمایش جهت" required={false} name="mapDirection"
                                     loading={isLoadingPreferences} direction={'col'}>
                      <KitSelect placeholder="نمایش جهت" name="mapDirection"
                                 optionLabel={'label'}
                                 optionValue={'value'}
                                 isDefaultOption={false}
                                 options={mapLiveList}
                                 allowClear={false}
                                 showSearch={true}
                                 onChange={(e) => form.setFieldValue('mapDirection', e)}
                                 onBlur={(e) => form.handleBlur(e)}
                                 onSelect={(e) => {
                                   form.handleChange(e)
                                 }}
                                 value={form.values.mapDirection} status={form.errors.mapDirection ? 'error' : ''}
                                 disabled={disableForm || readonly || !admin} />
                    </KitInputWrapper>
                    <KitInputError label={form.errors.mapDirection} />
                  </div>
                  <div className={styles.input}>
                    <KitInputWrapper label="تعداد پرچم توقف" required={false} name="liveRouteLength"
                                     loading={isLoadingPreferences} direction={'col'}>
                      <KitInputNumber placeholder="تعداد پرچم توقف" name="liveRouteLength"
                                      onChange={(e) => form.handleChange(e as any)}
                                      value={form.values.liveRouteLength}
                                      classname={'!w-full'}
                                      disabled={disableForm || readonly || !admin}
                                      status={form.errors.liveRouteLength ? 'error' : ''} />
                    </KitInputWrapper>
                    <KitInputError label={form.errors.liveRouteLength} />
                  </div>
                  <div className={styles.input}>
                    <KitInputWrapper label="تعداد خط مسیر" required={false} name="routeLinesLength"
                                     loading={isLoadingPreferences} direction={'col'}>
                      <KitInputNumber placeholder="تعداد خط مسیر" name="routeLinesLength"
                                      onChange={(e) => form.handleChange(e as any)}
                                      value={form.values.routeLinesLength}
                                      classname={'!w-full'}
                                      disabled={disableForm || readonly || !admin}
                                      status={form.errors.routeLinesLength ? 'error' : ''} />
                    </KitInputWrapper>
                    <KitInputError label={form.errors.routeLinesLength} />
                  </div>
                  <div className={styles.input}>
                    <KitInputWrapper label="تعداد نقاط خط مسیر" required={false} name="routeLocationsLength"
                                     loading={isLoadingPreferences} direction={'col'}>
                      <KitInputNumber placeholder="تعداد نقاط خط مسیر" name="routeLocationsLength"
                                      onChange={(e) => form.handleChange(e as any)}
                                      value={form.values.routeLocationsLength}
                                      classname={'!w-full'}
                                      disabled={disableForm || readonly || !admin}
                                      status={form.errors.routeLocationsLength ? 'error' : ''} />
                    </KitInputWrapper>
                    <KitInputError label={form.errors.routeLocationsLength} />
                  </div>
                  {/*<div className={styles.input}>*/}
                  {/*  <KitCheckbox name="mapGeofences"*/}
                  {/*               label="نمایش حصار مجازی"*/}
                  {/*               onChange={(e) => form.handleChange(e)}*/}
                  {/*               value={form.values.mapGeofences}*/}
                  {/*               disabled={disableForm || readonly || !admin} />*/}
                  {/*  <KitInputError label={form.errors.mapGeofences} />*/}
                  {/*</div>*/}
                  {/*<div className={styles.input}>*/}
                  {/*  <KitInputWrapper label="" required={false} name="mapFollow"*/}
                  {/*                   loading={isLoadingPreferences} direction={'col'}>*/}
                  {/*    <KitCheckbox name="mapFollow"*/}
                  {/*                 label="تعقیب"*/}
                  {/*                 onChange={(e) => form.handleChange(e)}*/}
                  {/*                 value={form.values.mapFollow}*/}
                  {/*                 disabled={disableForm || readonly || !admin} />*/}
                  {/*    <KitInputError label={form.errors.mapFollow} />*/}
                  {/*  </KitInputWrapper>*/}
                  {/*</div>*/}
                  {/*<div className={styles.input}>*/}
                  {/*  <KitCheckbox name="mapCluster"*/}
                  {/*               label="خوشه بندی نشانگرها"*/}
                  {/*               onChange={(e) => form.handleChange(e)}*/}
                  {/*               value={form.values.mapCluster}*/}
                  {/*               disabled={disableForm || readonly || !admin} />*/}
                  {/*  <KitInputError label={form.errors.mapCluster} />*/}
                  {/*</div>*/}
                  {/*<div className={styles.input}>*/}
                  {/*  <KitCheckbox name="mapOnSelect"*/}
                  {/*               label="نمایش نقشه در انتخاب"*/}
                  {/*               onChange={(e) => form.handleChange(e)}*/}
                  {/*               value={form.values.mapOnSelect}*/}
                  {/*               disabled={disableForm || readonly || !admin} />*/}
                  {/*  <KitInputError label={form.errors.mapOnSelect} />*/}
                  {/*</div>*/}
                </Card>
                {/*<Card title={'دستگاه ها'} contentClassName={styles.inputs}>*/}
                {/*  <div className={styles.input}>*/}
                {/*    <KitInputWrapper label="عنوان دستگاه" required={false} name="devicePrimary" direction={'col'}>*/}
                {/*      <SelectField*/}
                {/*        value={form.values.devicePrimary}*/}
                {/*        onChange={(e: any) => form.setFieldValue('devicePrimary', e)}*/}
                {/*        data={deviceFields}*/}
                {/*        titleGetter={'name'}*/}
                {/*        label={'عنوان دستگاه'}*/}
                {/*        status={form.errors.devicePrimary ? 'error' : ''}*/}
                {/*        disabled={disableForm || readonly || !admin}*/}
                {/*      />*/}
                {/*    </KitInputWrapper>*/}
                {/*    <KitInputError label={form.errors.devicePrimary} />*/}
                {/*  </div>*/}
                {/*  <div className={styles.input}>*/}
                {/*    <KitInputWrapper label="جزئیات دستگاه" required={false} name="deviceSecondary" direction={'col'}>*/}
                {/*      <SelectField*/}
                {/*        value={form.values.deviceSecondary}*/}
                {/*        onChange={(e: any) => form.setFieldValue('deviceSecondary', e)}*/}
                {/*        data={deviceFields}*/}
                {/*        titleGetter={'name'}*/}
                {/*        label={'جزئیات دستگاه'}*/}
                {/*        status={form.errors.deviceSecondary ? 'error' : ''}*/}
                {/*        disabled={disableForm || readonly || !admin}*/}
                {/*      />*/}
                {/*    </KitInputWrapper>*/}
                {/*    <KitInputError label={form.errors.deviceSecondary} />*/}
                {/*  </div>*/}
                {/*</Card>*/}
                {/*<Card title={'صدای هشدار'} contentClassName={styles.inputs}>*/}
                {/*  <div className={styles.input}>*/}
                {/*    <KitInputWrapper label="رویدادهای صدا" required={false} name="soundEvents" direction={'col'}>*/}
                {/*      <SelectField*/}
                {/*        value={form.values.soundEvents}*/}
                {/*        onChange={(e: any) => form.setFieldValue('soundEvents', e)}*/}
                {/*        endpoint={'/api/notifications/types'}*/}
                {/*        keyGetter={'type'}*/}
                {/*        titleGetter={'name'}*/}
                {/*        label={'رویدادهای صدا'}*/}
                {/*        status={form.errors.soundEvents ? 'error' : ''}*/}
                {/*        mapItems={(it: any) => t(prefixString('event', it.type))}*/}
                {/*        multiple={true}*/}
                {/*        disabled={disableForm}*/}
                {/*      />*/}
                {/*    </KitInputWrapper>*/}
                {/*    <KitInputError label={form.errors.soundEvents} />*/}
                {/*  </div>*/}
                {/*  <div className={styles.input}>*/}
                {/*    <KitInputWrapper label="هشدار صوتی" required={false} name="soundAlarms" direction={'col'}>*/}
                {/*      <SelectField*/}
                {/*        value={form.values.soundAlarms}*/}
                {/*        onChange={(e: any) => form.setFieldValue('soundAlarms', e)}*/}
                {/*        data={alarms}*/}
                {/*        keyGetter={'key'}*/}
                {/*        titleGetter={'name'}*/}
                {/*        label={'هشدار صوتی'}*/}
                {/*        status={form.errors.soundAlarms ? 'error' : ''}*/}
                {/*        multiple={true}*/}
                {/*        disabled={disableForm}*/}
                {/*      />*/}
                {/*    </KitInputWrapper>*/}
                {/*    <KitInputError label={form.errors.soundAlarms} />*/}
                {/*  </div>*/}
                {/*</Card>*/}

                {/*<Card title={'رمز یکبار مصرف'} contentClassName={styles.inputs}>*/}
                {/*  <div className={styles.input}>*/}
                {/*    <KitInputWrapper label="تاریخ انقضاء" required={false} name="expirationTime" direction={'col'}>*/}
                {/*      <KitDatePicker placeholder="تاریخ انقضاء" name="expirationTime" value={tokenExpiration}*/}
                {/*                     onChange={(e) => {*/}
                {/*                       // form.handleChange(e)*/}
                {/*                       setTokenExpiration(e.target.value)*/}
                {/*                       setToken(null)*/}
                {/*                     }}*/}
                {/*        // onBlur={(e) => form.handleBlur(e)}*/}
                {/*        // status={form.errors.expirationTime ? 'error' : ''}*/}
                {/*                     disabled={disableForm} />*/}
                {/*    </KitInputWrapper>*/}
                {/*    /!*<KitInputError label={form.errors.expirationTime} />*!/*/}
                {/*  </div>*/}
                {/*  <div className={styles.input}>*/}
                {/*    <KitInputWrapper label="توکن" required={false} name="token" direction={'col'}>*/}
                {/*      <KitTextArea placeholder="توکن" name="token" value={token || ''} disabled={true} />*/}
                {/*    </KitInputWrapper>*/}
                {/*  </div>*/}
                {/*  <div className={styles.inputWrapper}>*/}
                {/*    <div className={styles.input}>*/}
                {/*      <Button*/}
                {/*        type="button"*/}
                {/*        onClick={generateToken}*/}
                {/*        title={''}*/}
                {/*        className={cls(*/}
                {/*          styles.inputButton,*/}
                {/*          'fa fa-rotate',*/}
                {/*          'btn-primary',*/}
                {/*        )}*/}
                {/*        titleClassName={cls(styles.label)}*/}
                {/*        loading={false}*/}
                {/*        disabled={disableForm} />*/}
                {/*    </div>*/}
                {/*    <div className={styles.input}>*/}
                {/*      <Button*/}
                {/*        type="button"*/}
                {/*        onClick={() => {*/}
                {/*          copyToClipboard(token)*/}
                {/*        }}*/}
                {/*        title={''}*/}
                {/*        className={cls(*/}
                {/*          styles.inputButton,*/}
                {/*          'fa fa-copy',*/}
                {/*          'btn-primary',*/}
                {/*        )}*/}
                {/*        titleClassName={cls(styles.label)}*/}
                {/*        loading={false}*/}
                {/*        disabled={disableForm} />*/}
                {/*    </div>*/}
                {/*  </div>*/}
                {/*</Card>*/}
                {/*{!readonly && (<Card title={'اطلاعات'} contentClassName={styles.inputs}>*/}
                {/*    <div className={styles.input}>*/}
                {/*      <KitInputWrapper label="نسخه برنامه" required={false} name="versionApp" direction={'col'}*/}
                {/*                       loading={false}>*/}
                {/*        <KitInputText placeholder="نسخه برنامه" name="versionApp"*/}
                {/*                      value={versionApp}*/}
                {/*                      disabled={true} maxLength={50} />*/}
                {/*      </KitInputWrapper>*/}
                {/*      /!*<KitInputError label={form.errors.name} />*!/*/}
                {/*    </div>*/}
                {/*    <div className={styles.input}>*/}
                {/*      <KitInputWrapper label="نسخه سرور" required={false} name="versionServer" direction={'col'}*/}
                {/*                       loading={false}>*/}
                {/*        <KitInputText placeholder="نسخه سرور" name="versionServer"*/}
                {/*                      value={versionServer || '-'}*/}
                {/*                      disabled={true} maxLength={50} />*/}
                {/*      </KitInputWrapper>*/}
                {/*      /!*<KitInputError label={form.errors.name} />*!/*/}
                {/*    </div>*/}
                {/*    <div className={styles.input}>*/}
                {/*      <KitInputWrapper label="ارتباط" required={false} name="versionApp" direction={'col'}*/}
                {/*                       loading={false}>*/}
                {/*        <KitInputText placeholder="ارتباط" name="versionApp"*/}
                {/*                      value={socket ? 'آنلاین' : 'آفلاین'}*/}
                {/*                      disabled={true} maxLength={50} />*/}
                {/*      </KitInputWrapper>*/}
                {/*      /!*<KitInputError label={form.errors.name} />*!/*/}
                {/*    </div>*/}
                {/*  </Card>*/}
                {/*)}*/}
              </PreferencesInputsWrapper>
              {(!readonly && admin) && (
                <PreferencesActionsWrapper>
                  <div className={styles.actions}>
                    <Button
                      type="submit"
                      title={'ثبت'}
                      disabled={!form.isValid || disableForm || loadingForm}
                      className={cls(
                        styles.button,
                        styles.registerButton,
                        'btn-primary',
                      )}
                      fontClassName={'fa fa-check'}
                      titleClassName={cls(styles.label, styles.registerLabel)}
                      loading={disableForm} />
                  </div>
                </PreferencesActionsWrapper>
              )}
            </form>
          </div>
        </div>
      </PageWrapper>
    </>
  )
}

export default Preferences
