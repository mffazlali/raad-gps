import moment from 'moment-jalaali'

export const getCurrentDateTime = () => {
  const today = new Date()
  const date = today.toLocaleDateString('fa-IR')
  let hour = today.getHours().toString()
  let minute = today.getMinutes().toString()
  let second = today.getSeconds().toString()
  hour = +hour < 10 ? `0${hour}` : hour
  minute = +minute < 10 ? `0${minute}` : minute
  second = +second < 10 ? `0${second}` : second
  const time = `${hour}:${minute}:${second}`
  return {date, time}
}

export const isExpired = (expirationTime, timestamp) => {
  if (!expirationTime) return false
  const timestampMoment = moment(timestamp, 'jYYYY-jMM-jDD HH:mm:ss')
  const expirationTimeMoment = moment(expirationTime, 'jYYYY-jMM-jDD HH:mm:ss')
  return expirationTimeMoment.isBefore(timestampMoment)
}

export const toJalaliMoment = (dateTimeString) => {
  return moment(dateTimeString, 'jYYYY-jMM-jDD HH:mm:ss')
}


