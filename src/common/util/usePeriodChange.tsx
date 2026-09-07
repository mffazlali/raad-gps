import {useSelector} from 'react-redux'
import moment from 'moment-jalaali'
import 'moment/locale/fa.js'
import {Moment} from 'moment'

const usePeriodChange = () => {

  const timestamp = useSelector((state: any) => state.session.timestamp)

  const triggerPeriodChange = (period: any) => {
    let selectedFrom: Moment
    let selectedTo: Moment
    switch (period) {
      case '1':
        selectedFrom = moment(timestamp, 'jYYYY-jMM-jDD HH:mm:ss').startOf('day')
        selectedTo = moment(timestamp, 'jYYYY-jMM-jDD HH:mm:ss').endOf('day')
        break
      case '2':
        selectedFrom = moment(timestamp, 'jYYYY-jMM-jDD HH:mm:ss').subtract(1, 'day').startOf('day')
        selectedTo = moment(timestamp, 'jYYYY-jMM-jDD HH:mm:ss').subtract(1, 'day').endOf('day')
        break
      case '3':
        selectedFrom = moment(timestamp, 'jYYYY-jMM-jDD HH:mm:ss').startOf('week')
        selectedTo = moment(timestamp, 'jYYYY-jMM-jDD HH:mm:ss').endOf('week')
        break
      case '4':
        selectedFrom = moment(timestamp, 'jYYYY-jMM-jDD HH:mm:ss').subtract(1, 'week').startOf('week')
        selectedTo = moment(timestamp, 'jYYYY-jMM-jDD HH:mm:ss').subtract(1, 'week').endOf('week')
        break
      case '5':
        selectedFrom = moment(timestamp, 'jYYYY-jMM-jDD HH:mm:ss').startOf('month')
        selectedTo = moment(timestamp, 'jYYYY-jMM-jDD HH:mm:ss').endOf('month')
        break
      case '6':
        selectedFrom = moment(timestamp, 'jYYYY-jMM-jDD HH:mm:ss').subtract(1, 'month').startOf('month')
        selectedTo = moment(timestamp, 'jYYYY-jMM-jDD HH:mm:ss').subtract(1, 'month').endOf('month')
        break
      default:
        selectedFrom = null
        selectedTo = null
    }
    // console.log({from: selectedFrom?.format('jYYYY-jMM-jDD HH:mm:ss'),to:selectedTo?.format('jYYYY-jMM-jDD HH:mm:ss')})
    return {selectedFrom: selectedFrom?.toISOString() ?? '', selectedTo: selectedTo?.toISOString() ?? ''}
  }

  return {triggerPeriodChange}
}

export default usePeriodChange