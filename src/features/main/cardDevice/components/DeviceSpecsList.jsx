import React from 'react'
import cls from 'classnames'
import styles from '../CardDevice.module.css'
import LazyImage from '../../../../common/components/custom/dataDisplay/lazyImage.jsx'
import PositionValue from '../../../../common/components/PositionValue.jsx'

const DeviceSpecsList = ({
                           showOnlyPositionFields,
                           listDeviceSpecsDetail,
                           device,
                           position,
                           addressOpen,
                           setAddressOpen,
                           setOptionToggle,
                         }) => {
  return (
    <div className={cls(styles.cardSpecsList)}>
      <div className={cls(styles.colSpecsOptions)}>
        {listDeviceSpecsDetail.map((item, index) => (
          <div key={index} className={cls(styles.rowSpecsOptions)}>
            <div className={styles.rightSpecsOption}>
              <LazyImage src={item.icon} alt="" className={styles.line} />
              <span className={styles.label}>{item.label}</span>
            </div>
            <div className={styles.leftSpecsOption}>
              <span className={styles.label}>
                <PositionValue
                  property={item.key}
                  value={item.value}
                  deviceId={device?.id}
                  position={position}
                  addressOpen={addressOpen}
                  setAddressOpen={setAddressOpen}
                  setOptionToggle={setOptionToggle}
                />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DeviceSpecsList
