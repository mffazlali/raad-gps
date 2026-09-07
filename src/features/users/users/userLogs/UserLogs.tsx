import {useNavigate, useParams} from 'react-router-dom'
import styles from '../../UsersCommon.module.css'
import cls from 'classnames'
import KitInputWrapper from '../../../../common/components/uiKits/dataEntry/kitInputWrapper/KitInputWrapper.tsx'
import React, {useState} from 'react'
import useMessage from '../../../../common/util/useMessage.tsx'
import Button from '../../../../common/components/custom/general/button/Button.tsx'
import Card from '../../../../common/components/custom/dataDisplay/card/Card.tsx'
import {useTranslation} from '../../../../common/components/LocalizationProvider'
import LinkField from '../../../../common/components/LinkField.tsx'
import {formatNotificationTitle, formatTime} from '../../../../common/util/formatter'
import {useDispatch, useSelector} from 'react-redux'
import {usePreference} from '../../../../common/util/preferences'
import {useDeviceReadonly, useRestriction} from '../../../../common/util/permissions'
import {useEffectAsync} from '../../../../common/util/reactHelper'
import {devicesActions} from '../../../../common/clientStore'
import {ColumnsKitGridType} from '../../../../common/components/uiKits/dataDisplay/kitGrid/KitGridType.ts'
import KitGrid from '../../../../common/components/uiKits/dataDisplay/kitGrid/KitGrid.tsx'
import axios from 'axios'
import axiosInstance from '../../../../common/util/axiosConfig.ts'

const UserLogs = ({setOpen}: {setOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {contextHolder, showMessage} = useMessage()
  const deviceReadonly = useDeviceReadonly()
  const [timestamp, setTimestamp] = useState(Date.now())
  const hours12 = usePreference('twelveHourFormat')
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const readonly = false
  const t = useTranslation()
  const {id} = useParams()

  useEffectAsync(async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/api/users/logs')
      if (response.status === 200) {
        setItems(response.data)
        setLoading(false)
      } else {
        setLoading(false)
        throw Error(response.data)
      }
    } catch (e) {
      setLoading(false)
    }
  }, [timestamp])

  const columns: ColumnsKitGridType = [
    {
      field: 'eventTime',
      headerName: 'تاریخ و ساعت',
      valueFormatter: (f) => formatTime(f.value, 'seconds', hours12),
    },
    {
      headerName: 'رخداد',
      field: 'event',
    },
  ]

  const handleCancelClick = () => {
    navigate(-1)
  }

  return (
    <div className={styles.usersReport}>
      <div className={styles.usersReportContainer}>
        {contextHolder}
        <div className={styles.reportWrapper}>
          <div className={styles.gridContainer}>
            <KitGrid containerClassName={'h-[100%] relative'} dataSource={items} columns={columns} loading={loading} />
          </div>
          <div className={styles.actionsWrapper}>
            <div className={styles.actions}>
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

export default UserLogs
