import styles from './DevicesReport.module.css'
import cls from 'classnames'
import {useCallback, useEffect, useState} from 'react'
import line from '../../../../resources/images/medias/line1.svg'
import {useDispatch, useSelector} from 'react-redux'
import {useEffectAsync} from '../../../../common/util/reactHelper.js'
import {devicesActions} from '../../../../common/clientStore/index.js'
import Draggable from 'react-draggable'
import DeviceItem from '../../../main/sidebarDevices/deviceList/deviceItem/DeviceItem.jsx'
import axios from 'axios'
import axiosInstance from '../../../../common/util/axiosConfig'

const DevicesReport = ({devices, className, containerClassName=''}) => {
  const selectedDeviceId = useSelector((state) => state.devices.selectedId)
  const dispatch = useDispatch()
  const [zIndexClass, setZIndexClass] = useState('')
  const [, setTime] = useState(Date.now())
  const currentUser = useSelector((state) => state?.session?.user)

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 60000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffectAsync(async () => {
    const response = await axiosInstance.get(`/api/devices/sessionDevices?userId=${currentUser.id}`)
    if (response.status === 200) {
      dispatch(devicesActions.refresh(response.data))
    } else {
      throw Error(response.data)
    }
  }, [])


  const handleClickDevice = (id) => {
    dispatch(devicesActions.selectId(id))
  }

  const getDeviceList = useCallback(() => {
    let devicesReport = Object.entries(devices).map((value) => {
      return value[1]
    })
    return devicesReport.map((device, index) => (
      <DeviceItem key={device.id} device={device} clickDevice={() => {
        handleClickDevice(device.id)
      }} showTracking={false} />
    ))
  }, [devices, selectedDeviceId])


  return (
    <div className={cls(styles.devicesReport, className)}>
      <div className={cls(styles.devicesReportContainer, containerClassName)}>
        <div className={styles.devicesReportHeaderWrapper}>
          <div className={styles.devicesReportHeader}>
            <h1 className={styles.title}>گزارش‌ها به تفکیک دستگاه</h1>
            <h2 className={styles.subTitle}>دستگاه مورد نظر خود را انتخاب کنید</h2>
            <img src={line} alt="" className={styles.line} />
          </div>
        </div>
        <div className={styles.devicesReportContentWrapper}>
          <div className={styles.devicesReportContent}>
            <div className={styles.devicesReportItemsWrapper}>
              {getDeviceList()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DevicesReport
