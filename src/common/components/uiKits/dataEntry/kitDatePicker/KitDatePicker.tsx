import React, {useLayoutEffect} from 'react'
import {useEffect, useState} from 'react'
import cls from 'classnames'
import {KitDatePickerType} from './KitDatePickerType.ts'
import moment from 'moment-jalaali'
import dayjs from 'dayjs'
import 'moment/locale/fa.js'

import DatePicker, {DateObject} from 'react-multi-date-picker'
import DatePanel from 'react-multi-date-picker/plugins/date_panel'
import Toolbar from 'react-multi-date-picker/plugins/toolbar'
import Button from 'react-multi-date-picker/components/button'
import InputIcon from 'react-multi-date-picker/components/input_icon'
import Icon from 'react-multi-date-picker/components/icon'


// import transition from "react-element-popper/animations/transition"
// import opacity from "react-element-popper/animations/opacity"
import 'react-multi-date-picker/styles/layouts/prime.css'
import 'react-multi-date-picker/styles/layouts/mobile.css'
import 'react-multi-date-picker/styles/colors/green.css'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import 'react-multi-date-picker/styles/layouts/prime.css'
import TimePicker from 'react-multi-date-picker/plugins/time_picker'
import useMobileQuery from '../../../../util/useMobileQuery'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import {toJalaliMoment} from '../../../../util/DateTimeUtil'

dayjs.extend(duration)
dayjs.extend(relativeTime)


const dateFormat = 'YYYY/MM/DD'
const dateTimeFormat = 'YYYY/MM/DD HH:mm:ss'
const yearFormat = 'YYYY'

const convertShamsiToMiladi = (value: string) => {
  let m = moment(value, 'jYYYY/jM/jD HH:mm')
  return (m.locale('en').format())
}

const convertMiladiToShamsi = (value: string) => {
  let m = moment(value, 'YYYY/MM/DD HH:mm')
  return (m.locale('fa').format())
}

const KitDatePicker = (props: KitDatePickerType) => {
  const [dateValue, setDateValue] = useState<Date | any | undefined>()
  const [portalTarget, setPortalTaget] = useState<any>()
  const {mobileState, handleQuery} = useMobileQuery()

  useLayoutEffect(() => {
    handleQuery()
  }, [])

  useEffect(() => {
    const portalDiv = document.createElement('div')
    portalDiv.id = 'myPortalDiv'
    document.body.appendChild(portalDiv)
    setPortalTaget(portalDiv)
    return () => {
      document.body.removeChild(portalDiv)
    }

  }, [])

  useEffect(() => {
    if (props.value && props.value != '') {
      if (props.shamsiDefaultValue) {
        const shamsiToMilady = toJalaliMoment(props.value).locale('en')
        const netDate = new Date(shamsiToMilady.format('YYYY-MM-DD HH:mm:ss'))
        setDateValue(netDate)
      } else {
        setDateValue(new Date(String(props.value)))
      }
    }
  }, [props.value])

  const getInputType = () => {
    switch (props.inputType) {
      case 'icon':
        return <Icon />
      case 'inputIcon':
        return <InputIcon />
      case 'button':
        return <Button />
      case 'custom':
        return props.inputRender
      default:
        return undefined
    }
  }

  return <div key={props.id} style={{direction: 'rtl'}} className={props.classname}>
    <DatePicker
      disableDayPicker={props.disabled}
      render={getInputType()}
      range={props.range as any}
      id={props.name} name={props.name}
      calendar={persian}
      locale={persian_fa}
      arrow={true}
      portal
      // portalTarget={portalTarget}
      style={props.style}
      containerStyle={{
        width: '100%',
      }}
      calendarPosition="bottom-center"
      plugins={props.dateMode === 'datetime' ? props.range ? [
        <DatePanel />,
        <TimePicker position="bottom" />,
        // <Toolbar
        //   position="bottom"
        // />,
      ] : [
        <TimePicker position="bottom" />,
        // <Toolbar
        //   position="bottom"
        // />,
      ] : []}
      className={cls(mobileState ? 'rmdp-mobile' : 'rmdp-prime', 'green')}
      mobileLabels={{
        OK: 'تایید',
        CANCEL: 'بستن',
      }}
      mobileButtons={[{
        label: 'پاک کردن',
        className: 'rmdp-button rmdp-action-button',
        onClick: () => {
          setDateValue(null)
          let result: any = {
            target: {
              type: '',
              name: props.name,
              value: '',
              id: props.name,
            },
          }
          if (props.onChange)
            props.onChange(result)
        },
      }]}
      // calendarPosition="bottom-right"
      inputClass={cls('custom-input' as any)}
      placeholder={props.placeholder}
      disabled={props.disabled}
      showOtherDays
      format={!props.picker ? props.dateMode === 'datetime' ? dateTimeFormat : dateFormat : yearFormat}
      value={dateValue}
      onChange={(e: any) => {
        if (props.range) {
          const dates = [...(e as any)]
          setDateValue(e)
          if (dates.length >= 2) {
            let from = dates[0]?.toDate().toISOString()
            let to = dates[1]?.toDate().toISOString()

            // Compare dates using dayjs
            const fromDate = dayjs(from)
            const toDate = dayjs(to)
            const isFromGreater = fromDate.isAfter(toDate)
            if (isFromGreater) {
              const temp = from
              from = to
              to = temp
            }

            let result: any = {
              target: {
                type: '',
                name: props.name,
                value: e ? !props.picker ? {
                  from,
                  to,
                  isFromGreater,
                } : {
                  from: String((moment(from).get(props.picker))),
                  to: String((moment(to).get(props.picker))),
                  isFromGreater,
                } : e,
                id: props.name,
              },
            }
            if (props.onChange)
              props.onChange(result)
          } else {
            let from = null
            if (dates.length >= 1) {
              from = dates[0]?.toDate().toISOString()
            }
            let to = null

            // Compare dates using dayjs
            const fromDate = dates.length >= 1 ? dayjs(from) : null
            const toDate = null
            let result: any = {
              target: {
                type: '',
                name: props.name,
                value: {
                  from,
                  to,
                },
                id: props.name,
              },
            }
            if (props.onChangeInValid)
              props.onChangeInValid(result)
          }
        } else {
          if (e.isValid) {
            let date = ''
            if (!props.picker) {
              if (props.shamsiDefaultValue) {
                date = dayjs(e.toDate().toISOString()).format('YYYY-MM-DD HH:mm:ss')
              } else {
                date = e.toDate().toISOString()
              }
            } else {
              if (props.shamsiDefaultValue) {
                date = String((moment(date).get(props.picker)))
              } else {
                date = String((moment(date).get(props.picker)))
              }
            }
            let result: any = {
              target: {
                type: '',
                name: props.name,
                value: e ? date : e,
                id: props.name,
              },
            }
            setDateValue(e.toDate())
            if (props.onChange)
              props.onChange(result)
          }
        }
      }
      }
    />
  </div>
}

export default KitDatePicker
