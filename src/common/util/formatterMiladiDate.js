import moment from 'moment-jalaali'

export const formatTimeMiladi = (value, format, hours12) => {
  if (value) {
    const d = moment(value)
    switch (format) {
      case 'date':
        return d.locale('en').format('YYYY-MM-DD')
      case 'dateRaw':
        return d.locale('en').format('YYYYMMDDHHmmss')
      case 'time':
        return d.locale('en').format(hours12 ? 'hh:mm:ss A' : 'HH:mm:ss')
      case 'minutes':
        return d.locale('en').format(hours12 ? 'YYYY-MM-DD hh:mm A' : 'YYYY-MM-DD HH:mm')
      default:
        return d.locale('en').format(
          hours12 ? 'YYYY-MM-DD hh:mm:ss A' : 'YYYY-MM-DD HH:mm:ss',
        )
    }
  }
  return ''
}

