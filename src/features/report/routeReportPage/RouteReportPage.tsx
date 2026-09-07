import {useNavigate} from 'react-router-dom'
import styles from '../ReportsCommon.module.css'
import cls from 'classnames'
import useMessage from '../../../common/util/useMessage.tsx'
import React, {Fragment, useCallback, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {usePreference} from '../../../common/util/preferences'
import {useCatch} from '../../../common/util/reactHelper'
import Button from '../../../common/components/custom/general/button/Button.tsx'
import {devicesActions, reportsActions} from '../../../common/clientStore'
import PageWrapper from '../../../common/components/custom/feedback/pageWrapper/PageWrapper.tsx'
import KitInputWrapper from '../../../common/components/uiKits/dataEntry/kitInputWrapper/KitInputWrapper.tsx'
import KitInputError from '../../../common/components/uiKits/dataEntry/kitInputError/KitInputError.tsx'
import KitSelect from '../../../common/components/uiKits/dataEntry/kitSelect/KitSelect.tsx'
import KitDatePicker from '../../../common/components/uiKits/dataEntry/kitDatePicker/KitDatePicker.tsx'
import useForm from '../../../common/util/useForm.tsx'
import {FormikHelpers} from 'formik'
import {formatSpeed, formatTime} from '../../../common/util/formatter'
import usePositionAttributes from '../../../common/attributes/usePositionAttributes'
import {useTranslation} from '../../../common/components/LocalizationProvider'
import MapView from '../../../common/map/core/MapView'
import MapGeofence from '../../../common/map/MapGeofence'
import MapRoutePath from '../../../common/map/MapRoutePath'
import MapRoutePoints from '../../../common/map/MapRoutePoints'
import MapPositions from '../../../common/map/MapPositions'
import MapCamera from '../../../common/map/MapCamera'
import {ColumnsKitGridType} from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGridType.ts'
import KitGrid from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGrid.tsx'
import {preoids} from '../../../common/util/constants.js'
import MapDevicePositions from '../../../common/map/MapDevicePositions'
import useApiFileDownload from '../../../common/util/apiFileDownload'
import axiosInstance from '../../../common/util/axiosConfig.ts'
import {useDevices} from '../../../common/serverStore'
import Collapse from '../../../common/components/custom/feedback/collapse/Collapse.tsx'
import ReportCard from '../../../common/components/custom/feedback/card/ReportCard.tsx'
import SpinnerContainer from '../../../common/components/custom/feedback/spinnerContainer/SpinnerContainer.tsx'
import usePeriodChange from '../../../common/util/usePeriodChange.tsx'


const RouteReportPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {contextHolder, showMessage} = useMessage()
  const deviceIds = useSelector((state: any) => state.devices.selectedIds)
  const period = useSelector((state) => Object(state).reports.period)
  const from = useSelector((state) => Object(state).reports.from)
  const to = useSelector((state) => Object(state).reports.to)
  const hours12 = usePreference('twelveHourFormat')
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMap, setLoadingMap] = useState(true)
  const [periodState, setPeriodState] = useState(period)
  const [available, setAvailable] = useState<any[]>([])
  const [type, setType] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const t = useTranslation()
  const {triggerPeriodChange} = usePeriodChange()
  const positionAttributes = usePositionAttributes(t)
  const speedUnit = 'kmh'
  const currentUser = useSelector((state: any) => state?.session?.user)
  const {data: devices = []} = useDevices(currentUser?.id)
  const {apiFileDownloader} = useApiFileDownload()

  const onMapPointClick = useCallback((positionId: any) => {
    setSelectedItem(items.find((it) => it.id == positionId))
  }, [items, setSelectedItem])

  const handleShow = useCatch(async (values: any, actions: FormikHelpers<any>) => {
    try {
      const query = new URLSearchParams({deviceId: values.deviceIds, from: values.from, to: values.to})
      if (type === 'export') {
        const queryExport = new URLSearchParams({
          deviceId: values.deviceIds,
          from: formatTime(values.from as any, 'dateRaw', null),
          to: formatTime(values.to as any, 'dateRaw', null),
        })
        // window.location.assign(`/api/reports/route/xlsx?${queryExport.toString()}`)
        const url = `/api/reports/route/xlsx?${queryExport.toString()}`
        apiFileDownloader('route', url)

      } else if (type === 'mail') {
        const response = await axiosInstance.get(`/api/reports/route/mail?${query.toString()}`)
        if (response.status !== 200) {
          throw Error(response.data)
        }
      } else {
        setLoading(true)
        try {
          showMessage({message: t('responsePreWaitingAPI'), type: 'info', key: 'save'})
          const response = await axiosInstance.get(`/api/reports/route?${query.toString()}`)
          if (response.status === 200) {
            const data = response.data
            const keySet = new Set()
            const keyList: any[] = []
            data.forEach((position: any) => {
              Object.keys(position).forEach((it) => keySet.add(it))
              Object.keys(position.attributes).forEach((it) => keySet.add(it))
            });
            ['id', 'deviceId', 'outdated', 'network', 'attributes'].forEach((key) => keySet.delete(key))
            Object.keys(positionAttributes).forEach((key) => {
              if (keySet.has(key)) {
                keyList.push(key)
                keySet.delete(key)
              }
            })
            setAvailable([...keyList, ...keySet].map((key) => [key, Object(positionAttributes)[key]?.name || key]))
            setItems(data)
          } else {
            throw Error(response.data)
          }
        } finally {
          setLoading(false)
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
      'deviceIds': {value: '', validations: [{'required': 'وارد کردن دستگاه الزامی است'}]},
      'from': {value: '', validations: []},
      'to': {value: '', validations: []},
    },
    handleSubmit: handleShow,
    isInitialValid: false,
  })

  useEffect(() => {
    handlePeriodChange(period)
    initForm()
  }, [])

  const initForm = () => {
    form.setFieldValue('deviceIds', deviceIds)
    form.setFieldValue('from', from)
    form.setFieldValue('to', to)
    handlePeriodChange(String(period))
  }

  const cellRender = (params: any) => {
    return <div className={styles.actionsGrid}>
      <button
        onClick={() => {
          setLoadingMap(true)
          setSelectedItem({...params.data})
        }}
        type="button"
        className={cls(styles.locationAction, 'fa fa-location-crosshairs')}
        title={'نقشه'}>
      </button>
    </div>
  }

  useEffect(() => {
    if (selectedItem) {
      setLoadingMap(false)
    } else {
      setLoadingMap(true)
    }
  }, [selectedItem])

  const columns: ColumnsKitGridType = [
    // {
    //   headerName: 'دستگاه',
    //   field: 'deviceId',
    //   valueFormatter: (p) => devices[p.value]?.name ?? null,
    // },
    {
      headerName: 'زمان ثبت',
      field: 'fixTime',
      valueFormatter: (p) => formatTime(p.value, 'seconds', hours12),
    },
    {
      headerName: 'عرض جغرافيايى',
      field: 'latitude',
      valueFormatter: (p) => p.value,
    },
    {
      headerName: 'طول جغرافيايى',
      field: 'longitude',
      valueFormatter: (p) => p.value,
    },
    {
      headerName: 'سرعت',
      field: 'speed',
      valueFormatter: (p) => p.value ? p.value.toFixed(2) : '0',
    },
    {
      headerName: 'ارتفاع',
      field: 'altitude',
      valueFormatter: (p) => p.value,
    },
    {
      headerName: 'نقشه',
      field: 'button',
      pinned: 'right',
      cellRenderer: cellRender,
    },
  ]

  const handlePeriodChange = (period: any) => {
    setPeriodState(period)
    const {selectedFrom, selectedTo} = triggerPeriodChange(period)
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
                                     name="deviceIds" direction={'col'}>
                      <KitSelect placeholder="دستگاه ها" name="deviceIds"
                                 optionLabel={'name'}
                                 optionValue={'id'}
                                 options={devices}
                                 allowClear={true}
                                 showSearch={true}
                                 onChange={(e) => {
                                   form.setFieldValue('deviceIds', e)
                                   dispatch(devicesActions.selectIds(e))
                                 }}
                                 onBlur={(e) => form.handleBlur(e)}
                                 onSelect={(e) => {
                                   form.handleChange(e)
                                 }}
                                 value={form.values.deviceIds}
                                 classname={'w-[90%]'}
                                 status={form.errors.deviceIds ? 'error' : ''} />
                    </KitInputWrapper>
                    <KitInputError label={form.errors.deviceIds} />
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
              showMap={selectedItem}
              onHideMap={() => setSelectedItem(null)}
              mapContent={
                (Boolean(items.length) && selectedItem) && (
                  <div className={cls(styles.containerMap, 'reportMap')}>
                    {loading && <SpinnerContainer />}
                    <MapView zoomCheck={true}>
                      {/*<MapGeofence />*/}
                      {/*{[...new Set(items.map((it) => it.deviceId))].map((deviceId) => {*/}
                      {/*  const positions = items.filter((position) => position.deviceId === deviceId)*/}
                      {/*  return (*/}
                      {/*    <Fragment key={deviceId}>*/}
                      {/*      <MapRoutePath positions={positions} />*/}
                      {/*      <MapRoutePoints positions={positions} onClick={onMapPointClick} />*/}
                      {/*    </Fragment>*/}
                      {/*  )*/}
                      {/*})}*/}
                      {/*<MapPositions positions={[selectedItem]} titleField="fixTime" />*/}
                      <MapDevicePositions addressOpen={false} positions={[selectedItem]} titleField="fixTime" />
                    </MapView>
                    {(selectedItem && loadingMap) && <MapCamera coordinatesActive={false}
                                                  latitude={Object(selectedItem).latitude}
                                                  longitude={Object(selectedItem).longitude} />}
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

export default RouteReportPage
