import {useNavigate} from 'react-router-dom'
import styles from '../SettingsCommon.module.css'
import cls from 'classnames'
import useMessage from '../../../common/util/useMessage.tsx'
import React, {useEffect, useState} from 'react'
import {useDeviceReadonly} from '../../../common/util/permissions'
import {useDispatch, useSelector} from 'react-redux'
import {usePreference} from '../../../common/util/preferences'
import {useCatch} from '../../../common/util/reactHelper'
import KitPopconfirm from '../../../common/components/uiKits/feeback/kitPopconfirm/KitPopconfirm.tsx'
import Button from '../../../common/components/custom/general/button/Button.tsx'
import PageWrapper from '../../../common/components/custom/feedback/pageWrapper/PageWrapper.tsx'
import {ColumnsKitGridType} from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGridType.ts'
import KitGrid from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGrid.tsx'
import {formatTime} from '../../../common/util/formatter'
import {useTranslation} from '../../../common/components/LocalizationProvider'
import {addSvgIcon} from '../../../common/map/core/mapUtil'
import KitFileUploader from '../../../common/components/uiKits/dataEntry/kitFileUploader/KitFileUploader.tsx'
import {RcFile} from 'antd/es/upload'
import axiosInstance from '../../../common/util/axiosConfig.ts'
import useModalMessage from '../../../common/util/useModalMessage.tsx'
import {useDevices, useDeleteDevice} from '../../../common/serverStore/useDevice.ts'
import {devicesActions} from '../../../common/clientStore/index.js'
import ReportCard from '../../../common/components/custom/feedback/card/ReportCard.tsx'
import Toolbar from '../../../common/components/custom/general/toolbar/Toolbar.tsx'

const Devices = () => {
  const t = useTranslation()
  const navigate = useNavigate()
  const {contextHolder, showMessage} = useMessage()
  const {showModalMessage} = useModalMessage()
  const currentUser = useSelector((state: any) => state?.session?.user)
  const permissions = useSelector((state: any) => state.session.permissions)
  const groups = useSelector((state) => Object(state).groups.items)
  const hours12 = usePreference('twelveHourFormat')
  const [timestamp, setTimestamp] = useState(Date.now())
  const [items, setItems] = useState<any[]>([])
  const [itemId, setItemId] = useState()
  const [searchKeyword, setSearchKeyword] = useState('')
  const [columns, setColumns] = useState<ColumnsKitGridType>([])
  const readonly = useDeviceReadonly()
  const dispatch = useDispatch()

  const {data: devices = [], isLoading, isFetching, dataUpdatedAt} = useDevices(currentUser.id)
  const deleteDevice = useDeleteDevice()

  useEffect(() => {
    if (devices) {
      setItems(devices)
      dispatch(devicesActions.refresh(devices))
    }
  }, [dataUpdatedAt])

  const cellRender = (params: any) => {
    return <div className={styles.actionsGrid}>
      {permissions.includes('Device-update') && <button
        onClick={() => {
          navigate(`/settings/devices/device/${params.data.id}`)
        }}
        type="button"
        className={cls(styles.editAction, 'fa fa-edit')}
        title={'ویرایش'}>
      </button>}
      {/*<button*/}
      {/*  onClick={() => {*/}
      {/*    navigate(`/settings/devices/device/${params.data.id}/connections`)*/}
      {/*  }}*/}
      {/*  type="button"*/}
      {/*  className={cls(styles.connectionsAction, 'fa fa-link')}*/}
      {/*  title={'اتصالات'}>*/}
      {/*</button>*/}
      {permissions.includes('Device-delete') && <KitPopconfirm
        title="عملیات حذف"
        description="آیا از حذف دستگاه انتخاب شده اطمینان دارید؟"
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

  const resetColumns = (deviceList: any[]) => {
    const keyColumns: ColumnsKitGridType = Object.keys(deviceList.map((item: any) => item?.attributes)?.reduce((a, c) => {
      return {...a, ...c}
    }))?.filter(item => !['deviceImage'].includes(item)).map(item => {
      return {
        headerName: t(`attribute${item.substring(0, 1).toUpperCase()}${item.substring(1)}`),
        field: item,
        valueFormatter: (p) => p.data.attributes[item],
      }
    })
    const tmpColumns: ColumnsKitGridType = [
      {
        headerName: 'نام',
        field: 'name',
      },
      {
        headerName: 'شناسه ردیاب',
        field: 'uniqueId',
      },
      {
        headerName: 'شماره سیم کارت ردیاب',
        field: 'phone',
      },
      {
        headerName: 'شماره شناسایی خودرو',
        field: 'identificationNumber',
      },
      {
        headerName: 'شماره موتور',
        field: 'enginNumber',
      },
      {
        headerName: 'رنگ',
        field: 'color',
        cellRenderer: (params: any) => <span
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '5px',
            width: '15px',
            height: '15px',
            backgroundColor: params.data.color,
          }}></span>,
      },
      {
        headerName: 'شماره پلاک',
        field: 'licensePlate',
      },
      {
        headerName: 'سال ساخت',
        field: 'productionYear',
      },
      {
        headerName: 'تاریخ انقضاء',
        field: 'expirationTime',
        valueFormatter: (p) => formatTime(p.value, 'seconds', hours12),
      },
      {
        headerName: 'عملیات',
        field: 'button',
        pinned: 'left',
        cellRenderer: cellRender,
        hide: !(permissions.includes('Device-update')) && !(permissions.includes('Device-delete')),
      },
    ]

    setColumns([...tmpColumns, ...keyColumns])
  }

  useEffect(() => {
    return () => {
      Object.values(devices || {}).forEach(async (device: any) => {
        let color = device?.color ? device.color : '#9e9e9e'
        if (color) {
          await addSvgIcon(`${device?.category}$`, color)
        }
      })
    }
  }, [devices])

  useEffect(() => {
    if (devices) {
      let deviceList = Object.entries(devices).map((value) => {
        return value[1]
      })
      if (deviceList && deviceList.length > 0) {
        resetColumns(deviceList)
        setItems(deviceList)
      }
    }
  }, [devices])

  const handleRemove = useCatch(async (id: any) => {
    try {
      await deleteDevice.mutateAsync(id)
    } catch (e) {
      showMessage({message: e?.response?.data?.message, type: 'error', duration: 2, key: 'save'})
    }
  })

  // const handleFile = (event: RcFile) => {
  //   const fileTypes = ((event.name) as String).split('.')
  //   const type = fileTypes.includes('xls') || fileTypes.includes('xlsx')
  //   if (!type) {
  //     showMessage({message: 'نوع فایل اکسل انتخاب نشده است', type: 'error', duration: 2, key: 'save'})
  //
  //   } else {
  //   }
  // }

  const uploadFile = async (options) => {
    const {onSuccess, onError, file, onProgress} = options
    const fileTypes = ((file.name) as String).split('.')
    const type = fileTypes.includes('xls') || fileTypes.includes('xlsx')
    if (!type) {
      showMessage({message: 'نوع فایل اکسل انتخاب نشده است', type: 'error', duration: 2, key: 'save'})
    } else {
      try {
        const data = await file.arrayBuffer()
        // const blob = new Blob([new Uint8Array(data)], {type: file.type });
        const blob = new Blob([new Uint8Array(data)], {type: 'text/plain'})
        // const jsonData = excelToJson(data)
        const formData = new FormData()
        formData.append('file', blob)
        // const response = await axiosInstance.get(`/api/devices/addDevicesFromExcel`, {
        //   method: 'POST',
        //   // headers: {
        //   //   'Content-Type': 'multipart/form-data',
        //   // },
        //   body: formData,
        // })
        const response = await axiosInstance.post(`/api/devices/addDevicesFromExcel`, formData)
        if (response.status === 200) {
          const result = response.data
          if (result && Object.keys(result).includes('message')) {
            const message = result['message']
            const devices = Array(result['devices']).join(', ')
            showModalMessage({message: devices, title: message, type: 'error'})
            return
          }
          setTimestamp(Date.now)
          showMessage({message: t('responseSuccessAPI'), type: 'success', duration: 2, key: 'save'})
        } else {
          showMessage({message: t('responseWarningAPI'), type: 'error', duration: 2, key: 'save'})
        }
      } catch (e) {
        showMessage({message: e?.response?.data?.message, type: 'error', duration: 2, key: 'save'})
      }
    }
  }

  return (
    <>
      {contextHolder}
      <PageWrapper>
        <div className={styles.settings}>
          <div id="devicesContainer" className={styles.settingsContainer}>
            <Toolbar>
              {permissions.includes('Device-persist') && <div className={'flex flex-row gap-1'}>
                <Button
                  type="button"
                  title={'افزودن'}
                  onClick={() => navigate('/settings/devices/device')}
                  className={cls(
                    styles.button,
                    'btn-primary',
                  )}
                  titleClassName={styles.text}
                  fontClassName={'fa fa-add'}
                />
                <KitFileUploader name="file" title="افزودن گروهی"
                               showUploadList={false}
                               multiple={false}
                               customRequest={uploadFile}
                               maxCount={1}
                               accept={'.xls,.xlsx'}
                />
              </div>}
            </Toolbar>
            <ReportCard
              containerId="devicesContainer"
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

export default Devices
