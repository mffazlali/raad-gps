import styles from './CardDevicesMobile.module.css'
import cls from 'classnames'
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useEffectAsync} from '../../../common/util/reactHelper.js'
import {devicesActions} from '../../../common/clientStore/index.js'
import {useLocation, useNavigate} from 'react-router-dom'
import Button from '../../../common/components/custom/general/button/Button'
import DeviceTabs from '../sidebarDevices/deviceTabs/DeviceTabs.jsx'
import DeviceList from '../sidebarDevices/deviceList/deviceList.jsx'
import Modal from '../../../common/components/custom/feedback/modal/Modal'
import LazyImage from '../../../common/components/custom/dataDisplay/lazyImage'

const LineImage = () => import('../../../resources/images/medias/line1.svg')
const PlusCircleImage = () => import('../../../resources/images/medias/plusCircleOutline.svg')

const CardDevicesMobile = ({devices, showDevices, setShowDevices}) => {
  const location = useLocation()
  const selectedDeviceId = useSelector((state) => state.devices.selectedId)
  const [devicesState, setDevicesState] = useState([])
  const [filteredDevices, setFilteredDevices] = useState([])
  const [tabsActive, setTabsActive] = useState({all: true, online: false, offline: false})
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [zIndexClass, setZIndexClass] = useState('')
  const [, setTime] = useState(Date.now())

  useEffect(() => {
    setDevicesState(devices)
    setFilteredDevices(devices)
  }, [devices])

  useEffect(() => {
    if (location.pathname === '/replay') {
      if (!selectedDeviceId || selectedDeviceId == 'undefined') {
        setShowDevices(true)
      }
    }
  }, [location])

  useEffect(() => {
    let tmpFilteredDevices = devicesState
    if (tabsActive.online) {
      tmpFilteredDevices = tmpFilteredDevices.filter(device => device.status === 'online')
    } else if (tabsActive.offline) {
      tmpFilteredDevices = tmpFilteredDevices.filter(device => device.status !== 'online')
    }
    setFilteredDevices(tmpFilteredDevices)

  }, [tabsActive, setTabsActive])

  return (
    <Modal dependency={[devices]}
           type={'mobileTab'}
           // backdropClassName={'z-[1000]'}
           wrapperClassName={'max-w-[100%]'}
           open={showDevices}
           setOpen={setShowDevices}
           pageMode={false}>
      <div className={cls(styles.popupDevicesMobile)}>
        <div className={styles.popupDevicesMobileContainer}>
          <div className={styles.popupDevicesMobileHeaderWrapper}>
            <div className={styles.popupDevicesMobileHeader}>
              <h1 className={styles.title}>لیست دستگاه‌های فعال</h1>
              <LazyImage src={LineImage} alt="" className={styles.line} />
            </div>
          </div>
          <div className={styles.popupDevicesMobileContentWrapper}>
            <div className={styles.popupDevicesMobileContent}>
              {/*<DeviceTabs tabsActive={tabsActive} setTabsActive={setTabsActive} />*/}
              <DeviceList devices={filteredDevices} className={'!h-[220px]'} setShowDevices={setShowDevices}/>
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
    </Modal>
  )
}

export default CardDevicesMobile
