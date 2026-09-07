import {useNavigate} from 'react-router-dom'
import styles from '../ReportsCommon.module.css'
import cls from 'classnames'
import useMessage from '../../../common/util/useMessage.tsx'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useCatch, useEffectAsync} from '../../../common/util/reactHelper'
import Button from '../../../common/components/custom/general/button/Button.tsx'
import {devicesActions, reportsActions, usersActions} from '../../../common/clientStore'
import PageWrapper from '../../../common/components/custom/feedback/pageWrapper/PageWrapper.tsx'
import {ColumnsKitGridType} from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGridType.ts'
import KitGrid from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGrid.tsx'
import {formatTime} from '../../../common/util/formatter'
import {usePreference} from '../../../common/util/preferences'
import {useTranslation} from '../../../common/components/LocalizationProvider'
import KitInputWrapper from '../../../common/components/uiKits/dataEntry/kitInputWrapper/KitInputWrapper.tsx'
import KitSelect from '../../../common/components/uiKits/dataEntry/kitSelect/KitSelect.tsx'
import KitInputError from '../../../common/components/uiKits/dataEntry/kitInputError/KitInputError.tsx'
import {preoids} from '../../../common/util/constants'
import KitDatePicker from '../../../common/components/uiKits/dataEntry/kitDatePicker/KitDatePicker.tsx'
import useForm from '../../../common/util/useForm.tsx'
import axiosInstance from '../../../common/util/axiosConfig.ts'
import Collapse from '../../../common/components/custom/feedback/collapse/Collapse.tsx'
import ReportCard from '../../../common/components/custom/feedback/card/ReportCard.tsx'

const LoginHistory = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {contextHolder, showMessage} = useMessage()
  const usersLoginHistory = useSelector((state: any) => state.users.loginHistoryItems)
  const [timestamp, setTimestamp] = useState(Date.now())
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const t = useTranslation()
  const hours12 = usePreference('twelveHourFormat')
  const currentUser = useSelector((state: any) => state?.session?.user)

  const {form} = useForm({
    formGroup: {
      'deviceIds': {value: '', validations: []},
      'from': {value: '', validations: []},
      'to': {value: '', validations: []},
    },
    handleSubmit: async (values: any) => {
      try {
        setLoading(true)
        const response = await axiosInstance.get('/api/reports/loginhistory')
        if (response.status === 200) {
          dispatch(usersActions.refreshLoginHistory(response.data))
          setLoading(false)
        } else {
          setLoading(false)
          throw Error(response.data)
        }
      } catch (e) {
        setLoading(false)
      }
    },
    isInitialValid: true,
  })

  useEffect(() => {
    let usersMap = Object.entries(usersLoginHistory).map((value) => {
      return value[1]
    })
    setItems(usersMap)
  }, [usersLoginHistory])

  useEffectAsync(async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/api/reports/loginhistory')
      if (response.status === 200) {
        dispatch(usersActions.refreshLoginHistory(response.data))
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
      headerName: 'زمان ورود',
      field: 'loginTime',
      valueFormatter: (f) => formatTime(f.value, 'seconds', hours12),
    },
    {
      headerName: 'آدرس ip',
      field: 'ipAddress',
    },
    {
      headerName: 'وضعیت ورود',
      field: 'loginStatus',
      valueFormatter: (p) => p.value ? p.value == 'success' ? 'موفق' : 'ناموفق' : '',
    },
  ]

  return (
    <>
      {contextHolder}
      <PageWrapper>
        <div className={styles.report}>
          <div id="reportContainer" className={styles.reportContainer}>
            <ReportCard
              containerId="reportContainer"
              isLoading={loading}
              tableContent={
                <KitGrid
                  containerClassName={styles.gridContainer}
                  dataSource={items}
                  columns={columns}
                  loading={loading}
                />
              }
            />
          </div>
        </div>
      </PageWrapper>
    </>
  )
}

export default LoginHistory
