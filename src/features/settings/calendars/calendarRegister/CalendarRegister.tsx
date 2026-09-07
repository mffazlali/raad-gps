import {useNavigate, useParams} from 'react-router-dom'
import styles from '../../SettingsCommon.module.css'
import cls from 'classnames'
import {useCatch, useEffectAsync} from '../../../../common/util/reactHelper'
import useForm from '../../../../common/util/useForm.tsx'
import KitInputWrapper from '../../../../common/components/uiKits/dataEntry/kitInputWrapper/KitInputWrapper.tsx'
import KitInputText from '../../../../common/components/uiKits/dataEntry/kitInputText/KitInputText.tsx'
import KitInputError from '../../../../common/components/uiKits/dataEntry/kitInputError/KitInputError.tsx'
import React, {useEffect, useState} from 'react'
import useMessage from '../../../../common/util/useMessage.tsx'
import Button from '../../../../common/components/custom/general/button/Button.tsx'
import {FormikHelpers} from 'formik'
import Card from '../../../../common/components/custom/dataDisplay/card/Card.tsx'
import EditAttributes from '../../../components/editAttributes/EditAttributes.tsx'
import {RcFile, UploadChangeParam} from 'antd/es/upload'
import KitSelect from '../../../../common/components/uiKits/dataEntry/kitSelect/KitSelect.tsx'
import KitDatePicker from '../../../../common/components/uiKits/dataEntry/kitDatePicker/KitDatePicker.tsx'
import KitFileUploader from '../../../../common/components/uiKits/dataEntry/kitFileUploader/KitFileUploader.tsx'
import moment from 'moment-jalaali'
import {useTranslation} from '../../../../common/components/LocalizationProvider'
import ActionsButton from '../../../../common/components/custom/general/actionsButton/ActionsButton.tsx'
import {useCalendar, useCreateCalendar, useUpdateCalendar} from '../../../../common/serverStore/useCalendar.ts'

const formatCalendarTime = (time: any) => {
  const tzid = Intl.DateTimeFormat().resolvedOptions().timeZone
  return `TZID=${tzid}:${time}`
}

const parseRule = (rule: any) => {
  if (rule.endsWith('COUNT=1')) {
    return {frequency: 'ONCE'}
  }
  const fragments = rule.split(';')
  const frequency = fragments[0].substring(11)
  const by = fragments.length > 1 ? fragments[1].split('=')[1].split(',') : null
  return {frequency, by}
}

const formatRule = (rule: any) => {
  const by = rule?.by
  switch (rule.frequency) {
    case 'DAILY':
      return `RRULE:FREQ=${rule.frequency}`
    case 'WEEKLY':
      return `RRULE:FREQ=${rule.frequency};BYDAY=${by || 'SU'}`
    case 'MONTHLY':
      return `RRULE:FREQ=${rule.frequency};BYMONTHDAY=${by || 1}`
    default:
      return 'RRULE:FREQ=DAILY;COUNT=1'
  }
}

const simpleCalendar = () => window.btoa([
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Traccar//NONSGML Traccar//EN',
  'BEGIN:VEVENT',
  'UID:00000000-0000-0000-0000-000000000000',
  `DTSTART;${formatCalendarTime(moment().locale('en').format('YYYYMMDDTHHmmss'))}`,
  `DTEND;${formatCalendarTime(moment().add(1, 'hours').locale('en').format('YYYYMMDDTHHmmss'))}`,
  'RRULE:FREQ=DAILY',
  'SUMMARY:Event',
  'END:VEVENT',
  'END:VCALENDAR',
].join('\n'))
const simpleCalendar2 = () => ([
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Traccar//NONSGML Traccar//EN',
  'BEGIN:VEVENT',
  'UID:00000000-0000-0000-0000-000000000000',
  `DTSTART;${formatCalendarTime(moment().locale('en').format('YYYYMMDDTHHmmss'))}`,
  `DTEND;${formatCalendarTime(moment().add(1, 'hours').locale('en').format('YYYYMMDDTHHmmss'))}`,
  'RRULE:FREQ=DAILY',
  'SUMMARY:Event',
  'END:VEVENT',
  'END:VCALENDAR',
].join('\n'))

const calendarRecurrenceList = [
  {label: 'یکبار', value: 'ONCE'},
  {label: 'روزانه', value: 'DAILY'},
  {label: 'هفتگی', value: 'WEEKLY'},
  {label: 'ماهانه', value: 'MONTHLY'},
]

const calendarWeekList = [
  {label: 'یکشنبه', value: 'SU'},
  {label: 'دوشنبه', value: 'MO'},
  {label: 'سه شنبه', value: 'TU'},
  {label: 'چهارشنبه', value: 'WE'},
  {label: 'پنجشنبه', value: 'TH'},
  {label: 'جمعه', value: 'FR'},
  {label: 'شنبه', value: 'SA'},
]

const calendarDaysList = Array.from({length: 31}, (_, i) => i + 1).map((it) => {
  return {label: `${it}`, value: `${it}`}
})
const updateCalendarFn = (lines: any, index: any, element: any) => window.btoa(lines?.map((e: any, i: any) => (i !== index ? e : element)).join('\n'))


const CalendarRegister = ({setOpen}: {setOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const {id} = useParams()
  const navigate = useNavigate()
  const [loadingForm, setLoadingForm] = useState(!!id)
  const [disableForm, setDisableForm] = useState(false)
  const {contextHolder, showMessage} = useMessage()
  const [item, setItem] = useState<any>({
    sharedType: 'simple',
    reportFrom: '',
    reportTo: '',
    calendarRecurrence: '',
    calendarDays: '',
  })
  const t = useTranslation()

  const { data: calendarData, isLoading: isLoadingCalendar } = useCalendar(id ? Number(id) : undefined)
  const createCalendar = useCreateCalendar()
  const updateCalendar = useUpdateCalendar()

  const handleFiles = (event: UploadChangeParam<RcFile>) => {
    const typeActive = ((event.file.name) as String).split('.').includes('txt')
    if (!typeActive) {
      showMessage({message: 'نوع فایل gpx انتخاب نشده است', type: 'error', duration: 2, key: 'save'})
    } else {
      const files = event.fileList
      if (files && files.length > 0) {
        const file = event.file
        const reader = new FileReader()
        reader.onload = (event) => {
          const {result} = event!.target!
          form.setFieldValue('data', String(result).substr(String(result).indexOf(',') + 1))
        }
        reader.readAsDataURL(file)
      }
    }
  }

  useEffect(() => {
    if (calendarData) {
      setForm(calendarData)
      setLoadingForm(false)
    }
  }, [calendarData])

  useEffect(() => {
    if (!id) {
      form.setFieldValue('data', simpleCalendar())
    }
  }, [])

  const handleSave = useCatch(async (values: any, actions: FormikHelpers<any>) => {
    try {
      setDisableForm(true)
      if (id) {
        await updateCalendar.mutateAsync({ id: Number(id), calendar: values })
      } else {
        await createCalendar.mutateAsync(values)
      }
      setDisableForm(false)
      setOpen(false)
    } catch (e) {
      setDisableForm(false)
      showMessage({message: t('responseErrorAPI'), type: 'error', duration: 2, key: 'save'})
    }
  })

  const {form} = useForm({
    formGroup: {
      'name': {
        value: '',
        validations: [{required: 'وارد کردن نام الزامی است'}],
      },
      'data': {
        value: '',
        validations: [{required: 'وارد کردن داده الزامی است'}],
      },
    },
    handleSubmit: handleSave,
  })

  const [decoded, setDecoded] = useState<any>()
  const [simple, setSimple] = useState<any>()
  const [lines, setLines] = useState<any>()
  const [rule, setRule] = useState<any>()

  useEffect(() => {
    let tmpDecoded = form?.values?.data && window.atob(form?.values?.data)
    if (tmpDecoded)
      tmpDecoded = String(tmpDecoded).replace(/[\r]+/gm, '')
    const tmpSimple = tmpDecoded && tmpDecoded?.indexOf('//Traccar//') > 0
    const tmpLines = tmpDecoded && tmpDecoded.split('\n')
    const tmpRule = tmpSimple && parseRule(tmpLines[7])
    setDecoded(tmpDecoded)
    setSimple(tmpSimple)
    setLines(tmpLines)
    setRule(tmpRule)
    if (tmpDecoded && tmpSimple && tmpLines)
      updateItem(tmpDecoded, tmpSimple, tmpLines, tmpRule)
  }, [form?.values?.data])

  const updateItem = (decoded: any, simple: any, lines: any, rule: any) => {
    const tmpItem = {
      sharedType: item.sharedType != '' ? item.sharedType : (simple != undefined && simple != null && simple != '') ? simple ? 'simple' : 'custom' : 'simple',
      reportFrom: moment(lines[5].slice(-15)).locale('en').format('YYYYMMDDTHHmmss'),
      reportTo: moment(lines[6].slice(-15)).locale('en').format('YYYYMMDDTHHmmss'),
      calendarRecurrence: rule.frequency,
      calendarDays: rule.by,
    }
    setItem(tmpItem)
  }

  const setForm = (values: any) => {
    form.setValues(values)
  }

  const handleCancelClick = () => {
    navigate(-1)
  }

  return (
    <div className={styles.settingsRegister}>
      <div className={styles.settingsRegisterContainer}>
        {contextHolder}
        <form
          onSubmit={(e) => form.handleSubmit(e)}
          onChange={(e) => form.handleChange(e)}
          className={styles.form}
        >
          <div className={cls(styles.inputsWrapper)}>
            <Card title={'ضروری'} contentClassName={styles.inputs}>
              <div className={styles.input}>
                <KitInputWrapper label="نام" required={true} name="name" direction={'col'} loading={loadingForm}>
                  <KitInputText placeholder="نام" name="name"
                                onChange={(e) => form.handleChange(e)}
                                onBlur={(e) => form.handleBlur(e)}
                                value={form.values.name} status={form.errors.name ? 'error' : ''}
                                disabled={disableForm} maxLength={50} />
                </KitInputWrapper>
                <KitInputError label={form.errors.name} />
              </div>
              {/*<div className={styles.input}>*/}
              {/*  <KitInputWrapper label="نوع خط" required={false} name="sharedType" direction={'col'}*/}
              {/*                   loading={loadingForm}>*/}
              {/*    <KitSelect placeholder="نوع خط" name="sharedType"*/}
              {/*               optionLabel={'label'}*/}
              {/*               optionValue={'value'}*/}
              {/*               isDefaultOption={false}*/}
              {/*               options={[{label: 'ساده', value: 'simple'}, {label: 'سفارشی', value: 'custom'}]}*/}
              {/*               allowClear={true}*/}
              {/*               showSearch={true}*/}
              {/*               onChange={(e: any) => {*/}
              {/*                 const tmpItem = {...item, sharedType: ((e === 'simple') ? simpleCalendar() : '')}*/}
              {/*                 setItem({...tmpItem, sharedType: e})*/}
              {/*                 form.setFieldValue('data', tmpItem?.sharedType)*/}
              {/*               }}*/}
              {/*               onBlur={(e: any) => form.handleBlur(e)}*/}
              {/*               onSelect={(e: any) => {*/}
              {/*                 form.handleChange(e)*/}
              {/*               }}*/}
              {/*               value={item.sharedType}*/}
              {/*      // status={form.errors.sharedType ? 'error' : ''}*/}
              {/*               disabled={disableForm} />*/}
              {/*  </KitInputWrapper>*/}
              {/*  /!*<KitInputError label={form.errors.sharedType} />*!/*/}
              {/*</div>*/}
              {simple ? (<>
                  <div className={styles.input}>
                    <KitInputWrapper label="از تاریخ" required={false} name="reportFrom" direction={'col'}
                                     loading={loadingForm}>
                      <KitDatePicker placeholder="از تاریخ" name="reportFrom" value={item.reportFrom}
                                     onChange={(e: any) => {
                                       const time = formatCalendarTime(moment(e.target.value).locale('en').format('YYYYMMDDTHHmmss'))
                                       const tmpItem = {
                                         ...item,
                                         reportFrom: updateCalendarFn(lines, 5, `DTSTART;${time}`),
                                       }
                                       setItem({...tmpItem, reportFrom: e.target.value})
                                       form.setFieldValue('data', tmpItem?.reportFrom)
                                     }}
                                     onBlur={(e: any) => form.handleBlur(e)}
                        // status={form.errors.reportFrom ? 'error' : ''}
                                     dateMode={'datetime'}
                                     disabled={disableForm} />
                    </KitInputWrapper>
                    {/*<KitInputError label={form.errors.reportFrom} />*/}
                  </div>
                  <div className={styles.input}>
                    <KitInputWrapper label="تا تاریخ" required={false} name="reportTo" direction={'col'}
                                     loading={loadingForm}>
                      <KitDatePicker placeholder="تا تاریخ" name="reportTo" value={item.reportTo}
                                     onChange={(e: any) => {
                                       const time = formatCalendarTime(moment(e.target.value).locale('en').format('YYYYMMDDTHHmmss'))
                                       const tmpItem = {...item, reportTo: updateCalendarFn(lines, 6, `DTEND;${time}`)}
                                       setItem({...tmpItem, reportTo: e.target.value})
                                       form.setFieldValue('data', tmpItem?.reportTo)
                                     }}
                                     onBlur={(e: any) => form.handleBlur(e)}
                        // status={form.errors.reportTo ? 'error' : ''}

                                     dateMode={'datetime'}
                                     disabled={disableForm} />
                    </KitInputWrapper>
                    {/*<KitInputError label={form.errors.reportTo} />*/}
                  </div>
                  <div className={styles.input}>
                    <KitInputWrapper label="عکس العمل" required={false} name="calendarRecurrence" direction={'col'}
                                     loading={loadingForm}>
                      <KitSelect placeholder="عکس العمل" name="calendarRecurrence"
                                 optionLabel={'label'}
                                 optionValue={'value'}
                                 isDefaultOption={false}
                                 options={calendarRecurrenceList}
                                 allowClear={true}
                                 showSearch={true}
                                 onChange={(e: any) => {
                                   const tmpItem = {
                                     ...item,
                                     calendarRecurrence: updateCalendarFn(lines, 7, formatRule({frequency: e})),
                                   }
                                   setItem({...tmpItem, calendarRecurrence: e, calendarDays: ''})
                                   form.setFieldValue('data', tmpItem?.calendarRecurrence)
                                 }}
                                 onBlur={(e: any) => form.handleBlur(e)}
                                 onSelect={(e: any) => {
                                   form.handleChange(e)
                                 }}
                                 value={item.calendarRecurrence}
                        // status={form.errors.calendarRecurrence ? 'error' : ''}
                                 disabled={disableForm} />
                    </KitInputWrapper>
                    {/*<KitInputError label={form.errors.sharedType} />*/}
                  </div>
                  {rule && ['WEEKLY', 'MONTHLY'].includes(rule?.frequency) && (
                    <div className={styles.input}>
                      <KitInputWrapper label="روزها" required={false} name="calendarDays" direction={'col'}
                                       loading={loadingForm}>
                        <KitSelect placeholder="روزها" name="calendarDays"
                                   optionLabel={'label'}
                                   optionValue={'value'}
                                   isDefaultOption={false}
                                   options={rule.frequency === 'WEEKLY' ? calendarWeekList : calendarDaysList}
                                   allowClear={true}
                                   showSearch={true}
                                   onChange={(e: any) => {
                                     const tmpItem = {
                                       ...item,
                                       calendarDays: updateCalendarFn(lines, 7, formatRule({...rule, by: e})),
                                     }
                                     setItem({...tmpItem, calendarDays: e})
                                     form.setFieldValue('data', tmpItem?.calendarDays)
                                   }}
                                   onBlur={(e: any) => form.handleBlur(e)}
                                   onSelect={(e: any) => {
                                     form.handleChange(e)
                                   }}
                                   value={item.calendarDays}
                          // status={form.errors.calendarDays ? 'error' : ''}
                                   disabled={disableForm} />
                      </KitInputWrapper>
                      {/*<KitInputError label={form.errors.calendarDays} />*/}
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.input}>
                  <KitInputWrapper label="روزها" required={false} name="calendarDays" direction={'col'}
                                   loading={loadingForm}>
                    <KitFileUploader name="file" title="انتخاب فایل"
                                     multiple={false}
                                     accept={'.txt,.png'}
                                     onChange={(e) => handleFiles(e.target.value)}
                      // accept={'.gpx'}
                                     type={'dragger'}
                                     maxCount={1}
                    />
                  </KitInputWrapper>
                </div>
              )}
            </Card>
            {/*<EditAttributes loading={loadingForm} attributes={form?.values?.attributes ?? null}*/}
            {/*                setAttributes={(attributes: any) => {*/}
            {/*                  form.setValues({...form.values, attributes})*/}
            {/*                }} definitions={{}} />*/}
          </div>
          <ActionsButton
            onCancel={handleCancelClick}
            isSubmitDisabled={!form.isValid || disableForm || loadingForm}
            isLoading={disableForm}
            cancelText="لغو"
            submitText="ثبت"
          />
        </form>
      </div>
    </div>
  )
}

export default CalendarRegister
