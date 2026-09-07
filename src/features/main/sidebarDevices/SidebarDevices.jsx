import styles from './SidebarDevices.module.css'
import cls from 'classnames'
import {useEffect, useState} from 'react'
import line from '../../../resources/images/medias/line1.svg'
import plusCircle from '../../../resources/images/medias/plusCircleOutline.svg'
import InputSearch from '../../../common/components/custom/dataEntry/inputSearch/InputSearch.jsx'
import {useDispatch, useSelector} from 'react-redux'
import {useEffectAsync} from '../../../common/util/reactHelper.js'
import {devicesActions} from '../../../common/clientStore/index.js'
import Draggable from 'react-draggable'
import {useNavigate} from 'react-router-dom'
import Button from '../../../common/components/custom/general/button/Button'
import DeviceTabs from './deviceTabs/DeviceTabs.jsx'
import DeviceList from './deviceList/deviceList.jsx'
import axios from 'axios'
import axiosInstance from '../../../common/util/axiosConfig'

const SidebarDevices = ({devices}) => {
  const selectedDeviceId = useSelector((state) => state.devices.selectedId)
  const [devicesState, setDevicesState] = useState([])
  const [filteredDevices, setFilteredDevices] = useState([])
  const [tabsActive, setTabsActive] = useState({all: true, online: false, offline: false})
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [zIndexClass, setZIndexClass] = useState('')
  const [, setTime] = useState(Date.now())
  const currentUser = useSelector((state) => state?.session?.user)

  useEffect(() => {
    let deviceList = Object.entries(devices).map((value) => {
      return value[1]
    })
    setDevicesState(deviceList)
    // setFilteredDevices(deviceList)
  }, [devices])


  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 60000)
    return () => {
      clearInterval(interval)
    }
  }, [])

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


  useEffect(() => {
    let tmpFilteredDevices = devicesState
    if (tabsActive.online) {
      tmpFilteredDevices = tmpFilteredDevices.filter(device => device.status === 'online')
    } else if (tabsActive.offline) {
      tmpFilteredDevices = tmpFilteredDevices.filter(device => device.status !== 'online')
    }
    setFilteredDevices(tmpFilteredDevices)

  }, [tabsActive,setTabsActive,devicesState])

  const handleSearch = (keyword) => {
    const tempDevices = devicesState.filter((device) => {
      const lowerCaseKeyword = keyword.trim().toLowerCase()
      return [device.name].some(
        (s) => s && s.toLowerCase().includes(lowerCaseKeyword),
      )
    })
    setFilteredDevices(tempDevices)
  }

  return (
    <div className={cls(styles.deviceList)}>
        <div className={styles.deviceListContainer}>
          <div className={styles.deviceListHeaderWrapper}>
            <div className={styles.deviceListHeader}>
              <h1 className={styles.title}>لیست دستگاه‌های فعال</h1>
              <img src={line} alt="" className={styles.line} />
            </div>
          </div>
          <div className={styles.deviceListContentWrapper}>
            <div className={styles.deviceListContent}>
              <div className={styles.deviceListToolbarWrapper}>
                <div className={styles.deviceListToolbar}>
                  <InputSearch change={handleSearch} />
                </div>
              </div>
              <DeviceTabs tabsActive={tabsActive} setTabsActive={setTabsActive} />
              <DeviceList devices={filteredDevices} />
              <Button
                type="button"
                title={'افزودن دستگاه'}
                onClick={() => navigate('/device')}
                className={cls(
                  styles.buttonWrapper,
                  'btn-primary',
                )}
                titleClassName={styles.text}
                fontClassName={'fa fa-circle-plus'} />

            </div>
          </div>
        </div>
      </div>
  )
}

export default SidebarDevices
