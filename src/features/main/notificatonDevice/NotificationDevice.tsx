import styles from './NotificationDevice.module.css'
import cls from 'classnames'
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import Button from '../../../common/components/custom/general/button/Button.tsx'
import {ColumnsKitGridType} from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGridType.ts'
import {formatTime} from '../../../common/util/formatter'
import {usePreference} from '../../../common/util/preferences'
import {preoids, eventTypes as eventTypesUtil} from '../../../common/util/constants.js'
import KitGrid from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGrid.tsx'
import {notificationsActions} from '../../../common/clientStore'
import Card from '../../../common/components/custom/dataDisplay/card/Card.tsx'
import usePersistedNotificationsState from '../../../common/util/usePersistedNotificationsState'

const NotificationDevice = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  const notifications = useSelector((state: any) => state.notifications.items)
  const hours12 = usePreference('twelveHourFormat')
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const notificationsFlags = useSelector((state: any) => state.notifications.flags)
  const dispatch = useDispatch()
  const {saveNotificationsFlag, saveNotifications} = usePersistedNotificationsState()

  useLayoutEffect(() => {
    refreshNotifications()
  }, [])

  useEffect(() => {
    saveNotificationsFlag(notificationsFlags)
  }, [notificationsFlags])

  const refreshNotifications = () => {
    dispatch(notificationsActions.resetNotificationFlag(id))
    setItems(notifications[id] ?? [])
  }

  const handleRemoveAll = () => {
    dispatch(notificationsActions.setItems({}))
    dispatch(notificationsActions.resetNotificationFlag({}))
    saveNotifications({})
    saveNotificationsFlag({})
    setItems([])
  }

  const handleCancelClick = () => {
    navigate(-1)
  }

  const columns: ColumnsKitGridType = [
    {
      headerName: 'نوع هشدار',
      field: 'type',
      width: 300,
      valueFormatter: (p) => p.value ? eventTypesUtil.filter(event => event.value == p.value)[0].label : '',
    },
    {
      headerName: 'پیام',
      field: 'messageFa',
      width: 300,
      valueFormatter: (p) => {
        return p.data.attributes?.messageFa ?? ''
      },
    },
    {
      headerName: 'زمان ثبت',
      field: 'eventTime',
      valueFormatter: (p) => formatTime(p.value, 'seconds', hours12),
    },
  ]

  const renderNotifications = useCallback(() => {
    if (items.length <= 0) {
      return <div className={styles.notificationItemEmpty}><span>لیست اعلان ها خالی است</span></div>
    }else{
      return items.map((item, index) => {
        const type = item.type ? eventTypesUtil.filter(event => event.value == item.type)[0].label : ''
        const message = item.attributes?.messageFa ?? ''
        const eventTime = formatTime(item?.eventTime, 'seconds', hours12)
        return <Card id={index} className={styles.notificationItem} title={type}>
          <div className={styles.messageItem}>
            <span className={styles.message}>{message}</span>
          </div>
          <div className={styles.eventTimeItem}>
            <span className={styles.eventTime}>{eventTime}</span>
          </div>
        </Card>
      })
    }
  }, [items])

  return <div className={styles.notificationDevice}>
    <div className={styles.notificationDeviceContainer}>
      <div className={styles.notificationDeviceWrapper}>
        <div className={styles.notificationItems}>
          {renderNotifications()}
          {/*<KitGrid isSizeColumnFit={true} containerClassName={styles.notificationItemsWrapper} dataSource={items}*/}
          {/*         columns={columns} loading={loading} />*/}
        </div>
        <div className={styles.actionsWrapper}>
          <div className={styles.actions}>
            <Button
              type="button"
              title={'بستن'}
              onClick={handleCancelClick}
              className={cls(styles.button, styles.cancelButton, 'btn-primary-outline')}
              titleClassName={cls(styles.label, styles.cancelLabel)} />
            <Button
              type="button"
              title={'حذف همه'}
              onClick={handleRemoveAll}
              disabled={items.length <= 0}
              className={cls(styles.button, styles.DeleteButton, 'btn-danger')}
              titleClassName={cls(styles.label, styles.deleteLabel)} />
            <Button
              type="button"
              title={'بروز رسانی'}
              onClick={refreshNotifications}
              disabled={notificationsFlags[id] != true}
              className={cls(
                styles.button,
                styles.registerButton,
                'btn-primary',
              )}
              titleClassName={cls(styles.label, styles.registerLabel)}
            />

          </div>
        </div>
      </div>
    </div>
  </div>
}

export default NotificationDevice
