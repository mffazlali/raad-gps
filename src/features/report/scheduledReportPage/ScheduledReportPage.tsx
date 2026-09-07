import {useNavigate} from 'react-router-dom'
import styles from '../ReportsCommon.module.css'
import cls from 'classnames'
import useMessage from '../../../common/util/useMessage.tsx'
import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import {usePreference} from '../../../common/util/preferences'
import {useEffectAsync} from '../../../common/util/reactHelper'
import PageWrapper from '../../../common/components/custom/feedback/pageWrapper/PageWrapper.tsx'
import {useTranslation} from '../../../common/components/LocalizationProvider'
import {ColumnsKitGridType} from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGridType.ts'
import KitGrid from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGrid.tsx'
import axios from 'axios'
import axiosInstance from '../../../common/util/axiosConfig.ts'

const TYPE = {
  events: 'رویداد ها',
  route: 'مسیر های پیموده شده',
  summary: 'خلاصه وضعیت',
  trips: 'مسافرتها',
  stops: 'توقفها',
}
const ScheduledReportPage = () => {
  const navigate = useNavigate()
  const {contextHolder, showMessage} = useMessage()
  const hours12 = usePreference('twelveHourFormat')
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const calendars = useSelector((state) => Object(state).calendars.items)
  const [timestamp, setTimestamp] = useState(Date.now())
  const [removingId, setRemovingId] = useState()
  const t = useTranslation()

  useEffectAsync(async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get('/api/reports')
      if (response.status === 200) {
        setItems(response.data)
      } else {
        throw Error(response.data)
      }
    } catch (e: any) {
      if (e.message === 'Failed to fetch') {
        showMessage({message: t('responseConnectAPI'), type: 'error', duration: 2, key: 'save'})
      } else {
        // showMessage({message: t('responseErrorAPI'), type: 'error', duration: 2, key: 'save'})
      }
    } finally {
      setLoading(false)
    }
  }, [timestamp])

  const columns: ColumnsKitGridType = [
    {
      headerName: 'نوع خط',
      field: 'type',
      valueFormatter: (p) => Object(TYPE)[p.value] ?? '',
    },
    {
      headerName: 'توضیحات',
      field: 'description',
      valueFormatter: (p) => p.value,
    },
    {
      headerName: 'تقویم',
      field: 'calendarId',
      valueFormatter: (p) => calendars[p.value].name,
    },
  ]

  const handleChangeTable = (selectedRowKeys: React.Key[], selectedRows: any[]) => {
    console.log('handleChangeTable', {selectedRowKeys, selectedRows})
  }
  const handleSelectTable = (record: any, selected: boolean, selectedRows: any[]) => {
    console.log('handleSelectTable', {record, selected, selectedRows})
  }

  return (
    <>
      {contextHolder}
      <PageWrapper>
        <div className={styles.report}>
          <div className={styles.reportContainer}>
            <KitGrid containerClassName={styles.gridContainer} dataSource={items} columns={columns} loading={loading} />
          </div>
        </div>
      </PageWrapper>
    </>
  )
}

export default ScheduledReportPage
