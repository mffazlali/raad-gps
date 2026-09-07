import {useNavigate} from 'react-router-dom'
import styles from '../ReportsCommon.module.css'
import cls from 'classnames'
import useMessage from '../../../common/util/useMessage.tsx'
import React, {useEffect, useRef, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {usePreference} from '../../../common/util/preferences'
import {useCatch, useEffectAsync} from '../../../common/util/reactHelper'
import Button from '../../../common/components/custom/general/button/Button.tsx'
import {devicesActions, reportsActions} from '../../../common/clientStore'
import PageWrapper from '../../../common/components/custom/feedback/pageWrapper/PageWrapper.tsx'
import KitInputWrapper from '../../../common/components/uiKits/dataEntry/kitInputWrapper/KitInputWrapper.tsx'
import KitInputError from '../../../common/components/uiKits/dataEntry/kitInputError/KitInputError.tsx'
import KitSelect from '../../../common/components/uiKits/dataEntry/kitSelect/KitSelect.tsx'
import KitDatePicker from '../../../common/components/uiKits/dataEntry/kitDatePicker/KitDatePicker.tsx'
import useForm from '../../../common/util/useForm.tsx'
import {FormikHelpers} from 'formik'
import {formatTime} from '../../../common/util/formatter'
import MapView from '../../../common/map/core/MapView'
import MapCamera from '../../../common/map/MapCamera'
import KitGrid from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGrid'
import {ColumnsKitGridType} from '../../../common/components/uiKits/dataDisplay/kitGrid/KitGridType.ts'
import {useTranslation} from '../../../common/components/LocalizationProvider'
import HeatMap from '../../../common/map/HeatMap'
import {mapValues, groupBy} from 'lodash'
import {preoids} from '../../../common/util/constants.js'
import SpinnerContainer from '../../../common/components/custom/feedback/spinnerContainer/SpinnerContainer.tsx'
import axiosInstance from '../../../common/util/axiosConfig.ts'
import {useDevices} from '../../../common/serverStore'
import Collapse from '../../../common/components/custom/feedback/collapse/Collapse.tsx'
import ReportCard from '../../../common/components/custom/feedback/card/ReportCard.tsx'
import usePeriodChange from '../../../common/util/usePeriodChange.tsx'

const EVENT_TIME = {
  ignitionOff: 'سوئیچ خاموش',
  ignitionOn: 'سوئیچ روشن',
  deviceStopped: 'دستگاه متوقف شد',
}

const HeatReportPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // const [meta, setMeta] = useMetaTags({title: 'راد: ورود', description: 'login user'})
  const {contextHolder, showMessage} = useMessage()
  const deviceIds = useSelector((state: any) => (state).devices.selectedIds)
  const groupIds = useSelector((state) => Object(state).reports.groupIds)
  const period = useSelector((state) => Object(state).reports.period)
  const from = useSelector((state) => Object(state).reports.from)
  const to = useSelector((state) => Object(state).reports.to)
  const hours12 = usePreference('twelveHourFormat')
  // const [items, setItems] = useState<any[]>([])
  const [heatData, setHeatData] = useState<any[][]>([])
  const [showResult, setShowResult] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [periodState, setPeriodState] = useState(period)
  const t = useTranslation()
  const {triggerPeriodChange} = usePeriodChange()
  const currentUser = useSelector((state: any) => state?.session?.user)
  const {data: devices = []} = useDevices(currentUser?.id)

  const handleShow = useCatch(async (values: any, actions: FormikHelpers<any>) => {
    const query = new URLSearchParams({deviceId: values.deviceIds, from: values['from'], to: values['to']})
    if (values['groupIds'] != null && values['groupIds'] != '') {
      [...values['groupIds']].forEach((groupId: any) => query.append('groupId', groupId))
    }
    setLoading(true)
    try {
      showMessage({message: t('responsePreWaitingAPI'), type: 'info', key: 'save'})
      const response = await axiosInstance.get(`/api/reports/heat-combined?${query}`)
      if (response.status === 200) {
        const res = response.data
        setShowResult(res)
        if (res && res.length > 0 && res[0].route.length > 0) {
          showMessage({message: t('responsePreWaitingAPI'), type: 'info', duration: 0.5, key: 'save'})
          const heatData = createHeatData(res)
          setHeatData(heatData)
          setLoading(false)
        } else {
          setHeatData([])
          showMessage({message: 'داده یافت نشد', type: 'info', duration: 2, key: 'save'})
          setLoading(false)
        }
      } else {
        setLoading(false)
        throw Error(response.data)
      }
    } catch (e: any) {
      setLoading(false)
      if (e.message === 'Failed to fetch') {
        showMessage({message: t('responseConnectAPI'), type: 'error', duration: 2, key: 'save'})
      } else {
        showMessage({message: 'داده یافت نشد', type: 'info', duration: 2, key: 'save'})
      }
    }
  })

  const {form} = useForm({
    formGroup: {
      'deviceIds': {value: '', validations: [{'required': 'وارد کردن دستگاه الزامی است'}]},
      'groupIds': {value: null, validations: []},
      'from': {value: '', validations: []},
      'to': {value: '', validations: []},
    },
    handleSubmit: handleShow,
    isInitialValid: false,
  })

  useEffect(() => {
    handlePeriodChange(period)
    initForm()
  }, [])

  const initForm = () => {
    form.setFieldValue('deviceIds', deviceIds)
    form.setFieldValue('groupIds', groupIds)
    form.setFieldValue('from', from)
    form.setFieldValue('to', to)
    handlePeriodChange(String(period))
  }

  const columns: ColumnsKitGridType = [
    {
      field: 'deviceId',
      headerName: 'دستگاه',
      valueFormatter: (f) => devices[f.value]?.name ?? null,
    },
    {
      field: 'eventTime',
      headerName: 'زمان ثابت',
      valueFormatter: (f) => formatTime(f.value, 'seconds', hours12),
    },
    {
      field: 'type',
      headerName: 'نوع خط',
      valueFormatter: (f) => Object(EVENT_TIME)[String(f.value)],
    },
  ]

  const createHeatData = (data: any) => {
    const result = data.map((item: any, idx: number) => {
      const positionsData = item.route.map((position: any) => ({
        latitude: position[0],
        longitude: position[1],
      }))
      const groupedPositions = mapValues(groupBy(positionsData, 'latitude'), e => groupBy(e, 'longitude'))
      const entries = Object.entries(groupedPositions).map(([label, value]) => {
        const values = Object.entries(value)
        return values.map(([label2, value2]) => {
          return {
            type: 'Feature',
            properties: {
              'mag': value2.length / 2,
            },
            geometry: {'type': 'Point', 'coordinates': [label, label2]},
          }
        })
      })
      if (entries && entries.length > 0) {
        return entries.reduce((a, c) => [...a, ...c])
      }
      return []
    })
    // showMessage({message: 'در حال بارگذاری', type: 'info', duration: 2, key: 'save'})
    return result
  }

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
                    type="submit"
                    title={'نمایش'}
                    className={cls(
                      styles.button,
                      styles.registerButton,
                      'btn-primary',
                    )}
                    titleClassName={cls(styles.label, styles.registerLabel)}
                    fontClassName={'fa fa-magnifying-glass'}
                    disabled={!form.isValid || loading}
                  />
                  {/*<Button*/}
                  {/*  type="button"*/}
                  {/*  onClick={handlePrint}*/}
                  {/*  title={'چاپ نقشه'}*/}
                  {/*  className={cls(*/}
                  {/*    styles.button,*/}
                  {/*    styles.registerButton,*/}
                  {/*    'btn-primary',*/}
                  {/*  )}*/}
                  {/*  titleClassName={cls(styles.label, styles.registerLabel)}*/}
                  {/*  disabled={!form.isValid || loading}*/}
                  {/*/>*/}
                </div>
              </form>
            </Collapse>
            <ReportCard
              containerId="reportContainer"
              isLoading={loading}
              className={'h-[400px]'}
              showMap={true}
              mapContent={
                <div className={cls(styles.containerMap, 'reportMap')}>
                  {loading && <SpinnerContainer />}
                  <MapView selectedMapStyle={'mapTilerBasic'} showStyles={false}>
                    {/*{heatData.map((item, index) => (*/}
                    {/*  <HeatMap*/}
                    {/*    key={String(index + 1)}*/}
                    {/*    heatData={item}*/}
                    {/*  />*/}
                    {/*))}*/}
                    {heatData.length > 0 && <HeatMap heatData={heatData[0]} />}
                  </MapView>
                  {loading && <MapCamera isFirstEnable={true} coordinates={showResult.flatMap((item) => item.route)} />}
                </div>

              }

            />
          </div>
        </div>
      </PageWrapper>
    </>
  )
}

export default HeatReportPage
