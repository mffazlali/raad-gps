import {useNavigate} from 'react-router-dom'
import styles from '../SettingsCommon.module.css'
import cls from 'classnames'
import useMessage from '../../../common/util/useMessage.tsx'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useCatch} from '../../../common/util/reactHelper'
import Button from '../../../common/components/custom/general/button/Button.tsx'
import PageWrapper from '../../../common/components/custom/feedback/pageWrapper/PageWrapper.tsx'
import {ColumnsKitGridType} from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGridType.ts'
import KitGrid from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGrid.tsx'
import KitPopconfirm from '../../../common/components/uiKits/feeback/kitPopconfirm/KitPopconfirm.tsx'
import {useTranslation} from '../../../common/components/LocalizationProvider'
import KitFileUploader from '../../../common/components/uiKits/dataEntry/kitFileUploader/KitFileUploader.tsx'
import MapView from '../../../common/map/core/MapView'
import MapCurrentLocation from '../../../common/map/MapCurrentLocation'
import MapGeocoder from '../../../common/map/geocoder/MapGeocoder'
import MapGeofenceEdit from '../../../common/map/draw/MapGeofenceEdit'
import {RcFile} from 'antd/es/upload'
import axiosInstance from '../../../common/util/axiosConfig.ts'
import {useGeofences, useDeleteGeofence} from '../../../common/serverStore'
import {geofencesActions} from '../../../common/clientStore'

const readonly = false

const Geofences = () => {
  const t = useTranslation()
  const navigate = useNavigate()
  const {contextHolder, showMessage} = useMessage()
  const permissions = useSelector((state: any) => state.session.permissions)
  const [items, setItems] = useState<any[]>([])
  const [selectedGeofenceId, setSelectedGeofenceId] = useState<any>()
  const currentUser = useSelector((state: any) => state?.session?.user)
  const {data: geofences = [], isLoading: isLoadingGeofences, isFetching} = useGeofences(currentUser.id)
  const deleteGeofence = useDeleteGeofence()
  const dispatch = useDispatch()

  useEffect(() => {
    if (geofences) {
      setItems(geofences)
      dispatch(geofencesActions.refresh(geofences))
    }
  }, [geofences])

  const handleFile = (event: RcFile) => {
    const type = ((event.name) as String).split('.').includes('gpx')
    if (!type) {
      showMessage({message: 'نوع فایل gpx انتخاب نشده است', type: 'error', duration: 2, key: 'save'})
    } else {
      try {
        const file = event
        const reader = new FileReader()
        reader.onload = async () => {
          const xml = new DOMParser().parseFromString(reader?.result as any, 'text/xml')
          const segment = xml.getElementsByTagName('trkseg')[0]
          const coordinates = Array.from(segment.getElementsByTagName('trkpt'))
            .map((point) => `${point.getAttribute('lat')} ${point.getAttribute('lon')}`)
            .join(', ')
          const area = `LINESTRING (${coordinates})`
          const newItem = {name: '', area}
          try {
            const response = await axiosInstance.post('/api/geofences', newItem)
            if (response.status === 200) {
              const item = response.data
              navigate(`/settings/geofences/geofence/${item.id}`)
            } else {
              showMessage({message: t('responseWarningAPI'), type: 'error', duration: 2, key: 'save'})
              throw Error(response.data)
            }
          } catch (error: any) {
            showMessage({message: error?.response?.data?.message, type: 'error', duration: 2, key: 'save'})
          }
        }

        reader.onerror = (event) => {
          showMessage({message: 'خطا در خواندن فایل', type: 'error', duration: 2, key: 'save'})
        }
        reader.readAsText(file)
      } catch (e) {
        showMessage({message: 'خطا در خواندن فایل', type: 'error', duration: 2, key: 'save'})
      }
    }
  }

  const cellRender = (params: any) => {
    return <div className={styles.actionsGrid}>
      {permissions.includes('Geofence-update') && <button
        onClick={() => {
          navigate(`/settings/geofences/geofence/${params.data.id}`)
        }}
        type="button"
        className={cls(styles.editAction, 'fa fa-edit')}
        title={'ویرایش'}>
      </button>}
      {permissions.includes('Geofence-delete') && <KitPopconfirm
        title="عملیات حذف"
        description="آیا از حذف حصار انتخاب شده اطمینان دارید؟"
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
      valueFormatter: (p) => p.value,
    },
    {
      headerName: 'عملیات',
      field: 'button',
      pinned: 'left',
      cellRenderer: cellRender,
      hide: !(permissions.includes('Geofence-update')) && !(permissions.includes('Geofence-delete')),
    },
  ]

  const handleRemove = useCatch(async (itemId) => {
    try {
      await deleteGeofence.mutateAsync(itemId)
    } catch (e) {
      showMessage({message: e?.response?.data?.message, type: 'error', duration: 2, key: 'save'})
    }
  })

  return (
    <>
      {contextHolder}
      <PageWrapper>
        <div className={styles.settings}>
          <div className={styles.settingsContainer}>
            <div className={styles.rowWrapper}>
              <div className={styles.mapWrapper}>
                <MapView>
                  <MapGeofenceEdit selectedGeofenceId={selectedGeofenceId} />
                </MapView>
                {/*<MapCurrentLocation />*/}
                {/*<MapGeocoder />*/}
              </div>
              <div className={styles.gridWrapper}>
                <div className={styles.wrapperButtons}>
                  {/*<Button*/}
                  {/*  type="button"*/}
                  {/*  title={'افزودن'}*/}
                  {/*  onClick={() => navigate('/settings/geofences/geofence')}*/}
                  {/*  className={cls(*/}
                  {/*    styles.button,*/}
                  {/*    'btn-primary',*/}
                  {/*  )}*/}
                  {/*  titleClassName={styles.text} />*/}
                  {/*<KitFileUploader name="file" title="انتخاب فایل"*/}
                  {/*                 multiple={false}*/}
                  {/*  // onChange={(e) => handleFile(e as any)}*/}
                  {/*                 beforeUpload={(e) => {*/}
                  {/*                   handleFile(e.target.value)*/}
                  {/*                   return true*/}
                  {/*                 }}*/}
                  {/*                 maxCount={1}*/}
                  {/*                 accept={'.gpx'} />*/}
                </div>
                <KitGrid containerClassName={'h-[100%] relative'} dataSource={items} columns={columns}
                         loading={isFetching}
                         onSelectionChange={(event) => setSelectedGeofenceId(String(event['id']))}
                         isPagination={false} />
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  )
}

export default Geofences
