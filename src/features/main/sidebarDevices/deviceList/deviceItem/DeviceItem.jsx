import styles from './DeviceItem.module.css'
import cls from 'classnames'
import mapPoint from '../../../../../resources/images/medias/mapPointOutline.svg'
import mapPointA from '../../../../../resources/images/medias/mapPointOutlineActive.svg'
import powerLinearD from '../../../../../resources/images/medias/powerLinearDeactive.svg'
import powerLinearA from '../../../../../resources/images/medias/powerLinearActive.svg'
import solarBell from '../../../../../resources/images/medias/solarBellOutline.svg'
import solarBellRed from '../../../../../resources/images/medias/solarBellRedOutline.svg'
import {useSelector} from 'react-redux'
import {useEffectAsync} from '../../../../../common/util/reactHelper.js'
import {devicesActions} from '../../../../../common/clientStore/index.js'
import {formatStatus} from '../../../../../common/util/formatter.js'
import moment from 'moment-jalaali'
import 'moment/locale/fa.js'
import {NavLink, useNavigate} from 'react-router-dom'
import mapPointWaveA from '../../../../../resources/images/medias/mapPointWaveOutlineActive.svg'
import mapPointWave from '../../../../../resources/images/medias/mapPointWaveOutline.svg'
import React, {useEffect, useState} from 'react'
import {mapIcons, mapImageIcons} from '../../../../../common/map/core/preloadImages.js'
import axios from 'axios'
import axiosInstance from '../../../../../common/util/axiosConfig'
import {toJalaliMoment} from '../../../../../common/util/DateTimeUtil.js'
import {getDeviceTrackingState, saveDeviceTrackingState} from '../../../../../common/util/isTrackingDeviceUtil.js'

const DeviceItem = ({device, clickDevice, setShowDevices = null, showTracking = true}) => {
  const selectedDeviceId = useSelector((state) => state.devices.selectedId)
  const positions = useSelector((state) => state.session.positions)
  const navigate = useNavigate()
  const notifications = useSelector((state) => state.notifications.items)
  const notificationsFlags = useSelector((state) => state.notifications.flags)
  const currentUser = useSelector((state) => state?.session?.user)
  const timestamp = useSelector((state) => state.session.timestamp)
  const [isTracking, setIsTracking] = useState(false)

  // Initialize tracking state for this device
  useEffect(() => {
    if (showTracking) {
      setIsTracking(getDeviceTrackingState(device.id))
    }
  }, [device.id])

  // useEffectAsync(async () => {
  //   try {
  //     const response = await axiosInstance.get(`/api/devices?userId=${currentUser.id}`)
  //     if (response.status === 200) {
  //       dispatch(devicesActions.refresh(response.data))
  //     }
  //   } catch (error) {
  //     throw Error(error.response?.data || error.message)
  //   }
  // }, [])

  // useEffect(() => {
  //   {
  //     notificationsFlags
  //   }
  // }, [notificationsFlags])

  const getCurrentPosition = (id) => {
    return positions[id]
  }

  const secondaryText = () => {
    const tempMoment = toJalaliMoment(timestamp)

    let status
    if (device.status === 'online') {
      status = 'آنلاین'
    } else {
      if (device.lastUpdate == null) {
        status = 'آفلاین'
      } else {
        // تبدیل تاریخ میلادی به شمسی و نمایش به صورت "X دقیقه/ساعت/روز پیش"
        const lastUpdateMoment = toJalaliMoment(device?.lastUpdate)
        status = lastUpdateMoment.from(tempMoment)
      }
    }
    return (
      <>
        <span
          className={cls(styles.state, (device.status === 'online') ? styles.stateOnline : styles.stateOffline)}>{status}</span>
      </>
    )
  }

  const deviceItemHandle = (id) => {
    if (clickDevice) {
      clickDevice()
    }
    if (setShowDevices) {
      setShowDevices(false)
    }
  }

  const notificationDeviceHandle = (event) => {
    event.preventDefault()
    navigate(`/notification/${device.id}`)
  }

  const handleTrackingToggle = (event) => {
    event.preventDefault()
    event.stopPropagation()
    const newTrackingState = !isTracking
    setIsTracking(newTrackingState)
    saveDeviceTrackingState(device.id, newTrackingState)
  }

  return (
    <div
      onClick={() => deviceItemHandle(device.id)}
      className={cls(styles.deviceItem)}
      key={device.id}>
      <div className={styles.bellIconWrapper}>
        <NavLink
          to="/"
          onClick={(event) => notificationDeviceHandle(event)}
          className={cls(styles.item, ({isActive, isPending}) =>
            isPending ? '' : isActive ? '' : '',
          )}>
          {({isActive, isPending, isTransitioning}) => (
            <img
              src={(notificationsFlags && notificationsFlags[device.id]) ? solarBellRed : solarBell}
              alt=""
              className={cls(
                styles.bellIcon,
              )}
            />
          )}
        </NavLink>

      </div>
      <div className={cls(styles.deviceMainItem, selectedDeviceId == device.id && '!shadow-primaryActive')}>
        <div className={styles.deviceRightItem}>
          <div className={styles.iconItemWrapper}>
            <img
              src={device.id == selectedDeviceId ? mapPointA : mapPoint}
              alt=""
              className={cls(
                styles.iconItem,
                device.id == selectedDeviceId
                  ? styles.iconItemActive
                  : styles.iconItemDeactive,
              )}
            />
          </div>
          <div className={styles.textItem}>
            <span className={styles.name} title={device.name}>{device.name}</span>
            {secondaryText()}
          </div>
        </div>
        <div className={styles.deviceLeftItem}>
          {/*  <img src={Object({...mapIcons, ...mapImageIcons})[`${device.category}Left`]} className={styles.iconItem}*/}
          {/*       alt={''} />*/}
          <img
            src={
              getCurrentPosition(device.id)?.attributes?.ignition
                ? powerLinearA
                : powerLinearD
            }
            alt=""
            className={cls(styles.iconItem)}
          />
          {showTracking && <button
            onClick={handleTrackingToggle}
            className={cls(
              styles.trackingButton,
              isTracking ? styles.trackingActive : styles.trackingInactive,
            )}
            title={isTracking ? 'توقف تعقیب دستگاه' : 'شروع تعقیب دستگاه'}
          >
            <img
              src={isTracking ? mapPointWaveA : mapPointWave}
              alt=""
              className={styles.trackingIcon}
            />
          </button>}
        </div>
      </div>
    </div>
  )
}

export default DeviceItem
