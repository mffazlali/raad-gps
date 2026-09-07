import {useNavigate, useParams} from 'react-router-dom'
import styles from '../../SettingsCommon.module.css'
import cls from 'classnames'
import KitInputWrapper from '../../../../common/components/uiKits/dataEntry/kitInputWrapper/KitInputWrapper.tsx'
import React from 'react'
import useMessage from '../../../../common/util/useMessage.tsx'
import Button from '../../../../common/components/custom/general/button/Button.tsx'
import Card from '../../../../common/components/custom/dataDisplay/card/Card.tsx'
import {useTranslation} from '../../../../common/components/LocalizationProvider'
import LinkField from '../../../../common/components/LinkField.tsx'
import useFeatures from '../../../../common/util/useFeatures'
import {formatNotificationTitle} from '../../../../common/util/formatter'
import DeviceConnectionsInputs from './deviceConnectionsInputs/DeviceConnectionsInputs.tsx'

const DeviceConnections = ({setOpen}: {setOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const t = useTranslation()
  const {id} = useParams()
  const navigate = useNavigate()
  const {contextHolder, showMessage} = useMessage()
  const features = useFeatures()

  const handleCancelClick = () => {
    navigate(-1)
  }

  return (
    <div className={styles.settingsRegister}>
      <div className={styles.settingsRegisterContainer}>
        {contextHolder}
        <div className={styles.form}>
          <div className={cls(styles.inputsWrapper)}>
            <DeviceConnectionsInputs />
          </div>
          <div className={styles.actionWrapper}>
            <div className={styles.action}>
              <Button
                type="button"
                title={'لغو'}
                onClick={handleCancelClick}
                className={cls(styles.button, styles.cancelButton, 'btn-primary-outline')}
                titleClassName={cls(styles.label, styles.cancelLabel)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeviceConnections
