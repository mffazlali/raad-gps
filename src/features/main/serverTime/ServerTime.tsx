import styles from './ServerTime.module.css'
import {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import moment from 'moment-jalaali'
import {toJalaliMoment} from '../../../common/util/DateTimeUtil'


const ServerTime = ({time}: any) => {
  const timestamp = useSelector((state: any) => state.session.timestamp)
  const [dateTime, setDateTime] = useState({date: '', time: ''})

  useEffect(() => {
    const tempMoment = toJalaliMoment(timestamp)
    const date = tempMoment.format('jYYYY-jMM-jDD ')
    const time = tempMoment.format('HH:mm:ss')
    setDateTime({date, time})
  }, [timestamp])

  return <div className={styles.serverTime}>
    <div className={styles.serverTimeContainer}>
      <span className={styles.timeValue}>{dateTime.date}</span>
      <span className={styles.timeSeperate}>|</span>
      <span className={styles.timeValue}>{dateTime.time}</span>
    </div>
  </div>
}

export default ServerTime
