import React from 'react'
import {useSelector} from 'react-redux'
import {Link} from '@mui/material'
import {Link as RouterLink} from 'react-router-dom'
import {
  formatAlarm,
  formatAltitude,
  formatBoolean,
  formatCoordinate,
  formatCourse,
  formatDistance,
  formatNumber,
  formatNumericHours,
  formatPercentage,
  formatSpeed,
  formatTime,
  formatTemperature,
  formatVoltage,
  formatVolume,
  formatConsumption,
} from '../util/formatter'
import {speedToKnots} from '../util/converter'
import {useAttributePreference, usePreference} from '../util/preferences'
import {useTranslation} from './LocalizationProvider'
import {useAdministrator} from '../util/permissions'
import GeofencesValue from './GeofencesValue'
import DriverValue from './DriverValue'
import {mapIcons, mapImageIcons} from '../map/core/preloadImages.js'
import AddressValue from './AddressValue'
import deviceCategories from '../util/deviceCategories.js'

const PositionValue = ({position, property, value, deviceId, addressOpen, setAddressOpen, setOptionToggle}) => {
  const t = useTranslation()

  const admin = useAdministrator()

  const distanceUnit = useAttributePreference('distanceUnit')
  const altitudeUnit = useAttributePreference('altitudeUnit')
  // const speedUnit = useAttributePreference('speedUnit')
  const speedUnit = 'kmh'
  const volumeUnit = useAttributePreference('volumeUnit')
  const coordinateFormat = usePreference('coordinateFormat')
  const hours12 = usePreference('twelveHourFormat')


  const formatValue = () => {
    if (position) {
      switch (property) {
        case 'fixTime':
        case 'deviceTime':
        case 'serverTime':
          return formatTime(value, 'seconds', hours12)
        case 'latitude':
          return formatCoordinate('latitude', value, coordinateFormat)
        case 'longitude':
          return formatCoordinate('longitude', value, coordinateFormat)
        case 'speed':
          return value != null ? formatSpeed(value, speedUnit, t) : ''
        case 'obdSpeed':
          return value != null
            ? formatSpeed(speedToKnots(value, 'kmh'), speedUnit, t)
            : ''
        case 'course':
          return formatCourse(value)
        case 'altitude':
          return formatAltitude(value, altitudeUnit, t)
        case 'power':
        case 'battery':
          return formatVoltage(value, t)
        case 'batteryLevel':
          return value != null ? formatPercentage(value, t) : ''
        case 'volume':
          return value != null ? formatVolume(value, volumeUnit, t) : ''
        case 'fuelConsumption':
          return value != null ? formatConsumption(value, t) : ''
        case 'coolantTemp':
          return formatTemperature(value)
        case 'alarm':
          return formatAlarm(value, t)
        case 'odometer':
        case 'serviceOdometer':
        case 'tripOdometer':
        case 'obdOdometer':
        case 'distance':
        case 'totalDistance':
          return value != null ? formatDistance(value, distanceUnit, t) : ''
        case 'hours':
          return value != null ? formatNumericHours(value, t) : ''
        case 'motion':
          return value == true ? 'در حال حرکت' : 'ثابت'
        case 'ignition':
          return value == true ? 'روشن' : 'خاموش'
        case 'status':
          return value == 'online' ? 'آنلاین' : 'آفلاین'
        case 'image':
          return <img src={Object({...mapIcons, ...mapImageIcons})[value]} className={'w-[55px] h-[55px]'} alt={''} />
        case 'digitalInput':
        case 'digitalOutput':
          return value === true ? 'فعال' : 'غیر فعال'
        case 'category':
          const categoriesFilter = deviceCategories.filter(category => category.id == value)
          if (categoriesFilter.length > 0) {
            return categoriesFilter[0].name
          }
          return ''
        case 'address':
          return value ? <AddressValue deviceId={deviceId} latitude={value.latitude} longitude={value.longitude}
                                       addressOpen={addressOpen} setAddressOpen={setAddressOpen}
                                       setOptionToggle={setOptionToggle} /> : null
        default:
          if (typeof value === 'number') {
            return formatNumber(value)
          }
          if (typeof value === 'boolean') {
            return formatBoolean(value, t)
          }
          return value || ''
      }
    } else {
      switch (property) {
        case 'status':
          return value == 'online' ? 'آنلاین' : 'آفلاین'
        case 'category':
          const categoriesFilter = deviceCategories.filter(category => category.id == value)
          if (categoriesFilter.length > 0) {
            return categoriesFilter[0].name
          }
          return ''
        case 'image':
          return <img src={mapIcons[value]} alt={''} />
        case 'address':
          return <AddressValue deviceId={deviceId} latitude={value.latitude} longitude={value.longitude}
                               addressOpen={addressOpen} setAddressOpen={setAddressOpen}
                               setOptionToggle={setOptionToggle} />
        default:
          if (typeof value === 'number') {
            return formatNumber(value)
          }
          if (typeof value === 'boolean') {
            return formatBoolean(value, t)
          }
          return value || ''
      }
    }
  }

  return formatValue()
}

export default PositionValue
