import {useNavigate} from 'react-router-dom'
import styles from '../ReportsCommon.module.css'
import replaystyles from './ReplayPage.module.css'
import cls from 'classnames'
import useMessage from '../../../common/util/useMessage.tsx'
import React, {useCallback, useEffect, useRef, useState} from 'react'
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
import {useTranslation} from '../../../common/components/LocalizationProvider'
import MapView from '../../../common/map/core/MapView'
import MapGeofence from '../../../common/map/MapGeofence'
import MapPositions from '../../../common/map/MapPositions'
import MapCamera from '../../../common/map/MapCamera'
import MapRoutePathReplay from '../../../common/map/MapRoutePathReplay'
import MapRoutePoints from '../../../common/map/MapRoutePoints'
import PopupPlayer from './popupPlayer/PopupPlayer.jsx'
import MapSelectedPosition from '../../../common/map/main/MapSelectedPosition'
import checkOutline from '../../../resources/images/medias/checkOutline.svg'
import {formatTime} from '../../../common/util/formatter'
import DevicesReport from './devicesReport/DevicesReport.jsx'
import MapPlayer from './mapPlayer/mapPlayer'
import {preoids} from '../../../common/util/constants.js'
import {result} from 'lodash'
import SpinnerContainer from '../../../common/components/custom/feedback/spinnerContainer/SpinnerContainer.tsx'
import MapDevicePositions from '../../../common/map/MapDevicePositions'
import MainMobileHeader from '../../main/mainMobileHeader/MainMobileHeader'
import CardDevice from '../../main/cardDevice/CardDevice'
import MainMap from '../../main/MainMap'
import CardDevicesMobile from '../../main/CardDevicesMobile/CardDevicesMobile'
import usePersistedState from '../../../common/util/usePersistedState'
import useFilter from '../../main/useFilter'
import {Radio} from 'antd'
import axiosInstance from '../../../common/util/axiosConfig.ts'

// Import new components
import ReplayMap from './components/ReplayMap'
import ReplayControls from './components/ReplayControls'
import ReplayPeriodSelector from './components/ReplayPeriodSelector'
import ReplayFilter from './components/ReplayFilter'
import ReplayToolbar from './components/ReplayToolbar'
import {useDevices} from '../../../common/serverStore'
import usePeriodChange from '../../../common/util/usePeriodChange.tsx'
import KitModal from '../../../common/components/uiKits/feeback/kitModal/KitModal.tsx'

const ReplayPage = ({showStatus}: {showStatus?: 'main' | 'report' | 'mobile'}) => {
  const navigate = useNavigate()
  const timerRef = useRef<any>(null)
  const deviceId = useSelector((state: any) => state.devices.selectedId)
  const device = useSelector((state: any) => state.devices.items[deviceId])
  const mainPositions = useSelector((state: any) => state.session.positions)
  const [positions, setPositions] = useState<any[]>([])
  const [index, setIndex] = useState<number>(0)
  const [enableCamera, setEnableCamera] = useState<boolean>(false)
  const [speedPlay, setSpeedPlay] = useState<number>(500)
  const [showCard, setShowCard] = useState(false)
  const [expanded, setExpanded] = useState(true)
  const [selectedDevice, setSelectedDevice] = useState()
  const [selectedDeviceId, setSelectedDeviceid] = useState()
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const {contextHolder, showMessage} = useMessage()
  const period = useSelector((state: any) => state.reports.period)
  const from = useSelector((state: any) => state.reports.from)
  const to = useSelector((state: any) => state.reports.to)
  const [stopsItem, setStopsItem] = useState<any>([])
  const [periodState, setPeriodState] = useState('')
  const [isopenCustomDateModal, setIsOpenCustomDateModal] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<any>({})
  const t = useTranslation()
  const {triggerPeriodChange} = usePeriodChange()
  const hours12 = usePreference('twelveHourFormat')
  const currentUser = useSelector((state: any) => state?.session?.user)
  const {data: devices = []} = useDevices(currentUser?.id)

  const [filteredDevices, setFilteredDevices] = useState<any[]>(devices)
  const [keyword, setKeyword] = useState('')
  const [filter, setFilter] = usePersistedState('filter', {
    statuses: [],
    groups: [],
  })
  const [filteredPositions, setFilteredPositions] = useState([])
  const [showDevices, setShowDevices] = useState(false)

  const [filterSort, setFilterSort] = usePersistedState('filterSort', '')
  const [filterMap, setFilterMap] = usePersistedState('filterMap', false)

  // const [devicesOpen, setDevicesOpen] = useState(desktop)
  const [eventsOpen, setEventsOpen] = useState(false)
  const [addressOpen, setAddressOpen] = useState(false)

  const onEventsClick = useCallback(() => setEventsOpen(true), [setEventsOpen])

  useFilter(
    keyword,
    filter,
    filterSort,
    filterMap,
    positions,
    setFilteredDevices,
    setFilteredPositions,
  )

  useEffect(() => {
    const tempSelectedPosition = Object.values(mainPositions).find(
      (position: any) => deviceId && position.deviceId == deviceId,
    )
    setSelectedPosition(tempSelectedPosition)
    if (showStatus === 'main') {
      form.setFieldValue('deviceId', String(deviceId))
    }
  }, [deviceId, positions])

  useEffect(() => {
    if (periodState && periodState != '' && from && to) {
      handleShow({deviceId, from, to})
    }
  }, [deviceId])

  useEffect(() => {
    if (!enableCamera || playing) return
    const timer = setTimeout(() => setEnableCamera(false), 400)
    return () => clearTimeout(timer)
  }, [enableCamera, playing])

  // const stepIndex = (idx: number, next: boolean) => {
  //   const where=0.005
  //   let counter = idx
  //   if (next) {
  //     console.log('next')
  //     for (let i = idx; i < positions.length-1; i++) {
  //       if ((Math.abs(positions[i].latitude - positions[i + 1].latitude))<=where || (Math.abs(positions[i].longitude - positions[i + 1].longitude))<=where) {
  //         counter++
  //       } else {
  //         break
  //       }
  //     }
  //   } else {
  //     for (let i = positions.length - 1; i >= 1; i--) {
  //       if ((Math.abs(positions[i].latitude - positions[i - 1].latitude))<=where || (Math.abs(positions[i].longitude - positions[i - 1].longitude))<=where) {
  //         counter--
  //       } else {
  //         break
  //       }
  //     }
  //   }
  //
  //   console.log(idx,counter)
  //   setIndex(counter)
  // }

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

  const handleShow = useCatch(async (values: any) => {
    setLoading(true)
    const query = new URLSearchParams({
      deviceId: showStatus === 'mobile' ? deviceId : values.deviceId,
      from: values.from,
      to: values.to,
    })
    try {
      showMessage({message: t('responsePreWaitingAPI'), type: 'info', key: 'save'})
      const response = await axiosInstance.get(`/api/positions?${query.toString()}`)
      if (response.status === 200) {
        setIndex(0)
        setSelectedDeviceid(deviceId)
        setSelectedDevice(device)
        const positions = response.data
        setPositions(positions)
        const tmpStops = await getStops(query)
        setStopsItem(tmpStops)
        if (positions.length > 0) {
          setExpanded(false)
          setLoading(false)
          setEnableCamera(true)
          showMessage({message: t('responsePreWaitingAPI'), type: 'info', duration: 0.5, key: 'save'})
        } else {
          setExpanded(true)
          setPlaying(false)
          setLoading(false)
          setEnableCamera(false)
          showMessage({message: 'داده یافت نشد', type: 'info', duration: 2, key: 'save'})
          setSelectedDevice(null)
          setSelectedDeviceid(null)
        }
      } else {
        setSelectedDevice(null)
        setSelectedDeviceid(null)
        setPositions([])
        setStopsItem([])
        setExpanded(true)
        setPlaying(false)
        setLoading(false)
        setEnableCamera(false)
        // throw Error(response.data)
      }
    } catch (e) {
      setExpanded(true)
      setPlaying(false)
      setLoading(false)
      setEnableCamera(false)
      setSelectedDevice(null)
      setSelectedDeviceid(null)
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
    if (showStatus == 'report') {
      handlePeriodChange(period)
    } else {
      setPeriodState('')
    }
    initForm()
  }, [])

  useEffect(() => {
    if (playing && positions.length > 0) {
      timerRef.current = setInterval(() => {
        setIndex((index) => index + 1)
      }, speedPlay)
    } else {
      clearInterval(timerRef.current)
    }

    return () => clearInterval(timerRef.current)
  }, [playing, positions, speedPlay])

  useEffect(() => {
    if (index >= positions.length - 1) {
      clearInterval(timerRef.current)
      setPlaying(false)
    }
  }, [index, positions])


  const initForm = () => {
    form.setFieldValue('deviceId', deviceId)
    // form.setFieldValue('from', from)
    // form.setFieldValue('to', to)
  }

  const handleSetIndex = useCallback((newIndex: number) => {
    setIndex(newIndex)
    if (!playing) {
      setEnableCamera(true)
    }
  }, [playing])

  const onPointClick = useCallback((_: any, index: any) => {
    setIndex(index)
  }, [setIndex])

  const onMarkerClick = useCallback((positionId: any) => {
    setShowCard(!!positionId)
  }, [setShowCard])

  const handleDownload = () => {
    const query = new URLSearchParams({deviceId: deviceId, from: form.values.from, to: form.values.to})
    window.location.assign(`/api/positions/kml?${query.toString()}`)
  }

  const setOpen = (value) => {
    setAddressOpen(value)
  }

  const handlePeriodChange = (period: any) => {
    setPeriodState(period)
    const {selectedFrom, selectedTo} = triggerPeriodChange(period)
    if (selectedFrom != null && selectedTo != null) {
      form.setFieldValue('from', selectedFrom ?? '')
      form.setFieldValue('to', selectedTo ?? '')
      dispatch(reportsActions.updateFrom(selectedFrom))
      dispatch(reportsActions.updateTo(selectedTo))
    } else {
      // form.setFieldValue('from', '')
      // form.setFieldValue('to', '')
      dispatch(reportsActions.updateFrom(''))
      dispatch(reportsActions.updateTo(''))
    }
  }

  const renderButtonTypes = (isDesktop?: boolean) => {
    return [...preoids].map((item, index) => {
      return <Button
        key={index + 1}
        type="button"
        onClick={async () => {
          if (+item.value >= 7) {
            setIsOpenCustomDateModal(true)
          } else {
            dispatch(reportsActions.updatePeriod(item.value))
            setPeriodState(item.value)
            if (+item.value < 7) {
              const {selectedFrom: from, selectedTo: to} = triggerPeriodChange(item.value)
              handleShow({deviceId, from, to})
            } else {
              const fromfield = form.getFieldProps('from').value
              const tofield = form.getFieldProps('to').value
              if (!fromfield || fromfield == '' || !tofield || tofield == '') {
                showMessage({message: 'بازه تاریخ انتخاب نشده است', type: 'info', duration: 2, key: 'save'})
                return
              }
              // handleShow({deviceId, from, to})
            }
          }
        }
        }
        title={item.label}
        className={cls(
          replaystyles.typeButton,
          'btn-primary-outline',
          (periodState == item.value) && 'btn-primary',
        )}
        loading={loading && periodState == item.value}
        // iconClassName={'text-black'}
        fontClassName={(showStatus != 'mobile') ? (periodState == item.value && !loading) ? 'fa fa-check' : '' : ''}
        titleClassName={cls(styles.label, styles.registerLabel)}
        spinClassName={isDesktop ? '' : '!border-[1px] !w-1 !h-1'}
        disabled={deviceId == null || deviceId == 'undefined' || deviceId == undefined || (loading)} />
    })
  }

  const renderDatePicker = useCallback(() => {
    return <div className="flex sm:flex-row flex-col gap-3">
      <div className={cls(styles.input)}>
        <KitInputWrapper label="از" required={false}
                         name="from"
                         direction={'row'}>
          <KitDatePicker placeholder="از" name="from" value={form.values.from}
                         disabled={loading || (!deviceId || deviceId == 'undefined')}
                         onChange={(e) => {
                           form.handleChange(e)
                           dispatch(reportsActions.updateFrom(e.target.value))
                         }}
                         onBlur={(e) => form.handleBlur(e)}
                         classname={'w-[90%]'}
                         dateMode={'datetime'} />
        </KitInputWrapper>
      </div>
      <div className={cls(styles.input)}>
        <KitInputWrapper label="تا" required={false}
                         name="to"
                         direction={'row'}>
          <KitDatePicker placeholder="تا" name="to" value={form.values.to}
                         disabled={loading || (!deviceId || deviceId == 'undefined')}
                         onChange={(e) => {
                           form.handleChange(e)
                           dispatch(reportsActions.updateTo(e.target.value))
                           // if (tempDate && tempDate != '' && from && from != '') {
                           //   handleShow({deviceId, from, to: tempDate})
                           // }
                         }}
            // onClose={() => {
            //   if (to && to != '' && to && to != '') {
            //     handleShow({deviceId, from, to})
            //   }
            // }}
                         onBlur={(e) => form.handleBlur(e)}
                         classname={'w-[90%]'}
                         dateMode={'datetime'} />
        </KitInputWrapper>
      </div>
    </div>
  }, [periodState, from, to, loading, deviceId])

  const renderGroupTypes = () => {
    return [...preoids].filter(item => +item.value < 7).map(item => {
      return <Radio.Button onClick={async () => {
        dispatch(reportsActions.updatePeriod(item.value))
        setPeriodState(item.value)
        const {selectedFrom: from, selectedTo: to} = triggerPeriodChange(item.value)
        handleShow({...form.values, from, to})
      }} className={periodState === item.value && 'bg-primary-active'} value={item.value}>{item.label}</Radio.Button>
    })
  }

  const [isToolbarMinimized, setIsToolbarMinimized] = useState(false)

  const mainMobileRender = () => {
    return <>
      {contextHolder}
      <KitModal onOk={() => {
        const fromfield = form.getFieldProps('from').value
        const tofield = form.getFieldProps('to').value
        if (!fromfield || fromfield == '' || !tofield || tofield == '') {
          showMessage({message: 'بازه تاریخ انتخاب نشده است', type: 'info', duration: 2, key: 'save'})
          return
        }
        dispatch(reportsActions.updatePeriod('7'))
        setPeriodState('7')
        handleShow({deviceId, from, to})
        setIsOpenCustomDateModal(false)
      }}
                onCancel={() => {
                  // form.setFieldValue('from', '', true)
                  // form.setFieldValue('to', '', true)
                  // dispatch(reportsActions.updateFrom(''))
                  // dispatch(reportsActions.updateTo(''))
                  setIsOpenCustomDateModal(false)
                }}
                title={'انتخاب تاریخ سفارشی'} okText={'انتخاب'} cancelText={'لغو'} isOpen={isopenCustomDateModal}
                setClose={() => setIsOpenCustomDateModal(false)}>
        {renderDatePicker()}
      </KitModal>
      <MainMobileHeader devices={filteredDevices} setKeyword={setKeyword} showDevices={showDevices}
                        setShowDevices={setShowDevices} disable={isopenCustomDateModal} />
      <div className={replaystyles.replayPage}>
        <div className={replaystyles.replayPageContainer}>
          <div className={replaystyles.contentWrapper}>
            <div className={replaystyles.content}>
              {!expanded && !loading && positions && positions.length > 0 && (
                <CardDevice
                  position={positions[index]}
                  deviceId={deviceId}
                  addressOpen={addressOpen}
                  setAddressOpen={setOpen}
                  isMobileMedia={true}
                  showOnlyPositionFields={true}
                  isReport={true}
                />
              )}
              <div
                className={cls(replaystyles.mapWrapper, !expanded && !loading ? isToolbarMinimized ? '!h-[calc(70%-142px)]' : '!h-[calc(55%-228px)]' : isToolbarMinimized ? '!h-[calc(100%-142px)]' : '!h-[calc(100%-21rem)]')}>
                {loading && <SpinnerContainer />}
                <MapView zoomCheck={true}>
                  {!loading && <>
                    <MapRoutePathReplay positions={positions} />
                    {positions.length > 0 && <MapRoutePoints positions={stopsItem} onClick={onPointClick} />}
                    {index < positions.length && (
                      <MapDevicePositions addressOpen={null} positions={[positions[index]]} onClick={onMarkerClick}
                                          titleField="fixTime" />
                    )}
                  </>}
                </MapView>
                {!loading && <>
                  {((positions && positions.length > 0 && positions[index]) && (playing || enableCamera)) &&
                    <MapCamera coordinatesActive={false} latitude={positions[index]?.latitude}
                               longitude={positions[index]?.longitude} />}
                </>}
              </div>
              <ReplayToolbar
                device={device}
                positions={positions}
                index={index}
                hours12={hours12}
                onClose={() => navigate(-1)}
                onMinimize={() => setIsToolbarMinimized(!isToolbarMinimized)}
                isMinimized={isToolbarMinimized}
                isMobile={showStatus === 'mobile'}
              >
                <div className={replaystyles.reportContent}>
                  <MapPlayer index={index} setIndex={handleSetIndex} playing={playing} positions={positions}
                             handlePlay={() => setPlaying(!playing)}
                             handleSpeed={(speed: string) => setSpeedPlay(+speed)}
                             handlePrevious={() => setIndex((index) => index - 1)}
                             handleNext={() => setIndex((index) => index + 1)}
                             handleDownload={handleDownload}
                             handleFilter={() => setExpanded(true)}
                             isLoading={loading} />
                </div>
                <div className={replaystyles.dateTypeActionsWrapper}>
                  <div className={replaystyles.dateTypeActions}>
                    {renderButtonTypes(false)}
                  </div>
                </div>
              </ReplayToolbar>
            </div>
          </div>
        </div>
      </div>
      <CardDevicesMobile devices={filteredDevices} showDevices={showDevices} setShowDevices={setShowDevices} />
    </>
  }

  const mainRender = () => {
    return <>
      {contextHolder}
      <KitModal onOk={() => {
        const fromfield = form.getFieldProps('from').value
        const tofield = form.getFieldProps('to').value
        if (!fromfield || fromfield == '' || !tofield || tofield == '') {
          showMessage({message: 'بازه تاریخ انتخاب نشده است', type: 'info', duration: 2, key: 'save'})
          return
        }
        dispatch(reportsActions.updatePeriod('7'))
        setPeriodState('7')
        handleShow({deviceId, from, to})
        setIsOpenCustomDateModal(false)
      }}
                onCancel={() => {
                  // form.setFieldValue('from', '', true)
                  // form.setFieldValue('to', '', true)
                  // dispatch(reportsActions.updateFrom(''))
                  // dispatch(reportsActions.updateTo(''))
                  setIsOpenCustomDateModal(false)
                }}
                title={'انتخاب تاریخ سفارشی'} okText={'انتخاب'} cancelText={'لغو'} isOpen={isopenCustomDateModal}
                setClose={() => setIsOpenCustomDateModal(false)}>
        {renderDatePicker()}
      </KitModal>
      <div className={cls(replaystyles.replayPage)}>
        <div className={cls(replaystyles.replayPageContainer)}>
          <DevicesReport devices={devices} className={replaystyles.sidebar} />
          <div className={replaystyles.contentWrapper}>
            <div className={replaystyles.content}>
              {(!expanded && !loading) &&
                <ReplayControls
                  index={index}
                  setIndex={handleSetIndex}
                  playing={playing}
                  positions={positions}
                  handlePlay={() => setPlaying(!playing)}
                  handleSpeed={(speed: string) => setSpeedPlay(+speed)}
                  handlePrevious={() => setIndex((index) => index - 1)}
                  handleNext={() => setIndex((index) => index + 1)}
                  handleDownload={handleDownload}
                  handleFilter={() => setExpanded(true)}
                  addressOpen={addressOpen}
                  setAddressOpen={setOpen}
                  isMainPage={true}
                  device={device}
                  deviceId={deviceId}
                  isLoading={loading}
                />
              }
              <div className={cls('w-full !h-full relative')}>
                {loading && <SpinnerContainer />}
                <MapView zoomCheck={true}>
                  {!loading && <>
                    <MapRoutePathReplay positions={positions} />
                    {positions.length > 0 && <MapRoutePoints positions={stopsItem} onClick={onPointClick} />}
                    {index < positions.length && (
                      <MapDevicePositions addressOpen={null} positions={[positions[index]]} onClick={onMarkerClick}
                                          titleField="fixTime" />
                    )}
                  </>}
                </MapView>
                {!loading && <>
                  {((positions && positions.length > 0 && positions[index]) && (playing || enableCamera)) &&
                    <MapCamera coordinatesActive={false} latitude={positions[index]?.latitude}
                               longitude={positions[index]?.longitude} />}
                </>}
              </div>
              <ReplayToolbar
                device={device}
                positions={positions}
                index={index}
                hours12={hours12}
                onClose={() => navigate(-1)}
                onMinimize={() => setIsToolbarMinimized(!isToolbarMinimized)}
                isMinimized={isToolbarMinimized}
                isMobile={showStatus === 'mobile'}
              >
                {/*<div className={replaystyles.reportFooter}>*/}
                <div className="flex flex-col gap-2">
                  <div className={replaystyles.typesAction}>
                    {renderButtonTypes(true)}
                  </div>
                  {/*<div>*/}
                  {/*  {renderDatePicker()}*/}
                  {/*</div>*/}
                </div>

                {/*</div>*/}
              </ReplayToolbar>
            </div>
          </div>
        </div>
      </div>
    </>
  }

  const reportRender = () => {
    return <>
      {contextHolder}
      <KitModal onOk={() => {
        const fromfield = form.getFieldProps('from').value
        const tofield = form.getFieldProps('to').value
        if (!fromfield || fromfield == '' || !tofield || tofield == '') {
          showMessage({message: 'بازه تاریخ انتخاب نشده است', type: 'info', duration: 2, key: 'save'})
          return
        }
        dispatch(reportsActions.updatePeriod('7'))
        setPeriodState('7')
        handleShow({deviceId, from, to})
        setIsOpenCustomDateModal(false)
      }}
                onCancel={() => {
                  // form.setFieldValue('from', '', true)
                  // form.setFieldValue('to', '', true)
                  // dispatch(reportsActions.updateFrom(''))
                  // dispatch(reportsActions.updateTo(''))
                  setIsOpenCustomDateModal(false)
                }}
                title={'انتخاب تاریخ سفارشی'} okText={'انتخاب'} cancelText={'لغو'} isOpen={isopenCustomDateModal}
                setClose={() => setIsOpenCustomDateModal(false)}>
        {renderDatePicker()}
      </KitModal>
      <div className={cls(replaystyles.replayPage)}>
        <div className={cls(replaystyles.replayPageContainer, '!dir-rtl !flex-row')}>
          <DevicesReport devices={devices} className={cls(replaystyles.sidebar, '!relative !-right-0 !w-[7%]')}
                         containerClassName={'!ps-8'} />
          <div className={cls(replaystyles.contentWrapper, '!w-[93%] !relative')}>
            <div className={replaystyles.content}>
              {(!expanded && !loading) &&
                <ReplayControls
                  index={index}
                  setIndex={handleSetIndex}
                  playing={playing}
                  positions={positions}
                  handlePlay={() => setPlaying(!playing)}
                  handleSpeed={(speed: string) => setSpeedPlay(+speed)}
                  handlePrevious={() => setIndex((index) => index - 1)}
                  handleNext={() => setIndex((index) => index + 1)}
                  handleDownload={handleDownload}
                  handleFilter={() => setExpanded(true)}
                  addressOpen={addressOpen}
                  setAddressOpen={setOpen}
                  isMainPage={true}
                  device={device}
                  deviceId={deviceId}
                  isLoading={loading}
                />
              }
              <div className={cls('w-full !h-full relative')}>
                {loading && <SpinnerContainer />}
                <MapView zoomCheck={true}>
                  {!loading && <>
                    <MapRoutePathReplay positions={positions} />
                    {positions.length > 0 && <MapRoutePoints positions={stopsItem} onClick={onPointClick} />}
                    {index < positions.length && (
                      <MapDevicePositions addressOpen={null} positions={[positions[index]]} onClick={onMarkerClick}
                                          titleField="fixTime" />
                    )}
                  </>}
                </MapView>
                {!loading && <>
                  {((positions && positions.length > 0 && positions[index]) && (playing || enableCamera)) &&
                    <MapCamera coordinatesActive={false} latitude={positions[index]?.latitude}
                               longitude={positions[index]?.longitude} />}
                </>}
              </div>
              <ReplayToolbar
                device={device}
                positions={positions}
                index={index}
                hours12={hours12}
                onClose={() => navigate(-1)}
                onMinimize={() => setIsToolbarMinimized(!isToolbarMinimized)}
                isMinimized={isToolbarMinimized}
                isMobile={showStatus === 'mobile'}
                className={showStatus !== 'mobile' && '!w-[85%]'}
              >
                {/*<div className={replaystyles.reportFooter}>*/}
                <div className="flex flex-col gap-2">
                  <div className={replaystyles.typesAction}>
                    {renderButtonTypes(true)}
                  </div>
                  {/*<div>*/}
                  {/*  {renderDatePicker()}*/}
                  {/*</div>*/}
                </div>
                {/*</div>*/}
              </ReplayToolbar>
            </div>
          </div>
        </div>
      </div>
    </>
  }

  const reportRender2 = () => {
    return <>
      {contextHolder}
      {!expanded && !loading && positions && positions.length > 0 && (
        <ReplayControls
          index={index}
          setIndex={handleSetIndex}
          playing={playing}
          positions={positions}
          handlePlay={() => setPlaying(!playing)}
          handleSpeed={(speed: string) => setSpeedPlay(+speed)}
          handlePrevious={() => setIndex((index) => index - 1)}
          handleNext={() => setIndex((index) => index + 1)}
          handleDownload={handleDownload}
          handleFilter={() => setExpanded(true)}
          addressOpen={addressOpen}
          setAddressOpen={setOpen}
          isMainPage={false}
          device={selectedDevice}
          deviceId={selectedDeviceId}
          isLoading={loading}
        />
      )}
      <PageWrapper className={'!py-0'} containerClassName={'!px-0'}>
        <div className={cls(styles.report)}>
          <div className={cls(styles.reportContainer, '!flex flex-col !h-[100dvh]')}>
            <ReplayToolbar
              device={device}
              positions={positions}
              index={index}
              hours12={hours12}
              onClose={() => navigate(-1)}
              onMinimize={() => setIsToolbarMinimized(!isToolbarMinimized)}
              isMinimized={isToolbarMinimized}
              isMobile={showStatus === 'mobile'}
            >
              <ReplayFilter
                devices={devices}
                deviceId={deviceId}
                periodState={periodState}
                form={form}
                onPeriodChange={handlePeriodChange}
                onSubmit={() => {
                  if (!deviceId || deviceId == 'undefined') {
                    showMessage({message: 'دستگاه انتخاب نشده است', type: 'info', duration: 2, key: 'save'})
                    return
                  }
                  if (!from || !to) {
                    showMessage({message: 'تاریخ سفارشی انتخاب نشده است', type: 'info', duration: 2, key: 'save'})
                    return
                  }
                  handleShow({deviceId, from, to})
                }
                }
                onChange={(e) => {
                  const tempFrom = (e as any).target.value.from
                  const tempTo = (e as any).target.value.to
                  form.setFieldValue('from', tempFrom, true)
                  form.setFieldValue('to', tempTo, true)
                  dispatch(reportsActions.updateFrom(tempFrom))
                  dispatch(reportsActions.updateTo(tempTo))
                }
                }
                onChangeInvalid={(e) => {
                  const tempFrom = (e as any).target.value.from
                  const tempTo = (e as any).target.value.to
                  form.setFieldValue('from', tempFrom, true)
                  form.setFieldValue('to', tempTo, true)
                  dispatch(reportsActions.updateFrom(tempFrom))
                  dispatch(reportsActions.updateTo(tempTo))
                }
                }
                onDeviceChange={(e) => {
                  form.setFieldValue('deviceId', e)
                  dispatch(devicesActions.selectId(e))
                }}
                onDeviceClear={() => {
                  form.setFieldValue('deviceId', '')
                  dispatch(devicesActions.selectId(null))
                }}
                onFromChange={(e) => {
                  form.handleChange(e)
                  // dispatch(reportsActions.updateFrom((e.target) as any)['value'])
                }}
                onToChange={(e) => {
                  form.handleChange(e)
                  // dispatch(reportsActions.updateTo((e.target) as any)['value'])
                }}
              />
            </ReplayToolbar>
            <div className={cls('w-full !h-full relative')}>
              <ReplayMap
                loading={loading}
                positions={positions}
                stopsItem={stopsItem}
                index={index}
                onPointClick={onPointClick}
                onMarkerClick={onMarkerClick}
                isCamera={playing}
                isCameraFirst={enableCamera}
              />
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  }

  const renderStatus = () => {
    switch (showStatus) {
      case 'main':
        return mainRender()
      case 'report':
        return reportRender()
      case 'mobile':
        return mainMobileRender()
      default :
        return mainRender()
    }
  }

  return renderStatus()
}

export default ReplayPage
