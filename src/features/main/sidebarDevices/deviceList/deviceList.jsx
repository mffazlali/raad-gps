import styles from './deviceList.module.css'
import {useCallback, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useEffectAsync} from '../../../../common/util/reactHelper.js'
import {devicesActions} from '../../../../common/clientStore/index.js'
import DeviceItem from './deviceItem/DeviceItem.jsx'
import cls from 'classnames'

const DeviceList = ({devices, className,setShowDevices=null}) => {
  const selectedDeviceId = useSelector((state) => state.devices.selectedId)
  const dispatch = useDispatch()

  const getDeviceList = () => {
    return devices.map((device) => (
      <DeviceItem
        key={device.id}
        device={device}
        clickDevice={() => dispatch(devicesActions.selectId(device.id))}
        setShowDevices={setShowDevices}
      />
    ))
  }

  return (
    <div className={cls(styles.deviceListItemsWrapper, className)}>
      {getDeviceList()}
    </div>
  )
}

export default DeviceList
