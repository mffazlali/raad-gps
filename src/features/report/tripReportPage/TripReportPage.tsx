import {useNavigate} from 'react-router-dom'
import styles from '../ReportsCommon.module.css'
import cls from 'classnames'
import useMessage from '../../../common/util/useMessage.tsx'
import React, {useEffect, useState} from 'react'
import {DataTableColumnsType} from '../../../common/components/uiKits/dataDisplay/kitTable/KitTableType.ts'
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
import {formatDistance, formatHours, formatSpeed, formatTime, formatVolume} from '../../../common/util/formatter'
import {useTranslation} from '../../../common/components/LocalizationProvider'
import MapView from '../../../common/map/core/MapView'
import MapGeofence from '../../../common/map/MapGeofence'
import MapRoutePath from '../../../common/map/MapRoutePath'
import MapMarkers from '../../../common/map/MapMarkers'
import MapCamera from '../../../common/map/MapCamera'
import {ColumnsKitGridType} from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGridType.ts'
import KitGrid from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGrid.tsx'
import {preoids} from '../../../common/util/constants.js'
import axiosInstance from '../../../common/util/axiosConfig.ts'
import {useDevices} from '../../../common/serverStore'
import Collapse from '../../../common/components/custom/feedback/collapse/Collapse.tsx'
import ReportCard from '../../../common/components/custom/feedback/card/ReportCard.tsx'
import SpinnerContainer from '../../../common/components/custom/feedback/spinnerContainer/SpinnerContainer.tsx'
import usePeriodChange from '../../../common/util/usePeriodChange.tsx'


const TripReportPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {contextHolder, showMessage} = useMessage()
  const deviceId = useSelector((state) => Object(state).devices.selectedId)
  const period = useSelector((state) => Object(state).reports.period)
  const from = useSelector((state) => Object(state).reports.from)
  const to = useSelector((state) => Object(state).reports.to)
  const distanceUnit = useAttributePreference('distanceUnit')
  const speedUnit = useAttributePreference('speedUnit')
  const volumeUnit = useAttributePreference('volumeUnit')
  const hours12 = usePreference('twelveHourFormat')
  const [items, setItems] = useState<any[]>([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [route, setRoute] = useState(null)
  const [loading, setLoading] = useState(false)
  const [periodState, setPeriodState] = useState(period)
  const [type, setType] = useState('')
  const t = useTranslation()
  const {triggerPeriodChange} = usePeriodChange()
  const currentUser = useSelector((state: any) => state?.session?.user)
  const {data: devices = []} = useDevices(currentUser?.id)

  const createMarkers = () => ([
    {
      latitude: Object(selectedItem).startLat,
      longitude: Object(selectedItem).startLon,
      image: 'default-error',
    },
    {
      latitude: Object(selectedItem).endLat,
      longitude: Object(selectedItem).endLon,
      image: 'default-success',
    },
  ])

  const handleShow = useCatch(async (values: any, actions: FormikHelpers<any>) => {
    try {
      const query = new URLSearchParams({deviceId: values.deviceId, from: values.from, to: values.to})
      if (type === 'export') {
        window.location.assign(`/api/reports/trips/xlsx?${query.toString()}`)
      } else if (type === 'mail') {
        try {
          const response = await axiosInstance.get(`/api/reports/trips/mail?${query.toString()}`)
          if (response.status === 200) {
            // Success case handled
          }
        } catch (error) {
          console.error('Error sending mail:', error)
          showMessage({message: t('responseWarningAPI'), type: 'error', duration: 2, key: 'save'})
        }
      } else {
        setLoading(true)
        try {
          showMessage({message: t('responsePreWaitingAPI'), type: 'info', key: 'save'})
          const response = await axiosInstance.get(`/api/reports/trips?${query.toString()}`, {
            headers: {Accept: 'application/json'},
          })
          if (response.status === 200) {
            setItems(response.data)
          }
        } catch (error) {
          console.error('Error fetching trips:', error)
          showMessage({message: t('responseWarningAPI'), type: 'error', duration: 2, key: 'save'})
        } finally {
          setLoading(false)
          showMessage({message: t('responsePreWaitingAPI'), type: 'info', duration: 0.5, key: 'save'})
        }
      }
    } catch (e: any) {
      if (e.message === 'Failed to fetch') {
        showMessage({message: t('responseConnectAPI'), type: 'error', duration: 2, key: 'save'})
      } else {
        showMessage({message: t('responseErrorAPI'), type: 'error', duration: 2, key: 'save'})
      }
    }
  })

  const {form} = useForm({
    formGroup: {
      'deviceId': {value: null, validations: [{'required': 'وارد کردن دستگاه الزامی است'}]},
      'from': {value: '', validations: []},
      'to': {value: '', validations: []},
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
      const query = new URLSearchParams({
        deviceId: Object(selectedItem).deviceId,
        from: Object(selectedItem).startTime,
        to: Object(selectedItem).endTime,
      })
      const response = await axiosInstance.get(`/api/reports/route?${query.toString()}`)
      if (response.status === 200) {
        setRoute(response.data)
      } else {
        throw Error(response.data)
      }
    } else {
      setRoute(null)
    }
  }, [selectedItem])

  const initForm = () => {
    form.setFieldValue('deviceId', deviceId)
    form.setFieldValue('from', from)
    form.setFieldValue('to', to)
    handlePeriodChange(String(period))
  }

  const cellRender = (params: any) => {
    return <div className={styles.actionsGrid}>
      <button
        onClick={() => {
          setSelectedItem(params.data)
        }}
        type="button"
        className={cls(styles.locationAction, 'fa fa-location-crosshairs')}
        title={'نقشه'}>
      </button>
    </div>
  }

  const columns: ColumnsKitGridType = [
    {
      headerName: 'زمان شروع',
      field: 'startTime',
      valueFormatter: (p) => formatTime(p.value, 'minutes', hours12),
    },
    {
      headerName: 'زمان پایانی',
      field: 'endTime',
      valueFormatter: (p) => formatTime(p.value, 'minutes', hours12),
    },
    {
      headerName: 'شروع کیلومترشمار',
      field: 'startOdometer',
      valueFormatter: (p) => formatDistance(p.value, distanceUnit, t),
    },
    {
      headerName: 'پایان کیلومتر شمار',
      field: 'endOdometer',
      valueFormatter: (p) => formatDistance(p.value, distanceUnit, t),
    },
    {
      headerName: 'طول مسیر',
      field: 'distance',
      valueFormatter: (p) => formatDistance(p.value, distanceUnit, t),
    },
    {
      headerName: 'میانگین سرعت',
      field: 'averageSpeed',
      valueFormatter: (p) => formatSpeed(p.value, speedUnit, t),
    },
    {
      headerName: 'حداکثر سرعت',
      field: 'maxSpeed',
      valueFormatter: (p) => formatSpeed(p.value, speedUnit, t),
    },
    {
      headerName: 'مسافت',
      field: 'duration',
      valueFormatter: (p) => formatHours(p.value),
    },
    {
      headerName: 'مصرف سوخت',
      field: 'spentFuel',
      valueFormatter: (p) => formatVolume(p.value, volumeUnit, t),
    },
    {
      headerName: 'راننده',
      field: 'driverName',
      valueFormatter: (p) => formatTime(p.value, 'seconds', hours12),
    },
    // {
    //   headerName: 'آدرس شروع',
    //   field: 'startAddress',
    //   valueFormatter: (p) => formatTime(p.value, 'seconds', hours12),
    // },
    // {
    //   headerName: 'آدرس پایانی',
    //   field: 'endAddress',
    //   valueFormatter: (p) => formatTime(p.value, 'seconds', hours12),
    // },
    {
      headerName: 'نقشه',
      field: 'button',
      pinned: 'right',
      cellRenderer: cellRender,
    },
  ]

  // const columns2: DataTableColumnsType[] = [
  //   {
  //     title: 'زمان شروع',
  //     dataIndex: 'startTime',
  //     key: 'startTime',
  //     type: 'text',
  //     pipeFn: (value) => formatTime(value, 'minutes', hours12),
  //     sort: false,
  //     defaultSortOrder: 'desc',
  //   },
  //   {
  //     title: 'زمان پایانی',
  //     dataIndex: 'endTime',
  //     key: 'endTime',
  //     type: 'text',
  //     pipeFn: (value) => formatTime(value, 'minutes', hours12),
  //     sort: false,
  //     defaultSortOrder: 'desc',
  //   },
  //   {
  //     title: 'شروع کیلومترشمار',
  //     dataIndex: 'startOdometer',
  //     key: 'startOdometer',
  //     type: 'text',
  //     pipeFn: (value) => formatDistance(value, distanceUnit, t),
  //     sort: false,
  //     defaultSortOrder: 'desc',
  //   },
  //   {
  //     title: 'پایان کیلومتر شمار',
  //     dataIndex: 'endOdometer',
  //     key: 'endOdometer',
  //     type: 'text',
  //     pipeFn: (value) => formatDistance(value, distanceUnit, t),
  //     sort: false,
  //     defaultSortOrder: 'desc',
  //   },
  //   {
  //     title: 'طول مسیر',
  //     dataIndex: 'distance',
  //     key: 'distance',
  //     type: 'text',
  //     pipeFn: (value) => formatDistance(value, distanceUnit, t),
  //     sort: false,
  //     defaultSortOrder: 'desc',
  //   },
  //   {
  //     title: 'میانگین سرعت',
  //     dataIndex: 'averageSpeed',
  //     key: 'averageSpeed',
  //     type: 'text',
  //     pipeFn: (value) => formatSpeed(value, speedUnit, t),
  //     sort: false,
  //     defaultSortOrder: 'desc',
  //   },
  //   {
  //     title: 'حداکثر سرعت',
  //     dataIndex: 'maxSpeed',
  //     key: 'maxSpeed',
  //     type: 'text',
  //     pipeFn: (value) => formatSpeed(value, speedUnit, t),
  //     sort: false,
  //     defaultSortOrder: 'desc',
  //   },
  //   {
  //     title: 'مسافت',
  //     dataIndex: 'duration',
  //     key: 'duration',
  //     type: 'text',
  //     pipeFn: (value) => formatHours(value),
  //     sort: false,
  //     defaultSortOrder: 'desc',
  //   },
  //   {
  //     title: 'مصرف سوخت',
  //     dataIndex: 'spentFuel',
  //     key: 'spentFuel',
  //     type: 'text',
  //     pipeFn: (value) => formatVolume(value, volumeUnit, t),
  //     sort: false,
  //     defaultSortOrder: 'desc',
  //   },
  //   {
  //     title: 'راننده',
  //     dataIndex: 'driverName',
  //     key: 'driverName',
  //     type: 'text',
  //     pipeFn: (value) => formatTime(value, 'seconds', hours12),
  //     sort: false,
  //     defaultSortOrder: 'desc',
  //   },
  //   // {
  //   //   title: 'آدرس شروع',
  //   //   dataIndex: 'startAddress',
  //   //   key: 'startAddress',
  //   //   type: 'text',
  //   //   pipeFn: (value) => formatTime(value, 'seconds', hours12),
  //   //   sort: false,
  //   //   defaultSortOrder: 'desc',
  //   // },
  //   // {
  //   //   title: 'آدرس پایانی',
  //   //   dataIndex: 'endAddress',
  //   //   key: 'endAddress',
  //   //   type: 'text',
  //   //   pipeFn: (value) => formatTime(value, 'seconds', hours12),
  //   //   sort: false,
  //   //   defaultSortOrder: 'desc',
  //   // },
  //   {
  //     title: 'عملیات',
  //     dataIndex: 'actions',
  //     key: 'actions',
  //     type: 'action',
  //     actionConfig: {
  //       controls: [
  //         {
  //           element: <span>نقشه</span>, onClick: (record: any) => {
  //             setSelectedItem(record)
  //           },
  //         },
  //         // {
  //         //   element: <span>آدرس شروع</span>, onClick: (record: any) => {
  //         //   },
  //         // },
  //         // {
  //         //   element: <span>آدرس پایانی</span>, onClick: (record: any) => {
  //         //   },
  //         // },
  //       ],
  //     },
  //   },
  // ]

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
                <div className={styles.actionsWrapper}>
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
                      disabled={!form.isValid} />
                    <Button
                      onClick={() => {
                        setType('export')
                        form.submitForm()
                      }}
                      type="button"
                      title={'خروجی فایل'}
                      className={cls(
                        styles.button,
                        styles.registerButton,
                        'btn-primary',
                      )}
                      titleClassName={cls(styles.label, styles.registerLabel)}
                      disabled={!form.isValid} />
                  </div>
                </div>
              </form>
            </Collapse>
            <ReportCard
              containerId="reportContainer"
              isLoading={loading}
              mapContent={
                selectedItem && (
                  <div className={cls(styles.containerMap, 'reportMap')}>
                    {loading && <SpinnerContainer />}
                    <MapView>
                      {!loading && (
                        <>
                          {route && (
                            <>
                              <MapRoutePath positions={route} />
                              <MapMarkers markers={createMarkers()} />
                              <MapCamera isFirstEnable={true} positions={route} />
                            </>
                          )}
                        </>
                      )}
                    </MapView>
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

export default TripReportPage
