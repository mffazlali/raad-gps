import {useNavigate} from 'react-router-dom'
import styles from '../SettingsCommon.module.css'
import cls from 'classnames'
import useMessage from '../../../common/util/useMessage.tsx'
import React, {useEffect, useState} from 'react'
import {useCatch} from '../../../common/util/reactHelper'
import Button from '../../../common/components/custom/general/button/Button.tsx'
import PageWrapper from '../../../common/components/custom/feedback/pageWrapper/PageWrapper.tsx'
import {ColumnsKitGridType} from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGridType.ts'
import KitGrid from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGrid.tsx'
import KitPopconfirm from '../../../common/components/uiKits/feeback/kitPopconfirm/KitPopconfirm.tsx'
import {prefixString, unprefixString} from '../../../common/util/stringUtils'
import {useTranslation, useTranslationKeys} from '../../../common/components/LocalizationProvider'
import {formatBoolean} from '../../../common/util/formatter'
import {eventTypes, eventTypes as eventTypesUtil} from '../../../common/util/constants.js'
import {useNotifications, useDeleteNotification} from '../../../common/serverStore/useNotification.ts'
import {useSelector} from 'react-redux'
import ReportCard from '../../../common/components/custom/feedback/card/ReportCard.tsx'
import Toolbar from '../../../common/components/custom/general/toolbar/Toolbar.tsx'

const readonly = false

const Notifications = () => {
  const t = useTranslation()
  const navigate = useNavigate()
  const {contextHolder, showMessage} = useMessage()
  const permissions = useSelector((state: any) => state.session.permissions)
  const [items, setItems] = useState<any[]>([])
  const [allEventTypes, setAllEventTypes] = useState<any>()
  const [searchKeyword, setSearchKeyword] = useState('')
  const currentUser = useSelector((state: any) => state?.session?.user)
  const {data: notifications = [], isLoading, isFetching} = useNotifications(currentUser.id)
  const deleteNotification = useDeleteNotification()

  const formatList = (prefix: any, value: any) => {
    if (value) {
      return String(value).split(',').map((it: any) => t(prefixString(prefix, it))).join('، ')
    }
    return ''
  }

  useEffect(() => {
    getTypes()
  }, [])

  useEffect(() => {
    if (notifications) {
      let eventsMap =notifications.map((value) => {
        return {
          ...value as any,
          alarms: formatList('alarm', Object(value).alarms),
          notificators: formatList('notificator', Object(value).notificators),
        }
      })
      setItems(eventsMap)
    }
  }, [notifications])

  const getTypes = async () => {
    const types = eventTypesUtil.filter((item: any) => {
      return (['alarm', 'deviceOnline', 'deviceOffline', 'deviceOverspeed', 'ignitionOn', 'ignitionOff', 'geofenceEnter', 'geofenceExit', 'slopeOfArm', 'digitalInput', 'digitalOutput'].includes(item?.value))
    })
    setAllEventTypes(types)
  }

  const cellRender = (params: any) => {
    return <div className={styles.actionsGrid}>
      {permissions.includes('Event-update') && <button
        onClick={() => {
          navigate(`/settings/notifications/notification/${params.data.id}`)
        }}
        type="button"
        className={cls(styles.editAction, 'fa fa-edit')}
        title={'ویرایش'}>
      </button>}
      {permissions.includes('Event-delete') && <KitPopconfirm
        title="عملیات حذف"
        description="آیا از حذف اعلان انتخاب شده اطمینان دارید؟"
        onConfirm={(e) => {
          handleRemove(params.data.id)
        }}
        onCancel={(e) => {
        }}
        okText="بلی"
        cancelText="خیر"
        placement={'right'}
      >
        <button
          type="button"
          className={cls(styles.deleteAction, 'fa fa-trash')}
          title={'حذف'}>
        </button>
      </KitPopconfirm>}
    </div>
  }

  const columns: ColumnsKitGridType = [
    {
      headerName: 'نوع خط',
      field: 'type',
      valueFormatter: (p) => {
        let result: string = ''
        if (p.value) {
          const filters: any[] = eventTypes.filter(event => event.value == p.value)
          if (filters.length > 0) {
            result = `${filters[0].label}`
          }
        }
        return result
      },
    },
    {
      headerName: 'همه ردیابها',
      field: 'always',
      valueFormatter: (p) => p.value ? t(formatBoolean(p.value, t)) : '',
    },
    {
      headerName: 'هشدارها',
      field: 'alarms',
      valueFormatter: (p) => {
        let result: string = ''
        const alarms = p.data.attributes.alarms
        if (alarms) {
          result = alarms.split(',').map(alarm => t(prefixString('alarm', alarm))).reduce((a, c) => `${a}, ${c}`)
        }
        return result
      },
    },
    {
      headerName: 'کانال ها',
      field: 'notificators',
      valueFormatter: (p) => p.value ? p.value : '',
    },
    {
      headerName: 'عملیات',
      field: 'button',
      pinned: 'left',
      cellRenderer: cellRender,
      hide: !(permissions.includes('Event-update')) && !(permissions.includes('Event-delete')),
    },
  ]

  const handleRemove = useCatch(async (itemId) => {
    try {
      await deleteNotification.mutateAsync(itemId)
    } catch (e) {
      showMessage({message: e?.response?.data?.message, type: 'error', duration: 2, key: 'save'})
    }
  })

  return (
    <>
      {contextHolder}
      <PageWrapper>
        <div className={styles.settings}>
          <div id="notificationsContainer" className={styles.settingsContainer}>
            <Toolbar>
              {permissions.includes('Event-persist') && <Button
                type="button"
                title={'افزودن'}
                onClick={() => navigate('/settings/notifications/notification')}
                className={cls(
                  styles.button,
                  'btn-primary',
                )}
                fontClassName={'fa fa-add'}
                titleClassName={styles.text} />}
            </Toolbar>
            <ReportCard
              containerId="notificationsContainer"
              isLoading={isFetching}
              tableContent={
                <KitGrid containerClassName={'h-[100%] relative'} dataSource={items} columns={columns}
                         loading={isFetching} />
              }
            />
          </div>
        </div>
      </PageWrapper>
    </>
  )
}

export default Notifications
