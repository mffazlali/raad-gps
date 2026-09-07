import {useNavigate} from 'react-router-dom'
import styles from '../ReportsCommon.module.css'
import cls from 'classnames'
import useMessage from '../../../common/util/useMessage.tsx'
import React, {useEffect, useState} from 'react'
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
import {formatTime} from '../../../common/util/formatter'
import MapView from '../../../common/map/core/MapView'
import MapGeofence from '../../../common/map/MapGeofence'
import MapRoutePath from '../../../common/map/MapRoutePath'
import MapMarkers from '../../../common/map/MapMarkers'
import MapCamera from '../../../common/map/MapCamera'
import KitGrid from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGrid'
import {ColumnsKitGridType} from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGridType.ts'
import {useTranslation} from '../../../common/components/LocalizationProvider'
import {preoids, eventTypes as eventTypesUtil, eventTypes} from '../../../common/util/constants.js'
import SpinnerContainer from '../../../common/components/custom/feedback/spinnerContainer/SpinnerContainer.tsx'
import axiosInstance from '../../../common/util/axiosConfig.ts'
import {useDevices} from '../../../common/serverStore'
import Collapse from '../../../common/components/custom/feedback/collapse/Collapse.tsx'
import ReportCard from '../../../common/components/custom/feedback/card/ReportCard.tsx'
import usePeriodChange from '../../../common/util/usePeriodChange.tsx'


const CombinedReportPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // const [meta, setMeta] = useMetaTags({title: 'راد: ورود', description: 'login user'})
  const {contextHolder, showMessage} = useMessage()
  const currentUser = useSelector((state: any) => state?.session?.user)
  const devicesMap = useSelector((state: any) => state?.devices?.items)
  const {data: devices = []} = useDevices(currentUser.id)
  const deviceIds = useSelector((state) => Object(state).devices.selectedIds)
  const groupIds = useSelector((state) => Object(state).reports.groupIds)
  const period = useSelector((state) => Object(state).reports.period)
  const from = useSelector((state) => Object(state).reports.from)
  const to = useSelector((state) => Object(state).reports.to)
  const hours12 = usePreference('twelveHourFormat')
  const [items, setItems] = useState<any[]>([])
  const [showResult, setShowResult] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [stopsItem, setStopsItem] = useState<any>(null)
  const [periodState, setPeriodState] = useState(period)
  const t = useTranslation()
  const {triggerPeriodChange} = usePeriodChange()

  const handleShow = useCatch(async (values: any, actions: FormikHelpers<any>) => {
    const query = new URLSearchParams({deviceId: values.deviceIds, from: values['from'], to: values['to']})
    if (values['groupIds'] != null && values['groupIds'] != '') {
      [...values['groupIds']].forEach((groupId: any) => query.append('groupId', groupId))
    }
    setLoading(true)
    try {
      showMessage({message: t('responsePreWaitingAPI'), type: 'info', key: 'save'})
      const response = await axiosInstance.get(`/api/reports/combined?${query}`)
      if (response.status === 200) {
        const res = response.data
        showMessage({message: t('responsePreWaitingAPI'), type: 'info', key: 'save'})
        setShowResult(res)
        let events: any[] = []
        res.forEach((result: any) => {
          const tmp = result.events.map((event: any) => {
            return {...event, deviceId: result.deviceId}
          })
          events = [...events, ...tmp]
        })
        setItems(events)
        const tmpStops = await getStops(query)
        setStopsItem(tmpStops)
        setLoading(false)
      } else {
        setLoading(false)
        throw Error(response.data)
      }
    } catch (e: any) {
      setLoading(false)
      if (e.message === 'Failed to fetch') {
        showMessage({message: t('responseConnectAPI'), type: 'error', duration: 2, key: 'save'})
      } else {
        // showMessage({message: t('responseErrorAPI'), type: 'error', duration: 2, key: 'save'})
      }
    } finally {
      showMessage({message: t('responsePreWaitingAPI'), type: 'info', duration: 0.5, key: 'save'})
    }
  })

  const {form} = useForm({
    formGroup: {
      'deviceIds': {value: '', validations: [{'required': 'وارد کردن دستگاه الزامی است'}]},
      'groupIds': {value: null, validations: []},
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
    form.setFieldValue('groupIds', groupIds)
    form.setFieldValue('from', from)
    form.setFieldValue('to', to)
    handlePeriodChange(String(period))
  }

  const getStops = async (query: any) => {
    let result = []
    try {
      const response = await axiosInstance.get(`/api/reports/stops?${query.toString()}`, {
        headers: {Accept: 'application/json'},
      })
      if (response.status === 200) {
        let res = response.data
        if (res) {
          res = res.map((position: any) => ({
            latitude: position.latitude,
            longitude: position.longitude,
          }))
          result = res
        }
      } else {
        result = []
        throw Error(response.data)
      }
    } finally {
      setLoading(false)
    }
    return result
  }

  const columns: ColumnsKitGridType = [
    {
      field: 'deviceId',
      headerName: 'دستگاه',
      valueFormatter: (f) => devicesMap[f.value]?.name ?? null,
    },
    {
      field: 'eventTime',
      headerName: 'زمان ثابت',
      valueFormatter: (f) => formatTime(f.value, 'seconds', hours12),
    },
    {
      field: 'type',
      headerName: 'نوع خط',
      valueFormatter: (p) => p.value ? [...eventTypesUtil].filter(event => event.value == p.value)[0].label : '',
    },
  ]

  // const columns2: DataTableColumnsType[] = [
  //   {
  //     title: 'دستگاه',
  //     dataIndex: 'deviceId',
  //     key: 'deviceId',
  //     type: 'text',
  //     pipeFn: (value) => devices[value]?.name ?? null,
  //     sort: false,
  //     defaultSortOrder: 'asc',
  //   },
  //   {
  //     title: 'زمان ثابت',
  //     dataIndex: 'eventTime',
  //     key: 'eventTime',
  //     type: 'text',
  //     pipeFn: (value) => formatTime(value, 'seconds', hours12),
  //     sort: false,
  //     defaultSortOrder: 'desc',
  //   },
  //   {
  //     title: 'نوع خط',
  //     dataIndex: 'type',
  //     key: 'type',
  //     pipeFn: (value) => Object(EVENT_TIME)[String(value)],
  //     type: 'text',
  //   },
  // ]

  const createMarkers = () => showResult.flatMap((item: any) => item.events
    .map((event: any) => item.positions.find((p: any) => event.positionId === p.id))
    .filter((position: any) => position != null)
    .map((position: any) => ({
      latitude: position.latitude,
      longitude: position.longitude,
    })))

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
                  {/*<div className={styles.input}>*/}
                  {/*  <KitInputWrapper label="گروه ها" required={false}*/}
                  {/*                   name="groupIds" direction={'col'}>*/}
                  {/*    <KitSelect placeholder="گروه ها" name="groupIds"*/}
                  {/*               optionLabel={'name'}*/}
                  {/*               optionValue={'id'}*/}
                  {/*               endpoint={'/api/groups'}*/}
                  {/*               mode={'multiple'}*/}
                  {/*               allowClear={true}*/}
                  {/*               showSearch={true}*/}
                  {/*               onChange={(e) => {*/}
                  {/*                 form.setFieldValue('groupIds', e)*/}
                  {/*                 dispatch(reportsActions.updateGroupIds(e))*/}
                  {/*               }}*/}
                  {/*               onBlur={(e) => form.handleBlur(e)}*/}
                  {/*               onSelect={(e) => {*/}
                  {/*                 form.handleChange(e)*/}
                  {/*               }}*/}
                  {/*               value={form.values.groupIds}*/}
                  {/*               classname={'w-[90%]'} />*/}
                  {/*  </KitInputWrapper>*/}
                  {/*</div>*/}
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
                    type="submit"
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
                </div>
              </form>
            </Collapse>
            <ReportCard
              containerId="reportContainer"
              isLoading={loading}
              showMap={(Boolean(items.length) && stopsItem)}
              mapContent={
                (Boolean(items.length) && stopsItem) && (
                  <div className={cls(styles.containerMap, 'reportMap')}>
                    {loading && <SpinnerContainer />}
                    <MapView>
                      {
                        !loading && <>
                          {/*<MapGeofence />*/}
                          {showResult.length > 0 && showResult.map((item) => (
                            <MapRoutePath
                              key={item.deviceId}
                              name={devicesMap[item.deviceId].name}
                              device={devicesMap[item.deviceId]}
                              coordinates={item.route}
                            />
                          ))}
                          <MapMarkers markers={stopsItem} />
                        </>
                      }
                    </MapView>
                    {
                      !loading && <>
                        <MapCamera isFirstEnable={true} coordinates={showResult.flatMap((item) => item.route)} />
                      </>
                    }
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

export default CombinedReportPage
