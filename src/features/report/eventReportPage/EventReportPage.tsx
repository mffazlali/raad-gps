import {useNavigate} from 'react-router-dom'
import styles from '../ReportsCommon.module.css'
import cls from 'classnames'
import useMessage from '../../../common/util/useMessage.tsx'
import React, {useEffect, useLayoutEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useAttributePreference, usePreference} from '../../../common/util/preferences'
import {useCatch, useEffectAsync} from '../../../common/util/reactHelper'
import Button from '../../../common/components/custom/general/button/Button.tsx'
import {devicesActions, reportsActions} from '../../../common/clientStore'
import PageWrapper from '../../../common/components/custom/feedback/pageWrapper/PageWrapper.tsx'
import KitInputWrapper from '../../../common/components/uiKits/dataEntry/kitInputWrapper/KitInputWrapper.tsx'
import KitInputError from '../../../common/components/uiKits/dataEntry/kitInputError/KitInputError.tsx'
import KitSelect from '../../../common/components/uiKits/dataEntry/kitSelect/KitSelect.tsx'
import KitDatePicker from '../../../common/components/uiKits/dataEntry/kitDatePicker/KitDatePicker.tsx'
import useForm from '../../../common/util/useForm.tsx'
import {FormikHelpers} from 'formik'
import {formatTime} from '../../../common/util/formatter'
import usePositionAttributes from '../../../common/attributes/usePositionAttributes'
import {useTranslation} from '../../../common/components/LocalizationProvider'
import {prefixString} from '../../../common/util/stringUtils'
import MapView from '../../../common/map/core/MapView.jsx'
import MapGeofence from '../../../common/map/MapGeofence'
import MapPositions from '../../../common/map/MapPositions'
import MapCamera from '../../../common/map/MapCamera'
import {ColumnsKitGridType} from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGridType.ts'
import KitGrid from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGrid.tsx'
import {preoids, eventTypes as eventTypesUtil, eventTypes} from '../../../common/util/constants.js'
import MapDevicePositions from '../../../common/map/MapDevicePositions'
import axiosInstance from '../../../common/util/axiosConfig.ts'
import useApiFileDownload from '../../../common/util/apiFileDownload'
import {useDevices} from '../../../common/serverStore'
import Collapse from '../../../common/components/custom/feedback/collapse/Collapse.tsx'
import ReportCard from '../../../common/components/custom/feedback/card/ReportCard.tsx'
import SpinnerContainer from '../../../common/components/custom/feedback/spinnerContainer/SpinnerContainer.tsx'
import usePeriodChange from '../../../common/util/usePeriodChange.tsx'

const EventReportPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {contextHolder, showMessage} = useMessage()
  const deviceId = useSelector((state) => Object(state).devices.selectedId)
  const period = useSelector((state) => Object(state).reports.period)
  const from = useSelector((state) => Object(state).reports.from)
  const to = useSelector((state) => Object(state).reports.to)
  const eventsType = useSelector((state) => Object(state).reports.eventsType)
  const geofences = useSelector((state) => Object(state).geofences.items)
  const hours12 = usePreference('twelveHourFormat')
  const speedUnit = useAttributePreference('speedUnit')
  const {apiFileDownloader} = useApiFileDownload()
  const [items, setItems] = useState<any[]>([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [position, setPosition] = useState(null)
  const [loading, setLoading] = useState(false)
  const [periodState, setPeriodState] = useState(period)
  const [available, setAvailable] = useState<any[]>([])
  const [type, setType] = useState('')
  const [eventTypes, setEventTypes] = useState(['allEvents'])
  const [allEventTypes, setAllEventTypes] = useState<any[]>([])
  const t = useTranslation()
  const {triggerPeriodChange} = usePeriodChange()
  const positionAttributes = usePositionAttributes(t)
  const currentUser = useSelector((state: any) => state?.session?.user)
  const {data: devices = []} = useDevices(currentUser?.id)

  const handleShow = useCatch(async (values: any, actions: FormikHelpers<any>) => {
    try {
      showMessage({message: t('responsePreWaitingAPI'), type: 'info', key: 'save'})
      const query = new URLSearchParams({deviceId: values.deviceId, from: values.from, to: values.to})
      if (values.type != null) {
        values.type.forEach((it: any) => query.append('type', it))
      }
      if (type === 'export') {
        // window.location.assign(`/api/reports/events/xlsx?${query.toString()}`)
        const url = `/api/reports/events/xlsx?${query.toString()}`
        apiFileDownloader('event', url)
      } else if (type === 'mail') {
        const response = await axiosInstance.get(`/api/reports/events/mail?${query.toString()}`)
        if (response.status !== 200) {
          throw Error(response.data)
        }
      } else {
        setLoading(true)
        try {
          const response = await axiosInstance.get(`/api/reports/events?${query.toString()}`, {
            headers: {Accept: 'application/json'},
          })
          if (response.status === 200) {
            setItems(response.data)
          } else {
            throw Error(response.data)
          }
        } finally {
          setLoading(false)
          setPosition(null)
          setSelectedItem(null)
          showMessage({message: t('responsePreWaitingAPI'), type: 'info', duration: 0.5, key: 'save'})
        }
      }
    } catch (e: any) {
      if (e.message === 'Failed to fetch') {
        showMessage({message: t('responseConnectAPI'), type: 'error', duration: 2, key: 'save'})
      } else {
        // showMessage({message: t('responseErrorAPI'), type: 'error', duration: 2, key: 'save'})
      }
    }
  })

  const {form} = useForm({
    formGroup: {
      'deviceId': {value: null, validations: [{'required': 'وارد کردن دستگاه الزامی است'}]},
      'from': {value: '', validations: []},
      'to': {value: '', validations: []},
      'type': {value: null, validations: [{'required': 'وارد کردن نوع رویدادها الزامی است'}]},
    },
    handleSubmit: handleShow,
    isInitialValid: true,
  })

  useEffect(() => {
    handlePeriodChange(period)
    initForm()
  }, [])

  useEffectAsync(async () => {
    if (selectedItem) {
      const response = await axiosInstance.get(`/api/positions?id=${selectedItem['positionId']}`)
      if (response.status === 200) {
        const positions = response.data
        if (positions.length > 0) {
          setPosition(positions[0])
        }
      } else {
        throw Error(response.data)
      }
    } else {
      setPosition(null)
    }
  }, [selectedItem])

  useLayoutEffect(() => {
    getTypes()
  }, [])

  const getTypes = async () => {
    // const response = await axiosInstance.get('/api/notifications/types')
    // if (response.status === 200) {
    //   let types =  response.data
    //   types = types.filter((item: any) => {
    //     return (['alarm','deviceOnline', 'deviceOffline', 'deviceOverspeed', 'ignitionOn', 'ignitionOff'].includes(item?.type))
    //   })
    //   types=[{value: 'allEvents', label: 'همه رویداد ها'}, ...types.map((it: any) => {
    //     return {value: it.type, label: t(prefixString('event', it.type))}
    //   })]
    //   console.log(JSON.stringify(types))
    //   setAllEventTypes(types)
    // } else {
    //   throw Error(await response.text())
    // }
    const types = eventTypesUtil.filter((item: any) => {
      return (['alarm', 'deviceOnline', 'deviceOffline', 'deviceOverspeed', 'ignitionOn', 'ignitionOff', 'geofenceEnter', 'geofenceExit', 'slopeOfArm', 'digitalInput', 'digitalOutput'].includes(item?.value))
    })
    setAllEventTypes(types)
  }

  const initForm = () => {
    form.setFieldValue('deviceId', deviceId)
    form.setFieldValue('from', from)
    form.setFieldValue('to', to)
    form.setFieldValue('type', eventsType)
    handlePeriodChange(String(period))
  }

  const cellRender = (params: any) => {
    return <div className={styles.actionsGrid}>
      {(params.data.positionId && params.data.positionId != 0) ? <button
        onClick={() => {
          setSelectedItem(params.data)
        }}
        type="button"
        className={cls(styles.locationAction, 'fa fa-location-crosshairs')}
        title={'نقشه'}>
      </button> : <span></span>}
    </div>
  }

  const columns: ColumnsKitGridType = [
    {
      headerName: 'زمان ثبت',
      field: 'eventTime',
      valueFormatter: (p) => formatTime(p.value, 'seconds', hours12),
    },
    {
      headerName: 'نوع خط',
      field: 'type',
      valueFormatter: (p) => {
        let result: string = ''
        if (p.value) {
          if (p.value == 'alarm') {
            const alarms = p.data.attributes.alarm
            result = alarms.split(',').map(alarm => t(prefixString('alarm', alarm))).reduce((a, c) => `${a}, ${c}`)
          } else {
            const filters: any[] = eventTypesUtil.filter(event => event.value == p.value)
            if (filters.length > 0) {
              result = `${filters[0].label}`
            } else {
              result = ''
            }
          }
        }
        return result
      },
    },
    // {
    //   headerName: 'دیتا',
    //   field: 'geofenceId',
    //   valueFormatter: (p) => p.value > 0 ? geofences[p.value].name : '',
    // },
    // {
    //   headerName: 'حصار جغرافیایی',
    //   field: 'maintenanceId',
    //   valueFormatter: (p) => p.value > 0 ? 'بلی' : null,
    // },
    // {
    //   headerName: 'نقشه',
    //   field: 'button',
    //   pinned: 'right',
    //   cellRenderer: cellRender,
    // },
  ]

  const handlePeriodChange = (period: any) => {
    setPeriodState(period)
    const {selectedFrom,selectedTo}=triggerPeriodChange(period)
    if (selectedFrom != null && selectedTo != null) {
      form.setFieldValue('from', selectedFrom ?? '')
      form.setFieldValue('to', selectedTo ?? '')
      dispatch(reportsActions.updateFrom(selectedFrom))
      dispatch(reportsActions.updateTo(selectedTo))
    } else {
      form.setFieldValue('from', '')
      form.setFieldValue('to', '')
      dispatch(reportsActions.updateFrom(''))
      dispatch(reportsActions.updateTo(''))
    }
  }


  return (
    <>
      {contextHolder}
      <PageWrapper>
        <div className={styles.report}>
          <div id="reportContainer" className={styles.reportContainer}>
            <Collapse
              header={<div>فیلترها</div>}
              fixedHeader={true}
              defaultOpen={true}>
              <form
                onSubmit={(e) => form.handleSubmit(e)}
                onChange={(e) => form.handleChange(e)}
                className={styles.form}
              >
                <div className={cls(styles.inputsWrapper)}>
                  <div className={styles.input}>
                    <KitInputWrapper label="دستگاه ها" required={true}
                                     name="deviceId" direction={'col'}>
                      <KitSelect placeholder="دستگاه ها" name="deviceId"
                                 optionLabel={'name'}
                                 optionValue={'id'}
                                 options={devices}
                                 allowClear={true}
                                 showSearch={true}
                                 onChange={(e) => {
                                   form.setFieldValue('deviceId', e)
                                   dispatch(devicesActions.selectId(e))
                                 }}
                                 onClear={() => {
                                   form.setFieldValue('deviceId', '')
                                   dispatch(devicesActions.selectId(null))
                                 }}
                                 value={form.values.deviceId}
                                 classname={'w-[90%]'}
                                 status={form.errors.deviceId ? 'error' : ''} />
                    </KitInputWrapper>
                    <KitInputError label={form.errors.deviceId} />
                  </div>
                  <div className={styles.input}>
                    <KitInputWrapper label="بازه" required={false}
                                     name="period" direction={'col'}>
                      <KitSelect placeholder="بازه" name="period"
                                 options={preoids}
                                 allowClear={false}
                                 showSearch={true}
                                 onChange={(e) => {
                                   dispatch(reportsActions.updatePeriod(String(e)))
                                   handlePeriodChange(e)
                                 }}
                                 value={period}
                                 classname={'w-[90%]'} />
                    </KitInputWrapper>
                  </div>
                  <div className={styles.input}>
                    <KitInputWrapper label="نوع رویدادها" required={true}
                                     name="type" direction={'col'}>
                      <KitSelect placeholder="نوع رویدادها" name="type"
                                 options={allEventTypes}
                                 allowClear={true}
                                 showSearch={true}
                                 mode={'multiple'}
                                 onChange={(e) => {
                                   form.setFieldValue('type', e)
                                   dispatch(reportsActions.updateEventsType(e))
                                 }}
                                 onClear={() => {
                                   form.setFieldValue('type', '')
                                   dispatch(reportsActions.updateEventsType(null))
                                 }}
                                 value={form.values.type}
                                 classname={'w-[90%]'}
                                 status={form.errors.type ? 'error' : ''} />
                    </KitInputWrapper>
                    <KitInputError label={form.errors.type} />
                  </div>
                  {periodState == 7 &&
                    <>
                      <div className={styles.input}>
                        <KitInputWrapper label="از" required={false}
                                         name="from"
                                         direction={'col'}>
                          <KitDatePicker placeholder="از" name="from" value={form.values.from}
                                         onChange={(e) => {
                                           form.handleChange(e)
                                           dispatch(reportsActions.updateFrom(e.target.value))
                                         }}
                                         onBlur={(e) => form.handleBlur(e)}
                                         classname={'w-[90%]'}
                                         dateMode={'datetime'} />
                        </KitInputWrapper>
                      </div>
                      <div className={styles.input}>
                        <KitInputWrapper label="تا" required={false}
                                         name="to"
                                         direction={'col'}>
                          <KitDatePicker placeholder="تا" name="to" value={form.values.to}
                                         onChange={(e) => {
                                           form.handleChange(e)
                                           dispatch(reportsActions.updateTo(e.target.value))
                                         }}
                                         onBlur={(e) => form.handleBlur(e)}
                                         classname={'w-[90%]'}
                                         dateMode={'datetime'} />
                        </KitInputWrapper>
                      </div>
                    </>
                  }
                </div>
                <div className={styles.actions}>
                  <Button
                    type="button"
                    onClick={() => {
                      setType('')
                      form.submitForm()
                    }}
                    title={'نمایش'}
                    className={cls(
                      styles.button,
                      styles.registerButton,
                      'btn-primary',
                    )}
                    titleClassName={cls(styles.label, styles.registerLabel)}
                    fontClassName={'fa fa-magnifying-glass'}
                    disabled={!form.isValid}
                  />
                  {/*<Button*/}
                  {/*  onClick={() => {*/}
                  {/*    setType('export')*/}
                  {/*    form.submitForm()*/}
                  {/*  }}*/}
                  {/*  type="button"*/}
                  {/*  title={'خروجی فایل'}*/}
                  {/*  className={cls(*/}
                  {/*    styles.button,*/}
                  {/*    styles.registerButton,*/}
                  {/*    'btn-primary',*/}
                  {/*  )}*/}
                  {/*  titleClassName={cls(styles.label, styles.registerLabel)}*/}
                  {/*  disabled={!form.isValid} />*/}
                </div>
              </form>
            </Collapse>
            <ReportCard
              containerId="reportContainer"
              isLoading={loading}
              className={'h-[400px]'}
              mapContent={
                selectedItem && position && (
                  <div className={cls(styles.containerMap, 'reportMap')}>
                    {loading && <SpinnerContainer />}
                    <MapView zoomCheck={true}>
                      {/*<MapGeofence />*/}
                      {/*{position && <MapPositions positions={[position]} titleField="fixTime" />}*/}
                      {position && <MapDevicePositions addressOpen={null} positions={[position]} titleField="fixTime" />}
                    </MapView>
                    {position && <MapCamera isFirstEnable={true} coordinatesActive={false} latitude={Object(position).latitude}
                                            longitude={Object(position).longitude} />}
                  </div>
                )
              }
              tableContent={
                <KitGrid
                  containerClassName={styles.gridContainer}
                  dataSource={items}
                  columns={columns}
                  loading={loading}
                />
              }
            />
          </div>
        </div>
      </PageWrapper>
    </>
  )
}

export default EventReportPage
