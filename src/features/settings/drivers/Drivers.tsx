import {useNavigate} from 'react-router-dom'
import styles from '../SettingsCommon.module.css'
import cls from 'classnames'
import useMessage from '../../../common/util/useMessage.tsx'
import React, {useEffect, useState} from 'react'
import {useDeviceReadonly} from '../../../common/util/permissions'
import {useDispatch, useSelector} from 'react-redux'
import {usePreference} from '../../../common/util/preferences'
import {useCatch} from '../../../common/util/reactHelper'
import Button from '../../../common/components/custom/general/button/Button.tsx'
import PageWrapper from '../../../common/components/custom/feedback/pageWrapper/PageWrapper.tsx'
import {ColumnsKitGridType} from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGridType.ts'
import KitGrid from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGrid.tsx'
import KitPopconfirm from '../../../common/components/uiKits/feeback/kitPopconfirm/KitPopconfirm.tsx'
import {useTranslation} from '../../../common/components/LocalizationProvider'
import {useDrivers, useDeleteDriver} from '../../../common/serverStore/useDriver.ts'
import {driversActions} from '../../../common/clientStore'
import ReportCard from '../../../common/components/custom/feedback/card/ReportCard.tsx'
import Toolbar from '../../../common/components/custom/general/toolbar/Toolbar.tsx'

const readonly = false

const Drivers = () => {
  const t = useTranslation()
  const navigate = useNavigate()
  const {contextHolder, showMessage} = useMessage()
  const permissions = useSelector((state: any) => state.session.permissions)
  const hours12 = usePreference('twelveHourFormat')
  const deviceReadonly = useDeviceReadonly()
  const [items, setItems] = useState<any[]>([])
  const currentUser = useSelector((state: any) => state?.session?.user)
  const {data: drivers = [], isLoading, isFetching} = useDrivers(currentUser.id) // Replace 1 with actual userId
  const deleteDriver = useDeleteDriver()
  const dispatch = useDispatch()

  useEffect(() => {
    if (drivers) {
      setItems(drivers)
      dispatch(driversActions.refresh(drivers))
    }
  }, [drivers])

  const cellRender = (params: any) => {
    return <div className={styles.actionsGrid}>
      {permissions.includes('Driver-update') && <button
        onClick={() => {
          navigate(`/settings/drivers/driver/${params.data.id}`)
        }}
        type="button"
        className={cls(styles.editAction, 'fa fa-edit')}
        title={'ویرایش'}>
      </button>}
      {permissions.includes('Driver-delete') && <KitPopconfirm
        title="عملیات حذف"
        description="آیا از حذف راننده انتخاب شده اطمینان دارید؟"
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
      headerName: 'نام',
      field: 'name',
    },
    {
      headerName: 'سریال دستگاه',
      field: 'uniqueId',
    },
    {
      headerName: 'عملیات',
      field: 'button',
      // pinned: 'left',
      cellRenderer: cellRender,
      hide: !(permissions.includes('Driver-update')) && !(permissions.includes('Driver-delete')),
    },
  ]

  const handleRemove = useCatch(async (itemId) => {
    try {
      await deleteDriver.mutateAsync(itemId)
    } catch (e) {
      showMessage({message: e?.response?.data?.message, type: 'error', duration: 2, key: 'save'})
    }
  })

  return (
    <>
      {contextHolder}
      <PageWrapper>
        <div className={styles.settings}>
          <div id="driversContainer" className={styles.settingsContainer}>
            <Toolbar>
              {permissions.includes('Driver-persist') && <Button
                type="button"
                title={'افزودن'}
                onClick={() => navigate('/settings/drivers/driver')}
                className={cls(
                  styles.button,
                  'btn-primary',
                )}
                fontClassName={'fa fa-add'}
                titleClassName={styles.text} />}
            </Toolbar>
            <ReportCard
              containerId="driversContainer"
              isLoading={isFetching}
              tableContent={
                <KitGrid 
                  containerClassName={'h-[100%] relative'} 
                  dataSource={items} 
                  columns={columns}
                  loading={isFetching} 
                />
              }
            />
          </div>
        </div>
      </PageWrapper>
    </>
  )
}

export default Drivers
