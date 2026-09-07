import styles from './MobileLayout.module.css'
import cls from 'classnames'
import MobileContent from './mobileContent/MobileContent.jsx'
import MobileFooter from './mobileFooter/MobileFooter.jsx'
import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {layoutActions} from '../../clientStore/layout.js'

const MobileLayout = () => {
  const dispatch = useDispatch()
  const devices = useSelector((state) => state.devices.items)
  const filteredDevices = useSelector((state) => state.layout.filteredDevices)
  const [showDevices, setShowDevices] = useState(false)

  useEffect(() => {
    let deviceList = Object.entries(devices).map((value) => {
      return value[1]
    })
    setFilteredDevices(deviceList)
  }, [devices])

  const setFilteredDevices = (devices) => {
    dispatch(layoutActions.setFilteredDevices(devices))
  }



  return (<div className={styles.mobileLayout}>
    <div className={styles.mobileLayoutContainer}>
      <MobileContent devices={filteredDevices} showDevices={showDevices} setShowDevices={setShowDevices}/>
      <MobileFooter />
    </div>
  </div>)
}

export default MobileLayout
