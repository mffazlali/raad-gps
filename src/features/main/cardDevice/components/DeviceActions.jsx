import React from 'react'
import cls from 'classnames'
import styles from '../CardDevice.module.css'
import Button from '../../../../common/components/custom/general/button/Button'
import altArrowTop from '../../../../resources/images/medias/altArrowTopOutline.svg'
import altArrowBottom from '../../../../resources/images/medias/altArrowBottomOutline.svg'
import altArrowTopActive from '../../../../resources/images/medias/altArrowTopActiveOutline.svg'
import altArrowBottomActive from '../../../../resources/images/medias/altArrowBottomActiveOutline.svg'
import altArrowBottomDisable from '../../../../resources/images/medias/altArrowBottomDisableOutline.svg'
import editIcon from '../../../../resources/images/medias/editOutline.svg'
import editActiveIcon from '../../../../resources/images/medias/editActiveOutline.svg'
import otherIcon from '../../../../resources/images/medias/otherOutline.svg'
import otherActiveIcon from '../../../../resources/images/medias/otherOutlineActive.svg'

const DeviceActions = ({
                         optionToggle,
                         setOptionToggle,
                         listDeviceSpecsDetail,
                         navigate,
                         device,
                         showOnlyPositionFields,
                       }) => {
  return (
    <div className={styles.cardSpecsActions}>
      <div className={styles.rowSpecsToggleOptionWrapper}>
        <Button
          type="button"
          onClick={() => {
            const tmpOptionToggle = !optionToggle
            setOptionToggle(tmpOptionToggle)
          }}
          className={cls(styles.rowSpecsToggleOption)}
          icon={optionToggle ? altArrowTop : altArrowBottom}
          iconHover={optionToggle ? altArrowTopActive : altArrowBottomActive}
          iconDisable={altArrowBottomDisable}
          disabled={listDeviceSpecsDetail.length <= 7}
        />
      </div>
      {!showOnlyPositionFields && <div className={styles.rowSpecsOthersOption}>
        <Button
          type="button"
          onClick={() => navigate(`/device/${device.id}`)}
          className={cls(styles.specsOtherOption)}
          iconClassName={styles.icon}
          icon={editIcon}
          iconHover={editActiveIcon}
        />
        <Button
          type="button"
          onClick={() => navigate('/replay')}
          className={cls(styles.specsOtherOption)}
          iconClassName={styles.icon}
          icon={otherIcon}
          iconHover={otherActiveIcon}
        />
      </div>
      }    </div>
  )
}

export default DeviceActions
