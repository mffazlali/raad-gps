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
import {
  CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import {formatDistance, formatHours, formatSpeed, formatTime, formatVolume} from '../../../common/util/formatter'
import usePositionAttributes from '../../../common/attributes/usePositionAttributes'
import {useTranslation} from '../../../common/components/LocalizationProvider'
import {altitudeFromMeters, distanceFromMeters, speedFromKnots, volumeFromLiters} from '../../../common/util/converter'
import {preoids, chartTypes} from '../../../common/util/constants'
import SpinnerContainer from '../../../common/components/custom/feedback/spinnerContainer/SpinnerContainer.tsx'
import axios from 'axios'
import axiosInstance from '../../../common/util/axiosConfig.ts'
import {useDevices} from '../../../common/serverStore'
import Collapse from '../../../common/components/custom/feedback/collapse/Collapse.tsx'
import ReportCard from '../../../common/components/custom/feedback/card/ReportCard.tsx'
import usePeriodChange from '../../../common/util/usePeriodChange.tsx'
import moment from 'moment-jalaali'
import dayjs from 'dayjs'
import 'moment/locale/fa.js'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import {toJalaliMoment} from '../../../common/util/DateTimeUtil'

dayjs.extend(duration)
dayjs.extend(relativeTime)

const ChartReportPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {contextHolder, showMessage} = useMessage()
  const deviceId = useSelector((state) => Object(state).devices.selectedId)
  const period = useSelector((state) => Object(state).reports.period)
  const from = useSelector((state) => Object(state).reports.from)
  const to = useSelector((state) => Object(state).reports.to)
  const distanceUnit = useAttributePreference('distanceUnit')
  const altitudeUnit = useAttributePreference('altitudeUnit')
  const speedUnit = useAttributePreference('speedUnit')
  const volumeUnit = useAttributePreference('volumeUnit')
  const hours12 = usePreference('twelveHourFormat')
  const [items, setItems] = useState<any[]>([])
  const [routeitems, setRouteItems] = useState<any[]>([])
  const [ignitionitems, setIgnitionItems] = useState<any[]>([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [periodState, setPeriodState] = useState(period)
  const [types, setTypes] = useState<any>([{label: 'سرعت', value: 'speed'}])
  const [type, setType] = useState('speed')
  const currentUser = useSelector((state: any) => state?.session?.user)
  const {data: devices = []} = useDevices(currentUser?.id)
  const t = useTranslation()
  const {triggerPeriodChange} = usePeriodChange()
  const positionAttributes = usePositionAttributes(t)
  const [formatType, setFormatTime] = useState<any>('time')
  const values = items.map((it) => it[type])
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  const valueRange = maxValue - minValue

  const handleShow = useCatch(async (values: any, actions: FormikHelpers<any>) => {
    try {
      setLoading(true)
      const query = new URLSearchParams({deviceId: values.deviceId, from: values.from, to: values.to})

      const [chartResponse, ignitionResponse] = await Promise.all([
        axiosInstance.get(`/api/reports/chart-route?${query.toString()}`, {
          headers: {Accept: 'application/json'},
        }),
        axiosInstance.get(`/api/reports/ignitionondiagram?${query.toString()}`, {
          headers: {Accept: 'application/json'},
        }),
      ])

      let ignitionResult = []
      if (ignitionResponse.status === 200) {
        ignitionResult = ignitionResponse.data
        if (ignitionResult && ignitionResult.length > 0) {
          ignitionResult = ignitionResult.map(item => {
            return {
              fixTime: dayjs(item.deviceTime).valueOf(),
              ignitions: item.ignition,
            }
          })
          if (ignitionResult && Array.isArray(ignitionResult)) {
            setIgnitionItems(ignitionResult)
          }
        } else {
          if (type == 'ignitions') {
            showMessage({message: 'داده یافت نشد', type: 'info', duration: 2, key: 'save'})
          }
        }
      }

      if (chartResponse.status === 200) {
        const positions = chartResponse.data
        if (positions?.length > 0) {
          const keySet = new Set()
          const keyList: any[] = []
          const formattedPositions = positions.map((position: any) => {
            const data = {...position, ...position.attributes}
            const formatted: {} = {}
            Object(formatted)['fixTime'] = toJalaliMoment(position.fixTime).valueOf()
            Object.keys(data).filter((key) => !['id', 'deviceId', 'sat', 'satVisible', 'rssi', 'event', 'hours', 'power', 'accuracy', 'course'].includes(key)).forEach((key) => {
              const value = data[key]
              if (typeof value === 'number') {
                keySet.add(key)
                const definition = Object(positionAttributes)[key] || {}
                switch (definition.dataType) {
                  case 'speed':
                    Object(formatted)[key] = speedFromKnots(value, speedUnit).toFixed(2)
                    break
                  case 'altitude':
                    Object(formatted)[key] = altitudeFromMeters(value, altitudeUnit).toFixed(2)
                    break
                  case 'distance':
                    Object(formatted)[key] = distanceFromMeters(value, distanceUnit).toFixed(2)
                    break
                  case 'volume':
                    Object(formatted)[key] = volumeFromLiters(value, volumeUnit).toFixed(2)
                    break
                  case 'hours':
                    Object(formatted)[key] = (value / 1000).toFixed(2)
                    break
                  default:
                    Object(formatted)[key] = value
                    break
                }
              }
            })
            return formatted
          })
          Object.keys(positionAttributes).forEach((key) => {
            if (keySet.has(key)) {
              keyList.push(key)
              keySet.delete(key)
            }
          })
          const combineList = ([...keyList, ...keySet])
          setLoading(false)
          setRouteItems(formattedPositions)
          showMessage({message: t('responsePreWaitingAPI'), type: 'info', duration: 0.5, key: 'save'})
          if (type != 'ignitions') {
            setItems(formattedPositions)
          } else {
            setItems(ignitionResult)
          }
        } else {
          if (type != 'ignitions') {
            showMessage({message: 'داده یافت نشد', type: 'info', duration: 2, key: 'save'})
          }
        }
        setLoading(false)
      }
    } catch (e: any) {
      if (e.message === 'Failed to fetch') {
        showMessage({message: t('responseConnectAPI'), type: 'error', duration: 2, key: 'save'})
      } else {
        showMessage({message: 'داده یافت نشد', type: 'info', duration: 2, key: 'save'})
      }
    }
  })

  const {form} = useForm({
    formGroup: {
      'deviceId': {value: null, validations: [{'required': 'وارد کردن دستگاه الزامی است'}]},
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
    form.setFieldValue('deviceId', deviceId)
    form.setFieldValue('from', from)
    form.setFieldValue('to', to)
    let tmpTypes = chartTypes.filter((item) => ['speed', 'altitude', 'ignitions'].includes(item?.value))
    setTypes(tmpTypes)
    setType('speed')
  }

  const handlePeriodChange = (period: any) => {
    setPeriodState(period)
    const {selectedFrom, selectedTo} = triggerPeriodChange(period)
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
        <div id="reportContainer" className={styles.report}>
          <div className={styles.reportContainer}>
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
                                     name="deviceId" direction={'col'}>
                      <KitSelect placeholder="دستگاه ها" name="deviceId"
                                 optionLabel={'name'}
                                 optionValue={'id'}
                                 options={devices}
                                 allowClear={true}
                                 showSearch={true}
                                 onChange={(e) => {
                                   form.setFieldValue('deviceId', e)
                                   dispatch(devicesActions.selectId(e))
                                 }}
                                 onClear={() => {
                                   form.setFieldValue('deviceId', '')
                                   dispatch(devicesActions.selectId(null))
                                 }}
                                 value={form.values.deviceId}
                                 classname={'w-[90%]'}
                                 status={form.errors.deviceId ? 'error' : ''} />
                    </KitInputWrapper>
                    <KitInputError label={form.errors.deviceId} />
                  </div>
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
                    <KitInputWrapper label="نوع نمودار" required={false}
                                     name="period" direction={'col'}>
                      <KitSelect placeholder="نوع نمودار" name="period"
                                 options={types}
                                 allowClear={false}
                                 showSearch={true}
                                 disabled={false}
                                 value={type as any}
                                 onChange={(e) => {
                                   if (items.length > 0) {
                                     setLoading(true)
                                     setTimeout(() => {
                                       setLoading(false)
                                     }, 50)
                                   }
                                   const value = e as any
                                   setType(value)
                                   if (value != type) {
                                     if (value == 'ignitions') {
                                       const valuesTemp = ignitionitems.map((it) => it[type])
                                       const minValueTemp = Math.min(...valuesTemp)
                                       const maxValueTemp = Math.max(...valuesTemp)
                                       setFormatTime('date')
                                       setItems(ignitionitems)
                                     } else {
                                       const valuesTemp = routeitems.map((it) => it[type])
                                       const minValueTemp = Math.min(...valuesTemp)
                                       const maxValueTemp = Math.max(...valuesTemp)
                                       setFormatTime('time')
                                       setItems(routeitems)
                                     }
                                   }
                                 }}
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
                                         classname={'w-[90%]'} />
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
                                         classname={'w-[90%]'} />
                        </KitInputWrapper>
                      </div>
                    </>
                  }
                </div>
                <div className={styles.actions}>
                  <Button
                    type="submit"
                    title={'نمایش'}
                    loading={false}
                    className={cls(
                      styles.button,
                      styles.registerButton,
                      'btn-primary',
                    )}
                    titleClassName={cls(styles.label, styles.registerLabel)}
                    fontClassName={'fa fa-magnifying-glass'}
                    disabled={!form.isValid}
                  />
                </div>
              </form>
            </Collapse>
            <ReportCard
              containerId="reportContainer"
              isLoading={loading}
              className={'h-[360px]'}
              chartContent={
                <div className={'w-full h-full flex justify-center'}>
                  {loading && <SpinnerContainer className={'!w-full !h-full'} />}
                  {!loading && <LineChart
                    data={items}
                    width={800} height={400}
                    margin={{
                      top: 10, right: 40, left: 0, bottom: 10,
                    }}
                  >
                    {<XAxis
                      dataKey="fixTime"
                      type="number"
                      tickFormatter={(value) => formatTime(value, formatType, hours12,false)}
                      domain={['dataMin', 'dataMax']}
                      scale={'time'}
                    />}
                    {formatType == 'time' ? <YAxis
                      type="number"
                      tickFormatter={(value) => value.toFixed(2)}
                      domain={[minValue - valueRange / 5, maxValue + valueRange / 5]}
                    /> : <YAxis
                      type="category"
                    />}
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip
                      formatter={(value, key) => {
                        return [value, Object(positionAttributes)[key]?.name || key]
                      }}
                      labelFormatter={(value) => formatTime(value, formatType == 'time' ? 'seconds' : 'date', hours12,false)}
                    />
                    <Line type="monotone" dataKey={type} />
                  </LineChart>}
                </div>
              }
            />
          </div>
        </div>
      </PageWrapper>
    </>
  )
}

export default ChartReportPage
