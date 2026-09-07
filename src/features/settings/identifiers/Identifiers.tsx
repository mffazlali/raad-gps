import {useNavigate} from 'react-router-dom'
import styles from '../SettingsCommon.module.css'
import cls from 'classnames'
import useMessage from '../../../common/util/useMessage.tsx'
import React, {useEffect, useState} from 'react'
import {useDeviceReadonly} from '../../../common/util/permissions'
import {useSelector} from 'react-redux'
import {usePreference} from '../../../common/util/preferences'
import {useCatch} from '../../../common/util/reactHelper'
import Button from '../../../common/components/custom/general/button/Button.tsx'
import PageWrapper from '../../../common/components/custom/feedback/pageWrapper/PageWrapper.tsx'
import {ColumnsKitGridType} from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGridType.ts'
import KitGrid from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGrid.tsx'
import KitPopconfirm from '../../../common/components/uiKits/feeback/kitPopconfirm/KitPopconfirm.tsx'
import {useTranslation} from '../../../common/components/LocalizationProvider'
import axios from 'axios'
import axiosInstance from '../../../common/util/axiosConfig.ts'
import useModalMessage from '../../../common/util/useModalMessage.tsx'
import KitFileUploader from '../../../common/components/uiKits/dataEntry/kitFileUploader/KitFileUploader.tsx'
import {useIdentifiers, useDeleteIdentifier} from '../../../common/serverStore/useIdentifier.ts'
import ReportCard from '../../../common/components/custom/feedback/card/ReportCard.tsx'
import Toolbar from '../../../common/components/custom/general/toolbar/Toolbar.tsx'

const readonly = false

const Identifiers = () => {
  const t = useTranslation()
  const navigate = useNavigate()
  const {contextHolder, showMessage} = useMessage()
  const permissions = useSelector((state: any) => state.session.permissions)
  const hours12 = usePreference('twelveHourFormat')
  const deviceReadonly = useDeviceReadonly()
  const [items, setItems] = useState<any[]>([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const {showModalMessage} = useModalMessage()

  const {data: identifiers = [], isLoading, isFetching} = useIdentifiers()
  const deleteIdentifier = useDeleteIdentifier()

  useEffect(() => {
    if (identifiers) {
      setItems(identifiers)
    }
  }, [identifiers])

  const cellRender = (params: any) => {
    return <div className={styles.actionsGrid}>
      {permissions.includes('Imei-update') && <button
        onClick={() => {
          navigate(`/settings/identifiers/identifier/${params.data.id}`)
        }}
        type="button"
        className={cls(styles.editAction, 'fa fa-edit')}
        title={'ویرایش'}>
      </button>}
      {permissions.includes('Imei-delete') && <KitPopconfirm
        title="عملیات حذف"
        description="آیا از حذف شناسه انتخاب شده اطمینان دارید؟"
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
      field: 'company',
    },
    {
      headerName: 'شناسه دستگاه',
      field: 'uniqueId',
    },
    {
      headerName: 'عملیات',
      field: 'button',
      // pinned: 'left',
      cellRenderer: cellRender,
      hide: !(permissions.includes('Imei-update')) && !(permissions.includes('Imei-delete')),
    },
  ]

  const handleRemove = useCatch(async (itemId) => {
    try {
      await deleteIdentifier.mutateAsync(itemId)
    } catch (e) {
      showMessage({message: 'امکان حذف شناسه وجود ندارد', type: 'error', duration: 2, key: 'save'})
    }
  })

  const uploadFile = async (options) => {
    const {onSuccess, onError, file, onProgress} = options
    const fileTypes = ((file.name) as String).split('.')
    const type = fileTypes.includes('xls') || fileTypes.includes('xlsx')
    if (!type) {
      showMessage({message: 'نوع فایل اکسل انتخاب نشده است', type: 'error', duration: 2, key: 'save'})
    } else {
      try {
        const data = await file.arrayBuffer()
        // const blob = new Blob([new Uint8Array(data)], {type: file.type})
        const blob = new Blob([new Uint8Array(data)], {type: 'text/plain'})
        // const jsonData = excelToJson(data).map(item => {
        //   return {uniqueId: item[0]}
        // })
        const formData = new FormData()
        formData.append('file', blob)
        const response = await axiosInstance.post(`/api/imei/bulk`, formData)
        if (response.status === 200) {
          const result = response.data
          if (result && Object.keys(result).includes('message')) {
            const message = result['message']
            const devices = Array(result['devices']).join(', ')
            showModalMessage({message: devices, title: message, type: 'error'})
            return
          }
          showMessage({message: t('responseSuccessAPI'), type: 'success', duration: 2, key: 'save'})
        } else {
          showMessage({message: t('responseWarningAPI'), type: 'error', duration: 2, key: 'save'})
          // throw Error(await response.text())
        }
      } catch (e) {
        showMessage({message: t('responseErrorAPI'), type: 'error', duration: 2, key: 'save'})
      }
    }
  }

  return (
    <>
      {contextHolder}
      <PageWrapper>
        <div className={styles.settings}>
          <div id="identifiersContainer" className={styles.settingsContainer}>
            <Toolbar>
              {permissions.includes('Imei-persist') && <div className={'flex flex-row gap-1'}>
                <Button
                  type="button"
                  title={'افزودن'}
                  onClick={() => navigate('/settings/identifiers/identifier')}
                  className={cls(
                    styles.button,
                    'btn-primary',
                  )}
                  fontClassName={'fa fa-add'}
                  titleClassName={styles.text} />
              </div>}
            </Toolbar>
            <ReportCard
              containerId="identifiersContainer"
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

export default Identifiers
