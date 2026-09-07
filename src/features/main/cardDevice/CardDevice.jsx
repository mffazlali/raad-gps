import styles from './CardDevice.module.css'
import cls from 'classnames'
import React, {useCallback, useEffect, useState, useRef} from 'react'
import Draggable from 'react-draggable'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import PositionValue from '../../../common/components/PositionValue.jsx'
import KitPopconfirm from '../../../common/components/uiKits/feeback/kitPopconfirm/KitPopconfirm'
import {useCatch} from '../../../common/util/reactHelper.js'
import useMessage from '../../../common/util/useMessage'
import {devicesActions} from '../../../common/clientStore/index.js'
import deviceCategories from '../../../common/util/deviceCategories'
import {useDeleteDevice, useDevices} from '../../../common/serverStore/useDevice'

import {
  SLEEP_MODE,
  GNSS_SOURSE,
  GNSS_STATUS,
  SD_STATUS,
  STATUS_DEVICE,
  GSM_SIGNAL,
  NETWORK_TYPE,
  TOWING,
  UNPLUG,
  JAMMING,
  preoids,
  ACTIVE_GSM_OPERATOR,
} from '../../../common/util/constants.js'

import DeviceHeader from './components/DeviceHeader.jsx'
import DeviceSpecsList from './components/DeviceSpecsList'
import DeviceActions from './components/DeviceActions'
import moment from 'moment-jalaali'

// Lazy loaded SVG imports
const checkOutline = () => import('../../../resources/images/medias/checkOutline.svg')
const spedometerMax = () => import('../../../resources/images/medias/spedometerMaxOutline.svg')
const alignVerticalSpacing = () => import('../../../resources/images/medias/alignVerticalSpacingOutline.svg')
const routing2 = () => import('../../../resources/images/medias/routing2Outline.svg')
const mapArrowSquare = () => import('../../../resources/images/medias/mapArrowSquareOutline.svg')
const powerLinear = () => import('../../../resources/images/medias/powerLinear.svg')
const altArrowBottom = () => import('../../../resources/images/medias/altArrowBottomOutline.svg')
const altArrowBottomDisable = () => import('../../../resources/images/medias/altArrowBottomDisableOutline.svg')
const altArrowBottomActive = () => import('../../../resources/images/medias/altArrowBottomActiveOutline.svg')
const altArrowTop = () => import('../../../resources/images/medias/altArrowTopOutline.svg')
const altArrowTopActive = () => import('../../../resources/images/medias/altArrowTopActiveOutline.svg')
const editIcon = () => import('../../../resources/images/medias/editOutline.svg')
const editActiveIcon = () => import('../../../resources/images/medias/editActiveOutline.svg')
const otherIcon = () => import('../../../resources/images/medias/otherOutline.svg')
const otherActiveIcon = () => import('../../../resources/images/medias/otherOutlineActive.svg')
const latIcon = () => import('../../../resources/images/medias/latOutline.svg')
const langIcon = () => import('../../../resources/images/medias/langOutline.svg')
const altitudeIcon = () => import('../../../resources/images/medias/altitudeOutline.svg')
const widget2Icon = () => import('../../../resources/images/medias/widget2SpecOutline.svg')
const busIcon = () => import('../../../resources/images/medias/busSpecOutline.svg')
const userSpecIcon = () => import('../../../resources/images/medias/userRoundedSpecOutline.svg')
const networkType = () => import('../../../resources/images/medias/networkTypeOutline.svg')
const line1 = () => import('../../../resources/images/medias/line1.svg')
// const trashBin = () => import('../../../resources/images/medias/trashBinOutline.svg');
const gnssStatusOff = () => import('../../../resources/images/medias/gnssStatusOff.svg')
const gsmSignal1 = () => import('../../../resources/images/medias/gsmSignal1.svg')
const lineSpecs = () => import('../../../resources/images/medias/lineSpecs.svg')
const battryVoltag = () => import('../../../resources/images/medias/battryVoltagOutline.svg')
const externalVoltag = () => import('../../../resources/images/medias/externalVoltagOutline.svg')
const ambientTemperature = () => import('../../../resources/images/medias/ambientTemperatureOutline.svg')
const satStatus = () => import('../../../resources/images/medias/satStatusOutline.svg')
const deviceTime = () => import('../../../resources/images/medias/deviceTimeOutline.svg')
const digitalInput = () => import('../../../resources/images/medias/digitalInputOutline.svg')
const jamming = () => import('../../../resources/images/medias/jammingOutline.svg')
const unplug = () => import('../../../resources/images/medias/unplugOutline.svg')
const mode = () => import('../../../resources/images/medias/deviceModeOutline.svg')
const addressIcon = () => import('../../../resources/images/medias/deviceAddressOutline.svg')

const getDeviceSpecsDetail = (position, group, driver, device, isAPN) => {
  return [
    {
      key: 'speed',
      label: 'سرعت',
      value: position?.speed ?? undefined,
      icon: spedometerMax,
      hidden: false,
    },
    {
      key: 'pitch',
      label: 'شیب',
      value: position?.attributes?.io161 ?? undefined,
      icon: alignVerticalSpacing,
      hidden: false,
    },
    {
      key: 'totalDistance',
      label: 'کل مسافت طی شده',
      value: position?.attributes?.totalDistance ?? undefined,
      icon: routing2,
      hidden: false,
    },
    {
      key: 'motion',
      label: 'وضعیت حرکت',
      value: position?.attributes?.motion ?? undefined,
      icon: mapArrowSquare,
      hidden: false,
    },
    {
      key: 'ignition',
      label: 'وضعیت موتور',
      value: position?.attributes?.ignition ?? undefined,
      icon: powerLinear,
      hidden: false,
    },
    {
      key: 'altitude',
      label: 'ارتفاع',
      value: position?.altitude ?? undefined,
      icon: altitudeIcon,
      hidden: true,
    },
    {
      key: 'latitude',
      label: 'طول جغرافیایی',
      value: position?.latitude ?? undefined,
      icon: latIcon,
      hidden: true,
    },
    {
      key: 'longitude',
      label: 'عرض جغرافیایی',
      value: position?.longitude ?? undefined,
      icon: langIcon,
      hidden: true,
    },
    {
      key: 'io237',
      label: 'نوع شبکه',
      value: position?.attributes?.io237 ? NETWORK_TYPE[position?.attributes?.io237] : undefined,
      icon: networkType,
      hidden: true,
    },
    {
      key: 'status',
      label: 'برخط بودن',
      value: device?.status ? STATUS_DEVICE[device?.status] : undefined,
      icon: widget2Icon,
      hidden: true,
    },
    {
      key: 'io67',
      label: 'ولتاژ باتری دستگاه',
      value: position?.attributes?.io67 ? `${position?.attributes?.io67}%` : undefined,
      icon: battryVoltag,
      hidden: true,
    },
    {
      key: 'power',
      label: 'ولتاژ باتری خودرو',
      value: position?.attributes?.power ? (+(position?.attributes?.power))?.toFixed(2) : undefined,
      icon: externalVoltag,
      hidden: true,
    },
    {
      key: 'io252',
      label: 'وضعیت اتصال به باتری خودرو',
      value: position?.attributes ? UNPLUG[position?.attributes?.io252] : undefined,
      icon: unplug,
      hidden: true,
    },
    {
      key: 'sat',
      label: 'تعداد ماهواره‌های متصل',
      value: position?.attributes?.sat ?? undefined,
      icon: satStatus,
      hidden: true,
    },
    {
      key: 'coolantTemp',
      label: 'دمای محیط',
      value: position?.attributes?.io53 ?? undefined,
      icon: ambientTemperature,
      hidden: true,
    },
    {
      key: 'driver',
      label: 'نام راننده',
      value: driver?.name ?? undefined,
      icon: userSpecIcon,
      hidden: true,
    },
    {
      key: 'category',
      label: 'نوع خودرو',
      value: device?.category ?? undefined,
      icon: busIcon,
      hidden: true,
    },
    {
      key: 'group',
      label: 'گروه',
      value: group?.name ?? undefined,
      icon: widget2Icon,
      hidden: true,
    },
    {
      key: 'deviceTime',
      label: 'زمان آخرین داده ارسالی',
      value: position?.deviceTime ?? undefined,
      icon: deviceTime,
      hidden: true,
    },
    {
      key: 'io200',
      label: 'حالت',
      value: position?.attributes?.io200 ? SLEEP_MODE[position?.attributes?.io200] : undefined,
      icon: mode,
      hidden: true,
    },
    {
      key: 'activeGsmOperator',
      label: 'اپراتور سیم کارت ردیاب',
      value: position?.attributes?.io241 ? ACTIVE_GSM_OPERATOR[position?.attributes?.io241] : undefined,
      icon: widget2Icon,
      hidden: true,
    },
    {
      key: 'digitalInput',
      label: 'digital input',
      value: position?.attributes?.in1 ?? undefined,
      icon: digitalInput,
      hidden: true,
    },
    {
      key: 'AnalogInput',
      label: 'Analog Input',
      value: position?.attributes?.io9 ?? undefined,
      icon: digitalInput,
      hidden: true,
    },
    {
      key: 'digitalOutput',
      label: 'digital output',
      value: position?.attributes?.out1 ?? undefined,
      icon: digitalInput,
      hidden: true,
    },
    {
      key: 'GNSSPDOP',
      label: 'GNSS PDOP',
      value: position?.attributes?.io181 ?? undefined,
      icon: widget2Icon,
      hidden: true,
    },
    {
      key: 'GNSSHDOP',
      label: 'GNSS HDOP',
      value: position?.attributes?.io182 ?? undefined,
      icon: widget2Icon,
      hidden: true,
    },
    {
      key: 'GNSSSourse',
      label: 'نوع ماهواره های GPS',
      value: position?.attributes?.io109 ? GNSS_SOURSE[position?.attributes?.io109] : undefined,
      icon: widget2Icon,
      hidden: true,
    },
    {
      key: 'SDStatus',
      label: 'وضعیت کارت حافظه',
      value: position?.attributes?.io10 ? SD_STATUS[position?.attributes?.io10] : undefined,
      icon: widget2Icon,
      hidden: true,
    },
    {
      key: 'towing',
      label: 'وضعیت بکسل',
      value: position?.attributes?.io246 ? TOWING[position?.attributes?.io246] : undefined,
      icon: widget2Icon,
      hidden: true,
    },
    {
      key: 'address',
      label: 'آدرس',
      value: isAPN ? null : position,
      icon: addressIcon,
      hidden: true,
    },
  ]
}

const CardDevice = ({
                      position,
                      deviceId,
                      addressOpen,
                      setAddressOpen,
                      isMobileMedia,
                      ActiveMain = true,
                      isReport = false,
                      showOnlyPositionFields = false,
                    }) => {
  const device = useSelector((state) => state.devices.items[deviceId])
  const navigate = useNavigate()
  const [optionToggle, setOptionToggle] = useState(false)
  const [listDeviceSpecsDetail, setListDeviceSpecsDetail] = useState([])
  const {contextHolder, showMessage} = useMessage()
  const group = useSelector((state) => device?.groupId ? state.groups.items[device.groupId] : '')
  const driver = useSelector((state) => device?.uniqueId ? state.drivers.items[device.uniqueId] : '')
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state?.session?.user)
  const isAPN = import.meta.env.VITE_APP_APN_ENABLE?.toLowerCase?.() === 'true'
  const ref = useRef()
  const deleteDevice = useDeleteDevice()

  useEffect(() => {
    const specs = getDeviceSpecsDetail(position, group, driver, device, isAPN)
    const filteredSpecs = specs.filter(item => {
      // First check if we should only show position fields
      if (showOnlyPositionFields) {
        // Only show fields that directly depend on position data
        const positionDependentFields = ['speed', 'pitch', 'totalDistance', 'motion', 'ignition', 'altitude',
          'latitude', 'longitude', 'io237', 'io67', 'power', 'io252', 'sat', 'coolantTemp', 'deviceTime',
          'io200', 'io241', 'in1', 'io9', 'out1', 'io181', 'io182', 'io109', 'io10', 'io246']
        if (!positionDependentFields.includes(item.key)) {
          return false
        }
      }

      // Then apply the regular value filtering
      return (item.value != '' && item.value != null && item.value != undefined && item.value != 0) ||
        (!['latitude', 'longitude'].includes(item.key) && item.value == 0)
    })
    setListDeviceSpecsDetail(filteredSpecs)
  }, [position, group, driver, device, isAPN, showOnlyPositionFields])

  useEffect(() => {
    if (listDeviceSpecsDetail.length <= 6) {
      setOptionToggle(false)
    }
  }, [listDeviceSpecsDetail])

  const handleRemove = useCatch(async () => {
    try {
      await deleteDevice.mutateAsync(deviceId)
      dispatch(devicesActions.selectId(undefined))
    } catch (error) {
      showMessage({message: error?.response?.data?.message, type: 'error', duration: 2, key: 'save'})
      console.error('Error removing device:', error)
    }
  })

  const isPositionNotUpdated = () => {
    // const serverTime = toJalaliMoment(position?.serverTime ?? '')
    // const deviceTime = toJalaliMoment(position?.deviceTime ?? '')
    // return (moment(serverTime).diff(deviceTime, 'second')) >= 30
    return (device?.status == 'offline' || device?.status == 'unknown')
  }

  const mobileRender = () => {
    return (
      <div
        ref={ref}
        className={cls(styles.deviceSpecsDetail, showOnlyPositionFields ? 'h-[30%]' : optionToggle ? 'h-[calc(100Dvh-103px)]' : 'h-[40%]')}>
        <div className={cls(styles.deviceSpecsDetailContainer)}>
          <div className={styles.cardSpecsWrapper}>
            <div className={styles.cardSpecs}>
              <DeviceHeader
                showOnlyPositionFields={showOnlyPositionFields}
                device={device}
                position={position}
                handleRemove={handleRemove}
                isAPN={isAPN}
                isDesktop={false}
              />
              <div className={cls(styles.cardSpecsContentWrapper, showOnlyPositionFields && '!h-[calc(100%-40px)]')}>
                <div className={cls(styles.cardSpecsContent)}>
                  <div className={styles.updateStatusWrapper}>
                    <span className={styles.updateStatus}></span>
                  </div>
                  <DeviceSpecsList
                    showOnlyPositionFields={showOnlyPositionFields}
                    listDeviceSpecsDetail={listDeviceSpecsDetail}
                    device={device}
                    position={position}
                    addressOpen={addressOpen}
                    setAddressOpen={setAddressOpen}
                    setOptionToggle={setOptionToggle}
                  />
                </div>
              </div>
              {!showOnlyPositionFields && <DeviceActions
                optionToggle={optionToggle}
                setOptionToggle={setOptionToggle}
                listDeviceSpecsDetail={listDeviceSpecsDetail}
                navigate={navigate}
                device={device}
              />}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const desktopRender = () => {
    return (
      <Draggable nodeRef={ref} defaultClassNameDragging="shadow !shadow-primaryHover"
                 handle={`.${styles.cardSpecsHeaderWrapper}`}>
        <div
          ref={ref}
          className={cls(styles.deviceSpecsDetail, !optionToggle ? ' !w-[286px]' : '!h-[480px] !w-[540px]')}>
          <div className={cls(styles.deviceSpecsDetailContainer)}>
            <div className={styles.cardSpecsWrapper}>
              <div className={styles.cardSpecs}>
                <DeviceHeader
                  device={device}
                  position={position}
                  handleRemove={handleRemove}
                  showOnlyPositionFields={showOnlyPositionFields}
                  isAPN={isAPN}
                />
                <div
                  className={cls(styles.cardSpecsContentWrapper, showOnlyPositionFields ? '!h-[85%]' : optionToggle && '!h-[75%]')}>
                  <div className={cls(styles.cardSpecsContent)}>
                    <div className={styles.updateStatusWrapper}>
                      {!isReport && <span
                        className={styles.updateStatus}>{isPositionNotUpdated() && 'داده بروز رسانی نشده است'}</span>}
                    </div>
                    <DeviceSpecsList
                      listDeviceSpecsDetail={listDeviceSpecsDetail}
                      device={device}
                      position={position}
                      addressOpen={addressOpen}
                      setAddressOpen={setAddressOpen}
                      setOptionToggle={setOptionToggle}
                    />
                  </div>
                </div>
                <DeviceActions
                  optionToggle={optionToggle}
                  setOptionToggle={setOptionToggle}
                  listDeviceSpecsDetail={listDeviceSpecsDetail}
                  navigate={navigate}
                  device={device}
                  showOnlyPositionFields={showOnlyPositionFields}
                />
              </div>
            </div>
          </div>
        </div>
      </Draggable>
    )
  }

  return (
    <>
      {contextHolder}
      {isMobileMedia ? mobileRender() : desktopRender()}
    </>
  )
}

export default CardDevice
