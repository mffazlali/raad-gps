import {useNavigate} from 'react-router-dom'
import styles from '../SettingsCommon.module.css'
import cls from 'classnames'
import useMessage from '../../../common/util/useMessage.tsx'
import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useAttributePreference} from '../../../common/util/preferences'
import {useCatch} from '../../../common/util/reactHelper'
import Button from '../../../common/components/custom/general/button/Button.tsx'
import PageWrapper from '../../../common/components/custom/feedback/pageWrapper/PageWrapper.tsx'
import {ColumnsKitGridType} from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGridType.ts'
import KitGrid from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGrid.tsx'
import KitPopconfirm from '../../../common/components/uiKits/feeback/kitPopconfirm/KitPopconfirm.tsx'
import {useTranslation} from '../../../common/components/LocalizationProvider'
import usePositionAttributes from '../../../common/attributes/usePositionAttributes'
import {formatDistance, formatSpeed} from '../../../common/util/formatter'
import {prefixString} from '../../../common/util/stringUtils'
import {useMaintenances, useDeleteMaintenance} from '../../../common/serverStore/useMaintenance.ts'
import ReportCard from '../../../common/components/custom/feedback/card/ReportCard.tsx'
import Toolbar from '../../../common/components/custom/general/toolbar/Toolbar.tsx'

const readonly = false

const Maintenances = () => {
  const navigate = useNavigate()
  const {contextHolder, showMessage} = useMessage()
  const permissions = useSelector((state: any) => state.session.permissions)
  const [items, setItems] = useState<any[]>([])
  const t = useTranslation()
  const positionAttributes: any = usePositionAttributes(t)
  const speedUnit = useAttributePreference('speedUnit')
  const distanceUnit = useAttributePreference('distanceUnit')
  const currentUser = useSelector((state: any) => state?.session?.user)
  const {data: maintenances = [], isLoading, isFetching} = useMaintenances(currentUser.id)
  const deleteMaintenance = useDeleteMaintenance()

  useEffect(() => {
    if (maintenances) {
      let maintenancesMap = maintenances.map((value: any) => {
        return {
          ...value,
          start: convertAttribute(value.type, value.start),
          period: convertAttribute(value.type, value.period),
        }
      })
      setItems(maintenancesMap)
    }
  }, [maintenances])

  const convertAttribute = (key: any, value: any) => {
    const attribute = positionAttributes[key]
    if (attribute && attribute?.dataType) {
      switch (attribute.dataType) {
        case 'speed':
          return formatSpeed(value, speedUnit, t)
        case 'distance':
          return formatDistance(value, distanceUnit, t)
        default:
          return value
      }
    }
    return value
  }

  const cellRender = (params: any) => {
    return <div className={styles.actionsGrid}>
      {permissions.includes('Maintenance-update') && <button
        onClick={() => {
          navigate(`/settings/maintenances/maintenance/${params.data.id}`)
        }}
        type="button"
        className={cls(styles.editAction, 'fa fa-edit')}
        title={'ویرایش'}>
      </button>}
      {permissions.includes('Maintenance-delete') && <KitPopconfirm
        title="عملیات حذف"
        description="آیا از حذف داده انتخاب شده اطمینان دارید؟"
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
      headerName: 'نوع خط',
      field: 'type',
      valueFormatter: (p) => p.value ? t(prefixString('position', p.value)) : '',
    },
    {
      headerName: 'شروع',
      field: 'start',
      valueFormatter: (p) => String(p.value ?? ''),
    },
    {
      headerName: 'بازه',
      field: 'period',
      valueFormatter: (p) => String(p.value ?? ''),
    },
    {
      headerName: 'عملیات',
      field: 'button',
      pinned: 'left',
      cellRenderer: cellRender,
      hide: !(permissions.includes('Maintenance-update')) && !(permissions.includes('Maintenance-delete')),
    },
  ]

  const handleRemove = useCatch(async (itemId) => {
    try {
      await deleteMaintenance.mutateAsync(itemId)
    } catch (e) {
      showMessage({message: e?.response?.data?.message, type: 'error', duration: 2, key: 'save'})
    }
  })

  return (
    <>
      {contextHolder}
      <PageWrapper>
        <div className={styles.settings}>
          <div id="maintenancesContainer" className={styles.settingsContainer}>
            <Toolbar>
              {permissions.includes('Maintenance-persist') && <Button
                type="button"
                title={'افزودن'}
                onClick={() => navigate('/settings/maintenances/maintenance')}
                className={cls(
                  styles.button,
                  'btn-primary',
                )}
                fontClassName={'fa fa-add'}
                titleClassName={styles.text} />}
            </Toolbar>
            <ReportCard
              containerId="maintenancesContainer"
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

export default Maintenances
