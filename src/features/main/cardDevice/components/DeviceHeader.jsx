import React, {useEffect} from 'react'
import cls from 'classnames'
import styles from '../CardDevice.module.css'
import LazyImage from '../../../../common/components/custom/dataDisplay/lazyImage.jsx'
import KitPopconfirm from '../../../../common/components/uiKits/feeback/kitPopconfirm/KitPopconfirm'
import {BATTERY_MODE, GNSS_STATUS, GSM_SIGNAL} from '../../../../common/util/constants.js'
import trashBin from '../../../../resources/images/medias/trashBinOutline.svg'
import line1 from '../../../../resources/images/medias/line1.svg'
import gnssStatusOff from '../../../../resources/images/medias/gnssStatusOff.svg'
import gsmSignal1 from '../../../../resources/images/medias/gsmSignal1.svg'
import useConfirm from '../../../../common/util/useConfirm'
import editIcon from '../../../../resources/images/medias/editOutline.svg'
import editActiveIcon from '../../../../resources/images/medias/editActiveOutline.svg'
import Button from '../../../../common/components/custom/general/button/Button.js'
import {useNavigate} from 'react-router-dom'

const DeviceHeader = ({
                        device, position, handleRemove, showOnlyPositionFields, isAPN, isDesktop = true,
                      }) => {
  const navigate = useNavigate()
  const {showConfirm, contextConfirmHolder} = useConfirm()

  const getBatteryIcon = (value) => {
    if (value >= 0 && value <= 25) {
      return BATTERY_MODE[0]
    } else if (value >= 26 && value <= 50) {
      return BATTERY_MODE[1]
    } else if (value >= 51 && value <= 75) {
      return BATTERY_MODE[2]
    } else if (value >= 75 && value <= 100) {
      return BATTERY_MODE[3]
    }
    return BATTERY_MODE[0]
  }

  const getBatteryDataType = (dataType = 'image', isDefaultLabel = true) => {
    const defaultLabel = isDefaultLabel ? 'اطلاعات باتری موجود نیست' : ''
    // if (isAPN) {
    if (dataType === 'label') {
      return position?.attributes?.batteryLevel ? position?.attributes?.batteryLevel + '%' : isDefaultLabel ? 'اطلاعات باتری بروز نیست' : ''
    }
    return getBatteryIcon(position?.attributes?.batteryLevel)
    // if (position?.attributes?.io113) {
    //   if (dataType === 'label') {
    //     return position?.attributes?.io113 ? position?.attributes?.io113 + '%' : defaultLabel
    //   }
    //   return getBatteryIcon(position?.attributes?.io113)
    // } else if (position?.attributes?.battery) {
    //   const batteryPercent = position?.attributes?.battery ? (100 / 5) * (+position?.attributes?.battery) : position?.attributes?.battery
    //   if (dataType === 'label') {
    //     return batteryPercent ? String(batteryPercent + '%') : defaultLabel
    //   }
    //   return getBatteryIcon(batteryPercent)
    // } else {
    //   if (dataType === 'label') {
    //     return position?.attributes?.batteryLevel ? position?.attributes?.batteryLevel + '%' : isDefaultLabel ? 'اطلاعات باتری بروز نیست' : ''
    //   }
    //   return getBatteryIcon(position?.attributes?.batteryLevel)
    // }
  }

  return (<>
    {contextConfirmHolder}
    <div className={styles.cardSpecsHeaderWrapper}>
      <div className={styles.cardSpecsHeader}>
        <div className={styles.rightSpecsHeader}>
          <div className={styles.iconWrapper}>
            {!isDesktop && (<span className={styles.batteryLabel}>{getBatteryDataType('label', false)}  </span>)}
            <LazyImage
              className={styles.icon}
              src={getBatteryDataType()}
              alt="battery"
              title={getBatteryDataType('label')}
            />
          </div>
          <span className={styles.labelWrapper}>
            <span className={styles.label} title={device?.name}>{device?.name}</span>
          </span>
        </div>
        <div className={styles.leftSpecsHeader}>
          {!showOnlyPositionFields && <div className={styles.trashWrapper}>
            {isDesktop ? <button type="button">
              <KitPopconfirm
                title="عملیات حذف"
                description="آیا از حذف دستگاه انتخاب شده اطمینان دارید؟"
                onConfirm={handleRemove}
                onCancel={() => {
                }}
                okText="بلی"
                cancelText="خیر"
                placement={'right'}
              >
                <img
                  src={trashBin}
                  alt=""
                  className={styles.trashIcon}
                />
              </KitPopconfirm>
            </button> : <button type="button" onClick={() => {
              showConfirm({
                type: 'warning',
                title: 'عملیات حذف',
                message: 'آیا از حذف دستگاه انتخاب شده اطمینان دارید؟',
                onOk: () => {
                  handleRemove()
                },
              })
            }}>
              <img
                src={trashBin}
                alt=""
                className={styles.trashIcon}
              />
            </button>}
          </div>}
          {(!isDesktop && !showOnlyPositionFields) && <Button
            type="button"
            onClick={() => navigate(`/device/${device.id}`)}
            className={cls(styles.specsOtherOption)}
            iconClassName={styles.iconMobile}
            icon={editIcon}
            iconHover={editActiveIcon}
          />}
          <div className={styles.gnssStatusWrapper}>
            <LazyImage
              src={GNSS_STATUS[position?.attributes?.io69] ?? gnssStatusOff}
              alt=""
              className={styles.gnssStatus}
            />
          </div>
          <div className={styles.gsmSignalWrapper}>
            <LazyImage
              src={GSM_SIGNAL[position?.attributes?.rssi] ?? gsmSignal1}
              alt=""
              className={styles.gsmSignal}
            />
          </div>
        </div>
      </div>
      <div className={styles.lineWrapper}>
        <LazyImage src={line1} alt="" className={styles.line} />
      </div>
    </div>
  </>)
}

export default DeviceHeader
