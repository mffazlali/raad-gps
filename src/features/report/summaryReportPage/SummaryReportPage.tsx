import {useNavigate} from 'react-router-dom'
import styles from '../ReportsCommon.module.css'
import cls from 'classnames'
import useMessage from '../../../common/util/useMessage.tsx'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useAttributePreference, usePreference} from '../../../common/util/preferences'
import {useCatch} from '../../../common/util/reactHelper'
import Button from '../../../common/components/custom/general/button/Button.tsx'
import {devicesActions, reportsActions} from '../../../common/clientStore'
import PageWrapper from '../../../common/components/custom/feedback/pageWrapper/PageWrapper.tsx'
import KitInputWrapper from '../../../common/components/uiKits/dataEntry/kitInputWrapper/KitInputWrapper.tsx'
import KitInputError from '../../../common/components/uiKits/dataEntry/kitInputError/KitInputError.tsx'
import KitSelect from '../../../common/components/uiKits/dataEntry/kitSelect/KitSelect.tsx'
import KitDatePicker from '../../../common/components/uiKits/dataEntry/kitDatePicker/KitDatePicker.tsx'
import useForm from '../../../common/util/useForm.tsx'
import {FormikHelpers} from 'formik'
import {formatDistance, formatHours, formatSpeed, formatTime, formatVolume} from '../../../common/util/formatter'
import {useTranslation} from '../../../common/components/LocalizationProvider'
import {ColumnsKitGridType} from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGridType.ts'
import KitGrid from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGrid.tsx'
import { preoids } from '../../../common/util/constants.js'
import axiosInstance from '../../../common/util/axiosConfig.ts'
import {useDevices} from '../../../common/serverStore'
import Collapse from '../../../common/components/custom/feedback/collapse/Collapse.tsx'
import ReportCard from '../../../common/components/custom/feedback/card/ReportCard.tsx'
import usePeriodChange from '../../../common/util/usePeriodChange.tsx'


const SummaryReportPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {contextHolder, showMessage} = useMessage()
  const deviceIds = useSelector((state) => Object(state).devices.selectedIds)
  const groupIds = useSelector((state) => Object(state).reports.groupIds)
  const period = useSelector((state) => Object(state).reports.period)
  const from = useSelector((state) => Object(state).reports.from)
  const to = useSelector((state) => Object(state).reports.to)
  const distanceUnit = useAttributePreference('distanceUnit')
  const speedUnit = useAttributePreference('speedUnit')
  const volumeUnit = useAttributePreference('volumeUnit')
  const hours12 = usePreference('twelveHourFormat')
  const [items, setItems] = useState<any[]>([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [periodState, setPeriodState] = useState(period)
  const [type, setType] = useState('')
  const t = useTranslation()
  const {triggerPeriodChange} = usePeriodChange()
  const currentUser = useSelector((state: any) => state?.session?.user)
  const {data: devices = []} = useDevices(currentUser?.id)

  const handleShow = useCatch(async (values: any, actions: FormikHelpers<any>) => {
    try {
      const query = new URLSearchParams({from: values.from, to: values.to, daily: values.daily})
      values.deviceIds.forEach((deviceId: any) => query.append('deviceId', deviceId))
      if (values.groupIds && values.groupIds.length)
        values.groupIds.forEach((groupId: any) => query.append('groupId', groupId))
      if (type === 'export') {
        window.location.assign(`/api/reports/summary/xlsx?${query.toString()}`)
      } else if (type === 'mail') {
        const response = await axiosInstance.get(`/api/reports/summary/mail?${query.toString()}`)
        if (response.status !== 200) {
          throw Error(response.data)
        }
      } else {
        setLoading(true)
        try {
          showMessage({message: t('responsePreWaitingAPI'), type: 'info', key: 'save'})
          const response = await axiosInstance.get(`/api/reports/summary?${query.toString()}`)
          if (response.status === 200) {
            setItems(response.data)
          } else {
            throw Error(response.data)
          }
        } finally {
          setLoading(false)
          showMessage({message: t('responsePreWaitingAPI'), type: 'info', duration: 0.5, key: 'save'})
        }
      }
    } catch (e: any) {
      if (e.message === 'Failed to fetch') {
        showMessage({message: t('responseConnectAPI'), type: 'error', duration: 2, key: 'save'})
      } else {
        // showMessage({message: t('responseErrorAPI'), type: 'error', duration: 2, key: 'save'})
      }
    }
  })

  const {form} = useForm({
    formGroup: {
      'deviceIds': {value: [], validations: [{'required': 'وارد کردن دستگاه الزامی است'}]},
      'groupIds': {value: [], validations: []},
      'daily': {value: null, validations: []},
      'from': {value: '', validations: []},
      'to': {value: '', validations: []},
    },
    handleSubmit: handleShow,
    isInitialValid: true,
  })

  useEffect(() => {
    handlePeriodChange(period)
    initForm()
  }, [])

  const initForm = () => {
    form.setFieldValue('deviceIds', deviceIds)
    form.setFieldValue('groupIds', groupIds)
    form.setFieldValue('daily', 'false')
    form.setFieldValue('from', from)
    form.setFieldValue('to', to)
  }

  const columns: ColumnsKitGridType = [
    {
      headerName: 'دستگاه',
      field: 'deviceId',
      valueFormatter: (p) => devices[p.value]?.name ?? null,
    },
    {
      headerName: 'زمان شروع',
      field: 'startTime',
      valueFormatter: (p) => formatTime(p.value, 'minutes', hours12),
    },
    {
      headerName: 'شروع کیلومترشمار',
      field: 'startOdometer',
      valueFormatter: (p) => formatDistance(p.value, distanceUnit, t),
    },
    {
      headerName: 'پایان کیلومتر شمار',
      field: 'endOdometer',
      valueFormatter: (p) => formatDistance(p.value, distanceUnit, t),
    },
    {
      headerName: 'طول مسیر',
      field: 'distance',
      valueFormatter: (p) => formatDistance(p.value, distanceUnit, t),
    },
    {
      headerName: 'میانگین سرعت',
      field: 'averageSpeed',
      valueFormatter: (p) => formatSpeed(p.value, speedUnit, t),
    },
    {
      headerName: 'حداکثر سرعت',
      field: 'maxSpeed',
      valueFormatter: (p) => formatSpeed(p.value, speedUnit, t),
    },
    {
      headerName: 'مصرف سوخت',
      field: 'spentFuel',
      valueFormatter: (p) => formatVolume(p.value, volumeUnit, t),
    },
    {
      headerName: 'مدت زمان روشن بودن وسیله',
      field: 'engineHours',
      valueFormatter: (p) => formatHours(p.value),
    },
  ]

  const handlePeriodChange = (period: any) => {
    setPeriodState(period)
    const {selectedFrom,selectedTo}=triggerPeriodChange(period)
    if (selectedFrom != null && selectedTo != null) {
      form.setFieldValue('from', selectedFrom ?? '')
      form.setFieldValue('to', selectedTo ?? '')
      dispatch(reportsActions.updateFrom(selectedFrom))
      dispatch(reportsActions.updateTo(selectedTo))
    } else {
      form.setFieldValue('from', '')
      form.setFieldValue('to', '')
      dispatch(reportsActions.updateFrom(''))
      dispatch(reportsActions.updateTo(''))
    }
  }


  return (
    <>
      {contextHolder}
      <PageWrapper>
        <div className={styles.report}>
          <div id="reportContainer" className={styles.reportContainer}>
            <Collapse
              header={<div>فیلترها</div>}
              fixedHeader={true}
              defaultOpen={true}>
              <form
                onSubmit={(e) => form.handleSubmit(e)}
                onChange={(e) => form.handleChange(e)}
                className={styles.form}
              >
                <div className={cls(styles.inputsWrapper)}>
                  <div className={styles.input}>
                    <KitInputWrapper label="دستگاه ها" required={true}
                                     name="deviceIds" direction={'col'}>
                      <KitSelect placeholder="دستگاه ها" name="deviceIds"
                                 optionLabel={'name'}
                                 optionValue={'id'}
                                 options={devices}
                                 mode={'multiple'}
                                 allowClear={true}
                                 showSearch={true}
                                 onChange={(e) => {
                                   form.setFieldValue('deviceIds', e)
                                   dispatch(devicesActions.selectIds(e))
                                 }}
                                 onBlur={(e) => form.handleBlur(e)}
                                 onSelect={(e) => {
                                   form.handleChange(e)
                                 }}
                                 value={form.values.deviceIds}
                                 classname={'w-[90%]'}
                                 status={form.errors.deviceIds ? 'error' : ''} />
                    </KitInputWrapper>
                    <KitInputError label={form.errors.deviceIds} />
                  </div>
                  {/*<div className={styles.input}>*/}
                  {/*  <KitInputWrapper label="گروه ها" required={false}*/}
                  {/*                   name="groupIds" direction={'col'}>*/}
                  {/*    <KitSelect placeholder="گروه ها" name="groupIds"*/}
                  {/*               optionLabel={'name'}*/}
                  {/*               optionValue={'id'}*/}
                  {/*               endpoint={'/api/groups'}*/}
                  {/*               mode={'multiple'}*/}
                  {/*               allowClear={true}*/}
                  {/*               showSearch={true}*/}
                  {/*               onChange={(e) => {*/}
                  {/*                 form.setFieldValue('groupIds', e)*/}
                  {/*                 dispatch(reportsActions.updateGroupIds(e))*/}
                  {/*               }}*/}
                  {/*               onBlur={(e) => form.handleBlur(e)}*/}
                  {/*               onSelect={(e) => {*/}
                  {/*                 form.handleChange(e)*/}
                  {/*               }}*/}
                  {/*               value={form.values.groupIds}*/}
                  {/*               classname={'w-[90%]'} />*/}
                  {/*  </KitInputWrapper>*/}
                  {/*</div>*/}
                  <div className={styles.input}>
                    <KitInputWrapper label="بازه" required={false}
                                     name="period" direction={'col'}>
                      <KitSelect placeholder="بازه" name="period"
                                 options={preoids}
                                 allowClear={false}
                                 showSearch={true}
                                 onChange={(e) => {
                                   dispatch(reportsActions.updatePeriod(String(e)))
                                   handlePeriodChange(e)
                                 }}
                                 value={period}
                                 classname={'w-[90%]'} />
                    </KitInputWrapper>
                  </div>
                  <div className={styles.input}>
                    <KitInputWrapper label="نوع خط" required={false}
                                     name="daily" direction={'col'}>
                      <KitSelect placeholder="نوع خط" name="daily"
                                 options={[
                                   {value: 'false', label: 'خلاصه وضعیت'},
                                   {value: 'true', label: 'وقایع روزانه'},
                                 ]}
                                 allowClear={false}
                                 showSearch={true}
                                 onChange={(e) => {
                                   form.setFieldValue('daily', e)
                                 }}
                                 value={form.values.daily}
                                 classname={'w-[90%]'} />
                    </KitInputWrapper>
                  </div>
                  {periodState == 7 &&
                    <>
                      <div className={styles.input}>
                        <KitInputWrapper label="از" required={false}
                                         name="from"
                                         direction={'col'}>
                          <KitDatePicker placeholder="از" name="from" value={form.values.from}
                                         onChange={(e) => {
                                           form.handleChange(e)
                                           dispatch(reportsActions.updateFrom(e.target.value))
                                         }}
                                         onBlur={(e) => form.handleBlur(e)}
                                         classname={'w-[90%]'}
                                         dateMode={'datetime'} />
                        </KitInputWrapper>
                      </div>
                      <div className={styles.input}>
                        <KitInputWrapper label="تا" required={false}
                                         name="to"
                                         direction={'col'}>
                          <KitDatePicker placeholder="تا" name="to" value={form.values.to}
                                         onChange={(e) => {
                                           form.handleChange(e)
                                           dispatch(reportsActions.updateTo(e.target.value))
                                         }}
                                         onBlur={(e) => form.handleBlur(e)}
                                         classname={'w-[90%]'}
                                         dateMode={'datetime'} />
                        </KitInputWrapper>
                      </div>
                    </>
                  }
                </div>
                <div className={styles.actions}>
                  <Button
                    type="button"
                    onClick={() => {
                      setType('')
                      form.submitForm()
                    }}
                    title={'نمایش'}
                    className={cls(
                      styles.button,
                      styles.registerButton,
                      'btn-primary',
                    )}
                    titleClassName={cls(styles.label, styles.registerLabel)}
                    fontClassName={'fa fa-magnifying-glass'}
                    disabled={!form.isValid} />
                  <Button
                    onClick={() => {
                      setType('export')
                      form.submitForm()
                    }}
                    type="button"
                    title={'خروجی فایل'}
                    className={cls(
                      styles.button,
                      styles.registerButton,
                      'btn-primary',
                    )}
                    titleClassName={cls(styles.label, styles.registerLabel)}
                    disabled={!form.isValid} />
                </div>
              </form>
            </Collapse>
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

export default SummaryReportPage
